'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';
import { 
    ChevronRight, 
    ShieldCheck, 
    Smartphone, 
    MessageCircle,
    UserCircle2,
    Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const { toggleLogin } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            toggleLogin();
            router.push('/');
        }, 1500);
    };

    return (
        <div className={styles.loginContainer}>
            <header className={styles.header}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={styles.logo}
                >
                    M
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    기술의 가치를 증명하는 시작<br />
                    <span>모노(MONO)에 오신 것을 환영합니다</span>
                </motion.h1>
            </header>

            <main className={styles.main}>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={styles.authButtons}
                >
                    <button className={styles.authBtn} onClick={handleLogin} disabled={isLoading}>
                        <div className={styles.iconBox} style={{ background: '#FEE500' }}>
                            <MessageCircle size={24} color="#000" fill="#000" />
                        </div>
                        <span>카카오로 3초 만에 시작하기</span>
                    </button>
                    
                    <button className={styles.authBtn} onClick={handleLogin} disabled={isLoading}>
                        <div className={styles.iconBox} style={{ background: '#fff' }}>
                            <Smartphone size={24} color="#000" />
                        </div>
                        <span>휴대폰 번호로 시작하기</span>
                    </button>

                    <button className={styles.authBtn} onClick={handleLogin} disabled={isLoading}>
                        <div className={styles.iconBox} style={{ background: '#fff' }}>
                            <UserCircle2 size={24} color="#000" />
                        </div>
                        <span>내 경력 데이터 불러오기</span>
                    </button>
                </motion.div>

                {isLoading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={styles.loadingOverlay}
                    >
                        <div className={styles.spinner} />
                        <p>안전하게 로그인 중입니다...</p>
                    </motion.div>
                )}
            </main>

            <footer className={styles.footer}>
                <div className={styles.trustRow}>
                    <ShieldCheck size={14} color="#30d158" />
                    <span>개인정보 보호 및 보안 인증 완료</span>
                </div>
                <p>계속 진행함으로써 모노의 <span>이용약관</span> 및 <span>개인정보 처리방침</span>에 동의하게 됩니다.</p>
            </footer>
        </div>
    );
}
