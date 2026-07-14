'use client';

import { Fragment, useState } from 'react';
import styles from './infographics.module.css';

const NAVY = '#0b1224';
const MINT = { color: '#047857', bg: '#ecfdf5', border: '#a7f3d0' };

type Step = { icon: string; label: string; sub?: string; highlight?: boolean; badge?: string; color?: string };

function Timeline({ steps }: { steps: Step[] }) {
  return (
    <div className={styles.timeline}>
      {steps.map((s, i) => (
        <Fragment key={i}>
          <div className={styles.timelineStep}>
            <div
              className={`${styles.timelineIcon} ${s.highlight ? styles.timelineIconHighlight : ''}`}
              style={s.color && !s.highlight ? { borderColor: s.color, background: `${s.color}14` } : undefined}
            >
              {s.icon}
            </div>
            <div>
              <div className={styles.timelineLabel} style={s.highlight ? { color: '#047857' } : s.color ? { color: s.color } : undefined}>{s.label}</div>
              {s.sub && <div className={styles.timelineSub}>{s.sub}</div>}
              {s.badge && (
                <div style={{ marginTop: 5 }}>
                  <span style={{ fontSize: 9.5, fontWeight: 900, color: '#fff', background: s.color || '#4f46e5', borderRadius: 999, padding: '2px 8px', whiteSpace: 'nowrap' }}>
                    {s.badge}
                  </span>
                </div>
              )}
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
// 성장→인증 6단계 체인으로 한눈에 보여준다 (VC·센스톤 공통 진입점).
export function WhyMonoInfographic() {
  return (
    <InfographicShell
      eyebrow="Infographic · Why MONO"
      title="왜 MONO가 Field Pass를 만드는가"
      caption="일한 기록이 경력이 되고, 경력이 Field Pass가 되며, Field Pass가 현장 권한으로 이어집니다."
    >
      <Timeline
        steps={[
          { icon: '👷', label: '일용직', sub: '단순 현장 근무' },
          { icon: '🎓', label: '교육', sub: '기초안전교육' },
          { icon: '📋', label: '준비 완료', sub: '서류·계좌·자격' },
          { icon: '🦺', label: '조공 경험', sub: '현장 경험 축적' },
          { icon: '👷‍♂️', label: '건설근로자', sub: '신뢰 프로필 완성' },
          { icon: '🪪', label: 'MONO Field Pass', sub: '앱·카드 인증 활성화', highlight: true },
        ]}
      />
    </InfographicShell>
  );
}

// 인포그래픽 · Growth Journey — 현장 근무자의 성장 여정을 "단계별로 쌓이는 데이터"
// 관점에서 보여준다 (Why MONO의 정체성 체인과는 별개로, 근태·평가 데이터 축적 흐름).
export function GrowthJourneyInfographic() {
  return (
    <InfographicShell
      eyebrow="Infographic · Growth Journey"
      title="현장 근무자의 성장 여정"
      caption="MONO는 단순 근무 기록을 기술자의 성장 데이터로 연결합니다."
    >
      <Timeline
        steps={[
          { icon: '👷', label: '오늘 현장', sub: '첫 지원·근무 기록' },
          { icon: '🎓', label: '교육', sub: '교육 이수 정보' },
          { icon: '📋', label: '조공 준비', sub: '준비 서류·자격' },
          { icon: '🦺', label: '조공 근무', sub: '출근·작업 기록' },
          { icon: '🧰', label: '직무 경험', sub: '현장·공수·평가' },
          { icon: '⭐', label: '기공 성장', sub: '숙련도·직무 경력' },
          { icon: '🏗️', label: '현장 리더', sub: '팀 운영·재요청', highlight: true },
        ]}
      />
    </InfographicShell>
  );
}

// 인포그래픽 · 기존 건설 전자카드 vs MONO — "카드 발급"이 아니라 "성장 기록"이
// 중심이라는 차이를, 좌우 비교 카드 + VS 배지로 보여준다.
export function LegacyVsMonoInfographic() {
  return (
    <InfographicShell
      eyebrow="Infographic · Legacy vs MONO"
      title="출근 기록에서 성장·권한 관리로"
      caption="기존 전자카드는 출입에서 끝나지만, MONO Field Pass는 경력·정산·권한까지 하나의 흐름으로 이어집니다."
    >
      <div className={styles.compareGrid}>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 850, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>기존 건설 전자카드</div>
          <Timeline
            steps={[
              { icon: '🎓', label: '교육' },
              { icon: '💳', label: '전자카드 발급' },
              { icon: '🚪', label: '현장 출입' },
              { icon: '🕒', label: '출근 기록' },
            ]}
          />
        </div>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 850, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>MONO Field Pass</div>
          <Timeline
            steps={[
              { icon: '🎓', label: '교육·준비 상태' },
              { icon: '🦺', label: '조공 경험' },
              { icon: '📈', label: '경력 축적' },
              { icon: '🪪', label: 'Field Pass 발급', highlight: true },
              { icon: '🚪', label: '출입·출근' },
              { icon: '💰', label: '경력·받을 금액' },
              { icon: '🔐', label: '장비·OT 권한' },
            ]}
          />
        </div>
        <div className={styles.compareVs}>VS</div>
      </div>
    </InfographicShell>
  );
}

// 인포그래픽 · OTAC 기반 앱 출입 인증 PoC 흐름 (OTAC 섹션)
export function OtacPocInfographic() {
  return (
    <InfographicShell
      eyebrow="Infographic · OTAC PoC"
      title="센스톤 OTAC 기반 앱 출입 인증 PoC"
      caption="먼저 앱으로 출입 인증을 검증하고, 이후 카드·NFC·BLE·장비 권한으로 확장합니다."
    >
      <Timeline
        steps={[
          { icon: '📲', label: 'MONO App Pass 생성' },
          { icon: '🔑', label: 'OTAC 일회성 인증값 생성', highlight: true },
          { icon: '🛡️', label: '현장 단말·관리자 앱 검증' },
          { icon: '🚪', label: '출입 승인' },
          { icon: '🕒', label: '출근 기록 저장' },
          { icon: '📈', label: '경력·근무 데이터 연결' },
        ]}
      />
      <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: 11.5, fontWeight: 850, color: '#64748b', marginBottom: 6 }}>출력 데이터</div>
        <MiniChips items={['출입 성공', '출근 기록', '작업 기록', '경력카드', '기업 운영 리포트']} color="#059669" />
      </div>
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 11.5, fontWeight: 850, color: '#64748b', marginBottom: 6 }}>확장 인증 수단</div>
        <MiniChips items={['QR', 'NFC', 'BLE', '실물 카드', '기타 단말']} color="#64748b" />
      </div>
    </InfographicShell>
  );
}

// 인포그래픽 · 출입·장비·OT 권한 아키텍처 (Permission 섹션, 동일 폭 가로 레이어)
export function PermissionLayerInfographic() {
  return (
    <InfographicShell
      eyebrow="Infographic · Permission"
      title="출입에서 장비·OT 권한으로"
      caption="자격과 현장 권한을 확인한 뒤 장비·OT 시스템의 사용 승인과 연동합니다."
    >
      <Timeline
        steps={[
          { icon: '🪪', label: 'Identity', sub: '본인 확인', color: '#2563eb' },
          { icon: '💳', label: 'Credential', sub: '교육·서류·자격·경력 검증', color: '#9333ea' },
          { icon: '🚪', label: 'Access', sub: '현장·건물 출입 권한', color: '#059669' },
          { icon: '🛡️', label: 'Permission', sub: '현장별 작업 권한', color: '#ea580c' },
          { icon: '🚜', label: 'Equipment', sub: '중장비·차량 사용 승인', color: '#b45309' },
          { icon: '🏭', label: 'Industrial OT', sub: '산업 설비·보안구역 접근 권한', color: '#334155' },
        ]}
      />
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: 11.5, fontWeight: 850, color: '#64748b', marginBottom: 6 }}>적용 현장</div>
        <MiniChips items={['건설현장', '아파트', '오피스', '공장', '물류', 'Smart Facility']} color="#334155" />
      </div>
    </InfographicShell>
  );
}

