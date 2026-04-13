import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerBody}`}>
                <div className={styles.grid}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', letterSpacing: '0.05em' }}>
                            MO-NO
                        </h3>
                        <p className={styles.brandDesc}>
                            모노(Mo-No)는 기술인의 모든 경험과 실력을 데이터화하여<br />
                            정당한 가치로 인정받는 환경을 만드는 프리미엄 기술 파트너입니다.<br />
                            우리의 기술이 곧 자산이 되는 내일, 모노가 함께합니다.
                        </p>
                    </div>

                    <div>
                        <h4 className={styles.colTitle}>서비스</h4>
                        <div className={styles.links}>
                            <Link href="/jobs" className={styles.link}>일자리 찾기</Link>
                            <Link href="/technicians" className={styles.link}>기술 전문가</Link>
                            <Link href="/matching" className={styles.link}>프리미엄 매칭</Link>
                            <Link href="/academy" className={styles.link}>교육 프로그램</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className={styles.colTitle}>법적 고지</h4>
                        <div className={styles.links}>
                            <Link href="#" className={styles.link}>이용약관</Link>
                            <Link href="#" className={styles.link} style={{ color: 'rgba(255,255,255,0.6)' }}>개인정보처리방침</Link>
                            <Link href="#" className={styles.link}>운영정책</Link>
                            <Link href="#" className={styles.link}>고객센터</Link>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; 2026 Mono Inc. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.1)' }}>숙련된 기술의 가치를 증명하는 시간, 모노와 함께</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
