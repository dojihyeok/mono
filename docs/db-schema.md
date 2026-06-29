# MONO DB 명세서 (PostgreSQL)

> ORM: Prisma 5 · 원본: `api/prisma/schema.prisma` · 마이그레이션: `api/prisma/migrations/`
> 회원 = **`User.id`(cuid)** 를 PK로, 자식 테이블이 **`userId` 외래키**로 참조.
> 갱신: 2026-06-28 (스프린트2~4 캐노니컬 확장 + 외국인 기술인력 도메인 반영)

---

## 관계도 (ERD 요약)

```
                              ┌──────────────┐
                              │    User      │  (회원, PK=id cuid, role=캐노니컬 5유형)
                              └──────┬───────┘
   ┌──────────┬──────────┬──────────┼──────────┬───────────┬───────────┬──────────┐
   ▼          ▼          ▼          ▼          ▼           ▼           ▼          ▼
CareerCard Certificate Education Interest  Analytics  JobApplication Notification Push
(Cascade)  (Cascade)  (Cascade) Registr.  Event       (Cascade)     (Cascade)  Subscr.
                                (SetNull) (SetNull)        │                    (Cascade)
                                                           ▼
                                                       Attendance (Cascade)

   User ──(leader)──▶ Team ──▶ TeamMember ◀──(member) User      [리더→팀→팀원]
                       └──▶ TeamAvailability                     [팀 가동일정]
   User ──(owner)──▶ Coworker ◀──(peer) User                    [동료 그래프 엣지]
   User ─1:1─▶ WorkerProfile / FieldLeaderProfile / ProjectOperator
   User ──▶ EquipmentHistory · WorkRecord(leader) · VisaStatus · DocumentRecord · TrainingRecord

   Company ──▶ JobPost ──▶ JobApplication / Notification / Coworker(출처)
   Company ──▶ SavedWorker ◀── User · ProjectOperator · WorkRecord
   User(requester) ──▶ WorkRequest ──▶ WorkRequestCandidate / Review
   Settlement ──▶ SettlementItem ;  GlossaryTerm ──▶ GlossaryTranslation
```

- **onDelete: Cascade** — 부모 삭제 시 함께 삭제. **회원 탈퇴(User 삭제) 시** 경력·자격·교육·지원·출역·알림·푸시구독·동료엣지·팀(리더)·팀멤버십·각종 프로필(worker/leader/operator)·장비이력·작업사례·비자·서류·교육이 모두 삭제됨.
- **onDelete: SetNull** — 부모 삭제 시 FK만 null(레코드 유지): `InterestRegistration.userId`, `AnalyticsEvent.userId`, `Notification.jobPostId`, `Coworker.jobPostId`, `FieldOpsInterest.userId`, `AiLeaderInterest.userId`, `ProjectOperator.companyId`, `Review.workRequestId`.

---

## Enum (전 28종)

### 사용자·공통
| Enum | 값 | 용도 |
|---|---|---|
| `UserRole` | `WORKER`(기술자) · `FIELD_LEADER`(현장리더, 구 FOREMAN·승인제) · `CUSTOMER`(작업요청자) · `PROJECT_OPERATOR`(운영자) · `PERFORMER_COMPANY`(수행기업) | 캐노니컬 5유형. 기본 `WORKER` |
| `IndustryType` | `INTERIOR_REMODELING`·`CONSTRUCTION_FACILITY`·`SHIPBUILDING`·`PLANT`(초기 4) · `MANUFACTURING_FACILITY`·`LOGISTICS_EQUIPMENT`·`ENERGY_FACILITY`·`PORT_AIRPORT`·`PUBLIC_INFRA`·`DISASTER_RECOVERY`·`SPACE_ROBOTICS`·`ETC`(확장 7) | 산업유형 11값. UI 노출은 프론트 상수로 4값 제어 |
| `CareerBand` | `UNDER_1Y`·`Y1_3`·`Y3_5`·`Y5_10`·`OVER_10Y` | 경력 구간(버킷) |
| `InterestFeature` | `CAREER_VERIFICATION`·`FINANCE_BENEFIT`·`EQUIPMENT_RENTAL`·`FOREIGN_WORKER`·`SAFE_PAYMENT`·`COMPANY_VIEW` | 관심 신청 기능 |

