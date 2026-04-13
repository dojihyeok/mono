'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './office.module.css';
import { 
  Building2, 
  MapPin, 
  Zap, 
  ChevronRight, 
  Star,
  Users,
  Search,
  Filter,
  ShieldCheck,
  TrendingUp,
  Activity,
  Award,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const MANPOWER_OFFICES = [
  {
    id: 'seongsu',
    name: '성수 테크니컬 인력',
    category: 'CONSTRUCTION',
    rating: 4.9,
    reviews: 128,
    distance: '1.2km',
    activeMasters: 42,
    successRate: 98.8,
    jobs: [
      { id: 'j1', time: '04:30', title: '신축 현장 전기 결선', pay: '195,000', type: 'DAWN' },
      { id: 'j2', time: '05:00', title: '배관 설비 보조 (숙련)', pay: '175,000', type: 'DAWN' },
      { id: 'j3', time: 'ASAP', title: '상가 인테리어 철거', pay: '160,000', type: 'IMMEDIATE' }
    ]
  },
  {
    id: 'pyeongtaek',
    name: '평택 반도체 설비 본부',
    category: 'SEMICON',
    rating: 5.0,
    reviews: 412,
    distance: '45km',
    activeMasters: 124,
    successRate: 100,
    jobs: [
      { id: 'j30', time: '04:00', title: '클린룸 공조 덕트 설비', pay: '245,000', type: 'DAWN' },
      { id: 'j31', time: '08:00', title: 'P4 라인 정밀 배관 보조', pay: '210,000', type: 'NORMAL' }
    ]
  },
  {
    id: 'busan',
    name: '부산 오션 마스터 센터',
    category: 'OCEANTECH',
    rating: 4.9,
    reviews: 215,
    distance: '320km',
    activeMasters: 85,
    successRate: 99.2,
    jobs: [
      { id: 'j20', time: '05:00', title: '선조립 구역 수중 용접', pay: '320,000', type: 'DAWN' },
      { id: 'j21', time: '07:30', title: '대형 선박 도장/코팅', pay: '210,000', type: 'DAWN' }
    ]
  },
  {
    id: 'gwangmyeong',
    name: '광명 스마트팜 센터',
    category: 'AGRITECH',
    rating: 4.7,
    reviews: 64,
    distance: '12km',
    activeMasters: 28,
    successRate: 96.5,
    jobs: [
      { id: 'j10', time: '08:00', title: '스마트팜 수경배지 교체', pay: '155,000', type: 'NORMAL' },
      { id: 'j11', time: 'ASAP', title: '시설 하우스 센서 점검', pay: '185,000', type: 'IMMEDIATE' }
    ]
  }
];

const CATEGORY_LABELS: Record<string, string> = {
  'CONSTRUCTION': '건설 기술 거점',
  'SEMICON': '반도체 특수 설비',
  'OCEANTECH': '해양 플랜트',
  'AGRITECH': '첨단 농업 시설'
};

export default function OnlineOfficePage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.pageLabel}>
               <Activity size={12} style={{marginRight: '6px'}} />
               실시간 업무 상황실
            </div>
            <h1 className={styles.title}>내 업무 대시보드</h1>
            <p className={styles.subtitle}>
              전문가님의 경력과 거리에 최적화된 <strong>49개</strong>의 현장 사무소가 연결되어 있습니다.
            </p>
          </div>

          <div className={styles.statusBoard}>
            <div className={styles.statWidget}>
              <span className={styles.widgetLabel}>오늘의 예상 수입</span>
              <span className={styles.widgetValue}>₩245,000</span>
              <div className={`${styles.widgetTrend} ${styles.trendUp}`}>
                 <TrendingUp size={10} /> +12.4% 상향됨
              </div>
            </div>
            <div className={styles.statWidget}>
              <span className={styles.widgetLabel}>현장 안전 지수</span>
              <span className={styles.widgetValue}>94.2%</span>
              <div className={`${styles.widgetTrend} ${styles.trendUp}`}>
                 <ShieldCheck size={10} /> 안정권 인증
              </div>
            </div>
            <div className={styles.statWidget}>
              <span className={styles.widgetLabel}>숙련도 등급</span>
              <span className={styles.widgetValue}>레벨 42</span>
              <div className={`${styles.widgetTrend} ${styles.trendGold}`}>
                 <Award size={10} /> 상위 3% 숙련도
              </div>
            </div>
          </div>
        </header>

        {/* Search & Filter */}
        <div className={styles.searchBar}>
          <div className={styles.searchInputWrapper}>
            <Search size={18} className={styles.searchIcon} color="rgba(255,255,255,0.4)" />
            <input 
              type="text" 
              placeholder="관심 지역 또는 사무소 이름을 검색하세요..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className={styles.filterBtn}>
            <Filter size={18} />
            <span>필터</span>
          </button>
        </div>

        {/* Office Grid */}
        <div className={styles.officeGrid}>
          {MANPOWER_OFFICES.map((office) => (
            <div key={office.id} className={styles.officeCard}>
              <div className={styles.officeCardHeader}>
                <div className={styles.officeInfoMain}>
                  <div className={styles.officeAvatar}>
                    <Building2 size={28} color="#B48A09" />
                  </div>
                  <div className={styles.nameRow}>
                    <h3 className={styles.officeName}>{office.name}</h3>
                    <div className={styles.officeStats}>
                      <span className={styles.rating}>
                        <Star size={12} fill="#B48A09" color="#B48A09" />
                        {office.rating} ({office.reviews})
                      </span>
                      <span className={styles.dot}>•</span>
                      <span className={styles.distance}>{office.distance}</span>
                    </div>
                  </div>
                </div>
                <span className={`${styles.categoryBadge} ${styles[office.category.toLowerCase()]}`}>
                  {CATEGORY_LABELS[office.category]}
                </span>
              </div>

              <div className={styles.jobListPreview}>
                <div className={styles.sectionTitle}>
                  현재 지원 가능한 공고
                </div>
                {office.jobs.map((job) => (
                  <div key={job.id} className={styles.jobItem}>
                    <div className={styles.jobTime}>
                      {job.type === 'IMMEDIATE' ? (
                        <span className={styles.asapBadge}>즉시 투입</span>
                      ) : (
                        <span className={styles.timeBadge}>{job.time}</span>
                      )}
                    </div>
                    <div className={styles.jobMainInfo}>
                      <span className={styles.jobTitleText}>{job.title}</span>
                      <span className={styles.jobPay}>₩{job.pay}</span>
                    </div>
                    <ArrowRight size={14} color="rgba(255,255,255,0.2)" />
                  </div>
                ))}
              </div>

              <div className={styles.officeCardFooter}>
                <div className={styles.activeWorkerInfo}>
                  <div className={styles.statItem}>
                    <Users size={12} />
                    <span>{office.activeMasters || 12}명 대기 중</span>
                  </div>
                  <div className={styles.statItem}>
                    <ShieldCheck size={12} />
                    <span>{office.successRate}% 신뢰성</span>
                  </div>
                </div>
                <Link href={`/office/${office.id}`} className={styles.enterBtn}>
                  상세보기
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
