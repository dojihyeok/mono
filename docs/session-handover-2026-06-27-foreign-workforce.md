# 세션 핸드오버 — 2026-06-27 (외국인 기술인력 관리 전면 구현 + 완전성 감사)

> 직전: `docs/session-handover-2026-06-27.md`(스프린트3 인계 시점) · 마스터: `docs/dev-plan-master.md` · 본 세션 계획서: `docs/dev-plan-foreign-workforce.md`
> 본 세션 = 외국인 PDF 설계서 → 계획서화 → 도메인 전면 구현(schema~UI) → E2E·브라우저 검증 → 완전성 감사.

## ⚠️ 커밋 안 됨
모든 작업이 **작업트리에만 존재**(48파일 변경/신규). 커밋·푸시 안 함. 다음 세션에서 커밋 시 브랜치 분기 권장.

## 현재 런타임 상태
- 컨테이너 4종(api·web·db·redis) **재빌드 후 재시작 완료**, 전부 healthy. `/health` 200 · `/`(web) 307.
- DB 마이그레이션 **16개** 적용(외국인 `20260626140400_foreign_workforce` 포함). 데이터 볼륨 유지.
- 돌리는 법: `make build`(api·web 재빌드+migrate deploy) → `make migrate-status`(16 예상) → `/amono`·`/mono` 확인.

## 🔧 인계 필수 — 마이그레이션 폴더명 순서 버그 수정
shadow DB 재생 시 파일명(타임스탬프) 정렬 순서로 재생되는데, 기존 `sprint3`(115105)가 `IndustryType` enum 생성(`sprint1_industry` 140100)보다 **앞**서 정렬돼 `migrate dev` 실패했음. 해결:
- `20260626115105_sprint3_…` → **`20260626140300_sprint3_…`** 로 폴더 rename + `_prisma_migrations.migration_name` UPDATE(checksum 동일).
- 신규 외국인 마이그레이션도 시스템시계(13:xx)가 수동 sprint 타임스탬프(14:xx)보다 과거라 `131325` → **`140400`** 로 rename + DB 동기화.
- 결과: 파일명 정렬 = 적용 순서 일치. 이후 `migrate dev` 정상. **새 마이그레이션 만들 때 타임스탬프가 14xx대보다 작으면 같은 보정 필요.**

## 완료 — 외국인 기술인력 관리 (PDF 13절 전수, P0 동작)
- **스키마**: enum 13(Residency·VisaType·VisaDocStatus·KoreanLevel·DocumentKind·Settlement*·TrainingKind·RiskReport*·PartnerReferral*·SupportedLang) + 신규모델 9(VisaStatus·DocumentRecord·GlossaryTerm/Translation·Settlement/Item·TrainingRecord·PartnerReferral·RiskReport) + WorkerProfile(국적·언어·한국어·거주·통역·glossaryComprehension·desiredEntryDate)·Review(`collaboration` 8번째지표)·JobPost(foreignAllowed·requiredVisaTypes·interpreterProvided) 확장.
- **API**: `api/src/{glossary,settlements,training,referrals,risk}` 신규모듈 + users(visa/documents CRUD) + companies(`/foreign-workers` 후보검색) + admin(`/expiring-visas`·`/pending-documents`·`/foreign-report`). reviews METRICS 8개로.
- **BFF 17 + apiClient 래퍼 + types** (`web/lib/{apiClient,types,constants,analytics}.ts`). 이벤트 20종(`foreign` 카테고리).
- **UI**: `web/app/mono/ForeignWorkerHub.tsx`(6탭: 프로필·비자·서류·교육·정산·용어) · `GlossaryView.tsx`(다국어 용어팩·오프라인·🔊음성) · `ForeignCandidateSearch.tsx`(기업) · `ForeignNotice.tsx`(하단 법무멘트 공통) · `web/app/amono/ForeignAdminView.tsx`(만료비자·서류검토·신고·리포트). 진입점: MonoApp '내 정보'·CustomerApp·PerformerApp·AdminClient 탭.
- **하단 안내 멘트**(요청사항): 각 화면 `<ForeignNotice kind=visa|match|settlement|glossary|partner|profile|general />` — 비자발급 비보장·직업소개아님·정산참고용·번역보조용(§0 법무경계).
- **검증**: web/api tsc 무에러 · E2E 스모크 전수(`scratchpad/smoke-foreign.sh`) · 브라우저(/amono 외국인탭·/mono 허브·용어 렌더, 콘솔 0에러). 실데이터: 응우옌(베트남·E-9·D-14), 용어 "추락주의/양중준비", TrustScore 96.

## 남은 갭 (완전성 감사 결과 — 7영역 병렬 대조)
마스터 §0/§3/§4/§5 + 외국인 P0 = **사실상 완료**. 실제 미구현:
1. **`/analys` 분석 심화** (§7.2~7.6): 유형별 funnel·산업별 분해·FieldOps 7종·AI현장리더 관심·유형별 retention 코호트. (화면 틀은 존재, analytics.service 단일 endpoint)
2. **`/amono` 전용 관리탭** (§6.5·6.6): 수행기업·운영자 관리(목록·상세·지표), FieldOps 관심·AI 관심 관리. (현재 카운트만)
3. **외국인 P1/보류**: 국내·해외 분리 온보딩 플로우(현재 허브 내 residency 선택), 외국인 평가 수집 UI(Review 스키마는 있음), 다국어 정산표(P1), 온보딩 콘텐츠 텍스트.
4. **전략(IR)페이지** (`docs/MONO 전략 페이지…pdf`): Hero·01~08·Deep Dive 7카드·모달 미착수. **별도 surface**(`/p`는 공유프로필).
5. 사소: 일부 admin 라우트 `foreman` 명칭 잔존(field-leader alias 미적용), dev-plan §4-7 서버측 이벤트 alias 정규화 미적용.

추천 다음 순서: ①/analys 심화 → ②/amono 관리탭 → ③외국인 P1(평가수집·다국어정산). 전략페이지는 별개 트랙.

## 핵심 파일·명령
- 계획서: `docs/dev-plan-foreign-workforce.md`(13절 매핑·재사용/신규 구분), `docs/dev-plan-master.md`
- 스모크: `/private/tmp/.../scratchpad/smoke-foreign.sh`(BFF E2E)
- 명령: `make build` · `make migrate-status` · `make migrate-new name=X`(host: `cd api && set -a && . ../.env && set +a && npx prisma migrate dev`)
- 주의: `MonoApp.tsx`는 `@ts-nocheck`(런타임 스모크 필수) · BFF는 `process.env.API_URL ?? localhost:8000` thin proxy · `analytics.ts` union↔EVENT_CATALOG 동기(불일치 시 컴파일에러).
