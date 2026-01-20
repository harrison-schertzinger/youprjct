import Link from 'next/link';

export const metadata = {
  title: 'Support - You. First',
  description: 'Get help with the You. First app. Contact support, FAQs, and troubleshooting.',
};

const FAQS = [
  {
    question: 'How do I restore my subscription on a new device?',
    answer: 'Open the app, go to the Premium screen, and tap "Restore Purchases". This will restore any active subscriptions linked to your Apple ID.',
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'Subscriptions are managed through Apple. Go to Settings > Your Name > Subscriptions on your iPhone, find You. First, and tap Cancel Subscription.',
  },
  {
    question: 'My data isn\'t syncing across devices',
    answer: 'Make sure you\'re signed into the same account on both devices and have an active internet connection. You can also try pulling down to refresh on the main screen.',
  },
  {
    question: 'How do I reset my streak or clear my data?',
    answer: 'Go to your Profile (tap your avatar on the You. screen), scroll down to Troubleshooting, and use the reset options there.',
  },
  {
    question: 'The app is crashing or not loading',
    answer: 'Try force-closing the app and reopening it. If the issue persists, try deleting and reinstalling the app. Your data will be restored when you sign back in.',
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-slate-900 dark:text-white">
            You. First
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Support
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-12">
          We're here to help you get the most out of You. First.
        </p>

        {/* Contact Section */}
        <section className="mb-12 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Contact Us
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Have a question or need help? Reach out and we'll get back to you within 24-48 hours.
          </p>
          <a
            href="mailto:harrison@theyoufirstproject.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Support
          </a>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
            harrison@theyoufirstproject.com
          </p>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-5"
              >
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Troubleshooting Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Troubleshooting Tips
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-3">
              <li>
                <strong>Update the app:</strong> Make sure you're running the latest version from the App Store.
              </li>
              <li>
                <strong>Check your connection:</strong> Many features require an internet connection to sync data.
              </li>
              <li>
                <strong>Restart the app:</strong> Force close and reopen the app to resolve temporary issues.
              </li>
              <li>
                <strong>Reinstall if needed:</strong> If problems persist, delete and reinstall. Sign back in to restore your data.
              </li>
            </ul>
          </div>
        </section>

        {/* App Info */}
        <section className="border-t border-slate-200 dark:border-slate-700 pt-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            About You. First
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            You. First is a personal excellence system designed to help you build consistency,
            track your progress, and become the best version of yourself through daily habits,
            goals, and training.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
              Terms of Service
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white">
            &larr; Back to Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
