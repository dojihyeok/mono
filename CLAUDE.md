# CLAUDE.md

MONO는 현장 전문가를 위한 하이엔드 핀테크 & 경력 관리 슈퍼앱입니다.
이 파일은 모든 세션이 자동 참고하는 프로젝트 작업 기준입니다. 상세 기준은 `docs/`를 참고하세요.

## 참고 문서 (작업 전 확인)
- `docs/technical-handover.md` — 기술 스택·아키텍처·디자인 토큰·핵심 모듈
- `docs/user-app-guidelines.md` — **사용자 앱 개발 필수 기준** (문구·시나리오·이벤트 로그·P0 기능)
- `docs/strategy-page-plan.md` — 전략(IR) 페이지 Deep Dive 모달 설계·구현 가이드

## 기술 스택
- **Next.js 14+ (App Router)** / TypeScript (위치: `web/`)
- **NestJS** / PostgreSQL / Prisma ORM (위치: `api/` 및 Docker 컨테이너)
- Styling: **Vanilla CSS Modules + CSS 변수 디자인 토큰** (`web/app/globals.css`)
- State: **React Context (Auth, UI) + Local State**

## 화면 surface 3종 — 톤이 다름 (혼동 주의)
| Surface | 디자인 톤 | 기준 문서 |
| --- | --- | --- |
| B2B 포털 셸 (Company/Analytics/Admin) | **Indigo/Navy `#4f46e5` + 화이트 `#ffffff`** | B2B & BM Matrix |
| 사용자 앱 `/mono` | **시니어 최적화 심플 대화면, 모바일 우선** | user-app-guidelines & Senior-Friendly UI |
| 전략(IR) 페이지 `/bm` | **네이비·블루·시안 + White/Ivory** | strategy-page-plan |

## 개발 명령 (Next.js 웹)
```bash
cd web
npm install          # 의존성 설치
npm run dev          # 개발 서버 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # 린트
```

## 개발 명령 (NestJS API 백엔드)
```bash
docker compose up -d --build  # 백엔드 API & DB 컨테이너 백그라운드 구동
docker compose logs -f api     # 백엔드 API 실시간 로그 출력
```
