import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
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
              href="/about"
              className="text-sm text-brand-text font-medium"
            >
              About
            </Link>
            <Link
              href="/support"
              className="text-sm text-brand-muted hover:text-brand-text transition-colors"
            >
              Support
            </Link>
            <Link
              href="/#download"
              className="text-sm font-medium text-brand-accent hover:text-brand-accent/80 transition-colors"
            >
              Download
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-sm font-semibold text-brand-accent uppercase tracking-widest">Our Story</span>
          <h1 className="text-display-lg md:text-display-xl font-bold tracking-tight mt-4 mb-6">
            <span className="bg-gradient-to-r from-white via-white to-brand-accent bg-clip-text text-transparent">
              8 Billion People
            </span>
            <span className="text-brand-accent">.</span>
            <br />
            <span className="text-brand-muted">One of You.</span>
          </h1>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto">
            Work in Progress. Masterpiece.
          </p>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent" />

      {/* The Origin Story */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-brand-emerald uppercase tracking-widest">The Origin</span>
            <h2 className="text-display-md mt-4">
              It started the way most adventures do<span className="text-brand-accent">:</span> a crisis.
            </h2>
          </div>

          <div className="prose prose-lg prose-invert mx-auto">
            <div className="space-y-6 text-brand-muted text-lg leading-relaxed">
              <p>
                When I was 16, my brother tore his ACL. As serious athletes—both committed to play lacrosse at The University of North Carolina—this was the injury you don&apos;t talk about. Season-ending. Sometimes career-altering. My brother was down bad, and I needed something to say to him.
              </p>
              <p>
                So I picked up a book: <span className="text-brand-text font-medium italic">Chop Wood Carry Water</span>.
              </p>
              <p>
                That book changed the course of my life. From then on, I read like my life depended on it—and now I believe it does. Because that was the first time I interacted with ideas that were <span className="text-brand-text">alive</span>. Ideas that were an invitation to live in a new way.
              </p>
              <p className="text-brand-text text-xl border-l-2 border-brand-accent pl-6 my-8">
                Every book said different things, every author had his own take, but each one seemed to scream the same message: understand what determines the quality of someone&apos;s life, and have the courage to pursue your path.
              </p>
              <p>
                Have the courage to break away from the crowd, and the discipline to do what it takes. Live a great and noble adventure. Reject what the world offers. Endure the hard times and soak every drop of bliss that comes with the good. Empty yourself out in the service of others and find something you&apos;re willing to perish pursuing.
              </p>
              <p>
                It was freedom. Or, a pathway to freedom. A stairway that seemed to climb to the heavens, available to anyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Journey */}
      <section className="relative z-10 py-24 px-6 border-t border-brand-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-500 uppercase tracking-widest">The Journey</span>
            <h2 className="text-display-md mt-4">
              You<span className="text-brand-accent">.</span>Prjct
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border">
              <div className="text-brand-accent font-mono text-sm mb-2">01</div>
              <h3 className="font-semibold mb-2">Heart x Hustle</h3>
              <p className="text-sm text-brand-muted">Fitness apparel. &ldquo;Champion State of Mind.&rdquo; Inspiration through training.</p>
            </div>
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border">
              <div className="text-brand-emerald font-mono text-sm mb-2">02</div>
              <h3 className="font-semibold mb-2">SunBite</h3>
              <p className="text-sm text-brand-muted">Mindset intervention for elite youth athletes. Daily messages via app.</p>
            </div>
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border">
              <div className="text-purple-500 font-mono text-sm mb-2">03</div>
              <h3 className="font-semibold mb-2">Change-You.niversity</h3>
              <p className="text-sm text-brand-muted">The podcast. The .uoY logo. &ldquo;Who you see in the mirror.&rdquo;</p>
            </div>
            <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border">
              <div className="text-orange-500 font-mono text-sm mb-2">04</div>
              <h3 className="font-semibold mb-2">You.Prjct</h3>
              <p className="text-sm text-brand-muted">The system. Vision meets relentless action. The dream since college.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The .uoY Concept */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 md:p-16 rounded-[2.5rem] bg-gradient-to-br from-brand-surface via-brand-card to-brand-surface border border-brand-border overflow-hidden">
            {/* Decorative gradient orbs */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-accent/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />

            <div className="relative text-center">
              <h2 className="text-6xl md:text-8xl font-bold mb-10 tracking-tight">
                <span className="text-brand-muted">.uoY</span>
              </h2>

              <div className="space-y-6 max-w-2xl mx-auto">
                <p className="text-xl md:text-2xl text-brand-text leading-relaxed">
                  Who you see is what matters.
                </p>
                <p className="text-lg text-brand-muted leading-relaxed">
                  Who you see in the mirror—and what you believe is possible for your life—that&apos;s what shapes everything. Not what others think. Not what the world expects. <span className="text-brand-text">You.</span>
                </p>
                <p className="text-lg text-brand-muted leading-relaxed">
                  The past version of you made sacrifices hoping this moment would come. The future version of you is waiting to see if you&apos;ll show up. Both are watching. Both are real.
                </p>
                <p className="text-lg text-brand-muted leading-relaxed">
                  That&apos;s why it&apos;s written backwards. <span className="text-brand-text font-medium">.uoY</span>—only readable in the mirror. Because the only opinion that can truly change your life is the one staring back at you.
                </p>
              </div>

              <div className="mt-10 pt-8 border-t border-brand-border/50">
                <p className="text-brand-accent font-medium text-lg">
                  Teachers can point the way. Mentors can light it.<br />
                  <span className="text-brand-text">But you must walk it.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-emerald/50 to-transparent" />

      {/* The Founders */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-brand-accent uppercase tracking-widest">The Founders</span>
            <h2 className="text-display-md mt-4">
              Brothers in arms<span className="text-brand-accent">.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Harrison */}
            <div className="group">
              <div className="aspect-[4/5] rounded-3xl bg-brand-surface border border-brand-border overflow-hidden mb-6 relative">
                <Image
                  src="/images/founders/Harrison.Co-F.jpg"
                  alt="Harrison Schertzinger"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">Harrison Schertzinger</h3>
              <p className="text-brand-accent text-sm font-medium mb-3">App Developer & Business Development</p>
              <p className="text-brand-muted">
                UNC Lacrosse. Co-founder of The Cincinnati Lacrosse Academy and You. First Elite Lacrosse. Author of <span className="italic">The Angel in the Marble</span>. Host of The Infinite Game.
              </p>
            </div>

            {/* Henry */}
            <div className="group">
              <div className="aspect-[4/5] rounded-3xl bg-brand-surface border border-brand-border overflow-hidden mb-6 relative">
                <Image
                  src="/images/founders/Henry.Co-F.jpg"
                  alt="Henry Schertzinger"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">Henry Schertzinger</h3>
              <p className="text-brand-emerald text-sm font-medium mb-3">Marketing</p>
              <p className="text-brand-muted">
                UNC Lacrosse. Co-founder of The Cincinnati Lacrosse Academy and You. First Elite Lacrosse. Host of The Infinite Game. The ACL that started it all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Belief */}
      <section className="relative z-10 py-24 px-6 border-t border-brand-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-sm font-semibold text-brand-emerald uppercase tracking-widest">The Belief</span>
          <h2 className="text-display-md mt-4 mb-8">
            The greatest investment you can make is in yourself<span className="text-brand-accent">.</span>
          </h2>
          <div className="space-y-6 text-xl text-brand-muted max-w-3xl mx-auto">
            <p>
              But there has to be a system. We fall to the level of our systems. The discipline really does create freedom. The order really does keep and protect you.
            </p>
            <p className="text-brand-text font-medium">
              &ldquo;The greatest gift you can give someone is a pattern of action and perception.&rdquo;
            </p>
            <p>
              That&apos;s what You. First is: a system of perception and action. It makes clear what to prioritize and how to properly perceive the world to thrive.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-display-sm md:text-display-md mb-6">
            Who you become is a gift to this world<span className="text-brand-accent">.</span>
          </h2>
          <p className="text-xl text-brand-muted mb-10">
            Don&apos;t cheat us of your contribution.
          </p>
          <Link
            href="/#download"
            className="group inline-flex items-center gap-3 bg-white text-brand-bg px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-brand-text/90 transition-all hover:scale-[1.02] shadow-lg shadow-white/20"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Download You. First
            <span className="text-brand-muted group-hover:translate-x-1 transition-transform">→</span>
          </Link>
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
              <Link href="/about" className="hover:text-brand-text transition-colors">
                About
              </Link>
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
