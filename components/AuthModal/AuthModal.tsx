'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, Globe, Smartphone, ShieldCheck, Zap, Coins } from 'lucide-react';
import styles from './AuthModal.module.css';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void;
}

export default function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    className={styles.overlay} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div 
                        className={styles.modal} 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button className={styles.closeBtn} onClick={onClose}>
                            <X size={20} />
                        </button>

                        <div className={styles.header}>
                            <div className={styles.logoMark} />
                            <h2 className={styles.title}>기술 전문가로 시작하기</h2>
                            <p className={styles.subtitle}>
                                숙련된 기술이 정당한 가치를 인정받는 곳,<br />
                                MoNo 전문가 커뮤니티에 오신 것을 환영합니다.
                            </p>
                        </div>

                        <div className={styles.benefits}>
                            <div className={styles.benefitItem}>
                                <div className={styles.benefitIcon}><ShieldCheck size={16} /></div>
                                <span>에스크로 안심 정산</span>
                            </div>
                            <div className={styles.benefitItem}>
                                <div className={styles.benefitIcon}><Zap size={16} /></div>
                                <span>AI 실시간 매칭 (98%)</span>
                            </div>
                            <div className={styles.benefitItem}>
                                <div className={styles.benefitIcon}><Coins size={16} /></div>
                                <span>데이터 기반 금융 혜택</span>
                            </div>
                        </div>

                        <div className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label>휴대폰 번호 인증</label>
                                <div className={styles.phoneInput}>
                                    <span className={styles.prefix}>+82</span>
                                    <input type="tel" placeholder="010-0000-0000" />
                                </div>
                            </div>

                            <button className={styles.submitBtn} onClick={() => { onLogin(); onClose(); }}>
                                전문가 인증 시작
                            </button>

                            <div className={styles.divider}>
                                <span>간편 소셜 로그인</span>
                            </div>

                            <div className={styles.socialGroup}>
                                <button className={styles.socialBtn} aria-label="Google Login">
                                    <Globe size={20} />
                                </button>
                                <button className={styles.socialBtn} aria-label="Kakao Login">
                                    <span className={styles.kakaoIcon}>K</span>
                                </button>
                                <button className={styles.socialBtn} aria-label="Github Login">
                                    <Smartphone size={20} />
                                </button>
                            </div>
                        </div>

                        <p className={styles.footer}>
                            계속 진행하면 모노의 <span>이용약관</span> 및 <span>개인정보처리방침</span>에 동의하게 됩니다.
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
