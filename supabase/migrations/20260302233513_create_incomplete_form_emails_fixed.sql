/*
  # Track Incomplete Form Emails

  1. New Tables
    - `incomplete_form_emails`
      - `id` (uuid, primary key)
      - `session_id` (text, unique) - The analytics session ID for the incomplete form
      - `email` (text) - The email address the form was sent to
      - `sent_at` (timestamptz) - When the email was sent
      - `sent_by` (uuid) - Staff user who sent the email (references auth.users)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `incomplete_form_emails` table
    - Add policy for staff users to insert records using correct metadata path
    - Add policy for staff users to view records using correct metadata path
*/

CREATE TABLE IF NOT EXISTS incomplete_form_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  email text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  sent_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE incomplete_form_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can insert incomplete form email records"
  ON incomplete_form_emails
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

CREATE POLICY "Staff can view incomplete form email records"
  ON incomplete_form_emails
  FOR SELECT
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

CREATE INDEX IF NOT EXISTS idx_incomplete_form_emails_session_id 
  ON incomplete_form_emails(session_id);

CREATE INDEX IF NOT EXISTS idx_incomplete_form_emails_sent_at 
  ON incomplete_form_emails(sent_at DESC);
