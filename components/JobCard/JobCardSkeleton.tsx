'use client';

import styles from './JobCardSkeleton.module.css';
import GlassCard from '../UI/GlassCard';

export default function JobCardSkeleton() {
    return (
        <GlassCard className={styles.skeletonCard}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <div className={styles.badge} />
                    <div className={styles.title} />
                </div>
            </div>

            <div className={styles.meta}>
                <div className={styles.lineSmall} />
                <div className={styles.lineSmall} />
            </div>

            <div className={styles.wage} />

            <div className={styles.description}>
                <div className={styles.lineFull} />
                <div className={styles.lineFull} />
                <div className={styles.lineHalf} />
            </div>

            <div className={styles.button} />
        </GlassCard>
    );
}
