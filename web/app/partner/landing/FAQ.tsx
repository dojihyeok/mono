"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import styles from "./landing.module.css";
import { Reveal } from "./Reveal";

const FAQS = [
  { q: "무료로 사용할 수 있나요?", a: "Starter 플랜은 카드 등록 없이 무료로 시작할 수 있습니다. 프로젝트 1개, 팀원 5명까지 기본 공고·출역 기능을 바로 이용할 수 있습니다." },
  { q: "Workspace란 무엇인가요?", a: "Partner Workspace는 협력업체가 프로젝트·인력·출역·문서를 하나의 화면에서 관리하는 업무공간입니다. 현장마다 흩어져 있던 관리 업무를 한 곳으로 모읍니다." },
  { q: "Business와 Enterprise는 어떻게 다른가요?", a: "Business는 Workspace의 모든 핵심 기능을 월 구독으로 제공합니다. Enterprise는 원청·대기업을 대상으로 MONO Field PASS 연동, API 제공, 맞춤 구성이 추가된 확장 플랜입니다." },
  { q: "Field PASS와는 어떻게 연동되나요?", a: "Field PASS는 Enterprise 플랜에서만 제공되는 출입·인증 기능입니다. Business 플랜 이용 중에는 필요하지 않으며, 원청 협력이 필요한 시점에 Enterprise로 확장하면서 함께 도입할 수 있습니다." },
  { q: "API를 제공하나요?", a: "Enterprise 플랜에서 API를 제공합니다. 기존 사내 시스템(ERP, 출입관리 등)과 연동이 필요한 경우 도입 상담 시 함께 안내드립니다." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className={styles.section}>
      <div className={styles.innerNarrow}>
        <Reveal className={styles.centerHead}>
          <span className={styles.eyebrow}>FAQ</span>
          <h2 className={styles.h2}>자주 묻는 질문</h2>
        </Reveal>
        <Reveal>
          <div className={styles.faqList}>
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.q} className={styles.faqItem}>
                  <button
                    className={styles.faqQuestion}
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    {item.q}
                    <ChevronDown size={18} strokeWidth={2.2} style={{ transform: isOpen ? "rotate(180deg)" : "none" }} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className={styles.faqAnswerInner}>{item.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
