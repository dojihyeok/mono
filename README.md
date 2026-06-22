# MoNo

> 현장 전문가를 위한 하이엔드 핀테크 & 경력 관리 슈퍼앱

현장 근로자·기술자가 현장 경력을 **신뢰 가능한 데이터 자산**으로 쌓는 모바일 우선 슈퍼앱입니다.
가입 → 90초 온보딩 → **경력카드 앱**(경력·일자리·출역/정산·신뢰도)으로 이어지는 흐름을 제공합니다.

---

## 무엇으로 만들었나 (기술 스택)

| 구분 | 사용 기술 |
| --- | --- |
| **프레임워크** | Next.js 14 (App Router) |
| **언어** | **TypeScript** — Next.js는 "언어"가 아니라 React 기반 **프레임워크**입니다. |
| **UI** | React 18 |
| **스타일** | Vanilla CSS Modules + CSS 변수 디자인 토큰 (`app/globals.css`) · 테마: **MONO Tech-Blue** |
| **애니메이션** | Framer Motion |
| **DB / ORM** | Prisma *(현재 화면은 DB 없이 동작)* |

---

## 로컬에서 실행하기

### 1단계 — 미리 설치할 프로그램 (딱 2개)

| 프로그램 | 버전 | 받는 곳 |
| --- | --- | --- |
| **Node.js** | **20 LTS 권장** (최소 18.18). 설치하면 `npm`이 함께 깔립니다. | https://nodejs.org |
| **Git** | 최신 아무 버전 | https://git-scm.com |

설치가 잘 됐는지 확인:

```bash
node -v     # v20.x (또는 v18.18 이상)
npm -v
git --version
```

> 데이터베이스(PostgreSQL)는 **지금 단계에선 필요 없습니다.** 아래 3줄만으로 바로 돌아갑니다.

### 2단계 — 내려받아 실행 (복붙 3줄)

```bash
git clone https://github.com/YOungJEEE/MoNo.git
cd MoNo
npm install        # 의존성 설치 (끝나면 prisma generate 가 자동 실행됨)
npm run dev        # 개발 서버 시작
```

브라우저에서 **http://localhost:3000** 을 엽니다.

- `/` 에서 시작 → **프로필 만들기** → 가입 → 온보딩 → **시작하기** 를 누르면 앱(`/mono`)으로 이어집니다.
- 앱 화면을 바로 보려면 → **http://localhost:3000/mono**
- 모바일·좁은 창에서는 **전체화면**, PC 넓은 창에서는 **가운데 폰 프레임**으로 보입니다(하이브리드 반응형).

> **`.env` / DATABASE_URL 설정 불필요** — 현재 화면은 브라우저 localStorage·정적 데이터로 동작합니다.
> (실제 DB 저장은 [아래 "데이터베이스" 단계](#데이터베이스-이후-단계-지금은-불필요)에서)

### 자주 쓰는 명령

| 명령 | 설명 |
| --- | --- |
| `npm install` | 의존성 설치 |
| `npm run dev` | 개발 서버 (http://localhost:3000) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드 결과 실행 |
| `npm run lint` | 코드 검사 (ESLint) |

### 잘 안 될 때

- `npm install` 에서 멈추면 Node 버전부터 확인 (`node -v` 이 18.18 미만이면 20 LTS로 업데이트).
- 포트 충돌(3000 사용 중)이면: `npm run dev -- -p 3001` 로 다른 포트 사용.
- 캐시 꼬임이 의심되면: `rm -rf .next && npm run dev`.

---

## 프로젝트 구조 (현재)

```
app/
├─ layout.tsx              # 루트 레이아웃 (전역 CSS 로드)
├─ globals.css             # 디자인 토큰(CSS 변수) — 톤앤매너 단일 소스 · 테마 Tech-Blue
├─ manifest.ts             # PWA 매니페스트
├─ (app)/                  # 가입·온보딩 진입 플로우
│  ├─ page.tsx             #   /            랜딩
│  ├─ signup/page.tsx      #   /signup      휴대폰·이메일 가입
│  └─ onboarding/page.tsx  #   /onboarding  90초 기본 프로필 → '시작하기' → /mono
└─ mono/
   ├─ page.tsx
   └─ MonoApp.tsx          #   /mono        근로자 앱 (5탭: 홈·일자리·경력카드·출역정산·내정보)

components/                 # 공용 UI (AppShell, Button, TopBar, BottomNav 등)
lib/                        # 상태·저장(ProfileContext, store) · 타입(types) · analytics
prisma/schema.prisma        # DB 스키마 (이후 단계)
docs/                       # 작업 기준 문서 (technical-handover, user-app-guidelines 등)
```

App Router 기반이며, Atomic Design을 지양하고 **페이지별 `Client.tsx` 중심**으로 관리합니다.

---

## 데이터베이스 (이후 단계, 지금은 불필요)

경력·이벤트 데이터를 실제로 DB에 저장하는 단계부터 PostgreSQL 이 필요합니다.

```bash
cp .env.example .env       # DATABASE_URL 입력
npx prisma migrate dev     # 스키마를 로컬 DB 에 반영
```

---

## 작업 기준

- 새 컴포넌트/페이지는 `app/globals.css`의 CSS 변수를 **재사용**해 톤앤매너 유지(테마: MONO Tech-Blue).
- Framer Motion의 `layout` 프로퍼티 남발 주의(리페인팅 비용).
- 상세 기준은 루트의 `CLAUDE.md` 및 `docs/` 참고.
