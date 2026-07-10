import { PrismaClient, BmEvidenceType, BmHypothesisStatus } from '@prisma/client';

// /bm 내부 BM 검증 페이지(v1.2) 초기 데이터 — 실제 MONO 수익모델 가설 4건.
// 일회성 스크립트: `npx ts-node prisma/seed-bm-hypotheses.ts` 로 1회 실행. 테이블이 비어있을 때만 삽입(멱등).
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.bmHypothesis.count();
  if (existing > 0) {
    console.log(`BmHypothesis 테이블에 이미 ${existing}건이 있어 시딩을 건너뜁니다.`);
    return;
  }

  await prisma.bmHypothesis.createMany({
    data: [
      {
        name: '급구 현장 공고',
        customerSegment: '현장 운영사·협력사',
        problem: '급한 인력을 빠르게 확보하기 어렵다.',
        valueProposition: '검증된 지역 기술자에게 공고를 빠르게 노출',
        pricingHypothesis: '건당 3만~10만원',
        revenueType: '거래형',
        currentEvidence: '전체 문의 24건 중 8곳 결제 의향 확인 (전체 문의 기준 33%, 2026.07 1주간)',
        evidenceLevel: BmEvidenceType.PILOT,
        nextExperiment: '유료 공고 5건 판매',
        successCriteria: '결제 전환율 20% 이상',
        failureCriteria: '30개 제안 후 유료 고객 2개 미만',
        owner: '대표',
        status: BmHypothesisStatus.P0_NOW,
      },
      {
        name: 'Partner Workspace',
        customerSegment: '협력사·현장 운영사',
        problem: '출역·정산·평가 데이터가 분산돼 있다.',
        valueProposition: '출역·팀·정산 증빙, 평가·재요청 통합 관리',
        pricingHypothesis: '월 구독 + 초기 설정비 (월 4만~15만원)',
        revenueType: '반복매출',
        currentEvidence: '4곳 인터뷰 · 기능 PoC 요구 확인 (2026.07 B2B)',
        evidenceLevel: BmEvidenceType.INTERVIEW,
        nextExperiment: '2개사 유료 PoC',
        successCriteria: '유료전환 1건 이상',
        failureCriteria: null,
        owner: '대표',
        status: BmHypothesisStatus.P1_NEXT,
      },
      {
        name: '검증 프로필·팀 데이터',
        customerSegment: '현장 운영사·협력사',
        problem: '기술자의 실제 경험과 자격을 확인하기 어렵다.',
        valueProposition:
          '경력·자격·안전교육·현장 이력을 구조화해 신뢰 기반 판단 지원 (급구 공고·Workspace의 매칭 품질을 높이는 신뢰 데이터 계층)',
        pricingHypothesis: '상세 검증정보 열람·후보 저장·연락 요청·대량 후보 조회·팀 단위 검증 과금',
        revenueType: '부가과금',
        currentEvidence: '12건 상담 중 5곳 즉시 도입 의향 (2026.07 B2B)',
        evidenceLevel: BmEvidenceType.SURVEY,
        nextExperiment: '유료 열람 옵션 PoC',
        successCriteria: '유료 열람 전환 3건 이상',
        failureCriteria: null,
        owner: '대표',
        status: BmHypothesisStatus.P1_NEXT,
      },
      {
        name: 'MONO Field Pass',
        customerSegment: '대형 현장·원청·협력사 관리조직',
        problem: '신원·자격·교육·출입·근태가 분리돼 있다.',
        valueProposition: '현장 투입에 필요한 신원, 자격, 교육, 출입권한과 출역 기록을 연결',
        pricingHypothesis: '현장 구독 + 구축비 + 인증 건수 과금',
        revenueType: 'Enterprise 구독',
        currentEvidence: '아키텍처 설계 · 센스톤 기술 미팅 예정',
        evidenceLevel: BmEvidenceType.TECH_REVIEW,
        nextExperiment: 'OTAC 기술 적합성 확인 · 현장 PoC 후보 확보',
        successCriteria:
          '4~8주 PoC 범위 합의 / 고객 예산·구매부서 확인 / 기술협력 또는 PoC 문서 확보',
        failureCriteria: null,
        owner: '대표',
        status: BmHypothesisStatus.P0_NOW,
      },
    ],
  });

  console.log('BmHypothesis 4건 시딩 완료.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
