/*
  # Fix Security and Performance Issues

  ## Changes Made

  ### 1. Add Missing Indexes on Foreign Keys
    - Add index on `client_cases.payment_id` for better query performance
    - Add index on `matter_files.uploaded_by` for better query performance

  ### 2. Drop Unused Indexes
    - Drop `idx_payments_agreement_id` (not being used)
    - Drop `idx_payments_viewed` (not being used)
    - Drop `idx_trademark_matters_client_docket` (not being used)
    - Drop `idx_trademark_matters_stage` (not being used)
    - Drop `idx_matter_todos_due_date` (not being used)
    - Drop `idx_matter_files_matter_id` (not being used)

  ### 3. Fix RLS Policies - Performance Optimization
    - Update all RLS policies to use `(select auth.<function>())` pattern
    - This ensures auth functions are evaluated once per query, not per row
    - Affects all tables with auth function calls

  ### 4. Fix Critical Security Issue - Replace user_metadata
    - Replace all `user_metadata` references with `app_metadata`
    - `user_metadata` can be edited by users and is insecure for authorization
    - `app_metadata` is server-controlled and secure for role-based access
    - Change from checking `user_metadata->>'is_staff'` to `app_metadata->>'role' = 'staff'`

  ### 5. Consolidate Multiple Permissive Policies
    - Merge duplicate policies into single policies where appropriate
    - Remove redundant "Staff can view all" policies that are already covered by other policies

  ### 6. Fix Function Search Paths
    - Set secure search_path for functions to prevent injection attacks

  ## Security Notes
  - Staff role identification now consistently uses `app_metadata->>'role'` which cannot be modified by users
  - All auth functions are now wrapped in (select ...) for better performance
  - Search paths are secured for all functions
*/

-- ==========================================
-- 1. ADD MISSING INDEXES ON FOREIGN KEYS
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_client_cases_payment_id ON client_cases(payment_id);
CREATE INDEX IF NOT EXISTS idx_matter_files_uploaded_by ON matter_files(uploaded_by);

-- ==========================================
-- 2. DROP UNUSED INDEXES
-- ==========================================

DROP INDEX IF EXISTS idx_payments_agreement_id;
DROP INDEX IF EXISTS idx_payments_viewed;
DROP INDEX IF EXISTS idx_trademark_matters_client_docket;
DROP INDEX IF EXISTS idx_trademark_matters_stage;
DROP INDEX IF EXISTS idx_matter_todos_due_date;
DROP INDEX IF EXISTS idx_matter_files_matter_id;

-- ==========================================
-- 3. FIX RLS POLICIES - PERFORMANCE & SECURITY
-- ==========================================

-- Fix payments policies
DROP POLICY IF EXISTS "Users can view own payments by email" ON payments;
CREATE POLICY "Users can view own payments by email"
  ON payments FOR SELECT
  TO authenticated
  USING (
    client_email = (select auth.jwt()->>'email')
    OR
    (select auth.jwt()->'app_metadata'->>'role') = 'staff'
  );

DROP POLICY IF EXISTS "Staff can view all payments" ON payments;

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

DROP POLICY IF EXISTS "Staff can view all cases" ON client_cases;

DROP POLICY IF EXISTS "Staff can update cases" ON client_cases;
CREATE POLICY "Staff can update cases"
  ON client_cases FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff')
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

DROP POLICY IF EXISTS "Staff can insert cases" ON client_cases;
CREATE POLICY "Staff can insert cases"
  ON client_cases FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- Fix case_messages policies
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

DROP POLICY IF EXISTS "Staff can view all messages" ON case_messages;

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

DROP POLICY IF EXISTS "Staff can send messages" ON case_messages;

DROP POLICY IF EXISTS "Staff can update messages" ON case_messages;
CREATE POLICY "Staff can update messages"
  ON case_messages FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff')
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- Fix client_agreements policies
DROP POLICY IF EXISTS "Authenticated staff can view all agreements" ON client_agreements;

-- Fix contact_submissions policies
DROP POLICY IF EXISTS "Authenticated staff can view all contact submissions" ON contact_submissions;
CREATE POLICY "Authenticated staff can view all contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

DROP POLICY IF EXISTS "Authenticated users can view all submissions" ON contact_submissions;

DROP POLICY IF EXISTS "Authenticated staff can update contact submissions" ON contact_submissions;
CREATE POLICY "Authenticated staff can update contact submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff')
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- Fix trademark_search_requests policies
DROP POLICY IF EXISTS "Authenticated staff can view all trademark requests" ON trademark_search_requests;
CREATE POLICY "Authenticated staff can view all trademark requests"
  ON trademark_search_requests FOR SELECT
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

DROP POLICY IF EXISTS "Authenticated users can view all requests" ON trademark_search_requests;

DROP POLICY IF EXISTS "Authenticated staff can update trademark requests" ON trademark_search_requests;
CREATE POLICY "Authenticated staff can update trademark requests"
  ON trademark_search_requests FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff')
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- Fix trademark_matters policies (SECURITY FIX: user_metadata -> app_metadata)
DROP POLICY IF EXISTS "Clients can view own matters" ON trademark_matters;
CREATE POLICY "Clients can view own matters"
  ON trademark_matters FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = client_id
    OR
    (select auth.jwt()->'app_metadata'->>'role') = 'staff'
  );

