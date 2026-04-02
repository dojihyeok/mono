'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import { 
    Award, 
    ShieldCheck, 
    Zap, 
    Mail, 
    ChevronRight, 
    Globe, 
    Activity, 
    Star,
    CheckCircle2,
    Calendar,
    Briefcase
} from 'lucide-react';

export default function ProfileClient({ id }: { id: string }) {
    const [showProposal, setShowProposal] = useState(false);
    
    // Mock master data (can be fetched via id)
    const MASTER = id === 'seo-jeong-feel-good' ? {
        name: '서정필굿',
        en: 'MASTER SEO JEONG FEEL GOOD',
        specialty: '현장 운영 및 소통 전문가',
        trustIndex: 99.9,
        experience: '18 Years',
        projects: 215,
        equipment: 'Mobile Field Comm Station',
        image: '/images/masters/profile_placeholder.png'
    } : {
        name: '이창근',
        en: 'MASTER CHANG-GEUN LEE',
        specialty: '수중 용접 & 산업 설비 마스터',
        trustIndex: 98.2,
        experience: '22 Years',
        projects: 142,
        equipment: 'HYUNDAI 220-7 (Customized)',
        image: '/images/masters/profile_placeholder.png'
    };

    const CORE_SKILLS = ['Underwater Welding', 'Hydraulic Systems', 'Safety Lead', 'Site Management'];
    
    const RECENT_HISTORY = [
        { project: 'Saudi Neom City (Dam)', role: 'Lead Welder', score: 99 },
        { project: 'Samsung Pyeongtaek P4', role: 'Team Leader', score: 97 },
        { project: 'Australia Green Energy', role: 'Support Lead', score: 98 }
    ];

    return (
        <div className={styles.pageWrap}>
            {/* 1. Header Profile Area */}
            <div className={styles.profileHeader}>
                <div className={styles.avatarWrap}>
                    <div className={styles.avatarRing}>
                        <div className={styles.imgCircle}>
                             {/* Replace with actual image in production */}
                             <div className={styles.placeholderImg}>MASTER</div>
                        </div>
                    </div>
                    <div className={styles.trustBadge}>
                        <ShieldCheck size={16} />
                        <span>TRUST INDEX {MASTER.trustIndex}</span>
                    </div>
                </div>
                <div className={styles.profileInfo}>
                    <div className={styles.enName}>{MASTER.en}</div>
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
                    <h3>코어 기술 자산</h3>
                    <div className={styles.pillGrid}>
                        {CORE_SKILLS.map(skill => (
                            <span key={skill} className={styles.skillPill}>{skill}</span>
                        ))}
                    </div>
                </div>
                <div className={styles.assetCard}>
                    <h3>보유 핵심 장비</h3>
                    <div className={styles.equipmentInfo}>
                        <Zap size={20} color="#B48A09" />
                        <div className={styles.eqText}>
                            <h4>{MASTER.equipment}</h4>
                            <span>정비 등급: OPTIMAL (Master Certified)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Reputation & History */}
            <div className={styles.historySection}>
                <div className={styles.sectionHeader}>
                    <Activity size={20} color="#B48A09" />
                    <h3>최근 현장 기여 이력</h3>
                </div>
                <div className={styles.historyList}>
                    {RECENT_HISTORY.map((hist, i) => (
                        <div key={i} className={styles.historyItem}>
                            <div className={styles.histMain}>
                                <h4>{hist.project}</h4>
                                <span>{hist.role}</span>
                            </div>
                            <div className={styles.histScore}>
                                <Star size={12} color="#B48A09" />
                                <span>REPUTATION {hist.score}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Strategic Deployment Action (Floating) */}
            <div className={styles.deploymentFixed}>
                <button className={styles.proposeBtn} onClick={() => setShowProposal(true)}>
                    <Mail size={18} />
                    <span>프로젝트 현장 투입 제안 발송</span>
                </button>
            </div>

            {/* 5. Proposal Modal Overlay */}
            {showProposal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.proposalCard}>
                        <div className={styles.modalHeader}>
                            <h2>현장 투입 제안 (Deployment Offer)</h2>
                            <button className={styles.closeBtn} onClick={() => setShowProposal(false)}>×</button>
                        </div>
                        <div className={styles.proposalBody}>
                            <p>이창근 마스터님을 아래 현장에 맞춤형으로 배치하고자 합니다.</p>
                            
                            <div className={styles.inputGroup}>
                                <label>대상 프로젝트</label>
                                <div className={styles.selectBox}>Saudi Neom City (Sector 4)</div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>제안 수당 (Estimated Monthly)</label>
                                <div className={styles.offerValue}>₩ 42,500,000 ~ ₩ 50,000,000</div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>투입 기간</label>
                                <div className={styles.datePicker}>2026.05.01 - 2026.11.30 (6 Months)</div>
                            </div>

                            <div className={styles.benefitRow}>
                                <CheckCircle2 size={16} color="#B48A09" />
                                <span>글로벌 현장 체류 비용 100% 지원</span>
                            </div>
                            <div className={styles.benefitRow}>
                                <CheckCircle2 size={16} color="#B48A09" />
                                <span>MO-NO 마스터 전용 상해보험 가입</span>
                            </div>
                        </div>
                        <button className={styles.sendBtn} onClick={() => {
                            alert('현장 투입 제안이 마스터에게 발송되었습니다.');
                            setShowProposal(false);
                        }}>
                            제안서 최종 발송 (Sign & Send)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
