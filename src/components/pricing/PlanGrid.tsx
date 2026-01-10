'use client';

import type { PlanViewModel } from './pricing.engine';
import { PlanCard } from './PlanCard';

interface PlanGridProps {
  plans: PlanViewModel[];
}

export function PlanGrid({ plans }: PlanGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
