'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Grade = 'Captain' | 'Partner' | 'Certified';
type WorkType = '인테리어·리모델링' | '건설·토목' | '전기·설비' | '도장·방수' | '철거·해체' | '조경·외부공사';
type Region = '서울' | '경기' | '인천' | '부산' | '기타';

interface Project {
  name: string;
  region: string;
  amount: string;
  date: string;
}

interface Review {
  author: string;
  rating: number;
  text: string;
}

interface Leader {
  id: number;
  name: string;
  grade: Grade;
  workTypes: WorkType[];
  region: Region;
  district: string;
  rating: number;
  completedProjects: number;
  teamSize: number;
  careerYears: number;
  lastActive: string;
  intro: string;
  equipment: string[];
  certs: string[];
  certifiedDate: string;
  ratingDist: number[]; // [★5, ★4, ★3, ★2, ★1] counts
  recentProjects: Project[];
  reviews: Review[];
  avatarColor: string;
}

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────
const LEADERS: Leader[] = [
  {
    id: 1, name: '김현장', grade: 'Captain', workTypes: ['인테리어·리모델링'],
    region: '서울', district: '강남구', rating: 4.9, completedProjects: 234,
    teamSize: 8, careerYears: 12, lastActive: '1일 전',
    intro: '강남구·서초구·송파구 프리미엄 인테리어 전문. 분당·판교 신축 아파트 시공 경험 다수. 착공 전 상세 도면 검토 및 일정 관리 체계화.',
    equipment: ['전문 도배 장비 풀셋', '레이저 수평 측정기', '전동공구 세트'],
    certs: ['실내건축기능사', '건설안전기사', 'MONO Captain 인증'],
    certifiedDate: '2025.03.15',
    ratingDist: [198, 28, 6, 1, 1],
    recentProjects: [
      { name: '강남구 아파트 32평 리모델링', region: '서울 강남구', amount: '₩4,200만', date: '2026.06' },
      { name: '서초구 오피스 40평 인테리어', region: '서울 서초구', amount: '₩5,800만', date: '2026.05' },
      { name: '송파구 상가 인테리어', region: '서울 송파구', amount: '₩2,900만', date: '2026.04' },
    ],
    reviews: [
      { author: '(주)알파건설', rating: 5, text: '일정 준수율 100%, 마감 품질 매우 만족. 반드시 재요청 예정입니다.' },
      { author: '개인 고객 이○○', rating: 5, text: '세세한 부분까지 꼼꼼하게 처리해주셔서 감사합니다. 지인에게 추천했습니다.' },
    ],
    avatarColor: '#10b981',
  },
  {
    id: 2, name: '박도장', grade: 'Partner', workTypes: ['도장·방수'],
    region: '경기', district: '수원시', rating: 4.8, completedProjects: 156,
    teamSize: 5, careerYears: 9, lastActive: '3일 전',
    intro: '수원·화성·평택 외벽 도장 및 방수 전문. 아파트 외벽, 지하주차장 바닥 도장 다수 시공. 친환경 도료 전문 자격 보유.',
    equipment: ['고압 에어리스 스프레이', '방수 도포 장비', '비계 자재 보유'],
    certs: ['도장기능사', '건축도장기능사', 'MONO Partner 인증'],
    certifiedDate: '2025.06.20',
    ratingDist: [128, 22, 4, 1, 1],
    recentProjects: [
      { name: '수원 아파트 외벽 도장', region: '경기 수원시', amount: '₩3,100만', date: '2026.06' },
      { name: '화성 지식산업센터 바닥 도장', region: '경기 화성시', amount: '₩1,800만', date: '2026.05' },
      { name: '평택 창고 방수공사', region: '경기 평택시', amount: '₩890만', date: '2026.04' },
    ],
    reviews: [
      { author: '한국방수㈜', rating: 5, text: '시공 속도와 품질 모두 최고. 방수 하자 없이 완벽하게 마무리.' },
      { author: '경기개발㈜', rating: 4, text: '일정이 약간 조정되었지만 최종 품질은 매우 만족스럽습니다.' },
    ],
    avatarColor: '#6366f1',
  },
  {
    id: 3, name: '이철거', grade: 'Captain', workTypes: ['철거·해체'],
    region: '서울', district: '성동구', rating: 4.9, completedProjects: 189,
    teamSize: 12, careerYears: 15, lastActive: '2일 전',
    intro: '서울 전역 철거·해체 전문. 석면 철거 자격 보유. 재건축·리모델링 사전 철거 다수. 안전 관리 체계 우수.',
    equipment: ['소형 굴착기', '컴프레셔', '석면 처리 장비'],
    certs: ['건설기계조종사', '석면해체·제거업 자격', 'MONO Captain 인증'],
    certifiedDate: '2024.12.01',
    ratingDist: [165, 20, 3, 0, 1],
    recentProjects: [
      { name: '성동구 근린생활시설 전층 철거', region: '서울 성동구', amount: '₩2,400만', date: '2026.06' },
      { name: '마포구 단독주택 철거', region: '서울 마포구', amount: '₩980만', date: '2026.05' },
      { name: '광진구 구조물 철거', region: '서울 광진구', amount: '₩1,650만', date: '2026.04' },
    ],
    reviews: [
      { author: '(주)성동종합건설', rating: 5, text: '안전 관리가 철저하고 현장 정리도 깔끔합니다. 재계약 예정.' },
      { author: '마포구청 발주', rating: 5, text: '공공공사 기준 충족, 일정 준수 완벽.' },
    ],
    avatarColor: '#f59e0b',
  },
  {
    id: 4, name: '최설비', grade: 'Partner', workTypes: ['전기·설비'],
    region: '인천', district: '남동구', rating: 4.7, completedProjects: 98,
    teamSize: 4, careerYears: 7, lastActive: '5일 전',
    intro: '인천 전 지역 전기·설비 전문. 아파트 전기 패널 교체, 배관 시공, 스프링클러 설치 경험 다수.',
    equipment: ['전기 계측기 세트', '배관 공구 풀셋', '용접 장비'],
    certs: ['전기기능사', '소방설비기사', 'MONO Partner 인증'],
    certifiedDate: '2025.09.10',
    ratingDist: [72, 20, 5, 0, 1],
    recentProjects: [
      { name: '인천 아파트 전기 패널 교체', region: '인천 남동구', amount: '₩580만', date: '2026.05' },
      { name: '남동구 공장 배관 시공', region: '인천 남동구', amount: '₩1,200만', date: '2026.04' },
      { name: '부평구 상가 전기 공사', region: '인천 부평구', amount: '₩430만', date: '2026.03' },
    ],
    reviews: [
      { author: '인천산업단지㈜', rating: 5, text: '전기 공사 후 문제 없이 운영 중. 빠른 대응에 감사.' },
      { author: '개인 고객 최○○', rating: 4, text: '깔끔하게 마무리해주셨습니다.' },
    ],
    avatarColor: '#3b82f6',
  },
  {
    id: 5, name: '정건설', grade: 'Captain', workTypes: ['건설·토목'],
    region: '경기', district: '고양시', rating: 4.8, completedProjects: 267,
    teamSize: 15, careerYears: 18, lastActive: '당일',
    intro: '경기 북부 토목·건설 전문. 도로, 옹벽, 절성토 공사 다수. 대형 현장 팀 운영 경험 풍부.',
    equipment: ['굴착기 2대', '로울러', '레미콘 펌프카 섭외 네트워크'],
    certs: ['토목기사', '건설기계조종사', 'MONO Captain 인증'],
    certifiedDate: '2024.08.15',
    ratingDist: [220, 38, 7, 2, 0],
    recentProjects: [
      { name: '고양시 도로 절성토 공사', region: '경기 고양시', amount: '₩8,400만', date: '2026.06' },
      { name: '파주시 옹벽 공사', region: '경기 파주시', amount: '₩5,200만', date: '2026.05' },
      { name: '김포시 택지 정지 공사', region: '경기 김포시', amount: '₩3,600만', date: '2026.04' },
    ],
    reviews: [
      { author: '경기도시공사', rating: 5, text: '대규모 현장 관리 능력 탁월. 안전사고 제로 달성.' },
      { author: '(주)고양종합건설', rating: 5, text: '팀원 15명을 체계적으로 관리하는 리더십 인상적.' },
    ],
    avatarColor: '#10b981',
  },
  {
    id: 6, name: '한인테', grade: 'Certified', workTypes: ['인테리어·리모델링'],
    region: '서울', district: '마포구', rating: 4.6, completedProjects: 45,
    teamSize: 3, careerYears: 5, lastActive: '1주일 전',
    intro: '마포·용산 소형 주거 인테리어 전문. 원룸·투룸·오피스텔 전문. 1인 가구 공간 최적화 시공.',
    equipment: ['소형 전동공구 세트', '도배 도구 풀셋'],
    certs: ['실내건축기능사', 'MONO Certified 인증'],
    certifiedDate: '2026.01.20',
    ratingDist: [32, 10, 2, 1, 0],
    recentProjects: [
      { name: '마포구 원룸 풀 인테리어', region: '서울 마포구', amount: '₩480만', date: '2026.05' },
      { name: '용산구 오피스텔 리모델링', region: '서울 용산구', amount: '₩720만', date: '2026.04' },
      { name: '서대문구 투룸 도배·장판', region: '서울 서대문구', amount: '₩190만', date: '2026.03' },
    ],
    reviews: [
      { author: '개인 고객 김○○', rating: 5, text: '소형 평수 공간 활용을 잘 이해하시는 분. 결과 매우 만족.' },
      { author: '개인 고객 박○○', rating: 4, text: '꼼꼼하게 작업해주셨습니다.' },
    ],
    avatarColor: '#a855f7',
  },
  {
    id: 7, name: '윤전기', grade: 'Partner', workTypes: ['전기·설비'],
    region: '부산', district: '해운대구', rating: 4.8, completedProjects: 112,
    teamSize: 6, careerYears: 10, lastActive: '2일 전',
    intro: '부산 전 지역 전기·설비 전문. 부산 해운대 신축 아파트, 오피스 전기 공사 다수.',
    equipment: ['전기 측정기 세트', '고압 케이블 도구', '배전반 설치 장비'],
    certs: ['전기기사', '전기공사기사', 'MONO Partner 인증'],
    certifiedDate: '2025.07.05',
    ratingDist: [88, 20, 3, 0, 1],
    recentProjects: [
      { name: '해운대 주상복합 전기 공사', region: '부산 해운대구', amount: '₩2,800만', date: '2026.06' },
      { name: '수영구 상업시설 설비', region: '부산 수영구', amount: '₩1,400만', date: '2026.05' },
      { name: '남구 공장 전기 패널 교체', region: '부산 남구', amount: '₩670만', date: '2026.04' },
    ],
    reviews: [
      { author: '부산개발㈜', rating: 5, text: '부산에서 믿을 수 있는 전기 팀. 반드시 재요청 예정.' },
      { author: '(주)해운대건설', rating: 5, text: '빠른 착공, 깔끔한 마무리. 품질 최고입니다.' },
    ],
    avatarColor: '#6366f1',
  },
  {
    id: 8, name: '강조경', grade: 'Certified', workTypes: ['조경·외부공사'],
    region: '경기', district: '용인시', rating: 4.7, completedProjects: 67,
    teamSize: 4, careerYears: 6, lastActive: '4일 전',
    intro: '경기 남부 조경·외부공사 전문. 아파트 단지 조경, 수목 식재, 외부 포장 시공.',
    equipment: ['소형 트럭', '식재 도구 풀셋', '포장 다짐 장비'],
    certs: ['조경기능사', 'MONO Certified 인증'],
    certifiedDate: '2025.11.30',
    ratingDist: [48, 15, 3, 0, 1],
    recentProjects: [
      { name: '용인시 아파트 단지 조경', region: '경기 용인시', amount: '₩1,600만', date: '2026.06' },
      { name: '수지구 상업용지 외부 포장', region: '경기 용인시', amount: '₩780만', date: '2026.05' },
      { name: '성남시 공원 수목 식재', region: '경기 성남시', amount: '₩1,100만', date: '2026.04' },
    ],
    reviews: [
      { author: '용인도시개발㈜', rating: 5, text: '조경 완성도 우수, 기간 내 완료.' },
      { author: '개인 고객 강○○', rating: 4, text: '식재 이후 관리 방법도 잘 알려주셔서 감사합니다.' },
    ],
    avatarColor: '#22c55e',
  },
  {
    id: 9, name: '임방수', grade: 'Partner', workTypes: ['도장·방수'],
    region: '서울', district: '송파구', rating: 4.9, completedProjects: 145,
    teamSize: 7, careerYears: 11, lastActive: '1일 전',
    intro: '서울 동남권 방수·도장 전문. 옥상 방수, 지하 방수, 욕실 방수 전문. 10년 AS 보증.',
    equipment: ['우레탄 방수 도포 장비', '에어컴프레셔', '열풍 건조기'],
    certs: ['방수기능사', '건축도장기능사', 'MONO Partner 인증'],
    certifiedDate: '2025.04.10',
    ratingDist: [125, 18, 1, 0, 1],
    recentProjects: [
      { name: '송파구 아파트 옥상 방수', region: '서울 송파구', amount: '₩1,980만', date: '2026.06' },
      { name: '강동구 지하주차장 방수', region: '서울 강동구', amount: '₩2,400만', date: '2026.05' },
      { name: '잠실 상가 욕실 방수', region: '서울 송파구', amount: '₩480만', date: '2026.04' },
    ],
    reviews: [
      { author: '(주)송파종합관리', rating: 5, text: '방수 품질 완벽. 3년 후에도 하자 없음.' },
      { author: '강동구청 발주', rating: 5, text: '공공시설 방수 기준 충족, 최고 등급 평가.' },
    ],
    avatarColor: '#06b6d4',
  },
  {
    id: 10, name: '오리모', grade: 'Certified', workTypes: ['인테리어·리모델링'],
    region: '경기', district: '성남시', rating: 4.5, completedProjects: 38,
    teamSize: 2, careerYears: 4, lastActive: '1주일 전',
    intro: '성남·분당 소형 주거 리모델링 전문. 초기 경력이지만 디자인 감각과 꼼꼼한 시공으로 좋은 평가.',
    equipment: ['전동공구 세트', '타일 작업 도구'],
    certs: ['실내건축산업기사', 'MONO Certified 인증'],
    certifiedDate: '2026.03.01',
    ratingDist: [26, 10, 2, 0, 0],
    recentProjects: [
      { name: '분당구 아파트 욕실 리모델링', region: '경기 성남시', amount: '₩380만', date: '2026.05' },
      { name: '수정구 빌라 주방 리모델링', region: '경기 성남시', amount: '₩520만', date: '2026.04' },
      { name: '분당구 원룸 도배·장판', region: '경기 성남시', amount: '₩140만', date: '2026.03' },
    ],
    reviews: [
      { author: '개인 고객 오○○', rating: 5, text: '신중하게 작업해주시고 마무리가 깔끔합니다.' },
      { author: '개인 고객 류○○', rating: 4, text: '처음 부탁드렸는데 기대 이상이었습니다.' },
    ],
    avatarColor: '#8b5cf6',
  },
  {
    id: 11, name: '신철근', grade: 'Captain', workTypes: ['건설·토목'],
    region: '경기', district: '파주시', rating: 4.8, completedProjects: 198,
    teamSize: 20, careerYears: 20, lastActive: '당일',
    intro: '경기 북부·강원 접경 지역 토목·건설 전문. 군사시설 인접 공사 경험 다수. 대규모 팀 운영 및 중장비 섭외 네트워크 보유.',
    equipment: ['굴착기 3대', '덤프트럭 2대', '철근 절곡기'],
    certs: ['토목산업기사', '건설기계조종사', '건설안전기사', 'MONO Captain 인증'],
    certifiedDate: '2024.06.01',
    ratingDist: [163, 30, 4, 0, 1],
    recentProjects: [
      { name: '파주시 도로 신설 공사', region: '경기 파주시', amount: '₩12,000만', date: '2026.06' },
      { name: '연천군 소규모 토목 공사', region: '경기 연천군', amount: '₩4,800만', date: '2026.05' },
      { name: '고양시 배수로 공사', region: '경기 고양시', amount: '₩2,600만', date: '2026.04' },
    ],
    reviews: [
      { author: '파주시청 발주', rating: 5, text: '20명 팀을 체계적으로 운영, 공기 단축 달성.' },
      { author: '(주)경기건설', rating: 5, text: '대형 현장 관리 최고. 내년 계약도 요청 예정.' },
    ],
    avatarColor: '#10b981',
  },
  {
    id: 12, name: '류마감', grade: 'Partner', workTypes: ['인테리어·리모델링'],
    region: '서울', district: '은평구', rating: 4.7, completedProjects: 89,
    teamSize: 5, careerYears: 8, lastActive: '3일 전',
    intro: '서울 서북권 인테리어 마감 전문. 도배·장판·필름·몰딩 등 마감 공사 전문. 시공 후 하자 대응 빠름.',
    equipment: ['도배 도구 풀셋', '필름 시공 장비', '레이저 수평기'],
    certs: ['실내건축기능사', '도배기능사', 'MONO Partner 인증'],
    certifiedDate: '2025.08.25',
    ratingDist: [68, 17, 3, 0, 1],
    recentProjects: [
      { name: '은평구 아파트 도배·장판', region: '서울 은평구', amount: '₩480만', date: '2026.06' },
      { name: '마포구 오피스 필름 시공', region: '서울 마포구', amount: '₩240만', date: '2026.05' },
      { name: '서대문구 빌라 마감 공사', region: '서울 서대문구', amount: '₩620만', date: '2026.04' },
    ],
    reviews: [
      { author: '개인 고객 류○○', rating: 5, text: '마감이 정말 깔끔합니다. 주변에 많이 추천했어요.' },
      { author: '마포부동산관리㈜', rating: 4, text: '빠른 작업과 깔끔한 마무리. 만족스럽습니다.' },
    ],
    avatarColor: '#f59e0b',
  },
];

