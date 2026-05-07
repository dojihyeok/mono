'use client';

import { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import GlassCard from '@/components/UI/GlassCard';
import Button from '@/components/UI/Button';
import styles from './page.module.css';

interface DashboardClientProps {
    technician: any;
    transactions: any[];
}

export default function DashboardClient({ technician, transactions }: DashboardClientProps) {
    const [scoreAnim, setScoreAnim] = useState(0);

    const trustScore = 94.8; // Default if not in tech model

    useEffect(() => {
        const timer = setTimeout(() => setScoreAnim(trustScore), 500);
        return () => clearTimeout(timer);
    }, [trustScore]);

    const stats = useMemo(() => {
        const totalEarnings = transactions
            .filter(t => t.status === 'Settled')
            .reduce((acc, t) => acc + t.amount, 0);
        
        return {
            totalEarnings: totalEarnings.toLocaleString(),
            totalSites: transactions.length,
            recentWork: transactions.slice(0, 2).map(t => ({
                id: t.id.toString(),
                title: t.siteName,
                date: t.date.toLocaleDateString ? new Date(t.date).toLocaleDateString() : t.date,
                earnings: t.amount.toLocaleString()
            }))
        };
    }, [transactions]);

    if (!technician) return <div>마스터 정보를 불러올 수 없습니다.</div>;

    return (
        <div className={styles.pageWrap}>
            <Navbar />
            
            <main className={styles.main}>
                {/* 1. Header & Profile Asset */}
                <section className={styles.profileSection}>
                    <div className={styles.profileHeader}>
                        <div className={styles.avatarWrapper}>
                            <div className={styles.avatar}>{technician.name[0]}</div>
                            {technician.verified && <div className={styles.verifiedIcon}>✓</div>}
                        </div>
                        <div className={styles.profileMeta}>
                            <h1 className={styles.name}>{technician.name} <span className={styles.levelTag}>{technician.level}</span></h1>
                            <p className={styles.speciality}>{technician.specialty}</p>
                            <span className={styles.since}>가입일: 2023.05</span>
                        </div>
                    </div>
                </section>

                {/* 2. Trust Score & Asset Overview */}
                <div className={styles.dashboardGrid}>
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

                    <div className={styles.statColumn}>
                        <GlassCard className={styles.statCard}>
                            <p className={styles.statLabel}>총 기술 자산 (수익)</p>
                            <h2 className={styles.statValue}>₩{stats.totalEarnings}</h2>
                            <span className={styles.statTrend}>↑ 최근 30일 기준</span>
                        </GlassCard>
                        <div className={styles.smallGrid}>
                            <GlassCard className={styles.smallStat}>
                                <p className={styles.statLabel}>참여 현장</p>
                                <p className={styles.smallValue}>{stats.totalSites}곳</p>
                            </GlassCard>
                            <GlassCard className={styles.smallStat}>
                                <p className={styles.statLabel}>평점</p>
                                <p className={styles.smallValue}>★ 4.9</p>
                            </GlassCard>
                        </div>
                    </div>
                </div>

                <section className={styles.assetSection}>
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>마스터 공인 기술 자산 (경력인정)</h3>
                    </div>
                    <div className={styles.badgeGrid}>
                        {[
                            { id: 'b1', name: '대리석 시공 숙련', level: '전문가' },
                            { id: 'b2', name: '방수 기능사 자격', level: '인증됨' },
                            { id: 'b3', name: '현장 안전 교육 이수', level: '이수 완료' },
                        ].map(badge => (
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

                <div className={styles.lowerGrid}>
                    <GlassCard className={styles.gearCard}>
                        <h3 className={styles.cardTitle}>보유 전문 장비 목록</h3>
                        <ul className={styles.gearList}>
                            <li className={styles.gearItem}>
                                <span className={styles.gearName}>레이저 레벨기 (전문가용)</span>
                                <span className={styles.gearBrand}>보쉬(Bosch)</span>
                            </li>
                            <li className={styles.gearItem}>
                                <span className={styles.gearName}>고성능 타일 절단기</span>
                                <span className={styles.gearBrand}>루비(Rubi)</span>
                            </li>
                        </ul>
                        <Button variant="secondary" size="sm" className={styles.addBtn}>+ 장비 추가</Button>
                    </GlassCard>

                    <GlassCard className={styles.historyCard}>
                        <h3 className={styles.cardTitle}>최근 활동 내역</h3>
                        <ul className={styles.historyList}>
                            {stats.recentWork.map(work => (
                                <li key={work.id} className={styles.historyItem}>
                                    <div className={styles.workInfo}>
                                        <p className={styles.workTitleText}>{work.title}</p>
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
