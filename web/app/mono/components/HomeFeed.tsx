"use client";

import React, { useState, useEffect } from "react";
// import styles from "../mono.module.css"; // We can reuse styles if needed

export default function HomeFeed({ onJobClick }: { onJobClick: (jobId: string) => void }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [region, setRegion] = useState("전체");

  useEffect(() => {
    // Fetch job postings (P0: 지역 기반 공고 목록)
    const fetchJobs = async () => {
      try {
        const res = await fetch(`/api/job-posts?region=${region}`);
        if (res.ok) {
          const data = await res.json();
          setJobs(data.items || []);
        }
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      }
    };
    fetchJobs();
  }, [region]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* P0: 성장 배너 */}
      <div style={{ padding: "16px", backgroundColor: "#eef2ff", borderRadius: "12px", border: "1px solid #c7d2fe" }}>
        <h3 style={{ margin: 0, color: "#4338ca", fontSize: "16px" }}>MONO Growth Path</h3>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#4f46e5" }}>조공에서 기공까지, 당신의 성장 경로를 확인하세요!</p>
      </div>

      {/* 지역 필터 */}
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>추천 공고 ({region})</h4>
        {/* TODO: Add location filter dropdown */}
      </div>

      {/* 공고 리스트 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {jobs.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#9ca3af" }}>등록된 공고가 없습니다.</div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => onJobClick(job.id)}
              style={{
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                cursor: "pointer",
                backgroundColor: "#fff"
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "15px" }}>{job.title}</div>
              <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
                일당: {job.dailyWage ? `${job.dailyWage.toLocaleString()}원` : "협의"} | {job.region}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
