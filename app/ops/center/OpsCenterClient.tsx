'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { 
    Activity, 
    Settings, 
    ShieldCheck, 
    Zap, 
    AlertTriangle, 
    CheckSquare,
    ClipboardList,
    Radio,
    Clock,
    MapPin,
    Users,
    BrainCircuit
} from 'lucide-react';

export default function OpsCenterClient() {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('DIAGNOSING');
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        // Daily goal progress simulation
        const timer = setTimeout(() => setProgress(78), 1200);
        
        // Dynamic time display for site local time (Saudi Riyadh)
        const updateTimer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
        }, 1000);

        setTimeout(() => setStatus('OPERATIONAL'), 2000);

        return () => {
            clearTimeout(timer);
            clearInterval(updateTimer);
        }
    }, []);

    const TELEMETRY_DATA = [
        { label: 'EQUIPMENT HEALTH', value: '94%', sub: 'No Critical Alerts', color: '#10B981' },
        { label: 'FUEL / ENERGY', value: '62%', sub: 'Estimated 4.5h left', color: '#B48A09' },
        { label: 'LOAD CAPACITY', value: 'OPTIMAL', sub: 'Balanced / Stable', color: '#E2E8F0' }
    ];

    const AI_INSIGHTS = [
        { title: 'PREDICTIVE MAINTENANCE', desc: '유압 계통 마모 감지: 14시간 후 오일 교체 권장', type: 'WARN', icon: <Settings size={14} /> },
        { title: 'SMART STAFFING', desc: '공정 Phase 4.3 진입 전, 용접 마스터 1명 추가 배치 권장 (98% Match)', type: 'INFO', icon: <Users size={14} /> },
        { title: 'WEATHER PROTOCOL', desc: '사우디 현지 기상 변동: 3시간 후 강풍 예보 - 고공 작업 주의', type: 'ALERT', icon: <AlertTriangle size={14} /> }
    ];

    return (
        <div className={styles.pageWrap}>
            <header className={styles.header}>
                <div className={styles.siteInfo}>
                    <div className={styles.siteTag}>
                        <Radio size={12} className={styles.pulseIcon} />
                        <span>실시간 현장 지원 중 | AI 매니저 활성화</span>
                    </div>
                    <h1>NEOM CITY <span className={styles.goldText}>프로젝트 현황</span></h1>
                    <div className={styles.locationGroup}>
                        <MapPin size={14} color="#B48A09" />
                        <span>Riyadh Sector 4, Saudi Arabia</span>
                        <div className={styles.divider} />
                        <Clock size={14} color="#B0B0B0" />
                        <span>LOCAL {currentTime}</span>
                    </div>
                </div>
                <div className={`${styles.statusBadge} ${styles[status]}`}>
                    {status}
                </div>
            </header>

            {/* AI Advisor Insight Bar */}
            <section className={styles.aiInsightSection}>
                <div className={styles.aiHeader}>
                    <BrainCircuit size={20} color="#B48A09" className={styles.aiIcon} />
                    <h3>AI 매니저 업무 인사이트</h3>
                </div>
                <div className={styles.insightGrid}>
                    {AI_INSIGHTS.map((insight, i) => (
                        <div key={i} className={`${styles.insightCard} ${styles[insight.type]}`}>
                            <div className={styles.insightLabel}>
                                {insight.icon}
                                <span>{insight.title}</span>
                            </div>
                            <p>{insight.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.dashboardGrid}>
                {/* 1. Milestone Progress Gauge */}
                <div className={styles.mainCard}>
                    <div className={styles.cardHeader}>
                        <Activity size={18} color="#B48A09" />
                        <h3>오늘의 공정 달성률</h3>
                    </div>
                    <div className={styles.progressSection}>
                        <div className={styles.circularGauge}>
                            <div className={styles.gaugeFill} style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }} />
                            <div className={styles.percentage}>{progress}%</div>
                            <span className={styles.gaugeLabel}>일일 목표</span>
                        </div>
                        <div className={styles.taskSummary}>
                            <h4>현재 주요 공정</h4>
                            <p>기초 구조물 안정성 테스트 (Phase 4.2)</p>
                            <div className={styles.milestoneMini}>
                                <span>다음 단계: Main Pillar Foundation</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Equipment Telemetry */}
                <div className={styles.sideCard}>
                    <div className={styles.cardHeader}>
                        <Settings size={18} color="#E2E8F0" />
                        <h3>핵심 장비 운용 현황</h3>
                    </div>
                    <div className={styles.telemetryList}>
                        {TELEMETRY_DATA.map((data, i) => (
                            <div key={i} className={styles.teleItem}>
                                <div className={styles.teleHeader}>
                                    <span className={styles.teleLabel}>{data.label}</span>
                                    <span className={styles.teleValue} style={{ color: data.color }}>{data.value}</span>
                                </div>
                                <span className={styles.teleSub}>{data.sub}</span>
                            </div>
                        ))}
                    </div>
                    <button className={styles.maintBtn}>
                        <AlertTriangle size={14} /> 정비 요청 발송
                    </button>
                </div>
            </section>

            <section className={styles.opsActions}>
                <div className={styles.actionHeader}>
                    <ClipboardList size={20} color="#B48A09" />
                    <h3>현장 운영 관리</h3>
                </div>
                <div className={styles.actionGrid}>
                    <button className={styles.actionBtn}>
                        <CheckSquare size={18} />
                        <span>오늘 작업 서명 (LOG)</span>
                    </button>
                    <button className={styles.actionBtn}>
                        <Zap size={18} />
                        <span>자재 수급 요청</span>
                    </button>
                    <button className={styles.actionBtn}>
                        <ShieldCheck size={18} />
                        <span>안전 일지 작성</span>
                    </button>
                </div>
            </section>

            {/* Emergency Floating SOS */}
            <div className={styles.sosContainer}>
                <button className={styles.sosBtn}>
                    <div className={styles.sosIconCircle}>
                        <AlertTriangle size={24} color="#fff" />
                    </div>
                    <span>현장 긴급 지원</span>
                </button>
            </div>

            <footer className={styles.footer}>
                <p>본 관리 시스템은 AI 매니저의 실시간 분석 로직에 의해 30초 주기로 현장 안전 및 리스크를 모니터링 중입니다.</p>
                <div className={styles.systemId}>시스템 ID: MN-SA-AI-X10</div>
            </footer>
        </div>
    );
}
