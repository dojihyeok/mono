import { AnalysClient } from "./AnalysClient";

export const metadata = {
  title: "MONO 마케팅 분석",
  robots: { index: false, follow: false },
};

export default function AnalysPage() {
  return <AnalysClient />;
}
