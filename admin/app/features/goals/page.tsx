import Link from 'next/link';

export const metadata = {
  title: 'Goals - Features - You. First',
  description: 'Define your fuel. Break big goals into steps. Link daily tasks to bigger outcomes.',
};

export default function GoalsFeaturePage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text overflow-x-hidden">
      {/* Ambient background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-purple-500/20 via-purple-500/5 to-transparent blur-3xl" />
        <div className="absolute top-2/3 -right-40 w-[500px] h-[500px] bg-gradient-radial from-purple-500/10 via-purple-500/5 to-transparent blur-3xl" />
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
          <span className="text-purple-500">Goals</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mb-6 border border-purple-500/20">
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-display-lg mb-4">
              <span className="text-purple-500">Goals</span>
              <span className="text-brand-accent">.</span>
            </h1>
            <p className="text-2xl text-brand-muted mb-6">
              Define your fuel. Break it into steps.
            </p>
            <p className="text-lg text-brand-muted leading-relaxed">
              Goals without systems are just wishes. The Goals tab helps you set meaningful objectives, break them into actionable steps, and connect daily tasks to bigger outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      {/* Goal Setting Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold text-purple-500 uppercase tracking-widest">Core Feature</span>
              <h2 className="text-display-sm mt-4 mb-6">
                Set goals that matter<span className="text-purple-500">.</span>
              </h2>
              <div className="space-y-4 text-brand-muted leading-relaxed">
                <p>
                  Not every goal is created equal. Some goals are <span className="text-brand-text font-medium">fuel</span>—they pull you forward with genuine desire. Others are obligations that drain you.
                </p>
                <p>
                  The Goals tab asks you to be intentional. What do you actually want? What would make this year meaningful? What would you regret not pursuing?
                </p>
                <p>
                  Write goals that excite you. Goals that scare you a little. Goals that matter.
                </p>
              </div>
            </div>
            <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border">
              <h3 className="text-lg font-semibold mb-6 text-purple-500">Active Goals</h3>
              <div className="space-y-4">
                {[
                  { goal: 'Run a sub-3:30 marathon', progress: 65, steps: '12/18 steps' },
                  { goal: 'Read 52 books this year', progress: 40, steps: '21/52 books' },
                  { goal: 'Launch the side project', progress: 80, steps: '8/10 milestones' },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-brand-card border border-brand-border">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-brand-text font-medium">{item.goal}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-brand-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-brand-muted">{item.steps}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />

      {/* Step Breakdown Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <span className="text-purple-500">🏃</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Run a sub-3:30 marathon</h3>
                    <p className="text-sm text-brand-muted">Target: October 2024</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-brand-muted font-medium mb-2">Steps to achieve:</p>
                  {[
                    { step: 'Build base mileage to 40mpw', done: true },
                    { step: 'Complete 16-week training plan', done: true },
                    { step: 'Run sub-1:40 half marathon', done: true },
                    { step: 'Peak week: 55 miles', done: false },
                    { step: 'Taper and race prep', done: false },
                    { step: 'Race day execution', done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md ${item.done ? 'bg-purple-500' : 'border border-brand-border'} flex items-center justify-center`}>
                        {item.done && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className={item.done ? 'text-brand-muted line-through' : 'text-brand-text'}>{item.step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-sm font-semibold text-purple-500 uppercase tracking-widest">Breaking It Down</span>
              <h2 className="text-display-sm mt-4 mb-6">
                Goals become steps<span className="text-purple-500">.</span>
              </h2>
              <div className="space-y-4 text-brand-muted leading-relaxed">
                <p>
                  A big goal is overwhelming. A single step is doable. The magic is in the breakdown.
                </p>
                <p>
                  <span className="text-brand-text font-medium">Break every goal into concrete steps.</span> What needs to happen first? Then what? Make the path visible.
                </p>
                <p>
                  As you complete steps, watch your progress accumulate. What seemed impossible becomes inevitable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />

      {/* Task Linking Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-500 uppercase tracking-widest">Daily Connection</span>
            <h2 className="text-display-sm mt-4 mb-6">
              Every task has a purpose<span className="text-purple-500">.</span>
            </h2>
            <p className="text-xl text-brand-muted max-w-2xl mx-auto">
              Link your daily tasks to your goals. When you check off a task, you&apos;re not just completing busywork—you&apos;re making progress on what matters.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border">
              <h3 className="text-lg font-semibold mb-6">Today&apos;s Goal-Linked Tasks</h3>
              <div className="space-y-4">
                {[
                  { task: '6-mile tempo run', goal: 'Sub-3:30 marathon', color: 'purple-500' },
                  { task: 'Read 30 pages', goal: '52 books this year', color: 'cyan-500' },
                  { task: 'Write landing page copy', goal: 'Launch side project', color: 'brand-emerald' },
                  { task: 'Review API documentation', goal: 'Launch side project', color: 'brand-emerald' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-brand-card border border-brand-border">
                    <div className="w-5 h-5 rounded-md border border-brand-border" />
                    <div className="flex-1">
                      <span className="text-brand-text">{item.task}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full bg-${item.color}`} />
                        <span className="text-xs text-brand-muted">{item.goal}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />

      {/* Why Goals Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
                <span className="text-purple-500 text-xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2">Clarity</h3>
              <p className="text-sm text-brand-muted">
                Know exactly what you&apos;re working toward. No ambiguity. No drift.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
                <span className="text-purple-500 text-xl">📈</span>
              </div>
              <h3 className="font-semibold mb-2">Progress</h3>
              <p className="text-sm text-brand-muted">
                Watch completion percentages climb. Visual proof you&apos;re moving forward.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
                <span className="text-purple-500 text-xl">🔗</span>
              </div>
              <h3 className="font-semibold mb-2">Connection</h3>
              <p className="text-sm text-brand-muted">
                Daily tasks link to goals. Every action has meaning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      {/* Philosophy Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-brand-surface via-brand-card to-brand-surface border border-brand-border overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />

            <div className="relative text-center">
              <h2 className="text-display-sm mb-6">
                Goals are fuel<span className="text-purple-500">.</span>
              </h2>
              <div className="space-y-6 text-brand-muted text-lg">
                <p>
                  The right goal doesn&apos;t feel like obligation. It feels like <span className="text-brand-text font-medium">magnetism</span>.
                </p>
                <p>
                  You don&apos;t have to force yourself toward it. You&apos;re pulled. The vision is so compelling that the work becomes worth it.
                </p>
                <p>
                  Find those goals. The ones that wake you up early. The ones you&apos;d pursue even if no one was watching. Those are your fuel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      {/* Next Feature CTA */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-brand-muted mb-4">Next Feature</p>
          <Link
            href="/features/mind"
            className="group inline-flex items-center gap-4 text-display-sm hover:text-cyan-500 transition-colors"
          >
            Mind
            <span className="text-brand-muted group-hover:text-cyan-500 group-hover:translate-x-2 transition-all">→</span>
          </Link>
          <p className="text-brand-muted mt-4">Feed the mind that feeds your ambition.</p>
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
