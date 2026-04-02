import DashboardClient from './DashboardClient';

export const metadata = {
    title: 'Master Dashboard | MO-NO Technical Assetization',
    description: '관리자 및 기술 마스터를 위한 경력 기반 디지털 자격 증명 대시보드.',
};

export default function DashboardPage() {
    return <DashboardClient />;
}
