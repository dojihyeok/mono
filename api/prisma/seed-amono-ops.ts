import { PrismaClient, ComplianceStatus } from '@prisma/client';

// /amono 관리자 운영·컴플라이언스(v1.0) 초기 데이터 — 기능 플래그 15건 + 컴플라이언스 항목 9건.
// 일회성 스크립트: `npx ts-node prisma/seed-amono-ops.ts` 로 1회 실행. 각 테이블이 비어있을 때만 삽입(멱등).
const prisma = new PrismaClient();

async function seedFeatureFlags() {
  const existing = await prisma.featureFlag.count();
  if (existing > 0) {
    console.log(`FeatureFlag 테이블에 이미 ${existing}건이 있어 시딩을 건너뜁니다.`);
    return;
  }

  await prisma.featureFlag.createMany({
    data: [
      { key: 'JOB_INFORMATION_SERVICE', enabled: true },
      { key: 'ACTIVE_CANDIDATE_RECOMMENDATION', enabled: false },
      { key: 'EMPLOYMENT_SUCCESS_FEE', enabled: false },
      { key: 'TEAM_DISPATCH', enabled: false },
      { key: 'PRECISE_GPS_JOB_ALERT', enabled: false },
      { key: 'GPS_ATTENDANCE_CHECKIN', enabled: false },
      { key: 'BACKGROUND_LOCATION_TRACKING', enabled: false },
      { key: 'EXTERNAL_PG_PAYMENT', enabled: true },
      { key: 'OFFICIAL_SAFETY_CERTIFICATE', enabled: false },
      { key: 'E9_H2_PRIVATE_MATCHING', enabled: false },
      { key: 'DIRECT_LOAN_RECOMMENDATION', enabled: false },
      { key: 'DIRECT_INSURANCE_SOLICITATION', enabled: false },
      { key: 'OTAC_AUTHENTICATION', enabled: false },
      { key: 'ENTERPRISE_ACCESS_API', enabled: false },
      { key: 'BIOMETRIC_AUTHENTICATION', enabled: false },
    ],
  });

  console.log('FeatureFlag 15건 시딩 완료.');
}

async function seedComplianceItems() {
  const existing = await prisma.complianceItem.count();
  if (existing > 0) {
    console.log(`ComplianceItem 테이블에 이미 ${existing}건이 있어 시딩을 건너뜁니다.`);
    return;
  }

  await prisma.complianceItem.createMany({
    data: [
      { name: '직업정보제공사업', status: ComplianceStatus.REPORT_REQUIRED },
      { name: '유료직업소개사업', status: ComplianceStatus.LICENSE_GATE },
      { name: '위치기반서비스', status: ComplianceStatus.REPORT_REQUIRED },
      { name: '통신판매업', status: ComplianceStatus.LEGAL_REVIEW },
      { name: 'PG 계약', status: ComplianceStatus.PARTNER_REQUIRED },
      { name: '교육기관 제휴', status: ComplianceStatus.PARTNER_REQUIRED },
      { name: '금융·보험 제휴', status: ComplianceStatus.PARTNER_REQUIRED },
      {
        name: 'OTAC 라이선스',
        status: ComplianceStatus.PARTNER_REQUIRED,
        authority: null,
        legalOpinion: '센스톤과 서면 합의 전이며 TECH REVIEW 단계',
      },
      { name: '기업 API 계약', status: ComplianceStatus.LEGAL_REVIEW },
    ],
  });

  console.log('ComplianceItem 9건 시딩 완료.');
}

async function main() {
  await seedFeatureFlags();
  await seedComplianceItems();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
