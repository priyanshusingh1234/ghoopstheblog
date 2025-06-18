"use client";
import React from "react";
import Head from "next/head";

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | GhoopsTheBlog</title>
        <meta
          name="description"
          content="Read the privacy policy of GhoopsTheBlog to understand how we collect, use, and protect your personal data. Learn more about cookies, data usage, and third-party services."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ghoopstheblog.vercel.app/privacy-policy" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Privacy Policy | GhoopsTheBlog" />
        <meta
          property="og:description"
          content="How GhoopsTheBlog collects and uses your personal information including cookies, analytics, and third-party tools."
        />
        <meta property="og:url" content="https://ghoopstheblog.vercel.app/privacy-policy" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GhoopsTheBlog" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Privacy Policy | GhoopsTheBlog" />
        <meta
          name="twitter:description"
          content="Learn about the privacy practices of GhoopsTheBlog including cookie usage, third-party data, and contact information."
        />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Privacy Policy",
              description:
                "Privacy policy for GhoopsTheBlog including details on data collection, usage, and contact information.",
              url: "https://ghoopstheblog.vercel.app/privacy-policy",
              publisher: {
                "@type": "Organization",
                name: "GhoopsTheBlog",
              },
            }),
          }}
        />
      </Head>

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
    </>
  );
};

export default PrivacyPolicy;
