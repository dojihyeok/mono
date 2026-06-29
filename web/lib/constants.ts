// 사용자 앱 선택지·관심 기능 문구 단일 출처.
// 문구는 docs/user-app-guidelines.md(PDF #1 5-2) 그대로 — 내부 용어/Beta 금지.

import type { InterestFeatureKey } from "./types";
import type { AnalyticsEventName } from "./analytics";

export const JOB_TYPES = [
  "전기",
  "설비",
  "토목",
  "목공",
  "도장",
  "용접",
  "비계",
  "철근",
  "조적",
  "방수",
  "기타",
] as const;

export const CAREER_YEARS = [
  "1년 미만",
  "1~3년",
  "3~5년",
  "5~10년",
  "10년 이상",
] as const;

// 경력 라벨 → 서버 enum(CareerBand) 매핑. api(prisma/SQLAlchemy)의 CareerBand 와 1:1.
export const CAREER_BAND: Record<(typeof CAREER_YEARS)[number], string> = {
  "1년 미만": "UNDER_1Y",
  "1~3년": "Y1_3",
  "3~5년": "Y3_5",
  "5~10년": "Y5_10",
  "10년 이상": "OVER_10Y",
};

// 서버 enum(CareerBand) → 경력 라벨 역매핑. 공개 프로필 표시용.
export const CAREER_BAND_LABEL: Record<string, string> = {
  UNDER_1Y: "1년 미만",
  Y1_3: "1~3년",
  Y3_5: "3~5년",
  Y5_10: "5~10년",
  OVER_10Y: "10년 이상",
};

export const REGIONS = [
  "서울",
  "경기·인천",
  "충청",
  "전라",
  "경상",
  "강원",
  "제주",
] as const;

// 산업유형(IndustryType) — 11산업 전면 노출(P2). value = 서버 enum, label = 표시 문구.
// 앞 4값 = 초기 검증시장, 이후 = 확장시장(dev-plan §0-3·§5.2).
export const INDUSTRIES = [
  { value: "INTERIOR_REMODELING", label: "인테리어·리모델링" },
  { value: "CONSTRUCTION_FACILITY", label: "건설·설비" },
  { value: "SHIPBUILDING", label: "조선" },
  { value: "PLANT", label: "플랜트" },
  { value: "MANUFACTURING_FACILITY", label: "제조설비" },
  { value: "LOGISTICS_EQUIPMENT", label: "물류장비" },
  { value: "ENERGY_FACILITY", label: "에너지설비" },
  { value: "PORT_AIRPORT", label: "항만·공항" },
  { value: "PUBLIC_INFRA", label: "공공인프라" },
  { value: "DISASTER_RECOVERY", label: "재난복구" },
  { value: "SPACE_ROBOTICS", label: "우주·로봇" },
  { value: "ETC", label: "기타" },
] as const;

// Field Ops 관심 7종(FieldOpsFeature) — 기존 관심 6종(InterestFeature)과 별개 체계, 병존(dev-plan §5.8).
// key = 서버 FieldOpsFeature enum, event = 정본 이벤트명.
export interface FieldOpsFeatureDef {
  key: string;
  label: string;
  short: string;
  event: AnalyticsEventName;
}
export const FIELDOPS_FEATURES: FieldOpsFeatureDef[] = [
  { key: "EQUIPMENT_TOOL", label: "장비·공구 운영", short: "현장 장비·공구 대여와 관리", event: "equipment_tool_interest_clicked" },
  { key: "SMART_EQUIPMENT", label: "전문장비·스마트계측", short: "스마트 계측기 임대·캘리브레이션", event: "smart_equipment_interest_clicked" },
  { key: "MATERIAL_ORDER", label: "소모자재 반복발주", short: "현장 자재 정기 발주·배송", event: "material_order_interest_clicked" },
  { key: "PACKAGE", label: "장비+기술자 패키지", short: "장비와 인력을 함께", event: "package_interest_clicked" },
  { key: "MEAL_LODGING", label: "식사·숙소·근무환경", short: "현장 식사·숙소 제휴", event: "meal_lodging_interest_clicked" },
  { key: "EDUCATION", label: "교육 프로그램", short: "자격·안전 교육 연계", event: "education_interest_clicked" },
  { key: "INSURANCE", label: "보험·정비·보증", short: "현장 보험·정비·보증 연계", event: "insurance_interest_clicked" },
];

export interface InterestFeatureDef {
  key: InterestFeatureKey;
  label: string; // 카드 제목(사용자 표현)
  short: string; // 카드 한 줄 설명
  modalTitle: string;
  body: string[]; // 안내 모달 본문(2~3문장)
  cta: string; // 신청 버튼 라벨
  // per-feature 이벤트명 (PDF 6-2 관심 기능 이벤트)
  event:
    | "career_verification_interest_clicked"
    | "finance_benefit_interest_clicked"
    | "equipment_rental_interest_clicked"
    | "foreign_worker_management_interest_clicked"
    | "safe_payment_interest_clicked"
    | "company_view_interest_clicked";
}

