import FieldPassClient from './FieldPassClient';

// 이 페이지는 세션 내내 반복 수정되는 투자자·파트너 공유 자료라, 정적 페이지 기본값인
// s-maxage=31536000(1년) 캐시로 배포 직후에도 오래된 내용이 브라우저/프록시에 남는
// 문제가 있었음. 캐시 수명을 짧게 재검증하도록 설정.
export const revalidate = 60;

export const metadata = {
  title: 'MONO Field Pass',
  description: '일용직에서 건설근로자로, 출입카드에서 현장 권한 인프라로 — MONO Field Pass 소개',
  robots: { index: false, follow: false },
};

export default function FieldPassPage() {
  return <FieldPassClient />;
}
