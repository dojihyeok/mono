'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Star, 
  Clock, 
  Zap, 
  Users, 
  ChevronRight, 
  ShieldCheck,
  Calendar,
  Wallet,
  ArrowLeft,
  Share2,
  Navigation
} from 'lucide-react';
import Link from 'next/link';

const OFFICE_DATA: Record<string, any> = {
  seongsu: {
    id: 'seongsu',
    name: '성수 테크니컬 인력',
    address: '서울특별시 성동구 아차산로 123 (성수역 3번 출구 인근)',
    contact: '010-1234-5678',
    manager: '김성수 실장',
    rating: 4.9,
    reviews: 128,
    activeWorkers: 42,
    trustScore: 980,
    jobs: [
      { id: 'j1', time: '04:30', title: '신축 현장 전기 결선', pay: '195,000', type: 'DAWN', location: '가양역 3번 출구 집합' },
      { id: 'j2', time: '05:00', title: '배관 설비 보조 (숙련)', pay: '175,000', type: 'DAWN', location: '답십리역 5번 출구 집합' },
      { id: 'j3', time: 'ASAP', title: '상가 인테리어 철거', pay: '160,000', type: 'IMMEDIATE', location: '성수동 2가 현장' },
      { id: 'j4', time: '07:30', title: '자재 양중 (오전 반품)', pay: '140,000', type: 'NORMAL', location: '사무소 앞 집합' }
    ]
  },
  banpo: {
    id: 'banpo',
    name: '반포 명장 사무소',
    address: '서울특별시 서초구 신반포로 45 (반포역 1번 출구)',
    contact: '010-2233-4455',
    manager: '박반포 소장',
    rating: 4.8,
    reviews: 84,
    activeWorkers: 18,
    trustScore: 940,
    jobs: [
      { id: 'j5', time: '05:15', title: '창호 시공 보조', pay: '180,000', type: 'DAWN', location: '반포역 1번 출구 집합' },
      { id: 'j6', time: 'ASAP', title: '자재 양중 (곰방)', pay: '220,000', type: 'IMMEDIATE', location: '논현동 빌라 현장' }
    ]
  }
};

export default function OfficeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const officeId = params.id as string;
  const office = OFFICE_DATA[officeId] || OFFICE_DATA.seongsu;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className="container" style={{ marginTop: '2rem' }}>
        <div className={styles.backNav}>
          <Link href="/office" className={styles.backLink}>
            <ArrowLeft size={18} />
            <span>온라인 사무소 목록</span>
          </Link>
          <div className={styles.utilityBtns}>
            <button className={styles.iconBtn}><Share2 size={18} /></button>
            <button className={styles.iconBtn}><Star size={18} /></button>
          </div>
        </div>

        <section className={styles.heroSection}>
          <div className={styles.officeHeader}>
            <div className={styles.mainInfo}>
              <div className={styles.avatar}>
                <Building2 size={32} color="#b48a09" />
              </div>
              <div>
                <h1 className={styles.officeName}>{office.name}</h1>
                <div className={styles.officeMeta}>
                  <div className={styles.rating}>
                    <Star size={14} fill="#b48a09" color="#b48a09" />
                    <span>{office.rating} ({office.reviews})</span>
                  </div>
                  <span className={styles.dot}>•</span>
                  <div className={styles.workers}>
                    <Users size={14} />
                    <span>현재 {office.activeWorkers}명 현장 투입 중</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.trustBadge}>
              <ShieldCheck size={18} color="#10B981" />
              <span>우수 협력 사무소</span>
            </div>
          </div>

          <div className={styles.actionGrid}>
            <div className={styles.infoCard}>
              <MapPin size={18} className={styles.infoIcon} />
              <div>
                <label>사무소 위치</label>
                <p>{office.address}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <Phone size={18} className={styles.infoIcon} />
              <div>
                <label>긴급 현장 지원</label>
                <p>{office.contact} ({office.manager})</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.jobBoard}>
          <div className={styles.boardHeader}>
            <h2 className={styles.sectionTitle}>현 시간 매칭 가능 리스트</h2>
            <div className={styles.filterTabs}>
              <button className={styles.activeTab}>전체 {office.jobs.length}</button>
              <button>새벽 집합</button>
              <button>단기/알바</button>
            </div>
          </div>

          <div className={styles.jobGrid}>
            {office.jobs.map((job: any) => (
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.jobBadgeRow}>
                  {job.type === 'DAWN' ? (
                    <span className={styles.dawnBadge}>
                      <Clock size={12} />
                      새벽 집합
                    </span>
                  ) : job.type === 'IMMEDIATE' ? (
                    <span className={styles.immediateBadge}>
                      <Zap size={12} />
                      ASAP 긴급
                    </span>
                  ) : null}
                  <span className={styles.jobPay}>₩{job.pay}</span>
                </div>
                
                <h3 className={styles.jobTitle}>{job.title}</h3>
                
                <div className={styles.jobDetails}>
                  <div className={styles.detailItem}>
                    <Navigation size={14} />
                    <span>{job.location}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <Calendar size={14} />
                    <span>오늘 {job.time}</span>
                  </div>
                </div>

                <div className={styles.jobFooter}>
                  <div className={styles.trustIndicator}>
                    <Wallet size={14} color="#10B981" />
                    <span>즉시 정산 가능</span>
                  </div>
                  <button 
                    className={styles.applyBtn}
                    onClick={() => router.push('/attendance')}
                  >
                    참여하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.gatheringMap}>
          <h2 className={styles.sectionTitle}>오늘의 주요 집합지</h2>
          <div className={styles.mapPlaceholder}>
            <div className={styles.mapOverlay}>
              <MapPin size={32} color="#ef4444" />
              <div className={styles.mapTooltip}>
                <strong>전기 결선 집합지</strong>
                <span>가양역 3번 출구 버스 정류장 앞</span>
              </div>
            </div>
            <p className={styles.mapHint}>* 지원 완료 후 상세 경로와 차량 정보가 공개됩니다.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
