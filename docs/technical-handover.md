# MoNo 기술 인수인계서 (Technical Handover)

> 출처: "MoNo 프로젝트 기술 인수인계서". 기존 구현된 하이엔드 앱 셸의 기술 구조.
> 작성: Antigravity AI (Lead Software Architect) · 인수인계 2026-05-13.

## 1. 프로젝트 개요
- **목적**: 현장 전문가를 위한 하이엔드 핀테크 및 경력 관리 슈퍼앱.
- **철학**: Native-like UX, Institutional-Grade UI, Data-Driven Career.

## 2. 기술 스택
| 구분 | 기술 |
| --- | --- |
| Framework | Next.js 14+ (App Router) |
| Styling | Vanilla CSS Modules (CSS Variables 디자인 토큰) |
| Animation | Framer Motion (`AnimatePresence` 활용) |
| Icons | Lucide-React |
| Database / ORM | Prisma |
| State | React Context (Auth, UI) + Local State |

## 3. 디자인 토큰 (`app/globals.css`)
| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `--primary` | `#D4AF37` | Gold, 하이엔드 포인트 |
| `--surface` | `#111111` | Raised surface |
| `--border` | `rgba(255,255,255,0.08)` | 보더 |
| `--text-tertiary` | `#8E8E93` | iOS 시스템 그레이 텍스트 |

## 4. 컴포넌트 설계 정책
- Atomic Design 지양 → 페이지별 특화 레이아웃을 `Client.tsx` 내에서 직관적으로 관리.
- 모든 화면 전환·데이터 로딩은 Framer Motion으로 60fps 수준 보장.

## 5. 핵심 모듈
- **Career Passport** (`app/career/CareerClient.tsx`): 경력 데이터(JSON)를 '기술 여권'으로 렌더링. AI 기술 지수 시각화 + 블록체인 인증 인장(Seal).
- **Activity Center** (`app/attendance/AttendanceClient.tsx`): FSM `IDLE → SHUTTLE → WORKING → FINISH`. PPE 스캔은 현재 프론트 애니메이션 시뮬레이션(추후 AI API 연동 인터페이스화).
- **Smart Wallet** (`app/settlement/SettlementClient.tsx`): '자산 관리' 대시보드. 장비 펀딩 투자 시뮬레이션 포함.
- **Admin Control** (`app/admin/AdminClient.tsx`): 고밀도 데이터 관제 센터 웹 포털. 실시간 현장 활동 맵(Mock) + AI 운영 지표.

## 6. 향후 고도화 과제
- **실데이터 연동**: 현재 대부분 Mocking. Prisma 스키마 확장으로 실제 트랜잭션·경력 DB 연동 필요.
- **블록체인 앵커링**: 활동 로그를 실제 블록체인(L2 등)에 앵커링.
- **실시간 푸시**: AI 매칭/정산 알림용 WebSocket 또는 FCM.

## 7. 유지보수
- **Style**: 새 페이지 생성 시 `globals.css` 변수를 반드시 재사용.
- **Performance**: Framer Motion의 `layout` 프로퍼티 남발 주의 (리페인팅 비용).
