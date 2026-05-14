import Link from 'next/link';
import { Camera, Play, MessageCircle } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerBody}`}>
                <div className={styles.grid}>
                    {/* Brand */}
                    <div className={styles.brandCol}>
                        <div className={styles.brandLogo}>
                            <div className={styles.logoMark} />
                            <span className={styles.logoText}>MONO</span>
                        </div>
                        <p className={styles.brandDesc}>
                            모노(MoNo)는 파편화된 현장 노동을 데이터로 기록하여 기술자의 경력 형성부터
                            글로벌 진출까지 모든 생애 주기를 함께하는 통합 커리어 관리 플랫폼입니다.
                        </p>
                        <div className={styles.socialRow}>
                            <Link href="#" className={styles.socialBtn} aria-label="KakaoTalk">
                                <MessageCircle size={18} />
                            </Link>
                            <Link href="#" className={styles.socialBtn} aria-label="Instagram">
                                <Camera size={18} />
                            </Link>
                            <Link href="#" className={styles.socialBtn} aria-label="YouTube">
                                <Play size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* Service Links */}
                    <div className={styles.linkCol}>
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
                    <div className={styles.linkCol}>
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
