// 이벤트 로그 헬퍼 — 사용자 앱 주요 행동을 기록합니다.
// 이벤트명 기준: docs/user-app-guidelines.md 6장 + 11장(화면별 고려사항).
// 현재: 클라이언트 기록(콘솔 + localStorage 버퍼).
// 서버액션 seam: logEventToServer() 를 추후 AnalyticsEvent 테이블 영속화로 교체.

import { v4 as uuidv4 } from "uuid";

export type AnalyticsEventName =
  // 가입 (6-2 가입 이벤트 + 11-1 온보딩)
  | "page_view"
  | "onboarding_viewed"
  | "onboarding_cta_clicked"
  | "signup_started"
  | "signup_completed"
  | "onboarding_completed"
  | "job_type_selected"
  | "region_selected"
  | "career_year_selected"
  // 프로필 (6-2 프로필 이벤트 + 11)
  | "profile_started"
  | "profile_basic_completed"
  | "career_added"
  | "career_three_added"
  | "equipment_used_added"
  | "certificate_added"
  | "education_added"
  | "profile_completion_viewed"
  | "profile_completed"
  | "profile_previewed"
  | "profile_shared"
  | "pdf_downloaded"
  // 관심 기능 (6-2 관심 기능 이벤트 + 11-5)
  | "career_verification_interest_clicked"
  | "finance_benefit_interest_clicked"
  | "equipment_rental_interest_clicked"
  | "foreign_worker_management_interest_clicked"
  | "safe_payment_interest_clicked"
  | "company_view_interest_clicked"
  | "interest_feature_clicked"
  | "interest_submitted"
  // 재방문 (6-2 재방문 이벤트)
  | "return_visit"
  | "profile_updated"
  | "career_updated"
  | "notification_clicked"
  // 기업 (계획서 §7-3 — 기업용 웹 /partner)
  | "company_signup_started"
  | "company_signup_completed"
  | "company_interest_submitted"
  | "job_post_started"
  | "job_post_submitted"
  | "urgent_job_post_clicked"
  | "urgent_job_post_requested"
  | "job_boost_interest_submitted"
  | "worker_search"
  | "worker_profile_viewed_by_company" // 구 worker_profile_viewed
  | "candidate_saved" // 구 worker_saved
  | "candidate_consult_requested"
  | "team_profile_viewed_by_company"
  | "team_matching_consult_requested"
  | "workforce_request_submitted"
  | "poc_interest_submitted" // 구 poc_interest_clicked
  | "paid_feature_interest_submitted"
  | "company_return_visit"
  // 지원·배정·출역 (지원 → 수락 → 출역)
  | "job_application_submitted"
  | "application_accepted"
  | "check_in"
  | "check_out"
  // 캐노니컬 정합 추가 (dev-plan §8.2·8.3) — 온보딩 유형/산업 + 현장리더·팀 + 재방문
  | "user_type_selected"
  | "industry_selected"
  | "residency_selected" // 내국인/외국인 선택(온보딩)
  | "field_leader_requested" // 구 foreman_requested
  | "field_leader_registered" // 관리자 승인으로 role=FIELD_LEADER 확정(서버측 발행)
  | "team_created" // 구 team_registered
  | "team_deleted"
  | "coworker_recalled"
  | "account_deleted"
  // 작업요청(§5.7) + FieldOps 7종(§5.8, 기존 6종과 병존)
  | "work_request_started"
  | "work_request_submitted"
  | "field_operations_viewed"
  | "equipment_tool_interest_clicked"
  | "smart_equipment_interest_clicked"
  | "material_order_interest_clicked"
  | "package_interest_clicked"
  | "meal_lodging_interest_clicked"
  | "education_interest_clicked"
  | "insurance_interest_clicked"
  // 현장리더 프로필(§5.6)
  | "field_leader_profile_started"
  | "field_leader_profile_completed"
  // 후보매칭(§5.7 4단계) — 작업요청 → 후보 조회·지정
  | "performer_profile_viewed" // 구 contractor_profile_viewed
  | "field_leader_profile_viewed"
  | "operator_recommendation_clicked" // 구 pm_recommendation_clicked
  | "candidate_shortlisted"
  // 팀 가동일정 · AI현장리더(§5.6·5.10) · 장비 이력(§5.5)
  | "team_availability_updated"
  | "ai_field_leader_interest_clicked" // 구 ai_foreman_interest_clicked
  | "equipment_history_added" // 구 equipment_used_added(퍼널 정본)
  // 완료 평가(§5.9)
  | "project_review_submitted"
  // ── 외국인 기술인력 (dev-plan-foreign-workforce §7) ──
  | "foreign_profile_started"
  | "foreign_profile_completed"
  | "language_selected"
  | "korean_level_registered"
  | "visa_status_registered"
  | "visa_expiry_alert_viewed"
  | "document_uploaded"
  | "document_review_updated"
  | "glossary_term_viewed"
  | "glossary_pack_opened"
  | "glossary_offline_cached"
  | "field_term_translated"
  | "voice_term_translated"
  | "foreign_candidate_searched"
  | "foreign_candidate_viewed"
  | "settlement_viewed"
  | "settlement_dispute_reported"
  | "training_completed"
  | "partner_referral_requested"
  | "risk_report_submitted"
  | "overseas_candidate_registered"
  // /bm 내부 BM 검증 페이지(내부 BM 검증 페이지 개발 요청서 v1.2 §15)
  | "bm_page_viewed"
  | "bm_hypothesis_opened"
  | "bm_experiment_created"
  | "bm_experiment_completed"
  | "bm_evidence_uploaded"
  | "bm_decision_recorded"
  | "bm_unit_economics_updated"
  | "bm_compliance_gate_opened"
  | "bm_expansion_roadmap_opened"
  // /service 서비스 소개 웹(서비스 소개 웹 개발 요청서 v1.0 §11)
  | "service_page_viewed"
  | "service_primary_cta_clicked"
  | "service_enterprise_cta_clicked"
  | "service_field_pass_clicked"
  | "service_faq_opened"
  // /partner 기업용 Partner·Field Pass 웹(개발 요청서 v1.0 §15)
  | "partner_page_viewed"
  | "partner_product_viewed"
  | "partner_workspace_viewed"
  | "partner_field_pass_viewed"
  | "partner_poc_cta_clicked"
  | "partner_contact_submitted"
  | "field_pass_security_viewed"
  // /analytics 마케팅 Analytics 웹(마케팅 Analytics 웹 개발 요청서 v1.0 §5)
  | "campaign_landing_viewed"
  | "marketing_cta_clicked"
  | "job_applied"
  | "enterprise_lead_submitted"
  | "poc_requested"
  | "referral_shared"
  // 비공개 데이터룸(투자·TIPS 자료)
  | "dataroom_page_viewed"
  | "dataroom_founder_profile_clicked"
  | "dataroom_team_readiness_viewed"
  | "dataroom_document_requested"
  // /bm, /bm/simulator (내부 BM 검증 페이지 개선 개발 요청서 v1.3 §19)
  | "bm_simulator_link_clicked"
  | "bm_scenario_summary_viewed"
  | "bm_scenario_decision_created"
  | "simulator_viewed"
  | "simulator_scenario_loaded"
  | "simulator_input_changed"
  | "simulator_feature_toggled"
  | "simulator_saved"
  | "simulator_shared"
  | "simulator_returned_to_bm";

