'use client';

import { useState, useEffect } from 'react';
import styles from './career.module.css';
import { 
    Award, 
    ShieldCheck, 
    ChevronRight,
    MapPin,
    Calendar,
    Download,
    Cpu,
    Zap,
    Briefcase,
    Star,
    Share2,
    CheckCircle2,
    Eye,
    EyeOff,
    Check,
    Lock,
    Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CareerClient() {
    const [activeTab, setActiveTab] = useState<'passport' | 'history'>('passport');
    const [isPublicView, setIsPublicView] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    
    // Sharing modal simulation
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareStep, setShareStep] = useState(1);
    const [disclosePhone, setDisclosePhone] = useState(true);
    const [discloseWage, setDiscloseWage] = useState(false);
    const [discloseDocs, setDiscloseDocs] = useState(true);

    // Live update total workdays based on demo state
    const [totalDays, setTotalDays] = useState(342);

    useEffect(() => {
        const demoStage = localStorage.getItem('mono_demo_stage') || 'IDLE';
        if (demoStage === 'PAID') {
            setTotalDays(343); // Increment day if today's work has been completed and paid!
        }
    }, []);

    const handleShareSubmit = () => {
        setShareStep(2);
        setTimeout(() => {
            setShowShareModal(false);
            setShareStep(1);
            alert('선택하신 기술카드 상세 정보가 기업 담당자에게 안전하게 전달되었습니다. 열람 기록이 블록체인 노드에 동기화되었습니다.');
        }, 2000);
    };

    return (
        <div className={styles.careerContainer}>
            {/* 1. Header */}
            <header className={styles.careerHeader}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0 }}>내 기술카드</h1>
                    <span style={{ fontSize: '0.8rem', color: '#8e8e93' }}>내가 일한 기록과 기술을 보여주는 카드예요.</span>
                </div>
                <button className={styles.shareBtn} onClick={() => setShowShareModal(true)}><Share2 size={20} /></button>
            </header>

            {/* View Mode Indicator Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#8e8e93' }}>
                    {isPublicView ? '🏢 기업 공개용 화면 프리뷰' : '👤 내 모든 정보 보기'}
                </span>
                <button 
                    onClick={() => setIsPublicView(!isPublicView)}
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        padding: '6px 12px', 
                        borderRadius: '20px', 
                        border: '1px solid #ced4da', 
                        background: isPublicView ? '#f2f2f7' : '#ffffff', 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold',
                        cursor: 'pointer' 
                    }}
                >
                    {isPublicView ? <EyeOff size={12} /> : <Eye size={12} />}
                    {isPublicView ? '본인용으로 보기' : '남이 볼 때로 보기'}
                </button>
            </div>

            {/* 2. Main Credit Card UI */}
            <section className={styles.passportHero} style={{ perspective: '1000px', cursor: 'pointer' }} onClick={() => setIsFlipped(!isFlipped)}>
                <motion.div 
                    className={styles.passportCard}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ transformStyle: 'preserve-3d', position: 'relative' }}
                >
                    {/* Front Side */}
                    <div style={{ backfaceVisibility: 'hidden', width: '100%', height: '100%' }}>
                        <div className={styles.cardGlow} />
                        <div className={styles.cardHeader}>
                            <div className={styles.identity}>
                                <div className={styles.avatar}>A</div>
                                <div className={styles.nameInfo}>
                                    <h2>{isPublicView ? '김*훈 (Aaron)' : '김아론 (Aaron)'}</h2>
                                    <span>배관 특급 기술자</span>
                                </div>
                            </div>
                            <div className={styles.officialBadge}>
                                <Award size={24} />
                                <span style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>EXPERT</span>
                            </div>
                        </div>
                        
                        <div className={styles.cardStats}>
                            <div className={styles.statItem}>
                                <span>총 근무일</span>
                                <strong>{totalDays}일</strong>
                            </div>
                            <div className={styles.statItem}>
                                <span>신뢰 완료 기업</span>
                                <strong>12개사</strong>
                            </div>
                            <div className={styles.statItem}>
                                <span>내 기술 신뢰도</span>
                                <strong>980 P</strong>
                            </div>
                        </div>

                        <div className={styles.verificationRow}>
                            <ShieldCheck size={14} />
                            {isPublicView ? 'MoNo 공식 기술 확인 완료' : 'MoNo 공식 확인 준비중 (수기 증명 완료)'}
                        </div>
                        <div style={{ position: 'absolute', bottom: '16px', right: '20px', fontSize: '0.7rem', opacity: 0.6, fontFamily: 'monospace' }}>
                            M-2026-4790 (클릭하여 뒤집기)
                        </div>
                    </div>

                    {/* Back Side */}
                    <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', padding: '24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>MONO 기술카드 상세</strong>
                            <ShieldCheck size={16} color="#30d158" />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '20px 0', fontSize: '0.85rem' }}>
                            <div>• 주요 기술: 고압 배관 설계 (Master), TIG 용접 (Expert)</div>
                            <div>• 주요 활동 지역: 서울 청담, 경기 평택 고덕</div>
                            <div>• 안전교육 여부: 이수 완료</div>
                            <div>• 최근 근무 기록: {totalDays === 343 ? '청담동 빌라 신축 (6월 17일)' : '평택 반도체 P4 (6월 15일)'}</div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>발급기관: 주식회사 티라이브</div>
                            <div style={{ background: '#fff', padding: '4px', borderRadius: '4px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justify: 'center' }}>
                                <span style={{ color: '#000', fontSize: '0.4rem', fontWeight: 'bold' }}>QR SCAN</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* 3. Navigation */}
            <nav className={styles.careerNav}>
                <button 
                    className={`${styles.navBtn} ${activeTab === 'passport' ? styles.active : ''}`}
                    onClick={() => setActiveTab('passport')}
                >
                    보유 기술
                </button>
                <button 
                    className={`${styles.navBtn} ${activeTab === 'history' ? styles.active : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    일한 기록 ({totalDays}일)
                </button>
            </nav>

            {/* 4. Content Content Area */}
            <main className={styles.mainContent}>
                <AnimatePresence mode="wait">
                    {activeTab === 'passport' ? (
                        <motion.div 
                            key="passport"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className={styles.skillSection}
                        >
                            <div className={styles.sectionHeader}>
                                <h3>보유 기술 숙련도</h3>
                            </div>
                            
                            <div className={styles.skillGrid}>
                                <div className={styles.skillItem}>
                                    <div className={styles.skillLabel}>
                                        <span>고압 배관 설계</span>
                                        <strong style={{ color: '#3182f6' }}>MASTER</strong>
                                    </div>
                                    <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: '95%', background: '#3182f6' }} /></div>
                                </div>
                                <div className={styles.skillItem}>
                                    <div className={styles.skillLabel}>
                                        <span>TIG 용접</span>
                                        <strong style={{ color: '#00c7be' }}>EXPERT</strong>
                                    </div>
                                    <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: '88%', background: '#00c7be' }} /></div>
                                </div>
                            </div>

                            <div className={styles.certSection}>
                                <h3>검증된 자격증 및 서류</h3>
                                <div className={styles.certList}>
                                    <div className={styles.certItem}>
                                        <div className={styles.certIcon}><Cpu size={20} /></div>
                                        <div className={styles.certInfo}>
                                            <strong>배관기능장</strong>
                                            <span>한국산업인력공단 · 2020.05</span>
                                        </div>
                                        <CheckCircle2 size={18} color="#30d158" />
                                    </div>
                                    <div className={styles.certItem}>
                                        <div className={styles.certIcon} style={{ color: '#5856d6' }}><ShieldCheck size={20} /></div>
                                        <div className={styles.certInfo}>
                                            <strong>기초안전보건교육이수증</strong>
                                            <span>안전보건공단 · 2018.02</span>
                                        </div>
                                        <CheckCircle2 size={18} color="#30d158" />
                                    </div>
                                </div>
                            </div>

                            {/* Sensitivity display on Phone Number & sensitive data */}
                            <div style={{ background: '#f8f9fa', border: '1px solid #e5e5ea', padding: '16px', borderRadius: '16px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ color: '#8e8e93' }}>연락처</span>
                                    <strong style={{ color: '#1c1c1e' }}>{isPublicView ? '010-****-5678' : '010-1234-5678'}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ color: '#8e8e93' }}>지급용 은행계좌</span>
                                    <strong style={{ color: '#1c1c1e' }}>{isPublicView ? '국민은행 ***********-***' : '국민은행 479202-01-20921'}</strong>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="history"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className={styles.historySection}
                        >
                            <div className={styles.timeline}>
                                {totalDays === 343 && (
                                    <div className={styles.timelineItem}>
                                        <div className={styles.timeMarker} style={{ background: '#30d158' }} />
                                        <div className={styles.timeContent}>
                                            <div className={styles.timeHeader}>
                                                <strong>청담동 고급 빌라 신축 현장</strong>
                                                <span>6월 17일 (오늘)</span>
                                            </div>
                                            <div className={styles.timeMeta}>
                                                <MapPin size={12} /> 강남건설 · 서울 강남구 청담동
                                            </div>
                                            <div className={styles.timeBadge} style={{ background: 'rgba(48,209,88,0.1)', color: '#30d158' }}>지급 완료</div>
                                        </div>
                                    </div>
                                )}
                                <div className={styles.timelineItem}>
                                    <div className={styles.timeMarker} />
                                    <div className={styles.timeContent}>
                                        <div className={styles.timeHeader}>
                                            <strong>평택 캠퍼스 P4 신축 (배관)</strong>
                                            <span>2026.03 - 2026.06</span>
                                        </div>
                                        <div className={styles.timeMeta}>
                                            <MapPin size={12} /> 삼성엔지니어링 · 경기도 평택
                                        </div>
                                        <div className={styles.timeBadge}>완료</div>
                                    </div>
                                </div>
                                <div className={styles.timelineItem}>
                                    <div className={styles.timeMarker} />
                                    <div className={styles.timeContent}>
                                        <div className={styles.timeHeader}>
                                            <strong>성수 테크니컬 허브 리노베이션</strong>
                                            <span>2026.01 - 2026.03</span>
                                        </div>
                                        <div className={styles.timeMeta}>
                                            <MapPin size={12} /> 현대건설 · 서울 성수
                                        </div>
                                        <div className={styles.timeBadge}>완료</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* AI Advisor Card -> "내 기록이 쌓일수록 더 좋은 일자리를 만날 수 있어요." */}
            <aside className={styles.aiAdvisor} style={{ borderLeft: '4px solid #3182f6', background: 'rgba(49, 130, 246, 0.03)' }}>
                <div className={styles.advisorHeader}>
                    <div className={styles.zapIcon} style={{ background: '#3182f6' }}><Zap size={18} /></div>
                    <strong style={{ color: '#3182f6' }}>커리어 추천 알림</strong>
                </div>
                <p>내 기록이 쌓일수록 더 신뢰도 높은 일자리를 매칭받을 수 있습니다. 보유 자격증을 추가하면 신뢰 포인트가 상승해요.</p>
                <button className={styles.advisorBtn} onClick={() => alert('신규 서류 촬영 및 업로드 단계로 이동합니다.')}>
                    서류 등록하기 <ChevronRight size={14} />
                </button>
            </aside>

            {/* Detailed view disclosure consent flow modal */}
            <AnimatePresence>
                {showShareModal && (
                    <div className={styles.formOverlay} onClick={() => setShowShareModal(false)}>
                        <motion.div 
                            className={styles.formSheet}
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>내 기술카드 공유 동의</h2>
                            <p style={{ fontSize: '0.8rem', color: '#8e8e93', margin: '0 0 16px 0' }}>
                                이 회사가 전문가님의 자세한 근무기록을 보고 싶어 해요. 상대방에게 안전하게 공개할 항목을 직접 선택하세요.
                            </p>

                            {shareStep === 1 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', border: '1px solid #e5e5ea', padding: '12px 16px', borderRadius: '12px' }}>
                                        <div style={{ textAlign: 'left' }}>
                                            <strong style={{ fontSize: '0.9rem', display: 'block' }}>연락처 정보</strong>
                                            <span style={{ fontSize: '0.75rem', color: '#8e8e93' }}>이름, 휴대전화 번호</span>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            checked={disclosePhone} 
                                            onChange={() => setDisclosePhone(!disclosePhone)} 
                                            style={{ width: '20px', height: '20px', marginLeft: 'auto', cursor: 'pointer' }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', border: '1px solid #e5e5ea', padding: '12px 16px', borderRadius: '12px' }}>
                                        <div style={{ textAlign: 'left' }}>
                                            <strong style={{ fontSize: '0.9rem', display: 'block' }}>기타 상세 정산 내역</strong>
                                            <span style={{ fontSize: '0.75rem', color: '#8e8e93' }}>현장별 상세 단가 정보</span>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            checked={discloseWage} 
                                            onChange={() => setDiscloseWage(!discloseWage)} 
                                            style={{ width: '20px', height: '20px', marginLeft: 'auto', cursor: 'pointer' }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', border: '1px solid #e5e5ea', padding: '12px 16px', borderRadius: '12px' }}>
                                        <div style={{ textAlign: 'left' }}>
                                            <strong style={{ fontSize: '0.9rem', display: 'block' }}>자격증 및 안전보건서류</strong>
                                            <span style={{ fontSize: '0.75rem', color: '#8e8e93' }}>이수증 및 면허 증명 사본</span>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            checked={discloseDocs} 
                                            onChange={() => setDiscloseDocs(!discloseDocs)} 
                                            style={{ width: '20px', height: '20px', marginLeft: 'auto', cursor: 'pointer' }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#ff453a', padding: '0 8px' }}>
                                        <Lock size={12} />
                                        <span>주민등록번호 및 개인 금융 비밀번호는 항상 비공개 처리됩니다.</span>
                                    </div>

                                    <div className={styles.formActions}>
                                        <button className={styles.cancelBtn} onClick={() => setShowShareModal(false)}>
                                            취소
                                        </button>
                                        <button className={styles.submitBtn} onClick={handleShareSubmit}>
                                            선택 정보 공유하기
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', itemsCenter: 'center', padding: '20px 0', gap: '16px', textAlign: 'center' }}>
                                    <div className={styles.zapIcon} style={{ background: '#30d158', color: '#fff', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justify: 'center', margin: '0 auto' }}>
                                        <Check size={32} />
                                    </div>
                                    <div>
                                        <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '8px' }}>전송 완료</strong>
                                        <span style={{ fontSize: '0.85rem', color: '#8e8e93' }}>동의 데이터 공유 기록이 블록체인 이력 장부에 기록되었습니다.</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