const GRADE_CONFIG: Record<Grade, { label: string; color: string; bg: string; border: string; icon: string }> = {
  Captain: { label: '👑 Captain', color: '#d97706', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.2)', icon: '👑' },
  Partner: { label: '⭐ Partner', color: '#4f46e5', bg: 'rgba(79,70,229,0.08)', border: 'rgba(79,70,229,0.2)', icon: '⭐' },
  Certified: { label: '🏅 Certified', color: '#0d9488', bg: 'rgba(13,148,136,0.08)', border: 'rgba(13,148,136,0.2)', icon: '🏅' },
};

const WORK_TYPE_FILTERS = ['전체', '인테리어·리모델링', '건설·토목', '전기·설비', '도장·방수', '철거·해체', '조경·외부공사'];
const REGION_FILTERS = ['전체', '서울', '경기', '인천', '부산', '기타'];
const GRADE_FILTERS = ['전체', 'Captain', 'Partner', 'Certified'];
const SORT_OPTIONS = ['평점순', '완료 건수순', '최신 등록순'];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function getInitials(name: string) {
  return name.charAt(0);
}

function StarBar({ dist }: { dist: number[] }) {
  const total = dist.reduce((a, b) => a + b, 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {[5, 4, 3, 2, 1].map((star, i) => {
        const pct = total > 0 ? (dist[i] / total) * 100 : 0;
        return (
          <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', width: 16, textAlign: 'right' }}>
              {star}★
            </span>
            <div style={{ flex: 1, height: 6, background: 'rgba(0,0,0,0.06)', borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${pct}%`, height: '100%',
                  background: star >= 4 ? '#0d9488' : star === 3 ? '#d97706' : '#ef4444',
                  borderRadius: 3, transition: 'width 0.3s',
                }}
              />
            </div>
            <span style={{ fontSize: 11, color: '#475569', width: 28, textAlign: 'left' }}>{dist[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function LeaderPage() {
  const [workTypeFilter, setWorkTypeFilter] = useState('전체');
  const [regionFilter, setRegionFilter] = useState('전체');
  const [gradeFilter, setGradeFilter] = useState('전체');
  const [sortBy, setSortBy] = useState('평점순');
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = (leader: Leader) => {
    setSelectedLeader(leader);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedLeader(null), 300);
  };

  const filtered = LEADERS
    .filter((l) => workTypeFilter === '전체' || l.workTypes.includes(workTypeFilter as WorkType))
    .filter((l) => regionFilter === '전체' || l.region === regionFilter)
    .filter((l) => gradeFilter === '전체' || l.grade === gradeFilter)
    .sort((a, b) => {
      if (sortBy === '평점순') return b.rating - a.rating;
      if (sortBy === '완료 건수순') return b.completedProjects - a.completedProjects;
      return b.id - a.id; // 최신 등록순
    });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FCFCFE radial-gradient(rgba(79, 70, 229, 0.05) 1px, transparent 1px) repeat',
        backgroundSize: '24px 24px',
        color: '#334155',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0px; height: 0px; background: transparent; }
        .filter-chip {
          padding: 7px 14px; border-radius: 999px;
          font-size: 12px; font-weight: 700;
          cursor: pointer; transition: all 0.15s;
          border: 1px solid #cbd5e1;
          background: #ffffff; color: #64748b;
          white-space: nowrap; font-family: inherit;
          word-break: keep-all;
        }
        .filter-chip:hover { background: #f8fafc; color: #1e293b; }
        .filter-chip.active { background: rgba(79,70,229,0.06); border-color: #4f46e5; color: #4f46e5; }
        .leader-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px; padding: 20px;
          cursor: pointer; transition: all 0.2s;
          display: flex; flex-direction: column; gap: 14px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03);
        }
        .leader-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.05);
          border-color: #cbd5e1;
          background: #ffffff;
        }
        .quote-btn {
          width: 100%; padding: 11px 16px;
          background: linear-gradient(135deg, #4f46e5, #3730a3);
          border: none; border-radius: 10px;
          color: #fff; font-size: 13px; font-weight: 800;
          cursor: pointer; transition: all 0.2s;
          font-family: inherit;
          word-break: keep-all;
        }
        .quote-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(79,70,229,0.3); }
        .drawer-overlay {
          position: fixed; inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          z-index: 50;
        }
        .drawer-panel {
          position: fixed; top: 0; right: 0; height: 100vh;
          width: min(520px, 92vw);
          background: linear-gradient(160deg, #ffffff 0%, #f8fafc 100%);
          border-left: 1px solid #e2e8f0;
          z-index: 51; overflow-y: auto;
          transition: transform 0.3s cubic-bezier(0.32, 0, 0.67, 0);
          box-shadow: -8px 0 24px rgba(0,0,0,0.05);
        }
        .drawer-panel.open { transform: translateX(0); }
        .drawer-panel.closed { transform: translateX(100%); }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .animate-fade { animation: fadeIn 0.25s ease both; }
        .stat-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px; padding: 20px 22px;
          text-align: center;
        }
        .detail-section {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px; padding: 14px 16px;
          margin-bottom: 12px;
        }
        .detail-label {
          font-size: 10px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: #64748b; margin-bottom: 8px;
        }
        @media(max-width:700px) {
          .leader-grid { grid-template-columns: 1fr !important; }
          .filter-scroll { overflow-x: auto; }
        }
      `}</style>

      {/* ── Header ── */}
      <header
        style={{
          background: 'rgba(252,252,254,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          padding: '18px 24px',
          position: 'sticky', top: 0, zIndex: 30,
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>👷</span>
              <h1 style={{ fontSize: 18, fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#0f172a' }}>
                MONO Certified Field Leader
              </h1>
            </div>
            <p style={{ fontSize: 11, color: '#475569', margin: '3px 0 0', fontWeight: 600, wordBreak: 'keep-all' }}>
              검증된 현장 리더와 직접 연결하세요
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/request'}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #4f46e5, #3730a3)',
              border: 'none', borderRadius: 10,
              color: '#fff', fontSize: 13, fontWeight: 800,
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 16px rgba(79,70,229,0.25)',
              wordBreak: 'keep-all',
            }}
          >
            작업 요청 등록 →
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px 60px' }}>

        {/* ── Hero Stats ── */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 4px', fontWeight: 600, wordBreak: 'keep-all' }}>
              실력과 이력이 검증된 현장 전문가
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
            {[
              { value: '247명', label: '인증 현장 리더', icon: '👷' },
              { value: '4.8', label: '평균 평점', icon: '⭐' },
              { value: '1,340건', label: '완료 프로젝트', icon: '✅' },
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#4f46e5', letterSpacing: '-0.03em' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginTop: 4, wordBreak: 'keep-all' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Grade badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {Object.entries(GRADE_CONFIG).map(([grade, cfg]) => (
              <div
                key={grade}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  borderRadius: 12, padding: '10px 16px',
                }}
              >
                <span style={{ fontSize: 18 }}>{cfg.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: cfg.color, wordBreak: 'keep-all' }}>
                    {grade === 'Captain' ? 'MONO Captain' : grade === 'Partner' ? 'MONO Partner' : 'MONO Certified'}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', wordBreak: 'keep-all' }}>
                    {grade === 'Captain' ? '지역 거점 핵심 리더' : grade === 'Partner' ? '실적 50건+ 우선 배정' : '경력 3년+ 검증'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Filter Bar ── */}
        <section
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 14, padding: '16px 20px',
            marginBottom: 24,
          }}
        >
          {/* Work Type */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              공종
            </div>
            <div className="filter-scroll" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {WORK_TYPE_FILTERS.map((f) => (
                <button
                  key={f}
                  className={`filter-chip${workTypeFilter === f ? ' active' : ''}`}
                  onClick={() => setWorkTypeFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {/* Region */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                지역
              </div>
              <div className="filter-scroll" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {REGION_FILTERS.map((f) => (
                  <button
                    key={f}
                    className={`filter-chip${regionFilter === f ? ' active' : ''}`}
                    onClick={() => setRegionFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Grade */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                등급
              </div>
              <div className="filter-scroll" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {GRADE_FILTERS.map((f) => (
                  <button
                    key={f}
                    className={`filter-chip${gradeFilter === f ? ' active' : ''}`}
                    onClick={() => setGradeFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sort + result count */}
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>
              {filtered.length}명의 현장 리더
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  className={`filter-chip${sortBy === opt ? ' active' : ''}`}
                  onClick={() => setSortBy(opt)}
                  style={{ fontSize: 11 }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Leader Grid ── */}
        <section
          className="leader-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
        >
          {filtered.map((leader) => {
            const gradeCfg = GRADE_CONFIG[leader.grade];
            return (
              <div key={leader.id} className="leader-card" onClick={() => openDrawer(leader)}>
                {/* Avatar + Name + Grade */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: `${leader.avatarColor}22`,
                      border: `2px solid ${leader.avatarColor}55`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, fontWeight: 900, color: leader.avatarColor,
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(leader.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                        {leader.name}
                      </span>
                      <span
                        style={{
                          fontSize: 10, fontWeight: 800,
                          color: gradeCfg.color,
                          background: gradeCfg.bg,
                          border: `1px solid ${gradeCfg.border}`,
                          padding: '2px 7px', borderRadius: 5,
                          wordBreak: 'keep-all',
                        }}
                      >
                        {gradeCfg.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>
                      {leader.district} · 경력 {leader.careerYears}년
                    </div>
                  </div>
                </div>

                {/* Work Type Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {leader.workTypes.slice(0, 3).map((wt) => (
                    <span
                      key={wt}
                      style={{
                        fontSize: 11, fontWeight: 700,
                        background: 'rgba(0,0,0,0.03)',
                        border: '1px solid rgba(0,0,0,0.06)',
                        padding: '3px 9px', borderRadius: 6,
                        color: '#475569', wordBreak: 'keep-all',
                      }}
                    >
                      {wt}
                    </span>
                  ))}
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 13, color: '#f59e0b' }}>★</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                      {leader.rating.toFixed(1)}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                    완료 {leader.completedProjects}건
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                    팀원 {leader.teamSize}명
                  </div>
                </div>

                {/* Last active */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>
                    최근 활동: {leader.lastActive}
                  </span>
                </div>

                {/* CTA */}
                <button
                  className="quote-btn"
                  onClick={(e) => { e.stopPropagation(); window.location.href = '/request'; }}
                >
                  견적 요청하기
                </button>
              </div>
            );
          })}
        </section>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 15, fontWeight: 700, wordBreak: 'keep-all' }}>
              조건에 맞는 현장 리더가 없습니다
            </div>
            <div style={{ fontSize: 13, marginTop: 8, wordBreak: 'keep-all' }}>
              필터 조건을 조정해 보세요
            </div>
          </div>
        )}

        {/* ── CTA Banner ── */}
        <section
          style={{
            marginTop: 48,
            background: 'linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(59,130,246,0.05) 100%)',
            border: '1px solid rgba(79,70,229,0.2)',
            borderRadius: 20,
            padding: '32px 28px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 24,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              현장 리더 등록
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 8px', letterSpacing: '-0.02em', color: '#0f172a', wordBreak: 'keep-all' }}>
              MONO 현장 리더로 등록하세요
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
              {['🎯 우선 작업 배정', '📣 프리미엄 프로필 노출', '👑 Partner Captain 승급 기회'].map((item, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 12, fontWeight: 700, color: '#475569',
                    background: 'rgba(0,0,0,0.03)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    padding: '5px 12px', borderRadius: 8,
                    wordBreak: 'keep-all',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => window.location.href = '#'}
            style={{
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #4f46e5, #3730a3)',
              border: 'none', borderRadius: 12,
              color: '#fff', fontSize: 14, fontWeight: 800,
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 16px rgba(79,70,229,0.25)',
              whiteSpace: 'nowrap', wordBreak: 'keep-all',
            }}
          >
            현장 리더 신청 →
          </button>
        </section>
      </main>

      {/* ── Drawer Overlay ── */}
      {drawerOpen && (
        <div className="drawer-overlay" onClick={closeDrawer} />
      )}

      {/* ── Leader Detail Drawer ── */}
      <div className={`drawer-panel ${drawerOpen ? 'open' : 'closed'}`}>
        {selectedLeader && (
          <div className="animate-fade" style={{ padding: '0 0 40px' }}>
            {/* Drawer Header */}
            <div
              style={{
                padding: '20px 24px 16px',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                background: 'rgba(252,252,254,0.95)',
                position: 'sticky', top: 0, zIndex: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 56, height: 56, borderRadius: '50%',
                      background: `${selectedLeader.avatarColor}22`,
                      border: `2px solid ${selectedLeader.avatarColor}55`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22, fontWeight: 900, color: selectedLeader.avatarColor,
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(selectedLeader.name)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>
                        {selectedLeader.name}
                      </span>
                      <span
                        style={{
                          fontSize: 10, fontWeight: 800,
                          color: GRADE_CONFIG[selectedLeader.grade].color,
                          background: GRADE_CONFIG[selectedLeader.grade].bg,
                          border: `1px solid ${GRADE_CONFIG[selectedLeader.grade].border}`,
                          padding: '2px 8px', borderRadius: 5,
                        }}
                      >
                        {GRADE_CONFIG[selectedLeader.grade].label}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                      {selectedLeader.district} · 경력 {selectedLeader.careerYears}년 · 팀원 {selectedLeader.teamSize}명
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeDrawer}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    color: '#475569', cursor: 'pointer',
                    fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              </div>

              <button
                className="quote-btn"
                style={{ marginTop: 14 }}
                onClick={() => window.location.href = '/request'}
              >
                견적 요청하기
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ padding: '20px 24px' }}>

              {/* Intro */}
              <div className="detail-section">
                <div className="detail-label">소개</div>
                <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.65, wordBreak: 'keep-all' }}>
                  {selectedLeader.intro}
                </p>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
                {[
                  { label: '평점', value: `★ ${selectedLeader.rating}` },
                  { label: '완료 건수', value: `${selectedLeader.completedProjects}건` },
                  { label: '최근 활동', value: selectedLeader.lastActive },
                ].map((s, i) => (
                  <div key={i} style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', marginTop: 3 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Work Types */}
              <div className="detail-section">
                <div className="detail-label">전문 공종</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedLeader.workTypes.map((wt) => (
                    <span key={wt} style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5', background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.2)', padding: '4px 10px', borderRadius: 6, wordBreak: 'keep-all' }}>
                      {wt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              <div className="detail-section">
                <div className="detail-label">보유 장비</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selectedLeader.equipment.map((eq, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14 }}>🔧</span>
                      <span style={{ fontSize: 13, color: '#475569', fontWeight: 500, wordBreak: 'keep-all' }}>{eq}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certs */}
              <div className="detail-section">
                <div className="detail-label">자격증 · 인증</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedLeader.certs.map((cert, i) => (
                    <span key={i} style={{ fontSize: 11, fontWeight: 700, color: '#475569', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', padding: '4px 10px', borderRadius: 6, wordBreak: 'keep-all' }}>
                      {cert}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 8 }}>
                  MONO 인증일: {selectedLeader.certifiedDate}
                </div>
              </div>

              {/* Recent Projects */}
              <div className="detail-section">
                <div className="detail-label">최근 완료 프로젝트</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {selectedLeader.recentProjects.map((proj, i) => (
                    <div
                      key={i}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 8, padding: '10px 12px',
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4, wordBreak: 'keep-all' }}>
                        {proj.name}
                      </div>
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: '#64748b' }}>{proj.region}</span>
                        <span style={{ fontSize: 11, color: '#4f46e5', fontWeight: 700 }}>{proj.amount}</span>
                        <span style={{ fontSize: 11, color: '#475569' }}>{proj.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="detail-section">
                <div className="detail-label">평점 분포</div>
                <StarBar dist={selectedLeader.ratingDist} />
              </div>

              {/* Reviews */}
              <div className="detail-section">
                <div className="detail-label">고객 리뷰</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {selectedLeader.reviews.map((rev, i) => (
                    <div
                      key={i}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 8, padding: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#475569', wordBreak: 'keep-all' }}>
                          {rev.author}
                        </span>
                        <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700 }}>
                          {'★'.repeat(rev.rating)}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: 13, color: '#334155', lineHeight: 1.55, wordBreak: 'keep-all' }}>
                        {rev.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="quote-btn"
                onClick={() => window.location.href = '/request'}
                style={{ marginTop: 8 }}
              >
                이 현장 리더에게 견적 요청하기 →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
