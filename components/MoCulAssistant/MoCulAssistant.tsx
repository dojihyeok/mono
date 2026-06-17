'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
    HelpCircle, 
    X, 
    ShieldAlert, 
    Phone, 
    CheckCircle2, 
    ChevronDown, 
    ChevronUp,
    CheckSquare,
    Square,
    Info
} from 'lucide-react';
import styles from './MoCulAssistant.module.css';

interface FAQItem {
    q: string;
    a: string;
}

const FAQS: FAQItem[] = [
    {
        q: "오늘 일한 일당은 언제 들어오나요?",
        a: "출퇴근이 완료되고 시공사가 내역을 확인하면 MoNo Wallet에 지급 완료 처리됩니다. 지갑 탭에서 '출금하기' 버튼을 누르시면 등록 계좌로 즉시 자동 이체됩니다."
    },
    {
        q: "비가 오거나 날씨 때문에 작업이 중단되면 어떻게 되나요?",
        a: "현장 사정 및 강우량에 따라 대기 수당이 적용되거나 근무가 종료될 수 있습니다. 확정 사항은 실시간 앱 알림으로 제공해 드립니다."
    },
    {
        q: "출퇴근 GPS나 QR코드 인증이 안 될 때는 어떻게 하나요?",
        a: "인증이 실패하더라도 걱정하지 마세요. '근무기록' 탭 하단에서 종이 출역부 사진 등을 첨부하여 수기로 직접 추가하시면 현장 담당자 확인 후 정상 반영됩니다."
    }
];

