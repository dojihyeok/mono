import { AppShell } from "@/components/AppShell";
import { NavGate } from "@/components/NavGate";
import { ProfileProvider } from "@/lib/ProfileContext";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProfileProvider>
      <AppShell>
        {children}
        <NavGate />
      </AppShell>
    </ProfileProvider>
  );
}
