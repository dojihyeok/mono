// 사용자 앱 MVP 도메인 타입.
// prisma/schema.prisma 의 모델과 1:1로 매핑됩니다(추후 서버액션 교체 시 그대로 사용).

export interface User {
  id: string;
  phone?: string | null;
  email?: string | null;
  name?: string | null;
  jobType?: string[] | null; // 직군(복수 — 1개 이상)
  careerYears?: string | null; // 경력 연차(라벨)
  region?: string[] | null; // 희망 지역(복수 — 1개 이상)
  createdAt: string;
}

export interface CareerCard {
  id: string;
  siteName: string; // 현장명
  field?: string; // 작업 분야
  startDate?: string; // 근무 시작(YYYY-MM)
  endDate?: string; // 근무 종료(YYYY-MM)
  role?: string; // 역할
  equipment?: string; // 사용 장비
  coworkers?: string; // 함께 일한 사람
  memo?: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  name: string;
  licenseNo: string; // 발급번호(자격증 번호) — 필수
  issuer?: string;
  issuedAt?: string; // YYYY-MM
  createdAt: string;
}

export interface Education {
  id: string;
  title: string;
  institute?: string;
  completedAt?: string; // YYYY-MM
  createdAt: string;
}

// prisma enum InterestFeature 와 동일한 키.
export type InterestFeatureKey =
  | "CAREER_VERIFICATION"
  | "FINANCE_BENEFIT"
  | "EQUIPMENT_RENTAL"
  | "FOREIGN_WORKER"
  | "SAFE_PAYMENT"
  | "COMPANY_VIEW";

export interface InterestRegistration {
  id: string;
  feature: InterestFeatureKey;
  createdAt: string;
}

export interface ProfileState {
  user: User | null;
  careerCards: CareerCard[];
  certificates: Certificate[];
  educations: Education[];
  interests: InterestRegistration[];
  shareId: string | null;
}
