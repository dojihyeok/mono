import BmBoard from './BmBoard';

export const metadata = {
  title: 'MONO BM 검증 보드',
  robots: { index: false, follow: false },
};

export default function BmPage() {
  return <BmBoard role="admin" />;
}
