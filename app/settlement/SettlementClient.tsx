'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import GlassCard from '@/components/UI/GlassCard';
import Button from '@/components/UI/Button';
import styles from './page.module.css';
import { 
  ShieldCheck, 
  Lock, 
  Wallet,
  Building2
} from 'lucide-react';

interface SettlementClientProps {
    initialTransactions: any[];
}

export default function SettlementClient({ initialTransactions }: SettlementClientProps) {
    const [isTransferring, setIsTransferring] = useState(false);

    const { availableBalance, lockedEscrow, pendingSites, history } = useMemo(() => {
        const settled = initialTransactions.filter(t => t.status === 'Settled');
        const pending = initialTransactions.filter(t => t.status !== 'Settled');
        
        const available = settled.reduce((acc, t) => acc + t.amount, 0);
        const locked = pending.reduce((acc, t) => acc + t.amount, 0);

        return {
            availableBalance: available.toLocaleString(),
            lockedEscrow: locked.toLocaleString(),
            pendingSites: pending.map(t => ({
                id: t.id.toString(),
                site: t.siteName,
                date: t.date.toLocaleDateString(),
                status: t.status,
                amount: t.amount.toLocaleString()
            })),
            history: settled.map(t => ({
                id: t.id.toString(),
                site: t.siteName,
                date: t.date.toLocaleDateString(),
                amount: t.amount.toLocaleString(),
                status: 'Settled'
            }))
        };
    }, [initialTransactions]);

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
                        <h2 className={styles.balance}>{availableBalance}원</h2>
                        <div className={styles.accountInfo}>
                            <Building2 size={14} />
                            <span className={styles.bankTag}>국민은행</span>
                            <span className={styles.accountNum}>479202-04-******</span>
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
                        <h2 className={styles.lockedAmount}>{lockedEscrow}원</h2>
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

                <section className={styles.pendingSection}>
                    <h3 className={styles.sectionTitle}>아직 일하고 있는 현장 (정산 전)</h3>
                    <div className={styles.siteList}>
                        {pendingSites.map(site => (
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

                <section className={styles.historySection}>
                    <div className={styles.sectionHeaderWithAction}>
                        <h3 className={styles.sectionTitle}>정산 완료 내역</h3>
                        <div className={styles.actionGroup}>
                            <button className={styles.exportBtn} onClick={() => alert('PDF 리포트가 생성되었습니다.')}>PDF</button>
                            <button className={styles.exportBtn} onClick={() => alert('CSV 파일이 다운로드되었습니다.')}>CSV</button>
                        </div>
                    </div>
                    <GlassCard className={styles.historyCard}>
                        <div className={styles.historyList}>
                            {history.map(item => (
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
