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
          <h1>안녕하세요, 기술자님</h1>
        </div>
      </header>

      {/* 2. Growth Stage Card */}
      <section className={styles.growthCard}>
        <div className={styles.growthHeader}>
          <div>
            <div className={styles.growthLabel}>현재 성장 단계</div>
            <h2 className={styles.growthStep}>STEP 02</h2>
            <p className={styles.growthDesc}>전문 기술 마스터 과정 중</p>
          </div>
          <div className={styles.trendIcon}>
            <TrendingUp size={24} />
          </div>
        </div>
        <div className={styles.progressContainer}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: '65%' }} />
          </div>
          <span className={styles.progressText}>다음 단계까지 35%</span>
        </div>
      </section>

      {/* 3. AI Briefing Card */}
      <section className={styles.aiBriefingCard}>
        <div className={styles.aiBadge}>
          <BrainCircuit size={20} />
        </div>
        <div className={styles.aiContent}>
          <h3>모컬 AI 오늘의 브리핑</h3>
          <p>
            오늘 평택 지역은 맑음이며, 고소작업 단가가 어제보다 5% 상승했습니다. 
            기술자님의 선호 조건에 맞는 새로운 현장이 3건 등록되었습니다.
          </p>
        </div>
      </section>

      {/* 4. Premium Matching */}
      <section>
        <h2 className={styles.sectionHeading}>내일의 맞춤형 우수 현장</h2>
        <div className={styles.jobCard}>
          <div className={styles.jobBadge}>현장 적합도 98%</div>
          <h3 className={styles.jobTitle}>반도체 플랜트 고소작업 (배관)</h3>
          <div className={styles.jobMeta}>
            <MapPin size={14} /> 평택 삼성 고덕 현장
          </div>
          <div className={styles.jobPay}>
            210,000<span>원 / 일급</span>
          </div>
          <div className={styles.jobActions}>
            <button className={styles.rejectBtn}>거절하기</button>
            <button className={styles.acceptBtn}>수락하기</button>
          </div>
        </div>
      </section>

      {/* 5. Quick Access Grid */}
      <section>
        <h2 className={styles.sectionHeading}>바로가기</h2>
        <div className={styles.quickGrid}>
          <Link href="/attendance" className={styles.quickItem}>
            <CalendarCheck className={styles.quickIcon} size={28} />
            <span className={styles.quickLabel}>내 일정</span>
          </Link>
          <Link href="/equipment" className={styles.quickItem}>
            <Wrench className={styles.quickIcon} size={28} />
            <span className={styles.quickLabel}>장비 대여</span>
          </Link>
          <Link href="/academy" className={styles.quickItem}>
            <GraduationCap className={styles.quickIcon} size={28} />
            <span className={styles.quickLabel}>아카데미</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
