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
        { label: '신뢰 지수', value: '98.5', color: '#B48A09', trend: '+1.2' },
        { label: '장비 상태', value: '최상 (OPTIMAL)', color: '#10B981', trend: '정비 완료' },
        { label: '글로벌 진출 준비도', value: '마스터 등급', color: '#E2E8F0', trend: 'ISO 국제 인증' }
    ];

    const RECOMMENDATIONS = [
        {
            id: 1,
            project: '네옴 시티(NEOM CITY) 건설 2단계',
            location: '사우디아라비아',
            match: 97,
            yield: '월 약 4,250만원',
            reason: '수중 용접 숙련도 및 ISO 신뢰도 기반'
        },
        {
            id: 2,
            project: '호주 퀸즐랜드 그린 수소 플랜트',
            location: '호주 퀸즐랜드',
            match: 92,
            yield: '월 약 3,800만원',
            reason: '보유 중장비 전문 활용 (최적 상태 유지)'
        }
    ];

    if (analyzing) {
        return (
            <div className={styles.scanningWrap}>
                <div className={styles.scanner}>
                    <BrainCircuit size={64} className={styles.scanIcon} />
                    <h2>모노 AI | 자산 정밀 분석 중</h2>
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
                <div className={styles.premiumBadge}>모노 AI | 마스터 커리어 어드바이저</div>
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
                                    <span className={styles.scoreLabel}>일치도</span>
                                </div>
                            </div>
                            <div className={styles.recInfo}>
                                <h4>{rec.project}</h4>
                                <span className={styles.location}>{rec.location}</span>
                                <p className={styles.reason}>{rec.reason}</p>
                                <div className={styles.yieldBox}>
                                    <span className={styles.yieldLabel}>예상 월 수익</span>
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
                <div className={styles.reportId}>리포트 번호: MA-ALPHA-7729</div>
            </footer>
        </div>
    );
}
