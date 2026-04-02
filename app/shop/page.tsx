import ShopClient from './ShopClient';

export const metadata = {
    title: 'MO-NO Master Gear | Premium Working Fashion & Goods',
    description: 'The master\'s signature gear. Premium signature workwear, high-tech tools, and gear packages for global professionals.',
};

export default function ShopPage() {
    return (
        <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <ShopClient />
        </main>
    );
}
