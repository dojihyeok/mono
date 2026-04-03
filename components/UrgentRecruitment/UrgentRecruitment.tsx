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
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.titleGroup}>
                        <div className={styles.urgentBadge}>
                            <Zap size={14} fill="#ef4444" color="#ef4444" />
                            <span>실시간 급구</span>
                        </div>
                        <h2 className={styles.title}>지금 바로 <span className={styles.highlight}>즉시 투입</span> 가능한 현장</h2>
                        <p className={styles.subtitle}>현장에서 마스터님을 기다리고 있습니다. 지원 즉시 확정됩니다.</p>
                    </div>
                    <Link href="/jobs?filter=urgent" className={styles.viewAll}>
                        급구 전체보기 <ArrowRight size={16} />
                    </Link>
                </div>

                <div className={styles.grid}>
                    {URGENT_JOBS.map((job) => (
                        <GlassCard key={job.id} className={styles.card} hoverEffect>
                            <div className={styles.cardHeader}>
                                <span className={styles.category}>{job.category}</span>
                                <div className={styles.timeBadge}>
                                    <Clock size={12} />
                                    <span>{job.time}</span>
                                </div>
                            </div>
                            
                            <h3 className={styles.jobTitle}>{job.title}</h3>
                            
                            <div className={styles.meta}>
                                <div className={styles.metaItem}>
                                    <MapPin size={14} />
                                    <span>{job.location}</span>
                                </div>
                                <div className={styles.payInfo}>
                                    <span className={styles.currency}>₩</span>
                                    <span className={styles.payValue}>{job.pay}</span>
                                </div>
                            </div>

                            <Link href={`/jobs/${job.id}`} className={styles.applyBtn}>
                                <Zap size={16} />
                                지금 바로 참여하기
                            </Link>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
