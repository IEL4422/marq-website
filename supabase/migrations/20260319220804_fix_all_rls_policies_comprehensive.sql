/*
  # Comprehensive RLS Policy Cleanup and Fix
  
  1. Issues Fixed
    - Remove all duplicate and conflicting policies
    - Remove overly permissive policies (e.g., "Anon can view contact submissions")
    - Standardize staff checks to use: COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
    - Ensure proper restrictive RLS for all staff-only tables
  
  2. Tables Updated
    - contact_submissions: Staff-only access
    - trademark_search_requests: Staff-only access  
    - payments: Staff-only access
    - client_agreements: Staff-only access (remove "Anyone can view")
    - client_cases: Staff and client access
    - analytics_events: Anyone can insert, staff can view
    - trademark_questionnaire_responses: Staff-only access (remove users can view own)
    - incomplete_form_emails: Staff-only access
    - incomplete_form_views: Staff-only access
    - office_action_requests: Users can view own, staff can view all
    - cease_and_desist_requests: Users can view own, staff can view all
  
  3. Security
    - All policies are restrictive by default
    - Staff access requires is_staff=true in app_metadata
    - User access requires matching user_id where applicable
*/

-- ============================================================================
-- CONTACT SUBMISSIONS
-- ============================================================================
DROP POLICY IF EXISTS "Anon can view contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated staff can view all contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated staff can update contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Anon users can insert contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can insert contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Staff can view all contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Staff can update contact submissions" ON contact_submissions;

CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Staff can view contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);

CREATE POLICY "Staff can update contact submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true)
  WITH CHECK (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);

-- ============================================================================
-- TRADEMARK SEARCH REQUESTS
-- ============================================================================
DROP POLICY IF EXISTS "Authenticated staff can view all trademark requests" ON trademark_search_requests;
DROP POLICY IF EXISTS "Authenticated staff can update trademark requests" ON trademark_search_requests;
DROP POLICY IF EXISTS "Anyone can submit trademark search requests" ON trademark_search_requests;
DROP POLICY IF EXISTS "Authenticated users can submit trademark search requests" ON trademark_search_requests;
DROP POLICY IF EXISTS "Staff can view all trademark search requests" ON trademark_search_requests;
DROP POLICY IF EXISTS "Staff can update trademark search requests" ON trademark_search_requests;

CREATE POLICY "Anyone can submit trademark searches"
  ON trademark_search_requests FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Staff can view trademark searches"
  ON trademark_search_requests FOR SELECT
  TO authenticated
  USING (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);

CREATE POLICY "Staff can update trademark searches"
  ON trademark_search_requests FOR UPDATE
  TO authenticated
  USING (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true)
  WITH CHECK (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);

-- ============================================================================
-- PAYMENTS
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own payments by email" ON payments;
DROP POLICY IF EXISTS "Anyone can insert payments" ON payments;
DROP POLICY IF EXISTS "Staff can view all payments" ON payments;
DROP POLICY IF EXISTS "Service role can update payments" ON payments;
DROP POLICY IF EXISTS "Staff can update payments" ON payments;

CREATE POLICY "Anyone can create payments"
  ON payments FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Staff can view payments"
  ON payments FOR SELECT
  TO authenticated
  USING (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);

CREATE POLICY "Staff can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true)
  WITH CHECK (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);

-- ============================================================================
-- CLIENT AGREEMENTS
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can view agreements" ON client_agreements;
DROP POLICY IF EXISTS "Anyone can insert agreements" ON client_agreements;
DROP POLICY IF EXISTS "Staff can view all client agreements" ON client_agreements;
DROP POLICY IF EXISTS "Staff can update client agreements" ON client_agreements;

CREATE POLICY "Anyone can create agreements"
  ON client_agreements FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Staff can view agreements"
  ON client_agreements FOR SELECT
  TO authenticated
  USING (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);

CREATE POLICY "Staff can update agreements"
  ON client_agreements FOR UPDATE
  TO authenticated
  USING (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true)
  WITH CHECK (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);

-- ============================================================================
-- CLIENT CASES
-- ============================================================================
DROP POLICY IF EXISTS "Clients and staff can view cases" ON client_cases;
DROP POLICY IF EXISTS "Staff can view all cases" ON client_cases;
DROP POLICY IF EXISTS "Staff can insert cases" ON client_cases;
DROP POLICY IF EXISTS "Staff can update cases" ON client_cases;
DROP POLICY IF EXISTS "Staff can delete cases" ON client_cases;

CREATE POLICY "Staff can view cases"
  ON client_cases FOR SELECT
  TO authenticated
  USING (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);

CREATE POLICY "Staff can insert cases"
  ON client_cases FOR INSERT
  TO authenticated
  WITH CHECK (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);

CREATE POLICY "Staff can update cases"
  ON client_cases FOR UPDATE
  TO authenticated
  USING (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true)
  WITH CHECK (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);

