# CLAUDE.md

MONO는 현장 전문가를 위한 하이엔드 핀테크 & 경력 관리 슈퍼앱입니다.
이 파일은 모든 세션이 자동 참고하는 프로젝트 작업 기준입니다. 상세 기준은 `docs/`를 참고하세요.

## 참고 문서 (작업 전 확인)
- `docs/technical-handover.md` — 기술 스택·아키텍처·디자인 토큰·핵심 모듈
- `docs/user-app-guidelines.md` — **사용자 앱 개발 필수 기준** (문구·시나리오·이벤트 로그·P0 기능)
- `docs/strategy-page-plan.md` — 전략(IR) 페이지 Deep Dive 모달 설계·구현 가이드

## 기술 스택
- **Next.js 14+ (App Router)** / TypeScript
- **Prisma** (ORM) · **Framer Motion** (애니메이션) · **Lucide-React** (아이콘)
- Styling: **Vanilla CSS Modules + CSS 변수 디자인 토큰** (`app/globals.css`)
- State: **React Context (Auth, UI) + Local State**

## 화면 surface 3종 — 톤이 다름 (혼동 주의)
| Surface | 디자인 톤 | 기준 문서 |
| --- | --- | --- |
| 하이엔드 앱 셸 (Career/Attendance/Settlement/Admin) | **Gold `#D4AF37` + 다크 `#111111`** | technical-handover |
| 사용자 앱 MVP (가입·프로필) | **토스/당근식 심플, 모바일 우선** | user-app-guidelines |
| 전략(IR) 페이지 | **네이비·블루·시안 + White/Ivory** | strategy-page-plan |

## 반드시 지킬 규칙
1. **문구**: 사용자 노출 화면에 `Beta/Prototype/Test`, "준비 중", 내부 분석 용어(North Star/Retention/Aha), `Fake Door` 표현 금지. 규제·미구현 기능은 **"관심 신청/관심 등록"** 안내형 UX로 처리.
2. **스타일**: 새 컴포넌트는 `globals.css`의 CSS 변수를 **재사용**해 톤앤매너 유지. surface별 톤 구분.
3. **애니메이션**: Framer Motion `layout` 프로퍼티 남발 주의(리페인팅 비용).
4. **이벤트 로그**: 사용자 앱 주요 행동(가입·프로필·경력·관심·공유·재방문)에 이벤트 로그 삽입 (이름은 user-app-guidelines 참고).
5. **컴포넌트 설계**: Atomic Design 지양, 페이지별 `Client.tsx` 중심.
6. **모달 접근성**: focus trap, ESC·바깥클릭 닫기, aria-label, body scroll lock, 모바일 full-screen.
7. **테스트 범위**: PC 웹·모바일 웹·앱 화면 모두에서 동작/반응형 확인.

## 개발 명령 (코드 도입 후)
```bash
npm install          # 의존성 설치 (pnpm/yarn 사용 시 해당 매니저)
npx prisma generate  # Prisma 클라이언트 생성
npm run dev          # 개발 서버 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # 린트
```
> 실제 스크립트는 `package.json` 기준. 현재 저장소에는 앱 코드가 아직 없습니다(README/문서/환경설정만 존재).

## 클라우드(웹) 환경
- **SessionStart 훅** `.claude/hooks/session-start.sh` — 세션 시작 시 패키지매니저 자동 감지 → 의존성 설치 → `prisma generate`. 빈 저장소/비-remote 환경에서는 안전하게 no-op.
- 파일로 못 하는 부분(웹 UI 설정): **네트워크 정책**(외부 API 호출용, Trusted/Full access)과 **환경 변수/시크릿**(`DATABASE_URL`, API 키 등)은 환경 설정 화면에서 등록. 시크릿은 코드에 커밋하지 않음(`.gitignore`의 `.env` 참고).
