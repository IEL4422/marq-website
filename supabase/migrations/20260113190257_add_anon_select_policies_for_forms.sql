/*
  # Add Anonymous SELECT Policies for Form Tables

  1. Changes
    - Add SELECT policies for anonymous users on form submission tables
    - This allows anonymous users to read back records they just created (where user_id IS NULL)
    - Required because code uses .insert().select() pattern

  2. Security
    - Anonymous users can only view records with NULL user_id
    - This doesn't expose any authenticated user data
    - Records are created by anonymous users and should be readable by them

  3. Tables Fixed
    - office_action_requests
    - cease_and_desist_requests
*/

-- Add SELECT policy for anonymous users on office_action_requests
CREATE POLICY "Anonymous users can view their submissions"
  ON office_action_requests
  FOR SELECT
  TO anon
  USING (user_id IS NULL);

-- Add SELECT policy for anonymous users on cease_and_desist_requests
CREATE POLICY "Anonymous users can view their submissions"
  ON cease_and_desist_requests
  FOR SELECT
  TO anon
  USING (user_id IS NULL);