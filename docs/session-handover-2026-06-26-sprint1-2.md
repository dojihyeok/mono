# 세션 핸드오버 — 2026-06-26 (스프린트1·2 구현)

> 본 세션은 `docs/dev-plan-master.md`(통합 개발계획서)의 **스프린트1·2(P0/MVP)** 를 구현했다. 다음 세션이 **스프린트3·4(P1/P2)** 를 바로 이어받기 위한 문서.

## 0. 한 줄 요약

캐노니컬 5유형·11산업 스키마 기반(스1) + 작업요청·현장리더·팀가동·FieldOps 백엔드 API(스2) + 사용자앱 유형선택·산업선택·CUSTOMER 작업요청 플로우·FieldOps 카드·현장리더 프로필 폼(스2 web)까지 구현·검증·커밋·푸쉬 완료. **MVP 완료기준(§10) 핵심 항목 충족.**

## 1. 커밋 목록 (전부 origin/main 푸쉬)

| 커밋 | 내용 |
| --- | --- |
| `452c947` | 스프린트1 — 캐노니컬 스키마/enum/이벤트 (UserRole 5유형·IndustryType·CompanyKind) |
| `af06b4b` | 스프린트2 백엔드 — WorkRequest·FieldLeaderProfile·TeamAvailability·FieldOps API+스키마 |
| `51c8e66` | fix — getMe 응답에 industries 포함 |
| `4eb2e49` | 온보딩 산업유형 선택 (web) |
| (본 핸드오버와 함께) | 스프린트2 web — 유형선택·CUSTOMER 작업요청·FieldOps 카드·현장리더 프로필 폼·BFF 라우트·role 자가선택 |

## 2. DB / 스키마 (`api/prisma/schema.prisma`)

**enum (신규/확장):**
- `UserRole`: `FOREMAN`→`FIELD_LEADER` **비파괴 rename**(ALTER TYPE RENAME VALUE) + `CUSTOMER`·`PROJECT_OPERATOR`·`PERFORMER_COMPANY` 추가.
- 신규: `IndustryType`(11), `CompanyKind`(PERFORMER/OPERATOR), `WorkRequestStatus`, `ContractType`, `TeamAvailabilityStatus`, `FieldOpsFeature`(7).

**신규 모델:** `WorkRequest`, `FieldLeaderProfile`(User 1:1), `TeamAvailability`(Team 1:N), `FieldOpsInterest`.

**기존 확장:** `User.industries`, `Company.companyKind`, `Team`(industries·workTypes·avgCareerBand·safetyRate·equipOperators·regions).

**마이그레이션(수동 작성, 적용·동기화 확인):**
- `20260626140000_sprint1_userrole_canonical` (RENAME VALUE + ADD VALUE)
- `20260626140100_sprint1_industry_companykind`
- `20260626140200_sprint2_workrequest_fieldleader_fieldops`
- 적용법: `prisma migrate deploy`(컨테이너 entrypoint `RUN_MIGRATIONS=1` 또는 로컬 `DATABASE_URL=postgresql://mono:mono_dev_pw@localhost:5432/mono npx prisma migrate deploy`).
- ⚠️ enum rename은 Prisma가 자동 생성 못 함 → **수동 SQL** 작성(dev-plan §3-4). `WorkRequest`의 `candidates`/`reviews` 관계는 스3·4 모델 미생성이라 **일부러 뺌**(모델 추가 시 관계 복원).

## 3. API (NestJS, `api/src/`)

**신규 모듈:** `work-requests/`(POST·GET·GET/:id·PATCH /work-requests + GET /users/:id/work-requests), `field-ops/`(POST·GET /field-ops/interests). `app.module.ts`에 배선됨.

