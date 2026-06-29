# MONO 외국인 기술인력 관리 — 개발계획서

> 원본: `docs/MONO_외국인_기술인력_관리_개발_전략_설계서.pdf` (11p, 13개 절)
> 기준 계획서: `docs/dev-plan-master.md` (캐노니컬 모델·5유형·11산업·Review/TrustScore)
> 작성 원칙: **스키마는 확장형으로 한 번에, 노출·기능은 단계적으로.** 기존 자산 최대 재사용, 신규는 최소.

이 문서는 설계서 PDF의 모든 절(1~13)을 빠짐없이 현행 코드베이스에 매핑하고, 재사용/확장/신규를 구분해 실행 단위로 분해한다.

---

## 0. 포지셔닝 & 법무 경계 (PDF §1·§6-1·§13 — 가장 먼저 못박을 것)

- MONO는 **비자 발급을 보장하지 않는다.** 고용허가제 절차(고용허가·근로계약·보험·사업장 변경)를 **대체하지 않는다.**
- 비자·체류자격·직업소개·파견·고용계약은 **법률·노무 검토 영역** → MONO는 **정보 구조화 + 상태 관리 + 알림 + 공식 행정절차/전문 파트너 연계**만 수행.
- **법적 리스크(계획 단계에서 합의 필요):** "외국인 기술자 후보 조회/매칭"이 직업안정법상 **유료직업소개·근로자파견**에 해당할 소지. → MVP는 "정보 제공 + 파트너 연계" 프레이밍 유지, 매칭 수수료 BM은 노무 검토 후 결정. **이 경계는 모든 UI 카피·약관에 반영.**
- 외부 노출명: **"외국인 현장 용어 번역"** / 내부 데이터 태그만 `NOGADA_TERM`(노가다 용어). 사용자 대면 텍스트에 내부 태그 노출 금지.

---

## 1. 사용자 매핑 (PDF §2 6종 → 현행 UserRole 5종)

새 `UserRole`을 늘리지 않는다. 외국인은 **WORKER의 속성(플래그)** 으로, 행정·노무 파트너는 **경량 연계 큐**로 처리한다.

| PDF 사용자 | 현행 매핑 | 처리 |
| --- | --- | --- |
| 국내 체류 외국인 기술자 | `WORKER` + `WorkerProfile.residency=DOMESTIC` + `isForeign` | **확장**(플래그·프로필) |
| 해외 거주 예비 기술자 | `WORKER` + `WorkerProfile.residency=OVERSEAS` | **확장** |
| 기업·수행사 | `CUSTOMER` / `PERFORMER_COMPANY` | **재사용** |
| 현장 리더 | `FIELD_LEADER` | **재사용** |
| 행정·노무 파트너 | `PartnerReferral` 연계 큐 (MVP는 User 미발급) | **신규(경량)** |
| MONO 관리자 | `/amono` | **재사용** |

> `isForeign` 판정: WorkerProfile에 외국인 필드(국적 등)가 채워졌는지로 파생. 검색 필터 빈도가 높으면 `User.isForeign` 비정규화 컬럼 1개 추가(P0 후반에 결정).

---

## 2. 신뢰도 매핑 (PDF §5 7항목 → 현행 Review 7지표 + TrustScore)

기존 `Review`/`TrustScore` 인프라 **재사용**. `RateeType.WORKER` 이미 존재 → 외국인 기술자(사람) 평가에 그대로 적용. metric은 **1개만 추가**하면 된다.

| PDF 신뢰도 항목 | 현행 Review metric | 처리 |
| --- | --- | --- |
| 의사소통 수준 | `communication` | 재사용 (외국인 맥락 라벨링) |
| 성실성 | `scheduleAdherence` + Attendance 출근율 파생 | 재사용 + 보강 |
| 기술력 | `workQuality` | 재사용 |
| 안전 준수 | `safetyManagement` | 재사용 |
| 협업 태도 | — | **`collaboration Int?` 신규 추가** |
| 체류·서류 상태 | (평가 아님 → `VisaStatus` 데이터) | 신규 모델로 분리 |
| 재고용 가능성 | `rehireIntent` | 재사용 |

