// ─────────────────────────────────────────────
// MONO Field Pass Infographic Kit v1.0 — 공유 카드 래퍼.
// 6종 SVG(InfographicsKit.tsx)를 감싸는 공통 프레임 — 흰 배경 카드 + 그림자 +
// eyebrow/title/caption. 팔레트는 이 킷 컴포넌트 내부에서만 사용하고,
// 페이지 전반의 Navy(#0b1224)/Indigo(#4f46e5) 톤은 그대로 둔다.
// ─────────────────────────────────────────────

export const KIT = {
  navy: '#1E3A8A',
  indigo: '#4F46E5',
  teal: '#0EA5A4',
  green: '#22C55E',
  orange: '#F59E0B',
  purple: '#7C3AED',
  ink: '#0f172a',
  slate: '#64748b',
  mist: '#94a3b8',
  line: '#cbd5e1',
};

export function KitCard({
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
    <div
      style={{
        background: '#ffffff',
        border: '1px solid rgba(15,23,42,0.07)',
        borderRadius: 20,
        padding: '26px 24px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 11.5, fontWeight: 850, color: KIT.indigo, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {eyebrow}
        </div>
        <span style={{ fontSize: 9.5, fontWeight: 900, color: '#fff', background: KIT.navy, borderRadius: 999, padding: '2px 9px', letterSpacing: '0.03em' }}>
          INFOGRAPHIC KIT v1.0
        </span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 900, color: KIT.ink, marginTop: 4, wordBreak: 'keep-all' }}>{title}</div>
      <div style={{ marginTop: 20, overflowX: 'auto' }}>{children}</div>
      <p style={{ fontSize: 13, color: '#475569', fontWeight: 650, lineHeight: 1.65, margin: '20px 0 0', wordBreak: 'keep-all', borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
        {caption}
      </p>
    </div>
  );
}
