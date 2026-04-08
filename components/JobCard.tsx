import Link from 'next/link';
import styles from './JobCard.module.css';
import GlassCard from './UI/GlassCard';
import Button from './UI/Button';
import { CATEGORY_DISPLAY_MAP } from '@/constants/jobs';

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
    return (
        <Link href={`/jobs/${job.id}`} className={styles.cardLink}>
            <GlassCard hoverEffect className={styles.cardOverride}>
                <div className={styles.header}>
                    <div className={styles.titleGroup}>
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
                    disabled={job.status !== 'Recruiting'}
                    className={job.isUrgent ? styles.urgentBtnStyle : ''}
                >
                    {job.isUrgent ? '즉시 지원하기' : '지원하기'}
                </Button>
            </GlassCard>
        </Link>
    );
}
