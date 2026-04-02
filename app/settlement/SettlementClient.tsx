'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import GlassCard from '@/components/UI/GlassCard';
import Button from '@/components/UI/Button';
import styles from './page.module.css';

// Mock Settlement Data for Phase 2.2
const WALLET_DATA = {
    availableBalance: '830,000',
    lockedEscrow: '1,200,000',
    totalCumulative: '42,850,000',
    bank: '국민은행',
    accountNumber: '479202-04-******',
    pendingSites: [
        { id: 'p1', site: '청담동 고급 빌라 시공', date: '2024.03.18', status: 'Locked', amount: '450,000' },
        { id: 'p2', site: '한남 더 힐 대리석 보수', date: '2024.03.19', status: 'Verifying', amount: '750,000' }
    ],
    history: [
        { id: 'h1', site: '강남 오피스텔 리모델링', date: '2024.03.15', amount: '380,000', status: 'Settled' },
        { id: 'h2', site: '서초구 아파트 타일 시공', date: '2024.03.12', amount: '450,000', status: 'Settled' },
        { id: 'h3', site: '잠실 롯데캐슬 보수', date: '2024.03.01', amount: '220,000', status: 'Settled' }
    ]
};

export default function SettlementClient() {
    const [isTransferring, setIsTransferring] = useState(false);

    const handleTransfer = () => {
        setIsTransferring(true);
        setTimeout(() => {
            alert('요청하신 금액이 등록된 계좌로 즉시 출금되었습니다.');
            setIsTransferring(false);
        }, 1500);
    };

    return (
        <div className={styles.pageWrap}>
            <Navbar />
            
            <main className={styles.main}>
                {/* 1. Wallet Status Highlighting */}
                <header className={styles.header}>
                    <h1 className={styles.title}>기술 정산(SUPER SETTLEMENT v2)</h1>
                    <p className={styles.subtitle}>오늘까지 흘린 땀의 가치가 안전하게 보호되고 있습니다.</p>
                </header>

                <div className={styles.topSection}>
                    <GlassCard className={styles.walletCard}>
                        <div className={styles.walletHeader}>
                            <span className={styles.label}>출금 가능 수익</span>
                            <span className={styles.dotLive}>Live</span>
                        </div>
                        <h2 className={styles.balance}>₩{WALLET_DATA.availableBalance}</h2>
                        <div className={styles.accountInfo}>
                            <span className={styles.bankTag}>{WALLET_DATA.bank}</span>
                            <span className={styles.accountNum}>{WALLET_DATA.accountNumber}</span>
                        </div>
                        <Button 
                            className={styles.transferBtn} 
                            onClick={handleTransfer}
                            disabled={isTransferring}
                        >
                            {isTransferring ? '송금 중...' : '즉시 출금하기'}
                        </Button>
                        <p className={styles.footerNote}>* 일일 정산 수수료는 MO-NO가 100% 지원합니다.</p>
                    </GlassCard>

                    <GlassCard className={styles.escrowCard}>
                        <div className={styles.escrowHeader}>
                            <span className={styles.label}>에스크로 보호 중 (Locked)</span>
                            <div className={styles.secureIcon}>🔒</div>
                        </div>
                        <h2 className={styles.lockedAmount}>₩{WALLET_DATA.lockedEscrow}</h2>
                        <p className={styles.escrowDesc}>현장 작업 종료 및 검수 완료 후 즉시 활성화됩니다.</p>
                        <div className={styles.progressTrack}>
                            <div className={styles.progressBar} style={{width: '65%'}}></div>
                        </div>
                    </GlassCard>
                </div>

                {/* 2. Pending Site Details */}
                <section className={styles.pendingSection}>
                    <h3 className={styles.sectionTitle}>진행 중인 정산 (Active)</h3>
                    <div className={styles.siteList}>
                        {WALLET_DATA.pendingSites.map(site => (
                            <div key={site.id} className={styles.siteItem}>
                                <div className={styles.siteInfo}>
                                    <p className={styles.siteName}>{site.site}</p>
                                    <span className={styles.siteDate}>{site.date}</span>
                                </div>
                                <div className={styles.amountInfo}>
                                    <span className={styles.amount}>+₩{site.amount}</span>
                                    <span className={`${styles.statusLabel} ${styles[site.status.toLowerCase()]}`}>
                                        {site.status === 'Locked' ? '작업 중' : '검수 중'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Settlement History */}
                <section className={styles.historySection}>
                    <h3 className={styles.sectionTitle}>정산 완료 내역</h3>
                    <GlassCard className={styles.historyCard}>
                        <div className={styles.historyList}>
                            {WALLET_DATA.history.map(item => (
                                <div key={item.id} className={styles.historyItem}>
                                    <div className={styles.historyInfo}>
                                        <p className={styles.historyName}>{item.site}</p>
                                        <span className={styles.historyDate}>{item.date}</span>
                                    </div>
                                    <div className={styles.historyAmount}>
                                        <span className={styles.settledAmount}>₩{item.amount}</span>
                                        <span className={styles.settledTag}>Settled</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" size="sm" className={styles.fullHistory}>전체 내역 보기</Button>
                    </GlassCard>
                </section>
            </main>
        </div>
    );
}
