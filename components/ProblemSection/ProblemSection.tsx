'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
    Sparkles, 
    ShieldCheck, 
    TrendingUp, 
    Coins, 
    Heart
} from 'lucide-react';
import styles from './ProblemSection.module.css';

const PROBLEMS = [
    {
        icon: <ShieldCheck size={32} />,
        title: "경력 데이터의 가치화와 금융 혁신",
        desc: "파편화된 현장 기록을 블록체인 경력으로 자산화합니다. 데이터 기반 포용 금융으로 기술자의 금융 소외를 근본적으로 해결합니다."
    },
    {
        icon: <TrendingUp size={32} />,
        title: "기술 전수와 청년층 유입의 선순환",
        desc: "모노 아카데미와 모컬 AI를 통해 핵심 기술을 체계적으로 계승합니다. 청년들이 꿈꾸는 자부심 넘치는 현장 문화를 만듭니다."
    },
    {
        icon: <Coins size={32} />,
        title: "장비 솔루션과 수익 구조의 다변화",
        desc: "개인의 장비 부채 부담을 없애고, 플릿 운영과 조각 투자를 통해 모든 유저가 함께 성장하는 공유 경제 생태계를 실현합니다."
    },
    {
        icon: <Heart size={32} />,
        title: "인간 중심의 생활 케어와 안전 지원",
        desc: "타지 생활의 외로움까지 배려하는 맞춤형 복지와 숙식 지원. 기술자의 삶을 지키는 촘촘한 안전망을 통해 안심하고 일할 수 있습니다."
    }
];

export default function ProblemSection() {
    return (
        <section className={styles.problemSection}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className={styles.warningBadge}
                    >
                        <Sparkles size={16} /> 
                        <span>OUR VISION</span>
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className={styles.title}
                    >
                        기술인의 땀방울이 <span className={styles.highlight}>정당한 가치</span>로<br />인정받는 세상을 만듭니다
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={styles.subtitle}
                    >
                        파편화된 현장 경험을 데이터로 연결하여 기술자의 생애 주기 전반을 혁신하고<br />
                        더 나은 근로 환경과 전문적인 대우를 제공합니다.
                    </motion.p>
                </header>

                <div className={styles.grid}>
                    {PROBLEMS.map((problem, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className={styles.problemCard}
                        >
                            <div className={styles.iconWrapper}>
                                {problem.icon}
                            </div>
                            <h3>{problem.title}</h3>
                            <p>{problem.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
