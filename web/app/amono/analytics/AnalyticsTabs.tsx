"use client";

import { useState } from "react";
import { AnalysClient } from "./AnalysClient";
import { AdminAnalyticsClient } from "./AdminAnalyticsClient";

export function AnalyticsTabs() {
  const [mode, setMode] = useState<"dashboard" | "details">("dashboard");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex", flexDirection: "column", fontFamily: "sans-serif", color: "#111827" }}>
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid rgba(17, 24, 39, 0.1)", padding: "16px 24px", display: "flex", gap: "16px", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}>
        <button
          onClick={() => setMode("dashboard")}
          style={{ padding: "8px 16px", fontWeight: "bold", borderRadius: "9999px", transition: "background-color 0.2s", border: "none", cursor: "pointer", 
            ...(mode === "dashboard" ? { backgroundColor: "#504968", color: "#fff" } : { backgroundColor: "#f3f4f6", color: "#6b7280" }) 
          }}
        >
          📈 그래프 대시보드
        </button>
        <button
          onClick={() => setMode("details")}
          style={{ padding: "8px 16px", fontWeight: "bold", borderRadius: "9999px", transition: "background-color 0.2s", border: "none", cursor: "pointer",
            ...(mode === "details" ? { backgroundColor: "#504968", color: "#fff" } : { backgroundColor: "#f3f4f6", color: "#6b7280" }) 
          }}
        >
          📝 상세 지표 분석
        </button>
      </div>

      <div className="flex-1">
        {mode === "dashboard" ? <AdminAnalyticsClient /> : <AnalysClient />}
      </div>
    </div>
  );
}
