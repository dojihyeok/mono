'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Tier = 'core' | 'expansion' | 'longterm';
type Priority = 'P0' | 'P1' | 'P2' | 'Long-term' | '보류';

type StrategyTag =
  | 'fast-validation'
  | 'lock-in'
  | 'leader-net'
  | 'field-ops'
  | 'enterprise-win'
  | 'finance'
  | 'global'
  | 'ai-physical';

type CompetitorTag =
  | 'gada'
  | 'soomgo'
  | 'ajungdang'
  | 'todayhouse'
  | 'taskrabbit'
  | 'thumbtack'
  | 'instawork'
  | 'workrise'
  | 'avetta'
  | 'procore';

interface CompetitorDetail {
  name: string;
  type: string;
  strategy: string;
  successPoint: string;
  limitation: string;
  monoResponse: string;
  monoAvoid: string;
  linkableBMs: string[];
}

interface CellInfo {
  segment: '기술자' | '현장 리더' | '수행 기업' | '협력사' | '원청' | '대기업' | '정부·지자체';
  description: string;
  stage: string;
  competitors: string[];
  painPoint: string;
  pricingType: string;
  validationEvent: string;
  monoStrategy: string;
}

interface BM {
  id: string;
  name: string;
  tier: Tier;
  priority: Priority;
  strategyTags: StrategyTag[];
  competitorTags: CompetitorTag[];
  cells: CellInfo[];
  pricingAssumption: string;
  mvpValidation: string;
  validationEvents: string[];
  keyMetrics: string[];
  risks: string[];
  nextAction: string;
  arpu: string;
  gtm: string;
  lockIn: string[];
  competitorDetails: CompetitorDetail[];
}

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const BM_DATA: BM[] = [
  {
    id: 'job-posting',
    name: 'B2B 기업 공고 과금',
    tier: 'core',
    priority: 'P0',
    strategyTags: ['fast-validation'],
    competitorTags: ['gada', 'soomgo', 'instawork'],
    cells: [
      {
        segment: '기술자',
        description: '일당 노이즈 없는 고정 단가 현장 공고 무료 탐색',
        stage: '초기 무료',
        competitors: ['가다'],
        painPoint: '구직 시 일당이 고무줄이거나 현장 근무 정보가 불투명함',
        pricingType: '공고 탐색 및 지원 무료',
        validationEvent: 'worker_applied_to_job',
        monoStrategy: '평판 인증 근로자 우선 다이렉트 공고 제안',
      },
      {
        segment: '현장 리더',
        description: '소속 팀원 일체 투입이 가능한 중대형 공고 소싱 연계',
        stage: '초기 무료',
        competitors: ['숨고'],
        painPoint: '개별 사이트에서 10명 이상 대량 인력 투입 건을 찾기 어려움',
        pricingType: '단체 공고 매칭 무료',
        validationEvent: 'leader_applied_to_bulk_job',
        monoStrategy: '팀 스케줄 맞춤형 대량 공고 추천 시스템',
      },
      {
        segment: '수행 기업',
        description: '정예 기술인 단기/상시 모집용 상단 노출 유료 등록',
        stage: '유료 전환 대상',
        competitors: ['가다', '숨고'],
        painPoint: '착공 시 숙련공 인력 조달 지연으로 지체상금 리스크 발생',
        pricingType: '상단 스폰서 광고 건당 ₩50,000 / 월 ₩290,000 무제한',
        validationEvent: 'paid_job_sponsored',
        monoStrategy: '기량 등급 검증이 완료된 기술자 풀 다이렉트 타겟팅',
      },
      {
        segment: '협력사',
        description: '원청 요구 규격에 맞는 안전 교육 이수 기술인 신속 채용',
        stage: '유료 구독제 포함',
        competitors: ['가다'],
        painPoint: '안전 교육 및 면허 서류 심사에 너무 많은 공수 발생',
        pricingType: '채용 공고 패키지 월 ₩190,000',
        validationEvent: 'partner_job_bulk_posted',
        monoStrategy: '이수증 자동 연동 필터를 통한 구인 즉시 서류 검증 완료',
      },
      {
        segment: '원청',
        description: '현장 내 노무 수급 현황 실시간 모니터링 및 공고 연계',
        stage: '원청 패키지 통합',
        competitors: [],
        painPoint: '협력사의 인력 조달 지연으로 인한 공기 지연 감지 불가',
        pricingType: '원청 모니터링 라이선스 내 포함',
        validationEvent: 'general_con_monitoring_active',
        monoStrategy: '협력사 구인 및 투입 예정율 실시간 시각 대시보드',
      },
      {
        segment: '대기업',
        description: '지역 고용 지표 및 안전 고용 보고서 연계',
        stage: '대기업 제휴 포함',
        competitors: [],
        painPoint: '투자 프로젝트의 실시간 고용 창출 데이터 증적 불가',
        pricingType: 'ESG 데이터 리포트 커스텀 비용',
        validationEvent: 'enterprise_esg_sync',
        monoStrategy: '실제 채용 공고 기반 고용 유발 실시간 빅데이터',
      },
      {
        segment: '정부·지자체',
        description: '지역 건설 일자리 수급 균형 분석 데이터 공급',
        stage: '정책 제휴',
        competitors: [],
        painPoint: '관내 건설 기능인의 일자리 이탈 및 건설 인력 통계 격차 발생',
        pricingType: '시스템 연계 라이선스',
        validationEvent: 'gov_policy_data_provided',
        monoStrategy: '실시간 가동 공고 분석 기반 기량별 수급 지표 API',
      },
    ],
    pricingAssumption: '프리미엄 노출 공고 등록 건당 ₩50,000 / B2B 무제한 플랜 ₩290,000/월',
    mvpValidation: '공고 등록 수 30건 이상 확보 → 지원율 15% 검증 시 유료 전환',
    validationEvents: ['job_post_created', 'worker_applied', 'post_sponsored'],
    keyMetrics: ['유료 공고 전환율', '지원당 리드 타임', '재등록률'],
    risks: ['허위 현장 공고 필터링 필요', '초기 공급자(기술자) 모객 부족 리스크'],
    nextAction: '협력사 채용 담당자 20곳 대상 무료 공고 캠페인 론칭',
    arpu: '₩290,000/월 (B2B 무제한)',
    gtm: '무료 등록 → 빠른 매칭 성공 사례 입증 → 상단 노출 프리미엄 업셀',
    lockIn: ['출역 관리 연동', '지원자 기량 보증 데이터'],
    competitorDetails: [
      {
        name: '가다 (GADA)',
        type: '일용직 일자리 매칭',
        strategy: '근로자 안심 출역 중심의 공고 매칭 및 노임 직접 지급 대행',
        successPoint: '간편한 모바일 간편 출역 등록 및 노임 당일 결제 보장',
        limitation: '개별 단발성 매칭에 머무르며 시공사 SaaS나 정산 리포트로의 락인이 부재함',
        monoResponse: 'MONO는 단순 일당 중개가 아닌 B2B 현장 노무/출역/계약 SaaS와 락인',
        monoAvoid: '대규모 직채용 형태의 일용직 노임 직접 선지급(금융 부담 가중)',
        linkableBMs: ['B2B 기업 공고 과금', '출역·정산 리포트'],
      },
    ],
  },
  {
    id: 'workspace-subscription',
    name: 'Partner Workspace 구독',
    tier: 'core',
    priority: 'P0',
    strategyTags: ['fast-validation', 'lock-in'],
    competitorTags: ['procore', 'workrise'],
    cells: [
      {
        segment: '기술자',
        description: '근로 내역 조회 및 모바일 간편 출역 서명 승인',
        stage: '무료',
        competitors: [],
        painPoint: '매월 내 출역 일수가 맞는지 확인하기 어렵고 수기로 적어둠',
        pricingType: '근로자 기능 무료 제공',
        validationEvent: 'worker_attendance_signed',
        monoStrategy: '본인 출역 일수 누적을 통한 평판 관리',
      },
      {
        segment: '현장 리더',
        description: '팀원 가용성 관리 및 모바일 체크인 기반 출역 자동 집계',
        stage: '무료',
        competitors: [],
        painPoint: '팀원 출퇴근 카드를 수기로 적고 정산하는 공수가 큼',
        pricingType: '현장 리더 기능 무료 제공',
        validationEvent: 'leader_checked_in_team',
        monoStrategy: '팀원 전체 출역 현황 간편 캘린더 인터페이스 제공',
      },
      {
        segment: '수행 기업',
        description: '다수 현장의 가동률 및 소속 기술인의 실시간 출역 상태 대시보드 통합 관리',
        stage: '유료 구독제',
        competitors: ['Procore', 'Workrise'],
        painPoint: '현장별 실시간 투입 인원을 파악하지 못해 결원 관리 실패',
        pricingType: '월 ₩49,000~₩149,000 / 현장당 구독',
        validationEvent: 'workspace_active_daily',
        monoStrategy: '출역 정산과 시공팀 매칭이 직접 통합된 가벼운 관리 SaaS',
      },
      {
        segment: '협력사',
        description: '실시간 출역 정합성 추적 및 노임 명세 자동화',
        stage: '유료 구독제',
        competitors: ['Workrise'],
        painPoint: '일용직 퇴직공제금 및 주휴수당 세법 계산이 너무 복잡함',
        pricingType: '월 ₩99,000 기본 패키지 포함',
        validationEvent: 'partner_payroll_processed',
        monoStrategy: '한국 일용직 노무 세법 연산 엔진 원클릭 정산',
      },
      {
        segment: '원청',
        description: '하도급 현장 근로자 투입 정합성 및 안전 리스크 관리를 위한 모니터링',
        stage: 'ARR 연간 라이선스',
        competitors: ['Procore'],
        painPoint: '하도급사가 투입 인원을 부풀리거나 유령 인력을 청구하는 노무 리스크',
        pricingType: '원청 B2B 연간 계약 ₩3,000,000부터',
        validationEvent: 'general_con_contract_signed',
        monoStrategy: '모바일 체크인 기반 원천 증적 데이터 공급',
      },
      {
        segment: '대기업',
        description: '안전보건 및 노무 리스크 관리 데이터 연동',
        stage: '연간 라이선스',
        competitors: [],
        painPoint: 'ESG 및 재해 예방 의무 법적 충족을 증명할 데이터 부족',
        pricingType: '대기업 엔터프라이즈 플랜 ₩12,000,000/연',
        validationEvent: 'enterprise_compliance_synced',
        monoStrategy: '현장 실 데이터 기반 안전 리스크 관리를 위한 증적 관리 툴',
      },
      {
        segment: '정부·지자체',
        description: '건설근로자 퇴직공제부금 신고에 필요한 기초 데이터 정리 대행',
        stage: '무상/정책 연계',
        competitors: [],
        painPoint: '퇴직공제부금 누락 신고로 근로자 보장 안전망 훼손',
        pricingType: '지자체 시스템 인터페이스 연계 수수료',
        validationEvent: 'gov_공제회_data_sent',
        monoStrategy: '출역 데이터를 근로자공제회 표준 규격 API로 직접 변환 연계',
      },
    ],
    pricingAssumption: '월 ₩49,000~₩149,000/현장 (현장 규모별 슬라이딩 스케일)',
    mvpValidation: '협력사 5개사 PoC 도입 → 3개월간 출역 체크인 90% 이상 유지율',
    validationEvents: ['workspace_created', 'performer_added', 'billing_subscribed'],
    keyMetrics: ['DAU / MAU', '현장당 평균 체크인 횟수', '구독 유지율(LTV)'],
    risks: ['기존 엑셀 및 오프라인 양식 선호도 극복 필요', '현장 도입 허들'],
    nextAction: '핵심 파트너 협력사 3곳 대상 워크스페이스 무료 클로즈 베타 오픈',
    arpu: '₩99,000/월',
    gtm: '원청 대기업의 안전 리스크 관리를 위한 지침을 통해 협력사에 워크스페이스 사용 강제 유도',
    lockIn: ['출역 체크인 연동', '표준 전자근로계약서 자동 작성'],
    competitorDetails: [
      {
        name: 'Procore',
        type: '글로벌 건설 관리 SaaS',
        strategy: '도면, 공정, 원가, 안전 등 건설 프로세스 전반을 통합 클라우드로 공급',
        successPoint: '압도적인 현장 관리 기능과 전 생애주기 협업 도구 제공',
        limitation: '국내 기술직 노무/정산/일용직 노임 명세 세법 특수성을 다루지 못함',
        monoResponse: '노무비 정산 보조 및 증빙 관리, 인력 조달과 직접 연계된 가벼운 한국형 현업 SaaS',
        monoAvoid: '수억 원에 달하는 전사적 대형 ERP/도면 관리 SaaS 직접 경쟁 개발',
        linkableBMs: ['Partner Workspace 구독', 'AI 자원 매칭'],
      },
    ],
  },
  {
    id: 'profile-access',
    name: '프로필·팀 열람 과금',
    tier: 'core',
    priority: 'P0',
    strategyTags: ['fast-validation', 'leader-net'],
    competitorTags: ['thumbtack'],
    cells: [
      {
        segment: '기술자',
        description: '본인 이력 카드 노출 및 단가 협상력 확보',
        stage: '무료',
        competitors: [],
        painPoint: '내 경력과 기량을 증명할 방법이 없어 소개소에서 주는 단가만 받음',
        pricingType: '근로자 가입 및 이력 카드 등록 무료',
        validationEvent: 'worker_profile_published',
        monoStrategy: '현장 출역 실적 기반의 신뢰 평판 이력 연동',
      },
      {
        segment: '현장 리더',
        description: '팀 포트폴리오 및 시공 평판 기반 직접 수주 기회 획득',
        stage: '무료',
        competitors: [],
        painPoint: '팀원들 전체 기량을 홍보하고 대형 현장 B2B 계약을 따기 어려움',
        pricingType: '리더 인증 무료',
        validationEvent: 'leader_team_profile_published',
        monoStrategy: 'Certified Field Leader 인증 및 가용 팀원 수 시각화',
      },
      {
        segment: '수행 기업',
        description: '현장 근처 특정 기량자 및 인증 리더 프로필 비교 열람',
        stage: '유료 크레딧',
        competitors: ['Thumbtack'],
        painPoint: '용역 인부 투입 시 기량 미달로 인한 오시공 발생 리스크',
        pricingType: '프로필 열람당 1 크레딧 (₩5,000)',
        validationEvent: 'subcon_purchased_credits',
        monoStrategy: '현장 평판 및 완료 공사 중심의 팩트 기반 이력 확인',
      },
      {
        segment: '협력사',
        description: '검증된 작업반장의 평판/이력 열람 및 조인 제안',
        stage: '유료 크레딧',
        competitors: ['Thumbtack'],
        painPoint: '시공을 책임질 검증된 반장을 급하게 섭외해야 할 대 신뢰 데이터 부재',
        pricingType: '월 50회 열람 ₩150,000',
        validationEvent: 'partner_pro_revealed',
        monoStrategy: '검증 리더 스카우트 제안 시 이전 고객 평점 연계',
      },
      {
        segment: '원청',
        description: '투입 기술인의 특별 자격증 및 안전 교육 이수증 다이렉트 확인',
        stage: '원청 패키지',
        competitors: [],
        painPoint: '투입 작업자의 신분과 필수 자격 위조 여부를 현장에서 검증하기 어려움',
        pricingType: '조회 API 포함 제공',
        validationEvent: 'general_con_worker_checked',
        monoStrategy: '정부 자격증 DB 및 MONO 검증 이력 동시 연계',
      },
      {
        segment: '대기업',
        description: '적격 원청 기준 충족 하도급사 소속 리더 DB 라이브 조회',
        stage: '엔터프라이즈 플랜',
        competitors: [],
        painPoint: '안전 보건 역량을 갖춘 기술자 확보율의 시각화 요구',
        pricingType: '전사 라이선스 포함',
        validationEvent: 'enterprise_leader_search_active',
        monoStrategy: '실시간 적격 안전 기술인 보유율 대시보드 리포팅',
      },
      {
        segment: '정부·지자체',
        description: '국가 자격 면허 소지 기능인의 지역 분포 API 조회',
        stage: '정책 제휴',
        competitors: [],
        painPoint: '지역 내 특정 특수장비 기량인 가용 규모 통계 부재',
        pricingType: '통계 API 호출당 과금 또는 연계',
        validationEvent: 'gov_stats_api_called',
        monoStrategy: '익명화된 실시간 건설 기능인 면허 지도 제공',
      },
    ],
    pricingAssumption: '프로필 열람 건당 ₩5,000 (열람 크레딧 차감 방식) / 월 ₩150,000 정액권',
    mvpValidation: '채용 담당자 30명 인터뷰 → 이력 신뢰도 90% 이상 응답 시 크레딧 판매',
    validationEvents: ['profile_accessed', 'credit_charged', 'contact_revealed'],
    keyMetrics: ['열람 후 매칭 전환율', '열람 크레딧 구매 건수', '공급자 프로필 작성률'],
    risks: ['개인정보보호법에 따른 민감 경력 데이터 비식별 처리 범위 정의'],
    nextAction: '인증 리더 100인 프로필 DB 구축 완료 후 기업 고객에 열람 베타 론칭',
    arpu: '₩150,000/월',
    gtm: '기존에 검증 불가능했던 기술자 실제 경력 및 동료 평가 데이터를 최초 제공하여 결제 유도',
    lockIn: ['Certified Field Leader 등급 배지', '신뢰 평가 내역'],
    competitorDetails: [
      {
        name: 'Thumbtack',
        type: '전문가 리드 매칭 플랫폼',
        strategy: '전문가 프로필을 노출하고 고객이 문의(리드)할 때마다 전문가에게 과금',
        successPoint: '상세 프로필 및 포트폴리오 노출로 전문가의 직접 스카우트 유도',
        limitation: '전문가의 실시간 현장 가동 여부 및 소속 팀원의 보증 데이터를 제공하지 못함',
        monoResponse: 'MONO는 Certified 검증 및 소속 팀원의 투입 가용 현황을 결합 제공',
        monoAvoid: '검증되지 않은 가짜 이력 프로필의 단순 목록 노출',
        linkableBMs: ['프로필·팀 열람 과금', 'B2B 기업 공고 과금'],
      },
    ],
  },
  {
    id: 'matching-fee',
    name: '팀 단위 매칭 수수료',
    tier: 'core',
    priority: 'P1',
    strategyTags: ['leader-net', 'lock-in'],
    competitorTags: ['taskrabbit', 'soomgo', 'todayhouse'],
    cells: [
      {
        segment: '기술자',
        description: '팀에 소속되어 정당 노임 일자리 일관 수급 (수수료 제로)',
        stage: '무료',
        competitors: [],
        painPoint: '매칭 플랫폼 직접 이용 시 수수료를 차감당하는 억울함 발생',
        pricingType: '근로자 수수료 면제',
        validationEvent: 'worker_matched_via_team',
        monoStrategy: '수수료를 기술인에게 징수하지 않고 B2B 기업에만 징수하는 모델',
      },
      {
        segment: '현장 리더',
        description: '팀원 일괄 매칭 및 대금 정산 보증 수혜',
        stage: '무료',
        competitors: ['Taskrabbit'],
        painPoint: '시공을 끝내도 기업으로부터 정산이 지연되거나 떼이는 리스크',
        pricingType: '리더 중개 무료',
        validationEvent: 'leader_matching_settled',
        monoStrategy: '플랫폼 에스크로 결제를 통해 작업반장 대금 선지급 보장',
      },
      {
        segment: '수행 기업',
        description: '공기 단축을 위한 패키지 전문 시공팀 일괄 소싱',
        stage: '유료 매칭 (수수료 3%)',
        competitors: ['숨고', 'Taskrabbit'],
        painPoint: '팀워크가 안 맞는 개별 인력을 구성해 작업하면 품질 저하 및 하자 발생',
        pricingType: '성사 금액의 3% 매칭 수수료',
        validationEvent: 'subcon_matching_fee_paid',
        monoStrategy: '오랜 기간 출역을 함께하여 호흡이 검증된 고정 시공팀 소싱',
      },
      {
        segment: '협력사',
        description: '장기 프로젝트 및 특수 공종 협력 시공팀 일괄 소싱 연계',
        stage: '유료 매칭 (수수료 5%)',
        competitors: ['숨고'],
        painPoint: '현장 착공 전 팀 단위 소싱 계약을 성사시키기 위한 신뢰 매개 부재',
        pricingType: '성사 금액의 5% 매칭 수수료',
        validationEvent: 'partner_matching_fee_paid',
        monoStrategy: '안심 결제 체계와 표준 계약서 연동으로 거래 안전성 보장',
      },
      {
        segment: '원청',
        description: '공기 지연 해소를 위한 특별 외주 시공단 긴급 매칭 지원',
        stage: '상생 예산 포함',
        competitors: [],
        painPoint: '공정 지연으로 긴급 인력 조달 시 신뢰할 수 없는 인력이 들어올 우려',
        pricingType: '건당 수수료 할인 또는 원청 패키지',
        validationEvent: 'general_con_emergency_matched',
        monoStrategy: 'MONO Captain 등급 리더의 직속 정예 결성팀 급파 매칭',
      },
      {
        segment: '대기업',
        description: '상생 협력 기금 연계 중소 협력사 시공 매칭 지원',
        stage: '상생 프로그램 연계',
        competitors: [],
        painPoint: '중소 시공 협력사의 구인난을 실질적으로 도와줄 방안 모호',
        pricingType: '상생 펀드 집행 커미션',
        validationEvent: 'enterprise_matching_sponsored',
        monoStrategy: '상생 기금을 통한 매칭 수수료 100% 감면 혜택 연계',
      },
      {
        segment: '정부·지자체',
        description: '관내 공공 건설 프로젝트의 적격 시공단 매칭 검증',
        stage: '정책 연계',
        competitors: [],
        painPoint: '무면허 시공팀 매칭이나 다단계 불법 하도급 매칭 방지 요구',
        pricingType: '건당 수수료 면제 또는 시스템 라이선스',
        validationEvent: 'gov_matching_validated',
        monoStrategy: '면허 보유와 고용 정당성이 검증된 적격 시공팀만 승인',
      },
    ],
    pricingAssumption: '팀 매칭 성사 시 계약 총액의 3~7% 매칭 수수료 (기업 고객 부담)',
    mvpValidation: '시공 팀 매칭 10건 테스트 수행 → 거래 이탈 없이 수수료 정산 완료 여부',
    validationEvents: ['matching_requested', 'proposal_submitted', 'matching_fee_collected'],
    keyMetrics: ['매칭 성사율', '평균 매칭 계약 규모', '재매칭 의사 (NPS)'],
    risks: ['전화번호 공유 이후 오프라인으로 이탈하는 직거래(우회) 리스크'],
    nextAction: '도배/타일 전문 시공팀 10개 팀 온보딩 및 첫 프로젝트 매칭 개시',
    arpu: '₩350,000/건',
    gtm: '견적 이후 거래 이탈을 줄이는 MONO 차별화 핵심을 통해 플랫폼 내 대금 정산 완료 강제화',
    lockIn: ['MONO 안심 에스크로', '정산 데이터 이력 누적'],
    competitorDetails: [
      {
        name: '숨고 (Soomgo)',
        type: '매칭 서비스',
        strategy: '견적 요청서를 보내면 다수의 전문가가 견적서를 발송하고 채팅 연결을 제공',
        successPoint: '풍부한 매칭 인력 풀, 견적 비교 편의성으로 거래 초입 점유',
        limitation: '견적 완료 후 오프라인 직거래로 이탈하여 매칭 이후 대금 정산 수수료 수취 실패 (견적 이후 거래 이탈)',
        monoResponse: '견적 이후 거래 이탈을 줄이는 MONO 차별화 핵심으로 계약-출역-정산 일체화',
        monoAvoid: '매칭 이후 관리/정산 단계가 없는 단순 연락처·견적 중개 서비스',
        linkableBMs: ['팀 단위 매칭 수수료', '금융·보험 제휴형'],
      },
      {
        name: 'Taskrabbit',
        type: '소액 매칭',
        strategy: '건당 정률 수수료 수취 및 에스크로 기반 간편 작업 매칭',
        successPoint: '간편한 모바일 소액 작업 매칭, 에스크로 안전 결제 및 가입자 평판',
        limitation: '현장의 복잡한 B2B 컴플라이언스(안전 교육, 출역 대장, 조세 신고) 지원 불가',
        monoResponse: 'B2B 건설 현장 노무 대장 자동 취합 및 안전패스 검증을 결합',
        monoAvoid: '소액 단순 심부름/가사 노동 중심의 단기 C2C 매칭 시장 진입',
        linkableBMs: ['팀 단위 매칭 수수료', '검증 API·컴플라이언스'],
      },
    ],
  },
  {
    id: 'attendance-report',
    name: '출역·정산 리포트',
    tier: 'core',
    priority: 'P1',
    strategyTags: ['lock-in', 'finance'],
    competitorTags: ['gada', 'workrise'],
    cells: [
      {
        segment: '기술자',
        description: '세금 공제 및 주휴수당 계산이 포함된 급여 명세서 모바일 자동 확인',
        stage: '무료',
        competitors: [],
        painPoint: '매달 주휴수당이나 일당 공제가 정확하게 정산되었는지 검증하기 어려움',
        pricingType: '무료 급여명세서 배포',
        validationEvent: 'worker_slip_viewed',
        monoStrategy: '노동법 기준에 입각한 정합 급여 시뮬레이션 결과 자동 발급',
      },
      {
        segment: '현장 리더',
        description: '팀원 출역 현황 리포트 자동 생성 및 노무비 정산 보조 및 증빙 관리 청구',
        stage: '무료',
        competitors: [],
        painPoint: '매주 팀원들 공수 합산하여 기업 담당자에게 팩스나 카톡으로 청구하는 번거로움',
        pricingType: '출역 청구서 무제한 생성 무료',
        validationEvent: 'leader_invoice_exported',
        monoStrategy: '앱 내 체크인 데이터 기반 1초 청구서 생성 및 전송',
      },
      {
        segment: '수행 기업',
        description: '일용직 고용 세무 정부 신고 대장 자동 변환 및 원클릭 내보내기',
        stage: '구독제 포함',
        competitors: ['Workrise'],
        painPoint: '세무 신고 대장 공수 수기 작성으로 인한 오류 및 지체',
        pricingType: '월 ₩50,000 (기본 워크스페이스 포함)',
        validationEvent: 'subcon_excel_downloaded',
        monoStrategy: '고용노동부 가이드라인에 맞춘 세무 엑셀 포맷 원클릭 내보내기',
      },
      {
        segment: '협력사',
        description: '실시간 노무 정합성 증적 리포트를 통한 노무 분쟁 예방',
        stage: '구독제 포함',
        competitors: ['Workrise'],
        painPoint: '근로자와의 공수 계산 불일치로 인한 대금 지급 갈등 및 민원 발생',
        pricingType: '월 ₩50,000 (기본 워크스페이스 포함)',
        validationEvent: 'partner_report_generated',
        monoStrategy: '모바일 체크인 기반 타임스탬프와 GPS 위치 기반 입증',
      },
      {
        segment: '원청',
        description: 'SOC 현장 및 관할 프로젝트 노무 리포트 자동 취합 보관',
        stage: '연간 라이선스 포함',
        competitors: [],
        painPoint: '하도급 협력사들의 수기 노무 대장 취합 및 안전 증적 수집에 행정 낭비',
        pricingType: '통합 대시보드 라이선스 내 포함',
        validationEvent: 'general_con_report_exported',
        monoStrategy: '산하 협력사들의 노무 정산 데이터를 일괄 자동 파싱 아카이브',
      },
      {
        segment: '대기업',
        description: '협력사 노무 상생 및 고용 환경 리포트 자동 취합 API',
        stage: '엔터프라이즈 라이선스',
        competitors: [],
        painPoint: '글로벌 공급망 안전 기준 및 노동 존중 증적 취합 불가',
        pricingType: '상생 데이터 연동 커스텀 패키지',
        validationEvent: 'enterprise_data_exported',
        monoStrategy: '실시간 노무 데이터를 ESG 공시 지표로 즉각 연동 지원',
      },
      {
        segment: '정부·지자체',
        description: '관내 공공 건설 현장 출역 통계 리포트 API 연계',
        stage: '정책 연계',
        competitors: [],
        painPoint: '지역 실시간 건설 인력 고용 추이 모니터링 불가',
        pricingType: '통계 리포트 다운로드 라이선스',
        validationEvent: 'gov_report_downloaded',
        monoStrategy: '관내 현장 가동률 및 기능인 출역 분포 실시간 대시보드',
      },
    ],
    pricingAssumption: '월 ₩50,000 (기본 구독에 포함) / 건당 다운로드 시 ₩5,000',
    mvpValidation: '정산 리포트 다운로드 100건 달성 → 세무 정합성 고객 컴플레인 0%',
    validationEvents: ['report_generated', 'report_downloaded', 'export_completed'],
    keyMetrics: ['리포트 생성률', '노무 정산 정확도', '세무 신고 리드타임 단축율'],
    risks: ['건설 조세법 및 노무 기준의 수시 변경에 따른 계산 엔진 업데이트 공수'],
    nextAction: '체크인 데이터 기반 노동부 간이양식 자동 변환 기능 개발',
    arpu: '₩50,000/월',
    gtm: '기존 수기 작성하던 노무 대장 공수를 95% 단축해 주는 업무 편의성으로 영업',
    lockIn: ['고용노동부 양식 정합성', '협력사 세무사 연동'],
    competitorDetails: [
      {
        name: 'Workrise',
        type: '에너지/건설 노무 대행',
        strategy: '전문 기술 노동자의 온보딩, 보험 검증, 급여 정산 및 세무 규제 리포트 일괄 대행',
        successPoint: '복잡한 주별 노무법과 결제 조건(Factor)의 대행을 통한 B2B 대형 거래 락인',
        limitation: '미국 시장 특화로 한국의 주휴수당, 퇴직공제부금 기초 데이터 정리 등 현지 노무 규제 미지원',
        monoResponse: '한국 건설 노동법(일용직 주휴수당, 세무)에 맞춘 노무비 정산 보조 및 증빙 관리 SaaS 제공',
        monoAvoid: '팩토링 금융 비용을 무리하게 전액 떠안는 고위험 여신 거래 개시',
        linkableBMs: ['출역·정산 리포트', 'Partner Workspace 구독', '장비·자재 연계 수수료'],
      },
    ],
  },
  {
    id: 'equipment-material-fee',
    name: '장비·자재 연계 수수료',
    tier: 'expansion',
    priority: 'P1',
    strategyTags: ['field-ops'],
    competitorTags: ['workrise'],
    cells: [
      {
        segment: '기술자',
        description: '보유 중장비 가용 일정 등록 및 장비 대차 일감 획득',
        stage: '무료',
        competitors: [],
        painPoint: '고가의 굴착기나 크레인이 현장 비는 날 놀고 있어 손실 발생',
        pricingType: '가용 스케줄 등록 무료',
        validationEvent: 'worker_equip_scheduled',
        monoStrategy: '기량자와 장비 스펙 결합 DB를 구축하여 기업 매칭률 증가',
      },
      {
        segment: '현장 리더',
        description: '팀 보유 장비 활용 및 자재 임대 거래 중개 지원',
        stage: '무료',
        competitors: [],
        painPoint: '팀 장비의 가동률 저하로 고정 리스비 지출 고통',
        pricingType: '장비 연계 주선 무료',
        validationEvent: 'leader_equip_matched',
        monoStrategy: '작업 요청서 작성 단계에서 리더의 장비 즉시 매칭',
      },
      {
        segment: '수행 기업',
        description: '현장 인근 장비 임대 및 부자재 소싱 (수수료 발생)',
        stage: '중개 수수료 (1.5%)',
        competitors: ['Workrise'],
        painPoint: '장비 소싱 시 로컬 대여소 마다 가격이 다르고 단가 덤핑 우려',
        pricingType: '거래액의 1.5% 중개 수수료',
        validationEvent: 'subcon_material_purchased',
        monoStrategy: '가까운 유휴 장비 소지 파트너를 실시간 GPS로 매칭하여 물류비 절감',
      },
      {
        segment: '협력사',
        description: '공정별 원자재 조달 단가 최적화 및 연계 발주',
        stage: '중개 수수료 (2%)',
        competitors: ['Workrise'],
        painPoint: '대규모 시멘트, 철근 조달 시 리드 타임 예측 불가능',
        pricingType: '거래액의 2% 수수료',
        validationEvent: 'partner_order_confirmed',
        monoStrategy: 'SaaS 대시보드 내 자재 주문 모듈 직접 연동',
      },
      {
        segment: '원청',
        description: '규격 자재 및 안전 장치 탑재 장비 표준 발주 매칭',
        stage: '원청 협의',
        competitors: [],
        painPoint: '불량 자재 반입 리스크 및 현장 미승인 구형 장비 투입에 따른 사고 위험',
        pricingType: '원청 시스템 계약 연계',
        validationEvent: 'general_con_material_approved',
        monoStrategy: '안전 인증이 통과된 정식 등록 장비/자재 공급선만 거래',
      },
      {
        segment: '대기업',
        description: '친환경 저탄소 장비 임대 연계 프로모션 협력',
        stage: '상생 예산',
        competitors: [],
        painPoint: '건설 현장에서 발생하는 탄소 배출 지표 저감 방법 부재',
        pricingType: '제휴 수수료 분할',
        validationEvent: 'enterprise_green_equip_leased',
        monoStrategy: '친환경 전기 굴착기 등 저탄소 장비 우선 매칭 알고리즘',
      },
      {
        segment: '정부·지자체',
        description: '관내 국산 건설 자재 사용율 통계 모니터링',
        stage: '정책 제휴',
        competitors: [],
        painPoint: '수입산 불량 자재 남용으로 인한 붕괴 리스크 및 통계 수집 한계',
        pricingType: '시스템 이용료',
        validationEvent: 'gov_material_report_pulled',
        monoStrategy: '원클릭 원산지 및 인증 데이터 자동 수집 리포트',
      },
    ],
    pricingAssumption: '장비 임대 및 자재 발주 매칭 시 거래 총액의 1.5%~3% 중개 수수료',
    mvpValidation: '현장 장비 소싱 PoC 5건 완료 → 리드타임 3일 단축 확인',
    validationEvents: ['equipment_quoted', 'material_order_placed', 'brokerage_paid'],
    keyMetrics: ['장비 가동률', '자재 단가 절감율', '거래 총액(GMV)'],
    risks: ['장비 파손 및 현장 사고 발생 시 책임 한계 설정 법률 리스크'],
    nextAction: '지역 장비 임대 연합회 3곳 공급 파트너십 MOU 체결',
    arpu: '건당 ₩450,000',
    gtm: '현장 리더의 프로필에 등록된 보유 장비 데이터를 기반으로 자동 소싱 매칭 제공',
    lockIn: ['장비 종합 보험 연동', '현장 물류 추적'],
    competitorDetails: [],
  },
  {
    id: 'compliance-network',
    name: '검증 API·컴플라이언스',
    tier: 'expansion',
    priority: 'P2',
    strategyTags: ['enterprise-win', 'lock-in'],
    competitorTags: ['avetta'],
    cells: [
      {
        segment: '기술자',
        description: '모바일 안전 패스 등록 및 교육 이수증 실시간 디지털 연동',
        stage: '무료',
        competitors: [],
        painPoint: '매번 새로운 현장에 갈 때마다 이수증 종이 서류를 들고 가야 함',
        pricingType: '모바일 패스 발급 무료',
        validationEvent: 'worker_pass_verified',
        monoStrategy: '큐알코드 기반 모바일 안전 교육 패스 즉각 증명',
      },
      {
        segment: '현장 리더',
        description: '팀원들의 안전 교육 이수 및 적격 여부 자동 패스 확인',
        stage: '무료',
        competitors: [],
        painPoint: '팀원 중 안전 교육 미이수자가 섞여 있어 게이트에서 차단되는 낭패 발생',
        pricingType: '팀 적격 스크리닝 무료',
        validationEvent: 'leader_compliance_checked',
        monoStrategy: '현장 투입 전 스케줄링 시점에 적격 스크리닝 사전 작동',
      },
      {
        segment: '수행 기업',
        description: '원청 입찰 시 필요한 기업 신용도, 재해율 컴플라이언스 프로필 제출',
        stage: '유료 인증',
        competitors: ['Avetta'],
        painPoint: '원청이 요구하는 안전 컴플라이언스 서류 작성 및 공수가 매년 급증',
        pricingType: '연간 실사 인증료 ₩300,000',
        validationEvent: 'subcon_audit_passed',
        monoStrategy: '체크인 데이터 기반 실무 재해 실적 자동 증적화',
      },
      {
        segment: '협력사',
        description: '원청사 안전 기준 실시간 자동 심사 통과 인증 유지',
        stage: '유료 인증',
        competitors: ['Avetta'],
        painPoint: '심사 탈락 시 입찰 기회 영구 박탈 리스크 발생',
        pricingType: '연간 관리 라이선스 ₩300,000',
        validationEvent: 'partner_audit_renewed',
        monoStrategy: '안전 보건 데이터 실시간 동기화를 통한 사전 경고',
      },
      {
        segment: '원청',
        description: '안전 리스크 관리를 위한 하도급사 실시간 모니터링 시스템 공급',
        stage: 'B2B 연간 계약',
        competitors: ['Avetta'],
        painPoint: '안전 리스크 관리를 위한 하청 시공업체의 안전 부주의 책임 전가 위험',
        pricingType: '원청 연 ARR ₩12,000,000',
        validationEvent: 'general_con_dashboard_active',
        monoStrategy: '서류를 넘어 현장 체크인과 연동된 완전한 실시간 관제 시스템',
      },
      {
        segment: '대기업',
        description: '안전 실사 및 컴플라이언스 네트워크 통합 인증 라이선스',
        stage: '연간 구독',
        competitors: ['Avetta'],
        painPoint: '그룹 전반 협력사 안전 보건 실태 감사의 행정 비효율',
        pricingType: '대기업 전사 라이선스 연 ₩24,000,000',
        validationEvent: 'enterprise_safety_network_synced',
        monoStrategy: '글로벌 공급망 표준 규격에 부합하는 ESG 노무 관제 결합',
      },
      {
        segment: '정부·지자체',
        description: '관내 현장 안전 리스크 관리를 위한 규제 실무 데이터 인터페이스 연계',
        stage: '정책 제휴',
        competitors: [],
        painPoint: '지역 내 실제 가동 중인 공사 현장의 실시간 안전 규칙 준수율 감사 불가',
        pricingType: '시스템 API 데이터 제공 라이선스',
        validationEvent: 'gov_compliance_report_exported',
        monoStrategy: '현장 GPS 출역 정합성 및 모바일 안전패스 매핑 지표 공급',
      },
    ],
    pricingAssumption: '협력사 연간 검증 연회비 ₩300,000 / 원청 연간 라이선스 ₩12,000,000',
    mvpValidation: '원청 1개사 산하 20개 하도급 협력사 대상 컴플라이언스 프로필 연동률 90% 돌파',
    validationEvents: ['compliance_profile_completed', 'safety_audit_passed', 'license_renewed'],
    keyMetrics: ['원청당 협력사 온보딩 속도', '보안/안전 실적 미비점 감지 건수', '연간 계약 갱신율'],
    risks: ['법적 안전 기준 변경에 따른 책임 보장 한도 시비'],
    nextAction: '중견 건설사 1곳 대상 안전보건실적 수집 PoC 제안서 조율',
    arpu: '₩12,000,000/연 (원청)',
    gtm: '안전 리스크 관리를 위한 원청 안전보건실장의 안전 증적 서류 관리 수고를 자동화',
    lockIn: ['원청-협력사 간의 양방향 검증 데이터 락인'],
    competitorDetails: [
      {
        name: 'Avetta/ISN',
        type: '컴플라이언스 인증',
        strategy: '대형 원청(고객)을 대신해 수천 개의 협력사 신용, 안전, 재무 상태를 실사 및 인증',
        successPoint: '원청사의 안전 요구 기준을 대신 인증하여 하도급 가입을 강제하는 강력한 B2B 네트워크',
        limitation: '기업 서류 실사에 그쳐, 매일 현장에서 일어나는 실제 출역 근로자의 기량/안전 데이터 실시간 확인 부재',
        monoResponse: '안전 리스크 관리를 위한 모바일 안전패스(이수증 연동)와 실시간 현장 체크인 결합',
        monoAvoid: '실제 현업 데이터 없이 단순 정적 서류 대행만 제공하는 형식적 시스템',
        linkableBMs: ['검증 API·컴플라이언스', '안전 교육·자격증 연계', 'ESG·상생 평가 리포트'],
      },
    ],
  },
  {
    id: 'channel-saas',
    name: '채널 SaaS형 (소개소 창구)',
    tier: 'expansion',
    priority: 'P1',
    strategyTags: ['leader-net'],
    competitorTags: [],
    cells: [
      {
        segment: '기술자',
        description: '오프라인 소개소를 통한 간접 온보딩 지원 (앱 가입 불필요)',
        stage: '무료',
        competitors: [],
        painPoint: '고령이나 스마트폰 서툰 근로자는 최신 일자리 앱 가입이 불가능함',
        pricingType: '간접 매칭 지원 무료',
        validationEvent: 'worker_offline_enrolled',
        monoStrategy: '소개소 전화를 통해 매칭을 받고 현장 게이트에서 SMS로 간편 승인',
      },
      {
        segment: '현장 리더',
        description: '단골 오프라인 소개소를 통한 기존 인력 긴급 충원 연동',
        stage: '무료',
        competitors: [],
        painPoint: '바쁜 현장에서 기존 오프라인 인력 공급 채널을 포기하기 어려움',
        pricingType: '주선 연동 무료',
        validationEvent: 'leader_dispatch_verified',
        monoStrategy: '기존 소개소 채널을 MONO 시스템에 통합하여 이중 관리 제거',
      },
      {
        segment: '수행 기업',
        description: '오프라인 주선 인력 출역 대장의 자동 연계 및 취합',
        stage: 'SaaS 무료 탑재',
        competitors: [],
        painPoint: '소개소에서 보내준 인력들의 출역 및 인적 사항 서류가 매일 뒤섞임',
        pricingType: '워크스페이스 기본 기능 제공',
        validationEvent: 'subcon_saas_sync_completed',
        monoStrategy: '소개소 전용 SaaS와 협력사 대시보드 간의 양방향 자동 동기화',
      },
      {
        segment: '협력사',
        description: '외주 주선 근로자 출역 데이터 실시간 모바일 취합',
        stage: 'SaaS 무료 탑재',
        competitors: [],
        painPoint: '소개소 주선비 청구 내역과 실제 일한 공수가 맞지 않아 매달 갈등',
        pricingType: '주선 대장 매칭 무료',
        validationEvent: 'partner_saas_sync_completed',
        monoStrategy: '출역 타임스탬프와 주선 내역 자동 교차 대조 및 승인',
      },
      {
        segment: '원청',
        description: '현장 투입 외주 인력 소개소 거래 정합성 증적 확인',
        stage: '원청 패키지',
        competitors: [],
        painPoint: '소개소를 통한 불법 파견 및 근로자 고용의 불투명성 리스크',
        pricingType: '관제 내역 모듈 포함',
        validationEvent: 'general_con_dispatch_monitored',
        monoStrategy: '소개소 주선 내역 및 근로 계약 적법성 자동 스크리닝',
      },
      {
        segment: '대기업',
        description: '상생 노동 네트워크를 위한 지역 인력사 SaaS 확산 협력',
        stage: '상생 펀드 연계',
        competitors: [],
        painPoint: '지역 소상공 인력사와의 대립구도로 인한 상생 비판 직면',
        pricingType: '지역 상생 제휴 프로그램 예산',
        validationEvent: 'enterprise_saas_donated',
        monoStrategy: '소개소 소장들에게 클라우드 SaaS를 무상 보급하는 상생 모델 구축',
      },
      {
        segment: '정부·지자체',
        description: '법정 직업소개 대장의 디지털 보관 및 직업안정법 준수 지원',
        stage: '정책 제휴',
        competitors: [],
        painPoint: '수천 개 직업소개소의 수기 대장 실사 감독 행정 공수 낭비',
        pricingType: '지자체 감독 시스템 라이선스',
        validationEvent: 'gov_saas_monitored',
        monoStrategy: '감독관 전용 디지털 대장 실시간 제출 시스템 인터페이스 제공',
      },
    ],
    pricingAssumption: '소개소 전용 노무 주선 관리 SaaS 라이선스 월 ₩79,000~₩199,000',
    mvpValidation: '수도권 직업소개소 3곳 도입 → 주간 거래 배정 50건 이상 처리 성공 여부',
    validationEvents: ['saas_account_created', 'dispatch_assigned', 'dispatch_fee_recorded'],
    keyMetrics: ['SaaS 활성 사용율', '소개소당 간접 가입 근로자 수', '주선 정산 자동화율'],
    risks: ['소개소 소장들의 기존 장부 고수 성향 극복 필요, 현지 법적 파견법 규제 위반 방지'],
    nextAction: '수도권 인력소개소 소장 연합회 대상 SaaS 1차 프로토타입 시연',
    arpu: '₩99,000/월',
    gtm: '직업안정법상 주선 장부 기록 수기 의무를 자동 클라우드 대장으로 1초 만에 해결해 준다는 기능으로 어필',
    lockIn: ['소개소 소유의 거래처 관리 대장 DB'],
    competitorDetails: [],
  },
  {
    id: 'finance-affiliate',
    name: '금융·보험 제휴형 (포용금융)',
    tier: 'expansion',
    priority: 'P2',
    strategyTags: ['finance'],
    competitorTags: ['soomgo'],
    cells: [
      {
        segment: '기술자',
        description: '출역 증빙 기반 1금융 대출 한도 획득 및 상해보험 가입',
        stage: '제휴 수수료 수취',
        competitors: ['숨고 제휴'],
        painPoint: '일용직 근로자로 분류되어 소득 증빙이 차단되어 1금융 대출 불가능',
        pricingType: '금융 조회 무료 (제휴사 수수료)',
        validationEvent: 'worker_loan_matched',
        monoStrategy: 'MONO 출역 기록을 금융사 전용 대안 신용지표로 다이렉트 공급',
      },
      {
        segment: '현장 리더',
        description: '팀 운영비 및 시공 자재비 안심 단기 대출 연계',
        stage: '제휴 수수료',
        competitors: [],
        painPoint: '착공 시 자재비와 팀원 노임을 선지급해야 하나, 단기 운영 자금 융통 곤란',
        pricingType: '리더 대출 연계 수수료 0.5%',
        validationEvent: 'leader_loan_matched',
        monoStrategy: '팀의 수주 이력 및 원청 안전도 평점을 결합한 대안 금융',
      },
      {
        segment: '수행 기업',
        description: '투입 근로자 전원 간편 상해보험 일괄 가입 및 증명서 획득',
        stage: '보험 제휴 수수료',
        competitors: [],
        painPoint: '매번 투입 근로자 명단이 바뀌어 일일이 보험사에 등록하는 과정 번거로움',
        pricingType: '보험사 수수료의 10% 쉐어',
        validationEvent: 'subcon_insurance_processed',
        monoStrategy: '출역 체크인 버튼 터치와 동시에 일일 단기 보험 자동 가입 체계',
      },
      {
        segment: '협력사',
        description: '노무비 정산 금융 및 고용 산재보험 연동 정산 대행',
        stage: '제휴 포함',
        competitors: [],
        painPoint: '매월 보험 정산 및 보험율 산정 시 복잡한 계산 오류로 과태료 우려',
        pricingType: '금융 정산 수수료 연동',
        validationEvent: 'partner_insurance_aligned',
        monoStrategy: '출역 빅데이터와 4대 보험 공단 규격을 매칭하여 정산 완전 자동화',
      },
      {
        segment: '원청',
        description: '하도급 전체 근로자 단기 보험 가입 여부 연계 검증',
        stage: '원청 패키지',
        competitors: [],
        painPoint: '현장 내 미보험 가입자 사고 발생 시 원청의 연대 배상 책임 리스크',
        pricingType: '증적 대조 API 라이선스 포함',
        validationEvent: 'general_con_insurance_checked',
        monoStrategy: '미보험 근로자의 현장 게이트 통과를 실시간 제어',
      },
      {
        segment: '대기업',
        description: 'ESG 상생 펀드와 연계한 대안 금융 근로자 이자 지원',
        stage: '상생 펀드 연계',
        competitors: [],
        painPoint: '협력사 근로자들의 금융 복지를 지원할 실질적인 데이터 인프라 부재',
        pricingType: '상생 이자 보전 수수료',
        validationEvent: 'enterprise_loan_subsidized',
        monoStrategy: '대기업 상생 기금으로 MONO 대안 신용 대출 이자를 보전하는 구조',
      },
      {
        segment: '정부·지자체',
        description: '관내 건설 근로자 포용금융 정책 상품 및 상생 연계',
        stage: '정책 연계',
        competitors: [],
        painPoint: '취약 기능인의 사금융 전락 방지 및 서민 금융 복지 정책 실행 한계',
        pricingType: '정부 기금 예산 연계',
        validationEvent: 'gov_finance_portal_active',
        monoStrategy: '지자체 취약 노동자 지원금 지급 창구로 MONO 정산 계좌 지정',
      },
    ],
    pricingAssumption: '금융·보험 매칭 성사 시 제휴 금융사로부터 0.5%~2.0%의 중개 수수료 수취',
    mvpValidation: '기술자 신용조회 100건 달성 → 제휴 보험 가입 20건 이상 확인',
    validationEvents: ['insurance_applied', 'loan_profile_submitted', 'commissions_received'],
    keyMetrics: ['금융 상품 제휴 클릭률', '보험 가입 전환율', '유치 수수료 규모'],
    risks: ['금융소비자보호법 및 신용정보법 상 금융 대리중개업 라이선스 요건 준수 필요'],
    nextAction: '시중 손해보험사 및 핀테크사 1곳과 일일 상해보험 간편 API 연동 논의',
    arpu: '건당 ₩12,000 (평균 수수료)',
    gtm: '출역 체크인 시 보험 가입을 원클릭으로 선택하게 하여 가입 허들을 획기적으로 낮춤',
    lockIn: ['출역 증빙 기반 소득 평가 모델'],
    competitorDetails: [],
  },
  {
    id: 'education-cert',
    name: '안전 교육·자격증 연계',
    tier: 'longterm',
    priority: 'P2',
    strategyTags: ['enterprise-win'],
    competitorTags: ['avetta'],
    cells: [
      {
        segment: '기술자',
        description: '필수 건설기초안전보건교육 및 자격증 수강 연계',
        stage: '무료 (연계 대상)',
        competitors: [],
        painPoint: '현장 진입에 필요한 법정 기초교육 이수 및 갱신 번거로움',
        pricingType: '교육 접수 대행 무료',
        validationEvent: 'worker_education_booked',
        monoStrategy: '온라인 간편 교육 위탁 및 이수증 모바일 자동 전송',
      },
      {
        segment: '현장 리더',
        description: '팀원 안전 교육 만료 예정 알림 및 보수교육 단체 예약',
        stage: '무료',
        competitors: [],
        painPoint: '팀원들 안전 서류 만료 여부를 일일이 조회하고 관리할 방법 없음',
        pricingType: '단체 예약 시스템 무료',
        validationEvent: 'leader_bulk_edu_booked',
        monoStrategy: '리더 대시보드 내 팀원 안전 서류 만료 D-Day 알람',
      },
      {
        segment: '수행 기업',
        description: '미이수 신규 근로자 사전 감지 및 교육 자동 접수',
        stage: '구독 옵션',
        competitors: ['Avetta'],
        painPoint: '안전 미이수자가 현장에 투입되어 불시 단속 시 벌금 및 영업 정지 리스크',
        pricingType: '교육 연계 대행 건당 ₩5,000',
        validationEvent: 'subcon_compliance_failed_resolved',
        monoStrategy: '출역 스케줄링 시 미이수 자동 필터링 및 1초 위탁 교육 연계',
      },
      {
        segment: '협력사',
        description: '신규 가입 근로자 안전 교육 정보 자동 DB화',
        stage: '구독 옵션',
        competitors: [],
        painPoint: '근로자별 이수증 사본 파일들을 정리하고 증적 관리하는 단순 반복 공수',
        pricingType: '월 구독 패키지 연동',
        validationEvent: 'partner_certs_updated',
        monoStrategy: '기초안전보건공단 데이터 파싱을 통한 자동 파일 동기화',
      },
      {
        segment: '원청',
        description: '안전교육 이수 검증 게이트웨이 연동',
        stage: 'B2B 라이선스',
        competitors: [],
        painPoint: '원청의 하도급 교육 이수 실적 감사를 위한 증적 서류 상호 대조 공수',
        pricingType: '원청 안전 솔루션 라이선스 포함',
        validationEvent: 'general_con_gate_linked',
        monoStrategy: 'MONO 모바일 안전패스 인증 완료자만 현장 입장 승인 게이트 연동',
      },
      {
        segment: '대기업',
        description: '사내 기술 연수원 자격 검증 프로그램 위탁 매칭',
        stage: '엔터프라이즈 라이선스',
        competitors: [],
        painPoint: '협력사의 기술 수준 및 자격 신뢰성 강화 교육 관리 툴 부재',
        pricingType: '교육 모델 브랜딩 비용',
        validationEvent: 'enterprise_training_active',
        monoStrategy: '대기업 전용 기능인 마스터클래스 수료 마킹 평판 시스템 연계',
      },
      {
        segment: '정부·지자체',
        description: '지자체 직업 전문 학교 교육 훈련 데이터 API 제휴',
        stage: '정책 연계',
        competitors: [],
        painPoint: '훈련 학교 수료생들의 실제 현장 구인 취업률 추적 불가',
        pricingType: '정부 기금 예산 연계',
        validationEvent: 'gov_job_training_synced',
        monoStrategy: '교육 수료생의 MONO 프로필 연동을 통한 실시간 취업률 트래커 제공',
      },
    ],
    pricingAssumption: '교육 수강 연계당 5~10% 교육 수수료 대행 또는 원청 교육 패키지 계약',
    mvpValidation: '기초안전교육 연계 50건 달성 → 모바일 이수증 연동 정합성 99% 이상',
    validationEvents: ['education_booked', 'cert_uploaded', 'cert_verified'],
    keyMetrics: ['교육 예약 전환율', '안전 미이수 감지율', '정산 리스크 감소율'],
    risks: ['공인 교육 기관 자격 법적 요건 충족 및 대행 수수료 제한 규정 준수'],
    nextAction: '공인 건설안전교육원 2개 지점과 교육 예약 시스템 연동 API 기획',
    arpu: '₩15,000/건',
    gtm: '체크인 미승인 근로자(미이수자)에게 실시간으로 교육 신청 팝업을 띄워 유도',
    lockIn: ['모바일 이수증 디지털 월렛'],
    competitorDetails: [],
  },
  {
    id: 'esg-report',
    name: 'ESG·상생 평가 리포트',
    tier: 'longterm',
    priority: 'P2',
    strategyTags: ['enterprise-win'],
    competitorTags: ['avetta'],
    cells: [
      {
        segment: '기술자',
        description: '근로 만족도 및 안전 준수 평가 익명 피드백 참여',
        stage: '무료',
        competitors: [],
        painPoint: '열악한 근로 환경 및 노무비 지급 갈등을 원청에 직접 말하기 곤란함',
        pricingType: '무료 설문 참여',
        validationEvent: 'worker_survey_submitted',
        monoStrategy: '데이터화된 익명 근로 만족도를 지표화하여 평판 시스템 반영',
      },
      {
        segment: '현장 리더',
        description: '팀원 안전 규정 준수 스코어링 및 평판 락인',
        stage: '무료',
        competitors: [],
        painPoint: '팀원들이 안전 장구를 안 써서 경고를 먹을 때 책임 관리가 안 됨',
        pricingType: '평판 관리 무료',
        validationEvent: 'leader_safety_score_updated',
        monoStrategy: '무재해 팀 이력을 누적하여 수주 가산점 획득 지원',
      },
      {
        segment: '수행 기업',
        description: 'ESG 우수 상생 기업 보고서 발급 및 원청 제출',
        stage: '유료 발급',
        competitors: ['Avetta'],
        painPoint: '대기업 수주를 위한 ESG 적격 하청 보고서 작성이 어려움',
        pricingType: '리포트 1회 발급당 ₩100,000',
        validationEvent: 'subcon_esg_report_paid',
        monoStrategy: '출역 정산 이력과 임금 체불 제로 실적 데이터 자동 증빙',
      },
      {
        segment: '협력사',
        description: '고용 안정 및 임금 지급 투명 스코어 공공 입찰 제출',
        stage: '유료 발급',
        competitors: [],
        painPoint: '조달청 등 공공 입찰 참여 시 상생 협력 지표 증명 필요',
        pricingType: '연간 구독 내 제공',
        validationEvent: 'partner_esg_report_downloaded',
        monoStrategy: '고용노동부 우수 고용주 기준에 부합하는 자동 평가 데이터',
      },
      {
        segment: '원청',
        description: '하도급 협력사 상생/안전 ESG 관제 대시보드 연동',
        stage: '연간 ARR 라이선스',
        competitors: ['Avetta'],
        painPoint: 'ESG 공시를 위해 하청 업체들의 안전 데이터를 매달 취합하는 물리적 피로',
        pricingType: '대시보드 라이선스 ₩12,000,000/연',
        validationEvent: 'general_con_esg_dashboard_active',
        monoStrategy: '현장에서 수집되는 가공 없는 실제 출역 기반 실시간 데이터 연동',
      },
      {
        segment: '대기업',
        description: '지속가능경영 보고서용 상생 노무 데이터 자동 집계',
        stage: '구독제',
        competitors: ['Avetta'],
        painPoint: '협력사의 인권, 안전 실태 보고서를 대외 기관에 검증 제출할 적격 증적 없음',
        pricingType: '대기업 ESG 연동 패키지 연 ₩24,000,000',
        validationEvent: 'enterprise_esg_data_exported',
        monoStrategy: '근로자 모바일 체크인과 직접 연결된 노동 인권 지표 실 데이터 API',
      },
      {
        segment: '정부·지자체',
        description: '지역 건설 상생 협력 수준 공공 통계 모니터링',
        stage: '정책 제휴',
        competitors: [],
        painPoint: '관내 하도급 건설업자들의 고용 환경 개선 정책 수립용 통계 부족',
        pricingType: '정책 보고서 제공 라이선스',
        validationEvent: 'gov_esg_stats_downloaded',
        monoStrategy: '지역별, 공종별 근로 만족도 및 고용 안전성 통계 추출 API',
      },
    ],
    pricingAssumption: '원청사 ESG 컴플라이언스 대시보드 라이선스 연 ₩24,000,000',
    mvpValidation: '1대 대기업 건설부문과 상생 협력 노무 평가 PoC 시나리오 작동 성공',
    validationEvents: ['esg_score_calculated', 'esg_report_exported', 'audit_approved'],
    keyMetrics: ['ESG 대시보드 조회수', '상생 평가 점수 개선도', '협력사 참여율'],
    risks: ['공신력 있는 ESG 평가 규격과의 정합성 확보 리스크'],
    nextAction: '건설협회 ESG 가이드라인 자료 검토 및 내부 스코어링 모델 구축',
    arpu: '₩2,000,000/월',
    gtm: '대기업 건설사의 ESG 위원회가 실시간 현장 데이터 기반으로 즉시 제출할 수 있는 공시 연계 지원',
    lockIn: ['대기업 연동 실시간 ESG 원데이터 API'],
    competitorDetails: [],
  },
  {
    id: 'global-visa-support',
    name: '외국인 근로자 비자·정착 지원',
    tier: 'longterm',
    priority: 'P2',
    strategyTags: ['global'],
    competitorTags: [],
    cells: [
      {
        segment: '기술자',
        description: '합법 비자(E-9, H-2 등) 만료 정보 모바일 확인 및 모국어 번역',
        stage: '무료',
        competitors: [],
        painPoint: '비자 갱신 만료일을 잊어 불법 체류자가 되거나, 안전 서류를 이해하지 못해 사고',
        pricingType: '무료 비자 트래킹 및 다국어 자료',
        validationEvent: 'global_worker_visa_verified',
        monoStrategy: '스마트폰을 통한 다국어 안전 비자 지갑 인터페이스',
      },
      {
        segment: '현장 리더',
        description: '외국인 팀원 모국어 작업 지시 및 출역 체크 대행',
        stage: '무료',
        competitors: [],
        painPoint: '외국인 근로자들과 언어 소통이 안 되어 오시공 및 안전 위반 잦음',
        pricingType: '다국어 안내 무료',
        validationEvent: 'leader_global_instruction_used',
        monoStrategy: 'AI 음성 및 다국어 템플릿 기반 실시간 시각 작업 지시',
      },
      {
        segment: '수행 기업',
        description: '합법 고용 허가 및 비자 만료 경고 관리 컴플라이언스',
        stage: '유료 수수료',
        competitors: [],
        painPoint: '출입국 단속 시 불법 근로자가 섞여 있어 벌금 및 현장 가동 중지 리스크',
        pricingType: '인당 매칭/관리비 ₩100,000',
        validationEvent: 'subcon_visa_audit_passed',
        monoStrategy: '출입국사무소 연계 실시간 비자 진위 감지',
      },
      {
        segment: '협력사',
        description: '외국인 쿼터 현장 관리 및 모국어 근로 계약 자동화',
        stage: '유료 구독 포함',
        competitors: [],
        painPoint: '국내법에 맞는 외국인 고용 서류 및 노동부 쿼터 실시간 산정이 어려움',
        pricingType: '구독 패키지 옵션 추가 ₩50,000',
        validationEvent: 'partner_global_quota_checked',
        monoStrategy: '워크스페이스 자동 쿼터 한도 시뮬레이터 적용',
      },
      {
        segment: '원청',
        description: '현장 내 외국인 노무 법적 리스크 모니터링 및 통제',
        stage: '원청 패키지',
        competitors: [],
        painPoint: '현장 게이트에서 위조 비자 소지자가 드나들어 원청 행정 처벌 우려',
        pricingType: '원청 라이선스 옵션 포함',
        validationEvent: 'general_con_foreigner_passed',
        monoStrategy: '출역 체크인 게이트웨이 단계 비자 진위 실시간 교차 대조',
      },
      {
        segment: '대기업',
        description: '글로벌 인력 제휴 파트너십 구축 및 상생 데이터 수급',
        stage: '상생 기금',
        competitors: [],
        painPoint: '급격한 국내 건설 고령화로 인한 대체 합법 인력 송출망 부재',
        pricingType: '글로벌 송출망 연동 컨설팅 ARR',
        validationEvent: 'enterprise_global_mou_signed',
        monoStrategy: '동남아 현지 송출 교육기관과 MONO 시스템 연동 및 인력 사전 검증',
      },
      {
        segment: '정부·지자체',
        description: '지자체 관할 외국인 유치 정책 및 비자 정착 데이터 연동',
        stage: '정책 연계',
        competitors: [],
        painPoint: '외국인 근로자의 주소지 이탈 및 불법 체류 통계 파악 지연',
        pricingType: '정부 시스템 커스텀 연동료',
        validationEvent: 'gov_global_report_pulled',
        monoStrategy: '실시간 가동 현장 출역 GPS 매핑 데이터 기반 정주지 증빙',
      },
    ],
    pricingAssumption: '외국인 매칭 성사 시인당 ₩100,000 대행료 / 비자 연장 대행 패키지 ₩200,000',
    mvpValidation: '외국인 근로자 20명 대상 모국어 교육 지원 → 비자 만료 경고 정상 동작 여부',
    validationEvents: ['visa_validated', 'translation_requested', 'global_matched'],
    keyMetrics: ['외국인 합법 매칭 성공률', '체류 기간 갱신 경고 적시 도달율', '다국어 번역 만족도'],
    risks: ['출입국관리법상 법률 규제 및 불법 체류 인력 필터링의 실시간 한계'],
    nextAction: '다국어 번역 교육 자료 3종(영어, 베트남어, 미얀마어) 초안 구축',
    arpu: '₩150,000/인',
    gtm: '합법 인력 수급 B2B 컴플라이언스를 100% 모니터링하여 해결',
    lockIn: ['출입국데이터 연동 실시간 비자 검증 엔진'],
    competitorDetails: [],
  },
  {
    id: 'ai-physical-ops',
    name: '현장 데이터·AI 자원 매칭',
    tier: 'longterm',
    priority: 'Long-term',
    strategyTags: ['ai-physical'],
    competitorTags: ['procore'],
    cells: [
      {
        segment: '기술자',
        description: '모바일 AI 자가 기량 진단 및 맞춤형 위험 경고 수신',
        stage: '장기 로드맵',
        competitors: [],
        painPoint: '자신의 숙련 수준을 객관적으로 측정해 볼 방법이 없고, 위험 감지 불가',
        pricingType: '무료 AI 자가 테스트',
        validationEvent: 'worker_ai_feedback_received',
        monoStrategy: '현장 투입 이미지 및 비디오 분석 기반 AI 기량 레벨 마킹',
      },
      {
        segment: '현장 리더',
        description: 'AI 기반 공정 최적화 인력 규모 및 배치 추천 스케줄링',
        stage: '장기 로드맵',
        competitors: [],
        painPoint: '매번 공정 상황에 따라 몇 명을 배치해야 하는지 리더의 경험에만 의존',
        pricingType: '스케줄러 AI 옵션 무료',
        validationEvent: 'leader_ai_schedule_adopted',
        monoStrategy: '공정 스케줄러 내 AI 자동 예측 보조 추천 엔진 탑재',
      },
      {
        segment: '수행 기업',
        description: '3D 도면 연동을 통한 공정별 최적 자재/장비 수량 자동 소싱 추천',
        stage: '장기 구독제',
        competitors: ['Procore'],
        painPoint: '설계 도면 대비 실제 자재 손실율이 높고 불필요한 장비 낭비 발생',
        pricingType: 'AI 엔진 구독 월 ₩200,000',
        validationEvent: 'subcon_ai_opt_used',
        monoStrategy: '이전 현장 실측 데이터 기반의 공종별 자동 최적 소싱 알고리즘',
      },
      {
        segment: '협력사',
        description: '가동 데이터 축적 기반 원가 절감 예측 스코어 획득',
        stage: '장기 구독제',
        competitors: [],
        painPoint: '견적 입찰 시 자재비 상승 및 단가 산정의 오류로 인한 적자 우려',
        pricingType: 'AI 원가 예측 툴 라이선스',
        validationEvent: 'partner_ai_cost_predicted',
        monoStrategy: '실시간 자재 매칭 시장 단가와 연동된 원가 시뮬레이터 제공',
      },
      {
        segment: '원청',
        description: '지능형 CCTV 위험 구역 근로자 모니터링 연동 통제',
        stage: 'B2B 연간 계약',
        competitors: [],
        painPoint: '안전 관리자가 현장 구석구석의 위험 상황(안전모 미착용 등)을 관제할 수 없음',
        pricingType: 'AI 관제 패키지 도입료 ₩15,000,000',
        validationEvent: 'general_con_ai_safety_alarmed',
        monoStrategy: '모바일 체크인 인력 조달 근로자의 위치 데이터와 지능형 영상 매핑 결합',
      },
      {
        segment: '대기업',
        description: '현장 자동화 로봇 및 AI 운영 빅데이터 축적 라이선스',
        stage: '엔터프라이즈 라이선스',
        competitors: [],
        painPoint: '로봇 및 무인 장비 도입 시 현장 실 데이터 연계 샌드박스 부재',
        pricingType: '엔터프라이즈 데이터 계약 연 ₩50,000,000',
        validationEvent: 'enterprise_ai_robot_linked',
        monoStrategy: 'MONO Tech-Blue 등급 특수 스마트 장비 인터페이스 라이브 공급',
      },
      {
        segment: '정부·지자체',
        description: '스마트 시티 안전 인프라 지능형 모니터링 데이터 연계',
        stage: '정책 제휴',
        competitors: [],
        painPoint: '공공 건설 안전 위험 지역의 디지털 트윈 모니터링 소스 부족',
        pricingType: '정부 공공 API 라이선스',
        validationEvent: 'gov_digital_twin_synced',
        monoStrategy: '익명화된 관내 현장 실 데이터 연동 스마트 관제 API 제공',
      },
    ],
    pricingAssumption: 'AI 프로젝트 현장 최적화 관제 모델 도입비 ₩15,000,000 / 월 ₩500,000 라이선스',
    mvpValidation: '테스트 베드 현장 1곳 대상 인력/장비 배치 최적화 시뮬레이션 일치도 85% 돌파',
    validationEvents: ['ai_recommendation_generated', 'resource_optimized', 'safety_alert_triggered'],
    keyMetrics: ['AI 추천 채택율', '안전 위험 사전 감지 정확도', '원가 절감율'],
    risks: ['현장 실시간 비정형 데이터(도면, 이미지) 수집의 법적 권한 및 기술적 한계'],
    nextAction: '3D 현장 데이터 수집용 모바일 스캔 툴 프로토타입 PoC 설계',
    arpu: '₩500,000/월',
    gtm: '공기 지연과 원가 상승에 직면한 고난도 SOC 현장에 지능형 관제 데이터로 가치 제공',
    lockIn: ['AI 분석 알고리즘', '현장 원시 안전 영상 데이터 아카이브'],
    competitorDetails: [],
  },
];

