import { Handshake, KeyRound, Smartphone, DoorOpen, Clock, Briefcase, ShieldCheck, Smartphone as MobileIcon, BatteryLow, Layers, Users, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './field-pass-v2.module.css';
import { COLOR, ResponsiveChain, type ChainStep } from './graphicPrimitives';

const togetherFlow: ChainStep[] = [
  { icon: Handshake, title: 'MONO + SENSTONE', color: COLOR.teal, background: 'rgba(94,234,212,0.15)' },
  { icon: KeyRound, title: 'OTAC', color: COLOR.purple, background: 'rgba(216,180,254,0.15)' },
  { icon: Smartphone, title: 'MONO APP', color: COLOR.blue, background: 'rgba(147,197,253,0.15)' },
  { icon: DoorOpen, title: '출입', color: COLOR.green, background: 'rgba(134,239,172,0.15)' },
  { icon: Clock, title: '출근', color: COLOR.orange, background: 'rgba(253,186,116,0.15)' },
  { icon: Briefcase, title: '경력', color: '#C4B5FD', background: 'rgba(196,181,253,0.15)' },
  { icon: ShieldCheck, title: '권한', color: COLOR.indigo, background: 'rgba(165,180,252,0.2)', highlight: true },
];

const buildTogether: { icon: LucideIcon; label: string }[] = [
  { icon: MobileIcon, label: 'Mobile Authentication' },
  { icon: BatteryLow, label: 'Low Power Authentication' },
  { icon: Layers, label: 'Hybrid Authentication' },
  { icon: Users, label: 'Workforce Credential' },
  { icon: Truck, label: 'Equipment Permission' },
];

// ④ Together — Chapter 3. "PoC"라는 단어를 쓰지 않고, MONO+SENSTONE이 함께
// 만들고 싶은 인증 흐름과 그 결과물(What we build together)만 보여준다.
export function MonoSensstoneGraphic() {
  return (
    <div>
      <ResponsiveChain
        steps={togetherFlow}
        titleId="together-flow"
        title="MONO와 센스톤이 함께 만드는 인증 흐름"
        desc="MONO와 센스톤이 함께 OTAC 기반 MONO 앱 인증을 통해 출입, 출근, 경력을 거쳐 권한으로 이어지는 흐름을 만듭니다"
        dark
      />

      <div style={{ marginTop: 48 }}>
        <div style={{ fontSize: 12, fontWeight: 900, color: 'rgba(226,232,240,0.6)', letterSpacing: '0.08em', marginBottom: 16, textAlign: 'center' }}>
          WHAT WE BUILD TOGETHER
        </div>
        <div className={styles.tagRow} style={{ justifyContent: 'center' }}>
          {buildTogether.map((item) => (
            <span key={item.label} className={styles.tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <item.icon width={14} height={14} />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
