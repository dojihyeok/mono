import { NextRequest, NextResponse } from 'next/server';
import { SITE_GATE_COOKIE, SITE_GATE_GRANTED_VALUE } from '@/lib/siteGate';

// 사용자 앱(/mono)을 제외한 모든 페이지는 공용 비밀번호 게이트를 거친다.
// /api, /_next, 정적 아이콘/이미지, 게이트 자체 경로는 항상 통과시킨다.
const OPEN_EXACT = ['/', '/favicon.ico', '/manifest.webmanifest', '/sw.js'];
const OPEN_PREFIXES = ['/mono', '/api', '/_next', '/icons', '/images', '/gate'];

function isOpenPath(pathname: string) {
  if (OPEN_EXACT.includes(pathname)) return true;
  return OPEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (isOpenPath(pathname)) {
    return NextResponse.next();
  }

  const granted = req.cookies.get(SITE_GATE_COOKIE)?.value === SITE_GATE_GRANTED_VALUE;
  if (granted) {
    return NextResponse.next();
  }

  const gateUrl = new URL('/gate', req.url);
  gateUrl.searchParams.set('next', pathname + search);
  return NextResponse.redirect(gateUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
