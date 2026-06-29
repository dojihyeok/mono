"use client";

// 외국인 기술자 통합 화면 (dev-plan-foreign-workforce) — 프로필·체류/비자·서류·교육·정산·용어.
// 6탭 single client component. best-effort API(실패해도 UI 안 막음). 모바일 우선 인라인 스타일.
import { CSSProperties, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import {
  getServerId,
  apiGetWorkerProfile,
  apiUpsertWorkerProfile,
  apiListVisa,
  apiCreateVisa,
  apiListDocuments,
  apiAddDocument,
  apiListTraining,
  apiAddTraining,
  apiDeleteTraining,
  apiListSettlements,
  apiDisputeSettlement,
  apiCreateReferral,
} from "@/lib/apiClient";
import {
  LANGUAGES,
  NATIONALITIES,
  VISA_TYPES,
  KOREAN_LEVELS,
  DOCUMENT_KINDS,
  SETTLEMENT_ITEM_KINDS,
  SETTLEMENT_STATUS_LABEL,
  VISA_DOC_STATUS_LABEL,
  TRAINING_KINDS,
  PARTNER_REFERRAL_KINDS,
} from "@/lib/constants";
import type { VisaStatus, DocumentRecord, TrainingRecord, Settlement } from "@/lib/types";
import GlossaryView from "./GlossaryView";
import ForeignOnboardingGuide from "./ForeignOnboardingGuide";

// ── 디자인 토큰(인라인) ──
const C1 = "var(--c1,#4f46e5)";
const SOFT = "var(--aSoft,#ecedfb)";
const TEXT = "var(--app-text,#4f46e5)";
const SUB = "#5b6b82";
const FAINT = "#8694a8";
const BORDER = "#eef0f6";

const wrap: CSSProperties = { maxWidth: 480, margin: "0 auto", padding: "4px 16px" };
const card: CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: 16,
  border: `1px solid ${BORDER}`,
  marginBottom: 12,
};
const pillRow: CSSProperties = { display: "flex", flexWrap: "wrap", gap: 8 };
const fieldLabel: CSSProperties = {
  fontSize: 12.5,
  fontWeight: 700,
  color: SUB,
  margin: "14px 0 8px",
  display: "block",
};
const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: 12,
  border: `1px solid ${BORDER}`,
  background: SOFT,
  fontSize: 14,
  color: TEXT,
  outline: "none",
};

function pill(active: boolean): CSSProperties {
  return {
    padding: "9px 14px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    background: active ? C1 : SOFT,
    color: active ? "#fff" : TEXT,
    lineHeight: 1.2,
  };
}
const primaryBtn: CSSProperties = {
  width: "100%",
  marginTop: 16,
  padding: "14px 16px",
  borderRadius: 12,
  border: "none",
  background: C1,
  color: "#fff",
  fontSize: 15,
  fontWeight: 800,
  cursor: "pointer",
};

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
const orUndef = (s: string) => (s.trim() ? s.trim() : undefined);

// 정산 항목·상태 영문 라벨(언어 토글용 간단 매핑).
const ITEM_EN: Record<string, string> = {
  BASE_WAGE: "Base wage",
  OVERTIME: "Overtime / Night / Holiday",
  ALLOWANCE: "Allowance",
  MEAL: "Meal",
  LODGING: "Lodging",
  TRANSPORT: "Transport",
  EDUCATION: "Education",
  INSURANCE: "Insurance / Guarantee",
  REMITTANCE: "Remittance",
};
const STATUS_EN: Record<string, string> = {
  DRAFT: "Draft",
  CONFIRMED: "Confirmed",
  PAID: "Paid",
  DISPUTED: "Disputed",
};

type Tab = "profile" | "visa" | "documents" | "training" | "settlement" | "glossary" | "guide";
const TABS: { key: Tab; label: string }[] = [
  { key: "profile", label: "프로필" },
  { key: "visa", label: "체류·비자" },
  { key: "documents", label: "서류" },
  { key: "training", label: "교육" },
  { key: "settlement", label: "정산" },
  { key: "glossary", label: "용어" },
  { key: "guide", label: "가이드" },
];

