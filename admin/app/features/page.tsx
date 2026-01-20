import Link from 'next/link';

export const metadata = {
  title: 'Features - You. First',
  description: 'Explore the five pillars of the You. First system: You, Discipline, Body, Goals, and Mind.',
};

const FEATURES = [
  {
    id: 'you',
    title: 'You',
    tagline: 'Win the day. Track your consistency.',
    description: 'The command center of your daily life. Track wins, build streaks, complete routines, and see your consistency visualized.',
    color: 'brand-emerald',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'discipline',
    title: 'Discipline',
    tagline: 'Rules and challenges that transform.',
    description: 'Join structured challenges with daily accountability. Set personal rules you honor. Turn intentions into non-negotiables.',
    color: 'brand-accent',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'body',
    title: 'Body',
    tagline: 'Train with intention. Track PRs.',
    description: 'Follow structured training tracks or log your own workouts. Track personal records. Your body is the vehicle.',
    color: 'orange-500',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'goals',
    title: 'Goals',
    tagline: 'Define your fuel. Break it down.',
    description: 'Set meaningful goals and break them into steps. Link daily tasks to bigger outcomes. Watch progress accumulate.',
    color: 'purple-500',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    id: 'mind',
    title: 'Mind',
    tagline: 'Feed the mind that feeds your ambition.',
    description: 'Track your reading with a built-in timer. Log books. Accumulate knowledge intentionally. The mind is a muscle.',
    color: 'cyan-500',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text overflow-x-hidden">
      {/* Ambient background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-brand-accent/20 via-brand-accent/5 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-gradient-radial from-purple-500/10 via-purple-500/5 to-transparent blur-3xl" />
        <div className="absolute top-2/3 -right-40 w-[500px] h-[500px] bg-gradient-radial from-brand-emerald/10 via-brand-emerald/5 to-transparent blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-brand-border/50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            You<span className="text-brand-accent">.</span> First
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="/system"
              className="text-sm text-brand-muted hover:text-brand-text transition-colors"
            >
              The System
            </Link>
            <Link
              href="/features"
              className="text-sm text-brand-text font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              href="/about"
              className="text-sm text-brand-muted hover:text-brand-text transition-colors"
            >
              About
            </Link>
            <a
              href="/#download"
              className="text-sm font-medium text-brand-accent hover:text-brand-accent/80 transition-colors"
            >
              Download
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-sm font-semibold text-brand-accent uppercase tracking-widest">The Five Pillars</span>
          <h1 className="text-display-lg md:text-display-xl mt-4 mb-6">
            <span className="bg-gradient-to-r from-white via-white to-brand-accent bg-clip-text text-transparent">
              Everything you need
            </span>
            <span className="text-brand-accent">.</span>
            <br />
            <span className="text-brand-muted text-display-md">Nothing you don&apos;t.</span>
          </h1>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed">
            Five pillars covering every dimension of personal excellence. Each one designed with intention. Together, they form a complete system.
          </p>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent" />

      {/* Features Grid */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-6">
            {FEATURES.map((feature, index) => (
              <Link
                key={feature.id}
                href={`/features/${feature.id}`}
                className={`group block p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-${feature.color}/50 transition-all duration-300 hover:shadow-[0_0_60px_rgba(59,130,246,0.1)]`}
              >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${feature.color}/20 to-${feature.color}/5 flex items-center justify-center flex-shrink-0 border border-${feature.color}/20 text-${feature.color} group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className={`text-${feature.color} font-mono text-sm`}>0{index + 1}</span>
                      <h2 className={`text-2xl font-bold group-hover:text-${feature.color} transition-colors`}>
                        {feature.title}
                      </h2>
                    </div>
                    <p className={`text-${feature.color} font-medium mb-3`}>{feature.tagline}</p>
                    <p className="text-brand-muted leading-relaxed">{feature.description}</p>
                  </div>
                  <div className="flex-shrink-0 self-center">
                    <span className={`text-brand-muted group-hover:text-${feature.color} group-hover:translate-x-2 transition-all text-2xl`}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-display-md mb-6">
            <span className="bg-gradient-to-r from-white to-brand-muted bg-clip-text text-transparent">
              Ready to start?
            </span>
          </h2>
          <p className="text-xl text-brand-muted mb-10 max-w-2xl mx-auto">
            Download You. First and begin building the life you want.
          </p>

          <a
            href="/#download"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-white to-gray-100 text-brand-bg px-10 py-5 rounded-2xl font-semibold text-lg hover:from-white hover:to-white transition-all hover:scale-[1.02] shadow-lg shadow-white/20"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Download You. First
            <span className="text-brand-muted group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-brand-border/50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="text-xl font-bold tracking-tight">
              You<span className="text-brand-accent">.</span> First
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
