// next.config.js
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');

const withVE = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  // Host at domain root on Vercel; no basePath/assetPrefix/export.
  return withVE({
    experimental: { typedRoutes: true },
    images: { unoptimized: true },
  });
};