'use client';

import { useEffect, useMemo, useState } from 'react';
import { track } from '@/lib/analytics';
import { JOB_TYPES, REGIONS } from '@/lib/constants';

// ─────────────────────────────────────────────
// MONO 마케팅 Analytics 웹(마케팅 Analytics 웹 개발 요청서 v1.0)
// 대상: mono.dojiung.com/analytics — 캠페인·검색·콘텐츠 유입자
// 역할: 공식 서비스 소개(=/service)·기업 영업 상세(=/partner)가 아님. 유입→전환에 집중.
// ─────────────────────────────────────────────

function slugify(v: string) {
  return encodeURIComponent(v);
}

export function AnalyticsHub() {
  const [referralName, setReferralName] = useState('');
  const [referralLink, setReferralLink] = useState<string | null>(null);

  useEffect(() => {
    track('campaign_landing_viewed', { landing: 'hub' });
  }, []);

  const jobLandings = useMemo(() => JOB_TYPES.filter((j) => j !== '기타'), []);

  const generateReferral = () => {
    if (typeof window === 'undefined') return;
    const base = `${window.location.origin}/mono`;
    const ref = referralName.trim() ? `?ref=${slugify(referralName.trim())}` : '';
    setReferralLink(`${base}${ref}`);
    track('referral_shared', { name: referralName.trim() || undefined });
  };

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: '#1e293b' }}>
      <header style={{ borderBottom: '1px solid #e2e8f0', padding: '14px 20px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 16, fontWeight: 950, color: '#0f172a' }}>MONO</span>
          <div style={{ display: 'flex', gap: 12, fontSize: 13, fontWeight: 700 }}>
            <a href="/service" style={{ color: '#4f46e5', textDecoration: 'none' }}>서비스 소개</a>
            <a href="/partner" style={{ color: '#4f46e5', textDecoration: 'none' }}>기업용 MONO</a>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(180deg, #eef2ff 0%, #ffffff 100%)', padding: '48px 20px 40px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 12.5, fontWeight: 850, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>MONO 캠페인 허브</div>
          <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.35, wordBreak: 'keep-all' }}>
            내 직종·지역에 맞는 현장 공고, MONO에서 바로 확인하세요
          </h1>
          <p style={{ fontSize: 14.5, color: '#475569', fontWeight: 600, lineHeight: 1.65, margin: '14px auto 0', maxWidth: 560, wordBreak: 'keep-all' }}>
            경력·자격 프로필을 만들고 급구 공고에 지원해보세요. 공식 서비스 소개는{' '}
            <a href="/service" style={{ color: '#4f46e5' }}>/service</a>, 기업 담당자는{' '}
            <a href="/partner" style={{ color: '#4f46e5' }}>/partner</a>를 확인해주세요.
          </p>
          <div style={{ marginTop: 24 }}>
            <a
              href="/mono"
              onClick={() => track('marketing_cta_clicked', { source: 'hub_hero' })}
              style={{ padding: '13px 28px', background: '#4f46e5', color: '#fff', borderRadius: 12, fontSize: 14.5, fontWeight: 900, textDecoration: 'none' }}
            >
              MONO 시작하기
            </a>
          </div>
        </div>
      </section>

      {/* ── 직종별 랜딩 ── */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ fontSize: 12.5, fontWeight: 850, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>직종별 랜딩</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
          {jobLandings.map((j) => (
            <a
              key={j}
              href={`/analytics/jobs/${slugify(j)}`}
              onClick={() => track('marketing_cta_clicked', { source: 'hub_job_grid', job: j })}
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 12px', textAlign: 'center', fontSize: 13.5, fontWeight: 800, color: '#0f172a', textDecoration: 'none' }}
            >
              {j} 기술자 공고
            </a>
          ))}
        </div>
      </section>

      {/* ── 지역별 랜딩 ── */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 20px 40px' }}>
        <div style={{ fontSize: 12.5, fontWeight: 850, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>지역별 랜딩</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
          {REGIONS.map((r) => (
            <a
              key={r}
              href={`/analytics/region/${slugify(r)}`}
              onClick={() => track('marketing_cta_clicked', { source: 'hub_region_grid', region: r })}
              style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 12, padding: '14px 12px', textAlign: 'center', fontSize: 13.5, fontWeight: 800, color: '#3730a3', textDecoration: 'none' }}
            >
              {r} 현장 공고
            </a>
          ))}
        </div>
      </section>

      {/* ── 기업 대상 랜딩 ── */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 20px 40px' }}>
        <div style={{ fontSize: 12.5, fontWeight: 850, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>기업 대상</div>
        <p style={{ fontSize: 13, color: '#64748b', fontWeight: 650, margin: '0 0 14px 0' }}>급구 공고·검증 프로필·Workspace·Field Pass PoC 등 기업 상세는 /partner에서 확인할 수 있습니다.</p>
        <a
          href="/partner"
          onClick={() => track('marketing_cta_clicked', { source: 'hub_enterprise' })}
          style={{ fontSize: 13.5, fontWeight: 800, color: '#4f46e5', textDecoration: 'none' }}
        >
          기업용 MONO 보기 →
        </a>
      </section>

      {/* ── 추천인 공유 ── */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 20px 48px' }}>
        <div style={{ fontSize: 12.5, fontWeight: 850, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>추천인·이벤트</div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <input
            value={referralName}
            onChange={(e) => setReferralName(e.target.value)}
            placeholder="추천인 이름(선택)"
            style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 10, fontSize: 13.5, flex: '1 1 200px' }}
          />
          <button
            onClick={generateReferral}
            style={{ padding: '10px 18px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13.5, fontWeight: 800, cursor: 'pointer' }}
          >
            추천 링크 만들기
          </button>
          {referralLink && (
            <div style={{ width: '100%', fontSize: 12.5, color: '#334155', fontWeight: 650, wordBreak: 'break-all', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px' }}>
              {referralLink}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
