import { NextRequest, NextResponse } from 'next/server';
import { SITE_GATE_COOKIE, SITE_GATE_GRANTED_VALUE } from '@/lib/siteGate';

// 사용자 앱(/mono)을 제외한 모든 페이지는 공용 비밀번호 게이트를 거친다.
// /api, /_next, 정적 아이콘/이미지, 게이트 자체 경로는 항상 통과시킨다.
// /field-pass는 센스톤 대표·VC·모두의창업 심사위원에게 링크로 바로 공유하는
// 공동 프로젝트 제안 페이지라 게이트에서 제외한다(/field-pass/otac 포함).
const OPEN_EXACT = ['/', '/favicon.ico', '/manifest.webmanifest', '/sw.js'];
const OPEN_PREFIXES = ['/mono', '/api', '/_next', '/icons', '/images', '/gate', '/field-pass'];

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
