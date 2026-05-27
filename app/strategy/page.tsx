'use client';

import React, { useState, useEffect } from 'react';

export default function StrategyPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F4EFE6",
          color: "#0A0F1F",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Pretendard, 'Noto Sans KR', system-ui, -apple-system, sans-serif",
          letterSpacing: "-0.01em",
        }}
      >
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
            }}
          >
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
            }}
          >
            현장의 땀방울이 데이터가 되는 미래로 이동 중…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <iframe
        src="/pitch.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
        }}
        title="MoNo 6막 통합 전략서"
      />
    </div>
  );
}
