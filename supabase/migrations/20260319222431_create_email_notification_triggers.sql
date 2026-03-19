/*
  # Email Notification Triggers
  
  1. Purpose
    - Automatically send email notifications to mary@illinoisestatelaw.com when new records are created
    - Covers contact submissions, trademark search requests, payments, office action requests, cease & desist requests, and questionnaire responses
  
  2. Implementation
    - Creates a helper function to call the send-email-notification edge function
    - Creates triggers on each table to fire after insert
    - Uses pg_net extension to make HTTP requests to the edge function
  
  3. Security
    - Uses service role key for authenticated requests
    - Only triggers on INSERT operations
*/

-- Enable pg_net extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to send email notification
CREATE OR REPLACE FUNCTION notify_email_on_insert()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  payload jsonb;
  notification_type text;
BEGIN
  -- Determine notification type based on table name
  CASE TG_TABLE_NAME
    WHEN 'contact_submissions' THEN
      notification_type := 'contact_submission';
      payload := jsonb_build_object(
        'type', notification_type,
        'data', jsonb_build_object(
          'name', NEW.name,
          'email', NEW.email,
          'phone', NEW.phone,
          'message', NEW.message
        )
      );
    WHEN 'trademark_search_requests' THEN
      notification_type := 'trademark_search_request';
      payload := jsonb_build_object(
        'type', notification_type,
        'data', jsonb_build_object(
          'trademark_name', NEW.trademark_name,
          'contact_name', NEW.contact_name,
          'email', NEW.email,
          'phone', NEW.phone,
          'description', NEW.description
        )
      );
    WHEN 'payments' THEN
      notification_type := 'payment';
      payload := jsonb_build_object(
        'type', notification_type,
        'data', jsonb_build_object(
          'amount', NEW.amount,
          'package_type', NEW.package_type,
          'customer_email', NEW.customer_email,
          'customer_name', NEW.customer_name
        )
      );
    WHEN 'office_action_requests' THEN
      notification_type := 'office_action_request';
      payload := jsonb_build_object(
        'type', notification_type,
        'data', jsonb_build_object(
          'serial_number', NEW.serial_number,
          'contact_name', NEW.contact_name,
          'email', NEW.email,
          'phone', NEW.phone
        )
      );
    WHEN 'cease_and_desist_requests' THEN
      notification_type := 'cease_and_desist_request';
      payload := jsonb_build_object(
        'type', notification_type,
        'data', jsonb_build_object(
          'contact_name', NEW.contact_name,
          'email', NEW.email,
          'phone', NEW.phone,
          'trademark_name', NEW.trademark_name
        )
      );
    WHEN 'trademark_questionnaire_responses' THEN
      notification_type := 'questionnaire_response';
      payload := jsonb_build_object(
        'type', notification_type,
        'data', jsonb_build_object(
          'email', NEW.email,
          'trademark_name', NEW.trademark_name
        )
      );
    ELSE
      RETURN NEW;
  END CASE;

  -- Make async HTTP request to edge function
  PERFORM net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/send-email-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
    ),
    body := payload
  );

  RETURN NEW;
END;
$$;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS send_email_on_contact_submission ON contact_submissions;
DROP TRIGGER IF EXISTS send_email_on_trademark_search ON trademark_search_requests;
DROP TRIGGER IF EXISTS send_email_on_payment ON payments;
DROP TRIGGER IF EXISTS send_email_on_office_action ON office_action_requests;
DROP TRIGGER IF EXISTS send_email_on_cease_and_desist ON cease_and_desist_requests;
DROP TRIGGER IF EXISTS send_email_on_questionnaire_response ON trademark_questionnaire_responses;

-- Create triggers for each table
CREATE TRIGGER send_email_on_contact_submission
  AFTER INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_email_on_insert();

CREATE TRIGGER send_email_on_trademark_search
  AFTER INSERT ON trademark_search_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_email_on_insert();

CREATE TRIGGER send_email_on_payment
  AFTER INSERT ON payments
  FOR EACH ROW
  EXECUTE FUNCTION notify_email_on_insert();

CREATE TRIGGER send_email_on_office_action
  AFTER INSERT ON office_action_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_email_on_insert();

CREATE TRIGGER send_email_on_cease_and_desist
  AFTER INSERT ON cease_and_desist_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_email_on_insert();

CREATE TRIGGER send_email_on_questionnaire_response
  AFTER INSERT ON trademark_questionnaire_responses
  FOR EACH ROW
  EXECUTE FUNCTION notify_email_on_insert();

-- Set configuration for edge function URL (these will be set automatically by Supabase)
-- Users will need to run: 
-- ALTER DATABASE postgres SET app.supabase_url TO 'your-project-url';
-- ALTER DATABASE postgres SET app.supabase_service_role_key TO 'your-service-role-key';
