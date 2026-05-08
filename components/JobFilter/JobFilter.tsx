'use client';

import { useState } from 'react';
import styles from './JobFilter.module.css';
import { 
    Wrench, 
    Construction, 
    Zap, 
    MapPin, 
    LayoutGrid, 
    Sparkles,
    ShieldCheck,
    Clock
} from 'lucide-react';

import { CATEGORIES, CATEGORY_MAP, REGIONS } from '@/constants/jobs';

interface JobFilterProps {
    initialCategory?: string;
    initialOccupation?: string;
    initialRegion?: string;
    onFilterChange: (category: string, occupation: string, region: string) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
    '전체': <LayoutGrid size={16} />,
    'Heavy-Tech': <Construction size={16} />,
    'Equipment': <Wrench size={16} />,
    'E-Tech & IT': <Zap size={16} />,
    'Agri/Eco-Tech': <Sparkles size={16} />,
    'Ocean-Tech': <Zap size={16} />,
    'Life/Home-Care': <ShieldCheck size={16} />,
    'Safety & Support': <ShieldCheck size={16} />,
};

export default function JobFilter({ 
    initialCategory = '전체',
    initialOccupation = '전체', 
    initialRegion = '전체',
    onFilterChange 
}: JobFilterProps) {
    const [selectedCat, setSelectedCat] = useState(initialCategory);
    const [selectedOcc, setSelectedOcc] = useState(initialOccupation);
    const [selectedReg, setSelectedReg] = useState(initialRegion);

    const handleCatClick = (cat: string) => {
        setSelectedCat(cat);
        setSelectedOcc('전체'); // Reset occupation when category changes
        onFilterChange(cat, '전체', selectedReg);
    };

    const handleOccClick = (occ: string) => {
        setSelectedOcc(occ);
        onFilterChange(selectedCat, occ, selectedReg);
    };

    const handleRegClick = (reg: string) => {
        setSelectedReg(reg);
        onFilterChange(selectedCat, selectedOcc, reg);
    };

    // Determine which occupations to show based on selected Category
    const filteredOccupations = selectedCat === '전체' 
        ? Object.values(CATEGORY_MAP).flat().filter((occ, index, self) => self.indexOf(occ) === index) // Unique list for "전체"
        : CATEGORY_MAP[selectedCat] || [];

    return (
        <div className={styles.filterSection}>
            {/* Category Filter */}
            <div className={styles.filterGroup}>
                <h3 className={styles.filterLabel}>
                    <ShieldCheck size={18} color="#D4AF37" />
                    마스터 서비스 영역
                </h3>
                <div className={styles.chipGrid}>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            className={`${styles.filterChip} ${selectedCat === cat ? styles.active : ''}`}
                            onClick={() => handleCatClick(cat)}
                        >
                            <span className={styles.categoryIcon}>{CATEGORY_ICONS[cat] || <LayoutGrid size={16} />}</span>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Filter Tags (New) */}
            <div className={styles.filterGroup}>
                <h3 className={styles.filterLabel}>
                    <Clock size={18} color="#D4AF37" />
                    상시 퀵 필터
                </h3>
                <div className={styles.quickTags}>
                    <span className={styles.tag}>⚡ 즉시 투입 가능</span>
                    <span className={styles.tag}>💰 고단가 보장 (20만+)</span>
                    <span className={styles.tag}>🏢 대기업 현장</span>
                    <span className={styles.tag}>✈️ 글로벌 파견</span>
                </div>
            </div>

            {/* Occupation Filter */}
            <div className={styles.filterGroup}>
                <h3 className={styles.filterLabel}>
                    <Construction size={18} color="#D4AF37" />
                    세부 전문 직군
                </h3>
                <div className={styles.chipGrid}>
                    <button
                        className={`${styles.filterChip} ${selectedOcc === '전체' ? styles.active : ''}`}
                        onClick={() => handleOccClick('전체')}
                    >
                        전체
                    </button>
                    {filteredOccupations.slice(0, 10).map((occ) => (
                        <button
                            key={occ}
                            className={`${styles.filterChip} ${selectedOcc === occ ? styles.active : ''}`}
                            onClick={() => handleOccClick(occ)}
                        >
                            {occ}
                        </button>
                    ))}
                </div>
            </div>

            {/* Region Filter */}
            <div className={styles.filterGroup}>
                <h3 className={styles.filterLabel}>
                    <MapPin size={18} color="#D4AF37" />
                    활동 가능 지역
                </h3>
                <div className={styles.chipGrid}>
                    {REGIONS.map((reg) => (
                        <button
                            key={reg}
                            className={`${styles.filterChip} ${selectedReg === reg ? styles.active : ''}`}
                            onClick={() => handleRegClick(reg)}
                        >
                            {reg}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
