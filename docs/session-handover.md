# 세션 핸드오버 (Session Handover)

> 작성일: 2026-06-21 (갱신) · 브랜치: `main` · 최신 커밋: `20df7cf` · **이후 작업트리 미커밋 변경 있음 → §4-B**
> 이 문서는 **작업 세션 인수인계용**입니다. 제품/아키텍처 기준 문서는 `technical-handover.md`, `architecture.md`, `db-schema.md`, `api-spec.md`, `migrations.md` 를 참고하세요.

## 1. 한눈에 보기

- **무엇**: 현장 전문가용 핀테크·경력관리 슈퍼앱 MONO의 **사용자 앱 MVP**(가입·프로필·경력·관심·공유)를 실제 백엔드(DB)와 연동.
- **구조**: 모노레포 `web/`(Next.js 14) + `api/`(NestJS 10 + Prisma) + **Postgres** + **Redis**. 향후 AI 챗봇 + **AWS EKS** 이관 예정.
- **현재 단계**: 로컬 개발(컨테이너 = api/db/redis, web = 네이티브 dev 서버). MVP 기능 + DB 영속화 + BFF 연동 완료. **인프라 기반(멀티스테이지 이미지·환경변수 분리·마이그레이션 운영 구조) 정비 — 미커밋(§4-B).**
- **언어 결정**: 백엔드는 **Nest+Prisma(JS/TS)로 잠정 진행**. FastAPI 안은 별도 브랜치(`feat/api-fastapi`)에 보존 — **팀장 최종 결정 대기**.

## 2. 아키텍처 현황

```
브라우저
  └─ Next.js (web, :3000)
       ├─ 사용자 앱: /signup → /onboarding → /mono, 공개 프로필 /p/[id]
       └─ BFF: /api/* (route handlers) ──► NestJS api (:8000)   ※ api 는 브라우저에 직접 노출 안 함(CORS 불필요)
                                                 ├─ Prisma ──► Postgres (:5432)
                                                 └─ (예정) Redis (:6379) 세션/OTP
```

- **BFF 패턴**: 브라우저는 항상 같은 오리진 `/api/*` 만 호출 → Next route handler가 `API_URL`(기본 `http://localhost:8000`)로 전달. 예외: 공개 프로필 페이지 `/p/[id]`는 **서버 컴포넌트에서 NestJS를 직접 호출**(SSR 정석). 동명의 BFF 라우트(`/api/users/[id]/public`)는 향후 클라이언트 호출/공통정책용 scaffold(현재 미사용, 주석으로 명시).
- **데이터 영속화 흐름**: 클라이언트 상태(`ProfileContext`, localStorage) + 서버 DB(2중). 가입 시 `apiSignup`이 서버 `User`를 만들고 `localStorage["mono.serverId"]` 저장 → 이후 자식 엔티티(프로필/자격증/교육/관심/경력카드)는 이 id로 연결.
- **이벤트 로그**: `web/lib/analytics.ts`의 `track()` → 콘솔 + localStorage 버퍼 + `POST /api/events` → `AnalyticsEvent` 테이블. 정본 카탈로그 `EVENT_CATALOG`(4분류 33종).

## 3. 로컬 실행 방법

```bash
# 1) 인프라 + api 컨테이너 (OrbStack 등 Docker 엔진 필요, Docker Desktop 불요)
make up                 # db·redis·api 기동. api 는 시작 시 migrate deploy 자동 적용(RUN_MIGRATIONS=1)
make build              # Dockerfile/소스 변경 반영해 api 이미지 재빌드 후 기동
make ps / make logs     # 상태·로그

# 2) 웹(네이티브 dev 서버)
cd web && npm install   # 최초 1회
npm run dev             # http://localhost:3000

# 3) DB 스키마 변경 (상세: docs/migrations.md)
make migrate-new name=<변경명>   # 새 마이그레이션 생성(호스트, .env 단일 소스)
make migrate                     # 대기 마이그레이션 적용(컨테이너 migrate deploy)
make migrate-status              # 적용 상태 확인

# 데이터 초기화: make reset (볼륨 삭제)  |  특정 테이블 비우기:
# docker exec -i mono-db psql -U mono -d mono -c 'TRUNCATE "User" RESTART IDENTITY CASCADE;'
```

