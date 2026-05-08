import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.transaction.deleteMany({})
    await prisma.jobSite.deleteMany({})
    await prisma.technician.deleteMany({})

    // ── Technicians ──────────────────────────
    const technicians = [
        { name: '김철수', specialty: '내장목공', experience: 15, location: '서울 강남구', level: 'Expert', status: 'Available', verified: true },
        { name: '이영희', specialty: '전기기능사', experience: 8, location: '경기 성남시', level: 'Professional', status: 'Working', verified: true },
        { name: '박민수', specialty: '타일', experience: 3, location: '인천 부평구', level: 'Helper', status: 'Available', verified: false },
        { name: '최강판', specialty: '철근', experience: 20, location: '부산 해운대구', level: 'Expert', status: 'Available', verified: true },
        { name: '장도비', specialty: '도배', experience: 12, location: '서울 마포구', level: 'Professional', status: 'Available', verified: true },
        { name: '허훈석', specialty: '형틀목공', experience: 25, location: '경기 수원시', level: 'Expert', status: 'Working', verified: true },
        { name: '이태교', specialty: '배관', experience: 10, location: '서울 강동구', level: 'Professional', status: 'Available', verified: true },
        { name: '오지한', specialty: '전기', experience: 5, location: '인천 연수구', level: 'Professional', status: 'Available', verified: true },
        { name: '이준이', specialty: '타일', experience: 1, location: '서울 송파구', level: 'Helper', status: 'Available', verified: false },
        { name: '김분필', specialty: '도장', experience: 18, location: '서울 서초구', level: 'Expert', status: 'Working', verified: true },
        { name: 'John Doe', specialty: '스마트팜 설비 (E-7-4 비자대기)', experience: 4, location: '경기 이천시', level: 'Professional', status: 'Available', verified: false },
        { name: '박글로벌', specialty: '배관 (호주 RPL 대기)', experience: 12, location: '부산 해운대구', level: 'Global Expert', status: 'Available', verified: true },
        { name: '최하이퍼', specialty: '공조냉동 (HVAC) / 해외파견', experience: 25, location: '서울 강남구', level: 'Global Expert', status: 'Working', verified: true },
        { name: '서정필굿', specialty: '현장 운영 및 소통 전문가', experience: 18, location: '전국 (Global)', level: 'Expert', status: 'Available', verified: true },
    ]

    for (const t of technicians) {
        await prisma.technician.create({ data: t })
    }

    // ── Job Sites (25개) ──────────────────────
    const jobs = [
        // ── 건설 / 인테리어 ──
        {
            title: '강남구 프리미엄 오피스텔 내장 목공',
            location: '서울 강남구 역삼동',
            dailyWage: 280000,
            specialty: '내장목공',
            description: '럭셔리 오피스텔 3개층 내부 목공 작업. 인테리어 도면 해독 가능자 우대. 공구 지참 필수.',
            status: 'Recruiting',
            category: 'Heavy-Tech',
            isUrgent: true,
            hasCarpool: false,
        },
        {
            title: '상가 바닥 미장 및 수평 작업',
            location: '서울 영등포구 문래동',
            dailyWage: 270000,
            specialty: '미장',
            description: '약 200평 규모 상가 바닥 수평 몰탈 작업. 장기 계약 우선 채용.',
            status: 'Recruiting',
            category: 'Heavy-Tech',
            isUrgent: false,
            hasCarpool: true,
            carpoolLocation: '문래역 3번 출구 06:30',
        },
        {
            title: '서초구 고급 빌라 타일 시공',
            location: '서울 서초구 반포동',
            dailyWage: 320000,
            specialty: '타일',
            description: '이탈리아산 천연석 및 대형 포세린 타일 시공. 경력 5년 이상 숙련공 우대. 정밀 시공 가능자.',
            status: 'Recruiting',
            category: 'Heavy-Tech',
            isUrgent: false,
            hasCarpool: false,
        },
        {
            title: '마포 신축 아파트 도배 작업',
            location: '서울 마포구 공덕동',
            dailyWage: 240000,
            specialty: '도배',
            description: '84m² 기준 15세대 도배 작업. 실크벽지 시공 경험자 우대. 기간: 2주.',
            status: 'Recruiting',
            category: 'Heavy-Tech',
            isUrgent: false,
            hasCarpool: true,
            carpoolLocation: '공덕역 5번 출구 07:00',
        },
        {
            title: '성수동 상가 리모델링 철거 보조',
            location: '서울 성동구 성수동',
            dailyWage: 190000,
            specialty: '일반조공(헬퍼)',
            description: '상가 리모델링 현장 내 철거 보조 및 자재 반출. 3층 엘리베이터 없음. 완력 있는 분 우대.',
            status: 'Recruiting',
            category: 'Heavy-Tech',
            isUrgent: true,
            hasCarpool: false,
        },
        {
            title: '용산 고급 주거 단지 창호 설치',
            location: '서울 용산구 이촌동',
            dailyWage: 290000,
            specialty: '창호',
            description: '시스템 창호 설치 전문가. PVC 창호 및 알루미늄 창문 설치. 장기 현장 (3개월).',
            status: 'Recruiting',
            category: 'Heavy-Tech',
            isUrgent: false,
            hasCarpool: false,
        },
        {
            title: '경기 화성 데이터센터 신축 비계',
            location: '경기 화성시 동탄',
            dailyWage: 300000,
            specialty: '비계',
            description: '대형 데이터센터 신축 현장 비계 설치. 고소작업 경험자 우대. 원정팀 구성, 숙소 지원.',
            status: 'Recruiting',
            category: 'Heavy-Tech',
            isUrgent: true,
            hasCarpool: true,
            carpoolLocation: '수원역 07:00 버스 운행',
        },
        {
            title: '판교 테크노밸리 도장 전문가',
            location: '경기 성남시 판교동',
            dailyWage: 310000,
            specialty: '도장',
            description: 'IT 빌딩 내부 수성페인트 및 에폭시 바닥 도장. 야간 작업 포함 (야간 수당 별도).',
            status: 'Recruiting',
            category: 'Heavy-Tech',
            isUrgent: false,
            hasCarpool: false,
        },

        // ── 전기 / 설비 ──
        {
            title: '평택 삼성전자 반도체 현장 전기 기술자',
            location: '경기 평택시 고덕동',
            dailyWage: 350000,
            specialty: '전기',
            description: '삼성전자 P4 반도체 공장 신축 현장 전기 배관 및 케이블 트레이 시공. 전기공사기사 우대.',
            status: 'Recruiting',
            category: 'E-Tech & IT',
            isUrgent: true,
            hasCarpool: true,
            carpoolLocation: '평택역 06:00 / 수원역 06:30',
        },
        {
            title: '인천 LNG 터미널 배관 설치',
            location: '인천 서구 원창동',
            dailyWage: 380000,
            specialty: '배관',
            description: 'LNG 저장탱크 배관 시공. 위험물 취급 자격 소지자. 방화복 제공. 식사 포함.',
            status: 'Recruiting',
            category: 'E-Tech & IT',
            isUrgent: false,
            hasCarpool: false,
        },
        {
            title: '강남 빌딩 공조 냉동 설비 점검',
            location: '서울 강남구 테헤란로',
            dailyWage: 330000,
            specialty: '공조냉동(HVAC)',
            description: '30층 이상 오피스 빌딩 냉방 설비 연간 점검 및 냉매 교체. HVAC 자격 필수.',
            status: 'Recruiting',
            category: 'E-Tech & IT',
            isUrgent: false,
            hasCarpool: false,
        },
        {
            title: '분당 신도시 아파트 전기 배선',
            location: '경기 성남시 분당구',
            dailyWage: 260000,
            specialty: '전기',
            description: '아파트 단지 내 세대 전기 배선 작업. 2종 전기공사 이상. 안전모/안전화 지참.',
            status: 'Recruiting',
            category: 'E-Tech & IT',
            isUrgent: false,
            hasCarpool: true,
            carpoolLocation: '수내역 2번 출구 07:30',
        },

        // ── 새벽 시장 ──
        {
            title: '[새벽/당일] 남구로 인력 시장 조공',
            location: '서울 구로구 남구로역',
            dailyWage: 170000,
            specialty: '일반조공(헬퍼)',
            description: '단순 자재 정리 및 현장 청소. 당일 현금 지급. 안전화 필수.',
            status: 'Recruiting',
            category: 'Safety & Support',
            isUrgent: true,
            hasCarpool: false,
        },
        {
            title: '[새벽/당일] 용산 인력 사무소 파견',
            location: '서울 용산구 한강로',
            dailyWage: 180000,
            specialty: '일반조공(헬퍼)',
            description: '건설 현장 자재 운반 및 청소 보조. 체력 있는 분 환영. 식사 제공.',
            status: 'Recruiting',
            category: 'Safety & Support',
            isUrgent: true,
            hasCarpool: false,
        },

        // ── 드론 / 농업 ──
        {
            title: '충남 논산 대규모 드론 방제',
            location: '충남 논산시 강경읍',
            dailyWage: 380000,
            specialty: '드론방제',
            description: '논 400ha 규모 농약 드론 방제. 2종 이상 드론 자격증 필수. 드론 자체 보유 시 장비 수당 추가.',
            status: 'Recruiting',
            category: 'Agri/Eco-Tech',
            isUrgent: true,
            hasCarpool: false,
        },
        {
            title: '경북 안동 스마트팜 시설 관리',
            location: '경북 안동시',
            dailyWage: 210000,
            specialty: '스마트팜 설비',
            description: '스마트 유리온실 환경제어기(온도/습도/CO₂) 관리 및 보수. 정규직 전환 가능.',
            status: 'Recruiting',
            category: 'Agri/Eco-Tech',
            isUrgent: false,
            hasCarpool: true,
            carpoolLocation: '안동역 07:30',
        },

        // ── 해양 ──
        {
            title: '부산 조선소 선박 엔진 정비',
            location: '부산 영도구 봉래동',
            dailyWage: 260000,
            specialty: '기관정비',
            description: '대형 화물선 엔진 정비 보조. 기관사 면허 보유자 우대. 방독면 지급.',
            status: 'Recruiting',
            category: 'Ocean-Tech',
            isUrgent: false,
            hasCarpool: false,
        },
        {
            title: '전남 완도 양식장 수중 용접',
            location: '전남 완도군 완도읍',
            dailyWage: 480000,
            specialty: '수중용접',
            description: '가두리 양식장 철제 프레임 보수. 잠수 기능사 또는 수중 용접 자격 필수. 장비 제공. 숙식 포함.',
            status: 'Recruiting',
            category: 'Ocean-Tech',
            isUrgent: true,
            hasCarpool: true,
            carpoolLocation: '광주터미널 06:00 픽업',
        },

        // ── 해외 파견 ──
        {
            title: '[해외] 호주 시드니 상가 배관 시공',
            location: '호주 시드니 (NSW)',
            dailyWage: 620000,
            specialty: '배관',
            description: '호주 파견 배관공 급구. RPL 자격증 발급 지원, 기술 영어 교육 무상 제공. 항공권 + 첫 3개월 숙소 지원.',
            status: 'Recruiting',
            category: 'Heavy-Tech',
            isUrgent: false,
            hasCarpool: false,
        },
        {
            title: '[해외] 사우디 네옴시티 용접 전문가',
            location: '사우디아라비아 (NEOM)',
            dailyWage: 850000,
            specialty: '용접',
            description: '초대형 미래도시 건설 현장 용접 전문가. 6G 용접 자격 이상. 비자 + 숙식 + 항공 전액 지원. 계약금 500만원.',
            status: 'Recruiting',
            category: 'Heavy-Tech',
            isUrgent: true,
            hasCarpool: false,
        },
        {
            title: '[글로벌] K-스마트팜 구축 (비자 연계)',
            location: '경북 구미시',
            dailyWage: 210000,
            specialty: '스마트팜 설비',
            description: 'E-7-4 숙련기능인력 비자 전환 프로젝트. 외국인 기술자 대환영. K-Tech 기술 수료증 발급.',
            status: 'Recruiting',
            category: 'Agri/Eco-Tech',
            isUrgent: true,
            hasCarpool: true,
            carpoolLocation: '구미역 07:00 픽업',
        },

        // ── 안전 / 지원 ──
        {
            title: '고양 킨텍스 전시장 신호수',
            location: '경기 고양시 일산서구',
            dailyWage: 195000,
            specialty: '신호수',
            description: '킨텍스 증축 공사 현장 신호수. 건설 신호수 교육 이수자 우대. 장기 근무 가능자.',
            status: 'Recruiting',
            category: 'Safety & Support',
            isUrgent: false,
            hasCarpool: true,
            carpoolLocation: '대화역 06:45',
        },
        {
            title: '인천공항 터미널 확장 안전 관리',
            location: '인천 중구 공항로',
            dailyWage: 230000,
            specialty: '안전관리보조',
            description: '인천공항 T3 신축 공사 안전 관리 보조. 산업안전기사 우대. 주 5일, 교대 근무.',
            status: 'Recruiting',
            category: 'Safety & Support',
            isUrgent: false,
            hasCarpool: false,
        },
        {
            title: '강남 재건축 현장 항공 정비 보조',
            location: '서울 강남구 개포동',
            dailyWage: 270000,
            specialty: '정비',
            description: '타워크레인 및 리프트 주간 점검 보조. 건설기계정비 기사 우대. 안전 장비 일체 지급.',
            status: 'Recruiting',
            category: 'Equipment',
            isUrgent: false,
            hasCarpool: false,
        },
        {
            title: '[긴급] 제주 풍력발전단지 설비 보수',
            location: '제주 서귀포시 성산읍',
            dailyWage: 420000,
            specialty: '설비유지보수',
            description: '제주 풍력발전 터빈 긴급 정비. 고소작업 자격 필수. 교통비+숙박비+식비 전액 지원. 즉시 출발 가능.',
            status: 'Recruiting',
            category: 'Equipment',
            isUrgent: true,
            hasCarpool: false,
        },
    ]

    for (const j of jobs) {
        await prisma.jobSite.create({ data: j })
    }

    // ── Transactions ─────────────────────────
    const firstTech = await prisma.technician.findFirst()
    if (firstTech) {
        const transactions = [
            { technicianId: firstTech.id, siteName: '강남 오피스텔 리모델링', amount: 380000, status: 'Settled', date: new Date('2026-04-15') },
            { technicianId: firstTech.id, siteName: '서초구 아파트 타일 시공', amount: 450000, status: 'Settled', date: new Date('2026-04-18') },
            { technicianId: firstTech.id, siteName: '청담동 고급 빌라 시공', amount: 520000, status: 'Settled', date: new Date('2026-04-22') },
            { technicianId: firstTech.id, siteName: '판교 IT 빌딩 도장', amount: 310000, status: 'Settled', date: new Date('2026-04-28') },
            { technicianId: firstTech.id, siteName: '한남 더 힐 대리석 보수', amount: 750000, status: 'Locked', date: new Date('2026-05-03') },
            { technicianId: firstTech.id, siteName: '강남구 신축 오피스텔', amount: 560000, status: 'Verifying', date: new Date('2026-05-07') },
        ]

        for (const t of transactions) {
            await prisma.transaction.create({ data: t })
        }
    }

    console.log('✅ Seed data inserted: 14 technicians, 25 jobs, 6 transactions.')
}

main()
    .then(async () => { await prisma.$disconnect() })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
