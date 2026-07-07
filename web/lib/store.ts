// 프로필 영속화 store — 현재 localStorage, 추후 Prisma 서버액션으로 교체.
// 함수 시그니처를 고정해 두어 호출부 변경 없이 백엔드만 갈아끼웁니다.

import type { ProfileState } from "./types";

const KEY = "mono.profile";

export const emptyState: ProfileState = {
  user: null,
  careerCards: [],
  certificates: [],
  educations: [],
  interests: [],
  shareId: null,
};

export function loadState(): ProfileState {
  if (typeof window === "undefined") return emptyState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) || {};
    
    // Robust validation
    const userObj = parsed.user && typeof parsed.user === 'object' ? parsed.user : null;
    const careerCardsArr = Array.isArray(parsed.careerCards) ? parsed.careerCards : [];
    const certificatesArr = Array.isArray(parsed.certificates) ? parsed.certificates : [];
    const educationsArr = Array.isArray(parsed.educations) ? parsed.educations : [];
    const interestsArr = Array.isArray(parsed.interests) ? parsed.interests : [];
    const shareIdVal = typeof parsed.shareId === 'string' ? parsed.shareId : null;

    return {
      user: userObj,
      careerCards: careerCardsArr,
      certificates: certificatesArr,
      educations: educationsArr,
      interests: interestsArr,
      shareId: shareIdVal,
    };
  } catch {
    return emptyState;
  }
}

export function saveState(state: ProfileState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // 저장 실패 무시
  }
}

// cuid 대용 — 클라이언트 고유 id. (서버 전환 시 prisma cuid 로 대체)
export function makeId(prefix = "id"): string {
  const rand = Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36);
  return `${prefix}_${time}${rand}`;
}
