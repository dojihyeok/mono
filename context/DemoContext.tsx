'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type DemoStage = 'ONBOARDING' | 'INIT' | 'APPLIED' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'PAID';

export interface UserProfile {
  name: string;
  phone: string;
  birth: string;
  regions: string[];
  jobs: string[];
  experience: string;
  safetyComplete: boolean;
  bankName: string;
  accountNumber: string;
  profileComplete: boolean;
}

export interface OfflineRecord {
  id: string;
  siteName: string;
  workDate: string;
  role: string;
  managerPhone: string;
  agencyName: string;
  photoUploaded: boolean;
  status: '직접 등록' | '회사 확인' | '공식 확인 준비중' | '확인 완료';
}

export interface DemoState {
  demoStage: DemoStage;
  profile: UserProfile;
  jobApplication: {
    appliedJobId: string | null;
    status: '신청 전' | '신청 완료' | '회사 확인 중' | '일할 곳 확정' | '반려' | '취소';
  };
  attendance: {
    status: '출근 전' | '출근 가능' | '출근 완료' | '퇴근 가능' | '퇴근 완료' | '회사 확인 완료' | '수정 요청' | '반려';
    checkInTime: string | null;
    checkOutTime: string | null;
    offlineRecords: OfflineRecord[];
  };
  wallet: {
    status: '회사 확인 중' | '받을 금액 확정' | '지급 준비 중' | '지급 완료' | '금액 문의 중' | '확인 필요';
    expectedAmount: number;
    receivedAmount: number;
    pendingAmount: number;
    inquiryCount: number;
  };
}

interface DemoContextType {
  state: DemoState;
  setDemoStage: (stage: DemoStage) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  applyJob: (jobId: string) => void;
  confirmJob: () => void;
  checkIn: (time?: string) => void;
  checkOut: (time?: string) => void;
  addOfflineRecord: (record: Omit<OfflineRecord, 'id' | 'status'>) => void;
  requestAmountInquiry: () => void;
  resetDemo: () => void;
}

const defaultProfile: UserProfile = {
  name: '정무길',
  phone: '010-1234-5678',
  birth: '1978-08-15',
  regions: ['서울시 구로구 (수도권 전역 가능)'],
  jobs: ['뼈대 튼튼 형틀목수'],
  experience: '5년 ~ 10년 (베테랑)',
  safetyComplete: true,
  bankName: '신한은행',
  accountNumber: '110-123-456789',
  profileComplete: false,
};

