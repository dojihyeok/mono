import { NextRequest, NextResponse } from 'next/server';
import { BM_SESSION_COOKIE, BmRole, verifyBmSession } from '@/lib/bmAuth';

export const BM_API = process.env.API_URL ?? 'http://localhost:8000';

// 미들웨어가 이미 /bm 페이지 접근을 걸렀지만, API 라우트는 미들웨어 matcher 밖(/api/bm/*)이라 별도 확인한다.
export async function getBmRole(req: NextRequest): Promise<BmRole | null> {
  return verifyBmSession(req.cookies.get(BM_SESSION_COOKIE)?.value);
}

export function unauthorized() {
  return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
}

export function forbiddenForMentor() {
  return NextResponse.json({ error: '멘토 권한은 읽기 전용입니다.' }, { status: 403 });
}

const MASKED = '🔒 권한 필요';

// 기업명·가격·투자정보 권한별 마스킹(v1.2 §2) — mentor 역할에는 가격 가설·Unit Economics를 감춘다.
export function maskHypothesisForRole<T extends { pricingHypothesis?: string; unitEconomics?: unknown }>(h: T, role: BmRole): T {
  if (role === 'admin') return h;
  return { ...h, pricingHypothesis: MASKED, unitEconomics: null };
}

export function maskExperimentForRole<T extends { cost?: string | null }>(e: T, role: BmRole): T {
  if (role === 'admin') return e;
  return { ...e, cost: e.cost ? MASKED : e.cost };
}
