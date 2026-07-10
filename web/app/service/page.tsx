import { ServiceClient } from "./ServiceClient";

export const metadata = {
  title: "MONO — 현장 기술자의 경력과 기회를 하나로",
  description: "경력·자격·교육 이력을 검증 프로필로 만들고, 현장 공고 탐색부터 출역 기록과 경력 반영까지 MONO에서 연결합니다.",
};

export default function ServicePage() {
  return <ServiceClient />;
}
