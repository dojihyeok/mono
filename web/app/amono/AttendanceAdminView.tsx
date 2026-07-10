"use client";

// 출근 관리(Field Pass P0) — Attendance 실데이터 조회(날짜 필터 + 기술자/현장명 검색).
// 자체 fetch(LeadCrmView/SitePrepReviewView 패턴 복제) — AdminClient 공용 상태에 얹지 않음.
import { useCallback, useEffect, useState } from "react";
import styles from "./admin.module.css";

interface AdminAttendance {
  id: string;
  workDate: string;
  checkInAt: string;
  checkOutAt: string | null;
  application: {
    user: { id: string; name: string | null; phone: string | null } | null;
    jobPost: { id: string; title: string; company: { name: string } | null } | null;
  };
}

function fmtClock(iso: string) {
  return new Date(iso).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
}
function workHours(checkInAt: string, checkOutAt: string | null) {
  if (!checkOutAt) return null;
  const hrs = (new Date(checkOutAt).getTime() - new Date(checkInAt).getTime()) / 3600000;
  return Math.round(hrs * 10) / 10;
}

const inputStyle: React.CSSProperties = { padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, boxSizing: "border-box" };

export function AttendanceAdminView() {
  const [rows, setRows] = useState<AdminAttendance[] | null>(null);
  const [date, setDate] = useState("");
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setRows(null);
    const qs = date ? `?date=${date}` : "";
    try {
      const res = await fetch(`/api/admin/attendances${qs}`, { cache: "no-store" });
      setRows((await res.json()) as AdminAttendance[]);
    } catch {
      setRows([]);
    }
  }, [date]);
  useEffect(() => { void load(); }, [load]);

  const filtered = (rows ?? []).filter((r) => {
    if (!q.trim()) return true;
    const needle = q.trim().toLowerCase();
    return (
      (r.application.user?.name ?? "").toLowerCase().includes(needle) ||
      (r.application.jobPost?.title ?? "").toLowerCase().includes(needle) ||
      (r.application.jobPost?.company?.name ?? "").toLowerCase().includes(needle)
    );
  });

  return (
    <div className={styles.panel}>
      <div className={styles.sectionTitle} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span>출근 관리</span>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
          <input placeholder="기술자·현장명 검색" value={q} onChange={(e) => setQ(e.target.value)} style={{ ...inputStyle, width: 180 }} />
        </div>
      </div>

      {rows === null ? (
        <div className={styles.loading}>불러오는 중…</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>{date ? "해당 날짜의 출근 기록이 없습니다." : "출근 기록이 없습니다."}</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>기술자</th>
                <th>현장</th>
                <th>근무일</th>
                <th>출근</th>
                <th>퇴근</th>
                <th>근무시간</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const hrs = workHours(r.checkInAt, r.checkOutAt);
                return (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 700 }}>{r.application.user?.name ?? "-"}{r.application.user?.phone ? ` · ${r.application.user.phone}` : ""}</td>
                    <td>{r.application.jobPost?.title ?? "-"}{r.application.jobPost?.company?.name ? ` · ${r.application.jobPost.company.name}` : ""}</td>
                    <td className={styles.mono}>{r.workDate}</td>
                    <td className={styles.mono}>{fmtClock(r.checkInAt)}</td>
                    <td className={styles.mono}>{r.checkOutAt ? fmtClock(r.checkOutAt) : "근무 중"}</td>
                    <td>{hrs != null ? `${hrs}시간` : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
