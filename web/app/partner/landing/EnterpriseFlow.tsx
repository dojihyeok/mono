"use client";

import { ArrowRight } from "lucide-react";
import styles from "./landing.module.css";
import { Reveal } from "./Reveal";

const STEPS = [
  { label: "MONO MVP", active: false },
  { label: "Partner Workspace", active: true },
  { label: "MONO Field PASS", active: false, muted: true },
  { label: "Enterprise", active: false, muted: true },
];

export function EnterpriseFlow() {
  return (
    <section className={styles.sectionTight}>
      <div className={styles.innerNarrow}>
        <Reveal className={styles.centerHead} >
          <span className={styles.eyebrow}>Enterprise 확장</span>
          <h2 className={styles.h2} style={{ fontSize: "clamp(22px, 2.8vw, 28px)" }}>
            Workspace는 Enterprise로 이어집니다
          </h2>
        </Reveal>
        <Reveal>
          <div className={styles.entFlowRow}>
            {STEPS.map((s, i) => (
              <span key={s.label} style={{ display: "contents" }}>
                <span
                  className={`${styles.entStep} ${s.active ? styles.entStepActive : ""} ${s.muted ? styles.entStepMuted : ""}`}
                >
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <ArrowRight size={15} strokeWidth={2} color="#c3c8d0" />
                )}
              </span>
            ))}
          </div>
          <p className={styles.entNote}>
            MONO Field PASS는 원청·대기업을 위한 Enterprise 전용 출입·인증 기능입니다. Business 플랜에서는 필요하지 않으며, Enterprise로 확장할 때만 함께 제공됩니다.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
