import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000";

// 공개 프로필 조회(BFF) — 클라이언트에서 동일 오리진으로 공개 프로필을 받을 때 사용.
// 주의: 현재 공개 페이지(web/app/p/[id]/page.tsx)는 서버 컴포넌트에서 NestJS api 를
// 직접 호출(SSR 정석 패턴)하므로 이 라우트를 거치지 않는다. 향후 인증/마스킹/캐싱/레이트리밋
// 같은 공통 정책을 BFF 에 둘 경우, page.tsx 의 fetch 대상을 이 경로로 통일해야 정책이 적용된다.
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const res = await fetch(`${API}/users/${params.id}/public`, {
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