**신뢰도 표시(PDF §5-2 5등급)** → `TrustScore.breakdown`(Json)에 외국인 전용 단계 라벨 매핑:
`준비 중`(프로필·서류 등록) → `기본 확인`(신원·경력·언어) → `현장 검증`(투입/기업 평가 완료) → `우수 기술자`(반복 근무·높은 평가) → `리더 후보`(팀 운영·통역·신규 적응 지원).
점수 산식은 기존 7지표 평균×20 재사용, 등급은 `reviewCount`·재요청·평가평균 임계로 산출.

> 평가는 **국적·출신 배경이 아니라 실제 업무 수행·현장 적응 데이터 중심**(PDF §5 원칙). 산식에 국적 가중 금지.

---

## 3. 데이터 모델 (PDF §9 데이터 구조 8종 → 재사용/확장/신규)

| PDF 데이터 | 주요 필드(PDF) | 현행 매핑 |
| --- | --- | --- |
| 외국인 기술자 프로필 | 이름·국적·언어·체류자격·기술 분야·경력 | `User` + `WorkerProfile`(확장) |
| 체류·비자 데이터 | 비자 유형·만료일·갱신 상태·근무 가능 범위 | **`VisaStatus`(신규)** |
| 의사소통 데이터 | 한국어 수준·현장 용어 이해도·통역 필요 | `WorkerProfile`(확장) |
| 기술 데이터 | 직무·장비 사용·자격·교육·현장 경험 | `WorkerProfile`+`EquipmentHistory`+`Certificate`+`Education`(재사용) |
| 근무 데이터 | 출근·퇴근·투입 현장·수행 결과 | `Attendance`+`WorkRecord`(재사용) |
| 평가 데이터 | 성실성·기술력·협업·안전 준수 | `Review`+`TrustScore`(재사용, §2) |
| 정산 데이터 | 임금·수당·식사·숙소·교통·지급 상태 | **`Settlement`+`SettlementItem`(신규)** |
| 교육 데이터 | 안전교육·직무교육·한국어 교육 | `Education` 확장 or **`TrainingRecord`(신규)** |
| 기업 데이터 | 공고·요청 직무·외국인 채용 수요·재요청 | `Company`+`JobPost`(확장) |

### 3-1. ENUM (신규)

```prisma
enum Residency { DOMESTIC OVERSEAS }              // 국내 체류 / 해외 거주
enum VisaType { E9 E7 E74 H2 D2 D4 F2 F4 F5 F6 ETC } // 체류자격 (E-9/E-7/H-2 등, PDF §6-2)
enum VisaDocStatus { PENDING SUBMITTED VERIFIED EXPIRED REJECTED }
enum KoreanLevel { NONE BASIC INTERMEDIATE FLUENT NATIVE }
enum DocumentKind { PASSPORT ARC CONTRACT VISA TRAINING_CERT OTHER } // ARC=외국인등록증
enum SettlementStatus { DRAFT CONFIRMED PAID DISPUTED }
enum SettlementItemKind { BASE_WAGE OVERTIME ALLOWANCE MEAL LODGING TRANSPORT EDUCATION INSURANCE REMITTANCE }
enum TrainingKind { SAFETY JOB KOREAN }
enum RiskReportKind { WAGE_UNPAID SAFETY_ACCIDENT LANGUAGE_HAZARD ABUSE } // PDF §8-4
enum RiskReportStatus { OPEN IN_REVIEW RESOLVED DISMISSED }
enum PartnerReferralKind { VISA LABOR SETTLEMENT EDUCATION INSURANCE } // 행정·노무·정산·교육·보험
enum PartnerReferralStatus { REQUESTED MATCHED CLOSED }
enum SupportedLang { KO EN VI TH ID UZ } // 한·영·베트남·태국·인니·우즈벡 (PDF §8-1)
```

### 3-2. MODEL 확장 (기존)

