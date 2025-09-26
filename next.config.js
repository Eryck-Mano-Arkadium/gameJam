/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: { typedRoutes: true },
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true
    }
  };
  module.exports = nextConfig;