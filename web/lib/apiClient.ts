"use client";

// 브라우저 → Next BFF(/api/*) → NestJS api. 모두 best-effort(실패해도 UI 안 막음).
import { CAREER_BAND } from "./constants";

const SERVER_ID_KEY = "mono.serverId";

export function getServerId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SERVER_ID_KEY);
  } catch {
    return null;
  }
}

function setServerId(id: string): void {
  try {
    window.localStorage.setItem(SERVER_ID_KEY, id);
  } catch {
    // 무시
  }
}

export function clearServerId(): void {
  try {
    window.localStorage.removeItem(SERVER_ID_KEY);
  } catch {
    // 무시
  }
}

// 가입 → 서버 User 생성 후 serverId 저장(이후 호출 연결용).
export async function apiSignup(data: {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
}): Promise<string | null> {
  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: data.name ?? undefined,
        phone: data.phone ?? undefined,
        email: data.email ?? undefined,
      }),
    });
    if (!res.ok) return null;
    const u = await res.json();
    if (u?.id) {
      setServerId(u.id);
      return u.id as string;
    }
  } catch {
    // best-effort
  }
  return null;
}

// 기본 프로필 저장 — 경력 라벨("1~3년") → CareerBand enum("Y1_3") 매핑.
export async function apiSetBasicProfile(data: {
  jobType: string[];
  careerYears: string;
  region: string[];
}): Promise<void> {
  const id = getServerId();
  if (!id) return; // 서버 user 아직 없음 → 스킵(로컬 상태는 유지됨)
  // 경력 라벨 → enum. 유효한 CareerBand 가 아니면(미선택 "") payload 에서 제외.
  // (서버 ValidationPipe 가 빈 값을 400 으로 거부 → jobType/region 까지 함께 거부되는 회귀 방지)
  const careerBand = CAREER_BAND[data.careerYears as keyof typeof CAREER_BAND];
  const payload: {
    jobType: string[];
    region: string[];
    careerYears?: string;
  } = { jobType: data.jobType, region: data.region };
  if (careerBand) payload.careerYears = careerBand;
  try {
    await fetch(`/api/users/${id}/basic-profile`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // best-effort
  }
}

// 관심 기능 등록 — 서버 InterestRegistration(FK userId)에 저장.
export async function apiRegisterInterest(feature: string): Promise<void> {
  const id = getServerId();
  if (!id) return; // 서버 user 없으면 스킵(로컬 상태는 유지)
  try {
    await fetch(`/api/users/${id}/interests`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ feature }),
    });
  } catch {
    // best-effort
  }
}

// 자격증 등록 — 서버 Certificate(FK userId)에 저장.
export async function apiAddCertificate(data: {
  name: string;
  licenseNo: string;
  issuer?: string;
  issuedAt?: string;
}): Promise<void> {
  const id = getServerId();
  if (!id) return;
  try {
    await fetch(`/api/users/${id}/certificates`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    // best-effort
  }
}

// 경력 카드 등록 — 서버 CareerCard(FK userId)에 저장. 공유 프로필(/p/:id) 노출용.
export async function apiAddCareerCard(data: {
  siteName: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  role?: string;
  equipment?: string;
  coworkers?: string;
  memo?: string;
}): Promise<void> {
  const id = getServerId();
  if (!id) return;
  try {
    await fetch(`/api/users/${id}/careers`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    // best-effort
  }
}

// 교육 이력 등록 — 서버 Education(FK userId)에 저장.
export async function apiAddEducation(data: {
  title: string;
  institute?: string;
  completedAt?: string;
}): Promise<void> {
  const id = getServerId();
  if (!id) return;
  try {
    await fetch(`/api/users/${id}/educations`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    // best-effort
  }
}
