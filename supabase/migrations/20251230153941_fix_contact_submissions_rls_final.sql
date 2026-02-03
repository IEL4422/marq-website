/*
  # Final Fix for Contact Submissions RLS

  1. Changes
    - Drop all existing INSERT policies
    - Create a simple, explicit policy for anon role only
    - Remove any potential conflicts

  2. Security
    - Anonymous users can INSERT contact form submissions
    - Staff can view and manage submissions
*/

-- Drop all existing INSERT policies
DROP POLICY IF EXISTS "Enable insert for anon and public" ON contact_submissions;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;

-- Create explicit INSERT policy for anon role
CREATE POLICY "Anon users can insert contact submissions"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);
