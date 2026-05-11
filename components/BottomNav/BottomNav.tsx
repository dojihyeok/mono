'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Home, 
    Briefcase, 
    CalendarCheck, 
    BrainCircuit, 
    Wallet,
    ShieldCheck
} from 'lucide-react';
import styles from './BottomNav.module.css';

const NAV_ITEMS = [
    { label: '홈', icon: Home, href: '/' },
    { label: '현장', icon: Briefcase, href: '/jobs' },
    { label: '반장', icon: BrainCircuit, href: '/foreman' },
    { label: '커리어', icon: ShieldCheck, href: '/career' },
    { label: '정산', icon: Wallet, href: '/settlement' }
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className={styles.bottomNav}>
            {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                    <Link 
                        key={item.label} 
                        href={item.href} 
                        className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                    >
                        <div className={styles.iconWrapper}>
                            {typeof Icon === 'string' ? (
                                <span className={styles.customIcon}>{Icon}</span>
                            ) : (
                                <Icon size={24} />
                            )}
                        </div>
                        <span className={styles.label}>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
