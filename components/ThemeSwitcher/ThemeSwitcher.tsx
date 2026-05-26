'use client';

import React, { useState } from 'react';
import { useUI, ThemeMode } from '@/context/UIContext';
import { Palette, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ThemeSwitcher.module.css';

export default function ThemeSwitcher() {
    const { theme, setTheme } = useUI();
    const [isOpen, setIsOpen] = useState(false);

    const themes: { id: ThemeMode; label: string; color: string }[] = [
        { id: 'original', label: '기존 (Dark)', color: '#000000' },
        { id: 'sky', label: '옅은 하늘', color: '#f0f7ff' },
        { id: 'recommend1', label: '추천 1 (Silver)', color: '#f5f5f7' },
        { id: 'recommend2', label: '추천 2 (Cream)', color: '#fafaf8' },
        { id: 'pitch', label: '오리지널 피치 (Tech-Blue)', color: '#F4EFE6' }
    ];

    return (
        <div className={styles.switcherContainer}>
            <button 
                className={styles.triggerBtn} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="테마 변경"
            >
                <Palette size={20} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className={styles.dropdown}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    >
                        <div className={styles.header}>
                            <span>테마 선택</span>
                            <button onClick={() => setIsOpen(false)}><X size={16} /></button>
                        </div>
                        <div className={styles.themeList}>
                            {themes.map((t) => (
                                <button 
                                    key={t.id}
                                    className={`${styles.themeItem} ${theme === t.id ? styles.active : ''}`}
                                    onClick={() => {
                                        setTheme(t.id);
                                        setIsOpen(false);
                                    }}
                                >
                                    <div className={styles.colorDot} style={{ background: t.color }} />
                                    <span>{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
