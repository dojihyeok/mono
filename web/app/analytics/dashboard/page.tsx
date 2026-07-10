import { ConversionDashboardClient } from "./ConversionDashboardClient";

export const metadata = {
  title: "MONO Conversion Dashboard",
  robots: { index: false, follow: false },
};

export default function ConversionDashboardPage() {
  return <ConversionDashboardClient />;
}
