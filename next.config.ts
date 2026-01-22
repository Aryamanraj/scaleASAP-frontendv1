import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config, { isServer }) => {
    // Ignore .md and .sql files from webpack bundling
    config.module.rules.push({
      test: /\.(md|sql)$/,
      use: 'raw-loader',
    });
    return config;
  },
};

export default nextConfig;
