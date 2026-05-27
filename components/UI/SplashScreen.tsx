'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './SplashScreen.module.css';

export default function SplashScreen() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show splash screen on the root home page ("/")
        if (pathname !== '/') {
            Promise.resolve().then(() => setIsVisible(false));
            return;
        }

        // Check if splash has already been shown in this session
        const hasShown = sessionStorage.getItem('mono-splash-shown');
        if (!hasShown) {
            Promise.resolve().then(() => setIsVisible(true));
            const timer = setTimeout(() => {
                setIsVisible(false);
                sessionStorage.setItem('mono-splash-shown', 'true');
            }, 2500);
            return () => clearTimeout(timer);
        } else {
            Promise.resolve().then(() => setIsVisible(false));
        }
    }, [pathname]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    className={styles.overlay}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <div className={styles.container}>
                        <motion.div 
                            className={styles.logoBox}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        >
                            <h1 className={styles.logoText}>MONO</h1>
                            <div className={styles.line} />
                        </motion.div>
                        
                        <motion.div 
                            className={styles.loadingBar}
                            initial={{ width: 0 }}
                            animate={{ width: "120px" }}
                            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                        />
                        
                        <motion.p 
                            className={styles.tagline}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.5 }}
                        >
                            온라인 현장 사무소 서비스
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
