'use client';

import { useEffect } from 'react';

// iframe 방식은 모바일(iOS Safari)에서 스크롤이 근본적으로 불가능한 문제가 있음.
// /pitch.html로 직접 리다이렉트하여 네이티브 브라우저 스크롤을 활용합니다.
export default function StrategyPage() {
  useEffect(() => {
    window.location.replace('/pitch.html');
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F4EFE6',
        color: '#0A0F1F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "Pretendard, 'Noto Sans KR', system-ui, -apple-system, sans-serif",
        letterSpacing: '-0.01em',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 18px',
            background: '#0A0F1F',
            color: '#67E8F9',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#67E8F9',
              boxShadow: '0 0 12px #67E8F9',
            }}
          />
          MoNo · 이동 중
        </div>
        <div style={{ marginTop: 18, fontSize: 14, color: '#5B6172' }}>
          현장의 땀방울이 데이터가 되는 미래로 이동 중…
        </div>
      </div>
    </div>
  );
}
