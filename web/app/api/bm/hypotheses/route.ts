import { NextRequest, NextResponse } from 'next/server';
import { getBmRole, unauthorized, forbiddenForMentor, maskHypothesisForRole, BM_API } from '@/lib/bmProxy';

export async function GET(req: NextRequest) {
  const role = await getBmRole(req);
  if (!role) return unauthorized();
  const res = await fetch(`${BM_API}/bm/hypotheses`, { cache: 'no-store' });
  const data = await res.json().catch(() => []);
  const masked = Array.isArray(data) ? data.map((h) => maskHypothesisForRole(h, role)) : data;
  return NextResponse.json(masked, { status: res.status });
}

export async function POST(req: NextRequest) {
  const role = await getBmRole(req);
  if (!role) return unauthorized();
  if (role !== 'admin') return forbiddenForMentor();
  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${BM_API}/bm/hypotheses`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
