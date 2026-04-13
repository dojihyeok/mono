import Trust360Client from './Trust360Client';

export const metadata = {
    title: 'Expert Trust 360 | Mutual Evaluation System',
    description: 'A multi-directional trust and reputation evaluation system for site foremen, team leaders, and experts.',
};

export default function Trust360Page() {
    return (
        <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Trust360Client />
        </main>
    );
}
