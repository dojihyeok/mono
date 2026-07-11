import { NextResponse } from 'next/server';
import { DATAROOM_SESSION_COOKIE } from '@/lib/dataroomAuth';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DATAROOM_SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
