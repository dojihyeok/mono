import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 프로젝트 인력 배정 수정(BFF) → NestJS api(PATCH .../members/:memberId).
export async function PATCH(
  req: Request,
  { params }: { params: { id: string; projectId: string; memberId: string } },
) {
  const body = await req.json().catch(() => ({}));
  const res = await fetch(
    `${API}/companies/${params.id}/projects/${params.projectId}/members/${params.memberId}`,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

// 프로젝트 인력 배정 해제(BFF) → NestJS api(DELETE .../members/:memberId).
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; projectId: string; memberId: string } },
) {
  const res = await fetch(
    `${API}/companies/${params.id}/projects/${params.projectId}/members/${params.memberId}`,
    { method: "DELETE" },
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
