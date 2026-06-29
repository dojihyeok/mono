# MONO 통합 개발계획서 (마스터)

> 출처: 4개 기획서 정합 — ①사용자앱 ②관리자·마케팅분석 ③신뢰운영전략 ④확장전략(정본).
> 작성: 2026-06-24 · 근거: 현행 코드 전수 조사(스키마·API·사용자앱·관리자/분석) + 멀티에이전트 정합.
> 방침: **확장전략(문서4)을 정본**으로 채택, 건설·인테리어를 초기 검증시장으로. **스키마·이벤트·enum은 확장형으로 한 번에, UI·기능 노출은 단계적으로.**

---

## 0. 캐노니컬 모델 (정합 기준)

정본 채택: **문서4(확장 전략)**를 캐노니컬 기준으로 채택. 건설·인테리어를 **초기 검증시장**으로 둔다. 문서1~3의 좁은 용어는 확장 용어로 매핑하고, 충돌 이벤트는 정본 1개로 통일 + 구버전 alias 표기.

---

### 1) 용어 매핑표 (기존 → 정본, 영문키)

| 기존 용어(문서1~3) | 정본 용어(문서4) | 영문 canonical key |
| --- | --- | --- |
| 공사요청 | 현장작업요청 | `WorkRequest` |
| 시공사 | 수행기업 | `PerformerCompany` (약칭 `Performer`) |
| 시행사 / PM | 프로젝트운영자·현장운영자 | `ProjectOperator` (약칭 `Operator`) |
| 현장반장 / 팀장 (FOREMAN) | 현장리더·팀리더 | `FieldLeader` |
| 기술자팀 / 가동팀 | 작업팀·기술팀 | `Team` (작업팀) |
| 자재 | 소모자재·현장운영물품 | `Material` |
| 공구대여 | 장비공구운영 | `EquipmentTool` |
| 공사사례 / 시공경험 | 작업수행사례 / 유사작업경험 | `WorkRecord` / `similarWorkExperience` |
| 현장 | 산업현장 | `Site` (산업현장) |
| 고객 | 작업요청자 | `Customer` (작업요청자) |
| AI현장반장 | AI현장리더 | `AiLeaderInterest` |
| 신뢰점수 | 신뢰점수 | `TrustScore` |

---

### 2) 사용자 유형 정본 (5종) + 정의 + 현행 User.role 매핑

| # | 정본 영문 enum | 한글 | 정의 | 현행 User.role 매핑 |
| --- | --- | --- | --- | --- |
| 1 | `WORKER` | 기술자 | 직군·경력·자격·장비를 가진 개인 작업자 | **WORKER (유지)** |
| 2 | `FIELD_LEADER` | 현장리더·팀리더 | 작업팀을 구성·인솔하고 투입 일정을 운영(관리자 승인제) | **FOREMAN → FIELD_LEADER 로 rename** (alias: FOREMAN) |
| 3 | `CUSTOMER` | 작업요청자(발주측) | 현장작업요청을 등록하고 후보를 받는 수요자 | **신규 CUSTOMER** |
| 4 | `PROJECT_OPERATOR` | 프로젝트운영자·현장운영자 | 요구 정리·후보관리·공정/소통·완료보고(구 시행사/PM) | **신규 PROJECT_OPERATOR** |
| 5 | `PERFORMER_COMPANY` | 수행기업 | 회사 프로필·작업수행사례·보유 작업팀/리더로 작업을 수행(구 시공사) | **신규 PERFORMER_COMPANY** (현행 `Company` 모델 → 이 유형으로 승격) |

매핑 정책:
- `UserRole` enum 값 확장: `WORKER` 유지, `FOREMAN`은 `FIELD_LEADER`로 rename(마이그레이션 시 `FOREMAN`을 alias 표기/하위호환), 신규 `CUSTOMER` / `PROJECT_OPERATOR` / `PERFORMER_COMPANY` 추가.
- 현행 `Company` 모델은 `PerformerCompany`의 전신. 단기적으로 `Company`를 재사용하되 `companyKind`(PERFORMER/OPERATOR) 필드로 시공사/시행사를 구분하는 경로 권장.

---

### 3) 산업 유형 (IndustryType enum, 영문) + 초기/확장 구분

| enum value | 한글 | 단계 |
| --- | --- | --- |
| `INTERIOR_REMODELING` | 인테리어·리모델링 | **초기** |
| `CONSTRUCTION_FACILITY` | 건설·설비 | **초기** |
| `SHIPBUILDING` | 조선 | **초기** |
| `PLANT` | 플랜트 | **초기** |
| `MANUFACTURING_FACILITY` | 제조설비 | 확장 |
| `LOGISTICS_EQUIPMENT` | 물류장비 | 확장 |
| `ENERGY_FACILITY` | 에너지설비 | 확장 |
| `PORT_AIRPORT` | 항만·공항 | 확장 |
| `PUBLIC_INFRA` | 공공인프라 | 확장 |
| `DISASTER_RECOVERY` | 재난복구 | 확장 |
| `SPACE_ROBOTICS` | 우주·로봇(+농업산업기계 포함) | 확장 |
| `ETC` | 기타 | 공통 |

> 초기 검증시장 = INTERIOR_REMODELING + CONSTRUCTION_FACILITY (+ SHIPBUILDING/PLANT 준비). 나머지는 확장 시장.

---

### 4) 핵심 엔티티 정본 목록 (영문명 + 한줄정의)

| 영문 정본명 | 한줄 정의 | 현행 대응 |
| --- | --- | --- |
| `User` | 모든 유형의 계정 루트(role + industries) | User (확장) |
| `WorkerProfile` | 기술자 기본프로필(직군·경력·희망지역·산업분야·희망작업유형·유사작업경험) | User 필드 |
| `CareerCard` | 경력카드(현장명·작업분야·역할·기간·함께일한리더·장비·메모·사진) | CareerCard |
| `Certificate` | 자격증(명·발급기관·취득일·만료일) | Certificate |
| `Education` | 자격/안전교육 이력(교육명·기관·이수일·만료) | Education |
| `EquipmentHistory` | 장비 이력(사용가능/운용 장비 이력) | (신규, 현재 CareerCard.equipment 텍스트) |
| `FieldLeaderProfile` | 현장리더 프로필(주요직군·관리가능팀규모·주요작업분야·협력 수행기업·지역·연락시간) | (신규) |
| `Team` | 작업팀(팀명·리더·산업분야·작업유형·인원·평균경력·자격·안전이수율·장비운용인력·투입지역) | Team (확장) |
| `TeamMember` | 팀 구성원 | TeamMember |
| `TeamAvailability` | 팀 가동일정(주간투입·현장배정상태·긴급투입·지역이동) | (신규) |
| `PerformerCompany` | 수행기업 프로필(회사·작업수행사례·보유 리더/팀·가동인력·안전이수율·하자대응·재의뢰율) | Company (승격) |
| `ProjectOperator` | 프로젝트/현장 운영자(유사경험·만족도·일정준수·분쟁대응·반장풀·예산관리) | (신규) |
| `WorkRecord` | 작업수행사례(유사작업경험 태그용) | (신규) |
| `WorkRequest` | 현장작업요청(산업·작업유형·지역·예산·일정·규모·필요직군/인원·자격·안전조건·장비자재·계약방식·상태) | JobPost(전신) |
| `WorkRequestCandidate` | 요청에 대한 후보지정(수행기업/현장리더/작업팀) | SavedWorker(유사) |
| `Application` | 작업/공고 지원 | JobApplication |
| `Attendance` | 출근/퇴근 출역 | Attendance |
| `Coworker` | 함께 일한 동료 그래프 엣지 | Coworker |
| `Review` | 다방향 평가(7항목·신뢰점수 반영) | (신규) |
| `TrustScore` | 평가 누적 기반 신뢰점수(파생/계산) | (신규, P2) |
| `FieldOpsInterest` | Field Ops 7종 관심 등록 | InterestRegistration(확장) |
| `AiLeaderInterest` | AI현장리더 관심(조건·반복패턴·팀후보매칭) | (신규) |
| `Notification` / `PushSubscription` | 알림·웹푸시 | 동일 |
| `AnalyticsEvent` | 이벤트 로그 | 동일 |

---

### 5) 이벤트명 정본 결정표 (충돌 해소)

공통 원칙: **문서4(확장 어휘)를 정본으로**, 구버전은 alias.

| 정본 이벤트명 | 설명 | 대체된 구버전 alias |
| --- | --- | --- |
| `industry_selected` | 온보딩 산업유형 선택 | (신규, 정본) |
| `user_type_selected` | 유형 선택 | (동일) |
| `field_leader_profile_started` | 현장리더 프로필 시작 | `foreman_profile_started` |
| `field_leader_profile_completed` | 현장리더 프로필 완료 | `foreman_profile_completed` |
| `ai_field_leader_interest_clicked` | AI현장리더 관심 | `ai_foreman_interest_clicked` |
| `work_request_started` | 현장작업요청 시작 | `project_request_started` |
| `work_request_submitted` | 현장작업요청 제출 | `project_request_submitted`, (`workforce_request_submitted`은 팀단위요청 변형으로 흡수) |
| `operator_recommendation_clicked` | 운영자(시행사/PM) 추천 클릭 | `pm_recommendation_clicked` |
| `performer_profile_viewed` | 수행기업 프로필 조회 | `contractor_profile_viewed` |
| `field_leader_profile_viewed` | 현장리더 프로필 조회 | `foreman_profile_viewed` |
| `project_review_submitted` | 완료 평가 제출 | (동일) |
| `equipment_tool_interest_clicked` | 장비공구운영 관심 | `tool_rental_interest_clicked`, `equipment_interest_clicked`, `equipment_rental_interest_clicked` |
| `smart_equipment_interest_clicked` | 전문장비·스마트계측기 관심 | (신규, 정본) |
| `material_order_interest_clicked` | 소모자재 반복발주 관심 | (동일) |
| `package_interest_clicked` | 장비+기술자 패키지 관심 | (동일) |
| `meal_lodging_interest_clicked` | 식사·숙소·근무환경 관심 | (동일) |
| `education_interest_clicked` | 교육프로그램 관심 | (동일) |
| `insurance_interest_clicked` | 보험·정비·보증 관심 | (동일) |
| `field_operations_viewed` | Field Ops 진입 | (동일) |
| `team_created` / `team_member_added` / `team_availability_updated` | 팀 등록/구성원/가동일정 | `team_registered`(현행 코드)→`team_created`로 통일 |
| `career_added` | 경력 등록(퍼널 정본) | `career_three_added`는 별도 Aha 지표로 분리 유지(중복 정의 금지) |

기술자 퍼널 정본(불변): `profile_started → profile_basic_completed → career_added → certificate_added → equipment_history_added → profile_completed`.
공통 정본: `visit/page_view → user_type_selected → industry_selected → signup_started → signup_completed → return_visit`.

> 현행 코드 미등록 5종(`coworker_recalled`, `foreman_requested`, `team_registered`, `team_deleted`, `account_deleted`)은 카탈로그에 등재하되, `foreman_requested`→`field_leader_requested`, `team_registered`→`team_created`로 정본화(구명 alias).

---

### 6) 평가(Review) 다방향 매트릭스 정본

평가 7항목 정본: `schedule_adherence`(일정준수) · `work_quality`(작업품질) · `communication`(커뮤니케이션) · `safety_management`(안전관리) · `cost_trust`(비용신뢰) · `rehire_intent`(재의뢰의향) · `site_environment`(현장환경만족도).

| 평가자(rater) | 피평가자(ratee) | 비고 |
| --- | --- | --- |
| `CUSTOMER` | `PROJECT_OPERATOR`, `PERFORMER_COMPANY`, `FIELD_LEADER` | 발주측 → 운영/수행/리더 |
| `PROJECT_OPERATOR` | `PERFORMER_COMPANY`, `FIELD_LEADER` | 운영자 → 수행/리더 |
| `PERFORMER_COMPANY` | `FIELD_LEADER`, `WORKER` | 수행기업 → 리더/기술자 |
| `FIELD_LEADER` | `WORKER`, `Team` | 리더 → 기술자/팀 |
| `WORKER` | `site_environment`(현장환경) | 기술자 → 현장환경(주체 무관 환경평가) |

정본 모델 `Review { raterUserId, rateeType, rateeId, workRequestId?, 7항목 점수, comment?, createdAt }`. 평가 결과는 다음 추천/매칭(`WorkRequestCandidate`)과 `TrustScore` 계산에 반영.

---

### 7) 범위 단계 (초기 vs 확장)

