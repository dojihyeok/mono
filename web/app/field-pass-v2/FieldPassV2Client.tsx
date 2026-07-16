'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';
import styles from './field-pass-v2.module.css';
import { FieldPassSection } from './FieldPassSection';
import { FieldPassHero } from './FieldPassHero';
import { WhyMonoGraphic } from './WhyMonoGraphic';
import { AllPassBridgeGraphic, AllPassBridgeMobile } from './AllPassBridgeGraphic';
import { MonoSensstoneGraphic } from './MonoSensstoneGraphic';
import { PublicLaunchGraphic } from './PublicLaunchGraphic';
import { TogetherFinale } from './TogetherFinale';
import { Reveal } from './graphicPrimitives';

// ─────────────────────────────────────────────
// MONO Field Pass Initiative — MONO × 센스톤 공동 프로젝트 제안서.
// 정확히 4개 Chapter, Chapter당 "큰 SVG 인포그래픽 하나 + 짧은 설명"만 둔다
// (Chapter 하나에 서브섹션 2개씩 넣었다가 목차가 6~7개처럼 보인다는 피드백으로 수정).
//   Chapter 1 소개        — Hero + Why MONO 큰 그림
//   Chapter 2 연계 방향    — Bridge 하나(건설올패스↔MONO↔ERP↔장비OT), 페인 포인트는 설명 문장으로만
//   Chapter 3 Together     — Together 흐름 하나(MONO+SENSTONE→...→권한), Credential은 별도 섹션 없이 흐름에 포함
//   Chapter 4 발표 전략    — Public Launch 큰 그림
//   마지막: 화면 하나 — MONO × SENSTONE / Let's Build Together.
// PoC/MVP/Phase/P0 등 내부 개발 단계 표현은 이 페이지에 쓰지 않는다.
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

      {/* Chapter 2 — MONO Field Pass 연계 방향 (인포그래픽 1개: Bridge) */}
      <FieldPassSection
        id="bridge"
        chapter="Chapter 2 · MONO Field Pass 연계 방향"
        centered
        title="건설올패스를 대체하지 않고, 확장합니다"
        description="출근 시간대 병목, 스마트폰 조작 부담, 실물 카드 대리 인증 같은 현장 문제 위에서 — 건설올패스는 그대로 유지하고, MONO는 출입 경험을 개선하며 현장 데이터를 ERP·공제회·마이데이터로, 나아가 장비·OT 권한으로 연결합니다."
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

      {/* Chapter 3 — MONO Field Pass Together (인포그래픽 1개: Together 흐름, 출입→권한 포함) */}
      <FieldPassSection
        id="together"
        dark
        chapter="Chapter 3 · MONO Field Pass Together"
        centered
        eyebrow="Together"
        title="함께 만들고 싶은 경험"
        description="자격과 현장 권한을 확인한 뒤 장비·OT 시스템의 사용 승인까지 이어지는 인증 흐름을 센스톤과 함께 만들고 싶습니다."
        onView={() => track('field_pass_initiative_together_viewed', {})}
      >
        <Reveal>
          <MonoSensstoneGraphic />
        </Reveal>
      </FieldPassSection>

      {/* Chapter 4 — 모두의창업 발표 전략 (인포그래픽 1개: Public Launch) */}
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
