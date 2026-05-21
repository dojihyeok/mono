'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Radar, 
    RadarChart, 
    PolarGrid, 
    PolarAngleAxis, 
    PolarRadiusAxis, 
    ResponsiveContainer 
} from 'recharts';
import { 
    Award, 
    ShieldCheck, 
    Zap, 
    Mail, 
    Star,
    CheckCircle2,
    Briefcase,
    Activity,
    ClipboardCheck,
    Fingerprint,
    FileText,
    History
} from 'lucide-react';
import { useUI } from '@/context/UIContext';
import styles from './page.module.css';

export default function ProfileClient({ id }: { id: string }) {
    const [showProposal, setShowProposal] = useState(false);
    const { showToast } = useUI();
    
    const EXPERT = id === 'seo-jeong-feel-good' ? {
        name: '서정필굿',
        specialty: '현장 운영 및 소통 전문가',
        trustIndex: 99.9,
        experience: '18년',
        projects: 215,
        equipment: 'Mobile Field Comm Station',
        image: '/images/masters/profile_placeholder.png'
    } : {
        name: '이창근',
        specialty: '수중 용접 & 산업 설비 핵심 전문가',
        trustIndex: 98.2,
        experience: '22년',
        projects: 142,
        equipment: 'HYUNDAI 220-7 (Customized)',
        image: '/images/masters/profile_placeholder.png'
    };

    const CORE_SKILLS = ['수중 용접', '유압 시스템 점검', '안전 관리 감독', '현장 총괄 매니지먼트'];
    
    const RECENT_HISTORY = [
        { project: '사우디 네옴시티 (댐 공정)', role: '리드 전문 용접공', score: 99, date: '2024 - 2025' },
        { project: '삼성 평택 P4 반도체 현장', role: '현장 팀 리더', score: 97, date: '2023 - 2024' },
        { project: '호주 그린에너지 플랜트', role: '기술 지원 리더', score: 98, date: '2022 - 2023' }
    ];

    const reputationData = [
        { subject: '기술 숙련도', A: 95, fullMark: 100 },
        { subject: '안전 관리', A: 98, fullMark: 100 },
        { subject: '소통 능력', A: 92, fullMark: 100 },
        { subject: '도구 활용', A: 88, fullMark: 100 },
        { subject: '근태 신뢰', A: 99, fullMark: 100 },
    ];

    return (
        <div className={styles.pageWrap}>
            {/* 1. Header Profile Area */}
            <div className={styles.profileHeader}>
                <div className={styles.avatarWrap}>
                    <div className={styles.avatarRing}>
                        <div className={styles.imgCircle}>
                             <div className={styles.placeholderImg}>{EXPERT.name[0]}</div>
                        </div>
                    </div>
                    <div className={styles.trustBadge}>
                        <ShieldCheck size={14} />
                        <span>전문가 신뢰도 {EXPERT.trustIndex}%</span>
                    </div>
                </div>
                <div className={styles.profileInfo}>
                    <h1>{EXPERT.name} 전문가</h1>
                    <span className={styles.specialty}>{EXPERT.specialty}</span>
                    <div className={styles.quickStats}>
                        <div className={styles.qsItem}>
                            <Briefcase size={14} /> <span>경력 {EXPERT.experience}</span>
                        </div>
                        <div className={styles.divider} />
                        <div className={styles.qsItem}>
                            <Award size={14} /> <span>수행 프로젝트 {EXPERT.projects}건+</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Verification Status */}
            <div className={styles.verifyStrip}>
                <div className={styles.verifyItem}>
                    <Fingerprint size={16} color="#3182f6" />
                    <span>신원 인증 완료</span>
                </div>
                <div className={styles.verifyItem}>
                    <FileText size={16} color="#3182f6" />
                    <span>국가기술자격 4건 인증</span>
                </div>
                <div className={styles.verifyItem}>
                    <ShieldCheck size={16} color="#3182f6" />
                    <span>안전보건교육 이수</span>
                </div>
            </div>

            {/* 3. Professional Assets Grid */}
            <div className={styles.assetGrid}>
                <div className={styles.assetCard}>
                    <h3>전문 보유 기술</h3>
                    <div className={styles.pillGrid}>
                        {CORE_SKILLS.map(skill => (
                            <span key={skill} className={styles.skillPill}>{skill}</span>
                        ))}
                    </div>
                </div>
                <div className={styles.assetCard}>
                    <h3>보유 장비 인프라</h3>
                    <div className={styles.equipmentInfo}>
                        <Zap size={24} color="#D4AF37" />
                        <div className={styles.eqText}>
                            <h4>{EXPERT.equipment}</h4>
                            <span style={{color: '#30d158', fontWeight: 800}}>실시간 가동 가능 (S급)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Reputation Analytics */}
            <div className={styles.analyticsSection}>
                <div className={styles.sectionHeader}>
                    <Activity size={20} color="#3182f6" />
                    <h3>360° 평판 분석 리포트</h3>
                </div>
                <div className={styles.chartCard}>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={reputationData}>
                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                                <Radar
                                    name="Expert Reputation"
                                    dataKey="A"
                                    stroke="#3182f6"
                                    fill="#3182f6"
                                    fillOpacity={0.2}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 5. Reputation & History */}
            <div className={styles.historySection}>
                <div className={styles.sectionHeader}>
                    <History size={20} color="#D4AF37" />
                    <h3>글로벌 프로젝트 히스토리</h3>
                </div>
                <div className={styles.timeline}>
                    {RECENT_HISTORY.map((hist, i) => (
                        <div key={i} className={styles.timelineItem}>
                            <div className={styles.timelineDot} />
                            <div className={styles.timelineContent}>
                                <div className={styles.timelineDate}>{hist.date}</div>
                                <h4>{hist.project}</h4>
                                <p>{hist.role}</p>
                                <div className={styles.histScore}>
                                    <Star size={12} fill="#D4AF37" color="#D4AF37" />
                                    <span>현장 만족도 {hist.score}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Deployment Action (Floating) */}
            <div className={styles.deploymentFixed}>
                <button className={styles.proposeBtn} onClick={() => setShowProposal(true)}>
                    <Mail size={20} />
                    <span>프로젝트 제안하기</span>
                </button>
            </div>

            {/* 5. Proposal Modal */}
            {showProposal && (
                <div className={styles.modalOverlay} onClick={() => setShowProposal(false)}>
                    <div className={styles.proposalCard} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>현장 투입 제안서</h2>
                            <button className={styles.closeBtn} onClick={() => setShowProposal(false)}>×</button>
                        </div>
                        <div className={styles.proposalBody}>
                            <p style={{color: 'rgba(255,255,255,0.4)', marginBottom: '2rem', fontSize: '0.95rem'}}>
                                {EXPERT.name} 전문가님의 전문 역량을 고려하여<br/>아래 프로젝트에 최적의 조건으로 모시고자 합니다.
                            </p>
                            
                            <div className={styles.inputGroup}>
                                <label>대상 프로젝트</label>
                                <div className={styles.selectBox}>사우디 NEOM City (Sector 4)</div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>제안 수익 (월 예상 수익)</label>
                                <div className={styles.offerValue}>₩ 42,500,000 ~ ₩ 50,000,000</div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>예상 투입 기간</label>
                                <div className={styles.datePicker}>2026.05.01 - 2026.11.30 (6개월)</div>
                            </div>

                            <div className={styles.benefitRow}>
                                <CheckCircle2 size={16} color="#D4AF37" />
                                <span>글로벌 현장 체류 및 주거 비용 100% 지원</span>
                            </div>
                            <div className={styles.benefitRow}>
                                <CheckCircle2 size={16} color="#D4AF37" />
                                <span>모노 전문가 전용 상해/보상 보험 가입</span>
                            </div>
                        </div>
                        <button className={styles.sendBtn} onClick={() => {
                            showToast('프로젝트 제안서가 전문가님께 정식으로 발송되었습니다.', 'success');
                            setShowProposal(false);
                        }}>
                            제안서 최종 발송
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
