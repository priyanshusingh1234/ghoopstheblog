export default function manifest() {
    return {
      name: 'Ghoops The Blog',
      short_name: 'ghoopstheblog',
      description: 'A blog for providing you with the best possible articles.',
      start_url: '/',
      display: 'standalone',
    //   background_color: '#fff',
    //   theme_color: '#fff',
      icons: [
        {
          src: '/favicon-32x32.png',
          sizes: '32x32',
          type: 'image/png',
        },
          {
          src: '/favicon-16x16.png',
          sizes: '16x16',
          type: 'image/png',
        },
            {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
            {
          src: '/android-chrome-512x512',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    }
  }