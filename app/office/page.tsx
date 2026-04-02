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
    id: 'banpo',
    name: '반포 명장 사무소',
    rating: 4.8,
    reviews: 84,
    distance: '3.5km',
    activeJobsCount: 8,
    status: 'ACTIVE_NOW',
    jobs: [
      { id: 'j4', time: '05:15', title: '창호 시공 보조', pay: '180,000', type: 'DAWN' },
      { id: 'j5', time: 'ASAP', title: '자재 양중 (곰방)', pay: '220,000', type: 'IMMEDIATE' }
    ]
  },
  {
    id: 'godeok',
    name: '고덕 삼성 전문관',
    rating: 5.0,
    reviews: 320,
    distance: '25km',
    activeJobsCount: 45,
    status: 'ACTIVE_DAWN',
    jobs: [
      { id: 'j6', time: '04:15', title: 'P4 현장 포설 (대량)', pay: '210,000', type: 'DAWN' },
      { id: 'j7', time: '04:30', title: '시스템 비계 상차', pay: '240,000', type: 'DAWN' }
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
                    <h3 className={styles.officeName}>{office.name}</h3>
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
