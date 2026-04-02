import ProfileClient from './ProfileClient';

export const metadata = {
    title: 'Master Professional Profile | MO-NO Masters',
    description: 'A premium professional profile for global masters showing trust, skills, and strategic deployment opportunities.',
};

export default function ProfilePage({ params }: { params: { id: string } }) {
    return (
        <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <ProfileClient id={params.id} />
        </main>
    );
}
