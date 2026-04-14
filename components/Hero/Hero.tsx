'use client';

import React from 'react';
import Link from 'next/link';
import { 
    ChevronRight, 
    ShieldCheck, 
    ArrowRight, 
    User, 
    Search, 
    Briefcase, 
    Star,
    BarChart3
} from 'lucide-react';
import styles from './Hero.module.css';

const HERO_SLOGANS = [
    {
        main: "현장의 경력을 신용으로 바꿉니다",
        sub: "증발하던 노동의 가치를 투명한 데이터 자산으로 전환합니다.\n안전한 정산, 확실한 커리어. 당신의 기술이 곧 금융이 되는 곳, MO-NO."
    },
    {
        main: "'노가다'가 아닙니다. 당신은 '기술자'입니다",
        sub: "부품처럼 쓰이고 버려지는 일용직은 이제 끝. 당신의 기술이 정당하게 대우받고 평생의 경력이 되는 곳, MO-NO입니다."
    },
    {
        main: "새벽 인력소, 더 이상 줄 서지 마세요",
        sub: "내일 갈 현장은 전날 밤 내가 직접 고릅니다. 내 조건에 맞는 확실한 일자리로 든든하게 출근하세요."
    },
    {
        main: "당신의 굳은살이 제대로 대접받는 곳",
        sub: "증명할 길 없던 현장의 시간들. 이제 매일의 출퇴근이 은행 대출과 신용을 위한 '공식 경력'으로 쌓입니다."
    }
];

export default function Hero() {
    const [index, setIndex] = React.useState(0);
    const [isExiting, setIsExiting] = React.useState(false);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setIsExiting(true);
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % HERO_SLOGANS.length);
                setIsExiting(false);
            }, 500); // Wait for exit animation
        }, 5000); // Change every 5 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                {/* ── Foreman / Career Partner Banner ── */}
                <div className={styles.foremanBanner}>
                    <div className={styles.foremanIntro}>
                        <div className={styles.foremanAvatar}>
                            <User size={32} />
                        </div>
                        <div className={styles.foremanIntroText}>
                            <span className={styles.introBadge}>든든한 현장 조력자</span>
                            <h2>오늘의 전문적인 성장을 위해 현장 반장이 함께합니다</h2>
                            <p>전문가님의 숙련된 기술이 최적의 현장과 매칭될 수 있도록 지원합니다.</p>
                        </div>
                    </div>
                    <div className={styles.foremanActions}>
                        <Link href="/foreman" className={styles.trackBtn}>
                            <Search size={18} />
                            현장 반장 가이드 확인하기
                        </Link>
                    </div>
                </div>

                {/* ── Main Hero Text (Rolling Animation) ── */}
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

                {/* ── AI Matching Card (Native Style) ── */}
                <div className={styles.aiTerminal}>
                    <div className={styles.terminalHeader}>
                        <div className={styles.pulseDot} />
                        전문가님께 딱 맞는 현장을 찾고 있어요
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

                {/* ── Main Actions ── */}
                <div className={styles.actions}>
                    <Link href="/jobs" className={`${styles.mainBtn} ${styles.primaryBtn}`}>
                        일자리 바로 찾기
                        <ChevronRight size={20} />
                    </Link>
                    <Link href="/career" className={`${styles.mainBtn} ${styles.secondaryBtn}`}>
                        내 기술 자산 확인하기
                    </Link>
                </div>

                {/* ── Quick Asset Nav ── */}
                <div className={styles.assetNav}>
                    <Link href="/office" className={styles.assetItem}>
                        <ShieldCheck size={16} />
                        경력 관리
                    </Link>
                    <div className={styles.divider} />
                    <Link href="/academy" className={styles.assetItem}>
                        기술 교육
                    </Link>
                    <div className={styles.divider} />
                    <Link href="/matching" className={styles.assetItem}>
                        글로벌 파견
                    </Link>
                </div>
            </div>
        </section>
    );
}
