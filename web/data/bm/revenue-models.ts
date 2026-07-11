// MONO 수익모델 진화 시뮬레이터 — 계산식·벤치마크·실행계획 데이터
// 원본: MONO_BM_진화_시뮬레이터_v2.0.html (계산 로직·벤치마크 수치는 그대로 이식, UI만 재구현)
import type { SimulatorFeature, SimulatorInput } from '@/types/bm';

export const SIMULATOR_INPUTS: SimulatorInput[] = [
  { id: 'W', label: '기술인 가입자 수', min: 100, max: 100000, step: 100, def: 5000, unit: '명' },
  { id: 'C', label: '기업 회원(협력사) 수', min: 10, max: 2000, step: 10, def: 100, unit: '개사' },
  { id: 'A', label: '제휴 인력사무소 수', min: 0, max: 2000, step: 10, def: 50, unit: '개소' },
  { id: 'F', label: '관리 외국인 인력 수', min: 0, max: 20000, step: 50, def: 500, unit: '명' },
  { id: 'D', label: '월 출역 건수 (연인원)', min: 0, max: 1000000, step: 1000, def: 20000, unit: '건' },
  { id: 'G', label: '월 도급·매칭 거래액', min: 0, max: 500, step: 1, def: 5, unit: '억원' },
];

