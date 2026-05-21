import ShopClient from './ShopClient';

export const metadata = {
    title: 'MONO Expert Gear | Premium Working Fashion & Goods',
    description: 'The expert\'s signature gear. Premium signature workwear, high-tech tools, and gear packages for global professionals.',
};

export default function ShopPage() {
    return (
        <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <ShopClient />
        </main>
    );
}