**초기(MVP/검증 단계)** 는 산업유형을 건설·인테리어(+조선·플랜트 옵션)로 제한하고 사용자유형은 핵심 3종 — `WORKER`·`FIELD_LEADER`·`CUSTOMER` — 을 P0로 구현한다(기술자 기본프로필·경력카드·자격교육, 현장리더 프로필·작업팀 등록, 현장작업요청 등록, FieldOps 관심 클릭, 이벤트 로그, 관리자 기본 대시보드). 단, **데이터 모델·이벤트명·enum은 처음부터 확장 정본(5유형·11산업)으로 설계**하여 마이그레이션 비용을 0에 수렴시킨다(예: `IndustryType`은 11값 전부 정의하되 UI 노출은 초기 4값만). **확장 단계**에서 `PROJECT_OPERATOR`·`PERFORMER_COMPANY` 유형 본격화(후보조회·팀가동일정·다방향 평가·산업별 대시보드·AI현장리더 관심: P1), 11개 산업·자동 후보추천·신뢰점수·PoC 리포트 자동화(P2)로 surface를 넓힌다. 즉 **스키마는 확장형으로 한 번에, 노출·기능은 단계적으로** 가른다.

---

참고 파일(절대경로): `/Users/youngje.kim/Documents/mono/api/prisma/schema.prisma` (UserRole L14, CareerBand L48, InterestFeature L99, CompanyStatus L134), `/Users/youngje.kim/Documents/mono/web/lib/analytics.ts` (이벤트 카탈로그 정본 반영 대상).

---

# 섹션 A: 요약 + 갭분석

## 1. 요약

**현행 수준(1문단).** 현행 MONO는 캐노니컬 5유형 중 **2유형(`WORKER`·`FOREMAN`)만** 구현된 기술자 중심 MVP다. 사용자앱(`/mono`)은 가입·기본프로필·경력카드·자격/교육·공고지원·출역체크·동료호출·알림/푸시·반장 신청을 제공하고(`web/app/mono/MonoApp.tsx`), 인력 수요측은 별도 surface(`/partner` 기업, `/amono` 운영, `/analys` 분석)로 분리돼 있다. 데이터 모델(`api/prisma/schema.prisma`, 11개 마이그레이션)은 `User`·`CareerCard`·`Certificate`·`Education`·`Company`·`JobPost`·`JobApplication`·`Attendance`·`Coworker`·`Team`/`TeamMember`·`Notification`·`AnalyticsEvent` 중심으로, 캐노니컬이 요구하는 **다유형 계정·산업유형·작업요청(`WorkRequest`)·다방향 평가(`Review`)·신뢰점수(`TrustScore`)·후보매칭·팀가동일정·AI현장리더**가 부재하다. 이벤트 카탈로그(`web/lib/analytics.ts`)는 구(舊)건설 어휘(`foreman_*`, `tool_rental_*`, `workforce_request_submitted`)에 묶여 있고 코드 호출-카탈로그 정의 간 불일치(미등록 5종)가 존재한다.

**최대 갭 Top 5.**
1. **사용자 유형 3종 전면 부재.** 캐노니컬 핵심 3종 중 `CUSTOMER`(작업요청자)가 P0인데 `UserRole` enum은 `WORKER`/`FOREMAN` 2값뿐(`schema.prisma` L14). `PROJECT_OPERATOR`·`PERFORMER_COMPANY`도 enum·모델·화면 전무. 발주측이 인력/작업을 **요청하는 방향 자체가 없음**(현행은 기업→공고 단방향).
2. **`IndustryType` enum 및 산업 온보딩 부재.** 캐노니컬 11값(초기 4 + 확장) 정의가 스키마에 없고, 온보딩(`MonoEntry.tsx`)은 직군·연차·지역만 받으며 산업유형 선택 단계와 `industry_selected` 이벤트가 없다. "스키마는 확장형으로 한 번에"라는 정본 원칙과 정면 배치.
3. **현장작업요청(`WorkRequest`) + 후보매칭(`WorkRequestCandidate`) 부재.** 정본의 수요-공급 양방향 코어가 없음. 현행 `JobPost`(전신)는 기업이 등록하는 채용공고일 뿐, 작업요청자→후보(수행기업/리더/팀) 흐름·`operator_recommendation_clicked`·`performer_profile_viewed`가 없다.
4. **다방향 평가(`Review` 7항목) + 신뢰점수(`TrustScore`) 완전 부재.** 평가 모델·매트릭스·`project_review_submitted` 이벤트·신뢰점수 파생 전부 없음. MONO의 차별화 자산(신뢰 데이터)이 미구현.
5. **이벤트 카탈로그 정본화 미적용 + 코드/카탈로그 불일치.** `foreman_*`→`field_leader_*`, `tool_rental_*`/`equipment_rental_*`→`equipment_tool_*`, `team_registered`→`team_created` 정본 미반영. 또한 `coworker_recalled`·`foreman_requested`·`team_registered`·`team_deleted`·`account_deleted` 5종이 `track()` 호출되나 `analytics.ts` union/카탈로그에 미등재(분석 누락).

---

## 2. 갭분석 표

판정 기준: **있음**=정본 요구를 충족(동등 기능/모델 존재). **부분**=일부만 존재하거나 구(舊)어휘/단방향 등 정본과 형태가 다름. **없음**=전무.

### 2-1. 사용자 유형 · 온보딩 · 산업

| 정본 요구 | 판정 | 근거(현행 모델/엔드포인트/화면) |
| --- | --- | --- |
| `WORKER`(기술자) | 있음 | `UserRole.WORKER` (`schema.prisma` L14), `types.ts` role union |
| `FIELD_LEADER`(현장리더, 구 FOREMAN rename) | 부분 | 현행 `FOREMAN`만 존재(`UserRole`), 정본은 `FIELD_LEADER`로 rename + alias 필요 |
| `CUSTOMER`(작업요청자) | 없음 | `UserRole`에 값 없음, 사용자앱·types.ts에 발주측 개념 없음(조사 (6)) |
| `PROJECT_OPERATOR`(운영자, 구 시행사/PM) | 없음 | enum·모델·화면 전무 |
| `PERFORMER_COMPANY`(수행기업, 구 시공사) | 부분 | 현행 `Company` 모델 존재(승격 대상), 단 `companyKind`(PERFORMER/OPERATOR) 구분 없음, role 통합 안 됨 |
| `IndustryType` enum(11값, 초기4/확장7+ETC) | 없음 | 스키마에 enum 없음. `Company.industry`는 String? 자유값(`schema.prisma`) |
| 온보딩 산업유형 선택 단계 | 없음 | `MonoEntry.tsx` 입력은 이름·직군·연차·지역 4종뿐, 산업 선택 없음 |
| 온보딩 유형(역할) 선택 단계 | 부분 | 역할은 가입 후 반장 신청(`foreman-request`)으로만 전환, 가입 시 유형 선택 화면 없음 |
| `User.industries` 다중 산업 보유 | 없음 | User에 industries 필드 없음(`jobType`/`region`만 String[]) |

### 2-2. 기술자(WORKER)

| 정본 요구 | 판정 | 근거 |
| --- | --- | --- |
| `WorkerProfile`(직군·경력·희망지역) | 있음 | `User.jobType/careerYears/region` + `PATCH /users/:id/basic-profile` |
| 산업분야·희망작업유형 프로필 | 없음 | User에 industries·희망작업유형 필드 없음 |
| `CareerCard`(현장명·분야·역할·기간·장비·메모) | 있음 | `CareerCard` 모델, `POST /users/:id/careers` |
| 함께 일한 리더 필드(CareerCard) | 부분 | `CareerCard.coworkers`(자유텍스트)만, "함께 일한 리더" 구조화 필드 없음 |
| 카드 사진 첨부 | 없음 | CareerCard에 사진 필드 없음 |
| `Certificate`(명·발급기관·취득일·만료일) | 부분 | `Certificate`에 issuedAt 있으나 **만료일(expiresAt) 없음**(`schema.prisma`) |
| `Education`(교육명·기관·이수일·만료) | 부분 | `Education.completedAt` 있으나 **만료 필드 없음** |
| `EquipmentHistory`(장비 이력 구조화) | 없음 | 현재 `CareerCard.equipment` 텍스트만, 별도 모델 없음 |
| 기술자 퍼널 `equipment_history_added` 단계 | 부분 | 유사 `equipment_used_added` 이벤트 존재하나 정본명/구조 불일치 |
| `Coworker` 동료그래프 + 재호출 | 있음 | `Coworker` 모델, `POST /users/:id/recall` |
| 프로필 공유(링크/QR) | 있음 | `GET /users/:id/public`, `/p/:id`, MonoApp 공유 |

### 2-3. 현장리더(FIELD_LEADER) · 팀

| 정본 요구 | 판정 | 근거 |
| --- | --- | --- |
| `FieldLeaderProfile`(주요직군·관리가능팀규모·협력 수행기업·연락시간) | 없음 | 전용 프로필 모델 없음, 반장은 User+Team으로만 표현 |
| 관리자 승인제 리더 전환 | 있음 | `foremanRequested` 플래그 + `POST /users/:id/foreman-request` + `PATCH /admin/users/:id/role` |
| `Team`(팀명·리더·인원) | 부분 | `Team` 모델 존재하나 **산업분야·작업유형·평균경력·안전이수율·장비운용인력·투입지역** 필드 전무(현행 `name/leaderId`만) |
| `TeamMember` | 있음 | `TeamMember` 모델, `POST/DELETE /users/:id/team` |
| `TeamAvailability`(주간투입·배정상태·긴급투입·지역이동) | 없음 | 가동일정 모델·`team_availability_updated` 이벤트 없음 |
| 팀 평균경력/자격/안전이수율 집계 | 없음 | 집계 로직·필드 없음 |
| 팀 CRUD 이벤트 정본화 | 부분 | `team_registered`/`team_deleted` 호출되나 카탈로그 미등록 + `team_created` 정본명 미적용 |

### 2-4. 작업요청자(CUSTOMER) · 운영자(PROJECT_OPERATOR) · 수행기업(PERFORMER_COMPANY)

| 정본 요구 | 판정 | 근거 |
| --- | --- | --- |
| `WorkRequest`(산업·작업유형·지역·예산·일정·규모·필요직군/인원·자격·안전·장비자재·계약방식·상태) | 부분 | 전신 `JobPost`(title·jobType·headcount·careerBand·certs·region·period·conditions·status) 존재하나 **산업·예산·일정·안전조건·장비자재·계약방식 필드 없음**, 발주 주체가 Company(공급측 채용)이지 작업요청자가 아님 |
| `WorkRequestCandidate`(후보지정: 수행기업/리더/팀) | 없음 | 유사한 `SavedWorker`(기업이 기술자 저장)만 존재, 요청-후보 매칭 구조 아님 |
| 작업요청 등록 화면(고객측) | 없음 | `/mono`에 작업요청 기능 없음(조사 (6)), 발주 흐름 부재 |
| `ProjectOperator`(유사경험·만족도·일정준수·분쟁대응·반장풀·예산관리) | 없음 | 모델·화면·role 전무 |
| `PerformerCompany` 승격(작업수행사례·보유 리더/팀·가동인력·안전이수율·하자대응·재의뢰율) | 부분 | `Company` 모델 존재(name·contact·industry·region·status) 하나 수행사례·보유팀/리더 연결·안전/하자/재의뢰 지표 없음 |
| `WorkRecord`(작업수행사례, similarWorkExperience) | 없음 | 모델 없음 |
| 후보 추천/조회 흐름(`operator_recommendation_clicked`, `performer_profile_viewed`) | 없음 | 정본 이벤트·화면 없음(현행 worker_search/worker_profile_viewed는 기업의 기술자 검색용) |
| `companyKind`(PERFORMER/OPERATOR) 구분 | 없음 | `Company`에 종류 구분 필드 없음 |

### 2-5. FieldOps(관심 7종)

| 정본 이벤트(관심) | 판정 | 근거(현행 `InterestFeature` enum / 이벤트) |
| --- | --- | --- |
| `equipment_tool_interest_clicked`(장비공구운영) | 부분 | 현행 `EQUIPMENT_RENTAL` enum + `equipment_rental_interest_clicked` — 구어휘, 정본명/통합 미적용 |
| `material_order_interest_clicked`(소모자재 반복발주) | 없음 | InterestFeature·이벤트에 자재발주 항목 없음 |
| `package_interest_clicked`(장비+기술자 패키지) | 없음 | 항목 없음 |
| `meal_lodging_interest_clicked`(식사·숙소·근무환경) | 없음 | 항목 없음 |
| `education_interest_clicked`(교육프로그램) | 없음 | 별도 관심항목 없음(Education은 본인 이력 등록일 뿐) |
| `insurance_interest_clicked`(보험·정비·보증) | 없음 | 항목 없음 |
| `smart_equipment_interest_clicked`(전문장비·스마트계측기) | 없음 | 항목 없음 |
| `field_operations_viewed`(FieldOps 진입) | 없음 | 이벤트 없음 |
| `FieldOpsInterest` 모델(7종 등록) | 부분 | `InterestRegistration`+`InterestFeature`(6값: CAREER_VERIFICATION/FINANCE_BENEFIT/EQUIPMENT_RENTAL/FOREIGN_WORKER/SAFE_PAYMENT/COMPANY_VIEW)로 다른 6종 관심만 존재, 정본 FieldOps 7종과 매핑 안 됨 |
| AI현장리더 관심(`AiLeaderInterest`/`ai_field_leader_interest_clicked`) | 없음 | 모델·이벤트 없음 |

