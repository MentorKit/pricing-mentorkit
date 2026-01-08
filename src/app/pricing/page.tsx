import { PricingCalculatorSection } from '@/components/pricing';

export const metadata = {
  title: 'Pricing | MentorKit',
  description: 'Choose the MentorKit plan that fits your needs. Pricing based on course creators and active users.',
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl">
            From course creation to full learning platforms.
            <br className="hidden sm:inline" />
            Choose the plan that works best for your organisation.
          </p>
        </div>
      </section>

      {/* Pricing Calculator */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <PricingCalculatorSection />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-slate-200 bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-12 space-y-8">
            <FaqItem
              question="What is a course creator?"
              answer="A course creator is anyone who uses MentorKit to build and edit courses. This includes instructional designers, subject matter experts, and training managers who actively work in the Course Creator tool."
            />
            <FaqItem
              question="What counts as an active user?"
              answer="An active user is any learner who logs in or accesses course content at least once during a billing period. Active users only apply to Suite Classic and Suite Pro plans that include the LMS."
            />
            <FaqItem
              question="Can I change my plan later?"
              answer="Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments."
            />
            <FaqItem
              question="What's the difference between Author and Suite plans?"
              answer="Author is for teams that only need to create courses and export them (SCORM/xAPI) to use elsewhere. Suite plans include both the Course Creator and an LMS for delivering courses and tracking learner progress."
            />
            <FaqItem
              question="Do you offer discounts for larger teams?"
              answer="Yes! We offer volume discounts for organisations with many course creators or large user bases. Contact our sales team to discuss your needs."
            />
            <FaqItem
              question="What's included in Enterprise?"
              answer="Enterprise includes everything in Suite Pro plus webshop capabilities for selling courses, custom integrations, MentorKit Assist for setup and customisation, and custom SLAs. Pricing is tailored to your specific requirements."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-indigo-100">
            Start your free trial today. No credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600"
            >
              Start free trial
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-transparent px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600"
            >
              Contact sales
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

// FAQ Item component
function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-slate-200 pb-8">
      <h3 className="text-lg font-semibold text-slate-900">{question}</h3>
      <p className="mt-3 text-slate-600">{answer}</p>
    </div>
  );
}
