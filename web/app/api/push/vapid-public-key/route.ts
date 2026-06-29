import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 웹푸시 공개키(VAPID) — 클라이언트 구독에 필요
export async function GET() {
  const res = await fetch(`${API}/push/vapid-public-key`, { cache: "no-store" });
  const data = await res.json().catch(() => ({ key: null }));
  return NextResponse.json(data, { status: res.status });
}
