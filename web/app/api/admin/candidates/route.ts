import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 후보 관리(BM 검증 P0-2) 목록(BFF) → NestJS api(GET /admin/candidates).
export async function GET(req: NextRequest) {
  const qs = req.nextUrl.search;
  const res = await fetch(`${API}/admin/candidates${qs}`, { cache: "no-store" });
  const data = await res.json().catch(() => ({ saved: [], consults: [] }));
  return NextResponse.json(data, { status: res.status });
}
