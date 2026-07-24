"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import styles from "./landing.module.css";

export function Hero({ onStart, onBrowse }: { onStart: () => void; onBrowse: () => void }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroGrid}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.heroKicker}>Partner Workspace</span>
          <h1 className={styles.heroTitle}>
            협력업체를 위한
            <br />
            프로젝트 운영 <em>Workspace</em>
          </h1>
          <div className={styles.heroFeatureRow}>
            {["프로젝트 관리", "인력 운영", "출역 관리", "문서 관리"].map((t) => (
              <span key={t} className={styles.heroFeatureChip}>
                {t}
              </span>
            ))}
          </div>
          <p className={styles.heroSub}>하나의 Workspace에서 모두 연결됩니다.</p>
          <div className={styles.heroActions}>
            <button className={styles.btnPrimary} onClick={onStart}>
              무료 시작하기 <ArrowRight size={17} strokeWidth={2.4} />
            </button>
            <button className={styles.btnGhost} onClick={onBrowse}>
              <PlayCircle size={17} strokeWidth={2.2} /> 데모 보기
            </button>
          </div>
          <div className={styles.heroMeta}>카드 등록 없이 바로 시작 · 언제든 해지 가능</div>
        </motion.div>

        <motion.div
          className={styles.mockupWrap}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.mockupGlow} />
          <div className={styles.mockup}>
            <div className={styles.mockupTitlebar}>
              <span className={styles.mockupDot} />
              <span className={styles.mockupDot} />
              <span className={styles.mockupDot} />
            </div>
            <div className={styles.mockupBody}>
              <div className={styles.mockupNav}>
                <div className={`${styles.mockupNavItem} ${styles.mockupNavItemActive}`}>홈</div>
                <div className={styles.mockupNavItem}>프로젝트</div>
                <div className={styles.mockupNavItem}>인력</div>
                <div className={styles.mockupNavItem}>출역</div>
                <div className={styles.mockupNavItem}>문서</div>
                <div className={styles.mockupNavItem}>리포트</div>
              </div>
              <div className={styles.mockupMain}>
                <div className={styles.mockupStatRow}>
                  <div className={styles.mockupStat}>
                    <div className={styles.mockupStatLabel}>진행 프로젝트</div>
                    <div className={styles.mockupStatValue}>12</div>
                  </div>
                  <div className={styles.mockupStat}>
                    <div className={styles.mockupStatLabel}>투입 인원</div>
                    <div className={styles.mockupStatValue}>84</div>
                  </div>
                  <div className={styles.mockupStat}>
                    <div className={styles.mockupStatLabel}>이번 달 출역</div>
                    <div className={styles.mockupStatValue}>1,240</div>
                  </div>
                </div>
                <div className={styles.mockupPanel}>
                  <div className={styles.mockupPanelTitle}>주간 출역 현황</div>
                  <div className={styles.mockupChartBars}>
                    {[38, 52, 44, 66, 58, 74, 61].map((h, i) => (
                      <div key={i} className={styles.mockupChartBar} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className={styles.mockupPanel}>
                  <div className={styles.mockupPanelTitle}>최근 활동</div>
                  <div className={styles.mockupRow}>
                    <span>힐스테이트 송도 · 형틀목공 3명 배정</span>
                    <span className={styles.mockupPill}>완료</span>
                  </div>
                  <div className={styles.mockupRow}>
                    <span>동탄 물류센터 · 출역 승인</span>
                    <span className={styles.mockupPill}>진행중</span>
                  </div>
                  <div className={styles.mockupRow}>
                    <span>세종 청사 증축 · 문서 업로드</span>
                    <span className={styles.mockupPill}>신규</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
