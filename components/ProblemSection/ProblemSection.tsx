'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
    AlertTriangle, 
    UserX, 
    TrendingDown, 
    ShieldAlert, 
    Construction,
    Ban
} from 'lucide-react';
import styles from './ProblemSection.module.css';

const PROBLEMS = [
    {
        icon: <UserX size={32} />,
        title: "경력 데이터의 부재와 금융 소외",
        desc: "10년을 땀 흘려도 은행에선 '무직자' 취급. 고금리 사채로 내몰리는 기술자의 현실을 바꿉니다."
    },
    {
        icon: <Ban size={32} />,
        title: "청년층 유입 단절 및 기술 소멸",
        desc: "불투명한 문화와 임금 체불로 청년들이 기피하는 현장. 핵심 뿌리 기술의 명맥이 끊어지고 있습니다."
    },
    {
        icon: <TrendingDown size={32} />,
        title: "고가 장비 빚과 안전 위협",
        desc: "할부금 압박에 무리한 운행으로 이어지는 사고. 자본 없는 청년은 진입조차 불가능합니다."
    },
    {
        icon: <ShieldAlert size={32} />,
        title: "열악한 생활 환경과 소외된 복지",
        desc: "타지 현장에서의 숙식 문제와 사고 시 대처의 어려움. 기술자의 삶을 지키는 촘촘한 생활 케어 생태계를 구축합니다."
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
                        <AlertTriangle size={16} /> 
                        <span>THE REALITY</span>
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className={styles.title}
                    >
                        우리는 <span className={styles.highlight}>현장의 비정상</span>을<br />정상으로 돌려놓으려 합니다
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={styles.subtitle}
                    >
                        대한민국 국가 기간산업을 지탱하는 기술자들이 처한<br />
                        구조적 불합리와 직업적 소외를 데이터로 해결합니다.
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
