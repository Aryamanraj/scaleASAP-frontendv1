import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Ignore .md and .sql files from webpack bundling
    config.module.rules.push({
      test: /\.(md|sql)$/,
      type: 'asset/source',
    });
    return config;
  },
  turbo: {
    rules: {
      '*.md': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
      '*.sql': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
