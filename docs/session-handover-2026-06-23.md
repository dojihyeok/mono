# 세션 핸드오프 — 2026-06-23 (알림 기능 + 투자 적합성 진단)

> 컴팩션/세션 인계용. 다음 세션이 이 문서만 읽고 이어받을 수 있게 작성. 이 문서는 **untracked로 유지**(기존 핸드오프 관례).

---

## 1. 한 줄 현황
`/mono` 알림 기능(매칭+인앱센터+웹푸시) **구현·검증·푸시 완료**(HEAD `5144ed8`). 직후 **MVP 투자/우승 적합성 진단**을 5렌즈 워크플로우로 수행 → `docs/investment-readiness.md`(untracked) 작성. 사용자가 **컴팩션 전 핸드오프 요청**한 상태. **미결: 진단 문서 커밋 여부 + 즉시 수정 2건 착수 여부.**

---

## 2. 이번 세션에 한 일 (시간순)

1. **`/mono` 지원하기 버그 수정** — `applyToJob`이 serverId 없으면 무반응 → `ensureServerId`(없으면 즉석 가입). 홈 시작탭화, 관심신청 홈 이동, 경력카드 글씨 흰색. (`161139a`)
2. **파비콘 인디고화** — 골드 'M' → T-Rive Indigo SVG+PNG. (`427b29c`)
3. **원격 최신 pull** — `764b5e5` 일자리 위치기반 Leaflet 지도(두 화면: 내 위치 주변/채용공고).
4. **지도 버그**: 처음 12종 수정했다가(`a5cb68e`) 사용자가 "그대로 가져오라니까" → **force-push로 되돌림**. 이후 "버그는 고치되 기존 로직 영향 없게" → **외과적 4건만** 재수정: 지역좌표 매칭(REGIONS 버킷 라벨), 팝업 XSS(DOM노드), loadLeaflet onerror, geolocation timeout. (`6035862`)
5. **공고 상세 시트** — 카드 탭 → 바텀시트(접근성 완비). (`1fe7491`) + TDZ 에러 수정(effect를 state 선언 아래로). (`517bf4a`)
6. **채용공고 소싱 브레인스토밍** — API 한계(워크넷 개인불가) + 비-API 코어(반장 1줄 호출·출역 역류·단톡 인입·인력사무소 SaaS 등 41아이디어). → `docs/job-sourcing-plan.md`. (`8a111bf`, `643aff7`)
7. **알림 기능 3겹** — 아래 §5 상세. (`5144ed8`, HEAD)
8. **투자/우승 적합성 진단** — 5렌즈(VC·모두의창업·SI·제품갭·산업) 워크플로우 → `docs/investment-readiness.md`. (종합 에이전트는 529로 실패 → 직접 종합.)

---

## 3. 현재 상태

- **HEAD**: `5144ed8` (origin/main 동기, 푸시됨). 코드 전부 커밋·푸시 완료.
- **untracked(미커밋, 의도적 유지)**: `MONO_MVP_development_plan.md`, `docs/session-handover-2026-06-22-mono-ui.md`, **`docs/investment-readiness.md`(이번 진단 — 커밋 여부 미정)**, 이 핸드오프 파일.
- **gitignore(커밋 금지)**: `.env`(로컬 VAPID 키 들어있음), `api/node_modules`(디버깅 중 호스트 설치됨).
- **서비스**: docker `mono-api`(빌드 이미지)·`mono-db`(:5432)·`mono-redis` healthy. 웹은 호스트 `npm run dev` `:3000`. 푸시용 VAPID는 `.env`에 설정돼 활성.

### 접속 주소
`/mono`(사용자앱) · `/partner`(기업) · `/amono`(관리자) · `/analys`(분석) — 전부 `http://localhost:3000/...`

---

## 4. 다음 할 일 / 미결

