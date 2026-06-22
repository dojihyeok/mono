"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./BottomNav.module.css";

interface Tab {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}

const stroke = {
  fill: "none" as const,
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const TABS: Tab[] = [
  {
    href: "/home",
    label: "홈",
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z"
          stroke="currentColor"
          {...stroke}
          fill={a ? "currentColor" : "none"}
          fillOpacity={a ? 0.12 : 0}
        />
      </svg>
    ),
  },
  {
    href: "/jobs",
    label: "일자리",
    icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="7.5" width="18" height="12" rx="2.2" stroke="currentColor" {...stroke} />
        <path d="M8 7.5V6.2A2 2 0 0 1 10 4.2h4a2 2 0 0 1 2 2v1.3" stroke="currentColor" {...stroke} />
        <path d="M3 12.2h18" stroke="currentColor" {...stroke} />
      </svg>
    ),
  },
  {
    href: "/card",
    label: "경력카드",
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="5.5"
          width="18"
          height="13"
          rx="2.5"
          stroke="currentColor"
          {...stroke}
          fill={a ? "currentColor" : "none"}
          fillOpacity={a ? 0.12 : 0}
        />
        <path d="M3 10h18" stroke="currentColor" {...stroke} />
        <path d="M6.5 14.5h4" stroke="currentColor" {...stroke} />
      </svg>
    ),
  },
  {
    href: "/work",
    label: "출역·정산",
    icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="5" width="16" height="15" rx="2.2" stroke="currentColor" {...stroke} />
        <path d="M4 9.2h16M8.5 3.2v3M15.5 3.2v3" stroke="currentColor" {...stroke} />
        <path d="M9 14l2 2 4-4" stroke="currentColor" {...stroke} />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "내 정보",
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="8.5"
          r="3.6"
          stroke="currentColor"
          {...stroke}
          fill={a ? "currentColor" : "none"}
          fillOpacity={a ? 0.12 : 0}
        />
        <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" stroke="currentColor" {...stroke} />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="주요 메뉴">
      {TABS.map((tab) => {
        const active =
          pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`${styles.tab} ${active ? styles.active : ""}`}
            aria-current={active ? "page" : undefined}
          >
            {tab.icon(active)}
            <span className={styles.label}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
