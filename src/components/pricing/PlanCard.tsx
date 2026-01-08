'use client';

import type { PlanViewModel } from './pricing.engine';

interface PlanCardProps {
  plan: PlanViewModel;
}

export function PlanCard({ plan }: PlanCardProps) {
  const {
    title,
    subtitle,
    displayPrice,
    priceNote,
    includedLabel,
    ctaLabel,
    ctaHref,
    features,
    isHighlighted,
    isContactSales,
  } = plan;

  return (
    <div
      className={`
        relative flex flex-col rounded-2xl border p-6 transition-shadow
        ${
          isHighlighted
            ? 'border-indigo-500 bg-white shadow-lg ring-1 ring-indigo-500'
            : 'border-slate-200 bg-white hover:shadow-md'
        }
      `}
    >
      {/* Highlighted badge */}
      {isHighlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
            Most popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>

      {/* Pricing */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span
            className={`text-4xl font-bold tracking-tight ${
              isContactSales ? 'text-slate-700' : 'text-slate-900'
            }`}
          >
            {displayPrice}
          </span>
        </div>
        {priceNote && (
          <p className="mt-1 text-sm text-slate-500">{priceNote}</p>
        )}
        <p className="mt-2 text-sm font-medium text-indigo-600">
          {includedLabel}
        </p>
      </div>

      {/* CTA */}
      <a
        href={ctaHref}
        className={`
          mb-6 block w-full rounded-lg py-3 text-center text-sm font-semibold
          transition-colors focus:outline-none focus-visible:ring-2
          focus-visible:ring-offset-2
          ${
            isHighlighted
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500'
              : 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-500'
          }
        `}
      >
        {ctaLabel}
      </a>

      {/* Features */}
      <ul className="flex flex-col gap-3 text-sm text-slate-600">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
