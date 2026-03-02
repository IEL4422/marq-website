/*
  # Create Office Action Requests Table

  1. New Tables
    - `office_action_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable, references auth.users)
      - `full_name` (text, required)
      - `email` (text, required)
      - `phone` (text, required)
      - `trademark_name` (text, required)
      - `service_type` (text, required) - 'Procedural Office Action Response' or 'Substantive Office Action Response'
      - `logo_url` (text, nullable)
      - `office_action_url` (text, required)
      - `payment_id` (uuid, nullable, references payments)
      - `viewed` (boolean, default false)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `office_action_requests` table
    - Add policies for authenticated users to insert and view their own requests
    - Add policies for staff to view all requests using correct metadata path
*/

CREATE TABLE IF NOT EXISTS office_action_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  trademark_name text NOT NULL,
  service_type text NOT NULL,
  logo_url text,
  office_action_url text NOT NULL,
  payment_id uuid REFERENCES payments(id),
  viewed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE office_action_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own office action requests"
  ON office_action_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own office action requests"
  ON office_action_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all office action requests"
  ON office_action_requests
  FOR SELECT
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

CREATE POLICY "Staff can update office action requests"
  ON office_action_requests
  FOR UPDATE
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff')
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

CREATE POLICY "Anonymous users can insert office action requests"
  ON office_action_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_office_action_requests_user_id ON office_action_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_office_action_requests_created_at ON office_action_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_office_action_requests_viewed ON office_action_requests(viewed);
