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
        { id: 'tx1', date: '2024.03.15', amount: 'AUD 3,000', krw: '₩ 2,700,000', status: '송금 완료', feeSaved: '₩ 45,000' },
        { id: 'tx2', date: '2024.02.28', amount: 'AUD 4,500', krw: '₩ 4,050,000', status: '송금 완료', feeSaved: '₩ 68,000' }
    ],
    insurance: {
        provider: 'Allianz Global Care',
        plan: '테크-마스터 프리미엄 (해외 파견 특약)',
        validUntil: '2024.12.31',
        status: '정상 가입'
    },
    pension: {
        country: '호주 (연금 분담금 Superannuation)',
        accrued: 'AUD 5,840',
        status: '정상 적립 중'
    }
};

export default function WelfareClient() {
    return (
        <div className={styles.container}>
            {/* Welfare Hero Header */}
            <header className={styles.header}>
                <div className={styles.headerInfo}>
                    <h1>글로벌 마스터 복지 허브</h1>
                    <p>마스터의 수익과 안전, MO-NO가 끝까지 보호합니다.</p>
                </div>
                <div className={styles.premiumBadge}>마스터 케어+ (MASTER CARE+)</div>
            </header>

            {/* Financial Status Section */}
            <section className={styles.financeSection}>
                <div className={styles.mainBalance}>
                    <div className={styles.balanceLabel}>현재 보유 자산 (현지 통화)</div>
                    <div className={styles.balanceValue}>
                        <strong>{FINANCE_DATA.balanceLocal}</strong>
                        <span style={{ color: '#B48A09' }}>≈ {FINANCE_DATA.balanceKRW}</span>
                    </div>
                </div>

                <div className={styles.financeGrid}>
                    <div className={styles.financeCard}>
                        <div className={styles.cardHeader}>
                            <ArrowRightLeft size={16} color="#B48A09" />
                            <span>해외 송금 (Global Remittance)</span>
                        </div>
                        <div className={styles.cardBody}>
                            <p>실시간 환율 우대 혜택 적용 중</p>
                            <div className={styles.feeBenefit} style={{ color: '#B48A09' }}>
                                <TrendingDown size={14} />
                                <span>총 절감 수수료: <strong>₩ 113,000</strong></span>
                            </div>
                        </div>
                        <button className={styles.actionBtn}>해외 송금하기</button>
                    </div>

                    <div className={styles.financeCard}>
                        <div className={styles.cardHeader}>
                            <Umbrella size={16} color="#ffd700" />
                            <span>사회 안전망 (Safety Protection)</span>
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
                    <h2>해외 송금 내역 (HISTORY)</h2>
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
                        <p>현재까지 적립액: <strong>{FINANCE_DATA.pension.accrued}</strong></p>
                        <span className={styles.pensionNote}>현재 거주 국가 기반 자동 추정치</span>
                    </div>
                </div>
                <div className={styles.pensionStatus}>
                    <Clock size={14} />
                    <span>정상 적립 중 (Active)</span>
                </div>
            </section>

            {/* Emergency Support Banner */}
            <section className={styles.emergencyBanner}>
                <AlertCircle size={20} color="#ff3b30" />
                <div className={styles.emergencyText}>
                    <h4>24시간 긴급 구조 SOS</h4>
                    <p>해외 현장 사고 및 여권 분실 시 영사관 즉시 연결</p>
                </div>
                <button className={styles.sosBtn}>SOS</button>
            </section>
        </div>
    );
}
