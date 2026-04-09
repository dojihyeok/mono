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
    Wind
} from 'lucide-react';
import styles from './page.module.css';
import GlassCard from '@/components/UI/GlassCard';

export default function ForemanClient() {
    const [mode, setMode] = useState<'JUNIOR' | 'SENIOR'>('JUNIOR');
    const [checkedItems, setCheckedItems] = useState<number[]>([]);
    const [hours, setHours] = useState('8');
    const [wage, setWage] = useState('150000');

    const toggleCheck = (i: number) => {
        setCheckedItems(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
    };

    const dailyPay = Math.round((parseInt(wage) || 0) / 8 * (parseInt(hours) || 0));
    const overtimePay = parseInt(hours) > 8 ? Math.round(((parseInt(wage) || 0) / 8) * (parseInt(hours) - 8) * 0.5) : 0;

    const JUNIOR_TASKS = [
        {
            title: '첫 현장 출근 체크리스트',
            level: 'Level 1',
            desc: '안전모, 안전화, 조끼 착용 → 출역 QR 스캔 → 반장 보고 → 작업 위치 확인. 이 4단계만 기억하세요.',
            status: 'RECOMMENDED',
            tag: '⚠️ 필수'
        },
        {
            title: '짐(자재) 안전하게 나르는 법',
            level: 'Level 1',
            desc: '허리가 아닌 무릎으로 들어올리기. 20kg 이상은 반드시 2인 1조. 경사로에서 뒤로 내려가기.',
            status: 'NEW',
            tag: '🏋️ 체력'
        },
        {
            title: '현장 눈치 100배 키우기',
            level: 'Level 1',
            desc: '"이거 어디다 놓을까요?"가 정답. 혼자 판단 NO. 반장 지시 대기. 빈둥거리지 말고 주변 정리.',
            status: null,
            tag: '🧠 마인드'
        },
        {
            title: '공구 이름 & 기본 사용법',
            level: 'Level 2',
            desc: '각마(앵글그라인더), 스라브(슬래브), 빠루(바이어스), 오함마(대해머) - 현장 용어로 소통하는 법.',
            status: 'STORY',
            tag: '🔧 기술'
        },
        {
            title: '일당·특근·잔업 계산법',
            level: 'Level 2',
            desc: '일당 = 일급 ÷ 8시간 × 실근무시간. 야간/특근은 1.5배. 세금 3.3% 원천징수 기준 이해.',
            status: null,
            tag: '💰 정산'
        },
        {
            title: '비 오는 날 현장 대처법',
            level: 'Level 2',
            desc: '우천 시 전동공구 사용 금지. 철근·철판 위 미끄럼 주의. 현장 중단 시 일당 처리 기준 확인법.',
            status: 'NEW',
            tag: '🌧️ 날씨'
        },
    ];

    const SENIOR_GUIDES = [
        { 
            title: 'ISO 45001 안전보건 경영시스템', 
            label: 'GLOBAL STANDARD', 
            desc: '해외 고임금 현장(중동·동남아) 진출을 위한 국제 안전 인증 취득 가이드. 네옴시티·IHI 현장 적용 사례 포함.',
            icon: <ShieldCheck size={20} /> 
        },
        { 
            title: '고탄소강 TIG/MIG 용접 마스터', 
            label: 'TECH MASTERY', 
            desc: '스테인리스·알루미늄 특수소재 용접 기법. 3G/4G 자세 훈련. 해외 현장 용접 자격증(ABS/DNV) 취득 경로.',
            icon: <Flame size={20} /> 
        },
        { 
            title: '팀 리더 현장 관리 & 정산 연계', 
            label: 'LEADERSHIP', 
            desc: 'AI 관제 시스템 하에서 팀원 출역 관리, KPI 기반 성과 측정, 공정 보고서 작성, 도급 계약서 검토법.',
            icon: <TrendingUp size={20} /> 
        },
        { 
            title: '글로벌 현장 다국어 커뮤니케이션', 
            label: 'GLOBAL', 
            desc: '베트남·캄보디아·우즈벡 외국인 팀원과의 현장 소통 필수 표현. 안전 지시 다국어 카드 활용법.',
            icon: <Globe size={20} /> 
        },
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
                        NEURAL FOREMAN v3.0 ONLINE
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
                        {mode === 'JUNIOR' ? (
                            JUNIOR_TASKS.map((task, i) => (
                                <GlassCard key={i} className={styles.guideCard} hoverEffect>
                                    <div className={styles.cardHeader}>
                                        <span className={styles.levelBadge}>{task.level}</span>
                                        <span className={styles.tagBadge}>{task.tag}</span>
                                        {task.status && <span className={styles.statusBadge}>{task.status}</span>}
                                    </div>
                                    <h4 className={styles.taskTitle}>{task.title}</h4>
                                    <p className={styles.taskDesc}>{task.desc}</p>
                                    <button className={styles.viewDoc}>가이드 열기 <ChevronRight size={14} /></button>
                                </GlassCard>
                            ))
                        ) : (
                            SENIOR_GUIDES.map((guide, i) => (
                                <GlassCard key={i} className={styles.guideCard} hoverEffect>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.guideIcon}>{guide.icon}</div>
                                        <span className={styles.labelBadge}>{guide.label}</span>
                                    </div>
                                    <h4 className={styles.taskTitle}>{guide.title}</h4>
                                    <p className={styles.taskDesc}>{guide.desc}</p>
                                    <button className={styles.viewDoc}>심화 학습 시작 <ChevronRight size={14} /></button>
                                </GlassCard>
                            ))
                        )}
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

            {/* 현장 용어 사전 */}
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
