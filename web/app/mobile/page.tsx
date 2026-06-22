import { ProfileProvider } from "@/lib/ProfileContext";
import MonoApp from "../mono/MonoApp";

export default function MobilePage() {
  return (
    <ProfileProvider>
      <MonoApp />
    </ProfileProvider>
  );
}