### 기업·공고
| Enum | 값 | 용도 |
|---|---|---|
| `CompanyKind` | `PERFORMER`(수행기업) · `OPERATOR`(운영자) | Company 분기 |
| `CompanyStatus` | `INQUIRY`·`REVIEWING`·`PARTNER_CANDIDATE`·`POSTED`·`POC` | 기업 상태 |
| `JobPostStatus` | `DRAFT`·`PENDING`·`OPEN`·`CLOSED` | 공고 상태 |
| `ApplicationStatus` | `APPLIED`·`ACCEPTED`·`REJECTED` | 지원 상태 |

### 캐노니컬 확장(작업요청·후보·평가)
| Enum | 값 | 용도 |
|---|---|---|
| `WorkRequestStatus` | `DRAFT`·`OPEN`·`MATCHING`·`ASSIGNED`·`COMPLETED`·`CLOSED`·`CANCELLED` | 현장작업요청 상태 |
| `ContractType` | `DAILY`·`UNIT`·`LUMP_SUM`·`MONTHLY` | 계약방식 |
| `TeamAvailabilityStatus` | `AVAILABLE`·`ASSIGNED`·`PARTIAL`·`UNAVAILABLE` | 팀 가동상태 |
| `FieldOpsFeature` | `EQUIPMENT_TOOL`·`SMART_EQUIPMENT`·`MATERIAL_ORDER`·`PACKAGE`·`MEAL_LODGING`·`EDUCATION`·`INSURANCE` | Field Ops 관심 7종(BM 7종) |
| `CandidateType` | `PERFORMER_COMPANY`·`FIELD_LEADER`·`TEAM` | 후보지정 종류 |
| `CandidateStatus` | `RECOMMENDED`·`SHORTLISTED`·`CONTACTED`·`REJECTED`·`SELECTED` | 후보지정 상태 |
| `RateeType` | `WORKER`·`FIELD_LEADER`·`PERFORMER_COMPANY`·`PROJECT_OPERATOR`·`TEAM`·`SITE_ENVIRONMENT` | 평가 피대상 |

### 외국인 기술인력
| Enum | 값 | 용도 |
|---|---|---|
| `Residency` | `DOMESTIC`(국내 체류) · `OVERSEAS`(해외 거주) | 외국인 분류 키. **외국인 = `residency=OVERSEAS`** |
| `VisaType` | `E9`·`E7`·`E74`·`H2`·`D2`·`D4`·`F2`·`F4`·`F5`·`F6`·`ETC` | 체류자격 |
| `VisaDocStatus` | `PENDING`·`SUBMITTED`·`VERIFIED`·`EXPIRED`·`REJECTED` | 비자/서류 검토 상태 |
| `KoreanLevel` | `NONE`·`BASIC`·`INTERMEDIATE`·`FLUENT`·`NATIVE` | 한국어 수준 |
| `DocumentKind` | `PASSPORT`·`ARC`·`CONTRACT`·`VISA`·`TRAINING_CERT`·`OTHER` | 서류 종류 |
| `SettlementStatus` | `DRAFT`·`CONFIRMED`·`PAID`·`DISPUTED` | 정산 상태 |
| `SettlementItemKind` | `BASE_WAGE`·`OVERTIME`·`ALLOWANCE`·`MEAL`·`LODGING`·`TRANSPORT`·`EDUCATION`·`INSURANCE`·`REMITTANCE` | 정산 항목 |
| `TrainingKind` | `SAFETY`·`JOB`·`KOREAN` | 교육 종류 |
| `RiskReportKind` | `WAGE_UNPAID`·`SAFETY_ACCIDENT`·`LANGUAGE_HAZARD`·`ABUSE` | 리스크 신고 종류 |
| `RiskReportStatus` | `OPEN`·`IN_REVIEW`·`RESOLVED`·`DISMISSED` | 신고 처리 상태 |
| `PartnerReferralKind` | `VISA`·`LABOR`·`SETTLEMENT`·`EDUCATION`·`INSURANCE` | 파트너 연계 종류 |
| `PartnerReferralStatus` | `REQUESTED`·`MATCHED`·`CLOSED` | 파트너 연계 상태 |
| `SupportedLang` | `KO`·`EN`·`VI`·`TH`·`ID`·`UZ` | 지원 언어(용어사전·프로필) |

