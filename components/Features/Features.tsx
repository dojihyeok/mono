'use client';

import React from 'react';
import { LocateFixed, Database, Globe, Package, Cpu, ShieldCheck, Zap } from 'lucide-react';
import styles from './Features.module.css';
import GlassCard from '../UI/GlassCard';

const features = [
    {
        title: "지능형 현장 관제 (Smart Ops)",
        description: "GPS 기반 실시간 출퇴근 인증 및 AI 데이터 분석을 통한 투명한 정산 시스템을 제공합니다.",
        icon: <LocateFixed size={32} />
    },
    {
        id: "f2",
        title: "디지털 자산 가속기 (Assetizer)",
        description: "마스터의 모든 현장 경력을 변조 불가능한 디지털 데이터로 자산화하여 신용과 가치를 증명합니다.",
        icon: <Database size={32} />
    },
    {
        id: "f3",
        title: "글로벌 테크 마이그레이션",
        description: "국내 기술 경력을 글로벌 표준 규격으로 전환하여 호주, 중동 등 해외 우대 진출을 지원합니다.",
        icon: <Globe size={32} />
    },
    {
        id: "f4",
        title: "스킬 & 장비 통합 패키지",
        description: "최고의 기술자와 최첨단 특수 장비를 최적의 미션에 매칭하는 지능형 패키징 솔루션입니다.",
        icon: <Package size={32} />
    }
];

export default function Features() {
    return (
        <section id="features" className={styles.section}>
            <div className={`container ${styles.header}`}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(180, 138, 9, 0.1)', color: '#B48A09', padding: '6px 14px', borderRadius: '8px', fontSize: '10px', fontWeight: 800, marginBottom: '1.5rem', border: '1px solid rgba(180, 138, 9, 0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    <Cpu size={12} />
                    Mono Core Operating System
                </div>
                <h2 className={styles.title}>
                    글로벌 기술 자산화 프로토콜 <span className={styles.premiumText}>Mo-No</span>
                </h2>
                <p className={styles.subtitle}>
                    기술자의 모든 경험을 정량화된 데이터로 변환하여 신뢰할 수 있는 미래 자산으로 구축합니다.
                </p>
            </div>
            <div className="container">
                <div className={styles.grid}>
                    {features.map((feature, idx) => (
                        <GlassCard key={idx} hoverEffect className={styles.cardOverride}>
                            <div className={styles.iconWrapper}>
                                {React.cloneElement(feature.icon as React.ReactElement, { color: '#B48A09' })}
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
