import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 용어 목록 조회(BFF) — 쿼리스트링 그대로 전달 → NestJS api(GET /glossary).
export async function GET(req: NextRequest) {
  const qs = req.nextUrl.search;
  const res = await fetch(`${API}/glossary${qs}`, { cache: "no-store" });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}

// 용어 등록(BFF) → NestJS api(POST /glossary).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${API}/glossary`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
