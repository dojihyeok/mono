"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useProfile } from "@/lib/ProfileContext";
import { track } from "@/lib/analytics";
import { Button } from "@/components/Button";
import styles from "./home.module.css";

export default function Landing() {
  const { ready, user } = useProfile();
  const hasProfile = Boolean(user?.jobType?.length);

  useEffect(() => {
    track("page_view", { screen: "landing" });
    track("onboarding_viewed");
  }, []);

  return (
    <main className={styles.main}>
      <motion.div
        className={styles.brand}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        MONO
      </motion.div>

      <div className={styles.hero}>
        <motion.h1
          className={styles.headline}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          내 경력과 기술을
          <br />
          신뢰 프로필로 만들어보세요.
        </motion.h1>
        <motion.p
          className={styles.sub}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          현장 경력을 카드로 기록하고, 90초면 시작할 수 있어요.
        </motion.p>
      </div>

      {/* 즉시 가치 체감 — 완성될 프로필 미리보기 (PDF 3-2 즉시 보상) */}
      <motion.div
        className={styles.preview}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.previewTop}>
          <div className={styles.avatar}>김</div>
          <div>
            <div className={styles.previewName}>김현장 · 전기</div>
            <div className={styles.previewMeta}>경력 8년 · 서울</div>
          </div>
          <div className={styles.seal} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12.5 10 17l9-10"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className={styles.previewCards}>
          <span>현장 24곳</span>
          <span>자격증 3</span>
          <span>완성도 100%</span>
        </div>
      </motion.div>

      <div className={styles.spacer} />

      <motion.div
        className={styles.cta}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Button
          href="/signup"
          full
          onClick={() => track("onboarding_cta_clicked")}
        >
          프로필 만들기
        </Button>
        {ready && hasProfile && (
          <Link href="/mono" className={styles.resume}>
            이어서 하기
          </Link>
        )}
      </motion.div>
    </main>
  );
}
