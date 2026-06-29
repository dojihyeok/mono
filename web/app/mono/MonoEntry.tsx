"use client";

import { useEffect, useState } from "react";
import MonoApp from "./MonoApp";
import CustomerApp from "./CustomerApp";
import PerformerApp from "./PerformerApp";
import { useProfile } from "@/lib/ProfileContext";
import { track } from "@/lib/analytics";
import { apiUpsertOperatorProfile } from "@/lib/apiClient";
import { JOB_TYPES, CAREER_YEARS, REGIONS, INDUSTRIES } from "@/lib/constants";

const AUTH_KEY = "mono.loggedIn";

// /mono 진입 게이트: 미로그인 → 로그인, 로그인+프로필없음 → 프로필 생성, 그 외 → 앱.
const TYPE_KEY = "mono.userType";

export default function MonoEntry() {
  const { ready, user, startSignup, setBasicProfile } = useProfile();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [userType, setUserType] = useState<string | null | undefined>(undefined); // undefined=로딩중

  useEffect(() => {
    try {
      setAuthed(window.localStorage.getItem(AUTH_KEY) === "1");
      setUserType(window.localStorage.getItem(TYPE_KEY));
    } catch {
      setAuthed(false);
      setUserType(null);
    }
    track("app_opened");
    track("session_started");
    track("page_view", { screen: "mono" });
  }, []);

  if (authed === null || userType === undefined || !ready) return null; // 깜빡임 방지

  if (!authed) {
    return (
      <LoginScreen
        onLogin={(id) => {
          // 자체 계정 로그인 = 임의(데모) 계정. 입력 ID를 안정 식별자(phone "id:..")로 서버 계정 생성 → DB 영속화·재로그인 멱등.
          if (!user) startSignup({ name: id, phone: "id:" + id });
          try {
            window.localStorage.setItem(AUTH_KEY, "1");
            window.localStorage.setItem(TYPE_KEY, "WORKER");
          } catch {
            /* noop */
          }
          setAuthed(true);
        }}
        onBypassLogin={() => {
          const name = "도지혁";
          if (!user) startSignup({ name, phone: "id:" + name });
          setBasicProfile({
            name,
            role: "WORKER",
            residency: "DOMESTIC",
            jobType: [...JOB_TYPES],
            careerYears: CAREER_YEARS[0],
            region: [...REGIONS],
            industries: INDUSTRIES.map(i => i.value)
          });
          try {
            window.localStorage.setItem(AUTH_KEY, "1");
            window.localStorage.setItem(TYPE_KEY, "WORKER");
          } catch {}
          setAuthed(true);
        }}
      />
    );
  }

  // 유형 미선택(브랜드뉴: 유형·직군 모두 없음, CUSTOMER도 아님) → 유형 선택(§5.1)
  if (!userType && !user?.jobType?.length && user?.role !== "CUSTOMER") {
    return (
      <TypeSelect
        onPick={(t) => {
          try {
            window.localStorage.setItem(TYPE_KEY, t);
          } catch {
            /* noop */
          }
          setUserType(t);
          track("user_type_selected", { type: t });
        }}
      />
    );
  }

  // 수요측(작업요청자 CUSTOMER · 운영자 PROJECT_OPERATOR) — 직군 없음, 산업·지역만(§5.7). 후보매칭 흐름 공유.
  const demandRole =
    userType === "PROJECT_OPERATOR" || user?.role === "PROJECT_OPERATOR"
      ? "PROJECT_OPERATOR"
      : userType === "CUSTOMER" || user?.role === "CUSTOMER"
        ? "CUSTOMER"
        : null;
  if (demandRole) {
    if (!user?.industries?.length || !user?.region?.length) {
      return (
        <CustomerProfileSetup
          role={demandRole}
          onDone={(d) => {
            setBasicProfile({ role: demandRole, jobType: [], careerYears: "", name: d.name, region: d.region, industries: d.industries });
            if (demandRole === "PROJECT_OPERATOR")
              void apiUpsertOperatorProfile({ industries: d.industries, regions: d.region });
          }}
        />
      );
    }
    return <CustomerApp role={demandRole} />;
  }

  // 수행기업(PERFORMER_COMPANY) — 공급측. 회사 등록·작업수행사례(자체 온보딩은 PerformerApp 내부).
  if (userType === "PERFORMER_COMPANY" || user?.role === "PERFORMER_COMPANY") {
    return <PerformerApp />;
  }

  // 기술자(WORKER) / 현장리더(FIELD_LEADER, 직군 온보딩 후 승인) — 또는 레거시 직군 보유자
  // 프로필 만들기 없이 바로 메인 화면으로 이동
  // if (!user?.jobType?.length) {
  //   return <ProfileSetup onDone={(d) => setBasicProfile({ ...d, role: "WORKER" })} />;
  // }

  return <MonoApp />;
}

