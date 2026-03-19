/*
  # Update Email Notification Triggers to Use Environment Variables
  
  1. Purpose
    - Update the notification function to use Supabase environment variables directly
    - Fix permission issues with database configuration parameters
  
  2. Changes
    - Use Supabase's built-in environment variable access
    - Hardcode the Supabase URL since it's not sensitive
*/

-- Update function to send email notification using environment variables
CREATE OR REPLACE FUNCTION notify_email_on_insert()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  payload jsonb;
  notification_type text;
  supabase_url text := 'https://rdmvwansjwgkbgmvpxos.supabase.co';
  service_role_key text;
BEGIN
  -- Get service role key from vault or use environment
  service_role_key := current_setting('supabase.service_role_key', true);
  
  IF service_role_key IS NULL THEN
    -- Fallback: Log error and continue (don't block the insert)
    RAISE WARNING 'Service role key not configured for email notifications';
    RETURN NEW;
  END IF;

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
    url := supabase_url || '/functions/v1/send-email-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body := payload
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block the insert
    RAISE WARNING 'Failed to send email notification: %', SQLERRM;
    RETURN NEW;
END;
$$;
