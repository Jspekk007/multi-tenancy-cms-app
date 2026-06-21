import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
  productionBrowserSourceMaps: process.env.NODE_ENV === 'production',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    const scriptSrc = isDev ? "'self' 'unsafe-inline' 'unsafe-eval'" : "'self' 'unsafe-inline'";

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; img-src 'self' data: https://res.cloudinary.com; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' http://localhost:4000`,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
        ],
      },
    ];
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
