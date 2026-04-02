'use client';

import React from 'react';
import styles from './page.module.css';
import { 
    TrendingUp, 
    ShieldCheck, 
    Globe, 
    Award, 
    FileText, 
    Zap, 
    PieChart,
    ArrowUpRight,
    Lock
} from 'lucide-react';
import Link from 'next/link';

const ASSET_SUMMARY = [
    { name: 'Master Academy', status: 'Completed', level: 'Lvl. 4', icon: <Zap size={18} />, color: '#E2E8F0', href: '/academy' },
    { name: 'Global Passport', status: 'Verified', level: 'Tier 1', icon: <Globe size={18} />, color: '#B48A09', href: '/passport' },
    { name: 'ISO Report', status: 'Issued', level: 'v2024.04', icon: <FileText size={18} />, color: '#94A3B8', href: '/reports/MN-2024-KIM-01' },
    { name: 'Global Welfare', status: 'Protected', level: 'Master Care+', icon: <ShieldCheck size={18} />, color: '#E2E8F0', href: '/welfare' },
    { name: 'Team Equipment', status: 'Optimal', level: '₩ 2.09억', icon: <PieChart size={18} />, color: '#B48A09', href: '/assets/equipment' }
];

export default function AssetDashboardClient() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1>GLOBAL ASSET HUB</h1>
                    <p>당신의 기술은 전 세계가 주목하는 자산입니다.</p>
                </div>
                <div className={styles.trustScoreCard}>
                    <div className={styles.scoreInfo}>
                        <span>AI Trust Index</span>
                        <strong>96.8</strong>
                    </div>
                    <div className={styles.trendBadge}>
                        <TrendingUp size={12} />
                        +1.4%
                    </div>
                </div>
            </header>

            {/* Core Asset Progress */}
            <section className={styles.assetGrid}>
                {ASSET_SUMMARY.map((asset, idx) => (
                    <Link href={asset.href} key={idx} className={styles.assetCard}>
                        <div className={styles.assetIcon} style={{ color: asset.color, background: `${asset.color}10` }}>
                            {asset.icon}
                        </div>
                        <div className={styles.assetContent}>
                            <h3>{asset.name}</h3>
                            <div className={styles.assetStatus}>
                                <strong>{asset.status}</strong>
                                <span>{asset.level}</span>
                            </div>
                        </div>
                        <ArrowUpRight size={14} className={styles.arrow} />
                    </Link>
                ))}
            </section>

            {/* Global Readiness Analysis */}
            <section className={styles.analysisSection}>
                <div className={styles.analysisHeader}>
                    <h2>GLOBAL READINESS</h2>
                    <span>대사관 기술 이민 적합도 분석</span>
                </div>
                
                <div className={styles.readinessMatrix}>
                    <div className={styles.matrixItem}>
                        <div className={styles.matrixLabel}>AUS (Australia)</div>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: '92%', background: '#E2E8F0' }} />
                        </div>
                        <span className={styles.percentage}>92%</span>
                    </div>
                    <div className={styles.matrixItem}>
                        <div className={styles.matrixLabel}>CAN (Canada)</div>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: '85%', background: '#94A3B8' }} />
                        </div>
                        <span className={styles.percentage}>85%</span>
                    </div>
                    <div className={styles.matrixItem}>
                        <div className={styles.matrixLabel}>GER (Germany)</div>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: '64%', background: '#B48A09' }} />
                        </div>
                        <span className={styles.percentage}>64%</span>
                    </div>
                </div>

                <div className={styles.readinessCTA}>
                    <ShieldCheck size={16} />
                    <span>독일 블루카드 지원을 위해 <strong>독일어 기초 교육</strong>이 권장됩니다.</span>
                    <Link href="/academy">학습하기</Link>
                </div>
            </section>

            {/* Asset Vault (Coming Soon) */}
            <section className={styles.vaultSection}>
                <div className={styles.vaultHeader}>
                    <Lock size={16} />
                    <h3>SECURED ASSET VAULT</h3>
                </div>
                <p>블록체인 기반의 기술 경력 원장 관리가 준비 중입니다.</p>
                <div className={styles.dummyLocks}>
                    <div className={styles.lockBox} />
                    <div className={styles.lockBox} />
                    <div className={styles.lockBox} />
                </div>
            </section>
        </div>
    );
}