### 2-6. 평가 · 신뢰

| 정본 요구 | 판정 | 근거 |
| --- | --- | --- |
| `Review`(raterUserId·rateeType·rateeId·workRequestId·7항목·comment) | 없음 | 모델 전무 |
| 7평가항목(일정준수·작업품질·커뮤니케이션·안전관리·비용신뢰·재의뢰의향·현장환경) | 없음 | 어떤 점수 필드도 없음 |
| 다방향 평가 매트릭스(5유형 간 rater→ratee) | 없음 | 평가 주체-대상 관계 없음 |
| `project_review_submitted` 이벤트 | 없음 | 카탈로그에 없음 |
| `TrustScore`(평가 누적 파생 점수) | 없음 | 모델·계산 로직 없음 |
| 평가→추천/매칭/신뢰점수 반영 | 없음 | 후보매칭 자체가 없어 반영 경로 부재 |

### 2-7. 관리자앱(/amono)

| 정본 요구 | 판정 | 근거(`AdminClient.tsx`/`admin.service.ts`) |
| --- | --- | --- |
| 운영 개요 대시보드 | 있음 | `GET /admin/overview` 12지표 카운트 |
| 현장리더 승인/반려 | 부분 | foreman 탭 승인(`PATCH /admin/users/:id/role`)·반려(`/foreman-reject`) 존재하나 FOREMAN 어휘, FIELD_LEADER 정본 미적용 |
| 기술자 목록 + 검증 판정 | 있음 | users 탭, `countVerifiedProfiles()` 검증 로직 |
| 작업요청(공고) 관리 | 부분 | jobposts 탭 + 상태변경(`PATCH /admin/job-posts/:id/status`) — 단 `JobPost` 기반(작업요청자/산업/예산 관리 없음) |
| 이벤트 로그 뷰어 | 있음 | events 탭, `GET /admin/events`, 카테고리 필터 |
| 작업요청자/운영자/수행기업 관리 탭 | 없음 | 신규 3유형 관리 화면 없음 |
| 후보매칭/추천 운영 | 없음 | 관련 화면·API 없음 |
| 평가/신뢰점수 모니터링 | 없음 | 화면·집계 없음 |
| 산업별 대시보드 | 없음 | 산업유형 필터/집계 없음(IndustryType 부재) |
| AI현장리더 관심 운영 | 없음 | 화면 없음 |

### 2-8. 마케팅 분석(/analys)

| 정본 요구 | 판정 | 근거(`AnalysClient.tsx`/`analytics.service.ts`) |
| --- | --- | --- |
| 개요 카드(방문·가입·프로필완성 등) | 있음 | overview 8카드 (`GET /analytics/summary`) |
| 가입 퍼널 | 있음 | `funnels.signup`(page_view→signup_started→signup_completed) |
| 기술자 프로필 퍼널 | 부분 | `funnels.profile` 존재하나 정본 퍼널의 `equipment_history_added` 단계 없고 `career_added`/`career_three_added` 혼용 |
| 기업/수요측 퍼널 | 부분 | `funnels.company`(company→jobpost→search→saved→poc) 존재하나 `WorkRequest`·후보·운영자 퍼널 아님 |
| 리텐션(코호트 1/7/14/30일) | 있음 | `retention` 윈도우 계산 |
| Aha Moment | 있음 | `aha` 4행동(profile_completed/career_three_added/certificate_added/profile_shared) |
| 관심 기능 수요 차트 | 부분 | `interest`(InterestFeature 6종) 차트 존재, FieldOps 7종/AI리더 관심 미반영 |
| 산업별 분석 | 없음 | IndustryType 부재로 산업 차원 분석 불가 |
| 평가/신뢰점수 지표 | 없음 | 데이터 없음 |
| 유형별(5종) 분석 | 부분 | role 2종만 분석 가능, CUSTOMER/OPERATOR/PERFORMER 차원 없음 |
| 산업별 PoC 리포트 자동화(P2) | 없음 | 자동 리포트 없음 |

### 2-9. 이벤트 카탈로그 대조(정본 ↔ 현행)

| 정본 이벤트명 | 판정 | 현행 상태(`analytics.ts`) |
| --- | --- | --- |
| `visit/page_view` | 있음 | `page_view` 존재 |
| `user_type_selected` | 없음 | 카탈로그에 없음 |
| `industry_selected` | 없음 | 없음(산업 온보딩 부재) |
| `signup_started`/`signup_completed`/`return_visit` | 있음 | 3종 모두 존재 |
| `profile_started`→…→`profile_completed` 퍼널 | 부분 | `profile_started/profile_basic_completed/career_added/certificate_added/profile_completed` 존재, `equipment_history_added` 정본 부재(유사 `equipment_used_added`) |
| `career_added`(퍼널 정본) vs `career_three_added`(Aha) | 있음 | 둘 다 존재(정본 분리 원칙 충족) |
| `field_leader_profile_started/completed` | 없음 | 정본명 없음(구 `foreman_profile_*`도 카탈로그 미존재) |
| `field_leader_requested` | 부분 | `foreman_requested` **호출되나 카탈로그 미등록**(`MonoApp.tsx` L466), 정본명 미적용 |
| `ai_field_leader_interest_clicked` | 없음 | 없음(구 `ai_foreman_*`도 없음) |
| `work_request_started`/`work_request_submitted` | 부분 | 유사 `workforce_request_submitted`(기업용, /mono 미발화), 정본명/주체 불일치 |
| `operator_recommendation_clicked` | 없음 | 없음(구 `pm_recommendation_clicked`도 없음) |
| `performer_profile_viewed` | 부분 | 유사 `worker_profile_viewed`(기술자 조회용)만, 수행기업 조회 이벤트 아님 |
| `field_leader_profile_viewed` | 없음 | 없음(구 `foreman_profile_viewed`도 없음) |
| `project_review_submitted` | 없음 | 없음 |
| `equipment_tool_interest_clicked` | 부분 | 구 `equipment_rental_interest_clicked` 존재, 정본명/통합 미적용 |
| `smart_equipment_interest_clicked` | 없음 | 없음 |
| `material_order_interest_clicked` | 없음 | 없음 |
| `package_interest_clicked` | 없음 | 없음 |
| `meal_lodging_interest_clicked` | 없음 | 없음 |
| `education_interest_clicked`(관심) | 없음 | `education_added`(본인이력)만 존재, 관심 이벤트 아님 |
| `insurance_interest_clicked` | 없음 | 없음 |
| `field_operations_viewed` | 없음 | 없음 |
| `team_created`/`team_member_added`/`team_availability_updated` | 부분 | `team_registered`/`team_deleted` **호출되나 카탈로그 미등록**(`MonoApp.tsx` L496/L534), `team_created` 정본명·멤버/가동 이벤트 미적용 |
| `coworker_recalled` | 부분 | **호출되나 카탈로그 미등록**(`MonoApp.tsx` L418) |
| `account_deleted` | 부분 | **호출되나 카탈로그 미등록**(`MonoApp.tsx` L548) |
| 현행 전용(정본 흡수 대상) `tool_rental_interest_clicked` 등 중복 | 부분 | 정본은 `equipment_tool_interest_clicked` 단일로 흡수 필요 |

> **카탈로그 정합성 결함 요약:** `coworker_recalled`·`foreman_requested`·`team_registered`·`team_deleted`·`account_deleted` 5종이 `MonoApp.tsx`에서 `track()`로 발화되나 `analytics.ts`의 `AnalyticsEventName` union/`EVENT_CATALOG`에 미정의 → 분석 집계 누락 + 정본화(`foreman_requested`→`field_leader_requested`, `team_registered`→`team_created`) 동시 필요.

---

## 3. 데이터 모델

본 섹션은 캐노니컬 모델 v1(5유형·11산업)을 기준으로, 현행 Prisma 스키마(`/Users/youngje.kim/Documents/mono/api/prisma/schema.prisma`, 11개 마이그레이션)에서 **추가·확장할 enum / model / 필드를 전부** 기술한다. 원칙은 **스키마는 확장형으로 한 번에, UI 노출·기능은 단계적으로**(초기=건설·인테리어 4산업 + 3유형 P0).

### 3-1. ENUM (신규 + 확장)

#### (A) `UserRole` — 확장 (값 추가 + rename)
현행: `WORKER`, `FOREMAN` (2값).

```prisma
enum UserRole {
  WORKER             // 기술자(개인 작업자) — 유지
  FIELD_LEADER       // 현장리더·팀리더 (구 FOREMAN) — 관리자 승인제
  CUSTOMER           // 작업요청자(발주측) — 신규
  PROJECT_OPERATOR   // 프로젝트/현장 운영자 (구 시행사/PM) — 신규
  PERFORMER_COMPANY  // 수행기업 (구 시공사) — 신규
}
```

- `FOREMAN → FIELD_LEADER` rename. **enum 값 rename은 PostgreSQL에서 비파괴(`ALTER TYPE ... RENAME VALUE`)** 이므로 데이터 보존. 단 Prisma 마이그레이션은 rename을 자동 감지 못 하고 `DROP + ADD`로 생성하려 할 수 있으니, **마이그레이션 SQL을 수동 편집**하여 `ALTER TYPE "UserRole" RENAME VALUE 'FOREMAN' TO 'FIELD_LEADER';`로 교체해야 한다(아래 3-4 참조).
- 하위호환 alias 정책: 앱/BFF 레이어에서 입력으로 들어오는 `FOREMAN`을 `FIELD_LEADER`로 매핑하는 어댑터를 한시적으로 둔다(DB enum에는 `FOREMAN` 미존재).

#### (B) `IndustryType` — 신규 (11값, 초기/확장 모두 정의)
```prisma
enum IndustryType {
  INTERIOR_REMODELING    // 인테리어·리모델링 (초기)
  CONSTRUCTION_FACILITY  // 건설·설비 (초기)
  SHIPBUILDING           // 조선 (초기)
  PLANT                  // 플랜트 (초기)
  MANUFACTURING_FACILITY // 제조설비 (확장)
  LOGISTICS_EQUIPMENT    // 물류장비 (확장)
  ENERGY_FACILITY        // 에너지설비 (확장)
  PORT_AIRPORT           // 항만·공항 (확장)
  PUBLIC_INFRA           // 공공인프라 (확장)
  DISASTER_RECOVERY      // 재난복구 (확장)
  SPACE_ROBOTICS         // 우주·로봇(+농업산업기계) (확장)
  ETC                    // 기타 (공통)
}
```
> 11값 전부 정의하되 초기 UI 노출은 `INTERIOR_REMODELING`, `CONSTRUCTION_FACILITY`, `SHIPBUILDING`, `PLANT` 4값. 노출 제어는 프론트 상수에서.

#### (C) `CompanyKind` — 신규 (`Company` 모델을 수행기업/운영자로 분기)
```prisma
enum CompanyKind {
  PERFORMER // 수행기업 (구 시공사) — PerformerCompany 전신
  OPERATOR  // 프로젝트/현장 운영자 (구 시행사/PM)
}
```

#### (D) `WorkRequestStatus` — 신규 (현행 `JobPostStatus`의 후속, JobPost와 공존)
```prisma
enum WorkRequestStatus {
  DRAFT      // 작성 중
  OPEN       // 후보 모집 중
  MATCHING   // 후보 검토/매칭 중
  ASSIGNED   // 수행 확정
  COMPLETED  // 완료(평가 대기)
  CLOSED     // 종료
  CANCELLED  // 취소
}
```

#### (E) `ContractType` — 신규 (계약방식)
```prisma
enum ContractType {
  DAILY    // 일급(상용)
  UNIT     // 단가/물량
  LUMP_SUM // 도급(일괄)
  MONTHLY  // 월급/상주
}
```

#### (F) `CandidateType` / `CandidateStatus` — 신규 (후보지정)
```prisma
enum CandidateType {
  PERFORMER_COMPANY // 수행기업 후보
  FIELD_LEADER      // 현장리더 후보
  TEAM              // 작업팀 후보
}

enum CandidateStatus {
  RECOMMENDED // 추천됨(시스템/운영자)
  SHORTLISTED // 후보 지정
  CONTACTED   // 접촉
  REJECTED    // 제외
  SELECTED    // 선정
}
```

#### (G) `RateeType` — 신규 (다방향 평가 피평가 대상)
```prisma
enum RateeType {
  WORKER
  FIELD_LEADER
  PERFORMER_COMPANY
  PROJECT_OPERATOR
  TEAM
  SITE_ENVIRONMENT // 기술자 → 현장환경(주체 무관)
}
```

