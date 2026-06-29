# 세션 핸드오버 — 2026-06-26

> 작업일(WORKLOG 기준) 2026-06-24 블록 + 본 세션. 다음 세션이 바로 이어받기 위한 문서.

## 1. 이번 세션 한 일 (요약)

1. **`/mono` 색상 전면 통일 → 사용자 지정 `#4f46e5`(인디고)**
   - 파트너웹 톤으로 전수 대조 → 라벤더(보라끼) 중성색 제거 → 인디고 램프 단일화 → 네이비 `#2c2d8f` → 최종 `#4f46e5`.
   - 입력칸 글자 검정(`#111`, placeholder 회색 유지), 홈 아바타 뱃지 제거, 옛 테마 rgba(그린 그림자·골드 할로·그린블랙 오버레이) 정리.
   - 테마 T-Rive(인디고) 하나로 정리 + 테마 스위처 제거.
   - 커밋: `6dbe30d`, `b9c80d2` (푸시됨).
2. **테스트 활성 기능 → "구현 예정" 전환**
   - 미구현 모달 5종(경력 자동확인·안전교육·금융·에스크로·오프라인 인력사무소) 상태 배지 통일.
   - 데모 인터랙션(출근/퇴근 체크·출역 신청) → "구현 예정" 모달 게이팅.
   - `CLAUDE.md` 규칙①(문구 금지어) 제거 = 오너 정책변경(네가 직접 수정).
3. **통합 개발계획서 작성** → `docs/dev-plan-master.md` (1,293줄).
   - 4개 기획서(사용자앱·관리자분석·신뢰운영·확장전략) 정합 + 현행코드 갭분석.
   - 9개 에이전트 병렬 워크플로우로 생성(실코드 근거).

## 2. 현재 상태

- 브랜치 `main`. 색상·기능 작업은 `b9c80d2`까지 푸시 완료(remote `YOungJEEE/MoNo`).
- **dev 서버 실행 중**: `localhost:3000` (백그라운드 `npm run dev`, web/). VSCode 내장 브라우저는 캐시 강함 → 변경 안 보이면 **서버 재시작**(`.next` 삭제 후 재기동)이 확실.
- DB/계정: 이전 세션에서 전체 계정 삭제됨(User 0). Company/JobPost 데모 1건씩 잔존.

## 3. 핵심 산출물 — `docs/dev-plan-master.md`

정본 = **확장전략(문서4)**. 건설·인테리어 초기 검증시장. **스키마·이벤트·enum은 확장형으로 한 번에, UI·기능은 단계 노출.**

- 0 캐노니컬 모델(용어매핑·5유형·11산업·이벤트 정본표·평가 매트릭스)
- 1 요약 · 2 갭분석(9표) · 3 데이터모델(enum 10·신규 model 12·기존확장) · 4 API(9도메인)
- 5 사용자앱 UI · 6 관리자앱 · 7 마케팅분석 · 8 이벤트작업 · 9 로드맵 · 10 MVP완료체크 · 11 BM · 12 결정필요

**최대 갭 5**: ①사용자유형 3종 부재(CUSTOMER/PROJECT_OPERATOR/PERFORMER_COMPANY) ②IndustryType·산업 온보딩 부재 ③WorkRequest+후보매칭 부재 ④다방향 Review·TrustScore 부재 ⑤이벤트 카탈로그 정본화 미적용+코드/카탈로그 불일치 5종.

## 4. 다음 작업 (로드맵 스프린트0부터 권장)

- **스프린트0(S, 의존성 없음)**: `analytics.ts` 누락 5종 등재 + `UserRole`에 `CUSTOMER`/`PROJECT_OPERATOR`/`PERFORMER_COMPANY` 추가 + `IndustryType` enum(11값) 정의. → 마이그레이션.
- 이후 1 온보딩 유형/산업 선택 → 2 기술자확장 → 3 현장리더·팀 → 4 작업요청자 도메인(WorkRequest/Review, 최대 신규) → 5 FieldOps·탭재편 → 6 관리자/분석 연동.
- 상세 의존성·난이도는 dev-plan-master.md §9.

## 5. 오너 결정 필요 (dev-plan §12 요지)

- 이미지 업로드 인프라(S3/CDN) — 경력카드 사진·작업요청 이미지 전제.
- 간편로그인(네이버/카카오/구글) MVP 포함 여부.
- 이벤트 명칭 정합 alias 정책 확정(`foreman_*`→`field_leader_*` 등).
- `Company` 모델 → `PerformerCompany`/`ProjectOperator` 승격 방식(companyKind 분기 권장).
- 후보(시행사/시공사) 샘플 데이터 출처(mock vs Company 활용).

## 6. 작업 시 주의 (gotcha)

- `web/app/mono/MonoApp.tsx`: `// @ts-nocheck` + eslint-disable → tsc/lint 검증 안 됨. 런타임 스모크(`curl :3000/mono` 200 + 렌더 확인)로 검증.
- 색 작업은 **bare hex 다수**(var 토큰 안 거침) → 토큰만 바꾸면 누락됨. 전수 sed 후 `grep`로 잔여 0 확인.
- api(NestJS)는 Docker 이미지에 구움 → 코드 변경 시 `docker compose up -d --build api` 필요. 마이그레이션은 컨테이너 entrypoint(`RUN_MIGRATIONS=1`).
- 슬랙 공유: `scripts/slack-notify.sh "메시지"` (수동, hook 아님). URL은 `.slack-webhook`(gitignore)에서만.
- 작업 기록은 `WORKLOG.md`(작업일 기준, 커밋날짜와 다름).

## 7. 미커밋/미추적 파일

- `docs/dev-plan-master.md` — 본 핸드오버와 함께 커밋 예정.
- `MONO_MVP_development_plan.md`(오너 작성), `docs/session-handover-2026-06-22/23.md`, 본 핸드오버 — 과거 관례상 핸드오버는 커밋 제외. 필요 시 오너 지시로 일괄 커밋.

## 8. 스탠딩 노트

- 존댓말 사용. 색/문구는 추측 말고 오너 지정값 확인.
- "테스트 기능 → 구현 예정 전환"은 이번에 1차 완료. 추가 발견 시 동일 패턴 적용.
