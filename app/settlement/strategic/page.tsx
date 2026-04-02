import StrategicSettlementClient from './StrategicSettlementClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Strategic Settlement | MO-NO Masters',
    description: 'Track your project milestones and secure escrow-based settlements. Automated multi-currency financial management for global masters.',
};

export default function StrategicSettlementPage() {
    return <StrategicSettlementClient />;
}
