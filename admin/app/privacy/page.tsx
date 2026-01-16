import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - You.prjct',
  description: 'Privacy Policy for the You.prjct mobile application.',
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
          Privacy Policy for You.prjct
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            <strong>Effective Date:</strong> January 16, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Introduction
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Harrison Schertzinger (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the You.prjct mobile application (the &quot;App&quot;).
              This Privacy Policy explains how we collect, use, and protect your information when you use our App.
            </p>
            <p className="text-slate-600 dark:text-slate-300 mt-4">
              By using You.prjct, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Information We Collect
            </h2>

            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3 mt-6">
              Information You Provide
            </h3>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
              <li><strong>Account Information:</strong> Email address and display name when you create an account</li>
              <li><strong>User Content:</strong> Workout logs, goals, routines, and other data you manually enter into the App</li>
            </ul>

            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3 mt-6">
              Information Collected Automatically
            </h3>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
              <li><strong>Subscription Status:</strong> We use RevenueCat to manage subscriptions and verify your purchase status</li>
            </ul>

            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3 mt-6">
              Information We Do NOT Collect
            </h3>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
              <li>Location data</li>
              <li>Health data from Apple Health or Google Fit</li>
              <li>Third-party analytics or behavioral tracking data</li>
              <li>Advertising identifiers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              How We Use Your Information
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              We use your information solely to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
              <li>Provide and maintain the App&apos;s functionality</li>
              <li>Store and sync your workout logs, goals, and routines across devices</li>
              <li>Manage your account and subscription status</li>
              <li>Respond to your support requests</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 mt-4">
              We do not use your data for advertising, behavioral profiling, or any purpose beyond delivering the core App experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Data Storage
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Your data is stored in two locations:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
              <li><strong>Cloud Storage:</strong> Supabase, a secure cloud database, stores your account information and synced content</li>
              <li><strong>Local Storage:</strong> AsyncStorage on your device stores data for offline access</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 mt-4">
              All data transmission uses industry-standard encryption (HTTPS/TLS).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Third-Party Services
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              We use the following third-party services:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300 dark:border-slate-600 mt-4">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    <th className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-left text-slate-900 dark:text-white">Service</th>
                    <th className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-left text-slate-900 dark:text-white">Purpose</th>
                    <th className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-left text-slate-900 dark:text-white">Privacy Policy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-600 dark:text-slate-300">Supabase</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-600 dark:text-slate-300">Authentication and database</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">
                      <a href="https://supabase.com/privacy" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-600 dark:text-slate-300">RevenueCat</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-600 dark:text-slate-300">Subscription management</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">
                      <a href="https://www.revenuecat.com/privacy" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">revenuecat.com/privacy</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-600 dark:text-slate-300">Apple App Store</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-600 dark:text-slate-300">App distribution and payments</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">
                      <a href="https://www.apple.com/privacy" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">apple.com/privacy</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mt-4">
              These services have their own privacy policies governing their use of your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Data Sharing
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              We do not sell, rent, or share your personal information with third parties for marketing purposes.
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              We may share data only:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2 mt-2">
              <li>With service providers necessary to operate the App (listed above)</li>
              <li>If required by law or legal process</li>
              <li>To protect our rights or the safety of users</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Your Rights
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
              <li>Access your data within the App</li>
              <li>Update your account information at any time</li>
              <li>Delete your account and associated data by contacting us</li>
              <li>Export your data upon request</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 mt-4">
              To exercise these rights, contact us at the email below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Data Retention
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We retain your data for as long as your account is active. If you delete your account,
              we will delete your personal data within 30 days, except where retention is required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Children&apos;s Privacy
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              You. First is not intended for children under 13. We do not knowingly collect personal
              information from children under 13. If you believe we have collected such information,
              please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Changes to This Policy
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new policy in the App and updating the &quot;Effective Date&quot; above.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Contact Us
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              If you have questions about this Privacy Policy or your data, contact us at:
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              <strong>Email:</strong> harrison@theyoufirstproject.com
            </p>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              <strong>Developer:</strong> Harrison Schertzinger
            </p>
          </section>

          <p className="text-slate-500 dark:text-slate-400 text-sm mt-12 border-t border-slate-200 dark:border-slate-700 pt-6">
            This privacy policy was last updated on January 16, 2025.
          </p>
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
