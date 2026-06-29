import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 알림 1건 읽음 처리
export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const res = await fetch(`${API}/notifications/${params.id}/read`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const data = await res.json().catch(() => ({ ok: false }));
  return NextResponse.json(data, { status: res.status });
}
