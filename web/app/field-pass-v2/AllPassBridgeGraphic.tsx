import { CreditCard, FileCheck, Wallet, KeyRound, Bluetooth, QrCode, Nfc, Landmark, Database, Briefcase, ShieldCheck, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './field-pass-v2.module.css';
import { COLOR } from './graphicPrimitives';

type Group = { header: string; color: string; items: { icon: LucideIcon; label: string }[] };

const groups: Group[] = [
  {
    header: '건설올패스',
    color: COLOR.navy,
    items: [
      { icon: CreditCard, label: '전자카드' },
      { icon: FileCheck, label: '근로기록' },
      { icon: Wallet, label: '퇴직공제' },
    ],
  },
  {
    header: 'MONO App',
    color: COLOR.blue,
    items: [
      { icon: KeyRound, label: 'OTAC' },
      { icon: Bluetooth, label: 'BLE' },
      { icon: QrCode, label: 'QR' },
      { icon: Nfc, label: 'NFC' },
      { icon: CreditCard, label: 'CARD' },
    ],
  },
  {
    header: 'ERP',
    color: COLOR.teal,
    items: [
      { icon: Landmark, label: '공제회' },
      { icon: Database, label: '마이데이터' },
      { icon: Briefcase, label: '경력' },
      { icon: ShieldCheck, label: '권한' },
    ],
  },
];

const finalGroup = { header: '장비·OT·산업설비', color: COLOR.orange };

const COL_W = 190;
const COL_GAP = 90;
const ITEM_H = 44;
const ITEM_GAP = 10;
const HEADER_H = 44;
const PAD = 28;

function Column({ x, group, itemTop }: { x: number; group: Group; itemTop: number }) {
  return (
    <g>
      <rect x={x} y={PAD} width={COL_W} height={HEADER_H} rx={14} fill={group.color} />
      <text x={x + COL_W / 2} y={PAD + HEADER_H / 2 + 5} textAnchor="middle" fontSize={14} fontWeight={900} fill="#fff">
        {group.header}
      </text>
      {group.items.map((item, i) => {
        const y = itemTop + i * (ITEM_H + ITEM_GAP);
        return (
          <g key={item.label}>
            <rect x={x} y={y} width={COL_W} height={ITEM_H} rx={12} fill="#FFFFFF" stroke="#E2E8F0" />
            <circle cx={x + 28} cy={y + ITEM_H / 2} r={14} fill={`${group.color}1A`} />
            <g transform={`translate(${x + 28 - 9}, ${y + ITEM_H / 2 - 9})`}>
              <item.icon width={18} height={18} color={group.color} strokeWidth={1.8} />
            </g>
            <text x={x + 50} y={y + ITEM_H / 2 + 5} fontSize={13.5} fontWeight={800} fill={COLOR.navy}>
              {item.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function AllPassBridgeGraphic() {
  const maxItems = Math.max(...groups.map((g) => g.items.length));
  const itemTop = PAD + HEADER_H + 20;
  const listBottom = itemTop + maxItems * (ITEM_H + ITEM_GAP) - ITEM_GAP;
  const width = PAD * 2 + groups.length * COL_W + (groups.length - 1) * COL_GAP;
  const finalTop = listBottom + 50;
  const finalHeight = 70;
  const height = finalTop + finalHeight + PAD;
  const midY = PAD + HEADER_H / 2;

  return (
    <div className={styles.svgFrame}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="bridge-t bridge-d" xmlns="http://www.w3.org/2000/svg">
        <title id="bridge-t">건설올패스와 MONO Field Pass의 연계 구조</title>
        <desc id="bridge-d">
          건설올패스의 전자카드·근로기록·퇴직공제가 MONO App의 OTAC·BLE·QR·NFC·CARD 인증을 거쳐 ERP·공제회·마이데이터·경력·권한으로 연결되고, 최종적으로 장비·OT·산업설비 권한으로 이어지는 구조
        </desc>
        <defs>
          <marker id="bridgeArrow" markerWidth={14} markerHeight={14} refX={12} refY={7} orient="auto">
            <path d="M0 0 L14 7 L0 14 Z" fill={COLOR.indigo} />
          </marker>
        </defs>

        <g stroke={COLOR.indigo} strokeWidth={3} markerEnd="url(#bridgeArrow)">
          {groups.slice(0, -1).map((_, i) => {
            const x1 = PAD + (i + 1) * COL_W + i * COL_GAP;
            const x2 = x1 + COL_GAP;
            return <line key={i} x1={x1} y1={midY} x2={x2} y2={midY} />;
          })}
        </g>

        {groups.map((g, i) => (
          <Column key={g.header} x={PAD + i * (COL_W + COL_GAP)} group={g} itemTop={itemTop} />
        ))}

        <line
          x1={width / 2}
          y1={listBottom + 8}
          x2={width / 2}
          y2={finalTop - 4}
          stroke={COLOR.orange}
          strokeWidth={3}
          markerEnd="url(#bridgeArrow)"
        />
        <rect x={width / 2 - 160} y={finalTop} width={320} height={finalHeight} rx={20} fill={finalGroup.color} />
        <text x={width / 2} y={finalTop + finalHeight / 2 + 6} textAnchor="middle" fontSize={17} fontWeight={900} fill="#fff">
          {finalGroup.header}
        </text>
      </svg>
    </div>
  );
}

export function AllPassBridgeMobile() {
  return (
    <div className={styles.mobileFlow}>
      {groups.map((g, gi) => (
        <div key={g.header}>
          <div style={{ fontSize: 11, fontWeight: 900, color: g.color, letterSpacing: '0.08em', marginBottom: 10, marginTop: gi > 0 ? 20 : 0 }}>{g.header}</div>
          {g.items.map((item) => (
            <div key={item.label} className={styles.mCard} style={{ marginBottom: 10, ['--card-color' as string]: g.color, ['--card-bg' as string]: `${g.color}1A` }}>
              <div className={styles.mNumber}>
                <item.icon width={16} height={16} />
              </div>
              <div className={styles.mCardTitle}>{item.label}</div>
            </div>
          ))}
          <div style={{ textAlign: 'center', color: COLOR.indigo, fontSize: 16, padding: '6px 0' }}>↓</div>
        </div>
      ))}
      <div className={styles.mCard} style={{ background: finalGroup.color, borderLeftColor: 'transparent', justifyContent: 'center' }}>
        <div style={{ color: '#fff', fontWeight: 900, fontSize: 15, textAlign: 'center' }}>{finalGroup.header}</div>
      </div>
    </div>
  );
}
