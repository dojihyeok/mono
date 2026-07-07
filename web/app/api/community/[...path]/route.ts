import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const { searchParams } = new URL(req.url);
  const targetUrl = new URL(`${API}/community/${params.path.join("/")}`);
  searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  const res = await fetch(targetUrl.toString(), { cache: "no-store" });
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const body = await req.json().catch(() => ({}));
  const targetUrl = `${API}/community/${params.path.join("/")}`;

  const res = await fetch(targetUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
