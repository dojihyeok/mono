'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Navbar from './Navbar/Navbar';
import BottomNav from './BottomNav/BottomNav';
import MoCulAssistant from './MoCulAssistant/MoCulAssistant';
import { useAuth } from '@/context/AuthContext';
import { useDemo, DemoStage } from '@/context/DemoContext';
import { AnimatePresence, motion } from 'framer-motion';
import Toast from './UI/Toast';
import { useUI } from '@/context/UIContext';
import Onboarding from './Onboarding/Onboarding';
import { ShieldAlert, Zap, Compass, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

interface AppShellProps {
    children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    const { isLoggedIn, toggleLogin } = useAuth();
    const { state, setDemoStage, resetDemo } = useDemo();
    const { toasts, removeToast } = useUI();
    const pathname = usePathname();
    const router = useRouter();

    const isRoadmap = pathname === '/roadmap' || pathname?.startsWith('/roadmap/');
    const isAuthPage = pathname === '/login';
    const isAdmin = pathname?.startsWith('/admin');
    const isStrategy = pathname === '/strategy' || pathname?.startsWith('/strategy');
    const isSharePage = pathname?.startsWith('/share/');

    const [liveTime, setLiveTime] = useState('09:41');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const hrs = String(now.getHours()).padStart(2, '0');
            const mins = String(now.getMinutes()).padStart(2, '0');
            setLiveTime(`${hrs}:${mins}`);
        };
        updateClock();
        const interval = setInterval(updateClock, 60000);
        return () => clearInterval(interval);
    }, []);

    // Redirect to onboarding/home if profile complete state mismatch
    useEffect(() => {
        if (isLoggedIn && !isAdmin && !isRoadmap && !isStrategy && !isAuthPage && !isSharePage) {
            if (state.demoStage === 'ONBOARDING' && pathname !== '/') {
                router.push('/');
            }
        }
    }, [state.demoStage, isLoggedIn, pathname]);

    if (isAdmin || isAuthPage || isRoadmap || isStrategy || isSharePage) {
        return (
            <div className={isAdmin ? "admin-shell" : isAuthPage ? "auth-shell" : isSharePage ? "share-shell" : "web-standalone"}>
                <main className={isAdmin ? "admin-content" : isAuthPage ? "auth-content" : isSharePage ? "share-content" : "web-content"}>
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

    const handleQuickStage = (stage: DemoStage) => {
        setDemoStage(stage);
        router.push('/');
    };

    return (
        <div className="simulator-layout">
            {/* 1. Desktop Investor Quickpass Controller Panel (Shown on lg screen) */}
            <aside className="desktop-controller">
                <div className="controller-card">
                    <div className="controller-header">
                        <div className="pulse-dot"></div>
                        <span className="controller-tag">MoNo Lab</span>
                    </div>
                    <h1 className="controller-title">투자자·심사위원 전용<br />10초 퀵패스 컨트롤러</h1>
                    <p className="controller-desc">
                        근로자가 현장에서 일할수록 근무 데이터가 쌓이고 <strong>"내 기술카드"</strong>와 <strong>"MONO Wallet"</strong>으로 자산화되는 전 과정을 바로 눈으로 확인해 보세요.
                    </p>

                    <div className="controller-steps">
                        <button 
                            onClick={() => handleQuickStage('ONBOARDING')} 
                            className={`step-btn ${state.demoStage === 'ONBOARDING' ? 'active' : ''}`}
                        >
                            <span>🌱 1단계: 온보딩 새로 시작하기</span>
                        </button>
                        <button 
                            onClick={() => handleQuickStage('INIT')} 
                            className={`step-btn ${state.demoStage === 'INIT' ? 'active' : ''}`}
                        >
                            <span>👤 2단계: 가입 완료 및 초기 상태</span>
                        </button>
                        <button 
                            onClick={() => handleQuickStage('APPLIED')} 
                            className={`step-btn ${state.demoStage === 'APPLIED' ? 'active' : ''}`}
                        >
                            <span>💼 3단계: 나에게 맞는 일자리 신청</span>
                        </button>
                        <button 
                            onClick={() => handleQuickStage('CONFIRMED')} 
                            className={`step-btn ${state.demoStage === 'CONFIRMED' ? 'active' : ''}`}
                        >
                            <span>🎯 4단계: 회사 확인 및 일터 확정</span>
                        </button>
                        <button 
                            onClick={() => handleQuickStage('CHECKED_IN')} 
                            className={`step-btn ${state.demoStage === 'CHECKED_IN' ? 'active' : ''}`}
                        >
                            <span>📍 5단계: 현장 도착 & QR 출근 확인</span>
                        </button>
                        <button 
                            onClick={() => handleQuickStage('CHECKED_OUT')} 
                            className={`step-btn ${state.demoStage === 'CHECKED_OUT' ? 'active' : ''}`}
                        >
                            <span>🚪 6단계: 퇴근 확인 (회사 기록 확인)</span>
                        </button>
                        <button 
                            onClick={() => handleQuickStage('PAID')} 
                            className={`step-btn-primary ${state.demoStage === 'PAID' ? 'active' : ''}`}
                        >
                            <span>👑 7단계: 정산 완료 (기술카드 마스터)</span>
                            <CheckCircle2 size={12} className="check-icon" />
                        </button>
                    </div>

                    <div className="controller-tips">
                        <strong className="tip-title">💡 데모 안내:</strong>
                        <p className="tip-body">
                            온보딩에서 직접 입력한 직종과 지역에 따라 일자리 매칭도가 다르게 작동하며, 출퇴근 시 근무 이력 데이터가 즉시 기술카드에 연동됩니다.
                        </p>
                    </div>
                </div>
            </aside>

            {/* 2. Interactive PWA Smartphone Frame Container */}
            <div className="smartphone-frame">
                {/* Physical iPhone Notch for realistic mockup */}
                <div className="iphone-notch"></div>

                {/* Status Bar */}
                <div className="iphone-status-bar">
                    <span className="status-clock">{liveTime}</span>
                    <div className="status-icons">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.07 19.58 10.48 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" /></svg>
                        <span className="text-[9px] font-bold tracking-tighter">5G</span>
                        <svg className="w-5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M17 5H3a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2zm0 12H3V7h14v10zm4-8v6a2 2 0 01-2 2h-1v-2h1V9h-1V7h1a2 2 0 012 2z" /></svg>
                    </div>
                </div>

                {/* Navbar (Internal to mock mobile screen) */}
                <Navbar isLoggedIn={isLoggedIn} onToggleLogin={toggleLogin} />

                {/* Scrollable Viewport */}
                <main className="iphone-content">
                    <AnimatePresence mode="wait">
                        {state.demoStage === 'ONBOARDING' ? (
                            <motion.div 
                                key="onboarding" 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full h-full"
                            >
                                <Onboarding />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full h-full"
                            >
                                {children}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                <BottomNav />
                <MoCulAssistant />

                {/* Simulated Toast Overlay */}
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
        </div>
    );
}
