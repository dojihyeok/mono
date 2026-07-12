'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';
import { OtacPocInfographic, ExpansionInfographic } from '../Infographics';

// ─────────────────────────────────────────────
// 센스톤 대표 미팅용 — /field-pass(투자자 상세자료)와 별도의 짧은 1페이지 소개.
// 목적: 무엇을 하려는지 한눈에 보이는 것. BM/로드맵/재무 등 미팅 무관 내용은 뺌.
// 주의: OTAC는 서면 합의 전 TECH REVIEW — "공식 파트너" 표현 금지.
// ─────────────────────────────────────────────

const NAVY = '#0b1224';
const BLUE = '#2563eb';
const MINT = '#10b981';

export default function OtacMeetingClient() {
  useEffect(() => {
    track('field_pass_otac_meeting_page_viewed', {});
  }, []);

  return (
    <div style={{ background: '#fff', color: '#1e293b', fontFamily: 'var(--font-sans)' }}>
      <header style={{ background: NAVY, padding: '16px 20px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 950, color: '#fff' }}>MONO × 센스톤</span>
          <a
            href="/field-pass"
            onClick={() => track('field_pass_otac_meeting_full_deck_clicked', {})}
            style={{ fontSize: 12.5, fontWeight: 700, color: '#cbd5e1', textDecoration: 'none' }}
          >
            전체 자료(투자자용) →
          </a>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: `linear-gradient(180deg, ${NAVY} 0%, #16213e 100%)`, padding: '56px 20px 40px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: MINT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
            OTAC 기반 현장 출입 인증 PoC
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 4.5vw, 32px)', fontWeight: 950, color: '#fff', lineHeight: 1.4, margin: '0 0 16px', wordBreak: 'keep-all' }}>
            MONO는 현장 근무자의 성장 기록을 갖고 있고,<br />센스톤은 그 성장 기록을 앱으로 인증하는 기술을 갖고 있습니다
          </h1>
          <p style={{ fontSize: 14.5, color: 'rgba(226,232,240,0.85)', fontWeight: 600, lineHeight: 1.7, margin: '0 auto', maxWidth: 560, wordBreak: 'keep-all' }}>
            MONO Field Pass는 교육·서류·현장 경험을 갖춘 근무자에게 발급되는 성장형 인증입니다. 이 인증을 센스톤 OTAC 기반 일회성 인증값으로 검증하는 PoC를 제안합니다.
          </p>
        </div>
      </section>

      {/* 한눈에 보기 — 4단계 요약 (센스톤 관점: 성장 → 발급 → 인증(=우리 협력 지점) → 확장) */}
      <section style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
            {[
              { n: 1, icon: '🧑‍🔧', label: '성장', desc: '일용직 → 조공 → 건설근로자', dim: true },
              { n: 2, icon: '🪪', label: 'Field Pass 발급', desc: '성장 기록 기반 발급', dim: true },
              { n: 3, icon: '🔑', label: 'OTAC 앱 인증', desc: '센스톤 협력 지점', dim: false },
              { n: 4, icon: '🔐', label: '권한 확장', desc: '출입 → 장비 → OT', dim: true },
            ].map((s) => (
              <div
                key={s.n}
                style={{
                  textAlign: 'center',
                  background: s.dim ? '#f8fafc' : '#f0fdf9',
                  border: s.dim ? '1px solid #e2e8f0' : `2px solid ${MINT}`,
                  borderRadius: 14,
                  padding: '18px 12px',
                }}
              >
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: s.dim ? '#94a3b8' : MINT, color: '#fff', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: 10.5, fontWeight: 800, color: '#94a3b8', marginBottom: 3 }}>STEP {s.n}</div>
                <div style={{ fontSize: 13.5, fontWeight: 900, color: NAVY }}>{s.label}</div>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 650, marginTop: 4, wordBreak: 'keep-all' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 왜 지금 센스톤인가 */}
      <section style={{ background: '#f8fafc', padding: '40px 20px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '20px 22px' }}>
              <div style={{ fontSize: 12, fontWeight: 850, color: BLUE, marginBottom: 8 }}>MONO가 제공하는 것</div>
              <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: 13.5, color: '#334155', fontWeight: 600, lineHeight: 1.85 }}>
                <li>기술자 프로필·경력 데이터</li>
                <li>교육·서류 준비 상태 데이터</li>
                <li>현장 출근·경험 데이터</li>
                <li>실제 현장 근무자 사용자 기반</li>
              </ul>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '20px 22px' }}>
              <div style={{ fontSize: 12, fontWeight: 850, color: '#9333ea', marginBottom: 8 }}>센스톤에 요청하는 것</div>
              <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: 13.5, color: '#334155', fontWeight: 600, lineHeight: 1.85 }}>
                <li>OTAC 기반 일회성 인증값 생성/검증</li>
                <li>앱 Field Pass 인증 흐름 기술 검토</li>
                <li>현장 네트워크 환경에서의 적용성 자문</li>
                <li>PoC 범위·일정 협의</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PoC 흐름 */}
      <section style={{ padding: '44px 20px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <OtacPocInfographic />
        </div>
      </section>

      {/* PoC 범위(P0만) */}
      <section style={{ background: '#f8fafc', padding: '40px 20px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 850, color: BLUE, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>PoC 1차 범위</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: NAVY, marginBottom: 16 }}>가장 먼저 검증할 5가지</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {['Field Ready 상태', '앱 Field Pass 인증', 'OTAC 인증값 생성·검증', '관리자 앱 인증 확인', '출근 기록 저장'].map((it) => (
              <div key={it} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px' }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: '#b91c1c', background: '#fef2f2', padding: '2px 7px', borderRadius: 6, flex: 'none' }}>P0</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{it}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12.5, color: '#94a3b8', fontWeight: 600, marginTop: 12 }}>
            실물 카드·경력카드 반영은 P1, 중장비/OT 기기 권한 검증은 P2로 이후 단계에서 논의합니다.
          </div>
        </div>
      </section>

      {/* 함께하면 확장되는 영역 */}
      <section style={{ padding: '44px 20px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 850, color: MINT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Together, We Expand</div>
          <h2 style={{ fontSize: 19, fontWeight: 950, color: NAVY, margin: '0 0 8px', wordBreak: 'keep-all' }}>
            함께하면, Field Pass 카드가 여는 영역이 넓어집니다
          </h2>
          <p style={{ fontSize: 13.5, color: '#64748b', fontWeight: 650, lineHeight: 1.7, margin: '0 auto 8px', maxWidth: 560, wordBreak: 'keep-all' }}>
            건설 현장 하나의 출입 인증에서 시작하지만, 이 조합이 검증되면 같은 인증 구조가 아파트·오피스·중장비·OT 기기까지 그대로 확장됩니다. 센스톤 OTAC은 그 확장의 모든 단계에서 반복적으로 쓰이는 핵심 인증 기술이 됩니다.
          </p>
        </div>
        <div style={{ maxWidth: 760, margin: '20px auto 0' }}>
          <ExpansionInfographic />
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: NAVY, padding: '48px 20px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 19, fontWeight: 950, color: '#fff', margin: '0 0 12px', wordBreak: 'keep-all' }}>
            PoC 범위와 일정을 논의하고 싶습니다
          </h2>
          <p style={{ fontSize: 13.5, color: 'rgba(226,232,240,0.8)', fontWeight: 600, lineHeight: 1.7, margin: '0 auto 24px', maxWidth: 460, wordBreak: 'keep-all' }}>
            서면 협력 합의 전 기술 검토 단계입니다. 위 PoC 1차 범위를 기준으로 구체적인 검증 방식을 함께 정하고 싶습니다.
          </p>
          <a
            href="mailto:yunhyeok@t-rive.com?subject=MONO%20Field%20Pass%20%C3%97%20%EC%84%BC%EC%8A%A4%ED%86%A4%20OTAC%20PoC%20%EB%85%BC%EC%9D%98"
            onClick={() => track('field_pass_otac_meeting_cta_clicked', {})}
            style={{ display: 'inline-block', padding: '13px 28px', background: '#fff', color: NAVY, borderRadius: 12, fontSize: 14, fontWeight: 900, textDecoration: 'none' }}
          >
            PoC 논의 요청하기
          </a>
        </div>
      </section>

      <footer style={{ padding: '18px', textAlign: 'center' }}>
        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
          MONO Field Pass · 센스톤 미팅용 요약 · <a href="/field-pass" style={{ color: '#94a3b8' }}>전체 자료(투자자용) 보기 →</a>
        </span>
      </footer>
    </div>
  );
}
