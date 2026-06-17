'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    Radio,
    Image,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemo } from '@/context/DemoContext';
import { useUI } from '@/context/UIContext';

const SITE_DATA = {
    name: '서초 반포 써밋팰리스 복합 신축현장',
    location: '서울특별시 서초구 반포동 72-1',
    distance: 0.08,
    weather: '맑음, 24˚C',
    shiftStart: '07:00 ~ 17:00',
    currentTeam: [
        { id: 'm1', name: '이목수', initial: 'LM', role: '목수' },
        { id: 'm2', name: '박철근', initial: 'BC', role: '철근' },
        { id: 'm3', name: '최형틀', initial: 'CH', role: '형틀' }
    ]
};

export default function AttendanceClient() {
    const { state, checkIn, checkOut, addOfflineRecord, setDemoStage } = useDemo();
    const { addToast } = useUI();
    const router = useRouter();

    const [timer, setTimer] = useState(0);
    const [isScanning, setIsScanning] = useState(false);
    
    // Offline Manual registration state
    const [showManualForm, setShowManualForm] = useState(false);
    const [manualSiteName, setManualSiteName] = useState('');
    const [manualDate, setManualDate] = useState('');
    const [manualRole, setManualRole] = useState('뼈대 튼튼 형틀목수');
    const [manualPhone, setManualPhone] = useState('');
    const [manualAgency, setManualAgency] = useState('');
    const [uploadedPhoto, setUploadedPhoto] = useState(false);

    // Timer logic when working
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (state.demoStage === 'CHECKED_IN') {
            interval = setInterval(() => setTimer(t => t + 1), 1000);
        } else {
            setTimer(0);
        }
        return () => clearInterval(interval);
    }, [state.demoStage]);

    // Format working timer
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
            checkIn('07:02');
            addToast('📍 출근 확인이 안전하게 처리되었습니다. 안전 장비를 꼭 준수해 주세요!', 'success');
        }, 2000);
    };

    const handleCheckOut = () => {
        checkOut('16:05');
        addToast('🚪 오늘 하루도 수고하셨습니다! 퇴근 확인이 전송되었습니다.', 'info');
        
        // Auto-approve after 5 seconds to simulate company action for VC pitch ease
        setTimeout(() => {
            setDemoStage('PAID');
            addToast('💰 회사 승인 완료! 오늘 일당이 본인 계좌로 안전하게 정산 지급되었습니다.', 'success');
        }, 5000);
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualSiteName || !manualDate) return;
        
        addOfflineRecord({
            siteName: manualSiteName,
            workDate: manualDate,
            role: manualRole,
            managerPhone: manualPhone || '010-0000-0000',
            agencyName: manualAgency || '모노 파트너 인력소',
            photoUploaded: uploadedPhoto
        });

        addToast('📋 수기 근무기록 등록 완료. 담당자 확인 시 기술카드에 즉시 반영됩니다.', 'success');
        
        // Reset form
        setManualSiteName('');
        setManualDate('');
        setManualPhone('');
        setManualAgency('');
        setUploadedPhoto(false);
        setShowManualForm(false);
    };

    return (
        <div className={styles.pageWrap}>
            {/* Native Header */}
            <header className={styles.attendanceHeader}>
                <div className={styles.headerInfo}>
                    <span className={styles.dateLabel}>오늘 일한 기록</span>
                    <h1>근무기록</h1>
                </div>
            </header>

            {/* Dynamic Activity Hub */}
            <main className={styles.activityHub}>
                
                {/* Site Info header card (Only when there is a job confirmed/in-progress) */}
                {['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'PAID'].includes(state.demoStage) && (
                    <section className={styles.statusHero} style={{ marginBottom: '1rem' }}>
                        <div className={styles.siteInfoCard}>
                            <div className={styles.siteHeader}>
                                <div className={styles.badge} style={{ color: '#2563eb', background: 'rgba(37, 99, 235, 0.1)' }}>
                                    <Activity size={12} /> 실시간 현장 관제 상태
                                </div>
                                <h2>{SITE_DATA.name}</h2>
                                <p>📍 {SITE_DATA.location}</p>
                            </div>
                            <div className={styles.weatherInfo}>
                                <span>{SITE_DATA.weather} • 배차 시간: {SITE_DATA.shiftStart}</span>
                            </div>
                        </div>
                    </section>
                )}

                {/* Main Interactive Action Box */}
                <section className={styles.statusHero}>
                    <div className={styles.mainActionArea}>
                        <AnimatePresence mode="wait">
                            
                            {/* ONBOARDING or INIT state -> No scheduled job */}
                            {(state.demoStage === 'ONBOARDING' || state.demoStage === 'INIT' || state.demoStage === 'APPLIED') && (
                                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.actionState}>
                                    <div className={styles.timeInfo}>
                                        <AlertTriangle size={44} color="#ff9f0a" style={{ margin: '0 auto 1.25rem auto' }} />
                                        <span>배정된 오늘 일정이 없습니다</span>
                                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.5rem 0 1.5rem 0', lineHeight: '1.5' }}>
                                            {state.demoStage === 'APPLIED' 
                                                ? '현재 신청하신 현장의 검수가 완료되지 않았습니다. 승인 완료 시 이메일과 알림톡으로 출역 안내를 해드릴게요.' 
                                                : '일자리 찾기 탭에서 반장님 주특기에 어울리는 현장에 신청해 보세요.'}
                                        </p>
                                    </div>
                                    <button onClick={() => router.push('/jobs')} className={styles.primaryBtn}>
                                        {state.demoStage === 'APPLIED' ? '신청 현황 확인하기' : '일자리 찾으러 가기'}
                                    </button>
                                </motion.div>
                            )}

                            {/* CONFIRMED state -> Ready to Check-in */}
                            {state.demoStage === 'CONFIRMED' && (
                                <motion.div key="confirmed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.actionState}>
                                    {isScanning ? (
                                        <div className={styles.scannerBox}>
                                            <div className={styles.scannerFrame}>
                                                <div className={styles.scanLine} />
                                                <Camera size={44} opacity={0.3} color="#2563eb" />
                                                <span className={styles.scanLabel}>QR 출근 도장 인식 중...</span>
                                            </div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '10px' }}>
                                                스마트폰을 현장의 공식 QR보드에 가까이 대어 출근 도장을 찍어주세요.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className={styles.gpsVerified}>
                                            <CheckCircle2 size={44} color="#10b981" />
                                            <strong>현장 반경 내 진입 확인됨 (오차 15m)</strong>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0.5rem 0 1.25rem 0', lineHeight: '1.4' }}>
                                                기초안전 보건 교육 서류가 회사에 사전 승인되었습니다. 출근 확인(보호구 안심 QR)을 눌러주세요.
                                            </p>
                                        </div>
                                    )}
                                    <button 
                                        className={styles.primaryBtn} 
                                        onClick={handleCheckIn}
                                        disabled={isScanning}
                                    >
                                        {isScanning ? '출근 확인 및 인증 중...' : '출근 확인 (안심 QR 촬영)'}
                                    </button>
                                </motion.div>
                            )}

                            {/* CHECKED_IN state -> Working */}
                            {state.demoStage === 'CHECKED_IN' && (
                                <motion.div key="working" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.actionState}>
                                    <div className={styles.workTimer}>
                                        <span className={styles.pulse} />
                                        <div className={styles.timerValue}>{formatTime(timer)}</div>
                                        <p style={{ color: '#2563eb', fontWeight: '800', marginTop: '8px' }}>
                                            현재 실시간 정산 확인 중인 수당: ₩ 145,200
                                        </p>
                                    </div>
                                    <button className={styles.secondaryBtn} onClick={handleCheckOut}>
                                        퇴근 확인 (오늘 작업 완료)
                                    </button>
                                </motion.div>
                            )}

                            {/* CHECKED_OUT state -> Pending Company Approval */}
                            {state.demoStage === 'CHECKED_OUT' && (
                                <motion.div key="checked_out" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.actionState}>
                                    <div className={styles.finishSummary}>
                                        <div className={styles.summaryIcon}><CheckCircle2 size={44} color="#ff9f0a" /></div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>오늘 일한 기록을 회사 확인 중이에요</h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 1.25rem 0', lineHeight: '1.45' }}>
                                            작업 종료 보고가 정상 수신되었습니다. 시공사 안전 관리자가 작업 완료 승인 시 내 기술카드에 즉시 기록됩니다. (예상 대기: 5초)
                                        </p>
                                        <div className={styles.summaryGrid}>
                                            <div className={styles.sumItem}><span>총 작업 시간</span><strong>8시간 22분</strong></div>
                                            <div className={styles.sumItem}><span>지급 예정일</span><strong>오늘 오후 18시</strong></div>
                                        </div>
                                    </div>
                                    <button className={styles.pendingBtn} disabled>
                                        회사 기록 확인 중...
                                    </button>
                                </motion.div>
                            )}

                            {/* PAID state -> Payout Completed */}
                            {state.demoStage === 'PAID' && (
                                <motion.div key="paid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.actionState}>
                                    <div className={styles.finishSummary}>
                                        <div className={styles.summaryIcon}><CheckCircle2 size={44} color="#10b981" /></div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: '#10b981' }}>오늘 일한 기록이 저장됐어요</h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 1.25rem 0', lineHeight: '1.4' }}>
                                            시공사의 공식 확인 및 서명이 완료되어 오늘 일당 지급이 완료되었습니다. 내 기술카드 평판점수가 누적되었습니다.
                                        </p>
                                        <div className={styles.summaryGrid}>
                                            <div className={styles.sumItem}><span>총 작업 시간</span><strong>8시간 22분</strong></div>
                                            <div className={styles.sumItem}><span>지급액(세후)</span><strong>₩ 227,245</strong></div>
                                        </div>
                                    </div>
                                    <button className={styles.paidBtn} onClick={() => router.push('/wallet')}>
                                        정산 및 내 기술카드 확인
                                    </button>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </section>

                {/* Offline manual entry list */}
                <section className={styles.offlineSection}>
                    <div className={styles.offlineCard}>
                        <div className={styles.offlineHeader}>
                            <ClipboardList size={18} color="#2563eb" />
                            <span>사무소에서 받은 일도 MoNo에 남길 수 있어요</span>
                        </div>
                        <p className={styles.offlineDesc}>
                            전화 연락이나 인력사무소 출역으로 다녀오신 현장 이력을 수기 등록해 주세요. 담당자 확인 통과 시 공식 기술카드로 축적됩니다.
                        </p>
                        <button className={styles.offlineBtn} onClick={() => setShowManualForm(true)}>
                            앱 밖에서 일한 기록 추가하기
                        </button>
                    </div>
                </section>

                {/* Offline record items list */}
                {state.attendance.offlineRecords.length > 0 && (
                    <section className={styles.recordListSection}>
                        <h3 className={styles.sectionTitleText}>직접 등록한 근무 기록 ({state.attendance.offlineRecords.length})</h3>
                        <div className={styles.recordsList}>
                            {state.attendance.offlineRecords.map(rec => (
                                <div key={rec.id} className={styles.recordItem}>
                                    <div className={styles.recordMain}>
                                        <div className={styles.recordInfo}>
                                            <h4>{rec.siteName}</h4>
                                            <p>{rec.workDate} • {rec.role} • {rec.agencyName}</p>
                                        </div>
                                        <span className={styles.recordBadge}>{rec.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Field Helpers & SOS Controls */}
                <section className={styles.fieldControls}>
                    <div className={styles.controlGrid}>
                        <button className={styles.controlBtn} onClick={() => addToast('📞 현장 긴급 연락망으로 무전 연결을 테스트합니다.', 'info')}>
                            <div className={styles.iconBox}><Radio size={20} /></div>
                            <span>무전기</span>
                        </button>
                        <button className={styles.controlBtn} onClick={() => addToast('👷‍♂️ 오늘 반포 써밋 현장 배정 동료: 3명 활동 중', 'info')}>
                            <div className={styles.iconBox}><Users size={20} /></div>
                            <span>동료 현황</span>
                        </button>
                        <button className={styles.controlBtn} style={{ color: '#ef4444' }} onClick={() => addToast('🚨 경고: 비상 비상 상황 전송! 안전 보증 관리실에 긴급 상황 알림.', 'error')}>
                            <div className={styles.iconBox} style={{ background: 'rgba(239, 68, 68, 0.1)' }}><AlertTriangle size={20} /></div>
                            <span>사고/위험 알리기</span>
                        </button>
                    </div>
                </section>

                {/* Team members */}
                {['CONFIRMED', 'CHECKED_IN'].includes(state.demoStage) && (
                    <section className={styles.activityFeed}>
                        <div className={styles.sectionHeader}>
                            <h3>함께하는 동료</h3>
                            <span>{SITE_DATA.currentTeam.length}명 활동 중</span>
                        </div>
                        <div className={styles.teamSlider}>
                            {SITE_DATA.currentTeam.map(member => (
                                <div key={member.id} className={styles.teamMember}>
                                    <div className={styles.avatar}>{member.initial}</div>
                                    <div className={styles.memberInfo}>
                                        <strong>{member.name} 반장님</strong>
                                        <span>{member.role}</span>
                                    </div>
                                </div>
                            ))}
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
                            <div className={styles.sheetHeaderMini}>
                                <div className={styles.sheetHandle}></div>
                                <button className={styles.closeBtn} onClick={() => setShowManualForm(false)}><X size={20} /></button>
                            </div>

                            <h2>앱 밖에서 일한 기록 추가</h2>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 20px 0', lineHeight: '1.45' }}>
                                사무소나 전화를 통해 개별 투입된 현장 기록을 등록해 주세요. 담당자 대조 후 반장님의 업무 데이터 카드로 귀속됩니다.
                            </p>

                            <form onSubmit={handleManualSubmit} className={styles.manualForm}>
                                <div className={styles.formGroup}>
                                    <label>현장명 (필수)</label>
                                    <input 
                                        type="text" 
                                        className={styles.inputField} 
                                        placeholder="예: 영등포 타임스퀘어 리모델링 현장" 
                                        required
                                        value={manualSiteName}
                                        onChange={e => setManualSiteName(e.target.value)}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>일한 날짜 (필수)</label>
                                    <input 
                                        type="date" 
                                        className={styles.inputField} 
                                        required
                                        value={manualDate}
                                        onChange={e => setManualDate(e.target.value)}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>현장 담당자 연락처 (선택)</label>
                                    <input 
                                        type="tel" 
                                        className={styles.inputField} 
                                        placeholder="예: 010-0000-0000" 
                                        value={manualPhone}
                                        onChange={e => setManualPhone(e.target.value)}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>소속 인력소명 (선택)</label>
                                    <input 
                                        type="text" 
                                        className={styles.inputField} 
                                        placeholder="예: 다도인력개발" 
                                        value={manualAgency}
                                        onChange={e => setManualAgency(e.target.value)}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>출역부 / 노무대장 사진 증빙 (선택)</label>
                                    <div 
                                        className={`${styles.photoUploader} ${uploadedPhoto ? styles.photoDone : ''}`}
                                        onClick={() => setUploadedPhoto(true)}
                                    >
                                        {uploadedPhoto ? (
                                            <>
                                                <Check size={20} color="#10b981" />
                                                <span>출역부 사진 등록 완료 (종이노무대장.jpg)</span>
                                            </>
                                        ) : (
                                            <>
                                                <Image size={22} color="#64748b" />
                                                <span>지문날인대장 또는 출역부 촬영하여 업로드</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.formActions}>
                                    <button type="button" className={styles.cancelBtn} onClick={() => setShowManualForm(false)}>
                                        취소
                                    </button>
                                    <button type="submit" className={styles.submitBtn}>
                                        기록 추가하기
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
