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
                <div className={styles.dawnMarketNotice}>
                    <span className={styles.pulseDot}></span>
                    <strong>실시간 현장: </strong>
                    04:00 - 08:00 프리미엄 매칭 중
                </div>

                <div className={styles.heroMain}>
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
                    <Link href="/office" className={styles.tacticalCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.liveIndicator}>
                                <span className={styles.pulseDot}></span>
                                <span className={styles.liveText}>실시간 현장 확인 중</span>
                            </div>
                            <div className={styles.matchingStatus}>
                                <Radio size={14} color="#ef4444" className={styles.pulseIcon} />
                                <span>65개 사무소 매칭 중</span>
                            </div>
                        </div>
                        
                        <div className={styles.cardBody}>
                            <Radar size={48} color="#B48A09" className={styles.radarMain} />
                            <div className={styles.cardInfo}>
                                <h2 className={styles.cardTitle}>온라인 인력 사무소 (현장)</h2>
                                <p className={styles.cardSub}>전국의 숙련된 마스터를 위한 실시간 현장 배정 시스템</p>
                                <div className={styles.liveStats}>
                                    <div className={styles.statItem}>
                                        <Users size={14} />
                                        <span>오늘 1,240명 출근</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <TrendingUp size={14} />
                                        <span>실시간 매칭률 98%</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.cardArrow}>
                                <ArrowRight size={24} />
                            </div>
                        </div>

                        <div className={styles.cardFooter}>
                            <div className={styles.feedMarquee}>
                                <span>[09:12] 성수 테크니컬 인력 2명 매칭 완료</span>
                                <span className={styles.feedDot}>•</span>
                                <span>[09:10] 반포 명장 사무소 집합 확인 중</span>
                                <span className={styles.feedDot}>•</span>
                                <span>[09:05] 고덕 삼성 전문관 5명 현장 투입</span>
                            </div>
                        </div>
                    </Link>
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
