'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';
import { GrowthFlowInfographic, OtacPocInfographic, PermissionLayerInfographic, ExpansionInfographic } from './Infographics';
import styles from './strategy.module.css';

// ─────────────────────────────────────────────
// MONO Field Pass 소개 페이지 — VC 투자자·센스톤 대표 공유용
// 톤: /strategy(전략 페이지)와 동일한 웜톤 오프화이트 + 인디고 + 블루프린트 그리드,
//     넘버링된 섹션(01, 02, ...)으로 구성 — 사용자 피드백("전략 페이지처럼 순서 개편") 반영.
// 주의: OTAC는 서면 합의 전 TECH REVIEW 상태 — "공식 파트너"/"적용 완료" 표현 금지(/partner/field-pass와 동일 원칙)
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

function FlowSteps({ steps, color = INDIGO }: { steps: string[]; color?: string }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 18 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: `1.5px solid ${color}33`, borderRadius: 12, padding: '10px 14px', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: color, color: '#fff', fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{i + 1}</span>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: INK, whiteSpace: 'nowrap' }}>{s}</span>
          </div>
          {i < steps.length - 1 && <span style={{ color: '#94a3b8', fontSize: 16 }}>→</span>}
        </div>
      ))}
    </div>
  );
}

function CardGrid({ items, minWidth = 240 }: { items: { title: string; body: string }[]; minWidth?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}px, 1fr))`, gap: 12, marginTop: 18 }}>
      {items.map((it) => (
        <div key={it.title} className={`${styles.card} ${styles.hoverLift}`} style={{ padding: 18 }}>
          <div style={{ fontSize: 14.5, fontWeight: 900, color: INK, marginBottom: 6 }}>{it.title}</div>
          <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, lineHeight: 1.55, wordBreak: 'keep-all' }}>{it.body}</div>
        </div>
      ))}
    </div>
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

function ArchColumn({
  num,
  title,
  color,
  sections,
}: {
  num: number;
  title: string;
  color: string;
  sections: { label: string; items: string[] }[];
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ background: color, color: '#fff', borderRadius: 10, padding: '10px 12px', fontSize: 12.5, fontWeight: 900, textAlign: 'center', lineHeight: 1.4 }}>
        {num}. {title}
      </div>
      {sections.map((s) => (
        <div key={s.label} style={{ background: 'rgba(255,255,255,0.86)', border: '1px solid rgba(36,91,255,0.16)', borderRadius: 12, padding: '12px 13px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 850, color: INK, marginBottom: 5 }}>{s.label}</div>
          <ul style={{ margin: 0, padding: '0 0 0 15px', fontSize: 11, color: '#64748b', fontWeight: 600, lineHeight: 1.65 }}>
            {s.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10, marginTop: 18 }}>
      {items.map((it) => (
        <div key={it} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: 'rgba(255,255,255,0.86)', border: '1px solid rgba(36,91,255,0.16)', borderRadius: 12, padding: '12px 14px' }}>
          <span style={{ color: INDIGO, fontWeight: 900, fontSize: 14, flex: 'none', marginTop: 1 }}>✓</span>
          <span style={{ fontSize: 13, color: '#334155', fontWeight: 650, lineHeight: 1.55, wordBreak: 'keep-all' }}>{it}</span>
        </div>
      ))}
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
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 15.5, fontWeight: 950, color: '#fff' }}>MONO Field Pass</span>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: '#93c5fd', background: 'rgba(37,99,235,0.18)', padding: '3px 10px', borderRadius: 999, border: '1px solid rgba(147,197,253,0.3)' }}>
              투자자·파트너 공유용
            </span>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <a href="/strategy" style={{ fontSize: 12.5, fontWeight: 700, color: '#cbd5e1', textDecoration: 'none' }}>/strategy</a>
            <a href="/bm" style={{ fontSize: 12.5, fontWeight: 700, color: '#cbd5e1', textDecoration: 'none' }}>/bm</a>
            <a href="/dataroom" style={{ fontSize: 12.5, fontWeight: 700, color: '#cbd5e1', textDecoration: 'none' }}>/dataroom</a>
          </div>
        </div>
      </header>

      {/* ── 01. 소개 + 한장 요약 ── */}
      <section className={`${styles.section} ${styles.blueprint}`} onMouseEnter={() => track('field_pass_one_page_summary_viewed', {})}>
        <div className={styles.container}>
          <span className={styles.sectionLabel}>
            <span className={styles.num}>01</span> MONO Field Pass 소개
          </span>
          <h1 className={styles.hDisplay}>
            일용직에서 건설근로자로,<br />출입카드에서 현장 권한 인프라로
          </h1>
          <p className={styles.bodyLg}>
            MONO Field Pass는 현장 근무자가 교육, 서류, 출근 기록, 경력을 쌓아 건설근로자로 성장할 때 발급되는 성장형 현장 인증 카드입니다. 앱과 카드, OTAC 기반 인증을 통해 현장 출입, 출근 기록, 경력 관리, 장비 권한을 하나의 흐름으로 연결합니다.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
            <button
              onClick={() => { track('field_pass_poc_cta_clicked', { source: 'hero', label: 'tech_partnership' }); scrollTo('otac'); }}
              style={{ padding: '13px 24px', background: INDIGO, color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 900, cursor: 'pointer' }}
            >
              기술 협력 논의하기
            </button>
            <button
              onClick={() => { track('field_pass_poc_cta_clicked', { source: 'hero', label: 'poc_structure' }); scrollTo('otac'); }}
              style={{ padding: '13px 24px', background: '#fff', color: INK, border: '1px solid rgba(36,91,255,0.25)', borderRadius: 12, fontSize: 14, fontWeight: 900, cursor: 'pointer' }}
            >
              PoC 구조 보기
            </button>
          </div>

          {/* 한장 요약 */}
          <div className={styles.card} style={{ marginTop: 44 }}>
            <div style={{ fontSize: 11, fontWeight: 850, color: INDIGO, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, textAlign: 'center' }}>
              MONO Field Pass · 한장 요약
            </div>
            <div style={{ fontSize: 17, fontWeight: 900, color: INK, textAlign: 'center', wordBreak: 'keep-all' }}>
              무엇을 하려는지 한눈에 보기
            </div>
            <p style={{ fontSize: 13, color: '#64748b', fontWeight: 650, textAlign: 'center', lineHeight: 1.65, margin: '10px auto 0', maxWidth: 620, wordBreak: 'keep-all' }}>
              조공으로 경험을 쌓아 카드를 발급받고, 현장 출입 때는 센스톤 OTAC 기술로 카드·앱 인증을 하고, 포크레인 같은 중장비 인증으로, 이후 아파트 출입으로까지 넓어지는 카드입니다.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: 10, marginTop: 20 }}>
              {[
                { n: 1, icon: '🧑‍🔧', label: '성장', desc: '조공으로 경험을 쌓아 건설근로자로', id: 'growth', color: '#2563eb' },
                { n: 2, icon: '🪪', label: 'Field Pass 카드 발급', desc: '성장 기록 기반으로 카드 발급', id: 'concept', color: '#059669' },
                { n: 3, icon: '🔑', label: '카드·앱 출입 인증(OTAC)', desc: '현장 출입 시 센스톤 OTAC로 카드·앱 인증', id: 'otac', color: '#9333ea' },
                { n: 4, icon: '🚜', label: '중장비·기기 인증 확장', desc: '포크레인 등 중장비 인증으로 확장', id: 'permission', color: '#ea580c' },
                { n: 5, icon: '🏢', label: '아파트 출입 확장', desc: '건설 현장 밖, 아파트 출입으로 확장', id: 'permission', color: '#0891b2' },
              ].map((s) => (
                <button
                  key={s.n}
                  onClick={() => { track('field_pass_one_page_summary_jump_clicked', { target: s.id }); scrollTo(s.id); }}
                  style={{ textAlign: 'center', background: '#fff', border: '1px solid rgba(36,91,255,0.14)', borderRadius: 14, padding: '16px 12px', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: s.color, color: '#fff', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontWeight: 900 }}>
                    {s.icon}
                  </div>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: '#94a3b8', marginBottom: 3 }}>STEP {s.n}</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: INK, wordBreak: 'keep-all' }}>{s.label}</div>
                  <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600, marginTop: 4, lineHeight: 1.5, wordBreak: 'keep-all' }}>{s.desc}</div>
                  <div style={{ fontSize: 11, color: s.color, fontWeight: 800, marginTop: 8 }}>자세히 보기 ↓</div>
                </button>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: '#475569', fontWeight: 700, wordBreak: 'keep-all' }}>
              일한 기록이 경력이 되고, 경력이 Field Pass가 되며, Field Pass가 현장 권한이 됩니다.
            </div>
          </div>

          {/* VC / 센스톤 메시지 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginTop: 16 }}>
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

          {/* 성장 흐름 인포그래픽 */}
          <div style={{ marginTop: 32 }}>
            <GrowthFlowInfographic />
          </div>
        </div>
      </section>

      {/* ── 02. Problem ── */}
      <NumberedSection num="02" eyebrow="Problem" title="현장 출입과 근무 기록은 아직 분리되어 있습니다" alt onView={() => track('field_pass_problem_viewed', {})}>
        <CardGrid
          items={[
            { title: '준비 과정이 흩어짐', body: '교육, 전자카드, 신체검사, 서류, 출입카드가 각각 관리됩니다.' },
            { title: '출입과 경력이 연결되지 않음', body: '현장에 출근해도 그 기록이 기술자의 경력 자산으로 충분히 남지 않습니다.' },
            { title: '권한 관리가 제한적', body: '출입 가능 여부와 장비 사용 가능 여부가 별도로 관리됩니다.' },
            { title: '금융 선택지가 제한됨', body: '전자카드 발급 과정에서 사용자와 현장 운영사의 선택 폭이 제한됩니다.' },
          ]}
        />
      </NumberedSection>

      {/* ── 03. Growth Journey ── */}
      <NumberedSection id="growth" num="03" eyebrow="Growth Journey" title="일용직에서 건설근로자로 성장하는 흐름" onView={() => track('field_pass_growth_journey_viewed', {})}>
        <p style={{ fontSize: 14, color: '#475569', fontWeight: 650, lineHeight: 1.7, margin: 0, wordBreak: 'keep-all' }}>
          MONO는 단순 일자리 연결에서 끝나지 않습니다. 현장 근무자가 필요한 교육과 준비를 갖추고, 조공으로 경험을 쌓고, 건설근로자로 성장하는 과정을 데이터로 남깁니다.
        </p>
        <FlowSteps steps={['오늘 현장', '처음 현장 준비', '교육·서류 완료', '조공으로 경험 축적', '건설근로자 프로필 형성', 'Field Pass 발급', '출입·출근·경력·정산 연결']} />
      </NumberedSection>

      {/* ── 04. Field Pass Concept — 1·2단계 차별성 ── */}
      <NumberedSection id="concept" num="04" eyebrow="Concept" title="MONO Field Pass는 성장형 현장 인증 카드입니다" alt onView={() => track('field_pass_concept_viewed', {})}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: '#64748b', marginBottom: 4 }}>1단계 · 성장형 인증</div>
        <InfoTable
          cols={['기존', 'MONO']}
          rows={[
            ['현장에 필요한 카드 발급', '교육·서류·현장 경험을 갖춘 뒤 Field Pass 발급'],
            ['출입 기록 중심', '출입, 출근, 경력, 정산으로 연결'],
            ['카드가 중심', '사용자 성장 기록이 중심'],
          ]}
        />
        <Callout>
          MONO Field Pass는 카드를 먼저 발급하는 서비스가 아니라, 사람이 현장에 들어갈 준비를 갖추고 성장한 결과로 발급되는 인증입니다.
        </Callout>

        <div style={{ fontSize: 12.5, fontWeight: 800, color: '#64748b', marginTop: 26, marginBottom: 4 }}>2단계 · 앱 기반 출입 인증</div>
        <InfoTable
          cols={['기능', '설명']}
          rows={[
            ['Field Ready', '교육, 서류, 계좌, 신체검사, 전자카드 준비 상태'],
            ['App Pass', '앱에서 출입 인증 생성'],
            ['OTAC 인증', '일회성 인증값으로 출입 확인'],
            ['출근 기록', '인증 성공 시 출근 기록 생성'],
            ['경력 연결', '출근 기록이 경력카드에 반영'],
          ]}
        />
      </NumberedSection>

      {/* ── 05. OTAC Partnership PoC ── */}
      <NumberedSection id="otac" num="05" eyebrow="OTAC Partnership" title="센스톤 OTAC 기반 기술 협력 PoC" onView={() => track('field_pass_otac_viewed', {})}>
        <p style={{ fontSize: 14, color: '#475569', fontWeight: 650, lineHeight: 1.7, margin: '0 0 4px', wordBreak: 'keep-all' }}>
          MONO는 센스톤의 OTAC 기반 인증 기술을 활용해 Field Pass의 핵심 인증 흐름을 검증하고자 합니다.
        </p>
        <p style={{ fontSize: 14, color: '#475569', fontWeight: 650, lineHeight: 1.7, margin: '0 0 8px', wordBreak: 'keep-all' }}>
          초기 PoC는 앱 기반 출입 인증과 출근 기록 생성에 집중하고, 이후 카드 인증, 장비 권한, OT 기기 접근 제어로 확장합니다.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 10px' }}>
          <StatusBadge>TECH REVIEW</StatusBadge>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 650 }}>서면 협력 합의 전 · 기술 검토 단계</span>
        </div>

        {/* ── 인포그래픽 2: OTAC 기반 앱 출입 인증 PoC 흐름 ── */}
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

      {/* ── 06. Architecture ── */}
      <NumberedSection num="06" eyebrow="Architecture" title="MONO Field Pass 아키텍처" alt maxWidth={1180} onView={() => track('field_pass_architecture_viewed', {})}>
        <p style={{ fontSize: 13, color: '#64748b', fontWeight: 650, lineHeight: 1.6, margin: '0 0 4px', wordBreak: 'keep-all' }}>
          하나의 신원으로 다양한 현장·시설 출입을 안전하고 편리하게 — 장기 목표 아키텍처입니다. 금융기관·정부기관 명은 연동 대상 유형의 예시이며, 현재 확정된 제휴를 의미하지 않습니다.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 18 }}>
          <ArchColumn
            num={1}
            title="사용자(기술자)"
            color="#2563eb"
            sections={[
              { label: 'MONO 사용자 앱', items: ['Field Pass 상태 확인', '현장 출입 · 출근 체크', '내 자격/카드 · 근무 내역'] },
              { label: '지원 가능한 인증 방식', items: ['카드 태그(NFC/RFID)', '앱 QR/바코드', '모바일 NFC', 'BLE 무선 인증', '위치 기반 인증'] },
            ]}
          />
          <ArchColumn
            num={2}
            title="MONO Field Pass 플랫폼"
            color="#059669"
            sections={[
              { label: '통합 발급·자격 관리', items: ['전자카드 발급', '교육/이수 확인', '신체검사 · 자격/면허', '보험/공제'] },
              { label: '출입 인증 서비스', items: ['다중 인증 처리', '출입 권한 엔진', '현장/시설 권한 매핑', '실시간 인증/검증'] },
              { label: '근태·작업 관리', items: ['출근/퇴근 체크', '작업/공수 기록', '휴게/작업 관리', '이상/알림 관리'] },
              { label: '정산·경력 관리', items: ['공수/일당 계산', '정산/지급 연동', '경력 자동 기록', '증명서/리포트'] },
            ]}
          />
          <ArchColumn
            num={3}
            title="중앙 데이터 플랫폼"
            color="#9333ea"
            sections={[
              { label: '데이터 레이어', items: ['사용자/신원 DB', '권한/자격 DB', '출입/근태 DB', '현장/시설 DB', '정산/경력 DB'] },
              { label: '분석·처리 레이어', items: ['실시간 스트림 처리', '비즈니스 룰 엔진', '이상 탐지/알림', '리포트/대시보드'] },
              { label: '통합 연동 레이어', items: ['금융/카드 연동', '노무/퇴직공제 연동', '보험 연동', '외부 시스템 연동'] },
              { label: '모니터링 & 보안', items: ['모니터링 · 감사 로그', '접근 제어 · 백업/복구'] },
            ]}
          />
          <ArchColumn
            num={4}
            title="외부 연동 시스템"
            color="#ea580c"
            sections={[
              { label: '금융/카드 기관', items: ['은행 · 카드사 (연동 대상 예시)'] },
              { label: '출입 통제 시스템', items: ['건설 현장', '아파트 · 회사/오피스', '공장/플랜트'] },
              { label: '정부/공공 시스템', items: ['건설근로자공제회', '국토교통부', '안전보건공단'] },
              { label: '기타 파트너', items: ['근태 관리 서비스', '장비 임대사', '통신사'] },
            ]}
          />
          <ArchColumn
            num={5}
            title="활용 주체"
            color="#1e3a8a"
            sections={[
              { label: '기술자(사용자)', items: ['간편 발급/인증', '출입/근태 관리', '정산/경력 확인'] },
              { label: '출장 운영사/협력사', items: ['출입 권한 관리', '근태/작업 관리', '비용/정산 관리'] },
              { label: '원청/대기업', items: ['협력사/인력 관리', '안전/교육 관리', '리포트/감사'] },
              { label: '아파트·회사·시설 관리자', items: ['방문 인력 관리', '출입 통제', '이력/감사 관리'] },
              { label: '정부/공공', items: ['노무/정책 데이터', '통계/분석 활용', '안전/복지 관리'] },
            ]}
          />
        </div>

        <div style={{ fontSize: 12.5, fontWeight: 800, color: '#64748b', marginTop: 30, marginBottom: 4 }}>인증 흐름(다양한 방식 지원)</div>
        <FlowSteps steps={['카드 태그/앱 QR/NFC/BLE/위치', 'MONO 인증 서버에서 사용자/권한/시간/장소 검증', '게이트/도어/시스템에 출입 승인 전달', '출입/근태 데이터 실시간 저장', '근태 집계·정산·경력 반영 리포트/알림 생성']} />

        <div style={{ fontSize: 12.5, fontWeight: 800, color: '#64748b', marginTop: 30, marginBottom: 4 }}>핵심 가치</div>
        <CheckList
          items={[
            '다양한 금융기관 연계로 간편 발급',
            '통합 출입 인증으로 현장/시설 효율성 향상',
            '정확한 근태/작업 기록으로 신뢰·투명성 확보',
            '플랫폼 기반 확장성으로 다양한 산업 적용',
          ]}
        />
      </NumberedSection>

      {/* ── 07. Permission — 권한 레이어 아키텍처 ── */}
      <NumberedSection id="permission" num="07" eyebrow="Permission" title="출입 카드에서 현장 권한 관리 카드로" onView={() => track('field_pass_infographic_permission_viewed', {})}>
        <PermissionLayerInfographic />
        <div style={{ marginTop: 16 }}>
          <InfoTable
            cols={['권한', '확장 방향']}
            rows={[
              ['출입 권한', '건설 현장, 아파트, 오피스, 공장 출입'],
              ['근무 권한', '현장별 출근 가능 여부'],
              ['장비 권한', '지게차, 굴착기, 크레인 등 자격 기반 사용 승인'],
              ['OT 권한', '산업 설비, 제어 장비, 보안구역 접근'],
              ['금융 권한', '급여 계좌, 보험, 복지 금융 연계'],
            ]}
          />
        </div>
      </NumberedSection>

      {/* ── 08. Expansion Roadmap ── */}
      <NumberedSection num="08" eyebrow="Expansion Roadmap" title="건설 현장에서 생활·산업 공간으로 확장" alt onView={() => track('field_pass_expansion_roadmap_viewed', {})}>
        <ExpansionInfographic />
        <div style={{ fontSize: 12.5, fontWeight: 800, color: '#64748b', marginTop: 26, marginBottom: 4 }}>단계별 세부 내용</div>
        <InfoTable
          cols={['단계', '적용 영역', '확장 내용']}
          rows={[
            ['Phase 1', '건설 현장', '출입, 출근, 교육, 전자카드, 경력 기록'],
            ['Phase 2', '대형 산업 현장', '협력사 인력, 출입 권한, 안전교육 관리'],
            ['Phase 3', '아파트', '방문 작업자, 수리기사, 인테리어 작업자 출입 인증'],
            ['Phase 4', '오피스', '외주 인력, 시설관리, 보안구역 출입 관리'],
            ['Phase 5', '중장비·OT', '자격·면허 기반 장비 작동 권한 관리'],
            ['Phase 6', '금융·보험', '출근·경력 데이터 기반 금융·보험 연계'],
          ]}
        />
      </NumberedSection>

      {/* ── 09. Key Differentiation ── */}
      <NumberedSection num="09" eyebrow="Differentiation" title="MONO Field Pass의 차별성" onView={() => track('field_pass_differentiation_viewed', {})}>
        <InfoTable
          rows={[
            ['성장 기반 발급', '일용직에서 건설근로자로 성장하는 과정과 연결됩니다.'],
            ['앱과 카드 동시 지원', '현장 상황에 따라 앱 인증과 카드 인증을 함께 사용할 수 있습니다.'],
            ['OTAC 기반 인증', '재사용과 도용 리스크를 줄이는 인증 구조를 검토합니다.'],
            ['출입과 경력 연결', '출근 기록이 기술자의 경력과 신뢰 프로필로 이어집니다.'],
            ['자격 기반 권한 관리', '교육·자격·면허 상태에 따라 출입과 장비 사용 권한을 관리합니다.'],
            ['공간 확장성', '건설 현장에서 아파트, 오피스, 공장, OT 기기로 확장됩니다.'],
          ]}
        />
      </NumberedSection>

      {/* ── 10. Business Model ── */}
      <NumberedSection num="10" eyebrow="Business Model" title="수익모델 확장 구조" alt onView={() => track('field_pass_bm_viewed', {})}>
        <InfoTable
          cols={['수익모델', '고객']}
          rows={[
            ['Field Pass 구독', '현장 운영사, 협력사'],
            ['출입·출근 리포트', '원청, 대기업'],
            ['카드·금융 제휴', '금융기관, 카드사'],
            ['장비 권한 API', '장비사, 현장 운영사'],
            ['아파트·오피스 출입 SaaS', '관리사무소, 기업'],
            ['OT 접근 권한 관리', '산업 현장, 공장, 설비 운영사'],
            ['상생·안전 리포트', '대기업, 공공기관'],
          ]}
        />
      </NumberedSection>

      {/* ── Partnership CTA ── */}
      <section style={{ background: NAVY, padding: '56px 20px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
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
