'use client';

import React from 'react';
import Link from 'next/link';
import { 
    ChevronRight, 
    ShieldCheck, 
    ArrowRight, 
    User, 
    Search, 
    Briefcase, 
    Star,
    BarChart3
} from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                {/* ── Foreman / Career Partner Banner ── */}
                <div className={styles.foremanBanner}>
                    <div className={styles.foremanIntro}>
                        <div className={styles.foremanAvatar}>
                            <User size={32} />
                        </div>
                        <div className={styles.foremanIntroText}>
                            <span className={styles.introBadge}>든든한 현장 조력자</span>
                            <h2>오늘의 전문적인 성장을 위해 현장 반장이 함께합니다</h2>
                            <p>전문가님의 숙련된 기술이 최적의 현장과 매칭될 수 있도록 지원합니다.</p>
                        </div>
                    </div>
                    <div className={styles.foremanActions}>
                        <Link href="/foreman" className={styles.trackBtn}>
                            <Search size={18} />
                            현장 반장 가이드 확인하기
                        </Link>
                    </div>
                </div>

                {/* ── Main Hero Text ── */}
                <div className={styles.heroMain}>
                    <h1 className={styles.title}>
                        <span className={styles.titleLine}>기술인의 숙련도가</span>
                        <span className={styles.titleLine}>가치 있는 <span style={{color: '#B48A09'}}>자산</span>이 되는 곳</span>
                    </h1>
                    <p className={styles.description}>
                        모노는 단순한 구인구직을 넘어, 기술자의 모든 경력을 데이터화하여 글로벌 시장에서 인정받는 커리어 자산으로 구축해 드립니다.
                    </p>
                </div>

                {/* ── AI Matching Card (Native Style) ── */}
                <div className={styles.aiTerminal}>
                    <div className={styles.terminalHeader}>
                        <div className={styles.pulseDot} />
                        전문가님께 딱 맞는 현장을 찾고 있어요
                    </div>
                    <Link href="/jobs" className={styles.tacticalCard}>
                        <div className={styles.cardInfo}>
                        <div className={styles.liveIndicator}>
                                <Star size={14} fill="currentColor" />
                                오늘 가장 추천하는 현장
                            </div>
                            <h3 className={styles.cardTitle}>반도체 플랜트 고소작업 배관 기술자 급구</h3>
                            <p className={styles.cardSub}>경기도 평택 | 일당 210,000원 | 즉시 출근 가능</p>
                            
                            <div className={styles.liveStats}>
                                <div className={styles.statItem}>
                                    <Briefcase size={16} />
                                    12명 지원 중
                                </div>
                                <div className={styles.statItem}>
                                    <BarChart3 size={16} />
                                    매칭 적합도 98%
                                </div>
                            </div>
                        </div>
                        <div className={styles.cardArrow}>
                            <ArrowRight size={28} />
                        </div>
                    </Link>
                </div>

                {/* ── Main Actions ── */}
                <div className={styles.actions}>
                    <Link href="/jobs" className={`${styles.mainBtn} ${styles.primaryBtn}`}>
                        일자리 바로 찾기
                        <ChevronRight size={20} />
                    </Link>
                    <Link href="/career" className={`${styles.mainBtn} ${styles.secondaryBtn}`}>
                        내 기술 자산 확인하기
                    </Link>
                </div>

                {/* ── Quick Asset Nav ── */}
                <div className={styles.assetNav}>
                    <Link href="/office" className={styles.assetItem}>
                        <ShieldCheck size={16} />
                        경력 관리
                    </Link>
                    <div className={styles.divider} />
                    <Link href="/academy" className={styles.assetItem}>
                        기술 교육
                    </Link>
                    <div className={styles.divider} />
                    <Link href="/matching" className={styles.assetItem}>
                        글로벌 파견
                    </Link>
                </div>
            </div>
        </section>
    );
}
