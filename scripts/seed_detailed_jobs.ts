const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.rental.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.jobSite.deleteMany();
    await prisma.technician.deleteMany();
    await prisma.partner.deleteMany();
    await prisma.financeProduct.deleteMany();

    // 1. Seed Technicians (with Trust Scores & Earnings)
    const techs = await Promise.all([
        prisma.technician.create({
            data: { name: 'Young-Hoon Kim', specialty: '타일', experience: 12, location: '서울 강남구', level: 'Master', status: 'Working', verified: true, trustScore: 96, totalEarnings: 152000000 }
        }),
        prisma.technician.create({
            data: { name: 'Ji-Sung Park', specialty: '설비', experience: 8, location: '경기 성남시', level: 'Technician', status: 'Available', verified: true, trustScore: 82, totalEarnings: 45000000 }
        }),
        prisma.technician.create({
            data: { name: 'Min-Soo Lee', specialty: '목수', experience: 15, location: '인천 중구', level: 'Master', status: 'Working', verified: true, trustScore: 99, totalEarnings: 210000000 }
        }),
    ]);

    // 2. Seed Partners
    const partners = await Promise.all([
        prisma.partner.create({ data: { companyName: '(주)성도디엔씨', tier: 'Tier1', activeSites: 4, totalPaid: 1250000000 } }),
        prisma.partner.create({ data: { companyName: 'GS건설 리모델링 본부', tier: 'Premium', activeSites: 2, totalPaid: 850000000 } }),
        prisma.partner.create({ data: { companyName: '한샘 인테리어 직영', tier: 'Standard', activeSites: 12, totalPaid: 320000000 } }),
    ]);

    // 3. Seed Jobs
    const jobs = [
        { title: '강남 고급 빌라 대형 타일 시공', location: '서울 강남구', dailyWage: 380000, specialty: '타일', description: '1200x600 대형 박판 타일 정밀 시공.', status: 'Deployed', category: 'Construction', isUrgent: true },
        { title: '판교 테크노밸리 신축 사옥 설비', location: '경기 성남시', dailyWage: 280000, specialty: '설비', description: '사옥 내장 배관 및 설비.', status: 'Matching', category: 'Construction' },
        { title: '해남 스마트팜 수경재배 설비 구축', location: '전남 해남군', dailyWage: 280000, specialty: '스마트팜설비', description: '대규모 스마트팜 유리온실 내 수경재배 자동화 설비 설치 작업.', status: 'Recruiting', category: '스마트농업', isUrgent: true }
    ];

    for (const job of jobs) {
        await prisma.jobSite.create({ data: job });
    }

    // 4. Seed Rentals
    await prisma.rental.create({
        data: {
            technicianId: techs[0].id,
            equipmentName: 'Hilti 레이저 레벨기 (PM 30-MG)',
            monthlyFee: 45000,
            status: 'Rented',
            startDate: new Date('2024-05-01'),
            endDate: new Date('2024-05-31')
        }
    });
    await prisma.rental.create({
        data: {
            equipmentName: 'Rubi TX-1250 타일 절단기',
            monthlyFee: 80000,
            status: 'Available'
        }
    });

    // 5. Seed Transactions (Escrow)
    await prisma.transaction.create({
        data: {
            technicianId: techs[0].id,
            siteName: '강남 고급 빌라 대형 타일 시공',
            amount: 380000 * 5, // 5 days
            status: 'Locked'
        }
    });

    // 6. Seed Finance Products
    await prisma.financeProduct.create({
        data: {
            name: '마스터 전용 직장인 신용대출 연계',
            description: 'Trust Score 85점 이상 기술자 대상, 제휴 은행 연 4.5% 저금리 대출',
            minTrustScore: 85,
            interestRate: 4.5,
            type: 'Loan'
        }
    });
    await prisma.financeProduct.create({
        data: {
            name: '프리미엄 장비 무이자 할부 렌탈',
            description: '고가 장비(Hilti, Festool 등) 대상 무이자 할부 전환 프로그램',
            minTrustScore: 90,
            interestRate: 0.0,
            type: 'Lease'
        }
    });

    console.log('✅ All MoNo Database Seeds (Workforce, Partners, Finance, Rentals) completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
