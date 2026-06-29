import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 운영자(ProjectOperator) 관리 목록(BFF) → NestJS api(GET /admin/operators).
export async function GET(_req: NextRequest) {
  const res = await fetch(`${API}/admin/operators`, { cache: "no-store" });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}
