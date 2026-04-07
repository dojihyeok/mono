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
    Search,
    AlertCircle,
    Trophy,
    Construction,
    Globe
} from 'lucide-react';
import styles from './page.module.css';
import GlassCard from '@/components/UI/GlassCard';
import Button from '@/components/UI/Button';

export default function ForemanClient() {
    const [mode, setMode] = useState<'JUNIOR' | 'SENIOR'>('JUNIOR');
    const [asking, setAsking] = useState(false);

    const JUNIOR_TASKS = [
        { title: '공사 현장 상하차 기초', level: 'Level 1', desc: '자재 파손 방지 및 안전한 하역 위치 설정법', status: 'RECOMMENDED' },
        { title: '안전보호구 2.0 착용법', level: 'Level 1', desc: 'AI 스캐너 인식률을 높이는 올바른 착용법', status: 'NEW' },
        { title: '현장 정리 정돈 (5S)', level: 'Level 2', desc: '작업 효율을 20% 높이는 도구 배치법', status: 'STORY' }
    ];

    const SENIOR_GUIDES = [
        { title: 'ISO 45001 글로벌 표준 적용', label: 'GLOBAL STANDARD', desc: '해외 하이-벨류 현장을 위한 안전 보건 경영 시스템 매뉴얼', icon: <ShieldCheck size={20} /> },
        { title: '고탄소강 특수 용접 기법', label: 'TECH MASTERY', desc: '사우디 네옴시티 현장 필수 기술 가이드', icon: <Construction size={20} /> },
        { title: '필드 팀 리더십 & 매니지먼트', label: 'LEADERSHIP', desc: 'AI 관제 시스템 하에서 팀원 성과 관리 및 정산 연계', icon: <TrendingUp size={20} /> }
    ];

    return (
        <div className={styles.foremanContainer}>
            {/* Header / Foreperson Intro */}
            <div className={styles.intro}>
                <div className={styles.foremanAvatar}>
                    <div className={styles.avatarGlow}></div>
                    <BrainCircuit size={40} className={styles.aiIcon} />
                </div>
                <div className={styles.introText}>
                    <div className={styles.badge}>MONO AI | 현장 지원 본부</div>
                    <h1>반갑습니다, <strong>모컬(Mo-Cul)</strong> 입니다.</h1>
                    <p>오늘의 현장 상황과 마스터님의 숙련도에 맞춰 실시간 가이드를 준비했습니다.</p>
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
                {/* Mode Specific Guide List */}
                <div className={styles.guideWrapper}>
                    <h3 className={styles.sectionTitle}>
                        {mode === 'JUNIOR' ? '🔰 오늘의 현장 기초 가이드' : '⭐ 핵심 기술 및 글로벌 마스터 솔루션'}
                    </h3>
                    
                    <div className={styles.guideGrid}>
                        {mode === 'JUNIOR' ? (
                            JUNIOR_TASKS.map((task, i) => (
                                <GlassCard key={i} className={styles.guideCard} hoverEffect>
                                    <div className={styles.cardHeader}>
                                        <span className={styles.levelBadge}>{task.level}</span>
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

                {/* AI Chat / Question Box */}
                <aside className={styles.sidebar}>
                    <GlassCard className={styles.chatCard}>
                        <div className={styles.chatHeader}>
                            <MessageSquare size={18} color="#FF6B00" />
                            <span>작업반장 질문하기</span>
                        </div>
                        <p className={styles.chatIntro}>현장에서 발생하는 돌발 상황이나 공구 사용법, 도면 해석이 막막할 때 물어보세요.</p>
                        
                        <div className={styles.quickQuestions}>
                            <button className={styles.qBtn}>"오늘 날씨에 콘크리트 타설 괜찮을까요?"</button>
                            <button className={styles.qBtn}>"공구 벨트 효율적인 세팅법은?"</button>
                            <button className={styles.qBtn}>"배관 용접 시 기포가 생기는 원인은?"</button>
                        </div>
                        
                        <div className={styles.chatInputRow}>
                            <input type="text" placeholder="질문을 입력하세요..." className={styles.chatInput} />
                            <button className={styles.sendBtn}><Zap size={18} /></button>
                        </div>
                    </GlassCard>

                    <GlassCard className={styles.weatherAlert}>
                        <div className={styles.alertHeader}>
                            <AlertCircle size={18} color="#ef4444" />
                            <span>기상 현장 실시간 알림</span>
                        </div>
                        <p>서울 성동구 지역 초미세먼지 '나쁨'. 야외 작업 시 미세먼지 차단 마스크 착용 바랍니다.</p>
                        <div className={styles.safetyLink}>작업 보호구 가이드 확인 →</div>
                    </GlassCard>
                </aside>
            </div>

            {/* Field Glossary & Translator Section */}
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
                                <input type="text" placeholder="예: 가타바쿠, 데나오시..." className={styles.transInput} />
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
                        <h4 className={styles.boxTitle}>주요 현장 용어 Top 5</h4>
                        <div className={styles.dictItems}>
                            <div className={styles.dictItem}>
                                <span className={styles.term}>데나오시</span>
                                <span className={styles.mean}>재작업 (Re-do)</span>
                            </div>
                            <div className={styles.dictItem}>
                                <span className={styles.term}>구라스</span>
                                <span className={styles.mean}>유리 (Glass)</span>
                            </div>
                            <div className={styles.dictItem}>
                                <span className={styles.term}>시마이</span>
                                <span className={styles.mean}>작업 종료 (Finish)</span>
                            </div>
                            <div className={styles.dictItem}>
                                <span className={styles.term}>야리끼리</span>
                                <span className={styles.mean}>일당제 도급 (Task-based pay)</span>
                            </div>
                            <div className={styles.dictItem}>
                                <span className={styles.term}>오함마</span>
                                <span className={styles.mean}>대해머 (Sledgehammer)</span>
                            </div>
                        </div>
                        <button className={styles.viewMoreDict}>용어 사전 전체보기 →</button>
                    </GlassCard>
                </div>
            </section>

            {/* Learning Roadmap Feature */}
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
