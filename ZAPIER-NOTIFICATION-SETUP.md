# Zapier Notification System

This document describes the comprehensive notification system that automatically sends Zapier webhooks for all important business events.

## Overview

The system sends real-time notifications to Zapier whenever:
- Someone submits a contact form
- A trademark search request is submitted
- A payment is completed
- A trademark questionnaire is completed
- An office action request is submitted
- A cease and desist request is submitted

## Architecture

### 1. Unified Webhook Endpoint
- **Edge Function**: `zapier-notification`
- **URL**: `https://rdmvwansjwgkbgmvpxos.supabase.co/functions/v1/zapier-notification`
- **Zapier Webhook URL**: `https://hooks.zapier.com/hooks/catch/19553629/uwuwu7l/`

### 2. Frontend Utility
- **File**: `src/utils/notifications.ts`
- Provides helper functions for each event type
- Automatically formats payloads correctly

### 3. Event Types

#### Contact Inquiry
```json
{
  "event_type": "contact_inquiry",
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I need help with...",
  "submission_id": "uuid",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### Trademark Search Request
```json
{
  "event_type": "trademark_search_request",
  "name": "John Doe",
  "email": "john@example.com",
  "trademark_name": "My Brand",
  "business_description": "E-commerce",
  "request_id": "uuid",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### Payment Completed
```json
{
  "event_type": "payment_completed",
  "email": "john@example.com",
  "amount": 49900,
  "currency": "usd",
  "package_name": "Standard Package",
  "payment_id": "uuid",
  "stripe_payment_intent_id": "pi_xxx",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### Trademark Questionnaire Completed
```json
{
  "event_type": "trademark_questionnaire_completed",
  "name": "John Doe",
  "email": "john@example.com",
  "trademark_name": "My Brand",
  "phone": "+1234567890",
  "package_selected": "Standard Package",
  "response_id": "uuid",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### Office Action Request
```json
{
  "event_type": "office_action_request",
  "name": "John Doe",
  "email": "john@example.com",
  "trademark_name": "My Brand",
  "phone": "+1234567890",
  "service_type": "Procedural Office Action Response",
  "request_id": "uuid",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### Cease and Desist Request
```json
{
  "event_type": "cease_and_desist_request",
  "name": "John Doe",
  "email": "john@example.com",
  "trademark_name": "My Brand",
  "phone": "+1234567890",
  "infringer_name": "Acme Corp",
  "request_id": "uuid",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Integration Points

### 1. Contact Form
- **File**: `src/components/ContactForm.tsx`
- **Trigger**: After successful database insert
- **Function**: `notifyContactInquiry()`

### 2. Trademark Search Request
- **File**: `src/pages/TrademarkSearchRequestPage.tsx`
- **Trigger**: After payment success and database insert
- **Function**: `notifyTrademarkSearchRequest()`

### 3. Payment Completion
- **File**: `supabase/functions/stripe-webhook/index.ts`
- **Trigger**: When Stripe webhook receives `payment_intent.succeeded`
- **Direct**: Calls Zapier notification endpoint directly

### 4. Trademark Questionnaire
- **File**: `src/pages/GetStartedPage.tsx`
- **Trigger**: After successful form submission
- **Function**: `notifyQuestionnaireCompleted()`

### 5. Office Action Request
- **File**: `src/pages/OfficeActionIntakePage.tsx`
- **Trigger**: After database insert
- **Function**: `notifyOfficeActionRequest()`

### 6. Cease and Desist Request
- **File**: `src/pages/CeaseAndDesistIntakePage.tsx`
- **Trigger**: After database insert
- **Function**: `notifyCeaseAndDesistRequest()`

## How It Works

1. **User Action**: User submits a form or completes a purchase
2. **Database Insert**: Data is saved to the appropriate Supabase table
3. **Notification Trigger**: Frontend calls the notification utility function
4. **Edge Function**: The unified Zapier notification edge function receives the payload
5. **Zapier Webhook**: The edge function forwards the formatted payload to Zapier
6. **Zapier Processing**: Zapier receives the webhook and can route it to Slack, email, CRM, etc.

## Error Handling

- All notifications are sent asynchronously
- Failures do not block the main user flow
- Errors are logged to the console for debugging
- Database operations complete successfully even if notifications fail

## Testing

To test the notification system:

1. Submit a contact form at `/contact`
2. Request a trademark search at `/trademark-search-request`
3. Complete a purchase through the checkout flow
4. Submit the get-started questionnaire
5. Request an office action response
6. Request a cease and desist letter

Each action should trigger a webhook to Zapier with the appropriate event data.

## Zapier Setup

In your Zapier account:

1. Create a new Zap
2. Choose "Webhooks by Zapier" as the trigger
3. Select "Catch Hook"
4. Use the webhook URL: `https://hooks.zapier.com/hooks/catch/19553629/uwuwu7l/`
5. Set up filters based on `event_type` field
6. Connect to Slack, email, or other services as needed

Example Zapier filter:
- If `event_type` equals `contact_inquiry` → Send to Slack channel
- If `event_type` equals `payment_completed` → Send email + Slack notification
- If `event_type` equals `office_action_request` → Create task in project management tool

## Benefits

- **Real-time notifications**: Instant alerts when important events occur
- **Centralized system**: All notifications go through one unified endpoint
- **Easy to extend**: Add new event types by creating new helper functions
- **Reliable**: Failures don't impact user experience
- **Flexible**: Zapier can route to any service (Slack, email, CRM, etc.)
