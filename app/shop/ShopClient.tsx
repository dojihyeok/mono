'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { 
    ShoppingBag, 
    Award, 
    Zap, 
    ShieldCheck, 
    ChevronRight, 
    Star, 
    Truck,
    Package,
    Shirt,
    Wrench
} from 'lucide-react';

export default function ShopClient() {
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    const GEAR_PRODUCTS = [
        { 
            id: 1, 
            name: 'SIG-1 Master Signature Suit', 
            category: 'FASHION',
            price: '₩ 485,000', 
            desc: '옵시디언 블랙 스트레치 원단, 내화 및 내마모 쉴드 적용.',
            tag: 'MASTER ONLY',
            rating: 5.0
        },
        { 
            id: 2, 
            name: 'Titanium X-Tool Kit (Black Ed.)', 
            category: 'GEAR',
            price: '₩ 1,250,000', 
            desc: '티타늄 합금 기반, MO-NO 마스터 로고 레이저 각인.',
            tag: 'PREMIUM PKG',
            rating: 4.9
        },
        { 
            id: 3, 
            name: 'Night-Master Tactical Vest', 
            category: 'FASHION',
            price: '₩ 242,000', 
            desc: '하자 보수 부업 전용, 수납 최적화 및 반사 광학 패치.',
            tag: 'SIDE-HUSTLE',
            rating: 4.8
        },
        { 
            id: 4, 
            name: 'Aero-Shell Masters Jacket', 
            category: 'FASHION',
            price: '₩ 350,000', 
            desc: '통기성 멤브레인 처리, 현장에서 사적인 모임까지 완벽한 핏.',
            tag: 'WORK-LEISURE',
            rating: 4.9
        }
    ];

    return (
        <div className={styles.pageWrap}>
            <header className={styles.header}>
                <div className={styles.premiumBadge}>MO-NO 마스터 공식 스토어</div>
                <h1>기술자의 <span className={styles.goldText}>시그니처 기어</span></h1>
                <p className={styles.subtitle}>현장의 권위와 숙련된 자부심을 완성하는 프로페셔널 업무 인프라.</p>
            </header>

            {/* Shop Navigation */}
            <div className={styles.shopTabs}>
                <button className={`${styles.shopTab} ${selectedCategory === 'ALL' ? styles.active : ''}`} onClick={() => setSelectedCategory('ALL')}>전체 상품</button>
                <button className={`${styles.shopTab} ${selectedCategory === 'FASHION' ? styles.active : ''}`} onClick={() => setSelectedCategory('FASHION')}>워크웨어</button>
                <button className={`${styles.shopTab} ${selectedCategory === 'GEAR' ? styles.active : ''}`} onClick={() => setSelectedCategory('GEAR')}>전문 장비</button>
            </div>

            {/* Product Gallery Grid */}
            <section className={styles.productGrid}>
                {GEAR_PRODUCTS.filter(p => selectedCategory === 'ALL' || p.category === selectedCategory).map(product => (
                    <div key={product.id} className={styles.productCard}>
                        <div className={styles.productVisual}>
                            <div className={styles.productBadge}>{product.tag}</div>
                            {/* Product Icon/Visual Placeholder */}
                            <div className={styles.visualPlaceholder}>
                                {product.category === 'FASHION' ? <Shirt size={48} /> : <Wrench size={48} />}
                            </div>
                        </div>
                        <div className={styles.productInfo}>
                            <div className={styles.metaRow}>
                                <div className={styles.rating}>
                                    <Star size={10} fill="#B48A09" color="#B48A09" />
                                    <span>{product.rating}</span>
                                </div>
                                <span className={styles.catText}>{product.category}</span>
                            </div>
                            <h3>{product.name.replace('Tactical Vest', 'Professional Vest')}</h3>
                            <p>{product.desc}</p>
                            <div className={styles.priceRow}>
                                <span className={styles.price}>{product.price}</span>
                                <button className={styles.addBtn}>
                                    <ShoppingBag size={14} /> 장바구니 담기
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Gear Certification Banner */}
            <section className={styles.certBanner}>
                <div className={styles.certInfo}>
                    <ShieldCheck size={28} color="#B48A09" />
                    <div className={styles.certText}>
                        <h4>OFFICIAL MASTER CERTIFICATION</h4>
                        <p>본 스토어의 모든 상품은 MO-NO 마스터 위원회의 엄격한 필드 테스트를 통과한 정품입니다.</p>
                    </div>
                </div>
                <div className={styles.shippingInfo}>
                    <Truck size={18} />
                    <span>글로벌 현장 특급 배송 지원</span>
                </div>
            </section>

            <footer className={styles.footer}>
                <div className={styles.footerBrand}>MO-NO OFFICIAL STORE</div>
                <p>Copyright 2026 MO-NO Masters Agency. All rights reserved.</p>
            </footer>
        </div>
    );
    );
}
