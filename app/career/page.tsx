import React from 'react';
import styles from './career.module.css';
import GlassCard from '@/components/UI/GlassCard';
import Button from '@/components/UI/Button';
import Navbar from '@/components/Navbar/Navbar';

export default function CareerPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>내 디지털 커리어 로그</h1>
          <p className={styles.subtitle}>김모노 님의 현장 경력이 안전하게 증명되고 있습니다.</p>
        </header>

        {/* Level & Stats */}
        <section className={styles.statsSection}>
          <GlassCard className={styles.levelCard}>
            <div className={styles.levelHeader}>
              <span className={styles.badge}>Master 레벨</span>
              <span className={styles.levelPoints}>7,420 P</span>
            </div>
            <div className={styles.progressBarWrapper}>
              <div className={styles.progressBar} style={{ width: '74%' }}></div>
            </div>
            <p className={styles.levelDesc}>다음 레벨(Grand Master)까지 2,580P 남았습니다.</p>
          </GlassCard>

          <div className={styles.grid2}>
            <GlassCard>
              <h3 className={styles.statLabel}>총 출역 일수</h3>
              <p className={styles.statValue}>342일</p>
            </GlassCard>
            <GlassCard>
              <h3 className={styles.statLabel}>누적 안전 점수</h3>
              <p className={styles.statValue}>98점</p>
            </GlassCard>
          </div>
        </section>

        {/* Recent History */}
        <section className={styles.historySection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>최근 현장 기록</h2>
            <Button variant="ghost" size="sm">전체보기</Button>
          </div>

          <div className={styles.historyList}>
            <GlassCard className={styles.historyItem}>
              <div className={styles.historyMeta}>
                <span className={styles.historyDate}>2026. 03. 25</span>
                <span className={styles.historyStatus}>정산 완료</span>
              </div>
              <h3 className={styles.historyTitle}>반도체 평택 캠퍼스 P4 신축 (배관)</h3>
              <p className={styles.historyCompany}>삼성엔지니어링</p>
            </GlassCard>

            <GlassCard className={styles.historyItem}>
              <div className={styles.historyMeta}>
                <span className={styles.historyDate}>2026. 03. 24</span>
                <span className={styles.historyStatus}>정산 완료</span>
              </div>
              <h3 className={styles.historyTitle}>반도체 평택 캠퍼스 P4 신축 (배관)</h3>
              <p className={styles.historyCompany}>삼성엔지니어링</p>
            </GlassCard>
          </div>
        </section>

        {/* Verifications & Badges */}
        <section className={styles.verificationSection}>
          <h2 className={styles.sectionTitle}>보유 자격 및 뱃지</h2>
          <div className={styles.badgeGrid}>
            <div className={styles.badgeItem}>
              <div className={styles.badgeIcon}>🏅</div>
              <span className={styles.badgeLabel}>무사고 300일</span>
            </div>
            <div className={styles.badgeItem}>
              <div className={styles.badgeIcon}>📜</div>
              <span className={styles.badgeLabel}>배관 기능장</span>
            </div>
            <div className={styles.badgeItem}>
              <div className={styles.badgeIcon}>🌏</div>
              <span className={styles.badgeLabel}>비자 Ready</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
