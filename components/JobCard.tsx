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
                    {job.isUrgent && <span className={styles.urgentBadge}>지금 당장 모집</span>}
                </div>

                <div className={styles.meta}>
                    <span>📍 {job.location}</span>
                    <span>🛠 {job.specialty}</span>
                </div>

                <p className={styles.wage}>
                    일급 {job.dailyWage.toLocaleString()}원
                </p>

                {job.hasCarpool && (
                    <div className={styles.carpoolInfo}>
                        <span className={styles.carpoolIcon}>🚌</span>
                        <span>모여서 이동해요: {job.carpoolLocation}</span>
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
