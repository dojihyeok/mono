import { AdminClient } from "./AdminClient";

export const metadata = {
  title: "MONO 운영 콘솔",
  robots: { index: false, follow: false },
};

export default function AmonoPage() {
  return <AdminClient />;
}
