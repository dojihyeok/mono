# MONO API 명세서

> 백엔드: **NestJS + Prisma** (`api/`), 포트 8000. 전역 `ValidationPipe`(whitelist·forbidNonWhitelisted·transform).
> 연동: 브라우저는 직접 호출하지 않고 **Next BFF**(`web/app/api/*`)를 경유 → 이 api 로 포워딩.
> 갱신: 2026-06-28 (스프린트2~4 캐노니컬 확장 + 외국인 기술인력 엔드포인트 반영)

| 항목 | 값 |
|---|---|
| Base URL(로컬) | `http://localhost:8000` |
| Base URL(컨테이너 내부) | `http://api:8000` (web 컨테이너 env `API_URL`) |
| 인증 | 현재 없음 — `userId`(cuid)를 경로로 전달. (추후 세션/Redis) |
| 컨텐츠 타입 | `application/json` |
| ID 형식 | cuid 문자열 |
| 공통 에러 | 400 `{statusCode,message[],error}` · 404 `{statusCode,message}` |

---

## 1. 사용자 · 프로필 (`users`)

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/signup` | 가입(멱등 — 같은 phone/email 시 기존 회원 반환) |
| GET | `/users/:id` | 본인 프로필(역할·승인 여부·industries 포함) — 권한 게이트용 |
| DELETE | `/users/:id` | 회원 탈퇴(User 삭제 + 연관 cascade, 멱등) |
| PATCH | `/users/:id/basic-profile` | 기본 프로필(이름·역할·직군·경력·지역·산업유형·residency) |
| POST | `/users/:id/foreman-request` | 현장리더 승인 요청(대기) |
| POST | `/users/:id/field-leader-request` | 현장리더 승인 요청(별칭/캐노니컬) |
| GET·PUT | `/users/:id/field-leader-profile` | 현장리더 프로필 조회/업서트 §3-2(3) |
| GET·PUT | `/users/:id/worker-profile` | 기술자 확장 프로필(외국인 속성 포함) 조회/업서트 §3-2(1) |
| GET·PUT | `/users/:id/operator-profile` | 운영자 프로필 조회/업서트 §3-2(5) |
| POST·GET | `/users/:id/equipment-history` | 장비 이력 등록/목록 §3-2(2) |
| DELETE | `/users/:id/equipment-history/:eid` | 장비 이력 삭제 |
| POST·GET | `/users/:id/visa` | 체류·비자 이력 등록/목록 (PDF §6) |
| POST·GET | `/users/:id/documents` | 서류 업로드(메타)/목록 (PDF §6-3) |
| POST | `/users/:id/certificates` | 자격증 등록 |
| POST | `/users/:id/careers` | 현장 경력 등록 |
| POST | `/users/:id/educations` | 교육 이력 등록 |
| POST | `/users/:id/interests` | 관심 기능 신청(멱등) |
| GET | `/users/:id/public` | 공개 프로필(민감정보 제외) — `/p/:id`용 |

**PATCH /users/:id/basic-profile** — `name?` · `role?`(`UserRole`) · `jobType`(✅ 1+) · `careerYears?`(`CareerBand`) · `region`(✅ 1+) · `industries?`(`IndustryType[]`) · `residency?`(`Residency`). → **200** `User`.
**POST /users/:id/careers** — `siteName`(✅) · `field?` · `startDate?` · `endDate?` · `role?` · `equipment?` · `coworkers?` · `memo?`. → **201**.
**POST /users/:id/visa** — `visaType`(✅ `VisaType`) · `expiryDate?` · `renewalDueDate?` · `workScope?` · `workplaceChangeable?` · `arcNumber?`(민감). → **201**.

---

## 2. 팀 · 현장리더 (`teams`)

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/teams` | 팀 목록(관리/검색) |
| GET | `/users/:id/team` | 내 팀(리더) 조회 — 없으면 `null` |
| POST | `/users/:id/team` | 팀 등록(멤버 일괄, 리더당 1개 get-or-create) |
| DELETE | `/users/:id/team` | 팀 삭제(TeamMember cascade) |
| GET·PUT | `/users/:id/team/availability` | 팀 가동일정 조회/업서트 §3-2(4) |

**POST /users/:id/team** (id=리더) — `name`(✅) · `members?:[{name,phone}]`(연락처 멱등 가입 후 링크) · 산업/작업유형 등 팀 메타. → `{id,name,leaderId,memberCount,members[]}`. 단 `role=FIELD_LEADER`만(아니면 403).

---