---

## 사용자 도메인

### User — 회원
| 컬럼 | 타입 | 비고 |
|---|---|---|
| id | String PK | cuid |
| phone | String? **@unique** | 식별자(가입 멱등 키). phone/email 중 하나 필수 |
| email | String? **@unique** | |
| name | String? | |
| role | `UserRole` | 기본 `WORKER`. **FIELD_LEADER는 관리자 승인으로만** 부여. 온보딩 자가설정 불가 |
| foremanRequested | Boolean | 현장리더 승인 요청(대기) 여부. 기본 false |
| jobType | String[] | 직군(복수) |
| careerYears | `CareerBand`? | 경력 구간 |
| region | String[] | 희망 지역(복수) |
| industries | `IndustryType[]` | 온보딩 산업유형(복수) — 캐노니컬 §0-3 |
| createdAt / updatedAt | DateTime | |

관계: careerCards · certificates · educations · interests · events · savedBy · applications · notifications · pushSubscriptions · coworkers/coworkerOf · leadsTeams · teamMemberships · fieldLeaderProfile(1:1) · workRequests · fieldOpsInterests · workerProfile(1:1) · projectOperator(1:1) · equipmentHistory · workRecords(leader) · reviewsGiven · aiLeaderInterests · visaStatuses · documents · trainingRecords

### CareerCard — 현장 경력
`id` · `userId`(FK Cascade) · `siteName`(필수) · `field?` · `startDate?` · `endDate?` · `role?` · `equipment?` · `coworkers?`(자유텍스트·비공개) · `memo?` · `createdAt` — `@@index([userId])`

### Certificate — 자격증
`id` · `userId`(FK Cascade) · `name` · `licenseNo`(필수·발급번호) · `issuer?` · `issuedAt?` · `createdAt` — `@@index([userId])`

### Education — 교육 이력
`id` · `userId`(FK Cascade) · `title` · `institute?` · `completedAt?` · `createdAt` — `@@index([userId])`

### InterestRegistration — 관심 신청
`id` · `userId?`(FK **SetNull**) · `feature`(`InterestFeature`) · `createdAt` — `@@index([userId])` · (userId, feature) 멱등(앱/api).

### AnalyticsEvent — 이벤트 로그
`id` · `userId?`(FK **SetNull**) · `name` · `props`(Json?) · `createdAt` — `@@index([name])` · `@@index([userId])`

---

## 기업 · 공고 도메인

### Company — 기업(수요측)
`id` · `name` · `contactName` · `contactPhone` · `contactEmail?` · `industry?` · `region`(String[]) · `status`(`CompanyStatus` 기본 INQUIRY) · `companyKind`(`CompanyKind` 기본 PERFORMER — 수행기업/운영자 분기) · `industries`(`IndustryType[]`) · `safetyRate?`(Float 0~1) · `rehireRate?`(Float 0~1) · `defectMemo?` · `memo?` · `createdAt/updatedAt` — `@@index([status])`
관계: jobPosts · savedWorkers · operatorProfiles(OperatorCompany) · workRecords

### JobPost — 채용 공고
`id` · `companyId`(FK Cascade) · `title` · `jobType`(String[]) · `headcount?` · `careerBand?` · `certs`(String[]) · `region`(String[]) · `period?` · `conditions?` · `status`(`JobPostStatus` 기본 PENDING) · `foreignAllowed`(Bool 외국인 채용 가능) · `requiredVisaTypes`(`VisaType[]`) · `interpreterProvided`(Bool 통역 제공) · `createdAt/updatedAt` — `@@index([companyId])` · `@@index([status])`
관계: applications · notifications · coworkerLinks

