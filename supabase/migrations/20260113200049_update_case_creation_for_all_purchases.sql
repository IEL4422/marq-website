/*
  # Update Client Case Creation to Handle All Purchase Types

  1. Changes
    - Update the trigger function to create cases for ALL successful payments
    - Handle payments with agreements (traditional trademark packages)
    - Handle payments from office action requests
    - Handle payments from cease and desist requests
    - Handle payments from any other service type
    - Each successful payment creates exactly one client case

  2. Logic
    - When payment status becomes 'succeeded'
    - Check if a case already exists for this payment_id
    - If not, create a case based on the payment source:
      a) If agreement_id exists, use agreement data
      b) If linked to office_action_requests, use that data
      c) If linked to cease_and_desist_requests, use that data
      d) Otherwise, create a generic case from payment data

  3. Benefits
    - All successful purchases automatically get client cases
    - Staff portal shows unified view of all client matters
    - Proper tracking of all revenue-generating activities
*/

CREATE OR REPLACE FUNCTION create_client_case_from_payment()
RETURNS TRIGGER AS $$
DECLARE
  agreement_data RECORD;
  office_action_data RECORD;
  cease_desist_data RECORD;
  existing_case_id uuid;
  client_name_to_use text;
  package_name_to_use text;
  package_price_to_use text;
BEGIN
  IF NEW.status = 'succeeded' THEN
    SELECT id INTO existing_case_id
    FROM client_cases
    WHERE payment_id = NEW.id;

    IF existing_case_id IS NULL THEN
      IF NEW.agreement_id IS NOT NULL THEN
        SELECT * INTO agreement_data
        FROM client_agreements
        WHERE id = NEW.agreement_id;

        IF agreement_data.id IS NOT NULL THEN
          INSERT INTO client_cases (
            client_email,
            client_name,
            trademark_name,
            status,
            notes,
            payment_id,
            package_name,
            package_price,
            purchase_date
          ) VALUES (
            NEW.client_email,
            agreement_data.client_name,
            agreement_data.package_name,
            'Trademark Search',
            'Created from payment ' || NEW.id,
            NEW.id,
            agreement_data.package_name,
            agreement_data.package_price,
            NEW.created_at
          );
        END IF;
      ELSE
        SELECT * INTO office_action_data
        FROM office_action_requests
        WHERE payment_id = NEW.id
        LIMIT 1;

        IF office_action_data.id IS NOT NULL THEN
          INSERT INTO client_cases (
            client_email,
            client_name,
            trademark_name,
            status,
            notes,
            payment_id,
            package_name,
            package_price,
            purchase_date
          ) VALUES (
            office_action_data.email,
            office_action_data.full_name,
            office_action_data.trademark_name,
            'Office Action Pending',
            'Office Action Response: ' || office_action_data.service_type,
            NEW.id,
            office_action_data.service_type,
            '$' || (NEW.amount / 100)::text,
            NEW.created_at
          );
        ELSE
          SELECT * INTO cease_desist_data
          FROM cease_and_desist_requests
          WHERE payment_id = NEW.id
          LIMIT 1;

          IF cease_desist_data.id IS NOT NULL THEN
            INSERT INTO client_cases (
              client_email,
              client_name,
              trademark_name,
              status,
              notes,
              payment_id,
              package_name,
              package_price,
              purchase_date
            ) VALUES (
              cease_desist_data.email,
              cease_desist_data.full_name,
              cease_desist_data.trademark_name,
              'Cease & Desist Pending',
              'Cease & Desist Letter - Infringer: ' || cease_desist_data.infringer_name,
              NEW.id,
              'Cease & Desist Letter',
              '$' || (NEW.amount / 100)::text,
              NEW.created_at
            );
          ELSE
            INSERT INTO client_cases (
              client_email,
              client_name,
              trademark_name,
              status,
              notes,
              payment_id,
              package_name,
              package_price,
              purchase_date
            ) VALUES (
              NEW.client_email,
              split_part(NEW.client_email, '@', 1),
              'Service Purchase',
              'Payment Received',
              'Payment received - awaiting service details',
              NEW.id,
              'Service Package',
              '$' || (NEW.amount / 100)::text,
              NEW.created_at
            );
          END IF;
        END IF;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;