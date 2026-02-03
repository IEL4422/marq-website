/*
  # Fix RLS Staff Metadata Check

  ## Problem
  RLS policies were checking for `raw_app_meta_data->>'is_staff'` but staff users have `app_metadata->>'role' = 'staff'`
  This caused staff update permissions to fail even though authentication worked.

  ## Changes
  Update all RLS policies to use the correct metadata path:
  - Change from: `raw_app_meta_data->>'is_staff' = 'true'`
  - Change to: `app_metadata->>'role' = 'staff'`

  ## Tables Affected
  - trademark_questionnaire_responses
  - payments
  - client_cases
  - case_messages
  - contact_submissions
  - trademark_search_requests
  - trademark_matters
  - trademark_intake_responses
  - matter_todos
  - matter_files

  ## Security Notes
  - `app_metadata` is server-controlled and cannot be edited by users
  - Using `role = 'staff'` ensures consistency across all policies
*/

-- ============================================================================
-- TRADEMARK_QUESTIONNAIRE_RESPONSES
-- ============================================================================

DROP POLICY IF EXISTS "Users and staff can view questionnaire responses" ON public.trademark_questionnaire_responses;
DROP POLICY IF EXISTS "Staff can update all questionnaire responses" ON public.trademark_questionnaire_responses;

CREATE POLICY "Users and staff can view questionnaire responses"
  ON public.trademark_questionnaire_responses
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid()) OR
    (select auth.jwt()->'app_metadata'->>'role') = 'staff'
  );

CREATE POLICY "Staff can update all questionnaire responses"
  ON public.trademark_questionnaire_responses
  FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff')
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- ============================================================================
-- PAYMENTS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own payments by email" ON public.payments;
DROP POLICY IF EXISTS "Staff can update payment viewed status" ON public.payments;

CREATE POLICY "Users can view own payments by email"
  ON public.payments
  FOR SELECT
  TO authenticated
  USING (
    client_email = (select auth.jwt()->>'email') OR
    (select auth.jwt()->'app_metadata'->>'role') = 'staff'
  );

CREATE POLICY "Staff can update payment viewed status"
  ON public.payments
  FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff')
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- ============================================================================
-- CLIENT_CASES
-- ============================================================================

DROP POLICY IF EXISTS "Clients and staff can view cases" ON public.client_cases;
DROP POLICY IF EXISTS "Staff can update cases" ON public.client_cases;
DROP POLICY IF EXISTS "Staff can insert cases" ON public.client_cases;

CREATE POLICY "Clients and staff can view cases"
  ON public.client_cases
  FOR SELECT
  TO authenticated
  USING (
    client_email = (select auth.jwt()->>'email') OR
    (select auth.jwt()->'app_metadata'->>'role') = 'staff'
  );

CREATE POLICY "Staff can update cases"
  ON public.client_cases
  FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff')
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

CREATE POLICY "Staff can insert cases"
  ON public.client_cases
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- ============================================================================
-- CASE_MESSAGES
-- ============================================================================

DROP POLICY IF EXISTS "Clients and staff can view messages" ON public.case_messages;
DROP POLICY IF EXISTS "Clients and staff can send messages" ON public.case_messages;
DROP POLICY IF EXISTS "Staff can update messages" ON public.case_messages;

CREATE POLICY "Clients and staff can view messages"
  ON public.case_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM client_cases
      WHERE client_cases.id = case_messages.case_id
      AND (
        client_cases.client_email = (select auth.jwt()->>'email') OR
        (select auth.jwt()->'app_metadata'->>'role') = 'staff'
      )
    )
  );

CREATE POLICY "Clients and staff can send messages"
  ON public.case_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM client_cases
      WHERE client_cases.id = case_messages.case_id
      AND (
        client_cases.client_email = (select auth.jwt()->>'email') OR
        (select auth.jwt()->'app_metadata'->>'role') = 'staff'
      )
    )
  );

CREATE POLICY "Staff can update messages"
  ON public.case_messages
  FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff')
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- ============================================================================
-- CONTACT_SUBMISSIONS
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated staff can view all contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Authenticated staff can update contact submissions" ON public.contact_submissions;

CREATE POLICY "Authenticated staff can view all contact submissions"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

