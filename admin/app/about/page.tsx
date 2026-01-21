import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'About - You. First',
  description: 'The story behind You. First. Two brothers on a mission to help people become who they are meant to be.',
};

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
            <Link href="/system" className="text-sm text-brand-muted hover:text-brand-text transition-colors">
              The System
            </Link>
            <Link href="/features" className="text-sm text-brand-muted hover:text-brand-text transition-colors">
              Features
            </Link>
            <Link href="/about" className="text-sm text-brand-text font-medium">
              About
            </Link>
            <a href="/#download" className="text-sm font-medium text-brand-accent hover:text-brand-accent/80 transition-colors">
              Download
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-24 px-6 overflow-hidden">
        {/* Hero-specific glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-radial from-brand-accent/30 via-brand-accent/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-display-lg md:text-display-xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-white via-white to-brand-accent bg-clip-text text-transparent">8 Billion people</span><span className="text-brand-accent">.</span>
          </h1>
          <p className="text-display-sm md:text-display-md text-brand-muted mb-8">
            One of <span className="text-brand-text font-bold">You</span><span className="text-brand-accent font-bold">.</span>
          </p>
          <div className="max-w-xl mx-auto">
            <p className="text-xl text-brand-muted leading-relaxed">
              A system for those who refuse to settle. For the ones building something with their lives—day by day, habit by habit.
            </p>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent" />

      {/* Systems Create Freedom - With Visual Tiles */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Statement */}
            <div>
              <h2 className="text-display-md md:text-display-lg font-bold tracking-tight mb-8">
                Systems create freedom<span className="text-brand-accent">.</span>
              </h2>
              <div className="space-y-6 text-lg text-brand-muted leading-relaxed">
                <p>
                  The greatest investment you can ever make is in yourself. But there has to be a system.
                </p>
                <p className="text-2xl text-brand-text font-medium">
                  We fall to the level of our systems.
                </p>
                <p>
                  The discipline really does create freedom. The order really does keep and protect you.
                </p>
              </div>
              <div className="mt-10 pt-10 border-t border-brand-border/30">
                <p className="text-brand-muted italic text-lg">
                  &ldquo;The greatest gift you can give to someone is a pattern of action and perception.&rdquo;
                </p>
                <p className="text-brand-text mt-4 font-medium">
                  That&apos;s what You. First is.
                </p>
              </div>
            </div>

            {/* Right - Visual Tiles */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-accent/20 to-brand-accent/5 border border-brand-accent/20">
                <div className="w-12 h-12 rounded-xl bg-brand-accent/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-brand-text mb-2">Discipline</h3>
                <p className="text-sm text-brand-muted">Structure that sets you free</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-emerald/20 to-brand-emerald/5 border border-brand-emerald/20">
                <div className="w-12 h-12 rounded-xl bg-brand-emerald/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-brand-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-brand-text mb-2">Action</h3>
                <p className="text-sm text-brand-muted">Daily habits compound</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-brand-text mb-2">Perception</h3>
                <p className="text-sm text-brand-muted">See what matters</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/20">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
                <h3 className="font-bold text-brand-text mb-2">Consistency</h3>
                <p className="text-sm text-brand-muted">Show up every day</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-emerald/50 to-transparent" />

      {/* The Origin - Full height image */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Left - Text (3 cols) */}
            <div className="lg:col-span-3">
              <span className="text-sm font-semibold text-brand-emerald uppercase tracking-widest">The Origin</span>
              <h2 className="text-display-sm mt-4 mb-8">
                How&apos;d this start<span className="text-brand-emerald">?</span>
              </h2>
              <div className="space-y-6 text-brand-muted leading-relaxed">
                <p className="text-brand-text text-lg font-medium">
                  The same way the majority of adventures do: a crisis.
                </p>
                <p>
                  When I was 16 years old, my brother tore his ACL. As serious athletes—both committed to play lacrosse at The University of North Carolina—this was a taboo-type injury. ACL surgeries were season ending and sometimes career altering.
                </p>
                <p>
                  Said simply, my brother was down bad, and I needed something to say to him.
                </p>
                <p>
                  So, I picked up a book—<span className="text-brand-text font-medium italic">Chop Wood Carry Water</span>—and that book changed the course of my life. From then on I read like my life depended upon it, and now believe… well, that it does.
                </p>
                <p>
                  Because that book was the first time I interacted with ideas that were <span className="text-brand-text">alive</span>; ideas that were an invitation to live in a new way.
                </p>
                <p>
                  Every book said different things, every author had his own take, but each one seemed to scream the same things:
                </p>
                <blockquote className="border-l-4 border-brand-emerald pl-6 py-2 text-brand-text text-lg italic">
                  My friend, please understand what determines the quality of someone&apos;s life and have the courage to pursue your path; have the courage to break away from the crowd, and the discipline to do what it takes; live a great and noble adventure.
                </blockquote>
                <p className="text-brand-text text-xl font-medium pt-4">
                  It was freedom. Or, a pathway to freedom. A stairway that seemed to climb to the heavens, available to anyone.
                </p>
              </div>
            </div>

            {/* Right - Stacked Images (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl overflow-hidden border border-brand-border">
                <Image
                  src="/images/about/harrison-books.jpg"
                  alt="Harrison with books"
                  width={500}
                  height={600}
                  className="w-full h-auto"
                  priority
                />
              </div>
              <div className="rounded-2xl overflow-hidden border border-brand-border">
                <Image
                  src="/images/about/dsc04959.jpg"
                  alt="Training"
                  width={500}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent" />

      {/* In the Trenches */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-brand-accent uppercase tracking-widest">The Work</span>
            <h2 className="text-display-sm mt-4">
              In the trenches<span className="text-brand-accent">.</span>
            </h2>
            <p className="text-xl text-brand-muted mt-4 max-w-2xl mx-auto">
              We don&apos;t just build apps. We coach athletes. We run businesses. We live this every day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="https://www.cincinnatilacrosseacademy.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-brand-accent/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold group-hover:text-brand-accent transition-colors">Cincinnati Lacrosse Academy</h3>
                <svg className="w-5 h-5 text-brand-muted group-hover:text-brand-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <p className="text-brand-muted">
                Training the next generation of lacrosse players. Technical development, mental toughness, and character building.
              </p>
            </a>

            <a
              href="https://www.youfirstelitelacrosseclub.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-8 rounded-3xl bg-brand-surface border border-brand-border hover:border-brand-accent/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold group-hover:text-brand-accent transition-colors">You. First Elite Lacrosse</h3>
                <svg className="w-5 h-5 text-brand-muted group-hover:text-brand-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <p className="text-brand-muted">
                Elite travel lacrosse for players who want more. Compete at the highest level while developing as athletes and people.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-emerald/50 to-transparent" />

      {/* Podcast */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <a
                href="https://podcasts.apple.com/us/podcast/the-infinite-game-podcast/id1657820186"
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden border border-brand-border hover:border-brand-emerald/50 transition-colors shadow-2xl shadow-brand-emerald/10"
              >
                <Image
                  src="/images/about/podcast-cover.png"
                  alt="The Infinite Game Podcast"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </a>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-sm font-semibold text-brand-emerald uppercase tracking-widest">The Podcast</span>
              <h2 className="text-display-sm mt-4 mb-6">
                The Infinite Game<span className="text-brand-emerald">.</span>
              </h2>
              <p className="text-brand-muted leading-relaxed mb-4">
                Conversations about excellence, discipline, and the pursuit of becoming. Because the goal isn&apos;t to win once. It&apos;s to keep playing.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="https://podcasts.apple.com/us/podcast/the-infinite-game-podcast/id1657820186"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-emerald/50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Apple Podcasts
                </a>
                <a
                  href="https://www.youtube.com/@theschertzingertwins"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-surface border border-brand-border hover:border-red-500/50 transition-colors"
                >
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      {/* Founders */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-500 uppercase tracking-widest">The Founders</span>
            <h2 className="text-display-sm mt-4">
              The mission continues<span className="text-purple-500">.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="aspect-[4/5] rounded-3xl bg-brand-surface border border-brand-border overflow-hidden mb-6 relative">
                <Image
                  src="/images/founders/Harrison-thefounders.jpg"
                  alt="Harrison Schertzinger"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">Harrison Schertzinger</h3>
              <p className="text-brand-accent text-sm font-medium mb-4">Co-Founder</p>
              <p className="text-brand-muted">
                UNC Lacrosse. Author of <span className="text-brand-text italic">The Angel in the Marble</span>. Co-founder of The Cincinnati Lacrosse Academy and You. First Elite Lacrosse.
              </p>
            </div>

            <div>
              <div className="aspect-[4/5] rounded-3xl bg-brand-surface border border-brand-border overflow-hidden mb-6 relative">
                <Image
                  src="/images/founders/Henry-thefounders.jpg"
                  alt="Henry Schertzinger"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">Henry Schertzinger</h3>
              <p className="text-purple-500 text-sm font-medium mb-4">Co-Founder</p>
              <p className="text-brand-muted">
                UNC Lacrosse. The ACL injury that started it all—and the comeback that proved the system works. Co-founder of The Cincinnati Lacrosse Academy and You. First Elite Lacrosse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent" />

      {/* .uoY */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-bold mb-12 tracking-tight">
            <span className="text-brand-muted">.uoY</span>
          </h2>
          <div className="space-y-6 text-left">
            <p className="text-lg text-brand-muted leading-relaxed">
              There&apos;s a moment when you look in the mirror, and you see the same eyes looking back at you that did when you were 12 years old. The past and present are all here.
            </p>
            <p className="text-xl text-brand-text leading-relaxed font-medium">
              Everything… depends on You. Who you see in the mirror.
            </p>
            <p className="text-lg text-brand-muted leading-relaxed">
              The teacher, master, leader, guru—they all can point the way, but you must walk the way.
            </p>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-emerald/50 to-transparent" />

      {/* Photo Gallery */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-brand-emerald uppercase tracking-widest">The Journey</span>
            <h2 className="text-display-sm mt-4">
              Before it was an app<span className="text-brand-emerald">.</span>
            </h2>
          </div>

          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            <div className="break-inside-avoid rounded-2xl overflow-hidden border border-brand-border">
              <Image src="/images/about/harrison-coaching.jpg" alt="Coaching" width={600} height={800} className="w-full h-auto hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="break-inside-avoid rounded-2xl overflow-hidden border border-brand-border">
              <Image src="/images/about/brothers-players.jpg" alt="With players" width={600} height={400} className="w-full h-auto hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="break-inside-avoid rounded-2xl overflow-hidden border border-brand-border">
              <Image src="/images/about/harrison-coaching-2.jpg" alt="Training" width={600} height={400} className="w-full h-auto hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="break-inside-avoid rounded-2xl overflow-hidden border border-brand-border">
              <Image src="/images/about/henry-action.jpg" alt="Henry" width={600} height={800} className="w-full h-auto hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="break-inside-avoid rounded-2xl overflow-hidden border border-brand-border">
              <Image src="/images/about/brothers.jpg" alt="Brothers" width={600} height={400} className="w-full h-auto hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent" />

      {/* Final CTA */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-display-sm md:text-display-md mb-6">
            Who you become is a gift to this world<span className="text-brand-accent">.</span>
          </h2>
          <p className="text-xl text-brand-muted mb-10">
            Don&apos;t cheat us of your contribution.
          </p>
          <a
            href="/#download"
            className="group inline-flex items-center gap-3 bg-white text-brand-bg px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-brand-text/90 transition-all hover:scale-[1.02] shadow-lg shadow-white/20"
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
              <Link href="/premium" className="text-brand-gold hover:text-brand-gold/80 transition-colors">Pro</Link>
              <Link href="/privacy" className="hover:text-brand-text transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-brand-text transition-colors">Terms</Link>
              <Link href="/support" className="hover:text-brand-text transition-colors">Support</Link>
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
