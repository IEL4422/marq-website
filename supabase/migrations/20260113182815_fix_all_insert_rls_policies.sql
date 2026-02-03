/*
  # Fix All INSERT RLS Policies for Forms with User ID

  1. Changes
    - Fix cease_and_desist_requests insert policies
    - Fix trademark_questionnaire_responses insert policies
    - Ensure authenticated users can insert with their own user_id OR null user_id
    - Ensure anonymous users can only insert with null user_id

  2. Security
    - Authenticated users: can insert with user_id = auth.uid() OR user_id IS NULL
    - Anonymous users: can only insert with user_id IS NULL
    - Maintains security while allowing flexible user tracking

  3. Tables Fixed
    - cease_and_desist_requests
    - trademark_questionnaire_responses
*/

-- Fix cease_and_desist_requests policies
DROP POLICY IF EXISTS "Users can insert own cease and desist requests" ON cease_and_desist_requests;
DROP POLICY IF EXISTS "Anonymous users can insert cease and desist requests" ON cease_and_desist_requests;

CREATE POLICY "Authenticated users can insert cease and desist requests"
  ON cease_and_desist_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Anonymous users can insert cease and desist requests"
  ON cease_and_desist_requests
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- Fix trademark_questionnaire_responses policies
DROP POLICY IF EXISTS "Authenticated users can insert questionnaire responses" ON trademark_questionnaire_responses;
DROP POLICY IF EXISTS "Anonymous users can insert questionnaire responses" ON trademark_questionnaire_responses;

CREATE POLICY "Authenticated users can insert questionnaire responses"
  ON trademark_questionnaire_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Anonymous users can insert questionnaire responses"
  ON trademark_questionnaire_responses
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);