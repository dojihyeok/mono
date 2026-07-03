import { PrismaClient, UserRole, CareerBand, CompanyKind, JobPostStatus, CompanyStatus, IndustryType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding MVP data...');

  // 1. Create Users (Workers)
  const workers = [];
  for (let i = 1; i <= 20; i++) {
    const user = await prisma.user.create({
      data: {
        name: `김목수${i}`,
        phone: `010-1234-${i.toString().padStart(4, '0')}`,
        role: UserRole.WORKER,
        jobType: i % 2 === 0 ? ['형틀목공', '철근공'] : ['콘크리트', '비계공'],
        careerYears: i % 3 === 0 ? CareerBand.Y5_10 : CareerBand.Y1_3,
        region: ['서울', '경기'],
        industries: [IndustryType.CONSTRUCTION_FACILITY],
        workerProfile: {
          create: {
            industries: [IndustryType.CONSTRUCTION_FACILITY],
            preferredWorkTypes: ['골조', '외장'],
            interpreterNeeded: i % 5 === 0,
          }
        },
        careerCards: {
          create: [
            {
              siteName: `현대건설 ${i}현장`,
              role: i % 2 === 0 ? '형틀목공 반장' : '철근공 조공',
              startDate: new Date('2022-01-01'),
              endDate: new Date('2023-01-01'),
            }
          ]
        },
        certificates: {
          create: i % 2 === 0 ? [{ name: '건축목공기능사', licenseNo: `1234-${i}` }] : []
        },
        educations: {
          create: [{ title: '기초안전보건교육', completedAt: new Date('2021-01-01') }]
        }
      }
    });
    workers.push(user);
  }

  // 2. Create Field Leaders
  const leaders = [];
  for (let i = 1; i <= 5; i++) {
    const leader = await prisma.user.create({
      data: {
        name: `이반장${i}`,
        phone: `010-9999-${i.toString().padStart(4, '0')}`,
        role: UserRole.FIELD_LEADER,
        jobType: ['형틀목공', '철근공'],
        careerYears: CareerBand.OVER_10Y,
        region: ['전국'],
        industries: [IndustryType.CONSTRUCTION_FACILITY],
        fieldLeaderProfile: {
          create: {
            manageableTeamSize: i * 5,
          }
        },
        leadsTeams: {
          create: {
            name: `이반장${i} 팀`,
            industries: [IndustryType.CONSTRUCTION_FACILITY],
            avgCareerBand: CareerBand.Y3_5,
            safetyRate: 98.5,
          }
        }
      }
    });
    leaders.push(leader);
  }

  // 3. Create Companies (Operators & Performers)
  const companies = [];
  for (let i = 1; i <= 10; i++) {
    const company = await prisma.company.create({
      data: {
        name: i % 2 === 0 ? `대주건설(주) ${i}` : `GS건설 협력 한울ENG ${i}`,
        contactName: `김소장${i}`,
        contactPhone: `010-5555-${i.toString().padStart(4, '0')}`,
        industry: '건설업',
        industries: [IndustryType.CONSTRUCTION_FACILITY],
        region: ['서울', '경기', '인천'],
        status: CompanyStatus.POSTED,
        companyKind: i % 3 === 0 ? CompanyKind.OPERATOR : CompanyKind.PERFORMER,
      }
    });
    companies.push(company);
  }

  // 4. Create Job Posts
  for (let i = 1; i <= 30; i++) {
    const company = companies[i % companies.length];
    await prisma.jobPost.create({
      data: {
        companyId: company.id,
        title: i % 2 === 0 ? `[긴급] 송도 더스카이 현장 형틀목공 모집 (${i})` : `평택 고덕 자이 현장 철근공 팀 모집 (${i})`,
        jobType: i % 2 === 0 ? ['형틀목공'] : ['철근공'],
        headcount: i * 2,
        careerBand: i % 3 === 0 ? CareerBand.OVER_10Y : CareerBand.Y3_5,
        certs: i % 2 === 0 ? ['안전보건교육이수증'] : [],
        region: i % 2 === 0 ? ['인천 연수구'] : ['경기 평택'],
        period: '3개월',
        conditions: i % 2 === 0 ? '일당 23만원, 주급, 숙식제공' : '일당 22만원, 월급, 출퇴근',
        status: JobPostStatus.OPEN,
        foreignAllowed: i % 4 === 0,
      }
    });
  }

  // 5. Create Analytics Events
  const eventTypes = ['app_opened', 'sign_up_started', 'step_profile_entered', 'signup_completed', 'core_action_performed', 'session_started'];
  for (let i = 0; i < 200; i++) {
    const randomUser = workers[Math.floor(Math.random() * workers.length)];
    const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    // Random date within the last 30 days
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
    
    await prisma.analyticsEvent.create({
      data: {
        userId: randomUser.id,
        name: randomEvent,
        createdAt: randomDate,
      }
    });
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
