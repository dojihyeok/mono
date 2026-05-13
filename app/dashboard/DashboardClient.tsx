'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import GlassCard from '@/components/UI/GlassCard';
import Button from '@/components/UI/Button';
import { 
    ShieldCheck, 
    TrendingUp, 
    MapPin, 
    Star, 
    Settings, 
    ChevronRight, 
    Plus, 
    History, 
    Wrench, 
    Award,
    Zap,
    CreditCard,
    BrainCircuit,
    CheckCircle2
} from 'lucide-react';
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
                            {technician.verified && (
                                <div className={styles.verifiedIcon}>
                                    <CheckCircle2 size={12} strokeWidth={3} />
                                </div>
                            )}
                        </div>
                        <div className={styles.profileMeta}>
                            <h1 className={styles.name}>
                                {technician.name} 
                                <span className={styles.levelTag}>{technician.level}</span>
                            </h1>
                            <p className={styles.speciality}>{technician.specialty}</p>
                            <span className={styles.since}>
                                <ShieldCheck size={14} color="#D4AF37" /> 
                                MONO 마스터 인증됨 · 2023.05 가입
                            </span>
                        </div>
                    </div>
                </section>

                {/* 2. Trust Score & Asset Overview */}
                <div className={styles.dashboardGrid}>
                    <GlassCard className={styles.trustCard}>
                        <div className={styles.trustHeader}>
                            <h3 className={styles.cardTitle}>Master Trust Score</h3>
                            <span className={styles.statusLive}>
                                <span className={styles.pulseDot} />
                                LIVE
                            </span>
                        </div>
                        <div className={styles.ringContainer}>
                            <svg className={styles.svgRing}>
                                <circle className={styles.ringBg} cx="80" cy="80" r="74" />
                                <circle 
                                    className={styles.ringIndicator} 
                                    cx="80" cy="80" r="74" 
                                    style={{ strokeDashoffset: 440 - (440 * scoreAnim) / 100 }}
                                />
                            </svg>
                            <div className={styles.scoreText}>
                                <span className={styles.scoreNumber}>{scoreAnim}</span>
                                <span className={styles.scoreUnit}>Mastery</span>
                            </div>
                        </div>
                        <p className={styles.trustDesc}>상위 3% 이내의 초숙련 마스터입니다.</p>
                    </GlassCard>

                    <div className={styles.statColumn}>
                        <GlassCard className={styles.statCard}>
                            <p className={styles.statLabel}>총 기술 자산 (누적 수익)</p>
                            <h2 className={styles.statValue}>₩{stats.totalEarnings}</h2>
                            <span className={styles.statTrend}>
                                <TrendingUp size={16} />
                                전월 대비 12.4% 증가
                            </span>
                        </GlassCard>
                        <div className={styles.smallGrid}>
                            <GlassCard className={styles.smallStat}>
                                <p className={styles.statLabel}>매칭 현장</p>
                                <p className={styles.smallValue}>{stats.totalSites}</p>
                            </GlassCard>
                            <GlassCard className={styles.smallStat}>
                                <p className={styles.statLabel}>마스터 평점</p>
                                <p className={styles.smallValue}>4.9</p>
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
                            { id: 'b1', name: '하이테크 플랜트 숙련', level: 'Level 5', icon: <Zap size={20} color="#D4AF37" /> },
                            { id: 'b2', name: '글로벌 안전 인증 (ISO)', level: 'Certified', icon: <ShieldCheck size={20} color="#D4AF37" /> },
                            { id: 'b3', name: '전담 마스터 리더십', level: 'Leader', icon: <Award size={20} color="#D4AF37" /> },
                        ].map(badge => (
                            <div key={badge.id} className={styles.badgeItem}>
                                <div className={styles.badgeIcon}>{badge.icon}</div>
                                <div className={styles.badgeInfo}>
                                    <p className={styles.badgeName}>{badge.name}</p>
                                    <span className={styles.badgeLevel}>{badge.level}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Growth & Missions Section */}
                <section className={styles.missionSection}>
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>MoNo 성장 미션 & 리워드</h3>
                    </div>
                    <GlassCard className={styles.missionCard}>
                        <div className={styles.missionHeader}>
                            <div className={styles.missionTitle}>
                                <TrendingUp size={24} color="#D4AF37" />
                                이 달의 청년 기술자 도약 미션
                            </div>
                            <span className={styles.missionBadge}>진행 중</span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>
                            한 달 동안 25공수 달성 시, 청년희망적금용 <strong>종잣돈 응원금 10만 원</strong>을 플랫폼에서 추가 지급합니다!
                        </p>
                        
                        <div className={styles.progressWrapper}>
                            <div className={styles.progressInfo}>
                                <span>현재 달성률: 80%</span>
                                <span>20 / 25 공수</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '80%' }}></div>
                            </div>
                        </div>

                        <div className={styles.rewardBox}>
                            <p className={styles.rewardTitle}>예상 추가 리워드 달성 시</p>
                            <p className={styles.rewardValue}>+ ₩ 100,000</p>
                        </div>
                    </GlassCard>
                </section>

                {/* Life-Care & Roadmap Section */}
                <section className={styles.missionSection}>
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>미래 성장 및 노후 준비 (Life-Care)</h3>
                    </div>
                    <div className={styles.lifeCareGrid}>
                        {/* Youth: Education & Career */}
                        <GlassCard className={styles.lifeCareCard}>
                            <div>
                                <div className={styles.lifeCareIcon}><BrainCircuit size={24} /></div>
                                <h4 className={styles.lifeCareTitle}>마스터 성장 로드맵 (청년)</h4>
                                <p className={styles.lifeCareDesc}>
                                    국비 지원(내일배움카드)을 통해 프리미엄 기술을 연계 학습하세요. 교육 이수 시 단가가 상향된 현장에 우선 배정됩니다.
                                </p>
                                <div className={styles.roadmapPath}>
                                    <span className={styles.roadmapStep}>일반 타일</span>
                                    <ChevronRight className={styles.roadmapArrow} size={16} />
                                    <span className={styles.roadmapStep} style={{ color: '#D4AF37' }}>대형 박판 타일 과정</span>
                                </div>
                            </div>
                            <div className={styles.lifeCareAction}>
                                <Button variant="secondary" style={{ width: '100%', marginTop: '1.5rem' }}>교육 과정 신청하기</Button>
                            </div>
                        </GlassCard>

                        {/* Mid/Senior: Retirement */}
                        <GlassCard className={styles.lifeCareCard}>
                            <div>
                                <div className={styles.lifeCareIcon}><CreditCard size={24} /></div>
                                <h4 className={styles.lifeCareTitle}>노후 준비 든든 플랜 (중장년)</h4>
                                <p className={styles.lifeCareDesc}>
                                    에스크로 정산액의 5%를 자동으로 퇴직연금(IRP) 또는 국민 펀드 계좌로 이체하여 일하면서 자연스럽게 노후를 대비하세요.
                                </p>
                            </div>
                            <div className={styles.lifeCareAction}>
                                <Button variant="primary" style={{ width: '100%' }}>자동 저축 연동하기</Button>
                            </div>
                        </GlassCard>
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
                        <Link href="/reports/MN-2024-KIM-01" style={{ width: '100%' }}>
                            <Button variant="ghost" size="sm" className={styles.moreBtn}>전체 보기</Button>
                        </Link>
                    </GlassCard>
                </div>
            </main>
        </div>
    );
}
