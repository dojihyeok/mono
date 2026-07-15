import styles from './UnifiedFieldPassFlow.module.css';

type Step = {
  title: string;
  description: string;
  color: string;
  background: string;
  highlight?: 'blue' | 'orange';
};

const growthSteps: Step[] = [
  { title: '일용직', description: '단순 현장 근무', color: '#2563EB', background: '#EFF6FF' },
  { title: '필수 교육', description: '기초안전교육', color: '#0891B2', background: '#ECFEFF' },
  { title: '준비 완료', description: '서류·계좌·자격', color: '#16A34A', background: '#F0FDF4' },
  { title: '조공 경험', description: '현장 경험 축적', color: '#EA580C', background: '#FFF7ED' },
  { title: '건설근로자', description: '신뢰 프로필 완성', color: '#7C3AED', background: '#FAF5FF' },
  { title: 'MONO Field Pass', description: '앱·카드 인증 활성화', color: '#4F46E5', background: '#EEF2FF', highlight: 'blue' },
];

const authoritySteps: Step[] = [
  { title: 'MONO App Pass', description: '모바일 인증', color: '#0891B2', background: '#ECFEFF' },
  { title: '현장 출입', description: '게이트·관리자 앱 확인', color: '#16A34A', background: '#F0FDF4' },
  { title: '출근 기록', description: '시간·현장 자동 기록', color: '#059669', background: '#ECFDF5' },
  { title: '경력 반영', description: '현장·직무·공수 축적', color: '#7C3AED', background: '#FAF5FF' },
  { title: '신뢰 프로필', description: '교육·자격·경력 통합', color: '#9333EA', background: '#FAF5FF' },
  { title: '권한 확장', description: '출입·장비·OT 사용 승인', color: '#EA580C', background: '#FFF7ED', highlight: 'orange' },
];

const CARD_W = 220;
const CARD_H = 230;
const STEP_X = 270;
const START_X = 55;
const VIEW_W = 1680;

function cardX(index: number) {
  return START_X + index * STEP_X;
}

function SvgRow({ steps, y, rowLabel, gradientId }: { steps: Step[]; y: number; rowLabel: string; gradientId: string }) {
  const cy = y + CARD_H / 2;
  return (
    <g>
      <text x={START_X} y={y - 22} fontSize={13} fontWeight={850} fill="#94a3b8" letterSpacing={1.5}>
        {rowLabel.toUpperCase()}
      </text>
      <g stroke="#CBD5E1" strokeWidth={4} markerEnd="url(#authorityArrow)">
        {steps.slice(0, -1).map((_, i) => {
          const x1 = cardX(i) + CARD_W;
          const x2 = cardX(i + 1);
          return <line key={`c${i}`} x1={x1} y1={cy} x2={x2} y2={cy} />;
        })}
      </g>
      {steps.map((step, index) => {
        const x = cardX(index);
        const isHighlight = Boolean(step.highlight);
        const fill = step.highlight === 'blue' ? `url(#${gradientId}-blue)` : step.highlight === 'orange' ? `url(#${gradientId}-orange)` : '#FFFFFF';
        return (
          <g key={step.title} filter="url(#authorityCardShadow)">
            <rect x={x} y={y} width={CARD_W} height={CARD_H} rx={26} fill={fill} stroke={isHighlight ? 'transparent' : '#E2E8F0'} />
            <circle cx={x + 100} cy={y + 60} r={34} fill={isHighlight ? 'rgba(255,255,255,0.18)' : step.background} />
            <text x={x + 100} y={y + 70} textAnchor="middle" fontSize={22} fontWeight={900} fill={isHighlight ? '#FFFFFF' : step.color}>
              {index + 1}
            </text>
            <text x={x + 100} y={y + 135} textAnchor="middle" fontSize={isHighlight ? 18 : 19} fontWeight={900} fill={isHighlight ? '#FFFFFF' : '#0F2747'}>
              {step.title}
            </text>
            <text x={x + 100} y={y + 165} textAnchor="middle" fontSize={13.5} fontWeight={650} fill={isHighlight ? '#DBEAFE' : '#64748B'}>
              {step.description.length > 12 ? (
                <>
                  <tspan x={x + 100} dy={0}>
                    {step.description.slice(0, Math.ceil(step.description.length / 2))}
                  </tspan>
                  <tspan x={x + 100} dy={20}>
                    {step.description.slice(Math.ceil(step.description.length / 2))}
                  </tspan>
                </>
              ) : (
                step.description
              )}
            </text>
          </g>
        );
      })}
    </g>
  );
}