// ─────────────────────────────────────────────
// Competitors Static Analysis Data
// ─────────────────────────────────────────────
const COMPETITORS_ANALYSIS: CompetitorDetail[] = [
  {
    name: '가다 (GADA)',
    type: '일용직 알선 · 매칭',
    strategy: '근로자 안심 출역 중심의 공고 매칭 및 노임 직접 지급 대행',
    successPoint: '모바일 일용직 노임 지급 보증, 간편 근로 계약서 작성',
    limitation: '팀 단위 관리 기능 부재, 장기 상용 노무 SaaS 데이터 부족, 재요청 시스템 부재',
    monoResponse: '현장 리더(작업반장)를 통한 팀 단위 출역 체크인 및 노무 관리 SaaS 연계',
    monoAvoid: '대규모 직채용 형태의 일용직 노임 직접 선지급(금융 부담 가중)',
    linkableBMs: ['B2B 기업 공고 과금', '출역·정산 리포트', 'Partner Workspace 구독'],
  },
  {
    name: '숨고 (Soomgo)',
    type: '전문가 중개 플랫폼',
    strategy: '견적 요청서를 보내면 다수의 전문가가 견적서를 발송하고 채팅 연결을 제공',
    successPoint: '풍부한 매칭 인력 풀, 견적 비교 편의성으로 거래 초입 점유',
    limitation: '견적 완료 후 오프라인 직거래로 이탈하여 매칭 이후 대금 정산 수수료 수취 실패 (견적 이후 거래 이탈)',
    monoResponse: '표준 요청서 기반 매칭, 안심 에스크로 결제와 출역 체크인 연계로 최종 정산까지 플랫폼 내 유지',
    monoAvoid: '매칭 이후 관리/정산 단계가 없는 단순 연락처·견적 중개 서비스',
    linkableBMs: ['팀 단위 매칭 수수료', '금융·보험 제휴형'],
  },
  {
    name: '아정당',
    type: '구조화 컨설팅 대행',
    strategy: '상담원이 개입하여 불투명한 결합 혜택을 알기 쉽게 구조화하여 신뢰 획득',
    successPoint: '적극적인 현장 상담원으로 고객 신뢰 확보',
    limitation: '수기 상담 및 대리인 개입(휴먼 리소스) 의존도가 높아 대규모 인력 수급 자동화에 한계',
    monoResponse: '현장 컨설턴트의 판단을 AI와 데이터로 보완하여 디지털 평판 스코어링 시스템 구축',
    monoAvoid: '모든 매칭 과정에 수기 상담원을 개입시키는 오프라인 인력소 방식의 수동 매칭',
    linkableBMs: ['프로필·팀 열람 과금', '현장 데이터·AI 자원 매칭'],
  },
  {
    name: '오늘의집/집닥',
    type: '시공/커머스 플랫폼',
    strategy: '완성 인테리어 사진 콘텐츠와 시공 파트너 매칭을 커머스와 결합',
    successPoint: '풍부한 B2C 시공 포트폴리오 갤러리 및 평판 리뷰 기반 고객 안심 매칭',
    limitation: '상업·산업용 대형 건설 현장의 노무 관리 및 공정별 인력 출역 관리 불가',
    monoResponse: '시공 사진과 실제 출역 데이터를 결합하여 증빙 기반의 신뢰 시공 평판 구축',
    monoAvoid: '단순 인테리어 완성 갤러리 중심의 B2C 커뮤니티 커머스 모방',
    linkableBMs: ['장비·자재 연계 수수료', '팀 단위 매칭 수수료'],
  },
  {
    name: 'Taskrabbit',
    type: '소액 단기 작업 매칭',
    strategy: '개인 간 생활 심부름 및 홈 기가 스킬 매칭 및 에스크로 대금 보호',
    successPoint: '간편한 모바일 소액 작업 매칭, 에스크로 안전 결제 및 가입자 평판',
    limitation: '현장의 복잡한 B2B 컴플라이언스(안전 교육, 출역 대장, 조세 신고) 지원 불가',
    monoResponse: '출역 대장 자동 생성 및 안전 교육 이수증 확인 등 법령 준수 기능 결합',
    monoAvoid: '소액 단순 심부름/가사 노동 중심의 단기 C2C 매칭 시장 진입',
    linkableBMs: ['팀 단위 매칭 수수료', '검증 API·컴플라이언스'],
  },
  {
    name: 'Thumbtack',
    type: '로컬 서비스 리드 마켓',
    strategy: '전문가 카탈로그를 보여주고 매칭 연락 시 건당 과금',
    successPoint: '상세 프로필 및 포트폴리오 노출로 전문가의 직접 스카우트 유도',
    limitation: '전문가의 실시간 현장 가동 여부 및 소속 팀원의 보증 데이터를 제공하지 못함',
    monoResponse: 'Certified Field Leader 인증 및 가용 팀원 실시간 스케줄 관리 연동',
    monoAvoid: '검증되지 않은 가짜 이력 프로필의 단순 목록 노출',
    linkableBMs: ['프로필·팀 열람 과금', 'B2B 기업 공고 과금'],
  },
  {
    name: 'Instawork',
    type: '현장 교대근무 매칭',
    strategy: '물류 및 식음료 현장 교대 근무 스케줄 관리 및 노무비 신속 정산',
    successPoint: '미도착·취소 리스크(노쇼) 방지를 위한 대기 인력(Standby) 보장 체계',
    limitation: '단발성 단기 근무에 치중하여 다개월 이상 소요되는 장기 건설 프로젝트의 숙련 노무 관리 미흡',
    monoResponse: '미도착·취소 리스크(노쇼) 대응을 위한 백업 풀 제공 및 장기 정기 출역 전환 연동',
    monoAvoid: '전문성이 없는 단순 노무(물류 상하차 등) 위주의 단기 알바 중개',
    linkableBMs: ['B2B 기업 공고 과금', 'Partner Workspace 구독'],
  },
  {
    name: 'Workrise',
    type: '산업 인력 및 벤더 정산',
    strategy: '대형 에너지/인프라 현장의 외주 노무 정산 및 세무 컴플라이언스 대행',
    successPoint: '복잡한 주별 노무법과 결제 조건(Factor)의 대행을 통한 B2B 대형 거래 락인',
    limitation: '미국 시장 특화로 한국의 주휴수당, 퇴직공제부금 기초 데이터 정리 등 국내법 특수성 미지원',
    monoResponse: '한국 건설 노동법(일용직 주휴수당, 세무)에 맞춘 노무비 정산 보조 및 증빙 관리 SaaS 제공',
    monoAvoid: '팩토링 금융 비용을 무리하게 전액 떠안는 고위험 여신 거래 개시',
    linkableBMs: ['출역·정산 리포트', 'Partner Workspace 구독', '장비·자재 연계 수수료'],
  },
  {
    name: 'Avetta/ISN',
    type: 'B2B 협력사 안전 실사',
    strategy: '대기업 발주사(원청)를 대행해 하청 협력사의 안전 역량을 엄격히 사전 심사',
    successPoint: '원청사의 안전 요구 기준을 대신 인증하여 하도급 가입을 강제하는 강력한 B2B 네트워크',
    limitation: '기업 서류 실사에 그쳐, 매일 현장에서 일어나는 실제 출역 근로자의 기량/안전 데이터 실시간 확인 부재',
    monoResponse: '안전 리스크 관리를 위한 모바일 안전패스(이수증 연동)와 실시간 현장 체크인 결합',
    monoAvoid: '실제 현업 데이터 없이 단순 정적 서류 대행만 제공하는 형식적 시스템',
    linkableBMs: ['검증 API·컴플라이언스', '안전 교육·자격증 연계', 'ESG·상생 평가 리포트'],
  },
  {
    name: 'Procore',
    type: '건설 클라우드 협업 솔루션',
    strategy: '대형 종합건설사를 타겟으로 도면, RFI, 공정, 원가, 안전 관리 SaaS 제공',
    successPoint: '도면, 공정, 원가, 안전을 모바일 클라우드로 완벽히 관리하는 글로벌 표준',
    limitation: '국내 기술직 노무/정산/일용직 노임 명세 세법 특수성을 다루지 못함',
    monoResponse: '노무비 정산 보조 및 증빙 관리, 인력 조달과 직접 연계된 가벼운 한국형 현업 SaaS',
    monoAvoid: '수억 원에 달하는 전사적 대형 ERP/도면 관리 SaaS 직접 경쟁 개발',
    linkableBMs: ['Partner Workspace 구독', '현장 데이터·AI 자원 매칭'],
  },
];

