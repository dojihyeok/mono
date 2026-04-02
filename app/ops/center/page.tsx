import OpsCenterClient from './OpsCenterClient';

export const metadata = {
    title: 'Global Site Command Center | MO-NO Masters',
    description: 'Real-time site management and equipment telemetry for global masters on duty.',
};

export default function OpsCenterPage() {
    return (
        <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <OpsCenterClient />
        </main>
    );
}
