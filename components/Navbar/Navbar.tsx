import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <header className={styles.header}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logo}>
                    MO-NO
                </Link>

                <nav className={styles.navLinks}>
                    <Link href="/jobs" className={styles.navLink}>채용 현장</Link>
                    <Link href="/technicians" className={styles.navLink}>기술 전문가</Link>
                    <Link href="/foreman" className={styles.navLink}>현장 비서 (AI)</Link>
                    <Link href="/matching" className={styles.navLink}>프리미엄 매칭</Link>
                    <Link href="/academy" className={styles.navLink}>모노 아카데미</Link>
                </nav>

                <div className={styles.ctaGroup}>
                    {/* Notification Icon */}
                    <button className={styles.iconButton} aria-label="Notifications">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                    </button>
                    {/* Profile/Menu Icon */}
                    <button className={styles.iconButton} aria-label="Menu">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 16v-4"></path>
                            <path d="M12 8h.01"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}
