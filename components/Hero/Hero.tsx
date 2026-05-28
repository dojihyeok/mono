'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    ChevronRight, 
    ArrowRight, 
    BrainCircuit, 
    Zap,
    ShieldCheck,
    Globe,
    Users,
    TrendingUp,
    Compass
} from 'lucide-react';
import styles from './Hero.module.css';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_SLOGANS = [
    {
        main: "일하는 즐거움을 아는 사람들이 모여 미래를 함께",
        sub: "현장의 모든 가치를 투명한 스펙과 금융 자산으로 바꾸는 대한민국 No.1 플랫폼, MoNo"
    },
    {
        main: "기술이 정당한 가치로 인정받는 세상",
        sub: "데이터로 증명하는 1인 기술 기업가의 탄생."
    },
    {
        main: "안전한 현장, 투명한 노무 관리",
        sub: "AI가 관리하는 안전 교육과 전자 근로계약으로 기술자의 권익을 보호합니다."
    },
    {
        main: "무자본 장비 일자리에서 자본가로",
        sub: "장비 조각 투자와 플릿 운영으로 만드는 부의 생태계."
    }
];

interface HeroProps {
    isLoggedIn?: boolean;
}

export default function Hero({ isLoggedIn = false }: HeroProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % HERO_SLOGANS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className={styles.hero}>
            <div className={styles.heroBg}>
                <div className={styles.glow1} />
                <div className={styles.glow2} />
            </div>

            <div className={styles.content}>
                {isLoggedIn ? (
                    /* ── Authenticated Banner ── */
                    <div className={styles.authBanner}>
                        <div className={styles.foremanIntro}>
                            <div className={styles.aiAvatar}>
                                <BrainCircuit size={40} />
                                <div className={styles.pulse} />
                            </div>
                            <div className={styles.introText}>
                                <span className={styles.badge}>AI 반장 모컬(MO-CUL)</span>
                                <h2>오늘도 완벽한 하루를 위해 대기 중입니다</h2>
                            </div>
                        </div>
                        <div className={styles.terminalCard}>
                            <div className={styles.termHeader}>
                                <Zap size={14} color="#D4AF37" />
                                <span>오늘의 맞춤 일자리</span>
                            </div>
                            <div className={styles.termBody}>
                                <strong>평택 P4 반도체 설비 (배관)</strong>
                                <p>일급 24만원 · 숙식 제공 · 98% 매칭</p>
                            </div>
                            <Link href="/jobs" className={styles.termAction}>
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* ── Guest Landing ── */
                    <div className={styles.guestLanding}>
                        <div className={styles.sloganArea}>
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={styles.slogan}
                                >
                                    <h1 className={styles.title}>{HERO_SLOGANS[index].main}</h1>
                                    <p className={styles.subtitle}>{HERO_SLOGANS[index].sub}</p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className={styles.actions}>
                            <Link href="/login" className={styles.primaryBtn}>
                                지금 바로 시작하기
                                <ArrowRight size={18} />
                            </Link>
                            <Link href="#features" className={styles.secondaryBtn}>
                                서비스 둘러보기
                                <Compass size={18} />
                            </Link>
                        </div>

                        <div className={styles.platformStats}>
                            <div className={styles.statItem}>
                                <strong>3.2k+</strong>
                                <span>활동 기술자</span>
                            </div>
                            <div className={styles.statItem}>
                                <strong>₩ 142억+</strong>
                                <span>누적 정산액</span>
                            </div>
                            <div className={styles.statItem}>
                                <strong>1.5k+</strong>
                                <span>협력 현장</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

