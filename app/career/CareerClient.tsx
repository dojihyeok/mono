'use client';

import { useState } from 'react';
import GlassCard from '@/components/UI/GlassCard';
import styles from './career.module.css';
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
  FileCode2,
  BrainCircuit,
  Cpu,
  Target,
  BarChart3,
  Scan,
  Download,
  Printer
} from 'lucide-react';

export default function CareerClient() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (format: 'PDF' | 'IMAGE') => {
    setIsExporting(true);
    setTimeout(() => {
      alert(`AI 기술 자산 증명서가 ${format} 형식으로 생성되었습니다.`);
      setIsExporting(false);
    }, 2000);
  };

  const [activeTab, setActiveTab] = useState<'passport' | 'history' | 'academy'>('passport');

  return (
    <div className={styles.container}>
      <header className={styles.header} style={{ marginBottom: '2rem' }}>
        <h1 className={styles.title} style={{ fontSize: '2rem' }}>내 커리어</h1>
      </header>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'passport' ? styles.active : ''}`}
          onClick={() => setActiveTab('passport')}
        >기술 여권</button>
        <button 
          className={`${styles.tab} ${activeTab === 'history' ? styles.active : ''}`}
          onClick={() => setActiveTab('history')}
        >경력 수첩</button>
        <button 
          className={`${styles.tab} ${activeTab === 'academy' ? styles.active : ''}`}
          onClick={() => setActiveTab('academy')}
        >아카데미</button>
      </div>

      {activeTab === 'passport' && (
        <>
          {/* Level & Stats */}
          <section className={styles.statsSection}>
            <GlassCard className={styles.levelCard}>
              <div className={styles.levelHeader}>
                <span className={styles.badge}>
                  <Award size={24} color="#D4AF37" />
                  배관 베테랑 기술자
                </span>
              </div>
              <p className={styles.levelDesc}>
                <Cpu size={14} style={{display: 'inline', marginRight: '8px'}} />
                현장 작업 10년차 | 최고 등급 기술자
              </p>
            </GlassCard>

            <div className={styles.grid2}>
              <GlassCard>
                <h3 className={styles.statLabel}>
                  <Calendar size={14} color="#D4AF37" />
                  모노 출역 일수
                </h3>
                <p className={styles.statValue}>342일</p>
              </GlassCard>
              <GlassCard>
                <h3 className={styles.statLabel}>
                  <ShieldCheck size={14} color="#D4AF37" />
                  안전 평가
                </h3>
                <p className={styles.statValue}>최우수</p>
              </GlassCard>
            </div>
          </section>

          {/* Passport Main Section */}
          <section className={styles.passportCard}>
            {/* QR Verification */}
            <div className={styles.qrSection}>
              <div className={styles.qrCodeWrapper}>
                <QrCode size={80} color="#000" />
              </div>
              <div className={styles.qrInfo}>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>현장 출입용 큐알(QR)코드</h4>
                <p style={{ fontSize: '0.95rem' }}>아침에 출근하실 때 현장 반장님께 이 화면을 보여주세요.</p>
              </div>
            </div>

            {/* Equipment Showcase */}
            <div className={styles.equipmentSection}>
              <h3 className={styles.sectionTitle}>
                  <BarChart3 size={18} color="#D4AF37" />
                  내가 보유한 장비
              </h3>
              <div className={styles.equipmentGrid}>
                <div className={styles.equipmentItem}>
                  <div className={styles.eqIcon}><Wrench size={20} color="#D4AF37" /></div>
                  <div className={styles.eqInfo}>
                    <h5 style={{ fontSize: '1rem' }}>힐티 함마드릴 (TE-60)</h5>
                  </div>
                </div>
                <div className={styles.equipmentItem}>
                  <div className={styles.eqIcon}><HardHat size={20} color="#D4AF37" /></div>
                  <div className={styles.eqInfo}>
                    <h5 style={{ fontSize: '1rem' }}>안전 고글 및 보호구</h5>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className={styles.exportActions} style={{ marginTop: '2rem' }}>
            <button 
              className={styles.resumeBtn} 
              onClick={() => handleExport('PDF')}
              disabled={isExporting}
            >
              <FileCode2 size={20} />
              {isExporting ? '경력 증명서 만드는 중...' : '내 경력 증명서 내려받기'}
            </button>
          </div>
        </>
      )}

      {activeTab === 'history' && (
        <>


          {/* AI Career Insight Section */}
          <section className={styles.aiInsightSection}>
            <div className={styles.aiHeader}>
              <h2 className={styles.sectionTitle}>
                  <Activity size={20} color="#D4AF37" />
                  모컬 반장의 한줄 평
              </h2>
            </div>

            <GlassCard className={styles.aiReportCard}>
              <p className={styles.aiMessage} style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                "선생님은 최근 2년간 <span className={styles.aiHighlight}>반도체 현장 배관 작업</span>을 아주 훌륭하게 해내셨습니다. 특히 <span className={styles.aiHighlight}>단 한 번의 사고도 없이 안전 수칙을 완벽하게 지키셔서</span> 현장 소장님들이 가장 모시고 싶어 하는 기술자입니다."
              </p>
            </GlassCard>

            <div className={styles.globalActionGrid}>
              <GlassCard className={styles.globalCard}>
                <span className={styles.cardLabel}>다음 현장 추천 점수</span>
                <div className={styles.cardValue}>100점</div>
                <p className={styles.subtitle} style={{fontSize: '0.85rem'}}>어느 현장이든 환영받습니다</p>
              </GlassCard>
              <GlassCard className={styles.globalCard}>
                <span className={styles.cardLabel}>추천 일당</span>
                <div className={styles.cardValue}>21만원 ~</div>
                <div className={styles.rewardIndicator}>최고 대우</div>
              </GlassCard>
            </div>
          </section>

          {/* Digital Career Log */}
          <section className={styles.historySection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>그동안 일하신 현장</h2>
            </div>

            <div className={styles.historyList}>
              <GlassCard className={styles.historyItem}>
                <div className={styles.historyMeta}>
                  <span className={styles.historyDate}>2026. 03. 25</span>
                  <span className={styles.historyStatus}>작업 완료</span>
                </div>
                <h3 className={styles.historyTitle} style={{ fontSize: '1.1rem' }}>반도체 평택 캠퍼스 P4 신축 (배관)</h3>
                <p className={styles.historyCompany} style={{ fontSize: '0.95rem' }}>
                  <MapPin size={14} style={{marginRight: '8px'}} /> 경기도 평택시 | 삼성엔지니어링
                </p>
              </GlassCard>

              <GlassCard className={styles.historyItem}>
                <div className={styles.historyMeta}>
                  <span className={styles.historyDate}>2026. 03. 20</span>
                  <span className={styles.historyStatus}>작업 완료</span>
                </div>
                <h3 className={styles.historyTitle} style={{ fontSize: '1.1rem' }}>성수 테크니컬 허브 리노베이션</h3>
                <p className={styles.historyCompany} style={{ fontSize: '0.95rem' }}>
                  <MapPin size={14} style={{marginRight: '8px'}} /> 서울시 성동구 | 현대건설
                </p>
              </GlassCard>
            </div>
          </section>
        </>
      )}

      {activeTab === 'academy' && (
        <section className={styles.aiInsightSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>아카데미 수료 내역</h2>
          </div>
          
          <div className={styles.safetyBadgesRow}>
              <div className={styles.safetyBadge}>기초안전보건교육</div>
              <div className={styles.safetyBadge}>고소작업 이수</div>
              <div className={styles.safetyBadge}>화재 감시자</div>
          </div>

          <GlassCard className={styles.historyItem} style={{ marginTop: '2rem' }}>
            <h3 className={styles.historyTitle} style={{ fontSize: '1.1rem', marginBottom: '8px' }}>단가 올리는 배관 심화 과정 (온라인)</h3>
            <p className={styles.historyCompany} style={{ fontSize: '0.95rem', color: '#D4AF37' }}>
              현재 수강 중 - 진도율 75%
            </p>
          </GlassCard>
        </section>
      )}
    </div>
  );
}
