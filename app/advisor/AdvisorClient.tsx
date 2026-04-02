'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { 
    BrainCircuit, 
    ShieldCheck, 
    TrendingUp, 
    Globe, 
    Activity, 
    ChevronRight,
    Search,
    AlertCircle
} from 'lucide-react';

export default function AdvisorClient() {
    const [analyzing, setAnalyzing] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setAnalyzing(false), 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);
        return () => clearInterval(interval);
    }, []);

    const MASTER_STATS = [
        { label: 'TRUST INDEX', value: '98.5', color: '#B48A09', trend: '+1.2' },
        { label: 'EQUIPMENT HEALTH', value: 'OPTIMAL', color: '#10B981', trend: 'Maintenance Fixed' },
        { label: 'GLOBAL READINESS', value: 'MASTER', color: '#E2E8F0', trend: 'ISO Certified' }
    ];

    const RECOMMENDATIONS = [
        {
            id: 1,
            project: 'NEOM CITY Construction Phase 2',
            location: 'Saudi Arabia',
            match: 97,
            yield: '₩ 42.5M /mo',
            reason: 'High expertise in underwater welding & ISO trust score.'
        },
        {
            id: 2,
            project: 'Australia Green Hydrogen Plant',
            location: 'Queensland',
            match: 92,
            yield: '₩ 38.0M /mo',
            reason: 'Heavy equipment asset utilization (Optimal condition).'
        }
    ];

    if (analyzing) {
        return (
            <div className={styles.scanningWrap}>
                <div className={styles.scanner}>
                    <BrainCircuit size={64} className={styles.scanIcon} />
                    <h2>MONO AI | ASSET SCANNING</h2>
                    <p>마스터의 기술 자산, 장비 상태 및 신용 리포트를 정밀 분석 중입니다.</p>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                    </div>
                    <span className={styles.progressPercent}>{progress}%</span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageWrap}>
            <header className={styles.header}>
                <div className={styles.premiumBadge}>MONO AI | MASTER CAREER ADVISOR</div>
                <h1>마스터 커리어 <span className={styles.goldText}>심층 분석 리포트</span></h1>
                <p className={styles.subtitle}>데이터 자산 분석 기반 글로벌 하이-벨류 프로젝트 매칭 제안</p>
            </header>

            <div className={styles.statsGrid}>
                {MASTER_STATS.map((stat, i) => (
                    <div key={i} className={styles.statCard}>
                        <span className={styles.statLabel}>{stat.label}</span>
                        <div className={styles.statValueRow}>
                            <span className={styles.statValue} style={{ color: stat.color }}>{stat.value}</span>
                            <span className={styles.statTrend}>{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            <section className={styles.advisorSection}>
                <div className={styles.cardHeader}>
                    <TrendingUp size={20} color="#B48A09" />
                    <h3>AI 가치 분석 인사이트</h3>
                </div>
                <div className={styles.insightBox}>
                    <p>
                        현재 마스터님의 **기술 자산(Passport)**과 **장비 상태(Equipment)**는 상위 2%의 글로벌 적합성을 보이고 있습니다. 
                        특히 최근 ISO 보고서 인증을 통한 신용 점수 상승으로, 중동 및 유럽 지역의 **하이-스테이크(High-stakes) 현장** 투입 시 
                        평균 대비 15% 높은 우대 수당 확보가 가능합니다.
                    </p>
                    <div className={styles.alertBox}>
                        <AlertCircle size={16} />
                        <span>장비(도로 포장 장비)의 다음 정비 주기가 14일 남았습니다. 글로벌 프로젝트 투입 전 조치를 권장합니다.</span>
                    </div>
                </div>
            </section>

            <section className={styles.projectSection}>
                <div className={styles.cardHeader}>
                    <Globe size={20} color="#B48A09" />
                    <h3>최적 글로벌 매칭 제안</h3>
                </div>
                <div className={styles.projectGrid}>
                    {RECOMMENDATIONS.map((rec) => (
                        <div key={rec.id} className={styles.projectCard}>
                            <div className={styles.matchScore}>
                                <div className={styles.radialProgress}>
                                    <span className={styles.scoreNum}>{rec.match}%</span>
                                    <span className={styles.scoreLabel}>MATCH</span>
                                </div>
                            </div>
                            <div className={styles.recInfo}>
                                <h4>{rec.project}</h4>
                                <span className={styles.location}>{rec.location}</span>
                                <p className={styles.reason}>{rec.reason}</p>
                                <div className={styles.yieldBox}>
                                    <span className={styles.yieldLabel}>EST. MONTHLY REWARD</span>
                                    <span className={styles.yieldValue}>{rec.yield}</span>
                                </div>
                                <button className={styles.detailsBtn}>
                                    상세 제안 확인 <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <footer className={styles.footer}>
                <p>본 리포트는 실시간 프로젝트 수급 데이터와 마스터 자산 가치를 기반으로 AI가 자동 생성한 맞춤형 제언입니다. </p>
                <div className={styles.reportId}>REPORT ID: MA-ALPHA-7729</div>
            </footer>
        </div>
    );
}
