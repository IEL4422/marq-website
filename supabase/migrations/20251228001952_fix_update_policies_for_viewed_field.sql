/*
  # Fix UPDATE policies for contact_submissions and trademark_search_requests

  1. Changes
    - Remove old overly-permissive UPDATE policies for contact_submissions
    - Remove old overly-permissive UPDATE policies for trademark_search_requests
    - Ensure staff users can update the viewed field on both tables
  
  2. Security Notes
    - Staff role is checked via app_metadata which cannot be modified by users
    - Only users with staff role can update submission records
*/

-- Clean up old contact_submissions UPDATE policies
DROP POLICY IF EXISTS "Authenticated users can update contact submissions" ON contact_submissions;

-- Clean up old trademark_search_requests UPDATE policies  
DROP POLICY IF EXISTS "Authenticated users can update trademark search requests" ON trademark_search_requests;

-- Ensure staff policies exist for contact_submissions
DROP POLICY IF EXISTS "Authenticated staff can update contact submissions" ON contact_submissions;
CREATE POLICY "Authenticated staff can update contact submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff')
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

-- Ensure staff policies exist for trademark_search_requests
DROP POLICY IF EXISTS "Authenticated staff can update trademark requests" ON trademark_search_requests;
CREATE POLICY "Authenticated staff can update trademark requests"
  ON trademark_search_requests FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff')
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');