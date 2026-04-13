'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { MapPin, Navigation, LocateFixed, ArrowRight } from 'lucide-react';
import styles from './QuickNearbyJobs.module.css';

const NEARBY_JOBS = [
    {
        id: 1,
        title: '반포 디에이치 아파트 현장 전기 기술자',
        location: '서울 서초구 반포동',
        distance: '현 위치에서 1.2km',
        dailyWage: '260,000',
        specialty: '전기',
        isUrgent: true,
    },
    {
        id: 2,
        title: '평택 삼성전자 반도체 현장 배관 설치',
        location: '경기 평택시 고덕동',
        distance: '인근 거점 매칭',
        dailyWage: '320,000',
        specialty: '배관',
        isUrgent: false,
    },
    {
        id: 3,
        title: '화성 데이터센터 시스템 비계 원정팀',
        location: '경기 화성시',
        distance: '지하철역 근처',
        dailyWage: '270,000',
        specialty: '비계',
        isUrgent: true,
    }
];

export default function QuickNearbyJobs() {
    const [activeIndex, setActiveIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (!carouselRef.current) return;
        const scrollOffset = carouselRef.current.scrollLeft;
        const cardWidth = carouselRef.current.children[0].clientWidth + 16; // card + gap
        const newIndex = Math.round(scrollOffset / cardWidth);
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleGroup}>
                        <h2 className={styles.title}>내 주변 <span className={styles.premiumText}>맞춤 추천</span> 일자리</h2>
                        <p className={styles.subtitle}>현 위치를 기반으로 전문가님께 최적화된 현장입니다.</p>
                    </div>
                </div>

                <div className={styles.carouselContainer}>
                    <div 
                        className={styles.carousel} 
                        ref={carouselRef}
                        onScroll={handleScroll}
                    >
                        {NEARBY_JOBS.map((job) => (
                            <div key={job.id} className={styles.jobCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.locInfo}>
                                        <LocateFixed size={14} />
                                        {job.distance}
                                    </div>
                                    {job.isUrgent && <span className={styles.urgentBadge}>긴급</span>}
                                </div>

                                <div className={styles.jobContent}>
                                    <h3 className={styles.jobTitle}>{job.title}</h3>
                                    <div className={styles.jobMeta}>
                                        <span className={styles.specialtyLabel}>{job.specialty} 전문</span>
                                        <span className={styles.locationLabel}>
                                            <Navigation size={10} style={{marginRight: '6px'}} />
                                            {job.location}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.wageSection}>
                                    <span className={styles.wageHeader}>예상 일당</span>
                                    <div className={styles.wageAmount}>
                                        <span className={styles.won}>₩</span>
                                        <strong>{job.dailyWage}</strong>
                                    </div>
                                </div>

                                <Link href={`/jobs/${job.id}`} className={styles.joinBtn}>
                                    상세보기
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className={styles.indicators}>
                        {NEARBY_JOBS.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`${styles.indicator} ${activeIndex === idx ? styles.indicatorActive : ''}`}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.footer}>
                    <Link href="/jobs" className={styles.viewMore}>
                        내 주변 대기 중인 일자리 더보기
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
