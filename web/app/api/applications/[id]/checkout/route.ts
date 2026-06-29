import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 기술자: 퇴근 체크아웃
export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const res = await fetch(`${API}/applications/${params.id}/checkout`, {
    method: "POST",
    headers: { "content-type": "application/json" },
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
