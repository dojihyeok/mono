import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { BM_SESSION_COOKIE, BM_LOGIN_PATH, verifyBmSession } from '@/lib/bmAuth';
import BmBoard from './BmBoard';

export const metadata = {
  title: 'MONO BM 검증 보드',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function BmPage() {
  const role = await verifyBmSession(cookies().get(BM_SESSION_COOKIE)?.value);
  if (!role) redirect(BM_LOGIN_PATH);
  return <BmBoard role={role} />;
}
