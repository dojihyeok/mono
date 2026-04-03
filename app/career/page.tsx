import React from 'react';
import styles from './career.module.css';
import GlassCard from '@/components/UI/GlassCard';
import Button from '@/components/UI/Button';
import Navbar from '@/components/Navbar/Navbar';

import { 
  ShieldCheck, 
  Award, 
  MapPin, 
  Calendar, 
  QrCode, 
  Activity, 
  HardHat, 
  Wrench, 
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
  FileCode2
} from 'lucide-react';

export default function CareerPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.passportLabel}>마스터 기술 경력 신분증</div>
          <h1 className={styles.title}>디지털 커리어 패스포트</h1>
          <p className={styles.subtitle}>검증된 내 기술 실력과 자격증 모음</p>
        </header>

        {/* Level & Stats */}
        <section className={styles.statsSection}>
          <GlassCard className={styles.levelCard}>
            <div className={styles.levelHeader}>
              <span className={styles.badge}>숙련 기술 대장</span>
              <span className={styles.levelPoints}>7,420 점</span>
            </div>
            <div className={styles.progressBarWrapper}>
              <div className={styles.progressBar} style={{ width: '74%' }}></div>
            </div>
            <p className={styles.levelDesc}>LV.45 | 다음 단계: 전설의 마스터 (2,580 점 남음)</p>
          </GlassCard>

          <div className={styles.grid2}>
            <GlassCard>
              <h3 className={styles.statLabel}>
                <Calendar size={14} color="#FF6B00" />
                현장 출역 총 합계
              </h3>
              <p className={styles.statValue}>342일</p>
            </GlassCard>
            <GlassCard>
              <h3 className={styles.statLabel}>
                <ShieldCheck size={14} color="#22C55E" />
                안전 신뢰 지수
              </h3>
              <p className={styles.statValue}>98.5%</p>
            </GlassCard>
          </div>
        </section>

        {/* Passport Main Section */}
        <section className={styles.passportCard}>
          {/* QR Verification */}
          <div className={styles.qrSection}>
            <div className={styles.qrCodeWrapper}>
              <QrCode size={64} color="#000" />
            </div>
            <div className={styles.qrInfo}>
              <h4>현장 본인 인증용</h4>
              <p>현장 관리자가 이 코드를 찍으면 마스터님의 실력과 경력이 바로 확인됩니다.</p>
              <div className={styles.idExpiry}>유효기한: 2027. 12. 31</div>
            </div>
          </div>

          {/* Trust Radar Mockup */}
          <div className={styles.radarSection}>
            <h3 className={styles.sectionTitle}>마스터 기술 신뢰 레이더</h3>
            <div className={styles.radarWrapper}>
              <svg width="200" height="200" viewBox="0 0 200 200">
                {/* Radar Grid */}
                <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                {/* Radar Axes */}
                <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(255,255,255,0.1)" />
                <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.1)" />
                {/* Radar Area (Mock) */}
                <polygon points="100,40 160,100 100,160 40,100" fill="rgba(255,107,0,0.3)" stroke="#FF6B00" strokeWidth="2" />
                {/* Labels */}
                <text x="100" y="15" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">안전성</text>
                <text x="185" y="105" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">기술력</text>
                <text x="100" y="195" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">성실성</text>
                <text x="15" y="105" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">수공구</text>
              </svg>
            </div>
          </div>

          {/* Equipment Showcase */}
          <div className={styles.equipmentSection}>
            <h3 className={styles.sectionTitle}>CERTIFIED EQUIPMENT</h3>
            <div className={styles.equipmentGrid}>
              <div className={styles.equipmentItem}>
                <div className={styles.eqIcon}><Wrench size={16} color="#FF6B00" /></div>
                <div className={styles.eqInfo}>
                  <h5>힐티 TE-60 (함마드릴)</h5>
                  <span>인증 완료</span>
                </div>
              </div>
              <div className={styles.equipmentItem}>
                <div className={styles.eqIcon}><HardHat size={16} color="#FF6B00" /></div>
                <div className={styles.eqInfo}>
                  <h5>안전 보호구 세트</h5>
                  <span>정상 보유</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Digital Career Log */}
        <section className={styles.historySection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>나의 경력 수첩 (기록)</h2>
            <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
          </div>

          <div className={styles.historyList}>
            <GlassCard className={styles.historyItem}>
              <div className={styles.historyMeta}>
                <span className={styles.historyDate}>2026. 03. 25</span>
                <span className={styles.historyStatus}>경력 인증됨</span>
              </div>
              <h3 className={styles.historyTitle}>반도체 평택 캠퍼스 P4 신축 (배관)</h3>
              <p className={styles.historyCompany}>
                <MapPin size={12} /> 경기도 평택시 | 삼성엔지니어링
              </p>
            </GlassCard>

            <GlassCard className={styles.historyItem}>
              <div className={styles.historyMeta}>
                <span className={styles.historyDate}>2026. 03. 20</span>
                <span className={styles.historyStatus}>경력 인증됨</span>
              </div>
              <h3 className={styles.historyTitle}>성수 테크니컬 허브 리노베이션</h3>
              <p className={styles.historyCompany}>
                <MapPin size={12} /> 서울시 성동구 | 현대건설
              </p>
            </GlassCard>
          </div>
        </section>
      </div>
    </div>
  );
}
