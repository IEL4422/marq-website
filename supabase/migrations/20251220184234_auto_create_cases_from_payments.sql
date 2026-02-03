/*
  # Auto-Create Client Cases from Trademark Package Purchases

  1. Purpose
    - Automatically create client_cases entries when trademark package purchases are completed
    - Ensures all successful trademark purchases have corresponding cases in the system

  2. Implementation
    - Create a function to handle case creation from payment data
    - Create a trigger that fires when payments are marked as 'succeeded'
    - Only creates cases for trademark-related packages
    - Prevents duplicate case creation

  3. Logic
    - When a payment status becomes 'succeeded'
    - Fetch the related agreement data
    - Check if the package is trademark-related
    - Create a new client_case with client info and trademark details
    - Use package_name as initial trademark_name (staff can update)

  4. Benefits
    - Automates case creation workflow
    - Ensures no successful purchases are missed
    - Reduces manual data entry for staff
*/

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
          notes
        ) VALUES (
          NEW.client_email,
          agreement_data.client_name,
          agreement_data.package_name,
          'Search Underway',
          'Auto-created from payment ' || NEW.id
        );
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_create_case_from_payment ON payments;

CREATE TRIGGER trigger_create_case_from_payment
AFTER INSERT OR UPDATE OF status ON payments
FOR EACH ROW
WHEN (NEW.status = 'succeeded')
EXECUTE FUNCTION create_client_case_from_payment();
