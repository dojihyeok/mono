import { NextRequest, NextResponse } from 'next/server';
import { BM_SESSION_COOKIE, verifyBmSession } from '@/lib/bmAuth';

export async function GET(req: NextRequest) {
  const role = await verifyBmSession(req.cookies.get(BM_SESSION_COOKIE)?.value);
  return NextResponse.json({ role });
}
