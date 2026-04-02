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
                    <span className={styles.badge}>THE GLOBAL STANDARD FOR MASTER TRUST</span>
                </div>

                <div className={styles.dawnMarketNotice}>
                    <span className={styles.pulseDot}></span>
                    <strong>새벽 인력 시장 활성 중: </strong>
                    04:00 - 08:00 집합 현장 실시간 매칭
                </div>

                <h1 className={`${styles.title} ${fade ? styles.fadeIn : styles.fadeOut}`}>
                    {parts[0]}
                    <span className={styles.titleSpan}>{current.highlight}</span>
                    {parts[1]}
                </h1>

                <p className={`${styles.description} fade-in delay-200`}>
                    <strong>Navigate Your Skill. Navigate The World.</strong><br />
                    숙련의 기록을 데이터 자산으로, 전 세계 어디서나 통용되는 MO-NO 글로벌 패스포트 시스템.
                </p>

                <div className={`${styles.actions} fade-in delay-300`}>
                    <Link href="/jobs" className={`${styles.mainBtn} ${styles.primaryBtn}`}>
                        <Zap size={18} />
                        일자리 찾기
                    </Link>
                    <Link href="/technicians" className={`${styles.mainBtn} ${styles.secondaryBtn}`}>
                        <Search size={18} />
                        전문가 탐색
                    </Link>
                </div>

                <div className={`${styles.fieldAction} fade-in delay-350`}>
                    <Link href="/office" className={styles.fieldBtn}>
                        <div className={styles.fieldBtnContent}>
                            <Radar size={20} color="#B48A09" className={styles.pulseIcon} />
                            <div className={styles.fieldText}>
                                <strong>온라인 인력 사무소 (현장)</strong>
                                <span>오늘의 집합 · 출결 · 정산 관리</span>
                            </div>
                        </div>
                        <ArrowRight size={18} />
                    </Link>
                </div>

                {/* Quick Asset Access Tools */}
                <div className={`${styles.assetNav} fade-in delay-400`}>
                    <Link href="/office" className={styles.assetItem}>
                        <ShieldCheck size={16} color="#B48A09" />
                        <span>Field Office</span>
                    </Link>
                    <div className={styles.divider} />
                    <Link href="/ops/center" className={styles.assetItem}>
                        <Radio size={16} color="#ef4444" className={styles.pulseIcon} />
                        <span>Site Ops</span>
                    </Link>
                    <div className={styles.divider} />
                    <Link href="/assets/monetize" className={styles.assetItem}>
                        <TrendingUp size={16} color="#10B981" />
                        <span>Monetize</span>
                    </Link>
                    <div className={styles.divider} />
                    <Link href="/shop" className={styles.assetItem}>
                        <ShoppingBag size={16} color="#B48A09" />
                        <span>Gear</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

import { Globe, Search, Zap, ShieldCheck, BrainCircuit, Radio, TrendingUp, ShoppingBag, Radar, ArrowRight } from 'lucide-react';
