'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import GlassCard from '@/components/UI/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '@/context/UIContext';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip as ChartTooltip, 
    ResponsiveContainer 
} from 'recharts';
import { 
    Building2, 
    Users, 
    Wallet, 
    Plus, 
    X,
    MapPin,
    ClipboardCheck,
    Star,
    CheckCircle2,
    Loader2,
    TrendingUp,
    ShieldCheck,
    ArrowUpRight,
    Coins,
    FileCheck,
    Activity
} from 'lucide-react';
import styles from './page.module.css';

interface Partner {
    companyName: string;
}

interface Site {
    id: string;
    title: string;
    location: string;
    dailyWage: number;
    status: string;
    createdAt: string;
}

interface PartnerTransaction {
    id: string;
    siteName: string;
    date: string;
    amount: number;
}

interface Attendance {
    id: string | number;
    name: string;
    siteName: string;
    time: string;
    approved?: boolean;
}

interface Evaluation {
    id: string | number;
    name: string;
    siteName: string;
    rating?: number;
    completed?: boolean;
}

interface PartnerData {
    partner: Partner;
    sites: Site[];
    transactions: PartnerTransaction[];
    attendance: Attendance[];
    evaluations: Evaluation[];
}

const dispatchChartData = [
    { name: '월', dispatchRate: 85, activeWorkers: 24 },
    { name: '화', dispatchRate: 88, activeWorkers: 26 },
    { name: '수', dispatchRate: 92, activeWorkers: 32 },
    { name: '목', dispatchRate: 95, activeWorkers: 38 },
    { name: '금', dispatchRate: 98, activeWorkers: 42 },
    { name: '토', dispatchRate: 90, activeWorkers: 30 },
    { name: '일', dispatchRate: 82, activeWorkers: 22 },
];

