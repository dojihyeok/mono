'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Zap, MapPin, Clock, ArrowRight, Target, Radar, Activity, ShieldAlert } from 'lucide-react';
import styles from './UrgentRecruitment.module.css';

const URGENT_JOBS = [
    {
        id: 'u1',
        title: '하이테크 플랜트 특수 배관 긴급 지원',
        location: '평택 고덕 삼성 P5',
        pay: '210,000',
        time: 'IMMEDIATE / ASAP',
        category: 'HIGH-TECH',
        risk: 'LOW'
    },
    {
        id: 'u2',
        title: '데이터센터 인테리어 철거 전술 지원',
        location: '서울 서초구 데이터센터',
        pay: '185,000',
        time: 'EST. 10:00 AM',
        category: 'DEMOLITION',
        risk: 'MEDIUM'
    },
    {
        id: 'u3',
        title: '반도체 인프라 장비 양중 미션',
        location: '용인 기흥구 메가팹',
        pay: '190,000',
        time: 'TOMORROW 07:00',
        category: 'EQUIPMENT',
        risk: 'LOW'
    }
];

export default function UrgentRecruitment() {
    const [activeIndex, setActiveIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (!carouselRef.current) return;
        const scrollOffset = carouselRef.current.scrollLeft;
        const cardWidth = carouselRef.current.children[0].clientWidth + 32; // card width + gap
        const newIndex = Math.round(scrollOffset / cardWidth);
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.urgentBadge}>
                        <Radar size={14} className={styles.pulseIcon} />
                        실시간 긴급 미션 브리핑
                    </div>
                    <h2 className={styles.title}>마스터 <span className={styles.premiumText}>즉시 투입</span> 필드</h2>
                    <p className={styles.subtitle}>데이터로 분석된 최우선 순위 긴급 현장입니다.</p>
                </div>

                <div className={styles.carouselContainer}>
                    <div 
                        className={styles.carousel} 
                        ref={carouselRef}
                        onScroll={handleScroll}
                    >
                        {URGENT_JOBS.map((job) => (
                            <div key={job.id} className={styles.jobCard}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.categoryBadge}>{job.category}</span>
                                    <div className={styles.timeBadge}>
                                        <Activity size={14} color="#ff4d4d" />
                                        {job.time}
                                    </div>
                                </div>

                                <h3 className={styles.jobTitle}>{job.title}</h3>

                                <div className={styles.metaRow}>
                                    <div className={styles.locationInfo}>
                                        <Target size={16} color="#B48A09" />
                                        {job.location}
                                    </div>
                                    <div className={styles.wageInfo}>
                                        <span className={styles.won}>₩</span>
                                        <span className={styles.wageValue}>{job.pay}</span>
                                    </div>
                                </div>

                                <Link href={`/jobs/${job.id}`} className={styles.actionBtn}>
                                    <Zap size={18} fill="currentColor" />
                                    미션 즉시 참여 (JOIN NOW)
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className={styles.indicators}>
                        {URGENT_JOBS.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`${styles.indicator} ${activeIndex === idx ? styles.indicatorActive : ''}`}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.footer}>
                    <Link href="/jobs" className={styles.viewMore}>
                        긴급 관제 데이터 전체 보기
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
