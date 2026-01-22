import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {}, // Acknowledge we're intentionally using webpack config
  webpack: (config) => {
    // Ignore .sql and .md files - they're not imported, just data files
    config.module.rules.push({
      test: /\.(sql|md)$/,
      type: 'asset/resource',
      generator: {
        emit: false,
      },
    });
    return config;
  },
};

export default nextConfig;
