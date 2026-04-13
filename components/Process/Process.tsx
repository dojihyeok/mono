'use client';

import React from 'react';
import { ClipboardCheck, ShieldCheck, BookOpen, Plane } from 'lucide-react';
import styles from './Process.module.css';

const steps = [
    {
        step: "01",
        title: "현장 출력 및 경력 기록",
        description: "매일의 현장 기록이 차곡차곡 쌓입니다. 단순한 노동을 넘어, 데이터로 증빙되는 소중한 자산이 구축됩니다.",
        highlight: "자동 출퇴근 기록 · 안심 정산",
        icon: <ClipboardCheck size={24} />
    },
    {
        step: "02",
        title: "전문가 인증 및 경력 증명",
        description: "누적된 데이터를 기반으로 공식 인증을 받습니다. 검증된 실력을 바탕으로 더 높은 일당과 대우를 보장받으세요.",
        highlight: "공식 기술 뱃지 · 맞춤형 현장 추천",
        icon: <ShieldCheck size={24} />
    },
    {
        step: "03",
        title: "기술 교육 및 글로벌 준비",
        description: "해외 우수 현장 진출을 위한 맞춤형 기술 교육과 필수 현장 영어를 배웁니다. 더 넓은 세상을 향한 준비를 돕습니다.",
        highlight: "실전 기술 영어 · 공법 교육",
        icon: <BookOpen size={24} />
    },
    {
        step: "04",
        title: "해외 우수 현장 배정",
        description: "국내외 대규모 프로젝트에 최우선적으로 투입됩니다. 당신의 기술이 전 세계 어디서나 인정받는 자산이 됩니다.",
        highlight: "해외 파견 지원 · 비자 컨설팅",
        icon: <Plane size={24} />
    }
];

export default function Process() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>전문가로 성장하는 체계적인 여정</h2>
                    <p className={styles.subtitle}>
                        모노는 기술자 한 분 한 분의 노력이 정당한 가치로 인정받고<br />
                        글로벌 전문가로 성장할 수 있는 로드맵을 제공합니다.
                    </p>
                </div>

                <div className={styles.timeline}>
                    {steps.map((item, idx) => (
                        <div key={idx} className={styles.step}>
                            <div className={styles.marker}>
                                {item.icon}
                            </div>
                            <div className={styles.content}>
                                <div style={{ fontSize: '11px', fontWeight: 900, color: '#B48A09', marginBottom: '6px', letterSpacing: '0.05em' }}>{item.step}단계</div>
                                <h3 className={styles.stepTitle}>{item.title}</h3>
                                <p className={styles.stepDesc}>{item.description}</p>
                                <span className={styles.stepHighlight}>
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
