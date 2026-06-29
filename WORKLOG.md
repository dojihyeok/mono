# WORKLOG

작업 기록. 날짜는 **작업한 날**(세션 시스템 날짜) 기준 — 커밋날짜와 다를 수 있음.
Slack 디지스트는 이 파일에서 날짜별로 읽어 전송. 새 작업은 맨 위 날짜 블록에 추가.

---

## 2026-06-26
- 🌏 외국인 기술인력 관리 전면 구현 (`docs/dev-plan-foreign-workforce.md` — PDF 설계서 13절 전수 매핑) — **스키마**: enum 13종 + 신규모델 9종(VisaStatus·DocumentRecord·Glossary(+Translation)·Settlement(+Item)·TrainingRecord·PartnerReferral·RiskReport) + WorkerProfile(국적·언어·한국어·거주·통역)·Review(`collaboration`)·JobPost(외국인채용) 확장. 마이그레이션 `20260626140400_foreign_workforce`(+ 기존 sprint3 폴더명 타임스탬프 순서버그 수정 140300, shadow DB 재생 정상화). **API**: users(visa/documents)·glossary·settlements·training·referrals·risk 모듈 + companies 외국인후보검색(`/foreign-workers`) + admin(만료비자·서류검토 큐·`/foreign-report`). **BFF 17종 + apiClient 래퍼 + 이벤트 20종(foreign 카테고리)**. **UI**: ForeignWorkerHub(프로필·비자·서류·교육·정산·용어 6탭)·GlossaryView(다국어 용어팩·오프라인·음성)·ForeignCandidateSearch(기업)·ForeignAdminView(/amono 탭) + MonoApp '내 정보'·CustomerApp·PerformerApp 진입점. **각 기능 하단 `ForeignNotice` 법무 안내**(비자 발급 비보장·직업소개 아님·정산 참고용·번역 보조용 — §0 경계). tsc 무에러 + E2E 스모크 전수(비자·서류·교육·용어·정산·신고·후보검색·평가 collaboration·관리자 리포트) + 브라우저 렌더 검증(/amono 외국인탭·/mono 허브·용어 — 콘솔 무에러) — 이 커밋
- 🤖 스프린트4 P2 — 자동추천·11산업·PoC 리포트 (dev-plan §4-2·§5.2·§7.3) — **자동 후보추천** `GET /work-requests/:id/recommendations`: 산업일치40+지역20+직군/작업유형20+안전율(0~10)+신뢰점수(0~20) 가중, 수행기업·작업팀·현장리더 풀 점수순 + 사유 배열. CustomerApp 후보패널 'AI 추천 후보 받기' → 점수·사유 표시 후 지정. **11산업 전면 노출**(프론트 INDUSTRIES 4→12). **PoC 리포트** `GET /admin/poc-report`: 산업별 작업요청·수행기업·작업팀·작업사례 + 총계(평가·관심·후보·평균신뢰점수), /amono 'PoC 리포트' 탭. tsc 무에러 + BFF 스모크(추천 6건 점수순·3유형·avgTrust 91.7) + 브라우저 검증 — 이 커밋
- 🚀 런타임 적용 — 직전 세션 코드만 pull(런타임 미적용)이던 것 해소. api 이미지 재빌드 → `migrate deploy`로 **스프린트1·2 마이그레이션 3종 DB 반영(11→14)**. `/health` 200·`/mono` 200 검증 — 이 커밋
- 🛠 스프린트3 UI 완성 — 현장리더·관리자·평가 (dev-plan §5.6·5.9·5.10·§6) — **MonoApp(현장리더)**: 팀 가동일정 시트(주간 status·지역·긴급투입 PUT)·AI현장리더 1클릭 관심·장비 이력 CRUD 시트. **CustomerApp**: 선정 후보 완료 평가(7항목 0~5 + 코멘트 → Review·TrustScore). **AdminClient(/amono)**: 산업·유형 대시보드(작업요청 산업분포·유형분포)·작업요청 관리(상태전이)·평가 모니터링 탭 + 캐노니컬 운영지표 카드 6종. BFF 8종 + 이벤트 4종(team_availability_updated·ai_field_leader_interest_clicked·equipment_history_added·project_review_submitted). tsc 무에러 + BFF E2E 스모크 전수 + 브라우저 런타임 검증(/amono 3탭·MonoApp 리더카드·가동일정 시트, 콘솔 무에러) — 이 커밋
- 🏢 스프린트3 UI — 운영자·수행기업 앱 (dev-plan §5.1·5.3) — TypeSelect 5유형 전면 노출(운영자·수행기업 추가). **운영자(PROJECT_OPERATOR)**: 수요측 흐름 공유(CustomerApp role-aware 헤더 + 작업요청·후보매칭) + 온보딩 시 operator-profile upsert. **수행기업(PERFORMER_COMPANY)**: 신규 PerformerApp — 회사 등록(companyKind=PERFORMER, localStorage companyId) → 공개 프로필(산업·안전이수율·사례수, '후보 풀 노출') + 작업수행사례 등록/목록. BasicProfileDto 4유형 자가선택. apiClient 5종 + BFF 3종(operator-profile·companies/[id]/profile·work-records). tsc 무에러 — 이 커밋
- 🤝 스프린트3 UI — 후보매칭 (dev-plan §5.7 4단계) — CustomerApp 작업요청 카드 탭 → **후보 패널**(바텀시트): 지정된 후보 목록 + 상태전이(지정·접촉·선정·제외, PATCH 낙관적 갱신·실패 롤백), '후보 찾기'로 **수행기업/작업팀 디렉터리**(산업·지역 필터) 조회 후 탭해서 후보 지정(멱등, 표시명 memo 스냅샷). 신규 BFF 4종(`work-requests/[id]/candidates` GET·POST, `…/[cid]` PATCH, `performers`, `teams`) + apiClient 5종 + 후보매칭 이벤트 4종(`performer_profile_viewed`·`field_leader_profile_viewed`·`operator_recommendation_clicked`·`candidate_shortlisted`). tsc 무에러 + BFF E2E 스모크(시드→조회→지정→상태전이) 통과. 운영자·수행기업 앱·현장리더 가동일정 UI·관리자 산업 대시보드는 다음 — 이 커밋
- 🧱 스프린트3 백엔드 (dev-plan §3-2/§4, P1) — **스키마 확장형 한 번에**: 마이그15(`sprint3_candidate_profiles_review`)로 `WorkerProfile`·`EquipmentHistory`·`ProjectOperator`·`WorkRecord`·`WorkRequestCandidate`·`AiLeaderInterest`·`Review`·`TrustScore` 8모델 + `CandidateType`/`CandidateStatus`/`RateeType` 3enum + `WorkRequest.candidates/reviews` 역관계 + `Company`(industries·safetyRate·rehireRate·defectMemo) 확장. 전부 비파괴. P1 API: 기술자 확장프로필·운영자프로필 upsert·장비이력 CRUD(users), 후보지정 list/add(멱등)/patch(work-requests), 작업수행사례 CRUD·수행기업 공개프로필·수행기업 디렉터리(companies), AI현장리더 관심(field-ops), 팀 디렉터리(teams). 신규 엔드포인트 스모크 전수 통과 + 어드버서리얼 리뷰 무결함. 평가/신뢰점수 API·UI는 P2로 보류(스키마만 선반영) — 이 커밋
- 📋 통합 개발계획서 `docs/dev-plan-master.md` — 4개 기획서(사용자앱·관리자분석·신뢰운영·확장전략) 정합 + 현행코드 전수 갭분석. 확장전략 정본 채택(5유형·11산업·WorkRequest·다방향 Review·이벤트 정본표). 9에이전트 병렬 워크플로우 산출. 이전 단일 계획서 폐기 — 이 커밋
- 🎨 사용자 지정 색으로 최종 통일 — 인디고 램프 → 네이비(`#2c2d8f`) → 최종 **`#4f46e5`**(전 hex+rgba 그림자 일괄). 홈 아바타 우하단 뱃지 제거, 옛 테마 rgba 잔재(그린 그림자·골드 할로·그린블랙 오버레이) → 인디고/네이비. 입력칸 글자 검정. CLAUDE.md 규칙①(문구 금지어) 제거 — 'Beta/준비 중' 등 직접 표기 허용으로 정책 변경 — 이 커밋
- 🚧 테스트로 켜둔 기능 전부 '구현 예정' 표기로 전환 — 미구현 설명 모달 5종(경력 자동확인·안전교육 검증·금융 자산화·에스크로·오프라인 인력사무소) 상태 배지 통일(허위 '운영 중' 포함), **데모 인터랙션(출근/퇴근 체크·출역 신청) 가짜 동작 → '구현 예정' 모달로 게이팅**. 실제 동작 3종(경력카드 공유·공개범위·상세요청)은 '사용 가능' 유지 — 이 커밋
- 🎨 `/mono` 색상표 파트너웹 완전 통일 + 테마 정리 — 로고(인디고→네이비 그라데이션 + 네이비 워드마크), 본문 잉크 navy `#2c2d8f`, 보조/뮤트 텍스트 warm 세이지(`#8a958d`·`#5d6b62`·`#7d8a82`)→쿨(`#8694a8`·`#5b6b82`), 활성 내비 green→indigo `#ecedfb`, 베이지 보더/면·골드 잔여 전부 쿨. **THEMES를 T-Rive(인디고)만 남기고 green·mono(Tech-Blue) 삭제 + 테마 스위처 메뉴 제거**. warm bare 헥스 0 검증, /mono 200 — 이 커밋
- 🎨 `/mono` 색상 전수 대조(파트너 팔레트 추출 → 역할별 diff) — **라벤더(보라끼) 중성색 일괄 제거**: `#e4e5f2`·`#d6d8ee`·`#8284b8`·`#f1f2f9`·`#eef0fa`·`#eceefa`·`#e0e1f1`·`#f0f1fb`·`#e6e7f2`·`#e1e2ee`·`#f7f8fe`·`#eef0ff`·`#eef0f5`·`#eceefe`·`#eceef6`·`#a9adc4`·`#9092e0` → 파트너 블루그레이(`#e6e8ec`·`#d4dae3`·`#8694a8`·`#eef0f3`·`#ecedfb`). globals 사이드바/스테이지(`#eef1f5`·warm `#f3f1ea`·`#e4e7ec`·`#4a5763`·`#163e57`·`#9aa3ad`)·지도핀·위험색도 정리. 입력칸 글자색 검정(`#111`, placeholder 회색 유지). /mono 200 — 이 커밋
- 🎨 인디고 램프 전부 `#4b4dd6` 통일(글자색 제외) — THEMES.trive/globals 변수 정의 c2·c3·a1·a3→`#4b4dd6`, amb3→`#2c2d8f`, t0→`#ecedfb`, t1·t2→`#c3c4f7`, a2=`#b9bbff` (런타임 램프가 전부 파트너 팔레트로 해석). 글자색(color:)은 freeze로 보존(다크/인디고 카드 대비 유지). 다크카드 라벨 t2 대비 `#c3c4f7`. /mono 200 — 이 커밋
- 🎨 `/mono` 색상표를 파트너웹(B2B 네이비/인디고)과 통일 — 액센트는 이미 동일(인디고 #4b4dd6/#2c2d8f), 어긋나던 **중성색(neutral)** 정렬: 따뜻한 베이지/잉크(`#15211c`·`#e2ddcf`·`#e7e2d6`·테라코타)를 파트너웹 톤으로 교체 — 본문 잉크는 파트너 **딥 네이비 `#2c2d8f`**(채도 맞춤, 파트너가 더 진해보이던 원인 해결), 보더/면 `#e6e8ec`·`#eef0f3`, 경고 앰버. globals.css `--app-*` 토큰 + MonoApp/MonoEntry 하드코딩 헥스(잉크 74곳·베이지면) 일괄. /mono 200 — 이 커밋
- 🧾 반장 승인 요청 흐름 — /mono 기능공 '반장 신청'(`foremanRequested`), /amono 핵심지표 '승인 요청' StatCard + '반장 승인' 전용 탭(대기목록·승인/반려). E2E 풀루프 검증 — 이 커밋
- 🔐 반장 = 관리자 승인제 — 온보딩 역할선택 제거(자가설정 차단), 팀 생성은 `role=FOREMAN`만(웹 게이트 + API 403). `/amono`에 반장 승인/해제 UI(`PATCH admin/users/:id/role`), 본인 role 조회(`GET /users/:id`). E2E 게이트 검증 — 이 커밋
- 🧹 기존 계정 전부 삭제(User 0건, 연관 데이터 cascade — DB 작업) + **DB 명세서·API 명세서 전면 갱신**(role·Coworker·Team·Notification·PushSubscription·삭제 엔드포인트·인덱스 등 최신 반영) — 이 커밋
- ✨ 탭(메뉴) 전환 부드럽게 — 콘텐츠 영역 `key={tab}`+`tabIn` 페이드/상승 애니메이션(전환 시에만, 스크롤 상단 리셋) — 이 커밋
- 🎨 회원탈퇴·팀삭제 확인을 native `window.confirm` → 앱 테마 확인 모달(경고 아이콘·취소/삭제, ESC·scroll-lock·focus)로 교체 — 이 커밋
- 🗑 회원 탈퇴 + 팀 삭제 기능 — `DELETE users/:id`(User+연관 cascade), `DELETE users/:id/team`(팀만 제거·멤버 User 유지). 내 정보 '회원 탈퇴' + 내 팀 '팀 삭제' 버튼(확인 다이얼로그). E2E cascade 검증 — 이 커밋
- 🎨 '프로필 만들기' 재설계(인디고 토스식 — 헤드라인+하단고정 CTA, 역할 아이콘카드, pill 칩, 스태거 모션) + 낡은 베이지 토큰 제거. 전역 입력 포커스 테두리 수정(떨어진 outline→밀착 ring) — 이 커밋
- ⚡ 코드 최적화 일괄(리뷰 반영) — DB 복합인덱스(Coworker·JobApplication), coworkers 양방향 upsert 병렬화+P2002 폴백(동시배정 엣지유실 방지), teams 트랜잭션+멤버 dedupe, notifications 매칭 DB선거름(over-fetch 제거), signup P2002 충돌필드 정확처리, web(ensureServerId in-flight 메모·중복구현 제거, 폴링 visibility gate, v·context useMemo, 죽은 export 삭제). E2E·스모크 검증 — 이 커밋
- 🧭 온보딩 개선 — 프로필 만들기에 **이름 + 역할(기능공/반장)** 입력 추가. `User.role` 저장(반장 GTM 연결). DB 적재 검증 — 이 커밋
- 🩹 프로필 서버저장 유실 버그 수정 — 경력카드·자격·관심·기본프로필이 serverId 미보유 시 조용히 버려지던 것(DB 0건 원인). 저장 전 `ensureServerId`(즉석 멱등 가입)로 자가치유 → DB 적재 확인 — 이 커밋
- 👷 반장→팀 일괄 등록 기능 — `Team`/`TeamMember` 모델, 멤버 연락처로 멱등 가입+링크, 내 정보 '내 팀' 등록 시트. **DB 직결(local-first 아님)**, E2E로 DB 적재 증명 — 이 커밋
- 📐 시장 규모 산정 — 건설+조선+제조+물류 현장인력 기준 시장크기(출처 18종 인용, 추측·실측 구분). 쉬운말 버전 `docs/market-sizing.md` — 이 커밋
- 🐳 web 컨테이너화 — `web/Dockerfile`(Next standalone·non-root) + compose에 web 서비스 + `api/.dockerignore` .env 차단. orbstack 기동·BFF프록시 검증 통과 — 이 커밋
- 🎨 `/mono` 그라데이션 전부 단색화(심플 톤) + 탭 이동 시 열린 시트/팝업 자동 닫힘 — `6299e4f`
- 🔔 알림창 하단 바텀시트 → 상단 시트(내려옴) 전환 — `5bf1dc2`
- 🔧 작업요약 Slack 전송 스크립트(`scripts/slack-notify.sh`, 비용 0) — `6f23e3d`
- 🗂 WORKLOG.md 도입(작업일 기준 기록) — 이 커밋

## 2026-06-23
- 🤝 함께 일한 동료 그래프 + 재호출 1경로(해자 코드화) — `fb042f6`
- 📄 MVP 투자/우승 적합성 진단(5렌즈 종합) — `c6e76d1` *(커밋은 06-24)*
- 🔔 알림 3겹: 매칭 엔진 + 인앱 알림센터 + 웹푸시 — `5144ed8`
- 📄 채용공고 소싱 방안 문서(비-API 코어 + 수집처 표) — `8a111bf`, `643aff7`
- 🗺 공고 상세 시트(카드→바텀시트) + 일자리 지도 버그 4종 수정 — `1fe7491`, `6035862`, `517bf4a`
