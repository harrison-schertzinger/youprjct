import Link from 'next/link';

export const metadata = {
  title: 'Terms of Use - You.prjct',
  description: 'Terms of Use for the You.prjct mobile application.',
};

export default function TermsPage() {
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
          Terms of Use
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            <strong>Effective Date:</strong> January 2026
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              By downloading, accessing, or using the You.prjct mobile application (&quot;App&quot;), you agree to be bound by these Terms of Use (&quot;Terms&quot;). If you do not agree to these Terms, do not use the App.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              2. Description of Service
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              You.prjct is a personal excellence platform designed to help users track habits, goals, fitness training, reading, and personal disciplines. The App offers both free features and premium features available through a paid subscription (&quot;You. Pro&quot;).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              3. Subscription Terms
            </h2>

            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3 mt-6">
              3.1 You. Pro Subscription
            </h3>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
              <li><strong>Title:</strong> You. Pro Monthly Subscription</li>
              <li><strong>Price:</strong> $4.99 USD per month</li>
              <li><strong>Duration:</strong> 1 month (auto-renewable)</li>
              <li><strong>Free Trial:</strong> New subscribers receive a 1-month free trial</li>
            </ul>

            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3 mt-6">
              3.2 Billing
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Payment will be charged to your Apple ID account at confirmation of purchase. Your subscription will automatically renew at the end of each billing period unless canceled at least 24 hours before the end of the current period.
            </p>

            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3 mt-6">
              3.3 Cancellation
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              You may cancel your subscription at any time through your Apple ID account settings. To cancel, go to Settings &gt; [Your Name] &gt; Subscriptions on your iOS device. Cancellation takes effect at the end of the current billing period. No refunds will be provided for partial billing periods.
            </p>

            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3 mt-6">
              3.4 Free Trial
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              If you cancel during the free trial period, you will not be charged. If you do not cancel before the free trial ends, your subscription will automatically begin and you will be charged the subscription price.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              4. User Accounts
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              5. User Content
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Any data you enter into the App (including goals, tasks, workout logs, and reading sessions) remains your property. We do not claim ownership of your content. See our <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link> for how we handle your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              6. Acceptable Use
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
              <li>Use the App for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to the App or its systems</li>
              <li>Interfere with or disrupt the App&apos;s functionality</li>
              <li>Reverse engineer or attempt to extract the source code of the App</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              The App and its original content, features, and functionality are owned by You.prjct and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              8. Disclaimers
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              THE APP IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT THE APP WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              The App provides tools for personal tracking and is not a substitute for professional medical, fitness, or mental health advice. Always consult qualified professionals for health-related decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              9. Limitation of Liability
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE APP.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              10. Changes to Terms
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We reserve the right to modify these Terms at any time. We will notify users of material changes through the App or via email. Continued use of the App after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              11. Governing Law
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              12. Contact Us
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              If you have questions about these Terms, contact us at:
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              <strong>Email:</strong> harrison@theyoufirstproject.com
            </p>
          </section>

          <p className="text-slate-500 dark:text-slate-400 text-sm mt-12 border-t border-slate-200 dark:border-slate-700 pt-6">
            These terms were last updated in January 2026.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-8 flex justify-center gap-6 text-sm text-slate-500">
          <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white">
            Privacy Policy
          </Link>
          <span>|</span>
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white">
            &larr; Back to Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
