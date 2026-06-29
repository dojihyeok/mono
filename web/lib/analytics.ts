// 이벤트 로그 헬퍼 — 사용자 앱 주요 행동을 기록합니다.
// 이벤트명 기준: docs/user-app-guidelines.md 6장 + 11장(화면별 고려사항).
// 현재: 클라이언트 기록(콘솔 + localStorage 버퍼).
// 서버액션 seam: logEventToServer() 를 추후 AnalyticsEvent 테이블 영속화로 교체.

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
  | "worker_search"
  | "worker_profile_viewed"
  | "worker_saved"
  | "workforce_request_submitted"
  | "poc_interest_clicked"
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
  | "overseas_candidate_registered";

// 정본 이벤트 카탈로그(PDF #1 6장 기준). 관리자 화면·문서의 단일 출처.
// Record<AnalyticsEventName,...> 라 union 과 항상 동기화됨(누락 시 컴파일 에러).
export type EventCategory = "signup" | "profile" | "interest" | "return" | "company" | "work" | "foreign";

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
  worker_search: { category: "company", label: "기술자 검색" },
  worker_profile_viewed: { category: "company", label: "기술자 프로필 조회" },
  worker_saved: { category: "company", label: "관심 기술자 저장" },
  workforce_request_submitted: { category: "company", label: "인력 요청 제출" },
  poc_interest_clicked: { category: "company", label: "PoC 관심 신청" },
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

export function track(
  name: AnalyticsEventName,
  props?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;

  const event: LoggedEvent = {
    name,
    props: props ?? {},
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