## 3. 동료 그래프 · 재호출 (`coworkers`)

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/users/:id/coworkers` | 함께 일한 동료 목록(최근순) |
| POST | `/users/:id/recall` | 동료 재호출 — Body `coworkerId`(✅), 엣지 없으면 404 |

- 동료 엣지는 같은 공고 **ACCEPTED** 사용자끼리 자동 형성(`applications` setStatus 훅).

---

## 4. 지원 · 배정 · 출역 (`applications`)

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/job-posts/:jobPostId/apply` | 공고 지원(멱등) — Body `{userId}` |
| GET | `/users/:userId/applications` | 내 지원 목록 |
| GET | `/users/:userId/assignments` | 배정(ACCEPTED) 현장 + 출역 |
| GET | `/companies/:companyId/applications` | 기업: 우리 공고 지원자 |
| PATCH | `/applications/:id/status` | 기업: 수락/반려 — Body `{status}` |
| POST | `/applications/:id/checkin` | 출근 체크인 — Body `{workDate?}` |
| POST | `/applications/:id/checkout` | 퇴근 체크아웃 |

- `status=ACCEPTED` 시 동료 그래프 엣지 자동 형성(`linkCoassigned`, throw 안 함). CLOSED 공고 지원 거부.

---

## 5. 알림 · 웹푸시 (`notifications`)

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/users/:id/notifications` | 알림 목록(최근 50) |
| GET | `/users/:id/notifications/unread-count` | 미읽음 수 `{count}` |
| POST | `/users/:id/notifications/read-all` | 모두 읽음 |
| PATCH | `/notifications/:nid/read` | 단건 읽음 |
| GET | `/push/vapid-public-key` | VAPID 공개키 `{key}`(미설정 null) |
| POST·DELETE | `/users/:id/push-subscription` | 구독 저장/해제 — Body `{endpoint,p256dh,auth}` / `{endpoint}` |

- 공고 **OPEN** 승인 시 `notifyMatchingUsers`(직군∩·지역∩·경력≥ DB where) → `JOB_MATCH` 알림(멱등) + 푸시(fire-and-forget). VAPID 미설정 시 인앱만.

---

## 6. 이벤트 로그 (`events`)

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/events` | 행동 이벤트 적재 — `name`(✅) · `userId?` · `props?` (카탈로그 `web/lib/analytics.ts`) |

---

## 7. 기업 · 공고 (`companies`)

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/companies` | 기업 등록(문의) |
| POST | `/companies/login` | 기업 로그인 |
| GET | `/companies/:id` | 기업 조회 |
| GET | `/companies/:id/profile` | 기업 상세 프로필(지표 포함) |
| GET | `/performers` | 수행기업 목록(후보 풀) |
| GET | `/foreign-workers` | 외국인 기술인력 목록(`residency=OVERSEAS` 필터) |
| POST·GET | `/companies/:id/work-records` | 작업수행사례 등록/목록 §3-2(6) |
| DELETE | `/companies/:id/work-records/:rid` | 작업수행사례 삭제 |
| POST·GET | `/companies/:id/job-posts` | 공고 등록/우리 공고 목록 |
| DELETE | `/companies/:id/job-posts/:postId` | 공고 삭제 |
| POST | `/companies/:id/saved` | 인재 관심 저장 |
| DELETE | `/companies/:id/saved/:userId` | 관심 해제 |
| GET | `/companies/:id/saved` | 관심 인재 목록 |
| GET | `/job-posts` | 공개 공고 목록(OPEN) — 사용자앱 일자리 탭 |
| GET | `/workers` | 인재 검색(기업용) |

---

## 8. 현장작업요청 (`work-requests`)

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/work-requests` | 작업요청 작성 (CUSTOMER/PROJECT_OPERATOR) |
| GET | `/work-requests` | 작업요청 목록(필터: industry·status) |
| GET | `/work-requests/:id` | 작업요청 상세 |
| PATCH | `/work-requests/:id` | 작업요청 수정/상태변경 |
| GET | `/users/:id/work-requests` | 내가 작성한 작업요청 |
| GET | `/work-requests/:id/candidates` | 후보 목록 §3-2(8) |
| POST | `/work-requests/:id/candidates` | 후보 지정 |
| PATCH | `/work-requests/:id/candidates/:cid` | 후보 상태 변경(SHORTLISTED/SELECTED 등) |
| GET | `/work-requests/:id/recommendations` | 시스템 추천 후보(매칭) |

---

## 9. Field Ops · AI현장리더 (`field-ops`)

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST·GET | `/field-ops/interests` | Field Ops 관심 7종 등록/목록 — `feature`(`FieldOpsFeature`)·`props?` |
| POST·GET | `/ai-leader/interests` | AI현장리더 관심 등록/목록 §3-2(12) |

