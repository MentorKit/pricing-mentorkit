// ============================================================================
// PRICING ANALYTICS - Lightweight event tracking stub
// ============================================================================
// This module provides a vendor-agnostic way to track pricing interactions.
// Wire up to your analytics provider (GA, Segment, Mixpanel, etc.) as needed.
// ============================================================================

export type PricingEventName =
  | 'billing_changed'
  | 'creators_changed'
  | 'active_users_changed'
  | 'cta_clicked'
  | 'pricing_page_viewed';

export interface PricingEventPayload {
  billing?: string;
  creatorsBucketId?: string;
  creatorsValue?: number;
  activeUsersBucketId?: string;
  activeUsersValue?: number;
  planId?: string;
  ctaType?: string;
  source?: string;
  [key: string]: unknown;
}

/**
 * Track a pricing-related event.
 * 
 * @param name - The event name
 * @param payload - Additional event data
 * 
 * @example
 * trackPricingEvent('creators_changed', { creatorsBucketId: 'creators_5', creatorsValue: 5 });
 * trackPricingEvent('cta_clicked', { planId: 'suite_pro', ctaType: 'start_trial' });
 */
export function trackPricingEvent(
  name: PricingEventName,
  payload: PricingEventPayload = {}
): void {
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Pricing Analytics] ${name}`, payload);
  }

  // TODO: Wire up your analytics provider here
  // Examples:
  //
  // Google Analytics 4:
  // gtag('event', name, payload);
  //
  // Segment:
  // analytics.track(name, payload);
  //
  // Mixpanel:
  // mixpanel.track(name, payload);
  //
  // PostHog:
  // posthog.capture(name, payload);

  // For now, just dispatch a custom event that can be listened to
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('pricing-event', {
        detail: { name, payload, timestamp: Date.now() },
      })
    );
  }
}

/**
 * Track when a user clicks a CTA button on the pricing page.
 */
export function trackCtaClick(
  planId: string,
  ctaType: 'start_trial' | 'contact_sales' | 'get_started',
  additionalData: PricingEventPayload = {}
): void {
  trackPricingEvent('cta_clicked', {
    planId,
    ctaType,
    ...additionalData,
  });
}
