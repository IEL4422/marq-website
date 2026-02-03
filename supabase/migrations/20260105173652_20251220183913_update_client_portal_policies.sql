/*
  # Update Client Portal Policies for Authentication

  1. Changes
    - Update client_cases policies to work with authenticated users
    - Update case_messages policies to work with authenticated users
    - Clients must be authenticated to access their cases
    - Use auth.jwt() to get email from authenticated user

  2. Security
    - Authenticated clients can only view their own cases
    - Authenticated clients can only view and send messages for their cases
    - Staff can view and manage all cases and messages
*/

DROP POLICY IF EXISTS "Clients can view their own cases" ON client_cases;
DROP POLICY IF EXISTS "Clients can view messages for their cases" ON case_messages;
DROP POLICY IF EXISTS "Clients can send messages for their cases" ON case_messages;

CREATE POLICY "Authenticated clients can view their own cases"
  ON client_cases FOR SELECT
  TO authenticated
  USING (
    client_email = auth.jwt()->>'email'
  );

CREATE POLICY "Authenticated clients can view messages for their cases"
  ON case_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM client_cases
      WHERE client_cases.id = case_messages.case_id
      AND client_cases.client_email = auth.jwt()->>'email'
    )
    OR is_staff = true
  );

CREATE POLICY "Authenticated clients can send messages for their cases"
  ON case_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM client_cases
      WHERE client_cases.id = case_messages.case_id
      AND client_cases.client_email = auth.jwt()->>'email'
    )
    AND is_staff = false
  );