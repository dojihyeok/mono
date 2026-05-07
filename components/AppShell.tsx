'use client';

import React from 'react';
import Navbar from './Navbar/Navbar';
import BottomNav from './BottomNav/BottomNav';
import MoCulAssistant from './MoCulAssistant/MoCulAssistant';
import { useAuth } from '@/context/AuthContext';

interface AppShellProps {
    children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    const { isLoggedIn, toggleLogin } = useAuth();

    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} onToggleLogin={toggleLogin} />
            <main className="app-content">
                {children}
            </main>
            <MoCulAssistant />
            <BottomNav />
        </>
    );
}
