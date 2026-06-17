'use client';

import React, { useState } from 'react';
import { useDemo } from '@/context/DemoContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, 
    MapPin, 
    Wrench, 
    FileText, 
    Wallet, 
    CheckCircle2, 
    ArrowLeft, 
    ArrowRight,
    ShieldCheck
} from 'lucide-react';
import styles from './Onboarding.module.css';

const STEPS = [
    { id: 1, name: '기본 정보', icon: User },
    { id: 2, name: '희망 지역', icon: MapPin },
    { id: 3, name: '직종/경력', icon: Wrench },
    { id: 4, name: '서류/안전', icon: FileText },
    { id: 5, name: '받을 계좌', icon: Wallet },
    { id: 6, name: '완료', icon: CheckCircle2 }
];

export default function Onboarding() {
    const { state, updateProfile, setDemoStage } = useDemo();
    const [step, setStep] = useState(1);

    // Form states
    const [name, setName] = useState(state.profile.name || '정무길');
    const [phone, setPhone] = useState(state.profile.phone || '010-1234-5678');
    const [birth, setBirth] = useState(state.profile.birth || '1978-08-15');
    
    const [region, setRegion] = useState(state.profile.regions[0] || '서울시 구로구 (수도권 전역 가능)');
    
    const [job, setJob] = useState(state.profile.jobs[0] || '뼈대 튼튼 형틀목수');
    const [exp, setExp] = useState(state.profile.experience || '5년 ~ 10년 (베테랑)');
    
    const [safety, setSafety] = useState(state.profile.safetyComplete);
    const [license, setLicense] = useState(true);
    
    const [bank, setBank] = useState(state.profile.bankName || '신한은행');
    const [account, setAccount] = useState(state.profile.accountNumber || '110-123-456789');
    const [alarmConsent, setAlarmConsent] = useState(true);

    const handleNext = () => {
        if (step < 6) {
            // Save step data to profile
            if (step === 1) {
                updateProfile({ name, phone, birth });
            } else if (step === 2) {
                updateProfile({ regions: [region] });
            } else if (step === 3) {
                updateProfile({ jobs: [job], experience: exp });
            } else if (step === 4) {
                updateProfile({ safetyComplete: safety });
            } else if (step === 5) {
                updateProfile({ bankName: bank, accountNumber: account });
            }
            setStep(prev => prev + 1);
        } else {
            // Onboarding Complete
            updateProfile({ profileComplete: true });
            setDemoStage('INIT');
        }
    };

    const handlePrev = () => {
        if (step > 1) {
            setStep(prev => prev - 1);
        }
    };

    const progressPercent = Math.min((step / 6) * 100, 100);

    return (
        <div className={styles.onboardWrap}>
            <div className={styles.topProgress}>
                <div className={styles.progressHeader}>
                    <span className={styles.badge}>MoNo Wallet & 기술카드 발급</span>
                    <span className={styles.stepIndicator}>{step} / 6 단계</span>
                </div>
                <div className={styles.progressBarBg}>
                    <div 
                        className={styles.progressBarFill} 
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            <div className={styles.formContainer}>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={styles.stepBody}
                        >
                            <h2>반가워요! <br /><span>인적 정보</span>를 입력해 주세요.</h2>
                            <p className={styles.description}>종이 이력서와 출근부 대신, 실명 기반의 든든한 업무 데이터 주머니를 만들어 드립니다.</p>
                            
                            <div className={styles.fieldGroup}>
                                <div className={styles.inputWrap}>
                                    <label>이름 (실명)</label>
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={e => setName(e.target.value)}
                                        placeholder="실명을 입력하세요"
                                    />
                                </div>
                                <div className={styles.inputWrap}>
                                    <label>휴대폰 번호</label>
                                    <input 
                                        type="text" 
                                        value={phone} 
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder="010-0000-0000"
                                    />
                                </div>
                                <div className={styles.inputWrap}>
                                    <label>생년월일</label>
                                    <input 
                                        type="date" 
                                        value={birth} 
                                        onChange={e => setBirth(e.target.value)}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={styles.stepBody}
                        >
                            <h2>주로 <span>어느 지역</span>에서<br />일하고 싶으세요?</h2>
                            <p className={styles.description}>이동 가능한 범위를 알려주시면 희망하시는 반경 내의 알맞은 현장을 추천해 드려요.</p>

                            <div className={styles.fieldGroup}>
                                <div className={styles.inputWrap}>
                                    <label>희망 근무 지역</label>
                                    <input 
                                        type="text" 
                                        value={region} 
                                        onChange={e => setRegion(e.target.value)}
                                        placeholder="예: 서울시 구로구 (수도권 전역 가능)"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div 
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={styles.stepBody}
                        >
                            <h2>현장에서 하시는<br /><span>대표 기술 직종</span>은 무엇인가요?</h2>
                            <p className={styles.description}>반장님의 핵심 전문 직종과 지금까지 쌓인 소중한 연차를 바탕으로 평판을 쌓아갑니다.</p>

                            <div className={styles.fieldGroup}>
                                <div className={styles.inputWrap}>
                                    <label>나의 주 기술 직종</label>
                                    <select value={job} onChange={e => setJob(e.target.value)}>
                                        <option value="뼈대 튼튼 형틀목수">뼈대 튼튼 형틀목수</option>
                                        <option value="튼튼한 구조 철근기술자">튼튼한 구조 철근기술자</option>
                                        <option value="높은 곳도 안전한 비계전문가">높은 곳도 안전한 비계전문가</option>
                                        <option value="꼼꼼하고 정교한 타일공">꼼꼼하고 정교한 타일공</option>
                                        <option value="탄탄한 벽 조적마스터">탄탄한 벽 조적마스터</option>
                                    </select>
                                </div>
                                <div className={styles.inputWrap}>
                                    <label>경력 연차</label>
                                    <select value={exp} onChange={e => setExp(e.target.value)}>
                                        <option value="2년 ~ 5년 (성장기)">2년 ~ 5년 (성장기)</option>
                                        <option value="5년 ~ 10년 (베테랑)">5년 ~ 10년 (베테랑)</option>
                                        <option value="10년 이상 (장인)">10년 이상 (장인)</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div 
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={styles.stepBody}
                        >
                            <h2>현장 출입에 필요한<br /><span>필수 서류</span>들을 연결할까요?</h2>
                            <p className={styles.description}>필요 서류를 미리 등록하면, 일자리 매칭 및 현장 출입 등록 절차가 3초 만에 끝납니다.</p>

                            <div className={styles.checkCardList}>
                                <label className={`${styles.checkCard} ${safety ? styles.checked : ''}`}>
                                    <div className={styles.checkCardContent}>
                                        <ShieldCheck size={20} className={styles.cardIcon} />
                                        <div>
                                            <strong>기초안전 보건 교육 이수증</strong>
                                            <span>안전보건공단 공식 확인증 연동</span>
                                        </div>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={safety} 
                                        onChange={e => setSafety(e.target.checked)} 
                                    />
                                </label>

                                <label className={`${styles.checkCard} ${license ? styles.checked : ''}`}>
                                    <div className={styles.checkCardContent}>
                                        <FileText size={20} className={styles.cardIcon} />
                                        <div>
                                            <strong>국가 기술 자격증 내역</strong>
                                            <span>한국산업인력공단 자격증 조회 연동</span>
                                        </div>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={license} 
                                        onChange={e => setLicense(e.target.checked)} 
                                    />
                                </label>
                            </div>
                        </motion.div>
                    )}

                    {step === 5 && (
                        <motion.div 
                            key="step5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={styles.stepBody}
                        >
                            <h2>일하고 안전하게 받을<br /><span>정산 계좌</span>를 알려주세요.</h2>
                            <p className={styles.description}>정당하게 땀 흘려 일한 일급이 다른 곳으로 새지 않고, 본인 명의 계좌로 안심 송금됩니다.</p>

                            <div className={styles.fieldGroup}>
                                <div className={styles.inputWrap}>
                                    <label>지급 은행</label>
                                    <select value={bank} onChange={e => setBank(e.target.value)}>
                                        <option value="신한은행">신한은행</option>
                                        <option value="하나은행">하나은행</option>
                                        <option value="KB국민은행">KB국민은행</option>
                                        <option value="우리은행">우리은행</option>
                                        <option value="NH농협은행">NH농협은행</option>
                                    </select>
                                </div>
                                <div className={styles.inputWrap}>
                                    <label>계좌번호</label>
                                    <input 
                                        type="text" 
                                        value={account} 
                                        onChange={e => setAccount(e.target.value)}
                                        placeholder="하이픈(-) 없이 입력해 주세요"
                                    />
                                </div>

                                <label className={styles.rowConsent}>
                                    <input 
                                        type="checkbox" 
                                        checked={alarmConsent} 
                                        onChange={e => setAlarmConsent(e.target.checked)} 
                                    />
                                    <span>일당이 안전하게 에스크로 계좌에 입금되면 실시간으로 카톡 알림을 받겠습니다.</span>
                                </label>
                            </div>
                        </motion.div>
                    )}

                    {step === 6 && (
                        <motion.div 
                            key="step6"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={styles.stepBodyCentred}
                        >
                            <div className={styles.successBadge}>
                                <CheckCircle2 size={48} className={styles.bounceIcon} />
                            </div>
                            <h2>내 기술카드가<br />멋지게 생성되었어요!</h2>
                            <p className={styles.description}>
                                축하드립니다, <strong>{name}</strong> 반장님!<br />
                                이제 안전 교육 보증서와 정산 계좌가 연동되어 첫 일자리를 매칭받을 준비가 끝났습니다.
                            </p>

                            <div className={styles.cardPreview}>
                                <div className={styles.previewLogo}>MoNo Card</div>
                                <div className={styles.previewName}>{name}</div>
                                <div className={styles.previewJob}>{job}</div>
                                <div className={styles.previewStatus}>● 발급 완료</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className={styles.navBar}>
                <button 
                    onClick={handlePrev} 
                    className={styles.backBtn}
                    style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
                >
                    <ArrowLeft size={16} /> 이전
                </button>

                <button onClick={handleNext} className={styles.nextBtn}>
                    {step === 5 ? '기술카드 발급하기' : step === 6 ? '안심 지갑 시작하기' : '다음'} 
                    <ArrowRight size={16} style={{ marginLeft: '6px' }} />
                </button>
            </div>
        </div>
    );
}
