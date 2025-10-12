import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';
import path from 'path';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
    removeConsole: false,
  },
  serverExternalPackages: ['reflect-metadata', 'inversify'],
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    config.resolve.alias['@public'] = path.join(__dirname, 'public');
    return config;
  },
};

export default bundleAnalyzer(nextConfig);
