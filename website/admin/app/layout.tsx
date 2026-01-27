import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'You. First — Personal Excellence Platform',
  description: 'A premium personal performance system for athletes and high-performers. Order your thoughts. Order your life.',
  keywords: ['personal excellence', 'habit tracking', 'discipline', 'athletes', 'high performers', 'goal setting'],
  authors: [{ name: 'You. First' }],
  openGraph: {
    title: 'You. First — Personal Excellence Platform',
    description: 'A premium personal performance system for athletes and high-performers.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'You. First — Personal Excellence Platform',
    description: 'A premium personal performance system for athletes and high-performers.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-brand-bg text-brand-text antialiased">
        {children}
      </body>
    </html>
  );
}