// 6종 — prisma InterestFeature enum 과 1:1, 문구는 PDF 5-2.
export const INTEREST_FEATURES: InterestFeatureDef[] = [
  {
    key: "CAREER_VERIFICATION",
    label: "경력 인증",
    short: "더 신뢰도 높은 프로필 만들기",
    modalTitle: "경력 인증 신청",
    body: [
      "경력 인증 기능은 더 신뢰도 높은 프로필을 만들기 위한 기능입니다.",
      "현재 관심 신청을 받고 있으며, 신청해주신 분께 우선 안내드리겠습니다.",
    ],
    cta: "경력 인증 신청하기",
    event: "career_verification_interest_clicked",
  },
  {
    key: "FINANCE_BENEFIT",
    label: "금융 혜택",
    short: "근무이력 기반 금융 혜택",
    modalTitle: "금융 혜택 관심 등록",
    body: [
      "근무이력과 경력 데이터를 바탕으로 받을 수 있는 금융 혜택을 준비하고 있습니다.",
      "관심 등록을 남겨주시면 제휴 서비스가 열릴 때 먼저 안내드리겠습니다.",
    ],
    cta: "금융 혜택 관심 등록",
    event: "finance_benefit_interest_clicked",
  },
  {
    key: "EQUIPMENT_RENTAL",
    label: "공구·장비 대여",
    short: "필요한 장비를 필요한 시점에",
    modalTitle: "공구·장비 대여 관심 등록",
    body: [
      "필요한 공구와 장비를 필요한 시점에 사용할 수 있도록 준비하고 있습니다.",
      "관심 장비를 선택해주시면 수요가 많은 장비부터 우선 연결하겠습니다.",
    ],
    cta: "공구·장비 대여 관심 등록",
    event: "equipment_rental_interest_clicked",
  },
  {
    key: "FOREIGN_WORKER",
    label: "체류·고용 관리",
    short: "외국인 기술인력 관리",
    modalTitle: "외국인 체류·고용 관리 관심 등록",
    body: [
      "체류, 고용 가능 기간, 안전교육, 현장 이력을 함께 관리할 수 있는 기능을 준비하고 있습니다.",
      "관심 등록을 남겨주시면 시범 운영 소식을 먼저 안내드리겠습니다.",
    ],
    cta: "체류·고용 관리 관심 등록",
    event: "foreign_worker_management_interest_clicked",
  },
  {
    key: "SAFE_PAYMENT",
    label: "안심 정산",
    short: "안전하게 받는 정산",
    modalTitle: "안심 정산 관심 등록",
    body: [
      "일한 만큼 안전하게 정산받을 수 있는 구조를 준비하고 있습니다.",
      "관심 등록을 남겨주시면 서비스가 열릴 때 먼저 안내드리겠습니다.",
    ],
    cta: "안심 정산 관심 등록",
    event: "safe_payment_interest_clicked",
  },
  {
    key: "COMPANY_VIEW",
    label: "기업에게 보여줄 프로필",
    short: "기업이 내 프로필을 찾도록",
    modalTitle: "기업 열람권 관심 등록",
    body: [
      "내 경력 프로필을 기업이 열람하고 먼저 연락할 수 있는 기능을 준비하고 있습니다.",
      "관심 등록을 남겨주시면 기업 연결이 열릴 때 먼저 안내드리겠습니다.",
    ],
    cta: "기업 열람권 관심 등록",
    event: "company_view_interest_clicked",
  },
];

// ════════════════════════════════════════════════════════════════════
// 외국인 기술인력 관리 — dev-plan-foreign-workforce.md
// value = 서버 enum, label = 표시 문구. 노출 제어는 프론트.
// ════════════════════════════════════════════════════════════════════

// 지원 언어 (SupportedLang, PDF §8-1)
export const LANGUAGES = [
  { value: "KO", label: "한국어", native: "한국어" },
  { value: "EN", label: "영어", native: "English" },
  { value: "VI", label: "베트남어", native: "Tiếng Việt" },
  { value: "TH", label: "태국어", native: "ไทย" },
  { value: "ID", label: "인도네시아어", native: "Bahasa Indonesia" },
  { value: "UZ", label: "우즈베크어", native: "Oʻzbekcha" },
] as const;

// 외국인 기술인력 국적 — 자유 입력 방지(고정 드롭다운). E-9 고용허가제 MOU 16개국 + E-7·동포 상용.
// 가나다순 정렬, '기타'만 맨 끝.
export const NATIONALITIES = [
  "네팔",
  "동티모르",
  "라오스",
  "러시아",
  "몽골",
  "미얀마",
  "방글라데시",
  "베트남",
  "스리랑카",
  "우즈베키스탄",
  "인도",
  "인도네시아",
  "중국",
  "카자흐스탄",
  "캄보디아",
  "키르기스스탄",
  "태국",
  "파키스탄",
  "필리핀",
  "기타",
] as const;

