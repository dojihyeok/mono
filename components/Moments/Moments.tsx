'use client';

import { useState } from 'react';
import styles from './Moments.module.css';

const tabs = [
  { id: '01', label: '기술을 배우다' },
  { id: '02', label: '종자돈을 만들다' },
  { id: '03', label: '기술 배경을 만들다' },
  { id: '04', label: '원하는 삶을 살다' },
  { id: '05', label: '다시 시작하다' },
  { id: '06', label: '미래 현장에 닿다' },
];

const moments = [
  {
    id: '01',
    stepLabel: '01 처음 기술을 배우는 순간',
    title: '처음 기술을 배우는 순간',
    keyMessage: '살면서 꼭 필요한 기술을 배우는 순간부터\nMONO의 기록은 시작됩니다.',
    scene: '공구를 처음 손에 쥔 날, 도배지를 처음 바른 날, 조명을 처음 교체한 날.',
    description:
      '도배, 전기, 조명 교체, 간단한 보수, 공구 사용법처럼 누구나 삶에서 한 번쯤 필요로 하는 기술이 있습니다.\n\nMONO는 기술자가 처음 배운 기술, 받은 교육, 참여한 현장, 사용한 장비를 기록으로 남깁니다.\n\n작은 경험도 쌓이면 신뢰가 되고, 신뢰는 다음 일자리와 더 큰 기회로 이어집니다.',
    features: ['기본 프로필', '교육 이력', '기술 카테고리', '장비 사용 이력', '첫 현장 기록'],
    emoji: '🔧',
    color: 'var(--accent)',
  },
  {
    id: '02',
    stepLabel: '02 내 손으로 종자돈을 만드는 순간',
    title: '내 손으로 종자돈을 만드는 순간',
    keyMessage: '군대 가기 전, 인생의 다음 단계를 준비하는\n이 시간도 MONO 안에서 경력이 됩니다.',
    scene: '현장에서 땀 흘린 하루가 통장에 쌓이고, 내 미래의 선택지가 넓어지는 순간.',
    description:
      '청년은 군 입대 전 현장에서 일하며 돈을 모으고, 국민성장펀드 같은 장기 자산 형성 기회에 참여할 수 있습니다.\n\n제대 후에는 그 시간이 단순 아르바이트가 아니라, 기술 경험과 종자돈이 되어 다음 선택의 기반이 됩니다.\n\nMONO는 이런 근무 이력과 기술 경험을 기록해 청년이 다시 사회로 나올 때 더 좋은 현장과 기회로 연결될 수 있도록 돕습니다.',
    features: ['근무 이력', '급여 기록', '경력 카드', '금융 혜택 관심', '청년 기술자 프로필'],
    emoji: '💰',
    color: '#10B981',
  },
  {
    id: '03',
    stepLabel: '03 든든한 기술 배경을 만드는 순간',
    title: '든든한 기술 배경을 만드는 순간',
    keyMessage: '하고 싶은 꿈을 찾는 동안에도\n기술은 든든한 배경이 됩니다.',
    scene: '지게차 자격증을 따던 날, 용접 첫 아크를 켜던 날, 포크레인 레버를 처음 잡던 날.',
    description:
      '사람은 처음부터 하고 싶은 일을 정확히 알기 어렵습니다.\n\n그 시간을 그냥 흘려보내는 대신, 틈틈이 현장 경험을 쌓고 대형 화물, 지게차, 포크레인, 전기, 용접, 장비 운용 라이센스를 취득하면 삶의 선택지가 넓어집니다.\n\nMONO는 자격증, 교육 이력, 장비 사용 경험, 현장 경력을 하나의 신뢰 프로필로 연결합니다.',
    features: ['자격증 등록', '교육 이력', '장비 운용 이력', '전문 장비 프로필', '기업 추천 가능성'],
    emoji: '🏗️',
    color: '#F59E0B',
  },
  {
    id: '04',
    stepLabel: '04 내가 원하는 삶을 선택하는 순간',
    title: '내가 원하는 삶을 선택하는 순간',
    keyMessage: '기술은 한 곳에 묶이는 것이 아니라,\n원하는 삶을 선택할 수 있게 하는 힘입니다.',
    scene: '제주도 바다를 보며 퇴근하는 오후, 계절마다 새로운 도시에서 일하는 자유.',
    description:
      '누군가는 제주도에서 낮에는 일하고 저녁에는 서핑을 하고 싶을 수 있습니다.\n\n누군가는 계절마다 다른 지역에서 일하고, 누군가는 가족과 가까운 곳에서 안정적으로 일하고 싶을 수 있습니다.\n\nMONO는 지역, 직군, 경력, 장비 사용 이력, 희망 근무 조건을 바탕으로 기술자가 원하는 삶에 가까운 현장을 찾도록 돕습니다.',
    features: ['희망 지역', '희망 근무 조건', '지역별 공고', '기술자 프로필 공유', '팀 단위 현장 연결'],
    emoji: '🌊',
    color: '#3B82F6',
  },
  {
    id: '05',
    stepLabel: '05 다시 시작할 수 있는 순간',
    title: '갑작스러운 변화에도 다시 시작할 수 있는 순간',
    keyMessage: '퇴사, 은퇴, 업종 전환 이후에도\n내 기술 이력은 삶의 가치를 지켜주는 기반입니다.',
    scene: '갑작스러운 이별 통보 같은 퇴사. 그래도 내 손에는 기술이 남았습니다.',
    description:
      '갑작스러운 퇴사나 은퇴 이후에도 사람에게는 다시 일할 수 있는 기술과 경험이 남아 있습니다.\n\n문제는 그 경험을 증명할 수 있는 기록이 부족하다는 점입니다.\n\nMONO는 현장 경험, 안전교육, 자격, 장비 사용 이력을 축적해 새로운 일자리, 교육, 멘토, 팀장 역할로 이어질 수 있도록 돕습니다.',
    features: ['경력 자산화', '재취업 프로필', '교육 추천', '멘토·팀장 역할', '금융·보험 연계'],
    emoji: '🌱',
    color: '#8B5CF6',
  },
  {
    id: '06',
    stepLabel: '06 미래 산업 현장에 닿는 순간',
    title: '미래 산업 현장에 닿는 순간',
    keyMessage: '오늘의 기술 경험은 내일의 조선, 북극항로,\n우주 산업 현장으로 이어질 수 있습니다.',
    scene: '용접봉을 든 손이 언젠가 우주선 제작 현장에서 로봇과 함께하는 날.',
    description:
      '기술자의 경험은 현재의 공사 현장에만 머물지 않습니다.\n\n북극항로 개척 사업에서 배를 수리하고, 조선·플랜트 현장에서 스마트 장비를 다루고, 언젠가는 달나라로 가는 우주선 제작 현장에서 로봇으로 용접을 수행하는 미래까지 이어질 수 있습니다.\n\nMONO는 기술자의 현장 경험과 장비 사용 데이터를 축적해 Tech-Blue, AI 운영체제, AGI Core OS로 확장되는 산업 데이터의 기반을 만듭니다.',
    features: ['조선·플랜트 경력', '스마트 장비 이력', '로봇 장비 운용', 'Tech-Blue 데이터', 'AI 운영체제', 'AGI Core OS'],
    emoji: '🚀',
    color: '#EC4899',
  },
];

