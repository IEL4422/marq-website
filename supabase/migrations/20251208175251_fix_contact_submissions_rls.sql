/*
  # Fix contact submissions RLS policy

  1. Changes
    - Drop existing restrictive policy for anon role only
    - Create new policy that allows anyone (including public) to insert
    - This allows unauthenticated users to submit the contact form

  2. Security
    - Policy uses WITH CHECK (true) which is appropriate for a public contact form
    - Only INSERT permission is granted to unauthenticated users
    - Authenticated users still need separate policies to SELECT data
*/

-- Drop the existing anon-only policy
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;

-- Create a more permissive policy that works for all unauthenticated users
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);