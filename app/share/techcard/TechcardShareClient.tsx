'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, 
    FileText, 
    Calendar, 
    Clock, 
    Phone, 
    Lock, 
    CheckCircle2, 
    UserCheck, 
    LockKeyhole,
    X,
    Bell
} from 'lucide-react';
import styles from './page.module.css';

export default function TechcardShareClient() {
    const searchParams = useSearchParams();
    const rawName = searchParams ? searchParams.get('name') : '';
    const name = rawName || '정무길';
    
    // Mask name for public view
    const maskedName = name.length > 2 
        ? `${name[0]}*${name[name.length - 1]}`
        : `${name[0]}*`;

    const [requestStage, setRequestStage] = useState<'IDLE' | 'REQUESTED' | 'USER_PROMPT' | 'APPROVED'>('IDLE');
    const [companyName, setCompanyName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState({
        phone: true,
        license: false,
        amount: false
    });

    const handleRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyName) return;
        setRequestStage('REQUESTED');

        // Simulate user receiving push notification and approving after 3 seconds
        setTimeout(() => {
            setRequestStage('USER_PROMPT');
        }, 2000);
    };

    const handleUserApprove = () => {
        setRequestStage('APPROVED');
    };

    return (
        <div className={styles.shareWrap}>
            <div className={styles.shareContainer}>
                {/* Official Passport Badge Header */}
                <header className={styles.shareHeader}>
                    <div className={styles.badgeRow}>
                        <div className={styles.monoLogo}>MoNo</div>
                        <span className={styles.verifBadge}>
                            <ShieldCheck size={12} style={{ marginRight: '3px' }} />
                            경력 공식 증명서
                        </span>
                    </div>
                    <p className={styles.serial}>ID: MN-4023-8874-1984 (유효기간: 24시간)</p>
                </header>

                {/* Profile Card Summary */}
                <section className={styles.profileSection}>
                    <div className={styles.avatarLarge}>
                        {name.substring(1, 3)}
                    </div>
                    <div className={styles.profileMeta}>
                        <h2>{maskedName} 반장님</h2>
                        <span className={styles.roleTag}>뼈대 튼튼 형틀목수 • 베테랑</span>
                        <p className={styles.loc}>📍 희망 지역: 수도권 전역 (구로 거주)</p>
                    </div>
                </section>

                {/* Verification Metrics (No Sensitive details) */}
                <section className={styles.metricsSection}>
                    <div className={styles.metricCard}>
                        <span>누적 근무일</span>
                        <strong>142일</strong>
                    </div>
                    <div className={styles.metricCard}>
                        <span>참여 현장 수</span>
                        <strong>18개 현장</strong>
                    </div>
                    <div className={styles.metricCard}>
                        <span>안전 확인 성적</span>
                        <strong className="text-emerald-500">100점</strong>
                    </div>
                    <div className={styles.metricCard}>
                        <span>회사 인증 비율</span>
                        <strong className="text-blue-500">100%</strong>
                    </div>
                </section>

                {/* Timeline Records */}
                <section className={styles.timelineSection}>
                    <h3>최근 근무 이력 (시공사 확인 완료)</h3>
                    
                    <div className={styles.timeline}>
                        <div className={styles.timeItem}>
                            <div className={styles.timeDot}></div>
                            <div className={styles.timeContent}>
                                <span className={styles.timeDate}>2026.06.15 - 2026.06.17</span>
                                <h4>서초 반포 써밋팰리스 복합 신축현장</h4>
                                <p>대우건설 • 형틀목수 3일 • 안전 확인 통과</p>
                            </div>
                        </div>
                        <div className={styles.timeItem}>
                            <div className={styles.timeDot}></div>
                            <div className={styles.timeContent}>
                                <span className={styles.timeDate}>2026.06.01 - 2026.06.10</span>
                                <h4>잠실 하이퍼타워 지지대 보강작업</h4>
                                <p>롯데건설 • 형틀목수 10일 • 안전 확인 통과</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Private details requesting card */}
                <section className={styles.requestSection}>
                    <AnimatePresence mode="wait">
                        {requestStage === 'IDLE' && (
                            <motion.div 
                                key="idle" 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={styles.requestBox}
                            >
                                <LockKeyhole size={28} className={styles.lockIcon} />
                                <h3>연락처 및 상세 서류 확인하기</h3>
                                <p>기술자님의 연락처 및 계좌 정보, 안전교육이수증 등 민감 정보는 개인정보 보호를 위해 비공개 처리되어 있습니다. 본인 승인을 통해 열람할 수 있습니다.</p>
                                
                                <form onSubmit={handleRequest} className={styles.requestForm}>
                                    <input 
                                        type="text" 
                                        placeholder="기업명 혹은 소속 현장을 입력해 주세요" 
                                        required 
                                        value={companyName}
                                        onChange={e => setCompanyName(e.target.value)}
                                        className={styles.compInput}
                                    />
                                    <button type="submit" className={styles.requestBtn}>
                                        상세 정보 열람 요청
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {requestStage === 'REQUESTED' && (
                            <motion.div 
                                key="requested" 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={styles.requestBoxPending}
                            >
                                <div className={styles.spinner}></div>
                                <h3>상세 정보 열람 요청을 전송했습니다</h3>
                                <p>근로자님의 스마트폰으로 상세 정보 제공 동의 알림이 전송되었습니다. 승인할 때까지 잠시 기다려 주세요...</p>
                                <div className={styles.targetComp}>요청 대상 기업: <strong>{companyName}</strong></div>
                            </motion.div>
                        )}

                        {requestStage === 'USER_PROMPT' && (
                            <motion.div 
                                key="prompt" 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={styles.userPromptBox}
                            >
                                <div className={styles.promptHeader}>
                                    <Bell size={20} className="text-amber-500 animate-bounce" />
                                    <span>[근로자 화면 시뮬레이션]</span>
                                </div>
                                <h3>이 회사가 내 자세한 기록을 보고 싶어해요</h3>
                                <p className={styles.promptDesc}>
                                    <strong>{companyName}</strong>에서 반장님의 전화번호와 서류 확인을 요청했습니다. 보여줄 정보만 직접 선택하여 승인해 주세요.
                                </p>

                                <div className={styles.checkOptions}>
                                    <label className={styles.optionLabel}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedPermissions.phone} 
                                            onChange={e => setSelectedPermissions(prev => ({ ...prev, phone: e.target.checked }))}
                                        />
                                        <span>전화번호 및 연락망 제공</span>
                                    </label>
                                    <label className={styles.optionLabel}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedPermissions.license} 
                                            onChange={e => setSelectedPermissions(prev => ({ ...prev, license: e.target.checked }))}
                                        />
                                        <span>기초안전보건교육 이수증 사본 제공</span>
                                    </label>
                                </div>

                                <button onClick={handleUserApprove} className={styles.approveBtn}>
                                    선택한 정보 공개 승인하기
                                </button>
                            </motion.div>
                        )}

                        {requestStage === 'APPROVED' && (
                            <motion.div 
                                key="approved" 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={styles.approvedBox}
                            >
                                <div className={styles.approvedHeader}>
                                    <UserCheck size={24} color="#10b981" />
                                    <h3>상세 정보가 잠금 해제되었습니다</h3>
                                </div>
                                <p className={styles.descSuccess}>기술자 정무길 반장님과의 매칭을 위한 상세 연락 정보 및 증빙 서류입니다.</p>

                                <div className={styles.unlockedData}>
                                    {selectedPermissions.phone && (
                                        <div className={styles.dataRow}>
                                            <span><Phone size={14} /> 전화번호</span>
                                            <strong>{state.profile.phone}</strong>
                                        </div>
                                    )}
                                    <div className={styles.dataRow}>
                                        <span>지급 희망 계좌</span>
                                        <strong>{state.profile.bankName} (실명확인 완료)</strong>
                                    </div>
                                    {selectedPermissions.license && (
                                        <div className={styles.dataRow}>
                                            <span>기초안전보건교육이수증</span>
                                            <strong className="text-emerald-500">인증 완료 (제2022-**-****호)</strong>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.logNotice}>
                                    열람 로그 기록됨: {companyName} • IP 121.168.**.** • 2026.06.17
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </div>
        </div>
    );
}
