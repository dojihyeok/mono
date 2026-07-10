import { FieldPassClient } from "./FieldPassClient";

export const metadata = {
  title: "MONO Field Pass — 산업현장 Trust Infrastructure",
  description: "작업자의 신원·자격·교육·현장 권한과 출입 기록을 연결하는 산업현장 Trust Infrastructure, MONO Field Pass를 소개합니다.",
};

export default function FieldPassPage() {
  return <FieldPassClient />;
}
