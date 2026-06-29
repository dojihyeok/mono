import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 기업: 우리 공고 지원자 목록
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const res = await fetch(`${API}/companies/${params.id}/applications`, {
    cache: "no-store",
  });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}
