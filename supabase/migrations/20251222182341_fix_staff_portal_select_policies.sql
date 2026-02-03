/*
  # Fix Staff Portal SELECT Policies

  1. Policy Updates
    - Update "Staff can view all cases" to check for staff role
    - Update "Staff can view all messages" to check for staff role
    - Update "Staff can send messages" to check for staff role
    - Ensure all staff policies consistently check app_metadata.role = 'staff'

  2. Security
    - Ensures only authenticated users with staff role can access staff portal data
    - Clients can still access their own data through separate policies
*/

-- Client Cases: Update staff view policy
DROP POLICY IF EXISTS "Staff can view all cases" ON client_cases;
CREATE POLICY "Staff can view all cases"
  ON client_cases FOR SELECT
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- Case Messages: Update staff view policy
DROP POLICY IF EXISTS "Staff can view all messages" ON case_messages;
CREATE POLICY "Staff can view all messages"
  ON case_messages FOR SELECT
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- Case Messages: Update staff insert policy
DROP POLICY IF EXISTS "Staff can send messages" ON case_messages;
CREATE POLICY "Staff can send messages"
  ON case_messages FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- Payments: Allow staff to view all payments
DROP POLICY IF EXISTS "Staff can view all payments" ON payments;
CREATE POLICY "Staff can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff');