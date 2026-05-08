import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import AuthModal from '../AuthModal/AuthModal';

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
                    MO-NO
                </Link>

                <nav className={styles.navLinks}>
                    <Link href="/jobs" className={styles.navLink}>채용 현장</Link>
                    <Link href="/technicians" className={styles.navLink}>기술 전문가</Link>
                    <Link href="/foreman" className={styles.navLink}>현장 반장 (AI)</Link>
                    <Link href="/matching" className={styles.navLink}>프리미엄 매칭</Link>
                    <Link href="/academy" className={styles.navLink}>모노 아카데미</Link>
                </nav>

                <div className={styles.ctaGroup}>
                    {isLoggedIn ? (
                        <>
                            {/* Notification Icon */}
                            <button className={styles.iconButton} aria-label="알림">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                </svg>
                            </button>
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
