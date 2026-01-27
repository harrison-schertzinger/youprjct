import Link from 'next/link';

export const metadata = {
  title: 'The System - You. First',
  description: 'The methodology behind You. First. A complete system to initiate, sustain, and elevate personal performance.',
};

export default function SystemPage() {
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
            You<span className="text-brand-accent">.</span>Prjct
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/system"
              className="text-sm text-brand-text font-medium transition-colors"
            >
              The System
            </Link>
            <Link
              href="/features"
              className="text-sm text-brand-muted hover:text-brand-text transition-colors"
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
          <a href="/#download" className="md:hidden text-sm font-medium text-brand-accent hover:text-brand-accent/80 transition-colors">
            Download
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-sm font-semibold text-brand-accent uppercase tracking-widest">The Methodology</span>
          <h1 className="text-display-lg md:text-display-xl mt-4 mb-6">
            A system built for<br />
            <span className="bg-gradient-to-r from-white via-white to-brand-accent bg-clip-text text-transparent">
              who you&apos;re becoming
            </span>
            <span className="text-brand-accent">.</span>
          </h1>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed">
            Most apps optimize for engagement. We optimize for transformation.
            Here&apos;s why that difference matters.
          </p>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent" />

      {/* The Problem Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-red-400 uppercase tracking-widest">The Problem</span>
            <h2 className="text-display-md mt-4">
              Why most apps fail you<span className="text-red-400">.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Dopamine Traps</h3>
              <p className="text-brand-muted leading-relaxed">
                Badges, streaks, and notifications designed to keep you opening the app—not actually improving your life.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Feature Bloat</h3>
              <p className="text-brand-muted leading-relaxed">
                Apps that try to do everything end up doing nothing well. Complexity becomes friction. Friction kills consistency.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">No Real Methodology</h3>
              <p className="text-brand-muted leading-relaxed">
                A checklist isn&apos;t a system. Without a philosophy connecting the pieces, you&apos;re just tracking tasks—not building a life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-red-400/30 to-transparent" />

      {/* Our Approach Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-brand-emerald uppercase tracking-widest">Our Approach</span>
            <h2 className="text-display-md mt-4">
              Three phases of transformation<span className="text-brand-emerald">.</span>
            </h2>
            <p className="text-xl text-brand-muted max-w-2xl mx-auto mt-6">
              Excellence isn&apos;t a single act. It&apos;s a process that unfolds in stages.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Initiate */}
            <div className="relative">
              <div className="p-8 rounded-3xl bg-gradient-to-b from-brand-accent/10 to-transparent border border-brand-accent/30">
                <div className="text-6xl font-bold text-brand-accent/20 mb-4">01</div>
                <h3 className="text-2xl font-bold mb-4 text-brand-accent">Initiate</h3>
                <p className="text-brand-muted leading-relaxed mb-6">
                  Start with clarity. Define your goals. Choose the routines that serve them. Pick a challenge that pushes you.
                </p>
                <ul className="space-y-2 text-sm text-brand-muted">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                    Set meaningful goals
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                    Design morning & evening routines
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                    Commit to a challenge
                  </li>
                </ul>
              </div>
            </div>

            {/* Sustain */}
            <div className="relative">
              <div className="p-8 rounded-3xl bg-gradient-to-b from-brand-emerald/10 to-transparent border border-brand-emerald/30">
                <div className="text-6xl font-bold text-brand-emerald/20 mb-4">02</div>
                <h3 className="text-2xl font-bold mb-4 text-brand-emerald">Sustain</h3>
                <p className="text-brand-muted leading-relaxed mb-6">
                  Execute daily. Complete your routines. Finish your tasks. Follow your rules. Mark each day as a win or a loss—honestly.
                </p>
                <ul className="space-y-2 text-sm text-brand-muted">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
                    Daily task completion
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
                    Routine tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
                    Win/loss accountability
                  </li>
                </ul>
              </div>
            </div>

            {/* Elevate */}
            <div className="relative">
              <div className="p-8 rounded-3xl bg-gradient-to-b from-purple-500/10 to-transparent border border-purple-500/30">
                <div className="text-6xl font-bold text-purple-500/20 mb-4">03</div>
                <h3 className="text-2xl font-bold mb-4 text-purple-500">Elevate</h3>
                <p className="text-brand-muted leading-relaxed mb-6">
                  Watch the compound effect. Your consistency becomes visible. Your streaks grow. You become someone who shows up.
                </p>
                <ul className="space-y-2 text-sm text-brand-muted">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Visual consistency tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Streak milestones
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Personal records
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-emerald/50 to-transparent" />

      {/* The Five Pillars Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-brand-accent uppercase tracking-widest">The Architecture</span>
            <h2 className="text-display-md mt-4">
              Five pillars, one system<span className="text-brand-accent">.</span>
            </h2>
            <p className="text-xl text-brand-muted max-w-2xl mx-auto mt-6">
              Each pillar serves a purpose. Together, they cover every dimension of personal excellence.
            </p>
          </div>

          <div className="space-y-6">
            {/* You */}
            <div className="group p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-brand-emerald/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-emerald/20 to-brand-emerald/5 flex items-center justify-center flex-shrink-0 border border-brand-emerald/20">
                <span className="text-2xl font-bold text-brand-emerald">Y</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-brand-emerald">You</h3>
                <p className="text-brand-muted leading-relaxed mb-4">
                  The command center. This is where you win or lose the day. Track your consistency with a visual calendar that doesn&apos;t lie. See your streaks. Complete morning and evening routines. Link daily tasks to your bigger goals.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-brand-emerald/10 text-brand-emerald text-sm border border-brand-emerald/20">Win the Day</span>
                  <span className="px-3 py-1 rounded-full bg-brand-emerald/10 text-brand-emerald text-sm border border-brand-emerald/20">Streaks</span>
                  <span className="px-3 py-1 rounded-full bg-brand-emerald/10 text-brand-emerald text-sm border border-brand-emerald/20">Routines</span>
                  <span className="px-3 py-1 rounded-full bg-brand-emerald/10 text-brand-emerald text-sm border border-brand-emerald/20">Daily Tasks</span>
                </div>
              </div>
            </div>

            {/* Discipline */}
            <div className="group p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-brand-accent/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-accent/20 to-brand-accent/5 flex items-center justify-center flex-shrink-0 border border-brand-accent/20">
                <span className="text-2xl font-bold text-brand-accent">D</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-brand-accent">Discipline</h3>
                <p className="text-brand-muted leading-relaxed mb-4">
                  Structured transformation. Join challenges with clear rules and daily accountability. Set personal rules you commit to honoring. The discipline tab is where intentions become non-negotiables.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-sm border border-brand-accent/20">Challenges</span>
                  <span className="px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-sm border border-brand-accent/20">Daily Rules</span>
                  <span className="px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-sm border border-brand-accent/20">Progress Calendar</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="group p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-orange-500/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center flex-shrink-0 border border-orange-500/20">
                <span className="text-2xl font-bold text-orange-500">B</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-orange-500">Body</h3>
                <p className="text-brand-muted leading-relaxed mb-4">
                  Train with intention. Follow structured training tracks or log your own workouts. Track personal records. Use the workout timer. Your body is the vehicle—treat it like one.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-sm border border-orange-500/20">Training Tracks</span>
                  <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-sm border border-orange-500/20">PR Tracking</span>
                  <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-sm border border-orange-500/20">Workout Timer</span>
                </div>
              </div>
            </div>

            {/* Goals */}
            <div className="group p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-purple-500/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center flex-shrink-0 border border-purple-500/20">
                <span className="text-2xl font-bold text-purple-500">G</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-purple-500">Goals</h3>
                <p className="text-brand-muted leading-relaxed mb-4">
                  Define your fuel. Break big goals into concrete steps. Link daily tasks directly to your goals so every action has purpose. Watch progress accumulate toward what actually matters.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-sm border border-purple-500/20">Goal Setting</span>
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-sm border border-purple-500/20">Step Breakdown</span>
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-sm border border-purple-500/20">Task Linking</span>
                </div>
              </div>
            </div>

            {/* Mind */}
            <div className="group p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-cyan-500/50 transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center flex-shrink-0 border border-cyan-500/20">
                <span className="text-2xl font-bold text-cyan-500">M</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-cyan-500">Mind</h3>
                <p className="text-brand-muted leading-relaxed mb-4">
                  Feed the mind that feeds your ambition. Track your reading with a built-in timer. Log books. Accumulate knowledge intentionally. The mind is a muscle—train it.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-sm border border-cyan-500/20">Reading Timer</span>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-sm border border-cyan-500/20">Book Tracking</span>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-sm border border-cyan-500/20">Reading Stats</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      {/* The Daily Loop */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-brand-accent uppercase tracking-widest">The Daily Loop</span>
            <h2 className="text-display-md mt-4">
              Excellence is a daily practice<span className="text-brand-accent">.</span>
            </h2>
            <p className="text-xl text-brand-muted max-w-2xl mx-auto mt-6">
              Every day follows the same rhythm. Over time, the rhythm becomes who you are.
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-brand-accent via-brand-emerald to-purple-500 -translate-y-1/2" />

            <div className="grid md:grid-cols-4 gap-6 relative">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-brand-surface border-2 border-brand-accent flex items-center justify-center mx-auto mb-4 relative z-10">
                  <span className="text-2xl">☀️</span>
                </div>
                <h3 className="font-semibold mb-2">Morning Routine</h3>
                <p className="text-sm text-brand-muted">Start with intention. Complete the habits that set your day.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-brand-surface border-2 border-brand-emerald flex items-center justify-center mx-auto mb-4 relative z-10">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold mb-2">Execute Tasks</h3>
                <p className="text-sm text-brand-muted">Work through your daily tasks. Each one moves you forward.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-brand-surface border-2 border-purple-500 flex items-center justify-center mx-auto mb-4 relative z-10">
                  <span className="text-2xl">🌙</span>
                </div>
                <h3 className="font-semibold mb-2">Evening Routine</h3>
                <p className="text-sm text-brand-muted">Close the day with structure. Prepare for tomorrow.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-brand-surface border-2 border-brand-gold flex items-center justify-center mx-auto mb-4 relative z-10">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="font-semibold mb-2">Win or Learn</h3>
                <p className="text-sm text-brand-muted">Mark the day honestly. Wins compound. Losses teach.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-display-md mb-6">
            <span className="bg-gradient-to-r from-white to-brand-muted bg-clip-text text-transparent">
              Ready to begin?
            </span>
          </h2>
          <p className="text-xl text-brand-muted mb-10 max-w-2xl mx-auto">
            The system is ready. The methodology is proven. The only variable is you.
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

          <p className="mt-6 text-sm text-brand-muted">
            Available on iOS
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
