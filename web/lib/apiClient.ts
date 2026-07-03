"use client";

// 브라우저 → Next BFF(/api/*) → NestJS api. 모두 best-effort(실패해도 UI 안 막음).
import { CAREER_BAND } from "./constants";
import { loadState } from "./store";
import type {
  WorkRequest,
  FieldLeaderProfile,
  WorkRequestCandidate,
  Performer,
  TeamDir,
  OperatorProfile,
  WorkRecord,
  CompanyProfile,
  Recommendation,
  VisaStatus,
  DocumentRecord,
  TrainingRecord,
  GlossaryTerm,
  Settlement,
  PartnerReferral,
  RiskReport,
  ForeignWorker,
  EquipmentHistory,
  AiLeaderInterest,
  TrustScore,
  Notification,
  JobPost,
  JobApplication,
  Assignment,
  AttendanceRec
} from "./types";

const SERVER_ID_KEY = "mono.serverId";

export function getServerId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SERVER_ID_KEY);
  } catch {
    return null;
  }
}

function setServerId(id: string): void {
  try {
    window.localStorage.setItem(SERVER_ID_KEY, id);
  } catch {
    // 무시
  }
}

export function clearServerId(): void {
  try {
    window.localStorage.removeItem(SERVER_ID_KEY);
  } catch {
    // 무시
  }
}

// 가입 → 서버 User 생성 후 serverId 저장(이후 호출 연결용).
export async function apiSignup(data: {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
}): Promise<string | null> {
  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: data.name ?? undefined,
        phone: data.phone ?? undefined,
        email: data.email ?? undefined,
      }),
    });
    if (!res.ok) return null;
    const u = await res.json();
    if (u?.id) {
      setServerId(u.id);
      return u.id as string;
    }
  } catch {
    // best-effort
  }
  return null;
}

