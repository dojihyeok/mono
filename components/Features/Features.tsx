'use client';

import React from 'react';
import { LocateFixed, Globe, ShieldCheck, Zap, ArrowRight, CheckCircle2, BrainCircuit, Users } from 'lucide-react';
import styles from './Features.module.css';
import { motion } from 'framer-motion';

const features = [
    {
        title: "디지털 기술 여권",
        description: "블록체인 기반의 위변조 불가능한 경력 인증. AI 기술 지수를 통해 글로벌 표준 기술자로 증명합니다.",
        icon: <ShieldCheck size={28} />,
        color: "#3182f6"
    },
    {
        title: "AI 현장 반장 (모컬 AI)",
        description: "현장 은어 실시간 번역부터 생소한 공구 인식까지. 초보자가 마스터로 성장하도록 돕는 지능형 조력자입니다.",
        icon: <BrainCircuit size={28} />,
        color: "#ff9f0a"
    },
    {
        title: "중대재해 리스크 헷지",
        description: "AI PPE 스캔과 모바일 안전 교육으로 기업의 법적 방어막을 제공하는 스마트 노무 관리 SaaS.",
        icon: <Zap size={28} />,
        color: "#ff453a"
    },
    {
        title: "포용 금융 & 정산",
        description: "에스크로 기반 정산과 투명한 데이터를 활용한 대안 신용평가로 기술자 금융 소외를 해결합니다.",
        icon: <LocateFixed size={28} />,
        color: "#30d158"
    },
    {
        title: "무자본 일자리 (STO)",
        description: "회사가 보유한 중장비를 무자본으로 배차받고, 장비 지분 소액 투자를 통해 자본가로 진화합니다.",
        icon: <Globe size={28} />,
        color: "#af52de"
    },
    {
        title: "전방위 생활 밀착 지원",
        description: "사고 발생 시 글로벌 전담 의료 지원부터 검증된 숙식 연계까지 기술자의 삶을 토탈 케어합니다.",
        icon: <Users size={28} />,
        color: "#00c7be"
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

