import { useEffect } from "react";

/**
 * MoNo 6막 통합 전략서 — 정적 HTML 페이지(/pitch.html)로 즉시 위임.
 * React/Tailwind 빌드 파이프라인을 우회하여 디자인 토큰을 1픽셀 어긋남 없이 그대로 게시.
 */
export default function Home() {
  useEffect(() => {
    // 정적 HTML로 하드 리다이렉트 — 페이지 진입 즉시 1회만 실행
    window.location.replace("/pitch.html");
  }, []);

  // 리다이렉트 직전 짧은 순간 노출되는 로딩 스크린
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4EFE6",
        color: "#0A0F1F",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          "Pretendard, 'Noto Sans KR', system-ui, -apple-system, sans-serif",
        letterSpacing: "-0.01em",
      }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 18px",
            background: "#0A0F1F",
            color: "#67E8F9",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#67E8F9",
              boxShadow: "0 0 12px #67E8F9",
            }}
          />
          MoNo · Tech-Blue Loading
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 14,
            color: "#5B6172",
          }}>
          현장의 땀방울이 데이터가 되는 미래로 이동 중…
        </div>
      </div>
    </div>
  );
}
