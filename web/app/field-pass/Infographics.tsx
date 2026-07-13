'use client';

import { Fragment } from 'react';
import styles from './infographics.module.css';

const NAVY = '#0b1224';
const MINT = { color: '#047857', bg: '#ecfdf5', border: '#a7f3d0' };

type Step = { icon: string; label: string; sub?: string; highlight?: boolean };

function Timeline({ steps }: { steps: Step[] }) {
  return (
    <div className={styles.timeline}>
      {steps.map((s, i) => (
        <Fragment key={i}>
          <div className={styles.timelineStep}>
            <div className={`${styles.timelineIcon} ${s.highlight ? styles.timelineIconHighlight : ''}`}>{s.icon}</div>
            <div>
              <div className={styles.timelineLabel} style={s.highlight ? { color: '#047857' } : undefined}>{s.label}</div>
              {s.sub && <div className={styles.timelineSub}>{s.sub}</div>}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div className={styles.timelineConnector}>→</div>
          )}
        </Fragment>
      ))}
    </div>
  );
}

function InfographicShell({
  eyebrow,
  title,
  caption,
  children,
}: {
  eyebrow: string;
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.86)', border: '1px solid rgba(36,91,255,0.16)', borderRadius: 16, padding: '26px 24px', boxShadow: '0 14px 36px rgba(15,23,42,0.06)' }}>
      <div style={{ fontSize: 11.5, fontWeight: 850, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{eyebrow}</div>
      <div style={{ fontSize: 18, fontWeight: 900, color: NAVY, wordBreak: 'keep-all' }}>{title}</div>
      {children}
      <p style={{ fontSize: 13, color: '#475569', fontWeight: 650, lineHeight: 1.65, margin: '20px 0 0', wordBreak: 'keep-all', borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
        {caption}
      </p>
    </div>
  );
}

function MiniChips({ items, color }: { items: string[]; color: string }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginTop: 6 }}>
      {items.map((it, i) => (
        <span key={it} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', background: '#fff', border: `1px solid ${color}44`, borderRadius: 8, padding: '4px 10px', whiteSpace: 'nowrap' }}>{it}</span>
          {i < items.length - 1 && <span style={{ color: '#cbd5e1', fontSize: 12 }}>→</span>}
        </span>
      ))}
    </div>
  );
}

// 인포그래픽 · Why MONO — Hero 바로 아래. "왜 MONO가 Field Pass를 만드는가"를
// 성장→인증→권한까지 하나의 체인으로 한눈에 보여준다 (VC·센스톤 공통 진입점).
export function WhyMonoInfographic() {
  return (
    <InfographicShell
      eyebrow="Infographic · Why MONO"
      title="왜 MONO가 Field Pass를 만드는가"
      caption="일한 기록이 경력이 되고, 경력이 Field Pass가 되며, Field Pass가 현장 권한이 됩니다."
    >
      <Timeline
        steps={[
          { icon: '👷', label: '일용직' },
          { icon: '🎓', label: '교육' },
          { icon: '📋', label: '준비완료' },
          { icon: '🦺', label: '조공' },
          { icon: '👷‍♂️', label: '건설근로자' },
          { icon: '🪪', label: 'MONO Field Pass', highlight: true },
          { icon: '📱', label: 'App Pass' },
          { icon: '🏗️', label: '출입' },
          { icon: '📈', label: '경력' },
          { icon: '⭐', label: '신뢰' },
          { icon: '🔐', label: '권한' },
        ]}
      />
    </InfographicShell>
  );
}

// 인포그래픽 · 기존 건설 전자카드 vs MONO — "카드 발급"이 아니라 "성장 기록"이
// 중심이라는 차이를, 두 흐름을 나란히 놓고 비교해서 보여준다.
export function LegacyVsMonoInfographic() {
  return (
    <InfographicShell
      eyebrow="Infographic · Legacy vs MONO"
      title="기존 건설 전자카드 vs MONO Field Pass"
      caption="기존 전자카드는 출입에서 끝나지만, MONO Field Pass는 경력·정산·권한까지 하나의 흐름으로 이어집니다."
    >
      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 11.5, fontWeight: 850, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>기존 건설 전자카드</div>
        <Timeline
          steps={[
            { icon: '🎓', label: '교육' },
            { icon: '💳', label: '전자카드' },
            { icon: '🚪', label: '출입' },
            { icon: '⏹️', label: '종료' },
          ]}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 11.5, fontWeight: 850, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>MONO Field Pass</div>
        <Timeline
          steps={[
            { icon: '🎓', label: '교육' },
            { icon: '🦺', label: '조공' },
            { icon: '📈', label: '경력' },
            { icon: '🪪', label: 'Field Pass', highlight: true },
            { icon: '🚪', label: '출입' },
            { icon: '📈', label: '경력' },
            { icon: '💰', label: '정산' },
            { icon: '🔐', label: '권한' },
          ]}
        />
      </div>
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: 11.5, fontWeight: 850, color: '#64748b', marginBottom: 6 }}>적용 영역</div>
        <MiniChips items={['건설 현장', '아파트', '오피스', 'OT 설비']} color="#4f46e5" />
      </div>
    </InfographicShell>
  );
}

