"use client";

// 관리자 운영·컴플라이언스 콘솔(v1.0) — Compliance/FeatureFlags/FieldPassOps/AuditLogs/Alerts.
// AttendanceAdminView.tsx 패턴 복제: 자체 fetch, AdminClient 공용 상태에 얹지 않음.
import { useCallback, useEffect, useState } from "react";
import styles from "./admin.module.css";

const inputStyle: React.CSSProperties = { padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, boxSizing: "border-box" };

function badgeStyle(color: string, bg: string, border: string): React.CSSProperties {
  return { fontSize: 10.5, fontWeight: 900, color, background: bg, border: `1px solid ${border}`, padding: "3px 9px", borderRadius: 6, whiteSpace: "nowrap", display: "inline-block" };
}

const COMPLIANCE_BADGE: Record<string, React.CSSProperties> = {
  READY: badgeStyle("#166534", "#f0fdf4", "#bbf7d0"),
  REPORT_REQUIRED: badgeStyle("#b45309", "#fffbeb", "#fde68a"),
  LICENSE_GATE: badgeStyle("#b91c1c", "#fef2f2", "#fecaca"),
  PARTNER_REQUIRED: badgeStyle("#7c3aed", "#f5f3ff", "#ddd6fe"),
  LEGAL_REVIEW: badgeStyle("#9333ea", "#faf5ff", "#e9d5ff"),
  BLOCKED: badgeStyle("#f8fafc", "#0f172a", "#0f172a"),
};

const COMPLIANCE_STATUSES = ["READY", "REPORT_REQUIRED", "LICENSE_GATE", "PARTNER_REQUIRED", "LEGAL_REVIEW", "BLOCKED"];

interface ComplianceItem {
  id: string;
  name: string;
  status: string;
  authority: string | null;
  appliedAt: string | null;
  completedAt: string | null;
  registrationNo: string | null;
  renewalAt: string | null;
  owner: string | null;
  legalOpinion: string | null;
}