```prisma
// WorkerProfile — 외국인 속성 추가 (User 비대화 방지: 1:1 프로필에 수용)
model WorkerProfile {
  // ...기존 필드...
  residency            Residency?     // 국내/해외 (PDF §2)
  nationality          String?        // 국적
  languages            SupportedLang[] // 구사 언어(복수)
  koreanLevel          KoreanLevel?   // 한국어 수준 (PDF §5-1 의사소통)
  interpreterNeeded    Boolean        @default(false) // 통역 필요 여부
  glossaryComprehension Int?          // 현장 용어 이해도(0-100, 자가/평가)
  desiredEntryDate     DateTime?      // 한국 취업 희망 시점(해외 예비, PDF §3-2)
}

// Review — 협업 metric 1개 추가 (PDF §5-1 협업 태도)
model Review { /* ...기존... */ collaboration Int? }

// Company/JobPost — 외국인 채용 수요
model JobPost {
  // ...기존...
  foreignAllowed    Boolean      @default(false)
  requiredVisaTypes VisaType[]   // 요구 체류자격
  interpreterProvided Boolean    @default(false)
}
```

### 3-3. MODEL 신규

```prisma
// 체류·비자 (PDF §6) — User 1:N 이력 관리
model VisaStatus {
  id              String        @id @default(cuid())
  userId          String
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  visaType        VisaType
  expiryDate      DateTime?     // 만료일
  renewalDueDate  DateTime?     // 갱신 예정일
  workScope       String?       // 근무 가능 범위(업종·직무·사업장 제한)
  workplaceChangeable Boolean   @default(false) // 사업장 변경 가능 여부
  arcNumber       String?       // 외국인등록증 번호(민감 — 암호화/마스킹)
  status          VisaDocStatus @default(PENDING)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  @@index([userId])
  @@index([expiryDate])   // 만료 알림 배치 스캔용
}

// 서류 업로드·검토 (PDF §6-3)
model DocumentRecord {
  id          String        @id @default(cuid())
  userId      String
  kind        DocumentKind
  fileUrl     String
  status      VisaDocStatus @default(SUBMITTED)
  reviewedBy  String?       // 관리자/파트너 검토자
  reviewedAt  DateTime?
  createdAt   DateTime      @default(now())
  @@index([userId, kind])
}

// 현장 용어 사전 (PDF §4) — 내부 태그 NOGADA_TERM, 외부명 "외국인 현장 용어 번역"
model GlossaryTerm {
  id          String        @id @default(cuid())
  koTerm      String        // 한국어 현장 표현
  category    String        // 작업지시 / 안전문구 / 장비·공구 / 자재
  industry    IndustryType? // 산업별 용어팩 (PDF §4-2)
  iconUrl     String?       // 이미지·아이콘 안내(PDF §4-2)
  isSafety    Boolean       @default(false) // 안전 문구 여부
  translations GlossaryTranslation[]
  @@index([category, industry])
}
model GlossaryTranslation {
  id      String       @id @default(cuid())
  termId  String
  term    GlossaryTerm @relation(fields: [termId], references: [id], onDelete: Cascade)
  lang    SupportedLang
  text    String
  @@unique([termId, lang])
}

// 비용 정산 (PDF §7)
model Settlement {
  id          String           @id @default(cuid())
  workerId    String
  companyId   String?
  workRequestId String?
  period      String           // 정산 기간(예: 2026-06)
  status      SettlementStatus @default(DRAFT)
  items       SettlementItem[]
  createdAt   DateTime         @default(now())
  @@index([workerId])
  @@index([companyId])
}
model SettlementItem {
  id           String            @id @default(cuid())
  settlementId String
  settlement   Settlement        @relation(fields: [settlementId], references: [id], onDelete: Cascade)
  kind         SettlementItemKind
  amount       Int
  note         String?           // 제공/공제/부담 주체 등
}

// 교육 이수 (PDF §6-2·§7) — Education 확장 대신 분리(이수증·기관 메타)
model TrainingRecord {
  id          String       @id @default(cuid())
  userId      String
  kind        TrainingKind // 안전/직무/한국어
  title       String
  provider    String?
  completedAt DateTime?
  certUrl     String?
  @@index([userId, kind])
}

// 행정·노무 파트너 연계 큐 (PDF §2·§6·§8-3) — MVP는 User 미발급, 신청 큐만
model PartnerReferral {
  id          String                @id @default(cuid())
  requesterId String                // 기술자 또는 기업
  kind        PartnerReferralKind
  status      PartnerReferralStatus @default(REQUESTED)
  note        String?
  createdAt   DateTime              @default(now())
  @@index([status])
}

// 리스크 신고 (PDF §8-4) — 임금체불·산재·언어오해 작업위험·악성
model RiskReport {
  id          String           @id @default(cuid())
  reporterId  String
  subjectId   String?          // 신고 대상(사용자/기업/현장)
  kind        RiskReportKind
  status      RiskReportStatus @default(OPEN)
  detail      String?
  createdAt   DateTime         @default(now())
  @@index([status, kind])
}
```

