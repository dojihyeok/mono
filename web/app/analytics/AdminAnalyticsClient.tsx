// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function AdminAnalyticsClient() {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [userIdInput, setUserIdInput] = useState("");
  const [flowData, setFlowData] = useState<any>(null);

  useEffect(() => {
    if (activeTab === "flow") return;
    setLoading(true);
    fetch(`/api/admin/analytics?tab=${activeTab}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, [activeTab]);

  const searchFlow = () => {
    if (!userIdInput) return;
    setLoading(true);
    fetch(`/api/admin/analytics?tab=flow&userId=${userIdInput}`)
      .then((res) => res.json())
      .then((d) => {
        setFlowData(d);
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif", color: "#111827" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "24px", marginTop: 0 }}>사용자 행동 분석 대시보드</h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "32px", borderBottom: "1px solid rgba(17,24,39,0.1)" }}>
        {[
          { id: "overview", label: "1. 종합 KPI 뷰" },
          { id: "funnel", label: "2. 가입 퍼널 분석" },
          { id: "cohort", label: "3. 코호트 리텐션" },
          { id: "flow", label: "4. 유저 행동 흐름" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{ 
              padding: "0 0 12px 0", 
              fontWeight: 600, 
              borderBottom: activeTab === t.id ? "2px solid #504968" : "2px solid transparent", 
              color: activeTab === t.id ? "#504968" : "#6b7280", 
              background: "none", 
              borderTop: "none", 
              borderLeft: "none", 
              borderRight: "none", 
              cursor: "pointer",
              fontSize: "15px"
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <main>
        {loading && <p>데이터를 불러오는 중입니다...</p>}

        {/* OVERVIEW */}
        {!loading && activeTab === "overview" && data && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
            <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid rgba(17,24,39,0.05)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 500, color: "#6b7280", margin: "0 0 8px 0" }}>일일 활성 사용자 (DAU)</h3>
              <p style={{ fontSize: "30px", fontWeight: 700, margin: 0 }}>{data.dau?.toLocaleString() ?? 0}</p>
            </div>
            <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid rgba(17,24,39,0.05)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 500, color: "#6b7280", margin: "0 0 8px 0" }}>주간 활성 사용자 (WAU)</h3>
              <p style={{ fontSize: "30px", fontWeight: 700, margin: 0 }}>{data.wau?.toLocaleString() ?? 0}</p>
            </div>
            <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid rgba(17,24,39,0.05)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 500, color: "#6b7280", margin: "0 0 8px 0" }}>월간 활성 사용자 (MAU)</h3>
              <p style={{ fontSize: "30px", fontWeight: 700, margin: 0 }}>{data.mau?.toLocaleString() ?? 0}</p>
            </div>
            <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid rgba(17,24,39,0.05)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 500, color: "#6b7280", margin: "0 0 8px 0" }}>오늘 신규 가입 유저</h3>
              <p style={{ fontSize: "30px", fontWeight: 700, margin: 0 }}>{data.todayNewUsers?.toLocaleString() ?? 0}</p>
            </div>
            <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid rgba(17,24,39,0.05)", gridColumn: "1 / -1" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 500, color: "#6b7280", margin: "0 0 8px 0" }}>Aha-Moment 달성률 (오늘)</h3>
              <p style={{ fontSize: "30px", fontWeight: 700, color: "#504968", margin: 0 }}>{data.ahaRate ?? "0.0"}%</p>
              <p style={{ fontSize: "12px", color: "#9ca3af", margin: "4px 0 0 0" }}>당일 핵심기능 수행 유저 / 당일 신규 가입 유저</p>
            </div>
          </div>
        )}

        {/* FUNNEL */}
        {!loading && activeTab === "funnel" && data && (
          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid rgba(17,24,39,0.05)" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 16px 0" }}>가입 퍼널 단계별 현황</h2>
            <div style={{ height: "320px", width: "100%" }}>
              {/* @ts-ignore: recharts React 18 type mismatch */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.steps} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" />
                  <YAxis dataKey="step" type="category" width={200} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#504968" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* COHORT */}
        {!loading && activeTab === "cohort" && data && (
          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid rgba(17,24,39,0.05)", overflowX: "auto" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 16px 0" }}>가입일 기준 리텐션 (D0 ~ D7)</h2>
            <table style={{ width: "100%", textAlign: "left", fontSize: "14px", whiteSpace: "nowrap", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(17,24,39,0.1)" }}>
                  <th style={{ padding: "12px", fontWeight: 600, color: "#6b7280" }}>가입일 (Cohort)</th>
                  <th style={{ padding: "12px", fontWeight: 600, color: "#6b7280" }}>신규 가입자</th>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <th key={i} style={{ padding: "12px", fontWeight: 600, color: "#6b7280", textAlign: "center" }}>Day {i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data.cohorts || []).map((row: any) => (
                  <tr key={row.cohort} style={{ borderBottom: "1px solid rgba(17,24,39,0.05)" }}>
                    <td style={{ padding: "12px" }}>{row.cohort}</td>
                    <td style={{ padding: "12px", fontWeight: 500 }}>{row.total}명</td>
                    {row.retention.map((pct: number, i: number) => {
                      const alpha = Math.min(pct / 100, 1);
                      return (
                        <td key={i} style={{ padding: "12px", textAlign: "center" }}>
                          <div
                            style={{
                              display: "inline-block", padding: "4px 8px", borderRadius: "4px",
                              backgroundColor: `rgba(79, 70, 229, ${alpha})`,
                              color: alpha > 0.4 ? "#fff" : "#111827",
                            }}
                          >
                            {pct}%
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FLOW */}
        {activeTab === "flow" && (
          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid rgba(17,24,39,0.05)" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 16px 0" }}>개별 유저 행동 흐름 검색</h2>
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
              <input
                type="text"
                placeholder="user_id 또는 anonymous_id 입력..."
                style={{ border: "1px solid rgba(17,24,39,0.2)", borderRadius: "4px", padding: "8px 16px", flex: 1, outline: "none" }}
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchFlow()}
              />
              <button
                onClick={searchFlow}
                style={{ backgroundColor: "#504968", color: "#fff", padding: "8px 24px", borderRadius: "4px", fontWeight: 600, border: "none", cursor: "pointer" }}
              >
                조회
              </button>
              <button onClick={() => window.location.reload()} style={{ marginLeft: "10px", padding: "8px 16px", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>새로고침</button>
              <button onClick={async () => {
                const res = await fetch("/api/admin/insights/sync", { method: "POST" });
                if (res.ok) alert("맞춤형 AI 인사이트가 성공적으로 분석 및 업데이트 되었습니다!");
                else alert("인사이트 업데이트에 실패했습니다.");
              }} style={{ marginLeft: "10px", padding: "8px 16px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #8b8df8 0%, #504968 100%)", color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "700" }}>AI 분석 및 공지 업데이트</button>
            </div>

            {loading && <p>데이터 조회 중...</p>}

            {!loading && flowData?.events && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingLeft: "12px", borderLeft: "2px solid rgba(17,24,39,0.1)", marginLeft: "8px" }}>
                {flowData.events.length === 0 ? (
                  <p style={{ color: "#6b7280", padding: "16px 0", marginLeft: "24px", margin: 0 }}>해당 유저의 이벤트 기록이 없습니다.</p>
                ) : (
                  flowData.events.map((e: any, i: number) => {
                    const time = new Date(e.time).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    });
                    return (
                      <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start", position: "relative" }}>
                        <div style={{ position: "absolute", left: "-23px", top: "8px", width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#504968", border: "4px solid #fff" }} />
                        <div style={{ backgroundColor: "#f9fafb", border: "1px solid rgba(17,24,39,0.1)", borderRadius: "8px", padding: "12px", width: "100%" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                            <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 700, color: "#6b7280" }}>[{time}]</span>
                            <span style={{ fontWeight: 700, color: "#111827", fontSize: "14px" }}>{e.name}</span>
                          </div>
                          {e.props && Object.keys(e.props).length > 0 && (
                            <pre style={{ fontSize: "12px", color: "#6b7280", overflowX: "auto", backgroundColor: "#fff", padding: "8px", borderRadius: "4px", marginTop: "8px", border: "1px solid rgba(17,24,39,0.05)", margin: 0 }}>
                              {JSON.stringify(e.props, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
