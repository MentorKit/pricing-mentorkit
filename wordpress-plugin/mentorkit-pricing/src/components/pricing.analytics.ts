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
  // Google Analytics 4 (if available)
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as unknown as { gtag: (cmd: string, event: string, params: object) => void }).gtag('event', name, payload);
  }

  // Dispatch a custom event that can be listened to by other analytics providers
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
