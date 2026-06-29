import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 작업요청 후보 목록(BFF) → NestJS api(GET /work-requests/:id/candidates).
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const res = await fetch(`${API}/work-requests/${params.id}/candidates`, {
    cache: "no-store",
  });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}

// 후보 지정(BFF) → NestJS api(POST /work-requests/:id/candidates).
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${API}/work-requests/${params.id}/candidates`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
