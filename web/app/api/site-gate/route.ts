import { NextRequest, NextResponse } from 'next/server';
import { SITE_GATE_COOKIE, SITE_GATE_PASSWORD, SITE_GATE_GRANTED_VALUE } from '@/lib/siteGate';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const password = body?.password;

  if (typeof password !== 'string' || password !== SITE_GATE_PASSWORD) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SITE_GATE_COOKIE, SITE_GATE_GRANTED_VALUE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
