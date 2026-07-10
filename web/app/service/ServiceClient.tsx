'use client';

import { useEffect, useState } from 'react';
import { track } from '@/lib/analytics';

// ─────────────────────────────────────────────
// MONO 서비스 소개 웹 (서비스 소개 웹 개발 요청서 v1.0)
// 대상: mono.dojiung.com/service — 신규 기술자·구직자, 심사위원·멘토, 일반 방문자, 기업 담당자
// 제외: BM 가격 가설·실험 결과, Unit Economics, 내부 KPI, 투자·TIPS, 조건부 합류 인력, 규제 증빙, 미확정 계약조건
// ─────────────────────────────────────────────

type StatusTag = 'live' | 'validating' | 'pilot' | 'roadmap';

interface StatusStyle { label: string; color: string; bg: string; border: string; }

const STATUS_BADGE: Record<StatusTag, StatusStyle> = {
  live: { label: 'LIVE', color: '#166534', bg: '#f0fdf4', border: '#bbf7d0' },
  validating: { label: 'VALIDATING', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
  pilot: { label: 'PILOT', color: '#0e7490', bg: '#ecfeff', border: '#a5f3fc' },
  roadmap: { label: 'ROADMAP', color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' },
};

function StatusBadge({ status }: { status: StatusTag }) {
  const s = STATUS_BADGE[status];
  return (
    <span style={{ fontSize: 10.5, fontWeight: 900, color: s.color, background: s.bg, border: `1px solid ${s.border}`, padding: '3px 9px', borderRadius: 6, letterSpacing: '0.02em', whiteSpace: 'nowrap', display: 'inline-block' }}>
      {s.label}
    </span>
  );
}

const FLOW_STEPS: { title: string; desc: string; status: StatusTag }[] = [
  { title: '프로필 생성', desc: '이름·연락처·주요 직종을 등록하고 MONO Profile을 시작합니다.', status: 'live' },
  { title: '경력·자격·교육 등록', desc: '현장 경력, 보유 자격증, 안전교육 이수 이력을 프로필에 채웁니다.', status: 'live' },
  { title: '현장 공고 탐색·지원', desc: '직종·지역·기간 조건에 맞는 공고를 찾아 지원합니다.', status: 'live' },
  { title: '기업과 연결', desc: '기업이 프로필을 확인하고 연락하거나, 지원 결과를 안내받습니다.', status: 'live' },
  { title: '출역·작업 기록', desc: '현장 출근·퇴근과 작업 내역을 기록합니다.', status: 'validating' },
  { title: '정산 보조·평가', desc: '근무 기록을 바탕으로 정산 참고자료를 만들고 상호 평가를 남깁니다.', status: 'pilot' },
  { title: '경력카드 반영', desc: '완료된 현장 이력이 경력카드에 누적되어 다음 지원에 활용됩니다.', status: 'validating' },
];

const WORKER_FEATURES = [
  { title: 'MONO Profile', desc: '경력·자격·교육 이력을 구조화된 프로필로 정리해 반복 제출 없이 어디서나 보여줍니다.', status: 'live' as StatusTag },
  { title: '현장 공고·급구 공고', desc: '직종·지역별 공고를 탐색하고, 급하게 인력이 필요한 현장의 공고에 빠르게 지원합니다.', status: 'live' as StatusTag },
  { title: 'AI 현장 가이드', desc: '현장 안전수칙과 작업 상식을 대화형으로 안내합니다.', status: 'validating' as StatusTag },
  { title: '출역·경력 연결', desc: '현장 출근 기록이 경력카드로 이어져 다음 현장 지원 시 신뢰도를 높입니다.', status: 'pilot' as StatusTag },
];

const ENTERPRISE_FEATURES = [
  { title: '급구 현장 공고', desc: '급한 인력 수요를 빠르게 노출하고 지원을 받습니다.' },
  { title: '검증 프로필·팀 검색', desc: '경력·자격·교육 이력이 정리된 기술자와 팀을 찾습니다.' },
  { title: 'Partner Workspace', desc: '현장·팀원 관리, 출역·정산 참고자료를 한 곳에서 확인합니다.' },
  { title: 'MONO Field Pass', desc: '현장 신원·자격·출입권한과 출역 기록을 연결합니다.' },
];

const TRUST_ITEMS = [
  '서비스 제공에 필요한 정보만 수집합니다.',
  '수집 목적과 보유기간을 명시합니다.',
  '기업과 기술자의 접근 권한을 분리합니다.',
  '중요 정보의 조회 이력을 관리합니다.',
  '위치정보는 관련 절차 완료 후 제공합니다.',
  '민감정보·생체정보는 기본적으로 사용하지 않습니다.',
];

const AVAILABILITY_ITEMS: { label: string; status: StatusTag }[] = [
  { label: 'MONO Profile · 경력/자격/교육 등록', status: 'live' },
  { label: '현장 공고·급구 공고 탐색·지원', status: 'live' },
  { label: 'AI 현장 가이드', status: 'validating' },
  { label: '출역 기록 · 경력카드 연동', status: 'pilot' },
  { label: 'Partner Workspace(기업용 통합 관리)', status: 'validating' },
  { label: 'MONO Field Pass(신원·출입 연동)', status: 'roadmap' },
];

const FAQS = [
  { q: 'MONO는 무료로 사용할 수 있나요?', a: '기술자는 프로필 생성, 공고 탐색·지원까지 무료로 이용할 수 있습니다. 기업용 기능과 요금은 /partner 페이지에서 별도로 안내합니다.' },
  { q: '제 개인정보는 어떻게 보호되나요?', a: '서비스 제공에 필요한 최소한의 정보만 수집하며, 기업과 기술자의 접근 권한을 분리해 관리합니다. 자세한 내용은 이 페이지의 "신뢰·보안·개인정보" 섹션을 참고하세요.' },
  { q: 'AI 현장 가이드가 법정 안전교육을 대체하나요?', a: '아니요. AI 현장 가이드는 현장 상식을 돕는 보조 도구이며, 법정 안전교육을 대체하지 않습니다.' },
  { q: 'MONO Field Pass는 지금 바로 도입할 수 있나요?', a: 'Field Pass는 현재 기술 검토·PoC 준비 단계입니다. 도입 문의는 /partner 페이지의 기업 문의 채널을 이용해주세요.' },
  { q: '기업 담당자인데 무엇을 먼저 보면 되나요?', a: '기업용 기능 요약을 확인한 뒤 /partner 페이지에서 급구 공고·Workspace·Field Pass 상세와 도입 방식을 확인하실 수 있습니다.' },
];

function Section({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 20px', scrollMarginTop: 64 }}>
      <div style={{ fontSize: 12.5, fontWeight: 850, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 950, color: '#0f172a', margin: '0 0 20px 0', letterSpacing: '-0.02em' }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ServiceClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    track('service_page_viewed', {});
  }, []);

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: '#1e293b', fontFamily: 'inherit' }}>
      {/* ── Header ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 16, fontWeight: 950, color: '#0f172a', letterSpacing: '-0.02em' }}>MONO</span>
          <a
            href="/partner"
            onClick={() => track('service_enterprise_cta_clicked', { source: 'header' })}
            style={{ fontSize: 13.5, fontWeight: 800, color: '#4f46e5', textDecoration: 'none', border: '1px solid #c7d2fe', padding: '8px 16px', borderRadius: 10 }}
          >
            기업용 MONO 보기
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(180deg, #eef2ff 0%, #ffffff 100%)', padding: '64px 20px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 42px)', fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-0.03em', lineHeight: 1.3, wordBreak: 'keep-all' }}>
            현장 기술자의 경력과 기회를 하나로 연결합니다
          </h1>
          <p style={{ fontSize: 16, color: '#475569', fontWeight: 600, lineHeight: 1.65, margin: '18px auto 0', maxWidth: 620, wordBreak: 'keep-all' }}>
            경력·자격·교육 이력을 프로필로 만들고, 현장 공고 탐색부터 출역 기록과 경력 반영까지 MONO에서 연결합니다.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 30 }}>
            <a
              href="/mono"
              onClick={() => track('service_primary_cta_clicked', { source: 'hero' })}
              style={{ padding: '14px 28px', background: '#4f46e5', color: '#ffffff', borderRadius: 12, fontSize: 15, fontWeight: 900, textDecoration: 'none', boxShadow: '0 8px 20px rgba(79,70,229,0.25)' }}
            >
              MONO 시작하기
            </a>
            <a
              href="/partner"
              onClick={() => track('service_enterprise_cta_clicked', { source: 'hero' })}
              style={{ padding: '14px 28px', background: '#ffffff', color: '#4f46e5', border: '1.5px solid #c7d2fe', borderRadius: 12, fontSize: 15, fontWeight: 800, textDecoration: 'none' }}
            >
              기업용 MONO 보기
            </a>
            <a
              href="#flow"
              style={{ padding: '14px 22px', background: 'transparent', color: '#64748b', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}
            >
              서비스 이용 흐름 보기 ↓
            </a>
          </div>
        </div>
      </section>

      {/* ── 현장의 문제 ── */}
      <Section eyebrow="Problem" title="현장의 문제">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#4f46e5', marginBottom: 12 }}>기술자</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: '#334155', lineHeight: 1.8, fontWeight: 600 }}>
              <li>경력과 실력을 증명하기 어렵다.</li>
              <li>현장마다 서류와 정보를 반복 제출한다.</li>
              <li>출근 기록이 공식 경력으로 연결되지 않는다.</li>
              <li>필요한 공고와 현장 정보를 찾기 어렵다.</li>
            </ul>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#4f46e5', marginBottom: 12 }}>기업</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: '#334155', lineHeight: 1.8, fontWeight: 600 }}>
              <li>기술자의 실제 경험과 자격을 확인하기 어렵다.</li>
              <li>급한 인력 수요를 빠르게 채우기 어렵다.</li>
              <li>출역·정산·평가 정보가 여러 도구에 분산돼 있다.</li>
              <li>현장별 준비상태와 권한 관리가 반복된다.</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ── MONO가 해결하는 방식 ── */}
      <Section eyebrow="Solution" title="MONO가 해결하는 방식">
        <p style={{ fontSize: 15, color: '#334155', fontWeight: 650, lineHeight: 1.75, margin: 0, wordBreak: 'keep-all', maxWidth: 760 }}>
          MONO는 기술자의 경력·자격·교육 이력을 검증 가능한 프로필로 만들고, 이 프로필을 현장 공고 탐색·지원·출역·정산·경력관리까지 하나의 흐름으로 연결합니다.
          기업은 검증된 프로필과 팀 데이터를 바탕으로 더 빠르고 신뢰할 수 있는 채용·현장 운영을 할 수 있습니다.
        </p>
      </Section>

      {/* ── 기술자용 기능 ── */}
      <Section eyebrow="For Workers" title="기술자용 주요 기능">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14 }}>
          {WORKER_FEATURES.map((f) => (
            <div key={f.title} style={{ border: '1.5px solid #e2e8f0', borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 15, fontWeight: 900, color: '#0f172a' }}>{f.title}</span>
                <StatusBadge status={f.status} />
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b', fontWeight: 600, lineHeight: 1.55, wordBreak: 'keep-all' }}>{f.desc}</p>
              {f.title === 'AI 현장 가이드' && (
                <div style={{ fontSize: 11.5, color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '6px 10px', fontWeight: 700 }}>
                  ⚠️ 법정 안전교육을 대체하지 않습니다.
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ── 기업용 기능 요약 ── */}
      <Section eyebrow="For Enterprise" title="기업용 기능 요약">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14, marginBottom: 20 }}>
          {ENTERPRISE_FEATURES.map((f) => (
            <div key={f.title} style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#3730a3', marginBottom: 6 }}>{f.title}</div>
              <p style={{ margin: 0, fontSize: 13, color: '#4338ca', fontWeight: 600, lineHeight: 1.55, wordBreak: 'keep-all' }}>{f.desc}</p>
            </div>
          ))}
        </div>
        <a
          href="/partner"
          onClick={() => track('service_enterprise_cta_clicked', { source: 'enterprise_summary' })}
          style={{ fontSize: 14, fontWeight: 800, color: '#4f46e5', textDecoration: 'none' }}
        >
          기업용 기능 자세히 보기 →
        </a>
      </Section>

      {/* ── 서비스 이용 흐름 ── */}
      <Section id="flow" eyebrow="Journey" title="서비스 이용 흐름">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FLOW_STEPS.map((s, idx) => (
            <div key={s.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px' }}>
              <span style={{ fontSize: 12, fontWeight: 950, color: '#ffffff', background: '#4f46e5', width: 24, height: 24, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                {idx + 1}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14.5, fontWeight: 900, color: '#0f172a' }}>{s.title}</span>
                  <StatusBadge status={s.status} />
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#64748b', fontWeight: 600, lineHeight: 1.5, wordBreak: 'keep-all' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 검증 프로필 ── */}
      <Section eyebrow="Trust Data" title="검증 프로필">
        <p style={{ fontSize: 15, color: '#334155', fontWeight: 650, lineHeight: 1.75, margin: 0, wordBreak: 'keep-all', maxWidth: 760 }}>
          경력·자격·안전교육 이수 이력을 구조화된 프로필로 정리합니다. 기업은 이 프로필을 통해 후보의 실제 경험과 자격을 더 빠르고 신뢰성 있게 확인할 수 있습니다.
        </p>
      </Section>

      {/* ── Partner Workspace 요약 ── */}
      <Section eyebrow="Enterprise Tool" title="Partner Workspace 요약">
        <p style={{ fontSize: 15, color: '#334155', fontWeight: 650, lineHeight: 1.75, margin: '0 0 16px 0', wordBreak: 'keep-all', maxWidth: 760 }}>
          매칭된 기술자와 팀의 현장 배정, 출역·공수, 정산 참고자료, 평가·재요청을 한 곳에서 관리하는 기업용 도구입니다.
        </p>
        <a href="/partner" onClick={() => track('service_enterprise_cta_clicked', { source: 'workspace_summary' })} style={{ fontSize: 14, fontWeight: 800, color: '#4f46e5', textDecoration: 'none' }}>
          Partner Workspace 자세히 보기 →
        </a>
      </Section>

      {/* ── MONO Field Pass 개요 ── */}
      <Section eyebrow="Trust Infrastructure" title="MONO Field Pass 개요">
        <div style={{ background: '#0f172a', borderRadius: 18, padding: 24 }}>
          <p style={{ fontSize: 14, color: '#cbd5e1', fontWeight: 600, lineHeight: 1.7, margin: '0 0 18px 0', wordBreak: 'keep-all', maxWidth: 720 }}>
            MONO Field Pass는 현장 투입에 필요한 신원, 자격, 교육, 출입권한과 출역 기록을 연결합니다. 출입 기록을 근태·정산·경력 데이터로 이어갈 수 있도록 설계합니다.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {[
              ['QR', 'validating' as StatusTag],
              ['NFC·카드', 'roadmap' as StatusTag],
              ['OTAC', 'roadmap' as StatusTag],
            ].map(([label, status]) => (
              <div key={label as string} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 700 }}>{label as string}</span>
                <StatusBadge status={status as StatusTag} />
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>협력사 이름은 공개 동의 이후에만 표시합니다.</div>
          <a
            href="/partner"
            onClick={() => track('service_field_pass_clicked', { source: 'overview' })}
            style={{ display: 'inline-block', marginTop: 16, fontSize: 13.5, fontWeight: 800, color: '#ffffff', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '9px 18px', textDecoration: 'none' }}
          >
            Field Pass 자세히 보기 →
          </a>
        </div>
      </Section>

      {/* ── 신뢰·보안·개인정보 ── */}
      <Section eyebrow="Trust & Privacy" title="신뢰·보안·개인정보">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
          {TRUST_ITEMS.map((t) => (
            <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13.5, color: '#334155', fontWeight: 650, lineHeight: 1.5 }}>
              <span style={{ color: '#4f46e5' }}>✓</span>
              <span style={{ wordBreak: 'keep-all' }}>{t}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 제공 중 / 준비 중 기능 ── */}
      <Section eyebrow="Availability" title="제공 중 / 준비 중 기능">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 18, fontSize: 12.5, fontWeight: 700, color: '#64748b' }}>
          <span><StatusBadge status="live" /> 지금 이용 가능</span>
          <span><StatusBadge status="validating" /> 검증 중</span>
          <span><StatusBadge status="pilot" /> 파일럿 운영 중</span>
          <span><StatusBadge status="roadmap" /> 준비 중</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {AVAILABILITY_ITEMS.map((item) => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>{item.label}</span>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      </Section>

      {/* ── FAQ ── */}
      <Section eyebrow="FAQ" title="자주 묻는 질문">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FAQS.map((f, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={f.q} style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                <button
                  onClick={() => { const next = isOpen ? null : idx; setOpenFaq(next); if (next !== null) track('service_faq_opened', { question: f.q }); }}
                  style={{ width: '100%', textAlign: 'left', padding: '14px 16px', background: isOpen ? '#f8fafc' : '#ffffff', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, fontWeight: 800, color: '#0f172a' }}
                >
                  <span>{f.q}</span>
                  <span style={{ color: '#94a3b8' }}>{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 16px 16px 16px', fontSize: 13.5, color: '#64748b', fontWeight: 600, lineHeight: 1.65, wordBreak: 'keep-all' }}>
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── CTA ── */}
      <section style={{ padding: '20px 20px 72px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', background: 'linear-gradient(135deg, #4f46e5, #3730a3)', borderRadius: 20, padding: '40px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 950, color: '#ffffff', marginBottom: 10 }}>지금 MONO를 시작해보세요</div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: 600, margin: '0 auto 24px', maxWidth: 480, wordBreak: 'keep-all' }}>
            경력·자격 프로필을 만들고 현장 공고를 탐색하거나, 기업 담당자라면 급구 공고·검증 프로필을 확인해보세요.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
            <a
              href="/mono"
              onClick={() => track('service_primary_cta_clicked', { source: 'footer_cta' })}
              style={{ padding: '13px 26px', background: '#ffffff', color: '#3730a3', borderRadius: 12, fontSize: 14.5, fontWeight: 900, textDecoration: 'none' }}
            >
              MONO 시작하기
            </a>
            <a
              href="/partner"
              onClick={() => track('service_enterprise_cta_clicked', { source: 'footer_cta' })}
              style={{ padding: '13px 26px', background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 12, fontSize: 14.5, fontWeight: 800, textDecoration: 'none' }}
            >
              기업 문의하기
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
