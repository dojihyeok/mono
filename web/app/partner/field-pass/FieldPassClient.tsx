'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

// ─────────────────────────────────────────────
// MONO Field Pass 상세 (기업용 Partner·Field Pass 웹 개발 요청서 v1.0 §7~§13)
// 대상: mono.dojiung.com/partner/field-pass
// ─────────────────────────────────────────────

type StatusTag = 'live' | 'validating' | 'tech_review' | 'roadmap';
interface StatusStyle { label: string; color: string; bg: string; border: string; }

const STATUS_BADGE: Record<StatusTag, StatusStyle> = {
  live: { label: '실제 상태', color: '#166534', bg: '#f0fdf4', border: '#bbf7d0' },
  validating: { label: '검토 중', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
  tech_review: { label: 'TECH REVIEW', color: '#9333ea', bg: '#faf5ff', border: '#e9d5ff' },
  roadmap: { label: 'ROADMAP', color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' },
};

function StatusBadge({ status }: { status: StatusTag }) {
  const s = STATUS_BADGE[status];
  return (
    <span style={{ fontSize: 10.5, fontWeight: 900, color: s.color, background: s.bg, border: `1px solid ${s.border}`, padding: '3px 9px', borderRadius: 6, whiteSpace: 'nowrap', display: 'inline-block' }}>
      {s.label}
    </span>
  );
}

function Section({ id, eyebrow, title, dark, children }: { id?: string; eyebrow: string; title: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} style={{ maxWidth: 1080, margin: '0 auto', padding: '52px 20px', scrollMarginTop: 64 }}>
      <div style={{ fontSize: 12.5, fontWeight: 850, color: dark ? '#a5b4fc' : '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 950, color: dark ? '#ffffff' : '#0f172a', margin: '0 0 20px 0', letterSpacing: '-0.02em' }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function FieldPassClient() {
  useEffect(() => {
    track('partner_field_pass_viewed', { source: 'field_pass_page' });
  }, []);

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: '#1e293b' }}>
      {/* ── Header ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/partner" style={{ fontSize: 15, fontWeight: 950, color: '#ffffff', textDecoration: 'none' }}>← MONO 기업 파트너</a>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#a5b4fc' }}>MONO Field Pass</span>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', padding: '56px 20px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 12.5, fontWeight: 850, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            MONO Field Pass
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 950, color: '#ffffff', margin: 0, letterSpacing: '-0.03em', lineHeight: 1.32, wordBreak: 'keep-all' }}>
            작업자의 신원·자격·교육·현장 권한과 출입 기록을 하나로 연결합니다
          </h1>
          <p style={{ fontSize: 15, color: '#cbd5e1', fontWeight: 600, lineHeight: 1.7, margin: '18px auto 0', maxWidth: 680, wordBreak: 'keep-all' }}>
            출입 이벤트를 근태·정산·경력·감사 로그로 이어 기업의 협력사 관리와 감사 대응을 지원합니다.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 28 }}>
            <a
              href="#poc"
              onClick={() => track('partner_poc_cta_clicked', { source: 'field_pass_hero' })}
              style={{ padding: '13px 26px', background: '#ffffff', color: '#0f172a', borderRadius: 12, fontSize: 14.5, fontWeight: 900, textDecoration: 'none' }}
            >
              현장 PoC 상담
            </a>
            <a
              href="#security"
              onClick={() => track('field_pass_security_viewed', { source: 'field_pass_hero' })}
              style={{ padding: '13px 26px', background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, fontSize: 14.5, fontWeight: 800, textDecoration: 'none' }}
            >
              보안 검토 자료 보기
            </a>
          </div>
        </div>
      </section>

      {/* ── 현재 현장의 문제 ── */}
      <Section eyebrow="Problem" title="현재 현장의 문제">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
          {[
            '신원·자격·교육 정보와 출입 시스템이 분리돼 있다',
            '자격이 만료된 인력의 현장 접근을 실시간으로 막기 어렵다',
            '출입 기록이 근태·정산·경력으로 이어지지 않는다',
            '협력사별·현장별 권한 관리가 수기로 반복된다',
          ].map((t) => (
            <div key={t} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', fontSize: 13.5, color: '#334155', fontWeight: 650, wordBreak: 'keep-all' }}>{t}</div>
          ))}
        </div>
      </Section>

      {/* ── Field Pass 작동 방식 ── */}
      <Section eyebrow="How it works" title="Field Pass 작동 방식">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 800, color: '#334155' }}>
          {['사용자 신원', '자격·교육·현장 권한', '등록 단말·카드', '일회성 동적 인증', '게이트·앱·리더기 검증', '출입 승인·거부', '출입 이벤트', '근태·정산·경력·감사 로그'].map((s, i, arr) => (
            <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 8, padding: '6px 10px', color: '#3730a3' }}>{s}</span>
              {i < arr.length - 1 && <span style={{ color: '#94a3b8' }}>→</span>}
            </span>
          ))}
        </div>
      </Section>

      {/* ── 인증 방식 ── */}
      <Section eyebrow="Authentication" title="인증 방식 상태">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5, minWidth: 420 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px', color: '#94a3b8', fontWeight: 800 }}>방식</th>
                <th style={{ padding: '8px 10px', color: '#94a3b8', fontWeight: 800 }}>상태</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['QR', 'live' as StatusTag],
                ['NFC', 'roadmap' as StatusTag],
                ['카드', 'roadmap' as StatusTag],
                ['위치', 'roadmap' as StatusTag],
                ['BLE·UWB', 'roadmap' as StatusTag],
                ['OTAC', 'tech_review' as StatusTag],
              ].map(([label, status]) => (
                <tr key={label as string} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px', fontWeight: 800, color: '#0f172a' }}>{label as string}</td>
                  <td style={{ padding: '10px' }}><StatusBadge status={status as StatusTag} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginTop: 10 }}>
          위치 기반 인증은 관련 신고·동의 절차 완료 후 활성화됩니다.
        </p>
      </Section>

      {/* ── 중앙 데이터·정책 엔진 ── */}
      <Section eyebrow="Engine" title="중앙 데이터·정책 엔진">
        <p style={{ fontSize: 14.5, color: '#334155', fontWeight: 650, lineHeight: 1.75, margin: 0, wordBreak: 'keep-all', maxWidth: 760 }}>
          신원·자격·교육·현장 권한 데이터를 중앙에서 관리하고, 현장·게이트별 접근 정책을 적용합니다. 자격 만료·교육 미이수 등 조건 변화는 정책 엔진에 즉시 반영되어 출입 승인 여부에 반영됩니다.
        </p>
      </Section>

      {/* ── OTAC 적용 방향 ── */}
      <Section eyebrow="OTAC" title="OTAC 적용 방향">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 20 }}>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#166534', marginBottom: 8 }}>서면 합의 전 사용 가능 표현</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#166534', lineHeight: 1.8, fontWeight: 650 }}>
              <li>센스톤 OTAC 적용 검토</li>
              <li>TECH REVIEW</li>
              <li>기술 협의 예정</li>
            </ul>
          </div>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#b91c1c', marginBottom: 8 }}>금지 표현</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#b91c1c', lineHeight: 1.8, fontWeight: 650 }}>
              <li>적용 완료</li>
              <li>공식 파트너</li>
              <li>독점 제휴</li>
              <li>대기업 도입 확정</li>
            </ul>
          </div>
        </div>
        <p style={{ fontSize: 12.5, color: '#64748b', fontWeight: 650, margin: 0 }}>
          합의 이후에는 <strong>POC PLANNED</strong>, <strong>PARTNERED</strong> 표현만 사용합니다. 현재 상태는 서면 합의 전 <strong>TECH REVIEW</strong>입니다.
        </p>
      </Section>

      {/* ── 기존 시스템 연동 ── */}
      <Section eyebrow="Integration" title="기존 시스템 연동">
        <p style={{ fontSize: 14.5, color: '#334155', fontWeight: 650, lineHeight: 1.75, margin: 0, wordBreak: 'keep-all', maxWidth: 760 }}>
          기존 출입 게이트·리더기·사내 시스템과 API로 연동합니다. 연동 범위와 책임 분계는 고객사와의 계약으로 정합니다.
        </p>
      </Section>

      {/* ── 보안·개인정보 ── */}
      <Section id="security" eyebrow="Security" title="보안·개인정보">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }} onMouseEnter={() => track('field_pass_security_viewed', { source: 'security_section' })}>
          {[
            '현장별·기업별 접근권한 분리',
            '최소정보 노출',
            '인증·조회·권한변경 감사로그',
            '증빙문서 암호화',
            '계약종료 시 권한 회수',
            '위치정보는 신고·동의 이후 제공',
            '생체정보 기본 미사용',
            '근태 기록과 임금 확정 분리',
            '고객사 시스템과 책임분계 계약',
          ].map((t) => (
            <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#334155', fontWeight: 650, lineHeight: 1.5 }}>
              <span style={{ color: '#4f46e5' }}>✓</span>
              <span style={{ wordBreak: 'keep-all' }}>{t}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── PoC 범위 ── */}
      <Section id="poc" eyebrow="PoC" title="PoC 제안">
        <div style={{ overflowX: 'auto', marginBottom: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 460 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px', color: '#94a3b8', fontWeight: 800 }}>항목</th>
                <th style={{ padding: '8px 10px', color: '#94a3b8', fontWeight: 800 }}>권장 범위</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['현장', '1개'],
                ['이용자', '50~100명'],
                ['출입구', '1~2개'],
                ['인증', '앱 QR + OTAC'],
                ['기간', '4~8주'],
                ['데이터', '신원·자격·출입 이벤트'],
                ['성공 기준', '인증률·응답속도·운영시간 감소·차단률'],
              ].map(([k, v]) => (
                <tr key={k} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '9px 10px', fontWeight: 800, color: '#0f172a' }}>{k}</td>
                  <td style={{ padding: '9px 10px', color: '#5b6b82', fontWeight: 600 }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <a
            href="mailto:yunhyeok@t-rive.com?subject=MONO%20Field%20Pass%20PoC%20상담"
            onClick={() => track('partner_poc_cta_clicked', { source: 'poc_section', type: 'site_poc' })}
            style={{ padding: '12px 22px', background: '#4f46e5', color: '#fff', borderRadius: 10, fontSize: 13.5, fontWeight: 800, textDecoration: 'none' }}
          >
            현장 PoC 상담
          </a>
          <a
            href="mailto:yunhyeok@t-rive.com?subject=MONO%20Field%20Pass%20기술%20연동%20문의"
            onClick={() => track('partner_poc_cta_clicked', { source: 'poc_section', type: 'integration' })}
            style={{ padding: '12px 22px', background: '#ffffff', color: '#4f46e5', border: '1.5px solid #c7d2fe', borderRadius: 10, fontSize: 13.5, fontWeight: 800, textDecoration: 'none' }}
          >
            기술 연동 문의
          </a>
          <a
            href="mailto:yunhyeok@t-rive.com?subject=MONO%20Field%20Pass%20보안%20검토%20자료%20요청"
            onClick={() => track('field_pass_security_viewed', { source: 'poc_section' })}
            style={{ padding: '12px 22px', background: '#ffffff', color: '#4f46e5', border: '1.5px solid #c7d2fe', borderRadius: 10, fontSize: 13.5, fontWeight: 800, textDecoration: 'none' }}
          >
            보안 검토 자료 요청
          </a>
        </div>
      </Section>

      {/* ── 기술 KPI ── */}
      <Section eyebrow="Technical KPI" title="기술 KPI">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
          {[
            '평균 인증 응답시간', '인증 성공률', '통신 취약 환경 성공률', '재사용 코드 차단률',
            '미등록 단말 차단률', '자격 만료자 접근 차단률', '등록·현장 배정 시간', '출입·근태 일치율',
            '관리자 처리시간 절감', '연동 개발기간',
          ].map((k) => (
            <div key={k} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', fontSize: 12.5, fontWeight: 700, color: '#334155' }}>{k}</div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 650, marginTop: 12 }}>검증 완료된 수치만 공개합니다. 현재 값은 PoC 진행 후 갱신됩니다.</p>
      </Section>

      {/* ── 과금 구조 ── */}
      <Section eyebrow="Pricing" title="과금 구조">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 420 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px', color: '#94a3b8', fontWeight: 800 }}>상품</th>
                <th style={{ padding: '8px 10px', color: '#94a3b8', fontWeight: 800 }}>과금 방식</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['급구 공고', '건별·패키지'],
                ['Workspace', '월 구독·초기 설정비'],
                ['Field Pass', '현장 구독'],
                ['인증', '사용자 수·인증 건수'],
                ['시스템 연동', '구축비'],
                ['API·Gateway', '라이선스'],
                ['리포트', 'Enterprise 구독'],
              ].map(([k, v]) => (
                <tr key={k} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '9px 10px', fontWeight: 800, color: '#0f172a' }}>{k}</td>
                  <td style={{ padding: '9px 10px', color: '#5b6b82', fontWeight: 600 }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── Enterprise CTA ── */}
      <section style={{ padding: '20px 20px 72px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', background: '#0f172a', borderRadius: 20, padding: '40px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 950, color: '#ffffff', marginBottom: 10 }}>Field Pass 도입을 검토 중이신가요</div>
          <p style={{ fontSize: 13.5, color: 'rgba(226,232,240,0.85)', fontWeight: 600, margin: '0 auto 22px', maxWidth: 500, wordBreak: 'keep-all' }}>
            현장 PoC 상담, 기술 연동 문의, 보안 검토 자료 요청을 받고 있습니다.
          </p>
          <a
            href="mailto:yunhyeok@t-rive.com?subject=MONO%20Field%20Pass%20Enterprise%20문의"
            onClick={() => track('partner_poc_cta_clicked', { source: 'footer_cta', type: 'enterprise' })}
            style={{ padding: '13px 26px', background: '#ffffff', color: '#0f172a', borderRadius: 12, fontSize: 14, fontWeight: 900, textDecoration: 'none' }}
          >
            Enterprise 문의하기
          </a>
        </div>
      </section>
    </div>
  );
}
