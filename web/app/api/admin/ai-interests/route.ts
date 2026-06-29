import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// AI현장리더 관심 집계(BFF) → NestJS api(GET /admin/ai-interests).
export async function GET(_req: NextRequest) {
  const res = await fetch(`${API}/admin/ai-interests`, { cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
