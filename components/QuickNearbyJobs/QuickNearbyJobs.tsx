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
        distance: '1.2km Near You',
        dailyWage: 260000,
        specialty: '전기',
        isUrgent: true,
    },
    {
        id: 2,
        title: '평택 삼성전자 반도체 현장 배관 설치',
        location: '경기 평택시 고덕동',
        distance: 'Direct Link Available',
        dailyWage: 320000,
        specialty: '배관',
        isUrgent: false,
    },
    {
        id: 4,
        title: '화성 데이터센터 시스템 비계 설치',
        location: '경기 화성시',
        distance: 'Near Station',
        dailyWage: 270000,
        specialty: '비계',
        isUrgent: true,
    }
];

export default function QuickNearbyJobs() {
    return (
        <section className={styles.section}>
            <div className={`container ${styles.content}`}>
                <div className={styles.header}>
                    <div className={styles.titleGroup}>
                        <h2 className={styles.title}>내 주변 <span className={styles.goldText}>맞춤형 고단가</span> 현장</h2>
                        <p className={styles.subtitle}>가장 가까운 현장과 정확한 일당 정보를 확인하고 바로 참여하세요.</p>
                    </div>
                    <Link href="/jobs" className={styles.viewAll}>
                        전체 보기 <ChevronRight size={16} />
                    </Link>
                </div>

                <div className={styles.grid}>
                    {NEARBY_JOBS.map((job) => (
                        <GlassCard key={job.id} className={styles.jobCard} hoverEffect>
                            <div className={styles.cardTop}>
                                <div className={styles.locBadge}>
                                    <MapPin size={12} />
                                    <span>{job.distance}</span>
                                </div>
                                {job.isUrgent && <span className={styles.urgent}>긴급</span>}
                            </div>
                            
                            <h3 className={styles.jobTitle}>{job.title}</h3>
                            <div className={styles.specialty}>{job.specialty} 마스터</div>

                            <div className={styles.wageRow}>
                                <div className={styles.wageLabel}>하루 일당</div>
                                <div className={styles.wageValue}>
                                    <span className={styles.currency}>₩</span>
                                    {job.dailyWage.toLocaleString()}
                                </div>
                            </div>

                            <Link href={`/jobs/${job.id}`} className={styles.joinBtn}>
                                <Zap size={16} />
                                바로 참여하기
                            </Link>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
