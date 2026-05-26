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
    PieChart,
    CalendarDays
} from 'lucide-react';

interface Transaction {
    id: string | number;
    status: string;
    amount: number;
    siteName: string;
    date: Date;
}

interface SettlementClientProps {
    initialTransactions: Transaction[];
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
            investedAmount: "1,250,000",
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
                    <h1>내 자산</h1>
                </div>
                <div className={styles.escrowStatus}>
                    <Lock size={12} fill="currentColor" />
                    <span>전액 에스크로 보호</span>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.iconBtn}><History size={20} /></button>
                </div>
            </header>

            {/* Asset Overview Card */}
            <section className={styles.assetOverview}>
                <motion.div 
                    className={styles.assetCard}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.assetMain}>
                        <div className={styles.label}>정산 가능 잔액</div>
                        <div className={styles.amount}>
                            ₩ {availableBalance}
                            <span className={styles.trend}>1.2x 금융 혜택 적용</span>
                        </div>
                    </div>
                    <div className={styles.assetActions}>
                        <button className={styles.actionBtnPrimary} onClick={() => setShowWithdrawal(true)}>출금하기</button>
                        <button className={styles.actionBtn}>세금 계산</button>
                    </div>
                </motion.div>

                {/* Toss-style Monthly Summary Widget */}
                <motion.div 
                    className={styles.summaryWidget}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className={styles.summaryHeader}>
                        <div className={styles.summaryTitle}>
                            <CalendarDays size={16} />
                            <span>이번 달 총 예상 수입</span>
                        </div>
                        <strong>₩ 8,420,000</strong>
                    </div>
                    <div className={styles.summaryBreakdown}>
                        <div className={styles.breakdownBar}>
                            <div className={styles.breakdownFill1} style={{ width: '65%' }} />
                            <div className={styles.breakdownFill2} style={{ width: '25%' }} />
                            <div className={styles.breakdownFill3} style={{ width: '10%' }} />
                        </div>
                        <div className={styles.breakdownLegends}>
                            <span><span className={styles.dot1}/> 기본급</span>
                            <span><span className={styles.dot2}/> 연장수당</span>
                            <span><span className={styles.dot3}/> 해외 파견금</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    className={styles.assetGrid}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
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
                </motion.div>
            </section>

            {/* AI Credit Score Section (MoNo Score) */}
            <section className={styles.scoreSection}>
                <div className={styles.scoreCard}>
                    <div className={styles.scoreInfo}>
                        <div className={styles.scoreLabel}>
                            <ShieldCheck size={16} color="var(--primary)" />
                            전문가 AI 신용 스코어
                        </div>
                        <div className={styles.scoreValue}>
                            842<span> / 1000</span>
                        </div>
                        <p className={styles.scoreDesc}>상위 5.2% · 1금융권 대출 한도 우대 대상</p>
                    </div>
                    <div className={styles.scoreChart}>
                        <div className={styles.chartBar} style={{ width: '84.2%' }} />
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
                <AnimatePresence mode="wait">
                    {activeTab === 'wallet' ? (
                        <motion.div 
                            key="wallet"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={styles.transactionList}
                        >
                            <div className={styles.listHeader}>
                                <h3>최근 정산 내역</h3>
                                <button className={styles.filterBtn}>전체 <ChevronRight size={14} /></button>
                            </div>
                            {history.length > 0 ? history.map(item => (
                                <div key={item.id} className={styles.transactionItem}>
                                    <div className={styles.itemIcon}>
                                        {item.type === 'IN' ? <ArrowDownLeft size={20} color="#30d158" /> : <ArrowUpRight size={20} color="#ff3b30" />}
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <strong>{item.site}</strong>
                                        <span>{item.date} · {item.type === 'IN' ? '일당 정산' : '출금'}</span>
                                    </div>
                                    <div className={`${styles.itemAmount} ${item.type === 'IN' ? styles.in : styles.out}`}>
                                        {item.type === 'IN' ? '+' : '-'} {item.amount}
                                    </div>
                                </div>
                            )) : (
                                <div className={styles.emptyState}>활동 내역이 없습니다.</div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="assets"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={styles.investmentView}
                        >
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
                        </motion.div>
                    )}
                </AnimatePresence>
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


