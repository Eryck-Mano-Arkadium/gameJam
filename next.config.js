// next.config.js (CommonJS)
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  const config = {
    experimental: { typedRoutes: true },
    // Only use static export in production, not in development
    ...(isDev ? {} : { output: 'export' }),
    // Use relative asset URLs for static export (prod). In dev, default is fine.
    assetPrefix: isDev ? undefined : './',
    trailingSlash: true,
    images: { unoptimized: true },
  };

  // Important: wrap your config with the plugin
  return withVanillaExtract(config);
};