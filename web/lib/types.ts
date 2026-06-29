// 사용자 앱 MVP 도메인 타입.
// prisma/schema.prisma 의 모델과 1:1로 매핑됩니다(추후 서버액션 교체 시 그대로 사용).

export interface User {
  id: string;
  phone?: string | null;
  email?: string | null;
  name?: string | null;
  role?: "WORKER" | "FIELD_LEADER" | "CUSTOMER" | "PROJECT_OPERATOR" | "PERFORMER_COMPANY" | null; // 캐노니컬 5유형
  jobType?: string[] | null; // 직군(복수 — 1개 이상)
  careerYears?: string | null; // 경력 연차(라벨)
  region?: string[] | null; // 희망 지역(복수 — 1개 이상)
  industries?: string[] | null; // 온보딩 산업유형(IndustryType[]) — 캐노니컬 §0-3
  residency?: "DOMESTIC" | "OVERSEAS" | null; // 내국인/외국인(온보딩) — WorkerProfile.residency
  createdAt: string;
}

// 현장작업요청 (CUSTOMER/OPERATOR 발신) — 서버 WorkRequest 1:1. (dev-plan §3-2(7))
export interface WorkRequest {
  id: string;
  industry: string;
  workTypes?: string[] | null;
  region?: string[] | null;
  budgetMemo?: string | null;
  schedule?: string | null;
  scaleMemo?: string | null;
  jobTypes?: string[] | null;
  headcount?: number | null;
  requiredCerts?: string[] | null;
  safetyConds?: string | null;
  equipMaterial?: string | null;
  contractType?: string | null;
  status: string;
  createdAt: string;
}

// 작업요청 후보지정 — 서버 WorkRequestCandidate. (dev-plan §3-2(8))
export interface WorkRequestCandidate {
  id: string;
  workRequestId: string;
  candidateType: "PERFORMER_COMPANY" | "FIELD_LEADER" | "TEAM";
  candidateId: string;
  status: "RECOMMENDED" | "SHORTLISTED" | "CONTACTED" | "REJECTED" | "SELECTED";
  score?: number | null;
  memo?: string | null; // 후보 표시명 스냅샷(지정 시점 이름)
  createdAt: string;
}

// 자동 후보추천 항목 — 서버 GET /work-requests/:id/recommendations. (dev-plan §4-2)
export interface Recommendation {
  candidateType: "PERFORMER_COMPANY" | "FIELD_LEADER" | "TEAM";
  candidateId: string;
  name: string;
  score: number;
  reasons: string[];
}

// 수행기업 디렉터리 항목 — 서버 GET /performers. (dev-plan §4-4)
export interface Performer {
  id: string;
  name: string;
  industry?: string | null;
  industries?: string[] | null;
  region?: string[] | null;
  safetyRate?: number | null;
  rehireRate?: number | null;
  createdAt: string;
  _count?: { workRecords: number };
}

// 팀 디렉터리 항목 — 서버 GET /teams. (dev-plan §4-3)
export interface TeamDir {
  id: string;
  name: string;
  leaderId: string;
  industries?: string[] | null;
  workTypes?: string[] | null;
  regions?: string[] | null;
  safetyRate?: number | null;
  equipOperators?: number | null;
  leader?: { id: string; name?: string | null } | null;
  _count?: { members: number };
}

// 운영자 프로필 — 서버 ProjectOperator. (dev-plan §3-2(5))
export interface OperatorProfile {
  companyId?: string | null;
  industries?: string[];
  regions?: string[];
  similarExperience?: string[];
  leaderPoolIds?: string[];
  budgetRangeMemo?: string | null;
}

// 작업수행사례 — 서버 WorkRecord. (dev-plan §3-2(6))
export interface WorkRecord {
  id: string;
  industry: string;
  title: string;
  siteName?: string | null;
  workTypes?: string[] | null;
  period?: string | null;
  scaleMemo?: string | null;
  description?: string | null;
  createdAt: string;
}

// 수행기업 공개 프로필 — 서버 GET /companies/:id/profile. (dev-plan §4-4)
export interface CompanyProfile {
  company: {
    id: string;
    name: string;
    companyKind?: string;
    industry?: string | null;
    industries?: string[] | null;
    region?: string[] | null;
    safetyRate?: number | null;
    rehireRate?: number | null;
    defectMemo?: string | null;
    status?: string;
    _count?: { workRecords: number; jobPosts: number };
  };
  workRecords: WorkRecord[];
}

// 현장리더 프로필 — 서버 FieldLeaderProfile. (dev-plan §3-2(3))
export interface FieldLeaderProfile {
  primaryJobTypes?: string[];
  manageableTeamSize?: number | null;
  mainWorkFields?: string[];
  industries?: string[];
  regions?: string[];
  partnerCompanyIds?: string[];
  contactHours?: string | null;
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

// ════════════════════════════════════════════════════════════════════
// 외국인 기술인력 관리 — dev-plan-foreign-workforce.md
// ════════════════════════════════════════════════════════════════════

export interface VisaStatus {
  id: string;
  visaType: string;
  expiryDate?: string | null;
  renewalDueDate?: string | null;
  workScope?: string | null;
  workplaceChangeable: boolean;
  arcNumber?: string | null;
  status: string;
  createdAt: string;
}

export interface DocumentRecord {
  id: string;
  kind: string;
  fileUrl: string;
  status: string;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
}

export interface TrainingRecord {
  id: string;
  kind: string; // SAFETY | JOB | KOREAN
  title: string;
  provider?: string | null;
  completedAt?: string | null;
  certUrl?: string | null;
}

export interface GlossaryTranslation {
  id: string;
  lang: string;
  text: string;
}

export interface GlossaryTerm {
  id: string;
  koTerm: string;
  category: string;
  industry?: string | null;
  iconUrl?: string | null;
  isSafety: boolean;
  translations: GlossaryTranslation[];
}

export interface SettlementItem {
  id: string;
  kind: string;
  amount: number;
  note?: string | null;
}

export interface Settlement {
  id: string;
  workerId: string;
  companyId?: string | null;
  workRequestId?: string | null;
  period: string;
  status: string;
  items: SettlementItem[];
  createdAt: string;
}

export interface PartnerReferral {
  id: string;
  requesterId: string;
  kind: string;
  status: string;
  note?: string | null;
  createdAt: string;
}

export interface RiskReport {
  id: string;
  reporterId: string;
  subjectId?: string | null;
  kind: string;
  status: string;
  detail?: string | null;
  createdAt: string;
}

// 외국인 후보 검색 결과(요약)
export interface ForeignWorker {
  id: string;
  name: string;
  jobType: string[];
  careerYears?: string | null;
  region: string[];
  workerProfile?: {
    nationality?: string | null;
    residency?: string | null;
    languages: string[];
    koreanLevel?: string | null;
    interpreterNeeded: boolean;
    industries: string[];
  } | null;
  visaStatuses: { visaType: string; status: string; expiryDate?: string | null }[];
  _count?: { careerCards: number; certificates: number; trainingRecords: number };
}