### 3-4. 마이그레이션 주의
- **민감정보:** `arcNumber`(외국인등록증), 여권 등은 PII. 저장 시 마스킹/암호화, 로그 비노출, 접근 권한 분리. URL·쿼리스트링에 절대 미포함.
- 신규 enum/model 한 번에 마이그레이션(`make migrate-new name=foreign_workforce`), 노출은 단계적.
- `VisaStatus.expiryDate` 인덱스 — 만료 알림 배치 스캔 성능.

---

## 4. API 도메인 (NestJS — controller+service+module+DTO, 정적 라우트 우선 선언)

| 도메인 | 엔드포인트(요지) | 신규/확장 |
| --- | --- | --- |
| `users`(프로필) | `PUT /users/:id/worker-profile`에 외국인 필드 수용; `PUT/GET /users/:id/visa`, `GET /users/:id/documents` `POST .../documents` | 확장+신규 |
| `glossary` | `GET /glossary?lang=&category=&industry=` , `GET /glossary/packs/:industry`(오프라인 캐시용 번들) | **신규** |
| `settlements` | `GET/POST /settlements`, `GET /settlements/:id`, `POST /settlements/:id/dispute` | **신규** |
| `training` | `GET/POST /users/:id/training` | **신규** |
| `companies`(후보검색) | `GET /workers?isForeign=&visaType=&koreanLevel=&industry=&region=` (기존 후보추천/검색 재사용 + 외국인 필터) | 확장 |
| `reviews` | 기존 재사용(`rateeType=WORKER`) + `collaboration` 필드 | 확장 |
| `referrals` | `POST/GET /referrals` (파트너 연계 신청 큐) | **신규** |
| `risk` | `POST /risk-reports`, `GET /risk-reports`(관리자) | **신규** |
| `admin` | 체류 만료 검토 뷰, 서류 검토 큐, 신고 큐, 악성 차단, 외국인 인력 투입 리포트(PDF §8-3) | 확장 |
| `i18n` | 정적 번역 번들 + 프로필 자동번역(P1, 외부/파트너 API) | 신규 |

---

## 5. 사용자앱 UI (toss/당근식 모바일 우선, `/mono`)

### 5-1. 외국인 온보딩 (PDF §3-1 8기능 / §3-2 8기능 / §8-2)
- **다국어 회원가입** — 언어 선택 우선. 국내(DOMESTIC)/해외(OVERSEAS) 분기.
- 국내: 체류 상태 입력 → 근무 가능 지역 → 보유 기술·현장 경험 → 한국어 수준 → 희망 임금·근무 형태 → 현장 리더·동료 추천 → 기업 공고 추천.
- 해외: 국가·언어·기술 분야 → 한국 취업 희망 시점 → 자격·교육·경력 증빙 업로드 → 한국어 학습 상태 → **비자 준비 단계 체크리스트**(PDF §3-2-5) → 기업 관심 → 입국 전 교육·안전교육 연계.
- 온보딩 콘텐츠(PDF §8-2): 한국 현장 문화·안전교육·임금/계약 기본·숙소/식사/교통·신고/상담·현장 용어 학습.

### 5-2. 다국어 프로필 (PDF §8-1)
- 지원 언어: 한·영·베트남·태국·인니·우즈벡.
- 기술명·자격·경력·희망 조건 자동 번역. **기업용 한국어 프로필 ↔ 기술자용 모국어 프로필** 이중 생성.
- MVP: 정적 i18n 번들. 자동 번역은 **P1**(외부/파트너 API, 비용·품질 검토 후).