// 국적 선택 — 네이티브 <select> 대신 커스텀 드롭다운(메모리: 크로스플랫폼 일관 UI).
// 트리거 + 바텀시트 옵션. 자유 입력 차단 → NATIONALITIES 고정 목록만 선택.
function CountrySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 + ESC 로 닫기 (딤·모달 없음 — 트리거 아래로 펼치는 일반 드롭다운)
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button
        type="button"
        id="fw-nationality"
        aria-label="국적 선택"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{ width: "100%", height: 48, boxSizing: "border-box", border: `1px solid ${open ? C1 : "#e6e8ec"}`, borderRadius: 12, padding: "0 14px", fontSize: 15, fontFamily: "inherit", color: value ? TEXT : FAINT, fontWeight: 600, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, WebkitTapHighlightColor: "transparent" }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value || "국적을 선택하세요"}</span>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flex: "none", transition: "transform .2s ease", transform: open ? "rotate(180deg)" : "none" }}>
          <path d="M4 6l4 4 4-4" stroke="#8694a8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          role="listbox"
          aria-label="국적"
          style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50, maxHeight: 300, overflowY: "auto", background: "#fff", border: "1px solid #e6e8ec", borderRadius: 12, boxShadow: "0 16px 36px -14px rgba(17,17,17,.3)", padding: 6 }}
        >
          {NATIONALITIES.map((c) => {
            const on = value === c;
            return (
              <button
                key={c}
                type="button"
                role="option"
                aria-selected={on}
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                }}
                style={{ width: "100%", textAlign: "left", border: "none", background: on ? SOFT : "transparent", color: on ? C1 : TEXT, fontWeight: on ? 800 : 600, fontSize: 14.5, fontFamily: "inherit", padding: "11px 12px", borderRadius: 9, cursor: "pointer" }}
              >
                {c}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
// 프로필
// ════════════════════════════════════════════════════════════════════
export function ProfileTab({ id }: { id: string }) {
  const [nationality, setNationality] = useState("");
  const [residency, setResidency] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [koreanLevel, setKoreanLevel] = useState("");
  const [interpreterNeeded, setInterpreterNeeded] = useState(false);
  const [desiredEntryDate, setDesiredEntryDate] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    track("foreign_profile_started", { surface: "foreign_hub" });
    void apiGetWorkerProfile(id).then((p) => {
      if (!p) return;
      setNationality(p.nationality ?? "");
      setResidency(p.residency ?? "");
      setLanguages(p.languages ?? []);
      setKoreanLevel(p.koreanLevel ?? "");
      setInterpreterNeeded(!!p.interpreterNeeded);
      setDesiredEntryDate(p.desiredEntryDate ? p.desiredEntryDate.slice(0, 10) : "");
    });
  }, [id]);

  const toggleLang = (v: string) => {
    setLanguages((prev) => {
      const next = prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v];
      if (!prev.includes(v)) track("language_selected", { lang: v });
      return next;
    });
  };

  const pickKorean = (v: string) => {
    setKoreanLevel(v);
    track("korean_level_registered", { koreanLevel: v });
  };

  const save = () => {
    void apiUpsertWorkerProfile(id, {
      nationality: orUndef(nationality),
      residency: residency || undefined,
      languages,
      koreanLevel: koreanLevel || undefined,
      interpreterNeeded,
      desiredEntryDate:
        residency === "OVERSEAS" && desiredEntryDate
          ? new Date(desiredEntryDate).toISOString()
          : undefined,
    }).then(() => {
      track("foreign_profile_completed", { surface: "foreign_hub" });
      setToast("저장됨");
      setTimeout(() => setToast(""), 2000);
    });
  };

  return (
    <>
      <div style={card}>
        <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800, color: TEXT }}>외국인 기술자 프로필</h3>
        <p style={{ margin: 0, fontSize: 12.5, color: FAINT }}>국적·언어·한국어 수준을 등록하면 현장 매칭에 도움이 돼요.</p>

        <label htmlFor="fw-nationality" style={fieldLabel}>국적</label>
        <CountrySelect value={nationality} onChange={setNationality} />

        <span style={fieldLabel}>거주 상태</span>
        <div style={pillRow} role="group" aria-label="거주 상태 선택">
          {[
            { v: "DOMESTIC", l: "국내 거주" },
            { v: "OVERSEAS", l: "해외 거주" },
          ].map((o) => (
            <button
              key={o.v}
              type="button"
              aria-pressed={residency === o.v}
              aria-label={o.l}
              style={pill(residency === o.v)}
              onClick={() => setResidency(o.v)}
            >
              {o.l}
            </button>
          ))}
        </div>

        <span style={fieldLabel}>사용 언어 (복수 선택)</span>
        <div style={pillRow} role="group" aria-label="사용 언어 선택">
          {LANGUAGES.map((l) => (
            <button
              key={l.value}
              type="button"
              aria-pressed={languages.includes(l.value)}
              aria-label={`언어 ${l.label}`}
              style={pill(languages.includes(l.value))}
              onClick={() => toggleLang(l.value)}
            >
              {l.native}
            </button>
          ))}
        </div>

        <span style={fieldLabel}>한국어 수준</span>
        <div style={pillRow} role="group" aria-label="한국어 수준 선택">
          {KOREAN_LEVELS.map((k) => (
            <button
              key={k.value}
              type="button"
              aria-pressed={koreanLevel === k.value}
              aria-label={`한국어 ${k.label}`}
              style={pill(koreanLevel === k.value)}
              onClick={() => pickKorean(k.value)}
            >
              {k.label}
            </button>
          ))}
        </div>

        <label
          style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, cursor: "pointer", fontSize: 14, color: TEXT }}
        >
          <input
            type="checkbox"
            checked={interpreterNeeded}
            onChange={(e) => setInterpreterNeeded(e.target.checked)}
            style={{ width: 18, height: 18 }}
          />
          통역 지원이 필요해요
        </label>

        {residency === "OVERSEAS" && (
          <>
            <label htmlFor="fw-entry" style={fieldLabel}>한국 취업 희망 시점</label>
            <input
              id="fw-entry"
              type="date"
              value={desiredEntryDate}
              onChange={(e) => setDesiredEntryDate(e.target.value)}
              aria-label="한국 취업 희망 시점"
              style={inputStyle}
            />
          </>
        )}

        <button type="button" style={primaryBtn} onClick={save} aria-label="프로필 저장">
          저장
        </button>
        {toast && (
          <div style={{ marginTop: 10, textAlign: "center", fontSize: 13, color: C1, fontWeight: 700 }}>{toast}</div>
        )}
      </div>


      <PartnerReferralBlock />
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// 체류·비자
// ════════════════════════════════════════════════════════════════════
function dDay(date?: string | null): number | null {
  if (!date) return null;
  const t = new Date(date).getTime();
  if (Number.isNaN(t)) return null;
  return Math.ceil((t - Date.now()) / 86400000);
}
const visaLabel = (v: string) => VISA_TYPES.find((x) => x.value === v)?.label ?? v;

