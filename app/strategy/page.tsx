'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Database, 
  RotateCw, 
  TrendingUp, 
  Coins, 
  Cpu, 
  Truck, 
  Construction, 
  CheckCircle2, 
  ArrowDown,
  LineChart,
  UserCheck,
  Building,
  Handshake,
  Layers,
  Sparkles,
  BookOpen
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
    setMounted(true);
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
            <div className={styles.hEyebrow}>
              <span className={styles.hEyebrowLine}></span>제1막 · MoNo 서비스 소개
            </div>
            <h2 className={`${styles.hDisplay} mt-3`}>
              일하는 사람과 사람을 찾는 회사를 한 곳에서 잇습니다.
            </h2>
            <p className={`${styles.bodyLg} mt-4`}>
              현장 근무자에게는 평생 가는 <strong>디지털 인력사무소</strong>를, 공급사에게는 검증된 인력을 즉각 호출하는 <strong>현장 인력 관제 플랫폼</strong>을. MoNo는 B2C와 B2B를 같은 데이터 레이어 위에 묶어, 인력 시장 전체를 단일 그래프로 만듭니다.
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
                <span className={`${styles.chip} ${styles.chipPrimary}`}>B2C · 현장 근무자</span>
                <span className={`${styles.mono} text-[11.5px] var(--text-secondary)`}>/ 디지털 인력사무소</span>
              </div>
              <h3 className="text-xl font-extrabold mb-3">어디서든 일하고, 내 기술이 자산이 되는 디지털 인력사무소.</h3>
              <p className={`${styles.bodyMd} mb-5`}>
                세계 어디에서 일하든 출역·기술·안전 데이터가 내 이름으로 기록됩니다. 그 데이터는 곧 금융·이주·교육으로 이어지는 통행증이 되어, 단발성 일용 노동을 한 사람의 평생 커리어로 잇습니다.
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
                <span className={`${styles.chip} ${styles.chipSafety}`}>B2B · 공급사 (원/하청)</span>
                <span className={`${styles.mono} text-[11.5px] text-yellow-500`}>/ 인력 관제 플랫폼</span>
              </div>
              <h3 className="text-xl font-extrabold mb-3">필요한 시간, 원하는 장소에서 검증된 인력을 즉각 호출.</h3>
              <p className={`${styles.bodyMd} mb-5`}>
                인력 모집·계약·정산·안전 관리가 한 대시보드에 모입니다. 현장 단위 관제 SaaS로 카르텔을 거치지 않고 검증 인력에 직접 닿고, 작업 효율은 데이터로 측정됩니다.
              </p>
              <div className={styles.specList}>
                <div className={styles.specRow}>
                  <div className={styles.specKey}>매칭</div>
                  <div className={styles.specVal}>기술 데이터 기반 정밀 매칭 · 호출 즉시 출역</div>
                </div>
                <div className={styles.specRow}>
                  <div className={styles.specKey}>정산</div>
                  <div className={styles.specVal}>스마트 에스크로 · 퇴근 즉시 일급 지급</div>
                </div>
                <div className={styles.specRow}>
                  <div className={styles.specKey}>안전</div>
                  <div className={styles.specVal}>일일 상해보험 자동 가입 · 산재 처리 자동화</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-5">
                <span className={`${styles.chip} ${styles.chipRound} ${styles.chipDark}`}>실시간 매칭</span>
                <span className={`${styles.chip} ${styles.chipRound} ${styles.chipDark}`}>에스크로 정산</span>
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
                <div className={styles.hEyebrow}>단일 데이터 레이어</div>
                <p className={`${styles.bodyMd} mt-1`}>
                  B2C와 B2B는 분리된 두 시장이 아니라, 같은 그래프 위에서 서로의 신뢰를 만들어내는 한 쌍의 노드입니다.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11.5px]">
              <span className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded">현장 근무자 노드</span>
              <span className="text-[var(--primary)] font-bold">⇄</span>
              <span className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded">공급사 노드</span>
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
            <div className={styles.hEyebrow}>
              <span className={styles.hEyebrowLine}></span>제2막 · MoNo 브랜드 철학
            </div>
            <h2 className={`${styles.hDisplay} mt-3`}>
              청년·워홀러·노마드·외국인·은퇴자, 모두를 위한 한 플랫폼.
            </h2>
            <p className={`${styles.bodyLg} mt-4`}>
              20대 자립부터 은퇴 후 현장까지, 한 사람의 인생 사이클을 그대로 받아내는 플랫폼. MoNo는 다섯 명의 다른 인생을 같은 데이터 경제권 위에서 만나게 합니다.
            </p>
          </motion.div>

          {/* Persona Tab Bar */}
          <div className={styles.tabContainer}>
            <button 
              onClick={() => setActivePersona('youth')} 
              className={`${styles.tabBtn} ${styles.lcorner} ${activePersona === 'youth' ? styles.tabBtnActive : ''}`}
            >
              <span className={styles.tabNum}>01</span> 20대 청년 · 자립
            </button>
            <button 
              onClick={() => setActivePersona('workholiday')} 
              className={`${styles.tabBtn} ${styles.lcorner} ${activePersona === 'workholiday' ? styles.tabBtnActive : ''}`}
            >
              <span className={styles.tabNum}>02</span> 해외 워홀러 · Tech-Passport
            </button>
            <button 
              onClick={() => setActivePersona('workation')} 
              className={`${styles.tabBtn} ${styles.lcorner} ${activePersona === 'workation' ? styles.tabBtnActive : ''}`}
            >
              <span className={styles.tabNum}>03</span> 워케이션 노마드
            </button>
            <button 
              onClick={() => setActivePersona('foreign')} 
              className={`${styles.tabBtn} ${styles.lcorner} ${activePersona === 'foreign' ? styles.tabBtnActive : ''}`}
            >
              <span className={styles.tabNum}>04</span> 외국인 근로자 · K-Work
            </button>
            <button 
              onClick={() => setActivePersona('retire')} 
              className={`${styles.tabBtn} ${styles.lcorner} ${activePersona === 'retire' ? styles.tabBtnActive : ''}`}
            >
              <span className={styles.tabNum}>05</span> 은퇴 세대 · 레거시 전문가
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
                    <span className={`${styles.chip} ${styles.chipSafety} mb-4`}>청년 · 10–20대</span>
                    <h3 className="text-2xl font-extrabold mb-3">수능 끝, 첫 종잣돈 800만 원을 내 손으로.</h3>
                    <p className={styles.bodyMd}>
                      의미 없는 단기 알바 대신 4주 라이프 테크 학습과 8주 집중 출역으로 종잣돈을 모읍니다. 등록금·창업 자금·세계일주 자금의 자립적 해방구. 노동이 처음으로 ‘내 자산’이 되는 경험을 만듭니다.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-5">
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>시드 캠프</span>
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>라이프 테크</span>
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>자립 아카데미</span>
                    </div>
                  </div>
                  <div>
                    <div className={styles.specList}>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>학습</div>
                        <div className={styles.specVal}>4주 라이프 테크 · 안전·세무·금융</div>
                      </div>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>출역</div>
                        <div className={styles.specVal}>8주 집중 출역 → 종잣돈 800만 원</div>
                      </div>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>전환</div>
                        <div className={styles.specVal}>등록금·창업 자금·세계일주 자금</div>
                      </div>
                    </div>
                    <div className={`${styles.personaQuoteBox} ${styles.lcorner} ${styles.lcornerTech}`}>
                      <div className={styles.hEyebrow}>대표 슬로건</div>
                      <div className="text-[14.5px] font-bold mt-1">알바 대신 MoNo. 첫 종잣돈, 내 손으로 짓는다.</div>
                    </div>
                  </div>
                </div>
              )}

              {activePersona === 'workholiday' && (
                <div className={styles.personaGrid}>
                  <div>
                    <span className={`${styles.chip} ${styles.chipPrimary} mb-4`}>해외 워홀러 · 20–30대</span>
                    <h3 className="text-2xl font-extrabold mb-3">내 기술 데이터가, 그대로 글로벌 통행증이 된다.</h3>
                    <p className={styles.bodyMd}>
                      한국에서 쌓은 출역·기술 데이터를 호주·캐나다·일본 현장에서 그대로 사용합니다. 시급 35달러 워킹홀리데이를 단발성 경험이 아닌 정식 커리어로 잇는 글로벌 노마드 트랙입니다.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-5">
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>글로벌 기술 여권</span>
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>국가 간 기술 증명</span>
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>시급 35달러</span>
                    </div>
                  </div>
                  <div>
                    <div className={styles.specList}>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>여권</div>
                        <div className={styles.specVal}>출역·기술 데이터 → 다국가 호환</div>
                      </div>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>시급</div>
                        <div className={styles.specVal}>호주·캐나다 현장 평균 35달러</div>
                      </div>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>표준</div>
                        <div className={styles.specVal}>한·호·캐·일 기술 인증 상호 인정</div>
                      </div>
                    </div>
                    <div className={`${styles.personaQuoteBox} ${styles.lcorner} ${styles.lcornerTech}`}>
                      <div className={styles.hEyebrow}>대표 슬로건</div>
                      <div className="text-[14.5px] font-bold mt-1">한국에서 쌓은 땀, 시드니 현장에서 다시 빛난다.</div>
                    </div>
                  </div>
                </div>
              )}

              {activePersona === 'workation' && (
                <div className={styles.personaGrid}>
                  <div>
                    <span className={`${styles.chip} ${styles.chipPrimary} mb-4`}>워케이션 노마드 · 20–40대</span>
                    <h3 className="text-2xl font-extrabold mb-3">제주 오전 현장, 오후 서핑. 한 달살이가 커리어가 된다.</h3>
                    <p className={styles.bodyMd}>
                      강원·제주·여수 등 권역별 현장과 워케이션 숙소를 묶은 워크 앤 라이브 패키지. 하루·한 달·일 년 단위로 머물면서 일하는 새로운 삶의 방식이 가능해집니다.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-5">
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>워크 앤 라이브</span>
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>권역 거주 패키지</span>
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>테크웨어</span>
                    </div>
                  </div>
                  <div>
                    <div className={styles.specList}>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>권역</div>
                        <div className={styles.specVal}>제주·강원·여수·부산 워케이션 거점</div>
                      </div>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>패키지</div>
                        <div className={styles.specVal}>오전 현장 + 오후 워케이션 · 일/월/년 단위</div>
                      </div>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>장비</div>
                        <div className={styles.specVal}>현장 안전 테크웨어 · 통근 셔틀</div>
                      </div>
                    </div>
                    <div className={`${styles.personaQuoteBox} ${styles.lcorner} ${styles.lcornerTech}`}>
                      <div className={styles.hEyebrow}>대표 슬로건</div>
                      <div className="text-[14.5px] font-bold mt-1">돈 벌면서 한달살이. 한 도시가, 한 시즌이 된다.</div>
                    </div>
                  </div>
                </div>
              )}

              {activePersona === 'foreign' && (
                <div className={styles.personaGrid}>
                  <div>
                    <span className={`${styles.chip} ${styles.chipPrimary} mb-4`}>외국인 근로자 · 숙련기능비자</span>
                    <h3 className="text-2xl font-extrabold mb-3">브로커 없는 현장, 합법적 K-Work 생태계.</h3>
                    <p className={styles.bodyMd}>
                      깜깜이 인력시장을 데이터로 투명화하고, 성실도·기술 데이터가 E-7-4 숙련기능비자 가점으로 연계되는 합법 트랙. 외국인 전문가에게 ‘가장 안전하고 자랑스러운 현장’을 제공합니다.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-5">
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>케이워크 경험</span>
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>비자 가점 연계</span>
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>존엄 노동</span>
                    </div>
                  </div>
                  <div>
                    <div className={styles.specList}>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>연수</div>
                        <div className={styles.specVal}>한국 기술 안전 연수 · 다국어 매뉴얼</div>
                      </div>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>비자</div>
                        <div className={styles.specVal}>성실도 지표 → E-7-4 숙련기능비자 가점</div>
                      </div>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>정산</div>
                        <div className={styles.specVal}>본국 송금까지 자동 처리 · 브로커 차단</div>
                      </div>
                    </div>
                    <div className={`${styles.personaQuoteBox} ${styles.lcorner} ${styles.lcornerTech}`}>
                      <div className={styles.hEyebrow}>대표 슬로건</div>
                      <div className="text-[14.5px] font-bold mt-1">가장 안전한 현장, 가장 자랑스러운 외국인 전문가.</div>
                    </div>
                  </div>
                </div>
              )}

              {activePersona === 'retire' && (
                <div className={styles.personaGrid}>
                  <div>
                    <span className={`${styles.chip} ${styles.chipPrimary} mb-4`}>은퇴 세대 · 50–60대</span>
                    <h3 className="text-2xl font-extrabold mb-3">갑작스러운 은퇴 대신, 베테랑의 손을 로봇 감리로.</h3>
                    <p className={styles.bodyMd}>
                      30년 손결을 디지털화하고, 본사 정직원 PM으로 현장을 감리하며 평생직장을 이어갑니다. 보유 장비는 STO로 자산화하여, 일하지 않을 때도 안정적인 임대 수익이 들어옵니다.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-5">
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>레거시 전문가</span>
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>로봇 감리 PM</span>
                      <span className={`${styles.chip} ${styles.chipRound} ${styles.chipPrimary}`}>장비 STO</span>
                    </div>
                  </div>
                  <div>
                    <div className={styles.specList}>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>계약</div>
                        <div className={styles.specVal}>본사 정직원 PM · 4대보험·퇴직금 보장</div>
                      </div>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>기록</div>
                        <div className={styles.specVal}>장인의 손결·판단·노하우 데이터화</div>
                      </div>
                      <div className={styles.specRow}>
                        <div className={styles.specKey}>자산</div>
                        <div className={styles.specVal}>장비 STO 조각 등록 → 임대 수익</div>
                      </div>
                    </div>
                    <div className={`${styles.personaQuoteBox} ${styles.lcorner} ${styles.lcornerTech}`}>
                      <div className={styles.hEyebrow}>대표 슬로건</div>
                      <div className="text-[14.5px] font-bold mt-1">레전드에서 레거시로. 로봇과 동행하는 평생 현장.</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
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
            <div className={styles.hEyebrow}>
              <span className={styles.hEyebrowLine}></span>제3막 · MoNo가 해결하고 싶은 과제들
            </div>
            <h2 className={`${styles.hDisplay} mt-3`}>
              현장의 네 가지 한계, MoNo의 네 가지 해결책.
            </h2>
            <p className={`${styles.bodyLg} mt-4`}>
              각 카드를 클릭하면, 문제(Problem)와 해결(Solution)이 같은 페이지 위에서 만나도록 뒤집힙니다. 4개의 카드는 현장·공급사·미래 산업·규제라는 네 갈래의 한계와, MoNo가 그 위에 덮는 새 도면을 보여줍니다.
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
            <div className={styles.hEyebrow}>
              <span className={styles.hEyebrowLine}></span>제4막 · MoNo GTM 전략
            </div>
            <h2 className={`${styles.hDisplay} mt-3`}>
              모두의 창업 1라운드부터 우승까지, 단계별 통과 전략.
            </h2>
            <p className={`${styles.bodyLg} mt-4`}>
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
                <div className={styles.hEyebrow}>제4막 · 기업 가치 제고</div>
                <h3 className="text-2xl font-extrabold mt-2">대회 통과가 아니라, 기업 가치 사다리.</h3>
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

            <div className="mt-8 border border-[var(--border)] bg-[var(--surface-raised)] px-6 py-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 rounded">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="w-10 h-10 bg-[var(--text-primary)] text-[var(--background)] grid place-items-center rounded"><ArrowDown size={18} /></span>
                <div>
                  <div className={styles.hEyebrow}>GTM 종료 → 투자 전략 개시</div>
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
            <div className={styles.hEyebrow}>
              <span className={styles.hEyebrowLine}></span>제5막 · VC & FI 투자를 받기 위한 전략
            </div>
            <h2 className={`${styles.hDisplay} mt-3`}>
              VC가 보는 네 갈래 수익 구조.
            </h2>
            <p className={`${styles.bodyLg} mt-4`}>
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

      {/* ============================== S6 · VISION (CINEMATIC DARK VIEW) ============================== */}
      <section id="vision" className={styles.visionSection}>
        <div className={styles.blueprintBg} style={{ opacity: 0.12 }} />
        <div className={styles.container}>
          <motion.div 
            className={styles.heroIntro}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className={styles.hEyebrow} style={{ color: 'var(--primary)' }}>
              <span className={styles.hEyebrowLine} style={{ backgroundColor: 'var(--primary)' }}></span>제6막 · MoNo가 그리는 미래
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold mt-3 text-white leading-tight">
              사람의 데이터로 로봇과 미래 산업을 만듭니다.
            </h2>
            <p className="text-slate-300 mt-4 leading-relaxed max-w-3xl">
              근무 데이터가 모이면, 그것은 곧 다음 세대 산업의 도면이 됩니다. MoNo의 끝점은 더 이상 ‘인력 플랫폼’이 아닌, 노동·로보틱스·자본을 잇는 Tech-Blue 인프라 기업입니다.
            </p>
          </motion.div>

          <div className={styles.visionGrid}>
            <article className={`${styles.visionCard} ${styles.lcorner} ${styles.lcornerTech}`}>
              <div className={styles.visionHeader}>
                <span className={styles.visionNum}>01</span>
                <span className="text-[var(--primary)]"><Cpu size={24} /></span>
              </div>
              <div className={styles.hEyebrow} style={{ color: 'var(--primary)' }}>Tech-Blue Robotics</div>
              <h3 className="text-lg font-extrabold text-white mt-1 mb-2">현장의 데이터로 로봇 R&D.</h3>
              <p className="text-[13.5px] leading-relaxed text-slate-300">
                현장의 동작·판단·노하우 데이터를 로보틱스 R&D에 직접 흘려보냅니다. 로봇은 더 정밀해지고, 작업자는 더 안전한 방향으로 진화합니다.
              </p>
            </article>

            <article className={`${styles.visionCard} ${styles.lcorner} ${styles.lcornerTech}`}>
              <div className={styles.visionHeader}>
                <span className={styles.visionNum}>02</span>
                <span className="text-[var(--primary)]"><Truck size={24} /></span>
              </div>
              <div className={styles.hEyebrow} style={{ color: 'var(--primary)' }}>스마트 운송·미래 장비</div>
              <h3 className="text-lg font-extrabold text-white mt-1 mb-2">운송망 × 판매·대여 서비스.</h3>
              <p className="text-[13.5px] leading-relaxed text-slate-300">
                인력·장비의 흐름을 실시간으로 잇는 스마트 운송망과, 미래형 건설/산업 장비의 RaaS(Robot as a Service) 구독 모델을 구축합니다.
              </p>
            </article>

            <article className={`${styles.visionCard} ${styles.lcorner} ${styles.lcornerTech}`}>
              <div className={styles.visionHeader}>
                <span className={styles.visionNum}>03</span>
                <span className="text-[var(--primary)]"><Construction size={24} /></span>
              </div>
              <div className={styles.hEyebrow} style={{ color: 'var(--primary)' }}>Tech-Blue 엔지니어링 현장 근무자</div>
              <h3 className="text-lg font-extrabold text-white mt-1 mb-2">데이터를 통제하는 현장 근무자.</h3>
              <p className="text-[13.5px] leading-relaxed text-slate-300">
                육체노동자가 아니라, 데이터를 보며 로봇을 지휘하고 공정을 통제하는 ‘Tech-Blue 엔지니어링 현장 근무자’를 길러냅니다.
              </p>
            </article>

            <article className={`${styles.visionCard} ${styles.lcorner} ${styles.lcornerTech}`}>
              <div className={styles.visionHeader}>
                <span className={styles.visionNum}>04</span>
                <span className="text-[var(--primary)]"><Coins size={24} /></span>
              </div>
              <div className={styles.hEyebrow} style={{ color: 'var(--primary)' }}>Tech-Blue 펀딩 · STO</div>
              <h3 className="text-lg font-extrabold text-white mt-1 mb-2">고가 장비를 쪼개서 사고, 대여 수익.</h3>
              <p className="text-[13.5px] leading-relaxed text-slate-300">
                개인이 사기 힘든 수억 원대 로봇·중장비를 STO로 조각 소유. 직접 일하지 않아도 장비 임대 수익이 들어오는, 노동과 자본의 결합형 금융 생태계를 완성합니다.
              </p>
            </article>
          </div>

          {/* Manifesto Box */}
          <div className={`${styles.manifestoBox} ${styles.lcorner} ${styles.lcornerTech}`}>
            <div className={styles.manifestoGrid}>
              <div>
                <div className={styles.hEyebrow} style={{ color: 'var(--primary)' }}>우리의 약속</div>
                <h3 className="text-2xl lg:text-3xl font-extrabold mt-3 text-white leading-snug">
                  우리는 현장에서 <span className="text-[var(--primary)]">답</span>을 찾습니다. <br />
                  당신의 땀은 <span className="text-[var(--primary)]">헛되지 않습니다</span>.
                </h3>
                <p className="text-slate-300 mt-5 leading-relaxed">
                  거친 손등 위에 맺힌 땀방울 하나하나가 곧 데이터가 되고, 그 데이터가 로봇의 <span className="text-[var(--primary)] font-semibold">신경계</span>가 되어 현장을 더 안전하고 효율적으로 바꿉니다. 우리는 단순한 로봇 회사가 아닙니다.
                </p>
              </div>
              <div>
                <div className="border-l-2 border-[var(--primary)] pl-5 space-y-4">
                  <p className="text-[14.5px] text-slate-300 leading-relaxed">
                    MoNo는 현장 근무자가 기술의 주인으로 우뚝 서고, 자신이 쌓아 올린 기술적 가치만큼 <span className="text-[var(--primary)] font-semibold">금융적 자유</span>를 보장받는 새로운 생태계를 만드는 기술 동반자입니다.
                  </p>
                  <p className="text-[14.5px] text-slate-300 leading-relaxed">
                    당신의 땀은 미래를 설계하는 로보틱스의 <span className="text-[var(--primary)] font-semibold">설계도</span>이자, 당신의 삶을 더 자유롭게 할 가장 확실한 <span className="text-[var(--primary)] font-semibold">투자</span>입니다.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-6">
                  <span className={`${styles.chip} ${styles.chipRound}`} style={{ color: 'var(--primary)', borderColor: 'rgba(6, 182, 212, 0.3)', background: 'rgba(6, 182, 212, 0.05)' }}>현장의 데이터화</span>
                  <span className={`${styles.chip} ${styles.chipRound}`} style={{ color: 'var(--primary)', borderColor: 'rgba(6, 182, 212, 0.3)', background: 'rgba(6, 182, 212, 0.05)' }}>금융의 자유</span>
                  <span className={`${styles.chip} ${styles.chipRound}`} style={{ color: 'var(--primary)', borderColor: 'rgba(6, 182, 212, 0.3)', background: 'rgba(6, 182, 212, 0.05)' }}>Tech-Blue 진화</span>
                  <span className={`${styles.chip} ${styles.chipRound}`} style={{ color: 'var(--primary)', borderColor: 'rgba(6, 182, 212, 0.3)', background: 'rgba(6, 182, 212, 0.05)' }}>E-7-4 샌드박스 1호</span>
                </div>
              </div>
            </div>
            <div className={styles.manifestoDivider}>
              <div className="font-sans font-extrabold text-xl lg:text-2xl text-white tracking-tight">
                Welcome to <span className="text-[var(--primary)]">MoNo</span>, Welcome to <span class="text-[var(--primary)]">Tech-Blue</span>.
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
