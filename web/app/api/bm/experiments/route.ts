import { NextRequest, NextResponse } from 'next/server';
import { BM_API } from '@/lib/bmProxy';

export async function GET(req: NextRequest) {
  const qs = req.nextUrl.search;
  const res = await fetch(`${BM_API}/bm/experiments${qs}`, { cache: 'no-store' });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${BM_API}/bm/experiments`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
