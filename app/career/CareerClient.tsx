'use client';

import { useState } from 'react';
import styles from './career.module.css';
import { 
    Award, 
    ShieldCheck, 
    ChevronRight,
    MapPin,
    Calendar,
    Download,
    Cpu,
    Zap,
    Briefcase,
    Star,
    Share2,
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CareerClient() {
    const [activeTab, setActiveTab] = useState<'passport' | 'history'>('passport');

    return (
        <div className={styles.careerContainer}>
            {/* 1. Header */}
            <header className={styles.careerHeader}>
                <h1>내 커리어</h1>
                <button className={styles.shareBtn}><Share2 size={20} /></button>
            </header>

            {/* 2. Main Passport Card */}
            <section className={styles.passportHero}>
                <div className={styles.passportCard}>
                    <div className={styles.cardGlow} />
                    <div className={styles.cardHeader}>
                        <div className={styles.identity}>
                            <div className={styles.avatar}>K</div>
                            <div className={styles.nameInfo}>
                                <h2>김프로</h2>
                                <span>배관 특급 기술자</span>
                            </div>
                        </div>
                        <div className={styles.officialBadge}>
                            <Award size={24} />
                            <span>CERTIFIED</span>
                        </div>
                    </div>
                    
                    <div className={styles.cardStats}>
                        <div className={styles.statItem}>
                            <span>출역 일수</span>
                            <strong>342일</strong>
                        </div>
                        <div className={styles.statItem}>
                            <span>안전 평점</span>
                            <strong>4.9/5.0</strong>
                        </div>
                        <div className={styles.statItem}>
                            <span>기술 지수</span>
                            <strong>980</strong>
                        </div>
                    </div>

                    <div className={styles.verificationRow}>
                        <ShieldCheck size={14} />
                        모노 블록체인 기술 증명 완료
                    </div>
                </div>
            </section>

            {/* 3. Navigation */}
            <nav className={styles.careerNav}>
                <button 
                    className={`${styles.navBtn} ${activeTab === 'passport' ? styles.active : ''}`}
                    onClick={() => setActiveTab('passport')}
                >
                    기술 인증
                </button>
                <button 
                    className={`${styles.navBtn} ${activeTab === 'history' ? styles.active : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    경력 이력
                </button>
            </nav>

            {/* 4. Content Content Area */}
            <main className={styles.mainContent}>
                <AnimatePresence mode="wait">
                    {activeTab === 'passport' ? (
                        <motion.div 
                            key="passport"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className={styles.skillSection}
                        >
                            <div className={styles.sectionHeader}>
                                <h3>핵심 보유 기술</h3>
                                <button className={styles.detailBtn}>전체보기</button>
                            </div>
                            
                            <div className={styles.skillGrid}>
                                <div className={styles.skillItem}>
                                    <div className={styles.skillLabel}>
                                        <span>고압 배관 설계</span>
                                        <strong>MASTER</strong>
                                    </div>
                                    <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: '95%' }} /></div>
                                </div>
                                <div className={styles.skillItem}>
                                    <div className={styles.skillLabel}>
                                        <span>TIG 용접</span>
                                        <strong>EXPERT</strong>
                                    </div>
                                    <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: '88%' }} /></div>
                                </div>
                            </div>

                            <div className={styles.certSection}>
                                <h3>보유 자격증</h3>
                                <div className={styles.certList}>
                                    <div className={styles.certItem}>
                                        <div className={styles.certIcon}><Cpu size={20} /></div>
                                        <div className={styles.certInfo}>
                                            <strong>배관기능장</strong>
                                            <span>한국산업인력공단 · 2020.05</span>
                                        </div>
                                        <CheckCircle2 size={18} color="#30d158" />
                                    </div>
                                </div>
                            </div>

                            <button className={styles.downloadBtn}>
                                <Download size={20} />
                                디지털 경력 증명서 PDF 저장
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="history"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className={styles.historySection}
                        >
                            <div className={styles.timeline}>
                                <div className={styles.timelineItem}>
                                    <div className={styles.timeMarker} />
                                    <div className={styles.timeContent}>
                                        <div className={styles.timeHeader}>
                                            <strong>평택 캠퍼스 P4 신축 (배관)</strong>
                                            <span>2026.03 - 현재</span>
                                        </div>
                                        <div className={styles.timeMeta}>
                                            <MapPin size={12} /> 삼성엔지니어링 · 경기도 평택
                                        </div>
                                        <div className={styles.timeBadge}>진행 중</div>
                                    </div>
                                </div>
                                <div className={styles.timelineItem}>
                                    <div className={styles.timeMarker} />
                                    <div className={styles.timeContent}>
                                        <div className={styles.timeHeader}>
                                            <strong>성수 테크니컬 허브 리노베이션</strong>
                                            <span>2026.01 - 2026.03</span>
                                        </div>
                                        <div className={styles.timeMeta}>
                                            <MapPin size={12} /> 현대건설 · 서울 성수
                                        </div>
                                        <div className={styles.timeBadge}>완료</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* AI Advisor Card */}
            <aside className={styles.aiAdvisor}>
                <div className={styles.advisorHeader}>
                    <div className={styles.zapIcon}><Zap size={18} /></div>
                    <strong>커리어 성장을 위한 조언</strong>
                </div>
                <p>현재 보유하신 <strong>배관 설계</strong> 역량에 <strong>자동화 용접</strong> 교육을 추가하시면 예상 단가가 15% 상승할 것으로 분석됩니다.</p>
                <button className={styles.advisorBtn}>추천 강의 보기 <ChevronRight size={14} /></button>
            </aside>
        </div>
    );
}
