import { describe, it, expect } from 'vitest';
import {
  getPricingSelection,
  getDefaultState,
  isValidCreatorsBucketIndex,
  isValidActiveUsersBucketIndex,
  clampCreatorsBucketIndex,
  clampActiveUsersBucketIndex,
  type PricingState,
} from './pricing.engine';
import {
  CREATOR_BUCKETS,
  ACTIVE_USERS_BUCKETS,
  CREATOR_PRICE_NOK_PER_MONTH,
  CORE_CLASSIC_USER_PRICES,
  SUITE_CLASSIC_USER_PRICES,
  SUITE_PRO_USER_PRICES,
} from './pricing.config';

describe('pricing.engine', () => {
  describe('getDefaultState', () => {
    it('returns a valid default state', () => {
      const state = getDefaultState();

      expect(state.billing).toBe('yearly');
      expect(isValidCreatorsBucketIndex(state.creatorsBucketIndex)).toBe(true);
      expect(isValidActiveUsersBucketIndex(state.activeUsersBucketIndex)).toBe(true);
    });
  });

  describe('isValidCreatorsBucketIndex', () => {
    it('returns true for valid indices', () => {
      expect(isValidCreatorsBucketIndex(0)).toBe(true);
      expect(isValidCreatorsBucketIndex(CREATOR_BUCKETS.length - 1)).toBe(true);
    });

    it('returns false for invalid indices', () => {
      expect(isValidCreatorsBucketIndex(-1)).toBe(false);
      expect(isValidCreatorsBucketIndex(CREATOR_BUCKETS.length)).toBe(false);
      expect(isValidCreatorsBucketIndex(100)).toBe(false);
    });
  });

  describe('isValidActiveUsersBucketIndex', () => {
    it('returns true for valid indices', () => {
      expect(isValidActiveUsersBucketIndex(0)).toBe(true);
      expect(isValidActiveUsersBucketIndex(ACTIVE_USERS_BUCKETS.length - 1)).toBe(true);
    });

    it('returns false for invalid indices', () => {
      expect(isValidActiveUsersBucketIndex(-1)).toBe(false);
      expect(isValidActiveUsersBucketIndex(ACTIVE_USERS_BUCKETS.length)).toBe(false);
    });
  });

  describe('clampCreatorsBucketIndex', () => {
    it('returns same value for valid indices', () => {
      expect(clampCreatorsBucketIndex(0)).toBe(0);
      expect(clampCreatorsBucketIndex(3)).toBe(3);
    });

    it('clamps to valid range', () => {
      expect(clampCreatorsBucketIndex(-5)).toBe(0);
      expect(clampCreatorsBucketIndex(100)).toBe(CREATOR_BUCKETS.length - 1);
    });
  });

  describe('clampActiveUsersBucketIndex', () => {
    it('returns same value for valid indices', () => {
      expect(clampActiveUsersBucketIndex(0)).toBe(0);
      expect(clampActiveUsersBucketIndex(3)).toBe(3);
    });

    it('clamps to valid range', () => {
      expect(clampActiveUsersBucketIndex(-5)).toBe(0);
      expect(clampActiveUsersBucketIndex(100)).toBe(ACTIVE_USERS_BUCKETS.length - 1);
    });
  });

  describe('getPricingSelection', () => {
    it('returns 5 plans in correct order', () => {
      const state = getDefaultState();
      const selection = getPricingSelection(state);

      expect(selection.plans).toHaveLength(5);
      expect(selection.plans.map((p) => p.id)).toEqual([
        'author',
        'core_classic',
        'suite_classic',
        'suite_pro',
        'enterprise',
      ]);
    });

    it('enterprise plan always shows "Contact sales"', () => {
      const state: PricingState = {
        billing: 'yearly',
        creatorsBucketIndex: 0, // 1 creator
        activeUsersBucketIndex: 0, // 50 users
      };
      const selection = getPricingSelection(state);
      const enterprisePlan = selection.plans.find((p) => p.id === 'enterprise');

      expect(enterprisePlan?.displayPrice).toBe('Contact sales');
      expect(enterprisePlan?.isContactSales).toBe(true);
    });

    it('author plan price equals creators * 1390 NOK (monthly)', () => {
      const state: PricingState = {
        billing: 'monthly',
        creatorsBucketIndex: 1, // 2 creators
        activeUsersBucketIndex: 0,
      };
      const selection = getPricingSelection(state);
      const authorPlan = selection.plans.find((p) => p.id === 'author');

      // 2 creators * 1390 = 2780
      expect(authorPlan?.rawPrice).toBe(2 * CREATOR_PRICE_NOK_PER_MONTH);
      expect(authorPlan?.isContactSales).toBe(false);
    });

    it('suite classic price equals creators + platform fee (monthly)', () => {
      const state: PricingState = {
        billing: 'monthly',
        creatorsBucketIndex: 1, // 2 creators
        activeUsersBucketIndex: 2, // 250 users (users_250)
      };
      const selection = getPricingSelection(state);
      const classicPlan = selection.plans.find((p) => p.id === 'suite_classic');

      const expectedCreatorCost = 2 * CREATOR_PRICE_NOK_PER_MONTH;
      const expectedPlatformFee = SUITE_CLASSIC_USER_PRICES['users_250']!;
      const expectedTotal = expectedCreatorCost + expectedPlatformFee;

      expect(classicPlan?.rawPrice).toBe(expectedTotal);
    });

    it('suite pro price equals creators + platform fee (monthly)', () => {
      const state: PricingState = {
        billing: 'monthly',
        creatorsBucketIndex: 2, // 3 creators (10% discount applies)
        activeUsersBucketIndex: 3, // 500 users (users_500)
      };
      const selection = getPricingSelection(state);
      const proPlan = selection.plans.find((p) => p.id === 'suite_pro');

      // 3 creators with 10% volume discount
      const discountedPrice = CREATOR_PRICE_NOK_PER_MONTH * 0.9;
      const expectedCreatorCost = Math.round(3 * discountedPrice);
      const expectedPlatformFee = SUITE_PRO_USER_PRICES['users_500']!;
      const expectedTotal = expectedCreatorCost + expectedPlatformFee;

      expect(proPlan?.rawPrice).toBe(expectedTotal);
    });

    it('shows "Contact sales" for 50+ creators bucket (creator-priced plans only)', () => {
      const state: PricingState = {
        billing: 'monthly',
        creatorsBucketIndex: CREATOR_BUCKETS.length - 1, // 50+ creators
        activeUsersBucketIndex: 0,
      };
      const selection = getPricingSelection(state);
      const authorPlan = selection.plans.find((p) => p.id === 'author');
      const suiteClassicPlan = selection.plans.find((p) => p.id === 'suite_classic');
      const coreClassicPlan = selection.plans.find((p) => p.id === 'core_classic');

      // Creator-priced plans show Contact sales
      expect(authorPlan?.displayPrice).toBe('Contact sales');
      expect(authorPlan?.isContactSales).toBe(true);
      expect(suiteClassicPlan?.displayPrice).toBe('Contact sales');
      expect(suiteClassicPlan?.isContactSales).toBe(true);

      // Core Classic ignores creators, so it should still compute a price
      expect(coreClassicPlan?.isContactSales).toBe(false);
      expect(coreClassicPlan?.rawPrice).toBe(CORE_CLASSIC_USER_PRICES['users_50']);
    });

    it('shows "Contact sales" for 10000+ users tier', () => {
      const state: PricingState = {
        billing: 'monthly',
        creatorsBucketIndex: 1, // 2 creators
        activeUsersBucketIndex: ACTIVE_USERS_BUCKETS.length - 1, // 10000+ users
      };
      const selection = getPricingSelection(state);
      const classicPlan = selection.plans.find((p) => p.id === 'suite_classic');
      const proPlan = selection.plans.find((p) => p.id === 'suite_pro');
      const coreClassicPlan = selection.plans.find((p) => p.id === 'core_classic');

      expect(classicPlan?.displayPrice).toBe('Contact sales');
      expect(classicPlan?.isContactSales).toBe(true);
      expect(proPlan?.displayPrice).toBe('Contact sales');
      expect(proPlan?.isContactSales).toBe(true);
      expect(coreClassicPlan?.displayPrice).toBe('Contact sales');
      expect(coreClassicPlan?.isContactSales).toBe(true);
    });

    it('includes correct bucket labels in selection', () => {
      const state: PricingState = {
        billing: 'monthly',
        creatorsBucketIndex: 3, // 5 creators
        activeUsersBucketIndex: 4, // 1,000 users
      };
      const selection = getPricingSelection(state);

      expect(selection.selectedCreatorsBucket.label).toBe('5');
      expect(selection.selectedCreatorsBucket.value).toBe(5);
      expect(selection.selectedActiveUsersBucket.label).toBe('1,000');
      expect(selection.selectedActiveUsersBucket.value).toBe(1000);
    });

    it('yearly billing shows correct price note', () => {
      const state: PricingState = {
        billing: 'yearly',
        creatorsBucketIndex: 1,
        activeUsersBucketIndex: 2,
      };
      const selection = getPricingSelection(state);
      const authorPlan = selection.plans.find((p) => p.id === 'author');

      expect(authorPlan?.priceNote).toContain('billed annually');
    });

    it('monthly billing shows correct price note', () => {
      const state: PricingState = {
        billing: 'monthly',
        creatorsBucketIndex: 1,
        activeUsersBucketIndex: 2,
      };
      const selection = getPricingSelection(state);
      const authorPlan = selection.plans.find((p) => p.id === 'author');

      expect(authorPlan?.priceNote).toBe('per month');
    });

    it('suite_pro plan is highlighted', () => {
      const state = getDefaultState();
      const selection = getPricingSelection(state);
      const proPlan = selection.plans.find((p) => p.id === 'suite_pro');

      expect(proPlan?.isHighlighted).toBe(true);
    });

    it('CTA href includes state parameters', () => {
      const state: PricingState = {
        billing: 'yearly',
        creatorsBucketIndex: 2, // 3 creators
        activeUsersBucketIndex: 3, // 500 users
      };
      const selection = getPricingSelection(state);
      const classicPlan = selection.plans.find((p) => p.id === 'suite_classic');

      expect(classicPlan?.ctaHref).toContain('billing=yearly');
      expect(classicPlan?.ctaHref).toContain('creators=creators_3');
      expect(classicPlan?.ctaHref).toContain('users=users_500');
      expect(classicPlan?.ctaHref).toContain('source=pricing-page');
    });

    it('author plan does not include LMS', () => {
      const state = getDefaultState();
      const selection = getPricingSelection(state);
      const authorPlan = selection.plans.find((p) => p.id === 'author');

      expect(authorPlan?.includesLms).toBe(false);
    });

    it('suite plans include LMS', () => {
      const state = getDefaultState();
      const selection = getPricingSelection(state);
      const classicPlan = selection.plans.find((p) => p.id === 'suite_classic');
      const proPlan = selection.plans.find((p) => p.id === 'suite_pro');

      expect(classicPlan?.includesLms).toBe(true);
      expect(proPlan?.includesLms).toBe(true);
    });

    it('core_classic price is unchanged when creators slider changes', () => {
      // Test with 1 creator
      const state1: PricingState = {
        billing: 'monthly',
        creatorsBucketIndex: 0, // 1 creator
        activeUsersBucketIndex: 1, // 100 users
      };
      const selection1 = getPricingSelection(state1);
      const coreClassic1 = selection1.plans.find((p) => p.id === 'core_classic');

      // Test with 10 creators
      const state10: PricingState = {
        billing: 'monthly',
        creatorsBucketIndex: 4, // 10 creators
        activeUsersBucketIndex: 1, // 100 users
      };
      const selection10 = getPricingSelection(state10);
      const coreClassic10 = selection10.plans.find((p) => p.id === 'core_classic');

      // Core Classic price should be the same regardless of creators
      expect(coreClassic1?.rawPrice).toBe(coreClassic10?.rawPrice);
      expect(coreClassic1?.rawPrice).toBe(CORE_CLASSIC_USER_PRICES['users_100']);
    });

    it('core_classic still computes when creators bucket is Infinity (50+)', () => {
      const state: PricingState = {
        billing: 'monthly',
        creatorsBucketIndex: CREATOR_BUCKETS.length - 1, // 50+ creators
        activeUsersBucketIndex: 3, // 500 users
      };
      const selection = getPricingSelection(state);
      const coreClassic = selection.plans.find((p) => p.id === 'core_classic');

      // Core Classic ignores creators entirely, so it should compute
      expect(coreClassic?.isContactSales).toBe(false);
      expect(coreClassic?.rawPrice).toBe(CORE_CLASSIC_USER_PRICES['users_500']);
    });

    it('core_classic price equals LMS platform fee only (no creators)', () => {
      const state: PricingState = {
        billing: 'monthly',
        creatorsBucketIndex: 2, // 3 creators
        activeUsersBucketIndex: 2, // 250 users
      };
      const selection = getPricingSelection(state);
      const coreClassic = selection.plans.find((p) => p.id === 'core_classic');

      // Core Classic = platform fee only, no creator cost
      expect(coreClassic?.rawPrice).toBe(CORE_CLASSIC_USER_PRICES['users_250']);
      expect(coreClassic?.isContactSales).toBe(false);
    });

    it('core_classic includedLabel shows only active users (not creators)', () => {
      const state: PricingState = {
        billing: 'monthly',
        creatorsBucketIndex: 2, // 3 creators
        activeUsersBucketIndex: 2, // 250 users
      };
      const selection = getPricingSelection(state);
      const coreClassic = selection.plans.find((p) => p.id === 'core_classic');

      expect(coreClassic?.includedLabel).toBe('250 active users');
      expect(coreClassic?.includedLabel).not.toContain('creator');
    });

    it('enterprise always returns quote-only for all slider states', () => {
      // Test various slider combinations
      const testCases: PricingState[] = [
        { billing: 'monthly', creatorsBucketIndex: 0, activeUsersBucketIndex: 0 },
        { billing: 'yearly', creatorsBucketIndex: 3, activeUsersBucketIndex: 5 },
        { billing: 'monthly', creatorsBucketIndex: CREATOR_BUCKETS.length - 1, activeUsersBucketIndex: 0 },
        { billing: 'yearly', creatorsBucketIndex: 2, activeUsersBucketIndex: ACTIVE_USERS_BUCKETS.length - 1 },
      ];

      for (const state of testCases) {
        const selection = getPricingSelection(state);
        const enterprise = selection.plans.find((p) => p.id === 'enterprise');

        expect(enterprise?.displayPrice).toBe('Contact sales');
        expect(enterprise?.isContactSales).toBe(true);
        expect(enterprise?.rawPrice).toBeNull();
      }
    });

    it('enterprise includedLabel shows "Custom scope"', () => {
      const state = getDefaultState();
      const selection = getPricingSelection(state);
      const enterprise = selection.plans.find((p) => p.id === 'enterprise');

      expect(enterprise?.includedLabel).toBe('Custom scope');
    });

    it('core_classic does not include creators', () => {
      const state = getDefaultState();
      const selection = getPricingSelection(state);
      const coreClassic = selection.plans.find((p) => p.id === 'core_classic');

      expect(coreClassic?.includesCreator).toBe(false);
      expect(coreClassic?.includesLms).toBe(true);
    });
  });

  describe('price consistency', () => {
    it('yearly prices are lower than monthly (discount applied)', () => {
      const monthlyState: PricingState = {
        billing: 'monthly',
        creatorsBucketIndex: 1,
        activeUsersBucketIndex: 2,
      };
      const yearlyState: PricingState = {
        billing: 'yearly',
        creatorsBucketIndex: 1,
        activeUsersBucketIndex: 2,
      };

      const monthlySelection = getPricingSelection(monthlyState);
      const yearlySelection = getPricingSelection(yearlyState);

      const monthlyAuthor = monthlySelection.plans.find((p) => p.id === 'author');
      const yearlyAuthor = yearlySelection.plans.find((p) => p.id === 'author');

      expect(yearlyAuthor?.rawPrice).toBeLessThan(monthlyAuthor!.rawPrice!);
    });

    it('suite pro prices are higher than suite classic for same tier', () => {
      const state: PricingState = {
        billing: 'monthly',
        creatorsBucketIndex: 2,
        activeUsersBucketIndex: 3,
      };

      const selection = getPricingSelection(state);

      const classicPlan = selection.plans.find((p) => p.id === 'suite_classic');
      const proPlan = selection.plans.find((p) => p.id === 'suite_pro');

      expect(proPlan?.rawPrice).toBeGreaterThan(classicPlan!.rawPrice!);
    });
  });
});
