import { NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 채용 공고 삭제
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; postId: string } },
) {
  const res = await fetch(
    `${API}/companies/${params.id}/job-posts/${params.postId}`,
    { method: "DELETE" },
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
