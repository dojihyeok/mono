'use client';

import { useState, useMemo } from 'react';
import { useDemo, OfflineRecord } from '@/context/DemoContext';
import { useUI } from '@/context/UIContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Wallet, 
    Lock, 
    ArrowUpRight, 
    ArrowDownLeft, 
    ChevronRight, 
    X, 
    CheckCircle2, 
    Coins, 
    FileText, 
    ShieldAlert, 
    Share2, 
    QrCode, 
    AlertCircle, 
    PlusCircle,
    Info,
    Calendar,
    ArrowRight
} from 'lucide-react';
import styles from './page.module.css';

interface Transaction {
    id: string;
    siteName: string;
    date: string;
    hours: number;
    amount: number;
    basePay: number;
    extraPay: number;
    deduction: number;
    expectedDate: string;
    status: '회사 확인 중' | '받을 금액 확정' | '지급 준비 중' | '지급 완료' | '금액 문의 중' | '확인이 필요해요';
}

const DEFAULT_TRANSACTIONS: Transaction[] = [
    {
        id: 'tx-1',
        siteName: '서초 반포 써밋팰리스 복합 신축현장',
        date: '6월 17일',
        hours: 8,
        amount: 227245,
        basePay: 235000,
        extraPay: 0,
        deduction: 7755, // 3.3% tax
        expectedDate: '당일 즉시 지급 완료',
        status: '지급 완료'
    },
    {
        id: 'tx-2',
        siteName: '청담 파크자이 신축 현장 목공작업',
        date: '6월 15일',
        hours: 9,
        amount: 247650,
        basePay: 240000,
        extraPay: 16000,
        deduction: 8350,
        expectedDate: '6월 16일 오전 10시',
        status: '지급 완료'
    },
    {
        id: 'tx-3',
        siteName: '여의도 파크원 타워 3차 형틀작업',
        date: '6월 12일',
        hours: 8,
        amount: 246585,
        basePay: 255000,
        extraPay: 0,
        deduction: 8415,
        expectedDate: '6월 13일 오전 12시',
        status: '지급 완료'
    }
];

