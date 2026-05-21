'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import { 
    ShoppingBag, 
    Zap, 
    ShieldCheck, 
    ChevronRight, 
    Star, 
    Truck,
    Wrench,
    Coins,
    BarChart3,
    ArrowUpRight,
    Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShopClient() {
    const [viewMode, setViewMode] = useState<'buy' | 'rental' | 'funding'>('buy');

    const SHOP_ITEMS = [
        { 
            id: 1, 
            name: 'SIG-1 전문가 시그니처 수트', 
            type: 'buy',
            price: '₩ 485,000', 
            desc: '옵시디언 블랙 스트레치 원단, 내화 및 내마모 쉴드 적용.',
            tag: '베스트셀러',
            rating: 5.0
        },
        { 
            id: 2, 
            name: 'Titanium X-Tool Kit', 
            type: 'buy',
            price: '₩ 1,250,000', 
            desc: '티타늄 합금 기반, 모노 전문가 로고 레이저 각인.',
            tag: '프리미엄',
            rating: 4.9
        },
        { 
            id: 3, 
            name: '초고압 워터젯 절단기', 
            type: 'rental',
            price: '₩ 120,000 / 일', 
            owner: 'COMPANY',
            desc: '정밀 플랜트 작업용. 모노 소유 장비로 즉시 대여 가능.',
            tag: '즉시대여'
        },
        { 
            id: 4, 
            name: '배관 내시경 로봇 (K-7)', 
            type: 'rental',
            price: '₩ 85,000 / 일', 
            owner: 'WORKER_FUNDED',
            desc: '노동자 12인 공동 투자 장비. 대여료의 30%가 투자자에게 배당.',
            tag: '수익공유'
        },
        { 
            id: 5, 
            name: '평택 P4 현장 지원 차량 펀딩', 
            type: 'funding',
            target: '₩ 45,000,000',
            progress: 82,
            yield: '연 12.5%',
            desc: '현장 전문가 전용 셔틀 운영 및 자산 공유 프로젝트.',
            tag: '모집중'
        }
    ];

    return (
        <div className={styles.pageWrap}>
            {/* Header Area */}
            <header className={styles.shopHeader}>
                <div className={styles.headerLeft}>
                    <div className={styles.categoryBadge}>PREMIUM STORE</div>
                    <h1>스마트 스토어 & <span className="gradient-text">에셋</span></h1>
                </div>
                <div className={styles.headerRight}>
                    <div className={styles.balanceInfo}>
                        <Coins size={14} />
                        <span>12,450 P</span>
                    </div>
                </div>
            </header>

            {/* View Tabs */}
            <div className={styles.viewTabs}>
                <button 
                    className={`${styles.viewTab} ${viewMode === 'buy' ? styles.active : ''}`}
                    onClick={() => setViewMode('buy')}
                >
                    <ShoppingBag size={18} />
                    쇼핑몰
                </button>
                <button 
                    className={`${styles.viewTab} ${viewMode === 'rental' ? styles.active : ''}`}
                    onClick={() => setViewMode('rental')}
                >
                    <Wrench size={18} />
                    렌탈/대여
                </button>
                <button 
                    className={`${styles.viewTab} ${viewMode === 'funding' ? styles.active : ''}`}
                    onClick={() => setViewMode('funding')}
                >
                    <BarChart3 size={18} />
                    장비투자
                </button>
            </div>

            {/* Dynamic Content */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={viewMode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={styles.contentGrid}
                >
                    {SHOP_ITEMS.filter(item => item.type === viewMode).map(item => (
                        <div key={item.id} className={styles.itemCard}>
                            <div className={styles.itemVisual}>
                                <div className={styles.itemTag}>{item.tag}</div>
                                {viewMode === 'funding' ? <BarChart3 size={48} className={styles.placeholderIcon} /> : <Wrench size={48} className={styles.placeholderIcon} />}
                            </div>
                            
                            <div className={styles.itemInfo}>
                                <div className={styles.itemHeader}>
                                    <h3>{item.name}</h3>
                                    {viewMode === 'rental' && (
                                        <span className={styles.ownerBadge}>
                                            {item.owner === 'COMPANY' ? '회사 소유' : '공동 투자'}
                                        </span>
                                    )}
                                </div>
                                <p className={styles.itemDesc}>{item.desc}</p>
                                
                                {viewMode === 'funding' ? (
                                    <div className={styles.fundingArea}>
                                        <div className={styles.fundingMeta}>
                                            <span className={styles.yield}>예상 수익률 <strong>{item.yield}</strong></span>
                                            <span className={styles.progressText}>{item.progress}%</span>
                                        </div>
                                        <div className={styles.progressBar}>
                                            <div className={styles.progressFill} style={{ width: `${item.progress}%` }} />
                                        </div>
                                        <div className={styles.fundingFooter}>
                                            <span>목표 {item.target}</span>
                                            <button className={styles.actionBtnPrimary}>투자하기 <ArrowUpRight size={14} /></button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.itemFooter}>
                                        <div className={styles.priceInfo}>
                                            <span className={styles.priceLabel}>{viewMode === 'buy' ? '판매가' : '대여료'}</span>
                                            <span className={styles.priceValue}>{item.price}</span>
                                        </div>
                                        <button className={styles.actionBtn}>
                                            {viewMode === 'buy' ? '구매하기' : '대여하기'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Certification / Footer Banner */}
            <section className={styles.infoBanner}>
                <div className={styles.infoBox}>
                    <ShieldCheck size={24} />
                    <div>
                        <h4>품질 및 자산 보증</h4>
                        <p>모든 장비는 모노 표준 규격을 준수하며, 투명한 수익 배분을 보장합니다.</p>
                    </div>
                </div>
                <div className={styles.infoBox}>
                    <Lock size={24} />
                    <div>
                        <h4>안전 거래 서비스</h4>
                        <p>결제 및 대금 정산은 모노 스마트 컨트랙트를 통해 안전하게 처리됩니다.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
