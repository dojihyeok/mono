# Sprint 6 Implementation Plan: Job Sourcing & Trust Infrastructure

## 1. Goal Description
Sprint 6의 핵심 목표는 플랫폼 내 **일자리 공급 물량 확보(Job Sourcing)** 와 **상호 신뢰 데이터(TrustScore) 인프라 구축**입니다. 
다음 3가지 주요 에픽을 병렬 또는 순차적으로 개발합니다:
1. **AI 기반 구인글 파싱 (LLM 파싱)**: 카톡, 문자 등 비정형 구인글을 복사해 붙여넣으면 LLM이 구조화된 채용공고(`JobPost`)로 변환.
2. **다방향 평가 및 신뢰점수 (Review & TrustScore)**: 작업 완료 후 수요자, 현장리더, 기술자 간의 상호 평가를 통해 신뢰점수를 축적.
3. **외부 API 채용공고 수집 (External Job API)**: 사람인 등 Open API를 활용하여 초기 플랫폼의 공고 부족 문제를 해결 (콜드스타트 극복).

---

## 2. Proposed Changes

### Epic 1: AI 기반 구인글 파싱 (LLM Sourcing)
- **Database (`schema.prisma`)**:
  - `JobPost` 모델에 `rawText`(원문 텍스트), `sourceName`(원 게시자), `source`(`JobSource` enum에 `INBOUND` 추가) 필드 확장.
- **Backend (`api/src/job-posts`)**:
  - `POST /api/job-posts/parse`: 비정형 텍스트를 입력받아 AI(LLM) 프롬프트를 통해 직군, 인원, 일당, 지역, 시간 등을 추출하여 JSON 형태로 반환하는 API 구현.
- **Frontend (`web/app/mono`)**:
  - 일자리 탭 내에 "단톡방 구인글 붙여넣기" 텍스트박스 추가.
  - 파싱된 결과를 확인 및 수정하고 `JobPost`로 즉시 등록할 수 있는 Preview 모달(확인칩) 구현.

### Epic 2: 다방향 평가(Review) 및 신뢰점수 인프라
- **Database (`schema.prisma`)**:
  - `Review` 모델 신설: `raterUserId`, `rateeType`, `rateeId`, `workRequestId`, 7개 평가 항목 점수 필드.
  - `TrustScore` 모델 신설: 유저/기업별 평균 점수 캐싱 및 내역 파생.
- **Backend (`api/src/reviews`)**:
  - `POST /api/reviews`: 평가 제출 API 구현. 제출 완료 시 피평가자의 `TrustScore` 평균을 비동기로 재계산하여 업데이트.
- **Frontend (`web/app/mono` & `web/app/partner`)**:
  - 작업 종료(Checkout 또는 WorkRequest 완료) 시점에 상대방을 평가하는 별점/체크리스트 UI 구현.

### Epic 3: 외부 채용공고 API 수집 (Baseline Sourcing)
- **Database (`schema.prisma`)**:
  - `JobSource` enum에 `SARAMIN`, `GG_DATA` 등 외부 API 출처 추가. `externalId` 필드를 통한 중복 등록(upsert) 방지.
- **Backend (`api/src/cron` 또는 별도 스크립트)**:
  - 사람인 Open API 등을 정기적으로 호출(Fetch)하는 수집 스케줄러(또는 수동 트리거) 구현.
  - 수집된 공고의 외부 코드를 MONO 내부의 `IndustryType`, `Region`, `JobType`으로 변환(Mapping)하여 DB에 Upsert.
- **Frontend (`web/app/mono`)**:
  - 외부 공고일 경우 "사람인 출처" 등의 배지(Badge) 노출. 네이티브 지원(Apply) 버튼 대신 외부 링크 버튼 노출.

---

## 3. Verification Plan
- **Epic 1**: 복잡한 구인글("내일 평택 갱폼 5명 일당22 새벽5시 평택역")을 입력했을 때, 정확히 슬롯 필링되어 공고 등록이 되는지 수동 검증.
- **Epic 2**: 리뷰를 생성했을 때 DB의 `TrustScore` 점수가 정상적으로 평균 계산되어 업데이트되는지 API 테스트 코드로 검증.
- **Epic 3**: 스케줄러 실행 시 DB에 50~100개의 외부 공고가 정상적으로 매핑 및 적재되며, 사용자 일자리 리스트에 배지가 달린 채 노출되는지 검증.
