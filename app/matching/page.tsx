import MatchingClient from './MatchingClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Strategic Matching | MO-NO Masters',
    description: 'Connect your technical assets with high-value global projects. AI-driven project matching for infrastructure and plant masters.',
};

export default function MatchingPage() {
    return <MatchingClient />;
}
