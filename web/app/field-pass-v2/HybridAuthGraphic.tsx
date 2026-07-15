import { Landmark, Smartphone, KeyRound, Layers, DoorOpen, Clock, Briefcase, Bluetooth, Nfc, QrCode, CreditCard, UserCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './field-pass-v2.module.css';
import { COLOR, ResponsiveChain, type ChainStep } from './graphicPrimitives';

const authFlow: ChainStep[] = [
  { icon: Landmark, title: '건설올패스 연결', color: COLOR.navy, background: '#EEF2F7' },
  { icon: Smartphone, title: 'MONO 앱 등록', sub: '본인·기기 등록', color: COLOR.blue, background: '#EFF6FF' },
  { icon: KeyRound, title: 'OTAC 동적 인증', color: COLOR.purple, background: '#FAF5FF' },
  { icon: Layers, title: '인증 채널 선택', color: COLOR.teal, background: '#ECFEFF' },
  { icon: DoorOpen, title: '출입 승인', color: COLOR.green, background: '#F0FDF4' },
  { icon: Clock, title: '출근 기록', color: COLOR.orange, background: '#FFF7ED' },
  { icon: Briefcase, title: '경력 반영', color: COLOR.indigo, background: '#EEF2FF', highlight: true },
];

const channels: { icon: LucideIcon; label: string; tier: '기본' | '보조' | '예외' }[] = [
  { icon: Bluetooth, label: 'BLE 핸즈프리', tier: '기본' },
  { icon: Nfc, label: 'NFC', tier: '보조' },
  { icon: QrCode, label: 'Dynamic QR', tier: '보조' },
  { icon: CreditCard, label: '실물 카드', tier: '예외' },
  { icon: UserCheck, label: '관리자 앱 확인', tier: '예외' },
];

const tierColor: Record<string, { bg: string; color: string }> = {
  기본: { bg: '#ECFDF5', color: '#047857' },
  보조: { bg: '#EFF6FF', color: '#1D4ED8' },
  예외: { bg: '#F1F5F9', color: '#475569' },
};

export function HybridAuthGraphic() {
  return (
    <div>
      <ResponsiveChain
        steps={authFlow}
        titleId="hybrid-auth-flow"
        title="MONO Field Pass 하이브리드 인증 흐름"
        desc="건설올패스 연결부터 MONO 앱 등록, OTAC 동적 인증, 인증 채널 선택, 출입 승인, 출근 기록, 경력 반영까지 이어지는 흐름"
      />

      <div style={{ marginTop: 40 }}>
        <div style={{ fontSize: 12, fontWeight: 900, color: '#94a3b8', letterSpacing: '0.08em', marginBottom: 16 }}>인증 채널</div>
        <div className={styles.grid}>
          {channels.map((c) => (
            <div key={c.label} className={styles.card} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: tierColor[c.tier].bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                <c.icon width={22} height={22} color={tierColor[c.tier].color} strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 850 }}>{c.label}</div>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: 4,
                    fontSize: 10.5,
                    fontWeight: 900,
                    color: tierColor[c.tier].color,
                    background: tierColor[c.tier].bg,
                    borderRadius: 999,
                    padding: '2px 8px',
                  }}
                >
                  {c.tier}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
