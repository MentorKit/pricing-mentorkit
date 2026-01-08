---
name: Auth0-style pricing page
overview: Bootstrap a new Next.js (App Router) site in this empty repo and implement an Auth0-style pricing page with toggles + MAU slider + config-driven plan cards (placeholder prices), keeping the pricing rules in a single editable config file.
todos:
  - id: bootstrap-next
    content: Bootstrap a Next.js (App Router) project in the empty repo with styling setup (Tailwind or CSS modules).
    status: completed
  - id: pricing-config
    content: Add config-driven pricing model (MAU buckets, plans, placeholder price matrix).
    status: completed
    dependencies:
      - bootstrap-next
  - id: pricing-engine
    content: Implement pure pricing engine that maps state -> card view models.
    status: completed
    dependencies:
      - pricing-config
  - id: pricing-ui
    content: Build PricingCalculatorSection + toggles + MAU slider + plan cards (Auth0-like behavior).
    status: completed
    dependencies:
      - pricing-engine
  - id: pricing-page
    content: Create /pricing page composing intro + calculator section (and stub sections for future expansion).
    status: completed
    dependencies:
      - pricing-ui
  - id: engine-tests
    content: Add unit tests for pricing engine behavior (a few key selections).
    status: in_progress
    dependencies:
      - pricing-engine
---

# Auth0-style pricing page (MentorKit)

## Goal

Replicate the *interaction model* and overall layout feel of `auth0.com/pricing`: a pricing calculator with **Use case toggle (B2B/B2C)**, **Billing toggle (Monthly/Yearly)**, **MAU slider with discrete tiers**, and **plan cards** that update instantly—implemented in this repo as a new Next.js site.

## Key decisions / constraints

- Repo folder `/Users/sinfjell/repositories/pricing-mentorkit` is currently empty → we will **bootstrap a new Next.js (App Router)** project here.
- Pricing values will be **placeholders for now**, but the architecture will make it trivial to drop in real prices later.
- Pricing logic must be **config-driven** and tested (pure engine functions), so marketing/product can edit numbers without touching UI code.

## Implementation outline

### 1) Bootstrap the app

- Initialize a Next.js App Router project.
- Add Tailwind (or CSS modules) for fast iteration and consistent styling.
- Create routes:
- `/` minimal landing (optional)
- `/pricing` the main replicated page

**Files introduced/edited**

- [`package.json`](/Users/sinfjell/repositories/pricing-mentorkit/package.json)
- [`next.config.ts`](/Users/sinfjell/repositories/pricing-mentorkit/next.config.ts) (or `.js`)
- [`app/layout.tsx`](/Users/sinfjell/repositories/pricing-mentorkit/app/layout.tsx)
- [`app/pricing/page.tsx`](/Users/sinfjell/repositories/pricing-mentorkit/app/pricing/page.tsx)

### 2) Pricing config (single source of truth)

Create a config that defines:

- **MAU buckets** (including a `30k+` style bucket)
- **Use cases**: `b2b | b2c`
- **Billing**: `monthly | yearly`
- **Plans**: `free | essentials | professional | enterprise` (names can be changed later)
- **Price matrix**: `prices[useCase][billing][planId][mauBucketId]`

**Files**

- [`components/pricing/pricing.config.ts`](/Users/sinfjell/repositories/pricing-mentorkit/components/pricing/pricing.config.ts)

### 3) Pricing engine (pure, testable)

Implement:

- `getPricingSelection(state)` → produces view models for cards
- Handles:
- enterprise as "Contact us"
- unavailable tiers as "Not available" (or we can clamp—will pick one and document it)
- consistent display strings (e.g. “/month”, “billed yearly”)

**Files**

- [`components/pricing/pricing.engine.ts`](/Users/sinfjell/repositories/pricing-mentorkit/components/pricing/pricing.engine.ts)

### 4) UI components (Auth0-like behavior)

Build reusable components:

- `PricingCalculatorSection` (state owner)
- `SegmentedToggle` (use case + billing)
- `MauSlider` (`input[type=range]` with discrete stops + labels)
- `PlanCard` (consistent card layout, one can be “recommended”)
- `PlanGrid`

**Files**

- [`components/pricing/PricingCalculatorSection.tsx`](/Users/sinfjell/repositories/pricing-mentorkit/components/pricing/PricingCalculatorSection.tsx)
- [`components/pricing/SegmentedToggle.tsx`](/Users/sinfjell/repositories/pricing-mentorkit/components/pricing/SegmentedToggle.tsx)
- [`components/pricing/MauSlider.tsx`](/Users/sinfjell/repositories/pricing-mentorkit/components/pricing/MauSlider.tsx)
- [`components/pricing/PlanCard.tsx`](/Users/sinfjell/repositories/pricing-mentorkit/components/pricing/PlanCard.tsx)
- [`components/pricing/PlanGrid.tsx`](/Users/sinfjell/repositories/pricing-mentorkit/components/pricing/PlanGrid.tsx)

### 5) Pricing page composition

Create a `/pricing` page that contains:

- Page intro (title + short copy)
- Calculator section (toggles + slider + cards)
- (Optional) Feature comparison section stub so the page can expand toward a full Auth0-style layout later

**File**

- [`app/pricing/page.tsx`](/Users/sinfjell/repositories/pricing-mentorkit/app/pricing/page.tsx)

### 6) Tests for the pricing engine

Add a small test suite for `pricing.engine.ts` so changes to config don’t accidentally break behavior.

**Files**

- [`components/pricing/pricing.engine.test.ts`](/Users/sinfjell/repositories/pricing-mentorkit/components/pricing/pricing.engine.test.ts)
- (test runner config, depending on chosen stack)

### 7) Nice-to-have hooks (non-blocking)

- Lightweight `trackPricingEvent()` stub for later analytics (no vendor lock-in yet)

**File (optional)**

- [`components/pricing/pricing.analytics.ts`](/Users/sinfjell/repositories/pricing-mentorkit/components/pricing/pricing.analytics.ts)

## Acceptance criteria

- Use case toggle, billing toggle, and MAU slider all work via client-side state.
- Plan cards update instantly with **deterministic** values from `pricing.config.ts`.
- Accessibility basics: keyboard operable toggles and slider; visible selected state.
- Pricing logic is covered by a few unit tests.

## Follow-up (after placeholders)

Once you share the real numbers, we’ll only need to update `pricing.config.ts` (and possibly plan names/features), not the UI or engine.