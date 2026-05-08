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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.passportLabel}>
          <Scan size={12} style={{marginRight: '8px'}} />
          전문가 기술 자산 신분증 (글로벌 표준)
        </div>
        <h1 className={styles.title}>디지털 기술 여권</h1>
        <p className={styles.subtitle}>검증된 기술 자산과 글로벌 커리어 포트폴리오</p>
      </header>

      {/* Level & Stats */}
      <section className={styles.statsSection}>
        <GlassCard className={styles.levelCard}>
          <div className={styles.levelHeader}>
            <span className={styles.badge}>
              <Award size={24} color="#B48A09" />
              공인 숙련 기술인
            </span>
            <span className={styles.levelPoints}>7,420 SP</span>
          </div>
          <div className={styles.progressBarWrapper}>
            <div className={styles.progressBar} style={{ width: '74%' }}></div>
          </div>
          <p className={styles.levelDesc}>
            <Cpu size={14} style={{display: 'inline', marginRight: '8px'}} />
            전문가 레벨 45 | 다음 등급: 레전더리 (2,450 SP 남음)
          </p>
        </GlassCard>

        <div className={styles.grid2}>
          <GlassCard>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <h3 className={styles.statLabel}>
                      <Calendar size={14} color="#B48A09" />
                      현장 투입 데이터
                  </h3>
              </div>
            <p className={styles.statValue}>342일</p>
          </GlassCard>
          <GlassCard>
            <h3 className={styles.statLabel}>
              <ShieldCheck size={14} color="#B48A09" />
              안전 신뢰 지수
            </h3>
            <p className={styles.statValue}>98.5%</p>
          </GlassCard>
        </div>
      </section>

      {/* AI Career Insight Section */}
      <section className={styles.aiInsightSection}>
        <div className={styles.aiHeader}>
          <h2 className={styles.sectionTitle}>
              <Activity size={20} color="#B48A09" />
              AI 커리어 리포트
          </h2>
          <div className={styles.aiBadge}>AI 분석 시스템 가동 중</div>
        </div>

        <GlassCard className={styles.aiReportCard}>
          <div className={styles.aiGreeting}>
            <div className={styles.aiAvatar}><BrainCircuit size={20} /></div>
            <p className={styles.aiMessage}>모컬 AI 분석: 전문가 기술 자산 평가</p>
          </div>
          <p className={styles.aiMessage}>
            "전문가님은 지난 2년간 <span className={styles.aiHighlight}>반도체 플랜트 배관</span> 분야에서 
            독보적인 성과를 내셨습니다. 특히 <span className={styles.aiHighlight}>안전 규정 준수율이 상위 3%</span>로 
            해외 하이테크 현장 리더급으로 즉시 투입 가능한 수준입니다."
          </p>
          <div className={styles.careerTags}>
            <span className={`${styles.tag} ${styles.activeTag}`}>#배관_전문가_V1</span>
            <span className={`${styles.tag} ${styles.activeTag}`}>#안정성_최우수</span>
            <span className={styles.tag}>#EPC_숙련공</span>
            <span className={styles.tag}>#글로벌_파견_준비_완료</span>
          </div>
        </GlassCard>

        <div className={styles.globalActionGrid}>
          <GlassCard className={styles.globalCard}>
            <span className={styles.cardLabel}>글로벌 프로젝트 매칭률</span>
            <div className={styles.cardValue}>92% (최우수)</div>
            <div className={styles.matchBar}><div className={styles.matchProgress} style={{width: '92%'}}></div></div>
            <p className={styles.subtitle} style={{fontSize: '0.65rem'}}>SAUDI NEOM / US GEORGIA EPC</p>
          </GlassCard>
          <GlassCard className={styles.globalCard}>
            <span className={styles.cardLabel}>추천 글로벌 리워드</span>
            <div className={styles.cardValue}>$42.5 / hr</div>
            <div className={styles.rewardIndicator}>TOP 3%</div>
            <p className={styles.subtitle} style={{fontSize: '0.65rem', color: '#B48A09'}}>글로벌 전문가 평균 이상</p>
          </GlassCard>
        </div>

        {/* New Safety Badges Row */}
        <div className={styles.safetyBadgesRow}>
            <div className={styles.safetyBadge}>
                <ShieldCheck size={14} />
                OSHA 30
            </div>
            <div className={styles.safetyBadge}>
                <ShieldCheck size={14} />
                ISO 45001
            </div>
            <div className={styles.safetyBadge}>
                <ShieldCheck size={14} />
                안전보건관리자
            </div>
            <div className={styles.safetyBadge}>
                <ShieldCheck size={14} />
                고소작업수료
            </div>
        </div>

        <div className={styles.exportActions}>
          <button 
            className={styles.resumeBtn} 
            onClick={() => handleExport('PDF')}
            disabled={isExporting}
          >
            <FileCode2 size={20} />
            {isExporting ? 'AI 리포트 생성 중...' : 'AI 영문 기술 자산 증명서 (PDF)'}
          </button>
          <button className={styles.iconBtn} onClick={() => window.print()}>
            <Printer size={20} />
          </button>
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
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#B48A09', fontSize: '10px', fontWeight: 900, marginBottom: '8px'}}>
                  <Lock size={12} />
                  보안 데이터 검증 완료
              </div>
            <h4>현장 보안 매칭 QR</h4>
            <p>현장 관리자의 실시간 경력 스캔을 위한 보안 암호화 코드입니다.</p>
            <div className={styles.idExpiry}>만료일: 2027. 12. 31</div>
          </div>
        </div>

        {/* Trust Radar */}
        <div className={styles.radarSection}>
          <h3 className={styles.sectionTitle}>
              <Target size={18} color="#B48A09" />
              기술 역량 지표 (Radar)
          </h3>
          <div className={styles.radarWrapper}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(180, 138, 9, 0.1)" strokeWidth="1" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(180, 138, 9, 0.1)" strokeWidth="1" />
              <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(180, 138, 9, 0.1)" strokeWidth="1" />
              <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(180, 138, 9, 0.1)" />
              <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(180, 138, 9, 0.1)" />
              <polygon points="100,40 160,100 100,160 40,100" fill="rgba(180, 138, 9, 0.2)" stroke="#B48A09" strokeWidth="2" />
              <text x="100" y="15" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="800">안전성</text>
              <text x="185" y="105" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="800">기술력</text>
              <text x="100" y="195" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="800">성실성</text>
              <text x="15" y="105" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="800">숙련도</text>
            </svg>
          </div>
        </div>

        {/* Equipment Showcase */}
        <div className={styles.equipmentSection}>
          <h3 className={styles.sectionTitle}>
              <BarChart3 size={18} color="#B48A09" />
              검증된 기술 자산 (Assets)
          </h3>
          <div className={styles.equipmentGrid}>
            <div className={styles.equipmentItem}>
              <div className={styles.eqIcon}><Wrench size={20} color="#B48A09" /></div>
              <div className={styles.eqInfo}>
                <h5>힐티 TE-60 (HIGH-PERF)</h5>
                <span>인증 완료</span>
              </div>
            </div>
            <div className={styles.equipmentItem}>
              <div className={styles.eqIcon}><HardHat size={20} color="#B48A09" /></div>
              <div className={styles.eqInfo}>
                <h5>디지털 안전 고글 (AR)</h5>
                <span>인증 완료</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Career Log */}
      <section className={styles.historySection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>전문가 경력 이력 (History)</h2>
          <ChevronRight size={24} color="rgba(180,138,9,0.5)" />
        </div>

        <div className={styles.historyList}>
          <GlassCard className={styles.historyItem}>
            <div className={styles.historyMeta}>
              <span className={styles.historyDate}>2026. 03. 25</span>
              <span className={styles.historyStatus}>이수 완료</span>
            </div>
            <h3 className={styles.historyTitle}>반도체 평택 캠퍼스 P4 신축 (배관)</h3>
            <p className={styles.historyCompany}>
              <MapPin size={14} style={{marginRight: '8px'}} /> 경기도 평택시 | 삼성엔지니어링
            </p>
          </GlassCard>

          <GlassCard className={styles.historyItem}>
            <div className={styles.historyMeta}>
              <span className={styles.historyDate}>2026. 03. 20</span>
              <span className={styles.historyStatus}>이수 완료</span>
            </div>
            <h3 className={styles.historyTitle}>성수 테크니컬 허브 리노베이션</h3>
            <p className={styles.historyCompany}>
              <MapPin size={14} style={{marginRight: '8px'}} /> 서울시 성동구 | 현대건설
            </p>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
