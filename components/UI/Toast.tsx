'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertCircle, Info, X } from 'lucide-react';
import { useEffect } from 'react';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);

    const Icon = type === 'success' ? ShieldCheck : type === 'error' ? AlertCircle : Info;
    const iconColor = type === 'success' ? '#30d158' : type === 'error' ? '#ff453a' : '#3182f6';

    return (
        <motion.div 
            className={styles.toast}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
        >
            <div className={styles.iconBox} style={{ background: `${iconColor}15`, color: iconColor }}>
                <Icon size={18} />
            </div>
            <p className={styles.message}>{message}</p>
            <button className={styles.closeBtn} onClick={onClose}>
                <X size={14} />
            </button>
        </motion.div>
    );
}
