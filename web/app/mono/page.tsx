import { ProfileProvider } from "@/lib/ProfileContext";
import MonoEntry from "./MonoEntry";

export default function MonoPage() {
  return (
    <ProfileProvider>
      <MonoEntry />
    </ProfileProvider>
  );
}
