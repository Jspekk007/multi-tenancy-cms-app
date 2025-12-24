// next.config.mjs

import { fileURLToPath } from 'url';
import path from 'path';

// Define __dirname for environment context (good practice for your file system ops)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ----------------------------------------------------
  // 1. CRITICAL FIX: Add transpilePackages for tRPC
  // This tells Next.js to process @trpc/server's dependencies,
  // resolving the 'unstable-core-do-not-import' error.
  // ----------------------------------------------------
  transpilePackages: ['@trpc/server'], 

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  },
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: process.env.NODE_ENV === 'production',

  webpack: (config, { isServer }) => {
    config.module.rules = config.module.rules.filter(
      (rule) =>
        !(rule.resourceQuery instanceof RegExp && rule.resourceQuery.source === 'raw'),
    );

    config.module.rules.push({
      test: /\.svg$/i,
      resourceQuery: /raw/,
      type: 'asset/source',
    });

    return config;
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