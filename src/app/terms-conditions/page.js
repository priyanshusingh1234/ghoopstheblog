import React from 'react';
import Head from 'next/head';
import siteMetadata from '@/src/utils/siteMetaData'; // ✅ Adjust this path based on your project structure

const TermsAndConditions = () => {
  return (
    <>
      <Head>
        <title>Terms and Conditions | {siteMetadata.title}</title>
        <meta
          name="description"
          content="Read the Terms and Conditions of using GhoopsTheBlog. Know your rights and responsibilities as a user."
        />
        <meta property="og:title" content={`Terms and Conditions | ${siteMetadata.title}`} />
        <meta property="og:description" content="Read the Terms and Conditions of using GhoopsTheBlog." />
        <meta property="og:url" content={`${siteMetadata.siteUrl}/terms`} />
        <meta property="og:image" content={`${siteMetadata.siteUrl}${siteMetadata.socialBanner}`} />
        <meta name="keywords" content={siteMetadata.keywords.join(', ')} />
        <link rel="canonical" href={`${siteMetadata.canonicalUrl}/terms`} />
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-8 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 transition-colors duration-300">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

        <p className="text-sm mb-6">Last updated: July 19, 2025</p>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using <strong>{siteMetadata.headerTitle}</strong> (“we”, “our”, or “the blog”), you agree to be bound by these Terms and Conditions. If you do not agree with any part of the terms, then you may not access the blog.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">2. Use of Content</h2>
          <p>
            All content provided on {siteMetadata.headerTitle} is for informational purposes only. We make no representations as to the accuracy or completeness of any information and will not be liable for any errors or omissions.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">3. Intellectual Property</h2>
          <p>
            All content on the blog, including text, images, graphics, and logos, is the property of {siteMetadata.headerTitle} unless otherwise stated. Unauthorized use is prohibited.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">4. User Conduct</h2>
          <p>
            You agree not to use the blog for any unlawful purpose or in a way that could harm the reputation or functionality of the blog.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">5. Links to Third-Party Sites</h2>
          <p>
            The blog may contain links to external websites. We are not responsible for the content or practices of those sites.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any time. Changes will be posted on this page with the updated date.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">7. Contact</h2>
          <p>
            If you have any questions about these Terms, please contact us at{' '}
            <a
              href={`mailto:${siteMetadata.email}`}
              className="text-blue-600 dark:text-blue-400 underline"
            >
              {siteMetadata.email}
            </a>.
          </p>
        </section>
      </main>
    </>
  );
};

export default TermsAndConditions;
