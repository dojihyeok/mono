'use client';

import { motion } from 'framer-motion';
import { MapPin, Zap, Navigation } from 'lucide-react';
import styles from './JobMap.module.css';

interface Job {
    id: string | number;
    title: string;
    dailyWage: number;
    isUrgent?: boolean;
}

interface JobMapProps {
    jobs: Job[];
    onSelectJob: (id: string) => void;
}

export default function JobMap({ jobs, onSelectJob }: JobMapProps) {
    // Simulate current position and nearby job pins
    const nearbyJobs = jobs.slice(0, 5).map((job, index) => ({
        ...job,
        // Mock coordinates for visual representation
        x: 50 + Math.cos(index * 1.2) * 30,
        y: 50 + Math.sin(index * 1.2) * 30,
    }));

    return (
        <div className={styles.mapContainer}>
            <div className={styles.mapVisual}>
                {/* Radar/Grid Effect */}
                <div className={styles.gridOverlay} />
                <div className={styles.radarPulse} />
                
                {/* Center Pin (User) */}
                <motion.div 
                    className={styles.userPin}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className={styles.userDot} />
                    <Navigation size={12} fill="#3182f6" color="#3182f6" />
                </motion.div>

                {/* Job Pins */}
                {nearbyJobs.map((job) => (
                    <motion.div 
                        key={job.id}
                        className={styles.jobPin}
                        style={{ left: `${job.x}%`, top: `${job.y}%` }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.2, zIndex: 10 }}
                        onClick={() => onSelectJob(job.id.toString())}
                    >
                        <div className={styles.pinContent}>
                            <MapPin size={16} fill="#D4AF37" color="#000" />
                            <div className={styles.pinTooltip}>
                                <strong>{job.title}</strong>
                                <span>{job.dailyWage.toLocaleString()}원</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className={styles.locationControls}>
                <button className={styles.controlBtn}>
                    <Navigation size={16} />
                    내 위치 중심으로 재검색
                </button>
            </div>

            <div className={styles.nearbyList}>
                <h4 className={styles.listTitle}>가장 가까운 추천 현장 ({nearbyJobs.length})</h4>
                <div className={styles.horizontalScroll}>
                    {nearbyJobs.map(job => (
                        <div key={job.id} className={styles.miniCard} onClick={() => onSelectJob(job.id.toString())}>
                            <div className={styles.cardHeader}>
                                <span className={styles.distanceBadge}>800m</span>
                                {job.isUrgent && <Zap size={12} fill="#ef4444" color="#ef4444" />}
                            </div>
                            <h5 className={styles.cardTitle}>{job.title}</h5>
                            <p className={styles.cardWage}>₩{job.dailyWage.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
