import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 검토 대기 서류 목록 조회(BFF) → NestJS api(GET /admin/pending-documents).
export async function GET(_req: NextRequest) {
  const res = await fetch(`${API}/admin/pending-documents`, { cache: "no-store" });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}
