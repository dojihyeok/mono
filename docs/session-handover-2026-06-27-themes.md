# 세션 핸드오버 — 2026-06-27 (외국인 UX 마감 + 테마 탐색)

> 이전 핸드오버: `session-handover-2026-06-27-foreign-workforce.md`, `session-handover-2026-06-27.md` 참고.

## 1. 현재 상태 (한 줄)
- **브랜치 main = `daa3e3d`** (origin/main 푸시 완료). 작업트리 **tracked clean**, 단 `.gitignore` 1건 미커밋.
- 이번 세션 테마 탐색(Apple/Figma/Revolut/Coinbase)은 **전부 원복·삭제** — 코드에 흔적 없음.

## 2. 이번 세션 커밋(전부 main 푸시됨)
| 커밋 | 내용 |
|---|---|
| `ff4cbb4`/`844dd00` | 운영도구(/analys §7 분석심화·/amono 운영·관심 탭) + 외국인 P1(8지표 평가수집·온보딩 가이드 탭) + ReviewSheet 공용화 |
| `c574a84`/`ddc6b75` | 온보딩 **내국인/외국인(residency) 선택**(WORKER, 필수) + 영속(basic-profile→WorkerProfile, getMe read-back) + 외국인 메뉴 `OVERSEAS` gating + **외국인 분류 버그 수정**(admin·companies: `residency!=null`→`residency=OVERSEAS`, 내국인 오분류 방지) + 외국인 허브 탭 가로슬라이드 |
| `941746c`/`e9234df` | 외국인 UX 다듬기 — 카피 디슬롭 13건·법무경계 `연결`→`안내`·출근 카드 흰색 CTA(--a1 골드 묻힘 수정)·신뢰도 단계 안내 제거·진입 안내 팝업화 + 하단 ForeignNotice 제거·**국적 커스텀 드롭다운(NATIONALITIES 가나다)**·장비 시트 크기 정합 |
| `aeaa699`/`daa3e3d` | 외국인 콘텐츠를 **내 정보 기존 면에 흡수**(프로필필드→편집시트, 비자/서류/교육→서류시트, 정산→출근정산탭, 용어·가이드 제외) + 메뉴/오버레이 제거 + **"출역"→"출근" 메뉴 라벨** + setTab 오버레이 닫기(nav 전환 버그) |

→ ForeignWorkerHub 서브컴포넌트(ProfileTab/VisaTab/DocsTab/TrainingTab/SettlementTab) export됨. default ForeignWorkerHub(탭 허브)는 미사용 잔존(추후 삭제 가능).

## 3. 테마 탐색 (전부 원복됨 — 참고용 기록)
getdesign.md(`npx getdesign add <name>`로 DESIGN-*.md 수급) 기반으로 운영콘솔/유저앱에 외부 테마 시험:
- `/amono2` Apple(마케팅 풀빌드, framer-motion 모션) · `/amono2` Figma(파스텔 컬러블록) · `/amono3` 콘솔 Figma색 · `/mono2` Figma · `/mono3` Revolut(다크) · `/mono4` Coinbase(블루). **전부 삭제, 공유파일 전부 HEAD 원복.**

**재현 시 핵심 메커니즘(다음에 또 할 때):**
1. **`[data-theme="X"]`** 블록을 `globals.css`에 추가(토큰 오버라이드) + 라우트 래퍼 `<div data-theme="X">`.
2. **MonoApp `THEMES`** 객체에 X 팔레트 추가 + `useEffect`에서 `rootRef.closest('[data-theme]')`로 감지해 `setProperty`. **THEMES 값은 구체 hex로**(자기참조 `var(--c1,...)`는 간헐 무효화→카드가 폴백색으로 깨짐. 실제 발생함).
3. **한계**: MonoApp의 **raw 인라인 hex**(`"#4f46e5"` 등, 약 74곳)는 인라인 우선순위라 토큰으로 안 바뀜 → 완전 전환하려면 `"#hex"`(따옴표 감싼 값만)→`var(--c1,#hex)` 안전 sweep 필요. **admin.module.css는 100% 하드코딩** → `var(--ac-primary,#4b4dd6)` 식 var화해야 테마 먹음.
4. 글로우 shadow `rgba(79,70,229,.x)`도 `rgba(var(--glow,79,70,229),.x)` 토큰화 가능.
5. Revolut primary `#494fdf` ≈ MONO 인디고 `#4f46e5` → 토큰만 바꾸면 차이 안 보임. 다크 캔버스(블랙)로 가야 Revolut답게 드러남.

## 4. 미커밋 / 로컬
- **`.gitignore`** 수정(미커밋): `.claude/skills/` + `DESIGN-*.md` 무시 추가.
- **`.claude/skills/taste-skill/`** 설치(gitignore됨, 비커밋) — `leonxlnx/taste-skill`의 `design-taste-frontend`(안티-슬롭 프론트엔드 가이드, 랜딩/포트폴리오/리디자인용). 세션 재시작 시 로드 → `/design-taste-frontend`. **대시보드·제품UI 비대상** → 전략/IR 페이지에 적합.
- `.claude/skills/impeccable/` — 기존 설치 디자인 스킬(훅 자동 스캔).

## 5. 다음 할 일 후보
- `.gitignore` 변경 커밋 여부 결정.
- (원하면) taste-skill / impeccable로 **전략(IR) 페이지** 디자인 패스.
- 외국인 default `ForeignWorkerHub`(탭 허브) 미사용 — 삭제 정리.
- 편집/서류 시트의 **PartnerReferralBlock 2회 중복**(ProfileTab·VisaTab 통째 재사용 부작용) 정리 — 단 현재 main(daa3e3d)엔 흡수 버전 반영됨, 확인 필요.

## 6. 환경/명령
- 스택: NestJS(api:8000)+Prisma+Postgres / Next14 App Router(web:3000) / Docker Compose(OrbStack). `make build` = `docker compose up -d --build`.
- 검증 루프: `cd web && npx tsc --noEmit`(web-push 에러 제외) → `make build`/`docker compose up -d --build web` → `/api/analytics/summary` 헬스 → 브라우저(Chrome 확장) 렌더 확인.
- MonoApp.tsx = `@ts-nocheck` → 런타임/브라우저 확인 필수.
