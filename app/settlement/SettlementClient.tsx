'use client';

import { useState, useMemo, useEffect } from 'react';
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
    CalendarDays,
    Info,
    HelpCircle
} from 'lucide-react';
import PreparingModal from '@/components/UI/PreparingModal';

interface Transaction {
    id: string;
    status: 'Pending' | 'Escrow' | 'Approved' | 'Preparing' | 'Settled' | 'Inquiry' | 'Hold';
    amount: number;
    siteName: string;
    date: string;
    hours: number;
    basePay: number;
    extraPay: number;
    deduction: number;
    expectedDate: string;
    companyConfirmed: boolean;
}

const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 'tx-1',
        siteName: '청담동 고급 빌라 신축 현장',
        status: 'Settled',
        amount: 195000,
        date: '6월 17일',
        hours: 8,
        basePay: 180000,
        extraPay: 150000, // 연장수당 등
        deduction: 135000, // 소득세 공제 등
        expectedDate: '6월 17일 (지급 완료)',
        companyConfirmed: true
    },
    {
        id: 'tx-2',
        siteName: '평택 삼성반도체 P4 현장',
        status: 'Escrow',
        amount: 240000,
        date: '6월 15일',
        hours: 9,
        basePay: 220000,
        extraPay: 30000,
        deduction: 10000,
        expectedDate: '6월 25일 예정',
        companyConfirmed: true
    },
    {
        id: 'tx-3',
        siteName: '용인 반도체 클러스터 플랜트',
        status: 'Approved',
        amount: 210000,
        date: '6월 12일',
        hours: 8,
        basePay: 210000,
        extraPay: 0,
        deduction: 0,
        expectedDate: '6월 25일 예정',
        companyConfirmed: true
    },
    {
        id: 'tx-4',
        siteName: '성수 테크니컬 허브 리노베이션',
        status: 'Pending',
        amount: 180000,
        date: '6월 10일',
        hours: 8,
        basePay: 180000,
        extraPay: 0,
        deduction: 0,
        expectedDate: '검수 완료 후 결정',
        companyConfirmed: false
    },
    {
        id: 'tx-5',
        siteName: '판교 벤처타워 전기 개보수',
        status: 'Hold',
        amount: 165000,
        date: '6월 08일',
        hours: 8,
        basePay: 165000,
        extraPay: 0,
        deduction: 0,
        expectedDate: '지급 보류',
        companyConfirmed: false
    }
];

