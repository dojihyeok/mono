'use client';

import React from 'react';
import styles from './page.module.css';
import { 
    CreditCard, 
    ShieldCheck, 
    TrendingUp, 
    Activity, 
    ArrowUpRight, 
    Lock, 
    History,
    Zap,
    CheckCircle2,
    Clock
} from 'lucide-react';

const SETTLEMENT_DATA = {
    totalValue: '₩ 512,000,000',
    escrowBalance: '₩ 142,500,000',
    settledToDate: '₩ 85,000,000',
    remainingValue: '₩ 284,500,000',
    activeProject: 'NEOM City: Strategic Tech Deployment'
};

const MILESTONES = [
    { title: 'Preliminary Design Approval', date: '2024.03.10', status: 'Completed', reward: '₩ 15,000,000' },
    { title: 'Main Structure Welding (P1)', date: '2024.03.28', status: 'Completed', reward: '₩ 25,000,000' },
    { title: 'Phase 1 System Stress Test', date: 'Active', status: 'Active', reward: '₩ 45,000,000' },
    { title: 'Final Technical Inspection', date: 'Pending', status: 'Pending', reward: '₩ 57,500,000' }
];

const RECENT_PAYOUTS = [
    { date: '2024.03.29', project: 'Milestone 2: Welding P1', amount: '₩ 25,000,000', status: 'Settled', currency: 'SAR 68,400' },
    { date: '2024.03.11', project: 'Milestone 1: Design App.', amount: '₩ 15,000,000', status: 'Settled', currency: 'SAR 41,000' }
];

export default function StrategicSettlementClient() {
    return (
        <div className={styles.container}>
            {/* Settlement Header */}
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1>STRATEGIC SETTLEMENT</h1>
                    <p>마일스톤 기반의 투명한 에스크로 정산 시스템입니다.</p>
                </div>
            </header>

            {/* Escrow Summary Dashboard */}
            <section className={styles.escrowSummary}>
                <div className={styles.escrowLabel}>CURRENT ESCROW BALANCE</div>
                <div className={styles.escrowAmount}>{SETTLEMENT_DATA.escrowBalance}</div>
                
                <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>TOTAL CONTRACT</span>
                        <div className={styles.statValue}>{SETTLEMENT_DATA.totalValue}</div>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>SETTLED TO DATE</span>
                        <div className={styles.statValue}>{SETTLEMENT_DATA.settledToDate}</div>
                    </div>
                </div>
            </section>

            {/* Milestone Timeline */}
            <section className={styles.milestoneSection}>
                <div className={styles.sectionHeader}>
                    <h2>MILESTONE PROGRESS</h2>
                    <ShieldCheck size={16} color="#B48A09" />
                </div>
                
                <div className={styles.timeline}>
                    {MILESTONES.map((m, i) => (
                        <div key={i} className={styles.milestoneItem}>
                            <div className={styles.milestoneIcon}>
                                {m.status === 'Completed' ? <CheckCircle2 size={20} color="#4cd964" /> : <Zap size={20} />}
                            </div>
                            <div className={styles.milestoneInfo}>
                                <div className={styles.milestoneTitle}>{m.title}</div>
                                <div className={styles.milestoneDate}>{m.date}</div>
                            </div>
                            <div className={styles.milestoneStatus} data-status={m.status}>
                                {m.status === 'Completed' ? m.reward : m.status}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent Settlement History */}
            <section className={styles.paymentHistory}>
                <div className={styles.sectionHeader}>
                    <h2>RECENT SETTLEMENTS</h2>
                    <History size={16} />
                </div>
                
                {RECENT_PAYOUTS.map((p, i) => (
                    <div key={i} className={styles.paymentItem}>
                        <div className={styles.paymentInfo}>
                            <div className={styles.paymentDate}>{p.date}</div>
                            <div className={styles.paymentProject}>{p.project}</div>
                        </div>
                        <div className={styles.paymentAmount}>
                            <div className={styles.amountPrimary}>{p.amount}</div>
                            <div className={styles.amountSecondary}>{p.currency}</div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Security Notice */}
            <div className={styles.securityBanner} style={{ padding: '1.25rem', background: '#111117', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Lock size={18} color="#B48A09" />
                <p style={{ fontSize: '11px', color: 'var(--secondary)', margin: 0 }}>
                    모든 정산금은 스마트 컨트랙트에 의해 **마일스톤 달성 시 즉시 에스크로 해제**됩니다.
                </p>
            </div>
        </div>
    );
}
