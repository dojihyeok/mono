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
    Mic,
    Radio,
    Bus,
    Armchair,
    History,
    Zap,
    Users
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

const VEHICLE_DATA = {
    plate: '52 가 1234',
    model: 'Hyundai Staria',
    eta: '12분 뒤',
    seats: [
        { id: 1, occupied: true },
        { id: 2, occupied: true },
        { id: 3, occupied: false }, // User seat
        { id: 4, occupied: true },
        { id: 5, occupied: false },
        { id: 6, occupied: false },
    ]
};

type WorkStatus = 'IDLE' | 'SHUTTLE' | 'GEOFENCE' | 'AUTH' | 'WORKING' | 'FINISH';

export default function AttendanceClient() {
    const [status, setStatus] = useState<WorkStatus>('IDLE');
    const [timer, setTimer] = useState(0);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'WORKING') {
            interval = setInterval(() => setTimer(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [status]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.pageWrap}>
            {/* Native Header */}
            <header className={styles.attendanceHeader}>
                <div className={styles.headerInfo}>
                    <span className={styles.dateLabel}>5월 13일 수요일</span>
                    <h1>현장 활동</h1>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.iconBtn}><History size={22} /></button>
                </div>
            </header>

            {/* Dynamic Activity Hub */}
            <main className={styles.activityHub}>
                {/* 1. Status Hero Section */}
                <section className={styles.statusHero}>
                    <div className={styles.siteInfoCard}>
                        <div className={styles.siteHeader}>
                            <div className={styles.badge}><Activity size={12} /> 실시간 안전 관제 중</div>
                            <h2>{SITE_DATA.name}</h2>
                            <p>📍 {SITE_DATA.location}</p>
                        </div>
                        <div className={styles.weatherInfo}>
                            <span>{SITE_DATA.weather}</span>
                        </div>
                    </div>

                    <div className={styles.mainActionArea}>
                        <AnimatePresence mode="wait">
                            {status === 'IDLE' && (
                                <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={styles.actionState}>
                                    <div className={styles.timeInfo}>
                                        <span>오늘의 집결 시간</span>
                                        <strong>오전 06:00</strong>
                                    </div>
                                    <button className={styles.primaryBtn} onClick={() => setStatus('SHUTTLE')}>집결지 도착 확인</button>
                                </motion.div>
                            )}

                            {status === 'SHUTTLE' && (
                                <motion.div key="shuttle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={styles.actionState}>
                                    <div className={styles.shuttleInfo}>
                                        <div className={styles.shuttleHeader}>
                                            <Bus size={20} />
                                            <span>셔틀 도착 예정 · {VEHICLE_DATA.eta}</span>
                                        </div>
                                        <div className={styles.shuttleDetails}>
                                            <strong>{VEHICLE_DATA.plate} ({VEHICLE_DATA.model})</strong>
                                            <p>3번 좌석에 탑승해 주세요.</p>
                                        </div>
                                    </div>
                                    <button className={styles.primaryBtn} onClick={() => setStatus('GEOFENCE')}>셔틀 탑승 완료</button>
                                </motion.div>
                            )}

                            {status === 'GEOFENCE' && (
                                <motion.div key="geofence" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={styles.actionState}>
                                    <div className={styles.gpsVerified}>
                                        <CheckCircle2 size={32} color="#30d158" />
                                        <strong>현장 도착 확인됨</strong>
                                        <p>현장 반경 내에 정상 진입했습니다.</p>
                                    </div>
                                    <button className={styles.primaryBtn} onClick={() => setStatus('AUTH')}>안전 장비 착용 인증</button>
                                </motion.div>
                            )}

                            {status === 'AUTH' && (
                                <motion.div key="auth" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={styles.actionState}>
                                    <div className={styles.scannerBox}>
                                        <div className={styles.scannerFrame}>
                                            <div className={styles.scanLine} />
                                            <Camera size={48} opacity={0.3} />
                                            {isScanning && <span className={styles.scanLabel}>AI 장비 분석 중...</span>}
                                        </div>
                                        <p>전신이 보이도록 카메라를 응시해 주세요.</p>
                                    </div>
                                    <button className={styles.primaryBtn} onClick={() => {
                                        setIsScanning(true);
                                        setTimeout(() => {
                                            setIsScanning(false);
                                            setStatus('WORKING');
                                        }, 2000);
                                    }}>인증 및 작업 시작</button>
                                </motion.div>
                            )}

                            {status === 'WORKING' && (
                                <motion.div key="working" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={styles.actionState}>
                                    <div className={styles.workTimer}>
                                        <span className={styles.pulse} />
                                        <div className={styles.timerValue}>{formatTime(timer)}</div>
                                        <p>오늘의 실시간 누적 수당: ₩ 145,200</p>
                                    </div>
                                    <button className={styles.secondaryBtn} onClick={() => setStatus('FINISH')}>작업 종료 및 퇴근</button>
                                </motion.div>
                            )}

                            {status === 'FINISH' && (
                                <motion.div key="finish" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={styles.actionState}>
                                    <div className={styles.finishSummary}>
                                        <div className={styles.summaryIcon}><Zap size={32} color="#D4AF37" /></div>
                                        <h3>오늘도 고생하셨습니다!</h3>
                                        <div className={styles.summaryGrid}>
                                            <div className={styles.sumItem}><span>작업 시간</span><strong>8시간 22분</strong></div>
                                            <div className={styles.sumItem}><span>예상 정산금</span><strong>₩ 195,000</strong></div>
                                        </div>
                                    </div>
                                    <Link href="/settlement" className={styles.primaryBtn}>정산 결과 확인</Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>

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

                {/* 3. Team & Activity Feed */}
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
                            <strong>AI 안전 관리 리포트</strong>
                        </div>
                        <p>모든 안전 수칙이 정상적으로 준수되고 있습니다. 현재 작업 환경은 <strong>안전</strong>합니다.</p>
                    </div>
                </section>
            </main>
        </div>
    );
}

