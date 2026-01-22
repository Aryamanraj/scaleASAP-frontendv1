import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force webpack mode to avoid Turbopack issues with .md and .sql files
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(md|sql)$/,
      use: 'raw-loader',
    });
    return config;
  },
};

export default nextConfig;
