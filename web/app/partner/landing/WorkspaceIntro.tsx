"use client";

import { FolderKanban, Users, CalendarCheck, FileStack } from "lucide-react";
import styles from "./landing.module.css";
import { Reveal } from "./Reveal";

const ITEMS = [
  { icon: FolderKanban, title: "프로젝트", desc: "현장·공정별 프로젝트를 등록하고 진행 상태를 한눈에 관리합니다." },
  { icon: Users, title: "인력", desc: "투입 인력의 경력·자격·배정 현황을 팀 단위로 관리합니다." },
  { icon: CalendarCheck, title: "출역", desc: "일자별 출역을 기록하고 정산 참고자료로 자동 축적합니다." },
  { icon: FileStack, title: "문서", desc: "계약·증빙·보고서를 프로젝트별로 모아 보관합니다." },
];

export function WorkspaceIntro() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <Reveal className={styles.centerHead}>
          <span className={styles.eyebrow}>Workspace</span>
          <h2 className={styles.h2}>프로젝트 운영을 하나의 Workspace에서</h2>
        </Reveal>
        <div className={styles.introGrid}>
          {ITEMS.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.06}>
              <div className={styles.card}>
                <div className={styles.cardIcon}>
                  <it.icon size={20} strokeWidth={2} />
                </div>
                <div className={styles.cardTitle}>{it.title}</div>
                <div className={styles.cardDesc}>{it.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
