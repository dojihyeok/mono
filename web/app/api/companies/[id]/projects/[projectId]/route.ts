import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 프로젝트 상세(BFF) → NestJS api(GET /companies/:id/projects/:projectId).
export async function GET(
  _req: Request,
  { params }: { params: { id: string; projectId: string } },
) {
  const res = await fetch(
    `${API}/companies/${params.id}/projects/${params.projectId}`,
    { cache: "no-store" },
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

// 프로젝트 수정(BFF) → NestJS api(PATCH /companies/:id/projects/:projectId).
export async function PATCH(
  req: Request,
  { params }: { params: { id: string; projectId: string } },
) {
  const body = await req.json().catch(() => ({}));
  const res = await fetch(
    `${API}/companies/${params.id}/projects/${params.projectId}`,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

// 프로젝트 삭제(BFF) → NestJS api(DELETE /companies/:id/projects/:projectId).
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; projectId: string } },
) {
  const res = await fetch(
    `${API}/companies/${params.id}/projects/${params.projectId}`,
    { method: "DELETE" },
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
