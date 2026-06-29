import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// FieldOps 관심 집계·리드(BFF) → NestJS api(GET /admin/fieldops-interests).
export async function GET(_req: NextRequest) {
  const res = await fetch(`${API}/admin/fieldops-interests`, { cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
