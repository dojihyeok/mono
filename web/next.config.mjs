/** @type {import('next').NextConfig} */
const nextConfig = {
  // 컨테이너 배포용 — 최소 standalone 번들(.next/standalone/server.js) 생성
  output: "standalone",
};

export default nextConfig;
