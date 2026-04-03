import styles from './Process.module.css';

const steps = [
    {
        step: "01",
        title: "현장 기록 & 데이터화",
        description: "매일의 현장 작업이 자동으로 기록됩니다. 단순한 노동이 아닌, 데이터로 증명되는 경력이 쌓입니다.",
        highlight: "자동 경력 로그 · 실시간 보험 적용"
    },
    {
        step: "02",
        title: "숙련 기술 마스터 인증",
        description: "그동안 쌓인 작업 데이터를 바탕으로 모노(Mo-No) 공식 마스터 자격을 받으세요. 더 높은 일당과 팀장급 대우가 보장됩니다.",
        highlight: "공식 인증 뱃지 · 전용 일자리 배정"
    },
    {
        step: "03",
        title: "실전 현장 기술 영어",
        description: "해외 현장에서 당장 사용할 수 있는 핵심 기술 영어를 배웁니다. 말하기 벽을 넘어 더 넓은 세상으로 나아가세요.",
        highlight: "현장 맞춤형 교육"
    },
    {
        step: "04",
        title: "해외 취업 및 이주 지원",
        description: "검증된 경력과 영어 실력을 바탕으로 해외 취업과 영주권 취득을 도와드립니다. 당신의 기술은 전 세계 어디서나 보물입니다.",
        highlight: "영문 경력 증명 · 비자 상담"
    }
];

export default function Process() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>기술자 성장 로드맵</h2>
                    <p className={styles.subtitle}>
                        단순 일용직에서 글로벌 마스터까지,<br />
                        Mo-No가 당신의 커리어 설계를 함께합니다.
                    </p>
                </div>

                <div className={styles.timeline}>
                    {steps.map((item, idx) => (
                        <div key={idx} className={styles.step}>
                            <div className={styles.marker}>{item.step}</div>
                            <div className={styles.content}>
                                <h3 className={styles.stepTitle}>{item.title}</h3>
                                <p className={styles.stepDesc}>{item.description}</p>
                                <span className={styles.stepHighlight}>{item.highlight}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
