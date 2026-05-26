import TechniciansClient from './TechniciansClient';
import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import { Technician } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function TechniciansPage() {
    let technicians: Technician[] = [];

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
