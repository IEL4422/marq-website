/*
  # Add INSERT Policy for Authenticated Users on Trademark Requests

  1. Changes
    - Add policy to allow authenticated users to submit trademark search requests
    - This ensures users who are logged in can also use the trademark search form

  2. Security
    - Authenticated users can insert trademark search requests
    - Maintains existing anonymous user access
*/

CREATE POLICY "Authenticated users can submit trademark search requests"
  ON trademark_search_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);