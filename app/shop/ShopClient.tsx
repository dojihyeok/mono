'use client';

import { useState } from 'react';
import Image from 'next/image';
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
            name: 'SIG-1 전문가 시그니처 수트', 
            category: 'FASHION',
            price: '₩ 485,000', 
            desc: '옵시디언 블랙 스트레치 원단, 내화 및 내마모 쉴드 적용.',
            tag: '전문가 전용',
            rating: 5.0,
            image: '/shop/workwear.png'
        },
        { 
            id: 2, 
            name: 'Titanium X-Tool Kit (Black Ed.)', 
            category: 'GEAR',
            price: '₩ 1,250,000', 
            desc: '티타늄 합금 기반, 모노 전문가 로고 레이저 각인.',
            tag: '프리미엄 세트',
            rating: 4.9,
            image: '/shop/tools.png'
        },
        { 
            id: 3, 
            name: 'Night-Master Tactical Vest', 
            category: 'FASHION',
            price: '₩ 242,000', 
            desc: '하자 보수 부업 전용, 수납 최적화 및 반사 광학 패치.',
            tag: 'SIDE-HUSTLE',
            rating: 4.8,
            image: '/shop/workwear.png'
        },
        { 
            id: 4, 
            name: 'Hilti PM 30-MG 레이저 레벨기', 
            category: 'INVESTMENT',
            price: '₩ 10,000 / 1지분', 
            desc: '렌탈 수익 공유형 공동 소유권. 총 150지분 펀딩 진행 중.',
            tag: '공동소유 펀딩',
            rating: 5.0,
            image: '/shop/laser.png',
            funding: {
                current: 85,
                total: 150,
                yield: '예상 연 수익률 12.4%',
                investors: 42
            }
        },
        { 
            id: 5, 
            name: 'Rubi TX-1250 MAX 타일 절단기', 
            category: 'INVESTMENT',
            price: '₩ 50,000 / 1지분', 
            desc: '초대형 타일 커팅용 고가 장비. B2B 파트너 우선 대여 배정.',
            tag: '공동소유 펀딩',
            rating: 4.9,
            image: '/shop/cutter.png',
            funding: {
                current: 20,
                total: 50,
                yield: '예상 연 수익률 15.2%',
                investors: 14
            }
        }
    ];

    return (
        <div className={styles.pageWrap}>
            <header className={styles.header}>
                <div className={styles.premiumBadge}>모노 전문가 공식 스토어</div>
                <h1>기술자의 <span className={styles.goldText}>시그니처 장비 & 자산</span></h1>
                <p className={styles.subtitle}>현장의 권위를 완성하는 장비를 직접 구매하거나, 공동 소유를 통해 렌탈 수익을 공유받으세요.</p>
            </header>

            {/* Shop Navigation */}
            <div className={styles.shopTabs}>
                <button className={`${styles.shopTab} ${selectedCategory === 'ALL' ? styles.active : ''}`} onClick={() => setSelectedCategory('ALL')}>전체 상품</button>
                <button className={`${styles.shopTab} ${selectedCategory === 'FASHION' ? styles.active : ''}`} onClick={() => setSelectedCategory('FASHION')}>워크웨어</button>
                <button className={`${styles.shopTab} ${selectedCategory === 'GEAR' ? styles.active : ''}`} onClick={() => setSelectedCategory('GEAR')}>전문 장비 구매</button>
                <button className={`${styles.shopTab} ${selectedCategory === 'INVESTMENT' ? styles.active : ''}`} onClick={() => setSelectedCategory('INVESTMENT')}>장비 펀딩 (공동 소유)</button>
            </div>

            {/* Product Gallery Grid */}
            <section className={styles.productGrid}>
                {GEAR_PRODUCTS.filter(p => selectedCategory === 'ALL' || p.category === selectedCategory).map(product => (
                    <div key={product.id} className={styles.productCard}>
                        <div className={styles.productVisual}>
                            <div className={styles.productBadge} style={product.category === 'INVESTMENT' ? { background: '#30d158', color: '#000' } : {}}>{product.tag}</div>
                            {product.image ? (
                                <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover', opacity: 0.85 }} />
                            ) : (
                                <div className={styles.visualPlaceholder}>
                                    {product.category === 'FASHION' ? <Shirt size={48} /> : 
                                     product.category === 'INVESTMENT' ? <Zap size={48} color="#30d158" /> : <Wrench size={48} />}
                                </div>
                            )}
                        </div>
                        <div className={styles.productInfo}>
                            <div className={styles.metaRow}>
                                <div className={styles.rating}>
                                    <Star size={10} fill="#D4AF37" color="#D4AF37" />
                                    <span>{product.rating}</span>
                                </div>
                                <span className={styles.catText}>{product.category}</span>
                            </div>
                            <h3>{product.name}</h3>
                            <p>{product.desc}</p>
                            
                            {product.funding && (
                                <div className={styles.fundingMeta}>
                                    <div className={styles.yieldText}>
                                        <span>{product.funding.yield}</span>
                                        <span>{Math.round((product.funding.current / product.funding.total) * 100)}% 달성</span>
                                    </div>
                                    <div className={styles.fundingProgress}>
                                        <div className={styles.fundingFill} style={{ width: `${(product.funding.current / product.funding.total) * 100}%` }}></div>
                                    </div>
                                    <div className={styles.fundingDetail}>
                                        <span>현재 참여: {product.funding.investors}명</span>
                                        <span>{product.funding.current} / {product.funding.total} 지분</span>
                                    </div>
                                </div>
                            )}

                            <div className={styles.priceRow} style={product.funding ? { marginTop: '1rem' } : {}}>
                                <span className={styles.price}>{product.price}</span>
                                <button className={styles.addBtn} style={product.category === 'INVESTMENT' ? { background: '#30d158', color: '#000' } : {}}>
                                    {product.category === 'INVESTMENT' ? '지분 투자하기' : <><ShoppingBag size={14} /> 구매하기</>}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Gear Certification Banner */}
            <section className={styles.certBanner}>
                <div className={styles.certInfo}>
                    <ShieldCheck size={28} color="#D4AF37" />
                    <div className={styles.certText}>
                        <h4>OFFICIAL EXPERT CERTIFICATION</h4>
                        <p>본 스토어의 모든 상품은 모노 전문가 위원회의 엄격한 필드 테스트를 통과한 정품입니다.</p>
                    </div>
                </div>
                <div className={styles.shippingInfo}>
                    <Truck size={18} />
                    <span>글로벌 현장 특급 배송 지원</span>
                </div>
            </section>

            <footer className={styles.footer}>
                <div className={styles.footerBrand}>MONO OFFICIAL STORE</div>
                <p>Copyright 2026 MONO Masters Agency. All rights reserved.</p>
            </footer>
        </div>
    );
}
