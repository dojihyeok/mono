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
  gwangmyeong: {
    id: 'gwangmyeong',
    name: '광명 스마트팜 센터',
    address: '경기도 광명시 노온사동 456 (스마트농업 단지 내)',
    contact: '010-5566-7788',
    manager: '이지혜 팀장',
    rating: 4.7,
    reviews: 64,
    activeWorkers: 15,
    trustScore: 920,
    jobs: [
      { id: 'j10', time: '08:00', title: '스마트팜 수경배지 교체', pay: '155,000', type: 'NORMAL', location: '광명역 7번 출구 셔틀' },
      { id: 'j11', time: 'ASAP', title: '시설 하우스 센서 점검', pay: '185,000', type: 'IMMEDIATE', location: '센터 본관 1층 집합' },
      { id: 'j12', time: '07:00', title: '자동 급수 라인 정비', pay: '170,000', type: 'DAWN', location: '노온사동 입구 집합' }
    ]
  },
  busan: {
    id: 'busan',
    name: '부산 오션 마스터 센터',
    address: '부산광역시 영도구 남항로 89 (남항 시장 인근)',
    contact: '051-778-9900',
    manager: '최영도 소장',
    rating: 4.9,
    reviews: 215,
    activeWorkers: 28,
    trustScore: 990,
    jobs: [
      { id: 'j20', time: '05:00', title: '선조립 구역 수중 용접', pay: '320,000', type: 'DAWN', location: '영도 대교 아래 선착장' },
      { id: 'j21', time: '07:30', title: '대형 선박 도장/코팅', pay: '210,000', type: 'DAWN', location: '남항진 도크 3번' },
      { id: 'j22', time: 'ASAP', title: '해양 장비 하역 보조', pay: '180,000', type: 'IMMEDIATE', location: '부산항 5부두 정문' }
    ]
  },
  pyeongtaek: {
    id: 'pyeongtaek',
    name: '평택 반도체 설비 본부',
    address: '경기도 평택시 고덕면 삼성로 1 (P4 시공 사무실)',
    contact: '010-9988-1122',
    manager: '한고덕 소장',
    rating: 5.0,
    reviews: 412,
    activeWorkers: 56,
    trustScore: 1000,
    jobs: [
      { id: 'j30', time: '04:00', title: '클린룸 공조 덕트 설비', pay: '245,000', type: 'DAWN', location: '지제역 1번 출구 셔틀' },
      { id: 'j31', time: '08:00', title: 'P4 라인 정밀 배관 보조', pay: '210,000', type: 'NORMAL', location: '서정리역 셔틀 정류장' },
      { id: 'j33', time: 'ASAP', title: '전기실 트레이 설치', pay: '230,000', type: 'IMMEDIATE', location: '고덕면 현장 입구' }
    ]
  },
  incheon: {
    id: 'incheon',
    name: '인천 글로벌 물류 허브',
    address: '인천광역시 중구 공항문화로 123 (인천공항 물류단지)',
    contact: '032-990-1122',
    manager: '강공항 실장',
    rating: 4.6,
    reviews: 98,
    activeWorkers: 34,
    trustScore: 880,
    jobs: [
      { id: 'j40', time: 'ASAP', title: '리치 트럭 (지게차) 운전', pay: '190,000', type: 'IMMEDIATE', location: '물류 2단지 B동' },
      { id: 'j41', time: '21:00', title: '야간 벌크 화물 하역', pay: '230,000', type: 'NORMAL', location: '인천공항 화물 터미널' },
      { id: 'j42', time: '06:00', title: '냉동 창고 피킹 작업', pay: '180,000', type: 'DAWN', location: '운서역 2번 출구 집합' }
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
