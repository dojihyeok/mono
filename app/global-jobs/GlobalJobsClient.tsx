'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { 
    Globe, 
    DollarSign, 
    ArrowRightLeft, 
    MapPin, 
    Briefcase, 
    ShieldCheck, 
    Plane, 
    Search,
    Filter,
    Star
} from 'lucide-react';

const GLOBAL_PROJECTS = [
    {
        id: 'gp1',
        title: '시드니 도심 펜트하우스 프리미엄 타일링',
        location: 'Sydney, Australia',
        countryCode: 'AUS',
        currency: 'AUD',
        dailyRate: 650,
        krwEquivalent: 585000,
        period: '3 Months',
        tags: ['비자 지원', '숙소 제공', 'Tier 1'],
        image: 'https://images.unsplash.com/photo-1502005229762-de13393962b3?w=500&q=80',
        requirement: 'Master Tiler (5yr+)',
        trustScoreMin: 85
    },
    {
        id: 'gp2',
        title: '밴쿠버 하이테크 데이터센터 냉동 공조 시스템',
        location: 'Vancouver, Canada',
        countryCode: 'CAN',
        currency: 'CAD',
        dailyRate: 580,
        krwEquivalent: 510000,
        period: '6 Months',
        tags: ['Red Seal 우대', '항공권 지원'],
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80',
        requirement: 'HVAC Specialist',
        trustScoreMin: 90
    },
    {
        id: 'gp3',
        title: '베를린 기가팩토리 특수 용접 프로젝트',
        location: 'Berlin, Germany',
        countryCode: 'GER',
        currency: 'EUR',
        dailyRate: 420,
        krwEquivalent: 610000,
        period: '1 Year',
        tags: ['블루카드 지원', '팀 단위 가능'],
        image: 'https://images.unsplash.com/photo-1504328156602-ff144ced4d47?w=500&q=80',
        requirement: 'TIG/Mig Welder',
        trustScoreMin: 88
    }
];

export default function GlobalJobsClient() {
    const [selectedCurrency, setSelectedCurrency] = useState('LOCAL'); // LOCAL or KRW

    return (
        <div className={styles.container}>
            {/* Search & Global Header */}
            <header className={styles.header}>
                <div className={styles.headerInfo}>
                    <h1>GLOBAL MATCHING</h1>
                    <p>전 세계 1등 기술을 기다리는 프리미엄 현장들</p>
                </div>
                <div className={styles.searchBar}>
                    <Search size={18} color="#666" />
                    <input type="text" placeholder="국가, 직종, 또는 키워드 검색" />
                </div>
            </header>

            {/* AI Regional Analysis (New) */}
            <section className={styles.analysisSection}>
                <div className={styles.analysisHeader}>
                    <Star size={18} color="#ffd700" fill="#ffd700" />
                    <h3>AI 지역별 가치 분석 리포트</h3>
                </div>
                <div className={styles.analysisGrid}>
                    <div className={styles.analysisCard}>
                        <span className={styles.regionName}>Oceania (Australia)</span>
                        <div className={styles.demandMeter}><div className={styles.demandLevel} style={{width: '85%'}}></div></div>
                        <p>숙련 타일러 수요 급증 | 평균 수익성 대비 1.4x</p>
                    </div>
                    <div className={styles.analysisCard}>
                        <span className={styles.regionName}>North America (Canada)</span>
                        <div className={styles.demandMeter}><div className={styles.demandLevel} style={{width: '72%'}}></div></div>
                        <p>하이테크 공조 인력 부족 | 영주권 가점 유리</p>
                    </div>
                    <div className={styles.analysisCard}>
                        <span className={styles.regionName}>Middle East (Saudi)</span>
                        <div className={styles.demandMeter}><div className={styles.demandLevel} style={{width: '95%'}}></div></div>
                        <p>네옴시티 인프라 마스터 모집 | 비과세 혜택 극대화</p>
                    </div>
                </div>
            </section>

            {/* Currency Switcher & Stats */}
            <section className={styles.utilityRow}>
                <div className={styles.currencyToggle} onClick={() => setSelectedCurrency(selectedCurrency === 'LOCAL' ? 'KRW' : 'LOCAL')}>
                    <ArrowRightLeft size={14} />
                    <span>{selectedCurrency === 'LOCAL' ? '현지 통화 기준' : '한화 환산 기준'}</span>
                </div>
                <div className={styles.activeStats}>
                    <strong>1,240명</strong>
                    <span>실시간 매칭 중</span>
                </div>
            </section>

            {/* Global Project Cards */}
            <section className={styles.projectSection}>
                {GLOBAL_PROJECTS.map(project => (
                    <div key={project.id} className={styles.projectCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.imageWrapper}>
                                <img src={project.image} alt={project.title} />
                                <div className={styles.countryBadge}>
                                    <Globe size={10} />
                                    <span>{project.countryCode}</span>
                                </div>
                            </div>
                            <div className={styles.mainInfo}>
                                <div className={styles.locationRow}>
                                    <MapPin size={12} color="#00f2ff" />
                                    <span>{project.location}</span>
                                </div>
                                <h3>{project.title}</h3>
                                <div className={styles.requirement}>
                                    <Briefcase size={12} />
                                    <span>{project.requirement}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.cardBody}>
                            <div className={styles.paySection}>
                                <div className={styles.payLabel}>ESTIMATED REVENUE (DAY)</div>
                                <div className={styles.payValue}>
                                    {selectedCurrency === 'LOCAL' ? (
                                        <>
                                            <strong>{project.currency} {project.dailyRate}</strong>
                                            <span>≈ ₩{(project.krwEquivalent / 10000).toFixed(1)}만</span>
                                        </>
                                    ) : (
                                        <>
                                            <strong>₩{(project.krwEquivalent / 10000).toFixed(1)}만</strong>
                                            <span>({project.currency} {project.dailyRate})</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className={styles.trustReq}>
                                <ShieldCheck size={14} color="#ffd700" />
                                <span>Trust Score <strong>{project.trustScoreMin}+</strong> Required</span>
                            </div>

                            <div className={styles.tagRow}>
                                {project.tags.map(tag => (
                                    <span key={tag} className={styles.tag}>{tag}</span>
                                ))}
                            </div>
                        </div>

                        <div className={styles.cardFooter}>
                            <div className={styles.period}>
                                <Plane size={14} />
                                <span>Period: {project.period}</span>
                            </div>
                            <button className={styles.applyBtn}>마스터 지원하기</button>
                        </div>
                    </div>
                ))}
            </section>

            {/* Global Nomad Support Banner */}
            <section className={styles.supportBanner}>
                <div className={styles.blurCircle} />
                <div className={styles.supportContent}>
                    <Plane size={32} className={styles.planeIcon} />
                    <div>
                        <h4>글로벌 전문가 서포트 패키지</h4>
                        <p>비자, 항공, 현지 숙소 및 의료 보험 원스톱 케어</p>
                    </div>
                </div>
                <button className={styles.moreBtn}>자세히 보기</button>
            </section>
        </div>
    );
}
