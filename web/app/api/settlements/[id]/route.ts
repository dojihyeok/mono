import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 정산 단건 조회(BFF) → NestJS api(GET /settlements/:id).
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${API}/settlements/${params.id}`, { cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
