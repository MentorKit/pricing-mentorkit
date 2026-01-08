// ============================================================================
// PRICING ENGINE - Pure functions for computing pricing view models
// ============================================================================

import {
  type BillingCycle,
  type PlanId,
  PLANS,
  CREATOR_BUCKETS,
  ACTIVE_USERS_BUCKETS,
  CREATOR_PRICE_NOK_PER_MONTH,
  CREATOR_VOLUME_DISCOUNTS,
  SUITE_CLASSIC_USER_PRICES,
  SUITE_PRO_USER_PRICES,
  YEARLY_DISCOUNT,
  DISPLAY_CONFIG,
} from './pricing.config';

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export interface PricingState {
  billing: BillingCycle;
  creatorsBucketIndex: number;
  activeUsersBucketIndex: number;
}

export interface PlanViewModel {
  id: PlanId;
  title: string;
  subtitle: string;
  displayPrice: string; // e.g., "kr 5,200" or "Contact us"
  priceNote: string; // e.g., "/ month" or "billed annually"
  includedLabel: string; // e.g., "2 course creators" or "2 creators + 250 active users"
  ctaLabel: string;
  ctaHref: string;
  features: string[];
  isHighlighted: boolean;
  isContactSales: boolean;
  rawPrice: number | null; // for sorting/comparison, null if contact sales
  includesLms: boolean;
}

export interface PricingSelection {
  plans: PlanViewModel[];
  selectedCreatorsBucket: {
    id: string;
    label: string;
    value: number;
  };
  selectedActiveUsersBucket: {
    id: string;
    label: string;
    value: number;
  };
  state: PricingState;
}

// ----------------------------------------------------------------------------
// Helper Functions
// ----------------------------------------------------------------------------

function formatPrice(price: number): string {
  const { currencySymbol } = DISPLAY_CONFIG;
  // Format with space as thousands separator (Norwegian style)
  const formatted = price.toLocaleString('nb-NO');
  return `${currencySymbol} ${formatted}`;
}

/**
 * Calculate the effective price per creator after volume discounts.
 */
function getCreatorPrice(creatorCount: number): number {
  let discountPercent = 0;

  // Find the highest applicable discount
  for (const tier of CREATOR_VOLUME_DISCOUNTS) {
    if (creatorCount >= tier.minCreators && tier.discountPercent > discountPercent) {
      discountPercent = tier.discountPercent;
    }
  }

  const basePrice = CREATOR_PRICE_NOK_PER_MONTH;
  return basePrice * (1 - discountPercent / 100);
}

/**
 * Calculate the total creator cost for a given number of creators.
 */
function calculateCreatorCost(creatorCount: number): number {
  if (creatorCount === Infinity) {
    // For "50+" bucket, we can't calculate - show contact
    return Infinity;
  }
  const pricePerCreator = getCreatorPrice(creatorCount);
  return Math.round(creatorCount * pricePerCreator);
}

/**
 * Get the platform fee for Suite Classic based on active users tier.
 */
function getSuiteClassicPlatformFee(activeUsersBucketId: string): number | null {
  return SUITE_CLASSIC_USER_PRICES[activeUsersBucketId] ?? null;
}

/**
 * Get the platform fee for Suite Pro based on active users tier.
 */
function getSuiteProPlatformFee(activeUsersBucketId: string): number | null {
  return SUITE_PRO_USER_PRICES[activeUsersBucketId] ?? null;
}

/**
 * Apply yearly discount to a monthly price.
 */
function applyYearlyDiscount(monthlyPrice: number): number {
  return Math.round(monthlyPrice * (1 - YEARLY_DISCOUNT));
}

function getIncludedLabel(
  planId: PlanId,
  creatorCount: number,
  activeUsersLabel: string,
  includesLms: boolean
): string {
  const creatorLabel =
    creatorCount === Infinity
      ? '50+ course creators'
      : creatorCount === 1
        ? '1 course creator'
        : `${creatorCount} course creators`;

  if (!includesLms || planId === 'author') {
    return creatorLabel;
  }

  return `${creatorLabel} + ${activeUsersLabel} active users`;
}

