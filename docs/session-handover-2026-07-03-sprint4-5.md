# Sprint 4 이후 (Sprint 5+) 개발 진행 계획

Sprint 4(평가·신뢰점수·자동화)까지의 로드맵과, 외국인 기술인력 관리(Sprint 5)의 기본 인프라(비자/서류/용어/정산 등)가 이미 코드베이스에 반영 및 구현되어 있는 것을 확인했습니다.

따라서 **Sprint 4 이후의 다음 단계**로, 아직 미구현된 **MVP 잔여 핵심 과제**와 서비스 활성화를 위한 **채용공고 소싱(Job Sourcing) 기능**을 중심으로 다음 개발을 제안합니다.

## User Review Required

> [!IMPORTANT]
> 본격적인 구현에 앞서, `docs/dev-plan-master.md`의 **"오너 결정 필요 사항"** 중 한 가지를 결정해 주셔야 합니다.
> **현장작업요청(WorkRequest) 진입 주체 설정:**
> 1. **(권장) 기존 Company(기업) 모델에 통합:** `companyKind` 필드 등을 활용해 기존 기업 회원 계정에서 작업 요청을 등록할 수 있도록 흡수. (단기 개발 비용 및 복잡도 감소)
> 2. **CUSTOMER 신규 유형 신설:** `UserRole.CUSTOMER` 전용 온보딩 및 대시보드를 분리 신설. (장기적인 캐노니컬 구조에는 맞으나 개발 범위가 큼)

어느 방향으로 진행할지 승인/피드백 창에 답변해 주시면, 그에 맞춰 진행하겠습니다. (기본값으로 1번 Company 통합안을 가정하여 진행할 수 있습니다.)

## Proposed Changes

### 1. WorkRequest (현장작업요청) 등록 플로우 완결 (MVP 잔여 핵심)
- **목표:** 발주자/기업이 현장작업요청(`WorkRequest`)을 직접 등록하고 후보를 모집할 수 있는 전체 흐름 완성.
- **수정 범위:**
  - `WorkRequest` 생성/수정/상태변경 API 구현 (기존 API 확장).
  - 프론트엔드(기업용 대시보드 또는 앱)에 "작업 요청서 작성" 폼 및 내역 조회 UI 추가.
  - 관련 이벤트(`work_request_started`, `work_request_submitted`) 발화 파이프라인 정합성 확보.

### 2. 채용공고 소싱 1단계: 출역 역류 루프 (비-API 코어)
- **목표:** `docs/job-sourcing-plan.md`의 핵심인 "출역 데이터를 활용한 공급 자동 재생산" 1단계 구현.
- **수정 범위:**
  - 반장의 출역(Checkout) 화면에 **"내일도 부를 사람 (재출역 제안)"** 다중 선택 기능 추가.
  - 선택된 인원에게 익일 `JobApplication`을 자동 생성하거나 푸시 알림/제안 전송 API 추가.
  - 이를 통해 공고(JobPost) 없이도 인력 매칭이 돌아가는 Closed-Loop 구성.

### 3. FieldOps & BM 기초 정합 (선택 사항)
- **목표:** 사용자 앱의 관심 6종(`InterestFeature`)과 마스터 플랜의 7종(`FieldOpsFeature`) 통합 및 일원화.
- **수정 범위:**
  - 스키마 내 중복된 관심사 enum 병합 관리(마이그레이션).
  - 대시보드의 "산업별 PoC 리포트"에 집계되도록 이벤트 연동 완결.

## Verification Plan

### Automated Tests
- `npm run build`를 통한 API 및 Web 앱의 Type Check 및 Build 검증.
- `WorkRequest` 등록 및 `JobApplication` 자동 생성 로직에 대한 백엔드 로컬 테스트.

### Manual Verification
- 웹 대시보드/앱에서 새 작업 요청을 생성하고 상태가 정상적으로 DRAFT -> OPEN으로 변하는지 확인.
- 반장 계정으로 출역(Checkout) 시나리오를 시뮬레이션하여 "재출역 제안"이 작동하는지 UI 검증.


---


- `[x]` 1. WorkRequest 등록 플로우 (Company 통합) 백엔드 구현
  - `[x]` `WorkRequest` 생성/수정/조회 API (`api/src/work-requests`) 확장
  - `[x]` `Company` 모듈 연동 확인
- `[x]` 2. WorkRequest 등록 프론트엔드 UI 연동
  - `[x]` Company 대시보드 내 "작업 요청서 작성" 폼 추가
  - `[x]` 관련 `track` 이벤트 (`work_request_started`, `work_request_submitted`) 추가
