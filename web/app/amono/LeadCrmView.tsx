"use client";

// BM 검증 CRM — 리드 관리 / 인터뷰 관리 / 설문 응답 관리 / PoC 관심 관리.
// 자체 fetch(ForeignAdminView/AdminOpsView 패턴 복제) — AdminClient 공용 상태에 얹지 않음.
import { useCallback, useEffect, useState } from "react";
import styles from "./admin.module.css";

interface AdminInterview {
  id: string;
  leadId: string;
  scheduledAt: string | null;
  completedAt: string | null;
  notes: string | null;
  followUpAction: string | null;
  createdAt: string;
}
interface AdminLead {
  id: string;
  name: string;
  company: string | null;
  segment: string;
  contact: string;
  industry: string | null;
  region: string | null;
  interestBMs: string[];
  stage: string;
  paymentIntent: string;
  followUp: string | null;
  createdAt: string;
  interviews: AdminInterview[];
  surveyResponses: { id: string }[];
}
interface AdminSurveyResponse {
  id: string;
  role: string;
  answers: { topic: string; question: string; answer: string }[];
  createdAt: string;
  lead: { id: string; name: string; company: string | null } | null;
}

const LEAD_SEGMENT_LABEL: Record<string, string> = {
  OPERATOR: "현장 운영사",
  PARTNER: "협력사",
  FIELD_LEADER: "현장 리더",
  EDUCATION: "교육기관",
  CLIENT: "원청",
};
const LEAD_INTEREST_BM_LABEL: Record<string, string> = {
  URGENT_JOB_POSTING: "급구 공고 과금",
  CANDIDATE_VIEW: "후보 열람 과금",
  TEAM_MATCHING: "팀 매칭 수수료",
  ATTENDANCE_REPORT: "출근·정산 리포트",
  AI_GUIDE: "AI 현장 가이드",
};
const LEAD_STAGE_LABEL: Record<string, string> = {
  COLD_EMAIL_SENT: "콜드메일 발송",
  REPLIED: "회신",
  INTERVIEW_SCHEDULED: "인터뷰 예정",
  INTERVIEW_DONE: "인터뷰 완료",
  POC_INTEREST: "PoC 관심",
};
const PAYMENT_INTENT_LABEL: Record<string, string> = {
  NONE: "없음",
  CONSIDERING: "검토 가능",
  BUDGETED: "예산 있음",
  POC_READY: "PoC 가능",
};
const SURVEY_ROLE_LABEL: Record<string, string> = {
  worker: "기술자",
  leader: "현장 리더",
  operator: "현장 운영사",
  partner: "협력사",
  enterprise: "원청·대기업",
  government: "정부·지자체",
  education: "교육기관",
};

const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, boxSizing: "border-box" };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 };

