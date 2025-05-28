const https = require('https');

const key = '0348f37c0ea34ea2829e565b2658dc9d'; // your real IndexNow key
const urls = [
  'https://ghoopstheblog.vercel.app/', // homepage
  // Add more URLs here as needed
];

urls.forEach((url) => {
  const pingUrl = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(url)}&key=${key}`;

  https.get(pingUrl, (res) => {
    console.log(`✅ IndexNow ping sent for ${url} - Status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`❌ IndexNow failed for ${url}: ${err.message}`);
  });
});
