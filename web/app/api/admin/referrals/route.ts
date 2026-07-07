import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 파트너 연계 신청 리스트 조회 (BFF) → NestJS admin/referrals
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = new URL(`${API}/admin/referrals`);
  searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  const res = await fetch(targetUrl.toString(), { cache: "no-store" });
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
