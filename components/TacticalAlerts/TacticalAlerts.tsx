'use client';

import React, { useState, useEffect } from 'react';
import { 
    Bell, 
    Zap, 
    AlertTriangle, 
    CheckCircle2, 
    MessageSquare, 
    ChevronRight,
    MapPin,
    Clock
} from 'lucide-react';
import styles from './TacticalAlerts.module.css';
import GlassCard from '../UI/GlassCard';

interface Alert {
    id: string;
    type: 'MATCH' | 'SAFETY' | 'SYSTEM' | 'MESSAGE';
    title: string;
    desc: string;
    time: string;
    isUrgent?: boolean;
}

const MOCK_ALERTS: Alert[] = [
    {
        id: '1',
        type: 'MATCH',
        title: '신규 글로벌 프로젝트 매칭',
        desc: '시드니 도심 펜트하우스 타일링 전문가로 선정되었습니다.',
        time: '방금 전',
        isUrgent: true
    },
    {
        id: '2',
        type: 'SAFETY',
        title: '현장 안전 지시사항 업데이트',
        desc: 'P4 현장 C구역 고소작업 시 안전고리 체결 필수 확인.',
        time: '15분 전',
        isUrgent: true
    },
    {
        id: '3',
        type: 'SYSTEM',
        title: '전문가 신뢰 점수 업데이트',
        desc: '최근 프로젝트 완수로 신뢰 점수가 94.8점으로 상승했습니다.',
        time: '2시간 전'
    }
];

export default function TacticalAlerts() {
    const [isOpen, setIsOpen] = useState(false);
    const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className={styles.container}>
            <button 
                className={`${styles.trigger} ${isOpen ? styles.active : ''}`} 
                onClick={toggleOpen}
                aria-label="Tactical Alerts"
            >
                <Bell size={20} />
                <span className={styles.badge}>2</span>
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <GlassCard className={styles.alertCard}>
                        <div className={styles.header}>
                            <div className={styles.headerTitle}>
                                <Zap size={14} color="#D4AF37" fill="#D4AF37" />
                                <h3>TACTICAL ALERTS</h3>
                            </div>
                            <button className={styles.markAll}>모두 읽음</button>
                        </div>

                        <div className={styles.alertList}>
                            {alerts.map(alert => (
                                <div 
                                    key={alert.id} 
                                    className={`${styles.alertItem} ${alert.isUrgent ? styles.urgent : ''}`}
                                >
                                    <div className={styles.alertIcon}>
                                        {alert.type === 'MATCH' && <Zap size={16} color="#D4AF37" />}
                                        {alert.type === 'SAFETY' && <AlertTriangle size={16} color="#ff3b30" />}
                                        {alert.type === 'SYSTEM' && <CheckCircle2 size={16} color="#30d158" />}
                                    </div>
                                    <div className={styles.alertContent}>
                                        <div className={styles.alertMeta}>
                                            <span className={styles.alertType}>{alert.type}</span>
                                            <span className={styles.alertTime}>{alert.time}</span>
                                        </div>
                                        <h4 className={styles.alertTitle}>{alert.title}</h4>
                                        <p className={styles.alertDesc}>{alert.desc}</p>
                                    </div>
                                    <ChevronRight size={14} className={styles.arrow} />
                                </div>
                            ))}
                        </div>

                        <div className={styles.footer}>
                            <button className={styles.viewAll}>
                                전체 알림 보기 <ChevronRight size={14} />
                            </button>
                        </div>
                    </GlassCard>
                </div>
            )}
        </div>
    );
}
