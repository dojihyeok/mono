'use client';

import React from 'react';
import { X, Phone, Mail, Globe, Smartphone } from 'lucide-react';
import styles from './AuthModal.module.css';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void;
}

export default function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={20} />
                </button>

                <div className={styles.header}>
                    <div className={styles.logoMark} />
                    <h2 className={styles.title}>모노와 함께 시작하기</h2>
                    <p className={styles.subtitle}>
                        기술자의 숙련도가 자산이 되는 곳, <br />
                        당신의 경력을 증명하고 더 높은 가치를 인정받으세요.
                    </p>
                </div>

                <div className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>휴대폰 번호</label>
                        <div className={styles.phoneInput}>
                            <span className={styles.prefix}>+82</span>
                            <input type="tel" placeholder="010-0000-0000" />
                        </div>
                    </div>

                    <button className={styles.submitBtn} onClick={() => { onLogin(); onClose(); }}>
                        인증번호 받기
                    </button>

                    <div className={styles.divider}>
                        <span>또는 소셜 계정으로 로그인</span>
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
            </div>
        </div>
    );
}
