import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 산업별 용어팩 조회(BFF) — 쿼리스트링 그대로 전달 → NestJS api(GET /glossary/packs/:industry).
export async function GET(req: NextRequest, { params }: { params: { industry: string } }) {
  const qs = req.nextUrl.search;
  const res = await fetch(`${API}/glossary/packs/${params.industry}${qs}`, { cache: "no-store" });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}
