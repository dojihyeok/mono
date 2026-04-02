'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { 
    CreditCard, 
    TrendingDown, 
    ShieldAlert, 
    ArrowRightLeft, 
    DollarSign, 
    Umbrella, 
    FileCheck, 
    Plane,
    BarChart3,
    Clock,
    AlertCircle,
    Globe
} from 'lucide-react';

const FINANCE_DATA = {
    balanceLocal: 'AUS 12,450',
    balanceKRW: '₩ 11,205,000',
    remittanceHistory: [
        { id: 'tx1', date: '2024.03.15', amount: 'AUD 3,000', krw: '₩ 2,700,000', status: 'Completed', feeSaved: '₩ 45,000' },
        { id: 'tx2', date: '2024.02.28', amount: 'AUD 4,500', krw: '₩ 4,050,000', status: 'Completed', feeSaved: '₩ 68,000' }
    ],
    insurance: {
        provider: 'Allianz Global Care',
        plan: 'Tech-Master Premium (Overseas)',
        validUntil: '2024.12.31',
        status: 'Active'
    },
    pension: {
        country: 'Australia (Superannuation)',
        accrued: 'AUD 5,840',
        status: 'Contribution in progress'
    }
};

export default function WelfareClient() {
    return (
        <div className={styles.container}>
            {/* Welfare Hero Header */}
            <header className={styles.header}>
                <div className={styles.headerInfo}>
                    <h1>GLOBAL WELFARE HUB</h1>
                    <p>마스터의 수익과 안전, MO-NO가 끝까지 보호합니다.</p>
                </div>
                <div className={styles.premiumBadge}>MASTER CARE+</div>
            </header>

            {/* Financial Status Section */}
            <section className={styles.financeSection}>
                <div className={styles.mainBalance}>
                    <div className={styles.balanceLabel}>CURRENT ASSETS (LOCAL)</div>
                    <div className={styles.balanceValue}>
                        <strong>{FINANCE_DATA.balanceLocal}</strong>
                        <span style={{ color: '#B48A09' }}>≈ {FINANCE_DATA.balanceKRW}</span>
                    </div>
                </div>

                <div className={styles.financeGrid}>
                    <div className={styles.financeCard}>
                        <div className={styles.cardHeader}>
                            <ArrowRightLeft size={16} color="#B48A09" />
                            <span>Global Remittance</span>
                        </div>
                        <div className={styles.cardBody}>
                            <p>실시간 환율 우대 혜택 적용 중</p>
                            <div className={styles.feeBenefit} style={{ color: '#B48A09' }}>
                                <TrendingDown size={14} />
                                <span>Total Fee Saved: <strong>₩ 113,000</strong></span>
                            </div>
                        </div>
                        <button className={styles.actionBtn}>해외 송금하기</button>
                    </div>

                    <div className={styles.financeCard}>
                        <div className={styles.cardHeader}>
                            <Umbrella size={16} color="#ffd700" />
                            <span>Safety Protection</span>
                        </div>
                        <div className={styles.cardBody}>
                            <p>{FINANCE_DATA.insurance.plan}</p>
                            <div className={styles.insuranceBadge}>
                                <div className={styles.statusDot} />
                                {FINANCE_DATA.insurance.status}
                            </div>
                        </div>
                        <button className={styles.actionBtn}>보장 내용 조회</button>
                    </div>
                </div>
            </section>

            {/* Remittance History */}
            <section className={styles.historySection}>
                <div className={styles.sectionTitle}>
                    <BarChart3 size={18} />
                    <h2>REMITTANCE HISTORY</h2>
                </div>
                <div className={styles.historyTable}>
                    {FINANCE_DATA.remittanceHistory.map(tx => (
                        <div key={tx.id} className={styles.historyRow}>
                            <div className={styles.txInfo}>
                                <span className={styles.date}>{tx.date}</span>
                                <strong>{tx.amount}</strong>
                            </div>
                            <div className={styles.txStatus}>
                                <strong>{tx.krw}</strong>
                                <span className={styles.statusComplete}>{tx.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Global Pension Tracker */}
            <section className={styles.pensionSection}>
                <div className={styles.pensionContent}>
                    <Globe size={32} className={styles.globeIcon} />
                    <div className={styles.pensionDetails}>
                        <h3>{FINANCE_DATA.pension.country}</h3>
                        <p>Accumulated: <strong>{FINANCE_DATA.pension.accrued}</strong></p>
                        <span className={styles.pensionNote}>현재 거주 국가 기반 자동 추정치</span>
                    </div>
                </div>
                <div className={styles.pensionStatus}>
                    <Clock size={14} />
                    <span>Active</span>
                </div>
            </section>

            {/* Emergency Support Banner */}
            <section className={styles.emergencyBanner}>
                <AlertCircle size={20} color="#ff3b30" />
                <div className={styles.emergencyText}>
                    <h4>24/7 EMERGENCY SOS</h4>
                    <p>해외 현장 사고 및 여권 분실 시 영사관 즉시 연결</p>
                </div>
                <button className={styles.sosBtn}>SOS</button>
            </section>
        </div>
    );
}
