'use client';

import { useState, useMemo, useCallback } from 'react';
import { SegmentedToggle } from './SegmentedToggle';
import { BucketSlider } from './BucketSlider';
import { PlanGrid } from './PlanGrid';
import { getPricingSelection, getDefaultState, type PricingState } from './pricing.engine';
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
      {/* Controls */}
      <div className="mb-12 flex flex-col gap-8">
        {/* Billing Toggle */}
        <div className="flex justify-center">
          <SegmentedToggle
            options={BILLING_OPTIONS}
            value={state.billing}
            onChange={handleBillingChange}
            label="Billing"
          />
        </div>

        {/* Sliders */}
        <div className="mx-auto w-full max-w-2xl space-y-8">
          {/* Course Creators Slider */}
          <BucketSlider
            label="How many course creators?"
            buckets={CREATOR_BUCKETS}
            valueIndex={state.creatorsBucketIndex}
            onChangeIndex={handleCreatorsChange}
            valueSuffix="creators"
          />

          {/* Active Users Slider */}
          <BucketSlider
            label="How many active users in the LMS?"
            buckets={ACTIVE_USERS_BUCKETS}
            valueIndex={state.activeUsersBucketIndex}
            onChangeIndex={handleActiveUsersChange}
            valueSuffix="users"
          />
        </div>
      </div>

      {/* Plan cards */}
      <PlanGrid plans={selection.plans} />
    </section>
  );
}
