import { NextRequest, NextResponse } from 'next/server';
import { getBmRole, unauthorized, forbiddenForMentor, BM_API } from '@/lib/bmProxy';

export async function GET(req: NextRequest) {
  const role = await getBmRole(req);
  if (!role) return unauthorized();
  const res = await fetch(`${BM_API}/bm/next-actions`, { cache: 'no-store' });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const role = await getBmRole(req);
  if (!role) return unauthorized();
  if (role !== 'admin') return forbiddenForMentor();
  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${BM_API}/bm/next-actions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
