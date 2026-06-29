import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 팀 디렉터리(BFF) → NestJS api(GET /teams). 쿼리스트링 그대로 전달.
export async function GET(req: NextRequest) {
  const qs = req.nextUrl.search;
  const res = await fetch(`${API}/teams${qs}`, { cache: "no-store" });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}
