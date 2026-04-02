import WelfareClient from './WelfareClient';

export const metadata = {
    title: 'Global Welfare & Finance Hub | MO-NO Masters',
    description: '해외 근무 마스터를 위한 통합 금융 복지 허브. 실시간 외화 송금 내역, 글로벌 상해 보험 및 국가별 공적 연금 추적 서비스.',
};

export default function WelfarePage() {
    return <WelfareClient />;
}