### 사용자 대기 결정
- [ ] `docs/investment-readiness.md` **커밋**할지.
- [ ] **즉시 수정 2건** 착수할지:
  1. **'준비 중/협의 중' 문구 제거** — `web/app/mono/MonoApp.tsx` 전략 모달 status(약 L654 career '협의 중', L656 finance '준비 중', L661 office '준비 중' → modalStatus 렌더). **CLAUDE.md 규칙 #1 위반**(즉시 수정 가능).
  2. **홈/지도 하드코딩 목업 → 실데이터 바인딩** — `MonoApp.tsx` 약 L633·639·829 '힐스테이트 송도·대주건설' mock. 홈 출역카드 = `/api/users/:id/assignments`, 지도 핀 = `/api/job-posts`(OPEN)로 바인딩 권장.

### 진단이 지목한 큰 레버 (우승·투자 관건, 추가개발보다 우선)
1. **실검증 트랙션 0→1** — 컨시어지 파일럿(1지역·1~2직군: 기술자 30~50·반장 3~5·기업/사무소 2~3)으로 `/analys`를 진짜 숫자로.
2. **진짜 공급 1채널 코드화** — `JobSource` enum·externalId·rawText·oneOff·`companyId` nullable 스키마 + 출역 역류('내일 또?' 체크아웃 1탭→익일 JobApplication) 또는 반장 1줄 호출(붙여넣기→LLM 슬롯필링→OPEN). (job-sourcing-plan §2 참고)
3. **데이터 해자 코드화** — `CareerCard.coworkers`가 현재 자유텍스트 String이라 그래프 아님. User 참조 엣지로 정규화 + 출역 기반 "같이 일한 사람 재호출" 1경로.
4. 수익모델 1개 + 직업안정법 정합 / TAM 사이징 / 팀 / 전략(IR)페이지(strategy-page-plan 7모달, 현재 라우트 없음) / PoC·MOU 파이프라인.

---

## 5. 알림 기능 상세 (방금 구현, 이어서 손볼 때 참고)

**3겹**: ① 인앱 알림센터 ② 매칭 엔진 ③ 웹푸시.

- **DB**(`api/prisma/schema.prisma` + migration `20260623120000_add_notifications`): `Notification(userId,type,jobPostId?,title,body,read,createdAt)`, `PushSubscription(userId,endpoint,p256dh,auth)`. User/JobPost에 back-relation.
- **매칭 트리거**: `api/src/admin/admin.service.ts` `setJobPostStatus`가 `status==='OPEN'`일 때 `NotificationsService.notifyMatchingUsers(id)` 호출(throw 안 함).
- **매칭 규칙**(`api/src/notifications/notifications.service.ts`): `User.jobType hasSome 공고.jobType` + 지역 교집합(공고 지역 있으면) + 경력버킷 ≥ 요구. 일괄 dedup(findMany)+createMany(N+1 제거), 푸시는 fire-and-forget. **⚠️ coworkers/출역 그래프는 안 씀(단순 규칙) — 해자 미실현.**
- **API**(`notifications.controller.ts`, 전역프리픽스 없음): `GET users/:id/notifications`, `.../unread-count`, `POST .../read-all`, `PATCH notifications/:id/read`, `GET push/vapid-public-key`, `POST/DELETE users/:id/push-subscription`.
- **웹**: `web/app/mono/MonoApp.tsx` 홈 헤더 종 아이콘+미읽음 뱃지 → 알림 패널(ESC·scroll-lock·focus). `web/lib/push.ts`(enablePush), `web/public/sw.js`(서비스워커). BFF: `web/app/api/{users/[id]/notifications,...,push,notifications/[id]/read}`.
- **푸시**: `.env`의 `VAPID_PUBLIC_KEY/PRIVATE_KEY/SUBJECT` + compose api env. 미설정 시 인앱만(graceful). 실전송은 브라우저 권한 허용 필요(iOS는 홈화면 추가 PWA만).
- **검증 완료**: 매칭 생성·비매칭 제외·멱등·읽음 처리 E2E + 지원 플로우 회귀없음. 적대적 리뷰 반영(금지어 문구·모달 접근성·N+1).

