# MONO 아키텍처

> 현장 전문가용 핀테크·경력관리 슈퍼앱. 모노레포(web + api) + Postgres + Redis, 로컬은 Docker Compose, 이후 AWS EKS 이관.
> 작성 기준: 2026-06-20 / 백엔드 **잠정 채택 = NestJS(TS)** (FastAPI 안은 `feat/api-fastapi` 브랜치 보존, 팀장 결정 대기).

---

## 1. 한눈에

| 영역 | 선택 |
| --- | --- |
| 프론트(web) | Next.js 14 (App Router) · TypeScript · CSS Modules(Tech-Blue 토큰) · Framer Motion · **하이브리드 웹+PWA** |
| 백엔드(api) | **NestJS 10 + Prisma 5** (TypeScript) |
| DB | PostgreSQL 16 |
| 캐시/세션 | Redis 7 (세션·OTP·레이트리밋 — 인증 단계에서 사용) |
| 로컬 인프라 | Docker Compose (OrbStack) |
| 배포 목표 | AWS EKS (RDS/Aurora + ElastiCache) |
| 연동 패턴 | **BFF** (브라우저 → Next `/api/*` → api) |

---

## 2. 시스템 구성도

```
                 ┌─────────────────────────────────────────────┐
   브라우저/PWA  │  web : Next.js (TS, 하이브리드 웹+PWA)        │  :3000
   ───────────▶ │   - 화면(React)                              │
   (same-origin) │   - BFF 라우트 핸들러 /api/*  ── 서버측 ──┐   │
                 └──────────────────────────────────────────┼──┘
                                                             │ HTTP (서버→서버)
                                                             ▼
                                   ┌──────────────────────────────────┐
                                   │  api : NestJS + Prisma (TS)       │  :8000
                                   │   /signup /users/:id/basic-profile│
                                   │   /events /health                 │
                                   └───────────────┬──────────────────┘
                                                   │ Prisma
                          ┌────────────────────────┴───────────┐
                          ▼                                     ▼
                ┌───────────────────┐                 ┌───────────────────┐
                │ PostgreSQL 16     │ :5432           │ Redis 7           │ :6379
                │ (영속 소스 오브   │                 │ (세션/OTP/캐시 —  │
                │  트루스)          │                 │  추후 인증 단계)  │
                └───────────────────┘                 └───────────────────┘

   (추후) ai : Python 챗봇 서비스 — 필요 시 별도 서비스로 추가(polyglot)
```

**핵심:** 브라우저는 **Next(web)만** 호출(동일 출처). api는 Next 서버가 호출하므로 **브라우저에 직접 노출되지 않고 CORS도 불필요**(BFF). EKS에서는 api를 클러스터 내부 전용으로 둘 수 있음.

---

## 3. 구성요소

| 서비스 | 기술 | 포트 | 실행(로컬) | 역할 |
| --- | --- | --- | --- | --- |
| **web** | Next.js 14 / TS | 3000 | `npm run dev` (네이티브, 핫리로드) | 화면 + BFF |
| **api** | NestJS 10 + Prisma 5 / TS | 8000 | Docker 컨테이너 | 비즈니스 로직 · DB 접근 · (추후)인증 |
| **db** | PostgreSQL 16 | 5432 | Docker 컨테이너 | 영속 데이터 |
| **redis** | Redis 7 | 6379 | Docker 컨테이너 | 세션/OTP/캐시(예정) |

> web은 UI 변경이 잦아 **네이티브 dev**로 실행(핫리로드). 백엔드(db/redis/api)는 컨테이너. EKS 이관 시 web도 프로덕션 컨테이너화.

---

## 4. 요청 흐름 (BFF)

```
가입:    web(/signup) → POST /api/signup → api POST /signup → User upsert → serverId 저장
기본프로필: web(/onboarding) → PATCH /api/users/:id/basic-profile → api → User 갱신
            (경력 라벨 "1~3년" → CareerBand enum "Y1_3" 매핑은 web에서)
이벤트:   web track() → POST /api/events → api POST /events → AnalyticsEvent 적재
```

