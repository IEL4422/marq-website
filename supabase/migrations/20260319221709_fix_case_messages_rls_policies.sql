/*
  # Fix case_messages RLS Policies for Staff Access

  1. Problem
    - case_messages has outdated policies checking for role='staff'
    - Should check for is_staff=true in app_metadata
    - Some policies use old COALESCE pattern

  2. Changes
    - Drop all existing policies
    - Recreate with correct is_staff checks
    - Simplify to use consistent pattern across all tables
*/

-- Drop all existing policies on case_messages
DROP POLICY IF EXISTS "Clients and staff can send messages" ON case_messages;
DROP POLICY IF EXISTS "Clients and staff can view messages" ON case_messages;
DROP POLICY IF EXISTS "Staff can insert messages" ON case_messages;
DROP POLICY IF EXISTS "Staff can update messages" ON case_messages;
DROP POLICY IF EXISTS "Staff can view all messages" ON case_messages;

-- Staff can view all messages
CREATE POLICY "Staff can view all messages"
  ON case_messages FOR SELECT
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

-- Staff can insert messages
CREATE POLICY "Staff can insert messages"
  ON case_messages FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

-- Staff can update messages (mark as read)
CREATE POLICY "Staff can update messages"
  ON case_messages FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true)
  WITH CHECK ((auth.jwt()->'app_metadata'->>'is_staff')::boolean = true);

-- Clients can view their own case messages
CREATE POLICY "Clients can view their case messages"
  ON case_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM client_cases
      WHERE client_cases.id = case_messages.case_id
        AND client_cases.client_email = (auth.jwt()->>'email')
    )
  );

-- Clients can send messages to their cases
CREATE POLICY "Clients can send messages to their cases"
  ON case_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM client_cases
      WHERE client_cases.id = case_messages.case_id
        AND client_cases.client_email = (auth.jwt()->>'email')
    )
  );
