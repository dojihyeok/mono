'use client';

import React from 'react';
import styles from './page.module.css';
import { 
    MapPin, 
    ShieldCheck, 
    TrendingUp, 
    Globe, 
    ArrowRight, 
    Zap, 
    ChevronRight,
    Award,
    Activity,
    CreditCard
} from 'lucide-react';

const PROJECTS_DATA = [
    {
        id: 'PR-NEOM-001',
        title: 'NEOM City: Strategic Tech Deployment',
        location: 'Tabuk, Saudi Arabia',
        matchScore: 98,
        summary: '네옴시티 옥사곤(Oxagon) 인프라 구축의 선도 기술자로 지정되었습니다. 마스터의 ISO 원장과 장비 가동 이력이 NEOM 기준을 상회합니다.',
        pills: ['High-Priority', 'Strategic Bonus', 'Master Tier 1'],
        reward: '₩ 42,500,000+',
        rewardLabel: 'Monthly Strategic Reward',
        image: 'https://images.unsplash.com/photo-1541625602330-2277a1cd1f59?w=800&q=80'
    },
    {
        id: 'PR-AUS-092',
        title: 'Green Hydrogen Plant Integration',
        location: 'Gladstone, Australia',
        matchScore: 94,
        summary: '퀸즐랜드 수소 클러스터의 핵심 정밀 통합 마스터로 매칭되었습니다. 기술 여권의 호주 Readiness(92%)가 결정적 매칭 포인트입니다.',
        pills: ['Eco-Tech', 'Migration Pathway', 'Team Lead'],
        reward: 'AUD 28,400+',
        rewardLabel: 'Monthly Base + Allowance',
        image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80'
    },
    {
        id: 'PR-GER-011',
        title: 'ICE Next-Gen Digital Railway Hub',
        location: 'Berlin, Germany',
        matchScore: 82,
        summary: '독일 차세대 고속철도 기술 혁신 프로젝트입니다. 마스터의 디지털 학습 이력과 마이스터 아카데미 수료 데이터가 정밀 매칭되었습니다.',
        pills: ['EU Blue Card', 'High-Speed Rail', 'Meister Level'],
        reward: '€ 14,800+',
        rewardLabel: 'Estimated Project Reward',
        image: 'https://images.unsplash.com/photo-1474487059220-46a5a8907e5a?w=800&q=80'
    }
];

export default function MatchingClient() {
    return (
        <div className={styles.container}>
            {/* Header Section */}
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1>AI STRATEGIC MATCHING</h1>
                    <p>당신의 자산 데이터를 가치로 치환하는 가장 완벽한 현장을 매칭합니다.</p>
                </div>
            </header>

            {/* Strategic Deployment Status */}
            <section className={styles.statusBar}>
                <div className={styles.statusInfo}>
                    <span className={styles.statusLabel}>DEPLOYMENT READINESS</span>
                    <div className={styles.statusValue}>STRATEGIC ASSETS VERIFIED</div>
                </div>
                <div className={styles.readyBadge}>
                    <ShieldCheck size={14} />
                    <span>MASTER READY ON SITE</span>
                </div>
            </section>

            {/* Active Projects Grid */}
            <section className={styles.projectsGrid}>
                {PROJECTS_DATA.map(project => (
                    <div key={project.id} className={styles.projectCard}>
                        <div className={styles.cardBanner}>
                            <img src={project.image} alt={project.title} />
                            <div className={styles.matchScore}>
                                <strong>{project.matchScore}</strong>
                                <span>MATCH</span>
                            </div>
                        </div>

                        <div className={styles.cardContent}>
                            <div className={styles.location}>
                                <Globe size={12} />
                                <span>{project.location}</span>
                            </div>

                            <div className={styles.projectTitle}>
                                <h3>{project.title}</h3>
                            </div>

                            <p className={styles.summary}>{project.summary}</p>

                            <div className={styles.pills}>
                                {project.pills.map((pill, i) => (
                                    <span key={i} className={styles.pill}>{pill}</span>
                                ))}
                            </div>

                            <div className={styles.footer}>
                                <div className={styles.reward}>
                                    <span className={styles.rewardLabel}>{project.rewardLabel}</span>
                                    <div className={styles.rewardValue}>{project.reward}</div>
                                </div>
                                <button className={styles.applyBtn}>
                                    STRATEGIC APPLY
                                    <ChevronRight size={14} style={{ marginLeft: 4 }} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
