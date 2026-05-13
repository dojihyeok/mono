'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastType } from '@/components/UI/Toast';

interface ToastData {
    id: string;
    message: string;
    type: ToastType;
}

interface UIContextType {
    toasts: ToastData[];
    showToast: (message: string, type?: ToastType) => void;
    removeToast: (id: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <UIContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}