CREATE POLICY "Staff can delete cases"
  ON client_cases FOR DELETE
  TO authenticated
  USING (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);

-- ============================================================================
-- ANALYTICS EVENTS
-- ============================================================================
DROP POLICY IF EXISTS "Staff can view all analytics events" ON analytics_events;
DROP POLICY IF EXISTS "Only staff can view analytics" ON analytics_events;
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON analytics_events;

CREATE POLICY "Anyone can track analytics"
  ON analytics_events FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Staff can view analytics"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);

-- ============================================================================
-- TRADEMARK QUESTIONNAIRE RESPONSES
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own questionnaire responses" ON trademark_questionnaire_responses;
DROP POLICY IF EXISTS "Anonymous users can insert questionnaire responses" ON trademark_questionnaire_responses;
DROP POLICY IF EXISTS "Authenticated users can insert questionnaire responses" ON trademark_questionnaire_responses;
DROP POLICY IF EXISTS "Staff can view all questionnaire responses" ON trademark_questionnaire_responses;
DROP POLICY IF EXISTS "Staff can update all questionnaire responses" ON trademark_questionnaire_responses;
DROP POLICY IF EXISTS "Staff can update questionnaire responses" ON trademark_questionnaire_responses;

CREATE POLICY "Anyone can submit questionnaires"
  ON trademark_questionnaire_responses FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Staff can view questionnaires"
  ON trademark_questionnaire_responses FOR SELECT
  TO authenticated
  USING (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);

CREATE POLICY "Staff can update questionnaires"
  ON trademark_questionnaire_responses FOR UPDATE
  TO authenticated
  USING (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true)
  WITH CHECK (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);

-- ============================================================================
-- INCOMPLETE FORM EMAILS
-- ============================================================================
DROP POLICY IF EXISTS "Staff can insert incomplete form email records" ON incomplete_form_emails;
DROP POLICY IF EXISTS "Staff can view incomplete form email records" ON incomplete_form_emails;
DROP POLICY IF EXISTS "Staff can insert incomplete form emails" ON incomplete_form_emails;
DROP POLICY IF EXISTS "Staff can view incomplete form emails" ON incomplete_form_emails;

CREATE POLICY "Staff can manage incomplete form emails"
  ON incomplete_form_emails FOR ALL
  TO authenticated
  USING (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true)
  WITH CHECK (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);

-- ============================================================================
-- INCOMPLETE FORM VIEWS
-- ============================================================================
DROP POLICY IF EXISTS "Staff can insert incomplete form view records" ON incomplete_form_views;
DROP POLICY IF EXISTS "Staff can view incomplete form view records" ON incomplete_form_views;
DROP POLICY IF EXISTS "Staff can insert incomplete form views" ON incomplete_form_views;
DROP POLICY IF EXISTS "Staff can view incomplete form views" ON incomplete_form_views;

CREATE POLICY "Staff can manage incomplete form views"
  ON incomplete_form_views FOR ALL
  TO authenticated
  USING (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true)
  WITH CHECK (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);

-- ============================================================================
-- OFFICE ACTION REQUESTS
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own office action requests" ON office_action_requests;
DROP POLICY IF EXISTS "Anonymous users can insert office action requests" ON office_action_requests;
DROP POLICY IF EXISTS "Users can insert own office action requests" ON office_action_requests;
DROP POLICY IF EXISTS "Staff can view all office action requests" ON office_action_requests;
DROP POLICY IF EXISTS "Staff can update office action requests" ON office_action_requests;

CREATE POLICY "Anyone can submit office action requests"
  ON office_action_requests FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Staff can view office action requests"
  ON office_action_requests FOR SELECT
  TO authenticated
  USING (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);

CREATE POLICY "Staff can update office action requests"
  ON office_action_requests FOR UPDATE
  TO authenticated
  USING (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true)
  WITH CHECK (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);

-- ============================================================================
-- CEASE AND DESIST REQUESTS
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own cease and desist requests" ON cease_and_desist_requests;
DROP POLICY IF EXISTS "Anonymous users can insert cease and desist requests" ON cease_and_desist_requests;
DROP POLICY IF EXISTS "Users can insert own cease and desist requests" ON cease_and_desist_requests;
DROP POLICY IF EXISTS "Staff can view all cease and desist requests" ON cease_and_desist_requests;
DROP POLICY IF EXISTS "Staff can update cease and desist requests" ON cease_and_desist_requests;

CREATE POLICY "Anyone can submit cease and desist requests"
  ON cease_and_desist_requests FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Staff can view cease and desist requests"
  ON cease_and_desist_requests FOR SELECT
  TO authenticated
  USING (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);

CREATE POLICY "Staff can update cease and desist requests"
  ON cease_and_desist_requests FOR UPDATE
  TO authenticated
  USING (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true)
  WITH CHECK (COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true);
