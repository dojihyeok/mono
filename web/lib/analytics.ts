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
  | "notification_clicked";

// 정본 이벤트 카탈로그(PDF #1 6장 기준). 관리자 화면·문서의 단일 출처.
// Record<AnalyticsEventName,...> 라 union 과 항상 동기화됨(누락 시 컴파일 에러).
export type EventCategory = "signup" | "profile" | "interest" | "return";

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

export function getLoggedEvents(): LoggedEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BUFFER_KEY);
    return raw ? (JSON.parse(raw) as LoggedEvent[]) : [];
  } catch {
    return [];
  }
}