### SavedWorker — 기업 관심 저장
`id` · `companyId`(FK Cascade) · `userId`(FK Cascade) · `memo?` · `createdAt` — `@@unique([companyId, userId])` · `@@index([companyId])` · `@@index([userId])`

---

## 지원 · 배정 · 출역 체인

### JobApplication — 공고 지원/배정
`id` · `jobPostId`(FK Cascade) · `userId`(FK Cascade) · `status`(`ApplicationStatus` 기본 APPLIED) · `createdAt/updatedAt` — `@@unique([jobPostId, userId])`(멱등) · `@@index([userId, status])` · `@@index([jobPostId, status])` — 관계: attendances

### Attendance — 출역(출근/퇴근)
`id` · `applicationId`(FK Cascade) · `workDate`(String "YYYY-MM-DD") · `checkInAt` · `checkOutAt?` · `createdAt` — `@@index([applicationId])`

---

## 알림 · 푸시

### Notification — 인앱 알림
`id` · `userId`(FK Cascade) · `type`(String 예 `JOB_MATCH`·`COWORKER_RECALL`) · `jobPostId?`(FK **SetNull**) · `title` · `body` · `read`(기본 false) · `createdAt` — `@@index([userId, read])` · `@@index([userId, createdAt])`

### PushSubscription — 웹푸시 구독(PWA)
`id` · `userId`(FK Cascade) · `endpoint`(**@unique**) · `p256dh` · `auth` · `createdAt` — `@@index([userId])`

---

## 그래프 · 팀 (해자 / GTM)

### Coworker — 함께 일한 동료(그래프 엣지)
같은 공고 ACCEPTED 사용자끼리 자동 형성(양방향 1쌍).
`id` · `userId`(FK Cascade, 소유) · `coworkerId`(FK Cascade, 상대) · `jobPostId?`(FK **SetNull**) · `siteName?` · `count`(기본 1) · `lastWorkedAt` · `createdAt` — `@@unique([userId, coworkerId])` · `@@index([userId, lastWorkedAt])` · `@@index([coworkerId])`

### Team — 리더 팀(크루)
리더가 팀 통째 등록(공급 시딩). 리더당 팀 1개(get-or-create).
`id` · `name` · `leaderId`(FK Cascade) · `industries`(`IndustryType[]`) · `workTypes`(String[]) · `avgCareerBand?` · `safetyRate?`(0~1) · `equipOperators?`(Int) · `regions`(String[]) · `createdAt` — `@@index([leaderId])` — 관계: members · availabilities

### TeamMember — 팀원 링크
`id` · `teamId`(FK Cascade) · `userId`(FK Cascade) · `createdAt` — `@@unique([teamId, userId])` · `@@index([teamId])` · `@@index([userId])`

---

## 캐노니컬 확장 — 스프린트2 (현장작업요청·현장리더·팀가동·Field Ops)

### FieldLeaderProfile — 현장리더 프로필 (User 1:1) §3-2(3)
`id` · `userId`(**@unique** FK Cascade) · `primaryJobTypes`(String[]) · `manageableTeamSize?`(Int) · `mainWorkFields`(String[]) · `industries`(`IndustryType[]`) · `regions`(String[]) · `partnerCompanyIds`(String[] 느슨한 참조) · `contactHours?` · `updatedAt` — `@@index([userId])`

### TeamAvailability — 팀 가동일정 (Team 1:N) §3-2(4)
`id` · `teamId`(FK Cascade) · `weekStart`(String YYYY-MM-DD) · `status`(`TeamAvailabilityStatus` 기본 AVAILABLE) · `regions`(String[]) · `urgentOk`(Bool) · `assignedSiteName?` · `createdAt/updatedAt` — `@@unique([teamId, weekStart])` · `@@index([teamId])`

### WorkRequest — 현장작업요청 (발주측/운영자) §3-2(7)
`id` · `requesterId`(FK Cascade, CUSTOMER/PROJECT_OPERATOR) · `industry`(`IndustryType`) · `workTypes`(String[]) · `region`(String[]) · `budgetMemo?` · `schedule?` · `scaleMemo?` · `jobTypes`(String[]) · `headcount?` · `requiredCerts`(String[]) · `safetyConds?` · `equipMaterial?` · `contractType?`(`ContractType`) · `status`(`WorkRequestStatus` 기본 DRAFT) · `createdAt/updatedAt` — `@@index([requesterId])` · `@@index([status])` · `@@index([industry, status])` — 관계: candidates · reviews

