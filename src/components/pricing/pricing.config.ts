// ============================================================================
// PRICING CONFIGURATION - Single source of truth for all pricing data
// ============================================================================
// Edit this file to update pricing. No UI code changes needed.
// ============================================================================

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export type BillingCycle = 'monthly' | 'yearly';
export type PlanId = 'author' | 'core_classic' | 'suite_classic' | 'suite_pro' | 'enterprise';

/** Ordered list of plan IDs for UI rendering */
export const PLAN_ORDER: PlanId[] = [
  'author',
  'core_classic',
  'suite_classic',
  'suite_pro',
  'enterprise',
];

export interface Bucket {
  id: string;
  label: string;
  value: number; // numeric value for calculations; Infinity for "plus" buckets
}

export interface Plan {
  id: PlanId;
  title: string;
  subtitle: string;
  isHighlighted?: boolean; // e.g., "Most popular"
  ctaLabel: string;
  ctaHref: string;
  features: string[];
  /** Whether this plan includes an LMS (affects active users slider visibility) */
  includesLms: boolean;
  /** Whether this plan includes Course Creator (affects creators slider relevance) */
  includesCreator: boolean;
  /** Example customer case studies */
  caseStudies?: string;
  /** Example pricing lines to show under the price (e.g., "Kr 2690 per måned for 100 aktive brukere") */
  pricingExamples?: string[];
  /** Helper text for quote-only plans */
  helperText?: string;
}

// ----------------------------------------------------------------------------
// Course Creator Buckets
// ----------------------------------------------------------------------------

export const CREATOR_BUCKETS: Bucket[] = [
  { id: 'creators_1', label: '1', value: 1 },
  { id: 'creators_2', label: '2', value: 2 },
  { id: 'creators_3', label: '3', value: 3 },
  { id: 'creators_5', label: '5', value: 5 },
  { id: 'creators_10', label: '10', value: 10 },
  { id: 'creators_20', label: '20', value: 20 },
  { id: 'creators_50_plus', label: '50+', value: Infinity },
];

// ----------------------------------------------------------------------------
// Active Users Buckets (for LMS plans)
// ----------------------------------------------------------------------------

export const ACTIVE_USERS_BUCKETS: Bucket[] = [
  { id: 'users_50', label: '50', value: 50 },
  { id: 'users_100', label: '100', value: 100 },
  { id: 'users_250', label: '250', value: 250 },
  { id: 'users_500', label: '500', value: 500 },
  { id: 'users_1000', label: '1,000', value: 1000 },
  { id: 'users_2500', label: '2,500', value: 2500 },
  { id: 'users_5000', label: '5,000', value: 5000 },
  { id: 'users_10000_plus', label: '10,000+', value: Infinity },
];

// ----------------------------------------------------------------------------
// Plans
// ----------------------------------------------------------------------------

export const PLANS: Plan[] = [
  {
    id: 'author',
    title: 'Author',
    subtitle: 'For teams that only need to create courses',
    ctaLabel: 'Get started',
    ctaHref: '/signup?plan=author',
    includesLms: false,
    includesCreator: true,
    features: [
      'Full MentorKit Course Creator',
      'Supports multiple course creators',
      'SCORM and xAPI export',
      'No LMS or course delivery included',
    ],
  },
  {
    id: 'core_classic',
    title: 'Core Classic',
    subtitle: 'For organisations that need LMS only',
    ctaLabel: 'Start free trial',
    ctaHref: '/signup?plan=core_classic',
    includesLms: true,
    includesCreator: false,
    features: [
      'LMS Classic for course delivery',
      'User tracking and basic reporting',
      'Import SCORM/xAPI courses',
      'Email support',
    ],
  },
  {
    id: 'suite_classic',
    title: 'Suite Classic',
    subtitle: 'For organisations that want a simple, complete learning setup',
    ctaLabel: 'Start free trial',
    ctaHref: '/signup?plan=suite_classic',
    includesLms: true,
    includesCreator: true,
    features: [
      'Course Creator included',
      'LMS Classic for course delivery',
      'User tracking and basic reporting',
      'Email support',
    ],
  },
  {
    id: 'suite_pro',
    title: 'Suite Pro',
    subtitle: 'For organisations that need scale, automation and integrations',
    isHighlighted: true,
    ctaLabel: 'Start free trial',
    ctaHref: '/signup?plan=suite_pro',
    includesLms: true,
    includesCreator: true,
    features: [
      'Course Creator included',
      'LMS Pro with advanced automation',
      'APIs and integration options',
      'Single Sign-On (SSO)',
      'Add-ons available as needed',
    ],
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    subtitle: 'Store organisasjoner / komplekse krav / integrasjoner / SLA',
    ctaLabel: 'Contact sales',
    ctaHref: '/contact?plan=enterprise',
    includesLms: true,
    includesCreator: true,
    helperText: 'Pricing depends on scope — talk to sales.',
    features: [
      'HR-system integration',
      'Microsoft Teams integration',
      'Calendar/email integration',
      'Custom SLA / security',
      'Migration / implementation (Assist)',
    ],
  },
];

