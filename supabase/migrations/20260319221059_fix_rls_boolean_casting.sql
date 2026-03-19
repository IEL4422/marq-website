/*
  # Fix RLS Boolean Casting for is_staff Check
  
  1. Problem
    - Current policies use: (auth.jwt()->>'app_metadata')::jsonb->>'is_staff'
    - This extracts is_staff as a string "true" or "false"
    - Then COALESCE compares strings and casts to boolean incorrectly
    
  2. Solution
    - Use: (auth.jwt()->'app_metadata'->>'is_staff')::boolean
    - This properly extracts the boolean value
    - Or use: ((auth.jwt()->'app_metadata')->>'is_staff' = 'true')
    
  3. Tables Fixed
    - All staff portal tables with standardized staff check
*/

-- ============================================================================
-- CONTACT SUBMISSIONS
-- ============================================================================
DROP POLICY IF EXISTS "Staff can view contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Staff can update contact submissions" ON contact_submissions;

CREATE POLICY "Staff can view contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

CREATE POLICY "Staff can update contact submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true)
  WITH CHECK ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

-- ============================================================================
-- TRADEMARK SEARCH REQUESTS
-- ============================================================================
DROP POLICY IF EXISTS "Staff can view trademark searches" ON trademark_search_requests;
DROP POLICY IF EXISTS "Staff can update trademark searches" ON trademark_search_requests;

CREATE POLICY "Staff can view trademark searches"
  ON trademark_search_requests FOR SELECT
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

CREATE POLICY "Staff can update trademark searches"
  ON trademark_search_requests FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true)
  WITH CHECK ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

-- ============================================================================
-- PAYMENTS
-- ============================================================================
DROP POLICY IF EXISTS "Staff can view payments" ON payments;
DROP POLICY IF EXISTS "Staff can update payments" ON payments;

CREATE POLICY "Staff can view payments"
  ON payments FOR SELECT
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

CREATE POLICY "Staff can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true)
  WITH CHECK ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

-- ============================================================================
-- CLIENT AGREEMENTS
-- ============================================================================
DROP POLICY IF EXISTS "Staff can view agreements" ON client_agreements;
DROP POLICY IF EXISTS "Staff can update agreements" ON client_agreements;

CREATE POLICY "Staff can view agreements"
  ON client_agreements FOR SELECT
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

CREATE POLICY "Staff can update agreements"
  ON client_agreements FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true)
  WITH CHECK ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

-- ============================================================================
-- CLIENT CASES
-- ============================================================================
DROP POLICY IF EXISTS "Staff can view cases" ON client_cases;
DROP POLICY IF EXISTS "Staff can insert cases" ON client_cases;
DROP POLICY IF EXISTS "Staff can update cases" ON client_cases;
DROP POLICY IF EXISTS "Staff can delete cases" ON client_cases;

CREATE POLICY "Staff can view cases"
  ON client_cases FOR SELECT
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

CREATE POLICY "Staff can insert cases"
  ON client_cases FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

CREATE POLICY "Staff can update cases"
  ON client_cases FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true)
  WITH CHECK ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

CREATE POLICY "Staff can delete cases"
  ON client_cases FOR DELETE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

-- ============================================================================
-- ANALYTICS EVENTS
-- ============================================================================
DROP POLICY IF EXISTS "Staff can view analytics" ON analytics_events;

CREATE POLICY "Staff can view analytics"
  ON analytics_events FOR SELECT
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

-- ============================================================================
-- TRADEMARK QUESTIONNAIRE RESPONSES
-- ============================================================================
DROP POLICY IF EXISTS "Staff can view questionnaires" ON trademark_questionnaire_responses;
DROP POLICY IF EXISTS "Staff can update questionnaires" ON trademark_questionnaire_responses;

CREATE POLICY "Staff can view questionnaires"
  ON trademark_questionnaire_responses FOR SELECT
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

CREATE POLICY "Staff can update questionnaires"
  ON trademark_questionnaire_responses FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true)
  WITH CHECK ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

-- ============================================================================
-- INCOMPLETE FORM EMAILS
-- ============================================================================
DROP POLICY IF EXISTS "Staff can manage incomplete form emails" ON incomplete_form_emails;

CREATE POLICY "Staff can manage incomplete form emails"
  ON incomplete_form_emails FOR ALL
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true)
  WITH CHECK ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

-- ============================================================================
-- INCOMPLETE FORM VIEWS
-- ============================================================================
DROP POLICY IF EXISTS "Staff can manage incomplete form views" ON incomplete_form_views;

CREATE POLICY "Staff can manage incomplete form views"
  ON incomplete_form_views FOR ALL
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true)
  WITH CHECK ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

-- ============================================================================
-- OFFICE ACTION REQUESTS
-- ============================================================================
DROP POLICY IF EXISTS "Staff can view office action requests" ON office_action_requests;
DROP POLICY IF EXISTS "Staff can update office action requests" ON office_action_requests;

CREATE POLICY "Staff can view office action requests"
  ON office_action_requests FOR SELECT
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

CREATE POLICY "Staff can update office action requests"
  ON office_action_requests FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true)
  WITH CHECK ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

-- ============================================================================
-- CEASE AND DESIST REQUESTS
-- ============================================================================
DROP POLICY IF EXISTS "Staff can view cease and desist requests" ON cease_and_desist_requests;
DROP POLICY IF EXISTS "Staff can update cease and desist requests" ON cease_and_desist_requests;

CREATE POLICY "Staff can view cease and desist requests"
  ON cease_and_desist_requests FOR SELECT
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

CREATE POLICY "Staff can update cease and desist requests"
  ON cease_and_desist_requests FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true)
  WITH CHECK ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);
