'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { 
    Moon, 
    RefreshCw, 
    BarChart3, 
    Box, 
    Zap, 
    ChevronRight, 
    ShieldCheck, 
    AlertCircle,
    TrendingUp,
    MapPin,
    Package
} from 'lucide-react';

export default function MonetizeClient() {
    const [revenueMode, setRevenueMode] = useState('ALL');

    const NIGHT_ORDERS = [
        { id: 1, title: '배관 누수 긴급 보수', time: '19:00 - 21:00', pay: '₩ 450,000', loc: '반포 아크로리버파크', type: 'AFTER-CARE' },
        { id: 2, title: '전기 패널 오작동 점검', time: '20:00 - 22:00', pay: '₩ 380,000', loc: '잠실 엘스 3단지', type: 'MAINTENANCE' }
    ];

    const CORPORATE_FLEET = [
        { id: 1, name: 'LIEBHERR LTM 11200 (초대형 크레인)', availability: 'Available', rate: '₩ 2,850,000', type: 'HEAVY' },
        { id: 2, name: 'HILTI DD-250 (다이아몬드 코어 드릴)', availability: 'Reserved', rate: '₩ 85,000', type: 'PRECISION' }
    ];

    const P2P_INVENTORY = [
        { id: 1, name: 'HYUNDAI 220-7 (개인 굴착기)', status: 'WAITING', yield: '₩ 350,000', owner: 'Kim Master' },
        { id: 2, name: 'TIG 용접기 리바이브 (Rig)', status: 'RENTING', yield: '₩ 120,000', owner: 'Lee Master' }
    ];

    return (
        <div className={styles.pageWrap}>
            <header className={styles.header}>
                <div className={styles.premiumBadge}>MASTER STRATEGIC MONETIZE | V2 ASSET</div>
                <h1>기술을 <span className={styles.goldText}>황금으로</span> 바꾸는 시간</h1>
                <p className={styles.subtitle}>퇴근 후 하자 보수 부업부터 장비 렌탈 자산화까지, AI가 가이딩합니다.</p>
            </header>

            {/* 1. After-Care Night Master Section */}
            <section className={styles.monetizeSection}>
                <div className={styles.sectionHeader}>
                    <div className={styles.iconTitle}>
                        <Moon size={20} color="#B48A09" />
                        <h3>NIGHT-MASTER | 저녁 하자 보수 부업</h3>
                    </div>
                    <span className={styles.onAir}>LIVE ORDERS</span>
                </div>
                <div className={styles.orderGrid}>
                    {NIGHT_ORDERS.map(order => (
                        <div key={order.id} className={styles.orderCard}>
                            <div className={styles.cardInfo}>
                                <div className={styles.typeBadge}>{order.type}</div>
                                <h4>{order.title}</h4>
                                <div className={styles.metaRow}>
                                    <MapPin size={12} /> <span>{order.loc}</span>
                                    <div className={styles.divider} />
                                    <span>{order.time}</span>
                                </div>
                            </div>
                            <div className={styles.cardAction}>
                                <div className={styles.payText}>{order.pay}</div>
                                <button className={styles.acceptBtn}>수락하기</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 2. Strategy Grid: Corporate Fleet | P2P Inventory | AI R&R */}
            <div className={styles.strategyGrid}>
                {/* A. MO-NO Corporate Fleet (Primary) */}
                <div className={styles.strategyCard}>
                    <div className={styles.cardHeader}>
                        <ShieldCheck size={18} color="#B48A09" />
                        <h3>MO-NO CORPORATE FLEET | 기업 직영 렌털</h3>
                    </div>
                    <div className={styles.assetList}>
                        {CORPORATE_FLEET.map(asset => (
                            <div key={asset.id} className={styles.assetItem}>
                                <div className={styles.assetMain}>
                                    <Box size={16} color="#B48A09" />
                                    <div className={styles.assetName}>
                                        <p>{asset.name}</p>
                                        <span>리스료: <strong>{asset.rate}</strong> / 일</span>
                                    </div>
                                </div>
                                <div className={`${styles.statusBadge} ${styles[asset.availability]}`}>
                                    {asset.availability}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className={styles.fleetBtn}>플랫폼 직영 리스 신청하기</button>
                </div>

                {/* B. P2P Master Inventory (Secondary) */}
                <div className={styles.strategyCard}>
                    <div className={styles.cardHeader}>
                        <RefreshCw size={18} color="#94A3B8" />
                        <h3>P2P MASTER INVENTORY | 개인 위탁 수익화</h3>
                    </div>
                    <div className={styles.assetList}>
                        {P2P_INVENTORY.map(asset => (
                            <div key={asset.id} className={styles.assetItem}>
                                <div className={styles.assetMain}>
                                    <Package size={16} color="#94A3B8" />
                                    <div className={styles.assetName}>
                                        <p>{asset.name}</p>
                                        <span>배분 수익: <strong>{asset.yield}</strong></span>
                                    </div>
                                </div>
                                <div className={`${styles.statusBadge} ${styles[asset.status]}`}>
                                    {asset.status}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className={styles.p2pBtn}>+ 내 장비 위탁 관리 신청</button>
                </div>

                {/* C. AI R&R Strategy Insights */}
                <div className={styles.aiStrategyCard}>
                    <div className={styles.cardHeader}>
                        <TrendingUp size={18} color="#B48A09" />
                        <h3>AI R&R | 장비 자산 교체 전략</h3>
                    </div>
                    <div className={styles.aiReport}>
                        <div className={styles.reportMain}>
                            <span className={styles.reportLabel}>ASSET HEALTH SCORE</span>
                            <div className={styles.healthValue}>74 / 100 <AlertCircle size={14} color="#ef4444" /></div>
                            <p className={styles.reportInsite}>보유 장비의 감가 상각이 매각 임계점에 도달했습니다. <strong>기업형 리스(New Model)</strong> 전환 시 수익성 상승.</p>
                        </div>
                        <div className={styles.rAndRstats}>
                            <div className={styles.statBox}>
                                <span>예상 매각가</span>
                                <strong>₩ 4,200만</strong>
                            </div>
                            <div className={styles.statBox}>
                                <span>순수익 변화</span>
                                <strong className={styles.plusText}>+ 22%</strong>
                            </div>
                        </div>
                    </div>
                    <button className={styles.planBtn}>교체 전략 상세 리포트 <ChevronRight size={14} /></button>
                </div>
            </div>

            <footer className={styles.footer}>
                <ShieldCheck size={14} color="#B48A09" />
                <p>MO-NO 에스크로가 안전한 하자 보수 정산과 렌탈 계약을 보증합니다.</p>
            </footer>
        </div>
    );
}
