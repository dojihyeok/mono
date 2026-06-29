import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 서류 목록 조회(BFF) → NestJS api(GET /users/:id/documents).
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${API}/users/${params.id}/documents`, { cache: "no-store" });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}

// 서류 등록(BFF) → NestJS api(POST /users/:id/documents).
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${API}/users/${params.id}/documents`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
