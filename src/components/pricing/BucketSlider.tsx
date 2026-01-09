'use client';

import { useId } from 'react';
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
  className?: string;
}

export function BucketSlider({
  label,
  buckets,
  valueIndex,
  onChangeIndex,
  valueSuffix = '',
  getDiscountPercent,
  getDiscountRange,
  className = '',
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

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Header with value and current discount */}
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-foreground-secondary">
          {label}
        </label>
        <div className="flex items-center gap-3">
          {currentDiscount > 0 && (
            <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-semibold text-green-800 dark:text-green-400">
              {currentDiscount}% off
            </span>
          )}
          <span className="text-lg font-semibold text-primary">
            {currentBucket?.label ?? '—'}{valueSuffix && ` ${valueSuffix}`}
          </span>
        </div>
      </div>

      {/* Discount tiers - compact horizontal display */}
      {getDiscountPercent && (
        <div className="flex flex-wrap items-center gap-2 text-xs" aria-hidden="true">
          <span className="text-foreground-muted">Volume discounts:</span>
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
                className={`
                  inline-flex items-center gap-1 rounded px-2 py-0.5 transition-colors
                  ${isActive 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 font-semibold' 
                    : 'bg-background text-foreground-muted'
                  }
                `}
              >
                {rangeLabel && <span>{rangeLabel}:</span>}
                <span>{discountPercent}%</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Slider */}
      <div className="relative">
        <input
          id={id}
          type="range"
          min={0}
          max={buckets.length - 1}
          step={1}
          value={valueIndex}
          onChange={handleChange}
          className="slider-thumb w-full cursor-pointer appearance-none rounded-lg bg-transparent focus:outline-none"
          style={{
            background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, var(--border) ${percentage}%, var(--border) 100%)`,
            height: '8px',
          }}
          aria-valuemin={0}
          aria-valuemax={buckets.length - 1}
          aria-valuenow={valueIndex}
          aria-valuetext={`${currentBucket?.label ?? ''} ${valueSuffix}`}
        />
      </div>

      {/* Bucket value labels */}
      <div
        className="flex justify-between text-xs text-foreground-muted"
        aria-hidden="true"
      >
        {buckets.map((bucket, index) => {
          const showOnMobile = index === 0 || index === buckets.length - 1;
          const isSelected = index === valueIndex;

          return (
            <button
              key={bucket.id}
              type="button"
              onClick={() => onChangeIndex(index)}
              className={`
                flex-shrink-0 transition-all
                ${showOnMobile ? '' : 'hidden sm:block'}
                ${
                  isSelected
                    ? 'font-semibold text-primary'
                    : 'hover:text-foreground-secondary'
                }
              `}
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
