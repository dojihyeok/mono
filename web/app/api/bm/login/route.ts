import { NextRequest, NextResponse } from 'next/server';
import { BM_SESSION_COOKIE, resolveRoleFromPassword, signBmSession } from '@/lib/bmAuth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null) as { password?: string } | null;
  const password = body?.password ?? '';
  const role = resolveRoleFromPassword(password);
  if (!role) {
    return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  const token = await signBmSession(role);
  const res = NextResponse.json({ role });
  res.cookies.set(BM_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return res;
}
