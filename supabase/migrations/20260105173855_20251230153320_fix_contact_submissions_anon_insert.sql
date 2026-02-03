/*
  # Fix Contact Submissions RLS Policy for Anonymous Inserts

  1. Changes
    - Drop existing anon INSERT policy
    - Create new policy that explicitly allows anonymous users to insert contact form submissions
    - Ensure all required fields can be provided by anonymous users

  2. Security
    - Anonymous users can only INSERT their own submissions
    - No access to update or delete
    - Staff can view and manage all submissions
*/

DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;

CREATE POLICY "Enable insert for anonymous users"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);