'use client';

import React from 'react';
import { Activity, ShieldCheck, MessageSquare, Plane, Radio, Terminal } from 'lucide-react';
import styles from './Process.module.css';

const steps = [
    {
        step: "01",
        title: "데이터 로그 브리핑 (Data Logging)",
        description: "매일의 현장 기록이 실시간으로 데이터화됩니다. 단순한 노동이 아닌, 시스템으로 증명되는 공식 경력이 누적됩니다.",
        highlight: "REAL-TIME LOGGING · AUTO-INSURANCE",
        icon: <Activity size={24} />
    },
    {
        step: "02",
        title: "마스터 자격 인증 (Certification)",
        description: "누적된 작업 데이터를 기반으로 모노(Mo-No) 공식 마스터 티어를 부여받습니다. 검증된 실력으로 최상위 현장에 배정됩니다.",
        highlight: "MASTER TIER VERIFIED · PREMIUM JOB MATCH",
        icon: <ShieldCheck size={24} />
    },
    {
        step: "03",
        title: "글로벌 전술 교육 (Training)",
        description: "해외 현장 진출을 위한 핵심 기술 영어 및 국제 표준 공법을 학습합니다. 글로벌 마스터로의 언어적 기반을 구축합니다.",
        highlight: "TACTICAL ENGLISH · GLOBAL STANDARD",
        icon: <MessageSquare size={24} />
    },
    {
        step: "04",
        title: "글로벌 미션 파견 (Deployment)",
        description: "검증된 경력과 인증된 데이터로 전 세계 주요 인프라 현장에 파견됩니다. 당신의 기술이 글로벌 자산이 됩니다.",
        highlight: "MISSION DEPLOYMENT · VISA READY",
        icon: <Plane size={24} />
    }
];

export default function Process() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(180, 138, 9, 0.1)', color: '#B48A09', padding: '6px 14px', borderRadius: '8px', fontSize: '10px', fontWeight: 800, marginBottom: '1.5rem', border: '1px solid rgba(180, 138, 9, 0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        <Terminal size={12} />
                        Workflow Pipeline Optimization
                    </div>
                    <h2 className={styles.title}>기술 자산화 성장 파이프라인</h2>
                    <p className={styles.subtitle}>
                        일용직에서 글로벌 마스터로의 전환,<br />
                        Mo-No의 지능형 커리어 설계 시스템이 함께합니다.
                    </p>
                </div>

                <div className={styles.timeline}>
                    {steps.map((item, idx) => (
                        <div key={idx} className={styles.step}>
                            <div className={styles.marker}>
                                {item.icon}
                            </div>
                            <div className={styles.content}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'rgba(180,138,9,0.5)', marginBottom: '4px', fontFamily: 'monospace' }}>STEP_{item.step}</div>
                                <h3 className={styles.stepTitle}>{item.title}</h3>
                                <p className={styles.stepDesc}>{item.description}</p>
                                <span className={styles.stepHighlight}>
                                    <Radio size={12} style={{ marginRight: '8px', display: 'inline' }} />
                                    {item.highlight}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