### 5-3. 현장 용어 번역 (PDF §4)
- 용어 사전(한↔다국어), 작업 지시 번역("자재 옮겨", "먹줄 잡아", "양중 준비"), 안전 문구("위험·대피·전원 차단·추락 주의"), 음성 입력(한국어→외국어), 이미지·아이콘 안내, 산업별 용어팩, **오프라인 모드**(통신 약한 현장 — 용어팩 사전 캐시).
- 음성 입력·자동 번역은 P1; **사전 기반 용어팩 + 오프라인 캐시가 P0**.

### 5-4. 비자·체류 (PDF §6-3 8기능)
- 비자 상태 입력 화면, 체류 만료 알림, 서류 업로드·검토 상태, 행정 파트너 연계 신청, 비자 유형별 체크리스트, 체류·근무 가능 상태 변경 이력. (기업용 체류 상태 확인 뷰는 §5-5 기업앱.)

### 5-5. 기업용 외국인 인력 관리 (PDF §8-3)
- 외국인 기술자 후보 검색 + 비자·체류 상태 필터 + 언어 수준 필터 + 기술·자격·경력 필터 + 팀 단위 요청 + 현장 리더·통역 가능 인력 확인 + 외국인 인력 투입 리포트.
- 기존 후보추천(`work-requests/:id/recommendations`)·팀 디렉토리·검색 재사용 + 외국인 차원 필터 추가.

### 5-6. 정산 (PDF §7)
- 근무시간 기록(Attendance 재사용), 일급·월급·프로젝트 단가 계산, 식사·숙소·교통 항목 분리, **기술자용 다국어 정산표**(P1), 기업용 정산 대시보드, 미지급·분쟁 신고, 전자 서명 기반 정산 확인(P1+), 세무·노무 파트너 연계.

---

## 6. 관리자앱 (`/amono`) — 리스크 관리 (PDF §8-4)

- 체류기간 만료 알림 큐, 근무 가능 범위 확인, 서류 검토 큐, 임금 체불 신고, 산업재해·안전사고 신고, 언어 오해 작업 위험 신고, 기업·기술자 상호 평가, **악성 사용자 차단**, **관리자 검토 큐**.
- 외국인 인력 투입 리포트(산업·기업·체류자격·언어 분포) — 기존 PoC 리포트 패턴 확장.

---

## 7. 이벤트 정본 (신규 — `analytics.ts` 카탈로그 + 서버 매핑)

기존 `foreign_worker_management_interest_clicked`(관심 placeholder)는 유지. 실도메인 이벤트 신규:

```
foreign_profile_started, foreign_profile_completed
korean_level_registered, language_selected
visa_status_registered, visa_expiry_alert_viewed
document_uploaded, document_review_updated
glossary_term_viewed, glossary_pack_opened, glossary_offline_cached, field_term_translated, voice_term_translated
foreign_candidate_searched, foreign_candidate_viewed
settlement_viewed, settlement_dispute_reported
training_completed
partner_referral_requested
risk_report_submitted          (props.kind = WAGE_UNPAID|SAFETY_ACCIDENT|LANGUAGE_HAZARD|ABUSE)
overseas_candidate_registered
```
- `track()` 클라 발화 → `/api/events` → `AnalyticsEvent`. 카탈로그 union+EVENT_CATALOG 동기(불일치 시 컴파일 에러) 패턴 유지.

---

## 8. 단계별 로드맵 (PDF §10 7단계 → 기존 sprint 연속)

기존 sprint1~4 완료(캐노니컬 5유형·11산업·WorkRequest·Review/TrustScore). 외국인 도메인은 **sprint5+**.