// ── 리드 관리 ──
export function LeadsView() {
  const [leads, setLeads] = useState<AdminLead[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", company: "", segment: "OPERATOR", contact: "", industry: "", region: "",
    interestBMs: [] as string[], followUp: "",
  });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/leads", { cache: "no-store" });
      setLeads((await res.json()) as AdminLead[]);
    } catch {
      setLeads([]);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const toggleInterest = (v: string) =>
    setForm((p) => ({ ...p, interestBMs: p.interestBMs.includes(v) ? p.interestBMs.filter((x) => x !== v) : [...p.interestBMs, v] }));

  const submit = async () => {
    if (!form.name.trim() || !form.contact.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ name: "", company: "", segment: "OPERATOR", contact: "", industry: "", region: "", interestBMs: [], followUp: "" });
        setShowForm(false);
        void load();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const patchLead = async (id: string, data: Record<string, string>) => {
    setLeads((p) => (p ? p.map((l) => (l.id === id ? { ...l, ...data } : l)) : p));
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => void load());
  };

  const addInterview = async (leadId: string) => {
    await fetch("/api/admin/interviews", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ leadId }),
    });
    void load();
  };

  return (
    <>
      <div className={styles.panel} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: showForm ? 20 : 0 }}>
          <div className={styles.sectionTitle} style={{ marginBottom: 0 }}>🎯 BM 검증 리드 등록</div>
          <button
            className={styles.filterChip}
            style={{ padding: "6px 16px", fontWeight: 700, background: showForm ? "#f1f5f9" : "#2563eb", color: showForm ? "#64748b" : "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "✕ 닫기" : "+ 리드 추가"}
          </button>
        </div>
        {showForm && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>이름 *</label>
              <input style={inputStyle} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="예: 김철수 부장" />
            </div>
            <div>
              <label style={labelStyle}>회사</label>
              <input style={inputStyle} value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} placeholder="예: (주)현장건설" />
            </div>
            <div>
              <label style={labelStyle}>고객군 *</label>
              <select style={inputStyle} value={form.segment} onChange={(e) => setForm((p) => ({ ...p, segment: e.target.value }))}>
                {Object.entries(LEAD_SEGMENT_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>연락처 *</label>
              <input style={inputStyle} value={form.contact} onChange={(e) => setForm((p) => ({ ...p, contact: e.target.value }))} placeholder="전화 또는 이메일" />
            </div>
            <div>
              <label style={labelStyle}>산업군</label>
              <input style={inputStyle} value={form.industry} onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>지역</label>
              <input style={inputStyle} value={form.region} onChange={(e) => setForm((p) => ({ ...p, region: e.target.value }))} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>관심 BM</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {Object.entries(LEAD_INTEREST_BM_LABEL).map(([k, v]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => toggleInterest(k)}
                    style={{
                      padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: "pointer",
                      border: form.interestBMs.includes(k) ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
                      background: form.interestBMs.includes(k) ? "#eff6ff" : "#f8fafc",
                      color: form.interestBMs.includes(k) ? "#2563eb" : "#64748b",
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>후속 액션 메모</label>
              <input style={inputStyle} value={form.followUp} onChange={(e) => setForm((p) => ({ ...p, followUp: e.target.value }))} placeholder="예: 데모 공유 예정" />
            </div>
            <div style={{ gridColumn: "1 / -1", textAlign: "right" }}>
              <button
                onClick={submit}
                disabled={submitting}
                style={{ padding: "10px 28px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? "등록 중…" : "✅ 리드 등록"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.panel}>
        <div className={styles.sectionTitle}>리드 목록 ({leads ? leads.length : "…"}건)</div>
        {!leads ? (
          <div className={styles.empty}>불러오는 중…</div>
        ) : leads.length === 0 ? (
          <div className={styles.empty}>등록된 리드가 없습니다.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>회사</th>
                  <th>고객군</th>
                  <th>연락처</th>
                  <th>관심 BM</th>
                  <th>단계</th>
                  <th>지불 의향</th>
                  <th>인터뷰</th>
                  <th>후속 액션</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 700 }}>{l.name}</td>
                    <td>{l.company ?? "—"}</td>
                    <td>{LEAD_SEGMENT_LABEL[l.segment] ?? l.segment}</td>
                    <td className={styles.mono}>{l.contact}</td>
                    <td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {l.interestBMs.map((b) => (
                          <span key={b} style={{ padding: "2px 6px", background: "#eff6ff", color: "#2563eb", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                            {LEAD_INTEREST_BM_LABEL[b] ?? b}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <select value={l.stage} onChange={(e) => patchLead(l.id, { stage: e.target.value })} style={{ fontSize: 12, padding: "4px 6px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
                        {Object.entries(LEAD_STAGE_LABEL).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select value={l.paymentIntent} onChange={(e) => patchLead(l.id, { paymentIntent: e.target.value })} style={{ fontSize: 12, padding: "4px 6px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
                        {Object.entries(PAYMENT_INTENT_LABEL).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </td>
                    <td className={styles.countCell}>
                      {l.interviews.length}건
                      <button onClick={() => addInterview(l.id)} style={{ marginLeft: 6, fontSize: 11, padding: "2px 8px", border: "1px solid #cbd5e1", borderRadius: 6, background: "#fff", cursor: "pointer" }}>
                        + 인터뷰
                      </button>
                    </td>
                    <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.followUp ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// ── 인터뷰 관리 (리드에 종속된 인터뷰를 평면화해서 표시) ──
export function InterviewsView() {
  const [leads, setLeads] = useState<AdminLead[] | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/leads", { cache: "no-store" });
      setLeads((await res.json()) as AdminLead[]);
    } catch {
      setLeads([]);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const complete = async (interviewId: string) => {
    await fetch(`/api/admin/interviews/${interviewId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ completedAt: new Date().toISOString() }),
    });
    void load();
  };

  const setNote = async (interviewId: string, notes: string) => {
    await fetch(`/api/admin/interviews/${interviewId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ notes }),
    });
  };

  if (!leads) return <div className={styles.loading}>불러오는 중…</div>;
  const rows = leads.flatMap((l) => l.interviews.map((iv) => ({ ...iv, leadName: l.name, leadCompany: l.company })));

  if (rows.length === 0) return <div className={styles.empty}>등록된 인터뷰가 없습니다. 리드 관리 탭에서 "+ 인터뷰"로 추가하세요.</div>;

  return (
    <div className={styles.panel}>
      <div className={styles.sectionTitle}>인터뷰 {rows.length}건</div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>리드</th>
              <th>상태</th>
              <th>메모</th>
              <th>후속 액션</th>
              <th>등록일</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((iv) => (
              <tr key={iv.id}>
                <td style={{ fontWeight: 700 }}>{iv.leadName}{iv.leadCompany ? ` · ${iv.leadCompany}` : ""}</td>
                <td>{iv.completedAt ? "완료" : "예정"}</td>
                <td>
                  <input
                    defaultValue={iv.notes ?? ""}
                    placeholder="메모 입력 후 엔터"
                    onBlur={(e) => void setNote(iv.id, e.target.value)}
                    style={{ ...inputStyle, fontSize: 12, padding: "4px 8px" }}
                  />
                </td>
                <td>{iv.followUpAction ?? "—"}</td>
                <td className={styles.mono}>{new Date(iv.createdAt).toLocaleDateString("ko-KR")}</td>
                <td>
                  {!iv.completedAt && (
                    <button onClick={() => complete(iv.id)} style={{ fontSize: 11, padding: "4px 10px", border: "1px solid #16a34a", color: "#16a34a", borderRadius: 6, background: "#fff", cursor: "pointer" }}>
                      완료 처리
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── 설문 응답 관리 ──
export function SurveyResponsesView() {
  const [rows, setRows] = useState<AdminSurveyResponse[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ role: "worker", summary: "" });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/survey-responses", { cache: "no-store" });
      setRows((await res.json()) as AdminSurveyResponse[]);
    } catch {
      setRows([]);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const submit = async () => {
    if (!form.summary.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/survey-responses", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role: form.role, answers: [{ topic: "응답 요약", question: "", answer: form.summary }] }),
      });
      if (res.ok) {
        setForm({ role: "worker", summary: "" });
        setShowForm(false);
        void load();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.panel} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: showForm ? 20 : 0 }}>
          <div className={styles.sectionTitle} style={{ marginBottom: 0 }}>📝 설문 응답 등록 (외부 설문 결과 옮겨 적기)</div>
          <button
            className={styles.filterChip}
            style={{ padding: "6px 16px", fontWeight: 700, background: showForm ? "#f1f5f9" : "#2563eb", color: showForm ? "#64748b" : "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "✕ 닫기" : "+ 응답 추가"}
          </button>
        </div>
        {showForm && (
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={labelStyle}>이해관계자 유형</label>
              <select style={inputStyle} value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
                {Object.entries(SURVEY_ROLE_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>응답 요약 *</label>
              <textarea
                value={form.summary}
                onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
                placeholder="설문 응답 핵심 내용을 정리해 입력하세요"
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
            <div style={{ textAlign: "right" }}>
              <button
                onClick={submit}
                disabled={submitting}
                style={{ padding: "10px 28px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? "등록 중…" : "✅ 응답 등록"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.panel}>
        <div className={styles.sectionTitle}>설문 응답 ({rows ? rows.length : "…"}건)</div>
        {!rows ? (
          <div className={styles.empty}>불러오는 중…</div>
        ) : rows.length === 0 ? (
          <div className={styles.empty}>등록된 설문 응답이 없습니다.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>유형</th>
                  <th>연결 리드</th>
                  <th>응답 요약</th>
                  <th>등록일</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 700 }}>{SURVEY_ROLE_LABEL[r.role] ?? r.role}</td>
                    <td>{r.lead ? `${r.lead.name}${r.lead.company ? ` · ${r.lead.company}` : ""}` : "—"}</td>
                    <td style={{ maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.answers.map((a) => a.answer).join(" / ")}
                    </td>
                    <td className={styles.mono}>{new Date(r.createdAt).toLocaleDateString("ko-KR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// ── PoC 관심 관리 (Lead stage = POC_INTEREST 필터 뷰) ──
export function PocInterestView() {
  const [leads, setLeads] = useState<AdminLead[] | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/leads?stage=POC_INTEREST", { cache: "no-store" });
      setLeads((await res.json()) as AdminLead[]);
    } catch {
      setLeads([]);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  if (!leads) return <div className={styles.loading}>불러오는 중…</div>;

  return (
    <div className={styles.panel}>
      <div className={styles.sectionTitle}>PoC 관심 리드 {leads.length}건</div>
      {leads.length === 0 ? (
        <div className={styles.empty}>아직 PoC 관심 단계인 리드가 없습니다. 리드 관리 탭에서 단계를 "PoC 관심"으로 바꾸면 여기에 표시됩니다.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>이름</th>
                <th>회사</th>
                <th>고객군</th>
                <th>연락처</th>
                <th>지불 의향</th>
                <th>관심 BM</th>
                <th>후속 액션</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 700 }}>{l.name}</td>
                  <td>{l.company ?? "—"}</td>
                  <td>{LEAD_SEGMENT_LABEL[l.segment] ?? l.segment}</td>
                  <td className={styles.mono}>{l.contact}</td>
                  <td>{PAYMENT_INTENT_LABEL[l.paymentIntent] ?? l.paymentIntent}</td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {l.interestBMs.map((b) => (
                        <span key={b} style={{ padding: "2px 6px", background: "#ecfdf5", color: "#059669", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                          {LEAD_INTEREST_BM_LABEL[b] ?? b}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.followUp ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
