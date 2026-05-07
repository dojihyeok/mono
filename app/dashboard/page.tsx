import DashboardClient from './DashboardClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Master Dashboard | MO-NO Technical Assetization',
    description: '관리자 및 기술 마스터를 위한 경력 기반 디지털 자격 증명 대시보드.',
};

export default async function DashboardPage() {
    let tech = null;
    let transactions: any[] = [];

    try {
        tech = await prisma.technician.findFirst();
        if (tech) {
            transactions = await prisma.transaction.findMany({
                where: { technicianId: tech.id },
                orderBy: { date: 'desc' }
            });
        }
    } catch (e) {
        // DB not available at build time — handled gracefully
    }

    return <DashboardClient technician={tech} transactions={transactions} />;
}
