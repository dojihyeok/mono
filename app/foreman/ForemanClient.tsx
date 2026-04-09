'use client';

import { useState } from 'react';
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
    Flame,
    Wind,
    X,
    Info,
    ListChecks,
    Lightbulb
} from 'lucide-react';
import styles from './page.module.css';
import GlassCard from '@/components/UI/GlassCard';

interface GuideDetail {
    title: string;
    level?: string;
    desc: string;
    tag?: string;
    steps: {
        title: string;
        content: string;
    }[];
    tips?: string[];
}

export default function ForemanClient() {
    const [mode, setMode] = useState<'JUNIOR' | 'SENIOR'>('JUNIOR');
    const [checkedItems, setCheckedItems] = useState<number[]>([]);
    const [hours, setHours] = useState('8');
    const [wage, setWage] = useState('150000');
    const [selectedGuide, setSelectedGuide] = useState<GuideDetail | null>(null);

    const toggleCheck = (i: number) => {
        setCheckedItems(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
    };

    const dailyPay = Math.round((parseInt(wage) || 0) / 8 * (parseInt(hours) || 0));
    const overtimePay = parseInt(hours) > 8 ? Math.round(((parseInt(wage) || 0) / 8) * (parseInt(hours) - 8) * 0.5) : 0;

    const JUNIOR_TASKS: GuideDetail[] = [
        {
            title: '첫 현장 출근 체크리스트',
            level: 'Level 1',
            desc: '안전모, 안전화, 조끼 착용 → 출역 QR 스캔 → 반장 보고 → 작업 위치 확인. 이 4단계만 기억하세요.',
            tag: '⚠️ 필수',
            steps: [
                { title: '개인 보호구(PPE) 최종 확인', content: '안전모 턱끈 체결, 안전화 끈 조임, 형광 조끼 착용 상태를 거울이나 동료와 서로 확인합니다.' },
                { title: '출역 관리 시스템 등록', content: '현장 입구의 QR 코드를 스캔하거나 종이 출역부에 서명하여 본인의 출근 사실을 전산에 기록합니다.' },
                { title: 'TBM(Tool Box Meeting) 참여', content: '작업 시작 전 아침 체조와 안전 조례에 참여하여 당일 위험 요소와 작업 물량을 숙지합니다.' },
                { title: '반장 지시 사항 복창', content: '담당 반장님께 "000 작업하러 왔습니다"라고 보고하고, 구체적인 작업 위치와 주의사항을 확인합니다.' }
            ],
            tips: ['모르는 건 바로 물어보세요. 아는 척하다 사고 나면 본인 손해입니다.', '생수 한 병과 면장갑 여분은 항상 주머니에 챙기세요.']
        },
        {
            title: '짐(자재) 안전하게 나르는 법',
            level: 'Level 1',
            desc: '허리가 아닌 무릎으로 들어올리기. 20kg 이상은 반드시 2인 1조. 경사로에서 뒤로 내려가기.',
            tag: '🏋️ 체력',
            steps: [
                { title: '자재 무게 및 상태 파악', content: '먼저 살짝 들어보거나 흔들어보아 무게 중심과 날카로운 부분이 있는지 확인합니다.' },
                { title: '정석 자세 잡기', content: '발을 어깨너비로 벌리고, 허리를 곧게 편 상태에서 무릎을 굽혀 자재를 몸쪽으로 바짝 밀착시킵니다.' },
                { title: '무릎 힘으로 일어나기', content: '허리의 반동이 아닌 허벅지와 무릎의 힘으로 천천히 일어납니다. 시선은 정면을 향합니다.' },
                { title: '이동 경로 확보', content: '발밑에 전선이나 폐자재가 있는지 확인하며 걷습니다. 회전 시에는 몸 전체를 돌려야 합니다.' }
            ],
            tips: ['무거운 짐을 들고 허리를 비트는 동작은 디스크 파열의 주원인입니다.', '작업용 허리 보호대를 착용하면 확실히 도움이 됩니다.']
        },
        {
            title: '현장 눈치 100배 키우기',
            level: 'Level 1',
            desc: '"이거 어디다 놓을까요?"가 정답. 혼자 판단 NO. 반장 지시 대기. 빈둥거리지 말고 주변 정리.',
            tag: '🧠 마인드',
            steps: [
                { title: '질문의 생활화', content: '작업이 끝났거나 다음 단계가 불확실할 때 "반장님 다음은 무엇을 할까요?"라고 즉시 묻습니다.' },
                { title: '주변 환경 정리정돈', content: '할 일이 없을 때는 바닥의 못이나 쓰레기를 치우는 모습을 보이면 "일할 줄 아는 사람"이라는 인상을 줍니다.' },
                { title: '작업 흐름 관찰', content: '상급자가 무엇을 필요로 할지 예측해 보세요. (예: 망치질할 때 못을 미리 꺼내둔다든지)' },
                { title: '안전 거리 유지', content: '장비가 움직일 때나 위에서 작업 중일 때는 절대 그 밑으로 지나가거나 근처에 있지 않습니다.' }
            ],
            tips: ['현장에서는 "일 잘하는 사람"보다 "말 잘 듣고 사고 안 내는 사람"을 더 선호합니다.', '휴식 시간에도 너무 구석진 곳에 혼자 있지 말고 팀원들과 어울리세요.']
        },
        {
            title: '공구 이름 & 기본 사용법',
            level: 'Level 2',
            desc: '각마(앵글그라인더), 스라브(슬래브), 빠루(바이어스), 오함마(대해머) - 현장 용어로 소통하는 법.',
            tag: '🔧 기술',
            steps: [
                { title: '주요 수공구 명칭 숙지', content: '빠루(지렛대), 오함마(큰 망치), 몽키(렌치), 뺀치(플라이어) 등 기본 명칭을 외웁니다.' },
                { title: '전동공구 안전 규칙', content: '모든 전동공구는 사용 전 전선 피복 상태를 확인하고, 반드시 보호 가드와 손잡이가 있는지 봅니다.' },
                { title: '공구 정리법', content: '사용 후에는 흙이나 먼지를 털어내고 반드시 지정된 공구함이나 창고에 반납합니다.' },
                { title: '소모품 교체 주기', content: '커터 칼날, 그라인더 날 등이 무뎌지면 억지로 쓰지 말고 즉시 교체 요청을 하세요.' }
            ],
            tips: ['공구를 타인에게 전달할 때는 반드시 손잡이가 상대방을 향하게 해서 건넵니다.', '남의 공구를 빌려 썼다면 깨끗이 닦아서 돌려주는 게 현장 예의입니다.']
        }
    ];

    const SENIOR_GUIDES: GuideDetail[] = [
        { 
            title: 'ISO 45001 안전보건 경영시스템', 
            desc: '해외 고임금 현장(중동·동남아) 진출을 위한 국제 안전 인증 취득 가이드.',
            tag: 'GLOBAL STANDARD', 
            steps: [
                { title: '시스템 개요 이해', content: 'ISO 45001이 요구하는 PDCA(Plan-Do-Check-Act) 사이클의 개념을 파악합니다.' },
                { title: '위험성 평가 방법론', content: '현장의 잠재적 위험 요소를 식별하고 리스크 등급을 산정하는 기술을 습득합니다.' },
                { title: '비상 대응 시나리오', content: '중대 재해 발생 시 비상 연락망 가동 및 초도 조치 매뉴얼을 작성해 봅니다.' }
            ],
            tips: ['영어/제2외국어 안전 용어를 익혀두면 해외 현장 관리자 진급이 매우 빠릅니다.']
        }
    ];

    const SAFETY_CHECKLIST = [
        { text: '안전모 착용 및 턱끈 체결', icon: <HardHat size={14}/> },
        { text: '안전화(S1P 등급 이상) 착용', icon: <CheckCircle2 size={14}/> },
        { text: '형광 안전 조끼 착용', icon: <CheckCircle2 size={14}/> },
        { text: '출역 QR 스캔 완료', icon: <CheckCircle2 size={14}/> },
        { text: '작업 구역 위험 요소 사전 확인', icon: <AlertCircle size={14}/> },
        { text: '사용 공구 파손 여부 점검', icon: <Wrench size={14}/> },
        { text: '비상구·소화기 위치 숙지', icon: <CheckCircle2 size={14}/> },
    ];

    const FIELD_SCHEDULE = [
        { time: '07:00', task: '현장 집결 & 출역 QR 스캔', done: true },
        { time: '07:30', task: '안전 조회 & 오늘 작업 지시', done: true },
        { time: '08:00', task: '오전 작업 시작', done: true },
        { time: '10:00', task: '휴식 (10분)', done: false },
        { time: '12:00', task: '점심 (1시간)', done: false },
        { time: '13:00', task: '오후 작업 시작', done: false },
        { time: '15:00', task: '휴식 (10분)', done: false },
        { time: '17:00', task: '작업 마무리 & 출퇴근 QR', done: false },
    ];

    return (
        <div className={styles.foremanContainer}>
            {/* Header / Foreperson Intro */}
            <div className={styles.intro}>
                <div className={styles.foremanAvatar}>
                    <div className={styles.avatarGlow}></div>
                    <div className={styles.avatarInner}>
                        <BrainCircuit size={40} className={styles.aiIcon} />
                        <div className={styles.scanningLine} />
                    </div>
                </div>
                <div className={styles.introText}>
                    <div className={styles.badge}>
                        <span className={styles.pulseDot} />
                        NEURAL FOREMAN v3.1 ONLINE
                    </div>
                    <h1>반갑습니다, <strong>모컬(Mo-Cul)</strong> 입니다.</h1>
                    <p>현장의 모든 변수를 데이터로 분석하여 최적의 가이드를 제공합니다.<br/>
                    <span style={{color: '#B48A09', fontWeight: 600}}>가이드 · 안전 체크 · 일당 계산 · 현장 일정</span>을 한 곳에서 관리하세요.</p>
                </div>
            </div>

            {/* 역할 카드 4종 */}
            <div className={styles.roleCards}>
                <div className={styles.roleCard}>
                    <BookOpen size={20} color="#B48A09"/>
                    <span>현장 가이드</span>
                </div>
                <div className={styles.roleCard}>
                    <ShieldCheck size={20} color="#22c55e"/>
                    <span>안전 체크</span>
                </div>
                <div className={styles.roleCard}>
                    <Calculator size={20} color="#3b82f6"/>
                    <span>일당 계산</span>
                </div>
                <div className={styles.roleCard}>
                    <CalendarDays size={20} color="#a855f7"/>
                    <span>현장 일정</span>
                </div>
            </div>

            {/* Mode Switcher */}
            <div className={styles.trackSwitcher}>
                <button 
                    className={`${styles.trackBtn} ${mode === 'JUNIOR' ? styles.activeTrack : ''}`}
                    onClick={() => setMode('JUNIOR')}
                >
                    <Zap size={18} />
                    <span>초보 마스터 (입문/기초)</span>
                </button>
                <button 
                    className={`${styles.trackBtn} ${mode === 'SENIOR' ? styles.activeTrack : ''}`}
                    onClick={() => setMode('SENIOR')}
                >
                    <Trophy size={18} />
                    <span>고급/글로벌 마스터 (숙련/최고)</span>
                </button>
            </div>

            <div className={styles.mainGrid}>
                {/* Guide List */}
                <div className={styles.guideWrapper}>
                    <h3 className={styles.sectionTitle}>
                        {mode === 'JUNIOR' ? '🔰 현장 생존 기초 가이드' : '⭐ 핵심 기술 & 글로벌 마스터 솔루션'}
                    </h3>
                    
                    <div className={styles.guideGrid}>
                        {(mode === 'JUNIOR' ? JUNIOR_TASKS : SENIOR_GUIDES).map((task, i) => (
                            <GlassCard key={i} className={styles.guideCard} hoverEffect>
                                <div className={styles.cardHeader}>
                                    {task.level && <span className={styles.levelBadge}>{task.level}</span>}
                                    <span className={styles.tagBadge}>{task.tag}</span>
                                </div>
                                <h4 className={styles.taskTitle}>{task.title}</h4>
                                <p className={styles.taskDesc}>{task.desc}</p>
                                <button 
                                    className={styles.viewDoc}
                                    onClick={() => setSelectedGuide(task)}
                                >
                                    가이드 열기 <ChevronRight size={14} />
                                </button>
                            </GlassCard>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    {/* AI 질문 */}
                    <GlassCard className={styles.chatCard}>
                        <div className={styles.chatHeader}>
                            <MessageSquare size={18} color="#FF6B00" />
                            <span>모컬에게 질문하기</span>
                        </div>
                        <p className={styles.chatIntro}>현장 돌발상황, 공구 사용법, 정산 문의 뭐든지 물어보세요.</p>
                        
                        <div className={styles.quickQuestions}>
                            <button className={styles.qBtn}>💧 "우천 시 일당 받을 수 있나요?"</button>
                            <button className={styles.qBtn}>🔧 "각마 날 교체하는 법 알려줘요"</button>
                            <button className={styles.qBtn}>💰 "특근 수당 계산 방법은?"</button>
                            <button className={styles.qBtn}>🏥 "현장 다쳤을 때 산재 신청법"</button>
                        </div>
                        
                        <div className={styles.chatInputRow}>
                            <input type="text" placeholder="질문을 입력하세요..." className={styles.chatInput} />
                            <button className={styles.sendBtn}><Zap size={18} /></button>
                        </div>
                    </GlassCard>

                    {/* 일당 계산기 */}
                    <GlassCard className={styles.calcCard}>
                        <div className={styles.chatHeader}>
                            <Calculator size={18} color="#3b82f6" />
                            <span>오늘 일당 계산기</span>
                        </div>
                        <div className={styles.calcRow}>
                            <label>일급 (원)</label>
                            <input 
                                type="number" 
                                value={wage} 
                                onChange={e => setWage(e.target.value)}
                                className={styles.calcInput}
                            />
                        </div>
                        <div className={styles.calcRow}>
                            <label>근무시간 (시간)</label>
                            <input 
                                type="number" 
                                value={hours} 
                                onChange={e => setHours(e.target.value)}
                                className={styles.calcInput}
                            />
                        </div>
                        <div className={styles.calcResult}>
                            <div className={styles.calcLine}>
                                <span>기본급</span>
                                <strong>{dailyPay.toLocaleString()}원</strong>
                            </div>
                            {overtimePay > 0 && (
                                <div className={styles.calcLine}>
                                    <span>연장수당 (1.5배)</span>
                                    <strong style={{color: '#B48A09'}}>+{overtimePay.toLocaleString()}원</strong>
                                </div>
                            )}
                            <div className={styles.calcTotal}>
                                <span>예상 수령액 (세전)</span>
                                <strong>{(dailyPay + overtimePay).toLocaleString()}원</strong>
                            </div>
                        </div>
                    </GlassCard>
                </aside>
            </div>

            {/* 안전 체크리스트 + 현장 일정 */}
            <div className={styles.bottomGrid}>
                {/* 안전 체크리스트 */}
                <GlassCard className={styles.checklistCard}>
                    <div className={styles.sectionHeader}>
                        <ShieldCheck size={22} color="#22c55e" />
                        <h3>출근 전 안전 체크리스트</h3>
                        <span className={styles.checkCount}>{checkedItems.length}/{SAFETY_CHECKLIST.length}</span>
                    </div>
                    <div className={styles.checkItems}>
                        {SAFETY_CHECKLIST.map((item, i) => (
                            <button 
                                key={i} 
                                className={`${styles.checkItem} ${checkedItems.includes(i) ? styles.checkDone : ''}`}
                                onClick={() => toggleCheck(i)}
                            >
                                {checkedItems.includes(i) 
                                    ? <CheckCircle2 size={18} color="#22c55e"/> 
                                    : <Circle size={18} color="#666"/>
                                }
                                <span>{item.text}</span>
                            </button>
                        ))}
                    </div>
                    {checkedItems.length === SAFETY_CHECKLIST.length && (
                        <div className={styles.allClear}>✅ 모든 항목 완료! 안전한 하루 되세요.</div>
                    )}
                </GlassCard>

                {/* 현장 일정표 */}
                <GlassCard className={styles.scheduleCard}>
                    <div className={styles.sectionHeader}>
                        <CalendarDays size={22} color="#a855f7" />
                        <h3>오늘 현장 일정</h3>
                        <span className={styles.dateLabel}>{new Date().toLocaleDateString('ko-KR', {month: 'long', day: 'numeric', weekday: 'short'})}</span>
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

            {/* Modal Overlay */}
            {selectedGuide && (
                <div className={styles.modalOverlay} onClick={() => setSelectedGuide(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={() => setSelectedGuide(null)}>
                            <X size={24} />
                        </button>
                        
                        <div className={styles.modalHeader}>
                            <div className={styles.modalBadgeRow}>
                                {selectedGuide.level && <span className={styles.levelBadge}>{selectedGuide.level}</span>}
                                <span className={styles.tagBadge}>{selectedGuide.tag}</span>
                            </div>
                            <h2 className={styles.modalTitle}>{selectedGuide.title}</h2>
                            <p className={styles.modalIntro}>{selectedGuide.desc}</p>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.stepSection}>
                                <h3><ListChecks size={20} color="#B48A09" /> 세부 가이드 (Step-by-Step)</h3>
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

                            {selectedGuide.tips && (
                                <div className={styles.tipSection}>
                                    <h3><Lightbulb size={20} color="#ffb700" /> 모컬의 현장 꿀팁</h3>
                                    <div className={styles.tipList}>
                                        {selectedGuide.tips.map((tip, idx) => (
                                            <div key={idx} className={styles.tipItem}>
                                                <Info size={16} />
                                                <span>{tip}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.confirmBtn} onClick={() => setSelectedGuide(null)}>
                                숙지 완료
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 나머지 섹션들... (용어 사전 등) */}
            <section className={styles.glossarySection}>
                <div className={styles.sectionHeader}>
                    <Globe size={24} color="#B48A09" />
                    <h2>현장 용어 사전 & 번역기</h2>
                    <span className={styles.newBadge}>GLOBAL SUPPORT</span>
                </div>
                
                <div className={styles.glossaryGrid}>
                    <GlassCard className={styles.translationBox}>
                        <h4 className={styles.boxTitle}>실시간 현장 번역 (Translator)</h4>
                        <div className={styles.translateUI}>
                            <div className={styles.langSelect}>
                                <span>현장 용어</span>
                                <ChevronRight size={14} />
                                <span>표준어 / English / Tiếng Việt</span>
                            </div>
                            <div className={styles.inputArea}>
                                <input type="text" placeholder="예: 가타바쿠, 데나오시, 오함마..." className={styles.transInput} />
                                <button className={styles.transBtn}>번역</button>
                            </div>
                            <div className={styles.transResult}>
                                <div className={styles.resItem}>
                                    <strong>가타바쿠 (Kata-waku)</strong>
                                    <p>표준어: 거푸집 (Formwork)</p>
                                    <span>콘크리트를 부어 굳히기 위한 틀을 말합니다.</span>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className={styles.dictionaryList}>
                        <h4 className={styles.boxTitle}>주요 현장 용어 Top 8</h4>
                        <div className={styles.dictItems}>
                            {[
                                { term: '데나오시', mean: '재작업 (Re-do)' },
                                { term: '구라스', mean: '유리 (Glass)' },
                                { term: '시마이', mean: '작업 종료 (Finish)' },
                                { term: '야리끼리', mean: '일당제 도급 (Task-based pay)' },
                                { term: '오함마', mean: '대해머 (Sledgehammer)' },
                                { term: '가꾸목', mean: '각목 / 각재 (Square timber)' },
                                { term: '단도리', mean: '준비/채비 (Preparation)' },
                                { term: '뽀루', mean: '나사못 볼트 (Bolt)' },
                            ].map((d, i) => (
                                <div key={i} className={styles.dictItem}>
                                    <span className={styles.term}>{d.term}</span>
                                    <span className={styles.mean}>{d.mean}</span>
                                </div>
                            ))}
                        </div>
                        <button className={styles.viewMoreDict}>용어 사전 전체보기 →</button>
                    </GlassCard>
                </div>
            </section>

            {/* 글로벌 마스터 로드맵 */}
            <section className={styles.roadmapSection}>
                <div className={styles.roadmapHeader}>
                    <div className={styles.headerInfo}>
                        <Activity size={24} color="#B48A09" />
                        <h2>글로벌 마스터 로드맵</h2>
                    </div>
                    <p>현재 숙련도: <strong>Intermediate (LV.24)</strong></p>
                </div>
                
                <div className={styles.roadmapVisual}>
                    <div className={styles.nodeActive}>부기술자<div className={styles.dot}></div></div>
                    <div className={styles.line}></div>
                    <div className={styles.nodeActive}>기술자<div className={styles.dotPulse}></div></div>
                    <div className={styles.lineDisabled}></div>
                    <div className={styles.node}>정마스터<div className={styles.dotGray}></div></div>
                    <div className={styles.lineDisabled}></div>
                    <div className={styles.node}>글로벌 마스터<div className={styles.dotGray}></div></div>
                </div>
                
                <div className={styles.roadmapInfo}>
                    <p>다음 등급(정마스터)까지 <strong>실무 경험 120시간</strong> 및 <strong>현장 자격 시험 1회</strong>가 남았습니다.</p>
                    <button className={styles.roadmapBtn}>스킬 트리 상세 보기</button>
                </div>
            </section>
        </div>
    );
}
