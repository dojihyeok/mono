"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";

// 메인 5탭 + 관심(허브)에서 하단 네비 노출. 가입/온보딩/미리보기/공유 등 단계형 화면은 숨김.
const TAB_ROUTES = ["/home", "/jobs", "/card", "/work", "/profile", "/interest"];

export function NavGate() {
  const pathname = usePathname();
  if (!TAB_ROUTES.includes(pathname)) return null;
  return <BottomNav />;
}