#### (H) `FieldOpsFeature` — 신규 (Field Ops 관심 7종, `InterestFeature`와 별개)
```prisma
enum FieldOpsFeature {
  EQUIPMENT_TOOL    // 장비공구운영
  SMART_EQUIPMENT   // 전문장비·스마트계측기
  MATERIAL_ORDER    // 소모자재 반복발주
  PACKAGE           // 장비+기술자 패키지
  MEAL_LODGING      // 식사·숙소·근무환경
  EDUCATION         // 교육프로그램
  INSURANCE         // 보험·정비·보증
}
```

#### (I) `TeamAvailabilityStatus` — 신규 (팀 가동상태)
```prisma
enum TeamAvailabilityStatus {
  AVAILABLE    // 가용
  ASSIGNED     // 현장 배정됨
  PARTIAL      // 일부 가용
  UNAVAILABLE  // 불가
}
```

#### (J) `InterestFeature` — 확장 (값 추가만)
현행 6값 유지 + 확장 검토값(선택). 값 추가만이므로 비파괴.
```prisma
// 기존 6값 유지: CAREER_VERIFICATION, FINANCE_BENEFIT, EQUIPMENT_RENTAL,
//               FOREIGN_WORKER, SAFE_PAYMENT, COMPANY_VIEW
// (Field Ops 7종은 별도 FieldOpsFeature로 분리 — 본 enum 건드리지 않음)
```

> `CareerBand`, `JobPostStatus`, `ApplicationStatus`, `CompanyStatus`는 변경 없음(현행 유지).

---

### 3-2. 신규 MODEL

모든 신규 모델의 `id`는 `String @id @default(cuid())`, `createdAt DateTime @default(now())` 관례를 따른다.

#### (1) `WorkerProfile` — 기술자 확장 프로필 (User 1:1)
현행 User에 산재한 기술자 속성을 보강. 희망작업유형·유사작업경험·연락가능시간 등은 신규.
```prisma
model WorkerProfile {
  id                    String         @id @default(cuid())
  userId                String         @unique
  user                  User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  industries            IndustryType[] // 산업분야(복수)
  preferredWorkTypes    String[]       // 희망 작업유형
  similarWorkExperience String[]       // 유사작업경험 태그
  contactHours          String?        // 연락 가능 시간
  introduction          String?
  updatedAt             DateTime       @updatedAt

  @@index([userId])
}
```

#### (2) `EquipmentHistory` — 장비 이력 (현행 CareerCard.equipment 텍스트의 정규화)
```prisma
model EquipmentHistory {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name       String   // 장비/공구명
  category   String?  // 분류
  proficient Boolean  @default(false) // 운용 가능
  yearsUsed  Int?
  memo       String?
  createdAt  DateTime @default(now())

  @@index([userId])
}
```

#### (3) `FieldLeaderProfile` — 현장리더 프로필 (User 1:1)
```prisma
model FieldLeaderProfile {
  id                  String         @id @default(cuid())
  userId              String         @unique
  user                User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  primaryJobTypes     String[]       // 주요 직군
  manageableTeamSize  Int?           // 관리 가능 팀 규모
  mainWorkFields      String[]       // 주요 작업분야
  industries          IndustryType[] // 산업분야(복수)
  regions             String[]       // 투입 가능 지역
  partnerCompanyIds   String[]       // 협력 수행기업(느슨한 참조)
  contactHours        String?        // 연락 가능 시간
  updatedAt           DateTime       @updatedAt

  @@index([userId])
}
```

#### (4) `TeamAvailability` — 팀 가동일정 (Team 1:N)
```prisma
model TeamAvailability {
  id          String                 @id @default(cuid())
  teamId      String
  team        Team                   @relation(fields: [teamId], references: [id], onDelete: Cascade)
  weekStart   String                 // 주 시작일 YYYY-MM-DD
  status      TeamAvailabilityStatus @default(AVAILABLE)
  regions     String[]               // 이동 가능 지역
  urgentOk    Boolean                @default(false) // 긴급투입 가능
  assignedSiteName String?           // 배정 현장(스냅샷)
  createdAt   DateTime               @default(now())
  updatedAt   DateTime               @updatedAt

  @@unique([teamId, weekStart])
  @@index([teamId])
}
```

#### (5) `ProjectOperator` — 프로젝트/현장 운영자 프로필 (User 1:1)
```prisma
model ProjectOperator {
  id                String         @id @default(cuid())
  userId            String         @unique
  user              User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  companyId         String?        // 소속 Company(OPERATOR)
  company           Company?       @relation("OperatorCompany", fields: [companyId], references: [id], onDelete: SetNull)
  industries        IndustryType[]
  regions           String[]
  similarExperience String[]       // 유사 운영경험
  leaderPoolIds     String[]       // 보유 리더풀(느슨한 참조)
  budgetRangeMemo   String?        // 예산관리 메모
  updatedAt         DateTime       @updatedAt

  @@index([userId])
  @@index([companyId])
}
```

#### (6) `WorkRecord` — 작업수행사례 (수행기업/리더의 유사작업경험)
```prisma
model WorkRecord {
  id          String        @id @default(cuid())
  companyId   String?       // 수행기업 소유
  company     Company?      @relation(fields: [companyId], references: [id], onDelete: Cascade)
  leaderUserId String?      // 현장리더 소유(택1)
  leaderUser  User?         @relation("LeaderWorkRecord", fields: [leaderUserId], references: [id], onDelete: Cascade)
  industry    IndustryType
  title       String
  siteName    String?
  workTypes   String[]
  period      String?
  scaleMemo   String?       // 규모
  description String?
  createdAt   DateTime      @default(now())

  @@index([companyId])
  @@index([leaderUserId])
  @@index([industry])
}
```

#### (7) `WorkRequest` — 현장작업요청 (JobPost의 캐노니컬 후속, 병행 운영)
JobPost는 기업 채용공고(공급 흡수)로 잔존, WorkRequest는 발주측(CUSTOMER)/운영자(OPERATOR)의 작업요청.
```prisma
model WorkRequest {
  id            String            @id @default(cuid())
  requesterId   String            // 작성자(CUSTOMER 또는 PROJECT_OPERATOR)
  requester     User              @relation("WorkRequestOwner", fields: [requesterId], references: [id], onDelete: Cascade)
  industry      IndustryType
  workTypes     String[]          // 작업유형(복수)
  region        String[]          // 지역
  budgetMemo    String?           // 예산
  schedule      String?           // 일정
  scaleMemo     String?           // 규모
  jobTypes      String[]          // 필요 직군
  headcount     Int?              // 필요 인원
  requiredCerts String[]          // 필요 자격
  safetyConds   String?           // 안전 조건
  equipMaterial String?           // 장비/자재
  contractType  ContractType?     // 계약방식
  status        WorkRequestStatus @default(DRAFT)
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  candidates    WorkRequestCandidate[]
  reviews       Review[]

  @@index([requesterId])
  @@index([status])
  @@index([industry, status])
}
```

#### (8) `WorkRequestCandidate` — 요청 후보지정
```prisma
model WorkRequestCandidate {
  id            String          @id @default(cuid())
  workRequestId String
  workRequest   WorkRequest     @relation(fields: [workRequestId], references: [id], onDelete: Cascade)
  candidateType CandidateType
  candidateId   String          // 수행기업/리더(User)/팀의 id (타입별 해석)
  status        CandidateStatus @default(RECOMMENDED)
  score         Float?          // 매칭/추천 점수
  memo          String?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  @@unique([workRequestId, candidateType, candidateId])
  @@index([workRequestId, status])
  @@index([candidateType, candidateId])
}
```

#### (9) `Review` — 다방향 평가 (7항목)
```prisma
model Review {
  id               String       @id @default(cuid())
  raterUserId      String
  rater            User         @relation("ReviewRater", fields: [raterUserId], references: [id], onDelete: Cascade)
  rateeType        RateeType
  rateeId          String       // 피평가 주체 id (rateeType으로 해석; SITE_ENVIRONMENT는 workRequestId 사용)
  workRequestId    String?
  workRequest      WorkRequest? @relation(fields: [workRequestId], references: [id], onDelete: SetNull)
  scheduleAdherence Int?        // 일정준수
  workQuality       Int?        // 작업품질
  communication     Int?        // 커뮤니케이션
  safetyManagement  Int?        // 안전관리
  costTrust         Int?        // 비용신뢰
  rehireIntent      Int?        // 재의뢰의향
  siteEnvironment   Int?        // 현장환경만족도
  comment          String?
  createdAt        DateTime     @default(now())

  @@index([rateeType, rateeId])
  @@index([raterUserId])
  @@index([workRequestId])
}
```

#### (10) `TrustScore` — 신뢰점수 (파생/계산, P2)
```prisma
model TrustScore {
  id          String    @id @default(cuid())
  subjectType RateeType // 점수 대상 유형
  subjectId   String    // 대상 id
  score       Float     @default(0)  // 계산된 신뢰점수
  reviewCount Int       @default(0)
  breakdown   Json?     // 7항목 평균 등 세부
  computedAt  DateTime  @default(now())

  @@unique([subjectType, subjectId])
  @@index([subjectType, score])
}
```

#### (11) `FieldOpsInterest` — Field Ops 관심 7종 (InterestRegistration과 별개)
```prisma
model FieldOpsInterest {
  id        String          @id @default(cuid())
  userId    String?
  user      User?           @relation(fields: [userId], references: [id], onDelete: SetNull)
  feature   FieldOpsFeature
  props     Json?           // 산업/지역 등 맥락
  createdAt DateTime        @default(now())

  @@index([userId])
  @@index([feature])
}
```

#### (12) `AiLeaderInterest` — AI현장리더 관심
```prisma
model AiLeaderInterest {
  id            String       @id @default(cuid())
  userId        String?
  user          User?        @relation(fields: [userId], references: [id], onDelete: SetNull)
  industry      IndustryType?
  conditions    Json?        // 조건
  repeatPattern Json?        // 반복 패턴
  candidateTeamIds String[]  // 팀 후보 매칭
  createdAt     DateTime     @default(now())

  @@index([userId])
}
```

---

### 3-3. 기존 MODEL 확장 (필드 추가)

#### `User`
```prisma
// 추가 필드
industries        IndustryType[]      // 온보딩 산업유형(복수) — 신규
fieldLeaderRequested Boolean @default(false) // foremanRequested 후속 명칭(아래 마이그 주의 참조)

// 추가 역방향 관계
workerProfile      WorkerProfile?
fieldLeaderProfile FieldLeaderProfile?
projectOperator    ProjectOperator?
equipmentHistory   EquipmentHistory[]
workRecords        WorkRecord[]        @relation("LeaderWorkRecord")
workRequests       WorkRequest[]       @relation("WorkRequestOwner")
reviewsGiven       Review[]            @relation("ReviewRater")
fieldOpsInterests  FieldOpsInterest[]
aiLeaderInterests  AiLeaderInterest[]
```
- `foremanRequested`는 **컬럼 rename 비용을 피하기 위해 일단 유지**하고, 신규 `fieldLeaderRequested`를 추가하지 않고 기존 컬럼을 의미상 재사용하는 것도 가능(권장: 코드에서 `fieldLeaderRequested` getter로 래핑, 컬럼은 그대로). DB 컬럼 rename을 강행할 경우 `ALTER TABLE "User" RENAME COLUMN "foremanRequested" TO "fieldLeaderRequested";`(비파괴) 수동 SQL 필요.

#### `Company`
```prisma
// 추가 필드
companyKind   CompanyKind @default(PERFORMER) // 수행기업/운영자 구분 — 신규
industries    IndustryType[]                  // 산업분야(복수) — 기존 industry(String?)와 병행
safetyRate    Float?                          // 안전이수율
rehireRate    Float?                          // 재의뢰율
defectMemo    String?                         // 하자대응

// 추가 역방향 관계
operatorProfiles ProjectOperator[] @relation("OperatorCompany")
workRecords      WorkRecord[]
```
- 기존 `industry String?`는 자유텍스트로 잔존(파괴 금지), `industries IndustryType[]`를 신규 추가.

#### `Team`
```prisma
// 추가 필드
industries     IndustryType[] // 산업분야(복수)
workTypes      String[]       // 작업유형
avgCareerBand  CareerBand?    // 평균 경력
safetyRate     Float?         // 안전이수율
equipOperators Int?           // 장비운용 인력 수
regions        String[]       // 투입 가능 지역

// 추가 역방향 관계
availabilities TeamAvailability[]
```
> `Team.name`, `leaderId`는 그대로. 위 필드는 전부 nullable/배열 기본값이라 비파괴 추가.

> 현행 `JobPost`/`SavedWorker`/`Attendance`/`Coworker`/`Notification`/`PushSubscription`/`InterestRegistration`/`AnalyticsEvent`는 구조 변경 없음. `JobPost`는 WorkRequest와 병행 잔존.

---

