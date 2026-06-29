import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 이벤트 로그 — ?name=&limit= 쿼리 그대로 전달.
export async function GET(req: NextRequest) {
  const qs = req.nextUrl.search;
  const res = await fetch(`${API}/admin/events${qs}`, { cache: "no-store" });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}
