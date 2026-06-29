import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 수행기업 공개 프로필(BFF) → NestJS api(GET /companies/:id/profile).
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const res = await fetch(`${API}/companies/${params.id}/profile`, { cache: "no-store" });
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
