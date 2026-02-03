/*
  # Fix contact submissions RLS policy - use anon role

  1. Changes
    - Drop existing policy that uses public role
    - Create new policy that explicitly targets anon role
    - This allows unauthenticated users with anon key to submit the contact form

  2. Security
    - Policy grants INSERT permission to anon role (unauthenticated users)
    - Uses WITH CHECK (true) which is appropriate for a public contact form
    - Authenticated users still need separate policies to SELECT data
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;

-- Create policy specifically for anon role (unauthenticated users)
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);