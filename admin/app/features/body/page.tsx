import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Body - Features - You. First',
  description: 'Train with intention. Follow structured training tracks, track personal records, and watch yourself evolve.',
};

export default function BodyFeaturePage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text overflow-x-hidden">
      {/* Ambient background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-orange-500/20 via-orange-500/5 to-transparent blur-3xl" />
        <div className="absolute top-2/3 -right-40 w-[500px] h-[500px] bg-gradient-radial from-orange-500/10 via-orange-500/5 to-transparent blur-3xl" />
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
          <span className="text-orange-500">Body</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center mb-6 border border-orange-500/20">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-display-lg mb-4">
                <span className="text-orange-500">Body</span>
                <span className="text-brand-accent">.</span>
              </h1>
              <p className="text-2xl text-brand-muted mb-6">
                Your body is the vehicle. Train it like one.
              </p>
              <p className="text-lg text-brand-muted leading-relaxed">
                The Body tab is where athletes live. Structured training tracks, PR tracking, workout logging—everything you need to get stronger, faster, and more capable.
              </p>
            </div>

            {/* Phone mockup */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-radial from-orange-500/30 via-orange-500/10 to-transparent blur-3xl scale-150" />
                <div className="relative w-[260px] h-[540px] rounded-[2.5rem] border-[6px] border-brand-border bg-brand-surface p-2 shadow-2xl shadow-black/50">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-brand-bg rounded-full z-10" />
                  <div className="w-full h-full rounded-[2rem] overflow-hidden bg-brand-bg">
                    <Image
                      src="/images/App screenshots/body-page.PNG"
                      alt="You. First - Body Training"
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
      <div className="h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

      {/* Training Tracks Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold text-orange-500 uppercase tracking-widest">Structured Training</span>
              <h2 className="text-display-sm mt-4 mb-6">
                Training Tracks<span className="text-orange-500">.</span>
              </h2>
              <div className="space-y-4 text-brand-muted leading-relaxed">
                <p>
                  Follow professionally designed training programs tailored to your goals. Each track tells you exactly what to do, when to do it, and how much.
                </p>
                <p>
                  <span className="text-brand-text font-medium">No guesswork.</span> Whether you&apos;re training for strength, functional fitness, or athletic performance, there&apos;s a track for you.
                </p>
                <p>
                  Each week is programmed with intention. Rest days, intensity cycles, progressive overload—it&apos;s all built in.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {/* Training track cards */}
              <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border hover:border-orange-500/50 transition-colors">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <span className="text-2xl">🏋️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Strength Builder</h3>
                    <p className="text-sm text-brand-muted">12 Week Program</p>
                  </div>
                </div>
                <p className="text-sm text-brand-muted">Focus on compound lifts and progressive overload for maximum strength gains.</p>
              </div>
              <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border hover:border-orange-500/50 transition-colors">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Functional Athlete</h3>
                    <p className="text-sm text-brand-muted">Ongoing Program</p>
                  </div>
                </div>
                <p className="text-sm text-brand-muted">CrossFit-style programming for well-rounded fitness and work capacity.</p>
              </div>
              <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border hover:border-orange-500/50 transition-colors">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Sport Performance</h3>
                    <p className="text-sm text-brand-muted">8 Week Cycles</p>
                  </div>
                </div>
                <p className="text-sm text-brand-muted">Athletic development focusing on speed, power, and sport-specific gains.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />

      {/* PR Tracking Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border">
                <h3 className="text-lg font-semibold mb-6 text-orange-500">Personal Records</h3>
                <div className="space-y-4">
                  {[
                    { lift: 'Back Squat', pr: '315 lbs', date: 'Jan 15' },
                    { lift: 'Deadlift', pr: '405 lbs', date: 'Jan 8' },
                    { lift: 'Bench Press', pr: '225 lbs', date: 'Dec 28' },
                    { lift: 'Clean & Jerk', pr: '185 lbs', date: 'Jan 12' },
                    { lift: 'Snatch', pr: '145 lbs', date: 'Jan 5' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-brand-card border border-brand-border">
                      <span className="text-brand-text font-medium">{item.lift}</span>
                      <div className="text-right">
                        <span className="text-orange-500 font-bold">{item.pr}</span>
                        <span className="text-brand-muted text-sm ml-2">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-sm font-semibold text-orange-500 uppercase tracking-widest">Progress Tracking</span>
              <h2 className="text-display-sm mt-4 mb-6">
                PR Dashboard<span className="text-orange-500">.</span>
              </h2>
              <div className="space-y-4 text-brand-muted leading-relaxed">
                <p>
                  Track every personal record across all major lifts. Know exactly where you stand and where you&apos;re going.
                </p>
                <p>
                  <span className="text-brand-text font-medium">Watch your numbers climb.</span> There&apos;s nothing like seeing objective proof that you&apos;re getting stronger.
                </p>
                <p>
                  PRs are automatically tracked when you log workouts. Hit a new max? The app celebrates with you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />

      {/* Workout Logging Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-orange-500 uppercase tracking-widest">Session Tracking</span>
            <h2 className="text-display-sm mt-4 mb-6">
              Log every session<span className="text-orange-500">.</span>
            </h2>
            <p className="text-xl text-brand-muted max-w-2xl mx-auto">
              Whether you follow a track or go freestyle, log your workouts to see your progress over time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 border border-orange-500/20">
                <span className="text-orange-500 text-xl">📝</span>
              </div>
              <h3 className="font-semibold mb-2">Exercise Library</h3>
              <p className="text-sm text-brand-muted">
                Hundreds of exercises with proper form cues and tracking options.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 border border-orange-500/20">
                <span className="text-orange-500 text-xl">⏱️</span>
              </div>
              <h3 className="font-semibold mb-2">Workout Timer</h3>
              <p className="text-sm text-brand-muted">
                Built-in timer for rest periods, AMRAPs, EMOMs, and timed workouts.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 border border-orange-500/20">
                <span className="text-orange-500 text-xl">📊</span>
              </div>
              <h3 className="font-semibold mb-2">Session History</h3>
              <p className="text-sm text-brand-muted">
                Review past workouts, compare sessions, and track volume over time.
              </p>
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
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />

            <div className="relative text-center">
              <h2 className="text-display-sm mb-6">
                The athlete&apos;s mindset<span className="text-orange-500">.</span>
              </h2>
              <div className="space-y-6 text-brand-muted text-lg">
                <p>
                  Your body responds to what you demand of it. <span className="text-brand-text font-medium">Demand more.</span>
                </p>
                <p>
                  Training isn&apos;t about looking good (though that happens). It&apos;s about building a body that can do what you ask of it. Strength. Endurance. Resilience.
                </p>
                <p>
                  The gym is a laboratory for character. What you learn under the bar transfers to everything else.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

      {/* Next Feature CTA */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-brand-muted mb-4">Next Feature</p>
          <Link
            href="/features/goals"
            className="group inline-flex items-center gap-4 text-display-sm hover:text-purple-500 transition-colors"
          >
            Goals
            <span className="text-brand-muted group-hover:text-purple-500 group-hover:translate-x-2 transition-all">→</span>
          </Link>
          <p className="text-brand-muted mt-4">Define your fuel. Break it down into steps.</p>
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
