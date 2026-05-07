import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerBody}`}>
                <div className={styles.grid}>
                    {/* Brand */}
                    <div>
                        <div className={styles.brandLogo}>
                            <div className={styles.logoMark} />
                            <span className={styles.logoText}>MO-NO</span>
                        </div>
                        <p className={styles.brandDesc}>
                            모노(Mo-No)는 기술인의 모든 경험과 실력을 데이터화하여
                            정당한 가치로 인정받는 환경을 만드는 프리미엄 기술 파트너입니다.
                        </p>
                        <div className={styles.socialRow}>
                            <button className={styles.socialBtn}>K</button>
                            <button className={styles.socialBtn}>N</button>
                            <button className={styles.socialBtn}>Y</button>
                        </div>
                    </div>

                    {/* Service Links */}
                    <div>
                        <h4 className={styles.colTitle}>서비스</h4>
                        <div className={styles.links}>
                            <Link href="/jobs" className={styles.link}>일자리 찾기</Link>
                            <Link href="/technicians" className={styles.link}>기술 전문가</Link>
                            <Link href="/matching" className={styles.link}>프리미엄 매칭</Link>
                            <Link href="/foreman" className={styles.link}>현장 반장 AI</Link>
                            <Link href="/academy" className={styles.link}>모노 아카데미</Link>
                        </div>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className={styles.colTitle}>법적 고지</h4>
                        <div className={styles.links}>
                            <Link href="#" className={styles.link}>이용약관</Link>
                            <Link href="#" className={styles.link}>개인정보처리방침</Link>
                            <Link href="#" className={styles.link}>운영정책</Link>
                            <Link href="#" className={styles.link}>고객센터</Link>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.bottomLeft}>© 2026 Mono Inc. All rights reserved.</p>
                    <div className={styles.bottomRight}>
                        <div className={styles.goldDot} />
                        숙련된 기술의 가치를 증명하는 시간, 모노와 함께
                    </div>
                </div>
            </div>
        </footer>
    );
}
