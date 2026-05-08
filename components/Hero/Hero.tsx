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
        main: "기술자의 숙련도가 곧 금융 자산이 됩니다",
        sub: "증발하던 노동의 가치를 투명한 데이터로 전환하여 당신의 경력을 공식적인 신용으로 바꿔드립니다."
    },
    {
        main: "나에게 꼭 맞는 현장, AI가 찾아드려요",
        sub: "새벽 인력소 줄 서기 대신, 전날 밤 미리 고르는 확실한 일자리. 기술 여권 하나로 글로벌 프로젝트까지 연결됩니다."
    },
    {
        main: "매일 쌓이는 경력, 더 높은 대우를 위해",
        sub: "내일의 성장을 위한 실시간 기술 가이드부터 정당한 대우를 받는 전문가 커리어의 시작, MO-NO."
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
                                <span className={styles.introBadge}>현장 반장 모컬(MO-CUL)</span>
                                <h2>기술자님의 전문적인 성장을 돕습니다</h2>
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

                {isLoggedIn ? (
                    <>
                        {/* ── AI Matching Card (Only for Logged In) ── */}
                        <div className={styles.aiTerminal}>
                            <div className={styles.terminalHeader}>
                                <div className={styles.pulseDot} />
                                기술자님께 딱 맞는 현장을 찾고 있어요
                            </div>
                            <Link href="/jobs" className={styles.tacticalCard}>
                                <div className={styles.cardInfo}>
                                    <div className={styles.liveIndicator}>
                                        <Star size={14} fill="currentColor" />
                                        오늘 가장 추천하는 현장
                                    </div>
                                    <h3 className={styles.cardTitle}>반도체 플랜트 고소작업 배관 기술자 급구</h3>
                                    <p className={styles.cardSub}>경기도 평택 | 일당 210,000원 | 즉시 출근 가능</p>
                                    
                                    <div className={styles.liveStats}>
                                        <div className={styles.statItem}>
                                            <Briefcase size={16} />
                                            12명 지원 중
                                        </div>
                                        <div className={styles.statItem}>
                                            <BarChart3 size={16} />
                                            매칭 적합도 98%
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.cardArrow}>
                                    <ArrowRight size={28} />
                                </div>
                            </Link>
                        </div>

                        {/* ── Dashboard Quick Actions ── */}
                        <div className={styles.actions}>
                            <Link href="/jobs" className={`${styles.mainBtn} ${styles.primaryBtn}`}>
                                일자리 탐색
                                <ChevronRight size={20} />
                            </Link>
                            <Link href="/career" className={`${styles.mainBtn} ${styles.secondaryBtn}`}>
                                내 기술 자산
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        {/* ── Landing Page Actions ── */}
                        <div className={styles.actions}>
                            <Link href="/login" className={`${styles.mainBtn} ${styles.primaryBtn}`}>
                                지금 시작하기
                                <ChevronRight size={20} />
                            </Link>
                            <Link href="/about" className={`${styles.mainBtn} ${styles.secondaryBtn}`}>
                                모노 서비스 소개
                            </Link>
                        </div>
                    </>
                )}

                {/* ── Navigation (Different for Auth/Guest) ── */}
                <div className={styles.assetNav}>
                    {isLoggedIn ? (
                        <>
                            <Link href="/office" className={styles.assetItem}>
                                <ShieldCheck size={16} />
                                경력 관리
                            </Link>
                            <div className={styles.divider} />
                            <Link href="/settlement" className={styles.assetItem}>
                                정산 현황
                            </Link>
                            <div className={styles.divider} />
                            <Link href="/matching" className={styles.assetItem}>
                                글로벌 매칭
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/technicians" className={styles.assetItem}>
                                우수 기술자 찾기
                            </Link>
                            <div className={styles.divider} />
                            <Link href="/academy" className={styles.assetItem}>
                                기술 교육 문의
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