export default function WalletClient() {
    const { state, requestAmountInquiry } = useDemo();
    const { addToast } = useUI();
    const router = useRouter();

    const [cardFlipped, setCardFlipped] = useState(false);
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
    const [showOfficialModal, setShowOfficialModal] = useState(false);
    const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);
    const [withdrawalModal, setWithdrawalModal] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    // Compute transaction list based on demo stage
    const transactionsList = useMemo(() => {
        let list = [...DEFAULT_TRANSACTIONS];
        
        // If CHECKED_OUT (퇴근 완료) -> add a pending record
        if (state.demoStage === 'CHECKED_OUT') {
            list = [
                {
                    id: 'tx-pending',
                    siteName: '서초 반포 써밋팰리스 복합 신축현장',
                    date: '6월 17일',
                    hours: 8,
                    amount: 227245,
                    basePay: 235000,
                    extraPay: 0,
                    deduction: 7755,
                    expectedDate: '승인 확인 대기 중',
                    status: '회사 확인 중'
                },
                ...list
            ];
        } 
        // If PAID (지급 완료) -> replace the top record with PAID status
        else if (state.demoStage === 'PAID') {
            list = [
                {
                    id: 'tx-pending',
                    siteName: '서초 반포 써밋팰리스 복합 신축현장',
                    date: '6월 17일',
                    hours: 8,
                    amount: 227245,
                    basePay: 235000,
                    extraPay: 0,
                    deduction: 7755,
                    expectedDate: '지급 완료',
                    status: '지급 완료'
                },
                ...list
            ];
        }

        return list;
    }, [state.demoStage]);

    // Financial totals
    const financeSummary = useMemo(() => {
        let expected = state.wallet.expectedAmount; // 3,290,000 or 3,525,000
        let completed = state.demoStage === 'PAID' ? 705000 : 494235; // Mock payouts
        let checking = state.demoStage === 'CHECKED_OUT' ? 227245 : 0;
        let inquiry = state.wallet.status === '금액 문의 중' ? 1 : 0;

        return {
            expected,
            completed,
            checking,
            inquiry
        };
    }, [state.demoStage, state.wallet.status, state.wallet.expectedAmount]);

    const handleWithdraw = () => {
        setIsWithdrawing(true);
        setTimeout(() => {
            setIsWithdrawing(false);
            setWithdrawalModal(false);
            addToast(`💸 등록 계좌(${state.profile.bankName})로 ${financeSummary.completed.toLocaleString()}원 출금이 완료되었습니다.`, 'success');
        }, 1500);
    };

    const handleInquirySubmit = (siteName: string) => {
        requestAmountInquiry();
        setSelectedTx(null);
        addToast(`📝 '${siteName}' 건에 대한 금액 대조 문의가 정상 접수되었습니다.`, 'info');
    };

    const copyShareLink = () => {
        const link = `${window.location.origin}/share/techcard?name=${encodeURIComponent(state.profile.name)}`;
        navigator.clipboard.writeText(link);
        addToast('🔗 기술카드 공유 링크가 클립보드에 복사되었습니다.', 'success');
    };

    const openOfficialInfo = (instName: string) => {
        setSelectedInstitution(instName);
        setShowOfficialModal(true);
    };

    return (
        <div className={styles.pageWrap}>
            {/* Native-style Header */}
            <header className={styles.walletHeader}>
                <div className={styles.headerTitle}>
                    <span className={styles.smallLabel}>나의 정산 주머니</span>
                    <h1>MONO Wallet</h1>
                </div>
                <div className={styles.escrowStatus}>
                    <Lock size={12} fill="currentColor" />
                    <span>받을 돈 안전 확인 중</span>
                </div>
            </header>

            <main className={styles.mainContent}>
                {/* 1. Monthly expected & complete summary */}
                <section className={styles.summaryCard}>
                    <div className={styles.summaryHeader}>
                        <div className={styles.sumLabel}>이번 달 받을 예정 금액</div>
                        <div className={styles.sumVal}>₩ {financeSummary.expected.toLocaleString()}</div>
                    </div>
                    
                    <div className={styles.payoutGrid}>
                        <div className={styles.payoutItem}>
                            <span>지급 완료 금액</span>
                            <strong>₩ {financeSummary.completed.toLocaleString()}</strong>
                        </div>
                        <div className={styles.payoutItem}>
                            <span>회사 확인 중</span>
                            <strong>₩ {financeSummary.checking.toLocaleString()}</strong>
                        </div>
                    </div>

                    <div className={styles.cardActions}>
                        <button 
                            className={styles.withdrawBtn} 
                            onClick={() => setWithdrawalModal(true)}
                        >
                            출금하기
                        </button>
                        <button 
                            className={styles.inquiryBtn}
                            onClick={() => router.push('/myinfo')}
                        >
                            계좌 관리
                        </button>
                    </div>
                </section>

                {/* 2. Premium 3D Tech Card */}
                <section className={styles.techCardSection}>
                    <div className={styles.sectionHeader}>
                        <h3>내 기술카드</h3>
                        <button onClick={() => setCardFlipped(!cardFlipped)} className={styles.flipBtn}>
                            뒷면 보기 <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className={styles.cardWrapper} onClick={() => setCardFlipped(!cardFlipped)}>
                        <div className={`${styles.cardInner} ${cardFlipped ? styles.flipped : ''}`}>
                            {/* CARD FRONT */}
                            <div className={styles.cardFront}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.cardLogo}>MoNo</div>
                                    <div className={styles.cardScoreBadge}>
                                        <span>평판등급:</span>
                                        <strong>{state.demoStage === 'PAID' ? '945점' : '850점'}</strong>
                                    </div>
                                </div>
                                
                                <div className={styles.cardMid}>
                                    <div className={styles.cardChip}></div>
                                    <div className={styles.cardNumber}>MN-4023-8874-1984</div>
                                </div>

                                <div className={styles.cardFooter}>
                                    <div className={styles.footerCol}>
                                        <span className={styles.footLabel}>기술인</span>
                                        <strong className={styles.footVal}>{state.profile.name}</strong>
                                    </div>
                                    <div className={styles.footerCol}>
                                        <span className={styles.footLabel}>대표 직종</span>
                                        <strong className={styles.footVal}>{state.profile.jobs[0].split(' ').slice(2).join(' ') || '형틀목수'}</strong>
                                    </div>
                                    <div className={styles.qrIcon}>
                                        <QrCode size={20} />
                                    </div>
                                </div>
                            </div>

                            {/* CARD BACK */}
                            <div className={styles.cardBack}>
                                <div className={styles.backHeader}>
                                    <span className={styles.backTitle}>업무 데이터 포트폴리오</span>
                                    <span className={styles.safetyTag}>● 안전확인 완료</span>
                                </div>

                                <div className={styles.backGrid}>
                                    <div className={styles.backGridItem}>
                                        <span>총 근무일</span>
                                        <strong>{state.demoStage === 'PAID' ? '143일' : '142일'}</strong>
                                    </div>
                                    <div className={styles.backGridItem}>
                                        <span>참여 현장</span>
                                        <strong>{state.demoStage === 'PAID' ? '19개' : '18개'}</strong>
                                    </div>
                                    <div className={styles.backGridItem}>
                                        <span>회사 검증 완료</span>
                                        <strong>{state.demoStage === 'PAID' ? '19건' : '18건'}</strong>
                                    </div>
                                    <div className={styles.backGridItem}>
                                        <span>경력 수준</span>
                                        <strong>베테랑</strong>
                                    </div>
                                </div>

                                <div className={styles.backFooter}>
                                    <span>AUTHORIZED BY MONO DATA PLATFORM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className={styles.shareCardBtn} onClick={copyShareLink}>
                        <Share2 size={16} />
                        내 기술카드 공유 링크 만들기
                    </button>
                </section>

                {/* 3. Official Institution Verification Status */}
                <section className={styles.officialSection}>
                    <div className={styles.sectionHeader}>
                        <h3>공식 기관 연동 상태</h3>
                    </div>

                    <div className={styles.institutionGrid}>
                        <div className={styles.instCard} onClick={() => openOfficialInfo('건설근로자공제회')}>
                            <div className={styles.instHeader}>
                                <FileText size={16} className="text-blue-500" />
                                <span className={styles.instBadgeDone}>확인 완료</span>
                            </div>
                            <strong>건설근로자공제회</strong>
                            <p>경력 수첩 데이터 연동됨</p>
                        </div>
                        <div className={styles.instCard} onClick={() => openOfficialInfo('산업안전보건공단')}>
                            <div className={styles.instHeader}>
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                <span className={styles.instBadgeDone}>확인 완료</span>
                            </div>
                            <strong>안전보건공단</strong>
                            <p>기초안전교육이수증 연동됨</p>
                        </div>
                        <div className={styles.instCard} onClick={() => openOfficialInfo('한국산업인력공단')}>
                            <div className={styles.instHeader}>
                                <FileText size={16} className="text-amber-500" />
                                <span className={styles.instBadgePrep}>공식 확인 준비중</span>
                            </div>
                            <strong>자격증 검증 기관</strong>
                            <p>국가 공인 자격증 내역 대기</p>
                        </div>
                        <div className={styles.instCard} onClick={() => openOfficialInfo('주요 금융권 API')}>
                            <div className={styles.instHeader}>
                                <ShieldAlert size={16} className="text-purple-500" />
                                <span className={styles.instBadgePrep}>공식 확인 준비중</span>
                            </div>
                            <strong>지급 보증 은행</strong>
                            <p>에스크로 실시간 연동 대기</p>
                        </div>
                    </div>
                </section>

                {/* 4. Transaction Ledger List */}
                <section className={styles.ledgerSection}>
                    <div className={styles.sectionHeader}>
                        <h3>정산 내역 목록</h3>
                    </div>

                    <div className={styles.ledgerList}>
                        {transactionsList.map(tx => (
                            <div 
                                key={tx.id} 
                                className={styles.ledgerItem}
                                onClick={() => setSelectedTx(tx)}
                            >
                                <div className={styles.ledgerIcon}>
                                    {tx.status === '지급 완료' ? (
                                        <ArrowDownLeft size={20} color="#10b981" />
                                    ) : (
                                        <ArrowUpRight size={20} color="#ff9f0a" />
                                    )}
                                </div>
                                <div className={styles.ledgerInfo}>
                                    <h4>{tx.siteName}</h4>
                                    <p>{tx.date} • {tx.hours}시간 • <span className={tx.status === '지급 완료' ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>{tx.status}</span></p>
                                </div>
                                <div className={styles.ledgerAmount}>
                                    ₩ {tx.amount.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Transaction Detail modal */}
            <AnimatePresence>
                {selectedTx && (
                    <div className={styles.modalOverlay} onClick={() => setSelectedTx(null)}>
                        <motion.div 
                            className={styles.detailSheet}
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={styles.sheetHeader}>
                                <div className={styles.sheetHandle}></div>
                                <button className={styles.sheetClose} onClick={() => setSelectedTx(null)}><X size={20} /></button>
                            </div>

                            <div className={styles.sheetContent}>
                                <h3>받을 금액 상세 계산</h3>
                                <p className={styles.sheetDesc}>오늘 땀 흘려 일한 내역의 실시간 지급 정보입니다.</p>

                                <div className={styles.siteBanner}>
                                    <h4>{selectedTx.siteName}</h4>
                                    <span>작업 시간: {selectedTx.hours}시간 ({selectedTx.date})</span>
                                </div>

                                <div className={styles.priceBreakdown}>
                                    <div className={styles.breakRow}>
                                        <span>기본 단가</span>
                                        <strong>₩ {selectedTx.basePay.toLocaleString()}</strong>
                                    </div>
                                    <div className={styles.breakRow}>
                                        <span>추가 근로 수당</span>
                                        <strong className="text-emerald-500">+ ₩ {selectedTx.extraPay.toLocaleString()}</strong>
                                    </div>
                                    <div className={styles.breakRow}>
                                        <span>원천세 3.3% 공제액</span>
                                        <strong className="text-red-500">- ₩ {selectedTx.deduction.toLocaleString()}</strong>
                                    </div>
                                    <div className={styles.sheetDivider}></div>
                                    <div className={styles.totalRow}>
                                        <span>실제 받을 금액</span>
                                        <strong>₩ {selectedTx.amount.toLocaleString()}</strong>
                                    </div>
                                </div>

                                <div className={styles.statusDetails}>
                                    <div className={styles.statusRow}>
                                        <span>지급 예정 시각</span>
                                        <span>{selectedTx.expectedDate}</span>
                                    </div>
                                    <div className={styles.statusRow}>
                                        <span>지급 상태</span>
                                        <span className={selectedTx.status === '지급 완료' ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>
                                            {selectedTx.status}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.modalCtaArea}>
                                    <button 
                                        className={styles.inquiryBtnSubmit}
                                        onClick={() => handleInquirySubmit(selectedTx.siteName)}
                                        disabled={state.wallet.status === '금액 문의 중' && selectedTx.id === 'tx-pending'}
                                    >
                                        {state.wallet.status === '금액 문의 중' && selectedTx.id === 'tx-pending' ? '금액 문의 접수됨' : '받을 금액 문의하기'}
                                    </button>
                                    <button 
                                        className={styles.closeModalBtn}
                                        onClick={() => setSelectedTx(null)}
                                    >
                                        확인
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Withdrawal confirmation modal */}
            <AnimatePresence>
                {withdrawalModal && (
                    <div className={styles.modalOverlay} onClick={() => setWithdrawalModal(false)}>
                        <motion.div 
                            className={styles.detailSheet}
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={styles.sheetHeader}>
                                <div className={styles.sheetHandle}></div>
                                <button className={styles.sheetClose} onClick={() => setWithdrawalModal(false)}><X size={20} /></button>
                            </div>

                            <div className={styles.sheetContent}>
                                <h3>내 지갑에서 계좌로 출금</h3>
                                <p className={styles.sheetDesc}>등록하신 본인 확인 계좌로 정산된 일당을 즉시 이체합니다.</p>

                                <div className={styles.withdrawAmountBox}>
                                    <span>출금 가능 총액</span>
                                    <strong>₩ {financeSummary.completed.toLocaleString()}</strong>
                                </div>

                                <div className={styles.accountBox}>
                                    <span>수령 통장 정보</span>
                                    <strong>{state.profile.bankName} {state.profile.accountNumber}</strong>
                                    <p>예금주: {state.profile.name} (실명 확인 완료)</p>
                                </div>

                                <div className={styles.modalCtaArea}>
                                    <button 
                                        className={styles.withdrawConfirmBtn}
                                        onClick={handleWithdraw}
                                        disabled={isWithdrawing || financeSummary.completed === 0}
                                    >
                                        {isWithdrawing ? '이체 중...' : '지금 전액 출금 신청'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Institution preparing status modal */}
            <AnimatePresence>
                {showOfficialModal && selectedInstitution && (
                    <div className={styles.modalOverlay} onClick={() => setShowOfficialModal(false)}>
                        <motion.div 
                            className={styles.infoSheet}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={styles.infoModalHeader}>
                                <h3>{selectedInstitution} 연동 정보</h3>
                                <button onClick={() => setShowOfficialModal(false)} className={styles.infoModalClose}><X size={16} /></button>
                            </div>

                            <div className={styles.infoModalBody}>
                                <Info size={36} className="text-blue-500 mb-2" />
                                {['건설근로자공제회', '산업안전보건공단'].includes(selectedInstitution) ? (
                                    <>
                                        <strong>공식 연동이 완료되어 있습니다.</strong>
                                        <p>
                                            해당 기관과의 안전한 API 동기화를 통해 반장님의 이수 정보 및 퇴직공제부금 적립 일수가 내 기술카드에 신뢰 점수로 연동되고 있습니다.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <strong>공식 확인 기능을 협의/준비하고 있어요.</strong>
                                        <p>
                                            본 기능은 공인 자격 검증 및 1금융권 은행 에스크로 API 협의가 필요한 사항입니다. 준비가 완료되면 반장님의 기록을 보다 쉽고 안전하게 공식 연동할 수 있도록 알려드릴게요.
                                        </p>
                                        <div className={styles.prepNotice}>
                                            지금은 반장님이 직접 등록한 서류와 시공사(회사)가 QR로 직접 검증 완료한 정보를 대조하여 투명하게 보여주고 있습니다.
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            <button 
                                className={styles.infoModalConfirm}
                                onClick={() => setShowOfficialModal(false)}
                            >
                                확인
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