// 정본 이벤트 카탈로그(PDF #1 6장 기준). 관리자 화면·문서의 단일 출처.
// Record<AnalyticsEventName,...> 라 union 과 항상 동기화됨(누락 시 컴파일 에러).
export type EventCategory = "signup" | "profile" | "interest" | "return" | "company" | "work" | "foreign" | "bm" | "service" | "partner" | "marketing" | "dataroom";

export const EVENT_CATALOG: Record<
  AnalyticsEventName,
  { category: EventCategory; label: string }
> = {
  // 가입
  page_view: { category: "signup", label: "페이지 조회" },
  onboarding_viewed: { category: "signup", label: "온보딩(랜딩) 조회" },
  onboarding_cta_clicked: { category: "signup", label: "온보딩 CTA 클릭" },
  signup_started: { category: "signup", label: "가입 시작" },
  signup_completed: { category: "signup", label: "가입 완료" },
  onboarding_completed: { category: "signup", label: "온보딩 완료" },
  job_type_selected: { category: "signup", label: "직군 선택" },
  region_selected: { category: "signup", label: "희망 지역 선택" },
  career_year_selected: { category: "signup", label: "경력 연차 선택" },
  // 프로필
  profile_started: { category: "profile", label: "프로필 작성 시작" },
  profile_basic_completed: { category: "profile", label: "기본 프로필 완료" },
  career_added: { category: "profile", label: "경력 등록" },
  career_three_added: { category: "profile", label: "경력 3건 등록" },
  equipment_used_added: { category: "profile", label: "사용 장비 입력" },
  certificate_added: { category: "profile", label: "자격증 등록" },
  education_added: { category: "profile", label: "교육 이력 등록" },
  profile_completion_viewed: { category: "profile", label: "프로필 완성도 조회" },
  profile_completed: { category: "profile", label: "프로필 완성" },
  profile_previewed: { category: "profile", label: "기업용 미리보기 조회" },
  profile_shared: { category: "profile", label: "프로필 공유" },
  pdf_downloaded: { category: "profile", label: "PDF 경력 요약서 다운로드" },
  // 관심 기능
  career_verification_interest_clicked: { category: "interest", label: "경력 인증 관심 클릭" },
  finance_benefit_interest_clicked: { category: "interest", label: "금융 혜택 관심 클릭" },
  equipment_rental_interest_clicked: { category: "interest", label: "공구·장비 대여 관심 클릭" },
  foreign_worker_management_interest_clicked: { category: "interest", label: "외국인 근로자 관리 관심 클릭" },
  safe_payment_interest_clicked: { category: "interest", label: "안심 정산 관심 클릭" },
  company_view_interest_clicked: { category: "interest", label: "기업 열람권 관심 클릭" },
  interest_feature_clicked: { category: "interest", label: "관심 기능 카드 클릭" },
  interest_submitted: { category: "interest", label: "관심 등록 완료" },
  // 재방문
  return_visit: { category: "return", label: "재방문" },
  profile_updated: { category: "return", label: "프로필 수정" },
  career_updated: { category: "return", label: "경력 수정" },
  notification_clicked: { category: "return", label: "알림 클릭" },
  // 기업 (§7-3)
  company_signup_started: { category: "company", label: "기업 가입 시작" },
  company_signup_completed: { category: "company", label: "기업 가입 완료" },
  company_interest_submitted: { category: "company", label: "기업 관심 신청" },
  job_post_started: { category: "company", label: "채용 공고 작성 시작" },
  job_post_submitted: { category: "company", label: "채용 공고 등록" },
  urgent_job_post_clicked: { category: "company", label: "급구 공고 등록 관심" },
  urgent_job_post_requested: { category: "company", label: "급구 공고 등록 요청" },
  job_boost_interest_submitted: { category: "company", label: "상단 노출 관심" },
  worker_search: { category: "company", label: "기술자 검색" },
  worker_profile_viewed_by_company: { category: "company", label: "기술자 프로필 조회" }, // 구 worker_profile_viewed
  candidate_saved: { category: "company", label: "관심 기술자 저장" }, // 구 worker_saved
  candidate_consult_requested: { category: "company", label: "후보 상담 요청" },
  team_profile_viewed_by_company: { category: "company", label: "팀 프로필 조회" },
  team_matching_consult_requested: { category: "company", label: "팀 매칭 상담 요청" },
  workforce_request_submitted: { category: "company", label: "인력 요청 제출" },
  poc_interest_submitted: { category: "company", label: "PoC 관심 신청" }, // 구 poc_interest_clicked
  paid_feature_interest_submitted: { category: "company", label: "유료 기능 관심" },
  company_return_visit: { category: "company", label: "기업 재방문" },
  // 지원·배정·출역
  job_application_submitted: { category: "work", label: "공고 지원" },
  application_accepted: { category: "work", label: "지원 수락(배정)" },
  check_in: { category: "work", label: "출근 체크인" },
  check_out: { category: "work", label: "퇴근 체크아웃" },
  // 캐노니컬 정합 추가 (dev-plan §8.2·8.3). FieldOps 7종·6vs7 통합은 오너 결정 #3 대기 → 보류.
  user_type_selected: { category: "signup", label: "사용자 유형 선택" },
  industry_selected: { category: "signup", label: "산업유형 선택" },
  residency_selected: { category: "signup", label: "내국인/외국인 선택" },
  field_leader_requested: { category: "work", label: "현장리더(반장) 승인 신청" }, // 구 foreman_requested
  field_leader_registered: { category: "work", label: "현장리더(반장) 승인 완료" },
  team_created: { category: "work", label: "작업팀 등록" }, // 구 team_registered
  team_deleted: { category: "work", label: "작업팀 삭제" },
  coworker_recalled: { category: "return", label: "동료 재호출" },
  account_deleted: { category: "return", label: "회원 탈퇴" },
  // 작업요청(§5.7)
  work_request_started: { category: "work", label: "작업요청 작성 시작" },
  work_request_submitted: { category: "work", label: "작업요청 제출" },
  // Field Ops 7종(§5.8) — 기존 관심 6종과 별개 체계로 병존
  field_operations_viewed: { category: "interest", label: "Field Ops 진입" },
  equipment_tool_interest_clicked: { category: "interest", label: "장비·공구 운영 관심" },
  smart_equipment_interest_clicked: { category: "interest", label: "전문장비·스마트계측 관심" },
  material_order_interest_clicked: { category: "interest", label: "소모자재 반복발주 관심" },
  package_interest_clicked: { category: "interest", label: "장비+기술자 패키지 관심" },
  meal_lodging_interest_clicked: { category: "interest", label: "식사·숙소·근무환경 관심" },
  education_interest_clicked: { category: "interest", label: "교육 프로그램 관심" },
  insurance_interest_clicked: { category: "interest", label: "보험·정비·보증 관심" },
  // 현장리더 프로필(§5.6)
  field_leader_profile_started: { category: "profile", label: "현장리더 프로필 시작" },
  field_leader_profile_completed: { category: "profile", label: "현장리더 프로필 완료" },
  // 후보매칭(§5.7) — 작업요청 후보 조회·지정
  performer_profile_viewed: { category: "company", label: "수행기업 프로필 조회" },
  field_leader_profile_viewed: { category: "work", label: "현장리더 프로필 조회" },
  operator_recommendation_clicked: { category: "work", label: "운영자 추천 클릭" },
  candidate_shortlisted: { category: "work", label: "후보 지정" },
  // 팀 가동일정 · AI현장리더 · 장비 이력
  team_availability_updated: { category: "work", label: "팀 가동일정 갱신" },
  ai_field_leader_interest_clicked: { category: "interest", label: "AI현장리더 관심" },
  equipment_history_added: { category: "profile", label: "장비 이력 등록" },
  project_review_submitted: { category: "work", label: "완료 평가 제출" },
  // ── 외국인 기술인력 (dev-plan-foreign-workforce §7) ──
  foreign_profile_started: { category: "foreign", label: "외국인 프로필 시작" },
  foreign_profile_completed: { category: "foreign", label: "외국인 프로필 완료" },
  language_selected: { category: "foreign", label: "사용 언어 선택" },
  korean_level_registered: { category: "foreign", label: "한국어 수준 등록" },
  visa_status_registered: { category: "foreign", label: "체류·비자 상태 등록" },
  visa_expiry_alert_viewed: { category: "foreign", label: "체류 만료 알림 조회" },
  document_uploaded: { category: "foreign", label: "서류 업로드" },
  document_review_updated: { category: "foreign", label: "서류 검토 상태 변경" },
  glossary_term_viewed: { category: "foreign", label: "현장 용어 조회" },
  glossary_pack_opened: { category: "foreign", label: "산업별 용어팩 열람" },
  glossary_offline_cached: { category: "foreign", label: "용어팩 오프라인 저장" },
  field_term_translated: { category: "foreign", label: "현장 용어 번역" },
  voice_term_translated: { category: "foreign", label: "음성 용어 번역" },
  foreign_candidate_searched: { category: "foreign", label: "외국인 후보 검색" },
  foreign_candidate_viewed: { category: "foreign", label: "외국인 후보 조회" },
  settlement_viewed: { category: "foreign", label: "정산표 조회" },
  settlement_dispute_reported: { category: "foreign", label: "정산 분쟁 신고" },
  training_completed: { category: "foreign", label: "교육 이수 등록" },
  partner_referral_requested: { category: "foreign", label: "행정·노무 파트너 연계 신청" },
  risk_report_submitted: { category: "foreign", label: "리스크 신고" },
  overseas_candidate_registered: { category: "foreign", label: "해외 예비 기술자 등록" },
  // /bm 내부 BM 검증 페이지
  bm_page_viewed: { category: "bm", label: "/bm 페이지 조회" },
  bm_hypothesis_opened: { category: "bm", label: "BM 가설 카드 열람" },
  bm_experiment_created: { category: "bm", label: "실험 등록" },
  bm_experiment_completed: { category: "bm", label: "실험 단계 전환" },
  bm_evidence_uploaded: { category: "bm", label: "증거 자료 업로드" },
  bm_decision_recorded: { category: "bm", label: "의사결정 기록" },
  bm_unit_economics_updated: { category: "bm", label: "Unit Economics 갱신" },
  bm_compliance_gate_opened: { category: "bm", label: "Compliance Gates 조회" },
  bm_expansion_roadmap_opened: { category: "bm", label: "확장 로드맵 펼침" },
  // /service 서비스 소개 웹
  service_page_viewed: { category: "service", label: "/service 페이지 조회" },
  service_primary_cta_clicked: { category: "service", label: "MONO 시작하기 CTA 클릭" },
  service_enterprise_cta_clicked: { category: "service", label: "기업용 MONO CTA 클릭" },
  service_field_pass_clicked: { category: "service", label: "Field Pass 자세히 보기 클릭" },
  service_faq_opened: { category: "service", label: "FAQ 항목 펼침" },
  // /partner 기업용 Partner·Field Pass 웹
  partner_page_viewed: { category: "partner", label: "/partner 페이지 조회" },
  partner_product_viewed: { category: "partner", label: "제품 포트폴리오 조회" },
  partner_workspace_viewed: { category: "partner", label: "Partner Workspace 카드 조회" },
  partner_field_pass_viewed: { category: "partner", label: "Field Pass 상세 조회" },
  partner_poc_cta_clicked: { category: "partner", label: "PoC/상담 CTA 클릭" },
  partner_contact_submitted: { category: "partner", label: "기업 문의 제출" },
  field_pass_security_viewed: { category: "partner", label: "Field Pass 보안 자료 조회" },
  // /analytics 마케팅 Analytics 웹
  campaign_landing_viewed: { category: "marketing", label: "캠페인 랜딩 조회" },
  marketing_cta_clicked: { category: "marketing", label: "마케팅 CTA 클릭" },
  job_applied: { category: "marketing", label: "공고 지원(캠페인 유입)" },
  enterprise_lead_submitted: { category: "marketing", label: "기업 리드 제출(캠페인 유입)" },
  poc_requested: { category: "marketing", label: "PoC 신청(캠페인 유입)" },
  referral_shared: { category: "marketing", label: "추천 링크 생성·공유" },
  // 비공개 데이터룸
  dataroom_page_viewed: { category: "dataroom", label: "데이터룸 조회" },
  dataroom_founder_profile_clicked: { category: "dataroom", label: "대표자 프로필 링크 클릭" },
  dataroom_team_readiness_viewed: { category: "dataroom", label: "Team Readiness 조회" },
  dataroom_document_requested: { category: "dataroom", label: "추가 자료 요청" },
  // /bm, /bm/simulator
  bm_simulator_link_clicked: { category: "bm", label: "시뮬레이터 진입 링크 클릭" },
  bm_scenario_summary_viewed: { category: "bm", label: "Scenario Summary 조회" },
  bm_scenario_decision_created: { category: "bm", label: "시뮬레이션 근거 의사결정 기록" },
  simulator_viewed: { category: "bm", label: "시뮬레이터 조회" },
  simulator_scenario_loaded: { category: "bm", label: "시뮬레이터 시나리오 프리셋 로드" },
  simulator_input_changed: { category: "bm", label: "시뮬레이터 입력값 변경" },
  simulator_feature_toggled: { category: "bm", label: "시뮬레이터 기능 트리거 토글" },
  simulator_saved: { category: "bm", label: "시뮬레이터 시나리오 저장" },
  simulator_shared: { category: "bm", label: "시뮬레이터 URL 공유" },
  simulator_returned_to_bm: { category: "bm", label: "시뮬레이터에서 /bm 복귀" },
};

