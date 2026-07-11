import { NextRequest, NextResponse } from 'next/server';
import { BM_SESSION_COOKIE, BM_LOGIN_PATH, verifyBmSession } from '@/lib/bmAuth';
import { DATAROOM_SESSION_COOKIE, DATAROOM_LOGIN_PATH, verifyDataroomSession } from '@/lib/dataroomAuth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/bm')) {
    if (pathname === BM_LOGIN_PATH) {
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

  if (pathname.startsWith('/dataroom')) {
    if (pathname === DATAROOM_LOGIN_PATH) {
      return NextResponse.next();
    }
    const token = req.cookies.get(DATAROOM_SESSION_COOKIE)?.value;
    const ok = await verifyDataroomSession(token);
    if (!ok) {
      const loginUrl = new URL(DATAROOM_LOGIN_PATH, req.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/bm', '/bm/:path*', '/dataroom', '/dataroom/:path*'],
};
