import { useMemo } from 'react';
import Link from 'next/link';
import styles from './TechnicianCard.module.css';
import GlassCard from './UI/GlassCard';
import Button from './UI/Button';
import { Star, ShieldCheck, MapPin, User, ChevronRight } from 'lucide-react';

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
        rating?: number;
    }
}

export default function TechnicianCard({ technician }: TechnicianProps) {
    const trustScore = useMemo(() => 
        technician.trustScore || ((technician.id % 20) + 80), 
        [technician.trustScore, technician.id]
    );

    const rating = technician.rating || 4.8;

    const topSkills = ['고난도 배관', '도면 판독', '안전 관리']; // In a real app, this would come from data

    return (
        <GlassCard hoverEffect className={styles.cardOverride}>
            <Link href={`/profile/${technician.id}`} className={styles.linkWrapper}>
                <div className={styles.header}>
                    <div className={styles.avatarWrapper}>
                        <div className={styles.avatar}>
                            {technician.name[0]}
                        </div>
                        {technician.verified && (
                            <div className={styles.verifiedIcon}>
                                <ShieldCheck size={12} fill="#D4AF37" stroke="black" />
                            </div>
                        )}
                    </div>
                    <div className={styles.nameGroup}>
                        <div className={styles.nameRow}>
                            <h3 className={styles.name}>{technician.name}</h3>
                            <span className={styles.levelBadge}>{technician.level}</span>
                        </div>
                        <p className={styles.expertTitle}>{technician.specialty} 전문가 · {technician.experience}년차</p>
                    </div>
                    <div className={styles.trustGroup}>
                        <div className={styles.trustRing}>
                            <svg viewBox="0 0 36 36" className={styles.circularChart}>
                                <path className={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className={styles.circle} strokeDasharray={`${trustScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <span className={styles.scoreValue}>{trustScore}</span>
                        </div>
                        <span className={styles.scoreLabel}>신뢰점수</span>
                    </div>
                </div>

                <div className={styles.skillsRow}>
                    {topSkills.map(skill => (
                        <span key={skill} className={styles.skillTag}>#{skill}</span>
                    ))}
                </div>

                <div className={styles.details}>
                    <div className={styles.metaInfo}>
                        <MapPin size={12} />
                        <span>{technician.location}</span>
                    </div>
                    <div className={styles.ratingBox}>
                        <Star size={12} fill="#D4AF37" color="#D4AF37" />
                        <span>{rating}</span>
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.availability}>
                        <div className={`${styles.statusIndicator} ${styles[technician.status.toLowerCase()]}`}>
                            <div className={styles.pulse} />
                        </div>
                        {technician.status === 'Available' ? '매칭 대기' : '현장 작업'}
                    </div>
                    <Button variant="ghost" size="sm" className={styles.profileBtn}>
                        프로필 보기 <ChevronRight size={14} />
                    </Button>
                </div>
            </Link>
        </GlassCard>
    );
}