export default function MoCulAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [showBadge, setShowBadge] = useState(false);
    const [activeTab, setActiveTab] = useState<'safety' | 'faq' | 'contact'>('safety');
    const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

    // Safety Checklist State
    const [checklist, setChecklist] = useState({
        helmet: false,
        shoes: false,
        gaiters: false,
        harness: false
    });

    const pathname = usePathname();
    const isForemanPage = pathname === '/foreman';

    useEffect(() => {
        const timer = setTimeout(() => setShowBadge(true), 2500);
        return () => clearTimeout(timer);
    }, []);

    const toggleAssistant = () => {
        setIsOpen(!isOpen);
        if (showBadge) setShowBadge(false);
    };

    const toggleCheck = (key: keyof typeof checklist) => {
        setChecklist(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const isAllChecked = Object.values(checklist).every(Boolean);

    if (isForemanPage) return null;

    return (
        <div className={`${styles.wrapper} ${isOpen ? styles.active : ''}`}>
            {/* Assistant Help Drawer Window */}
            <div className={styles.window} style={{ width: '330px' }}>
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <HelpCircle size={20} className={styles.brainIcon} />
                        <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 900 }}>현장 도움말</h4>
                            <span style={{ fontSize: '0.7rem' }}>오늘 근무 관련 가이드</span>
                        </div>
                    </div>
                    <button onClick={toggleAssistant} className={styles.closeBtn}>
                        <X size={18} />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
                    <button 
                        onClick={() => setActiveTab('safety')}
                        style={{ 
                            flex: 1, 
                            padding: '10px 0', 
                            background: 'none', 
                            border: 'none', 
                            color: activeTab === 'safety' ? '#3182f6' : 'var(--text-tertiary)', 
                            fontSize: '0.8rem', 
                            fontWeight: 'bold',
                            borderBottom: activeTab === 'safety' ? '2px solid #3182f6' : 'none',
                            cursor: 'pointer'
                        }}
                    >
                        안전체크
                    </button>
                    <button 
                        onClick={() => setActiveTab('faq')}
                        style={{ 
                            flex: 1, 
                            padding: '10px 0', 
                            background: 'none', 
                            border: 'none', 
                            color: activeTab === 'faq' ? '#3182f6' : 'var(--text-tertiary)', 
                            fontSize: '0.8rem', 
                            fontWeight: 'bold',
                            borderBottom: activeTab === 'faq' ? '2px solid #3182f6' : 'none',
                            cursor: 'pointer'
                        }}
                    >
                        자주 묻는 질문
                    </button>
                    <button 
                        onClick={() => setActiveTab('contact')}
                        style={{ 
                            flex: 1, 
                            padding: '10px 0', 
                            background: 'none', 
                            border: 'none', 
                            color: activeTab === 'contact' ? '#3182f6' : 'var(--text-tertiary)', 
                            fontSize: '0.8rem', 
                            fontWeight: 'bold',
                            borderBottom: activeTab === 'contact' ? '2px solid #3182f6' : 'none',
                            cursor: 'pointer'
                        }}
                    >
                        현장 연락처
                    </button>
                </div>

                <div className={styles.content} style={{ minHeight: '260px', maxHeight: '340px', overflowY: 'auto' }}>
                    {/* SAFETY CHECKLIST TAB */}
                    {activeTab === 'safety' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--text-primary)' }}>출근 전 필수 자가 안전 확인</strong>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div 
                                    onClick={() => toggleCheck('helmet')}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: checklist.helmet ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                                >
                                    {checklist.helmet ? <CheckSquare size={18} className="text-blue-500" /> : <Square size={18} />}
                                    <span>안전모 착용 및 턱끈 조임 확인</span>
                                </div>
                                <div 
                                    onClick={() => toggleCheck('shoes')}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: checklist.shoes ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                                >
                                    {checklist.shoes ? <CheckSquare size={18} className="text-blue-500" /> : <Square size={18} />}
                                    <span>안전화 착용 및 이상 유무 확인</span>
                                </div>
                                <div 
                                    onClick={() => toggleCheck('gaiters')}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: checklist.gaiters ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                                >
                                    {checklist.gaiters ? <CheckSquare size={18} className="text-blue-500" /> : <Square size={18} />}
                                    <span>각반 밀착 착용 확인</span>
                                </div>
                                <div 
                                    onClick={() => toggleCheck('harness')}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: checklist.harness ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                                >
                                    {checklist.harness ? <CheckSquare size={18} className="text-blue-500" /> : <Square size={18} />}
                                    <span>고소 안전벨트 체결선 상태 확인</span>
                                </div>
                            </div>

                            <div style={{ 
                                marginTop: '12px', 
                                padding: '12px', 
                                borderRadius: '12px', 
                                background: isAllChecked ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.03)',
                                border: isAllChecked ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255,255,255,0.06)',
                                transition: 'all 0.2s',
                                fontSize: '0.75rem',
                                color: isAllChecked ? '#10b981' : 'var(--text-tertiary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 'bold'
                            }}>
                                <ShieldAlert size={16} />
                                <span>
                                    {isAllChecked ? '오늘의 안전 점검 완료! 안심하고 일하세요.' : '준비물을 모두 확인하고 안전하게 근무해 주세요.'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* FAQ ACCORDION TAB */}
                    {activeTab === 'faq' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {FAQS.map((item, idx) => {
                                const isExpanded = expandedFaqIndex === idx;
                                return (
                                    <div 
                                        key={idx} 
                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}
                                    >
                                        <div 
                                            onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                                            style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center', 
                                                cursor: 'pointer', 
                                                padding: '6px 0',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                color: 'var(--text-primary)'
                                            }}
                                        >
                                            <span>{item.q}</span>
                                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </div>
                                        {isExpanded && (
                                            <p style={{ 
                                                margin: '4px 0 0 0', 
                                                fontSize: '0.75rem', 
                                                lineHeight: '1.5', 
                                                color: 'var(--text-secondary)',
                                                background: 'rgba(255,255,255,0.02)',
                                                padding: '8px',
                                                borderRadius: '8px'
                                            }}>
                                                {item.a}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* CONTACTS TAB */}
                    {activeTab === 'contact' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--text-primary)' }}>현장 관리자 긴급 번호</strong>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    padding: '10px 12px', 
                                    background: 'rgba(255,255,255,0.03)', 
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '12px' 
                                }}>
                                    <div style={{ textAlign: 'left' }}>
                                        <strong style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-primary)' }}>정대선 현장 소장</strong>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>강남건설(주) 서초 현장</span>
                                    </div>
                                    <a 
                                        href="tel:010-8843-9201" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            alert('정대선 소장님(010-8843-9201)에게 시뮬레이션 전화를 연결합니다.');
                                        }}
                                        style={{ 
                                            background: '#3182f6', 
                                            color: '#ffffff', 
                                            border: 'none', 
                                            borderRadius: '50%', 
                                            width: '28px', 
                                            height: '28px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Phone size={14} />
                                    </a>
                                </div>

                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    padding: '10px 12px', 
                                    background: 'rgba(255,255,255,0.03)', 
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '12px' 
                                }}>
                                    <div style={{ textAlign: 'left' }}>
                                        <strong style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-primary)' }}>(주)서초종합인력</strong>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>소속 인력사무소 배정 담당</span>
                                    </div>
                                    <a 
                                        href="tel:02-540-1994" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            alert('서초종합인력(02-540-1994)으로 시뮬레이션 전화를 연결합니다.');
                                        }}
                                        style={{ 
                                            background: '#3182f6', 
                                            color: '#ffffff', 
                                            border: 'none', 
                                            borderRadius: '50%', 
                                            width: '28px', 
                                            height: '28px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Phone size={14} />
                                    </a>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '6px', fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '8px', lineHeight: '1.4' }}>
                                <Info size={12} style={{ flexShrink: 0, marginTop: '1px' }} />
                                <span>비상상황 또는 날씨로 인한 출퇴근 보정 등 정당한 사유가 있을 시 소장님 혹은 인력사무소로 즉시 문의하세요.</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.footer} style={{ background: 'rgba(255,255,255,0.01)', padding: '10px 1.25rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                        출퇴근 헬프 데스크 1544-9980
                    </div>
                </div>
            </div>

            {/* Floating Toggle Button */}
            <button 
                onClick={toggleAssistant} 
                className={`${styles.toggleBtn} ${showBadge ? styles.hasBadge : ''}`}
                aria-label="MoNo Site Assistant"
                style={{ borderColor: 'rgba(212, 175, 55, 0.4)', color: '#D4AF37' }}
            >
                <div className={styles.glow} style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)' }} />
                <HelpCircle size={28} className={styles.mainIcon} style={{ filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.5))' }} />
                <div className={styles.scanningLine} style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />
                {showBadge && <div className={styles.badge}>1</div>}
            </button>
        </div>
    );
}
