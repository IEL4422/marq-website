const PRODUCTION_DOMAINS = ['marqtrademarks.com', 'www.marqtrademarks.com'];

export function isProductionDomain(): boolean {
  if (typeof window === 'undefined') return false;
  return PRODUCTION_DOMAINS.includes(window.location.hostname);
}

export function trackConversion(conversionId: string, params: Record<string, any> = {}): void {
  if (!isProductionDomain()) {
    console.log(`[Tracking Blocked] '${conversionId}' on ${window.location.hostname}`);
    return;
  }
  if (typeof (window as any).gtag !== 'undefined') {
    (window as any).gtag('event', 'conversion', { send_to: conversionId, ...params });
  }
}

export async function trackAnalyticsEvent(eventType: string, eventData: Record<string, any> = {}): Promise<void> {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType, eventData, userAgent: navigator.userAgent }),
    });
  } catch {
    // non-critical — silently ignore
  }
}
