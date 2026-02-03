/*
  # Add User UPDATE Policies for Form Tables

  1. Changes
    - Add UPDATE policy for trademark_questionnaire_responses (users can update their own responses)
    - Add UPDATE policy for office_action_requests (users can update their own requests)
    - Add UPDATE policy for cease_and_desist_requests (users can update their own requests)

  2. Security
    - Users can only update records where user_id = auth.uid()
    - Users cannot update other users' records
    - Staff UPDATE policies remain unchanged

  3. Tables Fixed
    - trademark_questionnaire_responses
    - office_action_requests
    - cease_and_desist_requests
*/

-- Add user UPDATE policy for trademark_questionnaire_responses
CREATE POLICY "Users can update own questionnaire responses"
  ON trademark_questionnaire_responses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add user UPDATE policy for office_action_requests
CREATE POLICY "Users can update own office action requests"
  ON office_action_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add user UPDATE policy for cease_and_desist_requests
CREATE POLICY "Users can update own cease and desist requests"
  ON cease_and_desist_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);