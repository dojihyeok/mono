import { NextRequest, NextResponse } from 'next/server';
import { BM_SESSION_COOKIE, BM_LOGIN_PATH, verifyBmSession } from '@/lib/bmAuth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === BM_LOGIN_PATH || pathname.startsWith('/api/bm/login')) {
    return NextResponse.next();
  }

  const token = req.cookies.get(BM_SESSION_COOKIE)?.value;
  const role = await verifyBmSession(token);
  if (!role) {
    const loginUrl = new URL(BM_LOGIN_PATH, req.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/bm', '/bm/:path*'],
};