**확장:** `users` — PUT·GET /users/:id/field-leader-profile, POST /users/:id/field-leader-request(foreman-request alias), `basic-profile`에 `industries` + `role`(자가선택 WORKER/CUSTOMER만, FIELD_LEADER는 관리자 승인 유지) + `jobType` 선택화(CUSTOMER는 직군 없음). `teams` — GET·PUT /users/:id/team/availability + 팀 등록 body 프로필 필드.

**런타임 스모크 통과:** 작업요청 생성/목록, field-ops 등록/목록, field-leader-profile upsert, team availability, 404 precheck, basic-profile industries 영속.

## 4. Web (`web/`)

**온보딩 재편(`app/mono/MonoEntry.tsx`):** 로그인 → **유형선택(WORKER/FIELD_LEADER/CUSTOMER, §5.1)** → 유형별 분기.
- WORKER/FIELD_LEADER → 기존 `ProfileSetup`(직군·경력·지역 + **산업선택**) → `MonoApp`.
- CUSTOMER → `CustomerProfileSetup`(이름·산업·지역, 직군 없음) → **`CustomerApp`**.
- 게이트는 localStorage `mono.userType` + `user.role` 기준. 레거시(직군 보유) 사용자는 유형선택 건너뜀.

**신규 `app/mono/CustomerApp.tsx`:** CUSTOMER 전용 화면(거대 MonoApp 무수술 분리). 내 작업요청 현황 + 새 작업요청 폼(산업·지역·작업유형·인원·일정·계약방식·예산·안전조건) + FieldOps 7카드. 이벤트 `work_request_started/submitted`, `field_operations_viewed`, FieldOps 7종.

**`MonoApp.tsx`:** '내 정보' 탭에 현장리더(FIELD_LEADER) 프로필 폼 시트 추가(§5.6). 이벤트 `field_leader_profile_started/completed`.

**BFF 라우트(신규):** `/api/work-requests`, `/api/users/[id]/work-requests`, `/api/field-ops/interests`, `/api/users/[id]/field-leader-profile`.

**lib:** `constants.ts`(INDUSTRIES 4노출·FIELDOPS_FEATURES 7), `apiClient.ts`(작업요청·FieldOps·리더프로필 함수 + basic-profile role/jobType 조건화), `analytics.ts`(이벤트 다수), `types.ts`(WorkRequest·FieldLeaderProfile·User.industries·role 5유형).

**검증:** `tsc --noEmit` EXIT 0, `next build` Compiled successfully(lint+types 통과), `/mono` 200.

## 5. 이벤트 (`web/lib/analytics.ts`)