### 3-4. 마이그레이션 주의

산업 표준 안전순서: **(1) enum 값 추가 → (2) 신규 테이블 생성 → (3) 기존 테이블 nullable/배열 컬럼 추가 → (4) rename은 별도 수동 SQL**. 각 단계를 별도 마이그레이션으로 쪼개면 롤백·리뷰가 쉽다.

1. **`UserRole` rename(FOREMAN→FIELD_LEADER)은 자동 생성 금지.** Prisma는 enum 멤버 rename을 인식 못 해 `DROP VALUE + ADD VALUE`로 만들려 하고, `DROP VALUE`는 PostgreSQL에서 직접 불가(사용 중 값 삭제 불가). 마이그레이션 SQL을 수동으로 다음으로 교체:
   `ALTER TYPE "UserRole" RENAME VALUE 'FOREMAN' TO 'FIELD_LEADER';`
   이후 `CUSTOMER`, `PROJECT_OPERATOR`, `PERFORMER_COMPANY`는 별도 statement로 `ALTER TYPE "UserRole" ADD VALUE ...`.
2. **enum `ADD VALUE`는 PostgreSQL <12에서 트랜잭션 내 사용 불가.** Prisma 마이그레이션은 기본 트랜잭션 래핑이므로, 같은 마이그레이션에서 추가한 enum 값을 **곧바로 같은 트랜잭션에서 DEFAULT/데이터로 사용하면 실패**할 수 있다. enum 값 추가와 그 값을 쓰는 컬럼 변경은 **마이그레이션을 분리**한다(값 추가 → 별도 마이그레이션에서 사용).
3. **`InterestFeature` 확장은 값 추가만**이면 비파괴. (현재 캐노니컬은 Field Ops 7종을 별도 `FieldOpsFeature`로 분리하므로 `InterestFeature` 자체는 미변경.)
4. **신규 enum**(`IndustryType`, `CompanyKind`, `WorkRequestStatus`, `ContractType`, `CandidateType`, `CandidateStatus`, `RateeType`, `FieldOpsFeature`, `TeamAvailabilityStatus`)은 `CREATE TYPE`이라 안전.
5. **기존 테이블 컬럼 추가는 전부 nullable 또는 배열(기본값 `'{}'`) 또는 Boolean DEFAULT** 로 설계 → 기존 행 백필 불필요, NOT NULL 충돌 없음. `Company.companyKind`만 `DEFAULT 'PERFORMER'`로 NOT NULL 가능(기존 행 안전).
6. **`foremanRequested` 컬럼**: rename을 강행하면 `ALTER TABLE ... RENAME COLUMN`(비파괴)을 수동 SQL로. 권장은 컬럼 유지 + 코드 별칭(마이그레이션 0건).
7. **`@@unique` 신규 제약**(예: `TeamAvailability(teamId, weekStart)`, `WorkRequestCandidate(workRequestId, candidateType, candidateId)`, `TrustScore(subjectType, subjectId)`): 신규 테이블이므로 충돌 데이터 없음. 기존 테이블에 unique 추가는 본 변경에 없음.
8. **느슨한 참조(`String[]` id 배열: `partnerCompanyIds`, `leaderPoolIds`, `candidateTeamIds`)**는 FK가 아니다 → 참조 무결성·onDelete 미보장. 삭제 정합성은 애플리케이션 레이어 책임(P1에서 강한 FK로 승격 여지).
9. **onDelete 정책 일관성**: 프로필/이력성(WorkerProfile, FieldLeaderProfile, ProjectOperator, EquipmentHistory, WorkRecord, TeamAvailability)은 소유자 삭제 시 `Cascade`. 로그/관심성(FieldOpsInterest, AiLeaderInterest)은 익명 보존 위해 `SetNull`(현행 InterestRegistration·AnalyticsEvent와 동일 정책). `Review.workRequest`는 `SetNull`(평가 데이터 보존), `Review.rater`는 `Cascade`.
10. **`prisma generate` 재실행 필수**(신규 모델 타입 반영). 클라우드 SessionStart 훅이 처리하나, 로컬은 `npx prisma migrate dev` 후 자동.
11. **마이그레이션 분할 권장 순서**: ① `add_canonical_enums`(신규 enum CREATE) → ② `rename_userrole_foreman`(수동 RENAME VALUE) → ③ `extend_userrole_values`(ADD VALUE 3종) → ④ `add_profile_models`(WorkerProfile/FieldLeader/Operator/EquipmentHistory) → ⑤ `add_workrequest_domain`(WorkRequest/Candidate/WorkRecord) → ⑥ `add_review_trust`(Review/TrustScore) → ⑦ `add_fieldops_ai_interest` → ⑧ `extend_existing_tables`(User/Company/Team 컬럼).

---

## 4. API (도메인별 신규·변경)

현행 NestJS는 전역 prefix 없음(컨트롤러 메서드에 절대경로 명시, `/api/*`는 프런트 BFF). 신규도 동일 관례. **라우트 매칭 순서 주의**(정적 경로를 `:id` 동적 경로보다 위에 배치).

### 4-1. Users / 프로필 도메인 (`users`)
변경:
- `POST /users/:id/field-leader-request` — 현장리더 승인 요청(구 `foreman-request` 후속; 구 경로는 alias로 한시 유지).
- `PATCH /users/:id/basic-profile` — body에 `industries: IndustryType[]` 추가(온보딩 산업유형).

신규:
- `PUT /users/:id/worker-profile` — 기술자 확장프로필(희망작업유형·유사작업경험·연락시간·산업분야) upsert.
- `POST /users/:id/equipment-history` · `GET /users/:id/equipment-history` · `DELETE /users/:id/equipment-history/:eid` — 장비 이력 CRUD.
- `PUT /users/:id/field-leader-profile` · `GET /users/:id/field-leader-profile` — 현장리더 프로필 upsert/조회.
- `PUT /users/:id/operator-profile` · `GET /users/:id/operator-profile` — 운영자 프로필 upsert/조회.

### 4-2. WorkRequest 도메인 (`work-requests`) — 신규
- `POST /work-requests` — 현장작업요청 생성(작성자 = CUSTOMER/PROJECT_OPERATOR).
- `GET /work-requests` — 목록(쿼리: `industry`, `region`, `workType`, `status`, `limit`).
- `GET /work-requests/:id` — 단건 조회.
- `PATCH /work-requests/:id` — 수정(상태 전이 포함: DRAFT→OPEN→MATCHING→ASSIGNED→COMPLETED→CLOSED/CANCELLED).
- `GET /users/:id/work-requests` — 내가 등록한 요청 목록.
- `GET /work-requests/:id/candidates` — 요청 후보 목록.
- `POST /work-requests/:id/candidates` — 후보 지정(body: `candidateType`, `candidateId`, `memo`).
- `PATCH /work-requests/:id/candidates/:cid` — 후보 상태 변경(`status`: SHORTLISTED/CONTACTED/SELECTED/REJECTED).
- `GET /work-requests/:id/recommendations` — 자동 후보추천(P2, 매칭 점수 포함).

### 4-3. Teams 도메인 (`teams`) — 확장
변경: `POST /users/:id/team` body에 `industries`, `workTypes`, `avgCareerBand`, `safetyRate`, `equipOperators`, `regions` 추가.
신규:
- `GET /users/:id/team/availability` · `PUT /users/:id/team/availability` — 팀 가동일정 조회/주간 upsert(body: `weekStart`, `status`, `regions`, `urgentOk`).
- `GET /teams` — 팀 디렉터리 조회(쿼리: `industry`, `region`, `workType`, `availability` — 후보매칭/리더풀용, P1).

### 4-4. PerformerCompany / Operator 도메인 (`companies`) — 확장
변경: `POST /companies` body에 `companyKind`(PERFORMER/OPERATOR 기본 PERFORMER), `industries`, `safetyRate`, `rehireRate` 추가.
신규:
- `GET /companies/:id/work-records` · `POST /companies/:id/work-records` · `DELETE /companies/:id/work-records/:rid` — 작업수행사례 CRUD.
- `GET /companies/:id/profile` — 수행기업 공개 프로필(작업수행사례·보유 리더/팀·안전이수율·재의뢰율 집계).
- `GET /performers` — 수행기업 디렉터리(쿼리: `industry`, `region`; 운영자/발주측 후보조회용, P1).

### 4-5. Reviews / TrustScore 도메인 (`reviews`) — 신규
- `POST /reviews` — 다방향 평가 제출(body: `rateeType`, `rateeId`, `workRequestId?`, 7항목 점수, `comment`). 제출 시 `TrustScore` 재계산 큐잉.
- `GET /reviews` — 조회(쿼리: `rateeType`, `rateeId`, `workRequestId`).
- `GET /trust-scores/:subjectType/:subjectId` — 신뢰점수 조회(파생 값, P2).

### 4-6. Field Ops / AI현장리더 관심 도메인 (`field-ops`) — 신규
- `POST /field-ops/interests` — Field Ops 7종 관심 등록(body: `feature: FieldOpsFeature`, `props`).
- `POST /ai-leader/interests` — AI현장리더 관심 등록(body: `industry`, `conditions`, `repeatPattern`).
> 기존 `POST /users/:id/interests`(InterestFeature 6종)는 유지. Field Ops 7종은 별 도메인으로 분리.

### 4-7. Events 도메인 (`events`) — 변경(카탈로그 정본화)
엔드포인트 변경 없음(`POST /events`). 단, 허용 이벤트명 카탈로그를 캐노니컬로 정본화:
- 정본 추가: `industry_selected`, `field_leader_profile_started/completed`, `ai_field_leader_interest_clicked`, `work_request_started/submitted`, `operator_recommendation_clicked`, `performer_profile_viewed`, `field_leader_profile_viewed`, `equipment_tool_interest_clicked`, `smart_equipment_interest_clicked`, `material_order_interest_clicked`, `package_interest_clicked`, `meal_lodging_interest_clicked`, `education_interest_clicked`, `insurance_interest_clicked`, `field_operations_viewed`, `team_created`/`team_member_added`/`team_availability_updated`, `field_leader_requested`, `project_review_submitted`.
- 구명 alias 매핑(서버/BFF에서 정본으로 정규화): `foreman_*→field_leader_*`, `project_request_*→work_request_*`, `pm_recommendation_clicked→operator_recommendation_clicked`, `contractor_profile_viewed→performer_profile_viewed`, `tool_rental_/equipment_/equipment_rental_interest_clicked→equipment_tool_interest_clicked`, `team_registered→team_created`, `foreman_requested→field_leader_requested`.
- **현행 미등록 5종 등재**: `coworker_recalled`, `field_leader_requested`(구 `foreman_requested`), `team_created`(구 `team_registered`), `team_deleted`, `account_deleted` → `web/lib/analytics.ts` `AnalyticsEventName` union + `EVENT_CATALOG`에 추가.

### 4-8. Admin 도메인 (`admin`) — 변경/신규
변경:
- `PATCH /admin/users/:id/role` — `role` 허용값을 5유형으로 확장(WORKER/FIELD_LEADER/CUSTOMER/PROJECT_OPERATOR/PERFORMER_COMPANY). FIELD_LEADER 승인 시 `fieldLeaderRequested(=foremanRequested)` 해제.
- `GET /admin/foreman-requests` → `GET /admin/field-leader-requests`(구 경로 alias 유지), 필터 `role:WORKER, fieldLeaderRequested:true`.
- `POST /admin/users/:id/foreman-reject` → `POST /admin/users/:id/field-leader-reject`(alias 유지).
- `GET /admin/overview` — counts에 `workRequests`, `reviews`, `performerCompanies`, `operators`, `teams`, `fieldOpsInterests` 추가.
신규:
- `GET /admin/work-requests` · `PATCH /admin/work-requests/:id/status` — 작업요청 관리/상태 변경.
- `GET /admin/reviews` — 평가 모니터링.

### 4-9. Analytics 도메인 (`analytics`) — 변경
- `GET /analytics/summary` — funnel을 캐노니컬 이벤트명으로 갱신:
  - 공통: `page_view → user_type_selected → industry_selected → signup_started → signup_completed → return_visit`.
  - 기술자 프로필: `profile_started → profile_basic_completed → career_added → certificate_added → equipment_history_added → profile_completed`(현행 `equipment_used_added`→`equipment_history_added` 정본화).
  - 작업요청(신규 퍼널): `work_request_started → work_request_submitted → candidate_shortlisted → assigned → project_review_submitted`.
  - Aha 지표 `career_three_added`는 별도 유지(퍼널의 `career_added`와 혼용 금지).

> 신규 도메인 컨트롤러 파일(권장): `api/src/work-requests/`, `api/src/reviews/`, `api/src/field-ops/`. 기존 `users`/`teams`/`companies`/`admin`/`analytics`/`events`는 확장. 캐노니컬 이벤트 정본 반영 대상: `/Users/youngje.kim/Documents/mono/web/lib/analytics.ts`.

