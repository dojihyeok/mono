// 사용자 앱 선택지·관심 기능 문구 단일 출처.
// 문구는 docs/user-app-guidelines.md(PDF #1 5-2) 그대로 — 내부 용어/Beta 금지.

import type { InterestFeatureKey } from "./types";

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

// 작업 분야 예시(경력 카드 보조 선택)
export const FIELDS = [
  "신축",
  "리모델링",
  "보수",
  "철거",
  "플랜트",
  "인테리어",
  "토목",
  "기타",
] as const;

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
