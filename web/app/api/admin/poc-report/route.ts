import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// PoC 리포트(BFF) → NestJS api(GET /admin/poc-report).
export async function GET() {
  const res = await fetch(`${API}/admin/poc-report`, { cache: "no-store" });
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
