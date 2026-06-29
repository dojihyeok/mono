import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 반장 승인 요청(기능공 → 대기)
export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const res = await fetch(`${API}/users/${params.id}/foreman-request`, { method: "POST" });
  const data = await res.json().catch(() => ({ ok: false }));
  return NextResponse.json(data, { status: res.status });
}
