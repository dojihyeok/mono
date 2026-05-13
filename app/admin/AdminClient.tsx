'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { 
    Activity, 
    Users, 
    Building2, 
    Wallet, 
    TrendingUp, 
    Wrench, 
    ShieldCheck,
    ArrowUpRight,
    Loader2,
    LayoutDashboard,
    LogOut,
    Bell,
    Search,
    Globe,
    Zap,
    Cpu,
    PieChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminClient() {
    const [activeTab, setActiveTab] = useState<'overview' | 'workforce' | 'finance'>('overview');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 1500);
    }, []);

    if (isLoading) {
        return (
            <div className={styles.loadingScreen}>
                <div className={styles.loaderBox}>
                    <Cpu size={48} className={styles.pulseIcon} />
                    <h2>MONO CONTROL CENTER</h2>
                    <p>시스템 관제 엔진 시동 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.adminLayout}>
            {/* 1. Sidebar Nav */}
            <aside className={styles.sidebar}>
                <div className={styles.logoArea}>
                    <div className={styles.logoIcon}>M</div>
                    <span>CONTROL</span>
                </div>

                <nav className={styles.sideNav}>
                    <button 
                        className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <LayoutDashboard size={20} />
                        통합 관제
                    </button>
                    <button 
                        className={`${styles.navItem} ${activeTab === 'workforce' ? styles.active : ''}`}
                        onClick={() => setActiveTab('workforce')}
                    >
                        <Users size={20} />
                        인력 허브
                    </button>
                    <button 
                        className={`${styles.navItem} ${activeTab === 'finance' ? styles.active : ''}`}
                        onClick={() => setActiveTab('finance')}
                    >
                        <Wallet size={20} />
                        자산/금융
                    </button>
                </nav>

                <div className={styles.sidebarFooter}>
                    <button className={styles.logoutBtn}><LogOut size={20} /></button>
                </div>
            </aside>

            {/* 2. Main Content */}
            <main className={styles.mainContent}>
                <header className={styles.topBar}>
                    <div className={styles.searchBar}>
                        <Search size={18} />
                        <input type="text" placeholder="현장, 마스터, 장비 검색..." />
                    </div>
                    <div className={styles.headerActions}>
                        <div className={styles.liveStatus}>
                            <div className={styles.pulseDot} />
                            SYSTEM LIVE
                        </div>
                        <button className={styles.iconBtn}><Bell size={20} /></button>
                        <div className={styles.userProfile}>JD</div>
                    </div>
                </header>

                <div className={styles.scrollArea}>
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div 
                                key="overview"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={styles.dashboardView}
                            >
                                {/* Activity Map Mockup */}
                                <section className={styles.mapSection}>
                                    <div className={styles.mapMock}>
                                        <div className={styles.mapGlow} />
                                        <div className={styles.activePings}>
                                            <div className={styles.ping} style={{ top: '30%', left: '40%' }} />
                                            <div className={styles.ping} style={{ top: '60%', left: '70%' }} />
                                            <div className={styles.ping} style={{ top: '45%', left: '55%' }} />
                                        </div>
                                        <div className={styles.mapOverlay}>
                                            <h3>실시간 현장 활동</h3>
                                            <p>현재 <strong>1,242명</strong>의 마스터가 <strong>142개</strong> 현장에서 활동 중</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Stats Grid */}
                                <div className={styles.statsGrid}>
                                    <div className={styles.statCard}>
                                        <div className={styles.cardHeader}>
                                            <span>일간 거래액 (GMV)</span>
                                            <TrendingUp size={16} color="#30d158" />
                                        </div>
                                        <div className={styles.cardValue}>₩ 1.4B</div>
                                        <div className={styles.cardTrend}>+12.5% vs Yesterday</div>
                                    </div>
                                    <div className={styles.statCard}>
                                        <div className={styles.cardHeader}>
                                            <span>신규 매칭 요청</span>
                                            <Zap size={16} color="#D4AF37" />
                                        </div>
                                        <div className={styles.cardValue}>42 건</div>
                                        <div className={styles.cardTrend}>AI 매칭 정확도 98.2%</div>
                                    </div>
                                    <div className={styles.statCard}>
                                        <div className={styles.cardHeader}>
                                            <span>장비 가동률</span>
                                            <Wrench size={16} color="#af52de" />
                                        </div>
                                        <div className={styles.cardValue}>89.4%</div>
                                        <div className={styles.cardTrend}>14개 장비 정비 대기</div>
                                    </div>
                                </div>

                                {/* AI Insight Card */}
                                <section className={styles.aiInsight}>
                                    <div className={styles.insightHeader}>
                                        <Cpu size={24} color="#D4AF37" />
                                        <h3>AI 운영 가이드</h3>
                                    </div>
                                    <p>다음 주 <strong>평택 지역</strong>의 배관 인력 수요가 15% 증가할 것으로 예측됩니다. 선제적으로 마스터 매칭을 준비하세요.</p>
                                    <button className={styles.insightBtn}>예측 데이터 상세 보기 <ArrowUpRight size={14} /></button>
                                </section>
                            </motion.div>
                        )}

                        {activeTab === 'workforce' && (
                            <motion.div 
                                key="workforce"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={styles.listView}
                            >
                                <div className={styles.listHeader}>
                                    <h2>인력 및 파트너 관리</h2>
                                    <button className={styles.primaryBtn}>신규 파트너 등록</button>
                                </div>
                                <div className={styles.tableCard}>
                                    <table className={styles.adminTable}>
                                        <thead>
                                            <tr>
                                                <th>파트너사</th>
                                                <th>등급</th>
                                                <th>활성 현장</th>
                                                <th>누적 거래액</th>
                                                <th>상태</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>삼성엔지니어링</td>
                                                <td><span className={styles.tierBadge}>TIER 1</span></td>
                                                <td>24</td>
                                                <td>₩ 4.2B</td>
                                                <td><span className={styles.statusActive}>ACTIVE</span></td>
                                            </tr>
                                            <tr>
                                                <td>현대건설</td>
                                                <td><span className={styles.tierBadge}>TIER 1</span></td>
                                                <td>18</td>
                                                <td>₩ 3.1B</td>
                                                <td><span className={styles.statusActive}>ACTIVE</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

