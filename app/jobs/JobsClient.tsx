'use client';

import { useState, useMemo, useEffect } from 'react';
import JobCard from '@/components/JobCard';
import JobCardSkeleton from '@/components/JobCard/JobCardSkeleton';
import JobFilter from '@/components/JobFilter/JobFilter';
import OccupationGrid from '@/components/OccupationGrid/OccupationGrid';
import styles from './page.module.css';

interface JobsClientProps {
    initialJobs: any[];
}

type ViewMode = 'occupation' | 'location' | 'global' | 'details';

export default function JobsClient({ initialJobs }: JobsClientProps) {
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
        setCategory('전체');
        setViewMode('details');
        
        setTimeout(() => setIsFiltering(false), 450);
    };

    const filteredJobs = useMemo(() => {
        return initialJobs.filter((job) => {
            const matchesCat = category === '전체' || 
                             job.category === category || 
                             (category === 'Heavy-Tech' && (job.category === 'Construction' || job.category === 'Heavy-Tech')) ||
                             (category === 'Equipment' && (job.category === 'Equipment')) ||
                             (category === 'E-Tech & IT' && (job.category === 'ETech' || job.category === 'E-Tech & IT')) ||
                             (category === 'Agri/Eco-Tech' && (job.category === 'AgriTech' || job.category === 'Agri/Eco-Tech')) ||
                             (category === 'Ocean-Tech' && (job.category === 'OceanTech' || job.category === 'Ocean-Tech')) ||
                             (category === 'Life/Home-Care' && (job.category === 'LifeCare' || job.category === 'Life/Home-Care')) ||
                             (category === 'Safety & Support' && (job.category === 'DawnMarket' || job.category === 'Safety & Support' || job.category === 'Safety'));
            
            const matchesOcc = occupation === '전체' || 
                             job.specialty.includes(occupation);
            
            const matchesReg = region === '전체' || job.location.includes(region);
            
            const matchesSearch = searchTerm === '' || 
                                 job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 job.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 job.location.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesCat && matchesOcc && matchesReg && matchesSearch;
        });
    }, [initialJobs, category, occupation, region, searchTerm]);

    return (
        <div className={styles.jobsContent}>
            <div className={styles.searchBar}>
                <input 
                    type="text" 
                    placeholder="현장명, 직종, 지역으로 검색해보세요 (예: 강남, 배관, 현장조공)" 
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
                    직업별
                </button>
                <button 
                    className={`${styles.tab} ${viewMode === 'location' ? styles.active : ''}`}
                    onClick={() => setViewMode('location')}
                >
                    가까운 곳
                </button>
                <button 
                    className={`${styles.tab} ${viewMode === 'global' ? styles.active : ''}`}
                    onClick={() => setViewMode('global')}
                    style={{ color: '#B48A09' }}
                >
                    글로벌
                </button>
            </div>

            {viewMode === 'occupation' && (
                <OccupationGrid onSelect={handleOccSelect} />
            )}

            {viewMode === 'details' && (
                <>
                    <JobFilter 
                        initialCategory={category}
                        initialOccupation={occupation}
                        initialRegion={region}
                        onFilterChange={handleFilterChange} 
                    />
                    <div className={styles.resultsInfo}>
                        <span className={styles.countText}>
                            총 <strong>{filteredJobs.length}</strong>건의 일자리
                        </span>
                        { (occupation !== '전체' || region !== '전체' || searchTerm !== '') && (
                            <button className={styles.resetBtn} onClick={() => {
                                setIsFiltering(true);
                                setOccupation('전체');
                                setCategory('전체');
                                setRegion('전체');
                                setSearchTerm('');
                                setTimeout(() => setIsFiltering(false), 300);
                            }}>초기화</button>
                        )}
                    </div>
                    <div className={styles.grid}>
                        {isFiltering ? (
                            Array(6).fill(0).map((_, i) => <JobCardSkeleton key={i} />)
                        ) : filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))
                        ) : (
                            <div className={styles.noResults}>
                                <p>검색 조건에 맞는 일자리가 없습니다.</p>
                                <button className={styles.backBtn} onClick={() => setViewMode('occupation')}>다른 직업 둘러보기</button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {viewMode === 'location' && (
                <div className={styles.locationSearch}>
                    <div className={styles.nearMeBox}>
                        <div className={styles.nearMeIcon}>📍</div>
                        <h3>내 주변 일자리 찾기</h3>
                        <p>실시간 위치 기반으로 가장 가까운 현장을 추천합니다.</p>
                        <button className={styles.gpsBtn}>현재 위치로 검색</button>
                    </div>
                    <div className={styles.regionList}>
                        <h4 className={styles.regionTitle}>지역별 검색</h4>
                        <div className={styles.chipGrid}>
                            {['서울', '경기', '인천', '부산', '대구', '강원', '전남', '제주'].map(reg => (
                                <button 
                                    key={reg} 
                                    className={`${styles.regionChip} ${region === reg ? styles.active : ''}`}
                                    onClick={() => {
                                        setIsFiltering(true);
                                        setRegion(reg);
                                        setViewMode('details');
                                        setTimeout(() => setIsFiltering(false), 400);
                                    }}
                                >
                                    {reg}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {viewMode === 'global' && (
                <div className={styles.globalTeaser}>
                    <div className={styles.globalBanner}>
                        <div className={styles.bannerContent}>
                            <div className={styles.premiumBadge}>STRATEGIC MATCHING</div>
                            <h2>글로벌 마스터 에이전시</h2>
                            <p>사우디 네옴시티, 호주 수소 플랜트 등 전 세계 하이-벨류 프로젝트가 당신을 기다립니다.</p>
                            <button className={styles.globalCta} onClick={() => window.location.href = '/matching'}>
                                프로젝트 탐색하기
                                <span style={{ marginLeft: '8px' }}>→</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
