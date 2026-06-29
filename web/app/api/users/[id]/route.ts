import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 본인 프로필(역할 포함) — 권한 게이트용
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const res = await fetch(`${API}/users/${params.id}`, { cache: "no-store" });
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

// 회원 탈퇴 (User 삭제 — 연관 데이터 cascade)
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const res = await fetch(`${API}/users/${params.id}`, { method: "DELETE" });
  const data = await res.json().catch(() => ({ ok: false }));
  return NextResponse.json(data, { status: res.status });
}
