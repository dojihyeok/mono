'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, MapPin, Clock, ArrowRight } from 'lucide-react';
import styles from './UrgentRecruitment.module.css';
import GlassCard from '../UI/GlassCard';

const URGENT_JOBS = [
    {
        id: 'u1',
        title: '성수동 카페거리 상가 폐기물 긴급 양중',
        location: '서울 성동구 성수동',
        pay: '180,000',
        time: '즉시 투입 (ASAP)',
        category: '일반작업'
    },
    {
        id: 'u2',
        title: '강남역 인근 병원 인테리어 철거 보조',
        location: '서울 서초구 강남역',
        pay: '170,000',
        time: '오늘 오전 10:00 까지',
        category: '철거/철해'
    }
];

export default function UrgentRecruitment() {
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
                    <div className={styles.urgentBadge}>
                        <span>🚨</span>
                        실시간 긴급 채용
                    </div>
                    <h2 className={styles.title}>내 주변 <span className={styles.premiumText}>실시간 급구</span></h2>
                    <p className={styles.subtitle}>지금 바로 출근 가능한 현장입니다.</p>
                </div>

                <div className={styles.carouselContainer}>
                    <div 
                        className={styles.carousel} 
                        ref={carouselRef}
                        onScroll={handleScroll}
                    >
                        {URGENT_JOBS.map((job: any) => (
                            <div key={job.id} className={styles.jobCard}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.categoryBadge}>{job.category}</span>
                                    <div className={styles.timeBadge}>
                                        <span>🕒</span>
                                        {job.time}
                                    </div>
                                </div>

                                <h3 className={styles.jobTitle}>{job.title}</h3>

                                <div className={styles.metaRow}>
                                    <div className={styles.locationInfo}>
                                        <span>📍</span>
                                        {job.location}
                                    </div>
                                    <div className={styles.wageInfo}>
                                        <span className={styles.won}>₩</span>
                                        <span className={styles.wageValue}>{job.pay}</span>
                                    </div>
                                </div>

                                <Link href={`/jobs/${job.id}`} className={styles.actionBtn}>
                                    <span>⚡</span>
                                    지금 바로 참여하기
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className={styles.indicators}>
                        {URGENT_JOBS.map((_: any, idx: number) => (
                            <div 
                                key={idx} 
                                className={`${styles.indicator} ${activeIndex === idx ? styles.indicatorActive : ''}`}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.footer}>
                    <Link href="/jobs" className={styles.viewMore}>
                        긴급 채용 전체 보기
                        <span>→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
