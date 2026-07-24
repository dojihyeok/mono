"use client";

import { ArrowRight } from "lucide-react";
import styles from "./landing.module.css";
import { Reveal } from "./Reveal";

const STEPS = ["프로젝트 생성", "팀 구성", "공고 등록", "프로젝트 참여", "출역 관리", "프로젝트 완료"];

export function Workflow() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <Reveal className={styles.centerHead}>
          <span className={styles.eyebrow}>Workflow</span>
          <h2 className={styles.h2}>운영 흐름</h2>
          <p className={styles.lead}>프로젝트 시작부터 완료까지, 하나의 흐름으로 이어집니다.</p>
        </Reveal>
        <Reveal>
          <div className={styles.workflowRow}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: "contents" }}>
                <div className={styles.workflowStep}>
                  <div className={styles.workflowNum}>{i + 1}</div>
                  <div className={styles.workflowLabel}>{s}</div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={styles.workflowArrow}>
                    <ArrowRight size={16} strokeWidth={2.2} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
