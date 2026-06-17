'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldCheck, CheckCircle2, ChevronRight, X, MapPin, Clock, Calendar, Shield, CreditCard, Award, HelpCircle } from 'lucide-react';
import JobCard from '@/components/JobCard';
import JobCardSkeleton from '@/components/JobCard/JobCardSkeleton';
import JobFilter from '@/components/JobFilter/JobFilter';
import OccupationGrid from '@/components/OccupationGrid/OccupationGrid';
import JobMap from '@/components/JobMap/JobMap';
import styles from './page.module.css';
import { useDemo } from '@/context/DemoContext';
import { useUI } from '@/context/UIContext';

interface Job {
    id: string | number;
    title: string;
    company?: string;
    pay?: string;
    dailyWage?: number;
    location: string;
    specialty: string;
    category: string;
    isUrgent?: boolean;
    time?: string;
    managerPhone?: string;
    supplies?: string;
    payoutDate?: string;
    needSafety?: boolean;
}

interface JobsClientProps {
    initialJobs: Job[];
}

type ViewMode = 'occupation' | 'location' | 'global' | 'details';

// Safe fallback job list if DB not seeded
const LOCAL_MOCK_JOBS: Job[] = [
    {
        id: 'job-1',
        title: '서초 반포 써밋팰리스 복합 신축현장',
        company: '대우건설',
        pay: '일당 235,000원',
        dailyWage: 235000,
        location: '서울 서초구 반포동',
        specialty: '뼈대 튼튼 형틀목수',
        category: '목공',
        isUrgent: true,
        time: '07:00 ~ 17:00',
        managerPhone: '010-9876-5432',
        supplies: '안전모, 안전화, 각반, 목공 개인 수공구',
        payoutDate: '근무 당일 18시 이내 지급',
        needSafety: true
    },
    {
        id: 'job-2',
        title: '청담 파크자이 현장 형틀목수',
        company: 'GS건설(주)',
        pay: '일당 240,000원',
        dailyWage: 240000,
        location: '서울 강남구 청담동',
        specialty: '뼈대 튼튼 형틀목수',
        category: '목공',
        isUrgent: false,
        time: '08:00 ~ 17:00',
        managerPhone: '010-8888-9999',
        supplies: '안전 장구류 일체 제공, 목공 벨트',
        payoutDate: '익일 오전 10시 지급',
        needSafety: true
    },
    {
        id: 'job-3',
        title: '여의도 파크원 타워 3차 긴급 형틀지원',
        company: '포스코이앤씨',
        pay: '일당 255,000원',
        dailyWage: 255000,
        location: '서울 영등포구 여의도동',
        specialty: '뼈대 튼튼 형틀목수',
        category: '목공',
        isUrgent: true,
        time: '07:30 ~ 18:00',
        managerPhone: '010-7777-5555',
        supplies: '안전모 및 개인 조각 도구',
        payoutDate: '근무 익일 12시 지급',
        needSafety: true
    }
];

