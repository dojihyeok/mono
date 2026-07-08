"use client";

// 수행기업(PERFORMER_COMPANY) 앱 — 공급측(dev-plan §5.3·§4-4).
// 회사 등록(없으면) → 공개 프로필(산업·지역·안전이수율·사례수) + 작업수행사례 관리. 후보 풀 노출.
import { useEffect, useState } from "react";
import { useProfile } from "@/lib/ProfileContext";
import { track } from "@/lib/analytics";
import { INDUSTRIES, REGIONS } from "@/lib/constants";
import {
  apiCreateCompany,
  apiGetCompanyProfile,
  apiAddWorkRecord,
  apiGetTrustScore,
} from "@/lib/apiClient";
import ForeignCandidateSearch from "./ForeignCandidateSearch";
import SettlementManager from "./SettlementManager";
import type { CompanyProfile, TrustScore } from "@/lib/types";

const COMPANY_KEY = "mono.companyId";
const indLabel = (v: string) => INDUSTRIES.find((i) => i.value === v)?.label ?? v;

export default function PerformerApp() {
  const { user } = useProfile();
  const [companyId, setCompanyId] = useState<string | null | undefined>(undefined); // undefined=로딩
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [trustScore, setTrustScore] = useState<TrustScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [recordOpen, setRecordOpen] = useState(false);
  const [foreignOpen, setForeignOpen] = useState(false); // 외국인 후보 검색 시트

  useEffect(() => {
    try {
      setCompanyId(window.localStorage.getItem(COMPANY_KEY));
    } catch {
      setCompanyId(null);
    }
  }, []);

  const loadProfile = (id: string) => {
    setLoading(true);
    Promise.all([
      apiGetCompanyProfile(id),
      apiGetTrustScore("PERFORMER_COMPANY", id)
    ]).then(([p, t]) => {
      setProfile(p);
      setTrustScore(t);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (companyId) {
      track("performer_profile_viewed", { surface: "performer_home", self: true });
      loadProfile(companyId);
    }
  }, [companyId]);

  const switchType = () => {
    try {
      window.localStorage.removeItem("mono.userType");
    } catch {
      /* noop */
    }
    window.location.reload();
  };

  if (companyId === undefined) return null; // 깜빡임 방지

  // 회사 미등록 → 등록 화면
  if (!companyId) {
    return (
      <CompanyRegister
        defaultName={user?.name ?? ""}
        onRegistered={(id) => {
          try {
            window.localStorage.setItem(COMPANY_KEY, id);
          } catch {
            /* noop */
          }
          setCompanyId(id);
        }}
      />
    );
  }

  const c = profile?.company;
  const records = profile?.workRecords ?? [];

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg,#f5f6fb)", color: "var(--app-text,#4f46e5)" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "calc(28px + env(safe-area-inset-top)) 20px 48px" }}>
        {/* 헤더 */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "var(--c1,#4f46e5)", background: "var(--aSoft,#ecedfb)", padding: "5px 11px", borderRadius: "999px" }}>수행기업</span>
            <h1 style={{ margin: "14px 0 0", fontSize: "24px", fontWeight: 800, letterSpacing: "-.6px", color: "var(--app-text,#4f46e5)" }}>
              {c?.name ?? user?.name ?? "수행기업"}
              {trustScore && trustScore.score > 0 && (
                <span style={{ marginLeft: "8px", verticalAlign: "middle", fontSize: "14px", fontWeight: 700, color: "var(--c1,#4f46e5)", background: "rgba(79,70,229,0.1)", padding: "4px 8px", borderRadius: "8px" }}>
                  ⭐ 신뢰점수 {trustScore.score}점
                </span>
              )}
            </h1>
          </div>
          <button onClick={switchType} style={{ flex: "none", marginTop: "2px", padding: "7px 11px", borderRadius: "10px", border: "1px solid #e6e8ec", background: "#fff", color: "var(--app-text-secondary,#5b6b82)", fontSize: "12px", fontWeight: 700, fontFamily: "inherit", cursor: "pointer" }}>
            유형 전환
          </button>
        </div>

        {/* 프로필 요약 */}
        {loading ? (
          <div style={{ ...cardBase, marginTop: "20px", color: "var(--app-text-tertiary,#8694a8)", textAlign: "center" }}>불러오는 중…</div>
        ) : (
          <div style={{ ...cardDark, marginTop: "20px" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, opacity: 0.85 }}>후보 풀 노출 중</div>
            <div style={{ marginTop: "6px", fontSize: "13px", lineHeight: 1.6, opacity: 0.95 }}>
              발주측·운영자가 작업요청 후보로 우리 회사를 찾을 수 있어요.
            </div>
            <div style={{ display: "flex", gap: "16px", marginTop: "14px" }}>
              <Stat label="산업" value={(c?.industries ?? []).map(indLabel).join("·") || "—"} />
              <Stat label="안전이수율" value={c?.safetyRate != null ? `${Math.round(c.safetyRate * 100)}%` : "—"} />
              <Stat label="작업사례" value={`${c?._count?.workRecords ?? records.length}건`} />
            </div>
          </div>
        )}

        {/* 작업수행사례 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "30px 0 12px" }}>
          <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 800, letterSpacing: "-.3px", color: "var(--app-text,#4f46e5)" }}>작업수행사례</h2>
          <button onClick={() => setRecordOpen(true)} style={{ padding: "7px 12px", borderRadius: "10px", border: "none", background: "var(--c1,#4f46e5)", color: "#fff", fontSize: "12.5px", fontWeight: 800, fontFamily: "inherit", cursor: "pointer" }}>+ 사례 추가</button>
        </div>
        {records.length === 0 ? (
          <div style={{ ...cardBase, textAlign: "center", color: "var(--app-text-secondary,#5b6b82)" }}>
            <div style={{ fontSize: "13.5px", fontWeight: 700 }}>아직 등록한 사례가 없어요.</div>
            <div style={{ fontSize: "12px", marginTop: "4px" }}>사례를 등록하면 후보 신뢰도가 올라가요.</div>
          </div>
        ) : (
          (Array.isArray(records) ? records : []).map((r) => (
            <div key={r.id} style={cardBase}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14.5px", fontWeight: 800, color: "var(--app-text,#4f46e5)" }}>{r.title}</span>
                <span style={{ flex: "none", fontSize: "11px", fontWeight: 800, color: "var(--c1,#4f46e5)", background: "var(--aSoft,#ecedfb)", padding: "4px 9px", borderRadius: "999px" }}>{indLabel(r.industry)}</span>
              </div>
              <div style={{ marginTop: "6px", fontSize: "12.5px", color: "var(--app-text-secondary,#5b6b82)", lineHeight: 1.6 }}>
                {[r.siteName, r.workTypes?.length ? r.workTypes.join("·") : null, r.period, r.scaleMemo].filter(Boolean).join(" · ") || "상세 미입력"}
              </div>
            </div>
          ))
        )}

        {/* 내 받을 금액 관리 (Sprint 6) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "30px 0 12px" }}>
          <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 800, letterSpacing: "-.3px", color: "var(--app-text,#4f46e5)" }}>소속 근로자 받을 금액 관리</h2>
        </div>
        <SettlementManager companyId={companyId || "temp-company-id"} />
        <button
          onClick={() => {
            void import("@/lib/apiClient").then(({ apiCreateReferral }) => {
              apiCreateReferral({ kind: "SETTLEMENT", note: "안심 받을 금액 및 에스크로 도입 상담 (수행기업)" })
                .then(() => alert("안심 받을 금액 도입 상담이 접수되었습니다. 담당자가 곧 연락드리겠습니다."))
                .catch(() => alert("접수에 실패했습니다. 다시 시도해주세요."));
            });
            track("referral_requested", { kind: "SETTLEMENT", context: "performer" });
          }}
          style={{ ...cardBase, display: "block", width: "100%", textAlign: "center", cursor: "pointer", fontFamily: "inherit", marginTop: "12px", background: "var(--c1,#4f46e5)", color: "#fff", fontWeight: 800 }}
        >
          안심 받을 금액 및 에스크로 도입 상담 (무료)
        </button>

        {/* 외국인 기술자 후보 검색 (dev-plan-foreign-workforce §5-5) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "30px 0 12px" }}>
          <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 800, letterSpacing: "-.3px", color: "var(--app-text,#4f46e5)" }}>외국인 기술자</h2>
        </div>
        <button
          onClick={() => setForeignOpen(true)}
          style={{ ...cardBase, display: "block", width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}
          aria-label="외국인 기술자 후보 검색"
        >
          <div style={{ fontSize: "14.5px", fontWeight: 800, color: "var(--app-text,#4f46e5)" }}>🌏 외국인 기술자 후보 찾기</div>
          <div style={{ marginTop: "6px", fontSize: "12.5px", color: "var(--app-text-secondary,#5b6b82)", lineHeight: 1.6 }}>
            체류자격·한국어 수준·산업·지역으로 외국인 기술자 후보를 찾아요.
          </div>
          <div style={{ marginTop: "9px", fontSize: "12px", fontWeight: 800, color: "var(--c1,#4f46e5)" }}>후보 검색 ›</div>
        </button>
      </div>

      {recordOpen && companyId && (
        <WorkRecordForm
          companyId={companyId}
          defaultIndustry={c?.industries?.[0]}
          onClose={() => setRecordOpen(false)}
          onSubmitted={() => {
            setRecordOpen(false);
            loadProfile(companyId);
          }}
        />
      )}

      {foreignOpen && (
        <div
          onClick={() => setForeignOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(15,18,30,.45)", display: "flex", alignItems: "flex-end", zIndex: 60 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "480px", margin: "0 auto", maxHeight: "92dvh", overflowY: "auto", background: "var(--bg,#f5f6fb)", borderRadius: "28px 28px 0 0", padding: "10px 0 calc(20px + env(safe-area-inset-bottom))", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)" }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end", padding: "4px 16px" }}>
              <button onClick={() => setForeignOpen(false)} aria-label="닫기" style={{ border: "none", background: "transparent", fontSize: "22px", color: "var(--app-text-secondary,#5b6b82)", cursor: "pointer", fontFamily: "inherit" }}>×</button>
            </div>
            <ForeignCandidateSearch />
          </div>
        </div>
      )}
    </div>
  );
}

// 수행기업 등록 — 회사명·담당자·연락처 + 산업·지역. companyKind=PERFORMER.
function CompanyRegister({ defaultName, onRegistered }: { defaultName: string; onRegistered: (id: string) => void }) {
  const [name, setName] = useState(defaultName);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [industries, setIndustries] = useState<string[]>([]);
  const [region, setRegion] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const valid = !!name.trim() && !!contactName.trim() && !!contactPhone.trim() && industries.length > 0;
  const toggle = (v: string, list: string[], set: (x: string[]) => void) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const submit = async () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    const res = await apiCreateCompany({ name: name.trim(), contactName: contactName.trim(), contactPhone: contactPhone.trim(), industries, region });
    setSubmitting(false);
    if (res?.id) {
      track("company_signup_completed", { kind: "PERFORMER" });
      onRegistered(res.id);
    }
  };

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "var(--bg,#f5f6fb)", color: "var(--app-text,#4f46e5)" }}>
      <div style={{ flex: "1", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ width: "100%", maxWidth: "480px", margin: "0 auto", padding: "calc(34px + env(safe-area-inset-top)) 22px 16px" }}>
          <div style={{ animation: "riseUp .5s ease both" }}>
            <span style={{ display: "inline-block", fontSize: "12px", fontWeight: 800, color: "var(--c1,#4f46e5)", background: "var(--aSoft,#ecedfb)", padding: "6px 12px", borderRadius: "999px" }}>수행기업 등록</span>
            <h1 style={{ margin: "18px 0 0", fontSize: "26px", lineHeight: 1.32, fontWeight: 800, letterSpacing: "-.7px", color: "var(--app-text,#4f46e5)" }}>회사를 등록하면<br />후보 풀에 노출돼요.</h1>
          </div>
          <Field label="회사명"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 대성건설" style={inputStyle} /></Field>
          <Field label="담당자"><input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="담당자 이름" style={inputStyle} /></Field>
          <Field label="연락처"><input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="010-0000-0000" style={inputStyle} /></Field>
          <Field label="산업 분야 · 복수"><Pills options={INDUSTRIES.map((i) => i.value)} labels={INDUSTRIES.map((i) => i.label)} selected={industries} onToggle={(v) => toggle(v, industries, setIndustries)} /></Field>
          <Field label="현장 지역 · 복수"><Pills options={[...REGIONS]} selected={region} onToggle={(v) => toggle(v, region, setRegion)} /></Field>
          <div style={{ height: "16px" }} />
        </div>
      </div>
      <div style={{ flex: "none", padding: "12px 22px calc(16px + env(safe-area-inset-bottom))", background: "linear-gradient(180deg,rgba(245,246,251,0),var(--bg,#f5f6fb) 30%)" }}>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <button onClick={submit} disabled={!valid || submitting} style={{ width: "100%", height: "56px", borderRadius: "16px", border: "none", background: valid && !submitting ? "var(--c1,#4f46e5)" : "#e6e8ec", color: valid && !submitting ? "#fff" : "#8694a8", fontSize: "16px", fontWeight: 800, fontFamily: "inherit", cursor: valid && !submitting ? "pointer" : "default", boxShadow: valid && !submitting ? "0 12px 26px -10px color-mix(in srgb, var(--brand,#4f46e5) 55%, transparent)" : "none" }}>
            {submitting ? "등록 중…" : valid ? "수행기업 등록" : "항목을 채워주세요"}
          </button>
        </div>
      </div>
    </div>
  );
}

// 작업수행사례 등록 시트.
function WorkRecordForm({ companyId, defaultIndustry, onClose, onSubmitted }: { companyId: string; defaultIndustry?: string; onClose: () => void; onSubmitted: () => void }) {
  const [industry, setIndustry] = useState<string>(defaultIndustry ?? "");
  const [title, setTitle] = useState("");
  const [siteName, setSiteName] = useState("");
  const [workTypes, setWorkTypes] = useState("");
  const [period, setPeriod] = useState("");
  const [scaleMemo, setScaleMemo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const valid = !!industry && !!title.trim();

  const submit = async () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    const res = await apiAddWorkRecord(companyId, {
      industry,
      title: title.trim(),
      siteName: siteName.trim() || undefined,
      workTypes: workTypes.trim() ? workTypes.split(/[,\s]+/).filter(Boolean) : undefined,
      period: period.trim() || undefined,
      scaleMemo: scaleMemo.trim() || undefined,
    });
    setSubmitting(false);
    if (res) onSubmitted();
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(17,17,17,.34)", backdropFilter: "blur(3px)", zIndex: 60, display: "flex", alignItems: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "480px", margin: "0 auto", maxHeight: "90dvh", overflowY: "auto", background: "#fff", borderRadius: "28px 28px 0 0", padding: "10px 20px calc(20px + env(safe-area-inset-bottom))", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)" }}>
        <div style={{ width: "38px", height: "4px", borderRadius: "999px", background: "#e6e8ec", margin: "0 auto 14px" }} />
        <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 800, letterSpacing: "-.5px", color: "var(--app-text,#4f46e5)" }}>작업수행사례</h2>
        <p style={{ margin: 0, fontSize: "12.5px", color: "var(--app-text-secondary,#5b6b82)" }}>산업·제목만 정하면 등록돼요.</p>

        <Field label="산업 분야"><Pills options={INDUSTRIES.map((i) => i.value)} labels={INDUSTRIES.map((i) => i.label)} selected={industry ? [industry] : []} onToggle={(v) => setIndustry((p) => (p === v ? "" : v))} /></Field>
        <Field label="사례 제목"><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 송도 오피스 신축" style={inputStyle} /></Field>
        <Field label="현장명"><input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="현장명(선택)" style={inputStyle} /></Field>
        <Field label="작업유형 · 쉼표 구분"><input value={workTypes} onChange={(e) => setWorkTypes(e.target.value)} placeholder="예: 형틀, 철근" style={inputStyle} /></Field>
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}><Field label="기간"><input value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="예: 2025.03~07" style={inputStyle} /></Field></div>
          <div style={{ flex: 1 }}><Field label="규모"><input value={scaleMemo} onChange={(e) => setScaleMemo(e.target.value)} placeholder="예: 연 1.2만㎡" style={inputStyle} /></Field></div>
        </div>
        <button onClick={submit} disabled={!valid || submitting} style={{ marginTop: "20px", width: "100%", height: "54px", borderRadius: "16px", border: "none", background: valid && !submitting ? "var(--c1,#4f46e5)" : "#e6e8ec", color: valid && !submitting ? "#fff" : "#8694a8", fontSize: "16px", fontWeight: 800, fontFamily: "inherit", cursor: valid && !submitting ? "pointer" : "default" }}>
          {submitting ? "등록 중…" : valid ? "사례 등록" : "산업·제목을 입력하세요"}
        </button>
      </div>
    </div>
  );
}

// ── 소형 공용 UI ──
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: "10.5px", fontWeight: 700, opacity: 0.7 }}>{label}</div>
      <div style={{ marginTop: "3px", fontSize: "13.5px", fontWeight: 800 }}>{value}</div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: "18px" }}>
      <label style={{ display: "block", fontSize: "13px", fontWeight: 800, color: "var(--app-text,#4f46e5)", marginBottom: "9px" }}>{label}</label>
      {children}
    </div>
  );
}
function Pills({ options, labels, selected, onToggle }: { options: string[]; labels?: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {options.map((o, i) => {
        const on = selected.includes(o);
        return (
          <button key={o} type="button" onClick={() => onToggle(o)} style={{ padding: "9px 14px", borderRadius: "999px", border: `1.5px solid ${on ? "var(--c1,#4f46e5)" : "#e6e8ec"}`, background: on ? "var(--c1,#4f46e5)" : "#fff", color: on ? "#fff" : "var(--app-text-secondary,#5b6b82)", fontSize: "13.5px", fontWeight: on ? 800 : 600, fontFamily: "inherit", cursor: "pointer" }}>{labels?.[i] ?? o}</button>
        );
      })}
    </div>
  );
}

const cardBase: React.CSSProperties = { padding: "16px", borderRadius: "16px", border: "1px solid #e6e8ec", background: "#fff", marginBottom: "10px" };
const cardDark: React.CSSProperties = { padding: "18px", borderRadius: "20px", background: "var(--c1,#4f46e5)", color: "#fff" };
const inputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", height: "48px", padding: "0 14px", borderRadius: "13px", border: "1px solid #e6e8ec", background: "#fff", color: "#111111", fontSize: "15px", fontFamily: "inherit", outline: "none" };