export interface LoggedEvent {
  name: AnalyticsEventName;
  props: Record<string, unknown>;
  at: string;
}

const BUFFER_KEY = "mono.events";
const BUFFER_LIMIT = 500;

// 서버 영속화 — BFF(/api/events) → NestJS api → AnalyticsEvent. best-effort.
async function logEventToServer(event: LoggedEvent): Promise<void> {
  if (typeof window === "undefined") return;
  let userId: string | undefined;
  try {
    userId = window.localStorage.getItem("mono.serverId") ?? undefined;
  } catch {
    // 무시
  }
  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: event.name, userId, props: event.props }),
    });
  } catch {
    // 전송 실패 무시(오프라인 등)
  }
}

// Generate or retrieve anonymous_id
function getAnonymousId(): string {
  if (typeof window === "undefined") return "anon_server";
  let anonId = localStorage.getItem("mono_anonymous_id");
  if (!anonId) {
    anonId = `anon_${uuidv4()}`;
    localStorage.setItem("mono_anonymous_id", anonId);
  }
  return anonId;
}

// Extract UTM source from URL
function getUtmSource(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  return params.get("utm_source") || undefined;
}

// Get device model (basic approximation using userAgent)
function getDeviceModel(): string {
  if (typeof window === "undefined") return "Server";
  const ua = navigator.userAgent;
  if (/iPhone/i.test(ua)) return "iPhone";
  if (/iPad/i.test(ua)) return "iPad";
  if (/Android/i.test(ua)) return "Android";
  return "Web";
}

