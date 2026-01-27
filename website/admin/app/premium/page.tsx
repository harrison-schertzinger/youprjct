import Link from 'next/link';

export const metadata = {
  title: 'Premium - You. First',
  description: 'Unlock the full You. First experience. Personal Mastery Dashboard, advanced analytics, and more.',
};

const FREE_FEATURES = [
  'Win the Day tracking',
  'Basic streak tracking',
  'Morning & evening routines',
  'Daily tasks',
  'Goal setting & steps',
  'Join community challenges',
  'Training session logging',
  'Reading timer',
  'Book tracking',
];

const PRO_FEATURES = [
  {
    title: 'Personal Mastery Dashboard',
    description: 'See your excellence score, time investment, and performance trends at a glance.',
    icon: '📊',
  },
  {
    title: 'Daily Excellence Score',
    description: 'A holistic metric combining your wins, routines, and tasks into one powerful number.',
    icon: '⭐',
  },
  {
    title: 'Advanced Analytics',
    description: 'Deep insights into your consistency patterns, streaks, and progress over time.',
    icon: '📈',
  },
  {
    title: 'Time Investment Tracking',
    description: 'See exactly where your time goes across training, reading, and focused work.',
    icon: '⏱️',
  },
  {
    title: 'Streak Milestones & Badges',
    description: 'Earn badges at 7, 21, 40, and 50 day streaks. Celebrate your consistency.',
    icon: '🏆',
  },
  {
    title: 'Priority Support',
    description: 'Get faster responses and direct access to the founding team.',
    icon: '💬',
  },
];

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text overflow-x-hidden">
      {/* Ambient background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-brand-gold/20 via-brand-gold/5 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-gradient-radial from-brand-accent/10 via-brand-accent/5 to-transparent blur-3xl" />
        <div className="absolute top-2/3 -right-40 w-[500px] h-[500px] bg-gradient-radial from-brand-gold/10 via-brand-gold/5 to-transparent blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-brand-border/50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            You<span className="text-brand-accent">.</span>Prjct
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/system" className="text-sm text-brand-muted hover:text-brand-text transition-colors">
              The System
            </Link>
            <Link href="/features" className="text-sm text-brand-muted hover:text-brand-text transition-colors">
              Features
            </Link>
            <Link href="/about" className="text-sm text-brand-muted hover:text-brand-text transition-colors">
              About
            </Link>
            <a href="/#download" className="text-sm font-medium text-brand-accent hover:text-brand-accent/80 transition-colors">
              Download
            </a>
          </div>
          <a href="/#download" className="md:hidden text-sm font-medium text-brand-accent hover:text-brand-accent/80 transition-colors">
            Download
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-8">
            <span className="text-brand-gold">✦</span>
            <span className="text-sm text-brand-gold font-medium">You. First Pro</span>
          </div>
          <h1 className="text-display-lg md:text-display-xl mt-4 mb-6">
            <span className="bg-gradient-to-r from-white via-brand-gold to-white bg-clip-text text-transparent">
              Unlock your full potential
            </span>
            <span className="text-brand-gold">.</span>
          </h1>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed">
            The free version builds discipline. Pro helps you master it with advanced analytics, insights, and the Personal Mastery Dashboard.
          </p>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

      {/* Pricing Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Free</h2>
                <p className="text-brand-muted">Everything you need to start</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-brand-muted">/forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                {FREE_FEATURES.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-brand-muted">
                    <svg className="w-5 h-5 text-brand-emerald flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="/#download"
                className="block w-full py-4 rounded-xl bg-brand-border text-brand-text font-semibold text-center hover:bg-brand-border/80 transition-colors"
              >
                Download Free
              </a>
            </div>

            {/* Pro Tier */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-brand-gold/10 to-transparent border-2 border-brand-gold/30 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-gold text-brand-bg text-sm font-bold rounded-full">
                RECOMMENDED
              </div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 text-brand-gold">Pro</h2>
                <p className="text-brand-muted">For serious commitment</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold">$4.99</span>
                <span className="text-brand-muted">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-brand-muted">
                  <svg className="w-5 h-5 text-brand-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Everything in Free
                </li>
                {PRO_FEATURES.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-brand-text">
                    <svg className="w-5 h-5 text-brand-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature.title}
                  </li>
                ))}
              </ul>
              <a
                href="/#download"
                className="block w-full py-4 rounded-xl bg-brand-gold text-brand-bg font-semibold text-center hover:bg-brand-gold/90 transition-colors"
              >
                Start Free Trial
              </a>
              <p className="text-center text-sm text-brand-muted mt-4">
                7-day free trial, cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />

      {/* Pro Features Detail */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-brand-gold uppercase tracking-widest">Pro Features</span>
            <h2 className="text-display-md mt-4">
              What you unlock<span className="text-brand-gold">.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRO_FEATURES.map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-brand-surface border border-brand-border hover:border-brand-gold/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center mb-4 border border-brand-gold/20">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-brand-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />

      {/* Personal Mastery Dashboard Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold text-brand-gold uppercase tracking-widest">Flagship Feature</span>
              <h2 className="text-display-sm mt-4 mb-6">
                Personal Mastery Dashboard<span className="text-brand-gold">.</span>
              </h2>
              <div className="space-y-4 text-brand-muted leading-relaxed">
                <p>
                  Your command center for personal excellence. See everything that matters in one view.
                </p>
                <p>
                  <span className="text-brand-text font-medium">Daily Excellence Score</span> — A single number (0-100%) that combines your wins, routine completion, and task completion. Watch it climb as you build consistency.
                </p>
                <p>
                  <span className="text-brand-text font-medium">Time Investment</span> — See exactly how much time you&apos;re investing in training, reading, and focused work. Know where your hours go.
                </p>
                <p>
                  <span className="text-brand-text font-medium">Trend Analysis</span> — Are you improving? The dashboard shows your trajectory over 7 days, 30 days, and 6 months.
                </p>
              </div>
            </div>
            <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border">
              <div className="text-center mb-6">
                <p className="text-sm text-brand-muted mb-2">Today&apos;s Excellence Score</p>
                <div className="text-6xl font-bold text-brand-gold">87%</div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-brand-emerald">↑</span>
                  <span className="text-sm text-brand-emerald">+12% from last week</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-brand-card border border-brand-border">
                  <span className="text-brand-muted">Win Rate</span>
                  <span className="font-semibold text-brand-emerald">40/40</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-brand-card border border-brand-border">
                  <span className="text-brand-muted">Routines</span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-brand-card border border-brand-border">
                  <span className="text-brand-muted">Tasks</span>
                  <span className="font-semibold">92%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

      {/* FAQ Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-display-sm">
              Questions<span className="text-brand-gold">?</span>
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'Can I try Pro before committing?',
                a: 'Yes. Pro comes with a 7-day free trial. Try all the features, and if it\'s not for you, cancel before the trial ends and you won\'t be charged.',
              },
              {
                q: 'What happens to my data if I cancel?',
                a: 'All your data stays intact. You\'ll still have full access to the free features. Pro features like the Personal Mastery Dashboard will be locked until you resubscribe.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Cancel anytime through your App Store subscription settings. No contracts, no hassle.',
              },
              {
                q: 'Is the free version really free?',
                a: 'Completely. No ads, no data selling, no tricks. The free version has everything you need to build discipline. Pro is for those who want deeper insights.',
              },
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-brand-surface border border-brand-border">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-brand-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

      {/* Final CTA */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-display-md mb-6">
            <span className="bg-gradient-to-r from-white to-brand-gold bg-clip-text text-transparent">
              Ready to level up?
            </span>
          </h2>
          <p className="text-xl text-brand-muted mb-10 max-w-2xl mx-auto">
            Start free. Upgrade when you&apos;re ready. The system works either way—Pro just helps you see it.
          </p>

          <a
            href="/#download"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-brand-gold to-brand-gold/80 text-brand-bg px-10 py-5 rounded-2xl font-semibold text-lg hover:from-brand-gold hover:to-brand-gold transition-all hover:scale-[1.02] shadow-lg shadow-brand-gold/20"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Download You. First
            <span className="opacity-70 group-hover:translate-x-1 transition-transform">→</span>
          </a>

          <p className="mt-6 text-sm text-brand-muted">
            Available on iOS • Free to start • Pro: $4.99/month
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-brand-border/50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="text-xl font-bold tracking-tight">
              You<span className="text-brand-accent">.</span>Prjct
            </Link>
            <div className="flex items-center gap-8 text-sm text-brand-muted">
              <Link href="/privacy" className="hover:text-brand-text transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-brand-text transition-colors">
                Terms of Service
              </Link>
              <Link href="/support" className="hover:text-brand-text transition-colors">
                Support
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-brand-border/30 text-center">
            <p className="text-sm text-brand-muted">
              &copy; {new Date().getFullYear()} You. First. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
