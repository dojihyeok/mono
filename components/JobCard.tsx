import { useState } from 'react';
import Link from 'next/link';
import styles from './JobCard.module.css';
import GlassCard from './UI/GlassCard';
import Button from './UI/Button';
import { CATEGORY_DISPLAY_MAP } from '@/constants/jobs';
import { ShieldCheck, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

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

    const handleApply = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        setApplyStatus('CHECKING');
        
        // Mock verification process
        setTimeout(() => {
            setApplyStatus('SUCCESS');
        }, 1800);
    };

    if (applyStatus === 'SUCCESS') {
        return (
            <GlassCard className={`${styles.cardOverride} ${styles.successCard}`}>
                <div className={styles.successContent}>
                    <div className={styles.successIconWrapper}>
                        <CheckCircle2 size={40} color="#22C55E" />
                    </div>
                    <h3>지원 완료!</h3>
                    <p>전문가님의 기술 자산(Passport)이<br/>현장 관리자에게 안전하게 전달되었습니다.</p>
                    <Link href="/attendance" className={styles.checkNextBtn}>
                        출근 대기 목록 확인 <ArrowRight size={14} />
                    </Link>
                </div>
            </GlassCard>
        );
    }

    return (
        <Link href={`/jobs/${job.id}`} className={styles.cardLink}>
            <GlassCard hoverEffect className={styles.cardOverride}>
                <div className={styles.header}>
                    <div className={styles.titleGroup}>
                        <div className={styles.passportVerifyBadge}>
                            <ShieldCheck size={10} />
                            PASSPORT VERIFIED
                        </div>
                        <span className={styles.categoryBadge}>{CATEGORY_DISPLAY_MAP[job.category] || job.category}</span>
                        <h3 className={styles.title}>{job.title}</h3>
                    </div>
                    <div className={styles.badges}>
                        {job.isUrgent && <span className={styles.urgentBadge}>즉시 모집</span>}
                        <div className={styles.aiMatchBadge}>
                            <span className={styles.aiMatchLabel}>AI MATCH</span>
                            <span className={styles.aiMatchValue}>{85 + (job.id % 15)}%</span>
                        </div>
                    </div>
                </div>

                <div className={styles.meta}>
                    <span>📍 {job.location}</span>
                    <span>🛠 {job.specialty}</span>
                </div>

                <p className={styles.wage}>
                    {job.dailyWage.toLocaleString()}원
                </p>

                {job.hasCarpool && (
                    <div className={styles.carpoolInfo}>
                        <div className={styles.gatheringItem}>
                            <span className={styles.carpoolIcon}>⌚</span>
                            <span><strong>06:00 집합</strong> (준수 필수)</span>
                        </div>
                        <div className={styles.gatheringItem}>
                            <span className={styles.carpoolIcon}>🚌</span>
                            <span><strong>집합지:</strong> {job.carpoolLocation}</span>
                        </div>
                    </div>
                )}

                <p className={styles.description}>{job.description}</p>

                <Button 
                    variant={job.isUrgent ? 'primary' : 'secondary'} 
                    fullWidth 
                    disabled={job.status !== 'Recruiting' || applyStatus === 'CHECKING'}
                    className={job.isUrgent ? styles.urgentBtnStyle : ''}
                    onClick={handleApply}
                >
                    {applyStatus === 'CHECKING' ? (
                        <>
                            <Loader2 size={16} className={styles.spin} />
                            기술 여권 검증 중...
                        </>
                    ) : (
                        job.isUrgent ? '즉시 지원하기' : '지원하기'
                    )}
                </Button>
            </GlassCard>
        </Link>
    );
}
