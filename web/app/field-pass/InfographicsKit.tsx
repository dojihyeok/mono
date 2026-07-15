import { Fragment } from 'react';
import { KitCard } from './svgKit';

// ─────────────────────────────────────────────
// MONO Field Pass Infographic Kit v1.0 — 6종 인포그래픽.
// 참고 원본: web/public/field-pass/mono-field-pass-infographics.html
// (플랫 박스 + 화살표 HTML/CSS 구조 — SVG 대신 순수 div 기반으로 안정성 우선).
// export 이름은 기존 이름과 동일하게 유지해 FieldPassClient.tsx의
// import를 바꾸지 않고 그대로 교체(drop-in)할 수 있게 했다.
// ─────────────────────────────────────────────

const boxStyle: React.CSSProperties = {
  minWidth: 130,
  padding: '14px 12px',
  borderRadius: 16,
  background: '#f1f5f9',
  textAlign: 'center',
  fontWeight: 700,
  fontSize: 13.5,
  color: '#0f2747',
  flex: 'none',
  wordBreak: 'keep-all',
};

function Flow({ items }: { items: { label: string; highlight?: boolean }[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', paddingBottom: 4 }}>
      {items.map((it, i) => (
        <Fragment key={it.label}>
          <div style={it.highlight ? { ...boxStyle, background: '#4f46e5', color: '#fff' } : boxStyle}>{it.label}</div>
          {i < items.length - 1 && <div style={{ margin: '0 12px', fontSize: 20, color: '#64748b', flex: 'none' }}>→</div>}
        </Fragment>
      ))}
    </div>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#0f2747', color: '#fff', padding: 16, borderRadius: 12, textAlign: 'center', marginTop: 20, fontWeight: 800, fontSize: 14, wordBreak: 'keep-all' }}>
      {children}
    </div>
  );
}

// ② Global Landscape
export function GlobalCredentialLandscapeInfographic() {
  return (
    <KitCard eyebrow="Infographic Kit · ② Global Landscape" title="글로벌 인증 흐름" caption="해외 사례는 신원, 출입, 자격을 각각 발전시켜 왔습니다. MONO는 이를 하나의 성장형 권한 구조로 연결합니다.">
      <Flow items={[{ label: 'ID06' }, { label: 'HMS' }, { label: 'Valtti' }, { label: 'CSCS' }, { label: 'MyPass' }]} />
      <Highlight>MONO = Growth + Credential + Permission</Highlight>
    </KitCard>
  );
}

// ③ OTAC Authentication Flow
export function OtacPocInfographic() {
  return (
    <KitCard eyebrow="Infographic Kit · ③ OTAC Authentication Flow" title="OTAC 인증 흐름" caption="센스톤과의 기술 협력에서는 모바일 인증, 저전력 인증 적용 가능성을 함께 검토합니다.">
      <Flow items={[{ label: 'App' }, { label: 'OTAC' }, { label: '출입' }, { label: '출근' }, { label: '경력' }]} />
      <Highlight>모바일 인증 → 현장 데이터 연결</Highlight>
    </KitCard>
  );
}

// ④ Permission Architecture
export function PermissionLayerInfographic() {
  return (
    <KitCard eyebrow="Infographic Kit · ④ Permission Architecture" title="권한 구조" caption="신원과 자격을 확인한 뒤 공간 출입, 장비 사용 승인, 산업 설비 접근 권한으로 확장합니다.">
      <Flow
        items={[
          { label: 'Identity' },
          { label: 'Credential' },
          { label: 'Access' },
          { label: 'Permission' },
          { label: 'Equipment' },
          { label: 'OT' },
        ]}
      />
      <Highlight>출입 → 장비 → 산업 권한</Highlight>
    </KitCard>
  );
}

// ⑤ MONO Data Loop
export function DataLoopInfographic() {
  const items = ['출입', '출근', '작업', '경력', '신뢰', '더 좋은 현장'];
  return (
    <KitCard eyebrow="Infographic Kit · ⑤ MONO Data Loop" title="Data Loop" caption="출입이 출근·작업·경력·신뢰로 쌓이고, 더 좋은 현장으로 이어지는 선순환입니다.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {items.map((it) => (
          <div key={it} style={{ padding: 14, background: '#f1f5f9', borderRadius: 12, textAlign: 'center', fontWeight: 700, fontSize: 13.5, color: '#0f2747' }}>
            {it}
          </div>
        ))}
      </div>
      <Highlight>데이터 → 신뢰 → 기회</Highlight>
    </KitCard>
  );
}

// ⑥ Expansion Roadmap
export function ExpansionInfographic() {
  return (
    <KitCard eyebrow="Infographic Kit · ⑥ Expansion Roadmap" title="확장 로드맵" caption="건설 현장 검증을 시작으로 생활 공간과 산업 설비 권한으로 단계적으로 확장합니다.">
      <Flow items={[{ label: 'Construction' }, { label: 'Apartment' }, { label: 'Office' }, { label: 'Factory' }, { label: 'OT' }]} />
      <Highlight>Industrial Identity Platform</Highlight>
    </KitCard>
  );
}
