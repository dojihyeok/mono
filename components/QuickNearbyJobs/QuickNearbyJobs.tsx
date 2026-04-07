'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Zap, ChevronRight, DollarSign } from 'lucide-react';
import styles from './QuickNearbyJobs.module.css';
import GlassCard from '../UI/GlassCard';

const NEARBY_JOBS = [
    {
        id: 1,
        title: '반포 디에이치 아파트 현장 전기 결선',
        location: '서울 서초구 반포동',
        distance: '내 위치에서 1.2km',
        dailyWage: 260000,
        specialty: '전기',
        isUrgent: true,
    },
    {
        id: 2,
        title: '평택 삼성전자 반도체 현장 배관 설치',
        location: '경기 평택시 고덕동',
        distance: '인근 거점 연결',
        dailyWage: 320000,
        specialty: '배관',
        isUrgent: false,
    },
    {
        id: 4,
        title: '화성 데이터센터 시스템 비계 설치',
        location: '경기 화성시',
        distance: '지하철역 인근',
        dailyWage: 270000,
        specialty: '비계',
        isUrgent: true,
    }
];

export default function QuickNearbyJobs() {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const carouselRef = React.useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (!carouselRef.current) return;
        const scrollOffset = carouselRef.current.scrollLeft;
        const cardWidth = carouselRef.current.offsetWidth * 0.85;
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
                        <h2 className={styles.title}>내 주변 <span className={styles.premiumText}>맞춤형 현장</span></h2>
                        <p className={styles.subtitle}>현재 위치 기반 실시간 매칭된 현장들입니다.</p>
                    </div>
                </div>

                <div className={styles.carouselContainer}>
                    <div 
                        className={styles.carousel} 
                        ref={carouselRef}
                        onScroll={handleScroll}
                    >
                        {NEARBY_JOBS.map((job: any) => (
                            <div key={job.id} className={styles.jobCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.locInfo}>
                                        <span>📍</span>
                                        {job.distance}
                                    </div>
                                    <span className={styles.urgentBadge}>긴급</span>
                                </div>

                                <div className={styles.jobContent}>
                                    <h3 className={styles.jobTitle}>{job.title}</h3>
                                    <div className={styles.jobMeta}>
                                        <span className={styles.specialtyLabel}>{job.specialty} 전문</span>
                                        <span className={styles.locationLabel}>{job.location}</span>
                                    </div>
                                </div>

                                <div className={styles.wageSection}>
                                    <span className={styles.wageHeader}>예상 일당 (수수료 포함)</span>
                                    <div className={styles.wageAmount}>
                                        <span className={styles.won}>₩</span>
                                        <strong>{job.pay}</strong>
                                    </div>
                                </div>

                                <Link href={`/jobs/${job.id}`} className={styles.joinBtn}>
                                    <span>⚡</span>
                                    현장 참여하기
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className={styles.indicators}>
                        {NEARBY_JOBS.map((_: any, idx: number) => (
                            <div 
                                key={idx} 
                                className={`${styles.indicator} ${activeIndex === idx ? styles.indicatorActive : ''}`}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.footer}>
                    <Link href="/jobs" className={styles.viewMore}>
                        전체 현장 더보기
                        <ChevronRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
