'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Bell, 
  TrendingUp, 
  BrainCircuit, 
  CalendarCheck, 
  Wrench, 
  GraduationCap, 
  MapPin, 
  Globe, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className={styles.homeContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <header className={styles.greetingSection}>
        <div className={styles.greetingText}>
          <div className={styles.levelBadge}>
            <ShieldCheck size={12} />
            <span>LEVEL 2 MASTER</span>
          </div>
          <h1>반갑습니다, 이마스터님</h1>
          <p className={styles.greetingSub}>오늘도 최상의 컨디션으로 안전 작업하세요.</p>
        </div>
        <div className={styles.notifyBtn}>
          <Bell size={22} />
          <div className={styles.notifyDot} />
        </div>
      </header>

      {/* 2. Main Status Card */}
      <motion.section variants={itemVariants}>
        <div className={styles.statusCard}>
          <div className={styles.statusHeader}>
            <div>
              <div className={styles.statusLabel}>나의 기술 신뢰도</div>
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
              <span>상위 12% 마스터</span>
              <span>다음 레벨까지 135점</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 3. AI Insights */}
      <motion.section variants={itemVariants}>
        <div className={styles.insightCard}>
          <div className={styles.insightIcon}>
            <BrainCircuit size={20} />
          </div>
          <div className={styles.insightContent}>
            <h3>AI 정산 브리핑</h3>
            <p>
              이번 주 정산 예정 금액은 <strong>124만원</strong>입니다. 
              기술 지표 분석 결과, 평택 P4 현장의 단가가 상향 조정되었습니다.
            </p>
          </div>
          <ChevronRight size={16} className={styles.insightArrow} />
        </div>
      </motion.section>

      {/* 4. Global Exploration */}
      <motion.section variants={itemVariants}>
        <Link href="/global-jobs" className={styles.globalBanner}>
          <div className={styles.globalContent}>
            <div className={styles.globalLabel}>GLOBAL MASTER PROJECT</div>
            <h3>전 세계 마스터와 연결되세요</h3>
            <p>사우디 네옴시티, 호주 플랜트 등 글로벌 현장 탐색</p>
          </div>
          <div className={styles.globalIcon}>
            <Globe size={32} />
          </div>
        </Link>
      </motion.section>

      {/* 5. Highlighted Opportunity */}
      <motion.section variants={itemVariants}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>추천 매칭 현장</h2>
          <Link href="/jobs" className={styles.seeAll}>전체보기</Link>
        </div>
        <div className={styles.jobCard}>
          <div className={styles.jobInfo}>
            <div className={styles.jobMatch}>98% 연결</div>
            <h3 className={styles.jobTitle}>삼성 고덕 반도체 배관공</h3>
            <p className={styles.jobLoc}>평택시 고덕동 · 일급 21만</p>
          </div>
          <div className={styles.jobAction}>
            <button className={styles.applyBtn}>즉시 지원</button>
          </div>
        </div>
      </motion.section>

      {/* 6. Quick Service Grid */}
      <motion.section variants={itemVariants} className={styles.quickSection}>
        <h2 className={styles.sectionTitle}>주요 서비스</h2>
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
            <span>성장</span>
          </Link>
          <Link href="/shop" className={styles.quickItem}>
            <div className={styles.quickIconBox} style={{color: '#D4AF37'}}><Wrench size={24} /></div>
            <span>스토어</span>
          </Link>
        </div>
      </motion.section>
    </motion.div>
  );
}
