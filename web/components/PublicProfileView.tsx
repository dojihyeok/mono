"use client";

import type {
  CareerCard,
  Certificate,
  Education,
  User,
} from "@/lib/types";
import styles from "./PublicProfileView.module.css";

interface Props {
  user: User;
  careerCards: CareerCard[];
  certificates: Certificate[];
  educations: Education[];
  completion: number;
}

function formatRange(start?: string, end?: string) {
  if (!start && !end) return "";
  const s = start?.replace("-", ".") ?? "";
  const e = end ? end.replace("-", ".") : "현재";
  return s ? `${s} – ${e}` : e;
}

// 기업이 보는 프로필 화면 — 미리보기(/profile/preview)와 공개 링크(/p/[id])가 공유.
export function PublicProfileView({
  user,
  careerCards,
  certificates,
  educations,
  completion,
}: Props) {
  const name = user.name?.trim() || "회원";
  const initial = name.slice(0, 1);

  return (
    <div className={styles.sheet}>
      <header className={styles.head}>
        <div className={styles.avatar}>{initial}</div>
        <h1 className={styles.name}>{name}</h1>
        <p className={styles.role}>
          {(user.jobType ?? []).join(" · ")} · 경력 {user.careerYears}
        </p>
        <p className={styles.region}>희망 지역 {(user.region ?? []).join(" · ")}</p>
        <div className={styles.seal}>
          <Check /> MONO 신뢰 프로필 · 완성도 {completion}%
        </div>
      </header>

      <div className={styles.stats}>
        <Stat num={careerCards.length} label="현장 경력" />
        <Stat num={certificates.length} label="자격증" />
        <Stat num={educations.length} label="교육 이력" />
      </div>

      {careerCards.length > 0 && (
        <Section title="현장 경력">
          <ul className={styles.timeline}>
            {careerCards.map((c) => (
              <li key={c.id} className={styles.tItem}>
                <span className={styles.tDot} />
                <div className={styles.tBody}>
                  <div className={styles.tTop}>
                    <strong>{c.siteName}</strong>
                    {c.field && <span className={styles.tag}>{c.field}</span>}
                  </div>
                  {(c.startDate || c.endDate || c.role) && (
                    <div className={styles.tSub}>
                      {formatRange(c.startDate, c.endDate)}
                      {c.role && (c.startDate || c.endDate) ? " · " : ""}
                      {c.role}
                    </div>
                  )}
                  {c.equipment && (
                    <div className={styles.tEquip}>사용 장비 · {c.equipment}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {certificates.length > 0 && (
        <Section title="자격증">
          <ul className={styles.chips}>
            {certificates.map((c) => (
              <li key={c.id} className={styles.chip}>
                {c.name}
                {c.issuedAt && (
                  <span className={styles.chipMeta}>
                    {c.issuedAt.replace("-", ".")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {educations.length > 0 && (
        <Section title="교육 이력">
          <ul className={styles.chips}>
            {educations.map((e) => (
              <li key={e.id} className={styles.chip}>
                {e.title}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <footer className={styles.foot}>
        MONO에서 검증한 현장 경력 프로필입니다.
      </footer>
    </div>
  );
}

function Stat({ num, label }: { num: number; label: string }) {
  return (
    <div className={styles.stat}>
      <div className={styles.statNum}>{num}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12.5 10 17l9-10"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
