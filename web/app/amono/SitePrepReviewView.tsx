"use client";

// 현장 준비 서류 검토(Field Pass P0) — 자가신고 제출 목록 조회 + 승인/반려.
// 자체 fetch(LeadCrmView 패턴 복제) — AdminClient 공용 상태에 얹지 않음.
import { useCallback, useEffect, useState } from "react";
import styles from "./admin.module.css";

interface AdminSitePrepItem {
  id: string;
  kind: string;
  status: string;
  memo: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  user: { id: string; name: string | null; phone: string | null } | null;
}

const SITE_PREP_KIND_LABEL: Record<string, string> = {
  ID_CARD: "신분증",
  SAFETY_EDU: "기초안전보건교육 이수증",
  ELEC_CARD: "건설근로자 전자카드",
  BANK_ACC: "급여 받을 계좌",
  MED_CHECK: "배치전 건강검진",
  GATE_CARD: "현장 출입카드",
  SAFETY_GEAR: "개인 안전장비",
};

const inputStyle: React.CSSProperties = { width: "100%", padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 12, boxSizing: "border-box" };

export function SitePrepReviewView() {
  const [items, setItems] = useState<AdminSitePrepItem[] | null>(null);
  const [memos, setMemos] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"SUBMITTED" | "ALL">("SUBMITTED");

  const load = useCallback(async () => {
    setItems(null);
    const qs = filter === "SUBMITTED" ? "?status=SUBMITTED" : "";
    try {
      const res = await fetch(`/api/admin/site-prep${qs}`, { cache: "no-store" });
      setItems((await res.json()) as AdminSitePrepItem[]);
    } catch {
      setItems([]);
    }
  }, [filter]);
  useEffect(() => { void load(); }, [load]);

  const review = async (id: string, status: "VERIFIED" | "REJECTED") => {
    await fetch(`/api/admin/site-prep/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status, memo: status === "REJECTED" ? (memos[id] ?? "") : undefined }),
    });
    void load();
  };

  return (
    <div className={styles.panel}>
      <div className={styles.sectionTitle} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>현장 준비 서류 검토</span>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => setFilter("SUBMITTED")}
            style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, cursor: "pointer", border: filter === "SUBMITTED" ? "1px solid #504968" : "1px solid #e2e8f0", background: filter === "SUBMITTED" ? "#504968" : "#fff", color: filter === "SUBMITTED" ? "#fff" : "#475569" }}
          >
            검토 대기
          </button>
          <button
            onClick={() => setFilter("ALL")}
            style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, cursor: "pointer", border: filter === "ALL" ? "1px solid #504968" : "1px solid #e2e8f0", background: filter === "ALL" ? "#504968" : "#fff", color: filter === "ALL" ? "#fff" : "#475569" }}
          >
            전체
          </button>
        </div>
      </div>

      {items === null ? (
        <div className={styles.loading}>불러오는 중…</div>
      ) : items.length === 0 ? (
        <div className={styles.empty}>{filter === "SUBMITTED" ? "검토 대기중인 서류가 없습니다." : "제출된 서류가 없습니다."}</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>기술자</th>
                <th>항목</th>
                <th>상태</th>
                <th>반려 사유</th>
                <th>제출일</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td style={{ fontWeight: 700 }}>{it.user?.name ?? "-"}{it.user?.phone ? ` · ${it.user.phone}` : ""}</td>
                  <td>{SITE_PREP_KIND_LABEL[it.kind] ?? it.kind}</td>
                  <td>{it.status === "VERIFIED" ? "✅ 승인" : it.status === "REJECTED" ? "⚠️ 반려" : "⏳ 검토중"}</td>
                  <td>
                    {it.status === "SUBMITTED" ? (
                      <input
                        placeholder="반려 시 사유 입력"
                        value={memos[it.id] ?? ""}
                        onChange={(e) => setMemos((p) => ({ ...p, [it.id]: e.target.value }))}
                        style={inputStyle}
                      />
                    ) : (
                      it.memo ?? "-"
                    )}
                  </td>
                  <td className={styles.mono}>{new Date(it.createdAt).toLocaleDateString("ko-KR")}</td>
                  <td>
                    {it.status === "SUBMITTED" && (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => review(it.id, "VERIFIED")} style={{ fontSize: 11, padding: "4px 10px", border: "1px solid #16a34a", color: "#16a34a", borderRadius: 6, background: "#fff", cursor: "pointer" }}>
                          승인
                        </button>
                        <button onClick={() => review(it.id, "REJECTED")} style={{ fontSize: 11, padding: "4px 10px", border: "1px solid #dc2626", color: "#dc2626", borderRadius: 6, background: "#fff", cursor: "pointer" }}>
                          반려
                        </button>
                      </div>
                    )}
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