### FieldOpsInterest — Field Ops 관심 7종 §3-2(11)
`id` · `userId?`(FK **SetNull**) · `feature`(`FieldOpsFeature`) · `props`(Json? 산업/지역 맥락) · `createdAt` — `@@index([userId])` · `@@index([feature])`

---

## 캐노니컬 확장 — 스프린트3/4 (프로필·이력·후보매칭·평가·신뢰점수)

### WorkerProfile — 기술자 확장 프로필 (User 1:1) §3-2(1)
`id` · `userId`(**@unique** FK Cascade) · `industries`(`IndustryType[]`) · `preferredWorkTypes`(String[]) · `similarWorkExperience`(String[]) · `contactHours?` · `introduction?`
외국인 속성: `residency?`(`Residency`) · `nationality?` · `languages`(`SupportedLang[]`) · `koreanLevel?`(`KoreanLevel`) · `interpreterNeeded`(Bool) · `glossaryComprehension?`(Int 0-100) · `desiredEntryDate?`(DateTime, 해외 예비) · `updatedAt` — `@@index([userId])`

### EquipmentHistory — 장비 이력 §3-2(2)
`id` · `userId`(FK Cascade) · `name` · `category?` · `proficient`(Bool) · `yearsUsed?`(Int) · `memo?` · `createdAt` — `@@index([userId])`

### ProjectOperator — 운영자 프로필 (User 1:1) §3-2(5)
`id` · `userId`(**@unique** FK Cascade) · `companyId?`(FK **SetNull**, 소속 OPERATOR Company) · `industries`(`IndustryType[]`) · `regions`(String[]) · `similarExperience`(String[]) · `leaderPoolIds`(String[] 느슨한 참조) · `budgetRangeMemo?` · `updatedAt` — `@@index([userId])` · `@@index([companyId])`

### WorkRecord — 작업수행사례 (수행기업/리더) §3-2(6)
`id` · `companyId?`(FK Cascade) · `leaderUserId?`(FK Cascade, 택1) · `industry`(`IndustryType`) · `title` · `siteName?` · `workTypes`(String[]) · `period?` · `scaleMemo?` · `description?` · `createdAt` — `@@index([companyId])` · `@@index([leaderUserId])` · `@@index([industry])`

### WorkRequestCandidate — 요청 후보지정 §3-2(8)
`id` · `workRequestId`(FK Cascade) · `candidateType`(`CandidateType`) · `candidateId`(타입별 해석) · `status`(`CandidateStatus` 기본 RECOMMENDED) · `score?`(Float) · `memo?` · `createdAt/updatedAt` — `@@unique([workRequestId, candidateType, candidateId])` · `@@index([workRequestId, status])` · `@@index([candidateType, candidateId])`

### Review — 다방향 평가(7항목) §3-2(9), P2
`id` · `raterUserId`(FK Cascade) · `rateeType`(`RateeType`) · `rateeId`(타입별 해석; SITE_ENVIRONMENT는 workRequestId) · `workRequestId?`(FK **SetNull**) · 점수 7+1항목: `scheduleAdherence?`·`workQuality?`·`communication?`·`safetyManagement?`·`costTrust?`·`rehireIntent?`·`siteEnvironment?`·`collaboration?`(외국인 신뢰도) · `comment?` · `createdAt` — `@@index([rateeType, rateeId])` · `@@index([raterUserId])` · `@@index([workRequestId])`

### TrustScore — 신뢰점수(파생) §3-2(10), P2
`id` · `subjectType`(`RateeType`) · `subjectId` · `score`(Float 기본 0) · `reviewCount`(Int 기본 0) · `breakdown`(Json? 7항목 평균) · `computedAt` — `@@unique([subjectType, subjectId])` · `@@index([subjectType, score])`

