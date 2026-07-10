import { NextRequest, NextResponse } from 'next/server';
import { getBmRole, unauthorized, forbiddenForMentor, maskHypothesisForRole, BM_API } from '@/lib/bmProxy';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const role = await getBmRole(req);
  if (!role) return unauthorized();
  const res = await fetch(`${BM_API}/bm/hypotheses/${params.id}`, { cache: 'no-store' });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(maskHypothesisForRole(data, role), { status: res.status });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const role = await getBmRole(req);
  if (!role) return unauthorized();
  if (role !== 'admin') return forbiddenForMentor();
  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${BM_API}/bm/hypotheses/${params.id}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const role = await getBmRole(req);
  if (!role) return unauthorized();
  if (role !== 'admin') return forbiddenForMentor();
  const res = await fetch(`${BM_API}/bm/hypotheses/${params.id}`, { method: 'DELETE' });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
