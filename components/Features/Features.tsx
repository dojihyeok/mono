'use client';

import React from 'react';
import { LocateFixed, Database, Globe, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import styles from './Features.module.css';
import GlassCard from '../UI/GlassCard';

const features = [
    {
        title: "투명한 정산과 안전",
        description: "GPS 기반의 정확한 출퇴근 인증과 AI 분석을 통해 투명한 정산 시스템을 제공합니다. 안심 에스크로로 수수료 없이 바로 정산됩니다.",
        icon: <LocateFixed size={32} />
    },
    {
        title: "검증된 경력 데이터",
        description: "복잡한 서류 없이도 전문가님의 모든 현장 기록을 디지털 데이터로 증명할 수 있습니다. 경력이 곧 신용이 됩니다.",
        icon: <ShieldCheck size={32} />
    },
    {
        title: "글로벌 현장 진출",
        description: "국내 기술 경력을 글로벌 표준으로 전환하여 호주, 중동 등 해외 우수 현장 배정을 돕습니다. 기술 여권 하나로 세계로 진출하세요.",
        icon: <Globe size={32} />
    },
    {
        title: "AI 맞춤 일자리 매칭",
        description: "전문가님의 숙련도, 위치, 선호도를 종합 분석하여 최적의 현장과 장비를 맞춤형으로 연결해 드립니다. 새벽 줄서기는 이제 끝.",
        icon: <Zap size={32} />
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
