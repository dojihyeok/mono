import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 기술자: 내 알림 목록
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const res = await fetch(`${API}/users/${params.id}/notifications`, {
    cache: "no-store",
  });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}
