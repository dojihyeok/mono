'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';
import styles from './field-pass-v2.module.css';
import { FieldPassSection, type FieldPassSectionProps } from './FieldPassSection';
import { FieldPassHero } from './FieldPassHero';
import { versionedImage } from './imageVersions';

// ─────────────────────────────────────────────
// MONO Field Pass Initiative — 신규 9개 PNG 인포그래픽 기반 페이지.
// 기존 React+SVG 다이어그램(WhyMonoGraphic/AllPassBridgeGraphic/
// MonoSensstoneGraphic/PermissionGraphic/PublicLaunchGraphic/TogetherFinale/
// graphicPrimitives)은 같은 메시지를 이미지로 다시 그리는 것이라 전부 제거했다.
// 섹션 구조: 큰 제목 + 짧은 설명 + 큰 인포그래픽(PNG) 하나, 9개 섹션 고정 순서.
// ─────────────────────────────────────────────

const NAVY = '#0f172a';

type SectionData = Omit<FieldPassSectionProps, 'onView'> & { trackKey: string };

const sections: SectionData[] = [
  {
    id: 'allpass-connect',
    theme: 'soft',
    title: '건설올패스에서 현장 인증으로 이어집니다.',
    description: '공적 자격과 근로 기록은 건설올패스에 축적되고, MONO App은 현장 출입과 인증 경험을 연결합니다.',
    imageSrc: '/images/field-pass/02_AllPass_Connect_1920x1080.png',
    imageAlt: '건설올패스의 공적 기록과 MONO 현장 인증을 연결하는 구조',
    trackKey: 'allpass_connect',
  },
  {
    id: 'auth-pain-solution',
    title: '현장의 반복 인증을 하나의 경험으로 연결합니다.',
    description: '근로자 등록부터 신원 확인, 출입 승인까지 현장에서 필요한 인증 흐름을 더 빠르고 명확하게 설계합니다.',
    imageSrc: '/images/field-pass/03_Auth_Pain_Solution_1920x1080.png',
    imageAlt: '기존 현장 인증 과정과 MONO 인증 경험 비교',
    trackKey: 'auth_pain_solution',
  },
  {
    id: 'service-flow',
    theme: 'soft',
    title: '한 번의 등록이 현장 경력과 권한으로 이어집니다.',
    description: '신원과 자격을 확인한 뒤 출입, 출근, 경력, 현장 권한까지 하나의 신뢰 흐름으로 연결합니다.',
    imageSrc: '/images/field-pass/04_Service_Flow_1920x1080.png',
    imageAlt: '본인 등록부터 현장 권한까지 이어지는 MONO Field Pass 서비스 흐름',
    trackKey: 'service_flow',
  },
  {
    id: 'hybrid-authentication',
    title: '하나의 인증, 다양한 현장 인터페이스',
    description: 'MONO App과 OTAC을 중심으로 BLE, NFC, QR, 카드 기반 게이트 환경을 유연하게 연결합니다.',
    imageSrc: '/images/field-pass/05_Hybrid_Authentication_1920x1080.png',
    imageAlt: 'MONO App과 OTAC을 통해 BLE, NFC, QR, 카드 게이트를 연결하는 인증 구조',
    trackKey: 'hybrid_authentication',
  },
  {
    id: 'mono-x-senstone',
    theme: 'dark',
    eyebrow: 'MONO × SENSTONE',
    title: '새로운 건설 Credential을 함께 설계합니다.',
    description: 'MONO의 현장 네트워크와 서비스 경험, SENSTONE의 인증 기술을 연결해 건설 산업에 필요한 새로운 신뢰 기반을 구축합니다.',
    imageSrc: '/images/field-pass/06_MONO_x_SENSTONE_1920x1080.png',
    imageAlt: 'MONO와 SENSTONE이 함께 만드는 차세대 건설 Credential',
    trackKey: 'mono_x_senstone',
  },
  {
    id: 'permission-expansion',
    theme: 'soft',
    title: '출입 인증은 현장 권한으로 확장됩니다.',
    description: '검증된 신원과 자격을 기반으로 작업 구역, 장비 사용, 산업 시스템 접근 권한까지 연결합니다.',
    imageSrc: '/images/field-pass/07_Permission_Expansion_1920x1080.png',
    imageAlt: '신원 확인에서 출입, 장비, OT 권한으로 확장되는 구조',
    trackKey: 'permission_expansion',
  },
  {
    id: 'data-integration',
    title: '현장의 기록이 근로자의 자산으로 이어집니다.',
    description: 'ERP와 공제회, MyData를 연계해 출근과 경력 기록이 금융, 복지, 근로자 신뢰 데이터로 이어지는 기반을 설계합니다.',
    imageSrc: '/images/field-pass/08_Data_Integration_1920x1080.png',
    imageAlt: 'ERP, 공제회, MyData가 경력, 금융, 복지로 이어지는 데이터 구조',
    trackKey: 'data_integration',
  },
  {
    id: 'public-launch',
    theme: 'soft',
    eyebrow: 'PUBLIC LAUNCH',
    title: '모두의창업에서 건설 인증의 미래를 공개합니다.',
    description: 'MONO와 SENSTONE이 함께 설계하는 Construction Workforce Credential을 모두의창업 4라운드에서 공개합니다.',
    imageSrc: '/images/field-pass/09_Public_Launch_1920x1080.png',
    imageAlt: 'MONO와 SENSTONE의 건설 인증 비전을 모두의창업에서 공개하는 과정',
    trackKey: 'public_launch',
  },
];

export default function FieldPassV2Client() {
  useEffect(() => {
    track('field_pass_initiative_viewed', {});
  }, []);

  const handleCta = (source: string) => () => {
    track('field_pass_initiative_cta_clicked', { source });
    window.location.href = 'mailto:yunhyeok@t-rive.com?subject=MONO%20Field%20Pass%20Initiative%20%EA%B3%B5%EB%8F%99%20%EC%A0%9C%EC%95%88';
  };

  return (
    <div className={styles.page} style={{ fontFamily: 'var(--font-sans)' }}>
      <header style={{ background: NAVY, padding: '16px 20px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 15.5, fontWeight: 950, color: '#fff' }}>MONO Field Pass Initiative</span>
          <span style={{ fontSize: 10.5, fontWeight: 800, color: '#93c5fd', background: 'rgba(37,99,235,0.18)', padding: '3px 10px', borderRadius: 999, border: '1px solid rgba(147,197,253,0.3)' }}>
            MONO × SENSTONE 공동 프로젝트 제안
          </span>
        </div>
      </header>

      <FieldPassHero onCtaClick={handleCta('hero')} />

      {sections.map((section) => (
        <FieldPassSection
          key={section.id}
          {...section}
          imageSrc={versionedImage(section.imageSrc)}
          onView={() => track('field_pass_initiative_section_viewed', { section: section.trackKey })}
        />
      ))}

      <section data-theme="soft" style={{ background: '#ffffff', padding: '0 20px 96px', textAlign: 'center' }}>
        <div className={styles.ctaRow}>
          <button className={styles.ctaPrimary} onClick={handleCta('public_launch')}>
            함께 새로운 건설 인증을 만듭시다
          </button>
        </div>
      </section>

      <footer style={{ padding: '20px', textAlign: 'center' }}>
        <span style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 600 }}>
          MONO Field Pass Initiative · MONO × SENSTONE 공동 프로젝트 제안 · <a href="/strategy" style={{ color: '#94a3b8' }}>MONO 전략 페이지 보기 →</a>
        </span>
      </footer>
    </div>
  );
}
