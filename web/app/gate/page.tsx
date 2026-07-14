import { Suspense } from 'react';
import GateClient from './GateClient';

export const metadata = {
  title: 'MONO',
  robots: { index: false, follow: false },
};

export default function GatePage() {
  return (
    <Suspense fallback={null}>
      <GateClient />
    </Suspense>
  );
}
