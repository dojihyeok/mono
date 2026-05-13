import AdminClient from './AdminClient';

export const metadata = {
    title: 'MoNo Control Center | Admin Portal',
    description: 'MoNo 플랫폼 최고 관리자: 파트너, 인력, 금융, 렌탈 장비 관리 및 데이터 분석 통합 관제 센터',
};

export default function AdminPage() {
    return <AdminClient />;
}
