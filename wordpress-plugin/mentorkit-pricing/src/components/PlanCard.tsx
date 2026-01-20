import React from 'react';
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

  // Determine card class
  let cardClass = 'mk-plan-card';
  if (isEnterprise) {
    cardClass += ' mk-plan-card--enterprise';
  } else if (isHighlighted) {
    cardClass += ' mk-plan-card--highlighted';
  }

  // Determine CTA button class
  let ctaClass = 'mk-cta-button';
  if (isEnterprise) {
    ctaClass += ' mk-cta-button--enterprise';
  } else if (isHighlighted) {
    ctaClass += ' mk-cta-button--primary';
  } else {
    ctaClass += ' mk-cta-button--secondary';
  }

  return (
    <div className={cardClass}>
      {/* Highlighted badge */}
      {isHighlighted && (
        <div className="mk-popular-badge">
          Most popular
        </div>
      )}

      {/* Header */}
      <div className="mk-plan-header">
        <h3 className="mk-plan-title">{title}</h3>
        <p className="mk-plan-subtitle">{subtitle}</p>
      </div>

      {/* Pricing */}
      <div className="mk-plan-pricing">
        <div>
          <span className={`mk-plan-price ${isContactSales ? 'mk-plan-price--contact' : ''}`}>
            {displayPrice}
          </span>
        </div>
        {priceNote && (
          <p className="mk-plan-price-note">{priceNote}</p>
        )}
        {helperText && (
          <p className="mk-plan-helper">{helperText}</p>
        )}
        <p className="mk-plan-included">
          {includedLabel}
        </p>
      </div>

      {/* Pricing examples */}
      {pricingExamples && pricingExamples.length > 0 && (
        <div className="mk-pricing-examples">
          {pricingExamples.map((example, index) => (
            <p key={index} className="mk-pricing-example">
              {example}
            </p>
          ))}
        </div>
      )}

      {/* Case studies */}
      {caseStudies && (
        <p className="mk-case-studies">
          <span className="mk-case-studies-label">Brukes av:</span> {caseStudies}
        </p>
      )}

      {/* CTA */}
      <a href={ctaHref} className={ctaClass}>
        {ctaLabel}
      </a>

      {/* Features */}
      <ul className="mk-features-list">
        {features.map((feature, index) => (
          <li key={index} className="mk-feature-item">
            <svg
              className="mk-feature-icon"
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
