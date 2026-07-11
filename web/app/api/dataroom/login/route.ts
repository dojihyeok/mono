import { NextRequest, NextResponse } from 'next/server';
import { DATAROOM_SESSION_COOKIE, checkDataroomPassword, signDataroomSession } from '@/lib/dataroomAuth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null) as { password?: string } | null;
  const password = body?.password ?? '';
  if (!checkDataroomPassword(password)) {
    return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  const token = await signDataroomSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DATAROOM_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return res;
}
