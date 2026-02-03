/*
  # Fix Contact Submissions RLS Policy for Anonymous Inserts - Version 2

  1. Changes
    - Drop existing anon INSERT policy
    - Create new policy that allows both anon and public roles to insert
    - Simplify the policy to ensure anonymous form submissions work

  2. Security
    - Anonymous users can only INSERT
    - Staff can view and manage all submissions
*/

DROP POLICY IF EXISTS "Enable insert for anonymous users" ON contact_submissions;

CREATE POLICY "Enable insert for anon and public"
  ON contact_submissions
  FOR INSERT
  TO anon, public
  WITH CHECK (true);