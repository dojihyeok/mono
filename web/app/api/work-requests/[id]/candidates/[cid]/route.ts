import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 후보 상태/점수/메모 변경(BFF) → NestJS api(PATCH /work-requests/:id/candidates/:cid).
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; cid: string } },
) {
  const body = await req.json().catch(() => ({}));
  const res = await fetch(
    `${API}/work-requests/${params.id}/candidates/${params.cid}`,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
