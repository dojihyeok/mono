'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Home, 
    Briefcase, 
    CalendarCheck, 
    Wallet,
    UserCircle
} from 'lucide-react';
import styles from './BottomNav.module.css';

const NAV_ITEMS = [
    { label: '홈', icon: Home, href: '/' },
    { label: '일자리', icon: Briefcase, href: '/jobs' },
    { label: '근무기록', icon: CalendarCheck, href: '/attendance' },
    { label: 'MONO Wallet', icon: Wallet, href: '/wallet' },
    { label: '내 정보', icon: UserCircle, href: '/myinfo' }
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
