import FieldPassV2Client from '../field-pass-v2/FieldPassV2Client';

// 이 페이지는 세션 내내 반복 수정되는 투자자·파트너 공유 자료라, 정적 페이지 기본값인
// s-maxage=31536000(1년) 캐시로 배포 직후에도 오래된 내용이 브라우저/프록시에 남는
// 문제가 있었음. 캐시 수명을 짧게 재검증하도록 설정.
export const revalidate = 60;

export const metadata = {
  title: 'MONO Field Pass Initiative',
  description: '건설올패스와 MONO 앱, 센스톤의 인증 기술을 연결하는 MONO × SSenStone 공동 프로젝트 제안 — MONO Field Pass Initiative',
  robots: { index: false, follow: false },
};

// 공동 프로젝트 제안서(Initiative)로 전면 교체. "제품(Product)"이 아니라
// "공동 프로젝트(Initiative)"로 읽히도록 브랜드 표기를 바꿨다.
// 구 버전은 git tag `field-pass-v1-legacy-20260715`(원조), `566f086`(v2 7섹션)로 보존.
export default function FieldPassPage() {
  return <FieldPassV2Client />;
}
