'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Hero.module.css';
import buttonStyles from '../UI/Button.module.css';

const ROLLING_TEXTS = [
    { highlight: '자본', full: '당신의 기술, \n글로벌 자본이 되다.' },
    { highlight: '표준', full: '현장의 숙련, \n세계의 표준이 되다.' },
    { highlight: '자산', full: '기록된 경력, \n디지털 자산이 되다.' },
    { highlight: '마스터', full: '준비된 인재, \n글로벌 마스터가 되다.' }
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
            }, 500); // Wait for fade out
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    const current = ROLLING_TEXTS[index];
    const parts = current.full.split(current.highlight);

    return (
        <section className={styles.hero}>
            <div className={`${styles.shape} ${styles.shape1}`} />
            <div className={`${styles.shape} ${styles.shape2}`} />

            <div className={`container ${styles.content}`}>
                <div className={`${styles.glitchBox} fade-in`}>
                    <Globe size={12} color="#B48A09" />
                    <span className={styles.badge}>전 세계 기술 마스터가 신뢰하는 표준</span>
                </div>

                <div className={styles.dawnMarketNotice}>
                    <span className={styles.pulseDot}></span>
                    <strong>새벽 인력 시장 활성 중: </strong>
                    04:00 - 08:00 집합 현장 실시간 매칭
                </div>

                <div className={styles.heroMain}>
                  <h1 className={`${styles.title} ${fade ? styles.fadeIn : styles.fadeOut}`}>
                      {parts[0]}
                      <span className={styles.titleSpan}>{current.highlight}</span>
                      {parts[1]}
                  </h1>

                  <p className={`${styles.description} fade-in delay-200`}>
                      <strong>기술로 길을 열고, 세계로 나아가세요.</strong><br />
                      내 기술 기록을 데이터 자산으로 만들어, 전 세계 어디서나 인정받는 모노만의 경력 인증 시스템.
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

import { Globe, Search, Zap, ShieldCheck, BrainCircuit, Radio, TrendingUp, ShoppingBag, Radar, ArrowRight, Users } from 'lucide-react';
