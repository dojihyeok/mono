import MonetizeClient from './MonetizeClient';

export const metadata = {
    title: 'Master Asset Monetize Hub | MO-NO Revenue Strategy',
    description: 'The core business hub for evening maintenance side-hustles, equipment rental, and AI-driven R&R strategies.',
};

export default function MonetizePage() {
    return (
        <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <MonetizeClient />
        </main>
    );
}
