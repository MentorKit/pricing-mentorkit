import React from 'react';
import { createRoot } from 'react-dom/client';
import { PricingCalculatorSection } from './components/PricingCalculatorSection';
import './styles.css';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('mentorkit-pricing-root');

  if (container) {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <div className="mentorkit-pricing">
          <PricingCalculatorSection />
        </div>
      </React.StrictMode>
    );
  }
});
