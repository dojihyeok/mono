"use client";

import styles from "./landing.module.css";
import { Reveal } from "./Reveal";

export function PartnerSection() {
  return (
    <section className={styles.sectionTight}>
      <div className={styles.inner}>
        <Reveal>
          <div className={styles.partnerCard}>
            <div className={styles.partnerMark}>SS</div>
            <div className={styles.partnerBody}>
              <div className={styles.partnerLabel}>Security Partner</div>
              <div className={styles.partnerName}>SSenStone</div>
              <div className={styles.partnerTagRow}>
                <span className={styles.partnerTag}>출입 인증</span>
                <span className={styles.partnerTag}>Field PASS 인증</span>
                <span className={styles.partnerTag}>보안 기술 협력</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
