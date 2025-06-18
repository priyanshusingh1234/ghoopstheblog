import React from "react";

export const metadata = {
  title: "Privacy Policy | GhoopsTheBlog",
  description:
    "Read the privacy policy of GhoopsTheBlog to understand how we collect, use, and protect your personal data. Learn more about cookies, data usage, and third-party services.",
  alternates: {
    canonical: "https://ghoopstheblog.vercel.app/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | GhoopsTheBlog",
    description:
      "How GhoopsTheBlog collects and uses your personal information including cookies, analytics, and third-party tools.",
    url: "https://ghoopstheblog.vercel.app/privacy-policy",
    siteName: "GhoopsTheBlog",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | GhoopsTheBlog",
    description:
      "Learn about the privacy practices of GhoopsTheBlog including cookie usage, third-party data, and contact information.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const PrivacyPolicy = () => {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-base leading-7 text-neutral-800 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-md dark:shadow-lg transition-colors duration-300">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-neutral-900 dark:text-neutral-100">
        Privacy Policy
      </h1>

      <section className="space-y-6">
        <p>
          Welcome to <strong>GhoopsTheBlog</strong>. This Privacy Policy outlines how we handle your information.
        </p>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">1. What We Collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Your name and email when you subscribe</li>
            <li>Analytics data (e.g., device, page visits)</li>
            <li>Cookies for personalization</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">2. How We Use It</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To improve user experience</li>
            <li>To send newsletters or replies</li>
            <li>To display relevant ads</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">3. Cookies</h2>
          <p>
            We use cookies to remember your preferences. You can disable them in your browser settings.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">4. Third Parties</h2>
          <p>
            Services like Google Analytics and AdSense may collect data. Their privacy policies apply.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">5. Data Security</h2>
          <p>
            We take reasonable steps to protect your information, but no system is 100% secure.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">6. Children’s Privacy</h2>
          <p>
            This blog is not directed at children under 13. We do not knowingly collect data from them.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">7. Updates</h2>
          <p>
            We may update this Privacy Policy from time to time. Check this page for changes.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">8. Contact</h2>
          <p>
            If you have any questions, contact us at:{" "}
            <a
              href="mailto:kpk22128@gmail.com"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              kpk22128@gmail.com
            </a>
          </p>
        </div>

        <p className="text-sm text-center text-neutral-600 dark:text-neutral-400 pt-6">
          Last updated: June 18, 2025
        </p>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
