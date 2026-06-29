"use client";

// 공용 완료/협업 평가 바텀시트 — 별점 1~5 누적 + 코멘트. (CustomerApp·ForeignCandidateSearch 공용)
// metrics·title·onSubmit 만 주입; 제출 본체(apiSubmitReview·track·닫기)는 부모 onSubmit 이 처리.
import { useEffect, useState } from "react";

export interface ReviewMetric {
  key: string;
  label: string;
}

export default function ReviewSheet({
  title,
  subtitle,
  metrics,
  commentPlaceholder = "현장에서 함께 일한 소감을 남겨주세요",
  onSubmit,
  onClose,
}: {
  title: string;
  subtitle?: string;
  metrics: ReviewMetric[];
  commentPlaceholder?: string;
  onSubmit: (scores: Record<string, number>, comment: string) => Promise<void> | void;
  onClose: () => void;
}) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const anyScore = Object.keys(scores).length > 0;

  // ESC 닫기 + body 스크롤 잠금. ponytail: focus trap 은 형제 시트들과 동일하게 생략.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const submit = async () => {
    if (!anyScore || submitting) return;
    setSubmitting(true);
    await onSubmit(scores, comment.trim());
    setSubmitting(false);
  };

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(17,17,17,.34)", backdropFilter: "blur(3px)", zIndex: 70, display: "flex", alignItems: "flex-end" }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 480, margin: "0 auto", maxHeight: "90dvh", overflowY: "auto", background: "#fff", borderRadius: "28px 28px 0 0", padding: "10px 20px calc(20px + env(safe-area-inset-bottom))", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)" }}
      >
        <div style={{ width: 38, height: 4, borderRadius: 999, background: "#e6e8ec", margin: "0 auto 14px" }} aria-hidden />
        <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800, letterSpacing: "-.5px", color: "var(--app-text,#4f46e5)" }}>{title}</h2>
        {subtitle && <p style={{ margin: 0, fontSize: 12.5, color: "var(--app-text-secondary,#5b6b82)" }}>{subtitle}</p>}

        {metrics.map((m) => (
          <div key={m.key} style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--app-text,#4f46e5)", marginBottom: 8 }}>{m.label}</div>
            <div style={{ display: "flex", gap: 6 }} role="group" aria-label={`${m.label} 점수`}>
              {[1, 2, 3, 4, 5].map((n) => {
                const on = (scores[m.key] ?? 0) >= n;
                return (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={on}
                    aria-label={`${m.label} ${n}점`}
                    onClick={() => setScores((p) => ({ ...p, [m.key]: n }))}
                    style={{ flex: 1, height: 40, borderRadius: 11, border: `1.5px solid ${on ? "var(--c1,#4f46e5)" : "#e6e8ec"}`, background: on ? "var(--c1,#4f46e5)" : "#fff", color: on ? "#fff" : "var(--app-text-tertiary,#8694a8)", fontSize: 14, fontWeight: 800, fontFamily: "inherit", cursor: "pointer" }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 18 }}>
          <label htmlFor="review-comment" style={{ display: "block", fontSize: 13, fontWeight: 800, color: "var(--app-text,#4f46e5)", marginBottom: 8 }}>
            코멘트 <em style={{ fontStyle: "normal", color: "var(--app-text-tertiary,#8694a8)", fontWeight: 600 }}>선택</em>
          </label>
          <textarea id="review-comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder={commentPlaceholder} rows={3} style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 13, border: "1px solid #e6e8ec", background: "#fff", color: "#111111", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical" }} />
        </div>

        <button onClick={submit} disabled={!anyScore || submitting} aria-label="평가 제출" style={{ marginTop: 18, width: "100%", height: 54, borderRadius: 16, border: "none", background: anyScore && !submitting ? "var(--c1,#4f46e5)" : "#e6e8ec", color: anyScore && !submitting ? "#fff" : "#8694a8", fontSize: 16, fontWeight: 800, fontFamily: "inherit", cursor: anyScore && !submitting ? "pointer" : "default" }}>
          {submitting ? "제출 중…" : "평가 제출"}
        </button>
      </div>
    </div>
  );
}
