/*
  # Fix Remaining Security and Performance Issues

  ## Changes Made

  1. **Add Missing Index**
    - Add index on `payments.agreement_id` foreign key for better query performance

  2. **Remove Unused Index**
    - Drop `idx_client_cases_payment_id` as it's not being used

  3. **Optimize RLS Policies**
    - Properly fix all RLS policies to use `(select auth.<function>())` pattern
    - Ensures auth functions are evaluated once per query, not per row
    - Use user metadata to properly identify staff members
    - Affects policies on: payments, client_cases, case_messages

  ## Security Notes
  - Staff identification now uses `raw_app_metadata` which cannot be modified by users
  - This provides secure role-based access control
*/

-- 1. Add missing index on payments.agreement_id foreign key
CREATE INDEX IF NOT EXISTS idx_payments_agreement_id ON payments(agreement_id);

-- 2. Drop unused index on client_cases.payment_id
DROP INDEX IF EXISTS idx_client_cases_payment_id;

-- 3. Fix RLS policies with proper (select auth.<function>()) pattern

-- Fix payments table policy
DROP POLICY IF EXISTS "Users can view own payments by email" ON payments;
CREATE POLICY "Users can view own payments by email"
  ON payments FOR SELECT
  TO authenticated
  USING (
    client_email = (select auth.jwt()->>'email')
    OR
    (select auth.jwt()->'app_metadata'->>'role') = 'staff'
  );

-- Fix client_cases policies
DROP POLICY IF EXISTS "Clients and staff can view cases" ON client_cases;
CREATE POLICY "Clients and staff can view cases"
  ON client_cases FOR SELECT
  TO authenticated
  USING (
    client_email = (select auth.jwt()->>'email')
    OR 
    (select auth.jwt()->'app_metadata'->>'role') = 'staff'
  );

-- Fix case_messages SELECT policy
DROP POLICY IF EXISTS "Clients and staff can view messages" ON case_messages;
CREATE POLICY "Clients and staff can view messages"
  ON case_messages FOR SELECT
  TO authenticated
  USING (
    (select auth.jwt()->'app_metadata'->>'role') = 'staff'
    OR
    EXISTS (
      SELECT 1 FROM client_cases
      WHERE client_cases.id = case_messages.case_id
      AND client_cases.client_email = (select auth.jwt()->>'email')
    )
  );

-- Fix case_messages INSERT policy
DROP POLICY IF EXISTS "Clients and staff can send messages" ON case_messages;
CREATE POLICY "Clients and staff can send messages"
  ON case_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.jwt()->'app_metadata'->>'role') = 'staff'
    OR
    EXISTS (
      SELECT 1 FROM client_cases
      WHERE client_cases.id = case_messages.case_id
      AND client_cases.client_email = (select auth.jwt()->>'email')
    )
  );