// ----------------------------------------------------------------------------
// Pricing Configuration
// ----------------------------------------------------------------------------

/**
 * Price per course creator per month (in NOK).
 * This is the base price that applies to all plans.
 */
export const CREATOR_PRICE_NOK_PER_MONTH = 1390;

/**
 * Volume discount tiers for course creators.
 * Discounts apply progressively - the highest applicable discount is used.
 * Format: { minCreators: number, discountPercent: number }
 */
export const CREATOR_VOLUME_DISCOUNTS = [
    { minCreators: 3, discountPercent: 10 },
    { minCreators: 5, discountPercent: 20 },
    { minCreators: 10, discountPercent: 30 },
    { minCreators: 20, discountPercent: 40 },
  ];
  

/**
 * Core Classic (LMS Classic only): Platform fee per active users tier (monthly, in NOK).
 * Anchors from screenshot: 100 users = 2690, 500 users = 4590
 */
export const CORE_CLASSIC_USER_PRICES: Record<string, number | null> = {
  users_50: 1990,      // Placeholder - adjust as needed
  users_100: 2690,     // From screenshot
  users_250: 3590,     // Placeholder - adjust as needed
  users_500: 4590,     // From screenshot
  users_1000: 6990,    // Placeholder - adjust as needed
  users_2500: 12990,   // Placeholder - adjust as needed
  users_5000: 22990,   // Placeholder - adjust as needed
  users_10000_plus: null, // Contact sales
};

/**
 * Suite Classic: Base platform fee per active users tier (monthly, in NOK).
 * Edit these sample values as needed.
 */
export const SUITE_CLASSIC_USER_PRICES: Record<string, number | null> = {
  users_50: 2000,
  users_100: 3500,
  users_250: 6000,
  users_500: 10000,
  users_1000: 17000,
  users_2500: 35000,
  users_5000: 60000,
  users_10000_plus: null, // Contact sales
};

/**
 * Suite Pro: Base platform fee per active users tier (monthly, in NOK).
 * Edit these sample values as needed.
 */
export const SUITE_PRO_USER_PRICES: Record<string, number | null> = {
  users_50: 4000,
  users_100: 6500,
  users_250: 11000,
  users_500: 18000,
  users_1000: 30000,
  users_2500: 55000,
  users_5000: 95000,
  users_10000_plus: null, // Contact sales
};

/**
 * Yearly billing discount (as a decimal, e.g., 0.17 = 17% off).
 */
export const YEARLY_DISCOUNT = 0.17;

// ----------------------------------------------------------------------------
// Display Configuration
// ----------------------------------------------------------------------------

export const DISPLAY_CONFIG = {
  currency: 'NOK',
  currencySymbol: 'kr',
  yearlyDiscountLabel: 'Save ~17%',
  yearlyBillingNote: 'billed annually',
  monthlyBillingNote: 'per month',
};

// ----------------------------------------------------------------------------
// Billing Options
// ----------------------------------------------------------------------------

export const BILLING_OPTIONS = [
  { value: 'monthly' as BillingCycle, label: 'Monthly' },
  { value: 'yearly' as BillingCycle, label: 'Yearly', badge: 'Save ~17%' },
];
