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

let messageCounter = 0;
function generateMsgId(): string {
    messageCounter += 1;
    return `msg-${messageCounter}`;
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
            id: generateMsgId(),
            text: inputValue,
            sender: 'user'
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            const aiResponse: Message = {
                id: generateMsgId(),
                text: getMockResponse(newUserMsg.text),
                sender: 'ai'
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const getMockResponse = (input: string) => {
        const lower = input.toLowerCase();
        if (lower.includes('hello') || lower.includes('hi') || lower.includes('help')) {
            return "Hello! I am MoCall AI, your real-time translation and safety companion. How can I assist you on the site today? (안녕하세요! 실시간 통역 및 안전 비서 MoCall AI입니다. 오늘 현장에서 어떤 도움이 필요하신가요?)";
        }
        if (lower.includes('안전') || lower.includes('safety') || lower.includes('harness')) {
            return "Safety First! [EN] Please ensure your safety harness is securely fastened to the life line. [KO] 비계 작업 및 고소 작업 시에는 구명줄에 안전 고리를 반드시 체결해 주십시오.";
        }
        if (lower.includes('비') || lower.includes('rain') || lower.includes('weather')) {
            return "Weather Alert: Rain detected. [EN] Under heavy rain, site operations may pause. Please check safety instructions. [KO] 강우 시 현장 안전 수칙에 따라 야외 작업이 중단될 수 있습니다. 대시보드의 실시간 대기 정보를 조회하십시오.";
        }
        return "Checking real-time site manuals... [EN] Your query has been logged. We recommend reviewing the K-Tech Safety Standard guide for your specialty. [KO] 질문이 접수되었습니다. 전문가님의 공종에 적합한 글로벌 기술 안전 가이드북을 추천해 드립니다.";
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
                            <h4>AI 현장 반장 (MoCall)</h4>
                            <span>실시간 다국어 안전 비서</span>
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
                            <p style={{fontSize: '0.8rem', color: '#D4AF37', marginTop: '1.5rem', fontWeight: 700}}>
                                전문가님의 목소리를 듣는 중...
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
                aria-label="MoCall Assistant"
            >
                <div className={styles.glow} />
                <BrainCircuit size={28} className={styles.mainIcon} />
                <div className={styles.scanningLine} />
                {showBadge && <div className={styles.badge}>1</div>}
            </button>
        </div>
    );
}
