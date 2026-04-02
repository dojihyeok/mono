import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Mono</h3>
                        <p className={styles.brandDesc}>
                            Navigate Your Skill, Navigate The World.<br />
                            물리적 노동을 글로벌 커리어 자산으로 전환하는<br />
                            프리미엄 테크 마스터 플랫폼
                        </p>
                    </div>

                    <div>
                        <h4 className={styles.colTitle}>서비스</h4>
                        <div className={styles.links}>
                            <Link href="/" className={styles.link}>서비스 소개</Link>
                            <Link href="/technicians" className={styles.link}>전문가 찾기</Link>
                            <Link href="/jobs" className={styles.link}>일자리 찾기</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className={styles.colTitle}>법적 고지</h4>
                        <div className={styles.links}>
                            <Link href="#" className={styles.link}>이용약관</Link>
                            <Link href="#" className={styles.link}>개인정보처리방침</Link>
                            <Link href="#" className={styles.link}>사업자 정보</Link>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; 2026 Mono Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
