import Navbar from '@/components/Navbar/Navbar';
import TechniciansClient from './TechniciansClient';
import { prisma } from '@/lib/prisma';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function TechniciansPage() {
    const technicians = await prisma.technician.findMany();

    return (
        <div className={styles.pageWrap}>
            <Navbar />
            <TechniciansClient initialTechnicians={technicians} />
        </div>
    );
}
