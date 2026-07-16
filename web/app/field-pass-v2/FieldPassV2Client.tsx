'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';
import styles from './field-pass-v2.module.css';
import { FieldPassSection } from './FieldPassSection';
import { FieldPassHero } from './FieldPassHero';
import { WhyMonoGraphic } from './WhyMonoGraphic';
import { AllPassBridgeGraphic, AllPassBridgeMobile } from './AllPassBridgeGraphic';
import { PainPointGraphic } from './PainPointGraphic';
import { MonoSensstoneGraphic } from './MonoSensstoneGraphic';
import { PermissionGraphic } from './PermissionGraphic';
import { PublicLaunchGraphic } from './PublicLaunchGraphic';
import { TogetherFinale } from './TogetherFinale';
import { Reveal } from './graphicPrimitives';

// ─────────────────────────────────────────────
// MONO Field Pass Initiative — MONO × 센스톤 공동 프로젝트 제안서.
// "제품 소개"가 아니라 센스톤 대표·VC·모두의창업 심사위원이 같은 페이지를 보고
// 같은 그림을 이해하는 "공동 프로젝트 제안서"로 재설계했다 (v3).
// 4개 Chapter, 6개 인포그래픽:
//   Chapter 1 소개        — ① Why MONO(큰 그림 하나, 텍스트 최소)
//   Chapter 2 연계 방향    — ③ Pain & Solution → ② Bridge(건설올패스↔MONO↔ERP↔장비OT)
//   Chapter 3 Together     — ④ Together(MONO+SENSTONE 흐름) → ⑤ Credential(출입→권한)
//   Chapter 4 발표 전략    — ⑥ Public Launch(모두의창업 4라운드 대국민 공개)
//   마지막: 화면 하나 — MONO × SENSTONE / Let's Build Together.
// PoC/MVP/Phase/P0 등 내부 개발 단계 표현은 이 페이지에 쓰지 않는다.
// 구 버전(7섹션 v2)은 git 히스토리에서 확인 가능.
// ─────────────────────────────────────────────

const NAVY = '#0f172a';

export default function FieldPassV2Client() {
  useEffect(() => {
    track('field_pass_initiative_viewed', {});
  }, []);

  return (
    <div className={styles.page} style={{ fontFamily: 'var(--font-sans)' }}>
      <header style={{ background: NAVY, padding: '16px 20px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 15.5, fontWeight: 950, color: '#fff' }}>MONO Field Pass Initiative</span>
          <span style={{ fontSize: 10.5, fontWeight: 800, color: '#93c5fd', background: 'rgba(37,99,235,0.18)', padding: '3px 10px', borderRadius: 999, border: '1px solid rgba(147,197,253,0.3)' }}>
            MONO × SENSTONE 공동 프로젝트 제안
          </span>
        </div>
      </header>

      {/* Chapter 1 — MONO Field Pass 소개 */}
      <FieldPassHero />
      <FieldPassSection
        id="why-mono"
        chapter="Chapter 1 · MONO Field Pass 소개"
        centered
        title="왜 MONO Field Pass인가"
        onView={() => track('field_pass_initiative_why_mono_viewed', {})}
      >
        <Reveal>
          <WhyMonoGraphic />
        </Reveal>
      </FieldPassSection>

      {/* Chapter 2 — MONO Field Pass 연계 방향 */}
      <FieldPassSection
        id="pain-point"
        tight
        chapter="Chapter 2 · MONO Field Pass 연계 방향"
        title="현장 인증에는 속도·편의·보안이 함께 필요합니다"
        onView={() => track('field_pass_initiative_pain_point_viewed', {})}
      >
        <Reveal>
          <PainPointGraphic />
        </Reveal>
      </FieldPassSection>

      <FieldPassSection
        id="bridge"
        centered
        title="건설올패스를 대체하지 않고, 확장합니다"
        description="건설올패스는 그대로 유지됩니다. MONO는 출입 경험을 개선하고 현장 데이터를 ERP·공제회·마이데이터로 연결하며, 장비·OT 권한까지 확장합니다."
        onView={() => track('field_pass_initiative_bridge_viewed', {})}
      >
        <Reveal>
          <AllPassBridgeGraphic />
          <AllPassBridgeMobile />
        </Reveal>
        <p style={{ marginTop: 28, textAlign: 'center', fontSize: 13, fontWeight: 650, color: '#94a3b8' }}>
          해외에서도 ID06(스웨덴)·CSCS(영국)·MyPass(호주) 등 전자 인력카드가 모바일·디지털 자격으로 확장되고 있습니다.
        </p>
      </FieldPassSection>

      {/* Chapter 3 — Together (구 PoC) */}
      <FieldPassSection
        id="together"
        dark
        chapter="Chapter 3 · MONO Field Pass Together"
        centered
        eyebrow="Together"
        title="함께 만들고 싶은 경험"
        onView={() => track('field_pass_initiative_together_viewed', {})}
      >
        <Reveal>
          <MonoSensstoneGraphic />
        </Reveal>
      </FieldPassSection>

      <FieldPassSection
        id="credential"
        title="출입에서 장비·OT 권한으로"
        onView={() => track('field_pass_initiative_credential_viewed', {})}
      >
        <Reveal>
          <PermissionGraphic />
        </Reveal>
      </FieldPassSection>

      {/* Chapter 4 — 모두의창업 발표 전략 */}
      <FieldPassSection
        id="public-launch"
        chapter="Chapter 4 · 모두의창업 발표 전략"
        centered
        title="국민이 직접 경험하는 MONO Field Pass"
        description="건설현장에서 시작한 인증 경험을 모두의창업 4라운드에서 국민이 직접 체험할 수 있도록 함께 공개하고 싶습니다."
        onView={() => track('field_pass_initiative_public_launch_viewed', {})}
      >
        <Reveal>
          <PublicLaunchGraphic />
        </Reveal>
      </FieldPassSection>

      {/* 마지막 — Together 클로징 */}
      <TogetherFinale />

      <footer style={{ padding: '20px', textAlign: 'center' }}>
        <span style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 600 }}>
          MONO Field Pass Initiative · MONO × SENSTONE 공동 프로젝트 제안 · <a href="/strategy" style={{ color: '#94a3b8' }}>MONO 전략 페이지 보기 →</a>
        </span>
      </footer>
    </div>
  );
}
