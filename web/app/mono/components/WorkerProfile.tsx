"use client";

import React, { useState } from "react";

export default function WorkerProfile({ user, onUpdate }: { user: any; onUpdate: (data: any) => void }) {
  const [activeTab, setActiveTab] = useState("info"); // info, career, documents

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>내 프로필</h2>
          <div style={{ fontSize: "12px", fontWeight: "bold", color: "#4f46e5", padding: "4px 8px", backgroundColor: "#eef2ff", borderRadius: "12px" }}>
            완성률 {user?.profileCompleteRatio || 0}%
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "16px" }}>
          {["info", "career", "documents"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none",
                border: "none",
                padding: "8px 12px",
                cursor: "pointer",
                fontWeight: activeTab === tab ? "bold" : "normal",
                color: activeTab === tab ? "#4f46e5" : "#6b7280",
                borderBottom: activeTab === tab ? "2px solid #4f46e5" : "none",
              }}
            >
              {tab === "info" ? "기본 정보" : tab === "career" ? "경력 카드" : "문서/인증"}
            </button>
          ))}
        </div>

        {activeTab === "info" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ fontSize: "14px" }}>
              <strong>이름:</strong> {user?.name || "미입력"}
            </div>
            <div style={{ fontSize: "14px" }}>
              <strong>희망 직무:</strong> {user?.jobType || "미입력"}
            </div>
            <div style={{ fontSize: "14px" }}>
              <strong>경력 연차:</strong> {user?.careerYears ? `${user.careerYears}년` : "미입력"}
            </div>
            <div style={{ fontSize: "14px" }}>
              <strong>활동 지역:</strong> {user?.region || "미입력"}
            </div>
          </div>
        )}

        {activeTab === "career" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>등록된 경력 카드가 없습니다.</p>
            <button style={{ padding: "8px", border: "1px dashed #cbd5e1", borderRadius: "8px", background: "none", color: "#4f46e5", cursor: "pointer", fontWeight: "bold" }}>
              + 경력 카드 추가하기
            </button>
          </div>
        )}

        {activeTab === "documents" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ padding: "12px", border: "1px solid #e5e7eb", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "14px", fontWeight: "bold" }}>건설업 기초안전보건교육 이수증</div>
              <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: "bold" }}>미등록</span>
            </div>
            <div style={{ padding: "12px", border: "1px solid #e5e7eb", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "14px", fontWeight: "bold" }}>배치전 건강진단서</div>
              <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: "bold" }}>미등록</span>
            </div>
            <div style={{ padding: "12px", border: "1px solid #e5e7eb", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "14px", fontWeight: "bold" }}>전자카드 발급 여부</div>
              <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: "bold" }}>미등록</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