const initialDemoState: DemoState = {
  demoStage: 'ONBOARDING',
  profile: defaultProfile,
  jobApplication: {
    appliedJobId: null,
    status: '신청 전',
  },
  attendance: {
    status: '출근 전',
    checkInTime: null,
    checkOutTime: null,
    offlineRecords: [],
  },
  wallet: {
    status: '회사 확인 중',
    expectedAmount: 3290000,
    receivedAmount: 0,
    pendingAmount: 0,
    inquiryCount: 0,
  },
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(initialDemoState);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mono_demo_state');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved demo state', e);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  const saveState = (newState: DemoState) => {
    setState(newState);
    localStorage.setItem('mono_demo_state', JSON.stringify(newState));
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  };

  // Setup clock sync in other tabs if they modify localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('mono_demo_state');
      if (saved) {
        try {
          setState(JSON.parse(saved));
        } catch (e) {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setDemoStage = (stage: DemoStage) => {
    const newState = { ...state, demoStage: stage };

    // Automatically align sub-states based on stage
    if (stage === 'ONBOARDING') {
      newState.profile.profileComplete = false;
      newState.jobApplication = { appliedJobId: null, status: '신청 전' };
      newState.attendance = { status: '출근 전', checkInTime: null, checkOutTime: null, offlineRecords: state.attendance.offlineRecords };
      newState.wallet = { status: '회사 확인 중', expectedAmount: 3290000, receivedAmount: 0, pendingAmount: 0, inquiryCount: 0 };
    } else if (stage === 'INIT') {
      newState.profile.profileComplete = true;
      newState.jobApplication = { appliedJobId: null, status: '신청 전' };
      newState.attendance = { status: '출근 전', checkInTime: null, checkOutTime: null, offlineRecords: state.attendance.offlineRecords };
      newState.wallet = { status: '회사 확인 중', expectedAmount: 3290000, receivedAmount: 0, pendingAmount: 0, inquiryCount: 0 };
    } else if (stage === 'APPLIED') {
      newState.profile.profileComplete = true;
      newState.jobApplication = { appliedJobId: 'job-1', status: '회사 확인 중' };
      newState.attendance = { status: '출근 전', checkInTime: null, checkOutTime: null, offlineRecords: state.attendance.offlineRecords };
      newState.wallet = { status: '회사 확인 중', expectedAmount: 3290000, receivedAmount: 0, pendingAmount: 0, inquiryCount: 0 };
    } else if (stage === 'CONFIRMED') {
      newState.profile.profileComplete = true;
      newState.jobApplication = { appliedJobId: 'job-1', status: '일할 곳 확정' };
      newState.attendance = { status: '출근 가능', checkInTime: null, checkOutTime: null, offlineRecords: state.attendance.offlineRecords };
      newState.wallet = { status: '회사 확인 중', expectedAmount: 3290000, receivedAmount: 0, pendingAmount: 0, inquiryCount: 0 };
    } else if (stage === 'CHECKED_IN') {
      newState.profile.profileComplete = true;
      newState.jobApplication = { appliedJobId: 'job-1', status: '일할 곳 확정' };
      newState.attendance = { status: '출근 완료', checkInTime: '07:02', checkOutTime: null, offlineRecords: state.attendance.offlineRecords };
      newState.wallet = { status: '회사 확인 중', expectedAmount: 3290000, receivedAmount: 0, pendingAmount: 0, inquiryCount: 0 };
    } else if (stage === 'CHECKED_OUT') {
      newState.profile.profileComplete = true;
      newState.jobApplication = { appliedJobId: 'job-1', status: '일할 곳 확정' };
      newState.attendance = { status: '퇴근 완료', checkInTime: '07:02', checkOutTime: '16:05', offlineRecords: state.attendance.offlineRecords };
      newState.wallet = { status: '회사 확인 중', expectedAmount: 3290000, receivedAmount: 0, pendingAmount: 0, inquiryCount: 0 };
    } else if (stage === 'PAID') {
      newState.profile.profileComplete = true;
      newState.jobApplication = { appliedJobId: 'job-1', status: '일할 곳 확정' };
      newState.attendance = { status: '회사 확인 완료', checkInTime: '07:02', checkOutTime: '16:05', offlineRecords: state.attendance.offlineRecords };
      // Increase amount and mark paid
      newState.wallet = {
        status: '지급 완료',
        expectedAmount: 3525000,
        receivedAmount: 3525000,
        pendingAmount: 0,
        inquiryCount: 0,
      };
    }

    saveState(newState);
  };

  const updateProfile = (profileUpdate: Partial<UserProfile>) => {
    const newState = {
      ...state,
      profile: { ...state.profile, ...profileUpdate },
    };
    saveState(newState);
  };

  const applyJob = (jobId: string) => {
    const newState = {
      ...state,
      demoStage: 'APPLIED' as DemoStage,
      jobApplication: {
        appliedJobId: jobId,
        status: '회사 확인 중' as const,
      },
    };
    saveState(newState);
  };

  const confirmJob = () => {
    const newState = {
      ...state,
      demoStage: 'CONFIRMED' as DemoStage,
      jobApplication: {
        ...state.jobApplication,
        status: '일할 곳 확정' as const,
      },
      attendance: {
        ...state.attendance,
        status: '출근 가능' as const,
      },
    };
    saveState(newState);
  };

  const checkIn = (time?: string) => {
    const newState = {
      ...state,
      demoStage: 'CHECKED_IN' as DemoStage,
      attendance: {
        ...state.attendance,
        status: '출근 완료' as const,
        checkInTime: time || new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
      },
    };
    saveState(newState);
  };

  const checkOut = (time?: string) => {
    const newState = {
      ...state,
      demoStage: 'CHECKED_OUT' as DemoStage,
      attendance: {
        ...state.attendance,
        status: '퇴근 완료' as const,
        checkOutTime: time || new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
      },
    };
    saveState(newState);
  };

  const addOfflineRecord = (record: Omit<OfflineRecord, 'id' | 'status'>) => {
    const newRecord: OfflineRecord = {
      ...record,
      id: `offline-${Date.now()}`,
      status: '공식 확인 준비중',
    };
    const newState = {
      ...state,
      attendance: {
        ...state.attendance,
        offlineRecords: [newRecord, ...state.attendance.offlineRecords],
      },
    };
    saveState(newState);
  };

  const requestAmountInquiry = () => {
    const newState = {
      ...state,
      wallet: {
        ...state.wallet,
        status: '금액 문의 중' as const,
        inquiryCount: state.wallet.inquiryCount + 1,
      },
    };
    saveState(newState);
  };

  const resetDemo = () => {
    saveState(initialDemoState);
  };

  return (
    <DemoContext.Provider
      value={{
        state,
        setDemoStage,
        updateProfile,
        applyJob,
        confirmJob,
        checkIn,
        checkOut,
        addOfflineRecord,
        requestAmountInquiry,
        resetDemo,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
