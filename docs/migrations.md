# DB 마이그레이션 운영 가이드 (Prisma Migrate)

MONO의 스키마 변경 이력·적용 절차·환경별 적용 방식을 정의한다.
대상 스키마: `api/prisma/schema.prisma` · 마이그레이션: `api/prisma/migrations/`.

---

## 1. 원칙 (요약)

| 항목 | 정책 |
| --- | --- |
| 도구 | **Prisma Migrate** (`prisma migrate`) · Prisma **5.x 고정**(lockfile) |
| 생성 | 개발자가 로컬에서 `migrate dev` 로 생성 → **반드시 git 커밋** |
| 적용 | 운영/배포는 `migrate deploy`(idempotent, 새 마이그레이션 생성 안 함) |
| 원장 | DB의 `_prisma_migrations` 테이블이 적용 이력을 기록(어떤 마이그레이션이 언제 적용됐는지) |
| 잠금 | `migration_lock.toml`(provider=postgresql) — git 추적, 수정 금지 |

> ⚠️ `prisma` CLI 버전은 **5.x 로 고정**한다. 핀 없이 `npx prisma` 를 쓰면 Prisma 7 이 받아져
> 스키마(`url = env(...)`)·엔진과 충돌한다. 컨테이너 이미지는 `prisma` 를 **dependencies** 로 포함해
> (앱 런타임 = 마이그레이션 러너 겸용) 로컬 바이너리(`node_modules/.bin/prisma`)로만 실행한다.

---

## 2. 환경별 적용 방식 (하이브리드)

```
로컬/dev (docker compose)        운영 (EKS)
────────────────────────         ─────────────────────────────
api 컨테이너 entrypoint           앱 Pod: RUN_MIGRATIONS=0 (적용 안 함)
  RUN_MIGRATIONS=1               별도 "마이그레이션 Job"이
  → prisma migrate deploy          → prisma migrate deploy  (배포 직전 1회)
  → node dist/main.js            앱 Pod 는 마이그레이션 이후 기동
```

- **왜 분리하나**: 앱 Pod 가 여러 replica 로 뜨면 각자 `migrate deploy` 를 동시에 시도(레이스).
  Prisma 가 advisory lock 으로 대체로 안전하게 직렬화하지만, 운영에서는 **단일 Job 1회 적용**이 정석.
- **엔트리포인트**: `api/docker-entrypoint.sh` 가 `RUN_MIGRATIONS` 플래그로 분기.
  - `RUN_MIGRATIONS=1` → `prisma migrate deploy` 실행 + 로그(`[entrypoint] ...`) → `exec` CMD
  - 미설정/0 → 마이그레이션 건너뜀(외부 Job 이 담당)
- 로컬 compose 의 `api` 서비스는 `RUN_MIGRATIONS=1`(편의). 운영 매니페스트(EKS)에서는 `0`.

### 운영 마이그레이션 Job (EKS, 참고 스켈레톤)
앱과 동일 이미지를 쓰되 `migrate deploy` 만 수행하고 종료한다. (EKS 이관 시점에 매니페스트화)
```yaml
# job-migrate.yaml (개념 예시)
apiVersion: batch/v1
kind: Job
metadata: { name: mono-api-migrate }
spec:
  backoffLimit: 1
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: migrate
          image: <ECR>/mono-api:<tag>          # 앱과 동일 이미지
          command: ["./node_modules/.bin/prisma", "migrate", "deploy"]
          env:
            - name: DATABASE_URL                # [SECRET] K8s Secret 주입
              valueFrom: { secretKeyRef: { name: mono-db, key: DATABASE_URL } }
```
> 배포 파이프라인: 이미지 push → **migrate Job 완료 대기** → 앱 Deployment rollout 순서로 묶는다
> (Argo/Helm hook 또는 CI 단계). 최소권한 원칙상 마이그레이션 전용 DB 계정 분리 권장(`MIGRATE_DATABASE_URL`).

---

## 3. 절차 (How-to)

### 새 마이그레이션 만들기 (로컬, 개발자)
```bash
# DB(postgres)가 떠 있어야 함: make up
make migrate-new name=add_something      # = prisma migrate dev --name add_something
#  → api/prisma/migrations/<ts>_add_something/migration.sql 생성 + 로컬 DB 적용 + 클라이언트 재생성
git add api/prisma/migrations api/prisma/schema.prisma
```
- 생성된 `migration.sql` 을 **반드시 리뷰**(특히 컬럼 타입 변경 = drop/recreate → 데이터 손실 경고).
- 아래 **4. 변경 이력**에 한 줄 추가.

### 적용 (대기 중 마이그레이션 반영)
```bash
make migrate            # 컨테이너에서 prisma migrate deploy (api 가 떠 있을 때)
make migrate-status     # 적용 상태 확인 (_prisma_migrations 대비 대기분 표시)
```
- 로컬에서는 `make up` 시 api 엔트리포인트가 **자동 적용**하므로 보통 별도 실행 불필요.

### 적용 이력 직접 조회 (DB 원장)
```bash
docker exec -i mono-db psql -U mono -d mono -c \
  'SELECT migration_name, started_at, finished_at FROM "_prisma_migrations" ORDER BY started_at;'
```

---

## 4. 변경 이력 (Changelog)

> 새 마이그레이션을 추가할 때마다 **맨 아래에 한 줄 추가**한다. (시간순)

| 순번 | 마이그레이션 (디렉터리) | 날짜 | 요약 | 비고 |
| --- | --- | --- | --- | --- |
| 1 | `20260620141721_init` | 2026-06-20 | 초기 스키마: enum(`CareerBand`,`InterestFeature`) + 테이블(`User`,`CareerCard`,`Certificate`,`Education`,`InterestRegistration`,`AnalyticsEvent`) + 인덱스 + FK | `phone`/`email` unique, 자식→`User` FK(Cascade/SetNull) |
| 2 | `20260620154727_cert_license_no` | 2026-06-20 | `Certificate.licenseNo`(자격증 발급번호) **NOT NULL** 추가 | 기존 행이 있으면 적용 불가(빈 테이블 전제) |
| 3 | `20260620155350_multi_jobtype_region` | 2026-06-20 | `User.jobType`,`region` 을 `TEXT` → `TEXT[]`(다중선택) | ⚠️ 컬럼 drop+recreate → 기존 값 손실(개발 초기라 무방) |

---

## 5. 주의 / 함정

- **버전 핀**: `prisma`/`@prisma/client` 모두 5.x. 업그레이드는 별도 PR + `migrate status` 확인 후.
- **파괴적 변경**: 컬럼 타입 변경은 Prisma 가 drop/recreate 로 처리 → 운영 데이터 있으면 손실.
  운영 단계 진입 후에는 수동 SQL(임시 컬럼→백필→스왑)로 무중단 마이그레이션 작성.
- **`migrate dev` 는 로컬 전용**: 운영/CI 에서는 절대 사용 금지(스키마 드리프트 감지 시 DB 리셋 가능). 운영은 `migrate deploy` 만.
- **schema 출처**: `api/prisma/schema.prisma` 가 정본. `web/prisma/schema.prisma` 는 클라이언트 타입용 사본 — 변경 시 동기화 주의.
