import WalletClient from './WalletClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'MONO Wallet | 내 일 기록과 받을 돈',
    description: '내가 일한 기록과 받을 돈을 한곳에서 안전하게 확인해요.',
};

export default function WalletPage() {
    return <WalletClient />;
}