> ⚠️ Prisma 5.x 고정(lockfile). `prisma` 가 api **dependencies** 에 포함되어 로컬 바이너리로만 실행 → 과거 `npx prisma@5.22.0` 수동 버전핀 주의가 해소됨(Prisma 7 충돌 회피).
> ⚠️ Prisma OpenSSL 호환 위해 api Dockerfile은 `node:20-slim`(Debian) 사용.

## 4-A. 구현 완료 기능 (커밋됨, `2b073c8` → `20df7cf`)

- **가입·온보딩 영속화 + BFF 연동** — 가입 idempotent(phone/email unique upsert, 중복가입 방지).
- **이벤트 로그 수집** — PDF §6 이벤트 서버 적재(`AnalyticsEvent`).
- **#1 관심 기능 허브** — 내 정보 → 관심 기능 신청(6종), `InterestRegistration` 저장.
- **#2 서류·자격증 DB 영속화 + 자격증 발급번호(`licenseNo`, 필수)** — `Certificate`/`Education` 저장, 폼 입력.
- **직종·희망지역 다중선택(1개 이상)** — `User.jobType`/`region` → `String[]`, 온보딩 칩 다중토글 + /mono 수정시트 멀티선택. 구버전 단일값 → 배열 정규화(하위호환).
- **#3 프로필 공유(링크 + QR)** — /mono 공유 시트(링크 복사·QR(`qrcode.react`)·네이티브 공유), 공개 페이지 `/p/[id]`, `GET /users/:id/public`.
- **경력카드 서버 영속화** — `POST /users/:id/careers`(공유 프로필 "현장 경력" 표시용).
- **공개 프로필 보안** — 응답 화이트리스트 `select`로 휴대폰·이메일·`licenseNo`·경력카드 `coworkers`/`memo` 제외.
- **비노출 처리** — 홈 "오늘의 추천 현장", 경력카드 "공개 범위 설정"·"금융 연계" 버튼, 하단 "일자리"·"출역·정산" 탭, 내 정보 "계좌·정산" 메뉴(주석). → `disabled-features.md`.

## 4-B. 작업트리 변경 (⚠️ 미커밋, `20df7cf` 이후)

**UI 미세 수정** (`web/app/mono/MonoApp.tsx`)
- 카드 화면 버튼·Deep Dive 모달·공유 시트 제목 문구를 **"기업에 경력카드 공유"/"프로필 공유" → "경력카드 공유"** 로 통일.
- **내 정보 화면의 "프로필 공유" 메뉴 행 삭제.** 공유 시트(`openShareSheet`) 기능 자체는 카드 화면 "경력카드 공유" 버튼에서 그대로 유지(상태·핸들러 보존).

**인프라 기반 정비** (Dockerfile · 환경변수 · 마이그레이션)
- **Dockerfile 멀티스테이지화**(`api/Dockerfile`): builder/runtime 분리, `npm ci`(재현빌드), dev 의존성 prune, **non-root(USER node)**, 베이스 digest 핀 안내. 이미지 **1.18GB → 505MB**.
- **`api/docker-entrypoint.sh`**(신규): `RUN_MIGRATIONS=1` 이면 `prisma migrate deploy` 후 앱 실행(로그 출력). `prisma` CLI 를 **dependencies** 로 이동(앱 이미지=마이그레이션 러너 겸용, prune 후에도 잔존) — `package-lock.json` 동기화.
- **환경변수 단일 소스화**: `docker-compose.yml` 의 api `DATABASE_URL` 인라인 하드코딩 제거 → `.env` 의 `POSTGRES_*` 보간으로 비번 중복 제거. api 헬스체크(`GET /health`) 추가. `.env`/`.env.example` 시크릿 구분 + **`.env.production.example`**(신규, EKS Secret/ConfigMap 키 명세). `.gitignore` 가 `!.env*.example` 템플릿 추적.
- **마이그레이션 운영 구조**: **`docs/migrations.md`**(신규) — 하이브리드 적용 모델(dev=entrypoint 자동 / prod=EKS Job), Job 스켈레톤, **마이그레이션 changelog 3종**. `Makefile` 에 `migrate`/`migrate-status`/`migrate-new`/`build` 타깃. `api/README.md` Docker·마이그레이션 절 갱신.
- **검증 완료**: 새 이미지로 빌드·기동 → non-root(uid 1000) · `/health` 200 · compose healthy · `migrate deploy` idempotent 동작 확인.

