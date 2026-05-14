'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldCheck, CheckCircle2, ChevronRight, X } from 'lucide-react';
import JobCard from '@/components/JobCard';
import JobCardSkeleton from '@/components/JobCard/JobCardSkeleton';
import JobFilter from '@/components/JobFilter/JobFilter';
import OccupationGrid from '@/components/OccupationGrid/OccupationGrid';
import JobMap from '@/components/JobMap/JobMap';
import styles from './page.module.css';

interface JobsClientProps {
    initialJobs: any[];
}

type ViewMode = 'occupation' | 'location' | 'global' | 'details';

export default function JobsClient({ initialJobs }: JobsClientProps) {
    const searchParams = useSearchParams();
    const [viewMode, setViewMode] = useState<ViewMode>('occupation');
    const [category, setCategory] = useState('전체');
    const [occupation, setOccupation] = useState('전체');
    const [region, setRegion] = useState('전체');
    const [searchTerm, setSearchTerm] = useState('');
    const [isFiltering, setIsFiltering] = useState(false);
    const [urgentOnly, setUrgentOnly] = useState(false);
    const [appliedId, setAppliedId] = useState<string | null>(null);

    useEffect(() => {
        const filter = searchParams.get('filter');
        if (filter === 'urgent') {
            setUrgentOnly(true);
            setViewMode('details');
        }
    }, [searchParams]);

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

    const handleApply = (id: string) => {
        setAppliedId(id);
        // In a real app, this would be an API call
    };

    const filteredJobs = useMemo(() => {
        return initialJobs.filter((job) => {
            const matchesCat = category === '전체' || job.category === category;
            
            const matchesOcc = occupation === '전체' || 
                             job.specialty.includes(occupation);
            
            const matchesReg = region === '전체' || job.location.includes(region);
            
            const matchesSearch = searchTerm === '' || 
                                 job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 job.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 job.location.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesUrgent = !urgentOnly || job.isUrgent || job.time === 'ASAP' || job.time.includes('즉시');
            
            return matchesCat && matchesOcc && matchesReg && matchesSearch && matchesUrgent;
        });
    }, [initialJobs, category, occupation, region, searchTerm, urgentOnly]);

    return (
        <div className={styles.jobsContent}>
            {/* Application Success Modal */}
            <AnimatePresence>
                {appliedId && (
                    <motion.div 
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setAppliedId(null)}
                    >
                        <motion.div 
                            className={styles.successModal}
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className={styles.closeModal} onClick={() => setAppliedId(null)}><X size={20} /></button>
                            <div className={styles.successIcon}>
                                <CheckCircle2 size={64} color="var(--primary)" />
                            </div>
                            <h2>지원 완료!</h2>
                            <p>마스터님의 기술 패스포트(데이터)가<br/>현장 관리자에게 즉시 전달되었습니다.</p>
                            <div className={styles.nextStep}>
                                <span>다음 예상 단계</span>
                                <div className={styles.stepInfo}>
                                    <strong>AI 서류 매칭 합격 알림</strong>
                                    <p>보통 1~2시간 이내에 결과가 도착합니다.</p>
                                </div>
                            </div>
                            <button className={styles.confirmBtn} onClick={() => setAppliedId(null)}>확인</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={styles.searchBar}>
                <input 
                    type="text" 
                    placeholder="현장명, 기술직군, 지역 키워드로 실시간 매칭 검색" 
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.tabs}>
                <button 
                    className={`${styles.tab} ${(viewMode === 'occupation' || viewMode === 'details') ? styles.active : ''}`}
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
                    className={`${styles.tab} ${viewMode === 'global' ? styles.active : ''}`}
                    onClick={() => setViewMode('global')}
                >
                    글로벌
                </button>
            </div>

            {viewMode === 'occupation' && (
                <motion.div 
                    className={styles.aiMatchSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={styles.aiMatchHeader}>
                        <h2 className={styles.aiMatchTitle}>
                            <Zap size={20} fill="#FF6B00" color="#FF6B00" />
                            전문가님을 위해 준비한 추천 현장
                        </h2>
                    </div>
                    
                    <div className={styles.aiRecommendGrid}>
                        {([
                            {
                                id: 'rec-1',
                                title: '평택 삼성전자 P4 신축 배관공',
                                company: '삼성엔지니어링',
                                pay: '일당 21만원',
                                match: '98%',
                                reason: '전문가님의 평택 P4 경력 및 배관 숙련도가 이 현장의 급수 배관 공정에 완벽하게 연결됩니다.'
                            },
                            {
                                id: 'rec-2',
                                title: '용인 반도체 클러스터 플랜트 팀장',
                                company: 'SK에코플랜트',
                                pay: '월 650만원+',
                                match: '94%',
                                reason: '안전 점수 상위 3% 기록이 플랜트 팀장 선임 기준을 충족합니다.'
                            },
                            {
                                id: 'rec-3',
                                title: '[해외] 사우디 네옴시티 배관 관리자',
                                company: '현대건설(해외)',
                                pay: '시급 $42 / hr',
                                match: '91%',
                                reason: '모노 AI가 분석한 글로벌 이력 데이터에 근거하여 고단가 프로젝트 매칭을 추천합니다.'
                            }
                        ] as const).map((rec, index) => (
                            <motion.div 
                                key={rec.id} 
                                className={styles.recommendCard}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className={styles.matchBadge}>{rec.match} 연결</div>
                                <div className={styles.passportConnected}>
                                    <ShieldCheck size={10} />
                                    경력 데이터 연동됨
                                </div>
                                <span className={styles.recLabel}>맞춤형 현장</span>
                                <h3 className={styles.recTitle}>{rec.title}</h3>
                                <div className={styles.recMeta}>
                                    <span>🏢 {rec.company}</span>
                                    <span>💰 {rec.pay}</span>
                                </div>
                                <p className={styles.aiReasoning}>
                                    <strong>맞춤 분석 결과:</strong> {rec.reason}
                                </p>
                                <button className={styles.recApply} onClick={() => handleApply(rec.id)}>
                                    즉시 지원하기
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {viewMode === 'occupation' && (
                <OccupationGrid onSelect={handleOccSelect} />
            )}

            {viewMode === 'details' && (
                <>
                    <div className={styles.filterBar}>
                        <JobFilter 
                            initialCategory={category}
                            initialOccupation={occupation}
                            initialRegion={region}
                            onFilterChange={handleFilterChange} 
                        />
                        <button 
                            className={`${styles.urgentToggle} ${urgentOnly ? styles.active : ''}`}
                            onClick={() => setUrgentOnly(!urgentOnly)}
                        >
                            <Zap size={14} fill={urgentOnly ? "currentColor" : "none"} />
                            지금 바로 투입 가능 (급구)
                        </button>
                    </div>
                    <div className={styles.resultsInfo}>
                        <div className={styles.countWrapper}>
                            <div className={styles.aiPulse} />
                            <span className={styles.countText}>
                                조건에 맞는 일자리 연결: <strong>{filteredJobs.length}</strong>건
                            </span>
                        </div>
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
                    <motion.div 
                        className={styles.grid}
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.05
                                }
                            }
                        }}
                    >
                        {isFiltering ? (
                            Array(6).fill(0).map((_, i) => <JobCardSkeleton key={i} />)
                        ) : filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <motion.div 
                                    key={job.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 10 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                >
                                    <JobCard job={job} onApply={() => handleApply(job.id)} />
                                </motion.div>
                            ))
                        ) : (
                            <div className={styles.noResults}>
                                <p>검색 조건에 맞는 일자리가 없습니다.</p>
                                <button className={styles.backBtn} onClick={() => setViewMode('occupation')}>다른 직업 둘러보기</button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}

            {viewMode === 'location' && (
                <motion.div 
                    className={styles.locationSearch}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <JobMap 
                        jobs={filteredJobs} 
                        onSelectJob={(id) => handleApply(id)} 
                    />
                    
                    <div className={styles.regionList}>
                        <h4 className={styles.regionTitle}>빠른 지역 이동</h4>
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
                </motion.div>
            )}

            {viewMode === 'global' && (
                <div className={styles.globalTeaser}>
                    <div className={styles.globalBanner}>
                        <div className={styles.bannerContent}>
                            <div className={styles.premiumBadge}>해외 맞춤형 연결</div>
                            <h2>글로벌 최고급 일자리</h2>
                            <p>사우디 네옴시티, 호주 수소 플랜트 등 전 세계 대형 프로젝트가 당신을 기다립니다.</p>
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
