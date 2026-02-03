/*
  # Backfill Client Cases from Existing Successful Payments

  1. Purpose
    - Create client_cases for all existing successful payments that don't have cases yet
    - Ensures historical data is properly migrated to the new case management system

  2. Process
    - Find all successful payments with agreements
    - Check if a case already exists for each client
    - Create cases for clients that don't have them
    - Use agreement data to populate case information

  3. Safety
    - Only creates cases if they don't already exist
    - Uses the same logic as the trigger function
    - Idempotent - safe to run multiple times
*/

INSERT INTO client_cases (
  client_email,
  client_name,
  trademark_name,
  status,
  notes,
  created_at
)
SELECT DISTINCT ON (p.client_email, ca.client_name)
  p.client_email,
  ca.client_name,
  ca.package_name,
  'Search Underway',
  'Backfilled from payment ' || p.id,
  p.created_at
FROM payments p
INNER JOIN client_agreements ca ON ca.id = p.agreement_id
WHERE p.status = 'succeeded'
AND NOT EXISTS (
  SELECT 1 FROM client_cases cc
  WHERE cc.client_email = p.client_email
  AND cc.client_name = ca.client_name
)
ORDER BY p.client_email, ca.client_name, p.created_at DESC;