- `web/lib/apiClient.ts` : 브라우저 → `/api/*` 호출, `serverId`(가입 시 발급) localStorage 보관, 경력 라벨↔enum 매핑.
- `web/app/api/*` : Next Route Handlers(BFF). `API_URL`(기본 `http://localhost:8000`)로 api에 포워딩.
- 데이터는 localStorage(즉시 UX) + 서버(영속) **하이브리드**.

---

## 5. 데이터 모델 (Prisma / PostgreSQL)

| 모델 | 핵심 필드 | 관계/제약 |
| --- | --- | --- |
| **User** | id(cuid PK), **phone @unique**, **email @unique**, name, jobType(직군), **careerYears: CareerBand?**, region, createdAt, updatedAt | 1:N → 아래 전부 |
| **CareerCard** | siteName, field, start/endDate, role, equipment, coworkers, memo | userId FK, onDelete Cascade |
| **Certificate** | name, issuer, issuedAt | userId FK, Cascade |
| **Education** | title, institute, completedAt | userId FK, Cascade |
| **InterestRegistration** | feature: InterestFeature | userId? FK, SET NULL |
| **AnalyticsEvent** | name, props(Json) | userId? FK, SET NULL, @@index(name) |

**enum**
- `CareerBand` = `UNDER_1Y`(1년 미만) · `Y1_3`(1~3년) · `Y3_5`(3~5년) · `Y5_10`(5~10년) · `OVER_10Y`(10년 이상)
- `InterestFeature` = `CAREER_VERIFICATION` · `FINANCE_BENEFIT` · `EQUIPMENT_RENTAL` · `FOREIGN_WORKER` · `SAFE_PAYMENT` · `COMPANY_VIEW`

> **PK는 cuid 유지** — phone-PK는 이메일가입 시 null 불가 + 모든 FK가 `User.id` 참조라 부적합. phone/email은 `@unique`로 중복 차단.

---

## 6. API 엔드포인트 (api)

| 메서드 | 경로 | 설명 |
| --- | --- | --- |
| GET | `/health` | 헬스체크 |
| POST | `/signup` | 가입. `{name, phone?, email?}`(phone/email 중 하나 필수). **idempotent**(중복가입 방지) |
| PATCH | `/users/:id/basic-profile` | 기본 프로필 `{jobType, careerYears(CareerBand), region}` |
| POST | `/users/:id/certificates` | 자격증 등록 `{name, issuer?, issuedAt?}` → Certificate(FK userId) |
| POST | `/users/:id/educations` | 교육 이력 `{title, institute?, completedAt?}` → Education(FK userId) |
| POST | `/users/:id/interests` | 관심 등록 `{feature}` → InterestRegistration(FK userId, idempotent) |
| POST | `/events` | `{name, userId?, props?}` → AnalyticsEvent |

- 전역 `ValidationPipe`(whitelist) + class-validator DTO. `careerYears`는 `@IsEnum(CareerBand)`.
- 자격증·교육·관심·이벤트는 모두 **`userId` 외래키로 User 참조**(회원번호 = `User.id`).
- 상세 계약은 **[api-spec.md](api-spec.md)**, 스키마는 **[db-schema.md](db-schema.md)** 참고.

---

## 7. 이벤트(분석) 계약

온보딩 전 구간에서 발생 → `POST /api/events` → `AnalyticsEvent` 적재(추후 관리자 페이지에서 조회).

`page_view` · `signup_started` · `signup_completed` · `job_type_selected` · `career_year_selected` · `region_selected` · `profile_basic_completed` · `career_added` · `interest_feature_clicked` · `interest_submitted` · `return_visit` …

> 사용자 대면 화면에는 내부 분석 용어(North Star/Retention/Aha)·`준비 중`·`Beta` 등 노출 금지(`docs/user-app-guidelines.md`).