| PDF 단계 | 개발 범위 | 목표 | 매핑 |
| --- | --- | --- | --- |
| 1단계 | 국내 체류 외국인 프로필 | 모집·기본 검증 | **sprint5** (P0) |
| 2단계 | 다국어 프로필·현장 용어 번역 | 의사소통 완화 | sprint5~6 |
| 3단계 | 기업용 외국인 후보 검색 | 채용·투입 검토 | sprint5 (후보추천 재사용) |
| 4단계 | 비자·체류 알림 | 행정 리스크 관리 | **sprint6** |
| 5단계 | 정산 관리 | 임금·근무조건 투명화 | sprint6~7 |
| 6단계 | 해외 거주 예비 기술자 모집 | 글로벌 풀 구축 | sprint7 |
| 7단계 | 교육·비자·정산 파트너 연계 | 운영 인프라 | sprint7+ |

---

## 9. MVP 우선순위 (PDF §11 그대로)

| 우선순위 | 기능 | 이유 | 본 계획 매핑 |
| --- | --- | --- | --- |
| **P0** | 외국인 기술자 프로필 | 모집·검증 기본 | §3-2 WorkerProfile 확장 |
| **P0** | 언어·기술·체류 상태 입력 | 기업 검토 필수 | §3-3 VisaStatus + §5-1 |
| **P0** | 기업용 외국인 후보 조회 | 실제 수요 검증 | §5-5(후보검색 재사용) |
| **P0** | 현장 용어 번역 | 즉시 체감 | §5-3(용어팩+오프라인) |
| **P0** | 체류 만료 알림 | 기업 리스크 관리 | §3-3 VisaStatus.expiryDate 배치 |
| **P1** | 정산표 다국어 제공 | 분쟁 예방 | §5-6 |
| **P1** | 현장 리더 평가 | 신뢰도 고도화 | §2 Review(rateeType=WORKER) |
| **P1** | 해외 예비 기술자 등록 | 중장기 확장 | §5-1 OVERSEAS |
| **P2** | 교육·비자 파트너 연계 | 제휴 수익화 | §3-3 PartnerReferral |
| **P2** | 송금·보험 연계 | 금융 확장 | §3-1 SettlementItemKind(REMITTANCE/INSURANCE) |

---

## 10. 핵심 KPI (PDF §12)

| 영역 | KPI |
| --- | --- |
| 모집 | 외국인 기술자 가입 수, 프로필 완성률 |
| 기업 수요 | 외국인 인력 요청 수, 후보 조회 수 |
| 의사소통 | 현장 용어 번역 사용률, 한국어 수준 등록률 |
| 신뢰도 | 평가 등록률, 재요청률, 지각·결근 데이터 |
| 비자 관리 | 체류 만료 알림 확인율, 서류 완성률 |
| 정산 | 정산표 확인율, 미지급 신고율 |
| 수익화 | 외국인 후보 열람, 기업 구독, 정산·행정 파트너 연계 수익 |

---

## 11. 미결 결정 (착수 전 합의)

1. **법무:** 외국인 후보 매칭이 직업소개/파견에 해당하는지 노무 검토 → BM(매칭 수수료 vs 정보·구독) 프레이밍 확정.
2. `User.isForeign` 비정규화 컬럼 추가 여부(검색 성능 vs 정규화).
3. 자동 번역 엔진: 외부 API(품질↑·비용↑) vs 사전 기반(P0) — 단계 분리.
4. 민감 PII(여권·외국인등록증) 저장 정책: 암호화 방식·보관 기간·접근 권한.
5. 평가(P1) 착수 트리거 — 외국인 투입/완료 건수 임계(기존 dev-plan §9 평가 트리거와 정합).
6. 교육/비자/정산 파트너(행정사·노무사·세무사) 실제 제휴 확보 시점(P2 선행조건).

---

**요약:** 설계서 13개 절 전부 매핑 완료. **재사용** = 사용자 5유형·Review/TrustScore(`RateeType.WORKER`)·후보추천·Attendance·Education·Company/JobPost·이벤트 파이프라인. **확장** = WorkerProfile(외국인 필드)·Review(`collaboration`)·JobPost(외국인 채용). **신규** = VisaStatus·DocumentRecord·Glossary(+Translation)·Settlement(+Item)·TrainingRecord·PartnerReferral·RiskReport + 9개 enum. P0 5종(프로필·상태입력·후보조회·용어번역·만료알림)이 sprint5 1차 목표.
