'use client';

import { Fragment, useState } from 'react';
import styles from './infographics.module.css';

// Infographic Kit v1.0으로 교체된 컴포넌트는 아래에서 재수출한다 —
// FieldPassClient.tsx의 import 경로('./Infographics')를 바꾸지 않기 위한 drop-in 연결.
// Growth Journey는 채팅으로 전달받은 완성형 SVG 컴포넌트(GrowthJourneyGraphic.tsx)로
// 개별 교체했고, 나머지 5종은 아직 플랫 박스 스타일(InfographicsKit.tsx)을 사용한다.
export { GrowthJourneyInfographic } from './GrowthJourneyGraphic';
export {
  GlobalCredentialLandscapeInfographic,
  OtacPocInfographic,
  PermissionLayerInfographic,
  DataLoopInfographic,
  ExpansionInfographic,
} from './InfographicsKit';

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

// 인포그래픽 · 기존 건설 전자카드 vs MONO — "카드 발급"보다 "성장 기록"이
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
      caption="MONO는 현장 근무자의 성장 데이터를 만들고, 이를 센스톤의 OTAC 기술과 연결해 산업 현장의 Digital Identity를 함께 만들고자 합니다."
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