---

## 5. 사용자앱 UI

기준 surface: `/mono` (사용자 앱 MVP — 토스/당근식 심플, 모바일 우선). 현행은 `WORKER`/`FOREMAN` 2종·단일 산업(건설) 전제. 아래는 캐노니컬 5유형·11산업 기준으로의 재편안이며, **현행 변경점**을 항목마다 명시한다. 노출은 초기 검증시장(`INTERIOR_REMODELING`·`CONSTRUCTION_FACILITY` +옵션 `SHIPBUILDING`/`PLANT`) 우선, 데이터·이벤트·enum은 확장 정본으로 설계한다.

### 5.1 유형별 온보딩 (가입 플로우 재편)

현행 온보딩은 기술자 단일 전제(이름·직군·연차·지역 4항목). 캐노니컬은 **유형 선택 → 산업 선택**을 가입 최상단에 추가한다.

| 단계 | 화면 | 입력/동작 | 이벤트 | 현행 변경점 |
| --- | --- | --- | --- | --- |
| 0 | 진입(MonoEntry 게이트) | 미로그인→로그인, 로그인+프로필없음→유형선택 | `page_view` | 게이트 분기에 "유형 미선택" 상태 추가 |
| 1 | 유형 선택 | 5종 카드 택1 (`WORKER`/`FIELD_LEADER`/`CUSTOMER`/`PROJECT_OPERATOR`/`PERFORMER_COMPANY`) | `user_type_selected` | **신규**: 현행은 유형 선택 화면 없음. 초기 노출은 WORKER·FIELD_LEADER·CUSTOMER 3종, 운영자·수행기업은 확장 단계 |
| 2 | 산업 선택 | 산업유형 택1(복수 허용 검토) | `industry_selected` | **신규**: 초기 4값만 노출, enum은 11값 정의 |
| 3 | 유형별 기본 프로필 | 유형에 맞는 항목 분기 | `signup_started`→`signup_completed` | 현행 4항목은 WORKER 경로로 유지, 타 유형은 신규 항목셋 |

유형별 3단계 분기:

| 유형 | 기본 프로필 입력 항목 | 비고 |
| --- | --- | --- |
| `WORKER` | 직군·경력연차·희망지역 + (확장) 희망작업유형·산업분야·유사작업경험 | 현행 4항목 유지 + 산업분야 추가 |
| `FIELD_LEADER` | 주요직군·관리가능 팀규모·주요작업분야·협력 수행기업·지역·연락시간 | **신규** `FieldLeaderProfile` |
| `CUSTOMER` | 발주측 기본정보·관심 산업·지역 | **신규**, 작업요청 등록이 핵심 |
| `PROJECT_OPERATOR` | 유사경험·반장풀·예산관리 범위 | 확장 단계 |
| `PERFORMER_COMPANY` | 회사·작업수행사례·보유 리더/팀 | 확장 단계, 현행 `Company` 승격 |

> 현행 `job_type_selected`·`region_selected`·`career_year_selected`는 WORKER 온보딩 세부 이벤트로 유지. `onboarding_*` 계열 유지.

### 5.2 산업 선택 화면

- 산업유형 카드 그리드. 초기 노출 4값(인테리어·리모델링 / 건설·설비 / 조선 / 플랜트), 나머지 7값은 "준비 중" 비활성 또는 미노출.
- 선택 결과는 `User.industries`(신규 `IndustryType[]` 필드)에 저장. 이후 홈·일자리·작업요청 필터의 기본값으로 사용.
- 이벤트 `industry_selected`(정본, 신규).
- **현행 변경점**: 현행에는 산업 개념 자체가 없음(건설 고정). User에 산업 필드·이 화면 신설.

### 5.3 유형별 홈

현행 홈은 단일(누적근무·예상정산·관심기능·주변일자리). 캐노니컬은 유형별로 홈 구성을 분기한다.

| 유형 | 홈 핵심 카드 | 현행 변경점 |
| --- | --- | --- |
| `WORKER` | 누적근무·예상정산(미구현 유지), 내 주변 일자리, 경력 완성도, 관심기능 | 산업 필터 반영 외 현행 유지 |
| `FIELD_LEADER` | 내 팀 가동현황, 팀 매칭 후보 작업요청, 팀 평가/신뢰점수 | **신규** |
| `CUSTOMER` | 내 작업요청 현황(후보 수·상태), 새 요청 등록 CTA, 추천 수행기업/리더 | **신규** |
| `PROJECT_OPERATOR` | 담당 요청·후보관리·공정 요약 | 확장 |
| `PERFORMER_COMPANY` | 수주 요청·보유 팀 가동·작업수행사례 노출 | 확장 |

### 5.4 하단 탭 재편

현행 5탭: 홈 / 일자리 / 경력카드 / 출역·정산 / 내 정보 (WORKER 고정). 캐노니컬은 유형별 탭셋으로 분기한다.

| 유형 | 탭 구성 | 현행 변경점 |
| --- | --- | --- |
| `WORKER` | 홈 / 일자리 / 경력카드 / 출역·정산 / 내 정보 | 현행 유지(라벨 동일) |
| `FIELD_LEADER` | 홈 / 작업요청 / 내 팀 / 출역·정산 / 내 정보 | "일자리"→"작업요청", "경력카드"→"내 팀"으로 치환 |
| `CUSTOMER` | 홈 / 작업요청 / 후보·매칭 / 평가 / 내 정보 | **신규 탭셋** (일자리·경력카드·출역 미노출) |
| `PROJECT_OPERATOR` | 홈 / 담당요청 / 후보관리 / 평가 / 내 정보 | 확장 |
| `PERFORMER_COMPANY` | 홈 / 수주 / 팀·리더 / 작업사례 / 내 정보 | 확장 |

탭 분기는 `myRole`(`/api/users/:id` 조회) 기준 렌더. FieldOps·평가·작업요청 진입점은 유형별 탭 또는 홈 카드에서 노출.

### 5.5 기술자(WORKER) 확장

현행 경력카드 항목(현장명 필수·분야·기간·역할·장비·동료·메모) 위에 캐노니컬 항목을 확장한다.

| 추가/확장 | 내용 | 모델 | 현행 변경점 |
| --- | --- | --- | --- |
| 산업분야 | 경력카드·프로필에 `IndustryType` 부여 | `CareerCard`·`WorkerProfile` | 신규 필드 |
| 희망작업유형 | 작업유형 태그 | `WorkerProfile` | 신규 |
| 유사작업경험 | `similarWorkExperience` 태그(매칭용) | `WorkRecord` | 신규 |
| 장비 이력 | 자유텍스트 → 구조화 이력 | `EquipmentHistory` | 현행 `CareerCard.equipment` 텍스트에서 분리 |
| 자격/교육 | 만료일 등 보강 | `Certificate`/`Education` | Education에 만료 추가 |

기술자 퍼널 정본(불변): `profile_started → profile_basic_completed → career_added → certificate_added → equipment_history_added → profile_completed`.
- **현행 변경점**: 현행 `equipment_used_added`는 `equipment_history_added`로 정본화(alias). `career_three_added`는 퍼널에서 분리해 Aha 지표로만 유지(`career_added`가 퍼널 정본).

### 5.6 현장리더(FIELD_LEADER) / 팀

현행 FOREMAN은 관리자 승인제 + 팀 등록(팀명·팀원행)만 존재. 캐노니컬은 `FIELD_LEADER`로 rename하고 리더 프로필·팀 속성·가동일정을 확장한다.

| 영역 | 내용 | 모델 | 현행 변경점 |
| --- | --- | --- | --- |
| 리더 프로필 | 주요직군·관리가능 팀규모·주요작업분야·협력 수행기업·지역·연락시간 | `FieldLeaderProfile` | **신규** |
| 작업팀 | 팀명·산업분야·작업유형·인원·평균경력·자격·안전이수율·장비운용인력·투입지역 | `Team`(확장) | 현행 팀은 팀명·리더·멤버만, 속성 대폭 확장 |
| 가동일정 | 주간투입·현장배정상태·긴급투입·지역이동 | `TeamAvailability` | **신규** |

이벤트: `field_leader_requested`(현행 `foreman_requested` alias), `field_leader_profile_started/completed`(현행 `foreman_*` alias), `team_created`(현행 `team_registered` 정본화)·`team_member_added`·`team_availability_updated`.
- **현행 변경점**: 승인제 흐름은 유지(`/api/users/:id/foreman-request` → 관리자 승인). enum `FOREMAN`→`FIELD_LEADER` rename(alias 하위호환). 현행 미등록 이벤트 5종을 카탈로그에 정본명으로 등재.

### 5.7 작업요청자(CUSTOMER) 플로우

현행 `/mono`에는 발주/요청 흐름이 전무(일자리는 기업 공고 소비 단방향). 캐노니컬은 작업요청 등록→후보→매칭→평가의 양방향 수요 흐름을 신설한다.

| 단계 | 화면/동작 | 이벤트 | 모델 |
| --- | --- | --- | --- |
| 1 | 작업요청 작성 시작 | `work_request_started` | `WorkRequest` |
| 2 | 산업·작업유형·지역·예산·일정·규모·필요직군/인원·자격·안전조건·장비자재·계약방식 입력 | — | `WorkRequest` |
| 3 | 요청 제출 | `work_request_submitted` | `WorkRequest`(status) |
| 4 | 후보 조회(수행기업/현장리더/작업팀) | `performer_profile_viewed`·`field_leader_profile_viewed`·`operator_recommendation_clicked` | `WorkRequestCandidate` |
| 5 | 완료 후 평가 | `project_review_submitted` | `Review` |

- **현행 변경점**: `JobPost`(기업 공고)는 `WorkRequest`의 전신이나 방향이 반대. 신규 `WorkRequest`(요청자 발신)를 도입하고 `JobPost`는 수행기업 공고로 병존/정리. 현행 `workforce_request_submitted`(기업측)는 팀단위요청 변형으로 `work_request_submitted`에 흡수.

### 5.8 Field Ops 카드

현행 관심 기능은 6종(`InterestFeature`: 경력인증·금융혜택·공구장비대여·외국인관리·안심정산·기업열람권), 홈 카드에서 클릭 등록. 캐노니컬 Field Ops 7종으로 재편한다.

| Field Ops 7종 | 정본 이벤트 | 현행 alias |
| --- | --- | --- |
| 장비공구운영 | `equipment_tool_interest_clicked` | `equipment_rental_interest_clicked` 등 통합 |
| 전문장비·스마트계측기 | `smart_equipment_interest_clicked` | 신규 |
| 소모자재 반복발주 | `material_order_interest_clicked` | 신규 |
| 장비+기술자 패키지 | `package_interest_clicked` | 신규 |
| 식사·숙소·근무환경 | `meal_lodging_interest_clicked` | 신규 |
| 교육프로그램 | `education_interest_clicked` | 신규 |
| 보험·정비·보증 | `insurance_interest_clicked` | 신규 |

진입 이벤트 `field_operations_viewed`. 등록은 `FieldOpsInterest`(현행 `InterestRegistration` 확장).
- **현행 변경점**: `InterestFeature` enum을 Field Ops 7종 체계로 확장/재매핑. 금융혜택·경력인증·안심정산 등 기존 항목은 별도 카테고리로 존치하되 Field Ops 카드는 7종으로 분리 노출.

### 5.9 평가

현행 `/mono`에 평가 기능 없음. 캐노니컬은 7항목 다방향 평가를 신설한다.
- 7항목: 일정준수·작업품질·커뮤니케이션·안전관리·비용신뢰·재의뢰의향·현장환경만족도.
- 화면: 작업요청(`WorkRequest`) 완료 후 평가 진입, 유형별 평가 대상 분기(발주측→운영/수행/리더, 리더→기술자/팀, 기술자→현장환경 등).
- 이벤트 `project_review_submitted`. 모델 `Review`(7항목 점수·comment·workRequestId), 결과는 추천/매칭·`TrustScore`에 반영.
- **현행 변경점**: 전면 신규(P1).

### 5.10 AI현장리더 관심

현행 없음. 홈/리더 surface에 "AI현장리더" 관심 카드 신설.
- 이벤트 `ai_field_leader_interest_clicked`(현행 `ai_foreman_*` alias). 모델 `AiLeaderInterest`(조건·반복패턴·팀후보매칭).
- **현행 변경점**: 전면 신규(P1, 관심 클릭 수집부터).

---

## 6. 관리자앱(/amono)

기준 surface: `/amono` (하이엔드 앱 셸 — Gold `#D4AF37` + 다크 `#111111`). 현행 5탭(overview / foreman / users / events / jobposts)에서 캐노니컬 유형5·산업11 운영 체계로 확장한다.

### 6.1 탭 재편 (현행 → 캐노니컬)

