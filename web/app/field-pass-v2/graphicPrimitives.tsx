import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './field-pass-v2.module.css';

// 스크롤 진입 시 fade-up — 모든 Chapter/인포그래픽에 공통으로 씌우는 최소한의 모션.
export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MONO Field Pass v2 — 인포그래픽 공용 프리미티브.
// 대부분의 섹션이 "아이콘 원 + 제목 + 설명"이 화살표로 이어지는 가로 체인
// 구조라, 데스크톱 SVG 카드/화살표와 모바일 세로 카드(같은 데이터, CSS로 전환)를
// 여기서 한 번만 구현하고 각 그래픽 컴포넌트는 데이터만 채운다.
// ─────────────────────────────────────────────

export const COLOR = {
  bg: '#F7F8FA',
  white: '#FFFFFF',
  navy: '#0F172A',
  indigo: '#4F46E5',
  blue: '#2563EB',
  teal: '#0F9F9A',
  green: '#22C55E',
  orange: '#F59E0B',
  purple: '#7C3AED',
};

export type ChainStep = {
  icon: LucideIcon;
  title: string;
  sub?: string;
  color: string;
  background: string;
  highlight?: boolean;
};

export function ChainDefs({ arrowId, shadowId, arrowColor = '#CBD5E1', dark }: { arrowId: string; shadowId: string; arrowColor?: string; dark?: boolean }) {
  return (
    <defs>
      <marker id={arrowId} markerWidth={14} markerHeight={14} refX={12} refY={7} orient="auto">
        <path d="M0 0 L14 7 L0 14 Z" fill={dark ? 'rgba(255,255,255,0.35)' : arrowColor} />
      </marker>
      <filter id={shadowId} x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dx={0} dy={14} stdDeviation={16} floodColor="#0F172A" floodOpacity={dark ? 0.25 : 0.07} />
      </filter>
      <linearGradient id={`${arrowId}-highlight`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1D4ED8" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
  );
}

export function chainLayout(count: number, opts?: { cardW?: number; cardH?: number; gap?: number; padX?: number; padY?: number }) {
  const cardW = opts?.cardW ?? 190;
  const cardH = opts?.cardH ?? 180;
  const gap = opts?.gap ?? 36;
  const padX = opts?.padX ?? 30;
  const padY = opts?.padY ?? 30;
  const step = cardW + gap;
  const x = (i: number) => padX + i * step;
  const width = padX * 2 + count * cardW + (count - 1) * gap;
  const height = padY * 2 + cardH;
  return { cardW, cardH, padY, x, width, height };
}

export function ChainCard({
  x,
  y,
  w,
  h,
  icon: Icon,
  title,
  sub,
  color,
  background,
  highlight,
  shadowId,
  gradientId,
  dark,
}: ChainStep & { x: number; y: number; w: number; h: number; shadowId: string; gradientId: string; dark?: boolean }) {
  const iconR = 28;
  return (
    <g filter={`url(#${shadowId})`}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={24}
        fill={highlight ? `url(#${gradientId})` : dark ? 'rgba(255,255,255,0.06)' : '#FFFFFF'}
        stroke={highlight ? 'transparent' : dark ? 'rgba(255,255,255,0.14)' : '#E2E8F0'}
      />
      <circle cx={x + w / 2} cy={y + 46} r={iconR} fill={highlight ? 'rgba(255,255,255,0.18)' : background} />
      <g transform={`translate(${x + w / 2 - 13}, ${y + 33})`}>
        <Icon width={26} height={26} color={highlight ? '#FFFFFF' : color} strokeWidth={1.8} />
      </g>
      <text x={x + w / 2} y={y + 100} textAnchor="middle" fontSize={15.5} fontWeight={850} fill={highlight ? '#FFFFFF' : dark ? '#FFFFFF' : '#0F172A'}>
        {title}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + 124} textAnchor="middle" fontSize={12} fontWeight={650} fill={highlight ? 'rgba(255,255,255,0.85)' : dark ? 'rgba(226,232,240,0.7)' : '#64748B'}>
          {sub.length > 11 ? (
            <>
              <tspan x={x + w / 2} dy={0}>
                {sub.slice(0, Math.ceil(sub.length / 2))}
              </tspan>
              <tspan x={x + w / 2} dy={17}>
                {sub.slice(Math.ceil(sub.length / 2))}
              </tspan>
            </>
          ) : (
            sub
          )}
        </text>
      )}
    </g>
  );
}

export function ChainArrows({ count, y, layout, arrowId, dark }: { count: number; y: number; layout: ReturnType<typeof chainLayout>; arrowId: string; dark?: boolean }) {
  return (
    <g stroke={dark ? 'rgba(255,255,255,0.3)' : '#CBD5E1'} strokeWidth={3} markerEnd={`url(#${arrowId})`}>
      {Array.from({ length: count - 1 }).map((_, i) => {
        const x1 = layout.x(i) + layout.cardW;
        const x2 = layout.x(i + 1);
        return <line key={i} x1={x1} y1={y} x2={x2} y2={y} />;
      })}
    </g>
  );
}