export default function SettlementClient() {
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
    const [showWithdrawal, setShowWithdrawal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // PreparingModal state
    const [isPreparingModalOpen, setIsPreparingModalOpen] = useState(false);
    const [preparingFeatureName, setPreparingFeatureName] = useState('');
    const [preparingTitle, setPreparingTitle] = useState('');
    const [preparingDesc, setPreparingDesc] = useState('');

    // Load dynamic demo state (specifically if paid stage is completed)
    useEffect(() => {
        const demoStage = localStorage.getItem('mono_demo_stage') || 'IDLE';
        if (demoStage === 'PAID') {
            // Update the first transaction status to settled if demo stage is PAID
            setTransactions(prev => {
                const updated = [...prev];
                if (updated[0].status !== 'Settled') {
                    updated[0].status = 'Settled';
                }
                return updated;
            });
        }
    }, []);

    // Summary calculations
    const summary = useMemo(() => {
        let expected = 0; // 받을 예정 금액
        let completed = 0; // 지급 완료 금액
        let checking = 0; // 안전하게 확인 중 (Escrow + Pending)
        let hold = 0; // 확인이 필요해요 (Hold + Inquiry)

        transactions.forEach(t => {
            if (t.status === 'Settled') {
                completed += t.amount;
            } else if (t.status === 'Hold' || t.status === 'Inquiry') {
                hold += t.amount;
            } else if (t.status === 'Escrow' || t.status === 'Pending') {
                checking += t.amount;
                expected += t.amount;
            } else {
                expected += t.amount;
            }
        });

        return {
            expected: expected.toLocaleString(),
            completed: completed.toLocaleString(),
            checking: checking.toLocaleString(),
            hold: hold.toLocaleString()
        };
    }, [transactions]);

    const handleWithdraw = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setShowWithdrawal(false);
            alert('출금이 완료되었습니다. 등록하신 계좌로 입금되었습니다.');
        }, 1500);
    };

    const getStatusLabel = (status: Transaction['status']) => {
        switch (status) {
            case 'Pending': return { text: '회사 확인 중', color: '#ff9f0a', bg: 'rgba(255,159,10,0.1)' };
            case 'Escrow': return { text: '안전하게 확인 중', color: '#3182f6', bg: 'rgba(49,130,246,0.1)' };
            case 'Approved': return { text: '받을 금액 확정', color: '#30d158', bg: 'rgba(48,209,88,0.1)' };
            case 'Preparing': return { text: '지급 준비 중', color: '#5856d6', bg: 'rgba(88,86,214,0.1)' };
            case 'Settled': return { text: '지급 완료', color: '#1c1c1e', bg: '#f2f2f7' };
            case 'Inquiry': return { text: '금액 문의 중', color: '#ff6b00', bg: 'rgba(255,107,0,0.1)' };
            case 'Hold': return { text: '확인이 필요해요', color: '#ff453a', bg: 'rgba(255,69,58,0.1)' };
        }
    };

    const handleTriggerPreparing = (feature: string, e: React.MouseEvent) => {
        e.preventDefault();
        setPreparingFeatureName(feature);
        if (feature === '투자 자산' || feature === '장비 펀딩') {
            setPreparingTitle('공식 장비 펀딩 및 STO 투자를 준비하고 있어요');
            setPreparingDesc('금융 당국의 규제 샌드박스 승인 및 투자 계약 증권 인프라 연동 협의가 진행 중인 단계입니다.');
        } else if (feature === 'AI 신용 스코어') {
            setPreparingTitle('AI 대안 신용평가 공식 연동을 준비하고 있어요');
            setPreparingDesc('신용평가사와의 보안 제휴 및 1금융권 금리 우대 시스템 연결을 준비 중입니다.');
        } else if (feature === '세금 계산') {
            setPreparingTitle('원스톱 세금 계산 및 환급 기능을 준비하고 있어요');
            setPreparingDesc('국세청 홈택스 자동 연동 및 종합소득세 환급 대행 서비스 연결을 검토하고 있습니다.');
        }
        setIsPreparingModalOpen(true);
    };

    const handleInquiry = (txName: string) => {
        alert(`'${txName}' 현장 정산건에 대한 정산 대조 문의가 접수되었습니다. 담당 검수관이 10분 내에 전화를 드립니다.`);
        if (selectedTx) {
            setTransactions(prev => prev.map(t => t.id === selectedTx.id ? { ...t, status: 'Inquiry' } : t));
            setSelectedTx(null);
        }
    };

    return (
        <div className={styles.pageWrap}>
            {/* Native-style Header */}
            <header className={styles.settlementHeader}>
                <div className={styles.headerTitle}>
                    <h1>받을 돈</h1>
                </div>
                <div className={styles.escrowStatus} style={{ color: '#3182f6', background: 'rgba(49, 130, 246, 0.1)' }}>
                    <Lock size={12} fill="currentColor" />
                    <span>안전 에스크로 보호 중</span>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.iconBtn}><History size={20} /></button>
                </div>
            </header>

            {/* Payout Summary Widget (Toss-Style) */}
            <section className={styles.assetOverview}>
                <motion.div 
                    className={styles.assetCard}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.assetMain}>
                        <div className={styles.label}>지급 완료 금액 (출금 가능)</div>
                        <div className={styles.amount}>
                            ₩ {summary.completed}
                            <span className={styles.trend} style={{ color: '#30d158' }}>당일 즉시 출금 지원</span>
                        </div>
                    </div>
                    <div className={styles.assetActions}>
                        <button className={styles.actionBtnPrimary} onClick={() => setShowWithdrawal(true)} style={{ background: '#3182f6', color: '#fff' }}>출금하기</button>
                        <button className={styles.actionBtn} onClick={(e) => handleTriggerPreparing('세금 계산', e)}>세금 계산</button>
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
                            <span>이번 달 총 받을 예정 금액</span>
                        </div>
                        <strong>₩ {summary.expected}</strong>
                    </div>
                    <div className={styles.summaryBreakdown}>
                        <div className={styles.breakdownBar}>
                            <div className={styles.breakdownFill1} style={{ width: '65%', background: '#3182f6' }} />
                            <div className={styles.breakdownFill2} style={{ width: '25%', background: '#30d158' }} />
                            <div className={styles.breakdownFill3} style={{ width: '10%', background: '#ff9f0a' }} />
                        </div>
                        <div className={styles.breakdownLegends}>
                            <span><span className={styles.dot1} style={{ background: '#3182f6' }}/> 기본급</span>
                            <span><span className={styles.dot2} style={{ background: '#30d158' }}/> 추가수당</span>
                            <span><span className={styles.dot3} style={{ background: '#ff9f0a' }}/> 대기 중</span>
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
                            <Coins size={16} color="#3182f6" />
                            <span>확인 중인 금액</span>
                        </div>
                        <strong>₩ {summary.checking}</strong>
                    </div>
                    <div className={styles.assetItem} onClick={(e) => handleTriggerPreparing('장비 펀딩', e)} style={{ cursor: 'pointer' }}>
                        <div className={styles.itemHeader}>
                            <TrendingUp size={16} color="#ff3b30" />
                            <span>펀딩 투자 자산 ℹ️</span>
                        </div>
                        <strong>₩ 1,250,000</strong>
                    </div>
                </motion.div>
            </section>

            {/* AI Credit Score Section -> 준비중으로 안내 */}
            <section className={styles.scoreSection} onClick={(e) => handleTriggerPreparing('AI 신용 스코어', e)} style={{ cursor: 'pointer' }}>
                <div className={styles.scoreCard}>
                    <div className={styles.scoreInfo}>
                        <div className={styles.scoreLabel}>
                            <ShieldCheck size={16} color="#ff9f0a" />
                            내 기술 신뢰도 (대안 신용평가 공식 준비중)
                        </div>
                        <div className={styles.scoreValue}>
                            842<span> / 1000</span>
                        </div>
                        <p className={styles.scoreDesc}>상위 5.2% · 금융권 연동 준비 중</p>
                    </div>
                    <div className={styles.scoreChart}>
                        <div className={styles.chartBar} style={{ width: '84.2%', background: '#ff9f0a' }} />
                    </div>
                </div>
            </section>

            {/* Tab Navigation (Simple Simulator Tab) */}
            <nav className={styles.assetTabs}>
                <button className={`${styles.assetTab} ${styles.active}`}>
                    지급 및 받을 예정 내역
                </button>
                <button className={styles.assetTab} onClick={(e) => handleTriggerPreparing('투자 자산', e)}>
                    투자 자산 (준비중)
                </button>
            </nav>

            {/* Dynamic Content Area */}
            <main className={styles.contentArea}>
                <div className={styles.transactionList}>
                    <div className={styles.listHeader}>
                        <h3>정산 명세서</h3>
                    </div>
                    {transactions.map(item => {
                        const labelInfo = getStatusLabel(item.status);
                        return (
                            <div 
                                key={item.id} 
                                className={styles.transactionItem}
                                onClick={() => setSelectedTx(item)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className={styles.itemIcon}>
                                    {item.status === 'Settled' ? <ArrowDownLeft size={20} color="#30d158" /> : <ArrowUpRight size={20} color="#ff9f0a" />}
                                </div>
                                <div className={styles.itemInfo}>
                                    <strong>{item.siteName}</strong>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {item.date} · {item.hours}시간 근무
                                        <span 
                                            style={{ 
                                                fontSize: '0.65rem', 
                                                fontWeight: 'bold', 
                                                padding: '2px 6px', 
                                                borderRadius: '4px',
                                                color: labelInfo?.color, 
                                                background: labelInfo?.bg 
                                            }}
                                        >
                                            {labelInfo?.text}
                                        </span>
                                    </span>
                                </div>
                                <div className={`${styles.itemAmount} ${item.status === 'Settled' ? styles.in : styles.out}`}>
                                    ₩ {item.amount.toLocaleString()}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* Transaction Detail Overlay (상세 화면) */}
            <AnimatePresence>
                {selectedTx && (
                    <div className={styles.modalOverlay} onClick={() => setSelectedTx(null)}>
                        <motion.div 
                            className={styles.bottomSheet}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            onClick={e => e.stopPropagation()}
                            style={{ background: '#fff', borderRadius: '24px 24px 0 0', padding: '24px', position: 'fixed', bottom: 0, width: '100%', maxWidth: '480px', boxSizing: 'border-box', zIndex: 1000 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0 }}>상세 정산 계산서</h3>
                                <button onClick={() => setSelectedTx(null)} style={{ background: 'none', border: 'none', color: '#8e8e93', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            
                            <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '16px', marginBottom: '20px' }}>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#1c1c1e' }}>{selectedTx.siteName}</h4>
                                <span style={{ fontSize: '0.8rem', color: '#8e8e93' }}>작업일: {selectedTx.date} ({selectedTx.hours}시간)</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ color: '#8e8e93' }}>기본 일당</span>
                                    <span style={{ fontWeight: '600' }}>₩ {selectedTx.basePay.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ color: '#8e8e93' }}>추가 수당 (연장 등)</span>
                                    <span style={{ fontWeight: '600', color: '#30d158' }}>+ ₩ {selectedTx.extraPay.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ color: '#8e8e93' }}>공제 금액 (세금/3.3%)</span>
                                    <span style={{ fontWeight: '600', color: '#ff453a' }}>- ₩ {selectedTx.deduction.toLocaleString()}</span>
                                </div>
                                <div style={{ height: '1px', background: '#e5e5ea', margin: '8px 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '900' }}>
                                    <span>최종 받을 금액</span>
                                    <span style={{ color: '#3182f6' }}>₩ {selectedTx.amount.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '4px' }}>
                                    <span style={{ color: '#8e8e93' }}>지급 예정일</span>
                                    <span style={{ fontWeight: '600' }}>{selectedTx.expectedDate}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ color: '#8e8e93' }}>회사 확인 여부</span>
                                    <span style={{ fontWeight: '600', color: selectedTx.companyConfirmed ? '#30d158' : '#ff9f0a' }}>
                                        {selectedTx.companyConfirmed ? '✓ 확인 완료' : '대기 중'}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button 
                                    onClick={() => handleInquiry(selectedTx.siteName)}
                                    style={{ flex: 1, padding: '14px', background: '#f2f2f7', border: 'none', borderRadius: '16px', fontSize: '0.95rem', fontWeight: '800', cursor: 'pointer', color: '#ff6b00' }}
                                >
                                    금액 문의하기
                                </button>
                                <button 
                                    onClick={() => setSelectedTx(null)}
                                    style={{ flex: 1, padding: '14px', background: '#3182f6', border: 'none', borderRadius: '16px', fontSize: '0.95rem', fontWeight: '800', cursor: 'pointer', color: '#fff' }}
                                >
                                    확인
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Withdrawal Modal */}
            <AnimatePresence>
                {showWithdrawal && (
                    <div className={styles.modalOverlay} onClick={() => setShowWithdrawal(false)}>
                        <motion.div 
                            className={styles.bottomSheet}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            onClick={e => e.stopPropagation()}
                            style={{ background: '#fff', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', width: '100%', maxWidth: '480px', margin: '0 auto', position: 'fixed', bottom: 0, padding: '24px', paddingBottom: '40px', boxSizing: 'border-box', zIndex: 1000 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0 }}>출금하기</h2>
                                <button onClick={() => setShowWithdrawal(false)} style={{ background: 'none', border: 'none', color: '#8e8e93', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            <div className={styles.sheetBody}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: '#f8f9fa', padding: '16px', borderRadius: '16px' }}>
                                    <span style={{ fontSize: '0.9rem', color: '#8e8e93' }}>출금 가능 금액</span>
                                    <strong style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1c1c1e' }}>₩ {summary.completed}</strong>
                                </div>
                                <div style={{ display: 'flex', itemsCenter: 'center', gap: '6px', fontSize: '0.8rem', color: '#8e8e93', marginBottom: '24px' }}>
                                    <Lock size={14} />
                                    <span>등록된 계좌: 국민은행 479202-**-*** (예금주: Aaron)</span>
                                </div>
                                <button 
                                    onClick={handleWithdraw}
                                    disabled={isProcessing}
                                    style={{ width: '100%', padding: '16px', background: '#3182f6', border: 'none', borderRadius: '18px', fontSize: '1rem', fontWeight: '900', color: '#fff', cursor: 'pointer' }}
                                >
                                    {isProcessing ? '처리 중...' : '지금 출금 신청'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Preparing Modal */}
            <PreparingModal 
                isOpen={isPreparingModalOpen}
                onClose={() => setIsPreparingModalOpen(false)}
                title={preparingTitle}
                description={preparingDesc}
                featureName={preparingFeatureName}
            />
        </div>
    );
}