---

## 10. 평가 · 신뢰점수 (`reviews`)

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/reviews` | 다방향 평가 작성(7+1항목) §3-2(9) |
| GET | `/reviews` | 평가 목록(rateeType·rateeId·workRequestId 필터) |
| GET | `/trust-scores/:subjectType/:subjectId` | 신뢰점수 조회(파생) §3-2(10) |

---

## 11. 정산 (`settlements`)

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/settlements` | 정산 생성(항목 포함) PDF §7 |
| GET | `/settlements` | 정산 목록(workerId/companyId 필터) |
| GET | `/settlements/:id` | 정산 상세(항목) |
| POST | `/settlements/:id/dispute` | 정산 이의제기(상태 DISPUTED) |

---

## 12. 교육 이수 (`training`)

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET·POST | `/users/:id/training` | 교육 이수 목록/등록 — `kind`(`TrainingKind`)·`title` (PDF §6-2) |
| DELETE | `/users/:id/training/:tid` | 교육 이수 삭제 |

---

## 13. 현장 용어 사전 (`glossary`)

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/glossary` | 용어 목록(category·industry 필터) PDF §4 |
| GET | `/glossary/packs/:industry` | 산업별 용어팩 |
| POST | `/glossary` | 용어 등록(번역 포함, 관리/시딩) |

---

## 14. 리스크 신고 (`risk`)

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/risk-reports` | 신고 접수 — `kind`(`RiskReportKind`)·`detail?` (PDF §8-4) |
| GET | `/risk-reports` | 신고 목록(status·kind 필터) |
| PATCH | `/risk-reports/:id/status` | 처리 상태 변경 |

---

## 15. 파트너 연계 (`referrals`)

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/referrals` | 행정·노무 파트너 연계 신청 — `kind`(`PartnerReferralKind`) (PDF §2·§6) |
| GET | `/referrals` | 연계 신청 목록(status 필터) |

---

## 16. 관리자 (`admin`, prefix `/admin`)

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/admin/overview` | 운영 현황 요약(가입·검증프로필·승인대기 등) |
| GET | `/admin/users` | 회원 목록(`?limit`) |
| GET | `/admin/events` | 이벤트 목록(`?name&limit`) |
| GET | `/admin/job-posts` | 공고 목록 |
| PATCH | `/admin/job-posts/:id/status` | 공고 상태 변경 — **OPEN 시 매칭 알림 발화** |
| PATCH | `/admin/users/:id/role` | 현장리더 승인/해제 — Body `{role}` |
| GET | `/admin/foreman-requests` | 현장리더 승인 대기 목록 |
| POST | `/admin/users/:id/foreman-reject` | 현장리더 신청 반려 |
| GET | `/admin/work-requests` | 작업요청 목록(운영) |
| PATCH | `/admin/work-requests/:id/status` | 작업요청 상태 변경 |
| GET | `/admin/reviews` | 평가 목록(운영) |
| GET | `/admin/poc-report` | PoC 리포트(분석) |
| GET | `/admin/expiring-visas` | 만료 임박 비자 목록 (외국인) |
| GET | `/admin/pending-documents` | 검토 대기 서류 목록 (외국인) |
| GET | `/admin/foreign-report` | 외국인 인력 현황 리포트 |
| GET | `/admin/fieldops-interests` | Field Ops 관심 수요 집계 |
| GET | `/admin/ai-interests` | AI현장리더 관심 수요 집계 |
| GET | `/admin/operators` | 운영자 목록 |

> **현장리더 승인 흐름**: 기술자가 `POST /users/:id/foreman-request`(또는 `field-leader-request`) → `/amono`에서 관리자 승인(`PATCH role FIELD_LEADER`)/반려(`foreman-reject`). 팀 생성은 `role=FIELD_LEADER`만(아니면 403).

---

## 17. 분석 (`analytics`, prefix `/analytics`)

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/analytics/summary` | 퍼널·리텐션 등 분석 요약(분석웹 `/analys`) |

---

## BFF 매핑 (web → api)

브라우저는 `web/app/api/*`(Next Route Handler)를 호출 → 동일/대응 경로로 api 포워딩(`API_URL`). 관리자 라우트는 `web/app/api/admin/*`가 `/admin/*`로 매핑. 일부 BFF 경로는 외국인 운영 화면용 별칭(`/api/admin/expiring-visas` → `/admin/expiring-visas` 등).

> 인증/인가 미구현 — 추후 세션(Redis)으로 `userId`를 경로 대신 세션에서 추출(보안 강화).
