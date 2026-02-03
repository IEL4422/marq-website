/*
  # Add Authenticated User INSERT Policy for Contact Submissions

  1. Changes
    - Add INSERT policy for authenticated users
    - This allows both anonymous AND authenticated users to submit contact forms

  2. Security
    - Both anonymous and authenticated users can submit contact forms
    - Staff can view and manage all submissions
*/

-- Add INSERT policy for authenticated users
CREATE POLICY "Authenticated users can insert contact submissions"
  ON contact_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
