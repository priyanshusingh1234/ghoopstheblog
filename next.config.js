/** @type {import('webpack').Compiler} */
class VeliteWebpackPlugin {
  static started = false;

  apply(compiler) {
    compiler.hooks.beforeCompile.tapPromise('VeliteWebpackPlugin', async () => {
      if (VeliteWebpackPlugin.started) return;
      VeliteWebpackPlugin.started = true;
      const dev = compiler.options.mode === 'development';
      const { build } = await import('velite');
      await build({ watch: dev, clean: !dev });
    });
  }
}

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  images: {
    domains: [
      'ghoopstheblog.me',
      'images.unsplash.com',
      'cdn.pixabay.com',
      'cdn.pexels.com',
      'upload.wikimedia.org',
      'api.dicebear.com',
      'uploadthing.com',
       'utfs.io',
    ],
    dangerouslyAllowSVG: true, // ✅ Enable SVG from trusted domains
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // ✅ Recommended
  },

  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
};
