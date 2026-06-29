import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 관심 기술자 저장 해제
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; userId: string } },
) {
  const res = await fetch(
    `${API}/companies/${params.id}/saved/${params.userId}`,
    { method: "DELETE" },
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
