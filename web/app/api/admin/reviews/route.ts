import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 평가 모니터링 목록(BFF) → NestJS api(GET /admin/reviews).
export async function GET(req: NextRequest) {
  const qs = req.nextUrl.search;
  const res = await fetch(`${API}/admin/reviews${qs}`, { cache: "no-store" });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}
