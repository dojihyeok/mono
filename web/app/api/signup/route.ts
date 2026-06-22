import { NextRequest, NextResponse } from "next/server";

// BFF: 브라우저 → (이 라우트) → NestJS api. api는 브라우저에 직접 노출하지 않음.
const API = process.env.API_URL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${API}/signup`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
