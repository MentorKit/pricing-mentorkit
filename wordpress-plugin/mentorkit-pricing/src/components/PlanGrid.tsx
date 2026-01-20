import React from 'react';
import type { PlanViewModel } from './pricing.engine';
import { PlanCard } from './PlanCard';

interface PlanGridProps {
  plans: PlanViewModel[];
}

export function PlanGrid({ plans }: PlanGridProps) {
  return (
    <div className="mk-plan-grid">
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
