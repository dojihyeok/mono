import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 위험 신고 목록 조회(BFF) — 쿼리스트링 그대로 전달 → NestJS api(GET /risk-reports).
export async function GET(req: NextRequest) {
  const qs = req.nextUrl.search;
  const res = await fetch(`${API}/risk-reports${qs}`, { cache: "no-store" });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}

// 위험 신고 등록(BFF) → NestJS api(POST /risk-reports).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${API}/risk-reports`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