// 데스크톱 SVG 가로 체인 (아이콘 원 카드 + 화살표), title/desc/aria-labelledby 포함.
export function SvgChain({ steps, titleId, title, desc, dark }: { steps: ChainStep[]; titleId: string; title: string; desc: string; dark?: boolean }) {
  const layout = chainLayout(steps.length);
  const arrowId = `${titleId}-arrow`;
  const shadowId = `${titleId}-shadow`;
  const gradientId = `${arrowId}-highlight`;
  return (
    <div className={styles.svgFrame}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-labelledby={`${titleId}-t ${titleId}-d`} xmlns="http://www.w3.org/2000/svg">
        <title id={`${titleId}-t`}>{title}</title>
        <desc id={`${titleId}-d`}>{desc}</desc>
        <ChainDefs arrowId={arrowId} shadowId={shadowId} dark={dark} />
        <ChainArrows count={steps.length} y={layout.padY + layout.cardH / 2} layout={layout} arrowId={arrowId} dark={dark} />
        {steps.map((s, i) => (
          <ChainCard key={s.title} {...s} x={layout.x(i)} y={layout.padY} w={layout.cardW} h={layout.cardH} shadowId={shadowId} gradientId={gradientId} dark={dark} />
        ))}
      </svg>
    </div>
  );
}

// 모바일: 동일 step 데이터를 세로 카드로 (SVG 축소가 아닌 별도 DOM, CSS로 전환).
export function MobileChain({ steps, dark }: { steps: ChainStep[]; dark?: boolean }) {
  return (
    <div className={styles.mobileFlow}>
      {steps.map((s, i) => (
        <div key={s.title}>
          <div
            className={`${styles.mCard} ${s.highlight ? styles.mCardHighlight : ''}`}
            style={{ ['--card-color' as string]: s.color, ['--card-bg' as string]: s.background }}
          >
            <div className={styles.mNumber}>
              <s.icon width={16} height={16} />
            </div>
            <div>
              <div className={styles.mCardTitle}>{s.title}</div>
              {s.sub && <div className={styles.mCardDesc}>{s.sub}</div>}
            </div>
          </div>
          {i < steps.length - 1 && <div className={styles.mArrow}>↓</div>}
        </div>
      ))}
    </div>
  );
}

// 데스크톱 SVG + 모바일 세로 카드를 함께 렌더링(가시성은 CSS 미디어쿼리로 전환).
export function ResponsiveChain({ steps, titleId, title, desc, dark }: { steps: ChainStep[]; titleId: string; title: string; desc: string; dark?: boolean }) {
  return (
    <>
      <SvgChain steps={steps} titleId={titleId} title={title} desc={desc} dark={dark} />
      <MobileChain steps={steps} dark={dark} />
    </>
  );
}

// 큰 그림 하나 — 텍스트는 제목만, 노드가 세로로 이어지는 "Why MONO"류 대형 인포그래픽.
// 데스크톱·모바일 모두 세로 배치라 별도 모바일 DOM 없이 반응형 뷰박스만 쓴다.
export function VerticalBigPicture({ steps, titleId, title, desc, dark }: { steps: ChainStep[]; titleId: string; title: string; desc: string; dark?: boolean }) {
  const nodeH = 92;
  const gap = 30;
  const padY = 30;
  const width = 420;
  const height = padY * 2 + steps.length * nodeH + (steps.length - 1) * gap;
  const arrowId = `${titleId}-arrow`;
  const shadowId = `${titleId}-shadow`;
  const gradientId = `${arrowId}-highlight`;
  const cy = (i: number) => padY + i * (nodeH + gap) + nodeH / 2;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${titleId}-t ${titleId}-d`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 420, height: 'auto', display: 'block' }}>
        <title id={`${titleId}-t`}>{title}</title>
        <desc id={`${titleId}-d`}>{desc}</desc>
        <ChainDefs arrowId={arrowId} shadowId={shadowId} dark={dark} />
        <g stroke={dark ? 'rgba(255,255,255,0.3)' : '#CBD5E1'} strokeWidth={3} markerEnd={`url(#${arrowId})`}>
          {steps.slice(0, -1).map((_, i) => (
            <line key={i} x1={width / 2} y1={cy(i) + nodeH / 2} x2={width / 2} y2={cy(i + 1) - nodeH / 2} />
          ))}
        </g>
        {steps.map((s, i) => {
          const y = cy(i) - nodeH / 2;
          return (
            <g key={s.title} filter={`url(#${shadowId})`}>
              <rect
                x={width / 2 - 170}
                y={y}
                width={340}
                height={nodeH}
                rx={22}
                fill={s.highlight ? `url(#${gradientId})` : dark ? 'rgba(255,255,255,0.06)' : '#FFFFFF'}
                stroke={s.highlight ? 'transparent' : dark ? 'rgba(255,255,255,0.14)' : '#E2E8F0'}
              />
              <circle cx={width / 2 - 170 + 46} cy={y + nodeH / 2} r={26} fill={s.highlight ? 'rgba(255,255,255,0.18)' : s.background} />
              <g transform={`translate(${width / 2 - 170 + 46 - 13}, ${y + nodeH / 2 - 13})`}>
                <s.icon width={26} height={26} color={s.highlight ? '#FFFFFF' : s.color} strokeWidth={1.8} />
              </g>
              <text x={width / 2 - 170 + 92} y={y + nodeH / 2 + 6} fontSize={18} fontWeight={850} fill={s.highlight ? '#FFFFFF' : dark ? '#FFFFFF' : '#0F172A'}>
                {s.title}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
