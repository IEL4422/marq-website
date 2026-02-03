# Google Ads Conversion Tracking Setup

## Overview

This implementation ensures that Google Ads conversion events fire **only on the production domain** (marqtrademarks.com), preventing tracking from Netlify preview/staging domains.

## Implementation Details

### 1. Domain Allowlist

The conversion tracking is restricted to the following domains:
- `marqtrademarks.com`
- `www.marqtrademarks.com`

All other domains (including `*.netlify.app`) will NOT fire conversion events.

### 2. Code Location

**Utility Function**: `/src/utils/tracking.ts`

This file contains:
- `isProductionDomain()`: Checks if the current hostname matches the production domain allowlist
- `trackConversion()`: Wrapper function that only fires gtag conversion events on production domains

**Usage Example**: `/src/pages/AgreementConfirmationPage.tsx`

This page uses the `trackConversion()` function to fire the purchase conversion event only on production.

### 3. Base Google Tags

The following tags load on **all domains** (for basic analytics):
- Google Tag Manager (GTM-N7FNV4XB)
- Google Analytics (G-8FQMBXQDK5)
- Google Ads Tag (AW-17829534784)

However, **conversion events** only fire on production domains.

## How It Works

1. When a user completes a purchase and reaches the confirmation page
2. The `trackConversion()` function checks the current hostname
3. If the hostname matches the production allowlist → conversion event fires
4. If the hostname does NOT match (e.g., on Netlify preview) → event is blocked with console log

### Console Logging

On **non-production domains**, you'll see:
```
[Tracking Blocked] Conversion event 'ads_conversion_Purchase_1' blocked on domain: deploy-preview-123--yoursite.netlify.app
Conversion events only fire on: marqtrademarks.com, www.marqtrademarks.com
```

On **production domains**, you'll see:
```
[Tracking] Conversion event 'ads_conversion_Purchase_1' fired on production domain
```

## Verification with Google Tag Assistant

### Method 1: Using Tag Assistant Chrome Extension

1. Install [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Navigate to a preview domain (e.g., `deploy-preview-123.netlify.app/agreement-confirmation`)
3. Open Tag Assistant - you should see:
   - Base Google tags loading (GTM, GA, Ads)
   - NO conversion events in the event list
4. Open browser console - you should see the "[Tracking Blocked]" message
5. Navigate to production domain (`marqtrademarks.com/agreement-confirmation`)
6. Open Tag Assistant - you should see:
   - Base Google tags loading
   - The conversion event `ads_conversion_Purchase_1` in the event list
7. Open browser console - you should see the "[Tracking]" message

### Method 2: Using Google Tag Assistant (New)

1. Visit [tagassistant.google.com](https://tagassistant.google.com/)
2. Click "Add domain"
3. Enter your Netlify preview URL
4. Navigate through the purchase flow
5. Check the "Events" tab - conversion events should NOT appear
6. Repeat with production domain - conversion events SHOULD appear

### Method 3: Using Browser DevTools Network Tab

1. Open DevTools → Network tab
2. Filter by "gtm" or "google"
3. On preview domain: Look for requests to Google - no conversion event parameters
4. On production domain: Look for requests containing conversion event data

## Adding More Conversion Events

To add additional conversion events that follow the same domain restrictions:

```typescript
// In your component
import { trackConversion } from '../utils/tracking';

// Fire a conversion event (only on production)
trackConversion('ads_conversion_Lead_1', {
  value: 1.0,
  currency: 'USD'
});
```

## Updating the Domain Allowlist

To add or modify allowed domains, edit `/src/utils/tracking.ts`:

```typescript
const PRODUCTION_DOMAINS = [
  'marqtrademarks.com',
  'www.marqtrademarks.com',
  'custom-domain.com'  // Add additional domains here
];
```

## Testing Checklist

- [ ] Base tags (GTM, GA) load on all domains
- [ ] Console shows "[Tracking Blocked]" message on preview domains
- [ ] Console shows "[Tracking]" message on production domain
- [ ] Tag Assistant shows no conversion events on preview domains
- [ ] Tag Assistant shows conversion events on production domain
- [ ] Google Ads dashboard shows conversions only from production traffic
