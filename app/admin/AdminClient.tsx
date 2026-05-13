'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import GlassCard from '@/components/UI/GlassCard';
import { 
    Activity, 
    Users, 
    Building2, 
    Wallet, 
    TrendingUp, 
    Wrench, 
    LineChart,
    ShieldCheck,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import styles from './page.module.css';

export default function AdminClient() {
    const [activeTab, setActiveTab] = useState<'overview' | 'workforce' | 'finance' | 'rental' | 'marketing'>('overview');

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.titleArea}>
                        <span className={styles.adminBadge}>SUPER ADMIN</span>
                        <h1>MoNo Control Center</h1>
                        <p>플랫폼 전체 데이터, 인력, 파트너 및 금융 흐름 통합 관제</p>
                    </div>
                </header>

                <div className={styles.tabNav}>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.active : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <Activity size={16} /> 플랫폼 현황
                    </button>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === 'workforce' ? styles.active : ''}`}
                        onClick={() => setActiveTab('workforce')}
                    >
                        <Users size={16} /> 파트너 & 인력 관리
                    </button>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === 'finance' ? styles.active : ''}`}
                        onClick={() => setActiveTab('finance')}
                    >
                        <Wallet size={16} /> 금융 & 에스크로
                    </button>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === 'rental' ? styles.active : ''}`}
                        onClick={() => setActiveTab('rental')}
                    >
                        <Wrench size={16} /> 장비 렌탈 관리
                    </button>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === 'marketing' ? styles.active : ''}`}
                        onClick={() => setActiveTab('marketing')}
                    >
                        <LineChart size={16} /> 마케팅 & 신용 평가
                    </button>
                </div>

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className={styles.tabSection}>
                        <div className={styles.statsGrid}>
                            <GlassCard className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <span className={styles.statTitle}>MoNo 총 누적 거래액 (GMV)</span>
                                    <div className={styles.statIcon}><TrendingUp size={20} /></div>
                                </div>
                                <div className={styles.statValue}>₩ 12.8B</div>
                                <div className={styles.statSub}>
                                    <span className={styles.trendUp}><ArrowUpRight size={14} /> +15.2%</span> 이번 달
                                </div>
                            </GlassCard>
                            <GlassCard className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <span className={styles.statTitle}>등록 파트너사 (건설/시공)</span>
                                    <div className={styles.statIcon}><Building2 size={20} /></div>
                                </div>
                                <div className={styles.statValue}>142</div>
                                <div className={styles.statSub}>
                                    <span className={styles.trendUp}><ArrowUpRight size={14} /> +8</span> 이번 달 신규 등록
                                </div>
                            </GlassCard>
                            <GlassCard className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <span className={styles.statTitle}>인증 마스터 인력</span>
                                    <div className={styles.statIcon}><ShieldCheck size={20} /></div>
                                </div>
                                <div className={styles.statValue}>3,450</div>
                                <div className={styles.statSub}>
                                    <span className={styles.trendUp}><ArrowUpRight size={14} /> +124</span> 이번 달 신규 인증
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                )}

                {/* WORKFORCE & PARTNER TAB */}
                {activeTab === 'workforce' && (
                    <div className={styles.tabSection}>
                        <div className={styles.sectionHeader}>
                            <h2>파트너 및 현장 인력 관제</h2>
                            <p>활성 파트너사의 인력 요청 상태 및 투입 현황을 모니터링합니다.</p>
                        </div>
                        <GlassCard className={styles.listCard}>
                            <div className={styles.listItem}>
                                <div className={styles.itemMain}>
                                    <div className={styles.itemAvatar}>SD</div>
                                    <div className={styles.itemInfo}>
                                        <h4>(주)성도디엔씨 (Tier 1 파트너)</h4>
                                        <p>진행 중 현장 4곳 · 매칭 필요 인력 12명</p>
                                    </div>
                                </div>
                                <div className={styles.itemMeta}>
                                    <span className={`${styles.statusBadge} ${styles.active}`}>우수 파트너</span>
                                    <button className={styles.actionBtn}>매칭 지원하기</button>
                                </div>
                            </div>
                            <div className={styles.listItem}>
                                <div className={styles.itemMain}>
                                    <div className={styles.itemAvatar}>GS</div>
                                    <div className={styles.itemInfo}>
                                        <h4>GS건설 리모델링 본부</h4>
                                        <p>진행 중 현장 2곳 · 매칭 필요 인력 5명</p>
                                    </div>
                                </div>
                                <div className={styles.itemMeta}>
                                    <span className={`${styles.statusBadge} ${styles.active}`}>활성</span>
                                    <button className={styles.actionBtn}>매칭 지원하기</button>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                )}

                {/* FINANCE TAB */}
                {activeTab === 'finance' && (
                    <div className={styles.tabSection}>
                        <div className={styles.sectionHeader}>
                            <h2>금융 및 에스크로 관리</h2>
                            <p>MoNo 에스크로 계좌에 보관된 대금 및 정산 예정 금액을 확인합니다.</p>
                        </div>
                        <div className={styles.statsGrid}>
                            <GlassCard className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <span className={styles.statTitle}>에스크로 보관 (결제 대기)</span>
                                </div>
                                <div className={styles.statValue}>₩ 850M</div>
                            </GlassCard>
                            <GlassCard className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <span className={styles.statTitle}>이번 주 정산 완료 금액</span>
                                </div>
                                <div className={styles.statValue}>₩ 120M</div>
                            </GlassCard>
                        </div>
                        <GlassCard className={styles.listCard}>
                            <div className={styles.listItem}>
                                <div className={styles.itemMain}>
                                    <div className={styles.itemAvatar}><Wallet size={20}/></div>
                                    <div className={styles.itemInfo}>
                                        <h4>강남 오피스텔 내장공사 정산 건</h4>
                                        <p>청구액: ₩ 8,750,000 · 출역 승인 완료</p>
                                    </div>
                                </div>
                                <div className={styles.itemMeta}>
                                    <span className={`${styles.statusBadge} ${styles.warning}`}>정산 대기</span>
                                    <button className={`${styles.actionBtn} ${styles.primaryBtn}`}>지급 승인 (플랫폼)</button>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                )}

                {/* RENTAL TAB */}
                {activeTab === 'rental' && (
                    <div className={styles.tabSection}>
                        <div className={styles.sectionHeader}>
                            <h2>프리미엄 장비 렌탈 현황</h2>
                            <p>신용 점수가 높은 마스터에게 대여된 하이엔드 공구 및 장비를 관리합니다.</p>
                        </div>
                        <GlassCard className={styles.listCard}>
                            <div className={styles.listItem}>
                                <div className={styles.itemMain}>
                                    <div className={styles.itemAvatar}><Wrench size={20}/></div>
                                    <div className={styles.itemInfo}>
                                        <h4>Hilti 레이저 레벨기 (PM 30-MG)</h4>
                                        <p>대여자: Young-Hoon Kim (Trust: 96) · 기간: 2024.05.01 - 05.31</p>
                                    </div>
                                </div>
                                <div className={styles.itemMeta}>
                                    <span className={`${styles.statusBadge} ${styles.rented}`}>대여 중</span>
                                    <span style={{ fontSize: '0.85rem', color: '#00f2ff' }}>월 렌탈료: ₩ 45,000</span>
                                </div>
                            </div>
                            <div className={styles.listItem}>
                                <div className={styles.itemMain}>
                                    <div className={styles.itemAvatar}><Wrench size={20}/></div>
                                    <div className={styles.itemInfo}>
                                        <h4>Rubi TX-1250 타일 절단기</h4>
                                        <p>보관 위치: MoNo 강남 물류센터</p>
                                    </div>
                                </div>
                                <div className={styles.itemMeta}>
                                    <span className={`${styles.statusBadge} ${styles.active}`}>대여 가능</span>
                                    <button className={styles.actionBtn}>대여 등록</button>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                )}

                {/* MARKETING & DATA TAB */}
                {activeTab === 'marketing' && (
                    <div className={styles.tabSection}>
                        <div className={styles.sectionHeader}>
                            <h2>데이터 기반 마케팅 및 금융 평가</h2>
                            <p>플랫폼에 축적된 기술자의 현장 이력과 파트너 평가를 기반으로 대출/금융 연계 상품을 기획합니다.</p>
                        </div>
                        <div className={styles.statsGrid}>
                            <GlassCard className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <span className={styles.statTitle}>MoNo 금융 상품 타겟 대상자</span>
                                    <div className={styles.statIcon}><CreditCard size={20} /></div>
                                </div>
                                <div className={styles.statValue}>1,240 명</div>
                                <div className={styles.statSub}>신용 평점 (Trust Score) 85점 이상</div>
                            </GlassCard>
                            <GlassCard className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <span className={styles.statTitle}>평균 렌탈 잔존 가치 추정치</span>
                                    <div className={styles.statIcon}><LineChart size={20} /></div>
                                </div>
                                <div className={styles.statValue}>₩ 25M</div>
                                <div className={styles.statSub}>장비 금융 파트너사 연계 가능</div>
                            </GlassCard>
                        </div>
                        <GlassCard className={styles.listCard} style={{ padding: '24px' }}>
                            <h3 style={{ marginBottom: '16px' }}>진행 중인 데이터 마케팅 캠페인</h3>
                            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                <h4 style={{ color: '#D4AF37', marginBottom: '8px' }}>"마스터 신용 대출 연계" 캠페인 (진행중)</h4>
                                <p style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: '1.6' }}>
                                    MoNo 에스크로 정산 내역 3개월 이상 확인된 기술자를 대상으로, 제휴 은행의 '직장인 신용대출' 수준의 저금리 상품 안내 푸시 발송.
                                    현재 전환율 4.2%.
                                </p>
                            </div>
                        </GlassCard>
                    </div>
                )}
            </div>
        </>
    );
}