## 5. 데이터 모델 (요약 — 상세 `db-schema.md`)

- `User`(id=cuid=회원번호, phone?/email? unique, name?, **jobType String[]**, careerYears CareerBand?, **region String[]**)
- `CareerCard` / `Certificate`(+ **licenseNo NOT NULL**) / `Education` / `InterestRegistration` / `AnalyticsEvent` — 모두 FK `userId` → `User.id`
- enum: `CareerBand`(UNDER_1Y/Y1_3/Y3_5/Y5_10/OVER_10Y), `InterestFeature`(6종)

## 6. 알려진 제약 / 보안 이슈 (인계 시 반드시 인지)

1. **🔴 api 인증 부재** — `POST/PATCH /users/:id/*` 쓰기 엔드포인트에 가드가 전혀 없음. 공유 식별자(`User.id`)가 곧 쓰기 키 → 링크 유출 시 타인이 해당 유저 데이터 변경 가능. **인증/세션 도입 필요**(아래 7-②).
2. **🟡 공유 링크 = 영구 capability** — `/p/{User.id}`(내부 PK), 만료·철회 없음. 중기적으로 회전 가능한 `shareToken` 도입 권장. (`disabled-features.md` "공개 프로필 공유 — 알려진 제약")
3. **경력카드 입력 UI 부재** — `addCareerCard`/`POST /careers` 영속화 인프라는 갖췄으나, /mono의 경력 표시는 아직 **데모 데이터**이며 실제 입력 폼이 없음 → 일반 사용자의 공유 프로필 "현장 경력"은 비어 있음. 입력 UI 추가가 다음 자연스러운 작업.
4. **루트/`docs`의 PDF 3종은 의도적으로 커밋 제외**(원본 기획 문서). 필요 시 `.gitignore` 정리 권장.

## 7. 미결정 / 다음 단계

1. **백엔드 언어 최종 결정** — NestJS(main) vs FastAPI(`feat/api-fastapi`). 팀장 논의 후 한쪽 정리.
2. **인증/세션** — 가입=인증 프로세스. Redis 기반 OTP/세션 도입(현재 Redis 컨테이너만 기동, 미사용).
3. **관리자 대시보드** — `AnalyticsEvent` 적재는 완료, 시각화/조회 화면 미구현.
4. **경력카드 입력 UI** — 위 6-③.
5. **AI 챗봇 서비스** — Python 별도 서비스로 추가 예정.
6. **EKS 이관** — api 운영 이미지(멀티스테이지·non-root) + 마이그레이션 Job 스켈레톤(`docs/migrations.md`)·env 키 명세(`.env.production.example`) 준비됨. 남은 것: web prod 이미지화, K8s 매니페스트(Deployment/Job/Secret/ConfigMap), ECR·배포 파이프라인.

## 8. 참고 문서

- `CLAUDE.md` — 작업 규칙(문구 금지어, surface 톤 3종, 모달 접근성 등) · `docs/technical-handover.md` — 기술/디자인 토큰
- `docs/architecture.md` · `docs/db-schema.md` · `docs/api-spec.md` · `docs/disabled-features.md` · `docs/migrations.md`(DB 마이그레이션 운영)
- `docs/user-app-guidelines.md` — 사용자 앱 문구·시나리오·이벤트 · `docs/strategy-page-plan.md` — 전략(IR) 페이지
