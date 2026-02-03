/*
  # Create Cease and Desist Requests Table

  1. New Tables
    - `cease_and_desist_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable, references auth.users)
      - `full_name` (text, required)
      - `email` (text, required)
      - `phone` (text, required)
      - `trademark_name` (text, required)
      - `logo_url` (text, nullable)
      - `trademark_filed_date` (date, required)
      - `trademark_accepted_date` (date, nullable)
      - `infringer_name` (text, required)
      - `infringer_contact` (text, nullable)
      - `infringement_description` (text, required)
      - `infringement_evidence_urls` (text[], nullable)
      - `desired_outcome` (text, required)
      - `additional_info` (text, nullable)
      - `payment_id` (uuid, nullable, references payments)
      - `viewed` (boolean, default false)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `cease_and_desist_requests` table
    - Add policies for authenticated users to insert and view their own requests
    - Add policies for staff to view all requests
*/

CREATE TABLE IF NOT EXISTS cease_and_desist_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  trademark_name text NOT NULL,
  logo_url text,
  trademark_filed_date date NOT NULL,
  trademark_accepted_date date,
  infringer_name text NOT NULL,
  infringer_contact text,
  infringement_description text NOT NULL,
  infringement_evidence_urls text[],
  desired_outcome text NOT NULL,
  additional_info text,
  payment_id uuid REFERENCES payments(id),
  viewed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cease_and_desist_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own cease and desist requests"
  ON cease_and_desist_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own cease and desist requests"
  ON cease_and_desist_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all cease and desist requests"
  ON cease_and_desist_requests
  FOR SELECT
  TO authenticated
  USING (
    (SELECT (auth.jwt()->>'raw_app_meta_data')::json->>'role') = 'staff'
  );

CREATE POLICY "Staff can update cease and desist requests"
  ON cease_and_desist_requests
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT (auth.jwt()->>'raw_app_meta_data')::json->>'role') = 'staff'
  )
  WITH CHECK (
    (SELECT (auth.jwt()->>'raw_app_meta_data')::json->>'role') = 'staff'
  );

CREATE POLICY "Anonymous users can insert cease and desist requests"
  ON cease_and_desist_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_cease_and_desist_requests_user_id ON cease_and_desist_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_cease_and_desist_requests_created_at ON cease_and_desist_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cease_and_desist_requests_viewed ON cease_and_desist_requests(viewed);
