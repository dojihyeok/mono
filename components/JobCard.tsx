'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './JobCard.module.css';
import { CATEGORY_DISPLAY_MAP } from '@/constants/jobs';
import { 
    ShieldCheck, ArrowRight, CheckCircle2, 
    Loader2, MapPin, Wrench, Users, Zap 
} from 'lucide-react';

interface Job {
    id: string | number;
    title: string;
    location: string;
    dailyWage?: number;
    pay?: string;
    specialty: string;
    description?: string;
    status?: string;
    category: string;
    isUrgent?: boolean;
    hasCarpool?: boolean;
    carpoolLocation?: string | null;
}

interface JobProps {
    job: Job;
    onApply?: (id: string) => void;
}

export default function JobCard({ job, onApply }: JobProps) {
    const [applyStatus, setApplyStatus] = useState<'IDLE' | 'CHECKING' | 'SUCCESS'>('IDLE');

    const numId = typeof job.id === 'number' ? job.id : (job.id.charCodeAt(0) || 1);
    const matchScore = 85 + (numId % 15);

    const handleApply = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setApplyStatus('CHECKING');
        setTimeout(() => {
            setApplyStatus('SUCCESS');
            if (onApply) onApply(job.id.toString());
        }, 1500);
    };

    return (
        <Link href={`/jobs/${job.id}`} className={styles.cardLink}>
            <div className={`${styles.card} ${job.isUrgent ? styles.urgentCard : ''} ${applyStatus === 'SUCCESS' ? styles.appliedCard : ''}`}>

                {/* Top accent line for urgent */}
                {job.isUrgent && <div className={styles.urgentAccentLine} />}

                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.passportBadge}>
                            <ShieldCheck size={9} />
                            SKILL VERIFIED
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
                            <strong>
                                {job.dailyWage ? job.dailyWage.toLocaleString() : (job.pay || '180,000')}
                            </strong>
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

                {/* CTA */}
                <button
                    className={`${styles.applyBtn} ${job.isUrgent ? styles.urgentApplyBtn : ''} ${applyStatus === 'SUCCESS' ? styles.appliedBtn : ''}`}
                    disabled={job.status !== 'Recruiting' || applyStatus === 'CHECKING' || applyStatus === 'SUCCESS'}
                    onClick={handleApply}
                >
                    {applyStatus === 'CHECKING' ? (
                        <>
                            <Loader2 size={16} className={styles.spin} />
                            기술 데이터 전송 중...
                        </>
                    ) : applyStatus === 'SUCCESS' ? (
                        <>
                            <CheckCircle2 size={16} />
                            지원 완료됨
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
