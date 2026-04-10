'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight, Zap, Target, Activity } from 'lucide-react';
import styles from './UrgentRecruitment.module.css';

const URGENT_JOBS = [
    {
        id: 'u1',
        title: '하이테크 플랜트 특수 배관 기술자 모집',
        location: '경기 평택 삼성전자',
        pay: '210,000',
        time: '즉시 출근',
        category: '반도체',
    },
    {
        id: 'u2',
        title: '데이터센터 인테리어 철거 기술자',
        location: '서울 서초구',
        pay: '185,000',
        time: '오전 10시 시작',
        category: '철거/인테리어',
    },
    {
        id: 'u3',
        title: '신축 아파트 인프라 장비 양중 미션',
        location: '경기 용인 기흥',
        pay: '190,000',
        time: '내일 오전 7시',
        category: '장비운용',
    }
];

export default function UrgentRecruitment() {
    const [activeIndex, setActiveIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (!carouselRef.current) return;
        const scrollOffset = carouselRef.current.scrollLeft;
        const cardWidth = carouselRef.current.children[0].clientWidth + 20; // card + gap
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
                        <Activity size={12} />
                        긴급 채용 현황
                    </div>
                    <h2 className={styles.title}>지금 바로 <span className={styles.premiumText}>지원 가능</span>한 현장</h2>
                    <p className={styles.subtitle}>검증된 마스터를 위해 엄선된 최우선 일자리입니다.</p>
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
                                        <Clock size={14} />
                                        {job.time}
                                    </div>
                                </div>

                                <h3 className={styles.jobTitle}>{job.title}</h3>

                                <div className={styles.metaRow}>
                                    <div className={styles.locationInfo}>
                                        <MapPin size={16} />
                                        {job.location}
                                    </div>
                                    <div className={styles.wageInfo}>
                                        <span className={styles.won}>일당</span>
                                        <span className={styles.wageValue}>{job.pay}</span>
                                    </div>
                                </div>

                                <Link href={`/jobs/${job.id}`} className={styles.actionBtn}>
                                    상세보기
                                    <ArrowRight size={18} />
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
                        전체 공고 보러가기
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
