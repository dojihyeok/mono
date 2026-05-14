'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar/Navbar';
import BottomNav from './BottomNav/BottomNav';
import MoCulAssistant from './MoCulAssistant/MoCulAssistant';
import { useAuth } from '@/context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import Toast from './UI/Toast';
import { useUI } from '@/context/UIContext';

interface AppShellProps {
    children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    const { isLoggedIn, toggleLogin } = useAuth();
    const { toasts, removeToast } = useUI();
    const pathname = usePathname();
    const isRoadmap = pathname === '/roadmap' || pathname?.startsWith('/roadmap/');
    const isAuthPage = pathname === '/login';
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin || isAuthPage || isRoadmap) {
        return (
            <div className={isAdmin ? "admin-shell" : isAuthPage ? "auth-shell" : "web-standalone"}>
                <main className={isAdmin ? "admin-content" : isAuthPage ? "auth-content" : "web-content"}>
                    {children}
                </main>
                <AnimatePresence>
                    {toasts.map(toast => (
                        <Toast 
                            key={toast.id} 
                            message={toast.message} 
                            type={toast.type} 
                            onClose={() => removeToast(toast.id)} 
                        />
                    ))}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className="app-shell">
            <Navbar isLoggedIn={isLoggedIn} onToggleLogin={toggleLogin} />
            <main className="app-content">
                {children}
            </main>

            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast 
                        key={toast.id} 
                        message={toast.message} 
                        type={toast.type} 
                        onClose={() => removeToast(toast.id)} 
                    />
                ))}
            </AnimatePresence>

            <MoCulAssistant />
            <BottomNav />
        </div>
    );
}
