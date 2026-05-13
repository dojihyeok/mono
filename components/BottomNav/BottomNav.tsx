'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Home, 
    Briefcase, 
    Users, 
    Wallet,
    UserCircle
} from 'lucide-react';
import styles from './BottomNav.module.css';

const NAV_ITEMS = [
    { label: '홈', icon: Home, href: '/' },
    { label: '현장매칭', icon: Briefcase, href: '/jobs' },
    { label: '커뮤니티', icon: Users, href: '/foreman' },
    { label: '자산', icon: Wallet, href: '/settlement' },
    { label: '내 정보', icon: UserCircle, href: '/career' }
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className={styles.bottomNav}>
            <div className={styles.navContainer}>
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                        <Link 
                            key={item.label} 
                            href={item.href} 
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                        >
                            <div className={styles.iconBox}>
                                <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={styles.label}>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
