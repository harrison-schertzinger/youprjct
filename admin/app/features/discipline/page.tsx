import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Discipline - Features - You. First',
  description: 'Structured challenges with daily accountability. Set personal rules you honor. Turn intentions into non-negotiables.',
};

export default function DisciplineFeaturePage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text overflow-x-hidden">
      {/* Ambient background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-brand-accent/20 via-brand-accent/5 to-transparent blur-3xl" />
        <div className="absolute top-2/3 -right-40 w-[500px] h-[500px] bg-gradient-radial from-brand-accent/10 via-brand-accent/5 to-transparent blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-brand-border/50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            You<span className="text-brand-accent">.</span> First
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/system" className="text-sm text-brand-muted hover:text-brand-text transition-colors">
              The System
            </Link>
            <Link href="/features" className="text-sm text-brand-text font-medium transition-colors">
              Features
            </Link>
            <Link href="/about" className="text-sm text-brand-muted hover:text-brand-text transition-colors">
              About
            </Link>
            <a href="/#download" className="text-sm font-medium text-brand-accent hover:text-brand-accent/80 transition-colors">
              Download
            </a>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-8">
        <div className="flex items-center gap-2 text-sm text-brand-muted">
          <Link href="/features" className="hover:text-brand-text transition-colors">Features</Link>
          <span>/</span>
          <span className="text-brand-accent">Discipline</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-accent/20 to-brand-accent/5 flex items-center justify-center mb-6 border border-brand-accent/20">
                <svg className="w-8 h-8 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-display-lg mb-4">
                <span className="text-brand-accent">Discipline</span>
                <span className="text-brand-emerald">.</span>
              </h1>
              <p className="text-2xl text-brand-muted mb-6">
                Where intentions become non-negotiables.
              </p>
              <p className="text-lg text-brand-muted leading-relaxed">
                Discipline isn&apos;t punishment. It&apos;s freedom. The Discipline tab gives you structured challenges and personal rules that transform who you are—one day at a time.
              </p>
            </div>

            {/* Phone mockup */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-radial from-brand-accent/30 via-brand-accent/10 to-transparent blur-3xl scale-150" />
                <div className="relative w-[260px] h-[540px] rounded-[2.5rem] border-[6px] border-brand-border bg-brand-surface p-2 shadow-2xl shadow-black/50">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-brand-bg rounded-full z-10" />
                  <div className="w-full h-full rounded-[2rem] overflow-hidden bg-brand-bg">
                    <Image
                      src="/images/App screenshots/challenge-page.PNG"
                      alt="You. First - Discipline Challenges"
                      width={260}
                      height={540}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent" />

      {/* Challenges Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold text-brand-accent uppercase tracking-widest">Core Feature</span>
              <h2 className="text-display-sm mt-4 mb-6">
                Structured Challenges<span className="text-brand-accent">.</span>
              </h2>
              <div className="space-y-4 text-brand-muted leading-relaxed">
                <p>
                  Join challenges with clear rules and daily accountability. Each challenge is designed to push you beyond your comfort zone and build lasting discipline.
                </p>
                <p>
                  <span className="text-brand-text font-medium">Daily check-ins</span> keep you honest. Miss a day? The challenge restarts. That&apos;s not harsh—that&apos;s how real transformation works.
                </p>
                <p>
                  Choose challenges that match where you are: beginner, intermediate, or advanced. Start with what stretches you, not what breaks you.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {/* Challenge cards preview */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">75 Hard</h3>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Advanced</span>
                </div>
                <p className="text-sm text-white/80 mb-4">The original mental toughness challenge. 75 days of uncompromising discipline.</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-white rounded-full" />
                  </div>
                  <span className="text-sm">Day 25/75</span>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">Phase One</h3>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Beginner</span>
                </div>
                <p className="text-sm text-white/80 mb-4">Build your foundation. 30 days to establish the basics.</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-white rounded-full" />
                  </div>
                  <span className="text-sm">Day 20/30</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />

      {/* Daily Rules Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border">
                <h3 className="text-lg font-semibold mb-6 text-brand-accent">Today&apos;s Rules</h3>
                <div className="space-y-4">
                  {[
                    { rule: 'Two 45-minute workouts', done: true },
                    { rule: 'Follow a diet (no cheat meals)', done: true },
                    { rule: 'Drink 1 gallon of water', done: false },
                    { rule: 'Read 10 pages', done: false },
                    { rule: 'No alcohol', done: true },
                    { rule: 'Take a progress photo', done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-brand-card border border-brand-border">
                      <div className={`w-6 h-6 rounded-md ${item.done ? 'bg-brand-accent' : 'border-2 border-brand-border'} flex items-center justify-center`}>
                        {item.done && <span className="text-white text-sm">✓</span>}
                      </div>
                      <span className={item.done ? 'text-brand-muted line-through' : 'text-brand-text'}>{item.rule}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-brand-border flex justify-between items-center">
                  <span className="text-brand-muted">Progress</span>
                  <span className="text-brand-accent font-semibold">3/6 complete</span>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-sm font-semibold text-brand-accent uppercase tracking-widest">Daily Accountability</span>
              <h2 className="text-display-sm mt-4 mb-6">
                Rules you honor<span className="text-brand-accent">.</span>
              </h2>
              <div className="space-y-4 text-brand-muted leading-relaxed">
                <p>
                  Each challenge comes with daily rules. These aren&apos;t suggestions—they&apos;re commitments you make to yourself.
                </p>
                <p>
                  <span className="text-brand-text font-medium">Check off each rule</span> as you complete it. At the end of the day, you either honored all of them or you didn&apos;t. Binary. Honest.
                </p>
                <p>
                  The rules are designed to work together. Diet supports workouts. Reading supports mindset. Water supports everything. It&apos;s a system, not a checklist.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />

      {/* Progress Calendar Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-brand-accent uppercase tracking-widest">Visual Progress</span>
            <h2 className="text-display-sm mt-4 mb-6">
              See your commitment<span className="text-brand-accent">.</span>
            </h2>
            <p className="text-xl text-brand-muted max-w-2xl mx-auto">
              Every day you complete shows on your progress calendar. Watch the days fill in. Watch yourself transform.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold">Challenge Progress</h3>
              <span className="text-brand-accent">Day 25 of 75</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {[...Array(75)].map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-sm ${
                    i < 25
                      ? 'bg-brand-accent'
                      : i === 25
                      ? 'bg-brand-accent/50 animate-pulse'
                      : 'bg-brand-border/50'
                  }`}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-between text-sm text-brand-muted">
              <span>Started: Dec 26</span>
              <span>Target: March 11</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />

      {/* Philosophy Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-brand-surface via-brand-card to-brand-surface border border-brand-border overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-accent/20 rounded-full blur-3xl" />

            <div className="relative text-center">
              <h2 className="text-display-sm mb-6">
                Why challenges work<span className="text-brand-accent">.</span>
              </h2>
              <div className="space-y-6 text-brand-muted text-lg">
                <p>
                  A challenge gives you a <span className="text-brand-text font-medium">container for transformation</span>. It&apos;s not open-ended—it has rules, duration, and stakes.
                </p>
                <p>
                  The structure removes decision fatigue. You don&apos;t negotiate with yourself about whether to work out today. The challenge says you do. Period.
                </p>
                <p>
                  By the end, the habits aren&apos;t habits anymore. <span className="text-brand-text font-medium">They&apos;re identity.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent" />

      {/* Next Feature CTA */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-brand-muted mb-4">Next Feature</p>
          <Link
            href="/features/body"
            className="group inline-flex items-center gap-4 text-display-sm hover:text-orange-500 transition-colors"
          >
            Body
            <span className="text-brand-muted group-hover:text-orange-500 group-hover:translate-x-2 transition-all">→</span>
          </Link>
          <p className="text-brand-muted mt-4">Train with intention. Track your PRs.</p>
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
              <Link href="/privacy" className="hover:text-brand-text transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-brand-text transition-colors">Terms of Service</Link>
              <Link href="/support" className="hover:text-brand-text transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
