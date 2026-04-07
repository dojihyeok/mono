import styles from './Features.module.css';
import GlassCard from '../UI/GlassCard';

const features = [
    {
        title: "스마트 현장 시스템",
        description: "반경 500m GPS 출퇴근 인증부터, 당일 안심 수고비 정산까지 모든 현장 업무를 쉽고 빠르게 도와드립니다.",
        icon: "📍"
    },
    {
        title: "디지털 커리어 자산화",
        description: "나의 현장 경력과 숙련도를 블록체인 기반의 변조 불가능한 포트폴리오로 구축하고 증명하세요.",
        icon: "📄"
    },
    {
        title: "글로벌 경력 전환",
        description: "국내 경력을 해외 우대 자격으로 전환하고, 국제 기준의 경력 증명서를 발급받아 더 넓은 세계로 진출하세요.",
        icon: "🌏"
    },
    {
        title: "장비 & 기사 패키지",
        description: "최고의 기술자와 특수 장비를 하나로 매칭합니다. 하루 단위 렌탈 시스템으로 더 쉽게 필요한 스킬을 구하세요.",
        icon: "🚜"
    }
];

export default function Features() {
    return (
        <section id="features" className={`${styles.section} fade-up`}>
            <div className={`container ${styles.header}`}>
                <h2 className={styles.title}>
                    글로벌 기술 자산화 플랫폼 <span className={styles.premiumText}>Mo-No</span>
                </h2>
                <p className={styles.subtitle}>
                    단순 구인구직을 넘어, 기술자의 경험을 데이터화하여 평생의 자산으로 만들어드립니다.
                </p>
            </div>
            <div className="container">
                <div className={styles.grid}>
                    {features.map((feature, idx) => (
                        <GlassCard key={idx} hoverEffect className={styles.cardOverride}>
                            <div className={styles.iconWrapper}>{feature.icon}</div>
                            <h3 className={styles.cardTitle}>{feature.title}</h3>
                            <p className={styles.cardDesc}>{feature.description}</p>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
