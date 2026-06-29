import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 반장 승인 대기 목록
export async function GET() {
  const res = await fetch(`${API}/admin/foreman-requests`, { cache: "no-store" });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}