// UnifiedFieldPassFlow — 성장 여정(위)과 인증·권한 흐름(아래)을 하나의
// SVG(데스크톱) / 세로 카드(모바일)로 묶은 통합 인포그래픽. 예전에 따로 있던
// "Why MONO 타임라인" + "저해상도 참고 패널 PNG"의 중복을 제거하고 이 컴포넌트
// 하나로 대체했다. docs/field-pass-infographic-request.md 참고.
export function UnifiedFieldPassFlow() {
  const row1Y = 70;
  const bridgeY = row1Y + CARD_H + 60;
  const row2Y = bridgeY + 70;
  const bannerY = row2Y + CARD_H + 40;
  const bannerH = 100;
  const totalHeight = bannerY + bannerH + 30;

  return (
    <section className={styles.graphic}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>WHY MONO</span>
        <h2>왜 MONO가 Field Pass를 만드는가</h2>
        <p>현장 근무자의 성장 기록이 출입과 권한으로 이어집니다.</p>
      </header>

      {/* 데스크톱: 실제 SVG 2단 흐름 */}
      <div className={styles.viewportDesktop}>
        <svg viewBox={`0 0 ${VIEW_W} ${totalHeight}`} role="img" aria-labelledby="unified-flow-title unified-flow-desc" xmlns="http://www.w3.org/2000/svg">
          <title id="unified-flow-title">왜 MONO가 Field Pass를 만드는가 — 성장과 인증·권한 통합 흐름</title>
          <desc id="unified-flow-desc">
            일용직 근무자가 교육과 현장 경험을 쌓아 건설근로자로 성장하고 MONO Field Pass를 발급받은 뒤, 앱 인증으로 현장 출입·출근·경력·신뢰를 쌓아 장비·OT 권한까지 확장되는 과정
          </desc>
          <defs>
            <filter id="authorityCardShadow" x="-30%" y="-30%" width="160%" height="180%">
              <feDropShadow dx={0} dy={16} stdDeviation={18} floodColor="#0F172A" floodOpacity={0.08} />
            </filter>
            <marker id="authorityArrow" markerWidth={14} markerHeight={14} refX={12} refY={7} orient="auto">
              <path d="M0 0 L14 7 L0 14 Z" fill="#CBD5E1" />
            </marker>
            <linearGradient id="rowGradient-blue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
            <linearGradient id="rowGradient-orange" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#C2410C" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
          </defs>

          <rect x={20} y={20} width={VIEW_W - 40} height={totalHeight - 40} rx={38} fill="#F8FAFC" stroke="#E2E8F0" />

          <SvgRow steps={growthSteps} y={row1Y} rowLabel="성장 여정" gradientId="rowGradient" />

          <g>
            <line x1={VIEW_W / 2} y1={row1Y + CARD_H + 6} x2={VIEW_W / 2} y2={bridgeY + 40} stroke="#94A3B8" strokeWidth={4} markerEnd="url(#authorityArrow)" />
            <text x={VIEW_W / 2} y={row1Y + CARD_H + 34} textAnchor="middle" fontSize={14} fontWeight={850} fill="#4F46E5">
              Field Pass 발급 → 인증 시작
            </text>
          </g>

          <SvgRow steps={authoritySteps} y={row2Y} rowLabel="인증과 권한" gradientId="rowGradient" />

          <rect x={340} y={bannerY} width={VIEW_W - 680} height={bannerH} rx={24} fill="#0F2747" />
          <text x={VIEW_W / 2} y={bannerY + 38} textAnchor="middle" fontSize={19} fontWeight={850} fill="#FFFFFF">
            일한 기록이 경력이 되고, 경력이 Field Pass가 되며,
          </text>
          <text x={VIEW_W / 2} y={bannerY + 68} textAnchor="middle" fontSize={19} fontWeight={850} fill="#FFFFFF">
            Field Pass가 현장 권한으로 이어집니다.
          </text>
        </svg>
      </div>

      {/* 모바일: 동일 데이터의 세로 카드 흐름 */}
      <div className={styles.mobileFlow}>
        <div className={styles.mobileRowLabel}>성장 여정</div>
        {growthSteps.map((step, i) => (
          <div key={step.title}>
            <div
              className={`${styles.mobileCard} ${step.highlight === 'blue' ? styles.mobileCardHighlight : ''}`}
              style={{ ['--card-color' as string]: step.color, ['--card-bg' as string]: step.background }}
            >
              <div className={styles.mobileNumber}>{i + 1}</div>
              <div>
                <div className={styles.mobileCardTitle}>{step.title}</div>
                <div className={styles.mobileCardDesc}>{step.description}</div>
              </div>
            </div>
            {i < growthSteps.length - 1 && <div className={styles.mobileArrow}>↓</div>}
          </div>
        ))}

        <div className={styles.mobileBridge}>↓ Field Pass 발급 → 인증 시작 ↓</div>

        <div className={styles.mobileRowLabel}>인증과 권한</div>
        {authoritySteps.map((step, i) => (
          <div key={step.title}>
            <div
              className={`${styles.mobileCard} ${step.highlight === 'orange' ? styles.mobileCardHighlightOrange : ''}`}
              style={{ ['--card-color' as string]: step.color, ['--card-bg' as string]: step.background }}
            >
              <div className={styles.mobileNumber}>{i + 1}</div>
              <div>
                <div className={styles.mobileCardTitle}>{step.title}</div>
                <div className={styles.mobileCardDesc}>{step.description}</div>
              </div>
            </div>
            {i < authoritySteps.length - 1 && <div className={styles.mobileArrow}>↓</div>}
          </div>
        ))}

        <div className={styles.highlightBanner}>
          일한 기록이 경력이 되고, 경력이 Field Pass가 되며,
          <br />
          Field Pass가 현장 권한으로 이어집니다.
        </div>
      </div>
    </section>
  );
}