// ── EquipmentHistory (장비 이력) ──
export async function apiAddEquipmentHistory(
  userId: string,
  data: {
    equipmentName: string;
    spec?: string;
    experienceMonths?: number;
    description?: string;
  }
): Promise<EquipmentHistory | null> {
  const sid = await ensureServerId();
  if (!sid) return null;
  try {
    const res = await fetch(`/api/users/${userId}/equipment-history`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return (await res.json()) as EquipmentHistory;
  } catch {
    return null;
  }
}

export async function apiListEquipmentHistory(
  userId: string
): Promise<EquipmentHistory[]> {
  try {
    const res = await fetch(`/api/users/${userId}/equipment-history`);
    if (!res.ok) return [];
    return (await res.json()) as EquipmentHistory[];
  } catch {
    return [];
  }
}

export async function apiDeleteEquipmentHistory(
  userId: string,
  eid: string
): Promise<boolean> {
  try {
    const res = await fetch(`/api/users/${userId}/equipment-history/${eid}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ── AiLeaderInterest (AI 현장리더 관심 등록) ──
export async function apiCreateAiLeaderInterest(data: {
  userId?: string;
  name?: string;
  phone?: string;
  region?: string;
  jobType?: string;
}): Promise<AiLeaderInterest | null> {
  try {
    const res = await fetch(`/api/field-ops/ai-leader-interest`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return (await res.json()) as AiLeaderInterest;
  } catch {
    return null;
  }
}

export async function apiListAiLeaderInterests(limit = 50): Promise<AiLeaderInterest[]> {
  try {
    const res = await fetch(`/api/field-ops/ai-leader-interest?limit=${limit}`);
    if (!res.ok) return [];
    return (await res.json()) as AiLeaderInterest[];
  } catch {
    return [];
  }
}


// 서버 계정(serverId) 보장 — 없으면 저장된 프로필의 이름/연락처로 즉석 멱등 가입.
// 모든 프로필 쓰기가 저장 전에 이걸 호출 → serverId 미보유/가입 레이스로 데이터가
// DB에 안 박히는 문제 방지(이전: getServerId() 없으면 조용히 스킵 → 유실).
let inflightEnsure: Promise<string | null> | null = null;
export async function ensureServerId(): Promise<string | null> {
  const existing = getServerId();
  if (existing) return existing;
  // 동시 호출 직렬화 — 진행 중인 가입이 있으면 그 결과를 공유(가입 POST 중복·이중 User 방지).
  if (inflightEnsure) return inflightEnsure;
  const u = loadState().user;
  if (!u?.name) return null; // 이름조차 없으면(미온보딩) 생성 불가 → 스킵
  inflightEnsure = apiSignup({
    name: u.name,
    phone: u.phone ?? `id:${u.name}`, // 연락처 없으면 이름 기반 합성키(동일 계정 매칭)
    email: u.email ?? undefined,
  }).finally(() => {
    inflightEnsure = null;
  });
  return inflightEnsure;
}

// 기본 프로필 저장 — 경력 라벨("1~3년") → CareerBand enum("Y1_3") 매핑.
export async function apiSetBasicProfile(data: {
  jobType: string[];
  careerYears: string;
  region: string[];
  name?: string;
  industries?: string[];
  role?: string;
  residency?: string; // DOMESTIC | OVERSEAS (WORKER 온보딩) — WorkerProfile 로 영속
}): Promise<void> {
  const id = await ensureServerId();
  if (!id) return; // 서버 user 아직 없음 → 스킵(로컬 상태는 유지됨)
  // 경력 라벨 → enum. 유효한 CareerBand 가 아니면(미선택 "") payload 에서 제외.
  // (서버 ValidationPipe 가 빈 값을 400 으로 거부 → jobType/region 까지 함께 거부되는 회귀 방지)
  const careerBand = CAREER_BAND[data.careerYears as keyof typeof CAREER_BAND];
  const payload: {
    jobType?: string[];
    region: string[];
    careerYears?: string;
    name?: string;
    industries?: string[];
    role?: string;
    residency?: string;
  } = { region: data.region };
  // 직군은 있을 때만(CUSTOMER 는 직군 없음 → 서버 jobType 선택·ArrayMinSize 회피).
  if (data.jobType && data.jobType.length) payload.jobType = data.jobType;
  if (careerBand) payload.careerYears = careerBand;
  if (data.name && data.name.trim()) payload.name = data.name.trim();
  if (data.industries && data.industries.length) payload.industries = data.industries;
  if (data.role === "WORKER" || data.role === "CUSTOMER" || data.role === "FIELD_LEADER" || data.role === "PROJECT_OPERATOR" || data.role === "PERFORMER_COMPANY") payload.role = data.role;
  if (data.residency === "DOMESTIC" || data.residency === "OVERSEAS") payload.residency = data.residency;
  try {
    await fetch(`/api/users/${id}/basic-profile`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // best-effort
  }
}

// 관심 기능 등록 — 서버 InterestRegistration(FK userId)에 저장.
export async function apiRegisterInterest(feature: string): Promise<void> {
  const id = await ensureServerId();
  if (!id) return; // 서버 user 없으면 스킵(로컬 상태는 유지)
  try {
    await fetch(`/api/users/${id}/interests`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ feature }),
    });
  } catch {
    // best-effort
  }
}

// 자격증 등록 — 서버 Certificate(FK userId)에 저장.
export async function apiAddCertificate(data: {
  name: string;
  licenseNo: string;
  issuer?: string;
  issuedAt?: string;
}): Promise<void> {
  const id = await ensureServerId();
  if (!id) return;
  try {
    await fetch(`/api/users/${id}/certificates`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    // best-effort
  }
}

// 경력 카드 등록 — 서버 CareerCard(FK userId)에 저장. 공유 프로필(/p/:id) 노출용.
export async function apiAddCareerCard(data: {
  siteName: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  role?: string;
  equipment?: string;
  coworkers?: string;
  memo?: string;
}): Promise<void> {
  const id = await ensureServerId();
  if (!id) return;
  try {
    await fetch(`/api/users/${id}/careers`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    // best-effort
  }
}

// 교육 이력 등록 — 서버 Education(FK userId)에 저장.
export async function apiAddEducation(data: {
  title: string;
  institute?: string;
  completedAt?: string;
}): Promise<void> {
  const id = await ensureServerId();
  if (!id) return;
  try {
    await fetch(`/api/users/${id}/educations`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    // best-effort
  }
}

// ── 캐노니컬 확장: 작업요청 · Field Ops · 현장리더 프로필 (dev-plan §5.7·§5.8·§5.6) ──

// 현장작업요청 생성 — 서버 WorkRequest. requesterId = 내 serverId(CUSTOMER/OPERATOR).
export async function apiCreateWorkRequest(data: {
  industry: string;
  workTypes?: string[];
  region?: string[];
  budgetMemo?: string;
  schedule?: string;
  scaleMemo?: string;
  jobTypes?: string[];
  headcount?: number;
  requiredCerts?: string[];
  safetyConds?: string;
  equipMaterial?: string;
  contractType?: string;
  foreignAllowed?: boolean;
  requiredVisaTypes?: string[];
  interpreterProvided?: boolean;
}): Promise<{ id: string } | null> {
  const id = await ensureServerId();
  if (!id) return null;
  return postJson<{ id: string }>("/api/work-requests", { requesterId: id, ...data });
}

// 내가 등록한 작업요청 목록(최신순).
export async function apiListMyWorkRequests(): Promise<WorkRequest[] | null> {
  const id = await ensureServerId();
  if (!id) return null;
  return getJson<WorkRequest[]>(`/api/users/${id}/work-requests`, []);
}

// Field Ops 관심 등록 — 서버 FieldOpsInterest(InterestRegistration과 별개). 익명 허용.
export async function apiRegisterFieldOpsInterest(
  feature: string,
  props?: Record<string, unknown>,
): Promise<void> {
  const id = await ensureServerId();
  try {
    await fetch("/api/field-ops/interests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ feature, userId: id ?? undefined, props }),
    });
  } catch {
    // best-effort
  }
}

// 현장리더 프로필 upsert — 서버 FieldLeaderProfile(userId @unique).
export async function apiUpsertFieldLeaderProfile(
  data: FieldLeaderProfile,
): Promise<void> {
  const id = await ensureServerId();
  if (!id) return;
  try {
    await fetch(`/api/users/${id}/field-leader-profile`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    // best-effort
  }
}

// 현장리더 프로필 조회(없으면 null).
export async function apiGetFieldLeaderProfile(): Promise<FieldLeaderProfile | null> {
  const id = await ensureServerId();
  if (!id) return null;
  try {
    const res = await fetch(`/api/users/${id}/field-leader-profile`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as FieldLeaderProfile | null;
  } catch {
    return null;
  }
}

// ── 후보매칭 (dev-plan §5.7 4단계 · §4-2) ──

// 작업요청 후보 목록(최신·추천점수순).
export async function apiListCandidates(
  workRequestId: string,
): Promise<WorkRequestCandidate[] | null> {
  return getJson<WorkRequestCandidate[]>(`/api/work-requests/${workRequestId}/candidates`, []);
}

// 후보 지정(멱등) — candidateType/candidateId + 표시명 스냅샷(memo).
export async function apiAddCandidate(
  workRequestId: string,
  data: { candidateType: string; candidateId: string; memo?: string; score?: number },
): Promise<WorkRequestCandidate | null> {
  return postJson<WorkRequestCandidate>(`/api/work-requests/${workRequestId}/candidates`, data);
}

// 후보 상태 변경(SHORTLISTED/CONTACTED/SELECTED/REJECTED).
export async function apiUpdateCandidate(
  workRequestId: string,
  candidateId: string,
  data: { status: string },
): Promise<WorkRequestCandidate | null> {
  return patchJson<WorkRequestCandidate>(`/api/work-requests/${workRequestId}/candidates/${candidateId}`, data);
}

// 자동 후보추천(매칭 점수순).
export async function apiGetRecommendations(
  workRequestId: string,
): Promise<Recommendation[]> {
  return getJson<Recommendation[]>(`/api/work-requests/${workRequestId}/recommendations`, []);
}

// 수행기업 디렉터리(산업/지역 필터).
export async function apiListPerformers(query?: {
  industry?: string;
  region?: string;
}): Promise<Performer[]> {
  const qs = new URLSearchParams();
  if (query?.industry) qs.set("industry", query.industry);
  if (query?.region) qs.set("region", query.region);
  return getJson<Performer[]>(`/api/performers?${qs.toString()}`, []);
}

// 팀 디렉터리(산업/지역 필터).
export async function apiListTeams(query?: {
  industry?: string;
  region?: string;
}): Promise<TeamDir[]> {
  const qs = new URLSearchParams();
  if (query?.industry) qs.set("industry", query.industry);
  if (query?.region) qs.set("region", query.region);
  return getJson<TeamDir[]>(`/api/teams?${qs.toString()}`, []);
}

// ── 운영자(PROJECT_OPERATOR) · 수행기업(PERFORMER_COMPANY) (dev-plan §5.3·§4-4) ──

// 운영자 프로필 upsert — 서버 ProjectOperator(userId @unique).
export async function apiUpsertOperatorProfile(data: OperatorProfile): Promise<void> {
  const id = await ensureServerId();
  if (!id) return;
  try {
    await fetch(`/api/users/${id}/operator-profile`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    // best-effort
  }
}

// 수행기업 등록 — 서버 Company(companyKind=PERFORMER). companyId 반환(로컬 저장은 호출부).
export async function apiCreateCompany(data: {
  name: string;
  contactName: string;
  contactPhone: string;
  industries?: string[];
  region?: string[];
  safetyRate?: number;
}): Promise<{ id: string } | null> {
  try {
    const res = await fetch("/api/companies", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ companyKind: "PERFORMER", ...data }),
    });
    if (!res.ok) return null;
    return (await res.json()) as { id: string };
  } catch {
    return null;
  }
}

// 수행기업 공개 프로필(사례·지표 집계).
export async function apiGetCompanyProfile(companyId: string): Promise<CompanyProfile | null> {
  try {
    const res = await fetch(`/api/companies/${companyId}/profile`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as CompanyProfile;
  } catch {
    return null;
  }
}

// 완료 평가 제출 — 서버 Review(7항목) + TrustScore 재계산. raterUserId = 내 serverId.
export async function apiSubmitReview(data: {
  rateeType: string;
  rateeId: string;
  workRequestId?: string;
  scheduleAdherence?: number;
  workQuality?: number;
  communication?: number;
  safetyManagement?: number;
  costTrust?: number;
  rehireIntent?: number;
  siteEnvironment?: number;
  collaboration?: number; // 협업 태도(외국인 §5-1) — 서버 Review/DTO 이미 지원
  comment?: string;
}): Promise<{ id: string } | null> {
  const id = await ensureServerId();
  if (!id) return null;
  try {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ raterUserId: id, ...data }),
    });
    if (!res.ok) return null;
    return (await res.json()) as { id: string };
  } catch {
    return null;
  }
}

// 작업수행사례 등록.
export async function apiAddWorkRecord(
  companyId: string,
  data: {
    industry: string;
    title: string;
    siteName?: string;
    workTypes?: string[];
    period?: string;
    scaleMemo?: string;
    description?: string;
  },
): Promise<WorkRecord | null> {
  try {
    const res = await fetch(`/api/companies/${companyId}/work-records`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return (await res.json()) as WorkRecord;
  } catch {
    return null;
  }
}

// ════════════════════════════════════════════════════════════════════
// 외국인 기술인력 관리 — dev-plan-foreign-workforce.md
// best-effort thin 래퍼. 실패 시 null/빈배열.
// ════════════════════════════════════════════════════════════════════

// 공용 best-effort fetch — /api(BFF) GET. 실패 시 fallback. (amono 관리뷰에서도 재사용)
export async function getJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}
export async function postJson<T>(
  url: string,
  body: unknown,
  method = "POST",
): Promise<T | null> {
  try {
    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
export async function patchJson<T>(url: string, body: unknown): Promise<T | null> {
  return postJson<T>(url, body, "PATCH");
}
// ── 체류·비자 (§6) ──
export function apiListVisa(userId: string): Promise<VisaStatus[]> {
  return getJson<VisaStatus[]>(`/api/users/${userId}/visa`, []);
}
export function apiCreateVisa(
  userId: string,
  data: Partial<VisaStatus> & { visaType: string },
): Promise<VisaStatus | null> {
  return postJson<VisaStatus>(`/api/users/${userId}/visa`, data);
}

// ── 서류 (§6-3) ──
export function apiListDocuments(userId: string): Promise<DocumentRecord[]> {
  return getJson<DocumentRecord[]>(`/api/users/${userId}/documents`, []);
}
export function apiAddDocument(
  userId: string,
  data: { kind: string; fileUrl: string; status?: string },
): Promise<DocumentRecord | null> {
  return postJson<DocumentRecord>(`/api/users/${userId}/documents`, data);
}

// ── 교육 이수 (§6-2) ──
export function apiListTraining(userId: string): Promise<TrainingRecord[]> {
  return getJson<TrainingRecord[]>(`/api/users/${userId}/training`, []);
}
export function apiAddTraining(
  userId: string,
  data: { kind: string; title: string; provider?: string; completedAt?: string; certUrl?: string },
): Promise<TrainingRecord | null> {
  return postJson<TrainingRecord>(`/api/users/${userId}/training`, data);
}
export async function apiDeleteTraining(userId: string, tid: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/users/${userId}/training/${tid}`, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}

// ── 현장 용어 사전 (§4) ──
export function apiGetGlossary(params?: {
  lang?: string;
  category?: string;
  industry?: string;
}): Promise<GlossaryTerm[]> {
  const qs = new URLSearchParams();
  if (params?.lang) qs.set("lang", params.lang);
  if (params?.category) qs.set("category", params.category);
  if (params?.industry) qs.set("industry", params.industry);
  const q = qs.toString();
  return getJson<GlossaryTerm[]>(`/api/glossary${q ? `?${q}` : ""}`, []);
}
export function apiGetGlossaryPack(industry: string, lang?: string): Promise<GlossaryTerm[]> {
  return getJson<GlossaryTerm[]>(
    `/api/glossary/packs/${industry}${lang ? `?lang=${lang}` : ""}`,
    [],
  );
}

// ── 정산 (§7) ──
export function apiListSettlements(params?: {
  workerId?: string;
  companyId?: string;
}): Promise<Settlement[]> {
  const qs = new URLSearchParams();
  if (params?.workerId) qs.set("workerId", params.workerId);
  if (params?.companyId) qs.set("companyId", params.companyId);
  const q = qs.toString();
  return getJson<Settlement[]>(`/api/settlements${q ? `?${q}` : ""}`, []);
}
export function apiDisputeSettlement(id: string): Promise<Settlement | null> {
  return postJson<Settlement>(`/api/settlements/${id}/dispute`, {});
}
export function apiCreateSettlement(data: {
  workerId: string;
  companyId?: string;
  workRequestId?: string;
  period: string;
  items: Array<{
    kind: string;
    amount: number;
    note?: string;
  }>;
}): Promise<Settlement | null> {
  return postJson<Settlement>(`/api/settlements`, data);
}

// ── 행정·노무 파트너 연계 (§2·§6) ──
export async function apiCreateReferral(data: {
  kind: string;
  note?: string;
  requesterId?: string;
}): Promise<PartnerReferral | null> {
  const id = data.requesterId ?? (await ensureServerId());
  if (!id) return null;
  return postJson<PartnerReferral>(`/api/referrals`, { ...data, requesterId: id });
}
// ── 리스크 신고 (§8-4) ──
export function apiListRiskReports(params?: {
  status?: string;
  kind?: string;
}): Promise<RiskReport[]> {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.kind) qs.set("kind", params.kind);
  const q = qs.toString();
  return getJson<RiskReport[]>(`/api/risk-reports${q ? `?${q}` : ""}`, []);
}
export function apiSetRiskStatus(id: string, status: string): Promise<RiskReport | null> {
  return postJson<RiskReport>(`/api/risk-reports/${id}/status`, { status }, "PATCH");
}

// ── 외국인 후보 검색 (§5-5) ──
export function apiBrowseForeignWorkers(params?: {
  koreanLevel?: string;
  residency?: string;
  visaType?: string;
  industry?: string;
  region?: string;
  interpreterNeeded?: boolean;
}): Promise<ForeignWorker[]> {
  const qs = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      qs.set(k, String(v));
    }
  });
  const q = qs.toString();
  return getJson<ForeignWorker[]>(`/api/foreign-workers${q ? `?${q}` : ""}`, []);
}