DROP POLICY IF EXISTS "Clients can update own matters" ON trademark_matters;
CREATE POLICY "Clients can update own matters"
  ON trademark_matters FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) = client_id
    OR
    (select auth.jwt()->'app_metadata'->>'role') = 'staff'
  )
  WITH CHECK (
    (select auth.uid()) = client_id
    OR
    (select auth.jwt()->'app_metadata'->>'role') = 'staff'
  );

DROP POLICY IF EXISTS "Staff can insert matters" ON trademark_matters;
CREATE POLICY "Staff can insert matters"
  ON trademark_matters FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- Fix trademark_intake_responses policies (SECURITY FIX: user_metadata -> app_metadata)
DROP POLICY IF EXISTS "Clients can view own intake responses" ON trademark_intake_responses;
CREATE POLICY "Clients can view own intake responses"
  ON trademark_intake_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trademark_matters
      WHERE trademark_matters.id = trademark_intake_responses.matter_id
      AND (
        trademark_matters.client_id = (select auth.uid())
        OR
        (select auth.jwt()->'app_metadata'->>'role') = 'staff'
      )
    )
  );

DROP POLICY IF EXISTS "Clients can insert own intake responses" ON trademark_intake_responses;
CREATE POLICY "Clients can insert own intake responses"
  ON trademark_intake_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trademark_matters
      WHERE trademark_matters.id = trademark_intake_responses.matter_id
      AND trademark_matters.client_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Clients can update own intake responses" ON trademark_intake_responses;
CREATE POLICY "Clients can update own intake responses"
  ON trademark_intake_responses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trademark_matters
      WHERE trademark_matters.id = trademark_intake_responses.matter_id
      AND (
        trademark_matters.client_id = (select auth.uid())
        OR
        (select auth.jwt()->'app_metadata'->>'role') = 'staff'
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trademark_matters
      WHERE trademark_matters.id = trademark_intake_responses.matter_id
      AND (
        trademark_matters.client_id = (select auth.uid())
        OR
        (select auth.jwt()->'app_metadata'->>'role') = 'staff'
      )
    )
  );

-- Fix matter_todos policies (SECURITY FIX: user_metadata -> app_metadata)
DROP POLICY IF EXISTS "Users can view own todos" ON matter_todos;
CREATE POLICY "Users can view own todos"
  ON matter_todos FOR SELECT
  TO authenticated
  USING (
    owner_id = (select auth.uid())
    OR
    (select auth.jwt()->'app_metadata'->>'role') = 'staff'
  );

DROP POLICY IF EXISTS "Staff can insert todos" ON matter_todos;
CREATE POLICY "Staff can insert todos"
  ON matter_todos FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

DROP POLICY IF EXISTS "Users can update own todos" ON matter_todos;
CREATE POLICY "Users can update own todos"
  ON matter_todos FOR UPDATE
  TO authenticated
  USING (
    owner_id = (select auth.uid())
    OR
    (select auth.jwt()->'app_metadata'->>'role') = 'staff'
  )
  WITH CHECK (
    owner_id = (select auth.uid())
    OR
    (select auth.jwt()->'app_metadata'->>'role') = 'staff'
  );

-- Fix matter_files policies (SECURITY FIX: user_metadata -> app_metadata)
DROP POLICY IF EXISTS "Users can view own matter files" ON matter_files;
CREATE POLICY "Users can view own matter files"
  ON matter_files FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trademark_matters
      WHERE trademark_matters.id = matter_files.matter_id
      AND (
        trademark_matters.client_id = (select auth.uid())
        OR
        (select auth.jwt()->'app_metadata'->>'role') = 'staff'
      )
    )
  );

DROP POLICY IF EXISTS "Users can insert matter files" ON matter_files;
CREATE POLICY "Users can insert matter files"
  ON matter_files FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trademark_matters
      WHERE trademark_matters.id = matter_files.matter_id
      AND trademark_matters.client_id = (select auth.uid())
    )
    OR
    (select auth.jwt()->'app_metadata'->>'role') = 'staff'
  );

-- ==========================================
-- 4. FIX FUNCTION SEARCH PATHS
-- ==========================================

-- Fix generate_client_docket function
DROP FUNCTION IF EXISTS generate_client_docket();
CREATE OR REPLACE FUNCTION generate_client_docket()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  next_number INTEGER;
  new_docket TEXT;
BEGIN
  SELECT COALESCE(MAX(SUBSTRING(client_docket FROM '[0-9]+')::INTEGER), 0) + 1
  INTO next_number
  FROM trademark_matters
  WHERE client_docket LIKE 'TM-%';
  
  new_docket := 'TM-' || LPAD(next_number::TEXT, 6, '0');
  RETURN new_docket;
END;
$$;

-- Fix update_updated_at_column function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate triggers that used update_updated_at_column
DROP TRIGGER IF EXISTS update_trademark_matters_updated_at ON trademark_matters;
CREATE TRIGGER update_trademark_matters_updated_at
  BEFORE UPDATE ON trademark_matters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_trademark_intake_responses_updated_at ON trademark_intake_responses;
CREATE TRIGGER update_trademark_intake_responses_updated_at
  BEFORE UPDATE ON trademark_intake_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_matter_todos_updated_at ON matter_todos;
CREATE TRIGGER update_matter_todos_updated_at
  BEFORE UPDATE ON matter_todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_matter_files_updated_at ON matter_files;
CREATE TRIGGER update_matter_files_updated_at
  BEFORE UPDATE ON matter_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
