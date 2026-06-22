"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useProfile } from "@/lib/ProfileContext";
import { track } from "@/lib/analytics";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/Button";
import { JOB_TYPES, CAREER_YEARS, REGIONS } from "@/lib/constants";
import controls from "@/components/controls.module.css";
import styles from "./onboarding.module.css";

const TOTAL_STEPS = 3;

export default function Onboarding() {
  const router = useRouter();
  const { user, setBasicProfile } = useProfile();
  const [step, setStep] = useState(0);
  const [jobType, setJobType] = useState<string[]>([]);
  const [careerYear, setCareerYear] = useState<string | null>(null);
  const [region, setRegion] = useState<string[]>([]);

  useEffect(() => {
    track("profile_started");
  }, []);

  const goBack = () => {
    if (step === 0) router.push("/signup");
    else setStep((s) => s - 1);
  };

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((x) => x !== value) : [...list, value];

  const toggleJob = (value: string) => setJobType((prev) => toggle(prev, value));
  const toggleRegion = (value: string) => setRegion((prev) => toggle(prev, value));
  const nextFromJob = () => {
    if (!jobType.length) return;
    track("job_type_selected", { jobType });
    setStep(1);
  };
  const selectYear = (value: string) => {
    setCareerYear(value);
    track("career_year_selected", { careerYear: value });
    setStep(2);
  };
  const nextFromRegion = () => {
    if (!region.length) return;
    track("region_selected", { region });
    setStep(3);
  };

  // 마지막 단계 진입 시 기본 프로필 저장(완료 처리)
  useEffect(() => {
    if (step === TOTAL_STEPS && jobType.length && careerYear && region.length) {
      setBasicProfile({ jobType, careerYears: careerYear, region });
      track("onboarding_completed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const progress = Math.round((step / TOTAL_STEPS) * 100);
  const firstName = user?.name?.trim().slice(0, 1) ?? "";

  return (
    <main className={styles.main}>
      <TopBar progress={progress} onBack={goBack} hideBack={step === TOTAL_STEPS} />

      <div className={styles.body}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.section key="job" className={styles.step} {...stepMotion}>
              <h1 className={controls.question}>어떤 일을 하세요?</h1>
              <p className={controls.hint}>직군을 선택해주세요. 여러 개 선택할 수 있어요.</p>
              <div className={controls.chips}>
                {JOB_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`${controls.chip} ${jobType.includes(t) ? controls.chipOn : ""}`}
                    onClick={() => toggleJob(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </motion.section>
          )}

          {step === 1 && (
            <motion.section key="year" className={styles.step} {...stepMotion}>
              <h1 className={controls.question}>경력은 얼마나 되세요?</h1>
              <p className={controls.hint}>가까운 기간을 선택해주세요.</p>
              <div className={controls.list}>
                {CAREER_YEARS.map((y) => (
                  <button
                    key={y}
                    type="button"
                    className={`${controls.row} ${careerYear === y ? controls.rowOn : ""}`}
                    onClick={() => selectYear(y)}
                  >
                    {y}
                    <Check className={controls.rowCheck} />
                  </button>
                ))}
              </div>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section key="region" className={styles.step} {...stepMotion}>
              <h1 className={controls.question}>어디서 일하고 싶으세요?</h1>
              <p className={controls.hint}>희망 지역을 선택해주세요. 여러 곳 선택할 수 있어요.</p>
              <div className={controls.chips}>
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`${controls.chip} ${region.includes(r) ? controls.chipOn : ""}`}
                    onClick={() => toggleRegion(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </motion.section>
          )}

          {step === 3 && (
            <motion.section
              key="done"
              className={styles.done}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className={styles.doneMark}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 14, stiffness: 240, delay: 0.05 }}
              >
                <Check big />
              </motion.div>
              <h1 className={controls.question}>
                {firstName ? `${user?.name}님, ` : ""}기본 프로필을 만들었어요.
              </h1>
              <ul className={styles.summary}>
                <li>
                  <span>직군</span>
                  <strong>{jobType.join(", ")}</strong>
                </li>
                <li>
                  <span>경력</span>
                  <strong>{careerYear}</strong>
                </li>
                <li>
                  <span>희망 지역</span>
                  <strong>{region.join(", ")}</strong>
                </li>
              </ul>
              <p className={controls.hint}>
                이제 경력 카드를 추가해 프로필을 더 단단하게 만들 수 있어요.
              </p>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {(step === 0 || step === 2) && (
        <div className={styles.footer}>
          <Button
            full
            disabled={step === 0 ? jobType.length === 0 : region.length === 0}
            onClick={step === 0 ? nextFromJob : nextFromRegion}
          >
            다음
          </Button>
        </div>
      )}

      {step === TOTAL_STEPS && (
        <div className={styles.footer}>
          <Button full onClick={() => router.push("/mono")}>
            시작하기
          </Button>
        </div>
      )}
    </main>
  );
}

const stepMotion = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
  transition: { duration: 0.2 },
};

function Check({ className, big }: { className?: string; big?: boolean }) {
  const s = big ? 30 : 20;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12.5 10 17l9-10"
        stroke="currentColor"
        strokeWidth={big ? 2.6 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