export const SIMULATOR_FEATURES: SimulatorFeature[] = [
  {
    id: 'mapOffice', phase: 1, name: '지도 기반 인력사무소 연결 (네이버지도)',
    status: '신규 개발', statusCls: 'bg-emerald-100 text-emerald-700',
    desc: '전국 유료직업소개소를 지도 레이어로 노출하고 온보딩·연결. 네이버 Maps API: Dynamic 0.1원/건(월 무료 한도 내 초기 비용 사실상 0원)',
    models: [
      {
        name: '소개소 프리미엄 플레이스 노출',
        formulaText: '제휴 소개소 × 30% 전환 × 월 8.8만원',
        calc: (v) => v.A * 0.3 * 88000,
        benchmark: '배민 울트라콜 월 8.8만원(깃발당) 모델. 2025년 7월 폐지 후 6.8% 정률로 전환된 흐름까지 참고해, 성숙기에 매칭 정률제 전환 옵션 설계',
        plan: ['1단계: 공공데이터(직업소개사업 등록 현황)로 전국 소개소 DB 구축, 지도 무료 노출', '2단계: 전화·방문 온보딩으로 소유권 클레임 유도(네이버 스마트플레이스 방식)', '3단계: 상단 고정·반경 확대 노출을 월 정액 프리미엄으로 판매'],
        evidenceStatus: 'benchmark',
      },
      {
        name: '소개소 리드 연결 수수료',
        formulaText: '가입 기술인 5% × 월 1회 연결 × 건당 5,000원',
        calc: (v) => v.W * 0.05 * 5000,
        benchmark: '숨고 견적 리드 건당 1~5만원 캐시 차감 모델의 저가 변형. 소개소가 기술인 연결 요청을 수신할 때 건당 과금',
        plan: ['1단계: 앱에서 "가까운 소개소 연결" 버튼 무료 오픈으로 수요 검증', '2단계: 소개소측 수신함 SaaS 제공, 연결 건당 캐시 차감 도입', '3단계: 미열람 환급(숨고 방식)으로 신뢰 확보 후 단가 인상'],
        evidenceStatus: 'benchmark',
      },
      {
        name: '지역 타깃 공고 광고',
        formulaText: '기업 회원 × 30% × 월 10만원 예산',
        calc: (v) => v.C * 0.3 * 100000,
        benchmark: '네이버 플레이스광고 CPC 50~5,000원(일 한도 2만원), 당근 지역광고 CPC 300~600원. 지도 반경 기반 긴급 구인 노출',
        plan: ['1단계: 지도에 현장·공고 핀 무료 표기', '2단계: 반경 3km 기술인 푸시+지도 상단 고정을 CPC/정액 하이브리드로 판매', '3단계: 시즌(동절기 전 마감 공사 등) 패키지 상품화'],
        evidenceStatus: 'benchmark',
      },
    ],
  },
  {
    id: 'jobAI', phase: 2, name: '일자리 예측 AI',
    status: '스키마 준비 (MarketInsight)', statusCls: 'bg-blue-100 text-blue-700',
    desc: '나라장터 발주계획 API(무료·상업이용 가능)+세움터 인허가 2.8억건+자체 공고 데이터로 권역·공종별 인력 수요 예측',
    models: [
      {
        name: '수요 예측 구독 (기업)',
        formulaText: '기업 회원 × 40% × 월 15만원',
        calc: (v) => v.C * 0.4 * 150000,
        benchmark: '미국 ConstructConnect 지역당 월 $129~199, Dodge 인당 월 $300. 국내는 원천 데이터가 무료 개방이라 예측·매칭 레이어에서 과금',
        plan: ['1단계: 나라장터·세움터 파이프라인 구축, 무료 "이번 달 우리 지역 착공 예정" 위젯 배포', '2단계: 공종·권역별 인력 수요 예측 리포트 유료 구독 전환', '3단계: 예측→선제 인력 확보 제안까지 묶은 패키지 업셀'],
        evidenceStatus: 'benchmark',
      },
      {
        name: '예측 연동 매칭 성공 수수료',
        formulaText: '월 거래액 × 예측 경유 10% × 2.2%',
        calc: (v) => v.G * 1e8 * 0.10 * 0.022,
        benchmark: '비드프로의 "정액 연 77만원 + 낙찰액 2.2%" 하이브리드가 국내서 20년 검증된 구조. 예측이 만든 매칭에만 성공 수수료',
        plan: ['1단계: 예측 리포트에서 바로 작업 요청 등록되는 전환 퍼널 설계', '2단계: 예측 경유 매칭 성사 건 태깅·성과 측정', '3단계: 성사 시에만 과금(실패 시 무료)을 소구점으로 영업'],
        evidenceStatus: 'benchmark',
      },
      {
        name: 'AI 적정 요율 내재화 (마진 개선)',
        formulaText: '월 거래액 × 30% 적용 × 마진 +1.5%p',
        calc: (v) => v.G * 1e8 * 0.3 * 0.015,
        benchmark: 'PeopleReady JobStack이 2025년 12월 AI 실시간 Bill Rate 도입 - 예측을 별도 상품이 아닌 거래 가격 결정에 내재화해 마진 확대. LinkedIn도 AI를 기존 구독 업셀로 활용(연환산 $450M)',
        plan: ['1단계: 축적된 공고·매칭 데이터로 공종·지역별 적정 일당 밴드 산출', '2단계: 도급 매칭 견적에 AI 권장 요율 자동 제시', '3단계: 요율 신뢰도가 오르면 수수료율 프리미엄 반영'],
        evidenceStatus: 'benchmark',
      },
    ],
  },
  {
    id: 'attendance', phase: 2, name: '출역·정산 탭 활성화',
    status: '스키마 완성·화면 숨김', statusCls: 'bg-amber-100 text-amber-700',
    desc: 'Attendance·Settlement·SettlementItem 모델 구현 완료 상태. 화면 노출 + 운영 연동만 남음',
    models: [
      {
        name: '임금 선지급 (EWA)',
        formulaText: '월 출역 × 25% 이용 × 건당 900원',
        calc: (v) => v.D * 0.25 * 900,
        benchmark: '페이워치 건당 700~900원(도입 500개사), 글로벌 밴드 DailyPay $1.99~3.99·Wagestream £1.75~1.95. 건설 일용직은 국내 공백 시장',
        plan: ['1단계: 출역 체크아웃 데이터 정합성 3개월 검증', '2단계: 금융 파트너(페이워치류) 제휴로 선지급 파일럿', '3단계: 에스크로 특허(패키지C) 결합해 자체 인프라화'],
        evidenceStatus: 'benchmark',
      },
      {
        name: '에스크로 대금 자동 집행',
        formulaText: '월 노무비(출역×평균 일당 18만원) × 30% 침투 × 0.3%',
        calc: (v) => v.D * 180000 * 0.3 * 0.003,
        benchmark: 'Oracle이 $663M에 인수한 Textura: 계약액의 0.22%(상한 $5,000)로 월 $3.4B 처리. Procore Pay 0.2%. MONO 특허4(근태 연동 에스크로)로 방어 가능',
        plan: ['1단계: 원청 예치→출역 연동 자동 집행 PoC (1개 현장)', '2단계: 임금직불제 의무화 공공 현장 시범사업 수주', '3단계: 집행액 정률 과금 + 임금체불 제로 인증을 ESG 상품화'],
        evidenceStatus: 'benchmark',
      },
    ],
  },
  {
    id: 'trust', phase: 2, name: '신뢰점수·평가 엔진 가동',
    status: '스키마 완성·화면 숨김', statusCls: 'bg-amber-100 text-amber-700',
    desc: 'Review(7개 지표)·TrustScore 모델 구현 완료. 평가 UI 노출 + 점수 엔진 가동만 남음',
    models: [
      {
        name: '채용 전 이력 검증 API',
        formulaText: '기업 회원 × 월 10건 조회 × 건당 2만원',
        calc: (v) => v.C * 10 * 20000,
        benchmark: '미국 Checkr 건당 $25~35(최저 $29.99), QuickBooks 임베드로 유니콘. 건설근로자공제회 기능등급증명 연동이 국내 차별점',
        plan: ['1단계: 공제회 기능등급·커리어 블록 연동 검증 뱃지 무료 발급(공급면 선점)', '2단계: 기업 대상 채용 전 진위 조회 건당 과금 오픈', '3단계: 은행·보험사 임베드 라이선스로 격상'],
        evidenceStatus: 'benchmark',
      },
      {
        name: '컴플라이언스 등록 연회비',
        formulaText: '기업 회원 × 30% × 연 200만원 ÷ 12',
        calc: (v) => v.C * 0.3 * 2000000 / 12,
        benchmark: 'ISN 협력사 연 $875~ × 9만사 = ARR $253M. Avetta는 EQT가 $3B(EBITDA 24배)에 인수. 원청 의무화가 지불을 강제하는 톨게이트 모델',
        plan: ['1단계: 앵커 원청 1개사와 협력사 등록 기준 공동 설계', '2단계: 신규 계약 조건에 MONO 등록 의무화 조항 삽입', '3단계: 원청 확대에 따라 협력사 연회비 자동 스케일(갱신율 90%+ 목표)'],
        evidenceStatus: 'benchmark',
      },
    ],
  },
  {
    id: 'foreign', phase: 1, name: '외국인 허브 정식 오픈',
    status: '구현 완료', statusCls: 'bg-green-100 text-green-700',
    desc: 'ForeignWorkerHub·VisaStatus·다국어 용어집(6개 언어) 구현 완료. 가장 빠른 유료화 가능 지점',
    models: [
      {
        name: '외국인 인력 운영 구독 (EOR-lite)',
        formulaText: '관리 외국인 × 인당 월 3만원',
        calc: (v) => v.F * 30000,
        benchmark: 'Deel·Remote EOR 인당 월 $599(저가형 $99~399), UAE WPS 직원당 AED 3~5 제도화. 민간 알선(첫 월급 10~20%) 대비 지속 과금형',
        plan: ['1단계: 외국인 다수 고용 협력사 무료 컴플라이언스 진단 리포트', '2단계: 비자 만료 알림·서류 검증·다국어 정산 묶음 인당 과금', '3단계: 고용허가제 쿼터 시즌 맞춰 확산'],
        evidenceStatus: 'benchmark',
      },
      {
        name: '해외 송금 FX 셰어',
        formulaText: '관리 외국인 × 50% × 월 150만원 송금 × 0.7%',
        calc: (v) => v.F * 0.5 * 1500000 * 0.007,
        benchmark: 'Deel 실질 FX 마진 1.6~3%(제3자 실측), UAE NOW Money·C3Pay가 이주노동자 급여+송금 번들 선례. 정산 시점 임베드로 CAC 제로',
        plan: ['1단계: 소액해외송금업 제휴사(센트비·한패스류) 선정', '2단계: 다국어 정산표에 "송금하기" 버튼 임베드', '3단계: 송출국 커뮤니티 리더 제휴로 확산'],
        evidenceStatus: 'benchmark',
      },
    ],
  },
  {
    id: 'aiLeader', phase: 3, name: 'AI 현장 리더 (에이전트)',
    status: '관심신청 수집 중', statusCls: 'bg-slate-100 text-slate-600',
    desc: 'AiLeaderInterest 스키마 준비. 일정 조율·팀 추천·장비 요청을 AI가 대행하는 반장 보조 에이전트',
    models: [
      {
        name: '반장 AI 어시스턴트 구독',
        formulaText: '가입자 5%(반장) × 30% 전환 × 월 3만원',
        calc: (v) => v.W * 0.05 * 0.3 * 30000,
        benchmark: 'LinkedIn 에이전틱 인재 상품이 연환산 $450M 돌파 - AI는 별도 과금보다 기존 구독을 정당화하는 업셀 포인트로 작동',
        plan: ['1단계: 관심신청 수요 상위 기능(일정 조율)부터 베타', '2단계: 팀 가용성·동료 그래프 연동 자동 소집 기능', '3단계: 반장 유료 구독 또는 Workspace 상위 티어 번들'],
        evidenceStatus: 'hypothesis',
      },
    ],
  },
  {
    id: 'pass', phase: 3, name: '현장 출입 디지털 패스',
    status: '신규 개발', statusCls: 'bg-emerald-100 text-emerald-700',
    desc: '안전교육·자격·비자 통합 QR 출입 패스. 신뢰 엔진과 결합 시 컴플라이언스 네트워크의 물리적 관문',
    models: [
      {
        name: '원청 의무화 기관 라이선스',
        formulaText: '기업 회원 × 2%(원청 전환) × 연 5,000만원 ÷ 12',
        calc: (v) => v.C * 0.02 * 50000000 / 12,
        benchmark: 'ISN 기관측 연 $50,000 수준 × 900개 원청. NYC LL196은 법정 의무(벌금 인당 최대 $5,000)가 myComply(연 $499~1,999) 수요 창출 - 중대재해처벌법이 같은 역할',
        plan: ['1단계: 앵커 현장 1곳 QR 출입 게이트 PoC', '2단계: 출입 데이터→안전 스코어→보험 연계(Kinetic 모델) 확장', '3단계: LH·지방공사 시범사업으로 공공 레퍼런스 확보'],
        evidenceStatus: 'benchmark',
      },
    ],
  },
];

export const fmtWon = (v: number): string => {
  if (v >= 1e8) return (v / 1e8).toFixed(1).replace(/\.0$/, '') + '억원';
  if (v >= 1e4) return Math.round(v / 1e4).toLocaleString() + '만원';
  return Math.round(v).toLocaleString() + '원';
};
