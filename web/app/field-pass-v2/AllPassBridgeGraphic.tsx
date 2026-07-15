import { Award, FileCheck, Wallet, CreditCard, Smartphone, DoorOpen, Briefcase, ShieldCheck, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './field-pass-v2.module.css';
import { COLOR } from './graphicPrimitives';

type Item = { icon: LucideIcon; label: string };

const allpassItems: Item[] = [
  { icon: Award, label: '공적 자격' },
  { icon: FileCheck, label: '근로 기록' },
  { icon: Wallet, label: '퇴직공제' },
  { icon: CreditCard, label: '전자카드' },
];

const fieldPassItems: Item[] = [
  { icon: Smartphone, label: 'MONO 앱 인증' },
  { icon: DoorOpen, label: '출입·출근' },
  { icon: Briefcase, label: '경력 축적' },
  { icon: ShieldCheck, label: '현장 권한' },
  { icon: Truck, label: '장비·OT 권한' },
];

const COL_W = 380;
const ITEM_H = 62;
const ITEM_GAP = 14;
const HEADER_H = 56;
const BRIDGE_W = 260;
const PAD = 24;

function ItemPill({ x, y, item, color, dark }: { x: number; y: number; item: Item; color: string; dark?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={COL_W} height={ITEM_H} rx={18} fill={dark ? 'rgba(255,255,255,0.06)' : '#FFFFFF'} stroke={dark ? 'rgba(255,255,255,0.14)' : '#E2E8F0'} />
      <circle cx={x + 34} cy={y + ITEM_H / 2} r={18} fill={`${color}1A`} />
      <g transform={`translate(${x + 34 - 10}, ${y + ITEM_H / 2 - 10})`}>
        <item.icon width={20} height={20} color={color} strokeWidth={1.8} />
      </g>
      <text x={x + 62} y={y + ITEM_H / 2 + 5} fontSize={15} fontWeight={800} fill={dark ? '#FFFFFF' : '#0F172A'}>
        {item.label}
      </text>
    </g>
  );
}

export function AllPassBridgeGraphic() {
  const rows = Math.max(allpassItems.length, fieldPassItems.length);
  const width = PAD * 2 + COL_W * 2 + BRIDGE_W;
  const height = PAD * 2 + HEADER_H + rows * ITEM_H + (rows - 1) * ITEM_GAP;
  const leftX = PAD;
  const rightX = PAD + COL_W + BRIDGE_W;
  const listTop = PAD + HEADER_H;
  const centerX = width / 2;
  const centerY = listTop + (rows * (ITEM_H + ITEM_GAP) - ITEM_GAP) / 2;

  return (
    <div className={styles.svgFrame}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="allpass-bridge-t allpass-bridge-d" xmlns="http://www.w3.org/2000/svg">
        <title id="allpass-bridge-t">건설올패스와 MONO Field Pass 연결 구조</title>
        <desc id="allpass-bridge-d">
          건설올패스의 공적 자격·근로 기록·퇴직공제·전자카드가 MONO Field Pass의 앱 인증·출입출근·경력축적·현장권한·장비OT권한으로 연결되는 구조
        </desc>
        <defs>
          <marker id="bridgeArrow" markerWidth={14} markerHeight={14} refX={12} refY={7} orient="auto">
            <path d="M0 0 L14 7 L0 14 Z" fill={COLOR.indigo} />
          </marker>
        </defs>

        <text x={leftX} y={PAD + 24} fontSize={13} fontWeight={900} fill="#94A3B8" letterSpacing={1.2}>
          건설올패스
        </text>
        {allpassItems.map((item, i) => (
          <ItemPill key={item.label} x={leftX} y={listTop + i * (ITEM_H + ITEM_GAP)} item={item} color={COLOR.navy} />
        ))}

        <text x={rightX} y={PAD + 24} fontSize={13} fontWeight={900} fill={COLOR.indigo} letterSpacing={1.2}>
          MONO FIELD PASS
        </text>
        {fieldPassItems.map((item, i) => (
          <ItemPill key={item.label} x={rightX} y={listTop + i * (ITEM_H + ITEM_GAP)} item={item} color={COLOR.indigo} />
        ))}

        <line x1={leftX + COL_W + 20} y1={centerY} x2={rightX - 20} y2={centerY} stroke={COLOR.indigo} strokeWidth={3} markerEnd="url(#bridgeArrow)" />
        <circle cx={centerX} cy={centerY} r={44} fill={COLOR.indigo} />
        <text x={centerX} y={centerY + 6} textAnchor="middle" fontSize={15} fontWeight={900} fill="#FFFFFF">
          연결
        </text>
      </svg>
    </div>
  );
}

export function AllPassBridgeMobile() {
  return (
    <div className={styles.mobileFlow}>
      <div style={{ fontSize: 11, fontWeight: 900, color: '#94a3b8', letterSpacing: '0.08em', marginBottom: 10 }}>건설올패스</div>
      {allpassItems.map((item) => (
        <div key={item.label} className={styles.mCard} style={{ marginBottom: 10, ['--card-color' as string]: COLOR.navy, ['--card-bg' as string]: '#EEF2F7' }}>
          <div className={styles.mNumber}>
            <item.icon width={16} height={16} />
          </div>
          <div className={styles.mCardTitle}>{item.label}</div>
        </div>
      ))}
      <div style={{ textAlign: 'center', margin: '18px 0', color: COLOR.indigo, fontWeight: 800, fontSize: 13 }}>↓ 연결 ↓</div>
      <div style={{ fontSize: 11, fontWeight: 900, color: COLOR.indigo, letterSpacing: '0.08em', marginBottom: 10 }}>MONO FIELD PASS</div>
      {fieldPassItems.map((item) => (
        <div key={item.label} className={styles.mCard} style={{ marginBottom: 10, ['--card-color' as string]: COLOR.indigo, ['--card-bg' as string]: '#EEF2FF' }}>
          <div className={styles.mNumber}>
            <item.icon width={16} height={16} />
          </div>
          <div className={styles.mCardTitle}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}
