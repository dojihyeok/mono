import { Users, Smartphone, CreditCard, CloudRain, HardHat, Nfc, DoorOpen, Hourglass, Fingerprint, KeyRound, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './field-pass-v2.module.css';
import { COLOR, ResponsiveChain, type ChainStep } from './graphicPrimitives';

const problems: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Users, title: '출근 시간대 병목', desc: '수백 명이 동시에 출입하면서 대기열이 발생합니다' },
  { icon: Smartphone, title: '스마트폰 조작 부담', desc: '앱 실행, 로그인, NFC 설정, 잠금 해제 과정이 필요합니다' },
  { icon: CreditCard, title: '실물 카드 대리 인증', desc: '타인의 카드를 이용한 출근 기록 가능성이 있습니다' },
  { icon: CloudRain, title: '현장 환경 제약', desc: '장갑, 먼지, 비, 저온, 배터리, 네트워크 문제가 있습니다' },
];

const legacyFlow: ChainStep[] = [
  { icon: Smartphone, title: '앱 실행', color: '#94A3B8', background: '#F1F5F9' },
  { icon: Fingerprint, title: '로그인', color: '#94A3B8', background: '#F1F5F9' },
  { icon: Nfc, title: 'NFC 설정', color: '#94A3B8', background: '#F1F5F9' },
  { icon: CreditCard, title: '태그', color: '#94A3B8', background: '#F1F5F9' },
  { icon: DoorOpen, title: '출입', color: '#94A3B8', background: '#F1F5F9' },
  { icon: Hourglass, title: '대기', color: '#64748B', background: '#F1F5F9' },
];

const monoFlow: ChainStep[] = [
  { icon: HardHat, title: '현장 접근', color: COLOR.blue, background: '#EFF6FF' },
  { icon: Fingerprint, title: '자동·간편 인증', color: COLOR.teal, background: '#ECFEFF' },
  { icon: KeyRound, title: 'OTAC 검증', color: COLOR.purple, background: '#FAF5FF' },
  { icon: DoorOpen, title: '출입', color: COLOR.green, background: '#F0FDF4' },
  { icon: Clock, title: '출근 기록', color: COLOR.indigo, background: '#EEF2FF', highlight: true },
];

export function PainPointGraphic() {
  return (
    <div>
      <div className={styles.grid}>
        {problems.map((p) => (
          <div key={p.title} className={styles.card}>
            <p className={styles.cardTitle}>{p.title}</p>
            <p className={styles.cardDesc}>{p.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 48 }}>
        <div style={{ fontSize: 12, fontWeight: 900, color: '#94a3b8', letterSpacing: '0.08em', marginBottom: 12 }}>기존 흐름</div>
        <ResponsiveChain steps={legacyFlow} titleId="legacy-flow" title="기존 현장 출입 흐름" desc="앱 실행, 로그인, NFC 설정, 태그, 출입, 대기까지 여러 단계를 거치는 기존 방식" />
      </div>

      <div style={{ marginTop: 40 }}>
        <div style={{ fontSize: 12, fontWeight: 900, color: COLOR.indigo, letterSpacing: '0.08em', marginBottom: 12 }}>MONO 흐름</div>
        <ResponsiveChain steps={monoFlow} titleId="mono-flow" title="MONO 현장 출입 흐름" desc="현장 접근, 자동 또는 간편 인증, OTAC 검증을 거쳐 출입과 출근 기록으로 바로 이어지는 흐름" />
      </div>
    </div>
  );
}
