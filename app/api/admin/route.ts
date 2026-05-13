import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Fetch aggregated data for the Admin Dashboard
        
        // 1. Overview Stats
        const totalPartners = await prisma.partner.count();
        const totalTechnicians = await prisma.technician.count();
        const partners = await prisma.partner.findMany({
            orderBy: { totalPaid: 'desc' }
        });
        
        const gmvResult = await prisma.partner.aggregate({
            _sum: { totalPaid: true }
        });
        const totalGMV = gmvResult._sum.totalPaid || 0;

        // 2. Finance / Escrow
        const pendingEscrowResult = await prisma.transaction.aggregate({
            where: { status: 'Locked' },
            _sum: { amount: true }
        });
        const pendingEscrow = pendingEscrowResult._sum.amount || 0;

        const settledResult = await prisma.transaction.aggregate({
            where: { status: 'Settled' },
            _sum: { amount: true }
        });
        const totalSettled = settledResult._sum.amount || 0;

        const transactions = await prisma.transaction.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        // 3. Rentals
        const rentals = await prisma.rental.findMany({
            include: { technician: true },
            orderBy: { status: 'desc' }
        });

        // 4. Marketing / Finance Products
        const financeProducts = await prisma.financeProduct.findMany();
        
        // Count eligible users for the first finance product as an example
        const eligibleUsersCount = await prisma.technician.count({
            where: { trustScore: { gte: financeProducts[0]?.minTrustScore || 85 } }
        });

        return NextResponse.json({
            overview: {
                totalGMV,
                totalPartners,
                totalTechnicians,
                partners
            },
            finance: {
                pendingEscrow,
                totalSettled,
                transactions
            },
            rentals,
            marketing: {
                financeProducts,
                eligibleUsersCount
            }
        });

    } catch (error) {
        console.error('Admin API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch admin data' }, { status: 500 });
    }
}
