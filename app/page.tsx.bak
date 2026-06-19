'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  AlertCircle,
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import { useDemo } from '@/context/DemoContext';
import { useUI } from '@/context/UIContext';

import Hero from '@/components/Hero/Hero';
import ProblemSection from '@/components/ProblemSection/ProblemSection';
import Features from '@/components/Features/Features';
import Footer from '@/components/Footer/Footer';
import PreparingModal from '@/components/UI/PreparingModal';

export default function Home() {
  const { isLoggedIn } = useAuth();
  const { state, setDemoStage } = useDemo();
  const { addToast } = useUI();
  const router = useRouter();
  
  // PreparingModal state
  const [isPreparingModalOpen, setIsPreparingModalOpen] = useState(false);
  const [preparingFeatureName, setPreparingFeatureName] = useState('');
  const [preparingTitle, setPreparingTitle] = useState('');
  const [preparingDesc, setPreparingDesc] = useState('');

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

  // Get dynamic content for the Today's Status Card based on DemoStage
  const getStatusCardContent = () => {
    switch (state.demoStage) {
      case 'INIT':
        return {
          pillText: '일자리 없음',
          pillColor: '#8e8e93',
          pillBg: 'rgba(142, 142, 147, 0.1)',
          title: '오늘 갈 일자리를 찾아볼까요?',
          subtitle: `${state.profile.name} 반장님의 희망 직종과 기술 수준에 맞는 추천 현장들이 대기하고 있습니다.`,
          btnText: '추천 일자리 보러가기',
          action: () => router.push('/jobs'),
          secondary: false
        };
      case 'APPLIED':
        return {
          pillText: '신청 완료',
          pillColor: '#ff9f0a',
          pillBg: 'rgba(255, 159, 10, 0.1)',
          title: '회사에서 확인 중이에요',
          subtitle: '지원 정보를 토대로 서류 및 경력 검수가 진행되고 있어요. 승인 시 바로 알려드릴게요.',
          btnText: '일자리 신청 현황 보기',
          action: () => router.push('/jobs'),
          secondary: true
        };
      case 'CONFIRMED':
        return {
          pillText: '확정 완료',
          pillColor: '#10b981',
          pillBg: 'rgba(16, 185, 129, 0.1)',
          title: '일할 곳이 확정됐어요',
          subtitle: '지정된 출근 예정 시간에 늦지 않게 현장 도착 후 아래 출근 도장을 찍어주세요.',
          btnText: '출근 확인 및 정보 보기',
          action: () => router.push('/attendance'),
          secondary: false
        };
      case 'CHECKED_IN':
        return {
          pillText: '출근 완료',
          pillColor: '#2563eb',
          pillBg: 'rgba(37, 99, 235, 0.1)',
          title: '출근이 확인됐어요',
          subtitle: '오늘도 안전하게 보호구를 올바르게 착용하시고 일하시길 바라며, 퇴근 시 확인해 주세요.',
          btnText: '근무 상황판 & 퇴근 확인',
          action: () => router.push('/attendance'),
          secondary: false
        };
      case 'CHECKED_OUT':
        return {
          pillText: '퇴근 완료',
          pillColor: '#ff9f0a',
          pillBg: 'rgba(255, 159, 10, 0.1)',
          title: '오늘 일한 기록을 회사가 확인 중이에요',
          subtitle: '작업 내역이 전송되었습니다. 현장 담당자가 최종 승인하면 정산이 확정됩니다.',
          btnText: '받을 금액 정보 보기',
          action: () => router.push('/wallet'),
          secondary: true
        };
      case 'PAID':
        return {
          pillText: '확인 완료',
          pillColor: '#10b981',
          pillBg: 'rgba(16, 185, 129, 0.1)',
          title: '오늘 일한 기록이 저장됐어요',
          subtitle: '정산이 최종 승인되어 등록된 본인 계좌로 오늘 일당 지급이 완료되었습니다.',
          btnText: '내 지갑 입금 내역 확인',
          action: () => router.push('/wallet'),
          secondary: false
        };
      case 'ONBOARDING':
      default:
        return {
          pillText: '온보딩 대기',
          pillColor: '#8e8e93',
          pillBg: 'rgba(142, 142, 147, 0.1)',
          title: '기술카드 발급을 완료해 주세요',
          subtitle: '몇 가지 간단한 질문에 답하시면 반장님만의 3D 기술카드가 완성됩니다.',
          btnText: '기술카드 생성 시작하기',
          action: () => setDemoStage('ONBOARDING'),
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

  const getProfileCompletion = () => {
    let count = 0;
    if (state.profile.name) count += 20;
    if (state.profile.regions.length > 0) count += 20;
    if (state.profile.jobs.length > 0) count += 20;
    if (state.profile.safetyComplete) count += 20;
    if (state.profile.accountNumber) count += 20;
    return count;
  };

  const completion = getProfileCompletion();

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
            <div className={styles.avatarInner}>
              {state.profile.name ? state.profile.name.substring(1, 3) : '무길'}
            </div>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.greetingText}>오늘도 안전한 하루 되세요!</span>
            <div className={styles.userNameArea}>
                <span className={styles.userName}>{state.profile.name} 반장님</span>
                <div className={styles.masterBadge}>
                  <ShieldCheck size={10} style={{ marginRight: '2px' }} /> 
                  {state.demoStage === 'PAID' ? '마스터 장인' : '베테랑'}
                </div>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.iconBtn} onClick={() => router.push('/jobs')}><Search size={22} /></button>
          <button className={styles.iconBtn} onClick={() => addToast('🔔 알림: 안전보건공단에서 안전교육 이수가 공식 확인되었습니다.', 'info')}>
            <Bell size={22} />
            <div className={styles.notifyDot} />
          </button>
        </div>
      </header>

      {/* Profile Incompletion Banner */}
      {completion < 100 && (
        <motion.div variants={itemVariants} className={styles.alertBanner} onClick={() => router.push('/myinfo')}>
          <AlertCircle size={16} className={styles.alertIcon} />
          <span>기술카드 완성도가 <strong>{completion}%</strong>입니다. 누락된 정보를 채우고 신뢰 등급을 높여보세요.</span>
          <ChevronRight size={14} />
        </motion.div>
      )}

      {/* 2. Today's Status Card */}
      <motion.section variants={itemVariants} className={styles.section} style={{ marginTop: '1rem' }}>
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
          <button 
            onClick={statusCard.action} 
            className={`${styles.statusBtn} ${statusCard.secondary ? styles.statusBtnSecondary : ''}`}
          >
            {statusCard.btnText} <ChevronRight size={16} />
          </button>
        </div>
      </motion.section>

      {/* 3. MONO Wallet Quick Summary Card */}
      <motion.section variants={itemVariants} className={styles.section}>
        <div className={styles.assetCard}>
            <div className={styles.assetItem}>
                <div className={styles.assetInfo}>
                    <div className={styles.assetLabel}><Wallet size={14} /> 이번 달 받을 예정 금액</div>
                    <div className={styles.assetValue}>
                      ₩ {(state.demoStage === 'PAID' ? state.wallet.expectedAmount : 3290000).toLocaleString()}
                    </div>
                </div>
                <Link href="/wallet" className={styles.miniBtn}>받을 돈</Link>
            </div>
            <div className={styles.divider} />
            <div className={styles.assetItem}>
                <div className={styles.assetInfo}>
                    <div className={styles.assetLabel}><Coins size={14} /> 회사 확인 중 금액</div>
                    <div className={styles.assetValue}>
                      ₩ {state.demoStage === 'CHECKED_OUT' ? '195,000' : '0'}
                    </div>
                </div>
                <Link href="/wallet" className={styles.miniBtnGhost}>내 카드</Link>
            </div>
        </div>
      </motion.section>

      {/* 4. Quick Navigation Grid */}
      <motion.section variants={itemVariants} className={styles.section}>
        <div className={styles.quickGrid}>
          {[
            { id: 'jobs', icon: Zap, label: '일자리', color: '#3182f6', link: '/jobs' },
            { id: 'attendance', icon: CalendarCheck, label: '근무기록', color: '#30d158', link: '/attendance' },
            { id: 'wallet', icon: Wallet, label: 'MONO Wallet', color: '#ff9f0a', link: '/wallet' },
            { id: 'myinfo', icon: ShieldCheck, label: '내 정보', color: '#5856d6', link: '/myinfo' },
            { id: 'academy', icon: GraduationCap, label: '성장코칭', color: '#af52de', link: '#' },
            { id: 'shop', icon: Wrench, label: '스토어', color: '#D4AF37', link: '#' },
            { id: 'global', icon: Globe, label: '해외파견', color: '#00c7be', link: '#' },
            { id: 'community', icon: Users, label: '커뮤니티', color: '#ff453a', link: '#' },
          ].map(item => (
            <Link 
              href={item.link} 
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

      {/* 5. Field Help Briefing (FAQ / Help center integration) */}
      <motion.section variants={itemVariants} className={styles.section}>
        <div className={styles.feedCard} onClick={() => {
          setPreparingFeatureName('현장 도움말');
          setPreparingTitle('현장 도움말 가이드를 보여드릴게요');
          setPreparingDesc('신규 현장 근무 규칙, 안전 수칙 체크리스트 및 보호구 착용법 등을 담은 초보자 맞춤형 가이드북입니다.');
          setIsPreparingModalOpen(true);
        }}>
            <div className={styles.feedIcon} style={{ color: '#3182f6', background: 'rgba(49, 130, 246, 0.1)' }}><BrainCircuit size={20} /></div>
            <div className={styles.feedContent}>
                <span className={styles.feedTag} style={{ color: '#3182f6' }}>현장 도움말 브리핑</span>
                <p>
                  <strong>{state.profile.jobs[0]}</strong> 반장님, {state.demoStage === 'PAID' ? '마스터' : '베테랑'} 등급에 적합한 안전 수칙과 가이드라인을 확인해보세요.
                </p>
            </div>
            <ChevronRight size={18} className={styles.feedArrow} />
        </div>
      </motion.section>

      {/* 6. Offline Work record addition */}
      <motion.section variants={itemVariants} className={styles.section}>
        <div className={styles.offlineEntryBanner} onClick={() => router.push('/attendance')}>
          <div className={styles.offlineEntryInfo}>
            <h4>앱 밖에서 일한 기록도 추가할 수 있어요</h4>
            <p>전화나 종이 출역부로 받은 일자리도 MONO에 기록하면 내 기술카드에 반영돼요.</p>
          </div>
          <PlusCircle size={24} className={styles.offlineEntryBtn} />
        </div>
      </motion.section>

      {/* 7. Recommended Jobs Card */}
      <motion.section variants={itemVariants} className={styles.section} style={{ marginBottom: '2rem' }}>
        <div className="section-title">
            <h3>내 조건과 잘 맞아요</h3>
            <Link href="/jobs" className="view-all">전체보기</Link>
        </div>
        <div className={styles.jobCardLarge} onClick={() => router.push('/jobs')}>
            <div className={styles.jobBadge}>매칭도 98%</div>
            <div className={styles.jobMain}>
                <div className={styles.jobInfo}>
                    <h4>서초 반포 써밋팰리스 복합 신축현장</h4>
                    <p>대우건설 · 일급 235,000원</p>
                </div>
                <div className={styles.jobLogo}>D</div>
            </div>
            <div className={styles.jobFooter}>
                <div className={styles.jobTags}>
                    <span>#즉시투입</span>
                    <span>#식사제공</span>
                    <span>#야간수당</span>
                </div>
                <button className={styles.applyBtn}>자세히 보기</button>
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

