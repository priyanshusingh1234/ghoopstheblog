const siteMetadata = {
  title: 'Ghoops! | The Blog',
  author: 'Priyanshu',
  headerTitle: 'GhoopstheBlog',            // Capitalized for readability
  description: 'A blog providing you with the best possible articles across various topics.',
  language: 'en-US',                       // Corrected to en-US for consistency
  theme: 'system',                        // Options: 'system', 'dark', or 'light'
  siteUrl: 'https://ghoopstheblog.vercel.app',  // Your website URL (ensure no trailing slash)
  siteLogo: '/logo.png',                  // Path to logo image in public folder
  socialBanner: '/social-banner.png',    // Path to social media banner image in public folder
  email: 'kpk22128@gmail.com',
  locale: 'en-US',                       // Locale for structured data, keep consistent with language

  // Additional recommended fields you might consider adding:
  twitterUsername: '@yourTwitterHandle',    // Your Twitter handle for social cards
  githubUsername: 'yourGithubUsername',     // If applicable
  linkedinUsername: 'yourLinkedInUsername', // If applicable

  // Optional SEO related:
  keywords: ['blog', 'articles', 'technology', 'life', 'tutorials'], // Example keywords
};

module.exports = siteMetadata;
