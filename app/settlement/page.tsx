import SettlementClient from './SettlementClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Master Settlement | MO-NO Real-time Wallet',
    description: '기술인을 위한 실시간 일일 정산 및 에스크로 보호 시스템 서비스.',
};

export default async function SettlementPage() {
    // For now, we'll fetch data for the first technician in our seed
    const tech = await prisma.technician.findFirst();
    const transactions = tech 
        ? await prisma.transaction.findMany({
            where: { technicianId: tech.id },
            orderBy: { date: 'desc' }
          })
        : [];

    return <SettlementClient initialTransactions={transactions} />;
}