// 인포그래픽 · OTAC 기반 앱 출입 인증 PoC 흐름 (OTAC 섹션)
export function OtacPocInfographic() {
  const layers: { label: string; items: string[]; color: string }[] = [
    { label: '사용자', items: ['MONO 앱', 'Field Pass'], color: '#2563eb' },
    { label: '인증', items: ['OTAC 인증값', 'QR/NFC'], color: '#9333ea' },
    { label: '현장', items: ['게이트', '관리자 앱', '출입 승인'], color: '#ea580c' },
    { label: '데이터', items: ['출근 기록', '경력카드', '정산', '기업 Dashboard'], color: '#059669' },
    { label: '확장', items: ['실물 카드', '아파트·오피스', '중장비·OT'], color: '#64748b' },
  ];
  return (
    <InfographicShell
      eyebrow="Infographic · OTAC PoC"
      title="센스톤 OTAC 기반 앱 출입 인증 PoC"
      caption="먼저 앱으로 출입 인증을 검증하고, 이후 카드·NFC·BLE·장비 권한으로 확장합니다."
    >
      <Timeline
        steps={[
          { icon: '📲', label: 'MONO APP' },
          { icon: '🔑', label: 'OTAC', highlight: true },
          { icon: '🚪', label: '출입 승인' },
          { icon: '🕒', label: '출근 기록' },
          { icon: '📈', label: '경력' },
          { icon: '💰', label: '정산' },
          { icon: '🖥️', label: '기업 Dashboard' },
        ]}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginTop: 22 }}>
        {layers.map((l) => (
          <div key={l.label} style={{ border: `1.5px solid ${l.color}33`, borderRadius: 12, padding: '10px 12px' }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: l.color, marginBottom: 4 }}>{l.label}</div>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, lineHeight: 1.6 }}>{l.items.join(' · ')}</div>
          </div>
        ))}
      </div>
    </InfographicShell>
  );
}

