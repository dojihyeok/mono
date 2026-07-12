import OtacMeetingClient from './OtacMeetingClient';

export const metadata = {
  title: 'MONO × 센스톤 OTAC PoC',
  description: 'MONO Field Pass와 센스톤 OTAC 기반 현장 출입 인증 PoC 제안',
  robots: { index: false, follow: false },
};

export default function OtacMeetingPage() {
  return <OtacMeetingClient />;
}
