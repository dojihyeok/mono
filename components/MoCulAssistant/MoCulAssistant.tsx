'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { 
    BrainCircuit, 
    X, 
    MessageSquare, 
    ShieldAlert, 
    Calculator,
    ArrowRight,
    Zap,
    Mic,
    MicOff,
    Send
} from 'lucide-react';
import styles from './MoCulAssistant.module.css';
import Link from 'next/link';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
}

export default function MoCulAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [showBadge, setShowBadge] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: '반가워요! 무엇을 도와드릴까요?', sender: 'ai' }
    ]);
    
    const pathname = usePathname();
    const scrollRef = useRef<HTMLDivElement>(null);

    const isForemanPage = pathname === '/foreman';

    useEffect(() => {
        const timer = setTimeout(() => setShowBadge(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const toggleAssistant = () => {
        setIsOpen(!isOpen);
        if (showBadge) setShowBadge(false);
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user'
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: getMockResponse(newUserMsg.text),
                sender: 'ai'
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const getMockResponse = (input: string) => {
        if (input.includes('비') || input.includes('수당')) return "비가 오면 현장 안전 수침에 따라 작업 중단 여부가 결정됩니다. 대기 수당은 소속 계약 조건에 따라 다를 수 있으니 일당 계산기에서 '우천 할증'을 확인해 보세요.";
        if (input.includes('안전') || input.includes('비계')) return "비계 작업 시에는 반드시 안전 고리를 체결하고 하부 통제 구역을 설정해야 합니다. 자세한 수칙은 '안전 체크리스트'를 확인해 주세요.";
        return "마스터님의 질문을 확인 중입니다. 현장 매뉴얼에 따르면 해당 공정은 숙련도 Level 3 이상의 지침을 권장합니다. 더 자세한 내용은 '가이드' 섹션을 추천해 드립니다.";
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
                            <span>현장 실시간 비서</span>
                        </div>
                    </div>
                    <button onClick={toggleAssistant} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.content}>
                    {!isVoiceMode ? (
                        <>
                            <div className={styles.chatHistory} ref={scrollRef}>
                                {messages.map(msg => (
                                    <div key={msg.id} className={`${styles.bubble} ${msg.sender === 'user' ? styles.userBubble : styles.aiBubble}`}>
                                        {msg.text}
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className={styles.typing}>
                                        <div className={styles.dot}></div>
                                        <div className={styles.dot}></div>
                                        <div className={styles.dot}></div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.quickActions}>
                                <Link href="/foreman" className={styles.actionItem} onClick={() => setIsOpen(false)}>
                                    <ShieldAlert size={16} color="#22c55e" />
                                    <span>안전 체크리스트</span>
                                    <ArrowRight size={14} />
                                </Link>
                                <div className={styles.inputBox}>
                                    <button 
                                        className={styles.micBtn} 
                                        onClick={() => setIsVoiceMode(true)}
                                    >
                                        <Mic size={18} />
                                    </button>
                                    <input 
                                        type="text" 
                                        placeholder="무엇이든 물어보세요..." 
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    />
                                    <button className={styles.sendBtn} onClick={handleSend}><Send size={14} /></button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className={styles.voiceModeContainer} style={{textAlign: 'center', padding: '2rem 0'}}>
                            <div className={styles.voiceMode}>
                                <div className={styles.wave}></div>
                                <div className={styles.wave}></div>
                                <div className={styles.wave}></div>
                                <div className={styles.wave}></div>
                                <div className={styles.wave}></div>
                            </div>
                            <p style={{fontSize: '0.8rem', color: '#B48A09', marginTop: '1.5rem', fontWeight: 700}}>
                                마스터님의 목소리를 듣는 중...
                            </p>
                            <button 
                                className={styles.micBtnActive} 
                                style={{marginTop: '2rem', border: 'none', background: 'none', cursor: 'pointer'}}
                                onClick={() => setIsVoiceMode(false)}
                            >
                                <Mic size={48} />
                                <p style={{fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem'}}>탭하여 중지</p>
                            </button>
                        </div>
                    )}
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
