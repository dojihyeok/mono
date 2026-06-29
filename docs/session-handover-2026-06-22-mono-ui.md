# 세션 핸드오버 — 2026-06-22 (MoNo 근로자 앱 UI 재현 + 레포 동기화)

> 작성일: 2026-06-22 · 브랜치: `main` · 동기화 후 최신 커밋: `0f02f74`
> 이 문서는 **이번 작업 세션 인수인계용**입니다. 백엔드/인프라/DB 상세는 같은 폴더의
> `session-handover.md`(2026-06-21, 팀 백엔드 세션)를 함께 보세요. 제품 기준은
> `technical-handover.md`·`user-app-guidelines.md`·`CLAUDE.md` 참고.

## 1. 한눈에 보기

- **무엇**: 디자인 프로토타입 HTML(`Downloads/export/MoNo 근로자 앱.html`)을 **React로 100% 충실 재현**해
  사용자 앱 본체(`/mono`)를 만들고, **MONO Tech-Blue 테마 + 하이브리드 반응형**으로 정리.
  이후 로컬을 원격(모노레포 전환본)과 **동기화**.
- **결과물 위치**: 동기화 후 앱은 `web/app/mono/MonoApp.tsx`(약 1000줄, 단일 컴포넌트).
- **상태**: `main == origin/main`(`0f02f74`), 작업트리 클린. 이 세션의 UI 작업은 원격에 **보존·진화**됨
  (팀이 "기술카드 → 경력카드" 리네임 + DB 영속화/BFF/공유 연동 추가).

## 2. 이 세션이 한 일

1. **`/mono` 프로토타입 100% 재현** — 5탭(홈 · 일자리 · 경력카드 · 출역·정산 · 내 정보),
   카드 플립/3종 디자인 시안, 출근 체크 토글, 출역 9단계 타임라인,
   공고 상세·온보딩·모달·테마 피커 오버레이까지 원본 마크업·동작 그대로.
2. **테마 = MONO Tech-Blue** 기본값. 프로토타입의 `THEME` 3종(green/mono/trive) 중 `mono`(Tech-Blue)로 고정.
   (`web/app/mono/MonoApp.tsx`의 `state.theme:'mono'`, `THEMES` 객체)
3. **쇼케이스 크롬 제거 + 하이브리드 반응형** — 다크 무대·"근로자 네이티브 앱/프로토타입" 헤더·폰 베젤을 걷어내고
   **폰 화면만** 노출. `web/app/globals.css`의 `.mono-stage`/`.mono-frame`으로
   **모바일=전체화면 / PC=가운데 폰 프레임**(웹+앱 하이브리드).
4. **진입 플로우 연결** — 랜딩(`/`) → 가입(`/signup`) → 온보딩(`/onboarding`) → "시작하기" → `/mono`.
   (`web/app/(app)/onboarding/page.tsx` 마지막 버튼 `router.push("/mono")`)
5. **검수** — `tsc --noEmit`·`next lint`·`next build` 통과, 모바일/데스크톱 헤드리스 렌더 대조 확인.
6. **루트 README 현행화**(당시 단일 패키지 기준). ⚠️ 모노레포 전환으로 **현재는 일부 구식**(§5·§6).

## 3. `/mono` 구현 방식 (유지보수 시 반드시 인지)

`MonoApp.tsx`는 **손으로 다시 디자인한 것이 아니라**, 프로토타입 번들의 원본 소스를 기계 변환한 결과입니다.

- 원본은 `DCLogic` 클래스 컨트롤러 + `<sc-if>`/`<sc-for>`/`{{ }}` + 인라인스타일 **템플릿 문자열**(약 756줄).
- 이를 **결정적 변환기(Python)** 로 JSX로 일괄 변환:
  `style="a:b"`→`style={{a:'b'}}`(camelCase), `class`→`className`, `onclick="{{f}}"`→`onClick={v.f}`,
  `<sc-if value="{{c}}">`→`{c && (<>…</>)}`, `<sc-for list as=x>`→`.map((x)=>…)`,
  `{{ expr }}`→스코프 인식 `v.expr`/루프변수, SVG 명시적 닫힘 보존.
