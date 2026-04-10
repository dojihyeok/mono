'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import GlassCard from '@/components/UI/GlassCard';
import Button from '@/components/UI/Button';
import styles from './page.module.css';
import { 
  Bus, 
  MapPin, 
  Clock, 
  Navigation, 
  ShieldCheck, 
  ChevronRight,
  Armchair,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Camera,
  Activity,
  ArrowRight
} from 'lucide-react';

const SITE_DATA = {
    name: '청담동 고급 빌라 신축 현장',
    location: '서울특별시 강남구 청담동 124-5',
    distance: 0.15, // km
    weather: '맑음, 21˚C',
    shiftStart: '08:00',
    currentTeam: [
        { id: 'm1', name: '이마스터', initial: 'LM', role: '목수' },
        { id: 'm2', name: '박마스터', initial: 'PM', role: '전기' },
        { id: 'm3', name: '최보조', initial: 'CJ', role: '조공' }
    ]
};

const VEHICLE_DATA = {
    id: 'V-102',
    model: 'Hyundai Staria Master Van',
    plate: '52 가 1234',
    driver: '김영수 기사님',
    status: 'GATHERING',
    eta: '12분 뒤',
    seats: [
        { id: 1, occupied: true, name: '이마스터' },
        { id: 2, occupied: true, name: '박마스터' },
        { id: 3, occupied: false },
        { id: 4, occupied: true, name: '최보조' },
        { id: 5, occupied: false },
        { id: 6, occupied: false },
        { id: 7, occupied: false },
        { id: 8, occupied: false },
        { id: 9, occupied: false },
    ]
};

