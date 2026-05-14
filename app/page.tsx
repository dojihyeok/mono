'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Wallet, 
  Coins, 
  TrendingUp, 
  BrainCircuit, 
  CalendarCheck, 
  Wrench, 
  GraduationCap, 
  Globe, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Briefcase,
  Users
} from 'lucide-react';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';

import Hero from '@/components/Hero/Hero';
import ProblemSection from '@/components/ProblemSection/ProblemSection';
import Features from '@/components/Features/Features';
import Footer from '@/components/Footer/Footer';

export default function Home() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="page-container">
        <Hero isLoggedIn={isLoggedIn} />
        <ProblemSection />
        <Features />
        <Footer />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className={styles.homeContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Super App Header */}
      <header className={styles.nativeHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.avatarMini}>
            <div className={styles.avatarInner}>L</div>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.greetingText}>좋은 아침입니다!</span>
            <div className={styles.userNameArea}>
                <span className={styles.userName}>이종두</span>
                <div className={styles.masterBadge}><ShieldCheck size={10} /> MASTER</div>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.iconBtn}><Search size={22} /></button>
          <button className={styles.iconBtn}>
            <Bell size={22} />
            <div className={styles.notifyDot} />
          </button>
        </div>
      </header>

      {/* 2. Asset & Balance Card (Toss-Style) */}
      <motion.section variants={itemVariants} className={styles.section}>
        <div className={styles.assetCard}>
            <div className={styles.assetItem}>
                <div className={styles.assetInfo}>
                    <div className={styles.assetLabel}><Wallet size={14} /> 나의 월간 예상 수익</div>
                    <div className={styles.assetValue}>₩ 8,420,000</div>
                </div>
                <button className={styles.miniBtn}>정산</button>
            </div>
            <div className={styles.divider} />
            <div className={styles.assetItem}>
                <div className={styles.assetInfo}>
                    <div className={styles.assetLabel}><Coins size={14} /> 보유 모노포인트</div>
                    <div className={styles.assetValue}>12,450 <span>P</span></div>
                </div>
                <button className={styles.miniBtnGhost}>교환</button>
            </div>
        </div>
      </motion.section>

      {/* 3. Quick Action Grid (4x2) */}
      <motion.section variants={itemVariants} className={styles.section}>
        <div className={styles.quickGrid}>
          {[
            { id: 'jobs', icon: Zap, label: '현장매칭', color: '#3182f6' },
            { id: 'attendance', icon: CalendarCheck, label: '출퇴근', color: '#30d158' },
            { id: 'settlement', icon: TrendingUp, label: '정산관리', color: '#ff9f0a' },
            { id: 'academy', icon: GraduationCap, label: '성장코칭', color: '#af52de' },
            { id: 'shop', icon: Wrench, label: '스토어', color: '#D4AF37' },
            { id: 'global', icon: Globe, label: '해외파견', color: '#00c7be' },
            { id: 'career', icon: Briefcase, label: '경력인증', color: '#5856d6' },
            { id: 'community', icon: Users, label: '커뮤니티', color: '#ff453a' },
          ].map(item => (
            <Link href={`/${item.id}`} key={item.id} className={styles.quickItem}>
              <div className={styles.quickIcon} style={{ background: `${item.color}15`, color: item.color }}>
                <item.icon size={26} />
              </div>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* 4. AI Insight Feed */}
      <motion.section variants={itemVariants} className={styles.section}>
        <div className={styles.feedCard}>
            <div className={styles.feedIcon}><BrainCircuit size={20} /></div>
            <div className={styles.feedContent}>
                <span className={styles.feedTag}>AI 맞춤 제안</span>
                <p>평택 P4 반도체 현장에서 마스터님의 기술을 필요로 합니다. <strong>일급 24만원</strong> 조정 가능.</p>
            </div>
            <ChevronRight size={18} className={styles.feedArrow} />
        </div>
      </motion.section>

      {/* 5. Career Pulse */}
      <motion.section variants={itemVariants} className={styles.section}>
        <div className="section-title">
            <h3>성장 및 매칭</h3>
            <Link href="/matching" className="view-all">전체보기</Link>
        </div>
        <div className={styles.jobCardLarge}>
            <div className={styles.jobBadge}>추천도 98%</div>
            <div className={styles.jobMain}>
                <div className={styles.jobInfo}>
                    <h4>삼성전자 평택 배관공</h4>
                    <p>평택시 고덕동 · 일급 22~24만</p>
                </div>
                <div className={styles.jobLogo}>S</div>
            </div>
            <div className={styles.jobFooter}>
                <div className={styles.jobTags}>
                    <span>#즉시투입</span>
                    <span>#숙소제공</span>
                    <span>#야간수당</span>
                </div>
                <button className={styles.applyBtn}>지원하기</button>
            </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
