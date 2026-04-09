'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
    BrainCircuit, 
    X, 
    MessageSquare, 
    ShieldAlert, 
    Calculator,
    ArrowRight,
    Zap
} from 'lucide-react';
import styles from './MoCulAssistant.module.css';
import Link from 'next/link';

export default function MoCulAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [showBadge, setShowBadge] = useState(false);
    const pathname = usePathname();

    // /foreman 페이지에서는 플로팅 버튼을 숨기거나 투명하게 처리할 수 있습니다.
    const isForemanPage = pathname === '/foreman';

    useEffect(() => {
        // 접속 2초 후 뱃지 알림 표시
        const timer = setTimeout(() => setShowBadge(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const toggleAssistant = () => {
        setIsOpen(!isOpen);
        if (showBadge) setShowBadge(false);
    };

    if (isForemanPage) return null;

    return (
        <div className={`${styles.wrapper} ${isOpen ? styles.active : ''}`}>
            {/* Assistant Window */}
            <div className={styles.window}>
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <BrainCircuit size={20} className={styles.brainIcon} />
                        <div>
                            <h4>Mo-Cul AI</h4>
                            <span>현장 지원 본부</span>
                        </div>
                    </div>
                    <button onClick={toggleAssistant} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.greeting}>
                        <p>반가워요! 무엇을 도와드릴까요?</p>
                    </div>

                    <div className={styles.quickActions}>
                        <Link href="/foreman" className={styles.actionItem} onClick={() => setIsOpen(false)}>
                            <ShieldAlert size={18} color="#22c55e" />
                            <span>안전 체크리스트</span>
                            <ArrowRight size={14} />
                        </Link>
                        <Link href="/foreman" className={styles.actionItem} onClick={() => setIsOpen(false)}>
                            <Calculator size={18} color="#3b82f6" />
                            <span>일당 계산기</span>
                            <ArrowRight size={14} />
                        </Link>
                        <div className={styles.chatPrompt}>
                            <MessageSquare size={16} />
                            <span>지금 바로 질문하기</span>
                        </div>
                        <div className={styles.inputBox}>
                            <input type="text" placeholder="예: 비 오는 날 작업 수당은?" />
                            <button className={styles.sendBtn}><Zap size={14} /></button>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <Link href="/foreman" className={styles.fullLink} onClick={() => setIsOpen(false)}>
                        모컬 AI 본부 전체보기 →
                    </Link>
                </div>
            </div>

            {/* Floating Toggle Button */}
            <button 
                onClick={toggleAssistant} 
                className={`${styles.toggleBtn} ${showBadge ? styles.hasBadge : ''}`}
                aria-label="Mo-Cul Assistant"
            >
                <div className={styles.glow} />
                <BrainCircuit size={28} className={styles.mainIcon} />
                <div className={styles.scanningLine} />
                {showBadge && <div className={styles.badge}>1</div>}
            </button>
        </div>
    );
}
