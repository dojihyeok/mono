'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './office.module.css';
import { 
  Building2, 
  Clock, 
  MapPin, 
  Zap, 
  ChevronRight, 
  Star,
  Users,
  Search,
  Filter,
  ArrowUpRight
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
    activeJobsCount: 12,
    status: 'ACTIVE_DAWN',
    jobs: [
      { id: 'j1', time: '04:30', title: '신축 현장 전기 결선', pay: '195,000', type: 'DAWN' },
      { id: 'j2', time: '05:00', title: '배관 설비 보조 (숙련)', pay: '175,000', type: 'DAWN' },
      { id: 'j3', time: 'ASAP', title: '상가 인테리어 철거', pay: '160,000', type: 'IMMEDIATE' }
    ]
  },
  {
    id: 'gwangmyeong',
    name: '광명 스마트팜 센터',
    category: 'AGRITECH',
    rating: 4.7,
    reviews: 64,
    distance: '12km',
    activeJobsCount: 15,
    status: 'ACTIVE_NOW',
    jobs: [
      { id: 'j10', time: '08:00', title: '스마트팜 수경배지 교체', pay: '155,000', type: 'NORMAL' },
      { id: 'j11', time: 'ASAP', title: '시설 하우스 센서 점검', pay: '185,000', type: 'IMMEDIATE' }
    ]
  },
  {
    id: 'busan',
    name: '부산 오션 마스터 센터',
    category: 'OCEANTECH',
    rating: 4.9,
    reviews: 215,
    distance: '320km',
    activeJobsCount: 28,
    status: 'ACTIVE_DAWN',
    jobs: [
      { id: 'j20', time: '05:00', title: '선조립 구역 수중 용접', pay: '320,000', type: 'DAWN' },
      { id: 'j21', time: '07:30', title: '대형 선박 도장/코팅', pay: '210,000', type: 'DAWN' }
    ]
  },
  {
    id: 'pyeongtaek',
    name: '평택 반도체 설비 본부',
    category: 'SEMICON',
    rating: 5.0,
    reviews: 412,
    distance: '45km',
    activeJobsCount: 56,
    status: 'ACTIVE_NOW',
    jobs: [
      { id: 'j30', time: '04:00', title: '클린룸 공조 덕트 설비', pay: '245,000', type: 'DAWN' },
      { id: 'j31', time: '08:00', title: 'P4 라인 정밀 배관 보조', pay: '210,000', type: 'NORMAL' }
    ]
  },
  {
    id: 'incheon',
    name: '인천 글로벌 물류 허브',
    category: 'LOGISTICS',
    rating: 4.6,
    reviews: 98,
    distance: '28km',
    activeJobsCount: 34,
    status: 'ACTIVE_NOW',
    jobs: [
      { id: 'j40', time: 'ASAP', title: '리치 트럭 (지게차) 운전', pay: '190,000', type: 'IMMEDIATE' },
      { id: 'j41', time: '21:00', title: '야간 벌크 화물 하역', pay: '230,000', type: 'NORMAL' }
    ]
  },
  {
    id: 'banpo',
    name: '반포 명장 사무소',
    category: 'CONSTRUCTION',
    rating: 4.8,
    reviews: 84,
    distance: '3.5km',
    activeJobsCount: 8,
    status: 'ACTIVE_NOW',
    jobs: [
      { id: 'j4', time: '05:15', title: '창호 시공 보조', pay: '180,000', type: 'DAWN' },
      { id: 'j5', time: 'ASAP', title: '자재 양중 (곰방)', pay: '220,000', type: 'IMMEDIATE' }
    ]
  }
];

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
      
      <main className="container" style={{ marginTop: '2.5rem' }}>
        <header className={styles.header}>
          <div>
            <div className={styles.pageLabel}>DAWN MARKET HUB</div>
            <h1 className={styles.title}>온라인 인력 사무소</h1>
            <p className={styles.subtitle}>
              전국의 숙련된 마스터님들을 위한 실시간 현장 매칭 시스템
            </p>
          </div>
          <div className={styles.liveIndicator}>
            <span className={styles.pulse}></span>
            <span>LIVE: {MANPOWER_OFFICES.reduce((acc, curr) => acc + curr.activeJobsCount, 0)}개 현장 매칭 중</span>
          </div>
        </header>

        {/* Search & Filter */}
        <div className={styles.searchBar}>
          <div className={styles.searchInputWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="지역 또는 사무소 이름을 검색하세요..." 
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
                    <Building2 size={24} color="#b48a09" />
                  </div>
                  <div>
                    <div className={styles.nameRow}>
                      <h3 className={styles.officeName}>{office.name}</h3>
                      <span className={`${styles.categoryBadge} ${styles[office.category.toLowerCase()]}`}>
                        {office.category}
                      </span>
                    </div>
                    <div className={styles.officeStats}>
                      <span className={styles.rating}>
                        <Star size={12} fill="#b48a09" color="#b48a09" />
                        {office.rating} ({office.reviews})
                      </span>
                      <span className={styles.dot}>•</span>
                      <span className={styles.distance}>{office.distance}</span>
                    </div>
                  </div>
                </div>
                <button className={styles.bookmarkBtn}>
                  <ArrowUpRight size={20} />
                </button>
              </div>

              <div className={styles.jobListPreview}>
                <div className={styles.sectionTitle}>
                  <Zap size={14} color="#b48a09" />
                  당장 또는 새벽에 필요한 일자리
                </div>
                {office.jobs.map((job) => (
                  <div key={job.id} className={`${styles.jobItem} ${job.type === 'IMMEDIATE' ? styles.immediate : ''}`}>
                    <div className={styles.jobTime}>
                      {job.type === 'IMMEDIATE' ? (
                        <span className={styles.asapBadge}>ASAP</span>
                      ) : (
                        <span className={styles.timeBadge}>{job.time}</span>
                      )}
                    </div>
                    <div className={styles.jobMainInfo}>
                      <span className={styles.jobTitleText}>{job.title}</span>
                      <span className={styles.jobPay}>₩{job.pay}</span>
                    </div>
                    <ChevronRight size={14} color="rgba(255,255,255,0.2)" />
                  </div>
                ))}
              </div>

              <div className={styles.officeCardFooter}>
                <div className={styles.activeWorkerInfo}>
                  <Users size={14} />
                  <span>오늘 {office.activeJobsCount * 2}명의 마스터 활동 중</span>
                </div>
                <Link href={`/office/${office.id}`} className={styles.enterBtn}>
                  사무소 입장
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