const SSO_BUTTONS = [
  { key: "naver", label: "네이버", bg: "#03C75A", fg: "#fff", mark: "N" },
  { key: "kakao", label: "카카오", bg: "#FEE500", fg: "#191600", mark: "K" },
  { key: "google", label: "구글", bg: "#fff", fg: "#1f1f1f", mark: "G", border: "#e6e8ec" },
];

function LoginScreen({ onLogin, onBypassLogin }: { onLogin: (id: string) => void, onBypassLogin?: () => void }) {
  const [mode, setMode] = useState<"buttons" | "native">("buttons");
  const [loginId, setLoginId] = useState("");
  const [pw, setPw] = useState("");
  const [notice, setNotice] = useState("");

  return (
    <Screen>
      <Brand />
      <div style={{ textAlign: "center", marginTop: "14px", fontSize: "14.5px", color: "#5b6b82", fontWeight: "600", lineHeight: "1.6" }}>
        내 경력과 기술을
        <br />
        신뢰 프로필로 만들어보세요.
      </div>

      <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {mode === "buttons" ? (
          <>
            {SSO_BUTTONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setNotice(`${s.label} 로그인은 곧 지원됩니다.`)}
                style={{ height: "52px", borderRadius: "13px", border: s.border ? `1px solid ${s.border}` : "none", background: s.bg, color: s.fg, fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "9px" }}
              >
                <span style={{ width: "22px", height: "22px", borderRadius: "6px", background: "rgba(0,0,0,.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "900" }}>{s.mark}</span>
                {s.label}로 시작하기
              </button>
            ))}
            <button
              onClick={() => {
                if (onBypassLogin) {
                  track("sign_up_started", { method: "bypass" });
                  onBypassLogin();
                } else {
                  track("sign_up_started", { method: "native" });
                  setNotice("");
                  setMode("native");
                }
              }}
              style={{ height: "52px", borderRadius: "13px", border: "none", background: "var(--c1,#4f46e5)", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}
            >
              자체 계정으로 로그인
            </button>
            {notice && <div style={{ textAlign: "center", marginTop: "8px", fontSize: "13px", color: "var(--ai,#9a6b16)", fontWeight: "700" }}>{notice}</div>}
          </>
        ) : (
          <>
            <input value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder="아이디" style={inputStyle} />
            <input value={pw} onChange={(e) => setPw(e.target.value)} type="password" placeholder="비밀번호" style={inputStyle} />
            <button
              onClick={() => loginId.trim() && onLogin(loginId.trim())}
              disabled={!loginId.trim()}
              style={{ height: "52px", borderRadius: "13px", border: "none", background: loginId.trim() ? "var(--c1,#4f46e5)" : "#e6e8ec", color: loginId.trim() ? "#fff" : "#8694a8", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: loginId.trim() ? "pointer" : "default" }}
            >
              로그인
            </button>
            <button onClick={() => setMode("buttons")} style={{ height: "44px", borderRadius: "13px", border: "none", background: "none", color: "#5b6b82", fontSize: "13.5px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer" }}>
              ← 다른 방법으로 로그인
            </button>
            <div style={{ textAlign: "center", marginTop: "2px", fontSize: "12px", color: "#8694a8", lineHeight: "1.6" }}>
              회원가입 없이 계정으로 로그인하면
              <br />
              바로 앱 메인 화면으로 이동합니다.
            </div>
          </>
        )}
      </div>
    </Screen>
  );
}

