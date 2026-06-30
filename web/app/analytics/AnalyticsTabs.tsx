"use client";

import { useState } from "react";
import { AnalysClient } from "./AnalysClient";
import { AdminAnalyticsClient } from "./AdminAnalyticsClient";

export function AnalyticsTabs() {
  const [mode, setMode] = useState<"dashboard" | "details">("dashboard");

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col font-sans text-ink-900">
      <div className="bg-white border-b border-ink-900/10 px-6 py-4 flex gap-4 sticky top-0 z-50 shadow-sm">
        <button
          onClick={() => setMode("dashboard")}
          className={`px-4 py-2 font-bold rounded-full transition-colors ${
            mode === "dashboard"
              ? "bg-brand text-white"
              : "bg-warm-100 text-ink-500 hover:bg-warm-200"
          }`}
        >
          📈 그래프 대시보드
        </button>
        <button
          onClick={() => setMode("details")}
          className={`px-4 py-2 font-bold rounded-full transition-colors ${
            mode === "details"
              ? "bg-brand text-white"
              : "bg-warm-100 text-ink-500 hover:bg-warm-200"
          }`}
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