// 인포그래픽 · MONO Data Loop — 이 페이지에서 가장 중요한 그림.
// 출입이 데이터가 되고, 데이터가 신뢰가 되어 더 좋은 현장으로 돌아오는 선순환 구조.
export function DataLoopInfographic() {
  const steps = ['출입', '출근', '작업', '공수', '받을 금액', '경력', '신뢰', '더 좋은 현장', '더 나은 처우'];
  return (
    <InfographicShell
      eyebrow="Infographic · MONO Data Loop"
      title="데이터가 쌓일수록 강해지는 구조"
      caption="출입이 출근이 되고, 출근이 경력과 신뢰가 되어 더 좋은 현장과 더 나은 처우로 이어지고, 다시 출입으로 돌아옵니다 — MONO가 쌓을수록 강해지는 데이터 선순환입니다."
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
          🔁 MONO Data Loop
        </span>
      </div>
    </InfographicShell>
  );
}

// 인포그래픽 · Field Pass 전체 시스템 아키텍처 — 사용자→인증수단→OTAC엔진→권한엔진
// (인증 흐름, 실선) → 출입장비시스템→데이터플랫폼→관리자리포트→외부연동 (데이터 흐름, 점선)
export function SystemArchitectureInfographic() {
  const layers: { n: number; title: string; color: string; items: string[]; flow: 'auth' | 'data' }[] = [
    { n: 1, title: '사용자', color: '#2563eb', flow: 'auth', items: ['기술자 앱', '현장 리더 앱', 'Field Pass 카드', '기업 관리자'] },
    { n: 2, title: '인증 수단', color: '#4338ca', flow: 'auth', items: ['QR', 'NFC', 'BLE', '실물 카드', '관리자 앱 확인'] },
    { n: 3, title: 'OTAC 인증 엔진', color: '#9333ea', flow: 'auth', items: ['OTAC 인증값 생성', '인증값 검증', '재사용 방지', '인증 로그'] },
    { n: 4, title: '권한 엔진', color: '#ea580c', flow: 'auth', items: ['교육 상태', '서류 상태', '자격·면허', '현장별 권한', '장비 사용 권한', 'OT 접근 권한'] },
    { n: 5, title: '출입·장비 시스템', color: '#059669', flow: 'data', items: ['건설현장 게이트', '아파트·오피스 출입 시스템', '장비 임대·관제 연동', '현장 단말기 연동'] },
    { n: 6, title: '데이터 플랫폼', color: '#0891b2', flow: 'data', items: ['출입 기록', '출근 기록', '작업 기록', '경력카드', '받을 금액', '권한 감사 로그'] },
    { n: 7, title: '관리자·기업 리포트', color: '#334155', flow: 'data', items: ['현장 운영 대시보드', '인력 현황 리포트', '안전·교육 리포트', 'PoC 진행 리포트'] },
    { n: 8, title: '외부 연동', color: '#64748b', flow: 'data', items: ['출입 게이트', '장비 관제 시스템', 'ERP·HR', '교육기관', '금융·보험', '공제·행정 시스템'] },
  ];
  return (
    <InfographicShell
      eyebrow="MONO Field Pass System Architecture"
      title="MONO Field Pass 시스템 아키텍처"
      caption="외부 기관명은 연동 대상 유형의 예시이며, 현재 확정된 연동을 의미하지 않습니다."
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18, marginBottom: 4, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, color: '#334155' }}>
          <span style={{ width: 20, height: 0, borderTop: '2px solid #4f46e5' }} /> 인증 흐름
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, color: '#334155' }}>
          <span style={{ width: 20, height: 0, borderTop: '2px dashed #94a3b8' }} /> 데이터 흐름
        </span>
      </div>
      <div className={styles.archGrid}>
        {layers.map((l) => (
          <div
            key={l.n}
            style={{
              background: '#fff',
              border: '1px solid rgba(36,91,255,0.14)',
              borderTop: l.flow === 'auth' ? `3px solid ${l.color}` : `3px dashed ${l.color}`,
              borderRadius: 12,
              padding: '12px 13px',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 900, color: '#94a3b8', marginBottom: 2 }}>STEP {l.n}</div>
            <div style={{ display: 'inline-block', fontSize: 12.5, fontWeight: 900, color: '#fff', background: l.color, padding: '2px 9px', borderRadius: 6, marginBottom: 8 }}>{l.title}</div>
            <ul style={{ margin: 0, padding: '0 0 0 15px', fontSize: 11, color: '#64748b', fontWeight: 600, lineHeight: 1.65 }}>
              {l.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </InfographicShell>
  );
}

// 인포그래픽 · Beyond Construction — 건설을 시작으로 산업 전반·글로벌로
// 확장 가능한 구조를 목표로 설계했음을 보여주는 로드맵 (현재 검증/확장 검토 배지로 구분).
export function ExpansionInfographic() {
  return (
    <InfographicShell
      eyebrow="Infographic · Beyond Construction"
      title="건설을 시작으로, 산업 전반으로 확장 가능한 구조를 목표로 설계했습니다"
      caption="건설 현장 검증을 시작으로 반도체·조선·플랜트 같은 산업 현장과 아파트·오피스·헬스케어·캠퍼스·스마트시티를 거쳐, 글로벌로 확장 가능한 Digital Credential 구조를 목표로 설계했습니다."
    >
      <Timeline
        steps={[
          { icon: '🏗️', label: 'Construction', sub: '건설 현장', badge: '현재 검증', color: '#059669', highlight: true },
          { icon: '🔬', label: 'Semiconductor', sub: '반도체', badge: '확장 검토', color: '#64748b' },
          { icon: '🚢', label: 'Shipyard', sub: '조선', badge: '확장 검토', color: '#64748b' },
          { icon: '🏭', label: 'Plant', sub: '플랜트', badge: '확장 검토', color: '#64748b' },
          { icon: '🏢', label: 'Apartment', sub: '아파트', badge: '확장 검토', color: '#64748b' },
          { icon: '🏬', label: 'Office', sub: '오피스', badge: '확장 검토', color: '#64748b' },
          { icon: '🏥', label: 'Healthcare', sub: '헬스케어', badge: '확장 검토', color: '#64748b' },
          { icon: '🎓', label: 'Campus', sub: '캠퍼스', badge: '확장 검토', color: '#64748b' },
          { icon: '🏙️', label: 'Smart City', sub: '스마트시티', badge: '확장 검토', color: '#64748b' },
          { icon: '🌐', label: 'Global Digital Credential', sub: '글로벌 확장 지향', badge: '확장 검토', color: '#4f46e5', highlight: true },
        ]}
      />
    </InfographicShell>
  );
}

// 인포그래픽 · Digital Identity Evolution — "출입카드"가 아니라 신원·인증·권한·신뢰가
// 단계적으로 진화해 확장 가능한 구조로 이어진다는 것을 보여준다.
export function DigitalIdentityEvolutionInfographic() {
  return (
    <InfographicShell
      eyebrow="Infographic · Digital Identity Evolution"
      title="카드가 아니라, 신원이 진화합니다"
      caption="카드에서 모바일 패스로, 신원·인증·출입·권한·신뢰를 거쳐 — 글로벌 표준으로 확장 가능한 구조를 목표로 설계했습니다."
    >
      <Timeline
        steps={[
          { icon: '💳', label: 'Today', sub: 'Card' },
          { icon: '📱', label: 'Tomorrow', sub: 'Mobile Pass' },
          { icon: '🪪', label: 'Identity', color: '#2563eb' },
          { icon: '💳', label: 'Credential', color: '#9333ea' },
          { icon: '🚪', label: 'Access', color: '#059669' },
          { icon: '🛡️', label: 'Permission', color: '#ea580c' },
          { icon: '⭐', label: 'Trust', color: '#b45309' },
          { icon: '🌐', label: 'Global Standard', sub: '확장 지향', highlight: true },
        ]}
      />
    </InfographicShell>
  );
}

// 인포그래픽 · Why Sensstone? — MONO의 Workforce 데이터와 센스톤의 OTAC 인증이
// 결합되는 이유를 보여주는 체인 + 함께 만들 것 체크리스트.
// OTAC 노드는 서면 합의 전 단계이므로 "PoC 검토" 배지로 표기.
export function WhySensstoneInfographic() {
  const nodes = [
    { icon: '🧑‍🔧', label: 'MONO Workforce', desc: '현장 근무자 성장 데이터', color: '#2563eb' },
    { icon: '📈', label: 'Growth Data', desc: '교육·경험·평판·신뢰 축적', color: '#0d9488' },
    { icon: '🪪', label: 'Field Pass', desc: '성장형 Digital Credential', color: '#059669' },
    { icon: '🔑', label: 'OTAC', desc: '센스톤 · 인증 기술 PoC 검토', color: '#047857', partner: true },
    { icon: '🌐', label: 'Global Authentication', desc: '모바일·저전력·오프라인 인증', color: '#0891b2' },
    { icon: '🛡️', label: 'Digital Permission', desc: '출입·장비·OT 권한 확장', color: '#ea580c' },
    { icon: '🏆', label: 'Industrial Standard', desc: '산업 현장 인증 표준을 목표로', color: '#4338ca' },
  ];
  return (
    <InfographicShell
      eyebrow="Infographic · Why Sensstone?"
      title="MONO의 성장 데이터 + 센스톤의 인증 기술이 만나는 이유"
      caption="MONO는 인증 기술을 새로 만들려는 회사가 아닙니다. 현장 근무자의 성장 데이터를 만들고, 이를 센스톤의 OTAC 기술과 연결해 산업 현장의 Digital Identity를 함께 만들고자 합니다."
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 22, gap: 0 }}>
        {nodes.map((n, i) => (
          <Fragment key={n.label}>
            <div
              style={{
                width: '100%',
                maxWidth: 440,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: n.partner ? MINT.bg : '#fff',
                border: `1.5px solid ${n.partner ? MINT.border : n.color + '33'}`,
                borderRadius: 14,
                padding: '11px 16px',
              }}
            >
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: n.color, color: '#fff', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                {n.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: NAVY }}>{n.label}</span>
                  {n.partner && (
                    <span style={{ fontSize: 9.5, fontWeight: 900, color: MINT.color, background: '#fff', border: `1px solid ${MINT.border}`, padding: '2px 7px', borderRadius: 999, whiteSpace: 'nowrap' }}>
                      PoC 검토
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600, marginTop: 1, wordBreak: 'keep-all' }}>{n.desc}</div>
              </div>
            </div>
            {i < nodes.length - 1 && <div style={{ color: '#cbd5e1', fontSize: 14, padding: '2px 0' }}>↓</div>}
          </Fragment>
        ))}
      </div>

      <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: 11.5, fontWeight: 850, color: '#64748b', marginBottom: 8 }}>What We Build Together · 함께 만들 것</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 8 }}>
          {['Mobile Authentication', 'Low Power Authentication', 'Offline Authentication', 'Access Control', 'Equipment Permission', 'OT Authentication', 'Global Credential'].map((it) => (
            <div key={it} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid rgba(36,91,255,0.14)', borderRadius: 10, padding: '8px 12px' }}>
              <span style={{ color: '#059669', fontWeight: 900, fontSize: 13 }}>✓</span>
              <span style={{ fontSize: 12, color: '#334155', fontWeight: 650 }}>{it}</span>
            </div>
          ))}
        </div>
      </div>
    </InfographicShell>
  );
}

