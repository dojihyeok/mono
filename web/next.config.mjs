/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/analys',
        destination: '/analys.html',
      },
      {
        source: '/amono',
        destination: '/amono.html',
      },
      {
        source: '/partner',
        destination: '/partner.html',
      },
      {
        source: '/strategy',
        destination: '/strategy.html',
      },
    ];
  },
};

export default nextConfig;
