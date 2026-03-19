/*
  # Fix Staff RLS Policies

  1. Purpose
    - Fix all staff RLS policies to check app_metadata instead of user_metadata
    - Ensure consistent staff access across all tables

  2. Changes
    - Update all policies to use (auth.jwt()->>'app_metadata')::jsonb->>'is_staff'
    - This is secure because app_metadata cannot be modified by users

  3. Security
    - app_metadata is server-controlled and secure
    - Only users with is_staff=true in app_metadata can access staff data
*/

-- Drop and recreate all staff policies with correct metadata check

-- Contact Submissions
DROP POLICY IF EXISTS "Staff can view all contact submissions" ON contact_submissions;
CREATE POLICY "Staff can view all contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

DROP POLICY IF EXISTS "Staff can update contact submissions" ON contact_submissions;
CREATE POLICY "Staff can update contact submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  )
  WITH CHECK (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

-- Trademark Search Requests
DROP POLICY IF EXISTS "Staff can view all trademark search requests" ON trademark_search_requests;
CREATE POLICY "Staff can view all trademark search requests"
  ON trademark_search_requests FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

DROP POLICY IF EXISTS "Staff can update trademark search requests" ON trademark_search_requests;
CREATE POLICY "Staff can update trademark search requests"
  ON trademark_search_requests FOR UPDATE
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  )
  WITH CHECK (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

-- Payments
DROP POLICY IF EXISTS "Staff can view all payments" ON payments;
CREATE POLICY "Staff can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

DROP POLICY IF EXISTS "Staff can update payments" ON payments;
CREATE POLICY "Staff can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  )
  WITH CHECK (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

-- Client Agreements
DROP POLICY IF EXISTS "Staff can view all client agreements" ON client_agreements;
CREATE POLICY "Staff can view all client agreements"
  ON client_agreements FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

DROP POLICY IF EXISTS "Staff can update client agreements" ON client_agreements;
CREATE POLICY "Staff can update client agreements"
  ON client_agreements FOR UPDATE
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  )
  WITH CHECK (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

-- Client Cases
DROP POLICY IF EXISTS "Staff can view all cases" ON client_cases;
CREATE POLICY "Staff can view all cases"
  ON client_cases FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

DROP POLICY IF EXISTS "Staff can update cases" ON client_cases;
CREATE POLICY "Staff can update cases"
  ON client_cases FOR UPDATE
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  )
  WITH CHECK (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

DROP POLICY IF EXISTS "Staff can insert cases" ON client_cases;
CREATE POLICY "Staff can insert cases"
  ON client_cases FOR INSERT
  TO authenticated
  WITH CHECK (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

-- Case Messages
DROP POLICY IF EXISTS "Staff can view all messages" ON case_messages;
CREATE POLICY "Staff can view all messages"
  ON case_messages FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

DROP POLICY IF EXISTS "Staff can insert messages" ON case_messages;
CREATE POLICY "Staff can insert messages"
  ON case_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

DROP POLICY IF EXISTS "Staff can update messages" ON case_messages;
CREATE POLICY "Staff can update messages"
  ON case_messages FOR UPDATE
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  )
  WITH CHECK (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

-- Trademark Questionnaire Responses
DROP POLICY IF EXISTS "Staff can view all questionnaire responses" ON trademark_questionnaire_responses;
CREATE POLICY "Staff can view all questionnaire responses"
  ON trademark_questionnaire_responses FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

DROP POLICY IF EXISTS "Staff can update questionnaire responses" ON trademark_questionnaire_responses;
CREATE POLICY "Staff can update questionnaire responses"
  ON trademark_questionnaire_responses FOR UPDATE
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  )
  WITH CHECK (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

-- Office Action Requests
DROP POLICY IF EXISTS "Staff can view all office action requests" ON office_action_requests;
CREATE POLICY "Staff can view all office action requests"
  ON office_action_requests FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

DROP POLICY IF EXISTS "Staff can update office action requests" ON office_action_requests;
CREATE POLICY "Staff can update office action requests"
  ON office_action_requests FOR UPDATE
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  )
  WITH CHECK (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

-- Cease and Desist Requests
DROP POLICY IF EXISTS "Staff can view all cease and desist requests" ON cease_and_desist_requests;
CREATE POLICY "Staff can view all cease and desist requests"
  ON cease_and_desist_requests FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

DROP POLICY IF EXISTS "Staff can update cease and desist requests" ON cease_and_desist_requests;
CREATE POLICY "Staff can update cease and desist requests"
  ON cease_and_desist_requests FOR UPDATE
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  )
  WITH CHECK (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

-- Analytics Events
DROP POLICY IF EXISTS "Only staff can view analytics" ON analytics_events;
CREATE POLICY "Only staff can view analytics"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

-- Incomplete Form Emails
DROP POLICY IF EXISTS "Staff can view incomplete form emails" ON incomplete_form_emails;
CREATE POLICY "Staff can view incomplete form emails"
  ON incomplete_form_emails FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

DROP POLICY IF EXISTS "Staff can insert incomplete form emails" ON incomplete_form_emails;
CREATE POLICY "Staff can insert incomplete form emails"
  ON incomplete_form_emails FOR INSERT
  TO authenticated
  WITH CHECK (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

-- Incomplete Form Views
DROP POLICY IF EXISTS "Staff can view incomplete form views" ON incomplete_form_views;
CREATE POLICY "Staff can view incomplete form views"
  ON incomplete_form_views FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

DROP POLICY IF EXISTS "Staff can insert incomplete form views" ON incomplete_form_views;
CREATE POLICY "Staff can insert incomplete form views"
  ON incomplete_form_views FOR INSERT
  TO authenticated
  WITH CHECK (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );

-- Webhook Logs
DROP POLICY IF EXISTS "Only staff can view webhook logs" ON webhook_logs;
CREATE POLICY "Only staff can view webhook logs"
  ON webhook_logs FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'app_metadata')::jsonb->>'is_staff', 'false')::boolean = true
  );
