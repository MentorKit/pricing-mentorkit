'use client';

import type { PlanViewModel } from './pricing.engine';

interface PlanCardProps {
  plan: PlanViewModel;
}

export function PlanCard({ plan }: PlanCardProps) {
  const {
    id,
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
    caseStudies,
    pricingExamples,
    helperText,
  } = plan;

  const isEnterprise = id === 'enterprise';

  return (
    <div
      className={`
        relative flex flex-col rounded-2xl border p-6 transition-shadow
        ${
          isEnterprise
            ? 'border-foreground-muted/30 bg-background-muted/50 hover:shadow-md'
            : isHighlighted
              ? 'border-primary bg-background-card shadow-lg ring-1 ring-primary'
              : 'border-border bg-background-card hover:shadow-md'
        }
      `}
    >
      {/* Highlighted badge */}
      {isHighlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            Most popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-foreground-muted">{subtitle}</p>
      </div>

      {/* Pricing */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span
            className={`text-3xl font-bold tracking-tight ${
              isContactSales ? 'text-foreground-secondary' : 'text-foreground'
            }`}
          >
            {displayPrice}
          </span>
        </div>
        {priceNote && (
          <p className="mt-1 text-sm text-foreground-muted">{priceNote}</p>
        )}
        {helperText && (
          <p className="mt-1 text-xs text-foreground-muted italic">{helperText}</p>
        )}
        <p className="mt-2 text-sm font-medium text-primary">
          {includedLabel}
        </p>
      </div>

      {/* Pricing examples */}
      {pricingExamples && pricingExamples.length > 0 && (
        <div className="mb-4 space-y-1">
          {pricingExamples.map((example, index) => (
            <p key={index} className="text-xs text-foreground-muted">
              {example}
            </p>
          ))}
        </div>
      )}

      {/* Case studies */}
      {caseStudies && (
        <p className="mb-4 text-xs text-foreground-muted">
          <span className="font-medium">Brukes av:</span> {caseStudies}
        </p>
      )}

      {/* CTA */}
      <a
        href={ctaHref}
        className={`
          mb-6 block w-full rounded-lg border-2 py-3 text-center text-sm font-semibold
          transition-all focus:outline-none focus-visible:ring-2
          focus-visible:ring-offset-2
          ${
            isEnterprise
              ? 'border-foreground-secondary bg-foreground-secondary text-white hover:bg-foreground hover:border-foreground focus-visible:ring-foreground'
              : isHighlighted
                ? 'border-primary bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary'
                : 'border-primary bg-transparent text-primary hover:bg-primary hover:text-white focus-visible:ring-primary'
          }
        `}
      >
        {ctaLabel}
      </a>

      {/* Features */}
      <ul className="flex flex-col gap-3 text-sm text-foreground-secondary">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
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
