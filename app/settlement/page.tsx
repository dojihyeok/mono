import SettlementClient from './SettlementClient';

export const metadata = {
    title: 'Master Settlement | MO-NO Real-time Wallet',
    description: '기술인을 위한 실시간 일일 정산 및 에스크로 보호 시스템 서비스.',
};

export default function SettlementPage() {
    return <SettlementClient />;
}