### AiLeaderInterest — AI현장리더 관심 §3-2(12)
`id` · `userId?`(FK **SetNull**) · `industry?`(`IndustryType`) · `conditions`(Json?) · `repeatPattern`(Json?) · `candidateTeamIds`(String[]) · `createdAt` — `@@index([userId])`

---

## 외국인 기술인력 도메인 (dev-plan-foreign-workforce / PDF)

### VisaStatus — 체류·비자 이력 (User 1:N) PDF §6
`id` · `userId`(FK Cascade) · `visaType`(`VisaType`) · `expiryDate?` · `renewalDueDate?` · `workScope?`(근무 가능 범위) · `workplaceChangeable`(Bool) · `arcNumber?`(외국인등록증 — 민감, 마스킹 노출) · `status`(`VisaDocStatus` 기본 PENDING) · `createdAt/updatedAt` — `@@index([userId])` · `@@index([expiryDate])`(만료 배치 스캔)

### DocumentRecord — 서류 업로드·검토 PDF §6-3
`id` · `userId`(FK Cascade) · `kind`(`DocumentKind`) · `fileUrl` · `status`(`VisaDocStatus` 기본 SUBMITTED) · `reviewedBy?` · `reviewedAt?` · `createdAt` — `@@index([userId, kind])`

### GlossaryTerm / GlossaryTranslation — 현장 용어 사전 PDF §4
- **GlossaryTerm**: `id` · `koTerm` · `category`(작업지시/안전문구/장비·공구/자재) · `industry?`(`IndustryType` 용어팩) · `iconUrl?` · `isSafety`(Bool) — `@@index([category, industry])` — 관계: translations
- **GlossaryTranslation**: `id` · `termId`(FK Cascade) · `lang`(`SupportedLang`) · `text` — `@@unique([termId, lang])`

### Settlement / SettlementItem — 비용 정산 PDF §7
- **Settlement**: `id` · `workerId`(기술자 User, relation 생략·where) · `companyId?` · `workRequestId?` · `period`(예 2026-06) · `status`(`SettlementStatus` 기본 DRAFT) · `createdAt` — `@@index([workerId])` · `@@index([companyId])` — 관계: items
- **SettlementItem**: `id` · `settlementId`(FK Cascade) · `kind`(`SettlementItemKind`) · `amount`(Int) · `note?`(제공/공제/부담 주체)

### TrainingRecord — 교육 이수 PDF §6-2·§7
`id` · `userId`(FK Cascade) · `kind`(`TrainingKind`) · `title` · `provider?` · `completedAt?` · `certUrl?` — `@@index([userId, kind])`

### PartnerReferral — 행정·노무 파트너 연계 큐 PDF §2·§6·§8-3
MVP는 User 미발급, 신청 큐만. `id` · `requesterId`(기술자/기업) · `kind`(`PartnerReferralKind`) · `status`(`PartnerReferralStatus` 기본 REQUESTED) · `note?` · `createdAt` — `@@index([status])`

### RiskReport — 리스크 신고 PDF §8-4
임금체불·산재·언어오해 작업위험·악성. `id` · `reporterId` · `subjectId?`(신고 대상) · `kind`(`RiskReportKind`) · `status`(`RiskReportStatus` 기본 OPEN) · `detail?` · `createdAt` — `@@index([status, kind])`

---

## 마이그레이션 이력

`20260620141721_init` · `_cert_license_no` · `_multi_jobtype_region` · `_add_partner_domain` · `_add_application_attendance` · `20260623120000_add_notifications` · `_add_coworkers` · `20260624130000_add_teams` · `_add_user_role` · `_perf_indexes` · `_add_foreman_request` · `20260626140000_sprint1_userrole_canonical` · `_sprint1_industry_companykind` · `_sprint2_workrequest_fieldleader_fieldops` · `_sprint3_candidate_profiles_review` · `20260626140400_foreign_workforce`

> 적용: 컨테이너 entrypoint 가 `RUN_MIGRATIONS=1` 일 때 `prisma migrate deploy` 자동 실행(`docs/migrations.md`). 운영(EKS)은 별도 마이그레이션 Job/initContainer.
