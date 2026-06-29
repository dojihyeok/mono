import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 자동 후보추천(BFF) → NestJS api(GET /work-requests/:id/recommendations).
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const qs = req.nextUrl.search;
  const res = await fetch(`${API}/work-requests/${params.id}/recommendations${qs}`, { cache: "no-store" });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}
