"use client";

import { Check } from "lucide-react";
import styles from "./landing.module.css";
import { Reveal } from "./Reveal";

const TIERS: {
  tier: string;
  price: string;
  unit?: string;
  desc: string;
  features: string[];
  featured?: boolean;
  cta: string;
}[] = [
  {
    tier: "Starter",
    price: "무료",
    desc: "Workspace를 가볍게 체험해 보세요",
    features: ["프로젝트 1개", "팀원 5명", "기본 공고·출역 기능"],
    cta: "무료로 시작",
  },
  {
    tier: "Business",
    price: "월 구독",
    desc: "반복적으로 현장을 운영하는 협력업체를 위한 플랜",
    features: ["프로젝트 무제한", "Partner Workspace 전체 기능", "출역 관리", "문서 관리", "Dashboard·리포트"],
    featured: true,
    cta: "Business 시작하기",
  },
  {
    tier: "Enterprise",
    price: "별도 문의",
    desc: "원청·대기업을 위한 확장형 플랜",
    features: ["MONO Field PASS 연동", "API 제공", "맞춤 구성(Custom)"],
    cta: "문의하기",
  },
];

export function Pricing({ onStart }: { onStart: () => void }) {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.inner}>
        <Reveal className={styles.centerHead}>
          <span className={styles.eyebrow}>Pricing</span>
          <h2 className={styles.h2}>필요한 만큼 시작하세요</h2>
          <p className={styles.lead}>카드 등록 없이 무료로 시작하고, 팀이 커지면 Business로 넘어가면 됩니다.</p>
        </Reveal>
        <div className={styles.pricingGrid}>
          {TIERS.map((t, i) => (
            <Reveal key={t.tier} delay={i * 0.07}>
              <div className={`${styles.priceCard} ${t.featured ? styles.priceCardFeatured : ""}`}>
                {t.featured && <span className={styles.priceBadge}>가장 많이 선택</span>}
                <div className={styles.priceTier}>{t.tier}</div>
                <div className={styles.priceValue}>
                  {t.price}
                  {t.unit && <span className={styles.priceUnit}>{t.unit}</span>}
                </div>
                <div className={styles.priceDesc}>{t.desc}</div>
                <ul className={styles.priceList}>
                  {t.features.map((f) => (
                    <li key={f} className={styles.priceListItem}>
                      <Check size={15} strokeWidth={2.6} />
                      {f}
                    </li>
                  ))}
                </ul>
                {t.tier === "Enterprise" ? (
                  <button className={styles.btnGhost} onClick={onStart} style={{ width: "100%" }}>
                    {t.cta}
                  </button>
                ) : (
                  <button className={styles.btnPrimary} onClick={onStart} style={{ width: "100%" }}>
                    {t.cta}
                  </button>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