export default function JobsClient({ initialJobs }: JobsClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { state, applyJob, updateProfile } = useDemo();
    const { addToast } = useUI();

    const isUrgentParam = searchParams ? searchParams.get('filter') === 'urgent' : false;
    const [viewMode, setViewMode] = useState<ViewMode>(isUrgentParam ? 'details' : 'occupation');
    const [category, setCategory] = useState('전체');
    const [occupation, setOccupation] = useState('전체');
    const [region, setRegion] = useState('전체');
    const [searchTerm, setSearchTerm] = useState('');
    const [isFiltering, setIsFiltering] = useState(false);
    const [urgentOnly, setUrgentOnly] = useState(isUrgentParam);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    
    // Bottom sheet state
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const mergedJobs = useMemo(() => {
        const dbJobs = initialJobs.map(job => ({
            ...job,
            pay: job.pay || `일당 ${job.dailyWage?.toLocaleString()}원`,
            dailyWage: job.dailyWage || 220000,
            time: job.time || '07:00 ~ 17:00',
            supplies: job.supplies || '개인 안전장구',
            payoutDate: job.payoutDate || '당일 정산',
            needSafety: job.needSafety ?? true
        }));
        // Merge with our demo-specific local mock jobs to guarantee data availability
        const merged = [...LOCAL_MOCK_JOBS];
        dbJobs.forEach(dbJob => {
            if (!merged.some(m => m.id === dbJob.id || m.title === dbJob.title)) {
                merged.push(dbJob);
            }
        });
        return merged;
    }, [initialJobs]);

    useEffect(() => {
        if (!searchParams) return;
        const filter = searchParams.get('filter');
        if (filter === 'urgent') {
            Promise.resolve().then(() => {
                setUrgentOnly(true);
                setViewMode('details');
            });
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

    const handleApply = (jobId: string) => {
        applyJob(jobId);
        setSelectedJob(null);
        setSuccessModalOpen(true);
    };

    const filteredJobs = useMemo(() => {
        return mergedJobs.filter((job) => {
            const matchesCat = category === '전체' || job.category === category;
            const matchesOcc = occupation === '전체' || job.specialty.includes(occupation);
            const matchesReg = region === '전체' || job.location.includes(region);
            
            const matchesSearch = searchTerm === '' || 
                                 job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 job.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 job.location.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesUrgent = !urgentOnly || job.isUrgent || (job.time ? job.time.includes('즉시') : false);
            
            return matchesCat && matchesOcc && matchesReg && matchesSearch && matchesUrgent;
        });
    }, [mergedJobs, category, occupation, region, searchTerm, urgentOnly]);

    // Check application button state and detail CTA constraints
    const getCtaState = (job: Job) => {
        const hasApplied = state.jobApplication.appliedJobId === job.id.toString();
        const profilePercent = getProfilePercent();

        if (hasApplied) {
            return {
                text: '신청 결과 기다리는 중',
                action: () => {},
                disabled: true,
                style: styles.ctaDisabled
            };
        }

        // 1. Safety Education Certificate missing
        if (job.needSafety && !state.profile.safetyComplete) {
            return {
                text: '안전 확인하기',
                action: () => {
                    addToast('⚠️ 필수 서류 누락: 기초안전보건교육이수증 등록으로 연결합니다.', 'warning');
                    router.push('/myinfo');
                },
                disabled: false,
                style: styles.ctaAlert
            };
        }

        // 2. Missing Account or Profile Complete
        if (profilePercent < 100) {
            return {
                text: '필요한 정보 채우기',
                action: () => {
                    addToast('⚠️ 계좌 정보 또는 신분 확인이 필요합니다.', 'warning');
                    router.push('/myinfo');
                },
                disabled: false,
                style: styles.ctaWarning
            };
        }

        // 3. Regular Apply
        return {
            text: '일하러 가기 신청',
            action: () => handleApply(job.id.toString()),
            disabled: false,
            style: styles.ctaPrimary
        };
    };

    const getProfilePercent = () => {
        let count = 0;
        if (state.profile.name) count += 20;
        if (state.profile.regions.length > 0) count += 20;
        if (state.profile.jobs.length > 0) count += 20;
        if (state.profile.safetyComplete) count += 20;
        if (state.profile.accountNumber) count += 20;
        return count;
    };

    return (
        <div className={styles.jobsContent}>
            {/* Application Success Modal */}
            <AnimatePresence>
                {successModalOpen && (
                    <motion.div 
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSuccessModalOpen(false)}
                    >
                        <motion.div 
                            className={styles.successModal}
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className={styles.closeModal} onClick={() => setSuccessModalOpen(false)}><X size={20} /></button>
                            <div className={styles.successIcon}>
                                <CheckCircle2 size={64} color="#2563eb" />
                            </div>
                            <h2>일하러 가기 신청 완료</h2>
                            <p>회사에서 이력서와 기술카드를 검수 중입니다.</p>
                            <div className={styles.nextStep}>
                                <span>다음 예상 단계</span>
                                <div className={styles.stepInfo}>
                                    <strong>회사 확인 및 확정 안내</strong>
                                    <p>승인 결과는 홈 화면과 카톡 알림으로 신속하게 알려드려요.</p>
                                </div>
                            </div>
                            <button className={styles.confirmBtn} onClick={() => setSuccessModalOpen(false)}>확인</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Job Detail Bottom Sheet */}
            <AnimatePresence>
                {selectedJob && (
                    <div className={styles.bottomSheetOverlay} onClick={() => setSelectedJob(null)}>
                        <motion.div 
                            className={styles.bottomSheet}
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={styles.sheetHeader}>
                                <div className={styles.sheetHandle}></div>
                                <button className={styles.sheetClose} onClick={() => setSelectedJob(null)}><X size={20} /></button>
                            </div>

                            <div className={styles.sheetBody}>
                                <div className={styles.sheetTitleArea}>
                                    <span className={styles.sheetCompany}>{selectedJob.company}</span>
                                    <h2>{selectedJob.title}</h2>
                                    <div className={styles.sheetPrice}>{selectedJob.pay}</div>
                                </div>

                                <div className={styles.detailGrid}>
                                    <div className={styles.detailItem}>
                                        <MapPin size={18} className={styles.detailIcon} />
                                        <div>
                                            <span>근무지</span>
                                            <strong>{selectedJob.location}</strong>
                                        </div>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <Clock size={18} className={styles.detailIcon} />
                                        <div>
                                            <span>근무 시간</span>
                                            <strong>{selectedJob.time}</strong>
                                        </div>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <CreditCard size={18} className={styles.detailIcon} />
                                        <div>
                                            <span>정산 및 지급 예정일</span>
                                            <strong>{selectedJob.payoutDate}</strong>
                                        </div>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <Shield size={18} className={styles.detailIcon} />
                                        <div>
                                            <span>보안 및 보증</span>
                                            <strong className="text-emerald-500">MONO 에스크로 안전보관 보장</strong>
                                        </div>
                                    </div>
                                    <div className={styles.detailItemFull}>
                                        <Award size={18} className={styles.detailIcon} />
                                        <div>
                                            <span>준비물 및 자격요건</span>
                                            <strong>{selectedJob.supplies}</strong>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.sheetMapArea}>
                                    {/* Mock Map View */}
                                    <div className={styles.mockMap}>
                                        <MapPin size={24} color="#ff453a" className="animate-bounce" />
                                        <span>지도 위치: {selectedJob.location}</span>
                                    </div>
                                </div>

                                <div className={styles.sheetActions}>
                                    {(() => {
                                        const cta = getCtaState(selectedJob);
                                        return (
                                            <button 
                                                onClick={cta.action} 
                                                disabled={cta.disabled}
                                                className={`${styles.sheetCta} ${cta.style}`}
                                            >
                                                {cta.text}
                                            </button>
                                        );
                                    })()}
                                </div>
                            </div>
                        </motion.div>
                    </div>
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
                <button 
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
                            {state.profile.name} 반장님 추천 일자리
                        </h2>
                    </div>
                    
                    <div className={styles.aiRecommendGrid}>
                        {filteredJobs.slice(0, 3).map((job, index) => (
                            <motion.div 
                                key={job.id} 
                                className={styles.recommendCard}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setSelectedJob(job)}
                            >
                                <div className={styles.matchBadge}>98% 일치</div>
                                <div className={styles.passportConnected}>
                                    <ShieldCheck size={10} style={{ marginRight: '2px' }} />
                                    데이터 공식 확인됨
                                </div>
                                <span className={styles.recLabel}>{job.company}</span>
                                <h3 className={styles.recTitle}>{job.title}</h3>
                                <div className={styles.recMeta}>
                                    <span>💰 {job.pay}</span>
                                </div>
                                <p className={styles.aiReasoning}>
                                    <strong>매칭 이유:</strong> 반장님의 {state.profile.jobs[0]} 및 {state.profile.experience.split(' ')[0]} 경력이 해당 {job.category} 공정에 완벽히 부합합니다.
                                </p>
                                <button 
                                    className={styles.recApply} 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedJob(job);
                                    }}
                                >
                                    상세 보기 & 신청
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
                                    onClick={() => setSelectedJob(job)}
                                >
                                    <JobCard job={job} onApply={() => {}} />
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
                        onSelectJob={(id) => {
                            const job = mergedJobs.find(m => m.id.toString() === id.toString());
                            if (job) setSelectedJob(job);
                        }} 
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
                            <div className={styles.premiumBadge}>해외 맞춤형 연결 준비중</div>
                            <h2>글로벌 최고급 일자리</h2>
                            <p>사우디 네옴시티, 호주 수소 플랜트 등 전 세계 대형 프로젝트 협약 준비 중입니다.</p>
                            <button className={styles.globalCta} onClick={() => addToast('🌍 글로벌 파견 서비스는 준비 중입니다.', 'info')}>
                                공식 협의 사항 보기
                                <span style={{ marginLeft: '8px' }}>→</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
