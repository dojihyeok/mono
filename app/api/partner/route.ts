import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Fetch data for the Partner Dashboard
        // For demonstration, we assume we are fetching data for the first Partner in the DB
        const partner = await prisma.partner.findFirst();
        
        if (!partner) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        // Fetch jobs (sites) created by this partner. Currently, jobs aren't strictly linked to a partnerId in the schema,
        // so we'll fetch all jobs as a demonstration of "My Sites".
        const sites = await prisma.jobSite.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Fetch transactions for settlement tab
        const transactions = await prisma.transaction.findMany({
            where: { status: 'Locked' },
            orderBy: { createdAt: 'desc' }
        });

        // Mock data for attendance and evaluation that would normally be linked to JobSites
        const attendance = [
            { id: 1, name: 'Young-Hoon Kim (타일 전문가)', siteName: '강남 고급 빌라 대형 타일 시공', time: '07:50 AM 도착 확인됨' },
            { id: 2, name: 'Min-Soo Lee (목수)', siteName: '판교 테크노밸리 신축 사옥 설비', time: '08:05 AM 도착 확인됨' }
        ];

        const evaluations = [
            { id: 1, name: 'Ji-Sung Park (설비 전문가)', siteName: '판교 테크노밸리 신축 사옥 설비 (작업 종료)' }
        ];

        return NextResponse.json({
            partner,
            sites,
            transactions,
            attendance,
            evaluations
        });

    } catch (error) {
        console.error('Partner API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch partner data' }, { status: 500 });
    }
}