function ProfileSetup({ onDone }: { onDone: (d: { jobType: string[]; careerYears: string; region: string[]; name: string; industries: string[]; residency: "DOMESTIC" | "OVERSEAS" }) => void }) {
  useEffect(() => {
    track("step_profile_entered");
  }, []);

  const [name, setName] = useState("");
  const [nameFocus, setNameFocus] = useState(false);
  const [residency, setResidency] = useState<"DOMESTIC" | "OVERSEAS" | "">("");
  const [jobType, setJobType] = useState<string[]>([]);
  const [careerYears, setCareerYears] = useState("");
  const [region, setRegion] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const valid = !!name.trim() && !!residency && jobType.length > 0 && !!careerYears && region.length > 0 && industries.length > 0;

  const toggle = (v: string, list: string[], set: (x: string[]) => void) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "var(--bg,#f5f6fb)", color: "var(--app-text,#4f46e5)" }}>
      <div style={{ flex: "1", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ width: "100%", maxWidth: "480px", margin: "0 auto", padding: "calc(34px + env(safe-area-inset-top)) 22px 16px" }}>

          {/* 헤드라인 */}
          <div style={{ animation: "riseUp .5s ease both" }}>
            <span style={{ display: "inline-block", fontSize: "12px", fontWeight: "800", letterSpacing: "-.2px", color: "var(--c1,#4f46e5)", background: "var(--aSoft,#ecedfb)", padding: "6px 12px", borderRadius: "999px" }}>프로필 만들기</span>
            <h1 style={{ margin: "18px 0 0", fontSize: "26px", lineHeight: "1.32", fontWeight: "800", letterSpacing: "-.7px", color: "var(--app-text,#4f46e5)" }}>현장 경력,<br />카드 한 장으로.</h1>
            <p style={{ margin: "10px 0 0", fontSize: "14px", color: "var(--app-text-secondary,#5b6b82)", fontWeight: "500", lineHeight: "1.6" }}>몇 가지만 입력하면 바로 시작할 수 있어요.</p>
          </div>

          {/* 이름 */}
          <div style={{ marginTop: "30px", animation: "riseUp .5s ease both", animationDelay: ".05s" }}>
            <label style={onbLabel}>이름</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setNameFocus(true)}
              onBlur={() => setNameFocus(false)}
              placeholder="이름을 입력하세요"
              style={{ width: "100%", height: "54px", boxSizing: "border-box", padding: "0 16px", borderRadius: "14px", border: `1.5px solid ${nameFocus ? "var(--c1,#4f46e5)" : "#e6e8ec"}`, background: "#fff", color: "#111111", fontSize: "16px", fontFamily: "inherit", outline: "none", boxShadow: nameFocus ? "0 0 0 4px var(--aSoft,#ecedfb)" : "none", transition: "border-color .15s, box-shadow .15s" }}
            />
          </div>

          {/* 내국인 / 외국인 — 외국인 선택 시 외국인 전용 메뉴 노출(MonoApp gating) */}
          <div style={{ marginTop: "24px", animation: "riseUp .5s ease both", animationDelay: ".08s" }}>
            <label style={onbLabel}>구분</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {([["DOMESTIC", "내국인"], ["OVERSEAS", "외국인"]] as const).map(([val, label]) => {
                const on = residency === val;
                return (
                  <button key={val} type="button" aria-pressed={on} onClick={() => setResidency(val)} style={{ flex: 1, height: "48px", borderRadius: "13px", border: `1.5px solid ${on ? "var(--c1,#4f46e5)" : "#e6e8ec"}`, background: on ? "var(--c1,#4f46e5)" : "#fff", color: on ? "#fff" : "var(--app-text-secondary,#5b6b82)", fontSize: "14.5px", fontWeight: on ? "800" : "600", fontFamily: "inherit", cursor: "pointer", transition: "all .12s" }}>{label}</button>
                );
              })}
            </div>
          </div>

          {/* 직군 · 경력 · 지역 */}
          <PillGroup label="직군" hint="복수 선택" delay=".1s" options={JOB_TYPES} selected={jobType} onToggle={(v) => toggle(v, jobType, setJobType)} />
          <PillGroup label="경력 연차" delay=".2s" options={CAREER_YEARS} selected={careerYears ? [careerYears] : []} onToggle={(v) => setCareerYears((p) => (p === v ? "" : v))} />
          <PillGroup label="희망 지역" hint="복수 선택" delay=".25s" options={REGIONS} selected={region} onToggle={(v) => toggle(v, region, setRegion)} />

          {/* 산업 분야 (캐노니컬 §5.2) — value=서버 enum, label=표시. 초기 노출 4값 */}
          <div style={{ marginTop: "24px", animation: "riseUp .5s ease both", animationDelay: ".3s" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "7px", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: "800", color: "var(--app-text,#4f46e5)", letterSpacing: "-.2px" }}>산업 분야</span>
              <span style={{ fontSize: "11.5px", color: "var(--app-text-tertiary,#8694a8)", fontWeight: "600" }}>복수 선택</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {INDUSTRIES.map((ind) => {
                const on = industries.includes(ind.value);
                return (
                  <button key={ind.value} type="button" onClick={() => toggle(ind.value, industries, setIndustries)} style={{ padding: "10px 15px", borderRadius: "999px", border: `1.5px solid ${on ? "var(--c1,#4f46e5)" : "#e6e8ec"}`, background: on ? "var(--c1,#4f46e5)" : "#fff", color: on ? "#fff" : "var(--app-text-secondary,#5b6b82)", fontSize: "13.5px", fontWeight: on ? "800" : "600", fontFamily: "inherit", cursor: "pointer", transition: "all .12s" }}>{ind.label}</button>
                );
              })}
            </div>
          </div>

          <div style={{ height: "16px" }} />
        </div>
      </div>

      {/* 하단 고정 CTA */}
      <div style={{ flex: "none", padding: "12px 22px calc(16px + env(safe-area-inset-bottom))", background: "linear-gradient(180deg,rgba(245,246,251,0),var(--bg,#f5f6fb) 30%)" }}>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <button
            onClick={() => valid && residency && onDone({ name: name.trim(), jobType, careerYears, region, industries, residency })}
            disabled={!valid}
            style={{ width: "100%", height: "56px", borderRadius: "16px", border: "none", background: valid ? "var(--c1,#4f46e5)" : "#e6e8ec", color: valid ? "#fff" : "#8694a8", fontSize: "16px", fontWeight: "800", fontFamily: "inherit", cursor: valid ? "pointer" : "default", boxShadow: valid ? "0 12px 26px -10px color-mix(in srgb, var(--brand,#4f46e5) 55%, transparent)" : "none", transition: "background .2s, box-shadow .2s, color .2s" }}
          >
            {valid ? "시작하기" : "항목을 모두 채워주세요"}
          </button>
        </div>
      </div>
    </div>
  );
}

