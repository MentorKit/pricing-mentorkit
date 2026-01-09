'use client';

import { useId } from 'react';
import type { Bucket } from './pricing.config';

interface MauSliderProps {
  buckets: Bucket[];
  valueIndex: number;
  onChangeIndex: (index: number) => void;
  className?: string;
}

export function MauSlider({
  buckets,
  valueIndex,
  onChangeIndex,
  className = '',
}: MauSliderProps) {
  const id = useId();
  const currentBucket = buckets[valueIndex];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeIndex(parseInt(e.target.value, 10));
  };

  // Calculate percentage for gradient fill
  const percentage = (valueIndex / (buckets.length - 1)) * 100;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          How many monthly active users?
        </label>
        <span className="text-lg font-semibold text-indigo-600">
          {currentBucket?.label ?? '—'} MAU
        </span>
      </div>

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
            background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
            height: '8px',
          }}
          aria-valuemin={0}
          aria-valuemax={buckets.length - 1}
          aria-valuenow={valueIndex}
          aria-valuetext={`${currentBucket?.label ?? ''} monthly active users`}
        />
      </div>

      {/* Bucket labels */}
      <div className="relative h-6">
        <div
          className="flex justify-between text-xs text-slate-500"
          aria-hidden="true"
        >
          {buckets.map((bucket, index) => {
            // Only show some labels on mobile to avoid crowding
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
                      ? 'font-semibold text-indigo-600'
                      : 'hover:text-slate-700'
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
    </div>
  );
}
