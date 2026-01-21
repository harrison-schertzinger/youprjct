import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'You - Features - You. First',
  description: 'The command center of your daily life. Track wins, build streaks, complete routines, and see your consistency visualized.',
};

export default function YouFeaturePage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text overflow-x-hidden">
      {/* Ambient background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-brand-emerald/20 via-brand-emerald/5 to-transparent blur-3xl" />
        <div className="absolute top-2/3 -right-40 w-[500px] h-[500px] bg-gradient-radial from-brand-emerald/10 via-brand-emerald/5 to-transparent blur-3xl" />
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
          <a href="/#download" className="md:hidden text-sm font-medium text-brand-accent hover:text-brand-accent/80 transition-colors">
            Download
          </a>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-8">
        <div className="flex items-center gap-2 text-sm text-brand-muted">
          <Link href="/features" className="hover:text-brand-text transition-colors">Features</Link>
          <span>/</span>
          <span className="text-brand-emerald">You</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-emerald/20 to-brand-emerald/5 flex items-center justify-center mb-6 border border-brand-emerald/20">
                <svg className="w-8 h-8 text-brand-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-display-lg mb-4">
                <span className="text-brand-emerald">You</span>
                <span className="text-brand-accent">.</span>
              </h1>
              <p className="text-2xl text-brand-muted mb-6">
                The command center of your daily life.
              </p>
              <p className="text-lg text-brand-muted leading-relaxed">
                This is where you win or lose the day. Not in theory—in practice. Every morning you wake up with a choice. The You tab makes that choice visible, trackable, and honest.
              </p>
            </div>

            {/* Phone mockup */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-radial from-brand-emerald/30 via-brand-emerald/10 to-transparent blur-3xl scale-150" />
                <div className="relative w-[260px] h-[540px] rounded-[2.5rem] border-[6px] border-brand-border bg-brand-surface p-2 shadow-2xl shadow-black/50">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-brand-bg rounded-full z-10" />
                  <div className="w-full h-full rounded-[2rem] overflow-hidden bg-brand-bg">
                    <Image
                      src="/images/App screenshots/you-page.PNG"
                      alt="You. First - You Dashboard"
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
      <div className="h-px bg-gradient-to-r from-transparent via-brand-emerald/50 to-transparent" />

      {/* Win the Day Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold text-brand-emerald uppercase tracking-widest">Core Feature</span>
              <h2 className="text-display-sm mt-4 mb-6">
                Win the Day<span className="text-brand-emerald">.</span>
              </h2>
              <div className="space-y-4 text-brand-muted leading-relaxed">
                <p>
                  At the end of every day, you face a simple question: <span className="text-brand-text font-medium">Did you win today?</span>
                </p>
                <p>
                  Not &ldquo;did you feel productive&rdquo; or &ldquo;did you check boxes.&rdquo; Did you show up as the person you&apos;re trying to become? Did you honor your commitments to yourself?
                </p>
                <p>
                  Mark it honestly. A win isn&apos;t about perfection—it&apos;s about intention met with action. Over time, your wins paint a picture of who you really are.
                </p>
              </div>
            </div>
            <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border">
              <div className="text-center">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold mb-2">Today&apos;s Question</h3>
                <p className="text-2xl text-brand-text font-medium mb-6">&ldquo;Did you win today?&rdquo;</p>
                <div className="flex justify-center gap-4">
                  <div className="px-8 py-3 rounded-xl bg-brand-emerald/20 border border-brand-emerald/30 text-brand-emerald font-semibold">
                    Win
                  </div>
                  <div className="px-8 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-semibold">
                    Loss
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />

      {/* Streaks Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 p-8 rounded-3xl bg-brand-surface border border-brand-border">
              <div className="text-center">
                <div className="text-7xl font-bold text-brand-emerald mb-2">47</div>
                <p className="text-brand-muted mb-6">Day Streak</p>
                <div className="flex justify-center gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-lg ${i < 5 ? 'bg-brand-emerald' : 'bg-brand-border'}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-brand-muted mt-4">This week: 5/7 wins</p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-sm font-semibold text-brand-emerald uppercase tracking-widest">Momentum</span>
              <h2 className="text-display-sm mt-4 mb-6">
                Streaks that mean something<span className="text-brand-emerald">.</span>
              </h2>
              <div className="space-y-4 text-brand-muted leading-relaxed">
                <p>
                  Your streak isn&apos;t a game. It&apos;s a <span className="text-brand-text font-medium">visual record of your discipline</span>. Every day you win adds to the chain. Every loss resets it.
                </p>
                <p>
                  This isn&apos;t about punishment—it&apos;s about truth. When you see a 30-day streak, you know what that took. When you see it break, you know why.
                </p>
                <p>
                  The streak becomes a source of pride. Breaking it becomes unthinkable. That&apos;s when real change happens.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />

      {/* Routines Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold text-brand-emerald uppercase tracking-widest">Daily Structure</span>
              <h2 className="text-display-sm mt-4 mb-6">
                Morning & Evening Routines<span className="text-brand-emerald">.</span>
              </h2>
              <div className="space-y-4 text-brand-muted leading-relaxed">
                <p>
                  How you start and end the day defines it. Build custom morning and evening routines that become your non-negotiables.
                </p>
                <p>
                  <span className="text-brand-text font-medium">Morning routines</span> set your intention. Meditate. Journal. Move. Read. Whatever prepares you to win.
                </p>
                <p>
                  <span className="text-brand-text font-medium">Evening routines</span> close the loop. Review. Reflect. Prepare. Sleep with a clear conscience.
                </p>
                <p>
                  Check them off as you complete them. Over time, they stop being tasks and start being who you are.
                </p>
              </div>
            </div>
            <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border">
              <h3 className="text-lg font-semibold mb-4 text-brand-emerald">Morning Routine</h3>
              <div className="space-y-3 mb-8">
                {['Wake at 5:30am', 'Meditate 10 min', 'Journal', 'Cold shower', 'Read 20 pages'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md ${i < 3 ? 'bg-brand-emerald' : 'border border-brand-border'} flex items-center justify-center`}>
                      {i < 3 && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className={i < 3 ? 'text-brand-muted line-through' : 'text-brand-text'}>{item}</span>
                  </div>
                ))}
              </div>
              <h3 className="text-lg font-semibold mb-4 text-purple-500">Evening Routine</h3>
              <div className="space-y-3">
                {['Review wins', 'Plan tomorrow', 'No screens after 9pm', 'Read before bed'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md border border-brand-border flex items-center justify-center" />
                    <span className="text-brand-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />

      {/* Daily Tasks Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-brand-emerald uppercase tracking-widest">Execution</span>
            <h2 className="text-display-sm mt-4 mb-6">
              Daily tasks linked to goals<span className="text-brand-emerald">.</span>
            </h2>
            <p className="text-xl text-brand-muted max-w-2xl mx-auto">
              Every task connects to something bigger. When you complete a task, you&apos;re not just checking a box—you&apos;re making progress on what matters.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
                <span className="text-purple-500">🎯</span>
              </div>
              <h3 className="font-semibold mb-2">Goal-Linked</h3>
              <p className="text-sm text-brand-muted">
                Tasks connect to your goals so every action has purpose.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border">
              <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 flex items-center justify-center mb-4 border border-brand-emerald/20">
                <span className="text-brand-emerald">📅</span>
              </div>
              <h3 className="font-semibold mb-2">Daily Focus</h3>
              <p className="text-sm text-brand-muted">
                See exactly what needs to happen today. No overwhelm.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-4 border border-brand-accent/20">
                <span className="text-brand-accent">✓</span>
              </div>
              <h3 className="font-semibold mb-2">Completion Tracking</h3>
              <p className="text-sm text-brand-muted">
                Watch your task completion rate improve over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-emerald/50 to-transparent" />

      {/* Next Feature CTA */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-brand-muted mb-4">Next Feature</p>
          <Link
            href="/features/discipline"
            className="group inline-flex items-center gap-4 text-display-sm hover:text-brand-accent transition-colors"
          >
            Discipline
            <span className="text-brand-muted group-hover:text-brand-accent group-hover:translate-x-2 transition-all">→</span>
          </Link>
          <p className="text-brand-muted mt-4">Rules and challenges that transform you.</p>
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
