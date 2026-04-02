'use client';

import { useState } from 'react';
import styles from './JobFilter.module.css';

import { CATEGORIES, CATEGORY_MAP, REGIONS } from '@/constants/jobs';

interface JobFilterProps {
    initialCategory?: string;
    initialOccupation?: string;
    initialRegion?: string;
    onFilterChange: (category: string, occupation: string, region: string) => void;
}

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
            <div className={styles.filterGroup}>
                <h3 className={styles.filterLabel}>서비스 카테고리</h3>
                <div className={styles.scrollList}>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            className={`${styles.filterBtn} ${selectedCat === cat ? styles.active : ''}`}
                            onClick={() => handleCatClick(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.filterGroup}>
                <h3 className={styles.filterLabel}>상세 기술직군</h3>
                <div className={styles.scrollList}>
                    <button
                        className={`${styles.filterBtn} ${selectedOcc === '전체' ? styles.active : ''}`}
                        onClick={() => handleOccClick('전체')}
                    >
                        전체
                    </button>
                    {filteredOccupations.map((occ) => (
                        <button
                            key={occ}
                            className={`${styles.filterBtn} ${selectedOcc === occ ? styles.active : ''}`}
                            onClick={() => handleOccClick(occ)}
                        >
                            {occ}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.filterGroup}>
                <h3 className={styles.filterLabel}>근무 지역</h3>
                <div className={styles.scrollList}>
                    {REGIONS.map((reg) => (
                        <button
                            key={reg}
                            className={`${styles.filterBtn} ${selectedReg === reg ? styles.active : ''}`}
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