export function VisaTab({ id }: { id: string }) {
  const [list, setList] = useState<VisaStatus[]>([]);
  const [visaType, setVisaType] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [renewalDueDate, setRenewalDueDate] = useState("");
  const [workScope, setWorkScope] = useState("");
  const [workplaceChangeable, setWorkplaceChangeable] = useState(false);
  const [arcNumber, setArcNumber] = useState("");
  const alertFired = useRef(false);

  const load = () => void apiListVisa(id).then(setList);
  useEffect(load, [id]);

  const current = list[0];
  const curDday = dDay(current?.expiryDate);
  useEffect(() => {
    if (curDday !== null && curDday <= 30 && !alertFired.current) {
      alertFired.current = true;
      track("visa_expiry_alert_viewed", { dday: curDday });
    }
  }, [curDday]);

  const register = () => {
    if (!visaType) return;
    void apiCreateVisa(id, {
      visaType,
      expiryDate: orUndef(expiryDate),
      renewalDueDate: orUndef(renewalDueDate),
      workScope: orUndef(workScope),
      workplaceChangeable,
      arcNumber: orUndef(arcNumber),
    }).then(() => {
      track("visa_status_registered", { visaType });
      setVisaType("");
      setExpiryDate("");
      setRenewalDueDate("");
      setWorkScope("");
      setWorkplaceChangeable(false);
      setArcNumber("");
      load();
    });
  };

  return (
    <>
      {current && (
        <div
          style={{
            ...card,
            border: curDday !== null && curDday <= 30 ? "1px solid #f3c6c6" : `1px solid ${C1}`,
            background: curDday !== null && curDday <= 30 ? "#fff7f7" : SOFT,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: SUB }}>현재 체류자격</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, margin: "4px 0" }}>{visaLabel(current.visaType)}</div>
          {current.expiryDate && (
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: curDday !== null && curDday <= 30 ? "#c0392b" : SUB,
              }}
            >
              만료 {current.expiryDate.slice(0, 10)}
              {curDday !== null && (curDday >= 0 ? ` · D-${curDday}` : ` · ${-curDday}일 경과`)}
              {curDday !== null && curDday <= 30 && " ⚠ 갱신 준비가 필요해요"}
            </div>
          )}
        </div>
      )}

      <div style={card}>
        <div style={{ fontWeight: 800, fontSize: 15, color: TEXT }}>체류·비자 등록</div>

        <span style={fieldLabel}>체류자격</span>
        <div style={pillRow} role="group" aria-label="체류자격 선택">
          {VISA_TYPES.map((v) => (
            <button
              key={v.value}
              type="button"
              aria-pressed={visaType === v.value}
              aria-label={v.label}
              style={pill(visaType === v.value)}
              onClick={() => setVisaType(v.value)}
            >
              {v.label}
            </button>
          ))}
        </div>

        <label htmlFor="fw-expiry" style={fieldLabel}>만료일</label>
        <input id="fw-expiry" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} aria-label="만료일" style={inputStyle} />

        <label htmlFor="fw-renewal" style={fieldLabel}>갱신 예정일</label>
        <input id="fw-renewal" type="date" value={renewalDueDate} onChange={(e) => setRenewalDueDate(e.target.value)} aria-label="갱신 예정일" style={inputStyle} />

        <label htmlFor="fw-scope" style={fieldLabel}>허용 작업 범위</label>
        <input id="fw-scope" value={workScope} onChange={(e) => setWorkScope(e.target.value)} placeholder="예: 제조업 일반" aria-label="허용 작업 범위" style={inputStyle} />

        <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, cursor: "pointer", fontSize: 14, color: TEXT }}>
          <input type="checkbox" checked={workplaceChangeable} onChange={(e) => setWorkplaceChangeable(e.target.checked)} style={{ width: 18, height: 18 }} />
          사업장 변경 가능
        </label>

        <label htmlFor="fw-arc" style={fieldLabel}>외국인등록증 번호 · 민감정보</label>
        <input
          id="fw-arc"
          value={arcNumber}
          onChange={(e) => setArcNumber(e.target.value)}
          placeholder="예: 900101-1****** (안전 보관 · 외부 비공개)"
          aria-label="외국인등록증 번호 (민감정보)"
          style={inputStyle}
        />

        <button type="button" style={primaryBtn} onClick={register} aria-label="체류·비자 등록" disabled={!visaType}>
          등록
        </button>
      </div>

      {/* 이력 */}
      <div style={card}>
        <div style={{ fontWeight: 800, fontSize: 14, color: TEXT, marginBottom: 8 }}>등록 이력</div>
        {list.length === 0 ? (
          <div style={{ fontSize: 13, color: FAINT }}>등록된 체류·비자 이력이 없어요.</div>
        ) : (
          list.map((v) => (
            <div key={v.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "9px 0", borderTop: `1px solid ${BORDER}` }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: TEXT }}>{visaLabel(v.visaType)}</span>
              <span style={{ fontSize: 12.5, color: SUB }}>
                {v.expiryDate ? `~${v.expiryDate.slice(0, 10)}` : "만료일 미입력"}
                {" · "}
                {VISA_DOC_STATUS_LABEL[v.status] ?? v.status}
              </span>
            </div>
          ))
        )}
      </div>

      <PartnerReferralBlock />
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// 서류
// ════════════════════════════════════════════════════════════════════
const docLabel = (v: string) => DOCUMENT_KINDS.find((x) => x.value === v)?.label ?? v;

