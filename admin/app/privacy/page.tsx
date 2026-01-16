import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - You. First',
  description: 'Privacy Policy for the You. First mobile application.',
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Privacy Policy
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            <strong>Effective Date:</strong> January 2025
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              1. Introduction
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Welcome to You. First (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). This Privacy Policy explains how we collect,
              use, and protect your information when you use our mobile application.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              2. Information We Collect
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              We collect the following types of information:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
              <li><strong>Account Information:</strong> Email address and display name when you create an account</li>
              <li><strong>Training Data:</strong> Workout logs, personal records, goals, routines, and reading sessions you choose to track</li>
              <li><strong>Subscription Information:</strong> Purchase status managed through RevenueCat</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              3. Information We Do NOT Collect
            </h2>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
              <li>Location data</li>
              <li>Health data from Apple Health or Google Fit</li>
              <li>Third-party analytics or advertising trackers</li>
              <li>Contacts or photos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              4. How We Use Your Information
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
              <li>Provide and improve the app&apos;s features</li>
              <li>Sync your data across devices</li>
              <li>Process subscription payments</li>
              <li>Respond to support requests</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              5. Data Storage
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Your data is stored in two places:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2 mt-4">
              <li><strong>Locally on your device:</strong> Using secure storage for offline access</li>
              <li><strong>Supabase cloud database:</strong> For backup and cross-device sync (encrypted in transit and at rest)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              6. Third-Party Services
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
              <li><strong>Supabase:</strong> Authentication and database hosting</li>
              <li><strong>RevenueCat:</strong> Subscription management</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 mt-4">
              These services have their own privacy policies governing their use of your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              7. Data Sharing
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We do not sell, rent, or share your personal information with third parties for marketing purposes.
              We may share data only when required by law or to protect our rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              8. Your Rights
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
              <li>Access your personal data</li>
              <li>Request deletion of your account and data</li>
              <li>Export your data</li>
              <li>Opt out of optional data collection</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              9. Data Retention
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We retain your data for as long as your account is active. Upon account deletion,
              we will delete your personal data within 30 days, except where retention is required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              10. Children&apos;s Privacy
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Our app is not intended for children under 13. We do not knowingly collect personal
              information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              11. Changes to This Policy
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new policy on this page and updating the effective date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              12. Contact Us
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-slate-600 dark:text-slate-300 mt-4">
              <strong>Email:</strong> support@youfirst.app
            </p>
          </section>
        </div>
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
