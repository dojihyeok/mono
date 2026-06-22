"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  CareerCard,
  Certificate,
  Education,
  InterestFeatureKey,
  ProfileState,
  User,
} from "./types";
import { emptyState, loadState, makeId, saveState } from "./store";
import { computeCompletion } from "./completion";
import { track } from "./analytics";
import {
  apiSignup,
  apiSetBasicProfile,
  apiRegisterInterest,
  apiAddCertificate,
  apiAddCareerCard,
  apiAddEducation,
  clearServerId,
} from "./apiClient";

interface ProfileContextValue extends ProfileState {
  ready: boolean;
  completion: number; // 0~100 (PDF 11-4)
  nextAction: { label: string; href: string } | null;
  startSignup: (data: { phone?: string; email?: string; name?: string }) => void;
  setBasicProfile: (data: {
    jobType: string[];
    careerYears: string;
    region: string[];
  }) => void;
  updateUser: (patch: Partial<User>) => void;
  addCareerCard: (card: Omit<CareerCard, "id" | "createdAt">) => void;
  addCertificate: (c: Omit<Certificate, "id" | "createdAt">) => void;
  addEducation: (e: Omit<Education, "id" | "createdAt">) => void;
  registerInterest: (feature: InterestFeatureKey) => boolean; // 신규면 true
  ensureShareId: () => string;
  reset: () => void;
  simulateState: (type: "before_login" | "no_profile" | "completed") => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProfileState>(emptyState);
  const [ready, setReady] = useState(false);
  const visitTracked = useRef(false);

  // 최초 마운트: 저장 상태 복원 + 재방문 판정
  useEffect(() => {
    const loaded = loadState();
    // 구버전(단일 문자열) jobType/region → 배열로 정규화(하위호환)
    if (loaded.user) {
      const toArr = (x: unknown): string[] =>
        Array.isArray(x) ? (x as string[]) : x ? [x as string] : [];
      loaded.user.jobType = toArr(loaded.user.jobType);
      loaded.user.region = toArr(loaded.user.region);
    }
    setState(loaded);
    setReady(true);
    if (!visitTracked.current) {
      visitTracked.current = true;
      if (loaded.user) track("return_visit");
    }
  }, []);

  // 변경 시 영속화
  useEffect(() => {
    if (ready) saveState(state);
  }, [state, ready]);

  const startSignup = useCallback(
    (data: { phone?: string; email?: string; name?: string }) => {
      setState((prev) => ({
        ...prev,
        user: {
          id: makeId("user"),
          phone: data.phone ?? null,
          email: data.email ?? null,
          name: data.name ?? null,
          jobType: null,
          careerYears: null,
          region: null,
          createdAt: new Date().toISOString(),
        },
      }));
      track("signup_completed", {
        method: data.phone ? "phone" : "email",
      });
      // 서버 User 생성(BFF → api). serverId 저장 → 이후 호출 연결.
      void apiSignup({ name: data.name, phone: data.phone, email: data.email });
    },
    [],
  );

  const setBasicProfile = useCallback(
    (data: { jobType: string[]; careerYears: string; region: string[] }) => {
      setState((prev) => {
        const base: User =
          prev.user ?? {
            id: makeId("user"),
            phone: null,
            email: null,
            name: null,
            createdAt: new Date().toISOString(),
          };
        return {
          ...prev,
          user: {
            ...base,
            jobType: data.jobType,
            careerYears: data.careerYears,
            region: data.region,
          },
        };
      });
      track("profile_basic_completed", data);
      // 서버 저장(BFF → api). careerYears 라벨 → CareerBand enum 매핑은 apiClient에서.
      void apiSetBasicProfile(data);
    },
    [],
  );

  const updateUser = useCallback((patch: Partial<User>) => {
    setState((prev) =>
      prev.user ? { ...prev, user: { ...prev.user, ...patch } } : prev,
    );
    track("profile_updated", patch as Record<string, unknown>);
  }, []);

  const addCareerCard = useCallback(
    (card: Omit<CareerCard, "id" | "createdAt">) => {
      setState((prev) => {
        const next = [
          ...prev.careerCards,
          { ...card, id: makeId("career"), createdAt: new Date().toISOString() },
        ];
        track("career_added", { count: next.length });
        if (card.equipment) track("equipment_used_added");
        if (next.length === 3) track("career_three_added");
        return { ...prev, careerCards: next };
      });
      // 서버 저장(BFF → api). 공유 프로필(/p/:id) 현장 경력 영속화.
      void apiAddCareerCard({
        siteName: card.siteName,
        field: card.field,
        startDate: card.startDate,
        endDate: card.endDate,
        role: card.role,
        equipment: card.equipment,
        coworkers: card.coworkers,
        memo: card.memo,
      });
    },
    [],
  );

