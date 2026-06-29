import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 마케팅 분석 요약 — 항상 최신값(no-store).
export async function GET() {
  const res = await fetch(`${API}/analytics/summary`, { cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
