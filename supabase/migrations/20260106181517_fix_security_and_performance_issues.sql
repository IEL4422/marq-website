/*
  # Fix Security and Performance Issues

  ## Changes Made

  1. **Add Missing Foreign Key Indexes**
     - Add index on `matter_files.matter_id`
     - Add index on `payments.agreement_id`

  2. **Optimize RLS Policies for Performance**
     - Wrap all `auth.uid()` and `auth.jwt()` calls with `(select ...)` to prevent re-evaluation per row
     - Affects multiple tables: trademark_questionnaire_responses, payments, client_cases, case_messages, 
       contact_submissions, trademark_search_requests, trademark_matters, analytics_events, 
       trademark_intake_responses, matter_todos, matter_files

  3. **Remove Duplicate Permissive Policies**
     - Consolidate multiple SELECT policies on trademark_questionnaire_responses

  4. **Drop Unused Indexes**
     - Remove indexes that have not been used to reduce storage overhead

  ## Notes
  - RLS policies with "always true" conditions are intentional for public forms (analytics, contact submissions, etc.)
  - Password leak protection must be enabled manually in Supabase Auth settings
*/

-- ============================================================================
-- 1. ADD MISSING FOREIGN KEY INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_matter_files_matter_id ON public.matter_files(matter_id);
CREATE INDEX IF NOT EXISTS idx_payments_agreement_id ON public.payments(agreement_id);

-- ============================================================================
-- 2. DROP UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS public.idx_client_cases_payment_id;
DROP INDEX IF EXISTS public.idx_matter_files_uploaded_by;
DROP INDEX IF EXISTS public.idx_questionnaire_responses_user_id;
DROP INDEX IF EXISTS public.idx_questionnaire_responses_email;
DROP INDEX IF EXISTS public.idx_questionnaire_responses_viewed;
DROP INDEX IF EXISTS public.idx_payments_email;
DROP INDEX IF EXISTS public.idx_analytics_events_created_at;
DROP INDEX IF EXISTS public.idx_educational_guides_slug;
DROP INDEX IF EXISTS public.idx_client_cases_email;
DROP INDEX IF EXISTS public.idx_case_messages_case_id;
DROP INDEX IF EXISTS public.idx_trademark_matters_client_id;
DROP INDEX IF EXISTS public.idx_intake_responses_matter_id;
DROP INDEX IF EXISTS public.idx_matter_todos_matter_id;
DROP INDEX IF EXISTS public.idx_matter_todos_owner_id;

-- ============================================================================
-- 3. FIX RLS POLICIES - TRADEMARK_QUESTIONNAIRE_RESPONSES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own questionnaire responses" ON public.trademark_questionnaire_responses;
DROP POLICY IF EXISTS "Staff can view all questionnaire responses" ON public.trademark_questionnaire_responses;
DROP POLICY IF EXISTS "Staff can update all questionnaire responses" ON public.trademark_questionnaire_responses;

CREATE POLICY "Users and staff can view questionnaire responses"
  ON public.trademark_questionnaire_responses
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid()) OR
    ((select auth.jwt()->>'email') IS NOT NULL AND 
     (select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true')
  );

CREATE POLICY "Staff can update all questionnaire responses"
  ON public.trademark_questionnaire_responses
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.jwt()->>'email') IS NOT NULL AND 
    (select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true'
  )
  WITH CHECK (
    (select auth.jwt()->>'email') IS NOT NULL AND 
    (select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true'
  );

-- ============================================================================
-- 4. FIX RLS POLICIES - PAYMENTS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own payments by email" ON public.payments;

CREATE POLICY "Users can view own payments by email"
  ON public.payments
  FOR SELECT
  TO authenticated
  USING (
    client_email = (select auth.jwt()->>'email') OR
    ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true')
  );

-- ============================================================================
-- 5. FIX RLS POLICIES - CLIENT_CASES
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
    ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true')
  );

CREATE POLICY "Staff can update cases"
  ON public.client_cases
  FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true')
  WITH CHECK ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true');

CREATE POLICY "Staff can insert cases"
  ON public.client_cases
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true');

-- ============================================================================
-- 6. FIX RLS POLICIES - CASE_MESSAGES
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
        ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true')
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
        ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true')
      )
    )
  );

CREATE POLICY "Staff can update messages"
  ON public.case_messages
  FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true')
  WITH CHECK ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true');

-- ============================================================================
-- 7. FIX RLS POLICIES - CONTACT_SUBMISSIONS
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated staff can view all contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Authenticated staff can update contact submissions" ON public.contact_submissions;

CREATE POLICY "Authenticated staff can view all contact submissions"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true');

CREATE POLICY "Authenticated staff can update contact submissions"
  ON public.contact_submissions
  FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true')
  WITH CHECK ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true');

-- ============================================================================
-- 8. FIX RLS POLICIES - TRADEMARK_SEARCH_REQUESTS
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated staff can view all trademark requests" ON public.trademark_search_requests;
DROP POLICY IF EXISTS "Authenticated staff can update trademark requests" ON public.trademark_search_requests;

CREATE POLICY "Authenticated staff can view all trademark requests"
  ON public.trademark_search_requests
  FOR SELECT
  TO authenticated
  USING ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true');

CREATE POLICY "Authenticated staff can update trademark requests"
  ON public.trademark_search_requests
  FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true')
  WITH CHECK ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true');

-- ============================================================================
-- 9. FIX RLS POLICIES - TRADEMARK_MATTERS
-- ============================================================================

DROP POLICY IF EXISTS "Clients can view own matters" ON public.trademark_matters;
DROP POLICY IF EXISTS "Clients can update own matters" ON public.trademark_matters;
DROP POLICY IF EXISTS "Staff can insert matters" ON public.trademark_matters;

CREATE POLICY "Clients can view own matters"
  ON public.trademark_matters
  FOR SELECT
  TO authenticated
  USING (
    client_id = (select auth.uid()) OR
    ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true')
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
  WITH CHECK ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true');

-- ============================================================================
-- 10. FIX RLS POLICIES - ANALYTICS_EVENTS
-- ============================================================================

DROP POLICY IF EXISTS "Staff can view all analytics events" ON public.analytics_events;

CREATE POLICY "Staff can view all analytics events"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true');

-- ============================================================================
-- 11. FIX RLS POLICIES - TRADEMARK_INTAKE_RESPONSES
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
        ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true')
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
-- 12. FIX RLS POLICIES - MATTER_TODOS
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
    ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true')
  );

CREATE POLICY "Staff can insert todos"
  ON public.matter_todos
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true');

CREATE POLICY "Users can update own todos"
  ON public.matter_todos
  FOR UPDATE
  TO authenticated
  USING (owner_id = (select auth.uid()))
  WITH CHECK (owner_id = (select auth.uid()));

-- ============================================================================
-- 13. FIX RLS POLICIES - MATTER_FILES
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
        ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true')
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
        ((select auth.jwt()->>'raw_app_meta_data')::jsonb->>'is_staff' = 'true')
      )
    )
  );