function getPriceForPlan(
  planId: PlanId,
  state: PricingState
): number | null {
  const { billing, creatorsBucketIndex, activeUsersBucketIndex } = state;
  const creatorBucket = CREATOR_BUCKETS[creatorsBucketIndex];
  const userBucket = ACTIVE_USERS_BUCKETS[activeUsersBucketIndex];

  if (!creatorBucket || !userBucket) {
    return null;
  }

  const creatorCount = creatorBucket.value;

  // Enterprise is always "Contact us"
  if (planId === 'enterprise') {
    return null;
  }

  // Handle "50+" creators bucket - contact sales
  if (creatorCount === Infinity) {
    return null;
  }

  const creatorCost = calculateCreatorCost(creatorCount);

  let monthlyPrice: number;

  switch (planId) {
    case 'author':
      // Author only pays for creators, no platform fee
      monthlyPrice = creatorCost;
      break;

    case 'suite_classic': {
      const platformFee = getSuiteClassicPlatformFee(userBucket.id);
      if (platformFee === null) {
        return null; // Contact sales for this tier
      }
      monthlyPrice = creatorCost + platformFee;
      break;
    }

    case 'suite_pro': {
      const platformFee = getSuiteProPlatformFee(userBucket.id);
      if (platformFee === null) {
        return null; // Contact sales for this tier
      }
      monthlyPrice = creatorCost + platformFee;
      break;
    }

    default:
      return null;
  }

  // Apply yearly discount if applicable
  if (billing === 'yearly') {
    return applyYearlyDiscount(monthlyPrice);
  }

  return monthlyPrice;
}

// ----------------------------------------------------------------------------
// Main Engine Function
// ----------------------------------------------------------------------------

export function getPricingSelection(state: PricingState): PricingSelection {
  const { billing, creatorsBucketIndex, activeUsersBucketIndex } = state;
  const selectedCreatorsBucket = CREATOR_BUCKETS[creatorsBucketIndex] ?? CREATOR_BUCKETS[0];
  const selectedActiveUsersBucket =
    ACTIVE_USERS_BUCKETS[activeUsersBucketIndex] ?? ACTIVE_USERS_BUCKETS[0];

  const plans: PlanViewModel[] = PLANS.map((plan) => {
    const rawPrice = getPriceForPlan(plan.id, state);
    const isContactSales = plan.id === 'enterprise' || rawPrice === null;

    let displayPrice: string;
    let priceNote: string;

    if (isContactSales) {
      displayPrice = 'Contact us';
      priceNote = '';
    } else {
      displayPrice = formatPrice(rawPrice);
      priceNote =
        billing === 'yearly'
          ? `/ month, ${DISPLAY_CONFIG.yearlyBillingNote}`
          : DISPLAY_CONFIG.monthlyBillingNote;
    }

    const includedLabel = getIncludedLabel(
      plan.id,
      selectedCreatorsBucket.value,
      selectedActiveUsersBucket.label,
      plan.includesLms
    );

    return {
      id: plan.id,
      title: plan.title,
      subtitle: plan.subtitle,
      displayPrice,
      priceNote,
      includedLabel,
      ctaLabel: plan.ctaLabel,
      ctaHref: buildCtaHref(plan.ctaHref, state),
      features: plan.features,
      isHighlighted: plan.isHighlighted ?? false,
      isContactSales,
      rawPrice,
      includesLms: plan.includesLms,
    };
  });

  return {
    plans,
    selectedCreatorsBucket: {
      id: selectedCreatorsBucket.id,
      label: selectedCreatorsBucket.label,
      value: selectedCreatorsBucket.value,
    },
    selectedActiveUsersBucket: {
      id: selectedActiveUsersBucket.id,
      label: selectedActiveUsersBucket.label,
      value: selectedActiveUsersBucket.value,
    },
    state,
  };
}

// ----------------------------------------------------------------------------
// CTA URL Builder
// ----------------------------------------------------------------------------

function buildCtaHref(baseHref: string, state: PricingState): string {
  const { billing, creatorsBucketIndex, activeUsersBucketIndex } = state;
  const creatorBucket = CREATOR_BUCKETS[creatorsBucketIndex];
  const userBucket = ACTIVE_USERS_BUCKETS[activeUsersBucketIndex];

  const params = new URLSearchParams();
  params.set('billing', billing);
  if (creatorBucket) {
    params.set('creators', creatorBucket.id);
  }
  if (userBucket) {
    params.set('users', userBucket.id);
  }
  params.set('source', 'pricing-page');

  const separator = baseHref.includes('?') ? '&' : '?';
  return `${baseHref}${separator}${params.toString()}`;
}

// ----------------------------------------------------------------------------
// Utility Functions (exported for testing)
// ----------------------------------------------------------------------------

export function getDefaultState(): PricingState {
  return {
    billing: 'yearly',
    creatorsBucketIndex: 1, // Default to 2 creators
    activeUsersBucketIndex: 2, // Default to 250 active users
  };
}

export function isValidCreatorsBucketIndex(index: number): boolean {
  return index >= 0 && index < CREATOR_BUCKETS.length;
}

export function isValidActiveUsersBucketIndex(index: number): boolean {
  return index >= 0 && index < ACTIVE_USERS_BUCKETS.length;
}

export function clampCreatorsBucketIndex(index: number): number {
  return Math.max(0, Math.min(index, CREATOR_BUCKETS.length - 1));
}

export function clampActiveUsersBucketIndex(index: number): number {
  return Math.max(0, Math.min(index, ACTIVE_USERS_BUCKETS.length - 1));
}
