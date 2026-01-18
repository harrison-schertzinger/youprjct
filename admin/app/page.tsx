import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text overflow-x-hidden">
      {/* Ambient background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Hero glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-brand-accent/20 via-brand-accent/5 to-transparent blur-3xl" />
        {/* Left orb */}
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-gradient-radial from-purple-500/10 via-purple-500/5 to-transparent blur-3xl" />
        {/* Right orb */}
        <div className="absolute top-2/3 -right-40 w-[500px] h-[500px] bg-gradient-radial from-brand-emerald/10 via-brand-emerald/5 to-transparent blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-brand-border/50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">
            You<span className="text-brand-accent">.</span> First
          </div>
          <div className="flex items-center gap-8">
            <Link
              href="/about"
              className="text-sm text-brand-muted hover:text-brand-text transition-colors"
            >
              About
            </Link>
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

          {/* Main headline with gradient */}
          <h1 className="text-display-xl md:text-[6rem] font-bold tracking-tight mb-6 animate-fade-in-up">
            <span className="bg-gradient-to-r from-white via-white to-brand-accent bg-clip-text text-transparent">
              Order Your Life
            </span>
            <span className="text-brand-accent">.</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-xl md:text-2xl text-brand-muted max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-100">
            A premium system for those who refuse to leave their potential on the table.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
            <a
              href="#download"
              className="group inline-flex items-center gap-3 bg-white text-brand-bg px-8 py-4 rounded-2xl font-semibold hover:bg-brand-text/90 transition-all hover:scale-[1.02] shadow-lg shadow-white/10"
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

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent" />

      {/* Philosophy Section */}
      <section className="relative z-10 py-32 px-6">
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

          {/* Philosophy Cards with colored accents */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-brand-accent/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]">
              <div className="text-4xl mb-4 font-light text-brand-accent">01</div>
              <h3 className="text-xl font-semibold mb-3">Manual over automatic</h3>
              <p className="text-brand-muted leading-relaxed">
                Real discipline is built through intention, not automation. You log it. You own it. You become it.
              </p>
            </div>
            <div className="group p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-brand-emerald/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]">
              <div className="text-4xl mb-4 font-light text-brand-emerald">02</div>
              <h3 className="text-xl font-semibold mb-3">Disciplines over dopamine</h3>
              <p className="text-brand-muted leading-relaxed">
                We don&apos;t gamify your attention. We measure what matters. Consistency compounds. Streaks are earned.
              </p>
            </div>
            <div className="group p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]">
              <div className="text-4xl mb-4 font-light text-purple-500">03</div>
              <h3 className="text-xl font-semibold mb-3">Signal over noise</h3>
              <p className="text-brand-muted leading-relaxed">
                No clutter. No cognitive load. Just the essential tools to live in alignment with who you&apos;re becoming.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section with gradient panel */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 md:p-16 rounded-[2.5rem] bg-gradient-to-br from-brand-surface via-brand-card to-brand-surface border border-brand-border overflow-hidden">
            {/* Decorative gradient orbs */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-accent/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-brand-emerald/20 rounded-full blur-3xl" />

            <blockquote className="relative text-display-sm md:text-display-md text-center text-balance leading-tight">
              <span className="bg-gradient-to-r from-white via-brand-text to-brand-muted bg-clip-text text-transparent">
                &ldquo;Personal excellence is the only public solution.&rdquo;
              </span>
            </blockquote>
            <p className="relative mt-8 text-brand-muted text-lg text-center">
              8 billion people. One of you.<br />
              <span className="text-brand-accent font-medium">Don&apos;t cheat us of your contribution.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-emerald/50 to-transparent" />

      {/* Features Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-sm font-semibold text-brand-accent uppercase tracking-widest">The System</span>
            <h2 className="text-display-lg mt-4">
              Five pillars of excellence<span className="text-brand-accent">.</span>
            </h2>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* You */}
            <div className="group p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-brand-emerald transition-all duration-300 hover:shadow-[0_0_60px_rgba(16,185,129,0.2)]">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-emerald/20 to-brand-emerald/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-brand-emerald/20">
                <svg className="w-7 h-7 text-brand-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-brand-emerald transition-colors">You</h3>
              <p className="text-brand-muted">
                Win the day. Track your consistency with a visual calendar. Morning and evening routines. Tasks linked to goals.
              </p>
            </div>

            {/* Discipline */}
            <div className="group p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-brand-accent transition-all duration-300 hover:shadow-[0_0_60px_rgba(59,130,246,0.2)]">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-accent/20 to-brand-accent/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-brand-accent/20">
                <svg className="w-7 h-7 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-brand-accent transition-colors">Discipline</h3>
              <p className="text-brand-muted">
                Challenges with progress calendars. Daily rules to honor. Build the habits that build you.
              </p>
            </div>

            {/* Body */}
            <div className="group p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-orange-500 transition-all duration-300 hover:shadow-[0_0_60px_rgba(249,115,22,0.2)]">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-orange-500/20">
                <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-orange-500 transition-colors">Body</h3>
              <p className="text-brand-muted">
                Structured training tracks. PR tracking. Workout timer. Log your sessions and watch yourself evolve.
              </p>
            </div>

            {/* Goals */}
            <div className="group p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-purple-500 transition-all duration-300 hover:shadow-[0_0_60px_rgba(168,85,247,0.2)]">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-purple-500/20">
                <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-500 transition-colors">Goals</h3>
              <p className="text-brand-muted">
                Define your fuel. Break it into steps. Link daily tasks to bigger outcomes. Progress you can see.
              </p>
            </div>

            {/* Mind */}
            <div className="group p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-cyan-500 transition-all duration-300 hover:shadow-[0_0_60px_rgba(6,182,212,0.2)]">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-cyan-500/20">
                <svg className="w-7 h-7 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-cyan-500 transition-colors">Mind</h3>
              <p className="text-brand-muted">
                Reading timer. Book tracking. Feed the mind that feeds your ambition.
              </p>
            </div>

            {/* Coming Soon - Community */}
            <div className="group p-8 rounded-3xl bg-brand-card border border-brand-border/50">
              <div className="w-14 h-14 rounded-2xl bg-brand-border/30 flex items-center justify-center mb-6 border border-brand-border/50">
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

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      {/* Final CTA Section */}
      <section id="download" className="relative z-10 py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-display-md md:text-display-lg mb-6">
            <span className="bg-gradient-to-r from-white to-brand-muted bg-clip-text text-transparent">
              It is never too late to become who you could have been
            </span>
            <span className="text-brand-accent">.</span>
          </h2>
          <p className="text-xl text-brand-muted mb-12 max-w-2xl mx-auto">
            Take responsibility for your life. Build a version of yourself you&apos;re proud of.
            Who you become is a gift to the world.
          </p>

          <a
            href="#"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-white to-gray-100 text-brand-bg px-10 py-5 rounded-2xl font-semibold text-lg hover:from-white hover:to-white transition-all hover:scale-[1.02] shadow-lg shadow-white/20"
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
