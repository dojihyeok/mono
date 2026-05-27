'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import AuthModal from '../AuthModal/AuthModal';
import TacticalAlerts from '../TacticalAlerts/TacticalAlerts';

interface NavbarProps {
    isLoggedIn?: boolean;
    onToggleLogin?: () => void;
}

import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';

export default function Navbar({ isLoggedIn = false, onToggleLogin }: NavbarProps) {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const pathname = usePathname();

    // Hide global Navbar on Home if logged in (Home has its own native header)
    if (pathname === '/' && isLoggedIn) return null;

    return (
        <header className={styles.header}>
            <div className={styles.navContainer}>
                <Link href="/" className={styles.logo}>
                    <img src="/apple-touch-icon.png" className={styles.logoIcon} alt="MoNo" />
                    <span>MONO</span>
                </Link>

                <div className={styles.ctaGroup}>
                    <ThemeSwitcher />
                    {isLoggedIn ? (
                        <>
                            <TacticalAlerts />
                            <button className={styles.iconButton} onClick={onToggleLogin} aria-label="프로필">
                                <div className={styles.profileCircle}>JD</div>
                            </button>
                        </>
                    ) : (
                        <button className={styles.loginBtn} onClick={() => setIsAuthModalOpen(true)}>
                            시작하기
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

