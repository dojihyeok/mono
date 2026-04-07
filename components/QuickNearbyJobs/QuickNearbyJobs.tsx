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
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleGroup}>
                        <h2 className={styles.title}>내 주변 <span className={styles.premiumText}>맞춤형 현장</span></h2>
                        <p className={styles.subtitle}>현 위치 기준 가장 가까운 고단가 현장 리스트</p>
                    </div>
                </div>

                <div className={styles.carouselContainer}>
                    <div className={styles.carousel}>
                        {NEARBY_JOBS.map((job) => (
                            <div key={job.id} className={styles.jobCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.locInfo}>
                                        <MapPin size={14} className={styles.locIcon} />
                                        <span>{job.distance}</span>
                                    </div>
                                    {job.isUrgent && <span className={styles.urgentBadge}>긴급</span>}
                                </div>
                                
                                <h3 className={styles.jobTitle}>{job.title}</h3>
                                <div className={styles.jobMeta}>
                                    <span className={styles.specialtyLabel}>{job.specialty} 전문</span>
                                    <span className={styles.locationLabel}>{job.location}</span>
                                </div>

                                <div className={styles.wageSection}>
                                    <div className={styles.wageHeader}>예상 일당 (수수료 포함)</div>
                                    <div className={styles.wageAmount}>
                                        <span className={styles.won}>₩</span>
                                        <strong>{job.dailyWage.toLocaleString()}</strong>
                                    </div>
                                </div>

                                <Link href={`/jobs/${job.id}`} className={styles.joinBtn}>
                                    <Zap size={14} fill="currentColor" />
                                    현장 참여하기
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.footer}>
                    <Link href="/jobs" className={styles.viewMore}>
                        맞춤 일자리 전체 보기 <ChevronRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
