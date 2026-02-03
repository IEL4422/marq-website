/*
  # Add Payment and Package Information to Client Cases

  1. Changes
    - Add `payment_id` column to client_cases table to link to payments
    - Add `package_name` column to store the purchased package
    - Add `package_price` column to store the package price
    - Add `purchase_date` column to store when the package was purchased
    - Update the auto-creation trigger to populate these new fields

  2. Benefits
    - Clients can see their purchased package details in the portal
    - Maintains clear link between cases and payments
    - Allows displaying purchase history without complex joins
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'client_cases' AND column_name = 'payment_id'
  ) THEN
    ALTER TABLE client_cases ADD COLUMN payment_id uuid REFERENCES payments(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'client_cases' AND column_name = 'package_name'
  ) THEN
    ALTER TABLE client_cases ADD COLUMN package_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'client_cases' AND column_name = 'package_price'
  ) THEN
    ALTER TABLE client_cases ADD COLUMN package_price text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'client_cases' AND column_name = 'purchase_date'
  ) THEN
    ALTER TABLE client_cases ADD COLUMN purchase_date timestamptz;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION create_client_case_from_payment()
RETURNS TRIGGER AS $$
DECLARE
  agreement_data RECORD;
  existing_case_count INTEGER;
BEGIN
  IF NEW.status = 'succeeded' THEN
    SELECT * INTO agreement_data
    FROM client_agreements
    WHERE id = NEW.agreement_id;

    IF agreement_data.id IS NOT NULL THEN
      SELECT COUNT(*) INTO existing_case_count
      FROM client_cases
      WHERE client_email = NEW.client_email
      AND client_name = agreement_data.client_name;

      IF existing_case_count = 0 THEN
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
          'Auto-created from payment ' || NEW.id,
          NEW.id,
          agreement_data.package_name,
          agreement_data.package_price,
          NEW.created_at
        );
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;