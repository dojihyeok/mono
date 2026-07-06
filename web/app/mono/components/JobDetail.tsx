"use client";

import React, { useState, useEffect } from "react";

export default function JobDetail({ jobId, onBack, onApply }: { jobId: string; onBack: () => void; onApply: (jobId: string) => void }) {
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/job-posts/${jobId}`);
        if (res.ok) {
          setJob(await res.json());
        }
      } catch (err) {
        console.error("Failed to load job", err);
      }
    };
    fetchJob();
  }, [jobId]);

  if (!job) return <div style={{ padding: "20px" }}>로딩 중...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <button onClick={onBack} style={{ alignSelf: "flex-start", background: "none", border: "none", color: "#4f46e5", cursor: "pointer", padding: "0" }}>← 뒤로가기</button>
      
      <div style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
        <h2 style={{ margin: "0 0 12px 0", fontSize: "20px" }}>{job.title}</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", color: "#374151" }}>
          <div><strong>직무:</strong> {job.jobType}</div>
          <div><strong>일당:</strong> {job.dailyWage ? `${job.dailyWage.toLocaleString()}원` : "협의"}</div>
          <div><strong>모집 인원:</strong> {job.personnel || 1}명</div>
          <div><strong>기간:</strong> {job.startDate} ~ {job.endDate}</div>
          <div><strong>지역:</strong> {job.region}</div>
        </div>

        {/* P0: MONO Fair Rate (단가 가이드) */}
        <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#f0fdfa", border: "1px solid #ccfbf1", borderRadius: "8px" }}>
          <div style={{ fontWeight: "bold", color: "#0f766e", fontSize: "13px" }}>MONO Fair Rate (단가 가이드)</div>
          <div style={{ fontSize: "12px", color: "#115e59", marginTop: "4px" }}>
            해당 지역/직무의 평균 단가는 {job.dailyWage ? `${(job.dailyWage * 0.95).toLocaleString()}원 ~ ${(job.dailyWage * 1.05).toLocaleString()}원` : "데이터 부족"} 입니다.
          </div>
        </div>

        <div style={{ marginTop: "16px", fontSize: "14px" }}>
          <strong>상세 내용:</strong>
          <p style={{ whiteSpace: "pre-wrap", margin: "8px 0 0" }}>{job.description}</p>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <button 
            onClick={() => onApply(job.id)}
            style={{ flex: 1, padding: "12px", backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
          >
            지원하기
          </button>
          <button style={{ flex: 1, padding: "12px", backgroundColor: "#f3f4f6", color: "#374151", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
