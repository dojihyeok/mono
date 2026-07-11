'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

// ─────────────────────────────────────────────
// MONO 비공개 데이터룸 — 투자자·심사역·기술 파트너 전용
// Founder–Market Fit / Team Readiness: /bm v1.1에서 이관된 실제 검증 콘텐츠(재작성 없음)
// TIPS·재무 섹션: 실제 자료 확보 전까지 "입력 필요" 상태로 비워둠(가공 금지)
// ─────────────────────────────────────────────

function PendingCard({ title, fields }: { title: string; fields: string[] }) {
  return (
    <div style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: 16, padding: 22 }}>
      <div style={{ fontSize: 15, fontWeight: 900, color: '#334155', marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {fields.map((f) => (
          <div key={f} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 650, color: '#64748b' }}>
            <span>{f}</span>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#94a3b8', background: '#f1f5f9', padding: '2px 8px', borderRadius: 6 }}>입력 필요</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DataroomClient() {
  useEffect(() => {
    track('dataroom_page_viewed', {});
  }, []);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      {/* ── Header ── */}
      <header style={{ background: '#0b1224', padding: '16px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 950, color: '#fff' }}>MONO Data Room</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#a5b4fc', background: 'rgba(129,140,248,0.15)', padding: '3px 10px', borderRadius: 999, border: '1px solid rgba(129,140,248,0.3)' }}>
              비공개 · 투자자 전용
            </span>
          </div>
          <button
            onClick={() => { fetch('/api/dataroom/logout', { method: 'POST' }).then(() => { window.location.href = '/dataroom/login'; }); }}
            style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, fontSize: 12.5, fontWeight: 700, color: '#cbd5e1', cursor: 'pointer' }}
          >
            로그아웃
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 64px' }}>
        {/* ── Founder–Market Fit (실제 콘텐츠, /bm v1.1에서 그대로 이관) ── */}
        <section
          style={{ background: '#ffffff', border: '2px solid #cbd5e1', borderRadius: 16, padding: 28, marginBottom: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
          onMouseEnter={() => track('dataroom_founder_profile_clicked', { trigger: 'section_view' })}
        >
          <div style={{ fontSize: 13, fontWeight: 850, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Founder–Market Fit
          </div>
          <p style={{ fontSize: 14, color: '#1e293b', fontWeight: 700, lineHeight: 1.7, margin: '0 0 18px 0', wordBreak: 'keep-all', maxWidth: 780 }}>
            MONO는 단순 인력중개 서비스가 아닙니다. 금융·핀테크·스타트업 환경에서 신원인증, 접근통제, 전자서명, 개인정보보호와 컴플라이언스를 설계한 대표자의 경험을 바탕으로 산업현장의 인력 신뢰 인프라를 구축합니다.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
            {['보안·인증·접근통제', '금융권·핀테크 보안', '대기업·규제기관 대응', '보안팀 빌딩', '개인정보·컴플라이언스', 'Zero Trust·감사로그 설계'].map((c) => (
              <span key={c} style={{ fontSize: 12, fontWeight: 800, color: '#4338ca', background: '#eef2ff', padding: '5px 12px', borderRadius: 999, border: '1px solid #c7d2fe' }}>{c}</span>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <a
              href="https://dojiung.com/security"
              target="_blank" rel="noopener noreferrer"
              onClick={() => track('dataroom_founder_profile_clicked', { link: 'security' })}
              style={{ fontSize: 13, fontWeight: 800, color: '#4f46e5', textDecoration: 'none', border: '1px solid #c7d2fe', padding: '8px 16px', borderRadius: 10 }}
            >
              대표 이력 보기 ↗
            </a>
            <a
              href="https://dojiung.com/creator/"
              target="_blank" rel="noopener noreferrer"
              onClick={() => track('dataroom_founder_profile_clicked', { link: 'trive_team' })}
              style={{ fontSize: 13, fontWeight: 800, color: '#4f46e5', textDecoration: 'none', border: '1px solid #c7d2fe', padding: '8px 16px', borderRadius: 10 }}
            >
              T-rive Team 보기 ↗
            </a>
          </div>
        </section>

        {/* ── Team Readiness (실제 콘텐츠, /bm v1.1에서 그대로 이관) ── */}
        <section
          style={{ background: '#ffffff', border: '2px solid #cbd5e1', borderRadius: 16, padding: 28, marginBottom: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
          onMouseEnter={() => track('dataroom_team_readiness_viewed', {})}
        >
          <div style={{ fontSize: 13, fontWeight: 850, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Team Readiness
          </div>
          <p style={{ fontSize: 13, color: '#64748b', fontWeight: 650, margin: '0 0 16px 0', lineHeight: 1.55, wordBreak: 'keep-all' }}>
            아직 합류하지 않은 후보는 현재 팀원처럼 표현하지 않습니다. 대표의 네트워크(금융·핀테크 업계 포함) 기반 핵심 인재 채용 가능성을 채용 파이프라인으로 표시하며, 실제 합류 후 이름·소속을 공개합니다.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
            {[
              { role: 'Founder / CEO', status: 'CONFIRMED', statusColor: '#166534', statusBg: '#f0fdf4', condition: '전업 전환', mission: 'PoC·투자·대기업 영업' },
              { role: 'Platform Lead / CTO', status: 'CONDITIONAL · PIPELINE', statusColor: '#b45309', statusBg: '#fffbeb', condition: 'TOP100 또는 투자 유치', mission: 'Field Pass 코어 개발' },
              { role: 'Product Lead', status: 'PIPELINE', statusColor: '#1d4ed8', statusBg: '#eff6ff', condition: '투자 유치', mission: '앱·Workspace UX' },
              { role: 'Domain Lead', status: 'ADVISOR · PIPELINE', statusColor: '#1d4ed8', statusBg: '#eff6ff', condition: 'PoC 진행', mission: '현장 실증' },
              { role: 'Authentication Partner', status: 'TECH REVIEW', statusColor: '#9333ea', statusBg: '#faf5ff', condition: '협력 합의(센스톤)', mission: '인증 PoC' },
            ].map((m) => (
              <div key={m.role} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>{m.role}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 900, color: m.statusColor, background: m.statusBg, padding: '3px 9px', borderRadius: 6, whiteSpace: 'nowrap' }}>{m.status}</span>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 650 }}>합류 조건: <strong style={{ color: '#334155' }}>{m.condition}</strong></div>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 650, marginTop: 2 }}>90일 미션: <strong style={{ color: '#334155' }}>{m.mission}</strong></div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TIPS 지원 현황 (실제 자료 확보 전까지 비움) ── */}
        <section style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 850, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            TIPS 지원 현황
          </div>
          <PendingCard
            title="TIPS 프로그램"
            fields={['지원 단계', '주관 운영사', '목표 투자유치액', '매칭 투자사', '심사 일정', '자금 사용 계획']}
          />
        </section>

        {/* ── 재무 요약 · Cap Table (실제 자료 확보 전까지 비움) ── */}
        <section style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 850, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            재무 요약 · Cap Table
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            <PendingCard title="재무 요약" fields={['누적 투자유치액', '월 소진율(Burn Rate)', '런웨이', '전환 매출(있는 경우)']} />
            <PendingCard title="Cap Table" fields={['설립자 지분', '투자자 지분', 'ESOP(스톡옵션 풀)', '최근 라운드 밸류에이션']} />
          </div>
        </section>

        {/* ── 자료 요청 CTA ── */}
        <section style={{ background: '#0b1224', borderRadius: 20, padding: '32px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 950, color: '#fff', marginBottom: 8 }}>추가 자료가 필요하신가요</div>
          <p style={{ fontSize: 13, color: 'rgba(226,232,240,0.8)', fontWeight: 600, margin: '0 auto 20px', maxWidth: 460, wordBreak: 'keep-all' }}>
            투자계약서, 재무제표, TIPS 지원서류 등 추가 실사 자료는 아래 연락처로 요청해주세요.
          </p>
          <a
            href="mailto:yunhyeok@t-rive.com?subject=MONO%20Data%20Room%20자료%20요청"
            onClick={() => track('dataroom_document_requested', {})}
            style={{ display: 'inline-block', padding: '12px 26px', background: '#ffffff', color: '#0b1224', borderRadius: 12, fontSize: 14, fontWeight: 900, textDecoration: 'none' }}
          >
            자료 요청하기
          </a>
        </section>
      </main>
    </div>
  );
}
