import SimulatorClient from './SimulatorClient';

export const metadata = {
  title: 'MONO 수익모델 진화 시뮬레이터',
  robots: { index: false, follow: false },
};

export default function BmSimulatorPage() {
  return <SimulatorClient />;
}
