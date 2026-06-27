/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  i18n: {
    locales: ['en', 'zh', 'ja'],
    defaultLocale: 'en',
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverActions: true,
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com https://pagead2.googlesyndication.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https: https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net",
              "connect-src 'self' https: https://pagead2.googlesyndication.com",
              "frame-src 'self' https://challenges.cloudflare.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
      {
        source: '/games',
        destination: '/en/games',
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: '/en/dashboard',
        permanent: false,
      },
      {
        source: '/profile',
        destination: '/en/profile',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