---

## 6. 핵심 기술 컨텍스트 / 함정

- **API 변경 → 재빌드 필요**(이미지 소스 베이크인): `docker compose up -d --build api` (느림, npm ci+nest build+entrypoint migrate deploy). 웹은 핫리로드, **dev 중 `next build` 금지**(.next 깨짐).
- **마이그레이션**(호스트에 .env/prisma CLI 없어 `make migrate-new` 불가): 컨테이너로 SQL 생성 →
  `docker exec -i mono-api sh -c 'cat > /tmp/new.prisma' < api/prisma/schema.prisma`
  `docker exec mono-api ./node_modules/.bin/prisma migrate diff --from-schema-datasource /app/prisma/schema.prisma --to-schema-datamodel /tmp/new.prisma --script`
  → `api/prisma/migrations/<YYYYMMDDHHMMSS>_name/migration.sql`로 저장 → 재빌드 시 entrypoint가 `migrate deploy`로 적용.
- **api 의존성 추가 시**: `package.json` 수정 후 호스트 `cd api && npm install --package-lock-only`로 **lock 갱신**(안 하면 Docker `npm ci` 실패). `.dockerignore`가 node_modules 제외하므로 호스트 node_modules는 이미지에 안 들어감(안전).
- **검증 루틴**: `npx tsc --noEmit`(web·api) + `npx next lint` + curl E2E(:3000 BFF/:8000 API) + `docker exec mono-db psql -U mono -d mono` + 테스트데이터 정리.
- **zsh 함정**: `UID` readonly → E2E 변수는 `WID` 사용. URL에 `?` 있으면 따옴표(글롭).
- **DB 자격**: user=mono / pw=mono_dev_pw / db=mono (compose 기본값).

---

## 7. 표준 규칙 / 제약 (반드시 유지)
- **커밋 푸터**: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- **커밋은 사용자가 요청할 때만**. `MONO_MVP_development_plan.md`·`docs/session-handover-*.md`는 **untracked 유지**. `.env`·시크릿 커밋 금지.
- **CLAUDE.md 규칙**: 사용자 노출에 'Beta/Prototype/Test/준비 중/추후 구현/Fake Door' 금지 → '관심 신청/관심 등록'. surface별 톤(앱=골드·다크 셸 / 사용자앱=토스·당근 심플 / 전략=네이비). 모달 접근성(focus·ESC·scroll-lock). globals.css 토큰 재사용.
- **현재 테마**: 전 surface T-Rive Indigo 통일됨.
- 사용자 작업 스타일: 빠른 반복, "기존 로직 영향 없게(추가 전용)" 강하게 선호. 결정은 한 번에 하나씩 묻기.

---

## 8. 이번 세션 커밋 (최신순)
`5144ed8` 알림 3겹 · `643aff7` 소싱 수집표 · `8a111bf` 소싱 방안 · `517bf4a` 상세시트 TDZ · `1fe7491` 공고 상세시트 · `6035862` 지도 버그 외과수정 · `427b29c` 파비콘 인디고 · `161139a` 지원하기/홈탭/관심신청
(중간에 `a5cb68e` 지도 12버그 → force-push로 `764b5e5`로 되돌림)

## 9. 참고 문서
- `docs/investment-readiness.md` (이번 진단 — 5렌즈 종합)
- `docs/job-sourcing-plan.md` (공급 방안 — 비-API 코어 5수단)
- `docs/todo.md` (백로그 — 알림은 완료 표기됨)
- `CLAUDE.md`, `docs/technical-handover.md`, `docs/user-app-guidelines.md`, `docs/strategy-page-plan.md`, `docs/migrations.md`, `MONO_MVP_development_plan.md`
