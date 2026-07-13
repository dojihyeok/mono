'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';
import {
  WhyMonoInfographic,
  GrowthJourneyInfographic,
  LegacyVsMonoInfographic,
  OtacPocInfographic,
  PermissionLayerInfographic,
  DataLoopInfographic,
  SystemArchitectureInfographic,
  ExpansionInfographic,
  MonoSensstonePartnership,
  ZoomableImage,
} from './Infographics';
import styles from './strategy.module.css';

// ─────────────────────────────────────────────
// MONO Field Pass 소개 페이지 — VC 투자자·센스톤 대표 공유용
// 톤: /strategy(전략 페이지)와 동일한 웜톤 오프화이트 + 인디고 + 블루프린트 그리드.
// 구조 v3(인포그래픽 개선 요청서 반영): 큰 인포그래픽 한 장을 상단에 두는 대신,
//     설명을 읽는 순서에 맞춰 각 섹션 바로 아래에 해당 인포그래픽을 1:1로 배치.
//     섹션 순서: Hero → Why MONO → 기존 전자카드 비교 → Growth Journey → OTAC PoC →
//     Permission → Data Loop → System Architecture → Expansion Roadmap →
//     MONO + Sensstone → Business Model → 전체 요약(첨부 이미지) → CTA.
// 주의: OTAC/센스톤은 서면 합의 전 "기술 협력 제안·PoC 검토·검증 예정" 단계 —
//     "공식 파트너"/"적용 완료"/"확정 제휴" 표현 금지.
// ─────────────────────────────────────────────

const NAVY = '#0b1224';
const INDIGO = '#4f46e5';
const INK = '#0a0f1a';

