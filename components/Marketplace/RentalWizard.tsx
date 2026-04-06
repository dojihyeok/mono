'use client';

import { useState } from 'react';
import styles from './RentalWizard.module.css';
import { Calendar, Truck, CreditCard, ChevronRight, CheckCircle, X, ShieldCheck } from 'lucide-react';
import GlassCard from '@/components/UI/GlassCard';

interface Equipment {
    id: string;
    name: string;
    rate: string;
    brand: string;
}

export default function RentalWizard({ equipment, onClose }: { equipment: Equipment, onClose: () => void }) {
    const [step, setStep] = useState(1);
    const [duration, setDuration] = useState('3일');
    const [logistics, setLogistics] = useState('배송 요청');

    const nextStep = () => setStep(prev => prev + 1);

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <header className={styles.header}>
                    <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                    <div className={styles.stepper}>
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`${styles.stepDot} ${step >= s ? styles.active : ''}`} />
                        ))}
                    </div>
                </header>

                <main className={styles.content}>
                    {step === 1 && (
                        <div className={styles.stepContent}>
                            <div className={styles.iconCircle}><Calendar size={32} color="#B48A09" /></div>
                            <h2>언제, 얼마나 빌릴까요?</h2>
                            <p className={styles.desc}>{equipment.name}을(를) 대여합니다.</p>
                            
                            <div className={styles.optionList}>
                                {['1일 (단기)', '3일 (패키지)', '7일 (할인)', '한달 (장기)'].map(opt => (
                                    <button 
                                        key={opt}
                                        className={`${styles.optionBtn} ${duration === opt ? styles.selected : ''}`}
                                        onClick={() => setDuration(opt)}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className={styles.stepContent}>
                            <div className={styles.iconCircle}><Truck size={32} color="#B48A09" /></div>
                            <h2>어디로 보낼까요?</h2>
                            <p className={styles.desc}>장비 운송 및 물류 옵션을 선택하세요.</p>
                            
                            <div className={styles.optionList}>
                                {['현장으로 직접 배송 (모노 상사)', '가까운 센터에서 직접 수령', '사용하던 현장에서 바로 인수'].map(opt => (
                                    <button 
                                        key={opt}
                                        className={`${styles.optionBtn} ${logistics === opt ? styles.selected : ''}`}
                                        onClick={() => setLogistics(opt)}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className={styles.stepContent}>
                            <div className={styles.iconCircle}><CreditCard size={32} color="#B48A09" /></div>
                            <h2>결제 및 예약 확정</h2>
                            <p className={styles.desc}>모노 에스크로(Escrow) 시스템으로 안전하게 보호됩니다.</p>
                            
                            <GlassCard className={styles.summaryCard}>
                                <div className={styles.summaryRow}>
                                    <span>대여 장비</span>
                                    <strong>{equipment.name}</strong>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>대여 기간</span>
                                    <strong>{duration}</strong>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>물류 옵션</span>
                                    <strong>{logistics}</strong>
                                </div>
                                <div className={styles.totalRow}>
                                    <span>총 결제 예정 금액</span>
                                    <h3 className={styles.totalPrice}>{equipment.rate}</h3>
                                </div>
                            </GlassCard>

                            <div className={styles.guarantee}>
                                <ShieldCheck size={14} color="#10B981" />
                                <span>장비 고장이나 현장 노쇼 시 100% 모노가 보상해 드립니다.</span>
                            </div>
                        </div>
                    )}
                </main>

                <footer className={styles.footer}>
                    {step < 3 ? (
                        <button className={styles.primaryBtn} onClick={nextStep}>
                            다음 단계로 <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button className={styles.finalBtn} onClick={onClose}>
                            <CheckCircle size={18} /> 예약 완료 및 결제하기
                        </button>
                    )}
                </footer>
            </div>
        </div>
    );
}