| 캐노니컬 탭 | 역할 | 현행 대응 | 현행 변경점 |
| --- | --- | --- | --- |
| Overview | 전체 집계 | overview | 유형5·산업11 분포 카드 추가 |
| 유형별 관리 | 5유형 사용자 관리 | users(WORKER/FOREMAN만) | 5유형 필터·탭 분기로 확장 |
| 산업별 관리 | 11산업 분포·필터 | 없음 | **신규** |
| 작업요청 관리 | `WorkRequest` 승인·상태·후보 | jobposts(공고만) | 요청 도메인 신규, 공고는 병존 |
| 수행기업/운영자 관리 | `PerformerCompany`·`ProjectOperator` | 없음(Company는 /partner) | **신규**(amono 편입) |
| FieldOps 관심 | 7종 관심 집계·리드 | 없음(분석에만) | **신규** |
| AI 관심 | `AiLeaderInterest` 집계 | 없음 | **신규** |
| 평가 관리 | `Review` 모니터링·신고처리 | 없음 | **신규** |
| 이벤트 로그 | 원시 이벤트 | events | 카테고리에 산업·요청·평가·FieldOps 추가 |

### 6.2 유형 5별 관리

| 유형 | 표시·관리 항목 | 현행 변경점 |
| --- | --- | --- |
| `WORKER` | 검증프로필·직군·연차·지역·경력/자격/교육·산업 | 현행 users 탭 기반 + 산업열 추가 |
| `FIELD_LEADER` | 리더 프로필·보유 팀·가동일정·승인상태 | 현행 foreman 승인 유지 + 프로필/팀 확장 |
| `CUSTOMER` | 작업요청 수·상태·매칭률 | **신규** |
| `PROJECT_OPERATOR` | 담당요청·만족도·일정준수 | **신규** |
| `PERFORMER_COMPANY` | 작업수행사례·보유 리더/팀·재의뢰율 | **신규**(현행 Company 승격 편입) |

- **현행 변경점**: 현행 users는 WORKER/FOREMAN 2종 배지만. 캐노니컬은 `role` 5종 필터 + 유형별 상세. FOREMAN 승인 흐름(`PATCH /admin/users/:id/role`, foreman-reject)은 `FIELD_LEADER`로 라벨/enum 정본화하되 동작 유지.

### 6.3 산업 11별 관리

- 산업유형별 사용자·요청·팀·수행기업 분포 표/필터. 초기 4산업 데이터 위주, 11산업 컬럼은 enum 기준 사전 정의.
- **현행 변경점**: 산업 차원 자체가 신규(현행 건설 고정).

### 6.4 작업요청 관리

- `WorkRequest` 목록: 요청자·산업·작업유형·지역·예산·일정·필요직군/인원·상태·후보 수.
- 관리 동작: 상태 변경(검토/노출/매칭/완료), 후보(`WorkRequestCandidate`) 지정 모니터링.
- **현행 변경점**: 현행 jobposts(공고 승인/마감, `PATCH /admin/job-posts/:id/status`)는 수행기업 공고로 존치. 요청(`WorkRequest`)은 신규 관리 도메인.

### 6.5 수행기업 / 운영자 관리

- `PerformerCompany`: 회사·작업수행사례·보유 리더/팀·가동인력·안전이수율·하자대응·재의뢰율.
- `ProjectOperator`: 유사경험·만족도·일정준수·분쟁대응·반장풀·예산관리.
- **현행 변경점**: 현행 `Company`는 INQUIRY~POC 상태로 /partner·일부 amono 공고에 연계. 캐노니컬은 `companyKind`(PERFORMER/OPERATOR)로 분기하여 amono에 관리 탭 편입.

### 6.6 FieldOps 관심 / AI 관심 / 평가 관리

| 탭 | 표시 항목 | 모델 | 현행 변경점 |
| --- | --- | --- | --- |
| FieldOps 관심 | 7종별 관심 수·리드(사용자·산업·시점) | `FieldOpsInterest` | 현행은 분석(/analys)에만 집계, amono 관리 신규 |
| AI 관심 | `ai_field_leader_interest_clicked` 집계·조건·매칭후보 | `AiLeaderInterest` | **신규** |
| 평가 관리 | 다방향 `Review` 7항목·신뢰점수·신고/이상치 | `Review`/`TrustScore` | **신규** |

---

## 7. 마케팅분석(/analys)

기준 surface: `/analys` (마케팅 분석 — 퍼널·리텐션·행동검증, CSS 막대 차트). 현행 단일 데이터소스(`GET /analytics/summary`)·3퍼널(signup/profile/company) 체계를 유형·산업 차원으로 확장한다.

### 7.1 전체 대시보드

| 섹션 | 현행 | 캐노니컬 확장 | 현행 변경점 |
| --- | --- | --- | --- |
| 개요 카드 | 8개(방문·가입·프로필·관심·기업·공고·관심기술자·PoC) | + 유형별 가입·산업별 가입·작업요청 수·평가 수·AI관심 | 카드 셋 확장 |
| 퍼널 | signup / profile / company | + 유형별 funnel·작업요청 funnel | 아래 7.2 |
| 리텐션·Aha | 윈도우[1,7,14,30]·Aha 4종 | 유형별 리텐션·Aha 분리 | 7.6 |
| 관심 수요 | InterestFeature 6종 | FieldOps 7종으로 재편 | 7.4 |

### 7.2 유형별 Funnel

| 유형 | 퍼널 단계 | 현행 변경점 |
| --- | --- | --- |
| 공통(진입) | `page_view → user_type_selected → industry_selected → signup_started → signup_completed → return_visit` | `user_type_selected`·`industry_selected` 단계 신규 삽입 |
| `WORKER` | `profile_started → profile_basic_completed → career_added → certificate_added → equipment_history_added → profile_completed` | 현행 profile 퍼널을 정본 단계로 갱신(equipment_history) |
| `FIELD_LEADER` | `field_leader_profile_started → field_leader_profile_completed → team_created → team_availability_updated` | **신규**(현행 foreman alias) |
| `CUSTOMER` | `work_request_started → work_request_submitted → 후보조회 → project_review_submitted` | **신규** |
| `PERFORMER/OPERATOR` | 현행 company 퍼널 계승·정본화(`performer_profile_viewed` 등) | alias 갱신 |

- **현행 변경점**: 현행 `company` 퍼널(company_signup→job_post→worker_search→worker_saved→poc) 유지하되 이벤트명 정본화. profile 퍼널의 `career_three_added`/`career_added` 혼선은 `career_added`로 단일화.

### 7.3 산업별 분석

- 산업유형(`IndustryType`)을 차원으로 가입·요청·매칭·관심을 분해. 초기 4산업 비교, 11산업 사전 정의.
- **현행 변경점**: 산업 차원 신규.

### 7.4 FieldOps 분석

- Field Ops 7종 관심 수요 가로 막대(현행 InterestFeature 6종 → 7종 재편). 진입(`field_operations_viewed`) 대비 종별 클릭 전환.
- **현행 변경점**: 현행 interest 섹션을 7종 체계로 교체, alias 통합 반영.

### 7.5 AI 분석

- `ai_field_leader_interest_clicked` 추이·산업/유형별 분해·조건 분포.
- **현행 변경점**: 전면 신규.

### 7.6 Retention

- 현행 윈도우[1,7,14,30]·코호트·`return_visit` 기반 유지. 캐노니컬은 **유형별/산업별 코호트**로 분리, Aha Moment를 유형별로(WORKER=경력3건·프로필공유, FIELD_LEADER=팀등록·가동일정, CUSTOMER=작업요청제출) 정의.
- **현행 변경점**: 현행 전체 단일 리텐션 → 유형·산업 분해. aha의 `career_three_added` 라벨은 WORKER Aha로 유지(퍼널과 분리).

---

접근성(CLAUDE.md 준수): 모든 신규 모달·오버레이는 focus trap·ESC/바깥클릭 닫기·aria-label·body scroll lock·모바일 full-screen을 적용하고, PC·모바일 웹·앱 화면에서 동작/반응형을 검증한다.

---

## 8. 이벤트 로그 작업

### 8.1 캐노니컬 이벤트 정본표 vs 현행 `analytics.ts` 정합 결과

기준: 캐노니컬 모델 §5(이벤트명 정본 결정표). 현행 `/Users/youngje.kim/Documents/mono/web/lib/analytics.ts`의 `AnalyticsEventName` union·`EVENT_CATALOG` 60종 + `MonoApp.tsx`에서 `track()`만 호출되고 카탈로그 미등록인 5종을 대조했다.

**범례**: 유지=정본과 명칭 일치, rename=구명→정본명 변경(alias 표기), 신규=정본 추가, 미등록정리=코드에서 호출되나 카탈로그에 없음 → 정본명으로 등재.

### 8.2 명칭 변경(rename) — 구명을 alias로 남기고 정본명으로 교체

| 현행 코드 이벤트명 | 정본 이벤트명 | 비고 |
| --- | --- | --- |
| `equipment_rental_interest_clicked` | `equipment_tool_interest_clicked` | FieldOps 장비공구운영 정본. 구명 alias |
| `equipment_used_added` | `equipment_history_added` | 기술자 퍼널 정본 단계명(EquipmentHistory 엔티티 정합) |
| `team_registered` (코드 미등록) | `team_created` | 팀 등록 정본 |
| `foreman_requested` (코드 미등록) | `field_leader_requested` | FOREMAN→FIELD_LEADER rename 정합 |

> 주의: 기존 코드의 관심 이벤트는 사용자앱 6종(`career_verification_*`, `finance_benefit_*` 등 `InterestFeature` 기반)으로, 캐노니컬의 **FieldOps 7종**(아래 8.4)과는 별개 체계다. 둘을 혼동하지 말 것. 현행 6종은 사용자앱 MVP 관심카드, FieldOps 7종은 확장 수요검증 surface다.

### 8.3 누락(신규 추가 필요) — 정본표에 있으나 현행 코드에 전무

공통/온보딩·요청·평가·팀·AI 영역의 정본 이벤트가 현행에 없다.

| 정본 이벤트명 | 영역 | 설명 |
| --- | --- | --- |
| `industry_selected` | 온보딩 | 산업유형 선택(IndustryType) |
| `user_type_selected` | 온보딩 | 5유형 중 선택(현행은 WORKER/FOREMAN만 암묵) |
| `field_leader_profile_started` | 현장리더 | 리더 프로필 시작 (alias: `foreman_profile_started`) |
| `field_leader_profile_completed` | 현장리더 | 리더 프로필 완료 (alias: `foreman_profile_completed`) |
| `ai_field_leader_interest_clicked` | AI | AI현장리더 관심 (alias: `ai_foreman_interest_clicked`) |
| `work_request_started` | 요청 | 현장작업요청 시작 (alias: `project_request_started`) |
| `work_request_submitted` | 요청 | 현장작업요청 제출 (alias: `project_request_submitted`; `workforce_request_submitted`는 팀단위 변형으로 흡수) |
| `operator_recommendation_clicked` | 추천 | 운영자 추천 클릭 (alias: `pm_recommendation_clicked`) |
| `performer_profile_viewed` | 조회 | 수행기업 프로필 조회 (alias: `contractor_profile_viewed`) |
| `field_leader_profile_viewed` | 조회 | 현장리더 프로필 조회 (alias: `foreman_profile_viewed`) |
| `project_review_submitted` | 평가 | 완료 평가 제출(7항목 Review) |
| `team_member_added` | 팀 | 팀 구성원 추가 |
| `team_availability_updated` | 팀 | 팀 가동일정 갱신 |
| `field_leader_requested` | 리더 | 리더 승인 신청(구 `foreman_requested`) |
| `team_deleted` (코드 미등록) | 팀 | 팀 삭제 — 카탈로그 등재 필요 |
| `account_deleted` (코드 미등록) | 재방문 | 회원 탈퇴 — 카탈로그 등재 필요 |
| `coworker_recalled` (코드 미등록) | 재방문 | 동료 재호출 — 카탈로그 등재 필요 |

### 8.4 FieldOps 관심 7종 — 정본 통일

현행 `equipment_rental_interest_clicked` 1종 + 산재한 명칭을 정본 7종으로 정리한다(BM 7종과 1:1, §11 참조).

| 정본 이벤트명 | 흡수된 구버전 alias |
| --- | --- |
| `equipment_tool_interest_clicked` | `tool_rental_interest_clicked`, `equipment_interest_clicked`, `equipment_rental_interest_clicked` |
| `smart_equipment_interest_clicked` | (신규) |
| `material_order_interest_clicked` | (동일) |
| `package_interest_clicked` | (동일) |
| `meal_lodging_interest_clicked` | (동일) |
| `education_interest_clicked` | (동일) |
| `insurance_interest_clicked` | (동일) |

진입 이벤트 `field_operations_viewed` 1종 추가.

### 8.5 유지(불변) — 정본과 일치, 변경 금지

