'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Database, 
  RotateCw, 
  Coins, 
  Cpu, 
  Truck, 
  Construction, 
  ArrowDown,
  Sparkles,
  Trophy,
  ShieldCheck,
  Globe,
  Award,
  Compass,
  MapPin,
  Laptop
} from 'lucide-react';
import Link from 'next/link';
import { useUI } from '@/context/UIContext';
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher';

// Recharts imports
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as ChartTooltip, 
  Legend as ChartLegend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

export default function StrategyPage() {
  const { theme } = useUI();
  const [activePersona, setActivePersona] = useState('youth');
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  // Fix hydration mismatch by only rendering client-side content after mounting
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  const handleCardFlip = (index: number) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (!mounted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--background)",
          color: "var(--text-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-sans)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              background: "var(--surface)",
              color: "var(--primary)",
              fontFamily: "monospace",
              fontSize: 12,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              border: "1px solid var(--border)",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--primary)",
                boxShadow: "0 0 12px var(--primary)",
              }}
            />
            MoNo · Tech-Blue Strategy Loading
          </div>
        </div>
      </div>
    );
  }

  // Dynamic colors for Recharts based on theme context
  const textDarkColor = theme === 'original' ? '#ffffff' : '#0A0F1A';
  const textSecondaryColor = theme === 'original' ? 'rgba(255, 255, 255, 0.6)' : '#475569';
  const gridColor = theme === 'original' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(10, 15, 26, 0.12)';
  const tooltipBgColor = theme === 'original' ? '#0a0a0c' : '#ffffff';
  const tooltipBorderColor = theme === 'original' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(10, 15, 26, 0.15)';

  // Chart data
  const pieData = [
    { name: '금융 혁신 (PG 수수료)', value: 35, color: '#0E7490' },
    { name: 'B2B SaaS 구독', value: 25, color: 'var(--primary)' },
    { name: 'O2O 상생 수수료', value: 15, color: '#22D3EE' },
    { name: '커머스·장비 물류', value: 25, color: '#F2C200' },
  ];

  const barData = [
    { year: '2027', sales: 28, fill: '#CFFAFE' },
    { year: '2028', sales: 92, fill: '#67E8F9' },
    { year: '2029', sales: 240, fill: '#06B6D4' },
    { year: '2030', sales: 520, fill: '#0E7490' },
  ];

  return (
    <div className={styles.pageWrap}>
      <div className={styles.blueprintBg} />

      {/* ============================== STANDALONE NAV ============================== */}
      <header className={styles.standaloneNav}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            <div className={`${styles.logoBox} ${styles.lcorner} ${styles.lcornerTech}`}>
              <span>M</span>
            </div>
            <div className={styles.logoText}>MoNo</div>
          </Link>
          <nav className={styles.navMenu}>
            <a className={styles.navLink} href="#platform">서비스 소개</a>
            <a className={styles.navLink} href="#lifecycle">브랜드 철학</a>
            <a className={styles.navLink} href="#problem">해결 과제</a>
            <a className={styles.navLink} href="#gtm">GTM 전략</a>
            <a className={styles.navLink} href="#invest">투자 전략</a>
            <a className={styles.navLink} href="#vision">미래 비전</a>
          </nav>
          <div className={styles.navActions}>
            <ThemeSwitcher />
            <a href="#vision" className={styles.navBtn}>
              비전 선언서 <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </header>

      {/* ============================== INTRO HEADER ============================== */}
      <section className={styles.tapeDivider} style={{ marginTop: '68px' }}></section>

      {/* ============================== S1 · THE PLATFORM ============================== */}
      <section id="platform" className={`${styles.section} ${styles.grainBg}`}>
        <div className={styles.container}>
          <motion.div 
            className={styles.heroIntro}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className={styles.sectionLabel}>
              <span className={styles.num}>01</span> MoNo 서비스 소개 · The Platform
            </div>
            <h2 className={`${styles.hDisplay} ${styles.mt4}`}>
              일하는 사람과 찾는 회사가 한 플랫폼에서 만나 함께 성장합니다.
            </h2>
            <p className={`${styles.bodyLg} ${styles.mt5}`}>
              현장 근무자에게는 오래 함께 가는 <strong>디지털 인력사무소</strong>를, 공급사에게는 검증된 인력을 곧바로 부를 수 있는 <strong>현장 인력 관제 플랫폼</strong>을. MoNo는 개인 근무자와 기업 고객을 같은 데이터 위에 묶어, 인력 시장 전체를 하나로 연결합니다.
            </p>
          </motion.div>

          <div className={styles.dualGrid}>
            {/* B2C Card */}
            <motion.article 
              className={`${styles.cardB2C} ${styles.lcorner} ${styles.hoverLift}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span className={`${styles.chip} ${styles.chipPrimary}`}>개인 근무자용</span>
                <span className={`${styles.mono} text-[11.5px] var(--text-secondary)`}>/ 디지털 인력사무소</span>
              </div>
              <h3 className="text-xl font-extrabold mb-3">어디서든 일하고, 내 기술이 자산이 되는 디지털 인력사무소.</h3>
              <p className={`${styles.bodyMd} mb-5`}>
                세계 어디에서 일하든 출역·기술·안전 데이터가 내 이름으로 기록됩니다. 그 데이터는 곧 금융·이주·교육으로 이어지는 신분증이 되어, 짧게 끊기던 일용직 경력을 한 사람의 평생 커리어로 이어줍니다.
              </p>
              <div className={styles.specList}>
                <div className={styles.specRow}>
                  <div className={styles.specKey}>기록</div>
                  <div className={styles.specVal}>출역·기술·안전 데이터 평생 누적</div>
                </div>
                <div className={styles.specRow}>
                  <div className={styles.specKey}>자산</div>
                  <div className={styles.specVal}>기술 신용 등급 → 대출·보험·은퇴 설계</div>
                </div>
                <div className={styles.specRow}>
                  <div className={styles.specKey}>호환</div>
                  <div className={styles.specVal}>국가 간 기술 증명 · 글로벌 워크 패스</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-5">
                <span className={`${styles.chip} ${styles.chipRound} ${styles.chipDark}`}>출역 로그</span>
                <span className={`${styles.chip} ${styles.chipRound} ${styles.chipDark}`}>기술 신용 등급</span>
                <span className={`${styles.chip} ${styles.chipRound} ${styles.chipDark}`}>글로벌 호환</span>
              </div>
            </motion.article>

            {/* B2B Card */}
            <motion.article 
              className={`${styles.cardB2B} ${styles.lcorner} ${styles.lcornerTech} ${styles.hoverLift}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span className={`${styles.chip} ${styles.chipSafety}`}>기업 고객용 (원청·하청)</span>
                <span className={`${styles.mono} text-[11.5px] text-yellow-500`}>/ 인력 관제 플랫폼</span>
              </div>
              <h3 className="text-xl font-extrabold mb-3">필요한 시간, 원하는 장소에서 검증된 인력을 즉각 호출.</h3>
              <p className={`${styles.bodyMd} mb-5`}>
                인력 모집·계약·정산·안전 관리가 한 대시보드에 모입니다. 현장 단위 관제 프로그램(월구독형)으로 카르텔을 거치지 않고 검증 인력에 직접 닿고, 작업 효율은 데이터로 측정됩니다.
              </p>
              <div className={styles.specList}>
                <div className={styles.specRow}>
                  <div className={styles.specKey}>매칭</div>
                  <div className={styles.specVal}>기술 데이터 기반 정밀 매칭 · 호출 즉시 출역</div>
                </div>
                <div className={styles.specRow}>
                  <div className={styles.specKey}>정산</div>
                  <div className={styles.specVal}>안전 예치 계좌(에스크로) · 퇴근 즉시 일급 지급</div>
                </div>
                <div className={styles.specRow}>
                  <div className={styles.specKey}>안전</div>
                  <div className={styles.specVal}>일일 상해보험 자동 가입 · 산재 처리 자동화</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-5">
                <span className={`${styles.chip} ${styles.chipRound} ${styles.chipDark}`}>실시간 매칭</span>
                <span className={`${styles.chip} ${styles.chipRound} ${styles.chipDark}`}>안전 예치 정산</span>
                <span className={`${styles.chip} ${styles.chipRound} ${styles.chipDark}`}>안전 자동화</span>
              </div>
            </motion.article>
          </div>

          {/* Single Data Layer Strip */}
          <motion.div 
            className={styles.dataStrip}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className={styles.stripLeft}>
              <div className={styles.stripIconBox}>
                <Database size={20} />
              </div>
              <div>
                <div className={styles.hEyebrow}>하나의 데이터 위에서</div>
                <p className={`${styles.bodyMd} mt-1`}>
                  현장 근무자와 공급사는 서로 다른 두 시장이 아닙니다. MoNo는 같은 데이터 위에서 서로의 신뢰를 쌓아가는 한 쌍의 파트너로 두 그룹을 연결합니다.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11.5px] flex-wrap">
              <span className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded">현장 근무자</span>
              <span className="text-[var(--primary)] font-bold">⇄</span>
              <span className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded">공급사</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className={styles.tapeDivider}></section>

      {/* ============================== S2 · LIFE CYCLE ============================== */}
      <section id="lifecycle" className={styles.section}>
        <div className={styles.container}>
          <motion.div 
            className={styles.heroIntro}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className={styles.sectionLabel}>
              <span className={styles.num}>02</span> MoNo 브랜드 철학 · The Life Cycle
            </div>
            <h2 className={`${styles.hDisplay} ${styles.mt4}`}>
              땀 흘리며 일하는 즐거움을 아는 사람들, 우리가 함께 Tech-Blue의 미래를 만듭니다.
            </h2>
            <p className={`${styles.bodyLg} ${styles.mt5}`}>
              MO-NO는 현장에 남은 낡은 관행을 지우고, 사람의 땀방울·데이터·기술로 새로운 ‘미래 현장(Tech-Blue)’을 오케스트레이션하는 플랫폼입니다. 청년·워홀러·노마드·외국인·은퇴자 다섯 세대의 삶을 같은 데이터 경제권 위에서 끌어안고, 그들의 사회적 인식과 가치를 수직 상승시키는 라이프 사이클 브랜드.
            </p>
          </motion.div>

          {/* 4대 핵심 미션 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className={`bg-[var(--surface)] border border-[var(--border)] ${styles.lcorner} p-6`}>
              <div className={`${styles.hEyebrow} mb-2`}>Mission 01</div>
              <h4 className="text-md font-extrabold mb-2 text-[var(--text-primary)]">지속 가능한 환경·성장</h4>
              <p className={styles.bodySm}>땀 흘려 일하는 사람들이 걱정 없이 계속 일할 수 있는 현장을 만들고, 기술자로서의 평생 성장을 설계합니다.</p>
            </div>
            <div className={`bg-[var(--surface)] border border-[var(--border)] ${styles.lcorner} p-6`}>
              <div className={`${styles.hEyebrow} mb-2`}>Mission 02</div>
              <h4 className="text-md font-extrabold mb-2 text-[var(--text-primary)]">땀방울의 금융 데이터화</h4>
              <p className={styles.bodySm}>흘린 땀만큼 온전한 자산이 되도록, 노동을 ‘대안 금융 데이터’로 전환해 금융 소외를 끝냅니다.</p>
            </div>
            <div className={`bg-[var(--surface)] border border-[var(--border)] ${styles.lcorner} p-6`}>
              <div className={`${styles.hEyebrow} mb-2`}>Mission 03</div>
              <h4 className="text-md font-extrabold mb-2 text-[var(--text-primary)]">데이터 기반 안전·효율 혁신</h4>
              <p className={styles.bodySm}>축적된 현장 데이터로 작업은 더 빠르고 효율적이면서도, 생명을 지키는 완벽한 안전을 함께 설계합니다.</p>
            </div>
            <div className={`bg-[var(--surface-raised)] border border-[var(--border-strong)] ${styles.lcorner} ${styles.lcornerTech} p-6`}>
              <div className={`${styles.hEyebrow} mb-2`} style={{ color: 'var(--primary)' }}>Mission 04</div>
              <h4 className="text-md font-extrabold mb-2 text-[var(--primary)]">미래 산업의 주역</h4>
              <p className={styles.bodySm}>단순 육체노동을 넘어, 데이터와 로보틱스 기술로 끊임없이 진화하는 진정한 Tech-Blue 플랫폼.</p>
            </div>
          </div>

          {/* 듀얼 슬로건 */}
          <div className="grid lg:grid-cols-2 gap-4 mb-12">
            <div className={`bg-[var(--surface)] border-l-4 border-[var(--primary)] ${styles.lcorner} p-6`}>
              <div className={styles.hEyebrow}>For Public · 대국민 슬로건</div>
              <p className="text-[15.5px] font-extrabold text-[var(--text-primary)] mt-2">
                “땀 흘리는 즐거움을 아는 사람들, 우리가 함께 Tech-Blue의 미래를 만듭니다.”
              </p>
            </div>
            <div className={`bg-[var(--surface-raised)] border-l-4 border-[var(--border-strong)] ${styles.lcorner} p-6`}>
              <div className={styles.hEyebrow}>For Investors · 투자자 슬로건</div>
              <p className="text-[15.5px] font-extrabold text-[var(--text-primary)] mt-2">
                “노동을 데이터로, 데이터를 금융과 미래 기술(Robotics)로.”
              </p>
            </div>
          </div>

          {/* Persona Tab Bar */}
          <div className={styles.tabContainer}>
            <button 
              onClick={() => setActivePersona('youth')} 
              className={`${styles.tabBtn} ${styles.lcorner} ${activePersona === 'youth' ? styles.tabBtnActive : ''}`}
            >
              <span className={styles.tabNum}>01</span> The Seed Camp · 20대 청년
            </button>
            <button 
              onClick={() => setActivePersona('workholiday')} 
              className={`${styles.tabBtn} ${styles.lcorner} ${activePersona === 'workholiday' ? styles.tabBtnActive : ''}`}
            >
              <span className={styles.tabNum}>02</span> Global Tech-Passport · 워홀러
            </button>
            <button 
              onClick={() => setActivePersona('workation')} 
              className={`${styles.tabBtn} ${styles.lcorner} ${activePersona === 'workation' ? styles.tabBtnActive : ''}`}
            >
              <span className={styles.tabNum}>03</span> Work-&-Live · 워케이션 노마드
            </button>
            <button 
              onClick={() => setActivePersona('foreign')} 
              className={`${styles.tabBtn} ${styles.lcorner} ${activePersona === 'foreign' ? styles.tabBtnActive : ''}`}
            >
              <span className={styles.tabNum}>04</span> K-Work Experience · 외국인 전문가
            </button>
            <button 
              onClick={() => setActivePersona('retire')} 
              className={`${styles.tabBtn} ${styles.lcorner} ${activePersona === 'retire' ? styles.tabBtnActive : ''}`}
            >
              <span className={styles.tabNum}>05</span> Legacy Expert · 은퇴 장인
            </button>
          </div>

          {/* Tab Panel Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePersona}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className={`${styles.personaCard} ${styles.lcorner}`}
            >
              {activePersona === 'youth' && (
                <div className={styles.personaGrid}>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className={`${styles.chip} ${styles.chipSafety}`}>청년 · 10–20대</span>
                      <span className={`${styles.chip} ${styles.chipPrimary}`}>The Seed Camp</span>
                    </div>
                    <h3 className="text-2xl font-extrabold mb-3 text-[var(--text-primary)]">수능 끝, 내 손으로 첫 종잣돈을 만든다.</h3>
                    <p className={styles.bodyMd}>
                      운전면허·편의점 알바로 흩어지던 청년의 시간을 <strong>모노 자립 아카데미</strong>로 모읍니다. 4주 단기 라이프 스킬 코스(도배·전기·스마트 도구 조작)와 8주 평택·용인 현장 전문가 실습을 거쳐, 등록금·창업 자금·세계여행 자금이 되는 800만 원의 종잣돈(Seed Money)을 내 손으로 만들어냅니다. <em>“진짜 어른이 되는 해방구”</em> — 그것이 The Seed Camp의 약속입니다.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-5">
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>Adulting 101</span>
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>모노 자립 아카데미</span>
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>800만 원 종잣돈</span>
                    </div>
                  </div>
                  <div>
                    <div className={styles.specList}>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>학습</div>
                        <div className={styles.specVal}>4주 라이프 스킬 코스 · 도배·전기·스마트 도구</div>
                      </div>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>출역</div>
                        <div className={styles.specVal}>8주 평택·용인 현장 전문가 실습 → 800만 원</div>
                      </div>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>전환</div>
                        <div className={styles.specVal}>대학 등록금 · 창업 자금 · 세계 여행 자금</div>
                      </div>
                    </div>
                    <div className={`${styles.personaQuoteBox} ${styles.lcorner} ${styles.lcornerTech}`}>
                      <div className={styles.hEyebrow}>대표 슬로건</div>
                      <div className="text-[14.5px] font-bold mt-1 text-[var(--text-primary)]">수능 끝, 알바몬 대신 모노전문가로 내 인생의 진짜 독립 자금을 설계하라.</div>
                    </div>
                  </div>
                </div>
              )}

              {activePersona === 'workholiday' && (
                <div className={styles.personaGrid}>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className={`${styles.chip} ${styles.chipSafety}`}>해외 워홀러 · 20–30대</span>
                      <span className={`${styles.chip} ${styles.chipPrimary}`}>Global Tech-Passport</span>
                    </div>
                    <h3 className="text-2xl font-extrabold mb-3 text-[var(--text-primary)]">카페 서빙 대신, 내 기술로 시급 $35를 번다.</h3>
                    <p className={styles.bodyMd}>
                      농장·카페 최저임금에 갇히던 워킹홀리데이를 글로벌 기술 무대로 끌어올립니다. 국내 현장에서 쌓은 용접·조적·배관 경력 데이터를 글로벌 스탠다드 영문 이력서로 자동 변환하는 <strong>Tech-Passport(기술 여권)</strong>. 호주·캐나다·영국 현지 빌더 협회와 다이렉트 매칭되어, 도착 첫 주부터 시간당 $35~50의 합법 전문직군으로 출근할 수 있습니다.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-5">
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>Tech-Passport</span>
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>ISO 글로벌 자격 연계</span>
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>시급 $35~50</span>
                    </div>
                  </div>
                  <div>
                    <div className={styles.specList}>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>여권</div>
                        <div className={styles.specVal}>경력 데이터 → 영문 이력서 자동 변환</div>
                      </div>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>시급</div>
                        <div className={styles.specVal}>호주·캐나다·영국 현장 $35~50</div>
                      </div>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>매칭</div>
                        <div className={styles.specVal}>HIA 등 현지 빌더 협회 다이렉트 연동</div>
                      </div>
                    </div>
                    <div className={`${styles.personaQuoteBox} ${styles.lcorner} ${styles.lcornerTech}`}>
                      <div className={styles.hEyebrow}>대표 슬로건</div>
                      <div className="text-[14.5px] font-bold mt-1 text-[var(--text-primary)]">어학연수 가서 커피만 탈 건가요? 테크 패스포트 하나로 전 세계 현장을 지휘하는 글로벌 전문가가 되세요.</div>
                    </div>
                  </div>
                </div>
              )}

              {activePersona === 'workation' && (
                <div className={styles.personaGrid}>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className={`${styles.chip} ${styles.chipSafety}`}>워케이션 노마드 · 20–40대</span>
                      <span className={`${styles.chip} ${styles.chipPrimary}`}>Work-&-Live</span>
                    </div>
                    <h3 className="text-2xl font-extrabold mb-3 text-[var(--text-primary)]">낮에는 바람을 가르고, 밤에는 파도 소리를 들으며 일한다.</h3>
                    <p className={styles.bodyMd}>
                      제주·강원·남해의 스마트 로컬 하도급 현장과 한달살기 거점을 묶은 <strong>Work-&-Live(워케이션) 패키지</strong>. 오전 4시간 단기 고단가 근무로 일급을 즉시 정산받고, 오후엔 서핑·카페·로컬 라이프를 만끽하는 ‘에셋라이트 셔틀 패키지’가 디지털 노무 노마드의 일상을 받쳐줍니다.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-5">
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>한달살기 챌린지</span>
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>에셋라이트 셔틀</span>
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>오전 4h · 일급 즉시 정산</span>
                    </div>
                  </div>
                  <div>
                    <div className={styles.specList}>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>권역</div>
                        <div className={styles.specVal}>제주·강원·남해 스마트 로컬 거점</div>
                      </div>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>패키지</div>
                        <div className={styles.specVal}>오전 4h 현장 + 오후 자유 · 일/월/년</div>
                      </div>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>정산</div>
                        <div className={styles.specVal}>일급 즉시 정산 · 통근 셔틀 · 테크웨어</div>
                      </div>
                    </div>
                    <div className={`${styles.personaQuoteBox} ${styles.lcorner} ${styles.lcornerTech}`}>
                      <div className={styles.hEyebrow}>대표 슬로건</div>
                      <div className="text-[14.5px] font-bold mt-1 text-[var(--text-primary)]">돈 쓰면서 한달살기 하세요? 우리는 벌면서 자유롭게 살아갑니다. MO-NO와 함께하는 노마드 라이프.</div>
                    </div>
                  </div>
                </div>
              )}

              {activePersona === 'foreign' && (
                <div className={styles.personaGrid}>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className={`${styles.chip} ${styles.chipSafety}`}>외국인 근로자 · 숙련기능비자</span>
                      <span className={`${styles.chip} ${styles.chipPrimary}`}>K-Work Experience</span>
                    </div>
                    <h3 className="text-2xl font-extrabold mb-3 text-[var(--text-primary)]">K-스마트 기술을 배우고, 내 노동의 존엄을 지킨다.</h3>
                    <p className={styles.bodyMd}>
                      불법 체류·브로커의 그늘에 가려졌던 외국인 인력을 합법적이고 자랑스러운 <strong>‘글로벌 장인 인프라’</strong>로 양성화합니다. 모노 앱에 쌓이는 성실도 데이터는 법무부 E-7-4 숙련기능비자 가점으로 자동 에스코트되고, 다국어 AI 안전 비서가 언어 사각지대를 지웁니다. 본국 송금은 수수료 1% 미만의 다이렉트 금융으로 이어집니다. 외국인 전문가에게 ‘가장 안전하고 자랑스러운 현장’을 제공합니다.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-5">
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>K-Tech 연수</span>
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>E-7-4 가점 에스코트</span>
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>다국어 AI 안전 비서</span>
                    </div>
                  </div>
                  <div>
                    <div className={styles.specList}>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>연수</div>
                        <div className={styles.specVal}>K-Tech 안전 연수 · 다국어 매뉴얼</div>
                      </div>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>비자</div>
                        <div className={styles.specVal}>성실도 데이터 → E-7-4 가점 무상 에스코트</div>
                      </div>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>송금</div>
                        <div className={styles.specVal}>수수료 1% 미만 본국 다이렉트 송금</div>
                      </div>
                    </div>
                    <div className={`${styles.personaQuoteBox} ${styles.lcorner} ${styles.lcornerTech}`}>
                      <div className={styles.hEyebrow}>대표 슬로건</div>
                      <div className="text-[14.5px] font-bold mt-1 text-[var(--text-primary)]">한국에서의 땀방울이 고국의 내 가족을 지킵니다. 가장 안전하고 정직한 파트너, 외국인 전문가의 동반자 MO-NO.</div>
                    </div>
                  </div>
                </div>
              )}

              {activePersona === 'retire' && (
                <div className={styles.personaGrid}>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className={`${styles.chip} ${styles.chipSafety}`}>은퇴 세대 · 50–60대</span>
                      <span className={`${styles.chip} ${styles.chipPrimary}`}>Legacy Expert</span>
                    </div>
                    <h3 className="text-2xl font-extrabold mb-3 text-[var(--text-primary)]">은퇴는 끝이 아닌, 내 평생 기술의 시작이다.</h3>
                    <p className={styles.bodyMd}>
                      30년 손결을 디지털로 옮기고, 모노 정직원 PM·온사이트 OJT 교관으로 직무를 전환합니다. 무거운 자재 운반은 Tech-Blue 로봇이 맡고, 베테랑은 스마트 디바이스로 정밀 시공을 감리하는 <strong>시니어 마에스트로</strong>로 격상됩니다. 보유 장비는 조각 투자(디지털 증권화)로 자산화되어, 일하지 않을 때도 안정적인 임대 수익이 들어옵니다 — 레전드에서 레거시 전문가로의 귀환.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-5">
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>레거시 전문가</span>
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>시니어 마에스트로</span>
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>장비 조각 투자</span>
                    </div>
                  </div>
                  <div>
                    <div className={styles.specList}>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>계약</div>
                        <div className={styles.specVal}>모노 정직원 PM·OJT 교관 · 4대보험·퇴직금</div>
                      </div>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>기록</div>
                        <div className={styles.specVal}>장인의 손길·판단·노하우 데이터화</div>
                      </div>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>자산</div>
                        <div className={styles.specVal}>장비 조각 투자 등록 → 임대 수익</div>
                      </div>
                    </div>
                    <div className={`${styles.personaQuoteBox} ${styles.lcorner} ${styles.lcornerTech}`}>
                      <div className={styles.hEyebrow}>대표 슬로건</div>
                      <div className="text-[14.5px] font-bold mt-1 text-[var(--text-primary)]">당신의 30년 현장 노하우는 대한민국의 유산입니다. 은퇴 없는 평생의 전문직, MO-NO 레전드가 지켜드립니다.</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ============================== MISSING SECTION A: BRAND REPOSITIONING ============================== */}
          <motion.div 
            className="mt-16 lg:mt-20 mb-6 flex items-end justify-between gap-6 flex-wrap"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3">
              <span className={`${styles.chip} ${styles.chipPrimary}`}>Brand Repositioning</span>
              <h3 className="text-xl font-extrabold text-[var(--text-primary)]">파견·중개가 아닌, 연대·자산화·최첨단으로.</h3>
            </div>
            <div className={`${styles.mono} text-[11.5px] text-[var(--text-tertiary)]`}>
              기존 노동시장 (AS-IS) → MO-NO 포지셔닝 (TO-BE)
            </div>
          </motion.div>

          <motion.div 
            className="mb-16 bg-[var(--surface)] border border-[var(--border)] rounded overflow-hidden shadow-sm"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-[var(--text-primary)] text-[var(--background)] text-[12px] font-mono uppercase tracking-[0.12em] rounded-t">
              <div className="col-span-3 px-5 py-3 border-r border-[var(--background)]/10 font-bold">구분</div>
              <div className="col-span-4 px-5 py-3 border-r border-[var(--background)]/10 text-[var(--background)]/70">기존 노동시장 · AS-IS</div>
              <div className="col-span-5 px-5 py-3 text-[var(--primary)] font-bold">MO-NO 포지셔닝 · TO-BE</div>
            </div>
            {/* Table Body */}
            <div className="divide-y divide-[var(--border)]">
              {/* Row 1 */}
              <div className="grid grid-cols-12 items-stretch">
                <div className="col-span-3 px-5 py-5 bg-[var(--surface-raised)] border-r border-[var(--border)] flex flex-col justify-center">
                  <div className={`${styles.hEyebrow}`}>01</div>
                  <div className="font-bold text-sm text-[var(--text-primary)] mt-1">작업자 지위</div>
                </div>
                <div className="col-span-4 px-5 py-5 border-r border-[var(--border)] flex items-center">
                  <p className={`${styles.bodyMd} text-[var(--text-secondary)]/80`}>언제든 대체 가능한 일회성 소모품</p>
                </div>
                <div className="col-span-5 px-5 py-5 flex items-center">
                  <p className={`${styles.bodyMd} text-[var(--text-primary)]`}>땀의 가치를 증명하는 <strong>독립 기술 전문가(Expert)</strong></p>
                </div>
              </div>
              {/* Row 2 */}
              <div className="grid grid-cols-12 items-stretch">
                <div className="col-span-3 px-5 py-5 bg-[var(--surface-raised)] border-r border-[var(--border)] flex flex-col justify-center">
                  <div className={`${styles.hEyebrow}`}>02</div>
                  <div className="font-bold text-sm text-[var(--text-primary)] mt-1">보상과 금융</div>
                </div>
                <div className="col-span-4 px-5 py-5 border-r border-[var(--border)] flex items-center">
                  <p className={`${styles.bodyMd} text-[var(--text-secondary)]/80`}>현금 박치기 · 신용 불량 · 임금 체불</p>
                </div>
                <div className="col-span-5 px-5 py-5 flex items-center">
                  <p className={`${styles.bodyMd} text-[var(--text-primary)]`}>에스크로 당일 정산 · <strong>1금융권 대출 가능한 금융 자산</strong></p>
                </div>
              </div>
              {/* Row 3 */}
              <div className="grid grid-cols-12 items-stretch">
                <div className="col-span-3 px-5 py-5 bg-[var(--surface-raised)] border-r border-[var(--border)] flex flex-col justify-center">
                  <div className={`${styles.hEyebrow}`}>03</div>
                  <div className="font-bold text-sm text-[var(--text-primary)] mt-1">기업의 역할</div>
                </div>
                <div className="col-span-4 px-5 py-5 border-r border-[var(--border)] flex items-center">
                  <p className={`${styles.bodyMd} text-[var(--text-secondary)]/80`}>인력을 넘기고 수수료만 떼는 브로커</p>
                </div>
                <div className="col-span-5 px-5 py-5 flex items-center">
                  <p className={`${styles.bodyMd} text-[var(--text-primary)]`}>행정·법률·교육·장비를 전방위 지원하는 <strong>상생 매니지먼트</strong></p>
                </div>
              </div>
              {/* Row 4 */}
              <div className="grid grid-cols-12 items-stretch">
                <div className="col-span-3 px-5 py-5 bg-[var(--text-primary)] text-[var(--background)] border-r border-[var(--background)]/10 flex flex-col justify-center">
                  <div className={`${styles.hEyebrow}`} style={{ color: 'var(--primary)' }}>04</div>
                  <div className="font-bold text-sm text-[var(--background)] mt-1">미래 비전</div>
                </div>
                <div className="col-span-4 px-5 py-5 bg-[var(--text-primary)] text-[var(--background)]/75 border-r border-[var(--background)]/10 flex items-center">
                  <p className={`${styles.bodyMd}`}>몸이 망가지면 끝나는 유한한 육체노동</p>
                </div>
                <div className="col-span-5 px-5 py-5 bg-[var(--text-primary)] text-[var(--background)] flex items-center">
                  <p className={`${styles.bodyMd} text-white`}>로봇을 통제하고 <strong className="text-[var(--primary)]">조각 투자(STO)</strong>로 배당받는 <strong className="text-[var(--primary)] font-semibold">Tech-Blue</strong></p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ============================== MISSING SECTION B: PREMIUM BRAND BUILD-UP ============================== */}
          <motion.div 
            className="mb-6 flex items-end justify-between gap-6 flex-wrap"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3">
              <span className={`${styles.chip} ${styles.chipPrimary}`}>Premium Brand Build-up</span>
              <h3 className="text-xl font-extrabold text-[var(--text-primary)]">노가다의 흔적을 지우고, 최첨단 브랜드 테크로 정렬한다.</h3>
            </div>
            <div className={`${styles.mono} text-[11.5px] text-[var(--text-tertiary)]`}>
              시각 자산 · 거점 공간 · 커뮤니티
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-4 mb-12">
            <motion.article 
              className={`bg-[var(--surface)] border border-[var(--border)] ${styles.lcorner} p-6 lg:p-7 shadow-sm`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className={`${styles.hEyebrow} mb-2`}>01 · Visual Identity</div>
              <h4 className="text-md font-extrabold mb-3 text-[var(--text-primary)]">테크웨어 &amp; 한정판 굿즈.</h4>
              <p className={`${styles.bodySm} mb-4`}>투박한 작업복 대신 블랙·사이언 톤의 고기능성 <strong>MO-NO Tech-wear</strong>. 캠프 수료 시 스페셜 뱃지와 한정판 가죽 수공구 벨트로 인증·확산을 설계합니다.</p>
              <ul className={`${styles.bodySm} list-disc pl-5 space-y-1 text-[var(--text-secondary)]`}>
                <li>Tech-wear 안전 의류 · 커스텀 보호구 패키지</li>
                <li>스페셜 뱃지 · 한정판 가죽 수공구 벨트</li>
                <li>인스타그램·숏폼 인증 자산화</li>
              </ul>
            </motion.article>

            <motion.article 
              className={`bg-[var(--surface)] border border-[var(--border)] ${styles.lcorner} p-6 lg:p-7 shadow-sm`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className={`${styles.hEyebrow} mb-2`}>02 · O4O Base Camp</div>
              <h4 className="text-md font-extrabold mb-3 text-[var(--text-primary)]">프리미엄 모노 베이스캠프.</h4>
              <p className={`${styles.bodySm} mb-4`}>어둡고 칙칙한 인력 대기소 대신, 스틸·사이언 라이팅의 <strong>프리미엄 라운지</strong>. 대기 시간 자체를 ‘대우받는 전문가의 시간’으로 바꿉니다.</p>
              <ul className={`${styles.bodySm} list-disc pl-5 space-y-1 text-[var(--text-secondary)]`}>
                <li>에스프레소 카페바 · 스마트 샤워룸 · 세탁실</li>
                <li>3D 프린터 자재 출력실 · 공구 대여 라운지</li>
                <li>거점별 모듈러 베이스캠프 표준 패키지</li>
              </ul>
            </motion.article>

            <motion.article 
              className={`bg-[var(--text-primary)] text-[var(--background)] ${styles.lcorner} ${styles.lcornerTech} p-6 lg:p-7 shadow-md`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className={`${styles.hEyebrow} mb-2`} style={{ color: 'var(--primary)' }}>03 · Experts Club</div>
              <h4 className="text-md font-extrabold mb-3 text-white">엑스퍼트 어워즈 &amp; 데모데이.</h4>
              <p className="text-[13px] leading-relaxed text-slate-300 mb-4">연말 <strong>MO-NO Experts Tech Demo Day</strong>. 청년 전문가·실버 레전드·우수 글로벌 기술자를 무대 위로 올리고, 그들의 성장 서사를 다큐 영상으로 확산합니다.</p>
              <ul className="text-[12px] leading-relaxed text-slate-400 list-disc pl-5 space-y-1">
                <li>골든 웰딩·플라스터 어워즈 시상식</li>
                <li>4R 우승팀 합동 데모데이 · 라이브 중계</li>
                <li>다큐멘터리 콘텐츠 · 유튜브 시즌 시리즈</li>
              </ul>
            </motion.article>
          </div>

          {/* ============================== MISSING SECTION C: ACT 2 CLOSING CARD ============================== */}
          <motion.div 
            className={`bg-[var(--surface)] border border-[var(--border)] ${styles.lcorner} p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm`}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div>
              <div className={`${styles.hEyebrow} mb-2`}>2막 클로징</div>
              <p className="text-[15.5px] leading-relaxed text-[var(--text-primary)]">
                <strong>“가장 성실한 청년·은퇴 장인·외국인 엘리트를 가장 비용 효율적으로 락인하는 전문가 홀더(Expert Holder)”</strong> — 브랜딩으로 락인된 인력 인프라가, 5막의 자본 가치와 6막의 미래 인프라로 그대로 이어집니다.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <a href="#problem" className={styles.navBtn} style={{ background: 'var(--text-primary)', color: 'var(--background)' }}>
                3막 · 해결 과제로 <ArrowRight size={13} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className={styles.tapeDivider}></section>

      {/* ============================== S3 · PROBLEM & SOLUTION ============================== */}
      <section id="problem" className={`${styles.section} ${styles.grainBg}`}>
        <div className={styles.container}>
          <motion.div 
            className={styles.heroIntro}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className={styles.sectionLabel}>
              <span className={styles.num}>03</span> MoNo가 해결하고 싶은 과제들 · Problem & Solution
            </div>
            <h2 className={`${styles.hDisplay} ${styles.mt4}`}>
              현장의 네 가지 한계, MoNo의 네 가지 해결책.
            </h2>
            <p className={`${styles.bodyLg} ${styles.mt5}`}>
              각 카드를 클릭하면 문제와 해결이 같은 자리에서 마주 보도록 뒤집힙니다. 4개의 카드는 현장·공급사·미래 산업·규제라는 네 가지 한계를 어떻게 풀어내는지 보여줍니다.
            </p>
            <div className={`${styles.mono} text-[12px] flex items-center gap-1.5 mt-4 text-[var(--primary)]`}>
              <Sparkles size={14} /> 카드를 탭하면 해결책이 뒤집혀서 노출됩니다.
            </div>
          </motion.div>

          <div className={styles.cardGrid}>
            {/* Card 1 */}
            <div 
              className={`${styles.flipCard} ${flippedCards[0] ? styles.flipCardFlipped : ''}`}
              onClick={() => handleCardFlip(0)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardFlip(0); } }}
              tabIndex={0}
            >
              <div className={styles.flipInner}>
                <div className={`${styles.flipFace} ${styles.flipFront} ${styles.lcorner}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`${styles.chip} ${styles.chipSafety}`}>Problem · 현장 근무자</span>
                    <RotateCw size={15} className="text-[var(--text-tertiary)]" />
                  </div>
                  <h3 className="text-lg font-extrabold mb-3 text-[var(--text-primary)]">기술 성장의 단절, 그리고 금융 소외.</h3>
                  <p className={styles.bodyMd}>
                    10년을 일해도 경력 기록이 남지 않고, 비정형 노동자는 제도권 금융에서 배제됩니다. ‘오래 일했다’는 사실이 사회적으로 증명되지 않는 시장.
                  </p>
                  <div className={styles.flipFooter}>
                    <span>탭해서 해결책 보기</span>
                  </div>
                </div>
                <div className={`${styles.flipFace} ${styles.flipBack} ${styles.lcorner} ${styles.lcornerTech}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`${styles.chip} ${styles.chipPrimary}`}>Solution · MoNo</span>
                    <RotateCw size={15} className="text-[var(--primary)]" />
                  </div>
                  <h3 className="text-lg font-extrabold mb-3 text-white">데이터 인증 + 포용 금융.</h3>
                  <p className="text-[14.5px] leading-relaxed text-slate-200 mb-5">
                    블록체인 기반 출역·기술 데이터로 검증된 인증서를 발급하고, 그 데이터를 토대로 대안 신용 평가와 포용 금융(대출·보험·은퇴 설계)을 제공합니다.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className={`${styles.chip} ${styles.chipRound} ${styles.chipDark}`}>기술 인증서</span>
                    <span className={`${styles.chip} ${styles.chipRound} ${styles.chipDark}`}>대안 신용</span>
                    <span className={`${styles.chip} ${styles.chipRound} ${styles.chipDark}`}>포용 금융</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div 
              className={`${styles.flipCard} ${flippedCards[1] ? styles.flipCardFlipped : ''}`}
              onClick={() => handleCardFlip(1)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardFlip(1); } }}
              tabIndex={0}
            >
              <div className={styles.flipInner}>
                <div className={`${styles.flipFace} ${styles.flipFront} ${styles.lcorner}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`${styles.chip} ${styles.chipSafety}`}>Problem · 공급사</span>
                    <RotateCw size={15} className="text-[var(--text-tertiary)]" />
                  </div>
                  <h3 className="text-lg font-extrabold mb-3 text-[var(--text-primary)]">검증 안 된 인력, 떠안는 교육 비용.</h3>
                  <p className={styles.bodyMd}>
                    매번 검증되지 않은 인력으로 안전·품질 리스크를 떠안고, 교육 비용은 오롯이 공급사의 몫. 카르텔 구조의 인력사무소는 매칭 비용만 가중시킵니다.
                  </p>
                  <div className={styles.flipFooter}>
                    <span>탭해서 해결책 보기</span>
                  </div>
                </div>
                <div className={`${styles.flipFace} ${styles.flipBack} ${styles.lcorner} ${styles.lcornerTech}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`${styles.chip} ${styles.chipPrimary}`}>Solution · MoNo</span>
                    <RotateCw size={15} className="text-[var(--primary)]" />
                  </div>
                  <h3 className="text-lg font-extrabold mb-3 text-white">정밀 매칭 + 온사이트 교육.</h3>
                  <p className="text-[14.5px] leading-relaxed text-slate-200 mb-5">
                    기술 데이터 기반 정밀 매칭으로 첫 출역부터 검증 인력을 보내고, 온사이트 안전·기술 교육과 인력 관제 SaaS로 작업 효율을 실시간 측정합니다.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className={`${styles.chip} ${styles.chipRound} ${styles.chipDark}`}>정밀 매칭</span>
                    <span className={`${styles.chip} ${styles.chipRound} ${styles.chipDark}`}>온사이트 교육</span>
                    <span className={`${styles.chip} ${styles.chipRound} ${styles.chipDark}`}>관제 SaaS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div 
              className={`${styles.flipCard} ${flippedCards[2] ? styles.flipCardFlipped : ''}`}
              onClick={() => handleCardFlip(2)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardFlip(2); } }}
              tabIndex={0}
            >
              <div className={styles.flipInner}>
                <div className={`${styles.flipFace} ${styles.flipFront} ${styles.lcorner}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`${styles.chip} ${styles.chipSafety}`}>Problem · 미래 산업</span>
                    <RotateCw size={15} className="text-[var(--text-tertiary)]" />
                  </div>
                  <h3 className="text-lg font-extrabold mb-3 text-[var(--text-primary)]">AI 시대, 단순 노동의 도태.</h3>
                  <p className={styles.bodyMd}>
                    단순 반복 노동은 AI와 로보틱스가 가장 먼저 대체합니다. 현장의 사람은 기계와 경쟁할 것인가, 함께 일할 것인가의 분기점에 서 있습니다.
                  </p>
                  <div className={styles.flipFooter}>
                    <span>탭해서 해결책 보기</span>
                  </div>
                </div>
                <div className={`${styles.flipFace} ${styles.flipBack} ${styles.lcorner} ${styles.lcornerTech}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`${styles.chip} ${styles.chipPrimary}`}>Solution · MoNo</span>
                    <RotateCw size={15} className="text-[var(--primary)]" />
                  </div>
                  <h3 className="text-lg font-extrabold mb-3 text-white">로봇과 협업하는 Tech-Blue.</h3>
                  <p className="text-[14.5px] leading-relaxed text-slate-200 mb-5">
                    현장 근무자를 로봇과 협업하는 Tech-Blue 엔지니어로 전환합니다. 사람은 판단·감리·세팅을, 로봇은 위험·반복을 — 사람의 가치가 더 높아지는 구조.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className={`${styles.chip} ${styles.chipRound} ${styles.chipDark}`}>로봇 협업</span>
                    <span className={`${styles.chip} ${styles.chipRound} ${styles.chipDark}`}>엔지니어 전환</span>
                    <span className={`${styles.chip} ${styles.chipRound} ${styles.chipDark}`}>위험 자동화</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div 
              className={`${styles.flipCard} ${flippedCards[3] ? styles.flipCardFlipped : ''}`}
              onClick={() => handleCardFlip(3)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardFlip(3); } }}
              tabIndex={0}
            >
              <div className={styles.flipInner}>
                <div className={`${styles.flipFace} ${styles.flipFront} ${styles.lcorner}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`${styles.chip} ${styles.chipSafety}`}>Problem · 규제</span>
                    <RotateCw size={15} className="text-[var(--text-tertiary)]" />
                  </div>
                  <h3 className="text-lg font-extrabold mb-3 text-[var(--text-primary)]">비자 행정, 해외 취업 장벽.</h3>
                  <p className={styles.bodyMd}>
                    외국인 비자 행정의 비효율과 해외 취업 시 한국 경력 미인정 — 인력의 흐름을 막는 규제는 시장의 가장 단단한 벽 중 하나입니다.
                  </p>
                  <div className={styles.flipFooter}>
                    <span>탭해서 해결책 보기</span>
                  </div>
                </div>
                <div className={`${styles.flipFace} ${styles.flipBack} ${styles.lcorner} ${styles.lcornerTech}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`${styles.chip} ${styles.chipPrimary}`}>Solution · MoNo</span>
                    <RotateCw size={15} className="text-[var(--primary)]" />
                  </div>
                  <h3 className="text-lg font-extrabold mb-3 text-white">비자 가점 + 국가 간 기술 표준.</h3>
                  <p className="text-[14.5px] leading-relaxed text-slate-200 mb-5">
                    성실도·기술 데이터를 E-7-4 숙련기능비자 가점으로 연계하고, 한·호·캐·일 간 기술 증명을 표준화하여 인력의 자유로운 흐름을 만듭니다.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className={`${styles.chip} ${styles.chipRound} ${styles.chipDark}`}>비자 가점</span>
                    <span className={`${styles.chip} ${styles.chipRound} ${styles.chipDark}`}>표준화</span>
                    <span className={`${styles.chip} ${styles.chipRound} ${styles.chipDark}`}>규제 샌드박스</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.tapeDivider}></section>

      {/* ============================== S4 · GTM STRATEGY ============================== */}
      <section id="gtm" className={styles.section}>
        <div className={styles.container}>
          <motion.div 
            className={styles.heroIntro}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className={styles.sectionLabel}>
              <span className={styles.num}>04</span> MoNo 단계별 GTM 전략 · Tournament & Founding Strategy
            </div>
            <h2 className={`${styles.hDisplay} ${styles.mt4}`}>
              모두의 창업 1라운드부터 우승까지, 단계별 통과 전략.
            </h2>
            <p className={`${styles.bodyLg} ${styles.mt5}`}>
              라운드마다 자금 규모·돌파 액션·규제 대응을 하나의 도면 위에 정렬했습니다. 4단계 라운드를 단계별 타임라인으로 투명하게 공개합니다.
            </p>
          </motion.div>

          <div className={styles.timeline}>
            {/* Round 1 */}
            <motion.article 
              className={`${styles.timelineItem} ${styles.lcorner} ${styles.timelineItemActive}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.timelineDot}>R1</div>
              <div className={styles.timelineGrid}>
                <div>
                  <span className={`${styles.chip} ${styles.chipDark} mb-3`}>R1 · 관찰평가</span>
                  <div className={`${styles.mono} text-[12px] text-[var(--text-tertiary)] mb-2`}>2026.05 – 07</div>
                  <h3 className="text-xl font-extrabold mb-3">성실한 도전자의 일지.</h3>
                  <p className={styles.bodyMd}>
                    책임멘토의 관찰·서면 평가에 대응하는 단계. 인력시장의 해상도와 정량 지표를 담은 현장 보고서를 매주 제출해, 4,000팀 중 가장 부지런한 도전자로 각인됩니다.
                  </p>
                </div>
                <div>
                  <div className={styles.timelineMetrics}>
                    <div className={styles.metricBox}>
                      <div className={styles.hEyebrow}>지원 자금</div>
                      <div className={`${styles.numDisplay} text-xl mt-1 text-[var(--text-primary)]`}>200만 원</div>
                      <div className={styles.bodySm}>창업 활동 자금</div>
                    </div>
                    <div className={styles.metricBox}>
                      <div className={styles.hEyebrow}>진출 규모</div>
                      <div className={`${styles.numDisplay} text-xl mt-1 text-[var(--text-primary)]`}>4,000 → 500</div>
                      <div className={styles.bodySm}>관찰평가 통과 팀</div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <div className={styles.hEyebrow}>돌파 액션</div>
                      <ul className={`${styles.bodySm} list-disc pl-4 mt-2 space-y-1`}>
                        <li>평택·화성 인력대기소 FGI · 사무소장 2 + 근로자 5</li>
                        <li>스마트건설협회 PoC 책임자 네트워크 구축</li>
                        <li>주간 보고서 마감 24시간 전 선제 제출</li>
                      </ul>
                    </div>
                    <div>
                      <div className={styles.hEyebrow}>규제 레버리지</div>
                      <p className={`${styles.bodySm} mt-2`}>
                        중소벤처기업부 「원스톱 자문단」을 선제 가동해, 노무 에스크로 결제 구조에 대한 전자금융거래법 자문 회신을 1R 보고서에 첨부.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Round 2 */}
            <motion.article 
              className={`${styles.timelineItem} ${styles.lcorner}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.timelineDot}>R2</div>
              <div className={styles.timelineGrid}>
                <div>
                  <span className={`${styles.chip} ${styles.chipDark} mb-3`}>R2 · 지역 공개 IR</span>
                  <div className={`${styles.mono} text-[12px] text-[var(--text-tertiary)] mb-2`}>2026.08 – 09</div>
                  <h3 className="text-xl font-extrabold mb-3">작동하는 연결의 첫 증명.</h3>
                  <p className={styles.bodyMd}>
                    인력 사무소장을 적이 아닌 동료로 끌어들이는 단계. 무상 관리 SaaS를 배포해 기존 카르텔을 흡수하고, 동남권 PoC 현장에서 실시간 매칭을 라이브 시연합니다.
                  </p>
                </div>
                <div>
                  <div className={styles.timelineMetrics}>
                    <div className={styles.metricBox}>
                      <div className={styles.hEyebrow}>지원 자금</div>
                      <div className={`${styles.numDisplay} text-xl mt-1 text-[var(--text-primary)]`}>2,000만 원</div>
                      <div className={styles.bodySm}>지역 IR 통과 보상</div>
                    </div>
                    <div className={styles.metricBox}>
                      <div className={styles.hEyebrow}>진출 규모</div>
                      <div className={`${styles.numDisplay} text-xl mt-1 text-[var(--text-primary)]`}>500 → 100</div>
                      <div className={styles.bodySm}>지역 공개 IR 통과</div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <div className={styles.hEyebrow}>돌파 액션</div>
                      <ul className={`${styles.bodySm} list-disc pl-4 mt-2 space-y-1`}>
                        <li>인력 사무소장 100팀 무상 관리 SaaS 배포</li>
                        <li>동남권 PoC 현장 실시간 매칭 라이브 시연</li>
                        <li>지자체·건설사 협약 MOU 3건 체결</li>
                      </ul>
                    </div>
                    <div>
                      <div className={styles.hEyebrow}>상생 레버리지</div>
                      <p className={`${styles.bodySm} mt-2`}>
                        ‘인력사무소를 적이 아니라 동료로 만든 도전자’ 구도 세팅. 기존 생태계 카르텔을 연합 파트너로 편입해 리스크 흡수.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Round 3 */}
            <motion.article 
              className={`${styles.timelineItem} ${styles.lcorner}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.timelineDot}>R3</div>
              <div className={styles.timelineGrid}>
                <div>
                  <span className={`${styles.chip} ${styles.chipDark} mb-3`}>R3 · 권역 비공개 IR</span>
                  <div className={`${styles.mono} text-[12px] text-[var(--text-tertiary)] mb-2`}>2026.10 – 11</div>
                  <h3 className="text-xl font-extrabold mb-3">자산 경량화 · 자본 효율의 증명.</h3>
                  <p className={styles.bodyMd}>
                    VC·FI 대상 비공개 IR. 이종창업 법적 클리어와 Asset-Light 장비 STO 구조를 공개해, 동일 자본으로 더 큰 시장을 커버하는 자본 효율을 증명합니다.
                  </p>
                </div>
                <div>
                  <div className={styles.timelineMetrics}>
                    <div className={styles.metricBox}>
                      <div className={styles.hEyebrow}>지원 자금</div>
                      <div className={`${styles.numDisplay} text-xl mt-1 text-[var(--text-primary)]`}>2억 원</div>
                      <div className={styles.bodySm}>권역 IR 통과 보상</div>
                    </div>
                    <div className={styles.metricBox}>
                      <div className={styles.hEyebrow}>진출 규모</div>
                      <div className={`${styles.numDisplay} text-xl mt-1 text-[var(--text-primary)]`}>100 → 20</div>
                      <div className={styles.bodySm}>권역 비공개 IR 통과</div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <div className={styles.hEyebrow}>돌파 액션</div>
                      <ul className={`${styles.bodySm} list-disc pl-4 mt-2 space-y-1`}>
                        <li>장비 STO 구조 공개 · 초기 CAPEX 82% 절감</li>
                        <li>VC·FI 합동 비공개 IR · 사전 NDA 체결</li>
                        <li>이종창업 법적 클리어 자문 회신문 첨부</li>
                      </ul>
                    </div>
                    <div>
                      <div className={styles.hEyebrow}>자본 레버리지</div>
                      <p className={`${styles.bodySm} mt-2`}>
                        동일 운영자본으로 더 넓은 시장 영역을 자본 경량화(Asset-Light)로 장악하는 시나리오 확보.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Round 4 */}
            <motion.article 
              className={`${styles.timelineItem} ${styles.lcorner} ${styles.lcornerTech}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ borderColor: 'var(--primary)', borderWidth: '2px' }}
            >
              <div className={styles.timelineDot} style={{ background: 'var(--primary)', color: '#ffffff' }}>R4</div>
              <div className={styles.timelineGrid}>
                <div>
                  <span className={`${styles.chip} ${styles.chipPrimary} mb-3`}>R4 · 대국민 IR</span>
                  <div className={`${styles.mono} text-[12px] text-[var(--primary)] mb-2`}>2026.12 –</div>
                  <h3 className="text-xl font-extrabold mb-3">감동 서사 × 딥테크의 피날레.</h3>
                  <p className={styles.bodyMd}>
                    대국민 투표와 심사단을 동시에 휩쓸기 위한 마지막 라운드. Tech-Blue 상생 비전을 선포하고, 외국인 비자 규제 샌드박스 1호를 공식 제안합니다.
                  </p>
                </div>
                <div>
                  <div className={styles.timelineMetrics}>
                    <div className={`${styles.metricBox} ${styles.metricBoxDark}`}>
                      <div className={styles.hEyebrow} style={{ color: 'var(--primary)' }}>최종 실탄</div>
                      <div className={`${styles.numDisplay} text-xl mt-1 text-[var(--primary)]`}>최대 10억</div>
                      <div className={styles.bodySm}>우승 직접 사업 자금</div>
                    </div>
                    <div className={`${styles.metricBox} ${styles.metricBoxDark}`}>
                      <div className={styles.hEyebrow} style={{ color: 'var(--primary)' }}>최종 진출</div>
                      <div className={`${styles.numDisplay} text-xl mt-1 text-[var(--primary)]`}>20 → 5</div>
                      <div className={styles.bodySm}>대국민 IR 최종 우승팀</div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <div className={styles.hEyebrow} style={{ color: 'var(--primary)' }}>대국민 액션</div>
                      <ul className={`${styles.bodySm} list-disc pl-4 mt-2 space-y-1`}>
                        <li>Tech-Blue 상생 비전 선포 · 청년 자립 캠페인 피크</li>
                        <li>외국인 비자 규제 샌드박스 1호 공식 제안</li>
                        <li>대국민 투표 캠페인 · 라이브 현장 중계</li>
                      </ul>
                    </div>
                    <div>
                      <div className={styles.hEyebrow} style={{ color: 'var(--primary)' }}>우승 레버리지</div>
                      <p className={`${styles.bodySm} mt-2`}>
                        감동 서사(청년·외국인·은퇴 세대)와 딥테크(로보틱스·STO)를 결합하여 압도적인 여론 지지 확보.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          </div>

          {/* Section 4 bottom Milestones */}
          <div className={styles.milestonesContainer}>
            <div className={styles.milestonesHeader}>
              <div>
                <div className={styles.sectionLabel} style={{ marginBottom: '8px' }}>
                  <span className={styles.num}>04+</span> 기업 가치 제고
                </div>
                <h3 className="text-2xl font-extrabold text-[var(--text-primary)]">대회 통과가 아니라, 기업 가치 사다리.</h3>
                <p className={`${styles.bodyMd} mt-2`}>
                  라운드마다 MoNo의 기업 가치는 한 단씩 올라서야 합니다. 지표, 고객, 규제 해자를 다차원적으로 빌드합니다.
                </p>
              </div>
              <span className={`${styles.chip} ${styles.chipPrimary}`}>Top 10 · 우승 트랙</span>
            </div>

            <div className={styles.milestonesGrid}>
              <div className={styles.milestoneCell}>
                <div className={`${styles.mono} text-[11px] text-[var(--primary)] mb-2`}>R1 통과</div>
                <div className="text-[17px] font-extrabold mb-2">사전평가가치</div>
                <div className={styles.bodySm}>소규모 활동자금 200만 + 현장 PoC 1건 = 도메인 시장 해상도 확보.</div>
              </div>
              <div className={styles.milestoneCell}>
                <div className={`${styles.mono} text-[11px] text-[var(--primary)] mb-2`}>R2 통과</div>
                <div className="text-[17px] font-extrabold mb-2">초기 트랙션</div>
                <div className={styles.bodySm}>인력사무소 100개 무상 SaaS 배포 → 기존 카르텔을 동맹으로 흡수, 고객 기반 확보.</div>
              </div>
              <div className={styles.milestoneCell}>
                <div className={`${styles.mono} text-[11px] text-[var(--primary)] mb-2`}>R3 통과</div>
                <div className="text-[17px] font-extrabold mb-2">자본 경량화</div>
                <div className={styles.bodySm}>장비 STO로 초기 CAPEX 82% 절감. 동일 자본으로 더 넓은 시장을 커버하는 Asset-Light 구조 증명.</div>
              </div>
              <div className={`${styles.milestoneCell} ${styles.milestoneCellActive} ${styles.lcorner} ${styles.lcornerTech}`}>
                <div className={`${styles.mono} text-[11px] text-[var(--primary)] mb-2`}>R4 우승</div>
                <div className="text-[17px] font-extrabold text-[var(--primary)] mb-2">규제 샌드박스</div>
                <div className={styles.bodySm}>외국인 비자 규제 샌드박스 1호 공식 제안 + 대국민 IR 통과로 독점적 규제 해자 확보.</div>
              </div>
            </div>

            <div className="mt-8 border border-[var(--border)] bg-[var(--surface-raised)] px-6 py-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 rounded animate-fade-in">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="w-10 h-10 bg-[var(--text-primary)] text-[var(--background)] grid place-items-center rounded"><ArrowDown size={18} /></span>
                <div>
                  <div className={styles.sectionLabel} style={{ marginBottom: '2px' }}>
                    GTM 종료 → 수익 구조 개시
                  </div>
                  <p className={`${styles.bodyMd} mt-0.5`}>대회에서 확보한 증명·고객·규제 사다리 위에, 이제 VC·FI가 투자를 확신할 수 있는 BM 4축 수익 망을 펼칩니다.</p>
                </div>
              </div>
              <a href="#invest" className={styles.navBtn}>
                5막 · 투자 전략으로 <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.tapeDivider}></section>

      {/* ============================== S5 · BM & CHARTS ============================== */}
      <section id="invest" className={`${styles.section} ${styles.grainBg}`}>
        <div className={styles.container}>
          <motion.div 
            className={styles.heroIntro}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className={styles.sectionLabel}>
              <span className={styles.num}>05</span> 기업 가치 극대화 전략 · Business Model & Valuation
            </div>
            <h2 className={`${styles.hDisplay} ${styles.mt4}`}>
              VC가 보는 네 갈래 수익 구조.
            </h2>
            <p className={`${styles.bodyLg} ${styles.mt5}`}>
              노동 데이터를 중심으로 금융·SaaS·O2O·커머스가 동시에 점화됩니다. 같은 데이터에서 네 갈래의 매출이 동시에 흘러나오는 구조 — 이것이 MoNo의 기업 가치 극대화 전략입니다.
            </p>
          </motion.div>

          {/* Recharts Grid */}
          <div className={styles.chartsGrid}>
            {/* Doughnut Chart */}
            <motion.div 
              className={`${styles.chartCard} ${styles.lcorner}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.chartHeader}>
                <div>
                  <div className={styles.hEyebrow}>수익 구성 · 안정기</div>
                  <h3 className="text-lg font-extrabold mt-1">매출 비중 (Doughnut)</h3>
                </div>
                <span className={`${styles.chip} ${styles.chipPrimary}`}>안정기 비중</span>
              </div>
              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="45%"
                      innerRadius="58%"
                      outerRadius="80%"
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      contentStyle={{ 
                        backgroundColor: tooltipBgColor, 
                        borderColor: tooltipBorderColor,
                        borderRadius: '4px',
                        color: textDarkColor,
                        fontFamily: 'var(--font-sans)',
                        fontSize: '13px'
                      }}
                      formatter={(value) => [`${value}%`, '매출 비중']}
                    />
                    <ChartLegend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                      iconSize={10}
                      wrapperStyle={{ 
                        fontSize: '12px',
                        fontWeight: 500,
                        color: textDarkColor,
                        fontFamily: 'var(--font-sans)',
                        paddingTop: '10px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Bar Chart */}
            <motion.div 
              className={`${styles.chartCard} ${styles.lcorner}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className={styles.chartHeader}>
                <div>
                  <div className={styles.hEyebrow}>매출 시나리오 · 4개년</div>
                  <h3 className="text-lg font-extrabold mt-1">연도별 매출 추이 (Bar)</h3>
                </div>
                <span className={`${styles.chip} ${styles.chipPrimary}`}>단위 : 억 원</span>
              </div>
              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    margin={{ top: 20, right: 10, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis 
                      dataKey="year" 
                      stroke={textSecondaryColor} 
                      tickLine={false}
                      tick={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 600, fill: textDarkColor }}
                    />
                    <YAxis 
                      stroke={textSecondaryColor} 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fontFamily: 'monospace', fill: textDarkColor }}
                      tickFormatter={(value) => `${value}억`}
                    />
                    <ChartTooltip
                      contentStyle={{ 
                        backgroundColor: tooltipBgColor, 
                        borderColor: tooltipBorderColor,
                        borderRadius: '4px',
                        color: textDarkColor,
                        fontFamily: 'var(--font-sans)',
                        fontSize: '13px'
                      }}
                      formatter={(value) => [`${value}억 원`, '연 매출']}
                    />
                    <Bar 
                      dataKey="sales" 
                      radius={[4, 4, 0, 0]}
                      barSize={48}
                    >
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} stroke="var(--border-strong)" strokeWidth={1} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* 4-Axis Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <article className={`${styles.chartCard} ${styles.lcorner} ${styles.hoverLift}`}>
              <div className={styles.bmBarIndicator} style={{ backgroundColor: '#0E7490' }} />
              <div className={styles.hEyebrow}>35% · 금융 혁신·PG</div>
              <h3 className="text-md font-extrabold mt-2 mb-2">데이터 금융 엔진</h3>
              <p className={styles.bodySm}>
                노동 데이터를 활용한 대안 신용 평가와 PG(전자지급결제) 라이선스로, 에스크로 결제·송금에서 수수료를 확보합니다.
              </p>
            </article>

            <article className={`${styles.chartCard} ${styles.lcorner} ${styles.hoverLift}`}>
              <div className={styles.bmBarIndicator} style={{ backgroundColor: 'var(--primary)' }} />
              <div className={styles.hEyebrow}>25% · B2B SaaS 구독</div>
              <h3 className="text-md font-extrabold mt-2 mb-2">공급사 인력 관제</h3>
              <p className={styles.bodySm}>
                공급사 대상 유료 인력 관제 SaaS 구독 모델. 매칭·계약·정산·안전이 한 대시보드에 묶여, 작업 효율 측정까지 한 번에.
              </p>
            </article>

            <article className={`${styles.chartCard} ${styles.lcorner} ${styles.hoverLift}`}>
              <div className={styles.bmBarIndicator} style={{ backgroundColor: '#22D3EE' }} />
              <div className={styles.hEyebrow}>15% · O2O 상생 제휴</div>
              <h3 className="text-md font-extrabold mt-2 mb-2">인력사무소 협약 동맹</h3>
              <p className={styles.bodySm}>
                기존 오프라인 인력사무소에 무상 관리 툴을 제공해 MoNo 생태계로 편입. 분쟁 대신 동맹으로 시장 전환을 완성합니다.
              </p>
            </article>

            <article className={`${styles.chartCard} ${styles.lcorner} ${styles.hoverLift}`}>
              <div className={styles.bmBarIndicator} style={{ backgroundColor: '#F2C200' }} />
              <div className={styles.hEyebrow}>25% · 커머스·장비 물류</div>
              <h3 className="text-md font-extrabold mt-2 mb-2">렌탈 및 운송 Take-rate</h3>
              <p className={styles.bodySm}>
                인력·장비 스마트 운송망 + 작업복(테크웨어)·공구·중장비 렌탈/판매로, 현장 곁에 머무는 추가 Take-rate 수익을 만듭니다.
              </p>
            </article>
          </div>

          {/* Valuation Note */}
          <div className={styles.valuationBox}>
            <div className={styles.valGrid}>
              <div>
                <div className={styles.hEyebrow} style={{ color: 'var(--primary)' }}>VC·FI 핵심 포인트</div>
                <h3 className="text-2xl font-extrabold mt-2 text-white">한 사람의 출역 로그가, 네 갈래 매출의 시작점이 됩니다.</h3>
                <p className="text-[14.5px] leading-relaxed text-slate-200 mt-3">
                  금융·SaaS·O2O·커머스 매출은 모두 ‘노동 데이터’라는 단일 원천에서 흘러나옵니다. 단일 데이터·다중 수익 구조는 LTV를 높이고 CAC를 낮추는 가장 효율적인 BM 구조입니다.
                </p>
              </div>
              <div className={styles.valStats}>
                <div className={styles.valStatCard}>
                  <div className={styles.hEyebrow}>LTV</div>
                  <div className={`${styles.numDisplay} text-3xl mt-1 text-[var(--primary)]`}>×7배</div>
                </div>
                <div className={styles.valStatCard}>
                  <div className={styles.hEyebrow}>CAC</div>
                  <div className={`${styles.numDisplay} text-3xl mt-1 text-[var(--primary)]`}>−60%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== S6 · VISION (THEME-ADAPTIVE CLIMAX) ============================== */}
      <section id="vision" className={styles.visionSection}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(900px 500px at 80% 10%, rgba(34,211,238,0.18), transparent 60%), radial-gradient(700px 400px at 10% 90%, rgba(242,194,0,0.10), transparent 60%)' }} />
        <div className={styles.blueprintBg} />
        <div className={styles.container}>
          <motion.div 
            className={styles.heroIntro}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className={styles.sectionLabel} style={{ color: '#22D3EE' }}>
              <span className={styles.num} style={{ color: '#22D3EE', borderColor: 'rgba(34, 211, 238, 0.3)', background: 'rgba(10, 15, 26, 0.6)' }}>06</span> MoNo가 그리는 미래 · The Tech-Blue Vision
            </div>
            <h2 className={`text-3xl lg:text-4xl font-extrabold ${styles.mt4} leading-tight ${styles.visionTextPrimary}`}>
              사람의 데이터로 로봇과 미래 산업을 만듭니다.
            </h2>
            <p className={`text-[15.5px] ${styles.mt5} leading-relaxed max-w-3xl ${styles.visionTextSecondary}`}>
              근무 데이터가 모이면, 그것은 곧 다음 세대 산업의 도면이 됩니다. MoNo의 끝점은 더 이상 ‘인력 플랫폼’이 아닌, 노동·로보틱스·자본을 잇는 Tech-Blue 인프라 기업입니다.
            </p>
          </motion.div>

          <div className={styles.visionGrid}>
            {/* Vision Card 1 */}
            <article className={`${styles.visionCard} ${styles.lcorner} ${styles.visionLcornerTech}`}>
              <div className={styles.visionHeader}>
                <span className={styles.visionNum}>01</span>
                <span style={{ color: '#22D3EE' }}><Cpu size={24} /></span>
              </div>
              <div className={styles.hEyebrow} style={{ color: '#22D3EE' }}>Tech-Blue Robotics</div>
              <h3 className={`text-lg font-extrabold mt-1 mb-2 ${styles.visionTextPrimary}`}>현장의 데이터로 로봇 R&amp;D.</h3>
              <p className={`text-[13.5px] leading-relaxed ${styles.visionTextSecondary}`}>
                현장의 동작·판단·노하우 데이터를 로보틱스 R&amp;D에 직접 흘려보냅니다. 로봇은 더 정밀해지고, 작업자는 더 안전한 방향으로 진화합니다.
              </p>
            </article>

            {/* Vision Card 2 */}
            <article className={`${styles.visionCard} ${styles.lcorner} ${styles.visionLcornerTech}`}>
              <div className={styles.visionHeader}>
                <span className={styles.visionNum}>02</span>
                <span style={{ color: '#22D3EE' }}><Truck size={24} /></span>
              </div>
              <div className={styles.hEyebrow} style={{ color: '#22D3EE' }}>스마트 운송·미래 장비</div>
              <h3 className={`text-lg font-extrabold mt-1 mb-2 ${styles.visionTextPrimary}`}>운송망 × 판매·대여 서비스.</h3>
              <p className={`text-[13.5px] leading-relaxed ${styles.visionTextSecondary}`}>
                인력·장비의 흐름을 실시간으로 잇는 스마트 운송망과, 미래형 건설/산업 장비의 RaaS(Robot as a Service) 구독 모델을 구축합니다.
              </p>
            </article>

            {/* Vision Card 3 */}
            <article className={`${styles.visionCard} ${styles.lcorner} ${styles.visionLcornerTech}`}>
              <div className={styles.visionHeader}>
                <span className={styles.visionNum}>03</span>
                <span style={{ color: '#22D3EE' }}><Construction size={24} /></span>
              </div>
              <div className={styles.hEyebrow} style={{ color: '#22D3EE' }}>Tech-Blue 엔지니어링 현장 근무자</div>
              <h3 className={`text-lg font-extrabold mt-1 mb-2 ${styles.visionTextPrimary}`}>데이터를 통제하는 현장 근무자.</h3>
              <p className={`text-[13.5px] leading-relaxed ${styles.visionTextSecondary}`}>
                육체노동자가 아니라, 데이터를 보며 로봇을 지휘하고 공정을 통제하는 ‘Tech-Blue 엔지니어링 현장 근무자’를 길러냅니다.
              </p>
            </article>

            {/* Vision Card 4 */}
            <article className={`${styles.visionCard} ${styles.lcorner} ${styles.visionLcornerTech}`}>
              <div className={styles.visionHeader}>
                <span className={styles.visionNum}>04</span>
                <span style={{ color: '#22D3EE' }}><Coins size={24} /></span>
              </div>
              <div className={styles.hEyebrow} style={{ color: '#22D3EE' }}>Tech-Blue 펀딩 · STO</div>
              <h3 className={`text-lg font-extrabold mt-1 mb-2 ${styles.visionTextPrimary}`}>고가 장비를 쪼개서 사고, 대여 수익.</h3>
              <p className={`text-[13.5px] leading-relaxed ${styles.visionTextSecondary}`}>
                개인이 사기 힘든 수억 원대 로봇·중장비를 STO로 조각 소유. 직접 일하지 않아도 장비 임대 수익이 들어오는, 노동과 자본의 결합형 금융 생태계를 완성합니다.
              </p>
            </article>
          </div>

          {/* Manifesto Box */}
          <div className={`${styles.manifestoBox} ${styles.lcorner} ${styles.visionLcornerTech}`}>
            <div className={styles.manifestoGrid}>
              <div>
                <div className={styles.hEyebrow} style={{ color: '#22D3EE' }}>우리의 약속</div>
                <h3 className={`text-2xl lg:text-3xl font-extrabold mt-3 leading-snug ${styles.visionTextPrimary}`}>
                  우리는 현장에서 <span className={styles.visionPrimaryAccent}>답</span>을 찾습니다. <br />
                  당신의 땀은 <span className={styles.visionPrimaryAccent}>헛되지 않습니다</span>.
                </h3>
                <p className={`mt-5 leading-relaxed ${styles.visionTextSecondary}`}>
                  거친 손등 위에 맺힌 땀방울 하나하나가 곧 데이터가 되고, 그 데이터가 로봇의 <span className={`${styles.visionPrimaryAccent} font-semibold`}>신경계</span>가 되어 현장을 더 안전하고 효율적으로 바꿉니다. 우리는 단순한 로봇 회사가 아닙니다.
                </p>
              </div>
              <div>
                <div className={`border-l-2 ${styles.visionBorderAccent} pl-5 space-y-4`}>
                  <p className={`text-[14.5px] leading-relaxed ${styles.visionTextSecondary}`}>
                    MoNo는 현장 근무자가 기술의 주인으로 우뚝 서고, 자신이 쌓아 올린 기술적 가치만큼 <span className={`${styles.visionPrimaryAccent} font-semibold`}>금융적 자유</span>를 보장받는 새로운 생태계를 만드는 기술 동반자입니다.
                  </p>
                  <p className={`text-[14.5px] leading-relaxed ${styles.visionTextSecondary}`}>
                    당신의 땀은 미래를 설계하는 로보틱스의 <span className={`${styles.visionPrimaryAccent} font-semibold`}>설계도</span>이자, 당신의 삶을 더 자유롭게 할 가장 확실한 <span className={`${styles.visionPrimaryAccent} font-semibold`}>투자</span>입니다.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-6">
                  <span className={styles.visionChip}>현장의 데이터화</span>
                  <span className={styles.visionChip}>금융의 자유</span>
                  <span className={styles.visionChip}>Tech-Blue 진화</span>
                  <span className={styles.visionChip}>E-7-4 샌드박스 1호</span>
                </div>
              </div>
            </div>
            <div className={styles.manifestoDivider}>
              <div className={`font-sans font-extrabold text-xl lg:text-2xl tracking-tight ${styles.visionTextPrimary}`}>
                Welcome to <span className={styles.visionPrimaryAccent}>MoNo</span>, Welcome to <span className={styles.visionPrimaryAccent}>Tech-Blue</span>.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== FOOTER ============================== */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className="flex items-center gap-2.5">
            <div className={`${styles.logoBox} ${styles.lcorner} ${styles.lcornerTech}`}>
              <span>M</span>
            </div>
            <div className="font-extrabold tracking-tight text-[16px]">MoNo</div>
          </div>
          <div className={`${styles.mono} text-[11.5px] text-[var(--text-tertiary)]`}>
            © 2026 MoNo · 모두의 창업 프로젝트 통합 전략 페이지
          </div>
        </div>
      </footer>
    </div>
  );
}
