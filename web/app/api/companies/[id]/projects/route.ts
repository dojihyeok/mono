import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 프로젝트 목록(BFF) → NestJS api(GET /companies/:id/projects).
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const res = await fetch(`${API}/companies/${params.id}/projects`, {
    cache: "no-store",
  });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}

// 프로젝트 생성(BFF) → NestJS api(POST /companies/:id/projects).
export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${API}/companies/${params.id}/projects`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
