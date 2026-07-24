"use client";

import { ArrowRight } from "lucide-react";
import styles from "./landing.module.css";
import { Reveal } from "./Reveal";

export function FinalCTA({ onStart, onLogin }: { onStart: () => void; onLogin: () => void }) {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.inner}>
        <Reveal>
          <div className={styles.ctaBox}>
            <div className={styles.ctaTitle}>
              프로젝트 운영을
              <br />더 쉽고 효율적으로
            </div>
            <p className={styles.ctaSub}>무료로 시작하세요</p>
            <div className={styles.ctaActions}>
              <button className={styles.btnPrimary} onClick={onStart}>
                무료 시작하기 <ArrowRight size={17} strokeWidth={2.4} />
              </button>
              <button className={styles.btnGhost} onClick={onLogin}>
                이미 계정이 있어요
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