- `[x]` 3. 채용공고 소싱 1단계: 출역 역류 루프 (재출역 제안)
  - `[x]` Attendance Checkout 시 다중 선택 제안 백엔드 추가 (`api/src/applications`)
  - `[x]` 반장 앱(Checkout 시트) UI 수정
  - `[x]` 관련 API 연동 및 `track` 이벤트 (`reattend_proposed`) 추가
- `[ ]` 4. FieldOps & BM 기초 정합 (선택 사항)
  - `[ ]` enum 일원화 가능 여부 확인 후 마이그레이션 혹은 이벤트 매핑
- `[ ]` 5. 통합 빌드 검증 및 Walkthrough 업데이트


---


# Sprint 8 ~ 10 완료 내역 요약 (MonoApp & CustomerApp 통합 고도화)

## 1. 일자리 탭 & 지원 플로우 (MonoApp, Sprint 8)
- `web/lib/types.ts` 및 `apiClient.ts`에 `JobPost`, `JobApplication` 관련 API 추가 (`apiListJobPosts`, `apiListUserApplications`, `apiApplyJobPost`).
- 목업 데이터를 제거하고 백엔드 API와 실제 연동하여 지원/배정 상태 라벨링 구현 완료.

## 2. 출역/정산 탭 데이터 연동 (MonoApp, Sprint 9)
- `apiListUserAssignments`, `apiCheckIn`, `apiCheckOut` 통신 로직을 추가하여 배정된 현장에 대한 출퇴근 체크인/아웃을 안정적으로 연동.

## 3. Walkthrough: Sourcing Loop & Company WorkRequest UI (Sprint 4/5)

## Summary of Changes
이전 단계에서 구축한 `WorkRequest` 백엔드 위에 프론트엔드 UI를 구축하고, "출역 역류 루프"(반장이 퇴근 체크 시 내일 부를 인원을 다시 제안하는 다중 선택 제안 플로우)를 완성했습니다.

### 1. WorkRequest 대시보드 연동 (Company Dashboard)
- `PartnerClient.tsx`의 탭 리스트에 **현장작업 요청**(`work_requests`) 추가
- `WorkRequestsTab` 컴포넌트를 신규 구현하여 기업(Company)이 직접 발주 요청(산업 유형, 공종, 지역, 인원 등)을 등록할 수 있도록 폼 제공
- 등록된 요청은 즉시 리스트(`WorkRequest` 상태 표시 포함)로 반영되며 `track("work_request_submitted")` 이벤트 연동 완료

### 2. 출역 역류 루프 (재출역 제안)
- **Backend (`ApplicationsService`)**:
  - `proposeReAttendance` 메서드를 추가하여 반장이 선택한 팀원(userIds)에게 내일 출역을 제안하는 `REATTEND_OFFER` Notification을 일괄 생성
- **Frontend (`MonoApp.tsx` & `apiClient.ts`)**:
  - `apiProposeReAttendance` API 클라이언트 추가
  - 반장(`isForeman === true`)이 "퇴근 체크" 버튼 클릭 시 바로 퇴근 처리하지 않고 **Checkout Sheet (퇴근 및 재출역 제안 시트)** 오픈
  - 함께 일한 동료(`coworkers`) 목록이 뜨며, 내일 재출역할 팀원을 다중 선택(원탭)할 수 있는 UI 제공
  - 완료 시 `apiProposeReAttendance` 호출 후 일괄 퇴근 처리 및 `reattend_proposed` 이벤트 로깅

## Next Steps
현재 Sprint 4(채용공고 소싱 루프) 및 Sprint 5(현장작업 요청 통합) 단계의 필수 요구사항을 모두 충족했습니다. 이후 앱을 로컬(`npm run dev`)에서 실행하여 반장 계정으로 출/퇴근 시트 및 파트너 대시보드 화면을 테스트해 보실 수 있습니다.자/발주처용 앱(`CustomerApp`)의 핵심 플로우인 **현장작업요청 등록 및 작업자 매칭 후보 리스트업** 기능까지 공식 API 클라이언트를 통해 완벽하게 구동됩니다.
- Next.js 프로덕션 빌드 상에서 `CustomerApp`과 `MonoApp` 관련된 모든 엄격한 타입체크 에러들을 성공적으로 픽스하고, 빌드를 통과(`✓ Generating static pages (44/44)`)했습니다.
- `$ npx nx run-many -t serve`로 실행 후 바로 테스트가 가능합니다.
