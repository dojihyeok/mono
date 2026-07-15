import { Fingerprint, FileCheck, DoorOpen, ShieldCheck, Truck, Cog } from 'lucide-react';
import styles from './field-pass-v2.module.css';
import { COLOR, ResponsiveChain, type ChainStep } from './graphicPrimitives';

const permissionFlow: ChainStep[] = [
  { icon: Fingerprint, title: 'Identity', sub: '본인 확인', color: COLOR.blue, background: '#EFF6FF' },
  { icon: FileCheck, title: 'Credential', sub: '교육·자격 검증', color: COLOR.teal, background: '#ECFEFF' },
  { icon: DoorOpen, title: 'Access', sub: '현장 출입', color: COLOR.green, background: '#F0FDF4' },
  { icon: ShieldCheck, title: 'Permission', sub: '작업 권한', color: COLOR.indigo, background: '#EEF2FF' },
  { icon: Truck, title: 'Equipment', sub: '장비 사용 승인', color: COLOR.orange, background: '#FFF7ED' },
  { icon: Cog, title: 'Industrial OT', sub: '산업 설비 접근', color: '#EA580C', background: '#FFF7ED', highlight: true },
];

const targets = ['건설 현장', '아파트·주거', '오피스·시설', '중장비·차량', '산업 설비·OT'];

export function PermissionGraphic() {
  return (
    <div>
      <ResponsiveChain
        steps={permissionFlow}
        titleId="permission-flow"
        title="출입에서 장비·OT 권한으로 확장되는 구조"
        desc="본인 확인, 교육·자격 검증, 현장 출입, 작업 권한을 거쳐 장비 사용 승인과 산업 설비 접근으로 확장되는 구조"
      />

      <p style={{ marginTop: 32, maxWidth: 620, fontSize: 15, fontWeight: 650, lineHeight: 1.85, color: '#475569', wordBreak: 'keep-all' }}>
        자격과 현장 권한을 확인한 뒤 기존 장비·OT 시스템의 사용 승인과 연동합니다.
      </p>

      <div className={styles.tagRow}>
        {targets.map((t) => (
          <span key={t} className={styles.tag}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
