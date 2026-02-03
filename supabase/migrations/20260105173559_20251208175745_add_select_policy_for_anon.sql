/*
  # Add SELECT policy for anon role

  1. Changes
    - Add SELECT policy allowing anon role to view contact submissions
    - This fixes the issue where .select() after .insert() fails due to lack of SELECT permission

  2. Security
    - Anon users can view all contact submissions
    - This allows the form to return the inserted data after submission
*/

CREATE POLICY "Anon users can view submissions"
  ON contact_submissions
  FOR SELECT
  TO anon
  USING (true);