- 컨트롤러(`THEMES`·`makeQR`·`renderVals`→`v`·핸들러)는 그대로 React 함수형으로 이식.
- **시사점**: 큰 폭의 화면 수정은 인라인스타일을 직접 만지기보다, 의미 단위로 컴포넌트 분리/리팩터를 권장.
  데이터·문구는 `renderVals()`(IIFE `const v = …`) 안에 집중돼 있어 그쪽부터 손대면 됨.

## 4. 현재 상태 & 실행 방법

- `main == origin/main`(`0f02f74`), clean. 이 세션 산출물은 `0c35eee`(feat/mono-native-app 병합) 기반으로 원격에 흡수됨.
- **레포 구조가 모노레포로 전환됨**: `web/`(Next.js 14) + `api/`(NestJS 10 + Prisma) + Postgres·Redis + `docker-compose.yml`·`Makefile`.

```bash
# 웹 UI만 (가장 간단)
cd web && npm install && npm run dev      # http://localhost:3000  → /mono

# 풀스택(가입·DB 영속화) — Docker 엔진(OrbStack 등) 필요
make up                                    # db·redis·api 컨테이너(+자동 migrate deploy)
cd web && npm install && npm run dev
```
> 정본 로컬 실행 가이드는 `docs/session-handover.md §3`.

## 5. 동기화 결과 (이번 세션 말미)

- 동기화 직전: 로컬 `main`이 origin/main 보다 **19커밋 뒤**(0 앞), 작업트리 클린 → `git pull --ff-only`로 깔끔히 fast-forward.
- 원격이 그사이 **모노레포로 재편 + 백엔드 추가**:
  - 앱 일체를 `web/` 하위로 이동(package.json·prisma·tsconfig 등 rename).
  - `api/`(NestJS+Prisma) · Postgres · Redis · `docker-compose.yml` · `Makefile` · `.env.production.example` 신규.
  - 백엔드 언어 **NestJS(main) vs FastAPI(`feat/api-fastapi`)** 최종 결정 대기.
- 이 세션의 UI(하이브리드·Tech-Blue·온보딩 연결)는 **그대로 보존**되어 `web/app/mono/`에 존재.
  팀이 그 위에 경력카드 리네임 · 프로필 공유(링크+QR) · 직종/지역 다중선택 · DB 영속화 등을 얹음.

## 6. 주의 / 정리 필요 (다음 세션 권장 작업)

1. **루트 README 갱신** — 이 세션에 쓴 루트 `README.md`가 단일 패키지 기준(루트 `npm install`)이라 **모노레포 이동을 반영 못 함**.
   `cd web` 기준으로 고치거나, 정본을 `docs/session-handover.md §3`로 일원화 권장.
2. **루트 빌드 잔재 삭제** — 앱이 `web/`로 이동했으므로 루트의 `node_modules/`·`.next/`·`next-env.d.ts`·`tsconfig.tsbuildinfo`는
   stale. 삭제 가능(재생성됨). 실제 의존성·빌드는 `web/` 안에서 수행.
3. **병합된 브랜치 정리** — `feat/mono-native-app`은 `main`에 병합됨 → 원격 브랜치 삭제 가능.
4. **경력카드 입력 UI 부재** — `/mono`의 경력 표시는 아직 데모 데이터(영속화 인프라는 있음). 입력 폼 추가가 다음 자연스러운 작업
   (팀 핸드오버 §6-③과 동일).

## 7. 참고 문서

- `docs/session-handover.md` — 백엔드·인프라·DB·BFF 상세(팀 세션, 2026-06-21)
- `docs/disabled-features.md` — 비노출 처리한 규제·미구현 기능 목록
- `CLAUDE.md` / `docs/user-app-guidelines.md` — 문구 금지어·surface 톤·이벤트 로그 등 작업 규칙
