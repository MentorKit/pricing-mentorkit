import React, { useId } from 'react';
import type { Bucket } from './pricing.config';

interface BucketSliderProps {
  label: string;
  buckets: Bucket[];
  valueIndex: number;
  onChangeIndex: (index: number) => void;
  /** Text to show after the value (e.g., "MAU", "creators", "users") */
  valueSuffix?: string;
  /** Function to get discount percentage for a bucket value. Returns 0 if no discount. */
  getDiscountPercent?: (value: number) => number;
  /** Function to get discount range label for a bucket value (e.g., "3-4", "5-9"). Returns null if no discount. */
  getDiscountRange?: (value: number, nextValue: number) => string | null;
}

export function BucketSlider({
  label,
  buckets,
  valueIndex,
  onChangeIndex,
  valueSuffix = '',
  getDiscountPercent,
  getDiscountRange,
}: BucketSliderProps) {
  const id = useId();
  const currentBucket = buckets[valueIndex];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeIndex(parseInt(e.target.value, 10));
  };

  // Calculate percentage for gradient fill
  const percentage = buckets.length > 1 ? (valueIndex / (buckets.length - 1)) * 100 : 0;

  // Get current discount if applicable
  const currentDiscount = getDiscountPercent ? getDiscountPercent(currentBucket?.value ?? 0) : 0;

  // Build the gradient background for the slider track
  const sliderBackground = `linear-gradient(to right, var(--mk-primary) 0%, var(--mk-primary) ${percentage}%, var(--mk-border) ${percentage}%, var(--mk-border) 100%)`;

  return (
    <div className="mk-slider-container">
      {/* Header with value and current discount */}
      <div className="mk-slider-header">
        <label htmlFor={id} className="mk-slider-label">
          {label}
        </label>
        <div className="mk-slider-value-wrap">
          {currentDiscount > 0 && (
            <span className="mk-discount-badge">
              {currentDiscount}% off
            </span>
          )}
          <span className="mk-slider-value">
            {currentBucket?.label ?? '—'}{valueSuffix && ` ${valueSuffix}`}
          </span>
        </div>
      </div>

      {/* Volume Discounts Display */}
      {getDiscountPercent && (
        <div className="mk-volume-discounts" aria-hidden="true">
          <span className="mk-volume-label">Volume discounts:</span>
          {buckets.map((bucket, index) => {
            const discountPercent = getDiscountPercent(bucket.value);
            if (discountPercent === 0) return null;

            const nextBucket = buckets[index + 1];
            const rangeLabel = getDiscountRange
              ? getDiscountRange(bucket.value, nextBucket?.value ?? Infinity)
              : null;

            const isActive = currentDiscount === discountPercent;

            return (
              <span
                key={`tier-${bucket.id}`}
                className={`mk-volume-tier ${
                  isActive ? 'mk-volume-tier--active' : 'mk-volume-tier--inactive'
                }`}
              >
                {rangeLabel && <span>{rangeLabel}:</span>}
                <span>{discountPercent}%</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Slider */}
      <div>
        <input
          id={id}
          type="range"
          min={0}
          max={buckets.length - 1}
          step={1}
          value={valueIndex}
          onChange={handleChange}
          className="mk-range-slider"
          style={{ background: sliderBackground }}
          aria-valuemin={0}
          aria-valuemax={buckets.length - 1}
          aria-valuenow={valueIndex}
          aria-valuetext={`${currentBucket?.label ?? ''} ${valueSuffix}`}
        />
      </div>

      {/* Bucket value labels */}
      <div className="mk-bucket-labels" aria-hidden="true">
        {buckets.map((bucket, index) => {
          const showOnMobile = index === 0 || index === buckets.length - 1;
          const isSelected = index === valueIndex;

          return (
            <button
              key={bucket.id}
              type="button"
              onClick={() => onChangeIndex(index)}
              className={`mk-bucket-label ${
                isSelected ? 'mk-bucket-label--selected' : ''
              } ${!showOnMobile ? 'mk-bucket-label--hidden-mobile' : ''}`}
              tabIndex={-1}
            >
              {bucket.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
