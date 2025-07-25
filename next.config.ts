import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';
import path from 'path';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  swcMinify: false, // Disable SWC minification to avoid issues with decorators
  compiler: {
    // SWC options
    styledComponents: true,
    removeConsole: false,
  },
  experimental: {
    swcPlugins: [],
    serverComponentsExternalPackages: ['reflect-metadata', 'inversify'],
  },
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: '*',
      },
    ],
    domains: ['firebasestorage.googleapis.com'],
  },

  //----Configurations for the PDF viewer
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    // Explicitly add alias for ~
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    config.resolve.alias['@public'] = path.join(__dirname, 'public');
    return config;
  },
  //----End Configurations for the PDF viewer
};

// Wrap nextConfig with bundleAnalyzer, then withSentryConfig
const configWithAnalyzer = bundleAnalyzer(nextConfig);

export default withSentryConfig(configWithAnalyzer, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: 'hopper-ga',
  project: 'javascript-nextjs',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
