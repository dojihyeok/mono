import styles from './page.module.css';
import { motion } from 'framer-motion';
import { 
    CheckCircle2, 
    Zap, 
    Construction, 
    ShieldCheck, 
    Globe, 
    Cpu, 
    ArrowRight,
    TrendingUp,
    Anchor
} from 'lucide-react';
import Link from 'next/link';

export default function RoadmapPage() {
    const roadmapStages = [
        {
            stage: "1단계",
            period: "현재 ~ 6개월",
            title: "초기 신뢰 구축",
            subtitle: "시범 서비스 출시 및 압도적 신뢰 확보",
            color: "var(--primary)",
            items: [
                { icon: <Zap size={18} />, text: "현장 인공지능(모컬 AI) 도입: 현장 용어 실시간 번역 및 기초 적응 훈련" },
                { icon: <ShieldCheck size={18} />, text: "안전 결제 및 당일 정산: 임금 체불 제로화 및 GPS 자동 출퇴근 인증" },
                { icon: <TrendingUp size={18} />, text: "초기 자금 유치 및 검증: 정부 지원금 확보 및 서비스 신뢰성 검증" }
            ]
        },
        {
            stage: "2단계",
            period: "6개월 ~ 15개월",
            title: "기업 행정 자동화 및 안전망",
            subtitle: "수기 업무 제로화 및 정부 실증 사업 탑승",
            color: "#00d1ff",
            items: [
                { icon: <ShieldCheck size={18} />, text: "중대재해 완벽 방어망: AI 안전 장구 인식 및 모바일 맞춤 안전 교육" },
                { icon: <Construction size={18} />, text: "정부 지능형 건설 실증: 1군 건설사 시범 적용 및 TIPS 자금 유치" },
                { icon: <Cpu size={18} />, text: "행정 자동 연동: 4대 보험 및 세무 신고 국세청 시스템 자동 연동" }
            ]
        },
        {
            stage: "3단계",
            period: "15개월 ~ 24개월",
            title: "직영 장비 및 현장 물류 거점",
            subtitle: "장비 운영망 직접 구축 및 본격적인 투자 유치",
            color: "#8b5cf6",
            items: [
                { icon: <Anchor size={18} />, text: "MO-NO 지역 거점: 오프라인 사무소 구축 및 장비 직접 배달 물류망" },
                { icon: <Construction size={18} />, text: "무자본 기술자 육성: 보유 중장비를 검증된 기사에게 배차하여 수익 지원" },
                { icon: <TrendingUp size={18} />, text: "장비 소유 생태계: 고가 중장비 공동 소유 및 대여 수익 배당 시스템" }
            ]
        },
        {
            stage: "4단계",
            period: "3년 이후 ~ 상장",
            title: "해외 진출 및 미래 기술 개척",
            subtitle: "세계 공용 기술 여권과 신체 보조 로봇 진화",
            color: "#d946ef",
            isPremium: true,
            items: [
                { icon: <Globe size={18} />, text: "세계 공용 기술 여권: 데이터를 국제 표준 증명서로 변환하여 기술 이민 연결" },
                { icon: <Cpu size={18} />, text: "입는 로봇(Wearable) 개발: 현장 데이터를 기반으로 육체 노동 보조 기기 제조" },
                { icon: <Globe size={18} />, text: "극한 환경 기술자 파견: 달 기지 건설 등 인류의 새로운 개척지에 마스터 송출" }
            ]
        }
    ];

    return (
        <div className={styles.pageWrap}>
            <div className={styles.bgGrid} />
            
            <nav className={styles.standaloneNav}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoText}>MO-NO</span>
                </Link>
                <Link href="/" className={styles.homeBtn}>메인으로 가기</Link>
            </nav>

            <header className={styles.header}>
                <div className={styles.badge}>중장기 발전 계획 2026-2030</div>
                <h1 className={styles.title}>
                    <span className={styles.brandName}>MO-NO</span><br />
                    <span className={styles.gradientText}>생태계 발전 로드맵</span>
                </h1>
                <p className={styles.description}>
                    육체노동을 세계가 인정하는 경력 자산으로 전환하는 최고급 기술 플랫폼.<br />
                    단순 중개를 넘어, 인류의 새로운 개척지를 짓는 마스터 생태계의 완성.
                </p>
            </header>

            <main className={styles.container}>
                <div className={styles.timelineLine} />

                {roadmapStages.map((stage, idx) => (
                    <div 
                        key={idx} 
                        className={`${styles.roadmapItem} ${idx % 2 === 1 ? styles.reverse : ''}`}
                    >
                        <div className={styles.cardWrapper}>
                            <div className={`${styles.glassCard} ${stage.isPremium ? styles.premiumCard : ''}`}>
                                {stage.isPremium && <div className={styles.premiumGlow} />}
                                <div className={styles.cardHeader}>
                                    <span className={styles.stageBadge} style={{ backgroundColor: `${stage.color}20`, color: stage.color, borderColor: `${stage.color}40` }}>
                                        {stage.stage}
                                    </span>
                                    <span className={styles.periodText}>{stage.period}</span>
                                </div>
                                <h3 className={styles.cardTitle}>{stage.title}</h3>
                                <p className={styles.cardSubtitle} style={{ color: stage.color }}>{stage.subtitle}</p>
                                
                                <ul className={styles.itemList}>
                                    {stage.items.map((item, i) => (
                                        <li key={i} className={styles.listItem}>
                                            <span className={styles.itemIcon} style={{ color: stage.color }}>{item.icon}</span>
                                            <span>{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className={`${styles.marker} ${stage.isPremium ? styles.premiumMarker : ''}`} style={{ borderColor: stage.color }} />
                        <div className={styles.spacer} />
                    </div>
                ))}
            </main>

            <footer className={styles.footer}>
                <div className={styles.ctaWrapper}>
                    <div className={styles.ctaInner}>
                        <h2>기술과 경험의 가치를 알아보는 세상</h2>
                        <p>지금 MO-NO와 함께 현장 기술직 노동 시장을 혁신하고 최고급 기술 생태계를 만들어갈 파트너를 찾습니다.</p>
                        <Link href="/matching" className={styles.ctaBtn}>
                            초기 시범 서비스 체험하기 <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
