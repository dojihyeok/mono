'use client';

import { useState, useMemo } from 'react';
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    ChevronRight,
    TrendingUp,
    BarChart3,
    History,
    ShieldCheck,
    Coins,
    Lock,
    X,
    CheckCircle2,
    PieChart
} from 'lucide-react';

interface SettlementClientProps {
    initialTransactions: any[];
}

export default function SettlementClient({ initialTransactions }: SettlementClientProps) {
    const [activeTab, setActiveTab] = useState<'wallet' | 'assets'>('wallet');
    const [showWithdrawal, setShowWithdrawal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const { availableBalance, investedAmount, history } = useMemo(() => {
        const settled = initialTransactions.filter(t => t.status === 'Settled');
        const available = settled.reduce((acc, t) => acc + t.amount, 0);
        
        return {
            availableBalance: available.toLocaleString(),
            investedAmount: "1,250,000", // Dummy for funding assets
            history: settled.slice(0, 5).map(t => ({
                id: t.id.toString(),
                site: t.siteName,
                date: t.date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
                amount: t.amount.toLocaleString(),
                type: 'IN'
            }))
        };
    }, [initialTransactions]);

    const handleWithdraw = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setShowWithdrawal(false);
            alert('출금이 완료되었습니다.');
        }, 1500);
    };

    return (
        <div className={styles.pageWrap}>
            {/* Native-style Header */}
            <header className={styles.settlementHeader}>
                <div className={styles.headerTitle}>
                    <h1>자산</h1>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.iconBtn}><History size={20} /></button>
                </div>
            </header>

            {/* Asset Overview Card */}
            <section className={styles.assetOverview}>
                <div className={styles.assetCard}>
                    <div className={styles.assetMain}>
                        <div className={styles.label}>총 자산</div>
                        <div className={styles.amount}>
                            ₩ {availableBalance}
                            <span className={styles.trend}>+12.4%</span>
                        </div>
                    </div>
                    <div className={styles.assetActions}>
                        <button className={styles.actionBtnPrimary} onClick={() => setShowWithdrawal(true)}>출금하기</button>
                        <button className={styles.actionBtn}>내역보기</button>
                    </div>
                </div>

                <div className={styles.assetGrid}>
                    <div className={styles.assetItem}>
                        <div className={styles.itemHeader}>
                            <Coins size={16} color="#D4AF37" />
                            <span>모노 포인트</span>
                        </div>
                        <strong>12,450 P</strong>
                    </div>
                    <div className={styles.assetItem}>
                        <div className={styles.itemHeader}>
                            <TrendingUp size={16} color="#30d158" />
                            <span>펀딩 수익금</span>
                        </div>
                        <strong>₩ 45,200</strong>
                    </div>
                </div>
            </section>

            {/* Tab Navigation */}
            <nav className={styles.assetTabs}>
                <button 
                    className={`${styles.assetTab} ${activeTab === 'wallet' ? styles.active : ''}`}
                    onClick={() => setActiveTab('wallet')}
                >
                    입출금 내역
                </button>
                <button 
                    className={`${styles.assetTab} ${activeTab === 'assets' ? styles.active : ''}`}
                    onClick={() => setActiveTab('assets')}
                >
                    투자 자산
                </button>
            </nav>

            {/* Dynamic Content Area */}
            <main className={styles.contentArea}>
                {activeTab === 'wallet' ? (
                    <div className={styles.transactionList}>
                        <div className={styles.listHeader}>
                            <h3>최근 활동</h3>
                            <button className={styles.filterBtn}>전체 <ChevronRight size={14} /></button>
                        </div>
                        {history.length > 0 ? history.map(item => (
                            <div key={item.id} className={styles.transactionItem}>
                                <div className={styles.itemIcon}>
                                    {item.type === 'IN' ? <ArrowDownLeft size={20} color="#30d158" /> : <ArrowUpRight size={20} color="#ff3b30" />}
                                </div>
                                <div className={styles.itemInfo}>
                                    <strong>{item.site}</strong>
                                    <span>{item.date} · {item.type === 'IN' ? '입금' : '출금'}</span>
                                </div>
                                <div className={`${styles.itemAmount} ${item.type === 'IN' ? styles.in : styles.out}`}>
                                    {item.type === 'IN' ? '+' : '-'} {item.amount}
                                </div>
                            </div>
                        )) : (
                            <div className={styles.emptyState}>활동 내역이 없습니다.</div>
                        )}
                    </div>
                ) : (
                    <div className={styles.investmentView}>
                        <div className={styles.investmentCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.iconBox}><BarChart3 size={20} /></div>
                                <div>
                                    <h4>장비 펀딩 자산</h4>
                                    <p>현재 2개의 장비에 투자 중입니다.</p>
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.statRow}>
                                    <div className={styles.stat}>
                                        <span>투자 원금</span>
                                        <strong>₩ {investedAmount}</strong>
                                    </div>
                                    <div className={styles.stat}>
                                        <span>평가 손익</span>
                                        <strong className={styles.positive}>+ ₩ 45,200</strong>
                                    </div>
                                </div>
                                <button className={styles.viewDetailBtn}>투자 현황 상세 <ChevronRight size={14} /></button>
                            </div>
                        </div>
                        
                        <div className={styles.recommendSection}>
                            <h3>추천 투자 상품</h3>
                            <div className={styles.recommendCard}>
                                <div className={styles.recBadge}>HOT</div>
                                <h4>평택 P4 특수 배관 로봇 펀딩</h4>
                                <div className={styles.recMeta}>
                                    <span>목표 수익률 연 14%</span>
                                    <span>92% 달성</span>
                                </div>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: '92%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Withdrawal Modal */}
            <AnimatePresence>
                {showWithdrawal && (
                    <motion.div 
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowWithdrawal(false)}
                    >
                        <motion.div 
                            className={styles.bottomSheet}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={styles.sheetHeader}>
                                <div className={styles.handle} />
                                <h2>출금하기</h2>
                            </div>
                            <div className={styles.sheetBody}>
                                <div className={styles.withdrawInfo}>
                                    <span>출금 가능 금액</span>
                                    <strong>₩ {availableBalance}</strong>
                                </div>
                                <div className={styles.targetAccount}>
                                    <Lock size={14} />
                                    <span>등록된 계좌: 국민은행 479202-**-***</span>
                                </div>
                                <button 
                                    className={styles.confirmBtn} 
                                    onClick={handleWithdraw}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? '처리 중...' : '지금 출금 신청'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

