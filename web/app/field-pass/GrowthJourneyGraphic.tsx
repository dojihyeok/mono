import styles from './GrowthJourneyGraphic.module.css';

type Step = {
  number: string;
  title: string;
  description: string;
  color: string;
  background: string;
};

const steps: Step[] = [
  {
    number: '01',
    title: '일용직',
    description: '단순 현장 근무 시작',
    color: '#2563EB',
    background: '#EFF6FF',
  },
  {
    number: '02',
    title: '필수 교육',
    description: '기초안전교육과 현장 준비',
    color: '#0891B2',
    background: '#ECFEFF',
  },
  {
    number: '03',
    title: '조공 경험',
    description: '출근과 작업 경험 축적',
    color: '#16A34A',
    background: '#F0FDF4',
  },
  {
    number: '04',
    title: '건설근로자',
    description: '경력·자격·신뢰 프로필 형성',
    color: '#EA580C',
    background: '#FFF7ED',
  },
  {
    number: '05',
    title: 'MONO Field Pass',
    description: '앱·카드 기반 현장 인증',
    color: '#4F46E5',
    background: '#EEF2FF',
  },
  {
    number: '06',
    title: '현장 권한',
    description: '출입·장비·OT 권한으로 확장',
    color: '#7C3AED',
    background: '#FAF5FF',
  },
];

// ① Growth Journey — /field-pass Growth Journey 섹션 전용 완성형 SVG 인포그래픽.
// KitCard(플랫 박스) 대신 카드형 6단계 + Field Pass 그라디언트 강조 카드로 구성.
export function GrowthJourneyInfographic() {
  return (
    <section className={styles.graphic}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>GROWTH CREDENTIAL</span>
        <h2>
          일용직에서 건설근로자로,
          <br />
          성장 기록이 현장 권한이 됩니다
        </h2>
        <p>교육과 현장 경험이 경력이 되고, 경력이 MONO Field Pass로 연결됩니다.</p>
      </header>
      <div className={styles.viewport}>
        <svg viewBox="0 0 1680 600" role="img" aria-labelledby="growth-journey-title growth-journey-desc" xmlns="http://www.w3.org/2000/svg">
          <title id="growth-journey-title">MONO Field Pass 성장 여정</title>
          <desc id="growth-journey-desc">
            일용직 근무자가 필수 교육과 조공 경험을 쌓아 건설근로자로 성장하고 MONO Field Pass를 통해 현장 출입과 장비 권한으로 확장되는 과정
          </desc>
          <defs>
            <filter id="cardShadow" x="-30%" y="-30%" width="160%" height="180%">
              <feDropShadow dx="0" dy="18" stdDeviation="22" floodColor="#0F172A" floodOpacity="0.08" />
            </filter>
            <linearGradient id="fieldPassGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
            <marker id="flowArrow" markerWidth="14" markerHeight="14" refX="12" refY="7" orient="auto">
              <path d="M0 0 L14 7 L0 14 Z" fill="#CBD5E1" />
            </marker>
          </defs>
          <rect x={20} y={20} width={1640} height={560} rx={38} fill="#F8FAFC" stroke="#E2E8F0" />
          <g stroke="#CBD5E1" strokeWidth={4} markerEnd="url(#flowArrow)">
            <line x1={275} y1={290} x2={320} y2={290} />
            <line x1={545} y1={290} x2={590} y2={290} />
            <line x1={815} y1={290} x2={860} y2={290} />
            <line x1={1085} y1={290} x2={1130} y2={290} />
            <line x1={1355} y1={290} x2={1400} y2={290} />
          </g>
          {steps.map((step, index) => {
            const x = 55 + index * 270;
            const isFieldPass = index === 4;
            return (
              <g key={step.number} filter="url(#cardShadow)">
                <rect
                  x={x}
                  y={145}
                  width={220}
                  height={290}
                  rx={30}
                  fill={isFieldPass ? 'url(#fieldPassGradient)' : '#FFFFFF'}
                  stroke={isFieldPass ? '#4F46E5' : '#E2E8F0'}
                />
                <rect x={x + 24} y={170} width={52} height={30} rx={15} fill={isFieldPass ? 'rgba(255,255,255,0.16)' : step.background} />
                <text x={x + 50} y={191} textAnchor="middle" fontSize={13} fontWeight={800} fill={isFieldPass ? '#FFFFFF' : step.color}>
                  {step.number}
                </text>
                <circle cx={x + 110} cy={250} r={44} fill={isFieldPass ? 'rgba(255,255,255,0.15)' : step.background} />
                <text x={x + 110} y={260} textAnchor="middle" fontSize={30} fontWeight={900} fill={isFieldPass ? '#FFFFFF' : step.color}>
                  {index + 1}
                </text>
                <text x={x + 110} y={332} textAnchor="middle" fontSize={isFieldPass ? 21 : 23} fontWeight={900} fill={isFieldPass ? '#FFFFFF' : '#0F2747'}>
                  {step.title}
                </text>
                <text x={x + 110} y={370} textAnchor="middle" fontSize={15} fontWeight={650} fill={isFieldPass ? '#DBEAFE' : '#64748B'}>
                  {step.description.length > 15 ? (
                    <>
                      <tspan x={x + 110} dy={0}>
                        {step.description.slice(0, 15)}
                      </tspan>
                      <tspan x={x + 110} dy={24}>
                        {step.description.slice(15)}
                      </tspan>
                    </>
                  ) : (
                    step.description
                  )}
                </text>
              </g>
            );
          })}
          <rect x={390} y={485} width={900} height={62} rx={20} fill="#0F2747" />
          <text x={840} y={524} textAnchor="middle" fontSize={21} fontWeight={850} fill="#FFFFFF">
            일한 기록 → 경력 → Field Pass → 출입·장비 권한
          </text>
        </svg>
      </div>
    </section>
  );
}
