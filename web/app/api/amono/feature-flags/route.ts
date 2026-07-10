import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

export async function GET() {
  const res = await fetch(`${API}/amono/feature-flags`, { cache: "no-store" });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}
