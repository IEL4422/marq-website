/*
  # Add UPDATE policy for trademark search requests

  1. Changes
    - Add policy to allow authenticated users to update trademark search requests
    - This enables staff members to update the status of trademark searches

  2. Security
    - Only authenticated users (staff) can update requests
    - Staff can update any request in the system
*/

CREATE POLICY "Authenticated users can update trademark search requests"
  ON trademark_search_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);