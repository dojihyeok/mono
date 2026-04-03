import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>모노 (Mono)</h3>
                        <p className={styles.brandDesc}>
                            기술로 길을 열고, 세계로 나가가세요.<br />
                            마스터님의 소중한 땀방울을 가치 있는 경력으로<br />
                            만들어드리는 프리미엄 기술 파트너
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