// 인포그래픽 · 권한 레이어 아키텍처 (Permission 섹션, 세로 스택)
export function PermissionLayerInfographic() {
  const layers = [
    { icon: '🪪', label: 'Identity', desc: '사용자 본인 확인 · 성장 기록 기반 프로필', color: '#2563eb' },
    { icon: '💳', label: 'Credential', desc: '앱 패스 · 실물 카드 · QR/NFC', color: '#9333ea' },
    { icon: '🚪', label: 'Access', desc: '현장 · 아파트 · 오피스 출입', color: '#059669' },
    { icon: '🛡️', label: 'Permission', desc: '교육·자격 기반 출입 권한 확인', color: '#ea580c' },
    { icon: '🚜', label: 'Equipment', desc: '지게차·굴착기·크레인 등 장비 사용 권한', color: '#b45309' },
    { icon: '🏭', label: 'Industrial OT', desc: '산업 설비 · 제어 장비 · 보안구역 접근', color: '#334155' },
  ];
  return (
    <InfographicShell
      eyebrow="Infographic · Permission"
      title="출입 카드에서 현장 권한 관리 카드로"
      caption="MONO Field Pass는 출입 가능한 사람을 확인하고, 나아가 자격과 현장 권한을 확인한 뒤 장비 사용 승인과 연동합니다."
    >
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
        {layers.map((l, i) => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none', width: 44 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff', border: `2px solid ${l.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flex: 'none' }}>{l.icon}</div>
              {i < layers.length - 1 && <div style={{ flex: 1, width: 2, background: '#e2e8f0', minHeight: 18 }} />}
            </div>
            <div style={{ flex: 1, paddingLeft: 14, paddingBottom: i < layers.length - 1 ? 16 : 0 }}>
              <div style={{ display: 'inline-block', fontSize: 12.5, fontWeight: 900, color: '#fff', background: l.color, padding: '2px 10px', borderRadius: 6, marginBottom: 4 }}>{l.label}</div>
              <div style={{ fontSize: 13, color: '#475569', fontWeight: 650, wordBreak: 'keep-all' }}>{l.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: 11.5, fontWeight: 850, color: '#64748b', marginBottom: 6 }}>적용 현장</div>
        <MiniChips items={['건설현장', '아파트', '오피스', '공장', '물류', 'Smart Facility']} color="#334155" />
      </div>
    </InfographicShell>
  );
}

// 인포그래픽 · MONO Data Loop — 이 페이지에서 가장 중요한 그림.
// 출입이 데이터가 되고, 데이터가 신뢰가 되어 더 좋은 현장으로 돌아오는 네트워크 효과 루프.
export function DataLoopInfographic() {
  const steps = ['출입', '출근', '작업', '공수', '정산', '경력', '신뢰', '더 좋은 현장', '더 높은 급여'];
  return (
    <InfographicShell
      eyebrow="Infographic · MONO Data Loop"
      title="데이터가 쌓일수록 강해지는 구조"
      caption="출입이 출근이 되고, 출근이 경력과 신뢰가 되어 더 좋은 현장과 더 높은 급여로 이어지고, 다시 출입으로 돌아옵니다 — MONO가 쌓을수록 커지는 Network Effect입니다."
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 22 }}>
        {steps.map((s, i) => (
          <Fragment key={s}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#312e81', background: '#eef2ff', border: '1px solid rgba(79,70,229,0.25)', borderRadius: 999, padding: '8px 14px', whiteSpace: 'nowrap' }}>
              {s}
            </span>
            <span style={{ color: '#a5b4fc', fontSize: 15 }}>→</span>
          </Fragment>
        ))}
        <span style={{ color: '#4f46e5', fontSize: 15, fontWeight: 900 }}>↩</span>
        <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', background: '#4f46e5', borderRadius: 999, padding: '8px 14px', whiteSpace: 'nowrap' }}>
          다시 출입
        </span>
      </div>
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <span style={{ fontSize: 11.5, fontWeight: 900, color: '#4f46e5', background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.25)', borderRadius: 999, padding: '5px 14px' }}>
          🔁 Network Effect
        </span>
      </div>
    </InfographicShell>
  );
}

// 인포그래픽 · Architecture v2 — 인증 시스템이 아니라 "성장→신원→인증→출입→근무→데이터→신뢰→플랫폼"
// 구조로 MONO가 왜 필요한지 먼저 보여주기 위한 아키텍처(투자자·센스톤 공통 관점).
export function ArchitectureV2Infographic() {
  const steps: { n: number; key: string; label: string; color: string; items: string[] }[] = [
    { n: 1, key: 'growth', label: 'Growth (성장)', color: '#2563eb', items: ['일용직', '기초안전교육', '준비서류(전자카드·계좌·신체검사)', '조공', '건설근로자'] },
    { n: 2, key: 'identity', label: 'Identity (신원)', color: '#4338ca', items: ['성장 기록 기반 프로필', '본인 확인', '신원 검증'] },
    { n: 3, key: 'credential', label: 'Credential (인증)', color: '#9333ea', items: ['MONO APP PASS', 'OTAC Dynamic Token', 'QR · NFC · BLE · Physical Card'] },
    { n: 4, key: 'access', label: 'Access (출입)', color: '#059669', items: ['건설현장·아파트·오피스·공장·물류센터·공공시설', '출입 승인 → 출근 체크 → 작업 시작 → 작업 종료'] },
    { n: 5, key: 'work', label: 'Work (근무)', color: '#0d9488', items: ['작업 기록', '공수 관리', '휴게/작업 관리'] },
    { n: 6, key: 'data', label: 'Data (데이터)', color: '#0891b2', items: ['출근기록', '공수', '정산', '경력카드', '신뢰 프로필', '기업 운영 리포트'] },
    { n: 7, key: 'trust', label: 'Trust (신뢰)', color: '#b45309', items: ['검증된 근무 이력', '신뢰 프로필 점수', '평판 데이터'] },
    { n: 8, key: 'platform', label: 'Platform (플랫폼)', color: '#334155', items: ['Construction', 'Smart Apartment', 'Smart Office', 'Industrial Factory', 'OT/ICS Access', 'Financial & Insurance'] },
  ];
  return (
    <InfographicShell
      eyebrow="MONO Field Pass Architecture v2"
      title="성장이 신원이 되고, 신원이 인증이 되어 산업 플랫폼으로 확장됩니다"
      caption="MONO Field Pass → Digital Identity → Digital Access → Digital Permission → Industrial Trust Platform. MONO는 건설 전자카드를 만드는 회사가 아니라, 현장 근무자의 Digital Identity Platform입니다."
    >
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
        {steps.map((s, i) => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none', width: 44 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: s.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, flex: 'none' }}>
                {s.n}
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, width: 2, background: '#e2e8f0', minHeight: 12 }} />}
            </div>
            <div style={{ flex: 1, paddingLeft: 14, paddingBottom: i < steps.length - 1 ? 18 : 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 900, color: s.color }}>STEP {s.n} · {s.label}</div>
              <MiniChips items={s.items} color={s.color} />
            </div>
          </div>
        ))}
      </div>
    </InfographicShell>
  );
}

// 인포그래픽 · 확장 로드맵 (Expansion Roadmap 섹션)
export function ExpansionInfographic() {
  return (
    <InfographicShell
      eyebrow="Infographic · Expansion Roadmap"
      title="건설 현장에서 산업 전반의 Identity Platform으로 확장"
      caption="건설 현장에서 검증한 Field Pass는 반도체·조선·플랜트 같은 대형 산업 현장과 아파트·오피스·공장을 거쳐, 산업 전반의 Digital Identity Platform으로 확장됩니다."
    >
      <Timeline
        steps={[
          { icon: '🏗️', label: 'Construction' },
          { icon: '🔬', label: 'Semiconductor' },
          { icon: '🚢', label: 'Shipbuilding' },
          { icon: '🏭', label: 'Plant' },
          { icon: '🏢', label: 'Apartment' },
          { icon: '🏬', label: 'Office' },
          { icon: '⚙️', label: 'Factory' },
          { icon: '🏙️', label: 'Smart Facility' },
          { icon: '🌐', label: 'Industrial Identity Platform', highlight: true },
        ]}
      />
    </InfographicShell>
  );
}

// 인포그래픽 · MONO + Sensstone — VC가 가장 이해하기 쉬운 결합 구조.
// OTAC/센스톤 구간은 서면 협력 합의 전 단계이므로 TECH REVIEW로 명확히 표기.
export function MonoSensstoneInfographic() {
  const nodes = [
    { icon: '🧑‍🔧', label: 'MONO Growth Platform', desc: 'Workforce · 성장 기록', color: '#2563eb' },
    { icon: '🪪', label: 'Field Pass', desc: '성장 기록 기반 발급', color: '#059669' },
    { icon: '🔑', label: 'OTAC Authentication', desc: '센스톤 · 출입 인증 기술 검토', color: '#047857', partner: true },
    { icon: '🚪', label: 'Access Permission', desc: '현장·아파트·오피스 출입', color: '#ea580c' },
    { icon: '🚜', label: 'Equipment Permission', desc: '중장비·설비 사용 권한', color: '#b45309' },
    { icon: '🏭', label: 'Industrial OT', desc: '산업 제어·보안구역 접근', color: '#334155' },
    { icon: '🌐', label: 'Digital Identity Platform', desc: '산업 전반 신원 인프라', color: '#1e3a8a' },
  ];
  return (
    <InfographicShell
      eyebrow="Infographic · MONO + Sensstone"
      title="MONO의 성장 데이터 + 센스톤의 OTAC 인증 기술"
      caption="MONO의 성장·근태·경력 데이터와 센스톤의 OTAC 인증 기술이 결합되면, Field Pass는 출입 인증을 넘어 산업 전반의 Digital Identity Platform으로 확장됩니다."
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 22, gap: 0 }}>
        {nodes.map((n, i) => (
          <Fragment key={n.label}>
            <div
              style={{
                width: '100%',
                maxWidth: 420,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: n.partner ? MINT.bg : '#fff',
                border: `1.5px solid ${n.partner ? MINT.border : n.color + '33'}`,
                borderRadius: 14,
                padding: '12px 16px',
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: n.color, color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                {n.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13.5, fontWeight: 900, color: NAVY }}>{n.label}</span>
                  {n.partner && (
                    <span style={{ fontSize: 10, fontWeight: 900, color: MINT.color, background: '#fff', border: `1px solid ${MINT.border}`, padding: '2px 8px', borderRadius: 999, whiteSpace: 'nowrap' }}>
                      TECH REVIEW
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginTop: 2, wordBreak: 'keep-all' }}>{n.desc}</div>
              </div>
            </div>
            {i < nodes.length - 1 && <div style={{ color: '#cbd5e1', fontSize: 16, padding: '4px 0' }}>↓</div>}
          </Fragment>
        ))}
      </div>
    </InfographicShell>
  );
}
