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
    // 용어 매핑 테이블 (어르신들도 이해하기 쉽게)
    const STATUS_LABELS: Record<string, string> = {
        'Available': '빌리기 가능',
        'Reserved': '누가 예약함',
        'WAITING': '빌려줄 준비됨',
        'RENTING': '남이 빌려가는 중'
    };

    const NIGHT_ORDERS = [
        { id: 1, title: '급한 배관 고치기 (누수)', time: '저녁 7시 - 9시', pay: '45만원', loc: '반포 아크로리버파크', type: '급한 수리' },
        { id: 2, title: '차단기 내려간 것 점검', time: '저녁 8시 - 10시', pay: '38만원', loc: '잠실 엘스 3단지', type: '정기 점검' }
    ];

    const CORPORATE_FLEET = [
        { id: 1, name: '초대형 크레인 (리베르 LTM 11200)', availability: 'Available', rate: '285만원', type: '대형 장비' },
        { id: 2, name: '다이아몬드 드릴 (힐티 DD-250)', availability: 'Reserved', rate: '85,000원', type: '정밀 도구' }
    ];

    const P2P_INVENTORY = [
        { id: 1, name: '개인 굴착기 (현대 220-7)', status: 'WAITING', yield: '35만원', owner: '김 씨' },
        { id: 2, name: '용접기 (리바이브 TIG)', status: 'RENTING', yield: '12만원', owner: '이 씨' }
    ];

    return (
        <div className={styles.pageWrap}>
            <header className={styles.header}>
                <div className={styles.premiumBadge}>마스터 장비로 돈 벌기 센터</div>
                <h1>내 실력과 장비로 <span className={styles.goldText}>돈 벌기</span></h1>
                <p className={styles.subtitle}>퇴근하고 잠깐 일해서 돈 벌고, 안 쓰는 내 연장 빌려주고 수익을 만드세요.</p>
            </header>

            {/* 1. 저녁 일거리 섹션 */}
            <section className={styles.monetizeSection}>
                <div className={styles.sectionHeader}>
                    <div className={styles.iconTitle}>
                        <Moon size={20} color="#B48A09" />
                        <h3>오늘 퇴근길 저녁 알바 (꿀잡)</h3>
                    </div>
                    <span className={styles.onAir}>지금 바로 가능한 일</span>
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
                                <button className={styles.acceptBtn}>제가 할게요 (수락)</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 2. 장비 빌리기/빌려주기/새로 사기 */}
            <div className={styles.strategyGrid}>
                {/* A. 빌려 쓰기 */}
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
                                    {STATUS_LABELS[asset.availability]}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className={styles.fleetBtn}>장비 빌리기 신청하기</button>
                </div>

                {/* B. 내 장비 빌려주기 */}
                <div className={styles.strategyCard}>
                    <div className={styles.cardHeader}>
                        <RefreshCw size={18} color="#94A3B8" />
                        <h3>내 장비 남한테 빌려주기</h3>
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
                                    {STATUS_LABELS[asset.status]}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className={styles.p2pBtn}>+ 내 장비 빌려주고 돈 받기</button>
                </div>

                {/* C. 새로 사기 가이드 */}
                <div className={styles.aiStrategyCard}>
                    <div className={styles.cardHeader}>
                        <TrendingUp size={18} color="#B48A09" />
                        <h3>똑똑한 장비 관리 (팔고 사기)</h3>
                    </div>
                    <div className={styles.aiReport}>
                        <div className={styles.reportMain}>
                            <span className={styles.reportLabel}>내 장비 건강 점수</span>
                            <div className={styles.healthValue}>74점 / 100점 <AlertCircle size={14} color="#ef4444" /></div>
                            <p className={styles.reportInsite}>지금 쓰시는 장비는 팔고 <strong>새 장비</strong>로 바꾸시는 게 좋습니다. 한달 벌이가 훨씬 늘어납니다.</p>
                        </div>
                        <div className={styles.rAndRstats}>
                            <div className={styles.statBox}>
                                <span>팔면 받는 돈</span>
                                <strong>4,200만원</strong>
                            </div>
                            <div className={styles.statBox}>
                                <span>벌이 변화</span>
                                <strong className={styles.plusText}>+ 22% 더 벌기</strong>
                            </div>
                        </div>
                    </div>
                    <button className={styles.planBtn}>새 장비로 바꾸기 상담 받기 <ChevronRight size={14} /></button>
                </div>
            </div>

            <footer className={styles.footer}>
                <ShieldCheck size={14} color="#B48A09" />
                <p>모노가 일당과 렌탈비를 떼이지 않게 안전하게 받아드립니다.</p>
            </footer>
        </div>
    );
}
