import { Users, GraduationCap, DoorOpen, Building2, KeyRound, BatteryLow, Smartphone, Cog } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './field-pass-v2.module.css';
import { COLOR } from './graphicPrimitives';

const monoRoles: { icon: LucideIcon; label: string }[] = [
  { icon: Users, label: '현장 근무자 성장 데이터' },
  { icon: GraduationCap, label: '교육·자격·경력 정보' },
  { icon: DoorOpen, label: '현장 출입·출근 흐름' },
  { icon: Building2, label: '기업 운영 인터페이스' },
];

const sensstoneRoles: { icon: LucideIcon; label: string }[] = [
  { icon: KeyRound, label: 'OTAC 인증' },
  { icon: BatteryLow, label: '저전력 인증' },
  { icon: Smartphone, label: '모바일·오프라인 인증' },
  { icon: Cog, label: '산업·OT 인증 기술' },
];

function RoleList({ title, items, accent }: { title: string; items: { icon: LucideIcon; label: string }[]; accent: string }) {
  return (
    <div style={{ flex: '1 1 320px', minWidth: 280 }}>
      <div style={{ fontSize: 13, fontWeight: 900, color: accent, letterSpacing: '0.06em', marginBottom: 16 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '14px 16px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              <item.icon width={18} height={18} color="#fff" strokeWidth={1.8} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 750, color: '#fff' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MonoSensstoneGraphic() {
  return (
    <div>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 56 }}>
        <RoleList title="MONO 역할" items={monoRoles} accent="#A5B4FC" />
        <RoleList title="SENSTONE 역할" items={sensstoneRoles} accent="#5EEAD4" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap', margin: '0 auto 40px' }}>
        <div style={{ textAlign: 'center', padding: '20px 28px', borderRadius: 20, background: 'rgba(79,70,229,0.16)', border: '1px solid rgba(165,180,252,0.3)' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>MONO</div>
          <div style={{ fontSize: 11.5, fontWeight: 650, color: '#a5b4fc', marginTop: 4 }}>Workforce &amp; Growth Data</div>
        </div>
        <span style={{ fontSize: 22, fontWeight: 900, color: 'rgba(255,255,255,0.4)' }}>+</span>
        <div style={{ textAlign: 'center', padding: '20px 28px', borderRadius: 20, background: 'rgba(15,159,154,0.16)', border: '1px solid rgba(94,234,212,0.3)' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>SENSTONE</div>
          <div style={{ fontSize: 11.5, fontWeight: 650, color: '#5eead4', marginTop: 4 }}>Authentication Technology</div>
        </div>
        <span style={{ fontSize: 22, fontWeight: 900, color: 'rgba(255,255,255,0.4)' }}>=</span>
        <div style={{ textAlign: 'center', padding: '20px 32px', borderRadius: 20, background: '#fff' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: COLOR.navy }}>Next Construction Credential</div>
        </div>
      </div>

      <p style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', fontSize: 16, fontWeight: 650, lineHeight: 1.9, color: 'rgba(226,232,240,0.85)', wordBreak: 'keep-all' }}>
        MONO는 현장 근무자의 성장과 권한 데이터를 만들고, 센스톤은 강력한 인증 기술을 제공합니다.
        <br />
        함께 건설 현장에서 시작하는 새로운 Workforce Credential을 만들고 싶습니다.
      </p>
    </div>
  );
}
