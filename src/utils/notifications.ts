import { supabase } from '../lib/supabase';

export interface NotificationPayload {
  eventType: string;
  data: Record<string, any>;
}

export async function sendZapierNotification(payload: NotificationPayload): Promise<void> {
  try {
    const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/zapier-notification`;

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Zapier notification failed:', await response.text());
    }
  } catch (error) {
    console.error('Error sending Zapier notification:', error);
  }
}

export function notifyContactInquiry(name: string, email: string, message: string, submissionId: string) {
  return sendZapierNotification({
    eventType: 'contact_inquiry',
    data: { name, email, message, submission_id: submissionId }
  });
}

export function notifyTrademarkSearchRequest(
  name: string,
  email: string,
  trademarkName: string,
  businessDescription: string,
  requestId: string
) {
  return sendZapierNotification({
    eventType: 'trademark_search_request',
    data: { name, email, trademark_name: trademarkName, business_description: businessDescription, request_id: requestId }
  });
}

export function notifyPaymentCompleted(
  email: string,
  amount: number,
  packageName: string,
  paymentId: string
) {
  return sendZapierNotification({
    eventType: 'payment_completed',
    data: { email, amount, package_name: packageName, payment_id: paymentId }
  });
}

export function notifyQuestionnaireCompleted(
  name: string,
  email: string,
  trademarkName: string,
  phone: string,
  packageSelected: string,
  responseId: string
) {
  return sendZapierNotification({
    eventType: 'trademark_questionnaire_completed',
    data: { name, email, trademark_name: trademarkName, phone, package_selected: packageSelected, response_id: responseId }
  });
}

export function notifyOfficeActionRequest(
  name: string,
  email: string,
  trademarkName: string,
  phone: string,
  serviceType: string,
  requestId: string
) {
  return sendZapierNotification({
    eventType: 'office_action_request',
    data: { name, email, trademark_name: trademarkName, phone, service_type: serviceType, request_id: requestId }
  });
}

export function notifyCeaseAndDesistRequest(
  name: string,
  email: string,
  trademarkName: string,
  phone: string,
  infringerName: string,
  requestId: string
) {
  return sendZapierNotification({
    eventType: 'cease_and_desist_request',
    data: { name, email, trademark_name: trademarkName, phone, infringer_name: infringerName, request_id: requestId }
  });
}
