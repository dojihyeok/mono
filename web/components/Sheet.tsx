"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Sheet.module.css";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** 헤더 우측 보조 노드(선택) */
  headerAccessory?: React.ReactNode;
  /** 하단 고정 푸터(주로 CTA 버튼) */
  footer?: React.ReactNode;
  children: React.ReactNode;
}

// 접근성 풀세트(CLAUDE.md 6): focus trap · ESC · 바깥클릭 · aria · body scroll lock · 모바일 풀스크린.
export function Sheet({
  open,
  onClose,
  title,
  headerAccessory,
  footer,
  children,
}: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();

  // body scroll lock
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("scroll-lock");
    return () => document.body.classList.remove("scroll-lock");
  }, [open]);

  // 오픈 시 포커스 이동 + 닫힐 때 트리거로 복원
  useEffect(() => {
    if (open) {
      lastFocused.current = document.activeElement as HTMLElement | null;
      // 다음 프레임에 패널 내 첫 포커서블로 이동
      const t = window.setTimeout(() => {
        const focusable = panelRef.current?.querySelector<HTMLElement>(
          FOCUSABLE,
        );
        (focusable ?? panelRef.current)?.focus();
      }, 20);
      return () => window.clearTimeout(t);
    }
    lastFocused.current?.focus?.();
  }, [open]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      // focus trap
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const list = Array.from(nodes).filter((n) => !n.hasAttribute("disabled"));
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement as HTMLElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => {
            // 바깥(딤) 클릭 닫기 — 패널 내부 클릭은 무시
            if (e.target === e.currentTarget) onClose();
          }}
          onKeyDown={onKeyDown}
        >
          <motion.div
            ref={panelRef}
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
          >
            <div className={styles.grabber} aria-hidden="true" />
            <header className={styles.header}>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
              <div className={styles.headerRight}>
                {headerAccessory}
                <button
                  type="button"
                  className={styles.close}
                  onClick={onClose}
                  aria-label="닫기"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 5l10 10M15 5L5 15"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </header>

            <div className={styles.body}>{children}</div>

            {footer && <div className={styles.footer}>{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