// 체류자격 (VisaType, PDF §6-2) — E-9/E-7/H-2 등
export const VISA_TYPES = [
  { value: "E9", label: "E-9 (비전문취업)" },
  { value: "E7", label: "E-7 (특정활동)" },
  { value: "E74", label: "E-7-4 (숙련기능인력)" },
  { value: "H2", label: "H-2 (방문취업)" },
  { value: "D2", label: "D-2 (유학)" },
  { value: "D4", label: "D-4 (일반연수)" },
  { value: "F2", label: "F-2 (거주)" },
  { value: "F4", label: "F-4 (재외동포)" },
  { value: "F5", label: "F-5 (영주)" },
  { value: "F6", label: "F-6 (결혼이민)" },
  { value: "ETC", label: "기타" },
] as const;

// 한국어 수준 (KoreanLevel, PDF §5-1)
export const KOREAN_LEVELS = [
  { value: "NONE", label: "전혀 못함" },
  { value: "BASIC", label: "기초 (인사·간단 지시)" },
  { value: "INTERMEDIATE", label: "중급 (작업 지시 이해)" },
  { value: "FLUENT", label: "능숙 (현장 소통 원활)" },
  { value: "NATIVE", label: "원어민 수준" },
] as const;

// 서류 종류 (DocumentKind, PDF §6-3)
export const DOCUMENT_KINDS = [
  { value: "PASSPORT", label: "여권" },
  { value: "ARC", label: "외국인등록증" },
  { value: "VISA", label: "비자" },
  { value: "CONTRACT", label: "근로계약서" },
  { value: "TRAINING_CERT", label: "교육 이수증" },
  { value: "OTHER", label: "기타" },
] as const;

// 비자·서류 상태 (VisaDocStatus)
export const VISA_DOC_STATUS_LABEL: Record<string, string> = {
  PENDING: "준비 중",
  SUBMITTED: "제출됨",
  VERIFIED: "검토 완료",
  EXPIRED: "만료",
  REJECTED: "반려",
};

// 현장 용어 카테고리 (PDF §4-2) — 외부명 "현장 용어", 내부 태그만 노가다 용어
export const GLOSSARY_CATEGORIES = [
  { value: "WORK_ORDER", label: "작업 지시" },
  { value: "SAFETY", label: "안전 문구" },
  { value: "EQUIPMENT", label: "장비·공구" },
  { value: "MATERIAL", label: "자재" },
] as const;

// 정산 항목 (SettlementItemKind, PDF §7-2)
export const SETTLEMENT_ITEM_KINDS = [
  { value: "BASE_WAGE", label: "기본 임금" },
  { value: "OVERTIME", label: "연장·야간·휴일" },
  { value: "ALLOWANCE", label: "수당 (위험·숙련)" },
  { value: "MEAL", label: "식사" },
  { value: "LODGING", label: "숙소" },
  { value: "TRANSPORT", label: "교통" },
  { value: "EDUCATION", label: "교육비" },
  { value: "INSURANCE", label: "보험·보증" },
  { value: "REMITTANCE", label: "해외 송금" },
] as const;

export const SETTLEMENT_STATUS_LABEL: Record<string, string> = {
  DRAFT: "작성 중",
  CONFIRMED: "확정",
  PAID: "지급 완료",
  DISPUTED: "분쟁",
};

// 교육 종류 (TrainingKind, PDF §6-2)
export const TRAINING_KINDS = [
  { value: "SAFETY", label: "안전교육" },
  { value: "JOB", label: "직무교육" },
  { value: "KOREAN", label: "한국어교육" },
] as const;

// 리스크 신고 종류 (RiskReportKind, PDF §8-4)
export const RISK_REPORT_KINDS = [
  { value: "WAGE_UNPAID", label: "임금 체불" },
  { value: "SAFETY_ACCIDENT", label: "산업재해·안전사고" },
  { value: "LANGUAGE_HAZARD", label: "언어 오해로 인한 작업 위험" },
  { value: "ABUSE", label: "악성 사용자 신고" },
] as const;

// 행정·노무 파트너 연계 종류 (PartnerReferralKind, PDF §2·§6)
export const PARTNER_REFERRAL_KINDS = [
  { value: "VISA", label: "비자·체류 행정" },
  { value: "LABOR", label: "노무·근로계약" },
  { value: "SETTLEMENT", label: "정산·세무" },
  { value: "EDUCATION", label: "교육 연계" },
  { value: "INSURANCE", label: "보험 연계" },
] as const;
