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
    const isAuthPage = pathname === '/login';

    if (isAdmin) {
        return (
            <div className="admin-shell">
                <main className="admin-content">
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

    if (isAuthPage) {
        return (
            <div className="auth-shell">
                <main className="auth-content">
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
        <>
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
        </>
    );
}
