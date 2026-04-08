import Navbar from '@/components/Navbar/Navbar';
import ForemanClient from './ForemanClient';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default function ForemanPage() {
    return (
        <div className={styles.pageWrap}>
            <Navbar />
            <div className={styles.container}>
                <ForemanClient />
            </div>
        </div>
    );
}
