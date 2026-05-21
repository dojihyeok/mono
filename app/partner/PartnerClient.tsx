'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import GlassCard from '@/components/UI/GlassCard';
import { 
    Building2, 
    Users, 
    Wallet, 
    Plus, 
    X,
    MapPin,
    Calendar,
    ChevronRight,
    ClipboardCheck,
    Star,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import styles from './page.module.css';

interface PartnerData {
    partner: any;
    sites: any[];
    transactions: any[];
    attendance: any[];
    evaluations: any[];
}

export default function PartnerClient() {
    const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'settlement' | 'evaluation'>('overview');
    const [data, setData] = useState<PartnerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form state
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
                setData(json);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Optimistic UI update (in a real app, you'd POST this to the API)
        const newSite = {
            id: `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            title: formData.siteName,
            location: formData.location,
            dailyWage: 250000,
            status: 'Matching',
            createdAt: new Date().toISOString()
        };

        if (data) {
            setData({ ...data, sites: [newSite, ...data.sites] });
        }
        setIsModalOpen(false);
        setFormData({ siteName: '', location: '', workersCount: '', startDate: '', skillRequired: '' });
    };

    if (loading || !data) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000', color: '#D4AF37' }}>
                <Loader2 size={48} className="animate-spin" />
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.titleArea}>
                        <h1>MoNo Partner Portal</h1>
                        <p>{data.partner.companyName} 현장 및 인력 관리 대시보드</p>
                    </div>
                </header>

                <div className={styles.tabNav}>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.active : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        대시보드
                    </button>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === 'attendance' ? styles.active : ''}`}
                        onClick={() => setActiveTab('attendance')}
                    >
                        <ClipboardCheck size={16} /> 출역 관리
                    </button>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === 'settlement' ? styles.active : ''}`}
                        onClick={() => setActiveTab('settlement')}
                    >
                        <Wallet size={16} /> 정산 및 결제
                    </button>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === 'evaluation' ? styles.active : ''}`}
                        onClick={() => setActiveTab('evaluation')}
                    >
                        <Star size={16} /> 전문가 평가
                    </button>
                </div>

                {activeTab === 'overview' && (
                    <>
                        <div className={styles.statsGrid}>
                            <GlassCard className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <span className={styles.statTitle}>진행 중인 현장</span>
                                    <div className={styles.statIcon}><Building2 size={20} /></div>
                                </div>
                                <div className={styles.statValue}>{data.sites.filter(s => s.status !== 'Closed').length}</div>
                                <div className={styles.statSub}>현재 매칭/투입 진행 중</div>
                            </GlassCard>
                            <GlassCard className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <span className={styles.statTitle}>투입된 기술 전문가</span>
                                    <div className={styles.statIcon}><Users size={20} /></div>
                                </div>
                                <div className={styles.statValue}>
                                    {data.sites.filter(s => s.status === 'Deployed').length * 2}
                                </div>
                                <div className={styles.statSub}>실시간 현장 출역 확인됨</div>
                            </GlassCard>
                            <GlassCard className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <span className={styles.statTitle}>결제 예정 (에스크로)</span>
                                    <div className={styles.statIcon}><Wallet size={20} /></div>
                                </div>
                                <div className={styles.statValue}>₩{(data.transactions.reduce((acc, curr) => acc + curr.amount, 0) / 1000000).toFixed(1)}M</div>
                                <div className={styles.statSub}>MoNo 안전 결제 보호 중</div>
                            </GlassCard>
                        </div>

                        <div className={styles.mainActionArea}>
                            <GlassCard className={styles.newRequestCard}>
                                <div className={styles.actionText}>
                                    <h2>새로운 현장 인력 등록</h2>
                                    <p>MoNo의 검증된 기술 전문가들을 현장에 매칭하세요.</p>
                                </div>
                                <button 
                                    className={styles.actionBtn}
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <Plus size={24} />
                                    인력 요청하기
                                </button>
                            </GlassCard>
                        </div>

                        <section className={styles.siteListArea}>
                            <h3>현장 관리 현황</h3>
                            <div className={styles.siteGrid}>
                                {data.sites.map((site: any) => (
                                    <GlassCard key={site.id} className={styles.siteCard}>
                                        <div className={styles.siteInfo}>
                                            <h4>{site.title}</h4>
                                            <div className={styles.siteMeta}>
                                                <span><MapPin size={14} style={{ display: 'inline', marginRight: 4 }}/>{site.location}</span>
                                                <span><Users size={14} style={{ display: 'inline', marginRight: 4 }}/>단가: ₩{site.dailyWage.toLocaleString()}</span>
                                                <span><Calendar size={14} style={{ display: 'inline', marginRight: 4 }}/>생성일: {new Date(site.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className={styles.siteStatus}>
                                            <span className={`${styles.statusBadge} ${site.status === 'Matching' ? styles.pending : ''}`}>
                                                {site.status === 'Matching' ? '매칭 중' : '투입 완료'}
                                            </span>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </section>
                    </>
                )}

                {activeTab === 'attendance' && (
                    <section className={styles.tabSection}>
                        <div className={styles.sectionHeader}>
                            <h2>출역 및 근태 관리</h2>
                            <p>오늘 현장에 투입된 전문가들의 출근 여부를 확인하고 승인합니다.</p>
                        </div>
                        <GlassCard className={styles.listCard}>
                            {data.attendance.map((att: any) => (
                                <div key={att.id} className={styles.listItem}>
                                    <div className={styles.itemInfo}>
                                        <h4>{att.name}</h4>
                                        <p>{att.siteName}</p>
                                    </div>
                                    <div className={styles.itemActions}>
                                        <span className={styles.timeTag}>{att.time}</span>
                                        <button className={styles.approveBtn}><CheckCircle2 size={16}/> 출근 승인</button>
                                    </div>
                                </div>
                            ))}
                        </GlassCard>
                    </section>
                )}

                {activeTab === 'settlement' && (
                    <section className={styles.tabSection}>
                        <div className={styles.sectionHeader}>
                            <h2>비용 정산 및 결제 관리</h2>
                            <p>MoNo 에스크로를 통해 안전하게 인건비를 결제하고 세금계산서를 발행합니다.</p>
                        </div>
                        <GlassCard className={styles.listCard}>
                            {data.transactions.map((tx: any) => (
                                <div key={tx.id} className={styles.listItem}>
                                    <div className={styles.itemInfo}>
                                        <h4>[정산 대기] {tx.siteName}</h4>
                                        <p>현장 결제 요청 - {new Date(tx.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className={styles.itemActions}>
                                        <span className={styles.amountText}>₩ {tx.amount.toLocaleString()}</span>
                                        <button className={styles.payBtn}>에스크로 결제 승인</button>
                                    </div>
                                </div>
                            ))}
                        </GlassCard>
                    </section>
                )}

                {activeTab === 'evaluation' && (
                    <section className={styles.tabSection}>
                        <div className={styles.sectionHeader}>
                            <h2>현장 인력 평가</h2>
                            <p>작업이 완료된 전문가를 평가하여 파트너사의 신뢰도를 높이고 우수 인력을 선점하세요.</p>
                        </div>
                        <GlassCard className={styles.listCard}>
                            {data.evaluations.map((ev: any) => (
                                <div key={ev.id} className={styles.listItem}>
                                    <div className={styles.itemInfo}>
                                        <h4>{ev.name}</h4>
                                        <p>{ev.siteName}</p>
                                    </div>
                                    <div className={styles.itemActions}>
                                        <div className={styles.stars}>
                                            <Star size={20} fill="#D4AF37" color="#D4AF37"/>
                                            <Star size={20} fill="#D4AF37" color="#D4AF37"/>
                                            <Star size={20} fill="#D4AF37" color="#D4AF37"/>
                                            <Star size={20} fill="#D4AF37" color="#D4AF37"/>
                                            <Star size={20} color="#D4AF37"/>
                                        </div>
                                        <button className={styles.reviewBtn}>평가 완료하기</button>
                                    </div>
                                </div>
                            ))}
                        </GlassCard>
                    </section>
                )}
            </div>

            {/* Request Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={() => setIsModalOpen(false)}>
                            <X size={24} />
                        </button>
                        <h2 className={styles.modalTitle}>신규 현장 인력 요청</h2>
                        
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>현장명</label>
                                <input 
                                    type="text" 
                                    name="siteName"
                                    className={styles.input} 
                                    placeholder="예: 강남구 신축 오피스텔"
                                    value={formData.siteName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>현장 주소 (위치)</label>
                                <input 
                                    type="text" 
                                    name="location"
                                    className={styles.input} 
                                    placeholder="예: 서울 강남구 역삼동"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>필요 기술 스택 (공종)</label>
                                <select 
                                    name="skillRequired"
                                    className={styles.input}
                                    value={formData.skillRequired}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">공종을 선택해주세요</option>
                                    <option value="tile">타일 시공 (대형/졸리컷 등)</option>
                                    <option value="interior">인테리어 내장</option>
                                    <option value="plumbing">설비/배관</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className={styles.formGroup}>
                                    <label>필요 인원</label>
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
                                    <label>투입 예정일</label>
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
                                인력 매칭 요청 완료
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
