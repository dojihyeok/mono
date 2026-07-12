import FieldPassClient from './FieldPassClient';

export const metadata = {
  title: 'MONO Field Pass',
  description: '일용직에서 건설근로자로, 출입카드에서 현장 권한 인프라로 — MONO Field Pass 소개',
  robots: { index: false, follow: false },
};

export default function FieldPassPage() {
  return <FieldPassClient />;
}
