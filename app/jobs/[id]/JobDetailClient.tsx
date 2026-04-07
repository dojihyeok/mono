'use client';

import React from 'react';
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
    Trophy
} from 'lucide-react';
import styles from './page.module.css';
import GlassCard from '@/components/UI/GlassCard';
import Button from '@/components/UI/Button';

interface JobDetailClientProps {
    job: any;
}

export default function JobDetailClient({ job }: JobDetailClientProps) {
    const router = useRouter();

    const handleApply = () => {
        if (confirm('이 현장에 즉시 참여하시겠습니까? 확정 시 현장 관리자에게 마스터님의 위치와 경력 자산 프로필이 전송됩니다.')) {
            // Simulate successful registration
            router.push('/attendance');
        }
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
                    <span className={styles.wageLabel}>하루 일당 (즉시 정산)</span>
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
                                <div className={styles.infoIcon}><MapPin size={20} color="#FF6B00" /></div>
                                <div className={styles.infoLabel}>작업 위치</div>
                                <div className={styles.infoVal}>{job.location}</div>
                            </div>
                            <div className={styles.infoItem}>
                                <div className={styles.infoIcon}><Clock size={20} color="#FF6B00" /></div>
                                <div className={styles.infoLabel}>집합 시간</div>
                                <div className={styles.infoVal}>{job.time || '07:30 (협의 가능)'}</div>
                            </div>
                            <div className={styles.infoItem}>
                                <div className={styles.infoIcon}><Trophy size={20} color="#B48A09" /></div>
                                <div className={styles.infoLabel}>필요 기술</div>
                                <div className={styles.infoVal}>{job.specialty}</div>
                            </div>
                            <div className={styles.infoItem}>
                                <div className={styles.infoIcon}><ShieldCheck size={20} color="#22C55E" /></div>
                                <div className={styles.infoLabel}>인증 상태</div>
                                <div className={styles.infoVal}>모노 마스터 인증 업체</div>
                            </div>
                        </div>
                    </GlassCard>

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
                                <CheckCircle2 size={16} color="#22C55E" />
                                <span>본인만의 안전 장비(안전모, 안전화 등) 지참 필수</span>
                            </li>
                            <li>
                                <CheckCircle2 size={16} color="#22C55E" />
                                <span>작업 완료 후 '마스터 경력 지수' 0.5% 추가 적립 예정</span>
                            </li>
                            <li>
                                <AlertTriangle size={16} color="#ef4444" />
                                <span>노쇼(No-Show) 시 향후 30일간 작업 매칭이 제한될 수 있습니다.</span>
                            </li>
                        </ul>
                    </section>
                </div>

                {/* Sticky Action Sidebar (Mobile bottom bar on phone) */}
                <div className={styles.sidebar}>
                    <GlassCard className={styles.summaryCard}>
                        <div className={styles.summaryHeader}>
                            <Users size={18} />
                            <span>현재 3명 모집 중 (2명 참여 중)</span>
                        </div>
                        <div className={styles.workerAvatars}>
                            <div className={styles.avatar}>KM</div>
                            <div className={styles.avatar}>JS</div>
                            <div className={styles.avatarEmpty}>+1</div>
                        </div>
                        <p className={styles.matchingText}>경력 5년 이상의 마스터와 함께 팀을 이뤄 작업합니다.</p>
                        
                        <Button 
                            className={styles.mainApplyBtn}
                            onClick={handleApply}
                            fullWidth
                        >
                            <Zap size={18} />
                            현장 즉시 참여 확정하기
                        </Button>
                        <p className={styles.applyNote}>* 확정 시 모바일 배차권이 즉시 발급됩니다.</p>
                    </GlassCard>
                </div>
            </div>
        </main>
    );
}
