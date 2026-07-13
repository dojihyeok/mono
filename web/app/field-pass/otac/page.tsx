import OtacMeetingClient from './OtacMeetingClient';

// /field-pass와 동일한 이유로 캐시 수명을 짧게 재검증하도록 설정.
export const revalidate = 60;

export const metadata = {
  title: 'MONO × 센스톤 OTAC PoC',
  description: 'MONO Field Pass와 센스톤 OTAC 기반 현장 출입 인증 PoC 제안',
  robots: { index: false, follow: false },
};

export default function OtacMeetingPage() {
  return <OtacMeetingClient />;
}
