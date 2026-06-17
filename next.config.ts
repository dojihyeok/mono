import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/settlement',
        destination: '/wallet',
        permanent: true,
      },
      {
        source: '/career',
        destination: '/myinfo',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
