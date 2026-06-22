# MONO API 명세서

> 백엔드: **NestJS + Prisma** (`api/`), 포트 8000. 전역 `ValidationPipe`(whitelist·forbidNonWhitelist·transform).
> 연동: 브라우저는 직접 호출하지 않고 **Next BFF**(`web/app/api/*`)를 경유 → 이 api 로 포워딩.
> 갱신: 2026-06-21

| 항목 | 값 |
|---|---|
| Base URL(로컬) | `http://localhost:8000` |
| Base URL(컨테이너 내부) | `http://api:8000` |
| 인증 | (현재 없음 — 추후 세션/Redis. 지금은 `userId`를 경로로 전달) |
| 컨텐츠 타입 | `application/json` |
| ID 형식 | cuid 문자열 |

BFF 매핑(web → api):
| 브라우저 호출(web) | api |
|---|---|
| `POST /api/signup` | `POST /signup` |
| `PATCH /api/users/:id/basic-profile` | `PATCH /users/:id/basic-profile` |
| `POST /api/events` | `POST /events` |
| `POST /api/users/:id/certificates` * | `POST /users/:id/certificates` |
| `POST /api/users/:id/educations` * | `POST /users/:id/educations` |
| `POST /api/users/:id/interests` * | `POST /users/:id/interests` |
> * BFF 라우트는 UI 연동 단계에서 추가 예정(api 엔드포인트는 구현·검증 완료).

---

## 1. GET /health
헬스체크.
- **200** `{ "status": "ok" }`

---

## 2. POST /signup
회원 가입. **idempotent** — 같은 phone/email 이 있으면 기존 회원 반환(중복가입 방지).
- **Body**
  | 필드 | 타입 | 필수 | 비고 |
  |---|---|---|---|
  | name | string | ✅ | 최소 1자 |
  | phone | string | △ | email 없으면 필수 |
  | email | string(email) | △ | phone 없으면 필수 |
- **201** `User` 객체 (`id, name, phone, email, jobType, careerYears, region, createdAt, updatedAt`)
- **400** name 누락 / phone·email 둘 다 없음 / email 형식 오류
- 예시
  ```json
  // req
  { "name": "홍길동", "phone": "010-1234-5678" }
  // res 201
  { "id": "cmq…", "name": "홍길동", "phone": "010-1234-5678", "email": null, ... }
  ```

---

## 3. PATCH /users/:id/basic-profile
기본 프로필(직군·경력·지역) 갱신.
- **Path**: `id` = 회원 cuid
- **Body**
  | 필드 | 타입 | 필수 |
  |---|---|---|
  | jobType | string[] | ✅ (1개 이상) |
  | careerYears | enum `CareerBand`(UNDER_1Y/Y1_3/Y3_5/Y5_10/OVER_10Y) | ✅ |
  | region | string[] | ✅ (1개 이상) |
- **200** 갱신된 `User`
- **400** careerYears 가 enum 값이 아님 / jobType·region 이 빈 배열 등
- **404** 회원 없음

---

## 4. POST /users/:id/certificates
자격증 등록 (DB: Certificate, FK userId).
- **Path**: `id` = 회원 cuid
- **Body**: `name`(✅, ≥1자), `licenseNo`(✅, ≥1자 — 발급번호), `issuer`(선택), `issuedAt`(선택, "YYYY-MM" 등 → Date 변환)
- **201** `Certificate`  ·  **404** 회원 없음

---

## 5. POST /users/:id/educations
교육 이력 등록 (DB: Education, FK userId).
- **Body**: `title`(✅), `institute`(선택), `completedAt`(선택)
- **201** `Education`  ·  **404** 회원 없음

---

## 6. POST /users/:id/interests
관심 기능 등록 (DB: InterestRegistration, FK userId). **idempotent**(동일 feature 중복 미생성).
- **Body**: `feature`(✅, enum `InterestFeature`: CAREER_VERIFICATION/FINANCE_BENEFIT/EQUIPMENT_RENTAL/FOREIGN_WORKER/SAFE_PAYMENT/COMPANY_VIEW)
- **201** `InterestRegistration`  ·  **400** feature enum 오류  ·  **404** 회원 없음

---

## 7. POST /events
행동 이벤트 적재 (DB: AnalyticsEvent). 분석/대시보드용.
- **Body**
  | 필드 | 타입 | 필수 | 비고 |
  |---|---|---|---|
  | name | string | ✅ | 이벤트명(카탈로그: `web/lib/analytics.ts` EVENT_CATALOG) |
  | userId | string | 선택 | 없으면 익명 |
  | props | object | 선택 | 부가 속성 |
- **201** `AnalyticsEvent`
- 대표 이벤트: `signup_started`, `signup_completed`, `job_type_selected`, `career_year_selected`, `region_selected`, `onboarding_completed`, `certificate_added`, `education_added`, `interest_submitted`, `career_verification_interest_clicked` 등 (전체 4분류 33종)

---

## 공통
- **검증 실패 400**: `{ "statusCode":400, "message":[...], "error":"Bad Request" }`
- **미존재 404**: `{ "statusCode":404, "message":"User <id> not found" }`
- 인증/인가: 미구현 — 추후 세션(Redis)으로 `userId`를 경로 대신 세션에서 추출(보안).
