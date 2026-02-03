/*
  # Add Contacted Status to Contact Submissions

  1. Changes
    - Add `contacted` column to track if staff has contacted the submitter
    - Add UPDATE policy for authenticated users to mark submissions as contacted

  2. Security
    - Allow authenticated users to update contact submissions
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'contacted'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN contacted boolean DEFAULT false;
  END IF;
END $$;

CREATE POLICY "Authenticated users can update contact submissions"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);