// ── 기술자 확장 프로필(외국인 속성 포함, §5-1) ──
export interface WorkerProfileData {
  industries?: string[];
  preferredWorkTypes?: string[];
  similarWorkExperience?: string[];
  contactHours?: string;
  introduction?: string;
  residency?: string;
  nationality?: string;
  languages?: string[];
  koreanLevel?: string;
  interpreterNeeded?: boolean;
  glossaryComprehension?: number;
  desiredEntryDate?: string;
  updatedAt?: string;
}
export function apiGetWorkerProfile(userId: string): Promise<WorkerProfileData | null> {
  return getJson<WorkerProfileData | null>(`/api/users/${userId}/worker-profile`, null);
}
export function apiUpsertWorkerProfile(
  userId: string,
  data: WorkerProfileData,
): Promise<WorkerProfileData | null> {
  return postJson<WorkerProfileData>(`/api/users/${userId}/worker-profile`, data, "PUT");
}

// 신뢰 점수 조회 — GET /trust-scores/:subjectType/:subjectId
export async function apiGetTrustScore(subjectType: string, subjectId: string): Promise<TrustScore | null> {
  try {
    const res = await fetch(`/api/trust-scores/${subjectType}/${subjectId}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as TrustScore;
  } catch {
    return null;
  }
}

// ── 알림 (Notification) ──

export function apiGetUnreadCount(userId: string): Promise<number> {
  return getJson<{ count: number }>(`/api/users/${userId}/notifications/unread-count`, { count: 0 }).then(r => r.count);
}

export function apiListNotifications(userId: string): Promise<Notification[]> {
  return getJson<Notification[]>(`/api/users/${userId}/notifications`, []);
}

export function apiMarkAllRead(userId: string): Promise<void | null> {
  return postJson<void>(`/api/users/${userId}/notifications/read-all`, {});
}

export function apiVapidPublicKey(): Promise<{ key: string | null } | null> {
  return getJson<{ key: string | null } | null>(`/api/push/vapid-public-key`, null);
}

export function apiSaveSubscription(userId: string, subscription: any): Promise<void | null> {
  return postJson<void>(`/api/users/${userId}/push-subscription`, subscription);
}

// ==========================================
// 일자리 (JobPost) 및 지원 (JobApplication)
// ==========================================

export function apiListJobPosts(params?: { jobType?: string; region?: string; limit?: number }): Promise<JobPost[] | null> {
  const q = new URLSearchParams();
  if (params?.jobType) q.set("jobType", params.jobType);
  if (params?.region) q.set("region", params.region);
  if (params?.limit) q.set("limit", String(params.limit));
  const url = `/api/job-posts${q.toString() ? "?" + q.toString() : ""}`;
  return getJson<JobPost[] | null>(url, null);
}

export function apiListUserApplications(userId: string): Promise<JobApplication[] | null> {
  return getJson<JobApplication[] | null>(`/api/users/${userId}/applications`, null);
}

export function apiApplyJobPost(jobPostId: string, userId: string): Promise<JobApplication | null> {
  return postJson<JobApplication>(`/api/job-posts/${jobPostId}/apply`, { userId });
}

export function apiListUserAssignments(userId: string): Promise<Assignment[] | null> {
  return getJson<Assignment[] | null>(`/api/users/${userId}/assignments`, null);
}

export function apiCheckIn(applicationId: string): Promise<AttendanceRec | null> {
  return postJson<AttendanceRec>(`/api/applications/${applicationId}/checkin`, {});
}

export function apiCheckOut(applicationId: string): Promise<AttendanceRec | null> {
  return postJson<AttendanceRec>(`/api/applications/${applicationId}/checkout`, {});
}
