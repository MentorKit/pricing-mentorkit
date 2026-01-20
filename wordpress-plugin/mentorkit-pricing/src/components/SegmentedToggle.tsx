import React, { useId } from 'react';

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
}

export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  label,
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
    <div className="mk-billing-section">
      {label && (
        <span className="mk-billing-label" id={`${id}-label`}>
          {label}
        </span>
      )}
      <div
        role="radiogroup"
        aria-labelledby={label ? `${id}-label` : undefined}
        className="mk-segmented-toggle"
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
              className={`mk-toggle-button ${
                isSelected ? 'mk-toggle-button--active' : 'mk-toggle-button--inactive'
              }`}
            >
              {option.label}
              {option.badge && (
                <span
                  className={`mk-toggle-badge ${
                    isSelected ? 'mk-toggle-badge--active' : 'mk-toggle-badge--inactive'
                  }`}
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
