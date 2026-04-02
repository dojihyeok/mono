'use client';

import { useState, useMemo } from 'react';
import TechnicianCard from '@/components/TechnicianCard';
import OccupationGrid from '@/components/OccupationGrid/OccupationGrid';
import JobCardSkeleton from '@/components/JobCard/JobCardSkeleton'; // Reuse for loading feel
import styles from './page.module.css';

interface TechniciansClientProps {
    initialTechnicians: any[];
}

type ViewMode = 'occupation' | 'location' | 'details';

export default function TechniciansClient({ initialTechnicians }: TechniciansClientProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('occupation');
    const [category, setCategory] = useState('전체');
    const [occupation, setOccupation] = useState('전체');
    const [region, setRegion] = useState('전체');
    const [searchTerm, setSearchTerm] = useState('');
    const [isFiltering, setIsFiltering] = useState(false);

    const handleFilterChange = (cat: string, occ: string, reg: string) => {
        setIsFiltering(true);
        setCategory(cat);
        setOccupation(occ);
        setRegion(reg);
        setTimeout(() => setIsFiltering(false), 350);
    };

    const handleOccSelect = (specialty: string) => {
        setIsFiltering(true);
        setOccupation(specialty);
        setViewMode('details');
        setTimeout(() => setIsFiltering(false), 450);
    };

    const filteredTechnicians = useMemo(() => {
        return initialTechnicians.filter((tech) => {
            const matchesOcc = occupation === '전체' || 
                             tech.specialty.includes(occupation);
            
            const matchesReg = region === '전체' || tech.location.includes(region);
            
            const matchesSearch = searchTerm === '' || 
                                 tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 tech.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 tech.location.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesOcc && matchesReg && matchesSearch;
        });
    }, [initialTechnicians, occupation, region, searchTerm]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>마스터 탐색</h1>
                <p className={styles.subtitle}>분야별 검증된 전문가들을 직접 찾아보세요.</p>
            </div>

            <div className={styles.searchBar}>
                <input 
                    type="text" 
                    placeholder="이름, 기술직종, 거주지역으로 검색해보세요" 
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.tabs}>
                <button 
                    className={`${styles.tab} ${viewMode === 'occupation' ? styles.active : ''}`}
                    onClick={() => setViewMode('occupation')}
                >
                    직종별 마스터
                </button>
                <button 
                    className={`${styles.tab} ${viewMode === 'location' ? styles.active : ''}`}
                    onClick={() => setViewMode('location')}
                >
                    가까운 마스터
                </button>
            </div>

            {viewMode === 'occupation' && (
                <OccupationGrid onSelect={handleOccSelect} />
            )}

            {viewMode === 'details' && (
                <>
                    <div className={styles.resultsInfo}>
                        <span className={styles.countText}>
                            총 <strong>{filteredTechnicians.length}</strong>명의 마스터 검색됨
                        </span>
                        <button className={styles.backToGrid} onClick={() => setViewMode('occupation')}>
                            다른 직종 둘러보기
                        </button>
                    </div>
                    <div className={styles.grid}>
                        {isFiltering ? (
                            Array(6).fill(0).map((_, i) => <JobCardSkeleton key={i} />)
                        ) : filteredTechnicians.length > 0 ? (
                            filteredTechnicians.map((tech) => (
                                <TechnicianCard key={tech.id} technician={tech} />
                            ))
                        ) : (
                            <div className={styles.noResults}>
                                <p>해당 조건의 마스터를 찾을 수 없습니다.</p>
                                <button className={styles.backBtn} onClick={() => setViewMode('occupation')}>직종 그리드로 돌아가기</button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {viewMode === 'location' && (
                <div className={styles.locationSearch}>
                    <div className={styles.nearMeBox}>
                        <div className={styles.nearMeIcon}>🗺️</div>
                        <h3>내 주변 마스터 찾기</h3>
                        <p>현재 위치를 기반으로 가장 가까운 마스터들을 추천합니다.</p>
                        <button className={styles.gpsBtn}>현재 위치 확인</button>
                    </div>
                </div>
            )}
        </div>
    );
}
