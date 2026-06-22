"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useProfile } from "@/lib/ProfileContext";
import { track } from "@/lib/analytics";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/Button";
import controls from "@/components/controls.module.css";
import styles from "./signup.module.css";

type Method = "phone" | "email";

export default function Signup() {
  const router = useRouter();
  const { startSignup } = useProfile();
  const [method, setMethod] = useState<Method>("phone");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    track("page_view", { screen: "signup" });
    track("signup_started");
  }, []);

  const contactValid =
    method === "phone"
      ? phone.replace(/[^0-9]/g, "").length >= 10
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const valid = name.trim().length >= 1 && contactValid;

  const submit = () => {
    if (!valid) return;
    startSignup({
      name: name.trim(),
      phone: method === "phone" ? phone.trim() : undefined,
      email: method === "email" ? email.trim() : undefined,
    });
    router.push("/onboarding");
  };

  return (
    <main className={styles.main}>
      <TopBar progress={20} onBack={() => router.push("/")} />

      <motion.div
        className={styles.body}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className={controls.question}>먼저, 어떻게 불러드릴까요?</h1>
        <p className={controls.hint}>이름과 연락처만 있으면 바로 시작할 수 있어요.</p>

        <div className={controls.field}>
          <label className={controls.label} htmlFor="name">
            이름
          </label>
          <input
            id="name"
            className={controls.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            autoComplete="name"
          />
        </div>

        <div className={styles.toggle} role="tablist" aria-label="연락처 방식">
          <button
            type="button"
            role="tab"
            aria-selected={method === "phone"}
            className={`${styles.toggleBtn} ${method === "phone" ? styles.toggleOn : ""}`}
            onClick={() => setMethod("phone")}
          >
            휴대폰
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={method === "email"}
            className={`${styles.toggleBtn} ${method === "email" ? styles.toggleOn : ""}`}
            onClick={() => setMethod("email")}
          >
            이메일
          </button>
        </div>

        {method === "phone" ? (
          <div className={controls.field}>
            <label className={controls.label} htmlFor="phone">
              휴대폰 번호
            </label>
            <input
              id="phone"
              className={controls.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              inputMode="tel"
              autoComplete="tel"
            />
          </div>
        ) : (
          <div className={controls.field}>
            <label className={controls.label} htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              className={controls.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              inputMode="email"
              autoComplete="email"
            />
          </div>
        )}

        <p className={styles.consent}>
          시작하면 MONO 이용약관과 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </motion.div>

      <div className={styles.footer}>
        <Button full disabled={!valid} onClick={submit}>
          시작하기
        </Button>
      </div>
    </main>
  );
}
