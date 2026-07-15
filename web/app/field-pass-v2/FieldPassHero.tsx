import { Landmark, Smartphone, KeyRound, DoorOpen, Clock, Briefcase, ShieldCheck } from 'lucide-react';
import styles from './field-pass-v2.module.css';
import { ResponsiveChain, COLOR, type ChainStep } from './graphicPrimitives';

const heroFlow: ChainStep[] = [
  { icon: Landmark, title: '건설올패스', color: COLOR.navy, background: '#EEF2F7' },
  { icon: Smartphone, title: 'MONO 앱', color: COLOR.blue, background: '#EFF6FF' },
  { icon: KeyRound, title: 'OTAC 인증', color: COLOR.teal, background: '#ECFEFF' },
  { icon: DoorOpen, title: '현장 출입', color: COLOR.green, background: '#F0FDF4' },
  { icon: Clock, title: '출근 기록', color: COLOR.orange, background: '#FFF7ED' },
  { icon: Briefcase, title: '경력', color: COLOR.purple, background: '#FAF5FF' },
  { icon: ShieldCheck, title: '권한', color: COLOR.indigo, background: '#EEF2FF', highlight: true },
];

export function FieldPassHero({ onCtaClick }: { onCtaClick?: (label: string) => void }) {
  return (
    <section className={styles.section} style={{ paddingTop: 100 }}>
      <div className={styles.container}>
        <span className={styles.eyebrow}>MONO × SENSTONE</span>
        <h1 style={{ margin: 0, fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.12, wordBreak: 'keep-all' }}>
          MONO Field Pass
        </h1>
        <div style={{ marginTop: 10, fontSize: 'clamp(14px, 2vw, 18px)', fontWeight: 750, color: COLOR.indigo }}>
          Building the Next Construction Credential Together
        </div>
        <p style={{ marginTop: 24, maxWidth: 640, fontSize: 17, fontWeight: 650, lineHeight: 1.85, color: '#334155', wordBreak: 'keep-all' }}>
          건설올패스의 공적 기록과 MONO 앱의 현장 인증 경험을 연결합니다.
          <br />
          센스톤의 OTAC·저전력 인증 기술과 함께 차세대 건설 인증을 만들어갑니다.
        </p>
        <div className={styles.ctaRow}>
          <button className={styles.ctaPrimary} onClick={() => onCtaClick?.('join')}>
            함께 만들기
          </button>
          <button className={styles.ctaSecondary} onClick={() => onCtaClick?.('overview')}>
            전체 흐름 보기
          </button>
        </div>

        <div style={{ marginTop: 64 }}>
          <ResponsiveChain
            steps={heroFlow}
            titleId="hero-flow"
            title="MONO Field Pass 전체 흐름"
            desc="건설올패스에서 시작해 MONO 앱, OTAC 인증, 현장 출입, 출근 기록, 경력을 거쳐 권한으로 이어지는 전체 흐름"
          />
        </div>
      </div>
    </section>
  );
}
