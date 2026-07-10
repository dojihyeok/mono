import { NextResponse } from 'next/server';
import { BM_SESSION_COOKIE } from '@/lib/bmAuth';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(BM_SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
