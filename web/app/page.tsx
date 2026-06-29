import { redirect } from "next/navigation";

// 루트(/)는 실제 앱 진입(/mono, 로그인 게이트)으로 보낸다. 옛 사용자 웹 랜딩/가입/온보딩은 제거됨.
export default function RootPage() {
  redirect("/mono");
}
