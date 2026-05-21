import ProfileClient from './ProfileClient';

export const metadata = {
    title: 'Expert Professional Profile | MONO Experts',
    description: 'A premium professional profile for global experts showing trust, skills, and strategic deployment opportunities.',
};

export default function ProfilePage({ params }: { params: { id: string } }) {
    return (
        <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <ProfileClient id={params.id} />
        </main>
    );
}
