/** @type {import('next').NextConfig} */
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  return {
    experimental: { typedRoutes: true },
    output: 'export',
    // Use relative assets only for static export (prod). In dev, use default for correctness.
    assetPrefix: isDev ? undefined : './',
    trailingSlash: true,
    images: {
      unoptimized: true
    }
  };
};