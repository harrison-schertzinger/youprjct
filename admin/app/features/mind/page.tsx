import Link from 'next/link';

export const metadata = {
  title: 'Mind - Features - You. First',
  description: 'Feed the mind that feeds your ambition. Track your reading, log books, and accumulate knowledge intentionally.',
};

export default function MindFeaturePage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text overflow-x-hidden">
      {/* Ambient background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-cyan-500/20 via-cyan-500/5 to-transparent blur-3xl" />
        <div className="absolute top-2/3 -right-40 w-[500px] h-[500px] bg-gradient-radial from-cyan-500/10 via-cyan-500/5 to-transparent blur-3xl" />
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
          <span className="text-cyan-500">Mind</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center mb-6 border border-cyan-500/20">
              <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-display-lg mb-4">
              <span className="text-cyan-500">Mind</span>
              <span className="text-brand-accent">.</span>
            </h1>
            <p className="text-2xl text-brand-muted mb-6">
              Feed the mind that feeds your ambition.
            </p>
            <p className="text-lg text-brand-muted leading-relaxed">
              The mind is a muscle. Left untrained, it atrophies. The Mind tab helps you build a consistent reading practice, track your books, and accumulate the knowledge that fuels your growth.
            </p>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      {/* Reading Timer Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold text-cyan-500 uppercase tracking-widest">Core Feature</span>
              <h2 className="text-display-sm mt-4 mb-6">
                Reading Timer<span className="text-cyan-500">.</span>
              </h2>
              <div className="space-y-4 text-brand-muted leading-relaxed">
                <p>
                  Reading isn&apos;t passive. It&apos;s training for the mind. The built-in reading timer helps you <span className="text-brand-text font-medium">track your reading sessions</span> and build a consistent practice.
                </p>
                <p>
                  Start the timer when you open your book. Stop when you close it. Watch your reading time accumulate day over day, week over week.
                </p>
                <p>
                  No complicated logging. No friction. Just time spent with ideas that expand your thinking.
                </p>
              </div>
            </div>
            <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full border-4 border-cyan-500 flex items-center justify-center mx-auto mb-6">
                  <div>
                    <div className="text-4xl font-bold text-cyan-500">24:35</div>
                    <div className="text-sm text-brand-muted">reading</div>
                  </div>
                </div>
                <div className="flex justify-center gap-4 mb-6">
                  <button className="px-6 py-2 rounded-xl bg-cyan-500 text-white font-semibold">
                    Pause
                  </button>
                  <button className="px-6 py-2 rounded-xl bg-brand-border text-brand-muted font-semibold">
                    Stop
                  </button>
                </div>
                <p className="text-brand-muted text-sm">Currently reading:</p>
                <p className="text-brand-text font-medium">Atomic Habits</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />

      {/* Book Tracking Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border">
                <h3 className="text-lg font-semibold mb-6 text-cyan-500">Book Library</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Atomic Habits', author: 'James Clear', status: 'reading', progress: 65 },
                    { title: 'Deep Work', author: 'Cal Newport', status: 'completed', progress: 100 },
                    { title: 'The Obstacle Is the Way', author: 'Ryan Holiday', status: 'completed', progress: 100 },
                    { title: 'Chop Wood Carry Water', author: 'Joshua Medcalf', status: 'completed', progress: 100 },
                  ].map((book, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-brand-card border border-brand-border">
                      <div className="w-10 h-14 rounded bg-gradient-to-br from-cyan-500/30 to-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                        <span className="text-lg">📖</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-brand-text">{book.title}</div>
                        <div className="text-sm text-brand-muted">{book.author}</div>
                        {book.status === 'reading' && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 h-1.5 bg-brand-border rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${book.progress}%` }} />
                            </div>
                            <span className="text-xs text-brand-muted">{book.progress}%</span>
                          </div>
                        )}
                      </div>
                      {book.status === 'completed' && (
                        <span className="text-cyan-500">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-sm font-semibold text-cyan-500 uppercase tracking-widest">Your Library</span>
              <h2 className="text-display-sm mt-4 mb-6">
                Track every book<span className="text-cyan-500">.</span>
              </h2>
              <div className="space-y-4 text-brand-muted leading-relaxed">
                <p>
                  Build a library of every book you&apos;ve read. See your progress on current reads. Remember what shaped your thinking.
                </p>
                <p>
                  <span className="text-brand-text font-medium">Add books you&apos;re reading.</span> Track your progress through them. Mark them complete when you finish.
                </p>
                <p>
                  Over time, your library becomes a map of your intellectual journey. A record of ideas that changed you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />

      {/* Reading Stats Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-cyan-500 uppercase tracking-widest">Track Progress</span>
            <h2 className="text-display-sm mt-4 mb-6">
              Reading stats<span className="text-cyan-500">.</span>
            </h2>
            <p className="text-xl text-brand-muted max-w-2xl mx-auto">
              See your reading habit take shape. Time invested. Books completed. Knowledge accumulated.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border text-center">
              <div className="text-4xl font-bold text-cyan-500 mb-2">47</div>
              <p className="text-sm text-brand-muted">Books Read</p>
            </div>
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border text-center">
              <div className="text-4xl font-bold text-cyan-500 mb-2">156h</div>
              <p className="text-sm text-brand-muted">Total Reading Time</p>
            </div>
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border text-center">
              <div className="text-4xl font-bold text-cyan-500 mb-2">28</div>
              <p className="text-sm text-brand-muted">Day Streak</p>
            </div>
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border text-center">
              <div className="text-4xl font-bold text-cyan-500 mb-2">42m</div>
              <p className="text-sm text-brand-muted">Daily Average</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />

      {/* Why Reading Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 border border-cyan-500/20">
                <span className="text-cyan-500 text-xl">🧠</span>
              </div>
              <h3 className="font-semibold mb-2">Mental Models</h3>
              <p className="text-sm text-brand-muted">
                Every book is a new lens to see the world. Collect mental models that compound.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 border border-cyan-500/20">
                <span className="text-cyan-500 text-xl">💡</span>
              </div>
              <h3 className="font-semibold mb-2">Ideas That Stick</h3>
              <p className="text-sm text-brand-muted">
                Reading builds vocabulary for thoughts you couldn&apos;t express before.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 border border-cyan-500/20">
                <span className="text-cyan-500 text-xl">⏰</span>
              </div>
              <h3 className="font-semibold mb-2">Consistent Practice</h3>
              <p className="text-sm text-brand-muted">
                30 minutes daily adds up to 180+ hours a year. That&apos;s transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      {/* Philosophy Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-brand-surface via-brand-card to-brand-surface border border-brand-border overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />

            <div className="relative text-center">
              <h2 className="text-display-sm mb-6">
                The mind is a garden<span className="text-cyan-500">.</span>
              </h2>
              <div className="space-y-6 text-brand-muted text-lg">
                <p>
                  What you consume becomes what you think. What you think becomes what you do. <span className="text-brand-text font-medium">What you do becomes who you are.</span>
                </p>
                <p>
                  Reading is how you plant seeds. Good books are seeds that grow into better thinking, better decisions, better outcomes.
                </p>
                <p>
                  Tend your garden. Pull the weeds. Water what you want to grow. The harvest is your life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      {/* Back to Features CTA */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-brand-muted mb-4">Explore All Features</p>
          <Link
            href="/features"
            className="group inline-flex items-center gap-4 text-display-sm hover:text-brand-accent transition-colors"
          >
            <span className="text-brand-muted group-hover:text-brand-accent group-hover:-translate-x-2 transition-all">←</span>
            All Features
          </Link>
          <p className="text-brand-muted mt-8 max-w-xl mx-auto">
            You. Discipline. Body. Goals. Mind. Five pillars working together to help you become who you&apos;re meant to be.
          </p>

          <div className="mt-12">
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
