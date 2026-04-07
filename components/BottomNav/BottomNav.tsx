import Link from 'next/link';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  return (
    <nav className={styles.bottomNav}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/" className={styles.navLink}>
            <div className={styles.iconWrapper}>
              {/* Home Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className={styles.label}>홈</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/career" className={styles.navLink}>
            <div className={styles.iconWrapper}>
              {/* Career Log Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <span className={styles.label}>커리어</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/attendance" className={styles.navLink}>
            <div className={styles.iconWrapper}>
              {/* Attendance Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <span className={styles.label}>출역</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/foreman" className={styles.navLink}>
            <div className={styles.iconWrapper}>
              {/* AI Foreman Icon (Brain Circuit style) */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.45 2.5 2.5 0 0 0-1.98 2.48 2.5 2.5 0 0 0 .5 4.9c-.3.2-.5.6-.5 1a2 2 0 0 0 4 0c0-.4-.2-.8-.5-1a2.5 2.5 0 0 0 .5-4.9c0-.4.1-.7.4-.9a2.5 2.5 0 1 0 3-4z" />
                <path d="M18 10a2 2 0 0 0-4 0c0 .4.2.8.5 1a2.5 2.5 0 0 0-.5 4.9c0 .4-.1.7-.4.9a2.5 2.5 0 1 0-3 4" />
                <path d="M6 10a2 2 0 0 1 4 0c0 .4-.2.8-.5 1a2.5 2.5 0 0 1 .5 4.9c0 .4.1.7.4.9a2.5 2.5 0 1 1-3 4" />
              </svg>
            </div>
            <span className={styles.label}>반장</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/settlement" className={styles.navLink}>
            <div className={styles.iconWrapper}>
              {/* Settlement Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className={styles.label}>정산</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
