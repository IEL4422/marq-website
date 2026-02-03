import { supabase } from '../lib/supabase';

const PRODUCTION_DOMAINS = [
  'marqtrademarks.com',
  'www.marqtrademarks.com'
];

export function isProductionDomain(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const hostname = window.location.hostname;
  return PRODUCTION_DOMAINS.includes(hostname);
}

export function trackConversion(conversionId: string, params: Record<string, any> = {}): void {
  if (!isProductionDomain()) {
    console.log(`[Tracking Blocked] Conversion event '${conversionId}' blocked on domain: ${window.location.hostname}`);
    console.log('Conversion events only fire on:', PRODUCTION_DOMAINS.join(', '));
    return;
  }

  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'conversion', {
      'send_to': conversionId,
      ...params
    });
    console.log(`[Tracking] Conversion event '${conversionId}' fired on production domain`);
  } else {
    console.warn('[Tracking] gtag is not available');
  }
}

export async function trackAnalyticsEvent(eventType: string, eventData: Record<string, any> = {}): Promise<void> {
  try {
    const { data, error } = await supabase.from('analytics_events').insert({
      event_type: eventType,
      event_data: eventData,
      user_agent: navigator.userAgent
    });

    if (error) {
      console.error('Error tracking analytics event:', error);
      console.error('Event type:', eventType);
      console.error('Event data:', eventData);
    } else {
      console.log('Analytics event tracked successfully:', eventType);
    }
  } catch (error) {
    console.error('Exception tracking analytics event:', error);
  }
}
