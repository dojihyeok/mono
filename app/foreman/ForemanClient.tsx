'use client';

import { useState } from 'react';
import { 
    Users, 
    ShieldCheck, 
    Zap, 
    MessageSquare, 
    TrendingUp, 
    ChevronRight,
    Star,
    MapPin,
    Trophy,
    Heart,
    Share2,
    Search,
    UserPlus,
    Flame
} from 'lucide-react';
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForemanClient() {
    const [activeTab, setActiveTab] = useState<'network' | 'feed' | 'teams'>('network');

    const EXPERTS = [
        { id: 1, name: '김프로', role: '배관 특급', trust: 99, location: '평택 P4', tags: ['용접', '설계'], image: 'K' },
        { id: 2, name: '이팀장', role: '전기 숙련', trust: 96, location: '용인 클러스터', tags: ['자동화', 'PLC'], image: 'L' },
        { id: 3, name: '박반장', role: '플랜트 관리', trust: 94, location: '글로벌 파견', tags: ['ISO인증', 'PM'], image: 'P' },
    ];

    const TEAMS = [
        { id: 1, title: '평택 P4 배관 A팀 모집', leader: '김프로', members: 4, total: 6, urgent: true },
        { id: 2, title: '용인 클러스터 야간 긴급조', leader: '최명장', members: 2, total: 3, urgent: true },
    ];

    return (
        <div className={styles.foremanContainer}>
            {/* 1. Community Hero */}
            <header className={styles.communityHero}>
                <div className={styles.heroContent}>
                    <div className={styles.liveBadge}>
                        <span className={styles.pulseDot} />
                        1,240명의 전문가가 접속 중
                    </div>
                    <h1>기술 전문가들의 <span className="gradient-text">네트워킹</span></h1>
                    <p>검증된 기술 전문가들과 연결하고, 최강의 팀을 구성하세요.</p>
                </div>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input type="text" placeholder="기술직군, 현장, 또는 전문가 이름 검색" />
                </div>
            </header>

            {/* 2. Navigation Tabs */}
            <nav className={styles.navTabs}>
                <button 
                    className={`${styles.navTab} ${activeTab === 'network' ? styles.active : ''}`}
                    onClick={() => setActiveTab('network')}
                >
                    전문가 네트워크
                </button>
                <button 
                    className={`${styles.navTab} ${activeTab === 'feed' ? styles.active : ''}`}
                    onClick={() => setActiveTab('feed')}
                >
                    현장 라이브
                </button>
                <button 
                    className={`${styles.navTab} ${activeTab === 'teams' ? styles.active : ''}`}
                    onClick={() => setActiveTab('teams')}
                >
                    팀 빌딩 <span className={styles.hotBadge}>HOT</span>
                </button>
            </nav>

            <AnimatePresence mode="wait">
                <motion.main 
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={styles.mainContent}
                >
                    {activeTab === 'network' && (
                        <div className={styles.masterGrid}>
                            {EXPERTS.map(master => (
                                <div key={master.id} className={styles.masterCard}>
                                    <div className={styles.masterHeader}>
                                        <div className={styles.masterAvatar}>{master.image}</div>
                                        <div className={styles.masterBasic}>
                                            <div className={styles.nameRow}>
                                                <h4>{master.name}</h4>
                                                <ShieldCheck size={14} className={styles.verified} />
                                            </div>
                                            <span>{master.role}</span>
                                        </div>
                                        <div className={styles.trustScore}>
                                            <Trophy size={14} />
                                            {master.trust}
                                        </div>
                                    </div>
                                    <div className={styles.masterInfo}>
                                        <div className={styles.infoItem}><MapPin size={12} /> {master.location}</div>
                                        <div className={styles.tagRow}>
                                            {master.tags.map(tag => <span key={tag} className={styles.miniTag}>#{tag}</span>)}
                                        </div>
                                    </div>
                                    <div className={styles.masterFooter}>
                                        <button className={styles.connectBtn}><UserPlus size={16} /> 연결하기</button>
                                        <button className={styles.msgBtn}><MessageSquare size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'feed' && (
                        <div className={styles.feedList}>
                            <div className={styles.feedInputCard}>
                                <div className={styles.avatarMini}>L</div>
                                <input type="text" placeholder="오늘 현장의 소식을 공유해보세요..." />
                            </div>
                            
                            {[1, 2].map(post => (
                                <div key={post} className={styles.feedCard}>
                                    <div className={styles.feedHeader}>
                                        <div className={styles.authorInfo}>
                                            <div className={styles.avatarMini}>K</div>
                                            <div>
                                                <strong>김프로</strong>
                                                <span>12분 전 · 평택 P4</span>
                                            </div>
                                        </div>
                                        <button className={styles.moreBtn}><ChevronRight size={18} /></button>
                                    </div>
                                    <p className={styles.feedText}>
                                        오늘 P4 현장 C구역 배관 용접 작업 들어갑니다. 어제 우천으로 노면이 미끄러우니 다들 이동하실 때 조심하세요! 
                                        기술 포인트 1.2배 적용 중이니 다들 화이팅입니다.
                                    </p>
                                    <div className={styles.feedStats}>
                                        <button className={styles.statBtn}><Heart size={16} /> 24</button>
                                        <button className={styles.statBtn}><MessageSquare size={16} /> 8</button>
                                        <button className={styles.statBtn}><Share2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'teams' && (
                        <div className={styles.teamGrid}>
                            {TEAMS.map(team => (
                                <div key={team.id} className={styles.teamCard}>
                                    {team.urgent && <div className={styles.urgentBadge}><Flame size={12} /> 급구</div>}
                                    <div className={styles.teamInfo}>
                                        <h3>{team.title}</h3>
                                        <div className={styles.teamMeta}>
                                            <span>리더: {team.leader}</span>
                                            <span>참여도: {team.members}/{team.total} 명</span>
                                        </div>
                                    </div>
                                    <div className={styles.teamProgress}>
                                        <div className={styles.teamBar}>
                                            <div className={styles.teamFill} style={{ width: `${(team.members/team.total)*100}%` }} />
                                        </div>
                                    </div>
                                    <button className={styles.joinBtn}>팀 합류하기</button>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.main>
            </AnimatePresence>

            {/* AI Community Manager Floating Card */}
            <aside className={styles.aiManager}>
                <div className={styles.aiHeader}>
                    <div className={styles.aiAvatar}>
                        <Zap size={20} />
                    </div>
                    <div>
                        <strong>커뮤니티 매니저 모컬</strong>
                        <span>실시간 매칭 리포트</span>
                    </div>
                </div>
                <p>지금 <strong>용인 클러스터</strong>에 기술자들이 부족합니다. 팀을 구성해서 투입되면 15% 보너스가 지급됩니다!</p>
                <button className={styles.aiAction}>팀 구성 제안보기 <ChevronRight size={14} /></button>
            </aside>
        </div>
    );
}
