'use client';

import { useState, useEffect } from 'react';
import { 
    BrainCircuit, 
    ShieldCheck, 
    Zap, 
    MessageSquare, 
    TrendingUp, 
    Activity, 
    BookOpen, 
    ChevronRight,
    AlertCircle,
    Trophy,
    Construction,
    Globe,
    ClipboardList,
    Calculator,
    CalendarDays,
    CheckCircle2,
    Circle,
    HardHat,
    Wrench,
    X,
    ListChecks,
    CloudSun,
    Gauge,
    Scan
} from 'lucide-react';
import styles from './page.module.css';
import GlassCard from '@/components/UI/GlassCard';

interface GuideDetail {
    title: string;
    level?: string;
    desc: string;
    tag?: string;
    icon: React.ReactNode;
    steps: {
        title: string;
        content: string;
    }[];
    tips?: string[];
}

export default function ForemanClient() {
    const [mounted, setMounted] = useState(false);
    const [mode, setMode] = useState<'JUNIOR' | 'SENIOR'>('JUNIOR');
    const [checkedItems, setCheckedItems] = useState<number[]>([]);
    const [hours, setHours] = useState('8');
    const [wage, setWage] = useState('150000');
    const [selectedGuide, setSelectedGuide] = useState<GuideDetail | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleCheck = (i: number) => {
        setCheckedItems(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
    };

    const dailyPay = Math.round((parseInt(wage) || 0) / 8 * (parseInt(hours) || 0));
    const overtimePay = parseInt(hours) > 8 ? Math.round(((parseInt(wage) || 0) / 8) * (parseInt(hours) - 8) * 0.5) : 0;

    const JUNIOR_TASKS: GuideDetail[] = [
        {
            title: '첫 현장 출근 체크리스트',
            level: 'Lv.1 입문',
            desc: '안전모, 안전화, 조끼 착용 → 출근 인증 → 담당자 보고.',
            tag: '필수 가이드',
            icon: <ShieldCheck size={24} color="#B48A09" />,
            steps: [
                { title: '개인 보호구(PPE) 최종 확인', content: '안전모 턱끈 체결, 안전화 끈 조임, 형광 조끼 착용 상태를 확인합니다.' },
                { title: '출역 관리 시스템 등록', content: '현장 입구의 QR 코드를 스캔하여 본인의 출근 사실을 기록합니다.' },
                { title: 'TBM 안전 교육 참여', content: '작업 시작 전 안전 조례에 참여하여 당일 위험 요소를 숙지합니다.' }
            ],
            tips: ['모르는 건 바로 물어보세요. 아는 척하다 사고 나면 본인 손해입니다.']
        },
        {
            title: '안전한 자재 인양 노하우',
            level: 'Lv.1 입문',
            desc: '허리가 아닌 무릎으로 들어올리기. 20kg 이상은 2인 1조 작업.',
            tag: '업무 숙련도',
            icon: <Construction size={24} color="#B48A09" />,
            steps: [
                { title: '자재 무게 파악', content: '먼저 살짝 흔들어보아 무게 중심과 날카로운 부분이 있는지 확인합니다.' },
                { title: '무릎 힘으로 일어나기', content: '허리의 반동이 아닌 허벅지와 무릎의 힘으로 천천히 일어납니다.' }
            ],
            tips: ['작업용 허리 보호대를 착용하면 확실히 도움이 됩니다.']
        },
        {
            title: '현장 흐름과 커뮤니케이션',
            level: 'Lv.1 입문',
            desc: '단독 판단 지양. 담당자 지시 대기 및 주변 정리 정돈 생활화.',
            tag: '마인드셋',
            icon: <BrainCircuit size={24} color="#B48A09" />,
            steps: [
                { title: '질문의 생활화', content: '다음 단계가 불확실할 때 "반장님 다음은 무엇을 할까요?"라고 묻습니다.' },
                { title: '주변 환경 정리정돈', content: '바닥의 못이나 쓰레기를 치우는 모습을 보이면 좋은 인상을 줍니다.' }
            ],
            tips: ['현장에서는 "소통이 잘 되고 사고 안 내는 사람"을 가장 선호합니다.']
        },
        {
            title: '현장 전문 공구 용어 숙지',
            level: 'Lv.2 숙련',
            desc: '그라인더, 빠루, 해머 등 현장에서 자주 쓰는 전문 용어 가이드.',
            tag: '기술 용어',
            icon: <Wrench size={24} color="#B48A09" />,
            steps: [
                { title: '주요 수공구 명칭 숙지', content: '빠루(지렛대), 해머(큰 망치), 렌치 등 현장식 명칭을 외웁니다.' },
                { title: '전동공구 안전 규칙', content: '사용 전 전선 피복 상태를 확인하고 보호 가드를 확인합니다.' }
            ],
            tips: ['공구를 건넬 때는 반드시 손잡이가 상대방을 향하게 합니다.']
        }
    ];

    const SENIOR_GUIDES: GuideDetail[] = [
        { 
            title: '글로벌 안전 인증 (ISO 45001)', 
            desc: '해외 고임금 현장 진입을 위한 국제 안전 보건 경영시스템 인증 가이드.',
            tag: 'GLOBAL MASTER',
            icon: <Globe size={24} color="#B48A09" />, 
            steps: [
                { title: '시스템 개요 이해', content: 'ISO 45001이 요구하는 관리 프로세스의 개념을 파악합니다.' },
                { title: '위험성 평가 방법론', content: '잠재적 위험 요소를 식별하고 리스크 등급을 스스로 산정합니다.' }
            ],
            tips: ['영어 안전 용어를 익혀두면 해외 현장 관리자 진급이 매우 빠릅니다.']
        }
    ];

    const SAFETY_CHECKLIST = [
        { text: '안전모 착용 및 턱끈 체결', icon: <HardHat size={14}/> },
        { text: '안전화 착용 상태 확인', icon: <CheckCircle2 size={14}/> },
        { text: '형광 안전 조끼 착용', icon: <CheckCircle2 size={14}/> },
        { text: '출근 QR 스캔 및 인증 완료', icon: <Scan size={14}/> },
        { text: '작업 구역 위험 요소 사전 파악', icon: <AlertCircle size={14}/> },
        { text: '사용 공구 정밀 상태 점검', icon: <Wrench size={14}/> },
    ];

    const FIELD_SCHEDULE = [
        { time: '07:00', task: '현장 집결 및 인원 확인', done: true },
        { time: '07:30', task: '안전 교육 및 공지 확인', done: true },
        { time: '08:00', task: '오전 작업 개시 (1세션)', done: true },
        { time: '10:00', task: '공식 휴식 시간 (10분)', done: false },
        { time: '12:00', task: '점심 식사 및 현황 공유', done: false },
        { time: '13:00', task: '오후 작업 개시 (2세션)', done: false },
        { time: '17:00', task: '작업 종료 및 퇴근 인증', done: false },
    ];

    if (!mounted) return null;

    return (
        <div className={styles.foremanContainer}>
            {/* Header / Career Partner Intro */}
            <div className={styles.intro}>
                <div className={styles.foremanAvatar}>
                    <div className={styles.avatarGlow}></div>
                    <div className={styles.avatarInner}>
                        <BrainCircuit size={64} style={{opacity: 0.9}} />
                    </div>
                </div>
                <div className={styles.introText}>
                    <div className={styles.badge}>
                        <span className={styles.pulseDot} />
                        AI 커리어 매니저 가동 중
                    </div>
                    <h1>안녕하세요, <strong>커리어 매니저 모컬</strong>입니다.</h1>
                    <p>마스터님의 오늘 하루가 안전하고 가치 있게 기록될 수 있도록<br/>
                    맞춤형 기술 가이드와 실시간 정산 서비스를 제공합니다.</p>
                </div>

                <div className={styles.tacticalStats}>
                    <div className={styles.statBox}>
                        <CloudSun size={18} color="#B48A09" />
                        <div className={styles.statContent}>
                            <span>현재 기온</span>
                            <strong>12.4°C</strong>
                        </div>
                    </div>
                    <div className={styles.statBox}>
                        <Gauge size={18} color="#22C55E" />
                        <div className={styles.statContent}>
                            <span>현장 위험도</span>
                            <strong>안정적</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* 역할 선택 */}
            <div className={styles.roleCards}>
                <div className={styles.roleCard}>
                    <BookOpen size={28} color="#B48A09"/>
                    <span>기술 가이드</span>
                </div>
                <div className={styles.roleCard}>
                    <ShieldCheck size={28} color="#22c55e"/>
                    <span>안전 인증</span>
                </div>
                <div className={styles.roleCard}>
                    <Calculator size={28} color="#3b82f6"/>
                    <span>급여 계산</span>
                </div>
                <div className={styles.roleCard}>
                    <CalendarDays size={28} color="#a855f7"/>
                    <span>오늘의 일정</span>
                </div>
            </div>

            {/* Track Switcher */}
            <div className={styles.trackSwitcher}>
                <button 
                    className={`${styles.trackBtn} ${mode === 'JUNIOR' ? styles.activeTrack : ''}`}
                    onClick={() => setMode('JUNIOR')}
                >
                    <Zap size={18} />
                    <span>입문·초급 가이드</span>
                </button>
                <button 
                    className={`${styles.trackBtn} ${mode === 'SENIOR' ? styles.activeTrack : ''}`}
                    onClick={() => setMode('SENIOR')}
                >
                    <Trophy size={18} />
                    <span>글로벌·숙련 마스터</span>
                </button>
            </div>

            <div className={styles.mainGrid}>
                {/* Guide List */}
                <div className={styles.guideWrapper}>
                    <h3 className={styles.sectionTitle}>
                        {mode === 'JUNIOR' ? '🔰 현장 실전 핵심 노하우' : '⭐ 마스터 브랜딩 솔루션'}
                    </h3>
                    
                    <div className={styles.guideGrid}>
                        {(mode === 'JUNIOR' ? JUNIOR_TASKS : SENIOR_GUIDES).map((task, i) => (
                            <GlassCard key={i} className={styles.guideCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.iconBox}>{task.icon}</div>
                                    <div className={styles.badgeRow}>
                                        <span className={styles.tagBadge}>{task.tag}</span>
                                    </div>
                                </div>
                                <h4 className={styles.taskTitle}>{task.title}</h4>
                                <p className={styles.taskDesc}>{task.desc}</p>
                                <button 
                                    className={styles.viewDoc}
                                    onClick={() => setSelectedGuide(task)}
                                >
                                    가이드 확인 <ChevronRight size={14} />
                                </button>
                            </GlassCard>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    {/* 현장 비서 Chat */}
                    <GlassCard className={styles.chatCard}>
                        <div className={styles.chatHeader}>
                            <MessageSquare size={18} color="#B48A09" />
                            <span>현장 비서 모컬</span>
                        </div>
                        <p className={styles.chatIntro}>돌발상황이나 궁금한 점을 말씀해 주세요.</p>
                        
                        <div className={styles.quickQuestions}>
                            <button className={styles.qBtn}>🚨 "현재 작업 구역 안전 확인"</button>
                            <button className={styles.qBtn}>🔧 "공구 교체 시 인증 방법"</button>
                            <button className={styles.qBtn}>🏥 "가까운 응급의료소 찾기"</button>
                        </div>
                        
                        <div className={styles.chatInputRow}>
                            <input type="text" placeholder="질문을 입력하세요..." className={styles.chatInput} />
                            <button className={styles.sendBtn}><ArrowRight size={18} /></button>
                        </div>
                    </GlassCard>

                    {/* 일당 계산기 */}
                    <GlassCard className={styles.calcCard}>
                        <div className={styles.chatHeader}>
                            <Calculator size={18} color="#3b82f6" />
                            <span>급여 모의 정산</span>
                        </div>
                        <div className={styles.calcRow}>
                            <label>기본 일수 단가 (원)</label>
                            <input 
                                type="number" 
                                value={wage} 
                                onChange={e => setWage(e.target.value)}
                                className={styles.calcInput}
                            />
                        </div>
                        <div className={styles.calcRow}>
                            <label>오늘 투입 시간 (시간)</label>
                            <input 
                                type="number" 
                                value={hours} 
                                onChange={e => setHours(e.target.value)}
                                className={styles.calcInput}
                            />
                        </div>
                        <div className={styles.calcResult}>
                            <div className={styles.calcTotal}>
                                <span>오늘의 예상 수익</span>
                                <strong>{(dailyPay + overtimePay).toLocaleString()}원</strong>
                            </div>
                        </div>
                    </GlassCard>
                </aside>
            </div>

            {/* 안전 관제 + 일정 */}
            <div className={styles.bottomGrid}>
                {/* 안전 인증 */}
                <GlassCard className={styles.checklistCard}>
                    <div className={styles.sectionHeader}>
                        <ShieldCheck size={28} color="#22c55e" />
                        <h3>현장 안전 체크리스트</h3>
                        <span className={styles.checkCount}>{checkedItems.length}/{SAFETY_CHECKLIST.length} 완료</span>
                    </div>
                    <div className={styles.checkItems}>
                        {SAFETY_CHECKLIST.map((item, i) => (
                            <button 
                                key={i} 
                                className={`${styles.checkItem} ${checkedItems.includes(i) ? styles.checkDone : ''}`}
                                onClick={() => toggleCheck(i)}
                            >
                                {checkedItems.includes(i) 
                                    ? <CheckCircle2 size={20} color="#22c55e"/> 
                                    : <Circle size={20} color="rgba(255,255,255,0.1)"/>
                                }
                                <div className={styles.checkText}>
                                    {item.text}
                                </div>
                            </button>
                        ))}
                    </div>
                </GlassCard>

                {/* 오늘의 일정 */}
                <GlassCard className={styles.scheduleCard}>
                    <div className={styles.sectionHeader}>
                        <CalendarDays size={28} color="#a855f7" />
                        <h3>오늘의 타임라인</h3>
                    </div>
                    <div className={styles.scheduleItems}>
                        {FIELD_SCHEDULE.map((item, i) => (
                            <div key={i} className={`${styles.scheduleItem} ${item.done ? styles.schedDone : ''}`}>
                                <span className={styles.schedTime}>{item.time}</span>
                                <div className={styles.schedLine}>
                                    <div className={`${styles.schedDot} ${item.done ? styles.schedDotDone : ''}`}/>
                                    {i < FIELD_SCHEDULE.length - 1 && <div className={styles.schedConnector}/>}
                                </div>
                                <span className={styles.schedTask}>{item.task}</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            {/* Modal */}
            {selectedGuide && (
                <div className={styles.modalOverlay} onClick={() => setSelectedGuide(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={() => setSelectedGuide(null)}>
                            <X size={24} />
                        </button>
                        
                        <div className={styles.modalHeader}>
                            <div className={styles.modalBadgeRow}>
                                <span className={styles.tagBadge}>{selectedGuide.tag}</span>
                            </div>
                            <h2 className={styles.modalTitle}>{selectedGuide.title}</h2>
                            <p className={styles.modalIntro}>{selectedGuide.desc}</p>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.stepSection}>
                                <h3 style={{fontSize: '1.25rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px'}}>
                                    <ListChecks size={24} color="#B48A09" /> 
                                    상세 작업 노하우
                                </h3>
                                <div className={styles.stepList}>
                                    {selectedGuide.steps.map((step, idx) => (
                                        <div key={idx} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{idx + 1}</div>
                                            <div className={styles.stepText}>
                                                <h4>{step.title}</h4>
                                                <p>{step.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.confirmBtn} onClick={() => setSelectedGuide(null)}>
                                가이드 확인 완료
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
