import withBundleAnalyzer from '@next/bundle-analyzer';
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
        protocol: 'https',
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

// Wrap nextConfig with bundleAnalyzer
export default bundleAnalyzer(nextConfig);
