import MonetizeClient from './MonetizeClient';

export const metadata = {
    title: '모노 - 장비로 돈 벌기 및 관리',
    description: '퇴근 후 저녁 일거리 찾기, 장비 빌려주기, 그리고 똑똑한 장비 관리까지 마스터님을 위해 준비했습니다.',
};

export default function MonetizePage() {
    return (
        <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <MonetizeClient />
        </main>
    );
}
