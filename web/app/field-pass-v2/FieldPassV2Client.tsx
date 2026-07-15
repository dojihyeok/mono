'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';
import styles from './field-pass-v2.module.css';
import { FieldPassSection } from './FieldPassSection';
import { FieldPassHero } from './FieldPassHero';
import { AllPassBridgeGraphic, AllPassBridgeMobile } from './AllPassBridgeGraphic';
import { PainPointGraphic } from './PainPointGraphic';
import { HybridAuthGraphic } from './HybridAuthGraphic';
import { MonoSensstoneGraphic } from './MonoSensstoneGraphic';
import { PermissionGraphic } from './PermissionGraphic';
import { PublicLaunchGraphic } from './PublicLaunchGraphic';

// ─────────────────────────────────────────────
// MONO Field Pass v2 — MONO × 센스톤 공동 비전 제안 페이지.
// 기존 /field-pass(PoC·기능 나열 중심)를 전면 재구축 — 공동 비전 제안 페이지로
// 재포지셔닝. 7개 섹션: Hero → 건설올패스의 다음 단계 → 현장 인증의 페인 포인트 →
// MONO Field Pass 하이브리드 인증 경험 → MONO × SENSTONE 공동 비전(다크) →
// 출입에서 장비·OT 권한으로 → 모두의창업 4라운드 대국민 공개 제안.
// PoC/MVP/Phase/P0 등 내부 개발 단계 표현은 이 페이지에서 전부 제외했다.
// 구 버전은 git tag `field-pass-v1-legacy-20260715`로 보존.
// ─────────────────────────────────────────────

const NAVY = '#0f172a';

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function FieldPassV2Client() {
  useEffect(() => {
    track('field_pass_v2_landing_viewed', {});
  }, []);

  const handleCta = (source: string) => (label: string) => {
    track('field_pass_v2_cta_clicked', { source, label });
    if (label === 'overview') {
      scrollTo('bridge');
    } else {
      scrollTo('public-launch');
    }
  };

  return (
    <div className={styles.page} style={{ fontFamily: 'var(--font-sans)' }}>
      <header style={{ background: NAVY, padding: '16px 20px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 15.5, fontWeight: 950, color: '#fff' }}>MONO Field Pass</span>
          <span style={{ fontSize: 10.5, fontWeight: 800, color: '#93c5fd', background: 'rgba(37,99,235,0.18)', padding: '3px 10px', borderRadius: 999, border: '1px solid rgba(147,197,253,0.3)' }}>
            MONO × SENSTONE 공동 비전 제안
          </span>
        </div>
      </header>

      {/* 1. Hero */}
      <FieldPassHero onCtaClick={handleCta('hero')} />

      {/* 2. 건설올패스의 다음 단계 */}
      <FieldPassSection
        id="bridge"
        tight
        eyebrow="Construction ALL-PASS"
        title="건설올패스의 가치를 더 나은 현장 인증 경험으로 확장합니다"
        description="건설올패스는 건설근로자의 근로 내역과 권리 보호를 위한 중요한 기반입니다. MONO Field Pass는 이 기반을 MONO 앱과 연결해 현장 출입, 근무 인증, 경력 기록, 권한 관리까지 이어갑니다."
        onView={() => track('field_pass_v2_bridge_viewed', {})}
      >
        <AllPassBridgeGraphic />
        <AllPassBridgeMobile />
      </FieldPassSection>

      {/* 3. 현장 인증의 페인 포인트 */}
      <FieldPassSection
        id="pain-point"
        eyebrow="Why Now"
        title="현장 인증에는 속도·편의·보안이 함께 필요합니다"
        onView={() => track('field_pass_v2_pain_point_viewed', {})}
      >
        <PainPointGraphic />
      </FieldPassSection>

      {/* 4. MONO Field Pass 하이브리드 인증 경험 */}
      <FieldPassSection
        id="hybrid-auth"
        tight
        eyebrow="Hybrid Authentication"
        title="현장 상황에 맞는 하이브리드 인증 경험"
        onView={() => track('field_pass_v2_hybrid_auth_viewed', {})}
      >
        <HybridAuthGraphic />
      </FieldPassSection>

      {/* 5. MONO × SENSTONE 공동 비전 (다크, 페이지 핵심) */}
      <FieldPassSection
        id="mono-sensstone"
        dark
        eyebrow="MONO × SENSTONE"
        title="MONO와 센스톤이 함께 차세대 건설 인증을 만들 수 있습니다"
        onView={() => track('field_pass_v2_mono_sensstone_viewed', {})}
      >
        <MonoSensstoneGraphic />
      </FieldPassSection>

      {/* 6. 출입에서 장비·OT 권한으로 */}
      <FieldPassSection
        id="permission"
        eyebrow="Permission"
        title="출입 인증에서 장비·OT 권한으로 확장합니다"
        onView={() => track('field_pass_v2_permission_viewed', {})}
      >
        <PermissionGraphic />
      </FieldPassSection>

      {/* 7. 모두의창업 4라운드 대국민 공개 제안 */}
      <FieldPassSection
        id="public-launch"
        tight
        eyebrow="모두의창업 4라운드"
        title="국민이 직접 경험하는 Field Pass를 함께 공개하고 싶습니다"
        onView={() => track('field_pass_v2_public_launch_viewed', {})}
      >
        <PublicLaunchGraphic onCtaClick={handleCta('public_launch')} />
      </FieldPassSection>

      <footer style={{ padding: '20px', textAlign: 'center' }}>
        <span style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 600 }}>
          MONO Field Pass · MONO × SENSTONE 공동 비전 제안 · <a href="/strategy" style={{ color: '#94a3b8' }}>MONO 전략 페이지 보기 →</a>
        </span>
      </footer>
    </div>
  );
}
