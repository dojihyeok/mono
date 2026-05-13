'use client';

import React from 'react';
import { LocateFixed, Globe, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import styles from './Features.module.css';
import { motion } from 'framer-motion';

const features = [
    {
        title: "실시간 투명 정산",
        description: "GPS 기반 출퇴근 인증과 AI 분석으로 임금 체불 걱정 없는 즉시 정산 시스템을 제공합니다.",
        icon: <LocateFixed size={28} />,
        color: "#30d158"
    },
    {
        title: "디지털 기술 증명",
        description: "현장 기록을 블록체인 데이터로 전환하여 복잡한 서류 없이 당신의 숙련도를 공식 증명합니다.",
        icon: <ShieldCheck size={28} />,
        color: "#3182f6"
    },
    {
        title: "글로벌 기술 여권",
        description: "국내 경력을 글로벌 표준으로 인증하여 호주, 중동 등 해외 우수 현장 배정을 지원합니다.",
        icon: <Globe size={28} />,
        color: "#af52de"
    },
    {
        title: "AI 매칭 엔진",
        description: "당신의 숙련도와 위치에 최적화된 현장을 분석하여 실시간으로 일자리를 제안합니다.",
        icon: <Zap size={28} />,
        color: "#ff9f0a"
    }
];

export default function Features() {
    return (
        <section id="features" className={styles.featuresSection}>
            <div className={styles.container}>
                <header className={styles.sectionHeader}>
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className={styles.tag}
                    >
                        WHY MONO
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={styles.title}
                    >
                        기술인의 가치를<br /><span>새롭게 정의합니다</span>
                    </motion.h2>
                </header>

                <div className={styles.featureGrid}>
                    {features.map((feature, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className={styles.featureCard}
                        >
                            <div className={styles.iconBox} style={{ color: feature.color, background: `${feature.color}10` }}>
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                            <div className={styles.cardFooter}>
                                <div className={styles.checkLine}>
                                    <CheckCircle2 size={14} color="#30d158" />
                                    <span>검증된 시스템</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Proof of Work Showcase */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className={styles.showcaseBox}
                >
                    <div className={styles.showcaseContent}>
                        <h3>지금 바로 당신의 가치를 증명하세요</h3>
                        <p>3,000명 이상의 마스터들이 모노와 함께 글로벌 시장으로 나아가고 있습니다.</p>
                        <button className={styles.ctaBtn}>
                            무료 가입하고 기술 인증 받기
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

