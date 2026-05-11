'use client';

import React from 'react';
import Link from 'next/link';
import { 
    ChevronRight, 
    ShieldCheck, 
    ArrowRight, 
    BrainCircuit, 
    Search, 
    Briefcase, 
    Star,
    BarChart3
} from 'lucide-react';
import styles from './Hero.module.css';

const HERO_SLOGANS = [
    {
        main: "기술이 자산이 되는 세상",
        sub: "내 경력의 가치를 데이터로 증명하세요."
    },
    {
        main: "나에게 딱 맞는 현장",
        sub: "AI가 당신의 기술에 최적화된 곳을 연결합니다."
    },
    {
        main: "당신의 성장을 돕는 AI 반장",
        sub: "일자리부터 교육까지, 모컬이 함께합니다."
    }
];

interface HeroProps {
    isLoggedIn?: boolean;
}

export default function Hero({ isLoggedIn = false }: HeroProps) {
    const [index, setIndex] = React.useState(0);
    const [isExiting, setIsExiting] = React.useState(false);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setIsExiting(true);
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % HERO_SLOGANS.length);
                setIsExiting(false);
            }, 500);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                {/* ── Foreman / Career Partner Banner (Only for Logged In) ── */}
                {isLoggedIn && (
                    <div className={styles.foremanBanner}>
                        <div className={styles.foremanIntro}>
                            <div className={styles.foremanAvatar}>
                                <BrainCircuit size={44} />
                            </div>
                            <div className={styles.foremanIntroText}>
                                <span className={styles.introBadge}>AI 반장 모컬(MO-CUL)</span>
                                <h2>기술자님의 전문적인 성장을 돕습니다</h2>
                                <p className={styles.foremanSub}>일자리, 교육 등 기술자님의 성장을 돕습니다.</p>
                            </div>
                        </div>
                        <div className={styles.foremanActions}>
                            <Link href="/foreman" className={styles.trackBtn}>
                                AI 가이드 확인 <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                )}

                {/* ── Main Hero Text (Only for Guests) ── */}
                {!isLoggedIn && (
                    <div className={styles.heroMain}>
                        <div className={`${styles.sloganContainer} ${isExiting ? styles.exit : styles.enter}`}>
                            <h1 className={styles.title}>
                                {HERO_SLOGANS[index].main}
                            </h1>
                            <p className={styles.description}>
                                {HERO_SLOGANS[index].sub.split('\n').map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </p>
                        </div>
                    </div>
                )}

                {/* ── AI Matching Card (Only for Logged In) ── */}
                {isLoggedIn && (
                    <div className={styles.aiTerminal}>
                        <div className={styles.terminalHeader}>
                            <div className={styles.pulseDot} />
                            실시간 추천 현장
                        </div>
                        <Link href="/jobs" className={styles.tacticalCard}>
                            <div className={styles.cardInfo}>
                                <h3 className={styles.cardTitle}>반도체 플랜트 고소작업</h3>
                                <p className={styles.cardSub}>평택 | 일급 21만 | 적합도 98%</p>
                            </div>
                            <div className={styles.cardArrow}>
                                <ArrowRight size={24} />
                            </div>
                        </Link>
                    </div>
                )}

                {isLoggedIn ? (
                    <div className={styles.actions}>
                        <Link href="/jobs" className={`${styles.mainBtn} ${styles.primaryBtn}`}>
                            일자리 찾기
                        </Link>
                        <Link href="/career" className={`${styles.mainBtn} ${styles.secondaryBtn}`}>
                            나의 경력
                        </Link>
                    </div>
                ) : (
                    <div className={styles.actions}>
                        <Link href="/login" className={`${styles.mainBtn} ${styles.primaryBtn}`}>
                            시작하기
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
