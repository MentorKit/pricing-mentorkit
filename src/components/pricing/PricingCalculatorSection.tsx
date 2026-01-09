'use client';

import { useState, useMemo, useCallback } from 'react';
import { SegmentedToggle } from './SegmentedToggle';
import { BucketSlider } from './BucketSlider';
import { PlanGrid } from './PlanGrid';
import {
  getPricingSelection,
  getDefaultState,
  getCreatorDiscountPercent,
  getCreatorDiscountRange,
  type PricingState,
} from './pricing.engine';
import {
  CREATOR_BUCKETS,
  ACTIVE_USERS_BUCKETS,
  BILLING_OPTIONS,
  type BillingCycle,
} from './pricing.config';
import { trackPricingEvent } from './pricing.analytics';

export function PricingCalculatorSection() {
  const [state, setState] = useState<PricingState>(getDefaultState);

  const selection = useMemo(() => getPricingSelection(state), [state]);

  const handleBillingChange = useCallback((billing: BillingCycle) => {
    setState((prev) => ({ ...prev, billing }));
    trackPricingEvent('billing_changed', { billing });
  }, []);

  const handleCreatorsChange = useCallback((creatorsBucketIndex: number) => {
    setState((prev) => ({ ...prev, creatorsBucketIndex }));
    const bucket = CREATOR_BUCKETS[creatorsBucketIndex];
    trackPricingEvent('creators_changed', {
      creatorsBucketId: bucket?.id,
      creatorsValue: bucket?.value,
    });
  }, []);

  const handleActiveUsersChange = useCallback((activeUsersBucketIndex: number) => {
    setState((prev) => ({ ...prev, activeUsersBucketIndex }));
    const bucket = ACTIVE_USERS_BUCKETS[activeUsersBucketIndex];
    trackPricingEvent('active_users_changed', {
      activeUsersBucketId: bucket?.id,
      activeUsersValue: bucket?.value,
    });
  }, []);

  return (
    <section className="w-full">
      {/* Controls Card */}
      <div className="mb-12 rounded-2xl border border-border bg-background-muted/50 p-5 sm:p-6">
        <div className="flex flex-col gap-6">
          {/* Row 1: Billing Toggle + Course Creators Slider */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
            {/* Billing Toggle */}
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <span className="text-sm font-medium text-foreground-secondary">
                Billing cycle
              </span>
              <SegmentedToggle
                options={BILLING_OPTIONS}
                value={state.billing}
                onChange={handleBillingChange}
              />
            </div>

            {/* Divider - visible on lg+ */}
            <div className="hidden lg:block self-stretch w-px bg-border" />

            {/* Course Creators Slider */}
            <div className="flex-1 min-w-0">
              <BucketSlider
                label="How many course creators?"
                buckets={CREATOR_BUCKETS}
                valueIndex={state.creatorsBucketIndex}
                onChangeIndex={handleCreatorsChange}
                valueSuffix="creators"
                getDiscountPercent={getCreatorDiscountPercent}
                getDiscountRange={getCreatorDiscountRange}
              />
            </div>
          </div>

          {/* Row 2: Active Users Slider */}
          <div className="border-t border-border pt-6">
            <BucketSlider
              label="How many active users in the LMS?"
              buckets={ACTIVE_USERS_BUCKETS}
              valueIndex={state.activeUsersBucketIndex}
              onChangeIndex={handleActiveUsersChange}
              valueSuffix="users"
            />
          </div>
        </div>
      </div>

      {/* Plan cards */}
      <PlanGrid plans={selection.plans} />
    </section>
  );
}
