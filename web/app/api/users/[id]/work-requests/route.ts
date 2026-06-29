import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 사용자별 작업 요청 조회(BFF) — 브라우저 → 여기 → NestJS api(GET /users/:id/work-requests).
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const res = await fetch(`${API}/users/${params.id}/work-requests`, {
    cache: "no-store",
  });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}
