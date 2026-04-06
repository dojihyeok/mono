import Link from 'next/link';
import styles from './TechnicianCard.module.css';
import GlassCard from './UI/GlassCard';
import Button from './UI/Button';

interface TechnicianProps {
    technician: {
        id: number;
        name: string;
        specialty: string;
        experience: number;
        location: string;
        level: string;
        status: string;
        verified: boolean;
        trustScore?: number;
    }
}

export default function TechnicianCard({ technician }: TechnicianProps) {
    const trustScore = technician.trustScore || Math.floor(Math.random() * 20) + 80; // Mock score if missing

    return (
        <GlassCard hoverEffect className={styles.cardOverride}>
            <Link href={`/profile/${technician.id}`} className={styles.linkWrapper}>
                <div className={styles.header}>
                    <div className={styles.avatarWrapper}>
                        <div className={styles.avatar}>
                            {technician.name[0]}
                        </div>
                        {technician.verified && <div className={styles.verifiedIcon}>★</div>}
                    </div>
                    <div className={styles.nameGroup}>
                        <h3 className={styles.name}>{technician.name}</h3>
                        <p className={styles.expertTitle}>{technician.specialty} 마스터 · 경력 {technician.experience}년</p>
                    </div>
                    <div className={styles.trustGroup}>
                        <span className={styles.scoreLabel}>신뢰도</span>
                        <span className={styles.scoreValue}>{trustScore}</span>
                    </div>
                </div>

                <div className={styles.details}>
                    <div className={styles.chip}>{technician.level}</div>
                    <div className={styles.chip}>📍 {technician.location}</div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.availability}>
                        <span className={`${styles.statusDot} ${styles[technician.status.toLowerCase()]}`}></span>
                        {technician.status === 'Available' ? '매칭 가능' : '현장 작업 중'}
                    </div>
                    <Button variant="secondary" size="sm" className={styles.profileBtn}>
                        마스터 프로필
                    </Button>
                </div>
            </Link>
        </GlassCard>
    );
}
