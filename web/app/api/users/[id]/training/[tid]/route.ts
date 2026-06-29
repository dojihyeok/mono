import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 교육 이력 삭제(BFF) → NestJS api(DELETE /users/:id/training/:tid).
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; tid: string } },
) {
  const res = await fetch(`${API}/users/${params.id}/training/${params.tid}`, {
    method: "DELETE",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
