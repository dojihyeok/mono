// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AnalyticsDashboard() {
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
    <div className="min-h-screen bg-warm-50 p-6 font-sans text-ink-900">
      <h1 className="text-2xl font-black mb-6">사용자 행동 분석 대시보드</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-ink-900/10">
        {[
          { id: "overview", label: "1. 종합 KPI 뷰" },
          { id: "funnel", label: "2. 가입 퍼널 분석" },
          { id: "cohort", label: "3. 코호트 리텐션" },
          { id: "flow", label: "4. 유저 행동 흐름" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-3 font-semibold transition-colors ${
              activeTab === t.id
                ? "border-b-2 border-brand text-brand"
                : "text-ink-500 hover:text-ink-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <main>
        {loading && <p>데이터를 불러오는 중입니다...</p>}

        {/* OVERVIEW */}
        {!loading && activeTab === "overview" && data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded shadow border border-ink-900/5">
              <h3 className="text-sm font-medium text-ink-500 mb-2">일일 활성 사용자 (DAU)</h3>
              <p className="text-3xl font-bold">{data.dau?.toLocaleString() ?? 0}</p>
            </div>
            <div className="bg-white p-6 rounded shadow border border-ink-900/5">
              <h3 className="text-sm font-medium text-ink-500 mb-2">주간 활성 사용자 (WAU)</h3>
              <p className="text-3xl font-bold">{data.wau?.toLocaleString() ?? 0}</p>
            </div>
            <div className="bg-white p-6 rounded shadow border border-ink-900/5">
              <h3 className="text-sm font-medium text-ink-500 mb-2">월간 활성 사용자 (MAU)</h3>
              <p className="text-3xl font-bold">{data.mau?.toLocaleString() ?? 0}</p>
            </div>
            <div className="bg-white p-6 rounded shadow border border-ink-900/5">
              <h3 className="text-sm font-medium text-ink-500 mb-2">오늘 신규 가입 유저</h3>
              <p className="text-3xl font-bold">{data.todayNewUsers?.toLocaleString() ?? 0}</p>
            </div>
            <div className="bg-white p-6 rounded shadow border border-ink-900/5 col-span-full">
              <h3 className="text-sm font-medium text-ink-500 mb-2">Aha-Moment 달성률 (오늘)</h3>
              <p className="text-3xl font-bold text-brand">{data.ahaRate ?? "0.0"}%</p>
              <p className="text-xs text-ink-400 mt-1">당일 핵심기능 수행 유저 / 당일 신규 가입 유저</p>
            </div>
          </div>
        )}

        {/* FUNNEL */}
        {!loading && activeTab === "funnel" && data && (
          <div className="bg-white p-6 rounded shadow border border-ink-900/5">
            <h2 className="text-lg font-bold mb-4">가입 퍼널 단계별 현황</h2>
            <div className="h-80 w-full">
              {/* @ts-ignore: recharts React 18 type mismatch */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.steps} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" />
                  <YAxis dataKey="step" type="category" width={200} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* COHORT */}
        {!loading && activeTab === "cohort" && data && (
          <div className="bg-white p-6 rounded shadow border border-ink-900/5 overflow-x-auto">
            <h2 className="text-lg font-bold mb-4">가입일 기준 리텐션 (D0 ~ D7)</h2>
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-ink-900/10">
                  <th className="p-3 font-semibold text-ink-500">가입일 (Cohort)</th>
                  <th className="p-3 font-semibold text-ink-500">신규 가입자</th>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <th key={i} className="p-3 font-semibold text-ink-500 text-center">Day {i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data.cohorts || []).map((row: any) => (
                  <tr key={row.cohort} className="border-b border-ink-900/5">
                    <td className="p-3">{row.cohort}</td>
                    <td className="p-3 font-medium">{row.total}명</td>
                    {row.retention.map((pct: number, i: number) => {
                      const alpha = Math.min(pct / 100, 1);
                      return (
                        <td key={i} className="p-3 text-center">
                          <div
                            className="inline-block px-2 py-1 rounded"
                            style={{
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
          <div className="bg-white p-6 rounded shadow border border-ink-900/5">
            <h2 className="text-lg font-bold mb-4">개별 유저 행동 흐름 검색</h2>
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="user_id 또는 anonymous_id 입력..."
                className="border border-ink-900/20 rounded px-4 py-2 flex-1 outline-none focus:border-brand"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchFlow()}
              />
              <button
                onClick={searchFlow}
                className="bg-brand text-white px-6 py-2 rounded font-semibold hover:bg-indigo-700 transition"
              >
                조회
              </button>
            </div>

            {loading && <p>데이터 조회 중...</p>}

            {!loading && flowData?.events && (
              <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-ink-900/10 ml-2">
                {flowData.events.length === 0 ? (
                  <p className="text-ink-500 py-4 ml-6">해당 유저의 이벤트 기록이 없습니다.</p>
                ) : (
                  flowData.events.map((e: any, i: number) => {
                    const time = new Date(e.time).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    });
                    return (
                      <div key={i} className="relative flex gap-4 items-start ml-6">
                        <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-brand ring-4 ring-white" />
                        <div className="bg-warm-50 border border-ink-900/10 rounded-lg p-3 w-full">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono text-xs font-bold text-ink-500">[{time}]</span>
                            <span className="font-bold text-ink-900 text-sm">{e.name}</span>
                          </div>
                          {e.props && Object.keys(e.props).length > 0 && (
                            <pre className="text-xs text-ink-500 overflow-x-auto bg-white p-2 rounded mt-2 border border-ink-900/5">
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
