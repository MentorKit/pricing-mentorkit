'use client';

import { useId } from 'react';

export interface ToggleOption<T extends string> {
  value: T;
  label: string;
  badge?: string;
}

interface SegmentedToggleProps<T extends string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  className?: string;
}

export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  label,
  className = '',
}: SegmentedToggleProps<T>) {
  const id = useId();

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let newIndex = currentIndex;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      newIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      newIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
    }

    if (newIndex !== currentIndex) {
      onChange(options[newIndex].value);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <span className="text-sm font-medium text-foreground-secondary" id={`${id}-label`}>
          {label}
        </span>
      )}
      <div
        role="radiogroup"
        aria-labelledby={label ? `${id}-label` : undefined}
        className="inline-flex rounded-lg border border-border bg-background p-1 shadow-sm"
      >
        {options.map((option, index) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onChange(option.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`
                relative flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold
                transition-all duration-200 focus:outline-none focus-visible:ring-2
                focus-visible:ring-primary focus-visible:ring-offset-2
                ${
                  isSelected
                    ? 'bg-primary text-primary-text shadow-md'
                    : 'text-foreground-secondary hover:bg-accent hover:text-foreground'
                }
              `}
            >
              {option.label}
              {option.badge && (
                <span
                  className={`
                    rounded-full px-2 py-0.5 text-xs font-semibold
                    ${
                      isSelected
                        ? 'bg-primary-text/20 text-primary-text'
                        : 'bg-primary/10 text-primary'
                    }
                  `}
                >
                  {option.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
