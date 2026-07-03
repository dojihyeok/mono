import { useEffect, useState } from "react";
import { Settlement } from "@/lib/types";
import { apiListSettlements, apiCreateSettlement } from "@/lib/apiClient";
import { track } from "@/lib/analytics";

const bg = "var(--bg,#f5f6fb)";
const card = { background: "#fff", borderRadius: 16, padding: 18, border: "1px solid #e6e8ec", marginBottom: 12 };
const primaryBtn = { background: "var(--c1,#4f46e5)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 14px", fontWeight: 800, fontSize: 13, cursor: "pointer", width: "100%" };
const inputStyle = { width: "100%", padding: "10px 12px", border: "1px solid #e6e8ec", borderRadius: 8, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" as const };

const KIND_LABEL: Record<string, string> = {
  BASIC_PAY: "기본급",
  OVERTIME_PAY: "연장수당",
  ALLOWANCE: "기타수당",
  DEDUCTION: "공제(가불 등)",
  MEAL: "식대",
  LODGING: "숙소비",
  TRANSPORT: "교통비",
};

export default function SettlementManager({ companyId }: { companyId: string }) {
  const [list, setList] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create mode state
  const [isCreating, setIsCreating] = useState(false);
  const [workerId, setWorkerId] = useState("");
  const [period, setPeriod] = useState("");
  const [items, setItems] = useState<Array<{ kind: string; amount: number; note: string }>>([]);
  
  const [newKind, setNewKind] = useState<string>("");
  const [newAmount, setNewAmount] = useState("");
  const [newNote, setNewNote] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      setList(await apiListSettlements({ companyId }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [companyId]);

  const addItem = () => {
    if (!newKind || !newAmount) return;
    setItems((prev) => [...prev, { kind: newKind as string, amount: Number(newAmount), note: newNote }]);
    setNewKind("");
    setNewAmount("");
    setNewNote("");
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const submit = async () => {
    if (!workerId.trim() || !period.trim() || items.length === 0) return;
    await apiCreateSettlement({
      workerId,
      companyId,
      period,
      items,
    });
    track("settlement_created", { workerId, period });
    setIsCreating(false);
    setWorkerId("");
    setPeriod("");
    setItems([]);
    void load();
  };

  if (isCreating) {
    return (
      <div style={{ ...card, position: "relative" }}>
        <button onClick={() => setIsCreating(false)} style={{ position: "absolute", top: 18, right: 18, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--app-text-tertiary,#8694a8)" }}>&times;</button>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800 }}>새 정산명세서 발행</h3>
        
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>기술자(User ID)</label>
          <input style={inputStyle} value={workerId} onChange={(e) => setWorkerId(e.target.value)} placeholder="User ID 입력" />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>정산 기간 (예: 2026-06)</label>
          <input style={inputStyle} value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="YYYY-MM" />
        </div>

        <div style={{ marginBottom: 16, borderTop: "1px solid #e6e8ec", paddingTop: 12 }}>
          <h4 style={{ margin: "0 0 8px", fontSize: 14 }}>정산 항목 추가</h4>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <select style={{ ...inputStyle, flex: 1 }} value={newKind} onChange={(e) => setNewKind(e.target.value as string)}>
              <option value="">유형 선택</option>
              {Object.entries(KIND_LABEL).map(([k, label]) => (
                <option key={k} value={k}>{label}</option>
              ))}
            </select>
            <input type="number" style={{ ...inputStyle, flex: 1 }} value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="금액(원)" />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...inputStyle, flex: 2 }} value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="비고(선택)" />
            <button style={{ ...primaryBtn, flex: 1, padding: "0" }} onClick={addItem} disabled={!newKind || !newAmount}>추가</button>
          </div>
        </div>

        {items.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            {items.map((it, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #e6e8ec", fontSize: 13 }}>
                <div>
                  <span style={{ fontWeight: 700, marginRight: 8 }}>{KIND_LABEL[it.kind]}</span>
                  <span>{it.amount.toLocaleString()}원</span>
                  {it.note && <span style={{ color: "#8694a8", marginLeft: 8 }}>({it.note})</span>}
                </div>
                <button onClick={() => removeItem(idx)} style={{ background: "none", border: "none", color: "red", cursor: "pointer", fontSize: 12 }}>삭제</button>
              </div>
            ))}
            <div style={{ marginTop: 8, textAlign: "right", fontWeight: 800 }}>
              총합: {items.reduce((acc, it) => acc + (it.kind === "DEDUCTION" ? -Math.abs(it.amount) : it.amount), 0).toLocaleString()}원
            </div>
          </div>
        )}

        <button style={primaryBtn} onClick={submit} disabled={!workerId || !period || items.length === 0}>발행하기</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 4px" }}>
      <button style={{ ...primaryBtn, marginBottom: 16 }} onClick={() => setIsCreating(true)}>+ 새 정산명세서 발행</button>

      {loading ? (
        <div style={{ textAlign: "center", padding: 20, color: "#8694a8" }}>불러오는 중...</div>
      ) : list.length === 0 ? (
        <div style={{ textAlign: "center", padding: 20, color: "#8694a8" }}>등록된 정산 내역이 없습니다.</div>
      ) : (
        list.map((s) => {
          const total = (s.items || []).reduce((acc: number, it: any) => acc + (it.kind === "DEDUCTION" ? -Math.abs(it.amount) : it.amount), 0);
          return (
            <div key={s.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: 800, fontSize: 14 }}>{s.period} 정산</span>
                <span style={{ fontSize: 12, fontWeight: 800, padding: "2px 8px", borderRadius: 10, background: s.status === "DISPUTED" ? "#ffe5e5" : "#ecedfb", color: s.status === "DISPUTED" ? "#d90000" : "#4f46e5" }}>
                  {s.status}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#5b6b82", marginBottom: 12 }}>대상 기술자: {s.workerId}</div>
              
              <div style={{ background: bg, padding: 10, borderRadius: 8 }}>
                {(s.items || []).map((it: any) => (
                  <div key={it.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span>{KIND_LABEL[it.kind] || it.kind} {it.note && <span style={{ color: "#8694a8" }}>({it.note})</span>}</span>
                    <span style={{ fontWeight: 700 }}>{it.amount.toLocaleString()}원</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 800, borderTop: "1px solid #e6e8ec", paddingTop: 8, marginTop: 8 }}>
                  <span>총 정산액</span>
                  <span style={{ color: "var(--c1,#4f46e5)" }}>{total.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
