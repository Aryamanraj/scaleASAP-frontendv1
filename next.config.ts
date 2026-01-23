import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/s2/favicons/**',
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
