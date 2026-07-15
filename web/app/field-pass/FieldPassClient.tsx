'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';
import {
  UnifiedFieldPassFlow,
  LegacyVsMonoInfographic,
  GlobalCredentialLandscapeInfographic,
  OtacPocInfographic,
  WhySensstoneInfographic,
  PermissionLayerInfographic,
  DataLoopInfographic,
  ExpansionInfographic,
  MonoSensstonePartnership,
  ZoomableImage,
} from './Infographics';
import styles from './strategy.module.css';

// ─────────────────────────────────────────────
// MONO Field Pass 소개 페이지 — VC 투자자·센스톤 대표 공유용
// 톤: /strategy(전략 페이지)와 동일한 웜톤 오프화이트 + 인디고 + 블루프린트 그리드.
// 구조 v6(docs/field-pass-infographic-request.md 반영 + Why MONO/Growth Journey
//     통합): 각 설명 섹션 바로 아래에 Infographic Kit v1.0(SVG 6종,
//     InfographicsKit.tsx)을 1:1로 배치. 섹션 순서: Hero(앵커 내비) → 문제 정의 →
//     Why MONO(성장 여정 + 인증·권한 통합 인포그래픽) → 기존 전자카드 vs MONO →
//     Global Credential Landscape(해외 사례 비교) → OTAC Authentication Flow →
//     Permission Architecture → MONO Data Loop → Expansion Roadmap →
//     MONO × Sensstone → Business Model → CTA.
// Why MONO 통합: 예전에는 "Why MONO"(성장 흐름 요약 인포그래픽 + 참고 패널 PNG)와
//     별도 "Growth Journey" 섹션(GrowthJourneyGraphic)이 같은 성장 흐름을 두 번
//     보여줬다. 참고 패널 PNG의 이해 구조(성장 여정 + 인증·권한 흐름을 한 화면에
//     세로로 연결)를 기준으로 UnifiedFieldPassFlow.tsx 하나로 통합했고,
//     Growth Journey 섹션과 참고 패널 PNG, GrowthJourneyGraphic.tsx는 제거했다.
// 이전 구조 대비 그 외 제거한 것: OTAC 섹션의 PoC 목표·최소기능 상세 표(내부
//     백로그 성격 — docs 문서로 이동), System Architecture·Digital Identity
//     Evolution 8단계 목록(Permission Architecture SVG가 동일한 인증 계층을 표현),
//     MONO Brand Architecture(최종 페이지 순서에서 제외). 상세 근거는
//     docs/field-pass-infographic-request.md 참고.
// Global Credential Landscape: 해외 사례(북유럽 법정 전자카드/영미권 모바일 월렛·
//     디지털 자격/산업현장 NFC·BLE)가 빠지면 "글로벌 스탠다드 가능성"이 선언처럼
//     보일 수 있어 추가된 근거 섹션 — '기존 전자카드 vs MONO' 아래, OTAC 섹션 위 배치.
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

      {/* ── 1. Hero (인포그래픽 없음, CTA 2개 + 앵커 내비게이션) ── */}
      <section className={`${styles.section} ${styles.blueprint}`} style={{ paddingBottom: 40 }}>
        <div className={styles.container}>
          <h1 className={styles.hDisplay}>
            현장 근무자의 성장 기록이<br />출입과 장비 권한이 됩니다
          </h1>
          <div style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.25rem)', fontWeight: 850, color: INDIGO, marginTop: 6, wordBreak: 'keep-all' }}>
            Industrial Digital Identity Platform
          </div>
          <p className={styles.bodyLg}>
            MONO Field Pass는 교육, 자격, 현장 경험과 근무 기록을 기반으로 사용자의 출입 권한을 확인하고, 장비·차량·OT 시스템의 사용 승인으로 확장하는 산업 현장 인증 플랫폼입니다.
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
              Why Sensstone 보기
            </button>
          </div>
          <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(36,91,255,0.12)' }}>
            {[
              { label: '문제 정의', id: 'problem' },
              { label: '왜 MONO', id: 'why' },
              { label: '글로벌 사례', id: 'global' },
              { label: '모바일 인증', id: 'otac-poc' },
              { label: '권한 구조', id: 'permission' },
              { label: '확장 로드맵', id: 'roadmap' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { track('field_pass_anchor_nav_clicked', { target: item.id }); scrollTo(item.id); }}
                style={{ padding: '7px 14px', background: 'transparent', color: '#475569', border: '1px solid rgba(36,91,255,0.18)', borderRadius: 999, fontSize: 12.5, fontWeight: 750, cursor: 'pointer' }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* ── 2. 문제 정의 ── */}
      <NumberedSection id="problem" num="01" eyebrow="Problem" title="현장 출입과 근무자의 성장 기록은 따로 관리되고 있습니다" onView={() => track('field_pass_problem_viewed', {})}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 20 }}>
          <div className={styles.card}>
            <p style={{ fontSize: 14.5, color: '#0a0f1a', fontWeight: 800, lineHeight: 1.6, margin: 0, wordBreak: 'keep-all' }}>
              교육·자격·경력 정보가 분산됩니다
            </p>
          </div>
          <div className={styles.card}>
            <p style={{ fontSize: 14.5, color: '#0a0f1a', fontWeight: 800, lineHeight: 1.6, margin: 0, wordBreak: 'keep-all' }}>
              출입 기록이 경력 자산으로 이어지기 어렵습니다
            </p>
          </div>
          <div className={styles.card}>
            <p style={{ fontSize: 14.5, color: '#0a0f1a', fontWeight: 800, lineHeight: 1.6, margin: 0, wordBreak: 'keep-all' }}>
              출입 권한과 장비 사용 권한이 분리되어 있습니다
            </p>
          </div>
        </div>
      </NumberedSection>

      {/* ── 3. Why MONO — 성장 여정 + 인증·권한 통합 인포그래픽 (완성형 SVG, 자체 헤더 포함) ── */}
      <section id="why" className={`${styles.section} ${styles.sectionAlt}`} onMouseEnter={() => track('field_pass_why_mono_viewed', {})}>
        <div className={styles.container}>
          <UnifiedFieldPassFlow />
        </div>
      </section>

      {/* ── 4. 기존 건설 전자카드 vs MONO ── */}
      <NumberedSection id="concept" num="03" eyebrow="Legacy vs MONO" title="성장한 결과로 발급되는 카드입니다" onView={() => track('field_pass_concept_viewed', {})}>
        <LegacyVsMonoInfographic />
        <Callout>
          MONO Field Pass는 사람이 현장에 들어갈 준비를 갖추고 성장한 결과로 발급되는 인증입니다.
        </Callout>
        <ZoomableImage compact maxWidth={640} src="/field-pass/panel-02-legacy-vs-mono.png" alt="기존 전자카드 vs MONO Field Pass 참고 패널" caption="참고 패널 · 기존 전자카드 vs MONO Field Pass" />
      </NumberedSection>

      {/* ── 5. Global Credential Landscape (해외 사례 비교) ── */}
      <NumberedSection id="global" num="04" eyebrow="Global Credential Landscape" title="글로벌 현장 인증은 이미 카드에서 디지털 자격·권한으로 이동하고 있습니다" alt onView={() => track('field_pass_global_landscape_viewed', {})}>
        <p style={{ fontSize: 14, color: '#475569', fontWeight: 650, lineHeight: 1.75, margin: '0 0 20px', wordBreak: 'keep-all' }}>
          MONO Field Pass는 해외의 전자 인력카드, 모바일 출입증, 디지털 스킬 패스포트, 저전력 인증 방식을 하나의 성장형 권한 구조로 연결합니다.
        </p>

        <InfoTable
          cols={['글로벌 유형', '대표 사례', '핵심 특징', 'MONO 적용 방향']}
          rows={[
            ['법정 전자 인력카드', '스웨덴 ID06, 노르웨이 HMS-kort, 핀란드 Valtti', '근로자 신원, 현장 출입, 전자 인력대장', '현장 준비 상태·출근·경력 연결'],
            ['모바일 출입 자격증명', 'Apple Wallet Employee Badge, Google Wallet 계열', '휴대폰·워치 기반 NFC 출입, 원격 발급·정지', 'MONO App Pass·저전력 인증'],
            ['디지털 자격 패스포트', '영국 CSCS, 호주 MyPass Global', '자격·교육·스킬 검증', '조공·기공 성장 데이터와 권한 연결'],
            ['현장·장비 인증', 'myComply, Biosite, 산업 출입 솔루션', 'NFC·BLE·생체·자격 기반 접근', '장비·중장비·OT 권한 확장'],
          ]}
        />

        <p style={{ fontSize: 12.5, color: '#94a3b8', fontWeight: 600, lineHeight: 1.65, margin: '12px 0 0', wordBreak: 'keep-all' }}>
          북유럽은 법정 전자 인력카드형, 영미권은 모바일 월렛·생체·디지털 자격여권형으로 각각 발전해 왔으며, 건설·조선 현장에서 이미 상용화된 흐름입니다. Apple Wallet 계열은 배터리 잔량이 매우 낮은 상황에서도 Express Mode 기반 NFC 출입을 지원하고, HID 계열 사원증은 Secure Element 기반 원격 발급·정지 모델을 제공합니다.
        </p>

        <div style={{ marginTop: 28 }}>
          <GlobalCredentialLandscapeInfographic />
        </div>

        <Callout>
          해외는 신원, 출입, 자격, 장비 접근을 각각 발전시켜 왔습니다. MONO Field Pass는 이를 현장 근무자의 성장 데이터와 연결해 하나의 산업 권한 구조로 확장합니다.
        </Callout>

        <div style={{ fontSize: 12.5, fontWeight: 800, color: '#64748b', marginTop: 8, marginBottom: 4 }}>MONO의 차별성</div>
        <InfoTable
          cols={['차별성', '설명']}
          rows={[
            ['성장 기반 발급', '일용직 → 교육 → 조공 → 기공 성장 흐름과 연결'],
            ['현장 데이터 연결', '출입, 출근, 작업, 경력, 받을 금액을 하나의 프로필에 축적'],
            ['저전력·다중 인증', '앱, NFC, BLE, QR, 카드, OTAC 기반 인증 조합'],
            ['권한 확장', '공간 출입에서 중장비·차량·OT 기기 사용 승인으로 확장'],
          ]}
        />
      </NumberedSection>

      {/* ── 6. 모바일·저전력 인증 구조 (OTAC Flow) ── */}
      <NumberedSection id="otac-poc" num="05" eyebrow="OTAC Authentication Flow" title="모바일·저전력 인증으로 출입을 확인합니다" onView={() => track('field_pass_otac_viewed', {})}>
        <p style={{ fontSize: 14, color: '#475569', fontWeight: 650, lineHeight: 1.7, margin: '0 0 8px', wordBreak: 'keep-all' }}>
          MONO 앱에서 생성한 인증값을 현장 단말이 확인하고, 출입 결과를 근무·경력 데이터로 연결합니다. 센스톤과의 기술 협력에서는 모바일 인증, 저전력 인증, 오프라인·제한망 환경 적용 가능성을 함께 검토합니다.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 16px' }}>
          <StatusBadge tone="mint">검증 예정</StatusBadge>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 650 }}>서면 협력 합의 전 · 기술 협력 제안·PoC 검토 단계</span>
        </div>
        <OtacPocInfographic />
      </NumberedSection>

      {/* ── 7. 출입·장비·OT 권한 구조 (Permission Architecture) ── */}
      <NumberedSection id="permission" num="06" eyebrow="Permission Architecture" title="출입에서 장비·OT 권한으로 확장" alt onView={() => track('field_pass_infographic_permission_viewed', {})}>
        <PermissionLayerInfographic />
      </NumberedSection>

      {/* ── 8. MONO 데이터 선순환 (Data Loop) ── */}
      <NumberedSection id="data-loop" num="07" eyebrow="MONO Data Loop" title="근무 기록이 더 좋은 기회로 이어지는 데이터 선순환" onView={() => track('field_pass_data_loop_viewed', {})}>
        <DataLoopInfographic />
      </NumberedSection>

      {/* ── 9. 확장 로드맵 (Expansion Roadmap) ── */}
      <NumberedSection id="roadmap" num="08" eyebrow="Expansion Roadmap" title="건설 현장에서 글로벌 산업 인증 구조로" alt onView={() => track('field_pass_expansion_roadmap_viewed', {})}>
        <p style={{ fontSize: 14, color: '#475569', fontWeight: 650, lineHeight: 1.7, margin: '0 0 16px', wordBreak: 'keep-all' }}>
          국내 건설 현장에서 출입·근무 인증을 검증하고, Field Pass 카드, 아파트·오피스 같은 생활 공간, 중장비·차량, OT 산업 설비 권한으로 단계적으로 확장합니다.
        </p>
        <ExpansionInfographic />
      </NumberedSection>

      {/* ── 10. MONO × 센스톤 공동 제안 ── */}
      <NumberedSection id="partnership" num="09" eyebrow="MONO × Sensstone" title="MONO의 현장 데이터와 센스톤의 인증 기술을 연결합니다" onView={() => track('field_pass_mono_sensstone_viewed', {})}>
        <p style={{ fontSize: 14, color: '#475569', fontWeight: 650, lineHeight: 1.7, margin: '0 0 20px', wordBreak: 'keep-all' }}>
          MONO는 현장 근무자의 성장·교육·자격·경력 데이터를 구축합니다. 센스톤과 함께 모바일 인증, 저전력 인증, 출입 권한, 장비·OT 사용 승인으로 이어지는 글로벌 확장형 인증 구조를 설계하고자 합니다.
        </p>
        <WhySensstoneInfographic />
        <div style={{ marginTop: 24 }}>
          <MonoSensstonePartnership />
        </div>
        <ZoomableImage compact maxWidth={640} src="/field-pass/panel-08-sensstone.png" alt="MONO + Sensstone 파트너십 시너지 참고 패널" caption="참고 패널 · MONO + Sensstone" />
      </NumberedSection>

      {/* ── 11. Business Model ── */}
      <NumberedSection num="10" eyebrow="Business Model" title="Field Pass 수익모델" alt onView={() => track('field_pass_bm_viewed', {})}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          <div className={styles.card}>
            <div style={{ fontSize: 11, fontWeight: 850, color: '#059669', letterSpacing: '0.04em', marginBottom: 10 }}>초기 검증</div>
            <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: 13.5, color: '#334155', fontWeight: 650, lineHeight: 1.9, wordBreak: 'keep-all' }}>
              <li>Field Pass 현장 구독</li>
              <li>출입·출근 운영 리포트</li>
              <li>인증 시스템 연동</li>
            </ul>
          </div>
          <div className={styles.card}>
            <div style={{ fontSize: 11, fontWeight: 850, color: INDIGO, letterSpacing: '0.04em', marginBottom: 10 }}>확장</div>
            <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: 13.5, color: '#334155', fontWeight: 650, lineHeight: 1.9, wordBreak: 'keep-all' }}>
              <li>장비 권한 API</li>
              <li>OT 접근 권한 관리</li>
              <li>아파트·오피스 출입 SaaS</li>
              <li>카드·금융·보험 제휴</li>
            </ul>
          </div>
        </div>
        <Callout>
          초기 검증은 앱 기반 출입 인증 PoC와 현장 출입·출근 운영 리포트, 두 가지에 집중합니다. 가격은 아직 검증 전 단계라 표시하지 않습니다.
        </Callout>
      </NumberedSection>

      {/* ── 12. Partnership CTA ── */}
      <section style={{ background: NAVY, padding: '56px 20px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 850, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Vision 2030</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20, fontSize: 12.5, fontWeight: 800 }}>
            <span style={{ color: 'rgba(226,232,240,0.6)' }}>Today · Construction Workforce</span>
            <span style={{ color: '#475569' }}>→</span>
            <span style={{ color: 'rgba(226,232,240,0.75)' }}>2027 · Field Pass</span>
            <span style={{ color: '#475569' }}>→</span>
            <span style={{ color: 'rgba(226,232,240,0.85)' }}>2028 · Industrial Access</span>
            <span style={{ color: '#475569' }}>→</span>
            <span style={{ color: '#e0e7ff' }}>2029 · Digital Permission</span>
            <span style={{ color: '#475569' }}>→</span>
            <span style={{ color: '#fff' }}>2030 · Global Industrial Identity Platform</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(226,232,240,0.6)', fontWeight: 600, margin: '0 auto 24px', maxWidth: 520, wordBreak: 'keep-all' }}>
            지금은 초기 검증 단계이며, 위 로드맵은 글로벌 확장이 가능한 구조로 설계한 목표 방향입니다.
          </p>
          <div style={{ border: '1px solid rgba(255,255,255,0.16)', borderRadius: 16, padding: '20px 24px', margin: '0 auto 28px', maxWidth: 560 }}>
            <p style={{ fontSize: 15, color: '#fff', fontWeight: 850, lineHeight: 1.75, margin: 0, wordBreak: 'keep-all' }}>
              MONO Field Pass는 현장 근무자의 성장 데이터를 기반으로 출입, 권한, 장비, 산업 시스템을 연결하는 Workforce Credential Platform입니다.
            </p>
          </div>
          <div style={{ maxWidth: 560, margin: '0 auto 24px' }}>
            <ZoomableImage compact maxWidth={560} src="/field-pass/panel-09-investment.png" alt="Investment Story 참고 패널" caption="참고 패널 · Investment Story" />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20, fontSize: 13, fontWeight: 800, color: '#a5b4fc' }}>
            <span>Field Pass</span><span style={{ color: '#475569' }}>→</span>
            <span>Digital Identity</span><span style={{ color: '#475569' }}>→</span>
            <span>Digital Access</span><span style={{ color: '#475569' }}>→</span>
            <span>Digital Permission</span><span style={{ color: '#475569' }}>→</span>
            <span style={{ color: '#fff' }}>Industrial Trust Platform</span>
          </div>
          <div style={{ borderLeft: '3px solid #4f46e5', background: 'rgba(79,70,229,0.1)', borderRadius: '0 12px 12px 0', padding: '18px 22px', margin: '0 auto 28px', maxWidth: 560, textAlign: 'left' }}>
            <p style={{ fontSize: 14.5, color: '#fff', fontWeight: 650, lineHeight: 1.8, margin: 0, wordBreak: 'keep-all' }}>
              센스톤은 세계 최고의 인증 기술을 만들고 있습니다. MONO는 산업 현장의 성장 데이터와 Workforce 플랫폼을 만들고 있습니다.
              <br /><br />
              우리가 함께 만들고 싶은 것은 산업 현장의 Digital Identity 표준으로 확장 가능한 구조입니다.
            </p>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 950, color: '#fff', margin: '0 0 14px', wordBreak: 'keep-all' }}>
            센스톤과 함께 산업 현장의 새로운 인증 구조를 설계합니다
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(226,232,240,0.8)', fontWeight: 600, lineHeight: 1.75, margin: '0 auto 28px', maxWidth: 560, wordBreak: 'keep-all' }}>
            MONO의 현장 성장 데이터와 센스톤의 인증 기술을 연결해 모바일 출입, 저전력 인증, 현장 권한, 장비·OT 사용 승인으로 이어지는 구조를 함께 검토합니다.
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
