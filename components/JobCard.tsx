'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './JobCard.module.css';
import { CATEGORY_DISPLAY_MAP } from '@/constants/jobs';
import { 
    ShieldCheck, ArrowRight, CheckCircle2, 
    Loader2, MapPin, Wrench, Users, Zap 
} from 'lucide-react';

interface JobProps {
    job: {
        id: number;
        title: string;
        location: string;
        dailyWage: number;
        specialty: string;
        description: string;
        status: string;
        category: string;
        isUrgent: boolean;
        hasCarpool: boolean;
        carpoolLocation?: string | null;
    }
}

export default function JobCard({ job }: JobProps) {
    const [applyStatus, setApplyStatus] = useState<'IDLE' | 'CHECKING' | 'SUCCESS'>('IDLE');

    const matchScore = 85 + (job.id % 15);

    const handleApply = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setApplyStatus('CHECKING');
        setTimeout(() => setApplyStatus('SUCCESS'), 1800);
    };

    if (applyStatus === 'SUCCESS') {
        return (
            <div className={styles.successCard}>
                <div className={styles.successContent}>
                    <div className={styles.successIconWrapper}>
                        <CheckCircle2 size={44} color="#22C55E" />
                    </div>
                    <h3>지원 완료!</h3>
                    <p>전문가님의 기술 자산(Passport)이<br/>현장 관리자에게 안전하게 전달되었습니다.</p>
                    <Link href="/attendance" className={styles.checkNextBtn}>
                        출근 대기 목록 확인 <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <Link href={`/jobs/${job.id}`} className={styles.cardLink}>
            <div className={`${styles.card} ${job.isUrgent ? styles.urgentCard : ''}`}>

                {/* Top accent line for urgent */}
                {job.isUrgent && <div className={styles.urgentAccentLine} />}

                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.passportBadge}>
                            <ShieldCheck size={9} />
                            PASSPORT VERIFIED
                        </div>
                        <span className={styles.categoryBadge}>
                            {CATEGORY_DISPLAY_MAP[job.category] || job.category}
                        </span>
                    </div>
                    <div className={styles.headerRight}>
                        {job.isUrgent && (
                            <span className={styles.urgentBadge}>
                                <Zap size={10} fill="currentColor" />
                                즉시 모집
                            </span>
                        )}
                        <div className={styles.aiMatchBadge}>
                            <span className={styles.aiMatchLabel}>AI MATCH</span>
                            <span className={styles.aiMatchValue}>{matchScore}%</span>
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h3 className={styles.title}>{job.title}</h3>

                {/* Meta */}
                <div className={styles.meta}>
                    <span className={styles.metaItem}>
                        <MapPin size={13} />
                        {job.location}
                    </span>
                    <span className={styles.metaItem}>
                        <Wrench size={13} />
                        {job.specialty}
                    </span>
                </div>

                {/* Wage */}
                <div className={styles.wageRow}>
                    <div className={styles.wageBlock}>
                        <span className={styles.wageLabel}>예상 일급</span>
                        <div className={styles.wageAmount}>
                            <span className={styles.wonSign}>₩</span>
                            <strong>{job.dailyWage.toLocaleString()}</strong>
                        </div>
                    </div>
                    {job.hasCarpool && (
                        <div className={styles.carpoolBadge}>
                            <span>🚌</span>
                            합승 제공
                        </div>
                    )}
                </div>

                {/* Carpool detail */}
                {job.hasCarpool && job.carpoolLocation && (
                    <div className={styles.carpoolInfo}>
                        <span>📍</span>
                        <span>집합지: <strong>{job.carpoolLocation}</strong></span>
                    </div>
                )}

                {/* Description */}
                <p className={styles.description}>{job.description}</p>

                {/* CTA */}
                <button
                    className={`${styles.applyBtn} ${job.isUrgent ? styles.urgentApplyBtn : ''}`}
                    disabled={job.status !== 'Recruiting' || applyStatus === 'CHECKING'}
                    onClick={handleApply}
                >
                    {applyStatus === 'CHECKING' ? (
                        <>
                            <Loader2 size={16} className={styles.spin} />
                            기술 여권 검증 중...
                        </>
                    ) : (
                        <>
                            {job.isUrgent ? '즉시 지원하기' : '지원하기'}
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </div>
        </Link>
    );
}
