/*
  # Add Staff Access to All Staff Portal Tables

  1. Policy Updates
    - Add staff role check to contact_submissions policies (SELECT and UPDATE)
    - Add staff role check to trademark_search_requests policies (SELECT and UPDATE)
    - Add staff role check to client_agreements policies (SELECT)
    - Add staff policies for client_cases (UPDATE)
    - Add staff policies for case_messages (UPDATE for marking as read)

  2. Security Notes
    - Staff identification uses `app_metadata.role = 'staff'` which cannot be modified by users
    - This provides secure role-based access control for all staff portal data
*/

-- Contact Submissions: Allow staff to view and update
DROP POLICY IF EXISTS "Authenticated staff can view all contact submissions" ON contact_submissions;
CREATE POLICY "Authenticated staff can view all contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

DROP POLICY IF EXISTS "Authenticated staff can update contact submissions" ON contact_submissions;
CREATE POLICY "Authenticated staff can update contact submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff')
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- Trademark Search Requests: Allow staff to view and update
DROP POLICY IF EXISTS "Authenticated staff can view all trademark requests" ON trademark_search_requests;
CREATE POLICY "Authenticated staff can view all trademark requests"
  ON trademark_search_requests FOR SELECT
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

DROP POLICY IF EXISTS "Authenticated staff can update trademark requests" ON trademark_search_requests;
CREATE POLICY "Authenticated staff can update trademark requests"
  ON trademark_search_requests FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff')
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- Client Agreements: Allow staff to view
DROP POLICY IF EXISTS "Authenticated staff can view all agreements" ON client_agreements;
CREATE POLICY "Authenticated staff can view all agreements"
  ON client_agreements FOR SELECT
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- Client Cases: Allow staff to update
DROP POLICY IF EXISTS "Staff can update cases" ON client_cases;
CREATE POLICY "Staff can update cases"
  ON client_cases FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff')
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- Client Cases: Allow staff to insert new cases
DROP POLICY IF EXISTS "Staff can insert cases" ON client_cases;
CREATE POLICY "Staff can insert cases"
  ON client_cases FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- Case Messages: Allow staff to update (for marking as read)
DROP POLICY IF EXISTS "Staff can update messages" ON case_messages;
CREATE POLICY "Staff can update messages"
  ON case_messages FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff')
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');