function NumberedSection({
  id,
  num,
  eyebrow,
  title,
  children,
  onView,
  alt,
  dark,
  maxWidth,
}: {
  id?: string;
  num: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  onView?: () => void;
  alt?: boolean;
  dark?: boolean;
  maxWidth?: number;
}) {
  return (
    <section
      id={id}
      onMouseEnter={onView}
      className={`${styles.section} ${alt ? styles.sectionAlt : styles.blueprint}`}
      style={dark ? { background: NAVY } : undefined}
    >
      <div className={styles.container} style={maxWidth ? { maxWidth } : undefined}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel} style={dark ? { color: '#a5b4fc' } : undefined}>
            <span className={styles.num} style={dark ? { color: '#a5b4fc', borderColor: 'rgba(165,180,252,.3)', background: 'rgba(165,180,252,.08)' } : undefined}>{num}</span>
            {eyebrow}
          </span>
          <h2 className={styles.hDisplay} style={dark ? { color: '#fff' } : undefined}>{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function InfoTable({ rows, cols = ['', ''] }: { rows: React.ReactNode[][]; cols?: string[] }) {
  return (
    <div style={{ marginTop: 18, border: '1px solid rgba(36,91,255,0.16)', borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.86)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        {cols[0] && (
          <thead>
            <tr style={{ background: 'rgba(79,70,229,0.04)' }}>
              {cols.map((c) => (
                <th key={c} style={{ textAlign: 'left', fontSize: 11.5, fontWeight: 800, color: '#64748b', padding: '10px 16px', borderBottom: '1px solid rgba(36,91,255,0.12)' }}>{c}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderTop: i === 0 && !cols[0] ? 'none' : '1px solid rgba(36,91,255,0.08)' }}>
              {r.map((c, j) => (
                <td
                  key={j}
                  style={{
                    padding: '12px 16px',
                    fontSize: 13,
                    fontWeight: j === 0 ? 850 : 600,
                    color: j === 0 ? INK : '#475569',
                    lineHeight: 1.5,
                    wordBreak: 'keep-all',
                    width: j === 0 ? '30%' : 'auto',
                  }}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderLeft: `3px solid ${INDIGO}`, background: 'rgba(79,70,229,0.05)', borderRadius: '0 12px 12px 0', padding: '14px 18px', margin: '18px 0' }}>
      <p style={{ fontSize: 14, color: '#312e81', fontWeight: 750, lineHeight: 1.65, margin: 0, wordBreak: 'keep-all' }}>{children}</p>
    </div>
  );
}

function PriorityBadge({ p }: { p: 'P0' | 'P1' | 'P2' }) {
  const c = p === 'P0' ? { color: '#b91c1c', bg: '#fef2f2' } : p === 'P1' ? { color: '#b45309', bg: '#fffbeb' } : { color: '#64748b', bg: '#f1f5f9' };
  return (
    <span style={{ fontSize: 10.5, fontWeight: 900, color: c.color, background: c.bg, padding: '2px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>{p}</span>
  );
}

function StageTag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 10.5, fontWeight: 900, color: '#4f46e5', background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.25)', padding: '2px 9px', borderRadius: 999, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

function StatusBadge({ children, tone = 'purple' }: { children: React.ReactNode; tone?: 'purple' | 'mint' }) {
  const c = tone === 'mint' ? { color: '#047857', bg: '#ecfdf5', border: '#a7f3d0' } : { color: '#9333ea', bg: '#faf5ff', border: '#e9d5ff' };
  return (
    <span style={{ fontSize: 11, fontWeight: 900, color: c.color, background: c.bg, border: `1px solid ${c.border}`, padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

export default function FieldPassClient() {
  useEffect(() => {
    track('field_pass_landing_viewed', {});
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.page} style={{ fontFamily: 'var(--font-sans)' }}>
      {/* ── Header ── */}
      <header style={{ background: NAVY, padding: '16px 20px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 15.5, fontWeight: 950, color: '#fff' }}>MONO Field Pass</span>
          <span style={{ fontSize: 10.5, fontWeight: 800, color: '#93c5fd', background: 'rgba(37,99,235,0.18)', padding: '3px 10px', borderRadius: 999, border: '1px solid rgba(147,197,253,0.3)' }}>
            투자자·파트너 공유용
          </span>
        </div>
      </header>

      {/* ── 1. Hero (인포그래픽 없음, CTA 2개만) ── */}
      <section className={`${styles.section} ${styles.blueprint}`} style={{ paddingBottom: 40 }}>
        <div className={styles.container}>
          <h1 className={styles.hDisplay}>
            일용직에서 건설근로자로,
            <br />
            성장 기록이 현장 권한이 됩니다.
          </h1>
          <p className={styles.bodyLg}>
            MONO Field Pass는 교육, 준비 상태, 출근 기록, 현장 경험을 연결해 건설근로자의 성장과 출입·장비 권한을 관리하는 현장 인증 플랫폼입니다.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
            <button
              onClick={() => { track('field_pass_poc_cta_clicked', { source: 'hero', label: 'tech_partnership' }); scrollTo('partnership'); }}
              style={{ padding: '13px 24px', background: INDIGO, color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 900, cursor: 'pointer' }}
            >
              기술 협력 논의하기
            </button>
            <button
              onClick={() => { track('field_pass_poc_cta_clicked', { source: 'hero', label: 'otac_poc' }); scrollTo('otac-poc'); }}
              style={{ padding: '13px 24px', background: '#fff', color: INK, border: '1px solid rgba(36,91,255,0.25)', borderRadius: 12, fontSize: 14, fontWeight: 900, cursor: 'pointer' }}
            >
              OTAC PoC 보기
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. Why MONO Field Pass ── */}
      <NumberedSection id="why" num="01" eyebrow="Why MONO" title="사람의 성장과 현장 신뢰를 연결합니다" onView={() => track('field_pass_why_mono_viewed', {})}>
        <p style={{ fontSize: 14, color: '#475569', fontWeight: 650, lineHeight: 1.75, margin: '0 0 6px', wordBreak: 'keep-all' }}>
          건설 현장은 매일 수많은 일용직·조공 인력이 드나들지만, 교육·서류·출입·경력 관리가 전부 따로 놀아서 원청과 협력사 모두 비효율과 리스크를 감수하고 있습니다.
        </p>
        <p style={{ fontSize: 14, color: '#475569', fontWeight: 650, lineHeight: 1.75, margin: 0, wordBreak: 'keep-all' }}>
          MONO는 이 흩어진 과정을 하나로 연결합니다. 일한 기록이 경력이 되고, 경력이 Field Pass가 되며, Field Pass가 현장 권한이 되는 구조입니다.
        </p>

        <div style={{ marginTop: 28 }}>
          <WhyMonoInfographic />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginTop: 20 }}>
          <div className={styles.card}>
            <div style={{ fontSize: 11, fontWeight: 800, color: INDIGO, letterSpacing: '0.06em', marginBottom: 8 }}>VC용 메시지</div>
            <p style={{ fontSize: 13.5, color: '#334155', fontWeight: 650, lineHeight: 1.65, margin: 0, wordBreak: 'keep-all' }}>
              MONO는 일자리 앱에서 시작해, 현장 근무자의 성장 기록을 출입 권한과 장비 권한으로 연결하는 인증 인프라로 확장합니다.
            </p>
          </div>
          <div className={styles.card}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#059669', letterSpacing: '0.06em', marginBottom: 8 }}>센스톤용 메시지</div>
            <p style={{ fontSize: 13.5, color: '#334155', fontWeight: 650, lineHeight: 1.65, margin: 0, wordBreak: 'keep-all' }}>
              MONO는 기술자 프로필, 교육·서류 준비 상태, 현장 경험, 권한 데이터를 제공하고, 센스톤 OTAC 기술을 통해 앱 기반 Field Pass 인증과 출입 권한 검증을 PoC로 확인하고자 합니다.
            </p>
          </div>
        </div>
      </NumberedSection>

      {/* ── 3. 기존 건설 전자카드 vs MONO ── */}
      <NumberedSection id="concept" num="02" eyebrow="Legacy vs MONO" title="카드를 먼저 발급하는 게 아니라, 성장한 결과로 발급합니다" alt onView={() => track('field_pass_concept_viewed', {})}>
        <LegacyVsMonoInfographic />
        <Callout>
          MONO Field Pass는 카드를 먼저 발급하는 서비스가 아니라, 사람이 현장에 들어갈 준비를 갖추고 성장한 결과로 발급되는 인증입니다.
        </Callout>
      </NumberedSection>

      {/* ── 4. Growth Journey ── */}
      <NumberedSection id="growth" num="03" eyebrow="Growth Journey" title="일용직에서 건설근로자로 성장하는 흐름" onView={() => track('field_pass_growth_journey_viewed', {})}>
        <p style={{ fontSize: 14, color: '#475569', fontWeight: 650, lineHeight: 1.7, margin: 0, wordBreak: 'keep-all' }}>
          MONO는 단순 일자리 연결에서 끝나지 않습니다. 현장 근무자가 필요한 교육과 준비를 갖추고, 조공으로 경험을 쌓고, 현장 리더로 성장하는 과정을 데이터로 남깁니다.
        </p>
        <div style={{ marginTop: 20 }}>
          <GrowthJourneyInfographic />
        </div>
      </NumberedSection>

      {/* ── 5. OTAC Partnership PoC ── */}
      <NumberedSection id="otac-poc" num="04" eyebrow="OTAC Partnership" title="센스톤 OTAC 기반 기술 협력 PoC" alt onView={() => track('field_pass_otac_viewed', {})}>
        <p style={{ fontSize: 14, color: '#475569', fontWeight: 650, lineHeight: 1.7, margin: '0 0 4px', wordBreak: 'keep-all' }}>
          MONO는 센스톤의 OTAC 기반 인증 기술을 활용해 Field Pass의 핵심 인증 흐름을 검증하고자 합니다.
        </p>
        <p style={{ fontSize: 14, color: '#475569', fontWeight: 650, lineHeight: 1.7, margin: '0 0 8px', wordBreak: 'keep-all' }}>
          초기 PoC는 앱 기반 출입 인증과 출근 기록 생성에 집중하고, 이후 카드 인증, 장비 권한, OT 기기 접근 제어로 확장합니다.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 10px' }}>
          <StatusBadge tone="mint">검증 예정</StatusBadge>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 650 }}>서면 협력 합의 전 · 기술 협력 제안·PoC 검토 단계</span>
        </div>

        <div style={{ marginTop: 24 }}>
          <OtacPocInfographic />
        </div>

        <div style={{ fontSize: 12.5, fontWeight: 800, color: '#64748b', marginTop: 28, marginBottom: 4 }}>PoC 목표</div>
        <InfoTable
          cols={['목표', '설명']}
          rows={[
            ['앱 인증 검증', 'MONO 앱에서 Field Pass 인증 생성'],
            ['OTAC 적용', '일회성 인증값 기반 출입 인증'],
            ['현장 확인', '관리자 앱 또는 단말에서 인증 확인'],
            ['출근 기록', '인증 성공 시 출근 기록 저장'],
            ['권한 조건', '교육·서류·자격 상태에 따른 출입 가능 여부 검증'],
          ]}
        />

        <div style={{ fontSize: 12.5, fontWeight: 800, color: '#64748b', marginTop: 28, marginBottom: 4 }}>PoC 최소 기능</div>
        <InfoTable
          cols={['기능', '우선순위']}
          rows={[
            ['Field Ready 상태', <PriorityBadge key="p0-1" p="P0" />],
            ['앱 Field Pass 인증', <PriorityBadge key="p0-2" p="P0" />],
            ['OTAC 인증값 생성·검증', <PriorityBadge key="p0-3" p="P0" />],
            ['관리자 앱 인증 확인', <PriorityBadge key="p0-4" p="P0" />],
            ['출근 기록 저장', <PriorityBadge key="p0-5" p="P0" />],
            ['경력카드 반영', <PriorityBadge key="p1-1" p="P1" />],
            ['실물 카드 연동', <PriorityBadge key="p1-2" p="P1" />],
            ['중장비 권한 검증', <PriorityBadge key="p2-1" p="P2" />],
            ['OT 기기 권한 검증', <PriorityBadge key="p2-2" p="P2" />],
          ]}
        />
      </NumberedSection>

      {/* ── 6. 출입·장비·OT 권한 아키텍처 ── */}
      <NumberedSection id="permission" num="05" eyebrow="Permission" title="출입에서 장비·OT 권한으로" onView={() => track('field_pass_infographic_permission_viewed', {})}>
        <PermissionLayerInfographic />
      </NumberedSection>

      {/* ── 7. MONO Data Loop ── */}
      <NumberedSection id="data-loop" num="06" eyebrow="MONO Data Loop" title="근무 기록이 더 좋은 기회로 이어지는 데이터 선순환" alt onView={() => track('field_pass_data_loop_viewed', {})}>
        <p style={{ fontSize: 14, color: '#475569', fontWeight: 650, lineHeight: 1.7, margin: '0 0 4px', wordBreak: 'keep-all' }}>
          이 페이지에서 가장 중요한 그림입니다. 출입 한 번이 근태, 경력, 신뢰 데이터로 쌓이고, 그 데이터가 다시 더 좋은 현장과 더 나은 처우로 이어집니다.
        </p>
        <div style={{ marginTop: 20 }}>
          <DataLoopInfographic />
        </div>
      </NumberedSection>

      {/* ── 8. Field Pass 전체 시스템 아키텍처 ── */}
      <NumberedSection id="architecture" num="07" eyebrow="System Architecture" title="MONO Field Pass 시스템 아키텍처" maxWidth={1180} onView={() => track('field_pass_architecture_viewed', {})}>
        <p style={{ fontSize: 13, color: '#64748b', fontWeight: 650, lineHeight: 1.6, margin: '0 0 4px', wordBreak: 'keep-all' }}>
          사용자·인증수단·OTAC 인증 엔진·권한 엔진의 인증 흐름이, 출입·장비 시스템·데이터 플랫폼·리포트·외부 연동의 데이터 흐름으로 이어지는 장기 목표 아키텍처입니다.
        </p>
        <div style={{ marginTop: 18 }}>
          <SystemArchitectureInfographic />
        </div>
      </NumberedSection>

      {/* ── 9. Expansion Roadmap ── */}
      <NumberedSection id="roadmap" num="08" eyebrow="Expansion Roadmap" title="건설 현장에서 산업·생활 공간으로 확장" alt onView={() => track('field_pass_expansion_roadmap_viewed', {})}>
        <ExpansionInfographic />
      </NumberedSection>

      {/* ── 10. MONO + Sensstone ── */}
      <NumberedSection id="partnership" num="09" eyebrow="MONO + Sensstone" title="MONO의 데이터 + 센스톤의 인증, 결합하면 넓어집니다" onView={() => track('field_pass_mono_sensstone_viewed', {})}>
        <MonoSensstonePartnership />
      </NumberedSection>

      {/* ── 11. Business Model ── */}
      <NumberedSection num="10" eyebrow="Business Model" title="Field Pass 수익모델" alt onView={() => track('field_pass_bm_viewed', {})}>
        <InfoTable
          cols={['수익모델', '고객', '과금 기준', '']}
          rows={[
            ['Field Pass SaaS', '현장 운영사·협력사', '현장·월 구독', <StageTag key="t1">중기 확장</StageTag>],
            ['출입·출근 리포트', '원청·대기업', '사용자·현장 기준', <StageTag key="t2">초기 검증</StageTag>],
            ['인증 API', '출입·시설 운영사', '인증 호출·라이선스', <StageTag key="t3">중기 확장</StageTag>],
            ['권한 관리 API', '장비·OT 운영사', '장비·사용자 기준', <StageTag key="t4">장기 확장</StageTag>],
            ['카드·금융 제휴', '금융기관·카드사', '제휴 계약', <StageTag key="t5">장기 확장</StageTag>],
            ['아파트·오피스 출입', '관리사무소·기업', '공간·월 구독', <StageTag key="t6">중기 확장</StageTag>],
          ]}
        />
        <Callout>
          초기 검증은 앱 기반 출입 인증 PoC와 현장 출입·출근 운영 리포트, 두 가지에 집중합니다. 가격은 아직 검증 전 단계라 표시하지 않습니다.
        </Callout>
      </NumberedSection>

      {/* ── 12. 전체 요약 ── */}
      <NumberedSection num="11" eyebrow="Summary" title="한눈에 보는 MONO Field Pass" onView={() => track('field_pass_summary_viewed', {})}>
        <ZoomableImage
          src="/field-pass/summary-infographic.png"
          alt="MONO Field Pass 한눈에 이해하기 — Why MONO부터 투자 포인트까지 9개 인포그래픽 요약"
          caption="성장 → 인증 → 출입 → 권한 → 데이터 → 산업 확장"
        />
        <ZoomableImage
          src="/field-pass/architecture-flow.png"
          alt="MONO Field Pass 아키텍처 흐름도 1.1 — 성장 단계부터 데이터 플랫폼, 확장 로드맵, 외부 연동까지"
          caption="MONO Field Pass 아키텍처 흐름도 1.1"
        />
      </NumberedSection>

      {/* ── 13. Partnership CTA ── */}
      <section style={{ background: NAVY, padding: '56px 20px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 18, fontSize: 13, fontWeight: 800 }}>
            <span style={{ color: 'rgba(226,232,240,0.6)' }}>오늘 · 일자리 플랫폼</span>
            <span style={{ color: '#475569' }}>→</span>
            <span style={{ color: '#fff' }}>내일 · Field Pass 출입·권한 플랫폼</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20, fontSize: 13, fontWeight: 800, color: '#a5b4fc' }}>
            <span>Field Pass</span><span style={{ color: '#475569' }}>→</span>
            <span>Digital Identity</span><span style={{ color: '#475569' }}>→</span>
            <span>Digital Access</span><span style={{ color: '#475569' }}>→</span>
            <span>Digital Permission</span><span style={{ color: '#475569' }}>→</span>
            <span style={{ color: '#fff' }}>Industrial Trust Platform</span>
          </div>
          <p style={{ fontSize: 15, color: '#fff', fontWeight: 700, lineHeight: 1.7, margin: '0 auto 28px', maxWidth: 560, wordBreak: 'keep-all' }}>
            MONO는 건설 전자카드를 만드는 회사가 아니라, 현장 근무자의 성장과 권한을 연결하는 산업 현장 인증 인프라입니다.
          </p>
          <h2 style={{ fontSize: 22, fontWeight: 950, color: '#fff', margin: '0 0 14px', wordBreak: 'keep-all' }}>
            PoC로 가장 차별성 있는 기능부터 검증합니다
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(226,232,240,0.8)', fontWeight: 600, lineHeight: 1.75, margin: '0 auto 28px', maxWidth: 560, wordBreak: 'keep-all' }}>
            MONO는 먼저 앱 기반 Field Pass 인증과 출근 기록 연결을 검증합니다. 센스톤 OTAC 기술과 결합해 현장 출입 인증의 차별성을 확인하고, 이후 카드·장비·OT 권한 관리로 확장합니다.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="mailto:yunhyeok@t-rive.com?subject=MONO%20Field%20Pass%20%EC%84%BC%EC%8A%A4%ED%86%A4%20%EA%B8%B0%EC%88%A0%20%ED%98%91%EB%A0%A5%20PoC%20%EB%85%BC%EC%9D%98"
              onClick={() => track('field_pass_contact_cta_clicked', { label: 'sensen_poc' })}
              style={{ padding: '13px 24px', background: '#fff', color: NAVY, borderRadius: 12, fontSize: 14, fontWeight: 900, textDecoration: 'none' }}
            >
              센스톤 기술 협력 PoC 논의하기
            </a>
            <a
              href="mailto:yunhyeok@t-rive.com?subject=MONO%20Field%20Pass%20VC%20%EB%AF%B8%ED%8C%85%EC%9A%A9%20%EC%9E%90%EB%A3%8C%20%EC%9A%94%EC%B2%AD"
              onClick={() => track('field_pass_contact_cta_clicked', { label: 'vc_meeting' })}
              style={{ padding: '13px 24px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 12, fontSize: 14, fontWeight: 900, textDecoration: 'none' }}
            >
              VC 미팅용 자료 요청하기
            </a>
          </div>
        </div>
      </section>

      <footer style={{ padding: '20px', textAlign: 'center' }}>
        <span style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 600 }}>MONO Field Pass · 투자자·파트너 공유용 · <a href="/strategy" style={{ color: '#94a3b8' }}>MONO 전략 페이지 보기 →</a></span>
      </footer>
    </div>
  );
}
