import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 외국인 근로자 리포트 조회(BFF) → NestJS api(GET /admin/foreign-report).
export async function GET(_req: NextRequest) {
  const res = await fetch(`${API}/admin/foreign-report`, { cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