export function ComplianceView() {
  const [rows, setRows] = useState<ComplianceItem[] | null>(null);

  const load = useCallback(async () => {
    setRows(null);
    try {
      const res = await fetch("/api/amono/compliance-items", { cache: "no-store" });
      setRows((await res.json()) as ComplianceItem[]);
    } catch {
      setRows([]);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/amono/compliance-items/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    void load();
  };

  return (
    <div className={styles.panel}>
      <div className={styles.sectionTitle}>Compliance — 규제·라이선스 현황</div>
      {rows === null ? (
        <div className={styles.loading}>불러오는 중…</div>
      ) : rows.length === 0 ? (
        <div className={styles.empty}>등록된 컴플라이언스 항목이 없습니다.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>항목</th>
                <th>상태</th>
                <th>관할기관</th>
                <th>등록번호</th>
                <th>갱신일</th>
                <th>담당자</th>
                <th>법률 의견</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700 }}>{r.name}</td>
                  <td>
                    <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} style={{ ...inputStyle, fontWeight: 800 }}>
                      {COMPLIANCE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>{r.authority ?? "-"}</td>
                  <td className={styles.mono}>{r.registrationNo ?? "-"}</td>
                  <td className={styles.mono}>{r.renewalAt ? r.renewalAt.slice(0, 10) : "-"}</td>
                  <td>{r.owner ?? "-"}</td>
                  <td style={{ maxWidth: 240, fontSize: 12, color: "#64748b" }}>{r.legalOpinion ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface FeatureFlag {
  id: string;
  key: string;
  enabled: boolean;
  updatedBy: string | null;
  updatedAt: string;
}

export function FeatureFlagsView() {
  const [rows, setRows] = useState<FeatureFlag[] | null>(null);

  const load = useCallback(async () => {
    setRows(null);
    try {
      const res = await fetch("/api/amono/feature-flags", { cache: "no-store" });
      setRows((await res.json()) as FeatureFlag[]);
    } catch {
      setRows([]);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const toggle = async (key: string, enabled: boolean) => {
    await fetch(`/api/amono/feature-flags/${key}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ enabled, updatedBy: "amono-console" }),
    });
    void load();
  };

  return (
    <div className={styles.panel}>
      <div className={styles.sectionTitle}>Feature Flags — 규제 게이트 기능 플래그</div>
      {rows === null ? (
        <div className={styles.loading}>불러오는 중…</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>플래그</th>
                <th>상태</th>
                <th>최근 변경자</th>
                <th>변경일</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((f) => (
                <tr key={f.id}>
                  <td className={styles.mono} style={{ fontWeight: 700 }}>{f.key}</td>
                  <td>
                    <button
                      onClick={() => toggle(f.key, !f.enabled)}
                      style={{ ...badgeStyle(f.enabled ? "#166534" : "#94a3b8", f.enabled ? "#f0fdf4" : "#f8fafc", f.enabled ? "#bbf7d0" : "#e2e8f0"), cursor: "pointer", border: "none" }}
                    >
                      {f.enabled ? "ON" : "OFF"}
                    </button>
                  </td>
                  <td>{f.updatedBy ?? "-"}</td>
                  <td className={styles.mono}>{new Date(f.updatedAt).toLocaleString("ko-KR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface FieldPassSite {
  id: string;
  name: string;
  status: string;
}
interface FieldPassEvent {
  id: string;
  siteId: string;
  gateName: string | null;
  authMethod: string;
  result: string;
  reason: string | null;
  occurredAt: string;
}

const EVENT_RESULT_BADGE: Record<string, React.CSSProperties> = {
  SUCCESS: badgeStyle("#166534", "#f0fdf4", "#bbf7d0"),
  FAILED: badgeStyle("#b45309", "#fffbeb", "#fde68a"),
  BLOCKED: badgeStyle("#b91c1c", "#fef2f2", "#fecaca"),
};

export function FieldPassOpsView() {
  const [sites, setSites] = useState<FieldPassSite[] | null>(null);
  const [events, setEvents] = useState<FieldPassEvent[] | null>(null);
  const [siteFilter, setSiteFilter] = useState("");

  const loadSites = useCallback(async () => {
    try {
      const res = await fetch("/api/amono/field-pass-sites", { cache: "no-store" });
      setSites((await res.json()) as FieldPassSite[]);
    } catch {
      setSites([]);
    }
  }, []);
  const loadEvents = useCallback(async (siteId: string) => {
    setEvents(null);
    try {
      const qs = siteId ? `?siteId=${siteId}` : "";
      const res = await fetch(`/api/amono/field-pass-events${qs}`, { cache: "no-store" });
      setEvents((await res.json()) as FieldPassEvent[]);
    } catch {
      setEvents([]);
    }
  }, []);
  useEffect(() => { void loadSites(); }, [loadSites]);
  useEffect(() => { void loadEvents(siteFilter); }, [siteFilter, loadEvents]);

  return (
    <div className={styles.panel}>
      <div className={styles.sectionTitle} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span>Field Pass Operations — 현장·인증 이벤트</span>
        <select value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)} style={inputStyle}>
          <option value="">전체 현장</option>
          {(sites ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {(sites ?? []).map((s) => (
          <span key={s.id} style={badgeStyle("#4f46e5", "rgba(79,70,229,0.08)", "rgba(79,70,229,0.2)")}>{s.name} · {s.status}</span>
        ))}
      </div>
      {events === null ? (
        <div className={styles.loading}>불러오는 중…</div>
      ) : events.length === 0 ? (
        <div className={styles.empty}>인증 이벤트 기록이 없습니다.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>발생 시각</th>
                <th>출입구</th>
                <th>인증 방식</th>
                <th>결과</th>
                <th>사유</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td className={styles.mono}>{new Date(e.occurredAt).toLocaleString("ko-KR")}</td>
                  <td>{e.gateName ?? "-"}</td>
                  <td>{e.authMethod}</td>
                  <td><span style={EVENT_RESULT_BADGE[e.result] ?? EVENT_RESULT_BADGE.SUCCESS}>{e.result}</span></td>
                  <td>{e.reason ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string | null;
  detail: string | null;
  createdAt: string;
}

export function AuditLogsView() {
  const [rows, setRows] = useState<AuditLog[] | null>(null);
  const [actionFilter, setActionFilter] = useState("");

  const load = useCallback(async (action: string) => {
    setRows(null);
    try {
      const qs = action ? `?action=${encodeURIComponent(action)}` : "";
      const res = await fetch(`/api/amono/audit-logs${qs}`, { cache: "no-store" });
      setRows((await res.json()) as AuditLog[]);
    } catch {
      setRows([]);
    }
  }, []);
  useEffect(() => { void load(actionFilter); }, [actionFilter, load]);

  return (
    <div className={styles.panel}>
      <div className={styles.sectionTitle} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span>Audit Logs — 관리자 활동 감사로그</span>
        <input placeholder="액션 필터 (예: 기능 플래그 변경)" value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} style={{ ...inputStyle, width: 220 }} />
      </div>
      {rows === null ? (
        <div className={styles.loading}>불러오는 중…</div>
      ) : rows.length === 0 ? (
        <div className={styles.empty}>감사로그가 없습니다.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>시각</th>
                <th>행위자</th>
                <th>액션</th>
                <th>대상</th>
                <th>상세</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className={styles.mono}>{new Date(r.createdAt).toLocaleString("ko-KR")}</td>
                  <td>{r.actor}</td>
                  <td style={{ fontWeight: 700 }}>{r.action}</td>
                  <td className={styles.mono}>{r.target ?? "-"}</td>
                  <td style={{ fontSize: 12, color: "#64748b" }}>{r.detail ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface OperationsAlert {
  id: string;
  type: string;
  message: string;
  dueDate: string | null;
  status: string;
}

const ALERT_STATUS_BADGE: Record<string, React.CSSProperties> = {
  OPEN: badgeStyle("#b91c1c", "#fef2f2", "#fecaca"),
  ACKNOWLEDGED: badgeStyle("#b45309", "#fffbeb", "#fde68a"),
  RESOLVED: badgeStyle("#166534", "#f0fdf4", "#bbf7d0"),
};

export function AlertsView() {
  const [rows, setRows] = useState<OperationsAlert[] | null>(null);

  const load = useCallback(async () => {
    setRows(null);
    try {
      const res = await fetch("/api/amono/alerts", { cache: "no-store" });
      setRows((await res.json()) as OperationsAlert[]);
    } catch {
      setRows([]);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const setStatus = async (id: string, status: string) => {
    await fetch(`/api/amono/alerts/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    void load();
  };

  return (
    <div className={styles.panel}>
      <div className={styles.sectionTitle}>Alerts — 만료·이상 알림</div>
      {rows === null ? (
        <div className={styles.loading}>불러오는 중…</div>
      ) : rows.length === 0 ? (
        <div className={styles.empty}>등록된 알림이 없습니다.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>유형</th>
                <th>메시지</th>
                <th>마감일</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 700 }}>{a.type}</td>
                  <td>{a.message}</td>
                  <td className={styles.mono}>{a.dueDate ? a.dueDate.slice(0, 10) : "-"}</td>
                  <td>
                    <select value={a.status} onChange={(e) => setStatus(a.id, e.target.value)} style={{ ...inputStyle, fontWeight: 800 }}>
                      {Object.keys(ALERT_STATUS_BADGE).map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
