'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import GlassCard from '@/components/UI/GlassCard';
import Button from '@/components/UI/Button';
import styles from './page.module.css';
import { 
  Bus, 
  User, 
  MapPin, 
  Clock, 
  Navigation, 
  ShieldCheck, 
  Users,
  ChevronRight,
  Armchair,
  CheckCircle2
} from 'lucide-react';

// Mock Site Data for Phase 2.3
const SITE_DATA = {
    name: '청담동 고급 빌라 신축 현장',
    location: '서울특별시 강남구 청담동 124-5',
    distance: 0.15, // km
    weather: 'Sunny, 21°C',
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
    eta: '12 min',
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
    const [status, setStatus] = useState<'IDLE' | 'GATHERING' | 'BOARDED' | 'GPS_CHECKED' | 'PPE_NEEDED' | 'WORKING'>('IDLE');
    const [timer, setTimer] = useState(0);

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
        setTimeout(() => setStatus('GPS_CHECKED'), 1500); // Simulate arrival at site
    };

    const handleGpsCheck = () => {
        setStatus('GPS_CHECKED');
        setTimeout(() => setStatus('PPE_NEEDED'), 1000);
    };

    const handlePpeAuth = () => {
        setStatus('WORKING');
    };

    return (
        <div className={styles.pageWrap}>
            <Navbar />
            
            <main className={styles.main}>
                {/* 1. Map & Geofence (Visual Representation) */}
                <section className={styles.mapSection}>
                    <div className={styles.mapMock}>
                        <div className={styles.geofenceRing}></div>
                        <div className={styles.userMarker}>
                            <div className={styles.markerPulse}></div>
                        </div>
                        <div className={styles.mapLabel}>SITE: {SITE_DATA.name}</div>
                    </div>
                </section>

                {/* 2. Site Info Info */}
                <header className={styles.header}>
                    <div className={styles.siteHeader}>
                        <h1 className={styles.siteTitle}>{SITE_DATA.name}</h1>
                        <span className={styles.weatherTag}>☀️ {SITE_DATA.weather}</span>
                    </div>
                    <p className={styles.location}>{SITE_DATA.location}</p>
                </header>

                <div className={styles.actionGrid}>
                    {/* Attendance State Interaction */}
                    <GlassCard className={`${styles.statusCard} ${status === 'WORKING' ? styles.working : ''}`}>
                        {status === 'IDLE' && (
                            <div className={styles.idleState}>
                                <div className={styles.gatheringInfo}>
                                    <span className={styles.timeLabel}>오늘의 집합 시간</span>
                                    <h2 className={styles.gatheringTime}>06:00 AM</h2>
                                    <p className={styles.gatheringLoc}>📍 {SITE_DATA.location} (정문 앞 소공원)</p>
                                </div>
                                <Button className={styles.checkInBtn} onClick={handleStartGathering}>집합지 도착 확인</Button>
                            </div>
                        )}

                        {status === 'GATHERING' && (
                            <div className={styles.transitOperation}>
                                <header className={styles.transitHeader}>
                                    <div className={styles.transitBadge}>MISSION TRANSIT</div>
                                    <h3 className={styles.transitTitle}>이동 수단 배차 완료</h3>
                                </header>
                                
                                <div className={styles.vehicleCard}>
                                    <div className={styles.vehicleIcon}>
                                        <Bus size={32} color="#FF6B00" />
                                    </div>
                                    <div className={styles.vehicleInfo}>
                                        <div className={styles.plate}>{VEHICLE_DATA.plate}</div>
                                        <div className={styles.model}>{VEHICLE_DATA.model}</div>
                                        <div className={styles.driver}>{VEHICLE_DATA.driver}</div>
                                    </div>
                                    <div className={styles.etaBox}>
                                        <span className={styles.etaLabel}>출발 대기</span>
                                        <span className={styles.etaTime}>{VEHICLE_DATA.eta}</span>
                                    </div>
                                </div>

                                <div className={styles.seatMapSection}>
                                    <h4 className={styles.subTitle}>VEHICLE SEAT MAP (9 SEATS)</h4>
                                    <div className={styles.seatGrid}>
                                        {VEHICLE_DATA.seats.map(seat => (
                                            <div 
                                                key={seat.id} 
                                                className={`${styles.seat} ${seat.occupied ? styles.occupied : ''} ${seat.id === 3 ? styles.mySeat : ''}`}
                                            >
                                                <Armchair size={16} />
                                                <span className={styles.seatId}>{seat.id}</span>
                                                {seat.occupied && <span className={styles.seatUser}>{seat.name?.substring(0,1)}</span>}
                                                {seat.id === 3 && <span className={styles.myLabel}>내 좌석</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button className={styles.boardBtn} onClick={handleBoarding}>3번 좌석 탑승 완료 (Boarding)</Button>
                            </div>
                        )}

                        {status === 'BOARDED' && (
                            <div className={styles.transitOperation}>
                                <header className={styles.transitHeader}>
                                    <div className={styles.activeTransitBadge}>TRANSIT IN PROGRESS</div>
                                    <h3 className={styles.transitTitle}>현장으로 작전 투입 중</h3>
                                </header>

                                <div className={styles.transitProgress}>
                                    <div className={styles.progressLine}>
                                        <div className={styles.progressFill} style={{ width: '65%' }}></div>
                                        <div className={styles.vehicleMarker} style={{ left: '65%' }}>
                                            <Navigation size={20} fill="#FF6B00" color="#FF6B00" />
                                        </div>
                                    </div>
                                    <div className={styles.progressLabels}>
                                        <span>GATHERING</span>
                                        <span className={styles.activeLabel}>ON-THE-WAY</span>
                                        <span>SITE ARVL</span>
                                    </div>
                                </div>

                                <div className={styles.transitMeta}>
                                    <div className={styles.metaItem}>
                                        <Clock size={14} />
                                        <span>예상 도착: 07:45 AM</span>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <MapPin size={14} />
                                        <span>잔여 거리: 4.2km</span>
                                    </div>
                                </div>

                                <div className={styles.boardingPass}>
                                    <div className={styles.passHeader}>TRANSIT BOARDING PASS</div>
                                    <div className={styles.passContent}>
                                        <div className={styles.passRow}>
                                            <div className={styles.passCol}>
                                                <label>OPERATOR</label>
                                                <p>김모노 마스터</p>
                                            </div>
                                            <div className={styles.passCol}>
                                                <label>SEAT NO.</label>
                                                <p>03 (WINDOW)</p>
                                            </div>
                                        </div>
                                        <div className={styles.passRow}>
                                            <div className={styles.passCol}>
                                                <label>MISSION</label>
                                                <p>{SITE_DATA.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.passFooter}>
                                        <CheckCircle2 size={14} color="#22C55E" />
                                        <span>인증된 이동 수단 이용 중</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {status === 'GPS_CHECKED' && (
                            <div className={styles.gpsState}>
                                <div className={styles.gpsIndicator}>📍 현장 반경 150m 내 도착 완료</div>
                                <Button className={styles.checkInBtn} onClick={() => setStatus('PPE_NEEDED')}>현장 작업 시작 인증</Button>
                            </div>
                        )}

                        {(status === 'GPS_CHECKED' || status === 'PPE_NEEDED') && (
                            <div className={styles.ppeState}>
                                <div className={styles.cameraFrame}>
                                    <div className={styles.cameraFocus}></div>
                                    <div className={styles.ppeOverlay}>안전모/안전화를 착용해 주세요</div>
                                </div>
                                <Button className={styles.authBtn} onClick={handlePpeAuth}>안전 장비 인증 & 작업 시작</Button>
                            </div>
                        )}

                        {status === 'WORKING' && (
                            <div className={styles.workState}>
                                <span className={styles.workingLabel}>작업 진행 중</span>
                                <h2 className={styles.timer}>{formatTime(timer)}</h2>
                                <div className={styles.workFooter}>
                                    <span className={styles.startTime}>시작 시간: {SITE_DATA.shiftStart}</span>
                                    <Button variant="secondary" size="sm" onClick={() => setStatus('IDLE')}>퇴근 하기 (Checkout)</Button>
                                </div>
                            </div>
                        )}
                    </GlassCard>

                    {/* Site Team Members */}
                    <GlassCard className={styles.teamCard}>
                        <h3 className={styles.cardTitle}>TEAM AT SITE (3)</h3>
                        <div className={styles.teamList}>
                            {SITE_DATA.currentTeam.map(member => (
                                <div key={member.id} className={styles.memberItem}>
                                    <div className={styles.memberAvatar}>{member.initial}</div>
                                    <div className={styles.memberInfo}>
                                        <p className={styles.memberName}>{member.name}</p>
                                        <span className={styles.memberRole}>{member.role}</span>
                                    </div>
                                    <div className={styles.activeDot}></div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* 3. Site Daily Safety Checklist */}
                <section className={styles.checklistSection}>
                    <h3 className={styles.sectionTitle}>오늘의 현장 유의 사항</h3>
                    <ul className={styles.checklist}>
                        <li className={styles.checkItem}>⚠️ 골조 공사 중 낙하물 주의</li>
                        <li className={styles.checkItem}>⚡ 전기 배선 작업 전 전원 차단 확인</li>
                        <li className={styles.checkItem}>🧼 작업 후 잔여 타일 및 몰탈 정리</li>
                    </ul>
                </section>
            </main>
        </div>
    );
}
