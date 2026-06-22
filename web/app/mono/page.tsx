import { ProfileProvider } from "@/lib/ProfileContext";
import MonoApp from "./MonoApp";

export default function MonoPage() {
  return (
    <ProfileProvider>
      <MonoApp />
    </ProfileProvider>
  );
}
