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
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleGroup}>
                        <div className={styles.urgentBadge}>
                            <Zap size={14} fill="#ef4444" color="#ef4444" />
                            <span>실시간 급구</span>
                        </div>
                        <h2 className={styles.title}>지금 <span className={styles.premiumText}>즉시 투입</span> 가능 현장</h2>
                        <p className={styles.subtitle}>현장에서 마스터님을 기다리고 있습니다.</p>
                    </div>
                </div>

                <div className={styles.carouselContainer}>
                    <div className={styles.carousel}>
                        {URGENT_JOBS.map((job) => (
                            <div key={job.id} className={styles.jobCard}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.categoryBadge}>{job.category}</span>
                                    <div className={styles.timeBadge}>
                                        <Clock size={12} />
                                        <span>{job.time}</span>
                                    </div>
                                </div>
                                
                                <h3 className={styles.jobTitle}>{job.title}</h3>
                                
                                <div className={styles.metaRow}>
                                    <div className={styles.locationInfo}>
                                        <MapPin size={14} />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className={styles.wageInfo}>
                                        <span className={styles.won}>₩</span>
                                        <span className={styles.wageValue}>{job.pay}</span>
                                    </div>
                                </div>

                                <Link href={`/jobs/${job.id}`} className={styles.actionBtn}>
                                    <Zap size={14} fill="currentColor" />
                                    지금 바로 참여하기
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.footer}>
                    <Link href="/jobs?filter=urgent" className={styles.viewMore}>
                        모든 급구 현장 보기 <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
