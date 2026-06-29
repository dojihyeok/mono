import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 반장 신청 반려(승격 없이 대기 해제)
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const res = await fetch(`${API}/admin/users/${params.id}/foreman-reject`, { method: "POST" });
  const data = await res.json().catch(() => ({ ok: false }));
  return NextResponse.json(data, { status: res.status });
}
