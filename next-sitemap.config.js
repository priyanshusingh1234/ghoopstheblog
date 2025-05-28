const siteMetadata = require("./src/utils/siteMetaData");

module.exports = {
  siteUrl: siteMetadata.siteUrl,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      // You can add more policies here, for example:
      // { userAgent: "*", disallow: "/secret" },
    ],
    additionalSitemaps: [
      `${siteMetadata.siteUrl}/sitemap.xml`,
      // add more sitemap URLs if needed
    ],
  },
};
