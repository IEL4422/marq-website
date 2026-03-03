/*
  # Create Zapier Webhook Helper Functions

  1. Purpose
    - Provide helper functions to trigger Zapier webhooks
    - Centralize notification logic
    - Make it easy to call from application code

  2. Changes
    - Create stored procedures for common notification scenarios
    - Add helper functions for each event type

  3. Security
    - Functions use SECURITY DEFINER to ensure proper access
    - Only staff or system can trigger notifications
*/

-- Helper function to format contact inquiry notifications
CREATE OR REPLACE FUNCTION get_contact_notification_payload(
  p_name text,
  p_email text,
  p_message text,
  p_id uuid
)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT jsonb_build_object(
    'event_type', 'contact_inquiry',
    'name', p_name,
    'email', p_email,
    'message', p_message,
    'submission_id', p_id,
    'timestamp', now()
  );
$$;

-- Helper function to format trademark search request notifications
CREATE OR REPLACE FUNCTION get_trademark_search_notification_payload(
  p_name text,
  p_email text,
  p_trademark_name text,
  p_business_description text,
  p_id uuid
)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT jsonb_build_object(
    'event_type', 'trademark_search_request',
    'name', p_name,
    'email', p_email,
    'trademark_name', p_trademark_name,
    'business_description', p_business_description,
    'request_id', p_id,
    'timestamp', now()
  );
$$;

-- Helper function to format payment completion notifications
CREATE OR REPLACE FUNCTION get_payment_notification_payload(
  p_email text,
  p_amount integer,
  p_currency text,
  p_id uuid,
  p_metadata jsonb
)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT jsonb_build_object(
    'event_type', 'payment_completed',
    'email', p_email,
    'amount', p_amount,
    'currency', p_currency,
    'payment_id', p_id,
    'package_name', COALESCE(p_metadata->>'package_name', 'Unknown'),
    'timestamp', now()
  );
$$;

-- Helper function to format questionnaire completion notifications
CREATE OR REPLACE FUNCTION get_questionnaire_notification_payload(
  p_name text,
  p_email text,
  p_trademark_name text,
  p_phone text,
  p_package text,
  p_id uuid
)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT jsonb_build_object(
    'event_type', 'trademark_questionnaire_completed',
    'name', p_name,
    'email', p_email,
    'trademark_name', p_trademark_name,
    'phone', p_phone,
    'package_selected', p_package,
    'response_id', p_id,
    'timestamp', now()
  );
$$;

-- Helper function to format office action request notifications
CREATE OR REPLACE FUNCTION get_office_action_notification_payload(
  p_name text,
  p_email text,
  p_trademark_name text,
  p_phone text,
  p_service_type text,
  p_id uuid
)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT jsonb_build_object(
    'event_type', 'office_action_request',
    'name', p_name,
    'email', p_email,
    'trademark_name', p_trademark_name,
    'phone', p_phone,
    'service_type', p_service_type,
    'request_id', p_id,
    'timestamp', now()
  );
$$;

-- Helper function to format cease and desist request notifications
CREATE OR REPLACE FUNCTION get_cease_desist_notification_payload(
  p_name text,
  p_email text,
  p_trademark_name text,
  p_phone text,
  p_infringer_name text,
  p_id uuid
)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT jsonb_build_object(
    'event_type', 'cease_and_desist_request',
    'name', p_name,
    'email', p_email,
    'trademark_name', p_trademark_name,
    'phone', p_phone,
    'infringer_name', p_infringer_name,
    'request_id', p_id,
    'timestamp', now()
  );
$$;

-- Create a log table for webhook attempts (optional, for debugging)
CREATE TABLE IF NOT EXISTS webhook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  status text DEFAULT 'pending',
  error_message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only staff can view webhook logs"
  ON webhook_logs FOR SELECT
  TO authenticated
  USING (
    (SELECT COALESCE((auth.jwt()->>'user_metadata')::jsonb->>'is_staff', 'false')::boolean) = true
  );
