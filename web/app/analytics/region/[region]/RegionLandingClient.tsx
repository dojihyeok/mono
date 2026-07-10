'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

export function RegionLandingClient({ region }: { region: string }) {
  useEffect(() => {
    track('campaign_landing_viewed', { landing: 'region', region });
  }, [region]);

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: '#1e293b' }}>
      <header style={{ borderBottom: '1px solid #e2e8f0', padding: '14px 20px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <a href="/analytics" style={{ fontSize: 14, fontWeight: 800, color: '#4f46e5', textDecoration: 'none' }}>← MONO 캠페인 허브</a>
        </div>
      </header>
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '56px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 12.5, fontWeight: 850, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          {region} 현장 전용
        </div>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.35, wordBreak: 'keep-all' }}>
          {region} 지역 급구 현장 공고,<br />지금 바로 확인하세요
        </h1>
        <p style={{ fontSize: 15, color: '#475569', fontWeight: 600, lineHeight: 1.65, margin: '18px auto 0', maxWidth: 520, wordBreak: 'keep-all' }}>
          {region} 지역 현장의 급구 공고를 프로필 조건에 맞춰 안내받고, 바로 지원할 수 있습니다.
        </p>
        <div style={{ marginTop: 28 }}>
          <a
            href="/mono"
            onClick={() => track('marketing_cta_clicked', { source: 'region_landing', region })}
            style={{ padding: '14px 30px', background: '#4f46e5', color: '#fff', borderRadius: 12, fontSize: 15, fontWeight: 900, textDecoration: 'none' }}
          >
            {region} 공고 보러가기
          </a>
        </div>
      </section>
    </div>
  );
}