export function DocsTab({ id }: { id: string }) {
  const [list, setList] = useState<DocumentRecord[]>([]);
  const [kind, setKind] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const load = () => void apiListDocuments(id).then(setList);
  useEffect(load, [id]);

  const upload = () => {
    if (!kind || !fileUrl.trim()) return;
    void apiAddDocument(id, { kind, fileUrl: fileUrl.trim() }).then(() => {
      track("document_uploaded", { kind });
      setKind("");
      setFileUrl("");
      load();
    });
  };

  return (
    <>
      <div style={card}>
        <div style={{ fontWeight: 800, fontSize: 15, color: TEXT }}>서류 등록</div>

        <span style={fieldLabel}>서류 종류</span>
        <div style={pillRow} role="group" aria-label="서류 종류 선택">
          {DOCUMENT_KINDS.map((d) => (
            <button key={d.value} type="button" aria-pressed={kind === d.value} aria-label={d.label} style={pill(kind === d.value)} onClick={() => setKind(d.value)}>
              {d.label}
            </button>
          ))}
        </div>

        <label htmlFor="fw-fileurl" style={fieldLabel}>파일 URL — 외부 스토리지 링크</label>
        <input id="fw-fileurl" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://…" aria-label="파일 URL" style={inputStyle} />

        <button type="button" style={primaryBtn} onClick={upload} aria-label="서류 업로드" disabled={!kind || !fileUrl.trim()}>
          업로드
        </button>
      </div>

      <div style={card}>
        <div style={{ fontWeight: 800, fontSize: 14, color: TEXT, marginBottom: 8 }}>등록된 서류</div>
        {list.length === 0 ? (
          <div style={{ fontSize: 13, color: FAINT }}>등록된 서류가 없어요.</div>
        ) : (
          list.map((d) => (
            <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "9px 0", borderTop: `1px solid ${BORDER}` }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: TEXT }}>{docLabel(d.kind)}</span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: C1, background: SOFT, borderRadius: 999, padding: "3px 9px" }}>
                {VISA_DOC_STATUS_LABEL[d.status] ?? d.status}
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// 교육
// ════════════════════════════════════════════════════════════════════
const trainingLabel = (v: string) => TRAINING_KINDS.find((x) => x.value === v)?.label ?? v;

export function TrainingTab({ id }: { id: string }) {
  const [list, setList] = useState<TrainingRecord[]>([]);
  const [kind, setKind] = useState("");
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [completedAt, setCompletedAt] = useState("");

  const load = () => void apiListTraining(id).then(setList);
  useEffect(load, [id]);

  const add = () => {
    if (!kind || !title.trim()) return;
    void apiAddTraining(id, {
      kind,
      title: title.trim(),
      provider: orUndef(provider),
      completedAt: orUndef(completedAt),
    }).then(() => {
      track("training_completed", { kind });
      setKind("");
      setTitle("");
      setProvider("");
      setCompletedAt("");
      load();
    });
  };

  const remove = (tid: string) => {
    void apiDeleteTraining(id, tid).then((ok) => {
      if (ok) setList((prev) => prev.filter((t) => t.id !== tid));
    });
  };

  return (
    <>
      <div style={card}>
        <div style={{ fontWeight: 800, fontSize: 15, color: TEXT }}>교육 이수 등록</div>

        <span style={fieldLabel}>교육 종류</span>
        <div style={pillRow} role="group" aria-label="교육 종류 선택">
          {TRAINING_KINDS.map((t) => (
            <button key={t.value} type="button" aria-pressed={kind === t.value} aria-label={t.label} style={pill(kind === t.value)} onClick={() => setKind(t.value)}>
              {t.label}
            </button>
          ))}
        </div>

        <label htmlFor="fw-tr-title" style={fieldLabel}>교육명</label>
        <input id="fw-tr-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 기초안전보건교육" aria-label="교육명" style={inputStyle} />

        <label htmlFor="fw-tr-provider" style={fieldLabel}>교육기관</label>
        <input id="fw-tr-provider" value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="예: 안전보건공단" aria-label="교육기관" style={inputStyle} />

        <label htmlFor="fw-tr-date" style={fieldLabel}>이수일</label>
        <input id="fw-tr-date" type="date" value={completedAt} onChange={(e) => setCompletedAt(e.target.value)} aria-label="이수일" style={inputStyle} />

        <button type="button" style={primaryBtn} onClick={add} aria-label="교육 이수 등록" disabled={!kind || !title.trim()}>
          등록
        </button>
      </div>

      <div style={card}>
        <div style={{ fontWeight: 800, fontSize: 14, color: TEXT, marginBottom: 8 }}>이수 내역</div>
        {list.length === 0 ? (
          <div style={{ fontSize: 13, color: FAINT }}>등록된 교육 이수 내역이 없어요.</div>
        ) : (
          list.map((t) => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "9px 0", borderTop: `1px solid ${BORDER}` }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: TEXT }}>{t.title}</div>
                <div style={{ fontSize: 12, color: SUB }}>
                  {trainingLabel(t.kind)}
                  {t.provider ? ` · ${t.provider}` : ""}
                  {t.completedAt ? ` · ${t.completedAt.slice(0, 10)}` : ""}
                </div>
              </div>
              <button
                type="button"
                onClick={() => remove(t.id)}
                aria-label={`${t.title} 삭제`}
                style={{ flex: "0 0 auto", background: SOFT, border: "none", borderRadius: 999, padding: "7px 12px", fontSize: 12.5, fontWeight: 700, color: "#c0392b", cursor: "pointer" }}
              >
                삭제
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// 정산
// ════════════════════════════════════════════════════════════════════
const itemLabel = (v: string) => SETTLEMENT_ITEM_KINDS.find((x) => x.value === v)?.label ?? v;

export function SettlementTab({ id }: { id: string }) {
  const [list, setList] = useState<Settlement[]>([]);
  const [en, setEn] = useState(false);

  useEffect(() => {
    track("settlement_viewed", { surface: "foreign_hub" });
    void apiListSettlements({ workerId: id }).then(setList);
  }, [id]);

  const dispute = (sid: string) => {
    void apiDisputeSettlement(sid).then((updated) => {
      track("settlement_dispute_reported", { settlementId: sid });
      if (updated) setList((prev) => prev.map((s) => (s.id === sid ? updated : s)));
    });
  };

  const statusLabel = (s: string) => (en ? STATUS_EN[s] ?? s : SETTLEMENT_STATUS_LABEL[s] ?? s);
  const kindLabel = (k: string) => (en ? ITEM_EN[k] ?? k : itemLabel(k));

  return (
    <>
      <div style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: TEXT }}>정산 내역</div>
        <div style={{ display: "flex", gap: 6 }} role="group" aria-label="정산 표시 언어">
          <button type="button" aria-pressed={!en} aria-label="한국어 표시" style={pill(!en)} onClick={() => setEn(false)}>
            한
          </button>
          <button type="button" aria-pressed={en} aria-label="영어 표시" style={pill(en)} onClick={() => setEn(true)}>
            EN
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <div style={{ ...card, textAlign: "center", color: SUB }}>{en ? "No settlements yet." : "정산 내역이 없어요."}</div>
      ) : (
        list.map((s) => {
          const total = s.items.reduce((sum, it) => sum + it.amount, 0);
          return (
            <div key={s.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>{s.period}</span>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: s.status === "DISPUTED" ? "#c0392b" : C1,
                    background: s.status === "DISPUTED" ? "#fdecec" : SOFT,
                    borderRadius: 999,
                    padding: "3px 10px",
                  }}
                >
                  {statusLabel(s.status)}
                </span>
              </div>

              {s.items.map((it) => (
                <div key={it.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "7px 0", borderTop: `1px solid ${BORDER}` }}>
                  <span style={{ fontSize: 13, color: SUB }}>
                    {kindLabel(it.kind)}
                    {it.note ? <span style={{ color: FAINT }}> · {it.note}</span> : null}
                  </span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: TEXT, whiteSpace: "nowrap" }}>{won(it.amount)}</span>
                </div>
              ))}

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: `2px solid ${BORDER}` }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: TEXT }}>{en ? "Total" : "합계"}</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: C1 }}>{won(total)}</span>
              </div>

              <button
                type="button"
                onClick={() => dispute(s.id)}
                aria-label={`${s.period} 정산 분쟁 신고`}
                disabled={s.status === "DISPUTED"}
                style={{
                  width: "100%",
                  marginTop: 12,
                  padding: "11px 14px",
                  borderRadius: 12,
                  border: `1px solid ${s.status === "DISPUTED" ? BORDER : "#c0392b"}`,
                  background: "#fff",
                  color: s.status === "DISPUTED" ? FAINT : "#c0392b",
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: s.status === "DISPUTED" ? "default" : "pointer",
                }}
              >
                {s.status === "DISPUTED" ? (en ? "Dispute reported" : "분쟁 신고됨") : en ? "Report dispute" : "정산 분쟁 신고"}
              </button>
            </div>
          );
        })
      )}
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// 행정·노무 파트너 연계 (프로필·비자 탭 하단 공통)
// ════════════════════════════════════════════════════════════════════
function PartnerReferralBlock() {
  const [kind, setKind] = useState("");
  const [done, setDone] = useState(false);

  const request = () => {
    if (!kind) return;
    void apiCreateReferral({ kind }).then(() => {
      track("partner_referral_requested", { kind });
      setDone(true);
    });
  };

  return (
    <div style={card}>
      <div style={{ fontWeight: 800, fontSize: 15, color: TEXT }}>행정·노무 파트너 연계 신청</div>
      <p style={{ margin: "4px 0 0", fontSize: 12.5, color: FAINT, lineHeight: 1.5 }}>
        필요한 분야를 선택하면 맞는 전문 파트너(행정사·노무사 등)를 안내해 드려요.
      </p>

      <div style={{ ...pillRow, marginTop: 12 }} role="group" aria-label="연계 분야 선택">
        {PARTNER_REFERRAL_KINDS.map((p) => (
          <button key={p.value} type="button" aria-pressed={kind === p.value} aria-label={p.label} style={pill(kind === p.value)} onClick={() => setKind(p.value)}>
            {p.label}
          </button>
        ))}
      </div>

      <button type="button" style={primaryBtn} onClick={request} aria-label="파트너 연계 신청" disabled={!kind}>
        연계 신청
      </button>
      {done && (
        <div style={{ marginTop: 10, textAlign: "center", fontSize: 13, color: C1, fontWeight: 700 }}>
          신청이 접수되었어요. 검토 후 적합한 파트너를 안내해 드릴게요.
        </div>
      )}
    </div>
  );
}
