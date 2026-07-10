'use client';

import { useEffect, useState } from 'react';

interface FunnelStep { label: string; count: number; }
interface Summary {
  overview?: { visitors: number; signups: number; profilesCompleted: number; companies: number; pocInterest: number };
  funnels?: { signup: FunnelStep[]; profile: FunnelStep[]; company: FunnelStep[] };
}

function FunnelCard({ title, steps }: { title: string; steps: FunnelStep[] }) {
  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: 18 }}>
      <div style={{ fontSize: 13.5, fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {steps.map((s) => (
          <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 650, color: '#475569' }}>
            <span>{s.label}</span>
            <span style={{ color: '#0f172a', fontWeight: 900 }}>{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConversionDashboardClient() {
  const [data, setData] = useState<Summary | null>(null);

  useEffect(() => {
    fetch('/api/analytics/summary', { cache: 'no-store' })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({}));
  }, []);

  const notYet = '측정 준비 중';

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '32px 20px', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ fontSize: 12.5, fontWeight: 850, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Internal — noindex</div>
        <h1 style={{ fontSize: 22, fontWeight: 950, color: '#0f172a', margin: '0 0 20px 0' }}>Conversion Dashboard</h1>

        {!data ? (
          <div style={{ fontSize: 13, color: '#94a3b8' }}>불러오는 중…</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
              {[
                ['방문', data.overview?.visitors],
                ['가입 완료', data.overview?.signups],
                ['프로필 완성', data.overview?.profilesCompleted],
                ['기업 리드', data.overview?.companies],
                ['PoC 문의', data.overview?.pocInterest],
              ].map(([label, value]) => (
                <div key={label as string} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 800 }}>{label as string}</div>
                  <div style={{ fontSize: 22, fontWeight: 950, color: '#0f172a' }}>{value ?? notYet}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
              {data.funnels?.signup && <FunnelCard title="가입 전환율" steps={data.funnels.signup} />}
              {data.funnels?.profile && <FunnelCard title="프로필 완성률" steps={data.funnels.profile} />}
              {data.funnels?.company && <FunnelCard title="기업 리드 전환" steps={data.funnels.company} />}
            </div>

            <div style={{ background: '#fff', border: '1px dashed #cbd5e1', borderRadius: 12, padding: 16, fontSize: 12.5, color: '#94a3b8', fontWeight: 650 }}>
              채널별 유입·CPC·CPA·캠페인별 매출·추천 전환율은 실제 광고 캠페인 집행 후 연결 예정입니다 ({notYet}).
            </div>
          </>
        )}
      </div>
    </div>
  );
}
