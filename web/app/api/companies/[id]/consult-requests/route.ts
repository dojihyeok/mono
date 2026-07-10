import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 기업이 신청한 기술자·팀 상담 요청 목록
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const res = await fetch(`${API}/companies/${params.id}/consult-requests`, {
    cache: "no-store",
  });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}

// 기술자 상담 요청
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${API}/companies/${params.id}/consult-requests`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
