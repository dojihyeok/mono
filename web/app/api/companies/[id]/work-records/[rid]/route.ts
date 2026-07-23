import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 작업수행사례 삭제(BFF) → NestJS api(DELETE /companies/:id/work-records/:rid).
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; rid: string } },
) {
  const res = await fetch(
    `${API}/companies/${params.id}/work-records/${params.rid}`,
    { method: "DELETE" },
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
