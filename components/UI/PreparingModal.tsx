'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, AlertCircle, PlayCircle, PauseCircle } from 'lucide-react';
import styles from './PreparingModal.module.css';

export type FeatureStatus = 'PREPARING' | 'AVAILABLE' | 'SUSPENDED';

interface PreparingModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    featureName: string;
}

export default function PreparingModal({ 
    isOpen, 
    onClose, 
    title = '공식 확인 기능을 준비하고 있어요', 
    description = '현재 관련 기관과 연동을 준비 중이며, 준비가 완료되면 내 기록을 더 쉽게 확인할 수 있어요. 지금은 직접 등록한 자료와 회사 확인 기록을 기준으로 보여드려요.',
    featureName 
}: PreparingModalProps) {
    const [status, setStatus] = useState<FeatureStatus>('PREPARING');
    const [isSubscribed, setIsSubscribed] = useState(false);

    if (!isOpen) return null;

    const handleSubscribe = () => {
        setIsSubscribed(!isSubscribed);
    };

    // Text details based on the selected status (Admin simulator feature)
    const getStatusDetails = () => {
        switch (status) {
            case 'AVAILABLE':
                return {
                    label: '확인 가능',
                    color: '#30d158',
                    desc: '이 기능은 현재 연동이 완료되어 즉시 조회가 가능한 상태입니다. (실운영 서버 연동 완료)'
                };
            case 'SUSPENDED':
                return {
                    label: '일시 중단',
                    color: '#ff453a',
                    desc: '기관 서버 정기 검정 작업 또는 일시적인 오류로 인해 연결이 잠시 중단되었습니다.'
                };
            case 'PREPARING':
            default:
                return {
                    label: '연동 준비 중',
                    color: '#ff9f0a',
                    desc: description
                };
        }
    };

    const details = getStatusDetails();

    return (
        <AnimatePresence>
            <div className={styles.overlay} onClick={onClose}>
                <motion.div 
                    className={styles.modal}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.handle} />
                        <button className={styles.closeBtn} onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className={styles.body}>
                        <div className={styles.iconBox} style={{ background: `${details.color}15`, color: details.color }}>
                            {status === 'AVAILABLE' ? <PlayCircle size={36} /> : status === 'SUSPENDED' ? <PauseCircle size={36} /> : <AlertCircle size={36} />}
                        </div>
                        
                        <h2 className={styles.title}>{status === 'PREPARING' ? title : `${featureName} (${details.label})`}</h2>
                        <p className={styles.description}>{details.desc}</p>

                        {/* Interactive Notification Option */}
                        <div className={styles.subscriptionBox}>
                            <div className={styles.subText}>
                                <strong>서비스 출시 알림</strong>
                                <p>연동이 활성화되면 가장 먼저 알려드릴게요.</p>
                            </div>
                            <button 
                                className={`${styles.subBtn} ${isSubscribed ? styles.subscribed : ''}`}
                                onClick={handleSubscribe}
                            >
                                <Bell size={16} fill={isSubscribed ? 'currentColor' : 'none'} />
                                {isSubscribed ? '신청 완료' : '알림 받기'}
                            </button>
                        </div>

                        {/* VC/Investor Admin Sim Strip */}
                        <div className={styles.adminSimStrip}>
                            <span className={styles.simLabel}>💡 데모 관리자 설정 (상태 변경 테스트)</span>
                            <div className={styles.simButtons}>
                                <button 
                                    className={`${styles.simBtn} ${status === 'PREPARING' ? styles.activeSim : ''}`}
                                    onClick={() => setStatus('PREPARING')}
                                >
                                    준비 중
                                </button>
                                <button 
                                    className={`${styles.simBtn} ${status === 'AVAILABLE' ? styles.activeSim : ''}`}
                                    onClick={() => setStatus('AVAILABLE')}
                                >
                                    확인 가능
                                </button>
                                <button 
                                    className={`${styles.simBtn} ${status === 'SUSPENDED' ? styles.activeSim : ''}`}
                                    onClick={() => setStatus('SUSPENDED')}
                                >
                                    일시 중단
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
