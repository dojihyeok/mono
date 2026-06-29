import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 기술자: 함께 일한 동료 목록(그래프)
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const res = await fetch(`${API}/users/${params.id}/coworkers`, {
    cache: "no-store",
  });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}
