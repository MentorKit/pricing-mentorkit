'use client';

const ENTERPRISE_ADDONS = [
  'E-commerce Integration (WooCommerce)',
  'Automation API (Uncanny Automator)',
  'Single Sign-On (SSO)',
  'Multilingual Support (Polylang)',
  'Advanced Tables & Forms',
  'AI Video Generation (Synthesia)',
  'MailChimp Integration',
  'AI-Powered Test Creation',
  'AI-Powered Search',
  'Virtual Instructor',
  'Extended Media Library Storage',
  'Webinar Hosting (50 participants, 120GB)',
  'Webinar Hosting (80 participants, 120GB)',
  'Webinar Hosting (150 participants, 120GB)',
  'Microsoft Teams Integration',
  'Microsoft Office Resources Integration',
  'Calendar Integration',
  'Enterprise Email System Integration',
  'HR System Integration',
  'Membership Management',
  'SMS Authentication',
  'SMS Credits (100 per month)',
];

export function EnterpriseAddOns() {
  return (
    <section className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          Enterprise Add-ons
        </h2>
        <p className="mt-4 text-lg text-foreground-secondary">
          Enhance your MentorKit platform with powerful add-ons and integrations
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ENTERPRISE_ADDONS.map((addon, index) => (
          <div
            key={index}
            className="rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary/50 hover:bg-background-muted"
          >
            <p className="text-sm font-medium text-foreground">{addon}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-foreground-secondary">
          Contact our sales team to learn more about pricing and availability for these add-ons.
        </p>
        <a
          href="/contact?addons=true"
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Contact sales about add-ons
        </a>
      </div>
    </section>
  );
}
