# api (backend) — NestJS + Prisma

브랜치별로 다른 구현(비교용 스파이크):
- `feat/api-fastapi` : FastAPI + SQLAlchemy + Alembic
- `feat/api-nestjs`  : **NestJS + Prisma** ← 이 브랜치

데이터 모델은 `web/prisma/schema.prisma` 를 그대로 복사해 재사용한다(`api/prisma/schema.prisma`).

## 스택
- NestJS 10 (`@nestjs/common`, `core`, `platform-express`, `@nestjs/config`)
- Prisma 5 (`prisma`, `@prisma/client`) — PostgreSQL
- `class-validator` + `class-transformer` (전역 `ValidationPipe`)

## 구조
```
api/
├─ prisma/schema.prisma     # web 에서 복사한 도메인 스키마
├─ src/
│  ├─ main.ts               # 부트스트랩 + 전역 ValidationPipe (포트 8000)
│  ├─ app.module.ts         # 루트 모듈 + GET /health
│  ├─ prisma/               # PrismaModule(@Global) + PrismaService
│  ├─ users/                # signup, basic-profile (controller/service/dto)
│  └─ events/               # AnalyticsEvent 적재 (controller/service/dto)
├─ Dockerfile               # node:20-slim 멀티스테이지(builder/runtime), non-root, 포트 8000
├─ docker-entrypoint.sh     # RUN_MIGRATIONS=1 → migrate deploy 후 앱 실행
├─ nest-cli.json
├─ tsconfig.json
└─ package.json
```

## 엔드포인트
| Method | Path                        | Body                                   | 설명 |
|--------|-----------------------------|----------------------------------------|------|
| GET    | `/health`                   | -                                      | 헬스체크 → `{status:"ok"}` |
| POST   | `/signup`                   | `{name, phone?, email?}`               | User 생성. phone/email 중 하나 필수 |
| PATCH  | `/users/:id/basic-profile`  | `{jobType, careerYears, region}`       | 기본 프로필 갱신 |
| POST   | `/events`                   | `{name, userId?, props?}`              | AnalyticsEvent 적재 |

검증 규칙(class-validator):
- `signup`: `name` 필수. `email` 이 없으면 `phone` 필수, 반대도 동일(둘 중 하나 이상).
- `basic-profile`: `jobType`/`region` 비어있지 않은 문자열, `careerYears` 정수(>=0).

## 환경 변수
키 명세·분리 정책은 루트 `.env.example`(로컬) / `.env.production.example`(운영) 참고.
- `DATABASE_URL` (필수): Prisma 연결 문자열
  - 로컬: `postgresql://mono:mono_dev_pw@localhost:5432/mono?schema=public`
  - Docker Compose(api 컨테이너): compose 가 `POSTGRES_*` 로 자동 구성(호스트=`db`)
- `REDIS_URL` (세션/OTP 예정): 로컬 `redis://localhost:6379`
- `PORT` (선택, 기본 8000) · `NODE_ENV` (runtime 이미지에서 `production`)
- `RUN_MIGRATIONS` (컨테이너): `1` 이면 시작 시 `prisma migrate deploy` 자동 적용(docs/migrations.md)

## 로컬 실행
```bash
cd api
npm install
npm run prisma:generate     # @prisma/client 생성 (prebuild 에서도 자동 실행됨)

# 타입체크 / 빌드
npm run typecheck           # tsc --noEmit
npm run build               # nest build → dist/

# 실행 (라이브 DB 필요)
export DATABASE_URL="postgresql://mono:mono_dev_pw@localhost:5432/mono?schema=public"
npm run start               # node dist/main.js  (http://localhost:8000)
# 또는 개발 모드
npm run start:dev
```

## 마이그레이션
운영 절차·환경별 적용 방식(하이브리드)·변경 이력은 **`docs/migrations.md`** 가 정본. 요약:
```bash
make up                         # db·redis·api 기동 (api 가 시작 시 migrate deploy 자동 적용)
make migrate-new name=add_x     # 새 마이그레이션 생성(호스트, .env 단일 소스)
make migrate                    # 대기 마이그레이션 적용(컨테이너 migrate deploy)
make migrate-status             # 적용 상태 확인
```
> 운영(EKS)은 앱 Pod 가 아니라 **별도 마이그레이션 Job** 이 `migrate deploy` 를 1회 수행한다
> (앱 Pod 는 `RUN_MIGRATIONS=0`). `migrate dev` 는 로컬 전용.

## Docker
멀티스테이지(builder/runtime) · non-root(USER node) · `prisma` 를 dependencies 로 포함(마이그레이션 러너 겸용).
```bash
# 루트에서
make build                      # = docker compose up -d --build  (이미지 재빌드 후 기동)
```
- 컨테이너의 `DATABASE_URL` 은 compose 가 `POSTGRES_*` 로 자동 구성(호스트=`db`) → 비밀번호 중복 정의 없음.
- 엔트리포인트가 `RUN_MIGRATIONS=1` 일 때 `prisma migrate deploy` 후 앱을 기동한다.
- compose 헬스체크: `GET /health` → `{status:"ok"}`.
