import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 장비 이력 삭제(BFF) → NestJS api(DELETE /users/:id/equipment-history/:eid).
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; eid: string } },
) {
  const res = await fetch(`${API}/users/${params.id}/equipment-history/${params.eid}`, {
    method: "DELETE",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
