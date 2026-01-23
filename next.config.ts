import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-3d3b224ee6544903a80a5051e75e33a4.r2.dev',
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(md|sql)$/,
      use: 'raw-loader',
    });
    return config;
  },
};

export default nextConfig;
