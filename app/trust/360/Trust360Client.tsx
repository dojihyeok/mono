'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { 
    Users, 
    Star, 
    ShieldCheck, 
    TrendingUp, 
    ChevronRight, 
    MapPin,
    AlertCircle,
    BrainCircuit,
    Award
} from 'lucide-react';

type Role = 'SITE_MANAGER' | 'TEAM_LEADER' | 'TECHNICIAN';

export default function Trust360Client() {
    const [activeRole, setActiveRole] = useState<Role>('SITE_MANAGER');

    const ROLES = [
        { id: 'SITE_MANAGER', label: '현장 반장', desc: '팀, 팀장, 기술자 전체 조망 및 평판 확인' },
        { id: 'TEAM_LEADER', label: '현장 팀장', desc: '그룹 내 기술자 숙련도 및 태도 보증' },
        { id: 'TECHNICIAN', label: '전문 기술인', desc: '팀장 리더십 및 현장 환경 공정 평가' }
    ];

    const EVALUATION_LIST = {
        SITE_MANAGER: [
            { id: 1, name: '경기 삼성반도체 팀 A', type: 'TEAM', status: 'PENDING' },
            { id: 2, name: '김두석 전문가 (팀장)', type: 'LEADER', status: 'COMPLETED' },
            { id: 3, name: '이창근 전문가 (기전)', type: 'TECH', status: 'PENDING' }
        ],
        TEAM_LEADER: [
            { id: 4, name: '박지훈 (초급기공)', type: 'TECH', status: 'PENDING' },
            { id: 5, name: '최현우 (조공/헬퍼)', type: 'TECH', status: 'PENDING' }
        ],
        TECHNICIAN: [
            { id: 6, name: '김두석 전문가 (팀장)', type: 'LEADER', status: 'PENDING' },
            { id: 7, name: '삼성물산 현장 공무 (반장)', type: 'FOREMAN', status: 'PENDING' }
        ]
    };

    return (
        <div className={styles.pageWrap}>
            <header className={styles.header}>
                <div className={styles.premiumBadge}>EXPERT TRUST 360 | REPUTATION ASSET</div>
                <h1>상호 신뢰 가치 <span className={styles.goldText}>증명 센터</span></h1>
                <p className={styles.subtitle}>현장 반장, 팀장, 기술자가 서로의 전성기를 보증합니다.</p>
            </header>

            {/* 1. Role Switcher (For Demo Context) */}
            <div className={styles.roleGrid}>
                {ROLES.map((role) => (
                    <button 
                        key={role.id}
                        className={`${styles.roleCard} ${activeRole === role.id ? styles.active : ''}`}
                        onClick={() => setActiveRole(role.id as Role)}
                    >
                        <div className={styles.roleHeader}>
                            <Users size={16} color={activeRole === role.id ? '#B48A09' : '#B0B0B0'} />
                            <span>{role.label}</span>
                        </div>
                        <p>{role.desc}</p>
                    </button>
                ))}
            </div>

            {/* 2. Main Evaluation Interface */}
            <div className={styles.cardSection}>
                <div className={styles.sectionHeader}>
                    <ShieldCheck size={20} color="#B48A09" />
                    <h3>상호 신뢰 평판 기록</h3>
                    <span className={styles.countBadge}>{EVALUATION_LIST[activeRole].length} 건의 대기중</span>
                </div>

                <div className={styles.evalGrid}>
                    {EVALUATION_LIST[activeRole].map((item) => (
                        <div key={item.id} className={styles.evalCard}>
                            <div className={styles.evalInfo}>
                                <div className={styles.itemType}>{item.type} REPORTING</div>
                                <h4>{item.name}</h4>
                                <div className={styles.metaRow}>
                                    <MapPin size={12} />
                                    <span>경기 삼성반도체 평택 P4</span>
                                </div>
                            </div>
                            <button className={styles.vouchBtn}>
                                {item.status === 'COMPLETED' ? (
                                    <>보증 완료 <Award size={16} /></>
                                ) : (
                                    <>데이터 보증하기 <ChevronRight size={16} /></>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Metrics Overview Card (Dynamic) */}
            <div className={styles.metricsCard}>
                <div className={styles.metricsInfo}>
                    <BrainCircuit size={24} color="#B48A09" />
                    <div className={styles.metricsText}>
                        <h4>{activeRole === 'SITE_MANAGER' ? '현장 반장 신뢰 지수' : activeRole === 'TEAM_LEADER' ? '리더십 자산' : '기술 자산지수'}</h4>
                        <p>상호 평가 데이터를 기반으로 기술인의 가치가 자산화됩니다.</p>
                    </div>
                </div>
                <div className={styles.metricsValue}>
                    <span className={styles.score}>98.2</span>
                    <span className={styles.unit}>T-INDEX</span>
                </div>
            </div>

            <footer className={styles.footer}>
                <div className={styles.alertBox}>
                    <AlertCircle size={14} />
                    <span>상호 평가는 MO-NO 에스크로 정산 및 글로벌 매칭 신뢰도의 핵심 지표로 활용됩니다.</span>
                </div>
            </footer>
        </div>
    );
}