const SCENARIOS = [
  {
    id: 'fast-validation',
    name: '빠른 매출 검증 전략',
    flow: '공고 과금 → 프로필 열람 → Partner Workspace 구독',
    metrics: 'B2B 현금 흐름 및 리드 과금',
    sequence: ['job-posting', 'profile-access', 'workspace-subscription'],
    description: '수요자(수행 기업, 협력사)가 즉각적인 채용 결원을 메우고 검증 리더 정보를 열람하는 니즈에 포커싱해 빠른 매출을 유도하는 시나리오입니다.',
    customers: ['수행 기업', '협력사', '현장 리더'],
    lockins: ['기량 검증 데이터', 'Certified 리더 배지'],
  },
  {
    id: 'lock-in',
    name: '현장 락인 전략',
    flow: 'Partner Workspace 구독 → 출역 리포트 → 시공 매칭 수수료',
    metrics: '사용자 및 협력사 잔존율(LTV), 거래 이탈 방지',
    sequence: ['workspace-subscription', 'attendance-report', 'matching-fee'],
    description: '출역 명세 및 정산 리포트를 협력사/기술자가 직접 생성·제공받게 함으로써 오프라인으로의 직거래 이탈을 방지하고 잔존시키는 전략입니다.',
    customers: ['현장 리더', '수행 기업', '협력사'],
    lockins: ['표준 요청서', '출역 확인 체크인', '정산 증빙', '평가·재요청 루프'],
  },
  {
    id: 'enterprise-win',
    name: '대기업 상생 전략',
    flow: '컴플라이언스 네트워크 납품 → 협력사 가입 → 안전·ESG 리포트 연동',
    metrics: '원청 연간 라이선스(ARR), 협력사 고속 온보딩',
    sequence: ['compliance-network', 'education-cert', 'esg-report'],
    description: '안전 리스크 관리가 절급한 대기업/원청사에 모니터링 시스템을 제공하여, 가입 협력사와 기술자들이 탑다운으로 플랫폼에 온보딩되게 유도하는 시나리오입니다.',
    customers: ['원청', '대기업', '협력사', '정부·지자체'],
    lockins: ['안전 리스크 관리 API', 'ESG 공시 연계', '이수증 자동 연동'],
  },
  {
    id: 'global',
    name: '글로벌 인력 전략',
    flow: '비자 검증 → 모국어 매핑 → 외국인 출역 관리',
    metrics: '외국인 송출 수수료, 연동 대행 ARR',
    sequence: ['global-visa-support'],
    description: '현장 인력 부족을 보완하기 위해 비자 컴플라이언스가 증빙된 외국인 근로자를 온보딩하고 지원하여 플랫폼 유입률을 확보하는 전략입니다.',
    customers: ['기술자', '현장 리더', '수행 기업', '협력사'],
    lockins: ['다국어 안전 교육 이력', '출입국데이터 연동 비자 트래커'],
  },
];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function BMPage() {
  const [activeFilter, setActiveFilter] = useState<Tier | 'all'>('all');
  const [selectedCompetitors, setSelectedCompetitors] = useState<CompetitorTag[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const [selectedMobileSegmentIdx, setSelectedMobileSegmentIdx] = useState<number>(0);

  const [selectedBM, setSelectedBM] = useState<BM | null>(null);
  const [selectedSegmentIdx, setSelectedSegmentIdx] = useState<number>(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Toggle Competitor Tag Filter
  const toggleCompetitor = (tag: CompetitorTag) => {
    if (selectedCompetitors.includes(tag)) {
      setSelectedCompetitors(selectedCompetitors.filter((t) => t !== tag));
    } else {
      setSelectedCompetitors([...selectedCompetitors, tag]);
    }
  };

  // Toggle Customer Segment Filter
  const toggleSegment = (segName: string) => {
    if (selectedSegments.includes(segName)) {
      setSelectedSegments(selectedSegments.filter((s) => s !== segName));
    } else {
      setSelectedSegments([...selectedSegments, segName]);
    }
  };

  const clearCompetitors = () => setSelectedCompetitors([]);
  const clearSegments = () => setSelectedSegments([]);

  const openDrawer = (bm: BM, segIdx: number) => {
    setSelectedBM(bm);
    setSelectedSegmentIdx(segIdx);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedBM(null), 300);
  };

  // Filter core list based on active tier filter
  const filteredBMs = BM_DATA.filter((bm) => {
    if (activeFilter !== 'all' && bm.tier !== activeFilter) return false;
    return true;
  });

  // Check if a specific BM matches the current active strategy scenario
  const isBMInActiveScenario = (bmId: string) => {
    if (!selectedScenario) return true;
    const sc = SCENARIOS.find((s) => s.id === selectedScenario);
    return sc ? sc.sequence.includes(bmId) : true;
  };

  // Check if a specific BM matches the current active competitor selection
  const isBMInSelectedCompetitors = (bm: BM) => {
    if (selectedCompetitors.length === 0) return true;
    return bm.competitorTags.some((c) => selectedCompetitors.includes(c));
  };

  // Check if a specific BM has cell matching any selected customer segments
  const isBMInSelectedSegments = (bm: BM) => {
    if (selectedSegments.length === 0) return true;
    return bm.cells.some(cell => selectedSegments.includes(cell.segment) && cell.description.trim() !== '');
  };

  // Combined highlight checks
  const getBMVisualStatus = (bm: BM) => {
    const scenarioMatch = isBMInActiveScenario(bm.id);
    const competitorMatch = isBMInSelectedCompetitors(bm);
    const segmentMatch = isBMInSelectedSegments(bm);

    if (selectedCompetitors.length > 0 || selectedScenario !== null || selectedSegments.length > 0) {
      if (scenarioMatch && competitorMatch && segmentMatch) return 'highlighted';
      return 'dimmed';
    }
    return 'normal';
  };

  const getPriorityStyle = (priority: Priority) => {
    switch (priority) {
      case 'P0':
        return {
          color: '#475569',
          bg: '#f5f3ff', // Very light pastel indigo
          border: '#4f46e5', // Bold indigo border
          label: 'P0 즉시 검증',
          titleColor: '#1e1b4b', // Dark indigo title
          textColor: '#475569',
          subColor: '#64748b',
          accentColor: '#4f46e5',
          borderTopColor: 'rgba(79,70,229,0.1)',
          badgeBg: '#e0e7ff',
          badgeText: '#4f46e5',
        };
      case 'P1':
        return {
          color: '#475569',
          bg: '#f0fdfa', // Very light pastel mint
          border: '#0d9488', // Bold mint border
          label: 'P1 확장 검증',
          titleColor: '#0f766e', // Dark teal title
          textColor: '#475569',
          subColor: '#64748b',
          accentColor: '#0d9488',
          borderTopColor: 'rgba(13,148,136,0.1)',
          badgeBg: '#ccfbf1',
          badgeText: '#0d9488',
        };
      case 'P2':
        return {
          color: '#475569',
          bg: '#faf5ff', // Very light pastel purple
          border: '#7c3aed', // Bold purple border
          label: 'P2 장기 전략',
          titleColor: '#6d28d9', // Dark purple title
          textColor: '#475569',
          subColor: '#64748b',
          accentColor: '#7c3aed',
          borderTopColor: 'rgba(124,58,237,0.1)',
          badgeBg: '#f3e8ff',
          badgeText: '#7c3aed',
        };
      case '보류':
        return {
          color: '#475569',
          bg: '#f8fafc', // Very light pastel gray
          border: '#cbd5e1', // Bold gray border
          label: '보류',
          titleColor: '#334155', // Dark gray title
          textColor: '#475569',
          subColor: '#64748b',
          accentColor: '#64748b',
          borderTopColor: 'rgba(0,0,0,0.06)',
          badgeBg: '#e2e8f0',
          badgeText: '#64748b',
        };
      default:
        return {
          color: '#475569',
          bg: '#f8fafc',
          border: '#cbd5e1',
          label: '장기 비전',
          titleColor: '#334155',
          textColor: '#475569',
          subColor: '#64748b',
          accentColor: '#475569',
          borderTopColor: 'rgba(0,0,0,0.06)',
          badgeBg: '#e2e8f0',
          badgeText: '#64748b',
        };
    }
  };

  const activeScenarioObj = SCENARIOS.find((s) => s.id === selectedScenario);

  // Recommendations Data
  const recommendationsList = [
    {
      id: 'job-posting',
      name: 'B2B 기업 공고 과금',
      priority: 'P0' as Priority,
      label: '즉시 검증',
      reason: '가장 빠르게 실제 구인 수요를 확보하고 검증 가능',
      target: '수행 기업·시공사',
      velocity: '매우 빠름',
      devDiff: '낮음',
      salesDiff: '보통',
      legalRisk: '낮음',
      lockInEffect: '보통',
      recommend: '적극 추천',
    },
    {
      id: 'workspace-subscription',
      name: 'Partner Workspace 구독',
      priority: 'P0' as Priority,
      label: '즉시 검증',
      reason: '현장 노무비 정산 보조 및 증빙 관리 기반의 월 정기 구독 락인',
      target: '수행 기업·협력사',
      velocity: '보통',
      devDiff: '보통',
      salesDiff: '높음',
      legalRisk: '낮음',
      lockInEffect: '매우 높음',
      recommend: '적극 추천',
    },
    {
      id: 'profile-access',
      name: '프로필·팀 열람 과금',
      priority: 'P0' as Priority,
      label: '즉시 검증',
      reason: '기량 평판 검증이 완료된 정예 인재 풀의 조회 가치 제공',
      target: '수행 기업·협력사',
      velocity: '빠름',
      devDiff: '낮음',
      salesDiff: '보통',
      legalRisk: '보통',
      lockInEffect: '보통',
      recommend: '적극 추천',
    },
    {
      id: 'matching-fee',
      name: '팀 단위 매칭 수수료',
      priority: 'P1' as Priority,
      label: '확장 검증',
      reason: '견적 이후 거래 이탈을 줄이는 MONO 차별화 핵심 가치 입증',
      target: '현장 리더·수행 기업',
      velocity: '보통',
      devDiff: '보통',
      salesDiff: '보통',
      legalRisk: '보통',
      lockInEffect: '높음',
      recommend: '추천',
    },
    {
      id: 'attendance-report',
      name: '출역·정산 리포트',
      priority: 'P1' as Priority,
      label: '확장 검증',
      reason: '출역 데이터 대장 취합 및 세무 간이 양식 자동 대조 편의성',
      target: '협력사·원청',
      velocity: '보통',
      devDiff: '보통',
      salesDiff: '보통',
      legalRisk: '낮음',
      lockInEffect: '매우 높음',
      recommend: '추천',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FCFCFE radial-gradient(rgba(79, 70, 229, 0.04) 1px, transparent 1px) repeat',
        backgroundSize: '24px 24px',
        color: '#334155',
        fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
      }}
    >
      {/* ── Styles (Bumping default styles for better legibility) ── */}
      <style>{`
        * { box-sizing: border-box; }
        .bm-row { transition: background 0.15s, opacity 0.25s; }
        .bm-row:hover { background: #f8fafc; }
        .bm-row.dimmed { opacity: 0.25; }
        .bm-row.highlighted {
          background: rgba(79,70,229,0.02);
          box-shadow: inset 4px 0 0 #4f46e5;
        }
        .matrix-scroll-container::-webkit-scrollbar {
          height: 8px;
        }
        .matrix-scroll-container::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .matrix-scroll-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .matrix-scroll-container::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .matrix-cell {
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
          border-radius: 12px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 145px;
          justify-content: space-between;
          border: 1px solid #e2e8f0;
          background: #ffffff;
        }
        .matrix-cell:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(79,70,229,0.06);
          border-color: #4f46e5;
        }
        .matrix-cell.dimmed { opacity: 0.25; }
        .matrix-cell.highlighted {
          border: 1.5px solid #4f46e5;
          background: rgba(79,70,229,0.01);
        }
        .filter-btn { transition: all 0.2s; }
        .filter-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .drawer-overlay {
          position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          z-index: 50; transition: opacity 0.3s;
        }
        .drawer-panel {
          position: fixed; top: 0; right: 0; height: 100vh;
          width: min(640px, 94vw);
          background: #ffffff;
          border-left: 1px solid #e2e8f0;
          z-index: 51; overflow-y: auto;
          transition: transform 0.3s cubic-bezier(0.32, 0, 0.67, 0);
          box-shadow: -8px 0 24px rgba(0,0,0,0.05);
        }
        .drawer-panel.open { transform: translateX(0); }
        .drawer-panel.closed { transform: translateX(100%); }
        .detail-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 16px 18px;
          margin-bottom: 14px;
        }
        .detail-label {
          font-size: 12px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: #64748b; margin-bottom: 6px;
        }
        .detail-value {
          font-size: 14.5px; font-weight: 500;
          color: #334155; line-height: 1.6;
        }
        .seg-tab {
          padding: 10px 14px; border-radius: 8px;
          font-size: 13.5px; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          border: 1px solid #cbd5e1;
        }
        .seg-tab.active { color: #fff; border-color: transparent; }
        .seg-tab:not(.active) { color: #64748b; background: #ffffff; }
        .seg-tab:not(.active):hover { background: #f8fafc; color: #1e293b; }
        .recommendation-card {
          border-radius: 14px; padding: 20px 22px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
          cursor: pointer;
        }
        .recommendation-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(79,70,229,0.07);
        }

        .recommendation-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(5, 1fr);
        }
        @media (max-width: 1023px) {
          .recommendation-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .pc-matrix { display: none !important; }
          .mobile-matrix { display: block !important; }
        }
        @media (max-width: 639px) {
          .recommendation-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (min-width: 1024px) {
          .pc-matrix { display: block !important; }
          .mobile-matrix { display: none !important; }
        }
        @keyframes slideInRight { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide { animation: slideInRight 0.25s ease; }
      `}</style>

      {/* ── Header ── */}
      <header
        style={{
          background: 'rgba(252,252,254,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          padding: '28px 30px',
          position: 'sticky', top: 0, zIndex: 30,
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
              <h1 style={{ fontSize: 26, fontWeight: 950, margin: 0, letterSpacing: '-0.03em', color: '#0f172a' }}>
                MONO 수익화 전략 대시보드
              </h1>
              <span
                style={{
                  fontSize: 12, fontWeight: 800, color: '#4f46e5',
                  background: 'rgba(79,70,229,0.08)', padding: '3px 12px',
                  borderRadius: 999, border: '1px solid rgba(79,70,229,0.2)',
                }}
              >
                v2.5
              </span>
            </div>
            <p style={{ fontSize: 16, color: '#64748b', margin: 0, fontWeight: 600 }}>
              고객군, BMs, 경쟁사 레퍼런스, 검증 순서 및 락인 효과를 분석하는 단일 수익화 전략 대시보드입니다.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                clearCompetitors();
                clearSegments();
                setSelectedScenario(null);
              }}
              style={{
                padding: '10px 20px', background: '#ffffff', border: '1px solid #cbd5e1',
                borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', color: '#475569',
              }}
            >
              필터 초기화
            </button>
            <button
              onClick={() => window.location.href = '#competitors-analysis'}
              style={{
                padding: '10px 20px', background: 'linear-gradient(135deg, #4f46e5, #3730a3)',
                border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: 'pointer',
                color: '#ffffff', boxShadow: '0 4px 12px rgba(79,70,229,0.2)',
              }}
            >
              경쟁사 상세 분석 ↓
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 28px 60px' }}>

        {/* ── 7. 전략 요약 패널 (현재 전략 요약) ── */}
        <section
          style={{
            background: '#ffffff',
            border: '2px solid #cbd5e1',
            borderRadius: 16,
            padding: '22px 26px',
            marginBottom: 28,
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 850, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            🎯 ACTIVE MONO REVENUE STRATEGY PREVIEW (현재 요약 패널)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>현재 전략 시나리오</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: '#0f172a' }}>
                {activeScenarioObj ? activeScenarioObj.name : '전체 수익모델 조망 전략'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>핵심 타겟 고객군</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#334155', display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
                {activeScenarioObj
                  ? activeScenarioObj.customers.map(c => (
                      <span key={c} style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: 4, fontSize: 13 }}>{c}</span>
                    ))
                  : '전체 7대 고객군'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>우선순위 추천 BM</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#334155', display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
                {activeScenarioObj
                  ? activeScenarioObj.sequence.map(id => {
                      const found = BM_DATA.find(b => b.id === id);
                      return found ? (
                        <span key={id} style={{ background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: 4, fontSize: 13 }}>{found.name}</span>
                      ) : null;
                    })
                  : 'P0/P1 핵심 추천 BM 5개'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>핵심 락인 장치</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#166534', display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
                {activeScenarioObj
                  ? activeScenarioObj.lockins.map(l => (
                      <span key={l} style={{ background: '#f0fdf4', padding: '3px 8px', borderRadius: 4, fontSize: 12 }}>{l}</span>
                    ))
                  : '출역 확인, 정산 증빙, 평가·재요청 루프'}
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. 먼저 시작하면 좋은 서비스 (추천 초기 BM) ── */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            💡 먼저 시작하면 좋은 추천 초기 BM 및 상세 판단 기준
          </div>
          <div className="recommendation-grid">
            {recommendationsList.map((card) => {
              const bmObj = BM_DATA.find((b) => b.id === card.id);
              const pStyle = getPriorityStyle(card.priority);
              const isSelected = selectedScenario ? activeScenarioObj?.sequence.includes(card.id) : true;
              return (
                <div
                  key={card.id}
                  className="recommendation-card"
                  onClick={() => {
                    if (bmObj) {
                      openDrawer(bmObj, 2); // Open segment index 2 (수행 기업)
                    }
                  }}
                  style={{
                    border: `2px solid ${pStyle.border}`,
                    background: pStyle.bg,
                    opacity: isSelected ? 1 : 0.45,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, background: pStyle.badgeBg, color: pStyle.badgeText, padding: '2px 8px', borderRadius: 4, border: `1px solid ${pStyle.border}30` }}>
                      {card.label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 900, color: pStyle.titleColor }}>
                      {card.priority}
                    </span>
                  </div>
                  <div style={{ fontSize: 16.5, fontWeight: 900, color: pStyle.titleColor, marginBottom: 4 }}>
                    {card.name}
                  </div>
                  <div style={{ fontSize: 12.5, color: pStyle.subColor, fontWeight: 800, marginBottom: 8 }}>
                    대상: {card.target}
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: pStyle.textColor, lineHeight: 1.5, wordBreak: 'keep-all', minHeight: 48, marginBottom: 10 }}>
                    {card.reason}
                  </p>
                  
                  {/* Detailed metrics added */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11.5px', color: pStyle.subColor, borderTop: `1px solid ${pStyle.borderTopColor}`, paddingTop: '8px', marginTop: '8px' }}>
                    <div>매출 속도: <strong style={{ color: pStyle.titleColor }}>{card.velocity}</strong></div>
                    <div>개발 난이도: <strong style={{ color: pStyle.titleColor }}>{card.devDiff}</strong></div>
                    <div>영업 난이도: <strong style={{ color: pStyle.titleColor }}>{card.salesDiff}</strong></div>
                    <div>법률 리스크: <strong style={{ color: pStyle.titleColor }}>{card.legalRisk}</strong></div>
                    <div>락인 효과: <strong style={{ color: pStyle.titleColor }}>{card.lockInEffect}</strong></div>
                    <div>추천 여부: <strong style={{ color: pStyle.accentColor }}>{card.recommend}</strong></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Filters Section ── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          
          {/* 1. Customer Segment filter (Added) */}
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                👥 고객군 필터 (중복 선택 가능, 선택 시 해당 셀 및 모델 강조)
              </div>
              {selectedSegments.length > 0 && (
                <button onClick={clearSegments} style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  필터 해제
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SEGMENT_DETAILS.map((detail) => {
                const isSelected = selectedSegments.includes(detail.name);
                return (
                  <button
                    key={detail.name}
                    onClick={() => toggleSegment(detail.name)}
                    style={{
                      padding: '8px 16px', borderRadius: 8, fontSize: 13.5, fontWeight: 700,
                      cursor: 'pointer', transition: 'all 0.15s',
                      background: isSelected ? detail.colorText : '#ffffff',
                      color: isSelected ? '#ffffff' : '#64748b',
                      border: `1px solid ${isSelected ? 'transparent' : '#cbd5e1'}`,
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    <span>{detail.name}</span>
                    <span style={{ fontSize: 11, opacity: isSelected ? 0.9 : 0.7 }}>({detail.role})</span>
                    <span style={{ fontSize: 10.5, background: isSelected ? '#ffffff' : detail.colorBg, color: isSelected ? detail.colorText : detail.colorText, padding: '1px 5px', borderRadius: 4, fontWeight: 800 }}>
                      {detail.priority}
                    </span>
                  </button>
                );
              })}
            </div>
            {selectedSegments.length > 0 && (
              <div style={{ marginTop: 10, fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                현재 선택된 고객군: <span style={{ color: '#0f172a' }}>{selectedSegments.join(', ')}</span>
              </div>
            )}
          </div>

          {/* 2. Competitor filter */}
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                🔍 경쟁사별 벤치마크 필터 (중복 선택 가능)
              </div>
              {selectedCompetitors.length > 0 && (
                <button onClick={clearCompetitors} style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  필터 해제
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[
                { tag: 'gada', label: '가다' },
                { tag: 'soomgo', label: '숨고' },
                { tag: 'ajungdang', label: '아정당' },
                { tag: 'todayhouse', label: '오늘의집/집닥' },
                { tag: 'taskrabbit', label: 'Taskrabbit' },
                { tag: 'thumbtack', label: 'Thumbtack' },
                { tag: 'instawork', label: 'Instawork' },
                { tag: 'workrise', label: 'Workrise' },
                { tag: 'avetta', label: 'Avetta/ISN' },
                { tag: 'procore', label: 'Procore' }
              ].map((c) => {
                const isSelected = selectedCompetitors.includes(c.tag as CompetitorTag);
                return (
                  <button
                    key={c.tag}
                    onClick={() => toggleCompetitor(c.tag as CompetitorTag)}
                    style={{
                      padding: '8px 16px', borderRadius: 8, fontSize: 13.5, fontWeight: 700,
                      cursor: 'pointer', transition: 'all 0.15s',
                      background: isSelected ? '#4f46e5' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#64748b',
                      border: `1px solid ${isSelected ? 'transparent' : '#cbd5e1'}`,
                    }}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. MONO Strategy Simulation filter */}
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              🚀 MONO 성장 전략 시뮬레이션 필터
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <button
                onClick={() => setSelectedScenario(null)}
                style={{
                  padding: '8px 18px', borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
                  background: selectedScenario === null ? '#0f172a' : '#ffffff',
                  color: selectedScenario === null ? '#ffffff' : '#64748b',
                  border: `1px solid ${selectedScenario === null ? 'transparent' : '#cbd5e1'}`,
                }}
              >
                전체 전략 시나리오
              </button>
              {SCENARIOS.map((sc) => {
                const isSelected = selectedScenario === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedScenario(sc.id)}
                    style={{
                      padding: '8px 18px', borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
                      background: isSelected ? '#4f46e5' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#64748b',
                      border: `1px solid ${isSelected ? 'transparent' : '#cbd5e1'}`,
                    }}
                  >
                    {sc.name}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── PC Matrix Section (1024px and up) ── */}
        <section className="pc-matrix" style={{ marginBottom: 44 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>🖥️ PC 7열 전략 매트릭스 뷰</span>
              <span style={{ fontWeight: 500, color: '#94a3b8' }}>- 가로 스크롤로 상세히 비교 가능합니다.</span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {SEGMENT_DETAILS.map((detail, i) => (
                <div key={detail.name} style={{ display: 'flex', alignItems: 'center', gap: 4, background: detail.colorBg, padding: '4px 10px', borderRadius: 6, border: `1px solid ${detail.border}` }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: SEGMENT_COLORS[i] }} />
                  <span style={{ fontSize: 12, fontWeight: 800, color: detail.colorText }}>{detail.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 750, color: '#64748b', opacity: 0.85 }}>({detail.role})</span>
                  <span style={{ fontSize: 10.5, fontWeight: 900, background: '#ffffff', color: detail.colorText, padding: '1px 5px', borderRadius: 4, marginLeft: 2, border: `1px solid ${detail.border}` }}>
                    {detail.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Matrix Scroll Container (Hint added, Scrollbar made visible) */}
          <div
            className="matrix-scroll-container"
            style={{
              background: '#ffffff', borderRadius: 16, border: '1px solid #cbd5e1',
              overflowX: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              paddingBottom: 4,
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1400, tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                  <th style={{ padding: '16px 14px', fontSize: 13, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', width: '16%', textAlign: 'left', borderRight: '1px solid #cbd5e1' }}>
                    수익 모델
                  </th>
                  {SEGMENT_DETAILS.map((detail, i) => (
                    <th key={detail.name} style={{ padding: '12px 10px', fontSize: 14, fontWeight: 850, color: '#334155', textAlign: 'left', width: '12%', borderRight: i < 6 ? '1px solid #e2e8f0' : 'none' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ width: 3, height: 12, background: SEGMENT_COLORS[i], borderRadius: 2, display: 'inline-block' }} />
                          <span style={{ fontWeight: 900, color: '#0f172a' }}>{detail.name}</span>
                          <span style={{ fontSize: 11, fontWeight: 900, background: detail.colorBg, color: detail.colorText, padding: '0.5px 3px', borderRadius: 3, border: `1px solid ${detail.border}` }}>
                            {detail.priority}
                          </span>
                        </div>
                        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, paddingLeft: 7 }}>
                          {detail.role}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBMs.map((bm) => {
                  const cfg = TIER_CONFIG[bm.tier];
                  const pStyle = getPriorityStyle(bm.priority);
                  const visualStatus = getBMVisualStatus(bm);

                  return (
                    <tr
                      key={bm.id}
                      className={`bm-row ${bm.tier}-row ${visualStatus}`}
                      style={{ borderBottom: '1px solid #cbd5e1' }}
                    >
                      {/* Left: BM info */}
                      <td
                        style={{
                          padding: '16px 14px',
                          borderRight: '1px solid #cbd5e1',
                          verticalAlign: 'middle',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <span style={{ fontSize: 14.5, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                            {bm.name}
                          </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            <span
                              style={{
                                display: 'inline-flex', alignItems: 'center',
                                fontSize: 11, fontWeight: 700, color: pStyle.color,
                                background: pStyle.bg, border: `1px solid ${pStyle.border}`,
                                padding: '1px 5px', borderRadius: 4,
                              }}
                            >
                              {pStyle.label}
                            </span>
                            <span
                              style={{
                                display: 'inline-flex', alignItems: 'center',
                                fontSize: 11, fontWeight: 700, color: cfg.color,
                                background: cfg.badgeBg, border: `1px solid ${cfg.border}`,
                                padding: '1px 5px', borderRadius: 4,
                              }}
                            >
                              {cfg.label}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 7 Segment Cells */}
                      {bm.cells.map((cell, segIdx) => {
                        const cellCompetitors = cell.competitors && cell.competitors.length > 0;
                        
                        // Handle column segment highlighting
                        const isSegSelected = selectedSegments.length > 0 && selectedSegments.includes(cell.segment);
                        const isHighlightedCell = (visualStatus === 'highlighted') &&
                          (selectedCompetitors.length === 0 || bm.competitorTags.some(c => selectedCompetitors.includes(c))) &&
                          (selectedSegments.length === 0 || isSegSelected);
                        
                        const isDimmedCell = visualStatus === 'dimmed' || (selectedSegments.length > 0 && !isSegSelected);

                        return (
                          <td
                            key={segIdx}
                            style={{
                              padding: '8px',
                              borderRight: segIdx < 6 ? '1px solid #e2e8f0' : 'none',
                              verticalAlign: 'top',
                            }}
                          >
                            <div
                              className={`matrix-cell cell-seg${segIdx} ${isDimmedCell ? 'dimmed' : ''} ${isHighlightedCell ? 'highlighted' : ''}`}
                              onClick={() => openDrawer(bm, segIdx)}
                              style={{ minHeight: 150, padding: 12 }}
                            >
                              <p style={{ margin: 0, fontSize: 12.5, color: '#475569', lineHeight: 1.55, fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {cell.description}
                              </p>
                              
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                                {cellCompetitors && (
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
                                    {cell.competitors.map((comp) => (
                                      <span key={comp} style={{ fontSize: 10.5, fontWeight: 700, color: '#4f46e5', background: '#f5f3ff', padding: '1px 5px', borderRadius: 3, border: '1px solid rgba(79,70,229,0.1)' }}>
                                        {comp}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #f1f5f9', paddingTop: 4 }}>
                                  <span style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8' }}>
                                    {cell.stage.split(' ')[0]}
                                  </span>
                                  <span style={{ fontSize: 11.5, fontWeight: 800, color: SEGMENT_COLORS[segIdx] }}>
                                    자세히 →
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
            ← 좌우로 스크롤하여 7대 고객군별 비즈니스 모델(BM) 매트릭스를 확인해 보세요 →
          </div>
        </section>

        {/* ── Mobile Tab Card Matrix Section (max-width: 1023px) ── */}
        <section className="mobile-matrix" style={{ marginBottom: 44, display: 'none' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#64748b', marginBottom: 10 }}>
            📱 모바일 고객군별 카드 탭 뷰
          </div>
          
          {/* Segment tabs selector */}
          <div style={{ display: 'flex', overflowX: 'auto', gap: 6, paddingBottom: 10, marginBottom: 14 }}>
            {SEGMENT_DETAILS.map((detail, i) => {
              const isSelected = selectedMobileSegmentIdx === i;
              return (
                <button
                  key={detail.name}
                  onClick={() => setSelectedMobileSegmentIdx(i)}
                  style={{
                    padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 800,
                    cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
                    background: isSelected ? SEGMENT_COLORS[i] : '#ffffff',
                    color: isSelected ? '#ffffff' : '#64748b',
                    border: `1px solid ${isSelected ? 'transparent' : '#cbd5e1'}`,
                    boxShadow: isSelected ? '0 3px 8px rgba(0,0,0,0.05)' : 'none',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <span>{detail.name}</span>
                  <span style={{ fontSize: 11, opacity: 0.8, fontWeight: 600 }}>({detail.role})</span>
                  <span style={{ fontSize: 10.5, background: isSelected ? '#ffffff' : detail.colorBg, color: isSelected ? SEGMENT_COLORS[i] : detail.colorText, padding: '1px 4px', borderRadius: 4 }}>
                    {detail.priority}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Cards for active segment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredBMs.map((bm) => {
              const cell = bm.cells[selectedMobileSegmentIdx];
              const pStyle = getPriorityStyle(bm.priority);
              const visualStatus = getBMVisualStatus(bm);
              
              if (visualStatus === 'dimmed') return null;

              return (
                <div
                  key={bm.id}
                  onClick={() => openDrawer(bm, selectedMobileSegmentIdx)}
                  style={{
                    background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 14,
                    padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10,
                    cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: visualStatus === 'highlighted' ? '0 4px 12px rgba(79,70,229,0.06)' : 'none',
                    borderLeft: `4px solid ${SEGMENT_COLORS[selectedMobileSegmentIdx]}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 900, color: '#0f172a' }}>
                      {bm.name}
                    </h3>
                    <span style={{ fontSize: 11, fontWeight: 800, color: pStyle.color, background: pStyle.bg, padding: '2px 6px', borderRadius: 4 }}>
                      {pStyle.label}
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.55, fontWeight: 500 }}>
                    {cell.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                    {cell.competitors && cell.competitors.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>비교:</span>
                        {cell.competitors.map((comp) => (
                          <span key={comp} style={{ fontSize: 11, fontWeight: 700, color: '#4f46e5', background: '#f5f3ff', padding: '1px 5px', borderRadius: 4 }}>
                            {comp}
                          </span>
                        ))}
                      </div>
                    )}
                    <span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 700, color: '#64748b' }}>
                      적용: {cell.stage}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 9. 경쟁사 상세 분석 섹션 (10개 경쟁사 카드 완비) ── */}
        <section id="competitors-analysis" style={{ marginTop: 20 }}>
          <div style={{ borderBottom: '2px solid #cbd5e1', paddingBottom: 10, marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
              📊 경쟁사 벤치마크 및 MONO 대응 전략 분석
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b', fontWeight: 500 }}>
              기존 성공 업체의 비즈니스 모델을 파악하고 MONO가 적용할 전략과 피해야 할 금기 전략을 매핑합니다.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: 14 }}>
            {COMPETITORS_ANALYSIS.map((comp) => (
              <div
                key={comp.name}
                style={{
                  background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 14,
                  padding: '20px', display: 'flex', flexDirection: 'column', gap: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: '#0f172a' }}>
                    {comp.name}
                  </h3>
                  <span style={{ fontSize: 11.5, fontWeight: 800, color: '#4f46e5', background: '#f5f3ff', padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(79,70,229,0.15)' }}>
                    {comp.type}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>핵심 BM</div>
                    <div style={{ fontSize: 13, fontWeight: 650, color: '#334155' }}>{comp.strategy}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>주요 고객</div>
                    <div style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>{comp.successPoint}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#0d9488', display: 'flex', alignItems: 'center', gap: 4 }}>
                      ✓ 성공 포인트
                    </span>
                    <p style={{ margin: '3px 0 0', fontSize: 13, color: '#475569', lineHeight: 1.5, wordBreak: 'keep-all' }}>
                      {comp.successPoint}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#ea580c', display: 'flex', alignItems: 'center', gap: 4 }}>
                      ⚠ 한계점
                    </span>
                    <p style={{ margin: '3px 0 0', fontSize: 13, color: '#64748b', lineHeight: 1.5, wordBreak: 'keep-all' }}>
                      {comp.limitation}
                    </p>
                  </div>
                  <div style={{ background: '#faf9ff', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(79,70,229,0.15)', marginTop: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#4f46e5', display: 'flex', alignItems: 'center', gap: 4 }}>
                      ⚡ MONO가 가져갈 전략
                    </span>
                    <p style={{ margin: '3px 0 0', fontSize: 13, color: '#312e81', lineHeight: 1.5, fontWeight: 600, wordBreak: 'keep-all' }}>
                      {comp.monoResponse}
                    </p>
                  </div>
                  <div style={{ background: '#fffbeb', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(217,119,6,0.15)' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#b45309', display: 'flex', alignItems: 'center', gap: 4 }}>
                      🛑 MONO가 피해야 할 전략
                    </span>
                    <p style={{ margin: '3px 0 0', fontSize: 13, color: '#78350f', lineHeight: 1.5, fontWeight: 600, wordBreak: 'keep-all' }}>
                      {comp.monoAvoid}
                    </p>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginTop: 4 }}>
                    🔗 연결 가능한 MONO 수익모델: <span style={{ color: '#0f172a' }}>{comp.linkableBMs.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Drawer Overlay ── */}
      {drawerOpen && (
        <div className="drawer-overlay" onClick={closeDrawer} />
      )}

      {/* ── Detail Drawer ── */}
      <div className={`drawer-panel ${drawerOpen ? 'open' : 'closed'}`}>
        {selectedBM && (
          <div className="animate-slide" style={{ padding: '0 0 40px' }}>
            {/* Drawer Header */}
            <div
              style={{
                padding: '24px 24px 16px',
                borderBottom: '1px solid #e2e8f0',
                background: '#ffffff',
                position: 'sticky', top: 0, zIndex: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <span
                      style={{
                        fontSize: 11, fontWeight: 800,
                        color: TIER_CONFIG[selectedBM.tier].color,
                        background: TIER_CONFIG[selectedBM.tier].badgeBg,
                        border: `1px solid ${TIER_CONFIG[selectedBM.tier].border}`,
                        padding: '2px 8px', borderRadius: 5,
                      }}
                    >
                      {TIER_CONFIG[selectedBM.tier].label}
                    </span>
                    <span
                      style={{
                        fontSize: 11, fontWeight: 800,
                        color: getPriorityStyle(selectedBM.priority).color,
                        background: getPriorityStyle(selectedBM.priority).bg,
                        border: `1px solid ${getPriorityStyle(selectedBM.priority).border}`,
                        padding: '2px 8px', borderRadius: 5,
                      }}
                    >
                      우선순위: {selectedBM.priority}
                    </span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    {selectedBM.name}
                  </h2>
                </div>
                <button
                  onClick={closeDrawer}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)',
                    color: '#475569', cursor: 'pointer',
                    fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 300,
                  }}
                >
                  ×
                </button>
              </div>

              {/* Segment tabs (7 segments) */}
              <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 6 }}>
                {SEGMENT_DETAILS.map((detail, i) => (
                  <button
                    key={detail.name}
                    className={`seg-tab ${selectedSegmentIdx === i ? 'active' : ''}`}
                    onClick={() => setSelectedSegmentIdx(i)}
                    style={{
                      background: selectedSegmentIdx === i ? SEGMENT_COLORS[i] : '#ffffff',
                      borderColor: selectedSegmentIdx === i ? 'transparent' : '#cbd5e1',
                      color: selectedSegmentIdx === i ? '#ffffff' : '#64748b',
                      fontSize: 12.5,
                      padding: '6px 10px',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>{detail.name}</span>
                    <span style={{ fontSize: 10.5, opacity: 0.8 }}>({detail.role})</span>
                    <span style={{ fontSize: 9.5, background: selectedSegmentIdx === i ? '#ffffff' : detail.colorBg, color: selectedSegmentIdx === i ? SEGMENT_COLORS[i] : detail.colorText, padding: '1px 4px', borderRadius: 4 }}>
                      {detail.priority}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Drawer Body (12 Fixed structure keys) */}
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              {/* 1. 수익모델명 */}
              <div className="detail-card" style={{ background: '#faf9ff', border: '1px solid #dee2e6' }}>
                <div className="detail-label" style={{ color: '#4f46e5' }}>수익모델명</div>
                <div style={{ fontSize: 17, fontWeight: 900, color: '#0f172a' }}>{selectedBM.name}</div>
              </div>

              {/* 2. 우선순위 */}
              <div className="detail-card">
                <div className="detail-label">우선순위 등급</div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: '#334155' }}>
                  {selectedBM.priority} ({selectedBM.priority === 'P0' ? '즉시 검증 핵심' : selectedBM.priority === 'P1' ? '확장 검증' : '장기 검증'})
                </div>
              </div>

              {/* 3. 대상 고객군 */}
              <div className="detail-card">
                <div className="detail-label">대상 고객군</div>
                <div style={{ fontSize: 14.5, fontWeight: 750, color: '#0f172a' }}>
                  {selectedBM.cells.map(c => c.segment).join(', ')}
                </div>
              </div>

              {/* 4. 해당 경쟁사 */}
              <div className="detail-card">
                <div className="detail-label">해당 경쟁사</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  {selectedBM.competitorTags.length > 0 ? (
                    selectedBM.competitorTags.map(tag => (
                      <span key={tag} style={{ fontSize: 12, fontWeight: 800, color: '#4f46e5', background: '#f5f3ff', padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(79,70,229,0.15)' }}>
                        {tag.toUpperCase()}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: 13, color: '#64748b' }}>경쟁 관계 없음 (MONO 독자 모델)</span>
                  )}
                </div>
              </div>

              {/* 5. 경쟁사 성공 포인트 & 6. 경쟁사 한계 */}
              {selectedBM.competitorDetails && selectedBM.competitorDetails.length > 0 && (
                <div className="detail-card" style={{ background: '#fffcfb' }}>
                  <div className="detail-label" style={{ color: '#b45309' }}>경쟁사 성공 포인트 & 한계</div>
                  {selectedBM.competitorDetails.map((comp, idx) => (
                    <div key={comp.name} style={{ borderBottom: idx < selectedBM.competitorDetails.length - 1 ? '1px solid #f1f5f9' : 'none', paddingBottom: 10, marginBottom: idx < selectedBM.competitorDetails.length - 1 ? 10 : 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a' }}>{comp.name}</div>
                      <div style={{ fontSize: 13, color: '#0d9488', marginTop: 3 }}>
                        <strong>성공 포인트:</strong> {comp.successPoint}
                      </div>
                      <div style={{ fontSize: 13, color: '#ea580c', marginTop: 3 }}>
                        <strong>한계:</strong> {comp.limitation}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 7. MONO 적용 전략 */}
              <div className="detail-card" style={{ borderLeft: '4px solid #4f46e5' }}>
                <div className="detail-label" style={{ color: '#4f46e5' }}>MONO 적용 전략</div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                  GTM: {selectedBM.gtm}
                </div>
                <p style={{ margin: 0, fontSize: 13.5, color: '#475569', lineHeight: 1.55 }}>
                  <strong>세그먼트 전략:</strong> {selectedBM.cells[selectedSegmentIdx].monoStrategy}
                </p>
              </div>

              {/* 8. 락인 장치 */}
              <div className="detail-card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div className="detail-label" style={{ color: '#166534' }}>🔒 MONO 락인 장치 (Lock-In Device)</div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 14, color: '#1e3f20', fontWeight: 600 }}>
                  {selectedBM.lockIn.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: 2 }}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* 9. 초기 검증 방법 */}
              <div className="detail-card" style={{ background: '#fcfdfd', border: '1px solid #e0f2fe' }}>
                <div className="detail-label" style={{ color: '#0369a1' }}>🧪 초기 검증 방법</div>
                <div className="detail-value">{selectedBM.mvpValidation}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0369a1', marginTop: 6 }}>
                  가정 단가: {selectedBM.pricingAssumption}
                </div>
              </div>

              {/* 10. 핵심 지표 */}
              <div className="detail-card">
                <div className="detail-label">📈 핵심 성과 측정 지표</div>
                <div className="detail-value">{selectedBM.keyMetrics.join(', ')}</div>
              </div>

              {/* 11. 법률·운영 리스크 */}
              <div className="detail-card" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                <div className="detail-label" style={{ color: '#b45309' }}>🛑 법률 · 운영 리스크</div>
                <div className="detail-value" style={{ color: '#78350f', fontWeight: 600 }}>{selectedBM.risks.join(', ')}</div>
              </div>

              {/* 12. 다음 개발 액션 */}
              <div className="detail-card" style={{ background: '#fafaf9', border: '1px solid #d6d3d1' }}>
                <div className="detail-label" style={{ color: '#44403c' }}>▶ 다음 개발 액션 (Next Action)</div>
                <div className="detail-value" style={{ color: '#1c1917', fontWeight: 700 }}>{selectedBM.nextAction}</div>
              </div>

              {/* All Segments Summary */}
              <div style={{ marginTop: 24 }}>
                <div className="detail-label" style={{ marginBottom: 10 }}>🗂 전체 고객군 요구사항 요약</div>
                {SEGMENT_DETAILS.map((detail, i) => (
                  <div
                    key={detail.name}
                    onClick={() => setSelectedSegmentIdx(i)}
                    style={{
                      background: selectedSegmentIdx === i ? `${SEGMENT_COLORS[i]}08` : '#ffffff',
                      border: `1px solid ${selectedSegmentIdx === i ? SEGMENT_COLORS[i] : '#e2e8f0'}`,
                      borderRadius: 10, padding: '14px 16px', marginBottom: 8, cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: SEGMENT_COLORS[i] }}>
                        {detail.name} <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>({detail.role})</span>
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 900, background: detail.colorBg, color: detail.colorText, padding: '1px 5px', borderRadius: 4, border: `1px solid ${detail.border}` }}>
                        {detail.priority}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.55, fontWeight: 500 }}>
                      {selectedBM.cells[i].description}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Design Configuration constants
// ─────────────────────────────────────────────
const TIER_CONFIG = {
  core: {
    label: '1차 핵심 BM',
    sublabel: '즉시 검증 대상',
    color: '#0d9488',
    bg: 'rgba(13, 148, 136, 0.04)',
    border: 'rgba(13, 148, 136, 0.2)',
    badge: '#0f766e',
    badgeBg: 'rgba(13, 148, 136, 0.08)',
    glow: '0 0 16px rgba(13, 148, 136, 0.1)',
    icon: '🎯',
  },
  expansion: {
    label: '확장 BM',
    sublabel: 'Scale 단계 검증',
    color: '#4f46e5',
    bg: 'rgba(79, 70, 229, 0.04)',
    border: 'rgba(79, 70, 229, 0.2)',
    badge: '#3730a3',
    badgeBg: 'rgba(79, 70, 229, 0.08)',
    glow: '0 0 16px rgba(79, 70, 229, 0.1)',
    icon: '📈',
  },
  longterm: {
    label: '장기 확장 BM',
    sublabel: 'Ecosystem 단계',
    color: '#475569',
    bg: 'rgba(71, 85, 105, 0.04)',
    border: 'rgba(71, 85, 105, 0.18)',
    badge: '#1e293b',
    badgeBg: 'rgba(71, 85, 105, 0.08)',
    glow: 'none',
    icon: '🔭',
  },
};

const SEGMENT_COLORS = [
  '#0284c7', // Sky (기술자)
  '#4f46e5', // Indigo (현장 리더)
  '#0d9488', // Teal (수행 기업)
  '#0891b2', // Cyan (협력사)
  '#2563eb', // Blue (원청)
  '#7c3aed', // Violet (대기업)
  '#db2777'  // Pink (정부·지자체)
];

const SEGMENTS = ['기술자', '현장 리더', '수행 기업', '협력사', '원청', '대기업', '정부·지자체'] as const;

interface SegmentDetail {
  name: typeof SEGMENTS[number];
  role: string;
  priority: 'P0' | 'P1' | 'P2';
  colorBg: string;
  colorText: string;
  border: string;
}

const SEGMENT_DETAILS: SegmentDetail[] = [
  { name: '기술자', role: '사용자', priority: 'P0', colorBg: '#f0f9ff', colorText: '#0284c7', border: 'rgba(2,132,199,0.2)' },
  { name: '현장 리더', role: '공급망', priority: 'P0', colorBg: '#faf5ff', colorText: '#4f46e5', border: 'rgba(79,70,229,0.2)' },
  { name: '수행 기업', role: '초기 결제 고객', priority: 'P0', colorBg: '#f0fdfa', colorText: '#0d9488', border: 'rgba(13,148,136,0.2)' },
  { name: '협력사', role: '반복 운영 고객', priority: 'P1', colorBg: '#ecfeff', colorText: '#0891b2', border: 'rgba(8,145,178,0.2)' },
  { name: '원청', role: '표준화 고객', priority: 'P1', colorBg: '#eff6ff', colorText: '#2563eb', border: 'rgba(37,99,235,0.2)' },
  { name: '대기업', role: '전략 투자·상생 고객', priority: 'P2', colorBg: '#faf5ff', colorText: '#7c3aed', border: 'rgba(124,58,237,0.2)' },
  { name: '정부·지자체', role: '정책·지역 확장 고객', priority: 'P2', colorBg: '#fdf2f8', colorText: '#db2777', border: 'rgba(219,39,119,0.2)' }
];
