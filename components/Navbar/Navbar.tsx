'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import AuthModal from '../AuthModal/AuthModal';
import TacticalAlerts from '../TacticalAlerts/TacticalAlerts';

interface NavbarProps {
    isLoggedIn?: boolean;
    onToggleLogin?: () => void;
}

export default function Navbar({ isLoggedIn = false, onToggleLogin }: NavbarProps) {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logo}>
                    MONO
                </Link>

                <div className={styles.ctaGroup}>
                    {isLoggedIn ? (
                        <>
                            {/* Tactical Alerts Center */}
                            <TacticalAlerts />
                            
                            {/* Profile Icon */}
                            <button className={styles.iconButton} onClick={onToggleLogin} aria-label="로그아웃">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 16v-4"></path>
                                    <path d="M12 8h.01"></path>
                                </svg>
                            </button>
                        </>
                    ) : (
                        <button className={styles.loginBtn} onClick={() => setIsAuthModalOpen(true)}>
                            로그인 / 가입
                        </button>
                    )}
                </div>
            </div>

            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)} 
                onLogin={onToggleLogin || (() => {})} 
            />
        </header>
    );
}
