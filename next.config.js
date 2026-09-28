/** @type {import('next').NextConfig} */
const { redirects } = require('./lib/redirects.js');

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp']
  },
  trailingSlash: false,
  async redirects() {
    return redirects();
  },
  async headers() {
    return [
      {
        source: '/favicon.ico',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }]
      },
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
      },
      {
        source: '/images/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }]
      },
      {
        source: '/(.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|woff2|woff))',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }]
      }
    ];
  }
};

module.exports = nextConfig;
