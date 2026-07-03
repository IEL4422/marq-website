export interface NotificationPayload {
  eventType: string;
  data: Record<string, any>;
}

export async function sendZapierNotification(payload: NotificationPayload): Promise<void> {
  try {
    const res = await fetch('/api/notifications/zapier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) console.error('Zapier notification failed:', await res.text());
  } catch (err) {
    console.error('Error sending Zapier notification:', err);
  }
}

export const notifyContactInquiry = (name: string, email: string, message: string, submissionId: string) =>
  sendZapierNotification({ eventType: 'contact_inquiry', data: { name, email, message, submission_id: submissionId } });

export const notifyTrademarkSearchRequest = (name: string, email: string, trademarkName: string, businessDescription: string, requestId: string) =>
  sendZapierNotification({ eventType: 'trademark_search_request', data: { name, email, trademark_name: trademarkName, business_description: businessDescription, request_id: requestId } });

export const notifyPaymentCompleted = (email: string, amount: number, packageName: string, paymentId: string) =>
  sendZapierNotification({ eventType: 'payment_completed', data: { email, amount, package_name: packageName, payment_id: paymentId } });

export const notifyQuestionnaireCompleted = (name: string, email: string, trademarkName: string, phone: string, packageSelected: string, responseId: string) =>
  sendZapierNotification({ eventType: 'trademark_questionnaire_completed', data: { name, email, trademark_name: trademarkName, phone, package_selected: packageSelected, response_id: responseId } });

export const notifyOfficeActionRequest = (name: string, email: string, trademarkName: string, phone: string, serviceType: string, requestId: string) =>
  sendZapierNotification({ eventType: 'office_action_request', data: { name, email, trademark_name: trademarkName, phone, service_type: serviceType, request_id: requestId } });

export const notifyCeaseAndDesistRequest = (name: string, email: string, trademarkName: string, phone: string, infringerName: string, requestId: string) =>
  sendZapierNotification({ eventType: 'cease_and_desist_request', data: { name, email, trademark_name: trademarkName, phone, infringer_name: infringerName, request_id: requestId } });