  const addCertificate = useCallback(
    (c: Omit<Certificate, "id" | "createdAt">) => {
      setState((prev) => ({
        ...prev,
        certificates: [
          ...prev.certificates,
          { ...c, id: makeId("cert"), createdAt: new Date().toISOString() },
        ],
      }));
      track("certificate_added");
      void apiAddCertificate({
        name: c.name,
        licenseNo: c.licenseNo,
        issuer: c.issuer,
        issuedAt: c.issuedAt,
      });
    },
    [],
  );

  const addEducation = useCallback((e: Omit<Education, "id" | "createdAt">) => {
    setState((prev) => ({
      ...prev,
      educations: [
        ...prev.educations,
        { ...e, id: makeId("edu"), createdAt: new Date().toISOString() },
      ],
    }));
    track("education_added");
    void apiAddEducation({ title: e.title, institute: e.institute, completedAt: e.completedAt });
  }, []);

  const registerInterest = useCallback((feature: InterestFeatureKey) => {
    let isNew = false;
    setState((prev) => {
      if (prev.interests.some((i) => i.feature === feature)) return prev;
      isNew = true;
      return {
        ...prev,
        interests: [
          ...prev.interests,
          {
            id: makeId("interest"),
            feature,
            createdAt: new Date().toISOString(),
          },
        ],
      };
    });
    // 신규 등록만 서버 저장(InterestRegistration). 이벤트는 호출부에서 track.
    if (isNew) void apiRegisterInterest(feature);
    return isNew;
  }, []);

  const ensureShareId = useCallback(() => {
    let id = "";
    setState((prev) => {
      if (prev.shareId) {
        id = prev.shareId;
        return prev;
      }
      id = makeId("p").slice(2, 12);
      return { ...prev, shareId: id };
    });
    return id;
  }, []);

  const reset = useCallback(() => {
    clearServerId();
    setState(emptyState);
  }, []);

  const simulateState = useCallback((type: "before_login" | "no_profile" | "completed") => {
    clearServerId();
    if (type === "before_login") {
      setState(emptyState);
    } else if (type === "no_profile") {
      setState({
        user: {
          id: makeId("user"),
          phone: "010-1234-5678",
          email: null,
          name: "홍길동",
          jobType: null,
          careerYears: null,
          region: null,
          createdAt: new Date().toISOString(),
        },
        careerCards: [],
        certificates: [],
        educations: [],
        interests: [],
        shareId: null,
      });
    } else if (type === "completed") {
      const shareId = makeId("p").slice(2, 12);
      setState({
        user: {
          id: makeId("user"),
          phone: "010-1234-5678",
          email: null,
          name: "홍길동",
          jobType: ["형틀목공"],
          careerYears: "5년~10년",
          region: ["인천 연수구"],
          createdAt: new Date().toISOString(),
        },
        careerCards: [
          {
            id: makeId("career"),
            siteName: "힐스테이트 송도 더스카이",
            field: "형틀목공",
            startDate: "2024-03",
            endDate: "",
            role: "반장",
            equipment: "갱폼·알폼",
            createdAt: new Date().toISOString(),
          }
        ],
        certificates: [
          {
            id: makeId("cert"),
            name: "비계기능사",
            licenseNo: "20-412-0081",
            issuer: "한국산업인력공단",
            issuedAt: "2020.05.12",
            createdAt: new Date().toISOString(),
          }
        ],
        educations: [
          {
            id: makeId("edu"),
            title: "건설업 기초안전보건교육",
            institute: "안전보건공단",
            completedAt: "2022.03.14",
            createdAt: new Date().toISOString(),
          }
        ],
        interests: [],
        shareId,
      });
    }
  }, []);

  const completion = useMemo(() => computeCompletion(state), [state]);

  const nextAction = useMemo<{ label: string; href: string } | null>(() => {
    if (!state.user?.jobType?.length) return { label: "기본 프로필 만들기", href: "/onboarding" };
    if (state.careerCards.length === 0)
      return { label: "경력 카드 추가하기", href: "/profile?add=career" };
    if (state.careerCards.length < 3)
      return { label: "경력 1개 더 추가하기", href: "/profile?add=career" };
    if (state.certificates.length === 0 && state.educations.length === 0)
      return { label: "자격증 등록하기", href: "/profile?add=cert" };
    return null;
  }, [state]);

  const value: ProfileContextValue = {
    ...state,
    ready,
    completion,
    nextAction,
    startSignup,
    setBasicProfile,
    updateUser,
    addCareerCard,
    addCertificate,
    addEducation,
    registerInterest,
    ensureShareId,
    reset,
    simulateState,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