---

## 8. 로컬 개발

```bash
# 1) 인프라(Postgres+Redis) + api 컨테이너
docker compose up -d --build         # 또는: make up (db+redis만)
docker compose exec api npx prisma migrate deploy   # 최초 1회(테이블 생성)

# 2) 프론트(네이티브, 핫리로드)
cd web && npm run dev                 # http://localhost:3000
```

| 명령 | 설명 |
| --- | --- |
| `make up` / `make down` / `make logs` | 인프라 컨테이너 |
| `docker compose up -d --build` | db + redis + api 전체 |
| `cd web && npm run dev` | 프론트(:3000) |
| `docker compose exec api npx prisma migrate deploy` | 마이그레이션 적용 |

환경변수: 루트 `.env`(커밋 금지) — `DATABASE_URL`, `REDIS_URL`. 예시는 `.env.example`.

---

## 9. EKS 이관 매핑

| 로컬(Compose) | EKS |
| --- | --- |
| web (네이티브) | Deployment + Service (프로덕션 컨테이너), Ingress 뒤 |
| api (컨테이너) | Deployment + Service (BFF면 내부 전용), 마이그레이션은 Job/initContainer(`prisma migrate deploy`) |
| Postgres | **RDS / Aurora PostgreSQL** |
| Redis | **ElastiCache** |
| `.env` | Secrets / Parameter Store |
| (추후) ai | Python 서비스 Deployment 추가 |

- 12-factor: 설정은 전부 환경변수. 이미지/매니페스트는 환경 무관.
- 서비스 분리 → **독립 배포·독립 스케일**(모노레포 + path 기반 CI).

---

## 10. 디렉터리 구조

```
Mono/
├─ docker-compose.yml      # db, redis, api
├─ Makefile                # up/down/logs
├─ .env(.example)          # DATABASE_URL, REDIS_URL
├─ web/                    # Next.js (프론트 + BFF)
│  ├─ app/(app)/           #   랜딩·가입·온보딩
│  ├─ app/mono/            #   근로자 앱(5탭)
│  ├─ app/api/             #   BFF 라우트 핸들러 (/api/signup, /users/[id]/basic-profile, /events)
│  ├─ components/  lib/     #   UI · 상태(ProfileContext)·apiClient·analytics
│  └─ prisma/schema.prisma  #   (참조 — api로 이전됨)
├─ api/                    # NestJS + Prisma
│  ├─ src/{users,events,prisma}/
│  ├─ prisma/{schema.prisma, migrations/}
│  └─ Dockerfile
└─ docs/                   # 기획·기준 문서 + 이 아키텍처 문서
```

---

## 11. 현재 상태 · 결정 · 다음 단계

**완료**
- 모노레포 전환(web/ + api/) · Postgres+Redis+api 컨테이너화 · Prisma 마이그레이션
- web↔api 연동(BFF): 가입·기본프로필·이벤트 → Postgres 적재(E2E 검증)
- 경력 = `CareerBand` enum · 가입 idempotent(중복가입 방지)
- **자격증·교육·관심 DB 엔드포인트(FK userId)** 구현·검증 (api)
- 이벤트 정본 카탈로그(`EVENT_CATALOG`) · **DB/API 명세서** 문서화

**결정 대기 / 보류**
- 백엔드 언어: **NestJS 잠정 채택**, FastAPI 안은 `feat/api-fastapi` 보존 → 팀장 최종 결정
- 관리자(이벤트 분석) 대시보드 — 보류(이벤트는 적재 중)

**다음 후보**
- **UI 연동**: 관심 허브(#1)·서류/자격증(#2)·공유 링크+QR(#3) → 위 api 엔드포인트 + BFF 라우트 연결(이벤트 발화)
- 인증/세션(Redis: OTP·세션) · 가입 폼 phone+email 동시 입력 · web 프로덕션 컨테이너화(EKS) · AI 챗봇 서비스
