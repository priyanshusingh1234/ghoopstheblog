const https = require('https');

const key = '0348f37c0ea34ea2829e565b2658dc9d';
const urls = [
  'https://ghoopstheblog.vercel.app/',
  'https://ghoopstheblog.vercel.app/about',
  'https://ghoopstheblog.vercel.app/contact',
  'https://ghoopstheblog.vercel.app/blogs/the-lost-city-of-atlantis',
  'https://ghoopstheblog.vercel.app/blogs/five-mysterious-locations-of-the-world-that-continue-to-baffle-scientists',
];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function pingIndexNow(url) {
  return new Promise((resolve, reject) => {
    const pingUrl = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(url)}&key=${key}`;
    https.get(pingUrl, (res) => {
      console.log(`✅ IndexNow ping sent for ${url} - Status: ${res.statusCode}`);
      resolve();
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function runPings(urls) {
  for (const url of urls) {
    let retries = 3;
    while (retries > 0) {
      try {
        await pingIndexNow(url);
        break; // success, exit retry loop
      } catch (err) {
        retries--;
        console.warn(`⚠️ Ping failed for ${url}: ${err.message}. Retries left: ${retries}`);
        if (retries === 0) {
          console.error(`❌ Ping permanently failed for ${url}`);
        } else {
          await delay(2000); // wait 2 seconds before retrying
        }
      }
    }
    await delay(1000); // wait 1 second before next URL
  }
}

runPings(urls);
