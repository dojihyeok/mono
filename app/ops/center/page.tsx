import OpsCenterClient from './OpsCenterClient';

export const metadata = {
    title: '글로벌 현장 실시간 현황 | MO-NO Masters',
    description: '글로벌 마스터를 위한 실시간 현장 관리 및 장비 현황 대시보드입니다.',
};

export default function OpsCenterPage() {
    return (
        <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <OpsCenterClient />
        </main>
    );
}
