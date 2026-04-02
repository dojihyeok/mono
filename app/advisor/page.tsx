import AdvisorClient from './AdvisorClient';

export const metadata = {
    title: 'MONO AI | Strategic Career Advisor',
    description: 'Data-driven career asset management and global project matching advisor for masters.',
};

export default function AdvisorPage() {
    return (
        <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <AdvisorClient />
        </main>
    );
}
