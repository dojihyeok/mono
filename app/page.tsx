'use client';

import React, { useState, useEffect } from 'react';
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
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';

import Hero from '@/components/Hero/Hero';
import ProblemSection from '@/components/ProblemSection/ProblemSection';
import Features from '@/components/Features/Features';
import Footer from '@/components/Footer/Footer';
import PreparingModal from '@/components/UI/PreparingModal';

export default function Home() {
  const { isLoggedIn } = useAuth();
  const [demoStage, setDemoStage] = useState<string>('IDLE');
  
  // PreparingModal state
  const [isPreparingModalOpen, setIsPreparingModalOpen] = useState(false);
  const [preparingFeatureName, setPreparingFeatureName] = useState('');
  const [preparingTitle, setPreparingTitle] = useState('');
  const [preparingDesc, setPreparingDesc] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      // Sync demo stage from localStorage
      const savedStage = localStorage.getItem('mono_demo_stage') || 'IDLE';
      setDemoStage(savedStage);

      // Listen for storage changes
      const handleStorageChange = () => {
        const currentStage = localStorage.getItem('mono_demo_stage') || 'IDLE';
        setDemoStage(currentStage);
      };

      window.addEventListener('storage', handleStorageChange);
      
      // Also check periodically for smoother developer testing
      const interval = setInterval(handleStorageChange, 1000);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    }
  }, [isLoggedIn]);

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

  // Get dynamic content for the Today's Status Card
  const getStatusCardContent = () => {
    switch (demoStage) {
      case 'APPLIED':
        return {
          pillText: '확인 대기 중',
          pillColor: '#ff9f0a',
          pillBg: 'rgba(255, 159, 10, 0.1)',
          title: '신청한 현장에서 확인 중이에요',
          subtitle: '회사에서 기술카드 검수 중입니다. 확정 결과를 잠시 기다려 주세요.',
          btnText: '신청 현황 보기',
          href: '/jobs',
          secondary: true
        };
      case 'CONFIRMED':
        return {
          pillText: '출역 확정',
          pillColor: '#30d158',
          pillBg: 'rgba(48, 209, 88, 0.1)',
          title: '오늘 일할 곳이 확정됐어요',
          subtitle: '출근 전 필요한 준비물과 현장 위치를 다시 한번 확인해 보세요.',
          btnText: '출근 확인 및 준비하기',
          href: '/attendance',
          secondary: false
        };
      case 'CHECKED_IN':
        return {
          pillText: '근무 중',
          pillColor: '#00c7be',
          pillBg: 'rgba(0, 199, 190, 0.1)',
          title: '출근 완료 확인되었습니다',
          subtitle: '안전 장비 착용 상태를 유지해 주시고, 오늘도 안전하게 일해요!',
          btnText: '퇴근 등록하러 가기',
          href: '/attendance',
          secondary: false
        };
      case 'CHECKED_OUT':
        return {
          pillText: '확인 대기',
          pillColor: '#8e8e93',
          pillBg: 'rgba(142, 142, 147, 0.1)',
          title: '오늘 일한 기록을 확인 중이에요',
          subtitle: '퇴근 기록이 현장 담당자에게 전송되었습니다. 확인 완료 시 기술카드에 즉시 기록됩니다.',
          btnText: '받을 금액 정보 보기',
          href: '/settlement',
          secondary: true
        };
      case 'PAID':
        return {
          pillText: '정산 완료',
          pillColor: '#5856d6',
          pillBg: 'rgba(88, 86, 214, 0.1)',
          title: '지급이 완료됐어요',
          subtitle: '오늘 현장의 수당이 안전하게 정산되어 등록된 계좌로 지급되었습니다.',
          btnText: '지급 내역 확인하기',
          href: '/settlement',
          secondary: false
        };
      case 'IDLE':
      default:
        return {
          pillText: '배정 예정 없음',
          pillColor: '#8e8e93',
          pillBg: 'rgba(142, 142, 147, 0.1)',
          title: '오늘 갈 현장을 찾아볼까요?',
          subtitle: 'Aaron님의 희망 직종과 기술 수준에 딱 맞는 일자리가 대기 중입니다.',
          btnText: '일자리 찾으러 가기',
          href: '/jobs',
          secondary: false
        };
    }
  };

  const statusCard = getStatusCardContent();

  const handleQuickActionClick = (id: string, label: string, e: React.MouseEvent) => {
    const excluded = ['academy', 'shop', 'global', 'community'];
    if (excluded.includes(id)) {
      e.preventDefault();
      setPreparingFeatureName(label);
      if (id === 'global') {
        setPreparingTitle('공식 해외 파견 기능을 준비하고 있어요');
        setPreparingDesc('해외 현장과의 직접 배차 매칭, 비자 자동 연동 및 글로벌 의료 지원 서비스를 준비 중입니다.');
      } else if (id === 'academy') {
        setPreparingTitle('성장코칭 아카데미 기능을 준비하고 있어요');
        setPreparingDesc('기술 등급을 올릴 수 있는 맞춤형 교육 코칭 및 이수증 자동 연동 서비스를 구성하고 있습니다.');
      } else if (id === 'shop') {
        setPreparingTitle('보호구 스토어 기능을 준비하고 있어요');
        setPreparingDesc('현장에서 검증된 필수 보호구 및 장비를 특가에 구매 또는 장기 대여하는 쇼핑몰을 준비하고 있습니다.');
      } else if (id === 'community') {
        setPreparingTitle('현장 이야기 커뮤니티를 준비하고 있어요');
        setPreparingDesc('실명과 인증된 경력을 기반으로 건설 현장의 단가 정보와 실시간 상황을 투명하게 나누는 커뮤니티입니다.');
      }
      setIsPreparingModalOpen(true);
    }
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
            <div className={styles.avatarInner}>A</div>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.greetingText}> Aaron님, 반가워요!</span>
            <div className={styles.userNameArea}>
                <span className={styles.userName}>Aaron</span>
                <div className={styles.masterBadge}><ShieldCheck size={10} /> 특급 기술자</div>
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

      {/* 2. Today's Status Card */}
      <motion.section variants={itemVariants} className={styles.section} style={{ marginTop: '1.25rem' }}>
        <div className={styles.statusCard}>
          <div className={styles.statusHeader}>
            <span className={styles.statusLabel}>오늘의 근무 상태</span>
            <span 
              className={styles.statusPill} 
              style={{ color: statusCard.pillColor, background: statusCard.pillBg }}
            >
              ● {statusCard.pillText}
            </span>
          </div>
          <div className={styles.statusContent}>
            <h3 className={styles.statusTitle}>{statusCard.title}</h3>
            <p className={styles.statusSubtitle}>{statusCard.subtitle}</p>
          </div>
          <Link 
            href={statusCard.href} 
            className={`${styles.statusBtn} ${statusCard.secondary ? styles.statusBtnSecondary : ''}`}
          >
            {statusCard.btnText} <ChevronRight size={16} />
          </Link>
        </div>
      </motion.section>

      {/* 3. Payout & Account Summary Card (Toss-Style) */}
      <motion.section variants={itemVariants} className={styles.section}>
        <div className={styles.assetCard}>
            <div className={styles.assetItem}>
                <div className={styles.assetInfo}>
                    <div className={styles.assetLabel}><Wallet size={14} /> 이번 달 받을 예정 금액</div>
                    <div className={styles.assetValue}>₩ 8,420,000</div>
                </div>
                <Link href="/settlement" className={styles.miniBtn}>받을 돈</Link>
            </div>
            <div className={styles.divider} />
            <div className={styles.assetItem}>
                <div className={styles.assetInfo}>
                    <div className={styles.assetLabel}><Coins size={14} /> 안전하게 확인 중</div>
                    <div className={styles.assetValue}>₩ 1,950,000</div>
                </div>
                <button className={styles.miniBtnGhost} onClick={(e) => handleQuickActionClick('shop', '포인트 교환', e)}>교환</button>
            </div>
        </div>
      </motion.section>

      {/* 4. Quick Action Grid (4x2) */}
      <motion.section variants={itemVariants} className={styles.section}>
        <div className={styles.quickGrid}>
          {[
            { id: 'jobs', icon: Zap, label: '일자리', color: '#3182f6' },
            { id: 'attendance', icon: CalendarCheck, label: '근무기록', color: '#30d158' },
            { id: 'settlement', icon: TrendingUp, label: '받을 돈', color: '#ff9f0a' },
            { id: 'career', icon: Briefcase, label: '내 기술카드', color: '#5856d6' },
            { id: 'academy', icon: GraduationCap, label: '성장코칭', color: '#af52de' },
            { id: 'shop', icon: Wrench, label: '스토어', color: '#D4AF37' },
            { id: 'global', icon: Globe, label: '해외파견', color: '#00c7be' },
            { id: 'community', icon: Users, label: '커뮤니티', color: '#ff453a' },
          ].map(item => (
            <Link 
              href={['academy', 'shop', 'global', 'community'].includes(item.id) ? '#' : `/${item.id}`} 
              key={item.id} 
              className={styles.quickItem}
              onClick={(e) => handleQuickActionClick(item.id, item.label, e)}
            >
              <div className={styles.quickIcon} style={{ background: `${item.color}15`, color: item.color }}>
                <item.icon size={26} />
              </div>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* 5. AI Insight Feed -> 현장 도움말 브리핑 */}
      <motion.section variants={itemVariants} className={styles.section}>
        <div className={styles.feedCard}>
            <div className={styles.feedIcon} style={{ color: '#3182f6', background: 'rgba(49, 130, 246, 0.1)' }}><BrainCircuit size={20} /></div>
            <div className={styles.feedContent}>
                <span className={styles.feedTag} style={{ color: '#3182f6' }}>현장 도움말 브리핑</span>
                <p>평택 P4 반도체 현장에서 Aaron님의 배관 기술을 필요로 하고 있어요. <strong>일급 24만원</strong>까지 조율 가능합니다.</p>
            </div>
            <ChevronRight size={18} className={styles.feedArrow} />
        </div>
      </motion.section>

      {/* 6. Recommended Jobs Card */}
      <motion.section variants={itemVariants} className={styles.section}>
        <div className="section-title">
            <h3>내 조건과 잘 맞아요</h3>
            <Link href="/jobs" className="view-all">전체보기</Link>
        </div>
        <div className={styles.jobCardLarge}>
            <div className={styles.jobBadge}>매칭도 98%</div>
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
                <Link href="/jobs" className={styles.applyBtn} style={{ textDecoration: 'none' }}>자세히 보기</Link>
            </div>
        </div>
      </motion.section>

      {/* Preparing Modal */}
      <PreparingModal 
        isOpen={isPreparingModalOpen}
        onClose={() => setIsPreparingModalOpen(false)}
        title={preparingTitle}
        description={preparingDesc}
        featureName={preparingFeatureName}
      />
    </motion.div>
  );
}
