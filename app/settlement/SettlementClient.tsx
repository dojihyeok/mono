'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import GlassCard from '@/components/UI/GlassCard';
import Button from '@/components/UI/Button';
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts';
import { 
  ShieldCheck, 
  Lock, 
  Wallet,
  Building2,
  PiggyBank,
  Landmark,
  Activity,
  ChevronRight,
  TrendingUp,
  FileText,
  X,
  CheckCircle2
} from 'lucide-react';

interface SettlementClientProps {
    initialTransactions: any[];
}

export default function SettlementClient({ initialTransactions }: SettlementClientProps) {
    const [isTransferring, setIsTransferring] = useState(false);
    const [showWithdrawalSuccess, setShowWithdrawalSuccess] = useState(false);

    const { availableBalance, lockedEscrow, pendingSites, history, chartData } = useMemo(() => {
        const settled = initialTransactions.filter(t => t.status === 'Settled');
        const pending = initialTransactions.filter(t => t.status !== 'Settled');
        
        const available = settled.reduce((acc, t) => acc + t.amount, 0);
        const locked = pending.reduce((acc, t) => acc + t.amount, 0);

        // Generate chart data for the last 7 days/transactions
        const last7 = [...settled].reverse().slice(0, 7).map(t => ({
            name: t.date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
            amount: t.amount / 10000, // Show in 10k units for cleaner UI
            rawAmount: t.amount
        }));

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
            })),
            chartData: last7
        };
    }, [initialTransactions]);

    const handleTransfer = () => {
        setIsTransferring(true);
        setTimeout(() => {
            setIsTransferring(false);
            setShowWithdrawalSuccess(true);
        }, 2000);
    };

    return (
        <div className={styles.pageWrap}>
            <Navbar />

            <AnimatePresence>
                {showWithdrawalSuccess && (
                    <motion.div 
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowWithdrawalSuccess(false)}
                    >
                        <motion.div 
                            className={styles.successModal}
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className={styles.closeModal} onClick={() => setShowWithdrawalSuccess(false)}><X size={20} /></button>
                            <div className={styles.successIcon}>
                                <CheckCircle2 size={64} color="#3182f6" />
                            </div>
                            <h2>출금 신청 완료</h2>
                            <p>요청하신 정산금이 등록된 계좌로<br/>즉시 이체되었습니다.</p>
                            <div className={styles.withdrawalDetail}>
                                <div className={styles.detailRow}>
                                    <span>입금 계좌</span>
                                    <strong>국민은행 479202-**-***</strong>
                                </div>
                                <div className={styles.detailRow}>
                                    <span>출금 금액</span>
                                    <strong style={{ color: '#fff' }}>{availableBalance}원</strong>
                                </div>
                            </div>
                            <button className={styles.confirmBtn} onClick={() => setShowWithdrawalSuccess(false)}>확인</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <main className={styles.main}>
                <header className={styles.header}>
                    <div className={styles.brandBadge}>MONO Real-time Settlement Center</div>
                    <h1 className={styles.title}>내 수고비 지갑</h1>
                    <p className={styles.subtitle}>기술자님의 소중한 정산 데이터가 자산이 되는 공간입니다.</p>
                </header>

                <div className={styles.topSection}>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <GlassCard className={styles.walletCard}>
                            <div className={styles.walletHeader}>
                                <div className={styles.walletLabelBox}>
                                    <Wallet size={16} />
                                    <span className={styles.label}>출금 가능 금액</span>
                                </div>
                                <span className={styles.dotLive}>LIVE</span>
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
                                disabled={isTransferring || availableBalance === '0'}
                            >
                                {isTransferring ? '보안 통신 중...' : '지금 바로 내 계좌로 보내기'}
                            </Button>
                            <div className={styles.securitySeal}>
                                <ShieldCheck size={12} />
                                <span>1금융권 수준의 보안으로 보호 중</span>
                            </div>
                        </GlassCard>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <GlassCard className={styles.escrowCard}>
                            <div className={styles.escrowHeader}>
                                <div className={styles.escrowLabelBox}>
                                    <Lock size={16} color="#FF6B00" />
                                    <span className={styles.label}>에스크로 보관 (검수 중)</span>
                                </div>
                                <div className={styles.secureBadge}>안전 보관됨</div>
                            </div>
                            <h2 className={styles.lockedAmount}>{lockedEscrow}원</h2>
                            <div className={styles.safetyNetBox}>
                                <div className={styles.netItem}>
                                    <label>적립된 산재보험료</label>
                                    <span>3.4%</span>
                                </div>
                                <div className={styles.netItem}>
                                    <label>플랫폼 수수료</label>
                                    <span style={{ color: '#30d158' }}>0원 (마스터 등급 혜택)</span>
                                </div>
                            </div>
                            <div className={styles.progressTrack}>
                                <div className={styles.progressBar} style={{width: '65%'}}></div>
                                <span className={styles.progressLabel}>최종 검수 65% 진행 중</span>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>

                <section className={styles.analyticsSection}>
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>📅 최근 수익 분석 (일일 평균)</h3>
                        <div className={styles.trendBadge}>
                            <TrendingUp size={12} />
                            지난주 대비 +12%
                        </div>
                    </div>
                    <GlassCard className={styles.chartCard}>
                        <div style={{ width: '100%', height: 180 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                                        dy={10}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ 
                                            background: '#111', 
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            fontSize: '12px'
                                        }}
                                        itemStyle={{ color: '#D4AF37' }}
                                    />
                                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={index === chartData.length - 1 ? '#3182f6' : 'rgba(212, 175, 55, 0.4)'} 
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className={styles.chartLegend}>단위: 만원 (최근 7회 정산 기준)</p>
                    </GlassCard>
                </section>

                <section className={styles.financeSection}>
                    <h3 className={styles.sectionTitle}>💰 정산 이력으로 만드는 내 금융 자산</h3>
                    <div className={styles.financeGrid}>
                        <div className={styles.financeCard} onClick={() => alert('국민펀드 가입 페이지로 이동합니다.')}>
                            <div className={styles.financeIconBox}>
                                <PiggyBank size={20} color="#D4AF37" />
                            </div>
                            <h4 className={styles.financeTitle}>13월의 월급, 국민펀드 가입</h4>
                            <p className={styles.financeDesc}>매월 정산금의 일부를 모아 연말정산 소득공제 혜택을 챙기세요.</p>
                            <div className={styles.financeAction}>
                                소득공제 혜택 확인하기 <ChevronRight size={14} />
                            </div>
                        </div>

                        <div className={styles.financeCard} onClick={() => alert('모노 우대 대출 페이지로 이동합니다.')}>
                            <div className={styles.financeIconBox}>
                                <Landmark size={20} color="#D4AF37" />
                            </div>
                            <h4 className={styles.financeTitle}>내 출역일수로 모노 우대 대출</h4>
                            <p className={styles.financeDesc}>총 출역 342일의 신용으로 제1금융권 금리 우대 혜택을 받으세요.</p>
                            <div className={styles.financeAction}>
                                내 한도 조회하기 <ChevronRight size={14} />
                            </div>
                        </div>

                        <div className={styles.financeCard} onClick={() => alert('실손/상해 보험 페이지로 이동합니다.')}>
                            <div className={styles.financeIconBox}>
                                <Activity size={20} color="#D4AF37" />
                            </div>
                            <h4 className={styles.financeTitle}>안전 맞춤형 상해/실손 보험</h4>
                            <p className={styles.financeDesc}>현장 작업자를 위한 든든한 보험 지금 모인 정산금으로 가입 가능합니다.</p>
                            <div className={styles.financeAction}>
                                보험 상품 알아보기 <ChevronRight size={14} />
                            </div>
                        </div>
                    </div>
                </section>

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
