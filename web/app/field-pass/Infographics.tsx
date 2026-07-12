'use client';

import { Fragment } from 'react';
import styles from './infographics.module.css';

const NAVY = '#0b1224';

type Step = { icon: string; label: string; sub?: string; highlight?: boolean };

function Timeline({ steps }: { steps: Step[] }) {
  return (
    <div className={styles.timeline}>
      {steps.map((s, i) => (
        <Fragment key={s.label}>
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

// 인포그래픽 1 — 성장형 Field Pass 발급 흐름 (Hero 바로 아래)
export function GrowthFlowInfographic() {
  return (
    <InfographicShell
      eyebrow="Infographic · 01"
      title="일용직에서 건설근로자로, Field Pass가 발급되는 흐름"
      caption="일한 기록이 쌓이면 경력이 되고, 경력과 준비 상태가 출입 권한으로 이어집니다."
    >
      <Timeline
        steps={[
          { icon: '👷', label: '오늘 현장' },
          { icon: '🎓', label: '기초안전교육' },
          { icon: '📋', label: '준비 서류 완료' },
          { icon: '🧱', label: '조공 경험 축적' },
          { icon: '🪪', label: '건설근로자 프로필' },
          { icon: '✅', label: 'Field Pass 발급', highlight: true },
          { icon: '📲', label: '앱·카드 출입 인증' },
        ]}
      />
    </InfographicShell>
  );
}

// 인포그래픽 2 — OTAC 기반 앱 출입 인증 PoC 흐름 (OTAC 섹션)
export function OtacPocInfographic() {
  const layers: { label: string; items: string[]; color: string }[] = [
    { label: '사용자', items: ['MONO 앱', 'Field Pass'], color: '#2563eb' },
    { label: '인증', items: ['OTAC 인증값', 'QR/NFC'], color: '#9333ea' },
    { label: '현장', items: ['게이트', '관리자 앱', '출입 승인'], color: '#ea580c' },
    { label: '데이터', items: ['출근 기록', '경력카드', '받을 금액'], color: '#059669' },
    { label: '확장', items: ['실물 카드', '아파트·오피스', '중장비·OT'], color: '#64748b' },
  ];
  return (
    <InfographicShell
      eyebrow="Infographic · 02"
      title="센스톤 OTAC 기반 앱 출입 인증 PoC"
      caption="먼저 앱으로 출입 인증을 검증하고, 이후 카드·NFC·BLE·장비 권한으로 확장합니다."
    >
      <Timeline
        steps={[
          { icon: '📲', label: 'Field Pass 인증 생성', sub: 'MONO 앱' },
          { icon: '🔑', label: 'OTAC 일회성 인증값 생성', highlight: true },
          { icon: '🛡️', label: '현장 단말·관리자 앱 확인' },
          { icon: '🚪', label: '출입 승인' },
          { icon: '🕒', label: '출근 기록 저장' },
          { icon: '💳', label: '경력·받을 금액 데이터 연결' },
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

// 인포그래픽 3 — 권한 레이어 아키텍처 (Architecture 섹션 아래, 세로 스택)
export function PermissionLayerInfographic() {
  const layers = [
    { icon: '🪪', label: 'Identity', desc: '사용자 본인 확인', color: '#2563eb' },
    { icon: '📋', label: 'Ready', desc: '교육·서류·자격·경험', color: '#9333ea' },
    { icon: '💳', label: 'Credential', desc: '앱 패스·실물 카드·QR/NFC', color: '#ea580c' },
    { icon: '🚪', label: 'Access', desc: '현장·아파트·오피스 출입', color: '#059669' },
    { icon: '🛠️', label: 'Permission', desc: '장비·중장비·OT 기기 권한', color: '#b45309' },
    { icon: '📊', label: 'Data', desc: '출근 기록·경력·정산 보조·운영 리포트', color: '#334155' },
  ];
  return (
    <InfographicShell
      eyebrow="Infographic · 03"
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
    </InfographicShell>
  );
}

// 인포그래픽 4 — 확장 로드맵 (Expansion Roadmap 섹션 위)
export function ExpansionInfographic() {
  return (
    <InfographicShell
      eyebrow="Infographic · 04"
      title="건설 현장에서 생활·산업 공간으로 확장"
      caption="건설 현장에서 검증한 Field Pass는 아파트, 오피스, 산업 현장, OT 기기 권한 관리로 확장됩니다."
    >
      <Timeline
        steps={[
          { icon: '🏗️', label: 'Phase 1', sub: '건설 현장 출입·출근' },
          { icon: '🪪', label: 'Phase 2', sub: 'Field Pass 카드 발급' },
          { icon: '🏢', label: 'Phase 3', sub: '아파트 방문 작업자 출입' },
          { icon: '🏬', label: 'Phase 4', sub: '오피스·보안구역 출입' },
          { icon: '🚜', label: 'Phase 5', sub: '중장비·산업 장비 권한' },
          { icon: '⚙️', label: 'Phase 6', sub: 'OT 기기 접근 권한 관리' },
        ]}
      />
    </InfographicShell>
  );
}
