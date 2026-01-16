import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'You. First - Personal Excellence Platform',
  description: 'A premium personal performance system for athletes and high-performers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-slate-900">
        {children}
      </body>
    </html>
  );
}
