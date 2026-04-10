'use client';

import React from 'react';
import { LocateFixed, Database, Globe, Package, ShieldCheck, TrendingUp } from 'lucide-react';
import styles from './Features.module.css';
import GlassCard from '../UI/GlassCard';

const features = [
    {
        title: "투명한 정산과 안전",
        description: "GPS 기반의 정확한 출퇴근 인증과 AI 분석을 통해 투명한 정산 시스템을 제공합니다.",
        icon: <LocateFixed size={28} />
    },
    {
        title: "검증된 경력 데이터",
        description: "복잡한 서류 없이도 마스터님의 모든 현장 기록을 디지털 데이터로 증명할 수 있습니다.",
        icon: <ShieldCheck size={28} />
    },
    {
        title: "글로벌 현장 진출",
        description: "국내 기술 경력을 글로벌 표준으로 전환하여 호주, 중동 등 해외 우수 현장 배정을 돕습니다.",
        icon: <Globe size={28} />
    },
    {
        title: "최적의 일자리 매칭",
        description: "마스터님의 숙련도와 거리를 고려하여 최적의 현장과 장비를 맞춤형으로 연결해 드립니다.",
        icon: <TrendingUp size={28} />
    }
];

export default function Features() {
    return (
        <section id="features" className={styles.section}>
            <div className={`container ${styles.header}`}>
                <h2 className={styles.title}>
                    기술인의 성장을 돕는 <span className={styles.premiumText}>모노(Mo-No)</span>
                </h2>
                <p className={styles.subtitle}>
                    단순한 연결을 넘어, 기술자분들이 현장에서 정당한 대우를 받고<br />
                    더 큰 시장으로 나아갈 수 있도록 든든한 파트너가 되어 드립니다.
                </p>
            </div>
            <div className="container">
                <div className={styles.grid}>
                    {features.map((feature, idx) => (
                        <GlassCard key={idx} hoverEffect className={styles.cardOverride}>
                            <div className={styles.iconWrapper}>
                                {feature.icon}
                            </div>
                            <h3 className={styles.cardTitle}>{feature.title}</h3>
                            <p className={styles.cardDesc}>{feature.description}</p>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
