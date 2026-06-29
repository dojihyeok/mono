import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 기업 정보 조회(본인 세션용)
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const res = await fetch(`${API}/companies/${params.id}`, {
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
