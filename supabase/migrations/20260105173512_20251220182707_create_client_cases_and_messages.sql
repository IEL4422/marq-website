/*
  # Create Client Cases and Messaging System

  1. New Tables
    - `client_cases`
      - `id` (uuid, primary key)
      - `client_email` (text) - email of the client
      - `client_name` (text) - name of the client
      - `trademark_name` (text) - name of the trademark
      - `status` (text) - current status of the case
      - `created_at` (timestamptz) - when case was created
      - `updated_at` (timestamptz) - when status was last updated
      - `notes` (text) - internal notes for staff

    - `case_messages`
      - `id` (uuid, primary key)
      - `case_id` (uuid, foreign key to client_cases)
      - `sender_email` (text) - email of sender
      - `sender_name` (text) - name of sender
      - `message` (text) - message content
      - `is_staff` (boolean) - true if sent by staff, false if sent by client
      - `created_at` (timestamptz) - when message was sent
      - `read` (boolean) - whether message has been read

  2. Security
    - Enable RLS on both tables
    - Clients can view their own cases based on email
    - Clients can view messages for their cases
    - Clients can insert messages for their cases
    - Staff (authenticated users) can view and manage all cases
    - Staff can view and send all messages

  3. Status Values
    - "Search Underway" - Trademark search in progress
    - "Registration Submitted" - Application submitted to USPTO
    - "Processing with USPTO" - USPTO is processing the application
    - "Successfully Registered" - Trademark has been registered
*/

CREATE TABLE IF NOT EXISTS client_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_email text NOT NULL,
  client_name text NOT NULL,
  trademark_name text NOT NULL,
  status text NOT NULL DEFAULT 'Search Underway',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  notes text DEFAULT ''
);

CREATE TABLE IF NOT EXISTS case_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES client_cases(id) ON DELETE CASCADE,
  sender_email text NOT NULL,
  sender_name text NOT NULL,
  message text NOT NULL,
  is_staff boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

ALTER TABLE client_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view their own cases"
  ON client_cases FOR SELECT
  TO anon
  USING (client_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Staff can view all cases"
  ON client_cases FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can insert cases"
  ON client_cases FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Staff can update cases"
  ON client_cases FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Staff can delete cases"
  ON client_cases FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Clients can view messages for their cases"
  ON case_messages FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM client_cases
      WHERE client_cases.id = case_messages.case_id
      AND client_cases.client_email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

CREATE POLICY "Staff can view all messages"
  ON case_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Clients can send messages for their cases"
  ON case_messages FOR INSERT
  TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM client_cases
      WHERE client_cases.id = case_messages.case_id
      AND client_cases.client_email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

CREATE POLICY "Staff can send messages"
  ON case_messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Staff can update messages"
  ON case_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_client_cases_email ON client_cases(client_email);
CREATE INDEX IF NOT EXISTS idx_case_messages_case_id ON case_messages(case_id);
CREATE INDEX IF NOT EXISTS idx_case_messages_created_at ON case_messages(created_at DESC);