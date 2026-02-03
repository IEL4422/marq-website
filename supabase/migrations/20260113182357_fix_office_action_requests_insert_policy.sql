/*
  # Fix Office Action Requests Insert Policy

  1. Changes
    - Drop existing insert policies for office action requests
    - Create a single comprehensive insert policy for both authenticated and anonymous users
    - Allow users to insert records with their own user_id or null user_id

  2. Security
    - Authenticated users can insert with their own user_id or null
    - Anonymous users can insert with null user_id only
*/

-- Drop existing insert policies
DROP POLICY IF EXISTS "Users can insert own office action requests" ON office_action_requests;
DROP POLICY IF EXISTS "Anonymous users can insert office action requests" ON office_action_requests;

-- Create new comprehensive insert policy for authenticated users
CREATE POLICY "Authenticated users can insert office action requests"
  ON office_action_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Create insert policy for anonymous users
CREATE POLICY "Anonymous users can insert office action requests"
  ON office_action_requests
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);