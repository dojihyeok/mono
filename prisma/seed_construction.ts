import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Clear existing data to avoid duplicates if necessary
    // await prisma.jobSite.deleteMany({})
    // await prisma.technician.deleteMany({})

    const jobs = [
        // 1. 전기 (Electrician)
        {
            title: '반포 디에이치 아파트 현장 전기 결선',
            location: '서울 서초구 반포동',
            dailyWage: 260000,
            specialty: '전기',
            description: '아파트 세대 전열/전등 결선 작업. 숙련공 우대.',
            status: 'Recruiting',
            category: 'Construction',
            isUrgent: true,
        },
        // 2. 배관 (Plumber)
        {
            title: '평택 삼성전자 반도체 현장 배관 용접/설치',
            location: '경기 평택시 고덕동',
            dailyWage: 320000,
            specialty: '배관',
            description: '클린룸 자동용조 및 배관 설치 작업. 안전 교육 이수자 필수.',
            status: 'Recruiting',
            category: 'Construction',
            isUrgent: false,
        },
        // 3. 용접 (Welder)
        {
            title: '울산 조선소 선체 블록 용접',
            location: '울산 동구 방어동',
            dailyWage: 290000,
            specialty: '용접',
            description: 'CO2 용접 및 TIG 용접 작업. 조선소 경험자 우대.',
            status: 'Recruiting',
            category: 'Construction',
            isUrgent: false,
        },
        // 4. 비계 (Scaffolder)
        {
            title: '화성 데이터센터 신축 현장 시스템 비계 설치',
            location: '경기 화성시',
            dailyWage: 270000,
            specialty: '비계',
            description: '고소 작업 시스템 비계 설치 및 해체 전문팀 모집.',
            status: 'Recruiting',
            category: 'Construction',
            isUrgent: true,
        },
        // 5. 타일 (Tiler)
        {
            title: '청담동 고급 빌라 대리석 타일 시공',
            location: '서울 강남구 청담동',
            dailyWage: 350000,
            specialty: '타일',
            description: '대형 박판 타일 및 천연 대리석 정밀 시공 가능자 모집.',
            status: 'Recruiting',
            category: 'Construction',
            isUrgent: false,
        },
        // 6. 목공 (Carpenter)
        {
            title: '광화문 오피스 인테리어 형틀/내장 목공',
            location: '서울 종로구 광화문',
            dailyWage: 280000,
            specialty: '목공',
            description: '가벽 설치 및 천장 텍스 작업. 전문 공구 지참자.',
            status: 'Recruiting',
            category: 'Construction',
            isUrgent: false,
        },
        // 7. 창호 (Window Installer)
        {
            title: '송도 국제도시 커튼월 유리 시공',
            location: '인천 연수구 송도동',
            dailyWage: 300000,
            specialty: '창호',
            description: '초고층 빌딩 외부 커튼월 알루미늄 창호 및 유리 설치.',
            status: 'Recruiting',
            category: 'Construction',
            isUrgent: true,
        },
        // 8. 방수 (Waterproofing)
        {
            title: '물류센터 옥상 우레탄 방수 공사',
            location: '경기 용인시 처인구',
            dailyWage: 240000,
            specialty: '방수',
            description: '옥상 면정리 및 우레탄 하도/중도/상도 작업.',
            status: 'Recruiting',
            category: 'Construction',
            isUrgent: false,
        },
        // 9. 도장 (Painter)
        {
            title: '분당 킨스타워 사무실 내부 수성 도색',
            location: '경기 성남시 분당구',
            dailyWage: 230000,
            specialty: '도배/도장',
            description: '실내 벽면 퍼티 작업 및 수성 페인트 롤러 시공.',
            status: 'Recruiting',
            category: 'Construction',
            isUrgent: false,
        },
        // 10. 설비유지보수 (Maintenance)
        {
            title: '복합 쇼핑몰 공조 설비 정기 점검/유지',
            location: '서울 송파구 잠실동',
            dailyWage: 220000,
            specialty: '설비유지보수',
            description: '중앙 집중식 냉난방 공조 시스템 필터 교체 및 설비 점검.',
            status: 'Recruiting',
            category: 'Construction',
            isUrgent: false,
        },
        // 11. 정비 (Repair/Mechanic)
        {
            title: '건설 기계 중장비 현장 순회 정비',
            location: '경기 남양주시',
            dailyWage: 310000,
            specialty: '정비',
            description: '포크레인, 덤프트럭 등 유압 계통 및 엔진 현장 수리.',
            status: 'Recruiting',
            category: 'Construction',
            isUrgent: true,
        },
        // 12. 토목 (Road Paver/Civil)
        {
            title: '세종시 국도 24호선 아스콘 포장 공사',
            location: '세종특별자치시',
            dailyWage: 250000,
            specialty: '토목',
            description: '아스팔트 피니셔 조작 및 현장 다짐 작업 전문팀.',
            status: 'Recruiting',
            category: 'Construction',
            isUrgent: false,
        },
        // 13. 현장직 (General Site Worker / Helper) - This is what construction sites need most
        {
            title: '강남 재건축 현장 자재 정리 및 현장 보조',
            location: '서울 서초구',
            dailyWage: 180000,
            specialty: '현장보조',
            description: '현장 자재 상하차 보조 및 안전 난간대 설치 보조.',
            status: 'Recruiting',
            category: 'Construction',
            isUrgent: true,
        },
        {
            title: '하남 지식산업센터 신축 현장 조공',
            location: '경기 하남시',
            dailyWage: 190000,
            specialty: '현장보조',
            description: '전기 및 설비 현장 조공. 일 배우실 분 대환영.',
            status: 'Recruiting',
            category: 'Construction',
            isUrgent: false,
        }
    ]

    for (const j of jobs) {
        await prisma.jobSite.create({ data: j })
    }

    console.log('Premium Construction Seed data inserted successfully.')
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
