import { AnalyticsTabs } from "./AnalyticsTabs";

export const metadata = {
  title: "MONO 사용자 행동 분석",
  robots: { index: false, follow: false },
};

export default function AnalyticsPage() {
  return <AnalyticsTabs />;
}
