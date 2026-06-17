'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
    Zap, 
    MapPin, 
    Clock, 
    Wallet, 
    ShieldCheck, 
    ArrowLeft, 
    Share2, 
    Star, 
    Users, 
    CheckCircle2, 
    AlertTriangle,
    Bus,
    Navigation,
    Calendar,
    ChevronRight,
    Trophy,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';
import GlassCard from '@/components/UI/GlassCard';
import Button from '@/components/UI/Button';

interface DetailedJob {
    id: string;
    title: string;
    category?: string;
    isUrgent?: boolean;
    dailyWage?: number;
    pay?: string;
    location: string;
    time?: string;
    specialty: string;
    description?: string;
}

interface JobDetailClientProps {
    job: DetailedJob;
}

export default function JobDetailClient({ job }: JobDetailClientProps) {
    const router = useRouter();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleApply = () => {
        localStorage.setItem('mono_demo_stage', 'APPLIED');
        window.dispatchEvent(new Event('storage'));
        setShowSuccessModal(true);
    };

    const handleConfirm = () => {
        setShowSuccessModal(false);
        router.push('/');
    };

    return (
        <main className={styles.main}>
            {/* Top Navigation */}
            <div className={styles.topNav}>
                <button onClick={() => router.back()} className={styles.backBtn}>
                    <ArrowLeft size={20} />
                </button>
                <div className={styles.utility}>
                    <button className={styles.iconBtn}><Share2 size={18} /></button>
                    <button className={styles.iconBtn}><Star size={18} /></button>
                </div>
            </div>

            {/* Hero Summary */}
            <section className={styles.heroSection}>
                <div className={styles.badgeRow}>
                    <span className={styles.categoryBadge}>{job.category || '기타'}</span>
                    {job.isUrgent && (
                        <span className={styles.urgentBadge}>
                            <Zap size={12} fill="#ef4444" color="#ef4444" />
                            실시간 급구
                        </span>
                    )}
                </div>
                <h1 className={styles.title}>{job.title}</h1>
                <div className={styles.wageBox}>
                    <span className={styles.wageLabel}>하루 일당 (안전하게 확인 중)</span>
                    <div className={styles.wageValue}>
                        <span className={styles.currency}>₩</span>
                        <strong>{job.dailyWage?.toLocaleString() || job.pay}</strong>
                    </div>
                </div>
            </section>

            <div className={styles.contentGrid}>
                {/* Main Info Columns */}
                <div className={styles.mainContent}>
                    {/* Critical Details */}
                    <GlassCard className={styles.detailCard}>
                        <div className={styles.gridInfo}>
                            <div className={styles.infoItem}>
                                <div className={styles.infoIcon}><MapPin size={20} color="#3182f6" /></div>
                                <div className={styles.infoLabel}>작업 위치</div>
                                <div className={styles.infoVal}>{job.location}</div>
                            </div>
                            <div className={styles.infoItem}>
                                <div className={styles.infoIcon}><Clock size={20} color="#3182f6" /></div>
                                <div className={styles.infoLabel}>집합 시간</div>
                                <div className={styles.infoVal}>{job.time || '07:30 (협의 가능)'}</div>
                            </div>
                            <div className={styles.infoItem}>
                                <div className={styles.infoIcon}><Trophy size={20} color="#D4AF37" /></div>
                                <div className={styles.infoLabel}>필요 기술</div>
                                <div className={styles.infoVal}>{job.specialty}</div>
                            </div>
                            <div className={styles.infoItem}>
                                <div className={styles.infoIcon}><ShieldCheck size={20} color="#30d158" /></div>
                                <div className={styles.infoLabel}>인증 상태</div>
                                <div className={styles.infoVal}>확인된 회사예요</div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* AI Site Foreman (AI 현장 반장) -> 현장 도움말 Section */}
                    <div className={styles.aiForemanSection} style={{ border: '1px solid rgba(49, 130, 246, 0.2)' }}>
                        <div className={styles.aiForemanHeader}>
                            <div className={styles.aiForemanIdentity}>
                                <div className={styles.aiAvatar} style={{ borderColor: '#3182f6' }}>
                                    <div className={styles.aiCore} style={{ borderColor: '#3182f6' }} />
                                    <Zap size={14} fill="#fff" color="#3182f6" />
                                </div>
                                <div className={styles.aiForemanTitle}>
                                    <h4>현장 도움말</h4>
                                    <div className={styles.aiStatus} style={{ color: '#3182f6' }}>
                                        <div className={styles.pulseDot} style={{ background: '#3182f6' }} />
                                        궁금한 현장 용어나 준비물을 쉽게 알려드릴게요
                                    </div>
                                </div>
                            </div>
                            <div className={styles.aiBadge} style={{ borderColor: '#3182f6', color: '#3182f6' }}>MONO 도움말</div>
                        </div>

                        <div className={styles.aiBriefingGrid}>
                            <div className={styles.briefingItem}>
                                <div className={styles.briefingLabel}>
                                    <AlertTriangle size={14} color="#ef4444" />
                                    <span>안전 유의사항</span>
                                </div>
                                <p className={styles.briefingText}>
                                    {job.id === 'u1' ? '3층 계단 양중 시 허리 부상 위험이 높습니다. 2인 1조 작업을 권장합니다.' : 
                                     job.id === 'u2' ? '철거 현장 비산 먼지가 많습니다. 1급 방진 마스크 착용이 필수입니다.' :
                                     '낙하물 주의 구역입니다. 안전모 턱끈을 반드시 조여주세요.'}
                                </p>
                            </div>
                            <div className={styles.briefingItem}>
                                <div className={styles.briefingLabel}>
                                    <Clock size={14} color="#3182f6" />
                                    <span>작업 효율 팁</span>
                                </div>
                                <p className={styles.briefingText}>
                                    {job.id === 'u1' ? '오전 10시에 폐기물 차량이 도착합니다. 9시 50분까지 자재 적재 완료 시 정시 종료 가능합니다.' : 
                                     '현장 도착 후 지하 1층 관리실에서 신규 등록 절차를 먼저 진행하시면 대기 시간을 15분 단축할 수 있습니다.'}
                                </p>
                            </div>
                        </div>
                        
                        <div className={styles.aiPredictionBanner} style={{ background: 'rgba(49, 130, 246, 0.05)', borderColor: 'rgba(49, 130, 246, 0.1)' }}>
                            <div className={styles.predictionIcon}>⚡</div>
                            <div className={styles.predictionContent}>
                                <strong>내 기술카드 :</strong> 이 현장 완료 시 근무 이력이 적립되어 <strong>내 기술 신뢰도</strong>가 상승합니다.
                            </div>
                        </div>
                    </div>

                    {/* Job Description */}
                    <section className={styles.descSection}>
                        <h3 className={styles.subTitle}>업무 상세 가이드</h3>
                        <div className={styles.descriptionText}>
                            {job.description || '상세 업무 설명이 없습니다. 지원하시면 담당자가 개별 안내 드립니다.'}
                        </div>
                    </section>

                    {/* Checkpoints */}
                    <section className={styles.checklistSection}>
                        <h3 className={styles.subTitle}>참여 전 체크리스트</h3>
                        <ul className={styles.checklist}>
                            <li>
                                <CheckCircle2 size={16} color="#30d158" />
                                <span>본인만의 보호구(안전모, 안전화 등) 지참 필수</span>
                            </li>
                            <li>
                                <CheckCircle2 size={16} color="#30d158" />
                                <span>작업 완료 후 내 기술 신뢰도 지수 추가 적립 예정</span>
                            </li>
                            <li>
                                <AlertTriangle size={16} color="#ef4444" />
                                <span>신청 승인 후 노쇼(No-Show) 시 향후 30일간 작업 매칭이 제한될 수 있습니다.</span>
                            </li>
                        </ul>
                    </section>
                </div>

                {/* Sidebar */}
                <div className={styles.sidebar}>
                    <GlassCard className={styles.summaryCard}>
                        <div className={styles.summaryHeader} style={{ color: '#ff6b00' }}>
                            <Users size={18} />
                            <span>현재 3명 모집 중 (2명 참여 중)</span>
                        </div>
                        <div className={styles.workerAvatars}>
                            <div className={styles.avatar}>KM</div>
                            <div className={styles.avatar}>JS</div>
                            <div className={styles.avatarEmpty}>+1</div>
                        </div>
                        <p className={styles.matchingText}>경력 5년 이상의 우수 기술 전문가와 함께 팀을 이뤄 작업합니다.</p>
                        
                        <Button 
                            className={styles.mainApplyBtn}
                            onClick={handleApply}
                            fullWidth
                            style={{ background: '#3182f6', color: '#fff' }}
                        >
                            일하러 가기 신청
                        </Button>
                        <p className={styles.applyNote}>* 신청 완료 후 회사에서 승인하면 즉시 안내해 드립니다.</p>
                    </GlassCard>
                </div>
            </div>

            {/* Application Success Modal */}
            <AnimatePresence>
                {showSuccessModal && (
                    <div className={styles.modalOverlay} onClick={handleConfirm}>
                        <motion.div 
                            className={styles.successModal}
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className={styles.closeModal} onClick={handleConfirm}><X size={20} /></button>
                            <div className={styles.successIcon}>
                                <CheckCircle2 size={64} color="#3182f6" />
                            </div>
                            <h2>신청이 완료됐어요.</h2>
                            <p style={{ margin: '8px 0 24px 0' }}>회사에서 확인하면 바로 알려드릴게요.</p>
                            
                            <div className={styles.nextStep}>
                                <span>신청 정보 요약</span>
                                <div className={styles.stepInfo}>
                                    <strong>{job.title}</strong>
                                    <p>일할 날짜: 내일 (오전 07:30)</p>
                                    <p>받을 예정 금액: ₩ {job.dailyWage?.toLocaleString() || job.pay}</p>
                                    <p style={{ marginTop: '8px', color: '#ff6b00', fontWeight: 'bold' }}>회사 승인 대기 중 (약 5분 이내 처리)</p>
                                </div>
                            </div>
                            <button className={styles.confirmBtn} onClick={handleConfirm} style={{ background: '#3182f6', color: '#fff' }}>확인</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
