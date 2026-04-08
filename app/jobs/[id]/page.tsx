import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import JobDetailClient from './JobDetailClient';
import Navbar from '@/components/Navbar/Navbar';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

// Mock data for hardcoded u1, u2 from UrgentRecruitment
const MOCK_URGENT_JOBS: Record<string, any> = {
    'u1': {
        id: 'u1',
        title: '성수동 카페거리 상가 폐기물 긴급 양중',
        location: '서울 성동구 성수동',
        pay: '180,000',
        dailyWage: 180000,
        time: '즉시 투입 (ASAP)',
        category: 'Heavy-Tech',
        specialty: '일반작업 (자재양중)',
        description: '성수동 카페거리 상가 리모델링 현장에서 발생하는 폐기물을 수거 전 수집하는 작업입니다. 엘리베이터가 없는 3층 건물이므로 완력이 있는 분 우대합니다. 작업복과 안전화는 개인 지참 필수입니다.',
        isUrgent: true,
        status: 'Recruiting'
    },
    'u2': {
        id: 'u2',
        title: '강남역 인근 병원 인테리어 철거 보조',
        location: '서울 서초구 강남역',
        pay: '170,000',
        dailyWage: 170000,
        time: '오늘 오전 10:00 까지',
        category: 'Heavy-Tech',
        specialty: '철거보조',
        description: '강남역 인근 내과 인테리어 변경에 따른 가벽 철거 보조 작업입니다. 단순 해체 자재 운반 및 뒷정리가 주 업무입니다. 철거 전문가 2명과 함께 작업하며 지시에 잘 따라주실 분을 구합니다.',
        isUrgent: true,
        status: 'Recruiting'
    }
};

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let job;

    // Check if it's a mock ID
    if (id && typeof id === 'string' && id.startsWith('u')) {
        job = MOCK_URGENT_JOBS[id];
    } else {
        // Try to fetch from DB
        const jobId = parseInt(id);
        if (!isNaN(jobId)) {
            job = await prisma.jobSite.findUnique({
                where: { id: jobId }
            });
        }
    }

    if (!job) {
        notFound();
    }

    return (
        <div className={styles.pageWrap}>
            <Navbar />
            <JobDetailClient job={job} />
        </div>
    );
}
