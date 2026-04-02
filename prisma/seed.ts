import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Seed Technicians
    const technicians = [
        {
            name: '김철수',
            specialty: '내장목공',
            experience: 15,
            location: '서울 강남구',
            level: 'Master',
            status: 'Available',
            verified: true,
        },
        {
            name: '이영희',
            specialty: '전기기능사',
            experience: 8,
            location: '경기 성남시',
            level: 'Technician',
            status: 'Working',
            verified: true,
        },
        {
            name: '박민수',
            specialty: '타일',
            experience: 3,
            location: '인천 부평구',
            level: 'Helper',
            status: 'Available',
            verified: false,
        },
        {
            name: '최강판',
            specialty: '철근',
            experience: 20,
            location: '부산 해운대구',
            level: 'Master',
            status: 'Available',
            verified: true,
        },
        {
            name: '장도비',
            specialty: '도배',
            experience: 12,
            location: '서울 마포구',
            level: 'Technician',
            status: 'Available',
            verified: true,
        },
        // New Additions
        {
            name: '허훈석',
            specialty: '형틀목공',
            experience: 25,
            location: '경기 수원시',
            level: 'Master',
            status: 'Working',
            verified: true,
        },
        {
            name: '이태교',
            specialty: '배관',
            experience: 10,
            location: '서울 강동구',
            level: 'Technician',
            status: 'Available',
            verified: true,
        },
        {
            name: '오지한',
            specialty: '전기',
            experience: 5,
            location: '인천 연수구',
            level: 'Technician',
            status: 'Available',
            verified: true,
        },
        {
            name: '이준이',
            specialty: '타일',
            experience: 1,
            location: '서울 송파구',
            level: 'Helper',
            status: 'Available',
            verified: false,
        },
        {
            name: '김분필',
            specialty: '도장',
            experience: 18,
            location: '서울 서초구',
            level: 'Master',
            status: 'Working',
            verified: true,
        },
        // Global Assetization Additions
        {
            name: 'John Doe',
            specialty: '스마트팜 설비 (E-7-4 비자대기)',
            experience: 4,
            location: '경기 이천시',
            level: 'Technician',
            status: 'Available',
            verified: false,
        },
        {
            name: '박글로벌',
            specialty: '배관 (호주 RPL 대기)',
            experience: 12,
            location: '부산 해운대구',
            level: 'Global Master',
            status: 'Available',
            verified: true,
        },
        {
            name: '최하이퍼',
            specialty: '공조냉동 (HVAC) / 해외파견',
            experience: 25,
            location: '서울 강남구',
            level: 'Global Master',
            status: 'Working',
            verified: true,
        },
    ]

    for (const t of technicians) {
        await prisma.technician.create({ data: t })
    }

    // Seed JobSites
    const jobs = [
        // Construction & Infra
        {
            title: '강남구 오피스텔 내장공사',
            location: '서울 강남구 역삼동',
            dailyWage: 250000,
            specialty: '내장목공',
            description: '오피스텔 3개층 내부 목공 작업. 장비 지참 필수.',
            status: 'Recruiting',
            category: 'Construction',
            isUrgent: true,
            hasCarpool: false,
        },
        {
            title: '상가 바닥 미장 작업',
            location: '서울 영등포구 문래동',
            dailyWage: 280000,
            specialty: '미장',
            description: '약 20평 규모 바닥 수평 몰탈 작업.',
            status: 'Recruiting',
            category: 'Construction',
            isUrgent: false,
            hasCarpool: true,
            carpoolLocation: '문래역 3번 출구 06:30',
        },
        // Dawn Market (Early Morning)
        {
            title: '새벽 인력 시장 (당일 지급)',
            location: '서울 구로구 남구로역',
            dailyWage: 170000,
            specialty: '일반조공',
            description: '단순 자재 정리 및 청소. 안전화 필수.',
            status: 'Recruiting',
            category: 'DawnMarket',
            isUrgent: true,
            hasCarpool: false,
        },
        // Agri-Tech
        {
            title: '스마트팜 시설 관리',
            location: '경기 이천시',
            dailyWage: 190000,
            specialty: '시설관리',
            description: '유리온실 환경제어기 조작 및 시설 보수.',
            status: 'Recruiting',
            category: 'AgriTech',
            isUrgent: false,
            hasCarpool: true,
            carpoolLocation: '이천터미널 07:00',
        },
        {
            title: '대규모 드론 방제 작업',
            location: '충남 논산시',
            dailyWage: 350000,
            specialty: '드론조종',
            description: '방제용 드론 조종 가능자. 자격증 필수.',
            status: 'Recruiting',
            category: 'AgriTech',
            isUrgent: true,
            hasCarpool: false,
        },
        // Ocean-Tech
        {
            title: '선박 엔진 정비 보조',
            location: '부산 영도구',
            dailyWage: 230000,
            specialty: '기관정비',
            description: '선박 엔진 오일 교체 및 부품 세척 보조.',
            status: 'Recruiting',
            category: 'OceanTech',
            isUrgent: false,
            hasCarpool: false,
        },
        {
            title: '양식장 수중 용접',
            location: '전남 완도군',
            dailyWage: 450000,
            specialty: '수중용접',
            description: '가두리 양식장 프레임 보수. 잠수 기능사 우대.',
            status: 'Recruiting',
            category: 'OceanTech',
            isUrgent: true,
            hasCarpool: true,
            carpoolLocation: '광주터미널 06:00 픽업',
        },
        // Global Pipeline Jobs
        {
            title: '호주 시드니 상가 배관 공사 (RPL 연계)',
            location: '해외 파견 (시드니)',
            dailyWage: 550000,
            specialty: '배관',
            description: '호주 현지 파견. RPL 자격증 발급 브릿지 프로그램 및 직무 영어 교육 무상 제공. 항공권/숙소 지원 특급 대우.',
            status: 'Recruiting',
            category: 'Construction',
            isUrgent: false,
            hasCarpool: false,
        },
        {
            title: '글로벌 K-스마트팜 구축 현장 (외국인 대환영)',
            location: '경북 구미시',
            dailyWage: 200000,
            specialty: '스마트팜 설비',
            description: '특화 비자 전환형 프로젝트. E-7-4 숙련기능인력 비자 점수 가점 및 K-Tech 기술 수료증 발급 보장.',
            status: 'Recruiting',
            category: 'AgriTech',
            isUrgent: true,
            hasCarpool: true,
            carpoolLocation: '구미역 07:00 픽업',
        },
    ]

    for (const j of jobs) {
        await prisma.jobSite.create({ data: j })
    }

    console.log('Seed data inserted successfully.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
