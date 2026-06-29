import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 기술자: 미읽음 알림 수
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const res = await fetch(`${API}/users/${params.id}/notifications/unread-count`, {
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({ count: 0 }));
  return NextResponse.json(data, { status: res.status });
}