// Platform detection
function getPlatform(): string {
  if (typeof window === "undefined") return "Web";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Android/i.test(ua)) return "Android";
  return "Web";
}

export function track(
  name: AnalyticsEventName | string,
  props?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;

  const enrichedProps = {
    ...props,
    anonymous_id: getAnonymousId(),
    platform: getPlatform(),
    app_version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    device_model: getDeviceModel(),
    utm_source: getUtmSource() || undefined,
  };

  const event: LoggedEvent = {
    name: name as AnalyticsEventName,
    props: enrichedProps,
    at: new Date().toISOString(),
  };

  // 1) 콘솔 기록(개발 확인용)
  // eslint-disable-next-line no-console
  console.debug("[analytics]", name, event.props);

  // 2) localStorage 버퍼(검증 화면/추후 일괄 전송용)
  try {
    const raw = window.localStorage.getItem(BUFFER_KEY);
    const list: LoggedEvent[] = raw ? JSON.parse(raw) : [];
    list.push(event);
    if (list.length > BUFFER_LIMIT) list.splice(0, list.length - BUFFER_LIMIT);
    window.localStorage.setItem(BUFFER_KEY, JSON.stringify(list));
  } catch {
    // 저장 실패는 무시(시크릿 모드 등)
  }

  // 3) 서버 전송 seam
  void logEventToServer(event);
}
