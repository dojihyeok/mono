import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 관리자: 전체 채용 공고 목록
export async function GET() {
  const res = await fetch(`${API}/admin/job-posts`, { cache: "no-store" });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}
