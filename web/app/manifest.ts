import type { MetadataRoute } from "next";

// 웹 앱 매니페스트 — 홈화면 추가/standalone 실행(웹+앱 하이브리드)을 지원합니다.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MONO",
    short_name: "MONO",
    description: "현장 전문가를 위한 핀테크 & 경력 관리 슈퍼앱",
    lang: "ko",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
