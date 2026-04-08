'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Search, Zap, ShieldCheck, BrainCircuit, Radio, TrendingUp, ShoppingBag, Radar, ArrowRight, Users } from 'lucide-react';
import styles from './Hero.module.css';
import buttonStyles from '../UI/Button.module.css';

const ROLLING_TEXTS = [
    { 
        main: "'노가다'가 아닙니다. \n당신은 '기술자'입니다.", 
        sub: "부품처럼 쓰이고 버려지는 일용직은 이제 끝. 당신의 기술이 정당하게 대우받고 평생의 경력이 되는 곳, MO-NO입니다." 
    },
    { 
        main: "새벽 인력소, \n더 이상 줄 서지 마세요.", 
        sub: "내일 갈 현장은 전날 밤 내가 직접 고릅니다. 내 조건에 맞는 확실한 일자리로 든든하게 출근하세요." 
    },
    { 
        main: "당신의 굳은살이 \n제대로 대접받는 곳.", 
        sub: "증명할 길 없던 현장의 시간들. 이제 매일의 출퇴근이 은행 대출과 신용을 위한 '공식 경력'으로 쌓입니다." 
    }
];

export default function Hero() {
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % ROLLING_TEXTS.length);
                setFade(true);
            }, 600); // Smoother fade transition
        }, 4500); // Slightly longer for people to read the subtext
        return () => clearInterval(interval);
    }, []);

    const current = ROLLING_TEXTS[index];

    return (
        <section className={styles.hero}>
            <div className={`${styles.shape} ${styles.shape1}`} />
            <div className={`${styles.shape} ${styles.shape2}`} />

            <div className={`container ${styles.content}`}>
                <div className={styles.foremanBanner}>
                    <div className={styles.foremanIntro}>
                        <div className={styles.foremanAvatar}>
                            <div className={styles.avatarGlow}></div>
                            <div className={styles.avatarInner}>
                                <BrainCircuit size={40} className={styles.aiIcon} />
                                <div className={styles.scanningLine} />
                            </div>
                        </div>
                        <div className={styles.foremanIntroText}>
                            <div className={styles.introBadge}>
                                MONO AI | 현장 지원 본부
                            </div>
                            <h2>반갑습니다, <strong>모컬(Mo-Cul)</strong> 입니다.</h2>
                            <p>오늘의 현장 상황과 마스터님의 숙련도에 맞춰 실시간 가이드를 준비했습니다.</p>
                        </div>
                    </div>
                    
                    <div className={styles.foremanActions}>
                        <Link href="/foreman?mode=junior" className={styles.trackBtn}>
                            <Zap size={18} />
                            <span>초보 마스터 (입문/기초)</span>
                        </Link>
                        <Link href="/foreman?mode=senior" className={styles.trackBtn}>
                            <TrendingUp size={18} />
                            <span>고급/글로벌 마스터 (숙련/최고)</span>
                        </Link>
                    </div>
                </div>

                <div className={styles.heroMain}>
                    <div className={styles.aiBadge}>
                        <BrainCircuit size={14} className={styles.aiIcon} />
                        <span>AI ANALYTICS ENGINE ACTIVE</span>
                    </div>
                  <h1 className={`${styles.title} ${fade ? styles.fadeIn : styles.fadeOut}`}>
                      {current.main.split('\n').map((line, i) => (
                          <span key={i} className={styles.titleLine}>{line}</span>
                      ))}
                  </h1>

                  <p className={`${styles.description} ${fade ? styles.fadeIn : styles.fadeOut}`}>
                      {current.sub}
                  </p>
                </div>

                <div className={`${styles.fieldAction} fade-in delay-300`}>
                    <div className={styles.aiTerminal}>
                        <div className={styles.terminalHeader}>
                            <div className={styles.terminalDot} />
                            <div className={styles.terminalDot} />
                            <div className={styles.terminalDot} />
                            <span className={styles.terminalTitle}>NEURAL MATCHING CORE v2.0</span>
                        </div>
                        <Link href="/office" className={styles.tacticalCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.liveIndicator}>
                                    <span className={styles.pulseDot}></span>
                                    <span className={styles.liveText}>AI SCANNING ENVIRONMENT</span>
                                </div>
                                <div className={styles.matchingStatus}>
                                    <Radio size={14} color="#ef4444" className={styles.pulseIcon} />
                                    <span>REAL-TIME ANALYSIS</span>
                                </div>
                            </div>
                            
                            <div className={styles.cardBody}>
                                <div className={styles.radarWrapper}>
                                    <Radar size={64} className={styles.radarMain} />
                                    <div className={styles.radarScan} />
                                </div>
                                <div className={styles.cardInfo}>
                                    <h2 className={styles.cardTitle}>지능형 현장 배정 시스템</h2>
                                    <p className={styles.cardSub}>기술자의 숙련도와 현장의 난이도를 AI가 정밀 분석하여 매칭합니다.</p>
                                    <div className={styles.liveStats}>
                                        <div className={styles.statItem}>
                                            <div className={styles.statIcon}><Zap size={14} fill="#B48A09" /></div>
                                            <span>실시간 매칭률 99.8%</span>
                                        </div>
                                        <div className={styles.statItem}>
                                            <div className={styles.statIcon}><ShieldCheck size={14} fill="#10B981" /></div>
                                            <span>안전 지수 Verified</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.cardArrow}>
                                    <ArrowRight size={24} />
                                </div>
                            </div>

                            <div className={styles.cardFooter}>
                                <div className={styles.feedMarquee}>
                                    <span>[SYSTEM] ANALYZING SKILLSET OF MASTER #7721... OPTIMIZED MATCH FOUND AT SITE A-02</span>
                                    <span className={styles.feedDot}>•</span>
                                    <span>[NETWORK] GLOBAL TECHNICIAN SYNC COMPLETED</span>
                                    <span className={styles.feedDot}>•</span>
                                    <span>[LOGS] PREDICTIVE DEMAND FORECAST: HIGH LOAD IN GANGNAM AREA</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className={`${styles.actions} fade-in delay-350`}>
                    <Link href="/jobs?filter=urgent" className={`${styles.mainBtn} ${styles.primaryBtn}`}>
                        <Zap size={18} fill="currentColor" />
                        즉시 투입 일자리 찾기
                    </Link>
                    <Link href="/technicians" className={`${styles.mainBtn} ${styles.secondaryBtn}`}>
                        <Search size={18} />
                        전문가 탐색
                    </Link>
                </div>

                {/* Quick Asset Access Tools */}
                <div className={`${styles.assetNav} fade-in delay-400`}>
                    <Link href="/ops/center" className={styles.assetItem}>
                        <Radio size={16} color="#ef4444" className={styles.pulseIcon} />
                        <span>내 일터</span>
                    </Link>
                    <div className={styles.divider} />
                    <Link href="/assets/monetize" className={styles.assetItem}>
                        <TrendingUp size={16} color="#10B981" />
                        <span>돈 벌기</span>
                    </Link>
                    <div className={styles.divider} />
                    <Link href="/shop" className={styles.assetItem}>
                        <ShoppingBag size={16} color="#B48A09" />
                        <span>장비 장터</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
