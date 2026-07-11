import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DATAROOM_SESSION_COOKIE, DATAROOM_LOGIN_PATH, verifyDataroomSession } from '@/lib/dataroomAuth';
import DataroomClient from './DataroomClient';

export const metadata = {
  title: 'MONO Data Room',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function DataroomPage() {
  const ok = await verifyDataroomSession(cookies().get(DATAROOM_SESSION_COOKIE)?.value);
  if (!ok) redirect(DATAROOM_LOGIN_PATH);
  return <DataroomClient />;
}
