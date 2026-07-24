"use client";

import { FolderKanban, Users, CalendarCheck, FileStack, LayoutDashboard, BarChart3 } from "lucide-react";
import styles from "./landing.module.css";
import { Reveal } from "./Reveal";

const FEATURES = [
  { icon: FolderKanban, title: "Project", desc: "프로젝트 생성부터 팀 구성, 공정 진행률까지 하나의 화면에서 관리합니다." },
  { icon: Users, title: "People", desc: "현장 투입 인력의 경력·자격·교육 이력을 확인하고 배정 상태를 추적합니다." },
  { icon: CalendarCheck, title: "Attendance", desc: "출역을 일 단위로 기록하고, 정산에 필요한 근거 자료로 자동 정리합니다." },
  { icon: FileStack, title: "Documents", desc: "계약서·증빙·안전서류를 프로젝트별 폴더로 정리해 언제든 찾을 수 있습니다." },
  { icon: LayoutDashboard, title: "Dashboard", desc: "진행 프로젝트·투입 인원·출역 현황을 실시간 지표로 한눈에 확인합니다." },
  { icon: BarChart3, title: "Reports", desc: "월별·현장별 운영 데이터를 리포트로 내려받아 의사결정에 활용합니다." },
];

export function Features() {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.inner}>
        <Reveal className={styles.centerHead}>
          <span className={styles.eyebrow}>Features</span>
          <h2 className={styles.h2}>핵심 기능</h2>
          <p className={styles.lead}>현장 운영에 필요한 기능을 처음부터 하나로 설계했습니다.</p>
        </Reveal>
        <div className={styles.featureGrid}>
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.06}>
              <div className={styles.card}>
                <div className={styles.cardIcon}>
                  <f.icon size={20} strokeWidth={2} />
                </div>
                <div className={styles.cardTitle}>{f.title}</div>
                <div className={styles.cardDesc}>{f.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
