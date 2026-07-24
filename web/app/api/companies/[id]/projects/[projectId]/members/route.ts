import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 프로젝트 인력 배정(BFF) → NestJS api(POST /companies/:id/projects/:projectId/members).
export async function POST(
  req: Request,
  { params }: { params: { id: string; projectId: string } },
) {
  const body = await req.json().catch(() => ({}));
  const res = await fetch(
    `${API}/companies/${params.id}/projects/${params.projectId}/members`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