// 인포그래픽 · MONO + Sensstone — MONO 데이터 + 센스톤 인증 기술 결합 구조.
// 확정 제휴가 아닌 "기술 협력 제안·PoC 검토" 단계이므로 로고 대신 텍스트 카드로 표현.
export function MonoSensstonePartnership() {
  return (
    <InfographicShell
      eyebrow="Infographic · MONO + Sensstone"
      title="MONO 성장 데이터와 센스톤 인증 기술의 결합"
      caption="기술 협력 제안 단계이며, 확정된 제휴가 아닌 PoC 검토를 함께 진행하고자 합니다."
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ flex: '1 1 200px', maxWidth: 240, background: '#eef2ff', border: '1px solid rgba(79,70,229,0.25)', borderRadius: 14, padding: '16px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 13.5, fontWeight: 900, color: '#4338ca', marginBottom: 4 }}>MONO</div>
          <div style={{ fontSize: 12, color: '#334155', fontWeight: 650, lineHeight: 1.5, wordBreak: 'keep-all' }}>사용자·교육·자격·경력·권한 데이터</div>
        </div>
        <span style={{ fontSize: 20, fontWeight: 900, color: '#94a3b8' }}>+</span>
        <div style={{ flex: '1 1 200px', maxWidth: 240, background: MINT.bg, border: `1px solid ${MINT.border}`, borderRadius: 14, padding: '16px 14px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 13.5, fontWeight: 900, color: MINT.color }}>SENSTONE</span>
            <span style={{ fontSize: 9.5, fontWeight: 900, color: MINT.color, background: '#fff', border: `1px solid ${MINT.border}`, padding: '2px 7px', borderRadius: 999 }}>PoC 검토</span>
          </div>
          <div style={{ fontSize: 12, color: '#334155', fontWeight: 650, lineHeight: 1.5, wordBreak: 'keep-all' }}>OTAC 기반 동적 인증 기술</div>
        </div>
        <span style={{ fontSize: 20, fontWeight: 900, color: '#94a3b8' }}>=</span>
        <div style={{ flex: '1 1 260px', maxWidth: 320, background: '#fff', border: '1px solid rgba(36,91,255,0.16)', borderRadius: 14, padding: '14px 16px' }}>
          <MiniChips items={['현장 출입 인증 PoC', '장비 권한 검증', 'OT 접근 권한 확장']} color="#4f46e5" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginTop: 24, paddingTop: 18, borderTop: '1px solid #f1f5f9' }}>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 850, color: '#4338ca', marginBottom: 6 }}>MONO 역할</div>
          <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 12.5, color: '#475569', fontWeight: 600, lineHeight: 1.75, wordBreak: 'keep-all' }}>
            <li>사용자 프로필</li>
            <li>교육·자격 상태</li>
            <li>현장별 권한</li>
            <li>출근·경력 데이터</li>
            <li>기업 운영 화면</li>
          </ul>
        </div>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 850, color: MINT.color, marginBottom: 6 }}>센스톤 협력 검토 영역</div>
          <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 12.5, color: '#475569', fontWeight: 600, lineHeight: 1.75, wordBreak: 'keep-all' }}>
            <li>OTAC 인증값 생성·검증</li>
            <li>현장 인증 적용 방식</li>
            <li>단말·앱 인증 연동</li>
            <li>장비·OT 확장 가능성</li>
          </ul>
        </div>
      </div>
    </InfographicShell>
  );
}