기술자 퍼널 정본: `profile_started → profile_basic_completed → career_added → certificate_added → equipment_history_added → profile_completed` (단, `equipment_used_added`만 8.2의 rename 적용).
공통 정본: `page_view → user_type_selected → industry_selected → signup_started → signup_completed → return_visit`.

`career_three_added`는 **삭제 금지·정본 퍼널 편입 금지**: 퍼널 단계는 `career_added`만 사용하고, `career_three_added`는 **Aha Moment 전용 지표**로 분리 유지(중복 정의 금지). 현행 코드가 둘 다 보유 → 그대로 둔다.

기타 유지: `onboarding_viewed`, `onboarding_cta_clicked`, `onboarding_completed`, `job_type_selected`, `region_selected`, `career_year_selected`, `education_added`, `profile_completion_viewed`, `profile_previewed`, `profile_shared`, `pdf_downloaded`, `profile_updated`, `career_updated`, `notification_clicked`, 기업측 `company_*`·`job_post_*`·`worker_*`·`poc_interest_clicked`, work측 `job_application_submitted`·`application_accepted`·`check_in`·`check_out`.

### 8.6 작업 지시(요약)

1. `analytics.ts`의 `AnalyticsEventName` union·`EVENT_CATALOG`에 8.2 rename(구명은 deprecated 주석 alias로 남김), 8.3·8.4 신규를 추가.
2. `MonoApp.tsx`의 호출부 5종(`team_registered`, `foreman_requested`, `team_deleted`, `account_deleted`, `coworker_recalled`)을 정본명으로 교체 + 카탈로그 등재로 TS 정합 확보.
3. `career_three_added`는 퍼널에서 분리한 Aha 지표로 명시(라벨 "경력 3건 등록" 유지).
4. 신규 이벤트는 즉시 발화시키지 않아도 카탈로그·타입에 먼저 등록(확장형 정의, 노출은 단계적 — §7 정책).

---

## 9. 단계별 로드맵

### 9.1 완료(구현됨) — 스프린트 제외

4문서 P0/P1/P2 항목 중 현행 코드로 이미 충족된 것:

- 기술자(WORKER) 가입·기본프로필(직군·연차·희망지역)·경력카드·자격증·교육 등록 (사용자앱 온보딩 + `/users/:id/*` API).
- 프로필 공유(링크+QR)·공개 프로필 마스킹(`/users/:id/public`, `/p/:id`).
- 함께 일한 동료 그래프 + 재호출(Coworker + `/users/:id/recall`).
- 채용 공고 소비·지원·배정·출근/퇴근 출역(JobPost/JobApplication/Attendance).
- 알림센터·웹푸시(Notification/PushSubscription).
- 현장리더(FOREMAN) 승인제: 신청 → 관리자 승인/반려, 팀 등록/조회/삭제(Team/TeamMember).
- 관심 기능 등록 6종(InterestRegistration).
- 관리자 콘솔(/amono) 5탭 + 마케팅 분석(/analys) 퍼널·리텐션·Aha.
- 이벤트 로그 적재 파이프라인(AnalyticsEvent + `/events`).

### 9.2 남은 작업 스프린트 (의존성·난이도 S/M/L·권장순서)

권장 순서는 마이그레이션 비용 0 수렴 원칙(§7: 스키마는 확장형으로 한 번에)에 따라 **스키마/enum 확장 → 이벤트 정합 → 신규 유형 → 평가/매칭**으로 배열.

#### 스프린트 1 — 정본 스키마·enum 확장 (기반, P0)
| 작업 | 난이도 | 의존성 |
| --- | --- | --- |
| `UserRole` 확장: FOREMAN→FIELD_LEADER rename(alias), CUSTOMER·PROJECT_OPERATOR·PERFORMER_COMPANY 추가 | M | 없음 |
| `IndustryType` enum 11값 정의(노출은 초기 4값) + User.industries | S | 없음 |
| Company에 `companyKind`(PERFORMER/OPERATOR) 추가 → PerformerCompany 경로 | S | UserRole |
| JobPost→WorkRequest 정합 필드 확장(산업·계약방식·안전조건 등) | M | IndustryType |
| 이벤트 카탈로그·타입 정합(§8 전체) | S | UserRole/IndustryType |

#### 스프린트 2 — 핵심 3유형 P0 완결 (CUSTOMER·FIELD_LEADER 확장)
| 작업 | 난이도 | 의존성 |
| --- | --- | --- |
| CUSTOMER 가입·유형 선택·산업 선택 온보딩(`user_type_selected`/`industry_selected` 발화) | M | 스1 |
| 현장작업요청(WorkRequest) 등록 플로우 + `work_request_started/submitted` | L | 스1, CUSTOMER |
| FieldLeaderProfile 신규 모델 + 리더 프로필 작성/조회 | M | 스1 |
| Team 확장(산업분야·작업유형·인원·자격·안전이수율·투입지역) + TeamAvailability 신규 | M | 스1 |
| FieldOps 관심 7종 surface + 이벤트(§8.4) | S | 스1 |

#### 스프린트 3 — 확장 유형 본격화 (P1)
| 작업 | 난이도 | 의존성 |
| --- | --- | --- |
| PROJECT_OPERATOR / PERFORMER_COMPANY 프로필·대시보드 | L | 스1·2 |
| WorkRequestCandidate(후보지정) + 후보조회·추천 클릭 이벤트 | M | 스2 |
| WorkRecord(작업수행사례/유사작업경험 태그) | M | PERFORMER |
| EquipmentHistory 모델화(현행 CareerCard.equipment 텍스트 → 구조화) | S | 스1 |
| AiLeaderInterest 관심 등록 + `ai_field_leader_interest_clicked` | S | FieldLeaderProfile |
| 산업별 관리자 대시보드 | M | IndustryType |

#### 스프린트 4 — 평가·신뢰점수·자동화 (P2)
| 작업 | 난이도 | 의존성 |
| --- | --- | --- |
| Review 다방향 모델(7항목·매트릭스 §캐노니컬6) + `project_review_submitted` | L | 스3 후보/유형 |
| TrustScore 파생 계산(Review 누적) | M | Review |
| 자동 후보추천(Review·매칭 반영) | L | Review, Candidate |
| 11개 산업 전면 노출 + PoC 리포트 자동화 | M | 전 단계 |

---

## 10. MVP 완료기준 체크리스트

문서1(11항목 기준) + 문서2(완료 기준) 병합. 상태: ✅충족 / ⚠️부분 / ❌미충족.

| # | 완료기준 항목 | 상태 | 근거·남은작업 |
| --- | --- | --- | --- |
| 1 | 가입(이름+휴대폰/이메일) | ✅ | `POST /signup` 동작 |
| 2 | 기본프로필(직군·연차·희망지역) | ✅ | `basic-profile` + 온보딩 4항목 |
| 3 | 경력카드 등록(현장명 필수) | ✅ | `careers` API + 카드 surface |
| 4 | 자격증·교육 등록 | ✅ | `certificates`/`educations` |
| 5 | 프로필 공유(링크/QR)·공개 마스킹 | ✅ | `/p/:id`, `public` |
| 6 | 산업유형 선택 온보딩 | ❌ | `IndustryType` 미도입 → 스프린트1 |
| 7 | 사용자유형 선택(핵심 3종: WORKER·FIELD_LEADER·CUSTOMER) | ⚠️ | WORKER·FOREMAN만. CUSTOMER·rename → 스1·2 |
| 8 | 현장리더 프로필·작업팀 등록 | ⚠️ | Team 등록 ✅ / FieldLeaderProfile·Team 확장필드·TeamAvailability ❌ → 스2 |
| 9 | 현장작업요청 등록 | ❌ | CUSTOMER→요청 흐름 부재(현행은 기업 단방향 공고만) → 스2 |
| 10 | FieldOps 관심 7종 클릭 | ⚠️ | 관심 6종(InterestFeature) 존재하나 FieldOps 7종 정본과 별체계·1종만 일치 → 스2 |
| 11 | 이벤트 로그 + 관리자 기본 대시보드 | ⚠️ | 파이프라인·콘솔 ✅ / 신규 이벤트 정합·5종 미등록 정리 ❌ → 스1(§8) |
| 12 | 알림·웹푸시 | ✅ | (문서2) Notification/Push 동작 |
| 13 | 공고 지원·배정·출역 | ✅ | (문서2) Application/Attendance 동작 |
| 14 | 동료 그래프·재호출 | ✅ | (문서2) Coworker/recall 동작 |
| 15 | 현장리더 승인제(무단생성 차단) | ✅ | (문서2) foreman-request → 관리자 승인 |

**요약**: 15항목 중 충족 9, 부분 4, 미충족 2. **MVP 잔여 핵심 = 산업유형 선택(6)·현장작업요청 등록(9)·CUSTOMER 유형(7)·FieldOps 7종 정합(10)·이벤트 정합(11)**. 모두 스프린트 1~2에 집중 배치되어 있으며, 스1·2 완료 시 MVP 완료기준 전 항목 충족.

---

## 11. BM(수익모델)

문서3 BM 7종 요약 + FieldOps 관심 이벤트(§8.4)·데이터 의존성. 7종은 FieldOps 관심 7종과 1:1로, MVP 단계에서는 **관심 클릭 수요검증**(과금 전), 확장 단계에서 거래·구독 과금으로 전환한다.

| # | BM | 수익형태 | 대응 관심 이벤트 | 데이터 의존성 |
| --- | --- | --- | --- | --- |
| 1 | 장비·공구 운영(대여/관리) | 대여 수수료·운영료 | `equipment_tool_interest_clicked` | EquipmentTool, EquipmentHistory, TeamAvailability(투입지역·일정) |
| 2 | 전문장비·스마트계측기 | 임대·캘리브레이션 구독 | `smart_equipment_interest_clicked` | EquipmentHistory, Site(산업현장), IndustryType |
| 3 | 소모자재 반복발주 | 거래 마진·정기배송 | `material_order_interest_clicked` | Material, WorkRequest(규모·일정), Site |
| 4 | 장비+기술자 패키지 | 패키지 중개 수수료 | `package_interest_clicked` | Team, TeamAvailability, WorkRequestCandidate, EquipmentTool |
| 5 | 식사·숙소·근무환경 | 제휴 송객·중개 | `meal_lodging_interest_clicked` | WorkRequest(지역·기간), Attendance, Site |
| 6 | 교육 프로그램 | 수강료·자격 연계 | `education_interest_clicked` | Education, Certificate, WorkerProfile(직군) |
| 7 | 보험·정비·보증 | 보험 중개·보증 수수료 | `insurance_interest_clicked` | TrustScore, Review(하자대응·재의뢰율), PerformerCompany |

**공통 의존성**: 7종 모두 `FieldOpsInterest`(관심 등록) + `AnalyticsEvent`(`field_operations_viewed` 진입 + 종별 클릭)로 1차 수요를 계량. 거래 전환(과금)은 WorkRequest·매칭·Review/TrustScore 데이터가 쌓인 확장 단계(스프린트 3~4)에서 가능 — 즉 **데이터 의존상 BM 과금화는 평가·매칭(P2) 이후**다.

---

## 12. 결정 필요 사항 (오너)

1. **FOREMAN→FIELD_LEADER rename 시점**: 즉시 enum rename(마이그레이션·alias) vs MVP 후 일괄. 현행 `foremanRequested` 컬럼명·admin API·사용자앱 라벨 다수 연동 → 동시 변경 범위 승인 필요.
2. **현장작업요청(WorkRequest) 진입 주체**: CUSTOMER 신규 유형으로 별도 온보딩 신설 vs 기존 Company(기업)에 `companyKind`로 흡수. MVP 핵심 3유형(WORKER·FIELD_LEADER·CUSTOMER) 정책상 CUSTOMER 신설이 정본이나, 단기 비용상 Company 흡수안도 가능 → 택1.
3. **FieldOps 관심 체계 일원화**: 현행 사용자앱 관심 6종(`InterestFeature`)과 캐노니컬 FieldOps 7종을 통합할지 병존할지. 통합 시 `InterestFeature` enum·기존 데이터 마이그레이션·analys 화면 라벨 영향.
4. **초기 노출 산업 범위**: §7 권고는 초기 4값(인테리어·건설설비·조선·플랜트) UI 노출. 검증시장을 인테리어+건설 2값으로 더 좁힐지 결정.
5. **`career_three_added`(Aha)와 `career_added`(퍼널) 병존 확정**: 정본은 분리 유지이나, 지표 혼선 우려 시 Aha 기준을 다른 행동으로 교체할지.
6. **평가/신뢰점수(P2) 착수 트리거**: 거래·매칭 데이터가 어느 임계(요청 건수/완료 건수)에 도달하면 Review·TrustScore를 개발 착수할지 기준 수치 합의 필요(BM 과금화 선행조건).
7. **SSO(네이버·카카오·구글) 실구현 우선순위**: 현재 "곧 지원" 안내만. 가입 퍼널 전환율 영향 큼 → MVP 포함 여부 결정.
