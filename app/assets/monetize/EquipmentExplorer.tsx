'use client';

import { useState, useMemo } from 'react';
import styles from './EquipmentExplorer.module.css';
import { Search, Filter, Box, MapPin, ShieldCheck, Zap, ChevronRight, X } from 'lucide-react';
import GlassCard from '@/components/UI/GlassCard';

interface Equipment {
    id: string;
    name: string;
    category: string;
    brand: string;
    location: string;
    rate: string;
    price: string;
    status: 'Available' | 'Reserved' | 'WAITING' | 'RENTING';
    verified: boolean;
    image: string;
}

const MOCK_EQUIPMENT: Equipment[] = [
    {
        id: 'eq1',
        name: '초대형 크레인 (리베르 LTM 11200)',
        category: '중장비',
        brand: '리베르(Liebherr)',
        location: '평택 고덕 현장 근처',
        rate: '하루 285만원',
        price: '별도 문의',
        status: 'Available',
        verified: true,
        image: 'https://images.unsplash.com/photo-1541625602330-2277a1cd1f44?w=500&q=80'
    },
    {
        id: 'eq2',
        name: '다이아몬드 드릴 (힐티 DD-250)',
        category: '전동공구',
        brand: '힐티(Hilti)',
        location: '서울 성수동 센터',
        rate: '하루 8.5만원',
        price: '120만원',
        status: 'Available',
        verified: true,
        image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&q=80'
    },
    {
        id: 'eq3',
        name: '용접기 (밀러 Trailblazer 325)',
        category: '전동공구',
        brand: '밀러(Miller)',
        location: '인천 송도 물류창고',
        rate: '하루 15만원',
        price: '350만원',
        status: 'RENTING',
        verified: false,
        image: 'https://images.unsplash.com/photo-1530124560677-bdaea92c5a3b?w=500&q=80'
    },
    {
        id: 'eq4',
        name: '미니 굴착기 (현대 R35Z-9AK)',
        category: '중장비',
        brand: '현대중공업',
        location: '화성 동탄 작업지',
        rate: '하루 45만원',
        price: '2,800만원',
        status: 'Available',
        verified: true,
        image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500&q=80'
    }
];

export default function EquipmentExplorer({ onClose, onSelect }: { onClose: () => void, onSelect: (eq: Equipment) => void }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('전체');

    const filteredItems = useMemo(() => {
        return MOCK_EQUIPMENT.filter(eq => {
            const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                               eq.brand.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCat = activeCategory === '전체' || eq.category === activeCategory;
            return matchesSearch && matchesCat;
        });
    }, [searchTerm, activeCategory]);

    return (
        <div className={styles.overlay}>
            <div className={styles.panel}>
                <header className={styles.header}>
                    <div className={styles.titleArea}>
                        <button onClick={onClose} className={styles.backBtn}><X size={20} /></button>
                        <h2>장비 탐색기</h2>
                    </div>
                    <div className={styles.searchBar}>
                        <Search size={18} className={styles.searchIcon} />
                        <input 
                            type="text" 
                            placeholder="필요한 장비나 브랜드(보쉬, 힐티 등) 검색" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                <div className={styles.filterTabs}>
                    {['전체', '중장비', '전동공구', '특수장비', '소모품'].map(cat => (
                        <button 
                            key={cat} 
                            className={`${styles.tab} ${activeCategory === cat ? styles.active : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className={styles.grid}>
                    {filteredItems.map(eq => (
                        <GlassCard key={eq.id} className={styles.eqCard} hoverEffect>
                            <div className={styles.imageWrap}>
                                <img src={eq.image} alt={eq.name} />
                                {eq.verified && <div className={styles.verifyBadge}><ShieldCheck size={12} /> 인증됨</div>}
                            </div>
                            <div className={styles.info}>
                                <div className={styles.brandRow}>
                                    <span className={styles.brand}>{eq.brand}</span>
                                    <span className={`${styles.status} ${styles[eq.status]}`}>
                                        {eq.status === 'Available' ? '지금 가능' : '사용중'}
                                    </span>
                                </div>
                                <h4>{eq.name}</h4>
                                <div className={styles.locRow}>
                                    <MapPin size={12} /> <span>{eq.location}</span>
                                </div>
                                <div className={styles.priceRow}>
                                    <div className={styles.rate}>
                                        <span>대여</span>
                                        <strong>{eq.rate}</strong>
                                    </div>
                                    <div className={styles.divider} />
                                    <div className={styles.price}>
                                        <span>구매</span>
                                        <strong>{eq.price}</strong>
                                    </div>
                                </div>
                                <button 
                                    className={styles.selectBtn} 
                                    disabled={eq.status !== 'Available'}
                                    onClick={() => onSelect(eq)}
                                >
                                    {eq.status === 'Available' ? '선택하기' : '예약 대기'}
                                </button>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </div>
    );
}