export default function PartnerClient() {
    const { showToast } = useUI();
    const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'settlement' | 'evaluation'>('overview');
    const [data, setData] = useState<PartnerData | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Interactive States
    const [escrowBalance, setEscrowBalance] = useState(42000000); // 42M Default
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState<PartnerTransaction | null>(null);
    const [agreeToSafetyData, setAgreeToSafetyData] = useState(true);
    const [processingAction, setProcessingAction] = useState(false);

    // Charge amount
    const [chargeAmount, setChargeAmount] = useState('10000000'); // 10M Default

    // Form state for new request
    const [formData, setFormData] = useState({
        siteName: '',
        location: '',
        workersCount: '',
        startDate: '',
        skillRequired: ''
    });

    useEffect(() => {
        const fetchPartnerData = async () => {
            try {
                const res = await fetch('/api/partner');
                const json = await res.json();
                
                // Add initial states to attendance and evaluations
                const formattedAttendance = json.attendance.map((att: Attendance) => ({ ...att, approved: false }));
                const formattedEvaluations = json.evaluations.map((ev: Evaluation) => ({ ...ev, rating: 0, completed: false }));
                
                setData({
                    ...json,
                    attendance: formattedAttendance,
                    evaluations: formattedEvaluations
                });
            } catch (error) {
                console.error("Failed to fetch partner data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPartnerData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 1. Submit New Workforce Request
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const newSite = {
            id: `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            title: formData.siteName,
            location: formData.location,
            dailyWage: formData.skillRequired === 'tile' ? 280000 : 220000,
            status: 'Matching',
            createdAt: new Date().toISOString()
        };

        if (data) {
            setData({ ...data, sites: [newSite, ...data.sites] });
        }
        setIsRequestModalOpen(false);
        showToast(`'${formData.siteName}' 현장 인력 요청이 성공적으로 등록되었습니다.`, 'success');
        setFormData({ siteName: '', location: '', workersCount: '', startDate: '', skillRequired: '' });
    };

    // 2. Escrow Deposit Charge Simulator
    const handleChargeEscrow = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessingAction(true);
        
        setTimeout(() => {
            const amount = parseInt(chargeAmount);
            setEscrowBalance(prev => prev + amount);
            setProcessingAction(false);
            setIsChargeModalOpen(false);
            showToast(`에스크로 안전 예치금 ₩${amount.toLocaleString()}이 정상 충전되었습니다.`, 'success');
        }, 1500);
    };

    // 3. Attendance Approval
    const handleApproveAttendance = (id: string | number, name: string) => {
        if (!data) return;
        
        setData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                attendance: prev.attendance.map(att => 
                    att.id === id ? { ...att, approved: true } : att
                )
            };
        });
        
        showToast(`${name.split(' ')[0]} 전문가님의 출근이 승인되어 당일 노무비가 락업(Lock)되었습니다.`, 'success');
    };

    // 4. Escrow Payment Action (Invoice Modal)
    const triggerPaymentModal = (tx: PartnerTransaction) => {
        setSelectedTx(tx);
        setIsPaymentModalOpen(true);
    };

    const handleExecutePayment = () => {
        if (!data || !selectedTx) return;
        setProcessingAction(true);

        setTimeout(() => {
            // Deduct from escrow balance
            setEscrowBalance(prev => Math.max(0, prev - selectedTx.amount));
            
            // Remove the transaction from the list or update status
            setData(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    transactions: prev.transactions.filter(t => t.id !== selectedTx.id)
                };
            });

            setProcessingAction(false);
            setIsPaymentModalOpen(false);
            
            showToast(
                agreeToSafetyData 
                ? `에스크로 승인이 완료되었으며, 중대재해예방 면책 데이터 연동 및 국세청 전자 세금계산서가 발행되었습니다.`
                : `에스크로 승인 완료 및 국세청 전자 세금계산서가 정상 발행되었습니다.`,
                'success'
            );
            setSelectedTx(null);
        }, 2000);
    };

    // 5. Evaluation Star Click
    const handleSetRating = (id: string | number, rating: number) => {
        if (!data) return;
        setData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                evaluations: prev.evaluations.map(ev => 
                    ev.id === id ? { ...ev, rating } : ev
                )
            };
        });
    };

    const handleCompleteEvaluation = (id: string | number, name: string) => {
        if (!data) return;
        const currentEv = data.evaluations.find(ev => ev.id === id);
        if (!currentEv || !currentEv.rating || currentEv.rating === 0) {
            showToast('별점을 선택하여 주십시오.', 'warning');
            return;
        }

        setData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                evaluations: prev.evaluations.map(ev => 
                    ev.id === id ? { ...ev, completed: true } : ev
                )
            };
        });

        showToast(`${name.split(' ')[0]} 전문가님의 360° 평판 평가가 정상 반영되었습니다.`, 'success');
    };

    if (loading || !data) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0A0F1A', color: '#00f2ff' }}>
                <Loader2 size={48} className="animate-spin" />
            </div>
        );
    }

    return (
        <div className={styles.pageWrap}>
            <Navbar />
            
            <div className={styles.container}>
                {/* Brand Header */}
                <header className={styles.header}>
                    <div className={styles.titleArea}>
                        <div className={styles.brandChip}>
                            <Activity size={12} />
                            <span>B2B 기업회원 전용 관리관</span>
                        </div>
                        <h1>{data.partner.companyName} 대시보드</h1>
                        <p>MoNo의 실시간 기술 전문가 매칭, 스마트 근태 관제 및 에스크로 정산 허브</p>
                    </div>
                    
                    {/* Top Escrow Summary Widget */}
                    <div className={styles.topEscrowWidget}>
                        <div className={styles.escrowText}>
                            <span className={styles.widgetLabel}><Coins size={14} /> 나의 안전 에스크로 예치금</span>
                            <span className={styles.widgetPrice}>₩{escrowBalance.toLocaleString()}</span>
                        </div>
                        <button 
                            className={styles.chargeBtn} 
                            onClick={() => setIsChargeModalOpen(true)}
                        >
                            <Plus size={14} /> 충전
                        </button>
                    </div>
                </header>

                {/* Tab Navigation Menu */}
                <div className={styles.tabNav}>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.active : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <Building2 size={16} /> 실시간 관제판
                    </button>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === 'attendance' ? styles.active : ''}`}
                        onClick={() => setActiveTab('attendance')}
                    >
                        <ClipboardCheck size={16} /> 실시간 출역 현황
                        {data.attendance.filter(a => !a.approved).length > 0 && (
                            <span className={styles.badgeCount}>{data.attendance.filter(a => !a.approved).length}</span>
                        )}
                    </button>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === 'settlement' ? styles.active : ''}`}
                        onClick={() => setActiveTab('settlement')}
                    >
                        <Wallet size={16} /> 에스크로 정산
                        {data.transactions.length > 0 && (
                            <span className={styles.badgeCountAlert}>{data.transactions.length}</span>
                        )}
                    </button>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === 'evaluation' ? styles.active : ''}`}
                        onClick={() => setActiveTab('evaluation')}
                    >
                        <Star size={16} /> 신뢰도 OJT 평가
                        {data.evaluations.filter(e => !e.completed).length > 0 && (
                            <span className={styles.badgeCount}>{data.evaluations.filter(e => !e.completed).length}</span>
                        )}
                    </button>
                </div>

                {/* TAB CONTENT: 1. OVERVIEW (DASHBOARD) */}
                {activeTab === 'overview' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.4 }}
                        className={styles.tabSection}
                    >
                        {/* Stats Dashboard Grid */}
                        <div className={styles.statsGrid}>
                            <GlassCard className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <span className={styles.statTitle}>진행 중 현장</span>
                                    <div className={styles.statIcon}><Building2 size={18} /></div>
                                </div>
                                <div className={styles.statValue}>{data.sites.filter(s => s.status !== 'Closed').length}개</div>
                                <div className={styles.statSub} style={{ color: '#00f2ff' }}>
                                    <ArrowUpRight size={12} /> 실시간 관제 및 투입 중
                                </div>
                            </GlassCard>
                            
                            <GlassCard className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <span className={styles.statTitle}>실시간 투입 기술자</span>
                                    <div className={styles.statIcon}><Users size={18} /></div>
                                </div>
                                <div className={styles.statValue}>
                                    {data.sites.filter(s => s.status === 'Deployed').length * 2 + 2}명
                                </div>
                                <div className={styles.statSub} style={{ color: '#10B981' }}>
                                    <ShieldCheck size={12} /> 100% 당일 출근 확인됨
                                </div>
                            </GlassCard>

                            <GlassCard className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <span className={styles.statTitle}>중대재해 면책 예방 지수</span>
                                    <div className={styles.statIcon}><ShieldCheck size={18} /></div>
                                </div>
                                <div className={styles.statValue}>99.4%</div>
                                <div className={styles.statSub} style={{ color: '#10B981' }}>
                                    안전 서명 및 보험 연동 100% 완료
                                </div>
                            </GlassCard>
                        </div>

                        {/* Interactive Main Action Dispatch Card */}
                        <div className={styles.mainActionArea}>
                            <GlassCard className={styles.newRequestCard}>
                                <div className={styles.actionText}>
                                    <h2>미래 기술 장인 (Tech-Blue) 신규 호출</h2>
                                    <p>성실도, 평판, 공정 조작 능력이 검증된 MoNo의 기술 전문가들을 현장에 배치합니다.</p>
                                </div>
                                <button 
                                    className={styles.actionBtn}
                                    onClick={() => setIsRequestModalOpen(true)}
                                >
                                    <Plus size={20} />
                                    인력 요청서 등록
                                </button>
                            </GlassCard>
                        </div>

                        {/* Premium Charts & Active Site Grid */}
                        <div className={styles.dashboardDoubleLayout}>
                            {/* Recharts Live Dispatch Analytics */}
                            <GlassCard className={styles.chartPanel}>
                                <div className={styles.panelHeader}>
                                    <div>
                                        <h3>일자별 현장 투입 및 출역 가동률</h3>
                                        <p>데이터 기반의 주간 근태 관제 통계 보고</p>
                                    </div>
                                    <div className={styles.trendLabel}>
                                        <TrendingUp size={14} /> 94% 평균 가동
                                    </div>
                                </div>
                                <div className={styles.chartWrap}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={dispatchChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorDispatch" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.2}/>
                                                    <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                                            <XAxis dataKey="name" tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 11 }} />
                                            <YAxis tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 11 }} />
                                            <ChartTooltip 
                                                contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(0, 242, 255, 0.2)', borderRadius: '8px' }}
                                                labelStyle={{ color: '#fff', fontWeight: 800 }}
                                            />
                                            <Area type="monotone" dataKey="dispatchRate" name="가동률 (%)" stroke="#00f2ff" fillOpacity={1} fill="url(#colorDispatch)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </GlassCard>

                            {/* Ongoing JobSites Grid */}
                            <div className={styles.dashboardSitesColumn}>
                                <div className={styles.sectionHeaderFlex}>
                                    <h3>관리 중인 공사 현장</h3>
                                    <span>총 {data.sites.length}개소</span>
                                </div>
                                <div className={styles.dashboardSitesList}>
                                    {data.sites.slice(0, 3).map((site: Site) => (
                                        <div key={site.id} className={styles.dashboardSiteCard}>
                                            <div className={styles.dsInfo}>
                                                <h4>{site.title}</h4>
                                                <div className={styles.dsMeta}>
                                                    <span><MapPin size={12} /> {site.location}</span>
                                                    <span>•</span>
                                                    <span>일당 ₩{site.dailyWage.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <span className={`${styles.statusBadge} ${site.status === 'Matching' ? styles.pending : ''}`}>
                                                {site.status === 'Matching' ? '매칭 매칭중' : '투입 Deployed'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* TAB CONTENT: 2. ATTENDANCE (출역 관리) */}
                {activeTab === 'attendance' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.4 }}
                        className={styles.tabSection}
                    >
                        <div className={styles.sectionHeader}>
                            <h2>실시간 출역 및 근태 승인 관제</h2>
                            <p>오늘 현장에 배치된 전문가들의 GPS/NFC 출역 태그 정보를 검증하고 노무비를 확정합니다.</p>
                        </div>
                        
                        <div className={styles.listContainer}>
                            <AnimatePresence mode="popLayout">
                                {data.attendance.map((att: Attendance) => (
                                    <motion.div 
                                        key={att.id}
                                        layout
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                        className={styles.listItemNew}
                                    >
                                        <div className={styles.liLeft}>
                                            <div className={styles.liIconBox}>
                                                <ClipboardCheck size={20} color={att.approved ? '#10B981' : '#00f2ff'} />
                                            </div>
                                            <div>
                                                <h4>{att.name}</h4>
                                                <p className={styles.liSubtitle}>{att.siteName}</p>
                                            </div>
                                        </div>
                                        <div className={styles.liRight}>
                                            <span className={styles.timeTagNew}>{att.time}</span>
                                            {att.approved ? (
                                                <span className={styles.approvedLabel}>
                                                    <CheckCircle2 size={14} /> 승인 완료 (노무비 확정)
                                                </span>
                                            ) : (
                                                <button 
                                                    className={styles.approveBtnNew}
                                                    onClick={() => handleApproveAttendance(att.id, att.name)}
                                                >
                                                    <CheckCircle2 size={14} /> 출근 승인
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {/* TAB CONTENT: 3. SETTLEMENT (에스크로 정산) */}
                {activeTab === 'settlement' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.4 }}
                        className={styles.tabSection}
                    >
                        <div className={styles.sectionHeader}>
                            <h2>에스크로 자동 노무비 정산 관리</h2>
                            <p>작업 완료가 인증된 청구 내역입니다. 승인 시 안전 에스크로에서 기술자 자산 계좌로 즉시 이체됩니다.</p>
                        </div>

                        <div className={styles.listContainer}>
                            {data.transactions.length === 0 ? (
                                <div className={styles.emptyContainer}>
                                    <CheckCircle2 size={48} color="#10B981" />
                                    <p>현재 미정산 대기 건이 없습니다. 모든 계약금이 안전하게 지급 완료되었습니다.</p>
                                </div>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {data.transactions.map((tx: PartnerTransaction) => (
                                        <motion.div 
                                            key={tx.id}
                                            layout
                                            initial={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={styles.listItemNew}
                                        >
                                            <div className={styles.liLeft}>
                                                <div className={styles.liIconBox} style={{ background: 'rgba(0, 242, 255, 0.05)' }}>
                                                    <Wallet size={20} color="#00f2ff" />
                                                </div>
                                                <div>
                                                    <h4 style={{ color: '#00f2ff' }}>₩{tx.amount.toLocaleString()} 청구</h4>
                                                    <p className={styles.liSubtitle}>{tx.siteName}</p>
                                                    <span className={styles.liDate}>작업 완료일: {new Date(tx.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className={styles.liRight}>
                                                <button 
                                                    className={styles.payBtnNew}
                                                    onClick={() => triggerPaymentModal(tx)}
                                                >
                                                    에스크로 지급 확인
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* TAB CONTENT: 4. EVALUATION (OJT 평가) */}
                {activeTab === 'evaluation' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.4 }}
                        className={styles.tabSection}
                    >
                        <div className={styles.sectionHeader}>
                            <h2>신뢰도 기반 OJT/평판 360° 평가</h2>
                            <p>공정이 완료된 기술 전문가의 직무 성실도와 협업 충실도를 평가하여 MoNo의 신뢰 데이터를 형성합니다.</p>
                        </div>

                        <div className={styles.listContainer}>
                            <AnimatePresence mode="popLayout">
                                {data.evaluations.map((ev: Evaluation) => (
                                    <motion.div 
                                        key={ev.id}
                                        layout
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={styles.listItemNew}
                                    >
                                        <div className={styles.liLeft}>
                                            <div className={styles.liIconBox} style={{ background: 'rgba(212,175,55,0.05)' }}>
                                                <Star size={20} color="#D4AF37" />
                                            </div>
                                            <div>
                                                <h4>{ev.name}</h4>
                                                <p className={styles.liSubtitle}>{ev.siteName}</p>
                                            </div>
                                        </div>
                                        <div className={styles.liRight}>
                                            {ev.completed ? (
                                                <span className={styles.approvedLabel} style={{ color: '#D4AF37' }}>
                                                    <CheckCircle2 size={14} /> 평판 데이터 연동 완료
                                                </span>
                                            ) : (
                                                <div className={styles.evaluationActions}>
                                                    <div className={styles.starRatingBox}>
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button 
                                                                key={star}
                                                                onClick={() => handleSetRating(ev.id, star)}
                                                                className={styles.starBtn}
                                                            >
                                                                <Star 
                                                                    size={20} 
                                                                    fill={star <= (ev.rating || 0) ? '#D4AF37' : 'none'} 
                                                                    color="#D4AF37" 
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <button 
                                                        className={styles.reviewBtnNew}
                                                        onClick={() => handleCompleteEvaluation(ev.id, ev.name)}
                                                    >
                                                        평가서 전송
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* MODAL 1: NEW WORKFORCE REQUEST */}
            {isRequestModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsRequestModalOpen(false)}>
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className={styles.modalContent} 
                        onClick={e => e.stopPropagation()}
                    >
                        <button className={styles.modalClose} onClick={() => setIsRequestModalOpen(false)}>
                            <X size={20} />
                        </button>
                        <h2 className={styles.modalTitle}>신규 현장 인력 요청</h2>
                        <p className={styles.modalDesc}>현장의 위치와 필요 기술 및 투입 조건을 설정해주시면, 가장 성실하고 검증된 전문가 그룹이 다이렉트 자동 매칭됩니다.</p>
                        
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>현장 공사명</label>
                                <input 
                                    type="text" 
                                    name="siteName"
                                    className={styles.input} 
                                    placeholder="예: 평택 반도체 P5 배관 2차 보조공사"
                                    value={formData.siteName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>현장 위치 (주소)</label>
                                <input 
                                    type="text" 
                                    name="location"
                                    className={styles.input} 
                                    placeholder="예: 경기도 평택시 고덕면 삼성로"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>요구 기술 공종 (Specialty)</label>
                                <select 
                                    name="skillRequired"
                                    className={styles.input}
                                    value={formData.skillRequired}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">전문 공종군을 선택하세요</option>
                                    <option value="tile">하이테크 타일 명장 (대형/졸리컷 시공)</option>
                                    <option value="interior">인테리어 내장 목공 (도면 분석)</option>
                                    <option value="plumbing">설비 배관 배관공 (특수 배관 공법)</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className={styles.formGroup}>
                                    <label>요청 전문 인원</label>
                                    <input 
                                        type="number" 
                                        name="workersCount"
                                        className={styles.input} 
                                        placeholder="명"
                                        min="1"
                                        value={formData.workersCount}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>투입 예정 개시일</label>
                                    <input 
                                        type="date" 
                                        name="startDate"
                                        className={styles.input}
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className={styles.submitBtn}>
                                인력 매칭 및 실시간 호출 등록
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* MODAL 2: ESCROW CHARGE SIMULATOR */}
            {isChargeModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsChargeModalOpen(false)}>
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={styles.modalContent} 
                        onClick={e => e.stopPropagation()}
                    >
                        <button className={styles.modalClose} onClick={() => setIsChargeModalOpen(false)}>
                            <X size={20} />
                        </button>
                        <h2 className={styles.modalTitle}><Coins size={24} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle', color: '#00f2ff' }} /> 안전 에스크로 계좌 예치금 충전</h2>
                        <p className={styles.modalDesc}>인건비 지급 안전성과 B2B SaaS 신뢰 거래를 보증하기 위해 1금융권 에스크로 보호 가상 계좌로 예치금을 충전합니다.</p>
                        
                        <form onSubmit={handleChargeEscrow}>
                            <div className={styles.formGroup}>
                                <label>충전 예치금 금액</label>
                                <select 
                                    name="chargeAmount"
                                    className={styles.input}
                                    value={chargeAmount}
                                    onChange={(e) => setChargeAmount(e.target.value)}
                                    required
                                >
                                    <option value="5000000">₩5,000,000 (오백만 원)</option>
                                    <option value="10000000">₩10,000,000 (일천만 원)</option>
                                    <option value="30000000">₩30,000,000 (삼천만 원)</option>
                                    <option value="50000000">₩50,000,000 (오천만 원)</option>
                                </select>
                            </div>
                            <button type="submit" className={styles.submitBtn} disabled={processingAction}>
                                {processingAction ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" style={{ display: 'inline', marginRight: 8 }} />
                                        1금융권 가상 계좌 결제 전송 중...
                                    </>
                                ) : '예치금 가상 충전 실행'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* MODAL 3: ESCROW PAYMENT APPROVAL (INVOICE & IMMUNITY AGREEMENT) */}
            {isPaymentModalOpen && selectedTx && (
                <div className={styles.modalOverlay} onClick={() => setIsPaymentModalOpen(false)}>
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={styles.modalContent} 
                        onClick={e => e.stopPropagation()}
                    >
                        <button className={styles.modalClose} onClick={() => setIsPaymentModalOpen(false)}>
                            <X size={20} />
                        </button>
                        <h2 className={styles.modalTitle} style={{ color: '#00f2ff' }}>🛡️ 에스크로 정산 최종 승인 및 영수서</h2>
                        <p className={styles.modalDesc}>청구된 인건비 이체 및 세무 관련 의무 행정을 클릭 한 번으로 자동 처리합니다.</p>
                        
                        <div className={styles.invoiceForm}>
                            <div className={styles.invoiceDetailCard}>
                                <div className={styles.idRow}>
                                    <span className={styles.idLabel}>대상 공사명</span>
                                    <span className={styles.idVal}>{selectedTx.siteName}</span>
                                </div>
                                <div className={styles.idRow}>
                                    <span className={styles.idLabel}>최종 청구 금액</span>
                                    <span className={styles.idVal} style={{ color: '#00f2ff', fontWeight: 800 }}>₩ {selectedTx.amount.toLocaleString()}</span>
                                </div>
                                <div className={styles.idRow}>
                                    <span className={styles.idLabel}>거래 일시</span>
                                    <span className={styles.idVal}>{new Date(selectedTx.date).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* B2B SaaS Value Add: Immunity & Safety Data Transfer */}
                            <div className={styles.safetyAgreementBox}>
                                <label className={styles.checkboxLabel}>
                                    <input 
                                        type="checkbox" 
                                        checked={agreeToSafetyData}
                                        onChange={(e) => setAgreeToSafetyData(e.target.checked)}
                                    />
                                    <div className={styles.cbText}>
                                        <strong>중대재해처벌법 대비 원-하청 안전 데이터 연동 전송 (추천)</strong>
                                        <p>본 현장의 출역/안전 이수/로그 데이터를 10년 보관 연동하여 면책 입증 서류로 영구 보관합니다.</p>
                                    </div>
                                </label>
                            </div>

                            <div className={styles.formGroup} style={{ marginTop: '16px' }}>
                                <label><FileCheck size={14} style={{ display: 'inline', marginRight: 4 }} /> 행정 업무 원클릭 대행 자동화 서비스</label>
                                <ul className={styles.benefitBulletList}>
                                    <li>국세청 연동 법인용 전자 세금계산서 실시간 발행</li>
                                    <li>근무자 일일 고용/산재 보험 공단 일괄 신고 전송</li>
                                </ul>
                            </div>

                            <button 
                                className={styles.submitBtn} 
                                style={{ background: '#00f2ff' }}
                                onClick={handleExecutePayment}
                                disabled={processingAction}
                            >
                                {processingAction ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" style={{ display: 'inline', marginRight: 8 }} />
                                        에스크로 자산 이체 및 법인 증빙 연동 중...
                                    </>
                                ) : '에스크로 즉시 지급 및 세무 영수 발행 승인'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
