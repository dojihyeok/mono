import { Handshake, Megaphone, Users, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './field-pass-v2.module.css';
import { COLOR } from './graphicPrimitives';

const stages: { icon: LucideIcon; label: string; highlight?: boolean }[] = [
  { icon: Handshake, label: 'MONO + SENSTONE + 건설 현장' },
  { icon: Megaphone, label: '모두의창업 4라운드' },
  { icon: Users, label: '대국민 공개' },
  { icon: Sparkles, label: '차세대 건설 인증 경험', highlight: true },
];

export function PublicLaunchGraphic({ onCtaClick }: { onCtaClick?: (label: string) => void }) {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, maxWidth: 420, margin: '0 auto' }}>
        {stages.map((s, i) => (
          <div key={s.label} style={{ width: '100%' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                width: '100%',
                padding: '18px 22px',
                borderRadius: 20,
                background: s.highlight ? `linear-gradient(135deg, #1D4ED8, ${COLOR.indigo})` : '#ffffff',
                border: s.highlight ? 'none' : '1px solid #e2e8f0',
                boxShadow: '0 10px 28px rgba(15,23,42,0.06)',
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background: s.highlight ? 'rgba(255,255,255,0.18)' : '#eef2ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                }}
              >
                <s.icon width={22} height={22} color={s.highlight ? '#fff' : COLOR.indigo} strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 15.5, fontWeight: 850, color: s.highlight ? '#fff' : COLOR.navy, wordBreak: 'keep-all' }}>{s.label}</span>
            </div>
            {i < stages.length - 1 && <div style={{ textAlign: 'center', color: '#cbd5e1', fontSize: 18, padding: '6px 0' }}>↓</div>}
          </div>
        ))}
      </div>

      <p style={{ maxWidth: 620, margin: '48px auto 0', textAlign: 'center', fontSize: 16, fontWeight: 650, lineHeight: 1.9, color: '#475569', wordBreak: 'keep-all' }}>
        건설올패스의 가치를 더 빠르고 편리한 현장 인증 경험으로 확장하고,
        <br />
        출입에서 장비·OT 권한까지 이어지는 새로운 건설 인증을 함께 만들고 싶습니다.
      </p>

      <div className={styles.ctaRow} style={{ justifyContent: 'center' }}>
        <button className={styles.ctaPrimary} onClick={() => onCtaClick?.('join')}>
          함께 만들기
        </button>
        <button className={styles.ctaSecondary} onClick={() => onCtaClick?.('proposal')}>
          공동 공개 제안 보기
        </button>
      </div>
    </div>
  );
}
