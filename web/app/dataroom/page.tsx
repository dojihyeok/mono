import DataroomClient from './DataroomClient';

export const metadata = {
  title: 'MONO Data Room',
  robots: { index: false, follow: false },
};

export default function DataroomPage() {
  return <DataroomClient />;
}