추가됨: `user_type_selected`·`industry_selected`·`work_request_started/submitted`·`field_operations_viewed`·FieldOps 7종(`equipment_tool_interest_clicked` 등)·`field_leader_profile_started/completed`·미등록 5종 정리(`field_leader_requested`·`team_created`·`team_deleted`·`coworker_recalled`·`account_deleted`).
- **FieldOps 6 vs 7 = 병존 채택**(오너결정 #3): §5.8 "기존 항목 존치 + Field Ops 카드 7종 분리"에 근거. 기존 관심 6종(InterestFeature) 미변경, FieldOps 7종(FieldOpsFeature) 별 체계 신설.
- ⚠️ **서버/BFF 이벤트 alias 정규화(§4-7)는 미구현** — 현행은 web `track()`만, 서버측 카탈로그 검증 없음.

## 6. MVP 완료기준(§10) 현재 상태

✅ 충족으로 이동: #6 산업유형 선택, #7 CUSTOMER 유형(자가선택), #9 현장작업요청 등록(풀스택), #8 FieldLeaderProfile(API+폼), #10 FieldOps(API+카드), #11 이벤트(부분→상당). 스1·2로 P0/MVP 핵심 완료.

## 7. 다음 작업 — 스프린트3·4 (P1/P2), `docs/dev-plan-master.md §9.2`

**스프린트3 (P1):**
- enum 신규: `CandidateType`·`CandidateStatus`·`RateeType`. 모델: `WorkRequestCandidate`(후보매칭)·`WorkRecord`·`EquipmentHistory`·`ProjectOperator`·`AiLeaderInterest`·`WorkerProfile`.
- API: §4-2 후보(candidates/recommendations)·§4-4 companies(companyKind/work-records/performers)·§4-6 ai-leader·§4-1 worker-profile/equipment-history/operator-profile.
- web: PROJECT_OPERATOR·PERFORMER_COMPANY 프로필/대시보드, 후보조회, AI현장리더 관심 카드, 기술자 확장(산업·장비이력).
- `WorkRequest` 모델에 `candidates`/`reviews` 역관계 복원(현재 생략됨).

**스프린트4 (P2):**
- 모델: `Review`(7항목)·`TrustScore`. API §4-5 reviews/trust-scores. web 평가 화면(§5.9). 자동 후보추천. 11산업 전면 노출(현재 프론트 4값 노출 — `web/lib/constants.ts` INDUSTRIES 확장). PoC 리포트 자동화.

**곁가지(아무 때나):**
- admin §4-8: role 5유형 UI 확장, `foreman-requests`→`field-leader-requests` 경로 rename(alias), overview counts에 workRequests/reviews/teams 등 추가. (현행 `/amono` AdminClient는 FIELD_LEADER 승인만 갱신됨.)
- analytics §4-9: 퍼널을 캐노니컬 이벤트명으로 갱신, `equipment_used_added`→`equipment_history_added` rename.
- 서버측 이벤트 카탈로그 정본화 + alias 정규화(§4-7).
- §5.4 유형별 탭 전면 재편(현재 CUSTOMER는 분리된 `CustomerApp` 단일화면, FIELD_LEADER는 MonoApp+리더폼). 후보·매칭/평가 탭은 스3·4 모델 도입 후.

## 8. 오너 결정 (dev-plan §12)

- #3 FieldOps 6 vs 7 = **병존으로 결정·구현됨**(§5.8 근거).
- 미결: #1 FOREMAN rename 범위(→ **즉시 rename 채택·구현됨**, alias 정책은 서버측 미반영), #2 WorkRequest 진입주체(→ **CUSTOMER 신설 채택·구현**), #4 초기 산업 노출 4값(채택), #5 `career_three_added` Aha 병존(유지), #6 평가/TrustScore 착수 트리거(스4 전 합의 필요).

## 9. 환경 / 검증 / gotcha

- **api**: Docker(`mono-api` :8000). 코드 변경 시 `docker compose up -d --build api`(entrypoint가 `migrate deploy` 재실행, idempotent). DB `mono-db` postgres :5432 (`mono`/`mono_dev_pw`/`mono`).
- **web**: `cd web && npm run dev`(:3000). `next build`로 lint+type 검증.
- **DB 거의 비어있음**(이전 세션 계정 전체 삭제). 데모 데이터는 스모크 중 일부 생성됨.
- `MonoApp.tsx`는 `// @ts-nocheck` → tsc가 검증 안 함. 런타임 스모크 필수.
- 색·스타일: 인디고 `#4f46e5` 단일(var `--c1`). 신규 화면도 이 토큰 재사용.
- 마이그레이션 수동 SQL 관례: 비파괴(ADD VALUE/CREATE TYPE/ADD COLUMN nullable) 우선, rename은 `ALTER TYPE ... RENAME VALUE`/`RENAME COLUMN` 수동.
- 작업 기록은 `WORKLOG.md`(작업일 기준). 슬랙 공유 `scripts/slack-notify.sh`(수동).

## 10. 스탠딩 노트

- 존댓말. 색/문구/유형은 추측 말고 오너 지정값 확인.
- 스키마는 확장형으로 한 번에, 노출·기능은 단계 노출(dev-plan §7). 死enum/모델 선생성 금지 — 쓰는 스프린트에서 생성(스1·2도 이 원칙으로 7 enum·8 모델 보류).
