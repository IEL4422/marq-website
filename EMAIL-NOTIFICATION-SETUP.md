# Email Notification Setup

This document explains how email notifications are configured to send alerts to mary@illinoisestatelaw.com whenever there are new inquiries, contact submissions, purchases, or other important events.

## How It Works

The system automatically sends email notifications when:
- New contact form submissions
- New trademark search requests
- New payments/purchases
- New office action requests
- New cease & desist requests
- New trademark intake form completions

## Setup Instructions

### 1. Get Resend API Key

1. Sign up for a free account at [Resend](https://resend.com)
2. Verify your domain `illinoisestatelaw.com` in Resend
   - Add the required DNS records (SPF, DKIM, etc.)
   - This allows emails to be sent from `notifications@illinoisestatelaw.com`
3. Generate an API key from the Resend dashboard

### 2. Add API Key to Supabase

You need to add the `RESEND_API_KEY` as a secret in your Supabase project:

1. Go to your Supabase Dashboard
2. Navigate to Edge Functions → Secrets
3. Add a new secret:
   - Name: `RESEND_API_KEY`
   - Value: `re_xxxxxxxxxxxxx` (your Resend API key)

### 3. Configure Service Role Key (Important!)

The database triggers need access to the service role key to call the edge function. You need to configure this in your Supabase project:

**Option 1: Using Supabase Vault (Recommended)**

```sql
-- Store the service role key in Supabase Vault
SELECT vault.create_secret(
  'service_role_key',
  'your-service-role-key-here',
  'Service role key for internal edge function calls'
);

-- Update the function to use the vault
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
  -- Get service role key from vault
  SELECT decrypted_secret INTO service_role_key
  FROM vault.decrypted_secrets
  WHERE name = 'service_role_key';

  -- Rest of the function logic...
```

**Option 2: Using Database Configuration**

Run this SQL in your Supabase SQL Editor:

```sql
-- Set the service role key as a database configuration parameter
ALTER DATABASE postgres SET supabase.service_role_key TO 'your-service-role-key-here';
```

Your service role key can be found in:
- Supabase Dashboard → Settings → API → service_role key

## Testing

To test that email notifications are working:

1. Submit a test contact form at `/contact`
2. Check mary@illinoisestatelaw.com for a notification email
3. Check the Supabase Edge Functions logs for any errors

## Email Format

Each notification type has a custom email format with:
- Subject line indicating the type of notification
- Timestamp in Central time
- All relevant details from the submission
- Link to view the full details in the Staff Portal

## Troubleshooting

### Emails Not Being Sent

1. Check Edge Function logs in Supabase Dashboard
2. Verify `RESEND_API_KEY` is set correctly
3. Verify service role key is configured
4. Check that your domain is verified in Resend
5. Look for warnings in the database logs

### Database Trigger Errors

The triggers are designed to fail gracefully - if email sending fails, it will log a warning but won't block the database insert. Check the Postgres logs for warnings.

### Testing the Edge Function Directly

You can test the edge function directly:

```bash
curl -X POST 'https://rdmvwansjwgkbgmvpxos.supabase.co/functions/v1/send-email-notification' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -d '{
    "type": "contact_submission",
    "data": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "555-1234",
      "message": "This is a test message"
    }
  }'
```

## Alternative: Using Resend's Test Mode

During development, you can use Resend's test mode which doesn't require domain verification:
- Emails will only be sent to email addresses you've verified in Resend
- You can verify mary@illinoisestatelaw.com individually

## Email Deliverability

For best email deliverability:
1. Verify your domain in Resend
2. Add all required DNS records (SPF, DKIM, DMARC)
3. Use a dedicated sending domain if possible
4. Monitor bounce rates and spam reports in Resend dashboard
