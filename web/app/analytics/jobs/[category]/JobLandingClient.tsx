'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

export function JobLandingClient({ category }: { category: string }) {
  useEffect(() => {
    track('campaign_landing_viewed', { landing: 'job_category', category });
  }, [category]);

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: '#1e293b' }}>
      <header style={{ borderBottom: '1px solid #e2e8f0', padding: '14px 20px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <a href="/analytics" style={{ fontSize: 14, fontWeight: 800, color: '#4f46e5', textDecoration: 'none' }}>← MONO 캠페인 허브</a>
        </div>
      </header>
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '56px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 12.5, fontWeight: 850, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          {category} 기술자 전용
        </div>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.35, wordBreak: 'keep-all' }}>
          {category} 경력을 프로필로 만들고,<br />맞는 현장 공고에 바로 지원하세요
        </h1>
        <p style={{ fontSize: 15, color: '#475569', fontWeight: 600, lineHeight: 1.65, margin: '18px auto 0', maxWidth: 520, wordBreak: 'keep-all' }}>
          {category} 경력·자격·교육 이력을 등록하면, MONO가 조건에 맞는 급구 공고와 현장을 안내합니다.
        </p>
        <div style={{ marginTop: 28 }}>
          <a
            href="/mono"
            onClick={() => track('marketing_cta_clicked', { source: 'job_landing', category })}
            style={{ padding: '14px 30px', background: '#4f46e5', color: '#fff', borderRadius: 12, fontSize: 15, fontWeight: 900, textDecoration: 'none' }}
          >
            {category} 프로필 만들기
          </a>
        </div>
      </section>
    </div>
  );
}
