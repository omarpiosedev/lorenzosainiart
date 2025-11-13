import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';
import './src/lib/env';

// Define the base Next.js configuration
const baseConfig: NextConfig = {
  // MIGRATED: Removed eslint config (moved to .eslintrc or eslint.config)
  // ESLint configuration is no longer supported in next.config.ts in Next.js 16
  poweredByHeader: false,
  reactStrictMode: true,
  // React Compiler v1.0 (Stable) - Automatic memoization and optimization
  // Eliminates need for manual useMemo, useCallback, React.memo
  reactCompiler: true,
  cacheComponents: true,
  // Performance optimizations - SWC minification is enabled by default in Next.js 15
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Image optimization for better performance
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF first for -50% size
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [65, 70, 75, 80, 85], // Support quality values used across the project
    minimumCacheTTL: 2678400, // 31 days (from default 4h) - reduces revalidation costs
    localPatterns: [
      {
        pathname: '/assets/images/**',
        search: '',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // Optimize bundle splitting for better performance
  experimental: {
    optimizePackageImports: ['gsap', '@gsap/react'], // Tree-shaking for GSAP
    // CSS optimization to reduce render blocking
    // optimizeCss: true, // Requires 'critters' dependency
    // cssChunking: 'strict',
  },
  // Modern browser support - reduces polyfills by 11.5KB
  // swcMinify: true, // Enabled by default in Next.js 15
  // Webpack optimizations for GSAP code splitting
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: 'all',
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          gsap: {
            test: /[\\/]node_modules[\\/](gsap|@gsap)[\\/]/,
            name: 'gsap',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
};

// Initialize the Next-Intl plugin
let configWithPlugins = createNextIntlPlugin('./src/lib/i18n/config.ts')(baseConfig);

// Conditionally enable bundle analysis
if (process.env.ANALYZE === 'true') {
  configWithPlugins = withBundleAnalyzer()(configWithPlugins);
}

const nextConfig = configWithPlugins;
export default nextConfig;
