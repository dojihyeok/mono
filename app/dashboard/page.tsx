import DashboardClient from './DashboardClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Master Dashboard | MO-NO Technical Assetization',
    description: '관리자 및 기술 마스터를 위한 경력 기반 디지털 자격 증명 대시보드.',
};

export default async function DashboardPage() {
    // For now, we'll fetch data for the first technician in our seed
    const tech = await prisma.technician.findFirst();
    const transactions = tech 
        ? await prisma.transaction.findMany({
            where: { technicianId: tech.id },
            orderBy: { date: 'desc' }
          })
        : [];

    return <DashboardClient technician={tech} transactions={transactions} />;
}