export default function Moments() {
  const [activeTab, setActiveTab] = useState('01');

  const activeMoment = moments.find((m) => m.id === activeTab)!;

  return (
    <section className={styles.section} id="moments">
      <div className={styles.inner}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>06</span>
          <h2 className={styles.sectionTitle}>MONO와 함께 만들어가는 순간들</h2>
          <p className={styles.mainTitle}>
            기술이 삶의 선택지가 되는 순간마다,<br />
            <span className={styles.accent}>MONO</span>가 함께합니다
          </p>
          <p className={styles.subText}>
            MONO는 기술자를 단순한 현장 인력이 아니라, 자신의 손으로 삶의 가능성을 넓혀가는 기술 장인으로 봅니다.
            <br className={styles.br} />
            도배, 전기, 조명 교체처럼 일상과 현장에서 꼭 필요한 기술부터 대형 화물, 포크레인, 조선, 플랜트, 우주 산업까지
            기술자의 경험은 MONO 안에서 이력과 신뢰 데이터가 됩니다.
          </p>
        </div>

        {/* Tabs */}
        <div className={styles.tabsWrapper}>
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={activeTab === tab.id ? { borderColor: moments.find(m => m.id === tab.id)?.color, color: moments.find(m => m.id === tab.id)?.color } : {}}
              >
                <span className={styles.tabNum}>{tab.id}</span>
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Card */}
        <div className={styles.card} key={activeTab}>
          {/* Step badge */}
          <div className={styles.stepBadge} style={{ background: activeMoment.color }}>
            <span className={styles.stepEmoji}>{activeMoment.emoji}</span>
            <span>{activeMoment.stepLabel}</span>
          </div>

          <div className={styles.cardBody}>
            {/* Left */}
            <div className={styles.cardLeft}>
              <h3 className={styles.momentTitle}>{activeMoment.title}</h3>

              <blockquote className={styles.keyMessage} style={{ borderColor: activeMoment.color }}>
                {activeMoment.keyMessage.split('\n').map((line, i) => (
                  <span key={i}>{line}<br /></span>
                ))}
              </blockquote>

              <div className={styles.sceneBox}>
                <span className={styles.sceneIcon}>📍 장면</span>
                <p className={styles.sceneText}>{activeMoment.scene}</p>
              </div>
            </div>

            {/* Right */}
            <div className={styles.cardRight}>
              <div className={styles.descBlock}>
                <span className={styles.descLabel}>MONO가 함께하는 방식</span>
                <div className={styles.descText}>
                  {activeMoment.description.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              <div className={styles.featuresBlock}>
                <span className={styles.descLabel}>연결 기능 · BM</span>
                <div className={styles.featureTags}>
                  {activeMoment.features.map((f) => (
                    <span key={f} className={styles.featureTag} style={{ borderColor: activeMoment.color + '60', color: activeMoment.color }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Progress dots */}
          <div className={styles.dots}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.dot} ${activeTab === tab.id ? styles.dotActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={activeTab === tab.id ? { background: activeMoment.color } : {}}
                aria-label={tab.label}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
