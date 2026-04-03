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
        { id: 1, title: '배관 누수 긴급 수리', time: '저녁 7시 - 9시', pay: '45만원', loc: '반포 아크로리버파크', type: '급한 수리' },
        { id: 2, title: '전기 차단기 점검', time: '저녁 8시 - 10시', pay: '38만원', loc: '잠실 엘스 3단지', type: '정기 점검' }
    ];

    const CORPORATE_FLEET = [
        { id: 1, name: '초대형 크레인 (리베르 LTM 11200)', availability: '빌리기 가능', rate: '285만원', type: '대형 장비' },
        { id: 2, name: '다이아몬드 드릴 (힐티 DD-250)', availability: '예약됨', rate: '8만 5천원', type: '정밀 도구' }
    ];

    const P2P_INVENTORY = [
        { id: 1, name: '개인 굴착기 (현대 220-7)', status: '대기 중', yield: '35만원', owner: '김 마스터' },
        { id: 2, name: 'TIG 용접기 (리바이브)', status: '빌려주는 중', yield: '12만원', owner: '이 마스터' }
    ];

    return (
        <div className={styles.pageWrap}>
            <header className={styles.header}>
                <div className={styles.premiumBadge}>마스터 장비 돈 벌기 센터 | 장비 관리</div>
                <h1>내 기술과 장비로 <span className={styles.goldText}>추가 수익</span> 만들기</h1>
                <p className={styles.subtitle}>퇴근 후 가벼운 수리 부업부터, 내가 안 쓰는 장비 빌려주기까지 한눈에 관리하세요.</p>
            </header>

            {/* 1. After-Care Night Master Section */}
            <section className={styles.monetizeSection}>
                <div className={styles.sectionHeader}>
                    <div className={styles.iconTitle}>
                        <Moon size={20} color="#B48A09" />
                        <h3>퇴근 길 저녁 알바 (꿀잡)</h3>
                    </div>
                    <span className={styles.onAir}>지금 가능한 일감</span>
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
                        <h3>모노 본사 장비 빌려 쓰기</h3>
                    </div>
                    <div className={styles.assetList}>
                        {CORPORATE_FLEET.map(asset => (
                            <div key={asset.id} className={styles.assetItem}>
                                <div className={styles.assetMain}>
                                    <Box size={16} color="#B48A09" />
                                    <div className={styles.assetName}>
                                        <p>{asset.name}</p>
                                        <span>하루 빌리는 값: <strong>{asset.rate}</strong></span>
                                    </div>
                                </div>
                                <div className={`${styles.statusBadge} ${styles[asset.availability]}`}>
                                    {asset.availability}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className={styles.fleetBtn}>본사 장비 빌리기 신청</button>
                </div>

                {/* B. P2P Master Inventory (Secondary) */}
                <div className={styles.strategyCard}>
                    <div className={styles.cardHeader}>
                        <RefreshCw size={18} color="#94A3B8" />
                        <h3>내 장비 이웃에게 빌려주기</h3>
                    </div>
                    <div className={styles.assetList}>
                        {P2P_INVENTORY.map(asset => (
                            <div key={asset.id} className={styles.assetItem}>
                                <div className={styles.assetMain}>
                                    <Package size={16} color="#94A3B8" />
                                    <div className={styles.assetName}>
                                        <p>{asset.name}</p>
                                        <span>내가 받는 돈: <strong>{asset.yield}</strong></span>
                                    </div>
                                </div>
                                <div className={`${styles.statusBadge} ${styles[asset.status]}`}>
                                    {asset.status}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className={styles.p2pBtn}>+ 내 장비 빌려주고 돈 벌기 신청</button>
                </div>

                {/* C. AI R&R Strategy Insights */}
                <div className={styles.aiStrategyCard}>
                    <div className={styles.cardHeader}>
                        <TrendingUp size={18} color="#B48A09" />
                        <h3>똑똑한 장비 교체 도우미</h3>
                    </div>
                    <div className={styles.aiReport}>
                        <div className={styles.reportMain}>
                            <span className={styles.reportLabel}>내 장비 건강 상태 점수</span>
                            <div className={styles.healthValue}>74점 / 100점 <AlertCircle size={14} color="#ef4444" /></div>
                            <p className={styles.reportInsite}>보유하신 장비의 값이 지금 팔기에 딱 좋습니다. <strong>본사 새 장비</strong>로 바꾸시면 벌이가 더 늘어납니다.</p>
                        </div>
                        <div className={styles.rAndRstats}>
                            <div className={styles.statBox}>
                                <span>팔았을 때 받는 돈</span>
                                <strong>4,200만원</strong>
                            </div>
                            <div className={styles.statBox}>
                                <span>한달 벌이 변화</span>
                                <strong className={styles.plusText}>+ 22% 더 벌기</strong>
                            </div>
                        </div>
                    </div>
                    <button className={styles.planBtn}>장비 교체 리포트 보기 <ChevronRight size={14} /></button>
                </div>
            </div>

            <footer className={styles.footer}>
                <ShieldCheck size={14} color="#B48A09" />
                <p>모노 안전 결제로 일당과 렌탈비를 확실하게 보장해 드립니다.</p>
            </footer>
        </div>
    );
}
