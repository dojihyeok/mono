'use client';

import React, { useState, useEffect } from 'react';
import { useDemo } from '@/context/DemoContext';
import { useUI } from '@/context/UIContext';
import { 
    User, 
    Phone, 
    Calendar, 
    MapPin, 
    Briefcase, 
    Award, 
    ShieldCheck, 
    CreditCard, 
    FileText, 
    Fingerprint, 
    Lock, 
    Camera, 
    Plus, 
    X, 
    Check, 
    AlertCircle,
    Eye,
    ChevronRight,
    RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './myinfo.module.css';

interface DocumentItem {
    id: string;
    name: string;
    type: string;
    status: '직접 등록' | '회사 확인' | '공식 확인 준비중' | '확인 완료';
    issueDate: string;
    issuer: string;
    sensitive: boolean;
}

const INITIAL_DOCS: DocumentItem[] = [
    { id: 'doc-id', name: '신분증', type: '주민등록증', status: '확인 완료', issueDate: '2016.05.12', issuer: '서울특별시 구로구청장', sensitive: true },
    { id: 'doc-safety', name: '기초안전보건교육이수증', type: '이수증 (안전보건공단)', status: '확인 완료', issueDate: '2018.02.20', issuer: '한국산업안전보건공단', sensitive: false },
    { id: 'doc-license', name: '형틀목수 기능사 자격증', type: '국가기술자격증', status: '공식 확인 준비중', issueDate: '2020.10.15', issuer: '한국산업인력공단', sensitive: false },
    { id: 'doc-contract', name: '표준근로계약서 (서초 반포)', type: '전자근로계약서', status: '확인 완료', issueDate: '2026.06.17', issuer: '강남건설(주)', sensitive: false },
    { id: 'doc-bank', name: '통장 사본', type: '계좌 확인 증명서', status: '확인 완료', issueDate: '2024.11.05', issuer: '신한은행', sensitive: true }
];

export default function MyInfoClient() {
    const { state, updateProfile, resetDemo } = useDemo();
    const { addToast } = useUI();

    // Profile Edit State
    const [showEditSheet, setShowEditSheet] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        bankName: '',
        accountNumber: '',
        experience: '',
        regions: '',
        jobs: ''
    });

    // Document Management State
    const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCS);
    const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [enteredPin, setEnteredPin] = useState('');
    const [showDocViewModal, setShowDocViewModal] = useState(false);
    const [showCameraScanner, setShowCameraScanner] = useState(false);
    const [scanningStep, setScanningStep] = useState<'idle' | 'scanning' | 'success'>('idle');
    const [newDocName, setNewDocName] = useState('');

    useEffect(() => {
        if (state.profile) {
            setEditForm({
                name: state.profile.name,
                phone: state.profile.phone,
                bankName: state.profile.bankName,
                accountNumber: state.profile.accountNumber,
                experience: state.profile.experience,
                regions: state.profile.regions[0] || '',
                jobs: state.profile.jobs[0] || ''
            });
        }
    }, [state.profile, showEditSheet]);

    // Handle Document Click
    const handleDocClick = (doc: DocumentItem) => {
        if (doc.sensitive) {
            setSelectedDoc(doc);
            setShowAuthModal(true);
            setEnteredPin('');
        } else {
            setSelectedDoc(doc);
            setShowDocViewModal(true);
        }
    };

    // Simulated Biometric Auth or Bypass (For quick pitch flow)
    const handleBiometricBypass = () => {
        addToast('🔐 생체 인식(Face ID) 인증에 성공하였습니다.', 'success');
        setShowAuthModal(false);
        setShowDocViewModal(true);
    };

    // Passcode Numeric Keypad click
    const handleKeypadClick = (num: string) => {
        if (enteredPin.length < 4) {
            const nextPin = enteredPin + num;
            setEnteredPin(nextPin);
            
            if (nextPin.length === 4) {
                // Instantly authenticates successfully
                setTimeout(() => {
                    addToast('🔐 간편비밀번호가 정상 확인되었습니다.', 'success');
                    setShowAuthModal(false);
                    setShowDocViewModal(true);
                }, 400);
            }
        }
    };

    const handleKeypadDelete = () => {
        setEnteredPin(prev => prev.slice(0, -1));
    };

    // Profile Edit submit
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile({
            name: editForm.name,
            phone: editForm.phone,
            bankName: editForm.bankName,
            accountNumber: editForm.accountNumber,
            experience: editForm.experience,
            regions: [editForm.regions],
            jobs: [editForm.jobs]
        });
        setShowEditSheet(false);
        addToast('👤 회원 프로필 및 계좌 정보가 수정되었습니다.', 'success');
    };

    // Camera Scan Action
    const triggerCameraScan = (docName: string) => {
        setNewDocName(docName);
        setShowCameraScanner(true);
        setScanningStep('idle');
    };

    const capturePhoto = () => {
        setScanningStep('scanning');
        setTimeout(() => {
            setScanningStep('success');
            setTimeout(() => {
                const newDoc: DocumentItem = {
                    id: `doc-custom-${Date.now()}`,
                    name: newDocName || '추가 안전 서류',
                    type: '카메라 스캔 파일',
                    status: '직접 등록',
                    issueDate: new Date().toLocaleDateString('ko-KR').replace(/ /g, ''),
                    issuer: '본인 직접 등록',
                    sensitive: false
                };
                setDocuments(prev => [...prev, newDoc]);
                setShowCameraScanner(false);
                addToast(`📸 '${newDoc.name}'가 안전 서류함에 업로드되었습니다.`, 'success');
            }, 1000);
        }, 1500);
    };

    const resetAllDemoData = () => {
        resetDemo();
        setDocuments(INITIAL_DOCS);
        addToast('🔄 데모 시나리오 상태가 초기 온보딩 단계로 리셋되었습니다.', 'info');
    };

    return (
        <div className={styles.myInfoWrap}>
            {/* Header */}
            <header className={styles.header}>
                <h1>내 정보</h1>
                <button className={styles.resetBtn} onClick={resetAllDemoData}>
                    <RotateCcw size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    상태 리셋
                </button>
            </header>

            {/* Profile Overview Card */}
            <section className={styles.profileCard}>
                <div className={styles.cardGlow} />
                <div className={styles.avatar}>
                    {state.profile.name[0]}
                </div>
                <div className={styles.profileDetails}>
                    <h2>{state.profile.name}</h2>
                    <span>{state.profile.jobs[0] || '형틀목수'} • {state.profile.experience}</span>
                </div>
                <button className={styles.editBtn} onClick={() => setShowEditSheet(true)}>
                    <User size={14} /> 수정
                </button>
            </section>

            {/* Workplace Configurations */}
            <section className={styles.infoSection}>
                <div className={styles.sectionHeader}>
                    <h3>
                        <MapPin size={16} className="text-blue-500" />
                        희망 근무 및 계좌 설정
                    </h3>
                </div>
                <div className={styles.infoGrid}>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>출퇴근 희망 지역</span>
                        <strong className={styles.infoValue}>{state.profile.regions[0] || '등록 없음'}</strong>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>대표 직종 필터</span>
                        <strong className={styles.infoValue}>{state.profile.jobs[0] || '등록 없음'}</strong>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>이력 수준</span>
                        <strong className={styles.infoValue}>{state.profile.experience}</strong>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>내 등록 계좌 (지급용)</span>
                        <strong className={styles.infoValue}>
                            {state.profile.bankName} {state.profile.accountNumber}
                        </strong>
                    </div>
                </div>
            </section>

            {/* Document Safe Section */}
            <section className={styles.infoSection}>
                <div className={styles.sectionHeader}>
                    <h3>
                        <ShieldCheck size={16} className="text-emerald-500" />
                        내 서류함
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#8e8e93' }}>민감서류 잠금 활성화</span>
                </div>
                <div className={styles.docGrid}>
                    {documents.map(doc => (
                        <div 
                            key={doc.id} 
                            className={styles.docCard}
                            onClick={() => handleDocClick(doc)}
                        >
                            <div className={styles.docIcon}>
                                <FileText size={20} />
                            </div>
                            <div className={styles.docMeta}>
                                <strong>
                                    {doc.name}
                                    {doc.sensitive && <Lock size={12} style={{ marginLeft: '4px', color: '#ff453a', display: 'inline' }} />}
                                </strong>
                                <span>{doc.type}</span>
                            </div>
                            <span className={`${styles.docStatusBadge} ${
                                doc.status === '확인 완료' ? styles.statusCompleted :
                                doc.status === '공식 확인 준비중' ? styles.statusPreparing : styles.statusManual
                            }`}>
                                {doc.status}
                            </span>
                        </div>
                    ))}
                </div>

                <button 
                    className={styles.addDocBtn}
                    onClick={() => triggerCameraScan('추가 안전교육이수증')}
                >
                    <Plus size={16} /> 새로운 안전 서류 추가하기
                </button>
            </section>

            {/* AI Advisor Badge */}
            <aside style={{ margin: '1.5rem', background: 'rgba(255, 159, 10, 0.05)', border: '1px solid rgba(255, 159, 10, 0.2)', padding: '16px', borderRadius: '20px', display: 'flex', gap: '12px' }}>
                <AlertCircle size={20} className="text-amber-500 flex-shrink-0" />
                <div style={{ fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                    <strong>안전보건교육이수증이 등록되어 있어야 현장 일자리 매칭 및 확정이 원활하게 진행됩니다.</strong>
                </div>
            </aside>

            {/* Edit Profile Bottom Sheet */}
            <AnimatePresence>
                {showEditSheet && (
                    <div className={styles.overlay} onClick={() => setShowEditSheet(false)}>
                        <motion.div 
                            className={styles.sheet}
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={styles.sheetHandle}></div>
                            <div className={styles.sheetHeader}>
                                <h3>내 프로필 설정 수정</h3>
                                <button className={styles.closeBtn} onClick={() => setShowEditSheet(false)}><X size={16} /></button>
                            </div>

                            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div className={styles.formGroup}>
                                    <label>이름</label>
                                    <input 
                                        type="text" 
                                        className={styles.formInput}
                                        value={editForm.name}
                                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>휴대폰 번호</label>
                                    <input 
                                        type="text" 
                                        className={styles.formInput}
                                        value={editForm.phone}
                                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>출퇴근 희망 지역</label>
                                    <input 
                                        type="text" 
                                        className={styles.formInput}
                                        value={editForm.regions}
                                        onChange={e => setEditForm({ ...editForm, regions: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>대표 직종 필터</label>
                                    <select 
                                        className={styles.formSelect}
                                        value={editForm.jobs}
                                        onChange={e => setEditForm({ ...editForm, jobs: e.target.value })}
                                    >
                                        <option value="뼈대 튼튼 형틀목수">형틀목수</option>
                                        <option value="한 치 오차 없는 배관기술자">배관공</option>
                                        <option value="철근 조립 전문가">철근공</option>
                                        <option value="일당백 비계 설치사">비계공</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>이력 수준 (경력 연차)</label>
                                    <select 
                                        className={styles.formSelect}
                                        value={editForm.experience}
                                        onChange={e => setEditForm({ ...editForm, experience: e.target.value })}
                                    >
                                        <option value="2년 ~ 5년 (숙련공)">2년 ~ 5년 (숙련공)</option>
                                        <option value="5년 ~ 10년 (베테랑)">5년 ~ 10년 (베테랑)</option>
                                        <option value="10년 이상 (장인)">10년 이상 (장인)</option>
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '8px' }}>
                                    <div className={styles.formGroup}>
                                        <label>은행</label>
                                        <input 
                                            type="text" 
                                            className={styles.formInput}
                                            value={editForm.bankName}
                                            onChange={e => setEditForm({ ...editForm, bankName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>계좌번호</label>
                                        <input 
                                            type="text" 
                                            className={styles.formInput}
                                            value={editForm.accountNumber}
                                            onChange={e => setEditForm({ ...editForm, accountNumber: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className={styles.submitBtn}>
                                    수정사항 완료하기
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Sensitive Doc Biometric Passcode Modal */}
            <AnimatePresence>
                {showAuthModal && (
                    <div className={styles.overlay} onClick={() => setShowAuthModal(false)}>
                        <motion.div 
                            className={styles.sheet}
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={styles.sheetHandle}></div>
                            <div className={styles.sheetHeader}>
                                <h3>본인 안전 인증</h3>
                                <button className={styles.closeBtn} onClick={() => setShowAuthModal(false)}><X size={16} /></button>
                            </div>

                            <div className={styles.authContainer}>
                                <div className={styles.authIconWrapper} onClick={handleBiometricBypass} style={{ cursor: 'pointer' }}>
                                    <div className={styles.pulse} />
                                    <Fingerprint size={36} />
                                </div>
                                <span className={styles.authTitle}>생체인식 또는 비밀번호</span>
                                <p className={styles.authDesc}>
                                    민감 정보를 포함한 서류 조회 보안상<br />
                                    지문/Face ID를 찍거나 간편 비밀번호 4자리를 입력하세요.
                                </p>

                                {/* Passcode Dots */}
                                <div className={styles.pinContainer}>
                                    {[0, 1, 2, 3].map(i => (
                                        <div 
                                            key={i} 
                                            className={`${styles.pinDot} ${enteredPin.length > i ? styles.pinFilled || styles.filled : ''}`} 
                                        />
                                    ))}
                                </div>

                                {/* Custom Keypad */}
                                <div className={styles.keypad}>
                                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                                        <button 
                                            key={num} 
                                            className={styles.keypadBtn}
                                            onClick={() => handleKeypadClick(num)}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                    <button className={styles.keypadBtn} style={{ fontSize: '0.85rem' }} onClick={handleBiometricBypass}>
                                        <Eye size={18} />
                                    </button>
                                    <button className={styles.keypadBtn} onClick={() => handleKeypadClick('0')}>0</button>
                                    <button className={styles.keypadBtn} onClick={handleKeypadDelete}>←</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Document Decrypted Viewer Modal */}
            <AnimatePresence>
                {showDocViewModal && selectedDoc && (
                    <div className={styles.overlay} onClick={() => setShowDocViewModal(false)}>
                        <motion.div 
                            className={styles.sheet}
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={styles.sheetHandle}></div>
                            <div className={styles.sheetHeader}>
                                <h3>서류 상세 보기</h3>
                                <button className={styles.closeBtn} onClick={() => setShowDocViewModal(false)}><X size={16} /></button>
                            </div>

                            <div className={styles.docViewCard}>
                                <div className={styles.docViewHeader}>
                                    <strong>{selectedDoc.name}</strong>
                                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800 }}>● {selectedDoc.status}</span>
                                </div>
                                <div className={styles.docViewBody}>
                                    <div className={styles.docViewRow}>
                                        <span>종류</span>
                                        <strong>{selectedDoc.type}</strong>
                                    </div>
                                    <div className={styles.docViewRow}>
                                        <span>등록번호</span>
                                        <strong>
                                            {selectedDoc.id === 'doc-id' ? '780815-1******' : 
                                             selectedDoc.id === 'doc-bank' ? `${state.profile.bankName} ***-***-*****` : 'MD-4820921-99'}
                                        </strong>
                                    </div>
                                    <div className={styles.docViewRow}>
                                        <span>발급 일자</span>
                                        <strong>{selectedDoc.issueDate}</strong>
                                    </div>
                                    <div className={styles.docViewRow}>
                                        <span>발급 기관</span>
                                        <strong>{selectedDoc.issuer}</strong>
                                    </div>
                                    <div className={styles.docViewRow}>
                                        <span>소유주</span>
                                        <strong>{state.profile.name}</strong>
                                    </div>
                                </div>
                                <div className={styles.watermark}>
                                    MONO CRYPTO ID SAFE
                                </div>
                            </div>

                            <button 
                                className={styles.confirmBtn}
                                onClick={() => setShowDocViewModal(false)}
                            >
                                확인 완료
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Simulated OCR Scanner Camera Screen Overlay */}
            <AnimatePresence>
                {showCameraScanner && (
                    <div className={styles.cameraOverlay}>
                        <div className={styles.scannerTitle}>
                            <h3>안전 보건 서류 촬영</h3>
                            <p>서류를 사각형 가이드라인 안에 맞춰서 흔들림 없이 위치시켜 주세요.</p>
                        </div>

                        <div className={styles.viewfinder}>
                            {scanningStep === 'scanning' && <div className={styles.scanLine} />}
                            {scanningStep === 'idle' && <span className={styles.scanGuide}>셔터를 누르면 자동 스캔됩니다.</span>}
                            {scanningStep === 'scanning' && <span className={styles.scanGuide} style={{ color: '#3182f6' }}>글자를 디지털로 인식하는 중...</span>}
                            {scanningStep === 'success' && <span className={styles.scanGuide} style={{ color: '#10b981' }}>✓ 스캔 성공! 등록 대기 중</span>}
                        </div>

                        <div className={styles.cameraControls}>
                            <button className={styles.camCancel} onClick={() => setShowCameraScanner(false)}>
                                <X size={20} />
                            </button>
                            <button 
                                className={styles.shutterBtn}
                                onClick={capturePhoto}
                                disabled={scanningStep !== 'idle'}
                            />
                            <div style={{ width: '44px' }}></div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
