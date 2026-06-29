# 세션 핸드오버 — 2026-06-27 (동기화 · 스프린트3 인계)

> 직전(스프린트1·2 구현): `docs/session-handover-2026-06-26-sprint1-2.md` · 마스터 플랜: `docs/dev-plan-master.md`
> 본 세션 = origin/main 최신 동기화 + 개발플랜 확인. **코드만 받았고 런타임 미적용(아래 ⚠️).**

## 현재 상태
- 로컬 `main` == `origin/main` == **`7853d33`** (스프린트1·2 + 마스터 플랜 포함, 작업트리 클린).
- ⚠️ **런타임 미적용**: code만 pull. 실행 중 api 이미지·DB는 직전 `b9c80d2`(마이그레이션 11개)에 머물러, **스프린트1·2 마이그레이션 3종**(`sprint1_userrole_canonical`·`sprint1_industry_companykind`·`sprint2_workrequest_fieldleader_fieldops`) **미적용**. web dev 서버 미가동.

## 돌리려면 (적용)
```bash
docker compose up -d --build api   # 새 소스 + entrypoint가 migrate deploy(스1·2 마이그레이션 적용, idempotent)
cd web && npm run dev              # :3000 (web 의존성 무변경)
```
검증: `/health` 200 · `make migrate-status`(**14 migrations** 예상) · `/mono` 200.

## 완료 — 스프린트1·2 (P0/MVP 코어)
캐노니컬 5유형·11산업 스키마 + CUSTOMER 작업요청 풀스택 + FieldLeaderProfile + Team확장/가동일정 + FieldOps 7종. MVP 완료기준(dev-plan §10) 핵심 충족. 상세는 sprint1-2 핸드오버.

## 다음 — 스프린트3(P1) → 스프린트4(P2)  [dev-plan §9.2]
- **스3(P1)**: PROJECT_OPERATOR·PERFORMER_COMPANY 프로필/대시보드 · `WorkRequestCandidate`(후보매칭) · `WorkRecord` · `EquipmentHistory` · `AiLeaderInterest` · 산업별 대시보드. + `WorkRequest`에 `candidates`/`reviews` 역관계 복원(현재 생략됨).
- **스4(P2)**: `Review`(7항목)·`TrustScore` · 자동 후보추천 · 11산업 전면노출(현재 프론트 4값) · PoC 리포트.
- **곁가지(아무 때나)**: admin role 5유형 UI + `foreman-requests`→`field-leader-requests` rename(alias) · 서버측 이벤트 카탈로그 정본화/alias(§4-7) · 퍼널 이벤트명 정본화.

## 미결 오너 결정  [dev-plan §12]
- **#6** 평가/TrustScore(P2) 착수 트리거 — 요청·완료 건수 임계 합의(BM 과금화 선행조건).
- **#7** SSO(네이버·카카오·구글) MVP 포함 여부 — 현재 "곧 지원" 안내만.
- (스1·2에서 채택·구현됨: FOREMAN→FIELD_LEADER 즉시 rename / CUSTOMER 신설 / FieldOps 6+7 병존 / 초기 4산업)

## Gotcha
- `web/app/mono/MonoApp.tsx` = `// @ts-nocheck` → tsc 미검증, **런타임 스모크 필수**.
- 색 = 인디고 `#4f46e5` 단일(`var(--c1)`). 신규 화면도 토큰 재사용.
- 원칙: **스키마는 확장형 한 번에, 노출·기능은 단계적**(§7). 死 enum/모델 선(先)생성 금지 — 쓰는 스프린트에서 생성.
- 마이그레이션 수동 SQL: 비파괴(ADD VALUE/CREATE TYPE/ADD COLUMN nullable) 우선, rename은 `ALTER TYPE … RENAME VALUE`.
- api 변경 시 `docker compose up -d --build api`. DB `mono-db` :5432 (`mono`/`mono_dev_pw`/`mono`). 작업기록 `WORKLOG.md`.
- 레포에 web 컨테이너 추가됨(compose `web` 서비스) — 로컬은 web=dev서버(HMR)/api=컨테이너 하이브리드로 운용 중.
