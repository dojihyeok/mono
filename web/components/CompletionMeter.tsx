"use client";

import { motion } from "framer-motion";
import styles from "./CompletionMeter.module.css";

// 프로필 완성도 0~100% 원형 미터 (PDF 11-4)
export function CompletionMeter({ value }: { value: number }) {
  const size = 96;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circ - (clamped / 100) * circ;

  return (
    <div className={styles.wrap} style={{ width: size, height: size }}>
      <svg width={size} height={size} className={styles.svg}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--app-border)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#meterGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="meterGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--app-accent)" />
            <stop offset="100%" stopColor="#2f7da3" />
          </linearGradient>
        </defs>
      </svg>
      <div className={styles.center}>
        <span className={styles.num}>{clamped}</span>
        <span className={styles.pct}>%</span>
      </div>
    </div>
  );
}
