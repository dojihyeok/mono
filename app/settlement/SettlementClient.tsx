'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import GlassCard from '@/components/UI/GlassCard';
import Button from '@/components/UI/Button';
import styles from './page.module.css';
import { 
  ShieldCheck, 
  Lock, 
  TrendingUp, 
  History, 
  ArrowUpRight, 
  Wallet,
  ShieldAlert,
  Info,
  CheckCircle2,
  Building2
} from 'lucide-react';

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
                    <div className={styles.brandBadge}>내 돈 관리 및 정산 센터</div>
                    <h1 className={styles.title}>내 수고비 확인하기</h1>
                    <p className={styles.subtitle}>마스터님의 소중한 땀방울이 안전하게 관리되고 있습니다.</p>
                </header>

                <div className={styles.topSection}>
                    <GlassCard className={styles.walletCard}>
                        <div className={styles.walletHeader}>
                            <div className={styles.walletLabelBox}>
                                <Wallet size={16} />
                                <span className={styles.label}>지금 바로 내 통장으로 보낼 수 있는 돈</span>
                            </div>
                            <span className={styles.dotLive}>지금 가능</span>
                        </div>
                        <h2 className={styles.balance}>{WALLET_DATA.availableBalance}원</h2>
                        <div className={styles.accountInfo}>
                            <Building2 size={14} />
                            <span className={styles.bankTag}>{WALLET_DATA.bank}</span>
                            <span className={styles.accountNum}>{WALLET_DATA.accountNumber}</span>
                        </div>
                        <Button 
                            className={styles.transferBtn} 
                            onClick={handleTransfer}
                            disabled={isTransferring}
                        >
                            {isTransferring ? '내 통장으로 안전하게 보내는 중...' : '지금 바로 내 통장으로 출금'}
                        </Button>
                        <div className={styles.securitySeal}>
                            <ShieldCheck size={12} />
                            <span>MO-NO 분리형 에스크로 계좌로 보호받고 있습니다.</span>
                        </div>
                    </GlassCard>

                    <GlassCard className={styles.escrowCard}>
                        <div className={styles.escrowHeader}>
                            <div className={styles.escrowLabelBox}>
                                <Lock size={16} color="#FF6B00" />
                                <span className={styles.label}>아직 확인 중인 돈 (보관 중)</span>
                            </div>
                            <div className={styles.secureBadge}>안전하게 보관됨</div>
                        </div>
                        <h2 className={styles.lockedAmount}>{WALLET_DATA.lockedEscrow}원</h2>
                        <div className={styles.safetyNetBox}>
                            <div className={styles.netItem}>
                                <label>산재보험 적립</label>
                                <span>3.4%</span>
                            </div>
                            <div className={styles.netItem}>
                                <label>기술 수수료</label>
                                <span>0% (면제)</span>
                            </div>
                        </div>
                        <div className={styles.progressTrack}>
                            <div className={styles.progressBar} style={{width: '65%'}}></div>
                            <span className={styles.progressLabel}>검수 진행률 65%</span>
                        </div>
                    </GlassCard>
                </div>

                {/* 2. Pending Site Details */}
                <section className={styles.pendingSection}>
                    <h3 className={styles.sectionTitle}>아직 일하고 있는 현장 (정산 전)</h3>
                    <div className={styles.siteList}>
                        {WALLET_DATA.pendingSites.map(site => (
                            <div key={site.id} className={styles.siteItem}>
                                <div className={styles.siteInfo}>
                                    <p className={styles.siteName}>{site.site}</p>
                                    <span className={styles.siteDate}>{site.date}</span>
                                </div>
                                <div className={styles.amountInfo}>
                                    <span className={styles.amount}>+{site.amount}원</span>
                                    <span className={`${styles.statusLabel} ${styles[site.status.toLowerCase()]}`}>
                                        {site.status === 'Locked' ? '일하는 중' : '검사 중'}
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
                                        <span className={styles.settledAmount}>{item.amount}원</span>
                                        <span className={styles.settledTag}>돈 받기 완료</span>
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
