const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const jobs = [
        {
            title: '해남 스마트팜 수경재배 설비 구축',
            location: '전남 해남군',
            dailyWage: 280000,
            specialty: '스마트팜설비',
            description: '대규모 스마트팜 유리온실 내 수경재배 자동화 설비 설치 작업.',
            status: 'Recruiting',
            category: '스마트농업',
            isUrgent: true,
        },
        {
            title: '거제 조선소 특수 용접 (TIG)',
            location: '경남 거제시',
            dailyWage: 350000,
            specialty: '용접',
            description: 'LNG 선박 배관 특수 용접 작업. 자격증 소지자 필수.',
            status: 'Recruiting',
            category: '해양테크',
        },
        {
            title: '인천항 물류센터 컨베이어 정비',
            location: '인천 중구',
            dailyWage: 190000,
            specialty: '기계설비',
            description: '새벽 시간 물류 센터 내 컨베이어 벨트 소모품 교체 및 정비.',
            status: 'Recruiting',
            category: '새벽시장/물류',
        },
        {
            title: '잠실 롯데월드 타워 외부 비계 설치',
            location: '서울 송파구',
            dailyWage: 260000,
            specialty: '비계',
            description: '고층 빌딩 외부 보수용 시스템 비계 설치 및 해체 작업.',
            status: 'Recruiting',
            category: '건설/인프라',
            isUrgent: true,
        },
        {
            title: '강남 고급 빌라 대형 타일 시공',
            location: '서울 강남구',
            dailyWage: 380000,
            specialty: '타일',
            description: '1200x600 대형 박판 타일 정밀 시공. 경력자 우대.',
            status: 'Recruiting',
            category: '건설/인프라',
        },
        {
            title: '분당 아파트 옥상 우레탄 방수',
            location: '경기 성남시',
            dailyWage: 230000,
            specialty: '방수',
            description: '지정 아파트 옥상 면갈이 및 우레탄 방수 도포 공사.',
            status: 'Recruiting',
            category: '건설/인프라',
        },
        {
            title: '평택 반도체 공장 정밀 설비 정비',
            location: '경기 평택시',
            dailyWage: 310000,
            specialty: '설비유지보수',
            description: '클린룸 내 정밀 공조 및 배관 설비 유지보수 점검.',
            status: 'Recruiting',
            category: '건설/인프라',
        },
        {
            title: '김포 항공 정비 단지 엔진 보조 정비',
            location: '경기 김포시',
            dailyWage: 290000,
            specialty: '정비',
            description: '항공기 엔진 보조 부품 탈거 및 정밀 세척, 점검 보조.',
            status: 'Recruiting',
            category: '건설/인프라',
        },
        {
            title: '당진 국가산단 진입로 도로 포장',
            location: '충남 당진시',
            dailyWage: 240000,
            specialty: '토목',
            description: '신규 산단 진입 도로 아스콘 포장 및 경계선 정비 작업.',
            status: 'Recruiting',
            category: '건설/인프라',
        }
    ];

    for (const job of jobs) {
        await prisma.jobSite.create({ data: job });
    }

    console.log('Detailed jobs seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
