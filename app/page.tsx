'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, TrendingUp, BrainCircuit, CalendarCheck, Wrench, GraduationCap, MapPin } from 'lucide-react';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';

import Hero from '@/components/Hero/Hero';
import Features from '@/components/Features/Features';
import Footer from '@/components/Footer/Footer';

export default function Home() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="page-container">
        <Hero isLoggedIn={isLoggedIn} />
        <Features />
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.homeContainer}>
      <header className={styles.greetingSection}>
        <div className={styles.greetingText}>
          <span className={styles.brandBadge}>LEVEL 2 MASTER</span>
          <h1>안녕하세요, 기술자님</h1>
          <p className={styles.greetingSub}>오늘도 안전한 하루 되세요.</p>
        </div>
      </header>

      {/* 2. Main Status Card (Toss Style) */}
      <section className={styles.statusCard}>
        <div className={styles.statusHeader}>
          <div>
            <div className={styles.statusLabel}>나의 기술 점수</div>
            <h2 className={styles.statusValue}>865<span>점</span></h2>
          </div>
          <div className={styles.statusIcon}>
            <TrendingUp size={20} />
          </div>
        </div>
        <div className={styles.progressBox}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: '82%' }} />
          </div>
          <div className={styles.progressLabels}>
            <span>상위 12%</span>
            <span>다음 등급까지 135점</span>
          </div>
        </div>
      </section>

      {/* 3. AI Insights (Clean & Minimal) */}
      <section className={styles.insightCard}>
        <div className={styles.insightIcon}>
          <BrainCircuit size={20} />
        </div>
        <div className={styles.insightContent}>
          <h3>AI 맞춤 브리핑</h3>
          <p>
            평택 고소작업 단가가 어제보다 <strong>5,000원 상승</strong>했습니다. 
            조건에 맞는 현장이 3건 새로 올라왔어요.
          </p>
        </div>
      </section>

      {/* 4. Highlighted Opportunity */}
      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>추천 현장</h2>
          <Link href="/jobs" className={styles.seeAll}>전체보기</Link>
        </div>
        <div className={styles.jobCard}>
          <div className={styles.jobInfo}>
            <div className={styles.jobMatch}>98% 일치</div>
            <h3 className={styles.jobTitle}>삼성 고덕 반도체 배관공</h3>
            <p className={styles.jobLoc}>평택시 고덕동 | 일급 21만</p>
          </div>
          <div className={styles.jobAction}>
            <button className={styles.applyBtn}>지원하기</button>
          </div>
        </div>
      </section>

      {/* 5. Quick Service Grid */}
      <section className={styles.quickSection}>
        <h2 className={styles.sectionTitle}>서비스</h2>
        <div className={styles.quickGrid}>
          <Link href="/attendance" className={styles.quickItem}>
            <div className={styles.quickIconBox}><CalendarCheck size={24} /></div>
            <span>출퇴근</span>
          </Link>
          <Link href="/settlement" className={styles.quickItem}>
            <div className={styles.quickIconBox} style={{color: '#3182f6'}}><TrendingUp size={24} /></div>
            <span>정산</span>
          </Link>
          <Link href="/academy" className={styles.quickItem}>
            <div className={styles.quickIconBox} style={{color: '#30d158'}}><GraduationCap size={24} /></div>
            <span>아카데미</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