// 유형 선택(§5.1) — 캐노니컬 5종. WORKER·FIELD_LEADER·CUSTOMER 핵심 3종 + 운영자·수행기업(확장).
const USER_TYPES = [
  { key: "WORKER", label: "기술자", desc: "내 경력·기술로 현장 일을 찾아요", mark: "기" },
  { key: "FIELD_LEADER", label: "현장리더 · 반장", desc: "작업팀을 꾸리고 현장을 이끌어요", mark: "리" },
  { key: "CUSTOMER", label: "작업요청자", desc: "현장에 필요한 인력·작업을 요청해요", mark: "발" },
  { key: "PROJECT_OPERATOR", label: "프로젝트·현장 운영자", desc: "공정·후보관리로 현장을 운영해요", mark: "운" },
  { key: "PERFORMER_COMPANY", label: "수행기업", desc: "보유 팀·작업사례로 현장을 수행해요", mark: "수" },
];

function TypeSelect({ onPick }: { onPick: (t: string) => void }) {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center", background: "var(--bg,#f5f6fb)", color: "var(--app-text,#4f46e5)" }}>
      <div style={{ width: "100%", maxWidth: "480px", margin: "0 auto", padding: "32px 22px" }}>
        <div style={{ animation: "riseUp .5s ease both" }}>
          <span style={{ display: "inline-block", fontSize: "12px", fontWeight: "800", color: "var(--c1,#4f46e5)", background: "var(--aSoft,#ecedfb)", padding: "6px 12px", borderRadius: "999px" }}>시작하기</span>
          <h1 style={{ margin: "18px 0 0", fontSize: "26px", lineHeight: "1.32", fontWeight: "800", letterSpacing: "-.7px", color: "var(--app-text,#4f46e5)" }}>어떤 분이세요?</h1>
          <p style={{ margin: "10px 0 0", fontSize: "14px", color: "var(--app-text-secondary,#5b6b82)", fontWeight: "500" }}>역할에 맞는 화면으로 이동해요.</p>
        </div>
        <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {USER_TYPES.map((t, i) => (
            <button
              key={t.key}
              onClick={() => onPick(t.key)}
              style={{ display: "flex", alignItems: "center", gap: "14px", textAlign: "left", padding: "18px", borderRadius: "18px", border: "1.5px solid #e6e8ec", background: "#fff", cursor: "pointer", fontFamily: "inherit", animation: "riseUp .5s ease both", animationDelay: `${0.05 + i * 0.06}s` }}
            >
              <span style={{ flex: "none", width: "46px", height: "46px", borderRadius: "14px", background: "var(--aSoft,#ecedfb)", color: "var(--c1,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "900" }}>{t.mark}</span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontSize: "16px", fontWeight: "800", color: "var(--app-text,#4f46e5)" }}>{t.label}</span>
                <span style={{ display: "block", marginTop: "3px", fontSize: "12.5px", color: "var(--app-text-secondary,#5b6b82)", lineHeight: "1.5" }}>{t.desc}</span>
              </span>
              <span style={{ flex: "none", color: "#c3c8d2", fontSize: "20px", fontWeight: "700" }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 수요측(작업요청자 CUSTOMER · 운영자 PROJECT_OPERATOR) 기본 프로필 — 이름 + 관심 산업 + 지역(직군 없음, §5.1).
function CustomerProfileSetup({ role = "CUSTOMER", onDone }: { role?: "CUSTOMER" | "PROJECT_OPERATOR"; onDone: (d: { name: string; industries: string[]; region: string[] }) => void }) {
  const [name, setName] = useState("");
  const [nameFocus, setNameFocus] = useState(false);
  const [industries, setIndustries] = useState<string[]>([]);
  const [region, setRegion] = useState<string[]>([]);
  const valid = !!name.trim() && industries.length > 0 && region.length > 0;
  const toggle = (v: string, list: string[], set: (x: string[]) => void) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const isOperator = role === "PROJECT_OPERATOR";
  const badge = isOperator ? "운영자 프로필" : "작업요청자 프로필";
  const heading = isOperator ? <>맡은 현장,<br />여기서 운영하세요.</> : <>필요한 현장,<br />바로 요청하세요.</>;

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "var(--bg,#f5f6fb)", color: "var(--app-text,#4f46e5)" }}>
      <div style={{ flex: "1", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ width: "100%", maxWidth: "480px", margin: "0 auto", padding: "calc(34px + env(safe-area-inset-top)) 22px 16px" }}>
          <div style={{ animation: "riseUp .5s ease both" }}>
            <span style={{ display: "inline-block", fontSize: "12px", fontWeight: "800", color: "var(--c1,#4f46e5)", background: "var(--aSoft,#ecedfb)", padding: "6px 12px", borderRadius: "999px" }}>{badge}</span>
            <h1 style={{ margin: "18px 0 0", fontSize: "26px", lineHeight: "1.32", fontWeight: "800", letterSpacing: "-.7px", color: "var(--app-text,#4f46e5)" }}>{heading}</h1>
          </div>
          <div style={{ marginTop: "30px", animation: "riseUp .5s ease both", animationDelay: ".05s" }}>
            <label style={onbLabel}>이름 / 회사명</label>
            <input value={name} onChange={(e) => setName(e.target.value)} onFocus={() => setNameFocus(true)} onBlur={() => setNameFocus(false)} placeholder="이름 또는 회사명" style={{ width: "100%", height: "54px", boxSizing: "border-box", padding: "0 16px", borderRadius: "14px", border: `1.5px solid ${nameFocus ? "var(--c1,#4f46e5)" : "#e6e8ec"}`, background: "#fff", color: "#111111", fontSize: "16px", fontFamily: "inherit", outline: "none" }} />
          </div>
          <div style={{ marginTop: "24px", animation: "riseUp .5s ease both", animationDelay: ".1s" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "7px", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: "800", color: "var(--app-text,#4f46e5)" }}>관심 산업</span>
              <span style={{ fontSize: "11.5px", color: "var(--app-text-tertiary,#8694a8)", fontWeight: "600" }}>복수 선택</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {INDUSTRIES.map((ind) => {
                const on = industries.includes(ind.value);
                return (
                  <button key={ind.value} type="button" onClick={() => toggle(ind.value, industries, setIndustries)} style={{ padding: "10px 15px", borderRadius: "999px", border: `1.5px solid ${on ? "var(--c1,#4f46e5)" : "#e6e8ec"}`, background: on ? "var(--c1,#4f46e5)" : "#fff", color: on ? "#fff" : "var(--app-text-secondary,#5b6b82)", fontSize: "13.5px", fontWeight: on ? "800" : "600", fontFamily: "inherit", cursor: "pointer" }}>{ind.label}</button>
                );
              })}
            </div>
          </div>
          <PillGroup label="현장 지역" hint="복수 선택" delay=".15s" options={REGIONS} selected={region} onToggle={(v) => toggle(v, region, setRegion)} />
          <div style={{ height: "16px" }} />
        </div>
      </div>
      <div style={{ flex: "none", padding: "12px 22px calc(16px + env(safe-area-inset-bottom))", background: "linear-gradient(180deg,rgba(245,246,251,0),var(--bg,#f5f6fb) 30%)" }}>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <button onClick={() => valid && onDone({ name: name.trim(), industries, region })} disabled={!valid} style={{ width: "100%", height: "56px", borderRadius: "16px", border: "none", background: valid ? "var(--c1,#4f46e5)" : "#e6e8ec", color: valid ? "#fff" : "#8694a8", fontSize: "16px", fontWeight: "800", fontFamily: "inherit", cursor: valid ? "pointer" : "default", boxShadow: valid ? "0 12px 26px -10px color-mix(in srgb, var(--brand,#4f46e5) 55%, transparent)" : "none" }}>
            {valid ? "시작하기" : "항목을 모두 채워주세요"}
          </button>
        </div>
      </div>
    </div>
  );
}

const onbLabel: React.CSSProperties = { display: "block", fontSize: "13px", fontWeight: "800", color: "var(--app-text,#4f46e5)", letterSpacing: "-.2px", marginBottom: "10px" };

function PillGroup({ label, hint, delay, options, selected, onToggle }: { label: string; hint?: string; delay: string; options: readonly string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div style={{ marginTop: "24px", animation: "riseUp .5s ease both", animationDelay: delay }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "7px", marginBottom: "10px" }}>
        <span style={{ fontSize: "13px", fontWeight: "800", color: "var(--app-text,#4f46e5)", letterSpacing: "-.2px" }}>{label}</span>
        {hint && <span style={{ fontSize: "11.5px", color: "var(--app-text-tertiary,#8694a8)", fontWeight: "600" }}>{hint}</span>}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {options.map((o) => {
          const on = selected.includes(o);
          return (
            <button key={o} type="button" onClick={() => onToggle(o)} style={{ padding: "10px 15px", borderRadius: "999px", border: `1.5px solid ${on ? "var(--c1,#4f46e5)" : "#e6e8ec"}`, background: on ? "var(--c1,#4f46e5)" : "#fff", color: on ? "#fff" : "var(--app-text-secondary,#5b6b82)", fontSize: "13.5px", fontWeight: on ? "800" : "600", fontFamily: "inherit", cursor: "pointer", transition: "all .12s" }}>{o}</button>
          );
        })}
      </div>
    </div>
  );
}

// ── 공용 UI ──
function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "32px 24px", background: "var(--bg,#ece7dd)", color: "var(--brand,#4f46e5)" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>{children}</div>
    </div>
  );
}

function Brand() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
      <div style={{ width: "42px", height: "42px", borderRadius: "13px", background: "linear-gradient(135deg,var(--c1,#4f46e5),var(--c0,#4f46e5))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "900", fontSize: "21px" }}>M</div>
      <span style={{ fontSize: "27px", fontWeight: "800", color: "var(--c0,#4f46e5)" }}>MONO</span>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  height: "52px",
  padding: "0 16px",
  borderRadius: "13px",
  border: "1px solid #e6e8ec",
  background: "#fff",
  color: "#111111",
  fontSize: "15px",
  fontFamily: "inherit",
  outline: "none",
};
