'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface FormData {
  // Step 1
  workType: string;
  workName: string;
  region: string;
  address: string;
  // Step 2
  description: string;
  budget: string;
  startDate: string;
  endDate: string;
  teamSize: string;
  // Step 3
  requesterType: string;
  requesterName: string;
  contact: string;
  extraNote: string;
  agreed: boolean;
}

interface FieldError {
  [key: string]: string;
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const WORK_TYPES = [
  { id: 'interior', label: '인테리어·리모델링', icon: '🏠' },
  { id: 'construction', label: '건설·토목', icon: '🏗️' },
  { id: 'electrical', label: '전기·설비', icon: '⚡' },
  { id: 'painting', label: '도장·방수', icon: '🎨' },
  { id: 'demolition', label: '철거·해체', icon: '⚒️' },
  { id: 'landscaping', label: '조경·외부공사', icon: '🌿' },
  { id: 'other', label: '기타', icon: '📋' },
];

const BUDGET_OPTIONS = [
  { id: 'under100', label: '100만원 미만' },
  { id: '100to300', label: '100~300만원' },
  { id: '300to500', label: '300~500만원' },
  { id: '500to1000', label: '500만원~1,000만원' },
  { id: 'over1000', label: '1,000만원 이상' },
];

const TEAM_SIZE_OPTIONS = [
  { id: '1to2', label: '1~2명' },
  { id: '3to5', label: '3~5명' },
  { id: '6to10', label: '6~10명' },
  { id: 'over10', label: '10명 이상' },
];

const REQUESTER_TYPES = [
  { id: 'individual', label: '개인 고객', desc: '일반 시공 의뢰', icon: '👤' },
  { id: 'company', label: '수행 기업·협력사', desc: '기업 시공 발주', icon: '🏢' },
  { id: 'enterprise', label: '원청·대기업', desc: '대규모 공사 발주', icon: '🏛️' },
];

const TRUST_BADGES = [
  { icon: '🔒', text: 'MONO 인증 현장 리더 배정' },
  { icon: '📋', text: '표준 견적서 자동 생성' },
  { icon: '💰', text: '에스크로 대금 보호' },
];

const STEP_LABELS = ['작업 기본 정보', '현장 상세 조건', '요청자 정보'];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function generateRequestNo() {
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const rnd = Math.floor(1000 + Math.random() * 9000);
  return `REQ-${ymd}-${rnd}`;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function RequestPage() {
  const [step, setStep] = useState(0); // 0,1,2 = form steps; 3 = done
  const [form, setForm] = useState<FormData>({
    workType: '',
    workName: '',
    region: '',
    address: '',
    description: '',
    budget: '',
    startDate: '',
    endDate: '',
    teamSize: '',
    requesterType: '',
    requesterName: '',
    contact: '',
    extraNote: '',
    agreed: false,
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [requestNo] = useState(generateRequestNo());

  const set = (key: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const clearError = (key: string) =>
    setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });

  // Validation per step
  const validate = (s: number): FieldError => {
    const e: FieldError = {};
    if (s === 0) {
      if (!form.workType) e.workType = '공종을 선택해 주세요';
      if (!form.workName.trim()) e.workName = '작업명을 입력해 주세요';
      if (!form.region.trim()) e.region = '지역을 입력해 주세요';
    }
    if (s === 1) {
      if (!form.description.trim()) e.description = '작업 범위를 입력해 주세요';
      if (!form.budget) e.budget = '예산 범위를 선택해 주세요';
      if (!form.teamSize) e.teamSize = '필요 인원을 선택해 주세요';
    }
    if (s === 2) {
      if (!form.requesterType) e.requesterType = '요청자 구분을 선택해 주세요';
      if (!form.requesterName.trim()) e.requesterName = '이름 또는 회사명을 입력해 주세요';
      if (!form.contact.trim()) e.contact = '연락처를 입력해 주세요';
      if (!form.agreed) e.agreed = '개인정보 처리에 동의해 주세요';
    }
    return e;
  };

  const handleNext = () => {
    const e = validate(step);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setStep((prev) => prev + 1);
  };

  const handleBack = () => { setErrors({}); setStep((prev) => prev - 1); };

  const progress = step >= 3 ? 100 : Math.round((step / 3) * 100);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FCFCFE radial-gradient(rgba(79, 70, 229, 0.05) 1px, transparent 1px) repeat',
        backgroundSize: '24px 24px',
        color: '#334155',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
        .req-input {
          width: 100%;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 13px 16px;
          color: #1e293b;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
          word-break: keep-all;
        }
        .req-input:focus { border-color: rgba(79,70,229,0.5); }
        .req-input::placeholder { color: #94a3b8; }
        .req-input-error { border-color: rgba(239,68,68,0.5) !important; }
        textarea.req-input { resize: vertical; min-height: 120px; line-height: 1.6; }
        .work-type-card {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px 12px;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
        }
        .work-type-card:hover { background: #f8fafc; transform: translateY(-1px); }
        .work-type-card.selected {
          background: rgba(79,70,229,0.05);
          border-color: #4f46e5;
          box-shadow: 0 0 16px rgba(79,70,229,0.12);
        }
        .option-chip {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 11px 16px;
          cursor: pointer;
          transition: all 0.15s;
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          text-align: center;
          word-break: keep-all;
        }
        .option-chip:hover { background: #f8fafc; color: #1e293b; }
        .option-chip.selected {
          background: rgba(79,70,229,0.05);
          border-color: #4f46e5;
          color: #4f46e5;
        }
        .requester-card {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .requester-card:hover { background: #f8fafc; }
        .requester-card.selected {
          background: rgba(79,70,229,0.04);
          border-color: #4f46e5;
        }
        .cta-btn {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 800;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          letter-spacing: -0.01em;
        }
        .cta-primary {
          background: linear-gradient(135deg, #4f46e5, #3730a3);
          color: #fff;
          box-shadow: 0 4px 14px rgba(79,70,229,0.25);
        }
        .cta-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(79,70,229,0.35); }
        .cta-secondary {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #475569;
        }
        .cta-secondary:hover { background: #f8fafc; color: #1e293b; }
        .field-label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          margin-bottom: 8px;
          word-break: keep-all;
        }
        .field-error {
          font-size: 12px;
          color: #ef4444;
          margin-top: 5px;
          font-weight: 500;
          word-break: keep-all;
        }
        .upload-zone {
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 32px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s;
          background: #f8fafc;
        }
        .upload-zone:hover { border-color: rgba(79,70,229,0.3); background: rgba(79,70,229,0.04); }
        @keyframes checkPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .animate-check { animation: checkPulse 1.6s ease-in-out infinite; }
        .animate-fade { animation: fadeIn 0.4s ease both; }
        @media(max-width:600px){
          .work-grid { grid-template-columns: repeat(2,1fr) !important; }
          .budget-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ── Header ── */}
      <header
        style={{
          background: 'rgba(252,252,254,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          padding: '18px 24px',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🏗️</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                MONO 작업 요청
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#475569', margin: '3px 0 0', fontWeight: 600, wordBreak: 'keep-all' }}>
              요청 → 견적 → 계약 → 출역 → 정산
            </p>
          </div>
          {step < 3 && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>
                Step {step + 1} / 3
              </div>
              <div
                style={{
                  width: 120, height: 4, background: 'rgba(0,0,0,0.08)',
                  borderRadius: 999, overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${progress}%`, height: '100%',
                    background: 'linear-gradient(90deg, #4f46e5, #3b82f6)',
                    borderRadius: 999,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '28px 20px 60px' }}>

        {/* ── Step Indicator ── */}
        {step < 3 && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28, gap: 0 }}>
            {STEP_LABELS.map((label, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : undefined }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: i < step ? '#4f46e5' : i === step ? 'rgba(79,70,229,0.12)' : '#ffffff',
                      border: i === step ? '2px solid #4f46e5' : i < step ? '2px solid #4f46e5' : '2px solid #cbd5e1',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 800,
                      color: i < step ? '#ffffff' : i === step ? '#4f46e5' : '#64748b',
                      transition: 'all 0.3s',
                    }}
                  >
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: i === step ? '#4f46e5' : '#64748b', whiteSpace: 'nowrap', wordBreak: 'keep-all' }}>
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    style={{
                      flex: 1, height: 2, margin: '0 6px',
                      background: i < step ? '#4f46e5' : '#e2e8f0',
                      borderRadius: 999, transition: 'background 0.3s',
                      marginBottom: 18,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* ─────────────────────────────────────────
            Step 0: 작업 기본 정보
        ───────────────────────────────────────── */}
        {step === 0 && (
          <div className="animate-fade">
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em', color: '#0f172a', wordBreak: 'keep-all' }}>
              작업 기본 정보
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 28px', fontWeight: 500, wordBreak: 'keep-all' }}>
              어떤 작업이 필요한지 알려주세요
            </p>

            {/* 공종 선택 */}
            <div style={{ marginBottom: 24 }}>
              <label className="field-label">공종 선택 *</label>
              <div
                className="work-grid"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}
              >
                {WORK_TYPES.map((wt) => (
                  <div
                    key={wt.id}
                    className={`work-type-card${form.workType === wt.id ? ' selected' : ''}`}
                    onClick={() => { set('workType', wt.id); clearError('workType'); }}
                  >
                    <span style={{ fontSize: 24 }}>{wt.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: form.workType === wt.id ? '#4f46e5' : '#64748b', wordBreak: 'keep-all' }}>
                      {wt.label}
                    </span>
                  </div>
                ))}
              </div>
              {errors.workType && <p className="field-error">{errors.workType}</p>}
            </div>

            {/* 작업명 */}
            <div style={{ marginBottom: 18 }}>
              <label className="field-label">작업명 *</label>
              <input
                className={`req-input${errors.workName ? ' req-input-error' : ''}`}
                placeholder="예: 30평 아파트 거실·주방 인테리어 리모델링"
                value={form.workName}
                onChange={(e) => { set('workName', e.target.value); clearError('workName'); }}
              />
              {errors.workName && <p className="field-error">{errors.workName}</p>}
            </div>

            {/* 지역 */}
            <div style={{ marginBottom: 18 }}>
              <label className="field-label">작업 지역 *</label>
              <input
                className={`req-input${errors.region ? ' req-input-error' : ''}`}
                placeholder="예: 서울 강남구 / 경기 수원시"
                value={form.region}
                onChange={(e) => { set('region', e.target.value); clearError('region'); }}
              />
              {errors.region && <p className="field-error">{errors.region}</p>}
            </div>

            {/* 현장 주소 */}
            <div style={{ marginBottom: 8 }}>
              <label className="field-label">현장 주소 (선택)</label>
              <input
                className="req-input"
                placeholder="예: 서울시 강남구 테헤란로 123, 5층"
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────
            Step 1: 현장 상세 조건
        ───────────────────────────────────────── */}
        {step === 1 && (
          <div className="animate-fade">
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em', color: '#0f172a', wordBreak: 'keep-all' }}>
              현장 상세 조건
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 28px', fontWeight: 500, wordBreak: 'keep-all' }}>
              자세할수록 정확한 견적을 받을 수 있습니다
            </p>

            {/* 작업 범위 설명 */}
            <div style={{ marginBottom: 20 }}>
              <label className="field-label">작업 범위 설명 *</label>
              <textarea
                className={`req-input${errors.description ? ' req-input-error' : ''}`}
                placeholder="작업 내용, 면적, 층수, 특이사항 등 자세히 적어주세요&#10;예: 33평 아파트, 거실+주방+침실 2개 도배·장판 교체, 기존 가구 이동 필요, 5층 엘리베이터 있음"
                value={form.description}
                onChange={(e) => { set('description', e.target.value); clearError('description'); }}
              />
              {errors.description && <p className="field-error">{errors.description}</p>}
            </div>

            {/* 예산 범위 */}
            <div style={{ marginBottom: 20 }}>
              <label className="field-label">예산 범위 *</label>
              <div
                className="budget-grid"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}
              >
                {BUDGET_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    className={`option-chip${form.budget === opt.id ? ' selected' : ''}`}
                    onClick={() => { set('budget', opt.id); clearError('budget'); }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
              {errors.budget && <p className="field-error">{errors.budget}</p>}
            </div>

            {/* 일정 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
              <div>
                <label className="field-label">희망 시작일</label>
                <input
                  type="date"
                  className="req-input"
                  value={form.startDate}
                  onChange={(e) => set('startDate', e.target.value)}
                  style={{ colorScheme: 'light' }}
                />
              </div>
              <div>
                <label className="field-label">희망 완료일</label>
                <input
                  type="date"
                  className="req-input"
                  value={form.endDate}
                  onChange={(e) => set('endDate', e.target.value)}
                  style={{ colorScheme: 'light' }}
                />
              </div>
            </div>

            {/* 팀 규모 */}
            <div style={{ marginBottom: 24 }}>
              <label className="field-label">필요 인원 규모 *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {TEAM_SIZE_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    className={`option-chip${form.teamSize === opt.id ? ' selected' : ''}`}
                    onClick={() => { set('teamSize', opt.id); clearError('teamSize'); }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
              {errors.teamSize && <p className="field-error">{errors.teamSize}</p>}
            </div>

            {/* 사진 업로드 */}
            <div style={{ marginBottom: 8 }}>
              <label className="field-label">현장 사진 첨부 (선택, 최대 5장)</label>
              <div className="upload-zone">
                <span style={{ fontSize: 32 }}>📷</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b', wordBreak: 'keep-all' }}>
                  사진을 드래그하거나 클릭하여 업로드
                </span>
                <span style={{ fontSize: 11, color: '#475569', wordBreak: 'keep-all' }}>
                  현장 상태, 도면, 참고 이미지 등 — JPG/PNG/PDF, 최대 10MB
                </span>
                <div
                  style={{
                    marginTop: 4,
                    padding: '7px 18px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#475569',
                    cursor: 'pointer',
                  }}
                >
                  파일 선택
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────
            Step 2: 요청자 정보
        ───────────────────────────────────────── */}
        {step === 2 && (
          <div className="animate-fade">
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em', color: '#0f172a', wordBreak: 'keep-all' }}>
              요청자 정보
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 28px', fontWeight: 500, wordBreak: 'keep-all' }}>
              MONO 현장 컨설턴트가 연락드릴 정보를 입력해 주세요
            </p>

            {/* 요청자 구분 */}
            <div style={{ marginBottom: 20 }}>
              <label className="field-label">요청자 구분 *</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {REQUESTER_TYPES.map((rt) => (
                  <div
                    key={rt.id}
                    className={`requester-card${form.requesterType === rt.id ? ' selected' : ''}`}
                    onClick={() => { set('requesterType', rt.id); clearError('requesterType'); }}
                  >
                    <span style={{ fontSize: 24 }}>{rt.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: form.requesterType === rt.id ? '#4f46e5' : '#0f172a', wordBreak: 'keep-all' }}>
                        {rt.label}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500, wordBreak: 'keep-all' }}>
                        {rt.desc}
                      </div>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                      <div
                        style={{
                          width: 20, height: 20, borderRadius: '50%',
                          border: `2px solid ${form.requesterType === rt.id ? '#4f46e5' : '#cbd5e1'}`,
                          background: form.requesterType === rt.id ? '#4f46e5' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s',
                        }}
                      >
                        {form.requesterType === rt.id && (
                          <span style={{ color: '#fff', fontSize: 10, fontWeight: 900 }}>✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.requesterType && <p className="field-error">{errors.requesterType}</p>}
            </div>

            {/* 이름/회사명 */}
            <div style={{ marginBottom: 18 }}>
              <label className="field-label">
                {form.requesterType === 'individual' ? '이름' : '회사명'} *
              </label>
              <input
                className={`req-input${errors.requesterName ? ' req-input-error' : ''}`}
                placeholder={form.requesterType === 'individual' ? '홍길동' : '(주)MONO건설'}
                value={form.requesterName}
                onChange={(e) => { set('requesterName', e.target.value); clearError('requesterName'); }}
              />
              {errors.requesterName && <p className="field-error">{errors.requesterName}</p>}
            </div>

            {/* 연락처 */}
            <div style={{ marginBottom: 18 }}>
              <label className="field-label">연락처 *</label>
              <input
                className={`req-input${errors.contact ? ' req-input-error' : ''}`}
                placeholder="010-0000-0000"
                type="tel"
                value={form.contact}
                onChange={(e) => { set('contact', e.target.value); clearError('contact'); }}
              />
              {errors.contact && <p className="field-error">{errors.contact}</p>}
            </div>

            {/* 추가 요청사항 */}
            <div style={{ marginBottom: 20 }}>
              <label className="field-label">추가 요청사항 (선택)</label>
              <textarea
                className="req-input"
                placeholder="추가로 전달하고 싶은 사항이 있으면 적어주세요"
                value={form.extraNote}
                onChange={(e) => set('extraNote', e.target.value)}
                style={{ minHeight: 80 }}
              />
            </div>

            {/* 개인정보 동의 */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: 16,
                marginBottom: 8,
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  cursor: 'pointer',
                }}
              >
                <div
                  onClick={() => { set('agreed', !form.agreed); clearError('agreed'); }}
                  style={{
                    width: 20, height: 20, minWidth: 20,
                    borderRadius: 6,
                    border: `2px solid ${form.agreed ? '#4f46e5' : '#cbd5e1'}`,
                    background: form.agreed ? '#4f46e5' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.15s', marginTop: 2,
                  }}
                >
                  {form.agreed && <span style={{ color: '#fff', fontSize: 11, fontWeight: 900 }}>✓</span>}
                </div>
                <span style={{ fontSize: 13, color: '#475569', fontWeight: 500, lineHeight: 1.5, wordBreak: 'keep-all' }}>
                  개인정보 처리방침에 동의합니다. 입력하신 정보는 작업 요청 처리 목적으로만 사용되며, 제3자에게 제공되지 않습니다.
                </span>
              </label>
              {errors.agreed && <p className="field-error" style={{ marginTop: 8 }}>{errors.agreed}</p>}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────
            Step 3: 완료
        ───────────────────────────────────────── */}
        {step === 3 && (
          <div className="animate-fade" style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="animate-check" style={{ marginBottom: 24 }}>
              <div
                style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'rgba(79,70,229,0.08)',
                  border: '2px solid #4f46e5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto',
                  fontSize: 36,
                }}
              >
                ✅
              </div>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 10px', letterSpacing: '-0.02em', color: '#0f172a', wordBreak: 'keep-all' }}>
              작업 요청이 등록되었습니다
            </h2>
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(79,70,229,0.06)',
                border: '1px solid rgba(79,70,229,0.2)',
                borderRadius: 8,
                padding: '6px 16px',
                fontSize: 13,
                fontWeight: 800,
                color: '#4f46e5',
                marginBottom: 24,
                fontFamily: 'monospace',
              }}
            >
              {requestNo}
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 16,
                padding: '24px 20px',
                marginBottom: 28,
                textAlign: 'left',
              }}
            >
              {[
                { icon: '📞', text: 'MONO 현장 컨설턴트가 24시간 내 연락드립니다' },
                { icon: '📋', text: '검증된 현장 리더의 견적이 등록되면 알림으로 안내해 드립니다' },
                { icon: '💰', text: '계약 확정 시 에스크로 대금 보호가 자동 적용됩니다' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: i < 2 ? 16 : 0 }}>
                  <span style={{ fontSize: 20, minWidth: 24 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, color: '#475569', fontWeight: 500, lineHeight: 1.55, wordBreak: 'keep-all' }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* 요청 요약 */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 16,
                padding: '20px',
                marginBottom: 28,
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                요청 요약
              </div>
              {[
                { label: '공종', value: WORK_TYPES.find(w => w.id === form.workType)?.label || '-' },
                { label: '작업명', value: form.workName },
                { label: '지역', value: form.region },
                { label: '예산', value: BUDGET_OPTIONS.find(b => b.id === form.budget)?.label || '-' },
                { label: '필요 인원', value: TEAM_SIZE_OPTIONS.find(t => t.id === form.teamSize)?.label || '-' },
                { label: '요청자', value: form.requesterName },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: i < 5 ? 10 : 0, gap: 12 }}>
                  <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>{row.label}</span>
                  <span style={{ fontSize: 13, color: '#1f2937', fontWeight: 700, textAlign: 'right', wordBreak: 'keep-all' }}>{row.value}</span>
                </div>
              ))}
            </div>

            <button className="cta-btn cta-primary" onClick={() => window.location.href = '/leader'}>
              MONO 현장 리더 둘러보기
            </button>
          </div>
        )}

        {/* ── Navigation Buttons ── */}
        {step < 3 && (
          <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
            {step > 0 && (
              <button className="cta-btn cta-secondary" onClick={handleBack} style={{ flex: 1 }}>
                이전
              </button>
            )}
            <button
              className="cta-btn cta-primary"
              style={{ flex: 2 }}
              onClick={step < 2 ? handleNext : () => { const e = validate(2); if (Object.keys(e).length > 0) { setErrors(e); return; } setStep(3); }}
            >
              {step < 2 ? '다음 단계 →' : '작업 요청 등록'}
            </button>
          </div>
        )}

        {/* ── Trust Badges ── */}
        {step < 3 && (
          <div
            style={{
              marginTop: 28,
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            {TRUST_BADGES.map((badge, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 999,
                  padding: '6px 14px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#64748b',
                  wordBreak: 'keep-all',
                }}
              >
                <span style={{ fontSize: 14 }}>{badge.icon}</span>
                {badge.text}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