// 클릭 시 확대되는 참고 이미지 (첨부 원본 인포그래픽/패널 그대로 사용).
// compact=true면 가로 스크롤을 강제하지 않고 섹션 폭에 맞춰 반응형으로 축소된다
// (각 섹션에 매칭되는 작은 참고 패널용). compact=false는 큰 포스터형 이미지용.
export function ZoomableImage({ src, alt, caption, compact = false, maxWidth = 1440 }: { src: string; alt: string; caption: string; compact?: boolean; maxWidth?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 18 }}>
      <div style={compact ? undefined : { overflowX: 'auto' }}>
        <img
          src={src}
          alt={alt}
          onClick={() => setOpen(true)}
          style={{ display: 'block', width: '100%', minWidth: compact ? undefined : 640, maxWidth, margin: '0 auto', borderRadius: 12, border: '1px solid rgba(36,91,255,0.16)', cursor: 'zoom-in' }}
        />
      </div>
      <p style={{ fontSize: 12.5, color: '#64748b', fontWeight: 650, textAlign: 'center', marginTop: 10, wordBreak: 'keep-all' }}>{caption}</p>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(10,15,26,0.88)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, cursor: 'zoom-out' }}
        >
          <img src={src} alt={alt} style={{ maxWidth: '95vw', maxHeight: '90vh', borderRadius: 8 }} />
        </div>
      )}
    </div>
  );
}
