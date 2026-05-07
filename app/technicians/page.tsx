import TechniciansClient from './TechniciansClient';
import { prisma } from '@/lib/prisma';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function TechniciansPage() {
    let technicians: any[] = [];

    try {
        technicians = await prisma.technician.findMany();
    } catch (e) {
        // DB not available at build time — handled gracefully
    }

    return (
        <div className={styles.pageWrap}>
            <TechniciansClient initialTechnicians={technicians} />
        </div>
    );
}
