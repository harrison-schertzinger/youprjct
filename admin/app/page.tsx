import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text overflow-x-hidden">
      {/* Ambient glow effect */}
      <div className="fixed inset-0 bg-hero-glow pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-50 border-b border-brand-border/50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">
            You<span className="text-brand-accent">.</span> First
          </div>
          <div className="flex items-center gap-8">
            <Link
              href="/privacy"
              className="text-sm text-brand-muted hover:text-brand-text transition-colors"
            >
              Privacy
            </Link>
            <a
              href="#download"
              className="text-sm font-medium text-brand-accent hover:text-brand-accent/80 transition-colors"
            >
              Download
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-surface border border-brand-border mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
            <span className="text-sm text-brand-muted">For athletes and high-performers</span>
          </div>

          {/* Main headline */}
          <h1 className="text-display-xl md:text-[6rem] font-bold tracking-tight mb-6 animate-fade-in-up">
            Order Your Life<span className="text-brand-accent">.</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-xl md:text-2xl text-brand-muted max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-100">
            Order your thoughts and you order your life.
            A premium system for those who refuse to leave their potential on the table.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
            <a
              href="#download"
              className="group inline-flex items-center gap-3 bg-white text-brand-bg px-8 py-4 rounded-2xl font-semibold hover:bg-brand-text/90 transition-all hover:scale-[1.02]"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download on App Store
              <span className="text-brand-muted group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="relative z-10 py-32 px-6 border-t border-brand-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-sm font-semibold text-brand-accent uppercase tracking-widest">The Philosophy</span>
            <h2 className="text-display-lg mt-4 mb-6">
              You are the project<span className="text-brand-accent">.</span>
            </h2>
            <p className="text-xl text-brand-muted max-w-2xl mx-auto">
              A work in progress and a masterpiece. The vision and the outcome are one—once the tool is in hand and the path is clear, action is all that remains.
            </p>
          </div>

          {/* Philosophy Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-brand-accent/30 transition-colors">
              <div className="text-4xl mb-4">01</div>
              <h3 className="text-xl font-semibold mb-3">Manual over automatic</h3>
              <p className="text-brand-muted leading-relaxed">
                Real discipline is built through intention, not automation. You log it. You own it. You become it.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-brand-accent/30 transition-colors">
              <div className="text-4xl mb-4">02</div>
              <h3 className="text-xl font-semibold mb-3">Disciplines over dopamine</h3>
              <p className="text-brand-muted leading-relaxed">
                We don&apos;t gamify your attention. We measure what matters. Consistency compounds. Streaks are earned.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-brand-accent/30 transition-colors">
              <div className="text-4xl mb-4">03</div>
              <h3 className="text-xl font-semibold mb-3">Signal over noise</h3>
              <p className="text-brand-muted leading-relaxed">
                No clutter. No cognitive load. Just the essential tools to live in alignment with who you&apos;re becoming.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-display-md md:text-display-lg text-balance leading-tight">
            &ldquo;Personal excellence is the only public solution.&rdquo;
          </blockquote>
          <p className="mt-6 text-brand-muted text-lg">
            8 billion people. One of you. Don&apos;t cheat us of your contribution.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-6 border-t border-brand-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-sm font-semibold text-brand-accent uppercase tracking-widest">The System</span>
            <h2 className="text-display-lg mt-4">
              Five pillars of excellence<span className="text-brand-accent">.</span>
            </h2>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* You */}
            <div className="group p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-brand-emerald/50 transition-all hover:glow-emerald">
              <div className="w-14 h-14 rounded-2xl bg-brand-emerald/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-brand-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">You</h3>
              <p className="text-brand-muted">
                Win the day. Track your consistency with a visual calendar. Morning and evening routines. Tasks linked to goals.
              </p>
            </div>

            {/* Discipline */}
            <div className="group p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-brand-accent/50 transition-all hover:glow">
              <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Discipline</h3>
              <p className="text-brand-muted">
                Challenges with progress calendars. Daily rules to honor. Build the habits that build you.
              </p>
            </div>

            {/* Body */}
            <div className="group p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-orange-500/50 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Body</h3>
              <p className="text-brand-muted">
                Structured training tracks. PR tracking. Workout timer. Log your sessions and watch yourself evolve.
              </p>
            </div>

            {/* Goals */}
            <div className="group p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-purple-500/50 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Goals</h3>
              <p className="text-brand-muted">
                Define your fuel. Break it into steps. Link daily tasks to bigger outcomes. Progress you can see.
              </p>
            </div>

            {/* Mind */}
            <div className="group p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-cyan-500/50 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Mind</h3>
              <p className="text-brand-muted">
                Reading timer. Book tracking. Feed the mind that feeds your ambition.
              </p>
            </div>

            {/* Coming Soon - Community */}
            <div className="group p-8 rounded-3xl bg-brand-card border border-brand-border/50 opacity-60">
              <div className="w-14 h-14 rounded-2xl bg-brand-border/50 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-brand-muted">Community</h3>
              <p className="text-brand-muted/70">
                Coming soon. Train with others. Compete on leaderboards. Iron sharpens iron.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="download" className="relative z-10 py-32 px-6 border-t border-brand-border/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-display-lg mb-6">
            It is never too late to become who you could have been<span className="text-brand-accent">.</span>
          </h2>
          <p className="text-xl text-brand-muted mb-12 max-w-2xl mx-auto">
            Take responsibility for your life. Build a version of yourself you&apos;re proud of.
            Who you become is a gift to the world.
          </p>

          <a
            href="#"
            className="group inline-flex items-center gap-3 bg-white text-brand-bg px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-brand-text/90 transition-all hover:scale-[1.02]"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Download You. First
            <span className="text-brand-muted group-hover:translate-x-1 transition-transform">→</span>
          </a>

          <p className="mt-8 text-sm text-brand-muted">
            Available on iOS. Android coming soon.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-brand-border/50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-xl font-bold tracking-tight">
              You<span className="text-brand-accent">.</span> First
            </div>
            <div className="flex items-center gap-8 text-sm text-brand-muted">
              <Link href="/privacy" className="hover:text-brand-text transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-brand-text transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-brand-border/30 text-center">
            <p className="text-sm text-brand-muted">
              &copy; {new Date().getFullYear()} You. First. All rights reserved.
            </p>
            <p className="mt-2 text-xs text-brand-muted/60">
              Give us what you&apos;ve got.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
