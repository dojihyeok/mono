import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 운영 콘솔 Overview — 집계는 항상 최신값(no-store).
export async function GET() {
  const res = await fetch(`${API}/admin/overview`, { cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