CREATE POLICY "Authenticated staff can update contact submissions"
  ON public.contact_submissions
  FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff')
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- ============================================================================
-- TRADEMARK_SEARCH_REQUESTS
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated staff can view all trademark requests" ON public.trademark_search_requests;
DROP POLICY IF EXISTS "Authenticated staff can update trademark requests" ON public.trademark_search_requests;

CREATE POLICY "Authenticated staff can view all trademark requests"
  ON public.trademark_search_requests
  FOR SELECT
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

CREATE POLICY "Authenticated staff can update trademark requests"
  ON public.trademark_search_requests
  FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff')
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- ============================================================================
-- TRADEMARK_MATTERS
-- ============================================================================

DROP POLICY IF EXISTS "Clients can view own matters" ON public.trademark_matters;
DROP POLICY IF EXISTS "Clients can update own matters" ON public.trademark_matters;
DROP POLICY IF EXISTS "Staff can insert matters" ON public.trademark_matters;
DROP POLICY IF EXISTS "Staff can update all matters" ON public.trademark_matters;

CREATE POLICY "Clients can view own matters"
  ON public.trademark_matters
  FOR SELECT
  TO authenticated
  USING (
    client_id = (select auth.uid()) OR
    (select auth.jwt()->'app_metadata'->>'role') = 'staff'
  );

CREATE POLICY "Clients can update own matters"
  ON public.trademark_matters
  FOR UPDATE
  TO authenticated
  USING (client_id = (select auth.uid()))
  WITH CHECK (client_id = (select auth.uid()));

CREATE POLICY "Staff can insert matters"
  ON public.trademark_matters
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

CREATE POLICY "Staff can update all matters"
  ON public.trademark_matters
  FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff')
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- ============================================================================
-- TRADEMARK_INTAKE_RESPONSES
-- ============================================================================

DROP POLICY IF EXISTS "Clients can view own intake responses" ON public.trademark_intake_responses;
DROP POLICY IF EXISTS "Clients can update own intake responses" ON public.trademark_intake_responses;

CREATE POLICY "Clients can view own intake responses"
  ON public.trademark_intake_responses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trademark_matters
      WHERE trademark_matters.id = trademark_intake_responses.matter_id
      AND (
        trademark_matters.client_id = (select auth.uid()) OR
        (select auth.jwt()->'app_metadata'->>'role') = 'staff'
      )
    )
  );

CREATE POLICY "Clients can update own intake responses"
  ON public.trademark_intake_responses
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trademark_matters
      WHERE trademark_matters.id = trademark_intake_responses.matter_id
      AND trademark_matters.client_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trademark_matters
      WHERE trademark_matters.id = trademark_intake_responses.matter_id
      AND trademark_matters.client_id = (select auth.uid())
    )
  );

-- ============================================================================
-- MATTER_TODOS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own todos" ON public.matter_todos;
DROP POLICY IF EXISTS "Staff can insert todos" ON public.matter_todos;
DROP POLICY IF EXISTS "Users can update own todos" ON public.matter_todos;

CREATE POLICY "Users can view own todos"
  ON public.matter_todos
  FOR SELECT
  TO authenticated
  USING (
    owner_id = (select auth.uid()) OR
    (select auth.jwt()->'app_metadata'->>'role') = 'staff'
  );

CREATE POLICY "Staff can insert todos"
  ON public.matter_todos
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

CREATE POLICY "Users can update own todos"
  ON public.matter_todos
  FOR UPDATE
  TO authenticated
  USING (owner_id = (select auth.uid()))
  WITH CHECK (owner_id = (select auth.uid()));

-- ============================================================================
-- MATTER_FILES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own matter files" ON public.matter_files;
DROP POLICY IF EXISTS "Users can insert matter files" ON public.matter_files;

CREATE POLICY "Users can view own matter files"
  ON public.matter_files
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trademark_matters
      WHERE trademark_matters.id = matter_files.matter_id
      AND (
        trademark_matters.client_id = (select auth.uid()) OR
        (select auth.jwt()->'app_metadata'->>'role') = 'staff'
      )
    )
  );

CREATE POLICY "Users can insert matter files"
  ON public.matter_files
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trademark_matters
      WHERE trademark_matters.id = matter_files.matter_id
      AND (
        trademark_matters.client_id = (select auth.uid()) OR
        (select auth.jwt()->'app_metadata'->>'role') = 'staff'
      )
    )
  );
