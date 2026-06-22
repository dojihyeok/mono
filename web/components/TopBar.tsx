"use client";

import { useRouter } from "next/navigation";
import styles from "./TopBar.module.css";

interface TopBarProps {
  title?: string;
  /** 0~100 진행률(선택). 가입/온보딩 등 단계형 화면에서 사용 */
  progress?: number;
  /** 뒤로 동작 커스텀(기본: router.back) */
  onBack?: () => void;
  /** 뒤로 버튼 숨김 */
  hideBack?: boolean;
  right?: React.ReactNode;
}

export function TopBar({ title, progress, onBack, hideBack, right }: TopBarProps) {
  const router = useRouter();
  const handleBack = onBack ?? (() => router.back());

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        {!hideBack ? (
          <button
            type="button"
            className={styles.icon}
            onClick={handleBack}
            aria-label="뒤로"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 5l-7 7 7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <span className={styles.icon} aria-hidden="true" />
        )}
        {title && <h1 className={styles.title}>{title}</h1>}
        <div className={styles.right}>{right}</div>
      </div>

      {typeof progress === "number" && (
        <div
          className={styles.track}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className={styles.bar} style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
