"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Caught by Next.js Error Boundary:", error);
  }, [error]);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", wordBreak: "break-all" }}>
      <h2 style={{ color: "red" }}>Application Error</h2>
      <p style={{ fontWeight: "bold" }}>{error.message || "Unknown error"}</p>
      <pre style={{ background: "#f0f0f0", padding: "10px", fontSize: "12px", overflowX: "auto" }}>
        {error.stack}
      </pre>
      <button 
        onClick={() => reset()}
        style={{ marginTop: "20px", padding: "10px 20px", background: "#1F2226", color: "white", borderRadius: "8px", border: "none" }}
      >
        다시 시도
      </button>
    </div>
  );
}