export default function AttendanceClient() {
    const [status, setStatus] = useState<'IDLE' | 'GATHERING' | 'BOARDED' | 'GPS_CHECKED' | 'PPE_SCAN' | 'WORKING' | 'SETTLED'>('IDLE');
    const [timer, setTimer] = useState(0);
    const [sosActive, setSosActive] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanStep, setScanStep] = useState(0);

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

    const handleStartGathering = () => {
        setStatus('GATHERING');
    };

    const handleBoarding = () => {
        setStatus('BOARDED');
        setTimeout(() => setStatus('GPS_CHECKED'), 1500); 
    };

    const handleSos = () => {
        setSosActive(true);
        setTimeout(() => {
            if (confirm('긴급 SOS 지원이 필요한 상황인가요? 현장 관리 센터와 주변 동료들에게 위치가 전송됩니다.')) {
                alert('SOS 신호가 정상적으로 전송되었습니다. 즉시 지원팀이 출동합니다.');
            } else {
                setSosActive(false);
            }
        }, 100);
    };

    const handlePpeAuth = () => {
        setIsScanning(true);
        setScanStep(0);
        
        setTimeout(() => setScanStep(1), 1000); 
        setTimeout(() => setScanStep(2), 2000); 
        setTimeout(() => {
            setIsScanning(false);
            setStatus('WORKING');
            setTimer(0);
        }, 3000);
    };

    const handleCheckout = () => {
        setStatus('SETTLED');
    };

    return (
        <div className={styles.pageWrap}>
            <Navbar />
            
            <main className={styles.main}>
                {/* 1. Map Area */}
                <section className={styles.mapSection}>
                    <div className={styles.mapMock}>
                        <div className={styles.geofenceRing}></div>
                        <div className={styles.userMarker}>
                            <div className={styles.markerPulse}></div>
                        </div>
                        <div className={styles.mapLabel}>오늘의 현장: {SITE_DATA.name}</div>
                    </div>
                </section>

                {/* 2. Site Header */}
                <header className={styles.header}>
                    <div className={styles.siteHeader}>
                        <div className={styles.commandBadge}>
                            <Activity size={12} /> 출역 및 안전 서비스 가동 중
                        </div>
                        <h1 className={styles.siteTitle}>{SITE_DATA.name}</h1>
                        <span className={styles.weatherTag}>☀️ {SITE_DATA.weather} (강남구 청담동)</span>
                    </div>
                </header>

                {/* Floating SOS */}
                {(status === 'GPS_CHECKED' || status === 'PPE_SCAN' || status === 'WORKING') && (
                    <button 
                        className={`${styles.sosBtn} ${sosActive ? styles.sosActive : ''}`}
                        onClick={handleSos}
                    >
                        <AlertTriangle size={24} />
                        <span>긴급 도움 요철 (SOS)</span>
                    </button>
                )}

                <div className={styles.actionGrid}>
                    <GlassCard className={styles.statusCard}>
                        {status === 'IDLE' && (
                            <div className={styles.idleState}>
                                <div className={styles.gatheringInfo}>
                                    <span className={styles.timeLabel}>오늘 오전 집결 시간</span>
                                    <h2 className={styles.gatheringTime}>오전 6:00</h2>
                                    <p className={styles.gatheringLoc}>📍 정문 앞 맞은편 파크랜드 공원</p>
                                </div>
                                <Button className={styles.checkInBtn} onClick={handleStartGathering}>집결지 도착 확인</Button>
                            </div>
                        )}

                        {status === 'GATHERING' && (
                            <div className={styles.transitOperation}>
                                <header className={styles.transitHeader}>
                                    <div className={styles.transitBadge}>현장 셔틀 대기 중</div>
                                    <h3 className={styles.transitTitle}>셔틀 차량이 배차되었습니다</h3>
                                </header>
                                
                                <div className={styles.vehicleCard}>
                                    <div className={styles.vehicleIcon}>
                                        <Bus size={36} color="#B48A09" />
                                    </div>
                                    <div className={styles.vehicleInfo}>
                                        <div className={styles.plate}>{VEHICLE_DATA.plate}</div>
                                        <div className={styles.model}>{VEHICLE_DATA.model}</div>
                                        <div className={styles.driver}>{VEHICLE_DATA.driver} (운행 담당자)</div>
                                    </div>
                                    <div className={styles.etaBox}>
                                        <span className={styles.etaTime}>{VEHICLE_DATA.eta} 출발 예정</span>
                                    </div>
                                </div>

                                <div className={styles.seatMapSection}>
                                    <h4 style={{fontSize: '14px', color: '#fff', marginBottom: '1.5rem', fontWeight: 800}}>마스터님의 전용 지정 좌석</h4>
                                    <div className={styles.seatGrid}>
                                        {VEHICLE_DATA.seats.map(seat => (
                                            <div 
                                                key={seat.id} 
                                                className={`${styles.seat} ${seat.occupied ? styles.occupied : ''} ${seat.id === 3 ? styles.mySeat : ''}`}
                                            >
                                                <Armchair size={20} />
                                                <span className={styles.seatId}>{seat.id}번</span>
                                                {seat.id === 3 && <span className={styles.myLabel}>내 자리</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button className={styles.checkInBtn} onClick={handleBoarding}>3번 좌석 탑승 확인</Button>
                            </div>
                        )}

                        {status === 'BOARDED' && (
                            <div className={styles.transitOperation}>
                                <header className={styles.transitHeader}>
                                    <div className={styles.transitBadge} style={{backgroundColor: '#B48A09', color: '#000'}}>현장으로 이동 중</div>
                                    <h3 className={styles.transitTitle}>현장에 안전하게 모시는 중입니다</h3>
                                </header>

                                <div className={styles.boardingPass} style={{background: 'rgba(255,255,255,0.03)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
                                        <div style={{fontSize: '12px', fontWeight: 800, color: '#B48A09'}}>MOBILE BOARDING PASS</div>
                                        <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.2)'}}>{VEHICLE_DATA.id}</div>
                                    </div>
                                    <div style={{display: 'flex', gap: '3rem', marginBottom: '1.5rem'}}>
                                        <div><label style={{fontSize: '11px', color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: '6px'}}>성함</label><strong style={{color: '#fff'}}>김모노 마스터</strong></div>
                                        <div><label style={{fontSize: '11px', color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: '6px'}}>지정 좌석</label><strong style={{color: '#fff'}}>03번 (창가)</strong></div>
                                    </div>
                                    <div style={{fontSize: '15px', color: '#fff', fontWeight: 700, padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                                        <CheckCircle2 size={16} color="#B48A09" /> 공식 셔틀 차량 인증됨
                                    </div>
                                </div>
                            </div>
                        )}

                        {status === 'GPS_CHECKED' && (
                            <div className={styles.idleState}>
                                <div className={styles.gpsIndicator} style={{marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 800, color: '#22C55E'}}>📍 현장 반경 내 도착이 확인되었습니다</div>
                                <Button className={styles.checkInBtn} onClick={() => setStatus('PPE_SCAN')}>안전 장비 착용 확인 시작</Button>
                            </div>
                        )}

                        {status === 'PPE_SCAN' && (
                            <div className={styles.ppeState}>
                                <div className={styles.scannerHeader}>
                                    <h3 style={{fontSize: '1.5rem', color: '#fff', marginBottom: '1rem', fontWeight: 800}}>안전 보호구 착용 확인</h3>
                                    <p style={{fontSize: '0.95rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6'}}>마스터님의 소중한 안전을 위해<br/>안전모와 안전화 착용 모습을 보여주세요.</p>
                                </div>
                                <div className={styles.cameraFrame}>
                                    <div className={styles.scannerLine}></div>
                                    <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.2}}>
                                        <Camera size={80} color="#fff" />
                                    </div>
                                    <div style={{position: 'absolute', bottom: '2rem', left: '0', right: '0', textAlign: 'center', fontSize: '14px', fontWeight: 800, color: '#fff'}}>
                                        {isScanning ? (scanStep === 1 ? '✅ 안전모 인식 완료' : scanStep === 2 ? '✅ 안전화 인식 완료' : '전신 스캐닝 중...') : 'AI 인식 대기 중'}
                                    </div>
                                </div>
                                <Button 
                                    className={styles.checkInBtn} 
                                    onClick={handlePpeAuth}
                                    disabled={isScanning}
                                >
                                    {isScanning ? 'AI 장비 분석 중입니다...' : '착용 완료 및 작업 시작'}
                                </Button>
                            </div>
                        )}

                        {status === 'WORKING' && (
                            <div className={styles.workState}>
                                <span className={styles.workingLabel}>오늘의 작업 진행 중</span>
                                <h2 className={styles.timer}>{formatTime(timer)}</h2>
                                <div className={styles.workFooter}>
                                    <Button variant="secondary" onClick={handleCheckout}>업무 종료 및 퇴근 인증</Button>
                                </div>
                            </div>
                        )}

                        {status === 'SETTLED' && (
                            <div className={styles.settledState}>
                                <div className={styles.successIcon}>
                                    <CheckCircle2 size={64} color="#B48A09" />
                                </div>
                                <h3 className={styles.settledTitle}>오늘 하루도 정말 고생하셨습니다!</h3>
                                
                                <div className={styles.summaryGrid}>
                                    <div className={styles.summaryItem}>
                                        <span className={styles.summaryLabel}>총 작업 시간</span>
                                        <span className={styles.summaryValue}>{formatTime(timer)}</span>
                                    </div>
                                    <div className={styles.summaryItem}>
                                        <span className={styles.summaryLabel}>오늘의 예상 수입</span>
                                        <span className={styles.summaryValue}>₩195,000</span>
                                    </div>
                                </div>

                                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                                    <Button className={styles.checkInBtn} onClick={() => setStatus('IDLE')}>기록 저장 및 종료</Button>
                                    <Link href="/settlement" style={{textDecoration: 'none', color: '#B48A09', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                                        상세 정산 리포트 확인 <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </GlassCard>

                    <GlassCard className={styles.teamCard}>
                        <h3 className={styles.cardTitle}>오늘 현장에서 함께하는 분들</h3>
                        <div className={styles.teamList}>
                            {SITE_DATA.currentTeam.map(member => (
                                <div key={member.id} className={styles.memberItem}>
                                    <div className={styles.memberAvatar}>{member.initial}</div>
                                    <div className={styles.memberInfo}>
                                        <p className={styles.memberName}>{member.name}</p>
                                        <span className={styles.memberRole}>{member.role} 전문</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </main>
        </div>
    );
}
