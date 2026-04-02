'use client';

import React, { useRef } from 'react';
import styles from './page.module.css';
import { 
    Download, 
    ShieldCheck, 
    Award, 
    Clock, 
    CheckCircle, 
    FileText, 
    Globe, 
    QrCode,
    Camera,
    HardHat
} from 'lucide-react';

const MASTER_DATA = {
    id: 'MN-2024-KIM-01',
    name: 'Young-Hoon Kim',
    role: 'Tier 1 Tiling Master (Finishing Specialist)',
    issueDate: '2024.04.01',
    validUntil: '2026.03.31',
    agency: 'MO-NO Global Master Agency',
    standard: 'ISO 20001:2024 Tech-Log Compliance',
    trustScore: 96,
    stats: {
        totalHours: 1452,
        projects: 142,
        safetyCompliance: '100%',
        expertRating: 4.95
    },
    skills: [
        { name: 'Waterproofing', level: 'Expert', cert: 'Verified' },
        { name: 'Large Format Tile', level: 'Master', cert: 'Verified' },
        { name: 'Safety Management', level: 'Professional', cert: 'ISO Cert' }
    ]
};

export default function ReportClient() {
    return (
        <div className={styles.container}>
            {/* Action Bar */}
            <div className={styles.actionBar}>
                <button className={styles.backBtn}>←</button>
                <div className={styles.exportGroup}>
                    <button className={styles.exportBtn}>
                        <Download size={16} />
                        Share
                    </button>
                    <button className={`${styles.exportBtn} ${styles.primary}`}>
                        <FileText size={16} />
                        PDF Export
                    </button>
                </div>
            </div>

            {/* Official Report Document */}
            <div className={styles.reportDocument}>
                {/* Document Header */}
                <header className={styles.reportHeader}>
                    <div className={styles.logoRow}>
                        <div className={styles.logo}>MO-NO</div>
                        <div className={styles.certBadge}>
                            <ShieldCheck size={14} />
                            OFFICIAL VERIFIED
                        </div>
                    </div>
                    <div className={styles.docTitle}>
                        <h1>CERTIFICATE OF MASTER SKILL & CAREER</h1>
                        <p>{MASTER_DATA.standard}</p>
                    </div>
                </header>

                <div className={styles.divider} />

                {/* Master Identity Section */}
                <section className={styles.identitySection}>
                    <div className={styles.masterPhoto}>
                        <img src="https://images.unsplash.com/photo-1548690312-e3b507d17a4d?w=200&q=80" alt="Master" />
                    </div>
                    <div className={styles.idDetails}>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>MASTER NAME</span>
                            <strong className={styles.value}>{MASTER_DATA.name}</strong>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>OCCUPATION ROLE</span>
                            <strong className={styles.value}>{MASTER_DATA.role}</strong>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>MASTER ID</span>
                            <strong className={styles.value}>{MASTER_DATA.id}</strong>
                        </div>
                    </div>
                </section>

                {/* Core Competency Matrix */}
                <section className={styles.matrixSection}>
                    <h2 className={styles.sectionTitle}>CORE COMPETENCY DATA</h2>
                    <div className={styles.statGrid}>
                        <div className={styles.statBox}>
                            <Clock size={20} color="#00f2ff" />
                            <div className={styles.statText}>
                                <strong>{MASTER_DATA.stats.totalHours}h</strong>
                                <span>Total Logs</span>
                            </div>
                        </div>
                        <div className={styles.statBox}>
                            <CheckCircle size={20} color="#00f2ff" />
                            <div className={styles.statText}>
                                <strong>{MASTER_DATA.stats.projects}</strong>
                                <span>Verified Site</span>
                            </div>
                        </div>
                        <div className={styles.statBox}>
                            <HardHat size={20} color="#00f2ff" />
                            <div className={styles.statText}>
                                <strong>{MASTER_DATA.stats.safetyCompliance}</strong>
                                <span>Safety Score</span>
                            </div>
                        </div>
                        <div className={styles.statBox}>
                            <Award size={20} color="#ffd700" />
                            <div className={styles.statText}>
                                <strong>{MASTER_DATA.trustScore}</strong>
                                <span>Trust Index</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Verified Skills Section */}
                <section className={styles.skillSection}>
                    <h2 className={styles.sectionTitle}>VERIFIED TECH ASSETS</h2>
                    <div className={styles.skillTable}>
                        {MASTER_DATA.skills.map((skill, idx) => (
                            <div key={idx} className={styles.skillRow}>
                                <div className={styles.skillName}>
                                    <strong>{skill.name}</strong>
                                    <span>{skill.cert}</span>
                                </div>
                                <div className={styles.skillLevelBadge}>{skill.level}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Verification Footer */}
                <footer className={styles.reportFooter}>
                    <div className={styles.qrArea}>
                        <div className={styles.qrMock}>
                            <QrCode size={48} color="#000" />
                        </div>
                        <p>Scan to verify real-time history<br />on <strong>mo-no.io/verify</strong></p>
                    </div>
                    <div className={styles.signatureArea}>
                        <div className={styles.stamp}>MO-NO GLOBAL</div>
                        <p>ISSUED BY MO-NO MASTER AGENCY</p>
                    </div>
                </footer>
            </div>

            {/* Support Message */}
            <div className={styles.supportAlert}>
                <Globe size={16} />
                <p>본 리포트는 <strong>호주, 캐나다, 독일 대사관</strong>에서 경력 증빙 서류로 채택 가능한 ISO 표준 기술 로그를 포함하고 있습니다.</p>
            </div>
        </div>
    );
}
