'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { 
    MapPin, 
    Clock, 
    ShieldCheck, 
    ChevronRight,
    CheckCircle2,
    AlertTriangle,
    Camera,
    Activity,
    ArrowRight,
    History,
    Zap,
    Users,
    ClipboardList,
    Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SITE_DATA = {
    name: '청담동 고급 빌라 신축 현장',
    location: '서울특별시 강남구 청담동 124-5',
    distance: 0.15,
    weather: '맑음, 21˚C',
    shiftStart: '08:00',
    currentTeam: [
        { id: 'm1', name: '이기술자', initial: 'LT', role: '목수' },
        { id: 'm2', name: '박기술자', initial: 'PT', role: '전기' },
        { id: 'm3', name: '최보조', initial: 'CJ', role: '조공' }
    ]
};

export default function AttendanceClient() {
    const [demoStage, setDemoStage] = useState<string>('IDLE');
    const [timer, setTimer] = useState(0);
    const [isScanning, setIsScanning] = useState(false);
    
    // Offline Manual registration state
    const [showManualForm, setShowManualForm] = useState(false);
    const [manualSiteName, setManualSiteName] = useState('');
    const [manualDate, setManualDate] = useState('');
    const [manualRole, setManualRole] = useState('배관공');

    useEffect(() => {
        const savedStage = localStorage.getItem('mono_demo_stage') || 'IDLE';
        setDemoStage(savedStage);

        // Simple sync
        const interval = setInterval(() => {
            const currentStage = localStorage.getItem('mono_demo_stage') || 'IDLE';
            setDemoStage(currentStage);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Timer logic when working
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (demoStage === 'CHECKED_IN') {
            interval = setInterval(() => setTimer(t => t + 1), 1000);
        } else {
            setTimer(0);
        }
        return () => clearInterval(interval);
    }, [demoStage]);

    // Auto approver simulator on Checkout
    useEffect(() => {
        if (demoStage === 'CHECKED_OUT') {
            const timer = setTimeout(() => {
                localStorage.setItem('mono_demo_stage', 'PAID');
                setDemoStage('PAID');
                window.dispatchEvent(new Event('storage'));
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [demoStage]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleCheckIn = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            localStorage.setItem('mono_demo_stage', 'CHECKED_IN');
            setDemoStage('CHECKED_IN');
            window.dispatchEvent(new Event('storage'));
        }, 2000);
    };

    const handleCheckOut = () => {
        localStorage.setItem('mono_demo_stage', 'CHECKED_OUT');
        setDemoStage('CHECKED_OUT');
        window.dispatchEvent(new Event('storage'));
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualSiteName) return;
        
        // Simulating manual submission -> advances demo flow directly to CONFIRMED
        localStorage.setItem('mono_demo_stage', 'CONFIRMED');
        setDemoStage('CONFIRMED');
        window.dispatchEvent(new Event('storage'));
        setShowManualForm(false);
        alert('근무기록 수기 등록 요청이 수신되었습니다. 현장으로 즉시 출발해 주세요!');
    };

    return (
        <div className={styles.pageWrap}>
            {/* Native Header */}
            <header className={styles.attendanceHeader}>
                <div className={styles.headerInfo}>
                    <span className={styles.dateLabel}>오늘 일한 기록</span>
                    <h1>근무기록</h1>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.iconBtn}><History size={22} /></button>
                </div>
            </header>

            {/* Dynamic Activity Hub */}
            <main className={styles.activityHub}>
                
                {/* Site Info header card (Only when there is a job confirmed/in-progress) */}
                {['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'PAID'].includes(demoStage) && (
                    <section className={styles.statusHero} style={{ marginBottom: '1rem' }}>
                        <div className={styles.siteInfoCard}>
                            <div className={styles.siteHeader}>
                                <div className={styles.badge} style={{ color: '#3182f6', background: 'rgba(49, 130, 246, 0.1)' }}>
                                    <Activity size={12} /> 실시간 안전 관제 중
                                </div>
                                <h2>{SITE_DATA.name}</h2>
                                <p>📍 {SITE_DATA.location}</p>
                            </div>
                            <div className={styles.weatherInfo}>
                                <span>{SITE_DATA.weather}</span>
                            </div>
                        </div>
                    </section>
                )}

                {/* Main Interactive Action Box */}
                <section className={styles.statusHero}>
                    <div className={styles.mainActionArea}>
                        <AnimatePresence mode="wait">
                            
                            {/* IDLE state -> No scheduled job */}
                            {(demoStage === 'IDLE' || demoStage === 'APPLIED') && (
                                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.actionState}>
                                    <div className={styles.timeInfo}>
                                        <AlertTriangle size={48} color="#ff9f0a" style={{ margin: '0 auto 1.5rem auto' }} />
                                        <span>배정된 오늘 일정이 없습니다</span>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 2rem 0' }}>
                                            {demoStage === 'APPLIED' 
                                                ? '현재 회사에서 신청을 검수하고 있어요. 승인 시 바로 안내해 드립니다.' 
                                                : '일자리 찾기 탭에서 나에게 알맞은 현장을 신청해 보세요.'}
                                        </p>
                                    </div>
                                    <Link href="/jobs" className={styles.primaryBtn} style={{ background: '#3182f6', color: '#fff' }}>
                                        {demoStage === 'APPLIED' ? '신청 현황 확인하기' : '일자리 찾으러 가기'}
                                    </Link>
                                </motion.div>
                            )}

                            {/* CONFIRMED state -> Ready to Check-in */}
                            {demoStage === 'CONFIRMED' && (
                                <motion.div key="confirmed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.actionState}>
                                    {isScanning ? (
                                        <div className={styles.scannerBox}>
                                            <div className={styles.scannerFrame} style={{ borderColor: '#3182f6' }}>
                                                <div className={styles.scanLine} style={{ background: '#3182f6', boxShadow: '0 0 15px #3182f6' }} />
                                                <Camera size={48} opacity={0.3} color="#3182f6" />
                                                <span className={styles.scanLabel} style={{ color: '#3182f6' }}>보호구 확인 중...</span>
                                            </div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>전신이 보이도록 카메라를 비춰주세요.</p>
                                        </div>
                                    ) : (
                                        <div className={styles.gpsVerified}>
                                            <CheckCircle2 size={48} color="#30d158" />
                                            <strong>현장 반경 내 진입 완료</strong>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 1.5rem 0' }}>
                                                보호구(안전모, 안전화 등)를 올바르게 착용하고 출근 확인을 눌러주세요.
                                            </p>
                                        </div>
                                    )}
                                    <button 
                                        className={styles.primaryBtn} 
                                        onClick={handleCheckIn}
                                        disabled={isScanning}
                                        style={{ background: '#3182f6', color: '#fff' }}
                                    >
                                        {isScanning ? '출근 처리 중...' : '출근 확인 (보호구 확인)'}
                                    </button>
                                </motion.div>
                            )}

                            {/* CHECKED_IN state -> Working */}
                            {demoStage === 'CHECKED_IN' && (
                                <motion.div key="working" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.actionState}>
                                    <div className={styles.workTimer}>
                                        <span className={styles.pulse} />
                                        <div className={styles.timerValue} style={{ color: '#1c1c1e' }}>{formatTime(timer)}</div>
                                        <p style={{ color: '#3182f6' }}>실시간 정산 확인 중인 수당: ₩ 145,200</p>
                                    </div>
                                    <button className={styles.secondaryBtn} onClick={handleCheckOut}>
                                        퇴근 확인 (작업 종료)
                                    </button>
                                </motion.div>
                            )}

                            {/* CHECKED_OUT state -> Pending Company Approval */}
                            {demoStage === 'CHECKED_OUT' && (
                                <motion.div key="checked_out" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.actionState}>
                                    <div className={styles.finishSummary}>
                                        <div className={styles.summaryIcon}><CheckCircle2 size={48} color="#ff9f0a" /></div>
                                        <h3 style={{ marginBottom: '8px' }}>오늘 일한 기록을 확인 중이에요</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1.5rem 0' }}>
                                            회사의 승인 처리가 완료되면 정산 확정 및 내 기술카드에 일한 기록이 저장됩니다.
                                        </p>
                                        <div className={styles.summaryGrid}>
                                            <div className={styles.sumItem}><span>작업 시간</span><strong>8시간 22분</strong></div>
                                            <div className={styles.sumItem}><span>받을 예정 금액</span><strong>₩ 195,000</strong></div>
                                        </div>
                                    </div>
                                    <button className={styles.primaryBtn} disabled style={{ background: '#ff9f0a', color: '#fff' }}>
                                        회사 승인 대기 중...
                                    </button>
                                </motion.div>
                            )}

                            {/* PAID state -> Payout Completed */}
                            {demoStage === 'PAID' && (
                                <motion.div key="paid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.actionState}>
                                    <div className={styles.finishSummary}>
                                        <div className={styles.summaryIcon}><Zap size={48} color="#30d158" fill="#30d158" /></div>
                                        <h3 style={{ marginBottom: '8px', color: '#30d158' }}>오늘 일한 기록이 저장됐어요</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1.5rem 0' }}>
                                            정산이 완료되어 등록된 계좌로 당일 지급 처리되었습니다.
                                        </p>
                                        <div className={styles.summaryGrid}>
                                            <div className={styles.sumItem}><span>총 일한 시간</span><strong>8시간 22분</strong></div>
                                            <div className={styles.sumItem}><span>최종 지급 금액</span><strong>₩ 195,000</strong></div>
                                        </div>
                                    </div>
                                    <Link href="/settlement" className={styles.primaryBtn} style={{ background: '#30d158', color: '#fff' }}>
                                        지급 완료 내역 확인
                                    </Link>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </section>

                {/* Manual Registration & Offline digitalisation panel */}
                {(demoStage === 'IDLE' || demoStage === 'APPLIED') && (
                    <section className={styles.offlineSection}>
                        <div className={styles.offlineCard}>
                            <div className={styles.offlineHeader}>
                                <ClipboardList size={18} color="#3182f6" />
                                <span>앱 밖에서 일한 기록도 추가할 수 있어요</span>
                            </div>
                            <p className={styles.offlineDesc}>
                                전화나 종이 출역부로 배정받은 일자리 정보가 있으신가요? 직접 등록을 요청하면 담당자가 확인 후 내 기술카드에 반영해 드립니다.
                            </p>
                            <button className={styles.offlineBtn} onClick={() => setShowManualForm(true)}>
                                일한 기록 직접 등록 요청
                            </button>
                        </div>
                    </section>
                )}

                {/* 2. Field Controls */}
                <section className={styles.fieldControls}>
                    <div className={styles.controlGrid}>
                        <button className={styles.controlBtn}>
                            <div className={styles.iconBox}><Radio size={20} /></div>
                            <span>무전기</span>
                        </button>
                        <button className={styles.controlBtn}>
                            <div className={styles.iconBox}><Users size={20} /></div>
                            <span>동료</span>
                        </button>
                        <button className={styles.controlBtn} style={{ color: '#ff3b30' }}>
                            <div className={styles.iconBox} style={{ background: 'rgba(255, 59, 48, 0.1)' }}><AlertTriangle size={20} /></div>
                            <span>긴급 SOS</span>
                        </button>
                    </div>
                </section>

                {/* 3. Team Slider */}
                {['CONFIRMED', 'CHECKED_IN'].includes(demoStage) && (
                    <section className={styles.activityFeed}>
                        <div className={styles.sectionHeader}>
                            <h3>함께하는 팀원</h3>
                            <span>{SITE_DATA.currentTeam.length}명 활동 중</span>
                        </div>
                        <div className={styles.teamSlider}>
                            {SITE_DATA.currentTeam.map(member => (
                                <div key={member.id} className={styles.teamMember}>
                                    <div className={styles.avatar}>{member.initial}</div>
                                    <div className={styles.memberInfo}>
                                        <strong>{member.name}</strong>
                                        <span>{member.role}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.safeReport}>
                            <div className={styles.reportHeader}>
                                <ShieldCheck size={18} color="#30d158" />
                                <strong>안전 상태 확인</strong>
                            </div>
                            <p>오늘의 현장 유의사항은 <strong>미끄럼 주의</strong>입니다. 보호구를 제대로 착용해 주세요.</p>
                        </div>
                    </section>
                )}
            </main>

            {/* Offline registration form overlay */}
            <AnimatePresence>
                {showManualForm && (
                    <div className={styles.formOverlay} onClick={() => setShowManualForm(false)}>
                        <motion.div 
                            className={styles.formSheet}
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>일한 기록 직접 등록 요청</h2>
                            <p style={{ fontSize: '0.8rem', color: '#8e8e93', margin: '0 0 16px 0' }}>
                                아래 정보를 입력하시면 인력사무소나 현장 담당자가 확인 후 기록을 검증합니다.
                            </p>

                            <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div className={styles.formGroup}>
                                    <label>현장명</label>
                                    <input 
                                        type="text" 
                                        className={styles.inputField} 
                                        placeholder="예: 청담동 신축현장" 
                                        required
                                        value={manualSiteName}
                                        onChange={e => setManualSiteName(e.target.value)}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>작업 날짜</label>
                                    <input 
                                        type="date" 
                                        className={styles.inputField} 
                                        required
                                        value={manualDate}
                                        onChange={e => setManualDate(e.target.value)}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>담당 직종</label>
                                    <select 
                                        className={styles.inputField}
                                        value={manualRole}
                                        onChange={e => setManualRole(e.target.value)}
                                    >
                                        <option value="배관공">배관공</option>
                                        <option value="용접공">용접공</option>
                                        <option value="목수">목수</option>
                                        <option value="조공">조공</option>
                                    </select>
                                </div>

                                <div className={styles.formActions}>
                                    <button type="button" className={styles.cancelBtn} onClick={() => setShowManualForm(false)}>
                                        취소
                                    </button>
                                    <button type="submit" className={styles.submitBtn}>
                                        등록 요청
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
