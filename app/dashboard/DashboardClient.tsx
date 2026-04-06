'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import GlassCard from '@/components/UI/GlassCard';
import Button from '@/components/UI/Button';
import styles from './page.module.css';

// Mock Master Data for Phase 2.1
const MASTER_DATA = {
    name: '김숙련',
    specialty: '타일 숙련공 (프리미엄 마스터)',
    level: '마스터 등급',
    trustScore: 94.8,
    totalEarnings: '42,850,000',
    totalSites: 128,
    rating: 4.9,
    since: '2023.05',
    verified: true,
    badges: [
        { id: 'b1', name: '대리석 시공 숙련', category: '기술', level: '전문가' },
        { id: 'b2', name: '방수 기능사 자격', category: '자격', level: '인증됨' },
        { id: 'b3', name: '현장 안전 교육 이수', category: '안전', level: '이수 완료' },
    ],
    gears: [
        { id: 'g1', name: '레이저 레벨기 (전문가용)', brand: '보쉬(Bosch)' },
        { id: 'g2', name: '고성능 타일 절단기', brand: '루비(Rubi)' },
    ],
    recentWork: [
        { id: 'w1', title: '청담동 고급 빌라 대리석 시공', date: '2024.03.15', earnings: '450,000' },
        { id: 'w2', title: '강남 오피스텔 욕실 타일 리모델링', date: '2024.03.12', earnings: '380,000' },
    ]
};

export default function DashboardClient() {
    const [scoreAnim, setScoreAnim] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setScoreAnim(MASTER_DATA.trustScore), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={styles.pageWrap}>
            <Navbar />
            
            <main className={styles.main}>
                {/* 1. Header & Profile Asset */}
                <section className={styles.profileSection}>
                    <div className={styles.profileHeader}>
                        <div className={styles.avatarWrapper}>
                            <div className={styles.avatar}>MK</div>
                            {MASTER_DATA.verified && <div className={styles.verifiedIcon}>✓</div>}
                        </div>
                        <div className={styles.profileMeta}>
                            <h1 className={styles.name}>{MASTER_DATA.name} <span className={styles.levelTag}>{MASTER_DATA.level}</span></h1>
                            <p className={styles.speciality}>{MASTER_DATA.specialty}</p>
                            <span className={styles.since}>가입일: {MASTER_DATA.since}</span>
                        </div>
                    </div>
                </section>

                {/* 2. Trust Score & Asset Overview */}
                <div className={styles.dashboardGrid}>
                    {/* Trust Score Ring */}
                    <GlassCard className={styles.trustCard}>
                        <div className={styles.trustHeader}>
                            <h3 className={styles.cardTitle}>마스터 신뢰 점수</h3>
                            <span className={styles.statusLive}>실시간 측정</span>
                        </div>
                        <div className={styles.ringContainer}>
                            <svg className={styles.svgRing}>
                                <circle className={styles.ringBg} cx="60" cy="60" r="54" />
                                <circle 
                                    className={styles.ringIndicator} 
                                    cx="60" cy="60" r="54" 
                                    style={{ strokeDashoffset: 340 - (340 * scoreAnim) / 100 }}
                                />
                            </svg>
                            <div className={styles.scoreText}>
                                <span className={styles.scoreNumber}>{scoreAnim}</span>
                                <span className={styles.scoreUnit}>점</span>
                            </div>
                        </div>
                        <p className={styles.trustDesc}>상위 3% 이내의 초숙련 마스터입니다.</p>
                    </GlassCard>

                    {/* Financial Asset Stats */}
                    <div className={styles.statColumn}>
                        <GlassCard className={styles.statCard}>
                            <p className={styles.statLabel}>총 기술 자산 (수익)</p>
                            <h2 className={styles.statValue}>₩{MASTER_DATA.totalEarnings}</h2>
                            <span className={styles.statTrend}>↑ 최근 30일 기준</span>
                        </GlassCard>
                        <div className={styles.smallGrid}>
                            <GlassCard className={styles.smallStat}>
                                <p className={styles.statLabel}>참여 현장</p>
                                <p className={styles.smallValue}>{MASTER_DATA.totalSites}곳</p>
                            </GlassCard>
                            <GlassCard className={styles.smallStat}>
                                <p className={styles.statLabel}>평점</p>
                                <p className={styles.smallValue}>★ {MASTER_DATA.rating}</p>
                            </GlassCard>
                        </div>
                    </div>
                </div>

                {/* 3. Tech Badge & Gear Inventory (RPL Asset) */}
                <section className={styles.assetSection}>
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>마스터 공인 기술 자산 (경력인정)</h3>
                    </div>
                    <div className={styles.badgeGrid}>
                        {MASTER_DATA.badges.map(badge => (
                            <div key={badge.id} className={styles.badgeItem}>
                                <div className={styles.badgeIcon}>🏅</div>
                                <div className={styles.badgeInfo}>
                                    <p className={styles.badgeName}>{badge.name}</p>
                                    <span className={styles.badgeLevel}>{badge.level}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Equipment & Recent History */}
                <div className={styles.lowerGrid}>
                    <GlassCard className={styles.gearCard}>
                        <h3 className={styles.cardTitle}>보유 전문 장비 목록</h3>
                        <ul className={styles.gearList}>
                            {MASTER_DATA.gears.map(gear => (
                                <li key={gear.id} className={styles.gearItem}>
                                    <span className={styles.gearName}>{gear.name}</span>
                                    <span className={styles.gearBrand}>{gear.brand}</span>
                                </li>
                            ))}
                        </ul>
                        <Button variant="secondary" size="sm" className={styles.addBtn}>+ 장비 추가</Button>
                    </GlassCard>

                    <GlassCard className={styles.historyCard}>
                        <h3 className={styles.cardTitle}>최근 활동 내역</h3>
                        <ul className={styles.historyList}>
                            {MASTER_DATA.recentWork.map(work => (
                                <li key={work.id} className={styles.historyItem}>
                                    <div className={styles.workInfo}>
                                        <p className={work.title}>{work.title}</p>
                                        <span className={styles.workDate}>{work.date}</span>
                                    </div>
                                    <span className={styles.workEarnings}>+₩{work.earnings}</span>
                                </li>
                            ))}
                        </ul>
                        <Button variant="ghost" size="sm" className={styles.moreBtn}>전체 보기</Button>
                    </GlassCard>
                </div>
            </main>
        </div>
    );
}
