// next.config.mjs

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@trpc/server'],

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: process.env.NODE_ENV === 'production',

  // ✅ Replaces the webpack() block — Turbopack is the default in Next.js 16
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;