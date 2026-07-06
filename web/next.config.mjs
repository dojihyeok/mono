/** @type {import('next').NextConfig} */
const nextConfig = {
// output: "standalone",
  async rewrites() {
    return [
      {
        source: '/strategy',
        destination: '/strategy.html',
      },
    ]
  },
};

export default nextConfig;
