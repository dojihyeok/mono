import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar/Navbar';
import styles from './page.module.css';
import JobsClient from './JobsClient';

export const dynamic = 'force-dynamic';

export default async function JobsPage() {
    const initialJobs = await prisma.jobSite.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className={styles.pageWrap}>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>실시간 일자리</h1>
                    <p className={styles.subtitle}>오늘 바로 일할 수 있는 현장을 찾아보세요.</p>
                </div>

                <JobsClient initialJobs={initialJobs} />
            </div>
        </div>
    );
}

