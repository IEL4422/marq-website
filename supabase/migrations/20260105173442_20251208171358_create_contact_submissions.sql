/*
  # Create contact submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text, required) - Name of the person submitting the form
      - `email` (text, required) - Email address of the submitter
      - `message` (text, required) - Message content from the form
      - `created_at` (timestamptz) - Timestamp of submission
      - `notified` (boolean) - Whether Slack notification was sent

  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policy for anyone to insert contact submissions (public form)
    - Add policy for authenticated users to read all submissions
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  notified boolean DEFAULT false
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);