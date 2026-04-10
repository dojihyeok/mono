'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { 
    MapPin, 
    ShieldCheck, 
    Globe, 
    Zap, 
    ChevronRight,
    Activity,
    BarChart3,
    Compass
} from 'lucide-react';

const PROJECTS_DATA = [
    {
        id: 'PR-NEOM-001',
        title: '사우디 NEOM City: 하이테크 인프라 구축',
        location: 'Tabuk, Saudi Arabia',
        matchScore: 98,
        summary: '네옴시티 옥사곤(Oxagon) 지구의 선도 기술자로 지정되었습니다. 마스터님의 전문 공정 이력과 보유 장비 숙련도가 NEOM 기준을 완벽하게 충족합니다.',
        pills: ['고수익 보장', '비자 지원', '숙소 제공'],
        reward: '₩ 42,500,000+',
        rewardLabel: '월 평균 예상 수익 (추정)',
        image: 'https://images.unsplash.com/photo-1541625602330-2277a1cd1f59?w=800&q=80'
    },
    {
        id: 'PR-AUS-092',
        title: '호주 그린 수소 플랜트 설비 통합',
        location: 'Gladstone, Australia',
        matchScore: 94,
        summary: '퀸즐랜드 수소 클러스터의 핵심 정밀 통합 마스터로 매칭되었습니다. 기술 여권의 호주 진출 준비도(92%)가 결정적인 매칭 포인트입니다.',
        pills: ['영주권 패스웨이', '해외 수당'],
        reward: 'AUD 28,400+',
        rewardLabel: '월 기초 급여 + 현지 수당',
        image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80'
    },
    {
        id: 'PR-GER-011',
        title: '독일 차세대 고속철도 허브 리노베이션',
        location: 'Berlin, Germany',
        matchScore: 82,
        summary: '독일 ICE 차세대 고속철도 기술 혁신 프로젝트입니다. 마스터님의 디지털 학습 이력과 아카데미 수료 데이터가 정밀하게 매칭되었습니다.',
        pills: ['EU 블루카드', '기술 연수'],
        reward: '€ 14,800+',
        rewardLabel: '프로젝트 예상 월 수익',
        image: 'https://images.unsplash.com/photo-1474487059220-46a5a8907e5a?w=800&q=80'
    }
];

export default function MatchingClient() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className={styles.container}>
            {/* Header Section */}
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1>프리미엄 커리어 매칭</h1>
                    <p>검증된 경력 데이터로 마스터님의 가치를 증명할 수 있는 글로벌 프로젝트를 연결합니다.</p>
                </div>
            </header>

            {/* Global Readiness Status */}
            <section className={styles.statusBar}>
                <div className={styles.statusInfo}>
                    <span className={styles.statusLabel}>글로벌 진출 준비도 (READINESS)</span>
                    <div className={styles.statusValue}>
                        <Activity size={24} color="#B48A09" style={{display: 'inline', marginRight: '16px'}} />
                        전문 역량 인증 완료 / 100%
                    </div>
                </div>
                <div className={styles.readyBadge}>
                    <ShieldCheck size={20} style={{marginRight: '8px'}} />
                    <span>진출 가능</span>
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
                                <span>적합도</span>
                            </div>
                        </div>

                        <div className={styles.cardContent}>
                            <div className={styles.location}>
                                <Compass size={16} color="#B48A09" />
                                <span>{project.location}</span>
                            </div>

                            <div className={styles.projectTitle}>
                                <h3>{project.title}</h3>
                            </div>

                            <p className={styles.summary}>{project.summary}</p>

                            <div className={styles.pills}>
                                {project.pills.map((pill, i) => (
                                    <span key={i} className={styles.pill}>
                                        <Zap size={14} color="#B48A09" style={{marginRight: '6px'}} />
                                        {pill}
                                    </span>
                                ))}
                            </div>

                            <div className={styles.footer}>
                                <div className={styles.reward}>
                                    <span className={styles.rewardLabel}>
                                        <BarChart3 size={14} style={{marginRight: '8px'}} />
                                        {project.rewardLabel}
                                    </span>
                                    <div className={styles.rewardValue}>{project.reward}</div>
                                </div>
                                <button className={styles.applyBtn}>
                                    프로젝트 지원하기
                                    <ChevronRight size={20} style={{ marginLeft: 8 }} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
