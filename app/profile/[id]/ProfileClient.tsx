'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { 
    Award, 
    ShieldCheck, 
    Zap, 
    Mail, 
    Star,
    CheckCircle2,
    Briefcase,
    Activity,
    ClipboardCheck
} from 'lucide-react';

export default function ProfileClient({ id }: { id: string }) {
    const [showProposal, setShowProposal] = useState(false);
    
    const MASTER = id === 'seo-jeong-feel-good' ? {
        name: '서정필굿',
        specialty: '현장 운영 및 소통 전문가',
        trustIndex: 99.9,
        experience: '18년',
        projects: 215,
        equipment: 'Mobile Field Comm Station',
        image: '/images/masters/profile_placeholder.png'
    } : {
        name: '이창근',
        specialty: '수중 용접 & 산업 설비 마스터',
        trustIndex: 98.2,
        experience: '22년',
        projects: 142,
        equipment: 'HYUNDAI 220-7 (Customized)',
        image: '/images/masters/profile_placeholder.png'
    };

    const CORE_SKILLS = ['수중 용접', '유압 시스템 점검', '안전 관리 감독', '현장 총괄 매니지먼트'];
    
    const RECENT_HISTORY = [
        { project: '사우디 네옴시티 (댐 공정)', role: '리드 전문 용접공', score: 99 },
        { project: '삼성 평택 P4 반도체 현장', role: '현장 팀 리더', score: 97 },
        { project: '호주 그린에너지 플랜트', role: '기술 지원 리더', score: 98 }
    ];

    return (
        <div className={styles.pageWrap}>
            {/* 1. Header Profile Area */}
            <div className={styles.profileHeader}>
                <div className={styles.avatarWrap}>
                    <div className={styles.avatarRing}>
                        <div className={styles.imgCircle}>
                             <div className={styles.placeholderImg}>MASTER</div>
                        </div>
                    </div>
                    <div className={styles.trustBadge}>
                        <ShieldCheck size={14} />
                        <span>마스터 신뢰도 {MASTER.trustIndex}%</span>
                    </div>
                </div>
                <div className={styles.profileInfo}>
                    <h1>{MASTER.name} 마스터</h1>
                    <span className={styles.specialty}>{MASTER.specialty}</span>
                    <div className={styles.quickStats}>
                        <div className={styles.qsItem}>
                            <Briefcase size={14} /> <span>경력 {MASTER.experience}</span>
                        </div>
                        <div className={styles.divider} />
                        <div className={styles.qsItem}>
                            <Award size={14} /> <span>수행 프로젝트 {MASTER.projects}건+</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Professional Assets Grid */}
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
                    <h3>보유 장비 및 인프라</h3>
                    <div className={styles.equipmentInfo}>
                        <Zap size={24} color="#D4AF37" />
                        <div className={styles.eqText}>
                            <h4>{MASTER.equipment}</h4>
                            <span style={{color: '#22C55E', fontWeight: 700}}>최적 운용 상태 (A+ 등급)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Reputation & History */}
            <div className={styles.historySection}>
                <div className={styles.sectionHeader}>
                    <ClipboardCheck size={20} color="#D4AF37" />
                    <h3>최근 프로젝트 수행 이력</h3>
                </div>
                <div className={styles.historyList}>
                    {RECENT_HISTORY.map((hist, i) => (
                        <div key={i} className={styles.historyItem}>
                            <div className={styles.histMain}>
                                <h4>{hist.project}</h4>
                                <span>{hist.role}</span>
                            </div>
                            <div className={styles.histScore}>
                                <Star size={10} fill="#D4AF37" />
                                <span>현장 평점 {hist.score}</span>
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
                                {MASTER.name} 마스터님의 전문 역량을 고려하여<br/>아래 프로젝트에 최적의 조건으로 모시고자 합니다.
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
                                <span>모노 마스터 전용 상해/보상 보험 가입</span>
                            </div>
                        </div>
                        <button className={styles.sendBtn} onClick={() => {
                            alert('프로젝트 제안서가 마스터님께 정식으로 발송되었습니다.');
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
