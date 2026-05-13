'use client';

import React, { useState } from 'react';
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
    CheckCircle2
} from 'lucide-react';
import styles from './page.module.css';

interface SiteRequest {
    id: string;
    name: string;
    location: string;
    workersNeeded: number;
    status: 'Matching' | 'Deployed' | 'Completed';
    startDate: string;
}

const INITIAL_SITES: SiteRequest[] = [
    {
        id: 'REQ-2024-001',
        name: '서울 강남구 하이엔드 오피스텔 내장공사',
        location: '서울 강남구 역삼동',
        workersNeeded: 5,
        status: 'Deployed',
        startDate: '2024.05.15'
    },
    {
        id: 'REQ-2024-002',
        name: '판교 테크노밸리 신축 사옥 타일 시공',
        location: '경기 성남시 분당구',
        workersNeeded: 3,
        status: 'Matching',
        startDate: '2024.05.20'
    }
];

export default function PartnerClient() {
    const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'settlement' | 'evaluation'>('overview');
    const [sites, setSites] = useState<SiteRequest[]>(INITIAL_SITES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        siteName: '',
        location: '',
        workersCount: '',
        startDate: '',
        skillRequired: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newSite: SiteRequest = {
            id: `REQ-${new Date().getFullYear()}-00${sites.length + 1}`,
            name: formData.siteName,
            location: formData.location,
            workersNeeded: parseInt(formData.workersCount) || 1,
            status: 'Matching',
            startDate: formData.startDate || new Date().toLocaleDateString()
        };

        setSites([newSite, ...sites]);
        setIsModalOpen(false);
        setFormData({ siteName: '', location: '', workersCount: '', startDate: '', skillRequired: '' });
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.titleArea}>
                        <h1>MoNo Partner Portal</h1>
                        <p>안전하고 투명한 글로벌 현장 인력 관리 센터</p>
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
                        <Star size={16} /> 마스터 평가
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
                                <div className={styles.statValue}>{sites.length}</div>
                                <div className={styles.statSub}>현재 매칭/투입 진행 중</div>
                            </GlassCard>
                            <GlassCard className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <span className={styles.statTitle}>투입된 마스터 인력</span>
                                    <div className={styles.statIcon}><Users size={20} /></div>
                                </div>
                                <div className={styles.statValue}>
                                    {sites.filter(s => s.status === 'Deployed').reduce((acc, curr) => acc + curr.workersNeeded, 0)}
                                </div>
                                <div className={styles.statSub}>실시간 현장 출역 확인됨</div>
                            </GlassCard>
                            <GlassCard className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <span className={styles.statTitle}>예상 에스크로 정산액</span>
                                    <div className={styles.statIcon}><Wallet size={20} /></div>
                                </div>
                                <div className={styles.statValue}>₩12,500,000</div>
                                <div className={styles.statSub}>MoNo 안전 결제 보호 중</div>
                            </GlassCard>
                        </div>

                        <div className={styles.mainActionArea}>
                            <GlassCard className={styles.newRequestCard}>
                                <div className={styles.actionText}>
                                    <h2>새로운 현장 인력 등록</h2>
                                    <p>MoNo의 검증된 기술 마스터들을 현장에 매칭하세요.</p>
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
                                {sites.map(site => (
                                    <GlassCard key={site.id} className={styles.siteCard}>
                                        <div className={styles.siteInfo}>
                                            <h4>{site.name}</h4>
                                            <div className={styles.siteMeta}>
                                                <span><MapPin size={14} style={{ display: 'inline', marginRight: 4 }}/>{site.location}</span>
                                                <span><Users size={14} style={{ display: 'inline', marginRight: 4 }}/>필요 인원: {site.workersNeeded}명</span>
                                                <span><Calendar size={14} style={{ display: 'inline', marginRight: 4 }}/>투입 예정: {site.startDate}</span>
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
                            <p>오늘 현장에 투입된 마스터들의 출근 여부를 확인하고 승인합니다.</p>
                        </div>
                        <GlassCard className={styles.listCard}>
                            <div className={styles.listItem}>
                                <div className={styles.itemInfo}>
                                    <h4>Young-Hoon Kim (타일 마스터)</h4>
                                    <p>서울 강남구 하이엔드 오피스텔 내장공사</p>
                                </div>
                                <div className={styles.itemActions}>
                                    <span className={styles.timeTag}>07:50 AM 도착 확인됨</span>
                                    <button className={styles.approveBtn}><CheckCircle2 size={16}/> 출근 승인</button>
                                </div>
                            </div>
                            <div className={styles.listItem}>
                                <div className={styles.itemInfo}>
                                    <h4>Ji-Sung Park (설비 마스터)</h4>
                                    <p>서울 강남구 하이엔드 오피스텔 내장공사</p>
                                </div>
                                <div className={styles.itemActions}>
                                    <span className={styles.timeTag}>08:05 AM 도착 확인됨</span>
                                    <button className={styles.approveBtn}><CheckCircle2 size={16}/> 출근 승인</button>
                                </div>
                            </div>
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
                            <div className={styles.listItem}>
                                <div className={styles.itemInfo}>
                                    <h4>[정산 대기] 강남구 오피스텔 현장 (5월 1주차)</h4>
                                    <p>투입 인원 5명 / 총 25공수</p>
                                </div>
                                <div className={styles.itemActions}>
                                    <span className={styles.amountText}>₩ 8,750,000</span>
                                    <button className={styles.payBtn}>에스크로 결제 승인</button>
                                </div>
                            </div>
                        </GlassCard>
                    </section>
                )}

                {activeTab === 'evaluation' && (
                    <section className={styles.tabSection}>
                        <div className={styles.sectionHeader}>
                            <h2>현장 인력 평가</h2>
                            <p>작업이 완료된 마스터를 평가하여 파트너사의 신뢰도를 높이고 우수 인력을 선점하세요.</p>
                        </div>
                        <GlassCard className={styles.listCard}>
                            <div className={styles.listItem}>
                                <div className={styles.itemInfo}>
                                    <h4>Min-Soo Lee (인테리어 목수)</h4>
                                    <p>판교 테크노밸리 신축 사옥 (작업 종료)</p>
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
