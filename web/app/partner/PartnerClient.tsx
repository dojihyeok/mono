"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./partner.module.css";
import { PartnerLanding } from "./landing/PartnerLanding";
import {
  JOB_TYPES,
  REGIONS,
  CAREER_YEARS,
  CAREER_BAND,
  CAREER_BAND_LABEL,
  INDUSTRIES,
} from "@/lib/constants";
import { track } from "@/lib/analytics";

const CID_KEY = "mono.partner.companyId";

interface Company {
  id: string;
  name: string;
  contactName: string;
  contactPhone?: string | null;
  contactEmail?: string | null;
  status: string;
  region: string[];
  industry?: string | null;
  companyKind?: "PERFORMER" | "OPERATOR" | null;
  industries?: string[];
  safetyRate?: number | null;
  rehireRate?: number | null;
  defectMemo?: string | null;
  memo?: string | null;
  createdAt?: string;
  _count?: { jobPosts: number; savedWorkers: number };
}
interface WorkRecord {
  id: string;
  industry: string;
  title: string;
  siteName?: string | null;
  workTypes: string[];
  period?: string | null;
  scaleMemo?: string | null;
  description?: string | null;
  createdAt: string;
}
interface PerformerCompany {
  id: string;
  name: string;
  industry?: string | null;
  industries: string[];
  region: string[];
  safetyRate: number | null;
  rehireRate: number | null;
  createdAt: string;
  _count: { workRecords: number };
}
interface JobPost {
  id: string;
  title: string;
  jobType: string[];
  headcount?: number | null;
  careerBand?: string | null;
  certs: string[];
  region: string[];
  period?: string | null;
  conditions?: string | null;
  status: string;
  isUrgent?: boolean;
  siteType?: string | null;
  createdAt: string;
}
interface Worker {
  id: string;
  name: string;
  jobType: string[];
  careerYears: string | null;
  region: string[];
  createdAt: string;
  careerCards: { siteName: string; field: string | null }[];
  _count: { careerCards: number; certificates: number; educations: number };
}
interface Saved {
  id: string;
  userId: string;
  user: Worker;
}
interface TeamDir {
  id: string;
  name: string;
  leaderId: string;
  industries: string[];
  workTypes: string[];
  regions: string[];
  safetyRate: number | null;
  equipOperators: number | null;
  leader: { id: string; name: string | null } | null;
  _count: { members: number };
}

type View = "landing" | "signup" | "login" | "dashboard";
type Tab =
  | "overview"
  | "info"
  | "post"
  | "work_requests"
  | "applications"
  | "workers"
  | "teams"
  | "saved"
  | "profile"
  | "directory";

const COMPANY_STATUS_LABEL: Record<string, string> = {
  INQUIRY: "문의 접수",
  REVIEWING: "검토 중",
  PARTNER_CANDIDATE: "협약 후보",
  POSTED: "공고 등록",
  POC: "PoC 논의",
};

const COMPANY_KIND_LABEL: Record<string, string> = {
  PERFORMER: "협력업체 · 전문시공",
  OPERATOR: "원청 · 발주처",
};

function pct(v?: number | null): string {
  return v == null ? "—" : `${Math.round(v * 100)}%`;
}

function jobPostBadge(status: string): { label: string; cls: string } {
  switch (status) {
    case "OPEN":
      return { label: "노출 중", cls: styles.badgeOpen };
    case "PENDING":
      return { label: "승인 대기", cls: styles.badgePending };
    case "CLOSED":
      return { label: "마감", cls: styles.badgeClosed };
    default:
      return { label: "작성 중", cls: styles.badgeClosed };
  }
}

function Chips({
  options,
  selected,
  onToggle,
}: {
  options: readonly string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className={styles.chips}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          className={`${styles.chip} ${selected.includes(o) ? styles.chipOn : ""}`}
          onClick={() => onToggle(o)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function PartnerClient() {
  const [view, setView] = useState<View>("landing");
  const [tab, setTab] = useState<Tab>("overview");
  const [company, setCompany] = useState<Company | null>(null);

  const loadCompany = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/companies/${id}`, { cache: "no-store" });
      if (!res.ok) return false;
      setCompany((await res.json()) as Company);
      return true;
    } catch {
      return false;
    }
  }, []);

  // 최초: 저장된 companyId 있으면 대시보드로(재방문)
  useEffect(() => {
    let id: string | null = null;
    try {
      id = window.localStorage.getItem(CID_KEY);
    } catch {
      id = null;
    }
    track("page_view", { screen: "partner" });
    track("partner_page_viewed", {});
    if (id) {
      void loadCompany(id).then((ok) => {
        if (ok) {
          setView("dashboard");
          track("company_return_visit");
        }
      });
    }
  }, [loadCompany]);

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.brandLogo}>M</span>
          MONO
          <span className={styles.brandTag}>기업 파트너</span>
        </div>
        <span className={styles.spacer} />
        {company && (
          <>
            <span className={styles.statusPill}>
              {company.name} · {COMPANY_STATUS_LABEL[company.status] ?? company.status}
            </span>
            <button
              className={styles.btnSm}
              style={{ marginLeft: "10px" }}
              onClick={() => {
                // 세션 종료 → 첫 화면(랜딩). 둘러보기/협약 세션 모두 해제(새로고침해도 랜딩 유지).
                try {
                  window.localStorage.removeItem(CID_KEY);
                } catch {
                  /* noop */
                }
                setCompany(null);
                setView("landing");
              }}
            >
              {company.name === "둘러보기 데모 기업" ? "둘러보기 종료" : "로그아웃"}
            </button>
          </>
        )}
      </header>

      <main className={styles.container}>
        {view === "landing" && (
          <PartnerLanding
            onLogin={() => setView("login")}
            onStart={() => {
              track("company_signup_started");
              setView("signup");
            }}
            onBrowse={async () => {
              // 둘러보기: 가입 없이 데모 기업으로 대시보드 진입(공고·조회·저장·PoC 바로 체험)
              try {
                // 이미 세션(기업)이 있으면 재사용 — 클릭마다 데모 기업 중복 생성 방지
                let existing: string | null = null;
                try {
                  existing = window.localStorage.getItem(CID_KEY);
                } catch {
                  existing = null;
                }
                if (existing && (await loadCompany(existing))) {
                  setView("dashboard");
                  setTab("overview");
                  return;
                }
                const res = await fetch("/api/companies", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ name: "둘러보기 데모 기업", contactName: "데모 담당자", contactPhone: "00000000000" }),
                });
                if (!res.ok) return;
                const c = (await res.json()) as Company;
                if (!c || !c.id) return;
                setCompany(c);
                try {
                  window.localStorage.setItem(CID_KEY, c.id);
                } catch {
                  /* noop */
                }
                setView("dashboard");
                setTab("overview");
              } catch {
                /* noop */
              }
            }}
          />
        )}
        {view === "signup" && (
          <SignupForm
            onDone={(c) => {
              setCompany(c);
              try {
                window.localStorage.setItem(CID_KEY, c.id);
              } catch {
                /* noop */
              }
              setView("dashboard");
              setTab("overview"); // 협약 신청 직후 개요(홈)로 진입 — 다음 행동을 바로 안내
            }}
            onCancel={() => setView("landing")}
          />
        )}
        {view === "login" && (
          <CompanyLogin
            onDone={(c) => {
              setCompany(c);
              try {
                window.localStorage.setItem(CID_KEY, c.id);
              } catch {
                /* noop */
              }
              setView("dashboard");
              setTab("overview");
            }}
            onCancel={() => setView("landing")}
          />
        )}
        {view === "dashboard" && company && (
          <Dashboard company={company} tab={tab} setTab={setTab} reloadCompany={() => loadCompany(company.id)} />
        )}
      </main>
    </div>
  );
}

function SignupForm({
  onDone,
  onCancel,
}: {
  onDone: (c: Company) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [region, setRegion] = useState<string[]>([]);
  const [companyKind, setCompanyKind] = useState<"PERFORMER" | "OPERATOR">("PERFORMER");
  const [industries, setIndustries] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const valid = name.trim() && contactName.trim() && contactPhone.trim();

  const submit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contactName: contactName.trim(),
          contactPhone: contactPhone.trim(),
          industry: industry.trim() || undefined,
          region,
          companyKind,
          industries,
        }),
      });
      const c = (await res.json()) as Company;
      track("company_signup_completed");
      track("company_interest_submitted");
      track("partner_contact_submitted", {});
      track("company_kind_selected", { companyKind });
      onDone(c);
    } catch {
      setBusy(false);
    }
  };

  return (
    <div className={styles.panel} style={{ maxWidth: 620, margin: "0 auto" }}>
      <div className={styles.panelTitle}>기업 협약 신청</div>
      <div className={styles.panelSub}>회사·담당자 정보를 남겨주시면 협약 검토 후 안내드립니다.</div>

      <div className={styles.field}>
        <div className={styles.label}>
          우리 회사는 <span className={styles.req}>*</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {(
            [
              { k: "PERFORMER" as const, t: "협력업체 · 전문시공", d: "인력을 확보해 현장에 투입합니다" },
              { k: "OPERATOR" as const, t: "원청 · 발주처", d: "협력사·인력을 발주·관리합니다" },
            ]
          ).map((opt) => (
            <button
              key={opt.k}
              type="button"
              onClick={() => setCompanyKind(opt.k)}
              style={{
                textAlign: "left",
                padding: "14px 16px",
                borderRadius: 14,
                border: `1.5px solid ${companyKind === opt.k ? "var(--brand,#4f46e5)" : "#e6e8ec"}`,
                background: companyKind === opt.k ? "var(--brand-tint,#ecedfb)" : "#fff",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{opt.t}</div>
              <div style={{ fontSize: 12, color: "#5b6b82", fontWeight: 600, marginTop: 3 }}>{opt.d}</div>
            </button>
          ))}
        </div>
      </div>
      <div className={styles.field}>
        <div className={styles.label}>
          회사명 <span className={styles.req}>*</span>
        </div>
        <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 대주건설(주)" />
      </div>
      <div className={styles.grid2}>
        <div className={styles.field}>
          <div className={styles.label}>
            담당자 <span className={styles.req}>*</span>
          </div>
          <input className={styles.input} value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="이름" />
        </div>
        <div className={styles.field}>
          <div className={styles.label}>
            연락처 <span className={styles.req}>*</span>
          </div>
          <input className={styles.input} value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="010-0000-0000" />
        </div>
      </div>
      <div className={styles.field}>
        <div className={styles.label}>업종</div>
        <input className={styles.input} value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="예: 건축 · 토목" />
      </div>
      <div className={styles.field}>
        <div className={styles.label}>산업분야 (복수 선택)</div>
        <div className={styles.chips}>
          {INDUSTRIES.map((i) => (
            <button
              key={i.value}
              type="button"
              className={`${styles.chip} ${industries.includes(i.value) ? styles.chipOn : ""}`}
              onClick={() => setIndustries((p) => (p.includes(i.value) ? p.filter((x) => x !== i.value) : [...p, i.value]))}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.field}>
        <div className={styles.label}>현장 지역</div>
        <Chips options={REGIONS} selected={region} onToggle={(v) => setRegion((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))} />
      </div>

      <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
        <button className={styles.btnPrimary} onClick={submit} disabled={!valid || busy} style={{ flex: 1 }}>
          {busy ? "신청 중…" : "협약 신청하기"}
        </button>
        <button className={styles.btnSm} onClick={onCancel} style={{ flex: 1, height: 48, fontSize: 15 }}>
          취소
        </button>
      </div>
      <div className={styles.note}>신청 정보는 협약 검토 용도로만 사용됩니다.</div>
    </div>
  );
}

function CompanyLogin({ onDone, onCancel }: { onDone: (c: Company) => void; onCancel: () => void }) {
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const submit = async () => {
    if (!phone.trim() || busy) return;
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/companies/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contactPhone: phone.trim() }),
      });
      if (!res.ok) {
        setErr("해당 연락처로 신청된 협약을 찾을 수 없습니다.");
        setBusy(false);
        return;
      }
      onDone((await res.json()) as Company);
    } catch {
      setErr("로그인 중 오류가 발생했습니다.");
      setBusy(false);
    }
  };
  return (
    <div className={styles.panel} style={{ maxWidth: 480, margin: "0 auto" }}>
      <div className={styles.panelTitle}>기업 로그인</div>
      <div className={styles.panelSub}>협약 신청 시 입력한 연락처로 다시 들어올 수 있어요.</div>
      <div className={styles.field}>
        <div className={styles.label}>
          연락처 <span className={styles.req}>*</span>
        </div>
        <input
          className={styles.input}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="협약 신청 시 입력한 연락처"
          onKeyDown={(e) => {
            if (e.key === "Enter") void submit();
          }}
        />
      </div>
      {err && <div style={{ marginTop: 10, fontSize: 13, color: "#d9534f", fontWeight: 600 }}>{err}</div>}
      <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
        <button className={styles.btnPrimary} onClick={submit} disabled={!phone.trim() || busy} style={{ flex: 1 }}>
          {busy ? "로그인 중…" : "로그인"}
        </button>
        <button className={styles.btnSm} onClick={onCancel} style={{ flex: 1, height: 48, fontSize: 15 }}>
          취소
        </button>
      </div>
    </div>
  );
}

function Dashboard({
  company,
  tab,
  setTab,
  reloadCompany,
}: {
  company: Company;
  tab: Tab;
  setTab: (t: Tab) => void;
  reloadCompany: () => void;
}) {
  const groups: { label: string; items: { k: Tab; t: string }[] }[] = [
    { label: "", items: [{ k: "overview", t: "🏠 홈" }] },
    { label: "인력 확보", items: [{ k: "post", t: "채용 공고" }, { k: "work_requests", t: "현장 작업 요청" }] },
    {
      label: "인력 검토",
      items: [
        { k: "applications", t: "후보자" },
        { k: "workers", t: "기술자 조회" },
        { k: "teams", t: "팀 조회" },
        { k: "saved", t: "관심 기술자" },
      ],
    },
    { label: "협력사", items: [{ k: "profile", t: "신뢰 프로필" }, { k: "directory", t: "협력사 디렉터리" }] },
    { label: "", items: [{ k: "info", t: "협약 정보" }] },
  ];

  return (
    <>
      <div className={styles.tabs}>
        {groups.map((g, gi) => (
          <span key={gi} style={{ display: "flex", alignItems: "center" }}>
            {g.label && <span className={styles.tabGroupLabel}>{g.label}</span>}
            {g.items.map((x) => (
              <button
                key={x.k}
                className={`${styles.tab} ${tab === x.k ? styles.tabActive : ""}`}
                onClick={() => {
                  setTab(x.k);
                  if (x.k === "post") track("job_post_started");
                  if (x.k === "profile") track("company_profile_tab_viewed");
                  if (x.k === "directory") track("performer_directory_viewed");
                }}
              >
                {x.t}
              </button>
            ))}
          </span>
        ))}
      </div>

      {tab === "overview" && <OverviewTab company={company} setTab={setTab} />}
      {tab === "info" && <CompanyInfoView company={company} />}
      {tab === "post" && <PostTab companyId={company.id} reloadCompany={reloadCompany} />}
      {tab === "work_requests" && <WorkRequestsTab companyId={company.id} reloadCompany={reloadCompany} />}
      {tab === "applications" && <ApplicationsTab companyId={company.id} />}
      {tab === "workers" && <WorkersTab companyId={company.id} reloadCompany={reloadCompany} />}
      {tab === "teams" && <TeamsTab companyId={company.id} />}
      {tab === "saved" && <SavedTab companyId={company.id} />}
      {tab === "profile" && <ProfileTab company={company} reloadCompany={reloadCompany} />}
      {tab === "directory" && <DirectoryTab />}

      <PocBanner />
    </>
  );
}

function CompanyInfoView({ company }: { company: Company }) {
  const rows: [string, string][] = [
    ["회사명", company.name],
    ["담당자", company.contactName],
    ["연락처", company.contactPhone || "—"],
    ["이메일", company.contactEmail || "—"],
    ["업종", company.industry || "—"],
    ["현장 지역", company.region.length ? company.region.join(", ") : "—"],
    ["협약 상태", COMPANY_STATUS_LABEL[company.status] ?? company.status],
  ];
  return (
    <>
      <div className={styles.sectionTitle}>협약 신청 내역</div>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>{company.name}</div>
        <div className={styles.panelSub}>아래 정보로 협약을 신청했습니다.</div>
        <div style={{ marginTop: "16px" }}>
          {rows.map(([k, val]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "11px 0", borderBottom: "1px solid #eef0f3", fontSize: "14px" }}>
              <span style={{ color: "#5b6b82", fontWeight: 600, flex: "none" }}>{k}</span>
              <span style={{ color: "var(--brand-deep,#2c2d8f)", fontWeight: 700, textAlign: "right", minWidth: 0 }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.sectionTitle}>현황</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div className={styles.panel}>
          <div className={styles.panelSub}>등록 공고</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "26px", fontWeight: 500, color: "var(--brand-deep,#2c2d8f)", marginTop: "4px" }}>{company._count?.jobPosts ?? 0}</div>
        </div>
        <div className={styles.panel}>
          <div className={styles.panelSub}>관심 기술자</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "26px", fontWeight: 500, color: "var(--brand-deep,#2c2d8f)", marginTop: "4px" }}>{company._count?.savedWorkers ?? 0}</div>
        </div>
      </div>
    </>
  );
}

function PostTab({ companyId, reloadCompany }: { companyId: string; reloadCompany: () => void }) {
  const [posts, setPosts] = useState<JobPost[] | null>(null);
  const [title, setTitle] = useState("");
  const [jobType, setJobType] = useState<string[]>([]);
  const [region, setRegion] = useState<string[]>([]);
  const [headcount, setHeadcount] = useState("");
  const [careerLabel, setCareerLabel] = useState("");
  const [period, setPeriod] = useState("");
  const [conditions, setConditions] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [siteType, setSiteType] = useState<"" | "TODAY" | "LARGE">("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/companies/${companyId}/job-posts`, { cache: "no-store" });
      setPosts((await res.json()) as JobPost[]);
    } catch {
      setPosts([]);
    }
  }, [companyId]);

  useEffect(() => {
    void load();
  }, [load]);

  const del = async (postId: string) => {
    if (!window.confirm("이 공고를 삭제할까요? 연결된 지원·출근 기록도 함께 삭제됩니다.")) return;
    try {
      const res = await fetch(`/api/companies/${companyId}/job-posts/${postId}`, { method: "DELETE" });
      if (!res.ok) return;
      await load();
      reloadCompany();
    } catch {
      /* noop */
    }
  };

  const valid = title.trim() && jobType.length > 0 && region.length > 0;

  const submit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    try {
      const body: Record<string, unknown> = {
        title: title.trim(),
        jobType,
        region,
      };
      if (headcount.trim()) body.headcount = Number(headcount.trim());
      if (careerLabel) body.careerBand = CAREER_BAND[careerLabel as keyof typeof CAREER_BAND];
      if (period.trim()) body.period = period.trim();
      if (conditions.trim()) body.conditions = conditions.trim();
      if (isUrgent) body.isUrgent = true;
      if (siteType) body.siteType = siteType;
      await fetch(`/api/companies/${companyId}/job-posts`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      track("job_post_submitted", { jobType, region });
      if (isUrgent) track("urgent_job_post_requested", { jobType, region });
      setTitle("");
      setJobType([]);
      setRegion([]);
      setHeadcount("");
      setCareerLabel("");
      setPeriod("");
      setConditions("");
      setIsUrgent(false);
      setSiteType("");
      await load();
      reloadCompany();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>채용 공고 선등록</div>
        <div className={styles.panelSub}>현장 수요를 등록하면 조건에 맞는 검증 기술자를 우선 안내합니다.</div>

        <div className={styles.field}>
          <div className={styles.label}>
            공고 제목 <span className={styles.req}>*</span>
          </div>
          <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 힐스테이트 송도 형틀목공 모집" />
        </div>
        <div className={styles.field}>
          <div className={styles.label}>
            필요 직군 <span className={styles.req}>*</span>
          </div>
          <Chips options={JOB_TYPES} selected={jobType} onToggle={(v) => setJobType((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))} />
        </div>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <div className={styles.label}>모집 인원</div>
            <input className={styles.input} type="number" min={1} value={headcount} onChange={(e) => setHeadcount(e.target.value)} placeholder="예: 12" />
          </div>
          <div className={styles.field}>
            <div className={styles.label}>필요 최소 경력</div>
            <div className={styles.chips}>
              {CAREER_YEARS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`${styles.chip} ${careerLabel === c ? styles.chipOn : ""}`}
                  onClick={() => setCareerLabel((p) => (p === c ? "" : c))}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.label}>
            현장 지역 <span className={styles.req}>*</span>
          </div>
          <Chips options={REGIONS} selected={region} onToggle={(v) => setRegion((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))} />
        </div>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <div className={styles.label}>근무 기간</div>
            <input className={styles.input} value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="예: 3개월" />
          </div>
          <div className={styles.field}>
            <div className={styles.label}>근무 조건</div>
            <input className={styles.input} value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="예: 숙식 제공 · 주급" />
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.label}>현장 유형</div>
          <div style={{ display: "flex", gap: 8 }}>
            {([
              { key: "", label: "일반" },
              { key: "TODAY", label: "오늘 현장" },
              { key: "LARGE", label: "대형 현장" },
            ] as const).map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={`${styles.chip} ${siteType === opt.key ? styles.chipOn : ""}`}
                onClick={() => setSiteType(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={isUrgent}
            onChange={(e) => {
              setIsUrgent(e.target.checked);
              if (e.target.checked) track("urgent_job_post_clicked");
            }}
          />
          <span style={{ fontSize: 14, fontWeight: 600 }}>🔥 급구 공고로 등록 (상단 우선 노출)</span>
        </label>
        {isUrgent && (
          <div style={{ marginTop: 8 }}>
            <button
              type="button"
              className={styles.btnGhost}
              onClick={() => track("job_boost_interest_submitted")}
              style={{ fontSize: 13 }}
            >
              💰 상단 노출 유료 옵션 안내 받기
            </button>
          </div>
        )}

        <button className={styles.btnPrimary} onClick={submit} disabled={!valid || busy} style={{ marginTop: 22, width: "100%" }}>
          {busy ? "등록 중…" : "채용 공고 등록"}
        </button>
      </div>

      <PaidFeatureBanner
        feature="JOB_POSTING_FEE"
        title="급한 자리를 더 빨리 채우고 싶으신가요?"
        sub="긴급 공고 상단 노출 등 유료 기능이 준비 중입니다. 관심 있으시면 먼저 안내해 드립니다."
        cta="유료 기능 안내 받기"
      />

      <div className={styles.sectionTitle}>등록한 공고 {posts ? `(${posts.length})` : ""}</div>
      <div className={styles.panel}>
        {posts === null ? (
          <div className={styles.empty}>불러오는 중…</div>
        ) : posts.length === 0 ? (
          <div className={styles.empty}>아직 등록한 채용 공고가 없습니다.</div>
        ) : (
          posts.map((p) => {
            const b = jobPostBadge(p.status);
            return (
              <div className={styles.listItem} key={p.id}>
                <div className={styles.itemBody}>
                  <div className={styles.itemTitle}>
                    {p.isUrgent && <span style={{ color: "#dc2626", fontWeight: 800, marginRight: 4 }}>🔥급구</span>}
                    {p.siteType === "TODAY" && <span style={{ color: "#2563eb", fontWeight: 700, marginRight: 4 }}>[오늘현장]</span>}
                    {p.siteType === "LARGE" && <span style={{ color: "#7c3aed", fontWeight: 700, marginRight: 4 }}>[대형현장]</span>}
                    {p.title}
                  </div>
                  <div className={styles.itemSub}>
                    {p.jobType.join(", ")}
                    {p.headcount ? ` · ${p.headcount}명` : ""}
                    {p.careerBand ? ` · ${CAREER_BAND_LABEL[p.careerBand] ?? p.careerBand}+` : ""}
                    {p.region.length ? ` · ${p.region.join(", ")}` : ""}
                  </div>
                </div>
                <span className={`${styles.badge} ${b.cls}`}>{b.label}</span>
                <button
                  className={styles.btnSm}
                  onClick={() => del(p.id)}
                  style={{ marginLeft: "8px", height: "32px", padding: "0 12px" }}
                >
                  삭제
                </button>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

function WorkerCard({
  worker,
  saved,
  onSave,
  onView,
}: {
  worker: Worker;
  saved: boolean;
  onSave: () => void;
  onView: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.workerCard}>
      <div className={styles.workerHead}>
        <div className={styles.avatar}>{worker.name?.charAt(0) ?? "·"}</div>
        <div>
          <div className={styles.workerName}>{worker.name}</div>
          <div className={styles.workerMeta}>
            {worker.careerYears ? `${CAREER_BAND_LABEL[worker.careerYears] ?? worker.careerYears}` : "경력 미입력"}
            {worker.region.length ? ` · ${worker.region.join(", ")}` : ""}
          </div>
        </div>
      </div>
      <div className={styles.tagRow}>
        {worker.jobType.length ? (
          worker.jobType.map((j) => (
            <span className={styles.tag} key={j}>
              {j}
            </span>
          ))
        ) : (
          <span className={styles.tag}>직군 미입력</span>
        )}
      </div>
      <div className={styles.statRow}>
        <div className={styles.stat}>
          <b>{worker._count.careerCards}</b>경력
        </div>
        <div className={styles.stat}>
          <b>{worker._count.certificates}</b>자격
        </div>
        <div className={styles.stat}>
          <b>{worker._count.educations}</b>교육
        </div>
      </div>
      {open && worker.careerCards.length > 0 && (
        <div className={styles.note} style={{ marginTop: 10 }}>
          현장: {worker.careerCards.map((c) => c.siteName).join(" · ")}
        </div>
      )}
      <div className={styles.cardActions} style={{ display: "flex", gap: 8 }}>
        <button
          className={styles.btnSm}
          onClick={() => {
            if (!open) onView();
            setOpen((o) => !o);
          }}
        >
          {open ? "접기" : "프로필 보기"}
        </button>
        <button className={`${styles.btnSm} ${saved ? styles.btnSmSaved : ""}`} onClick={onSave} disabled={saved} style={{ flex: 1 }}>
          {saved ? "저장됨 ✓" : "관심 저장"}
        </button>
      </div>
    </div>
  );
}

function WorkersTab({ companyId, reloadCompany }: { companyId: string; reloadCompany: () => void }) {
  const [workers, setWorkers] = useState<Worker[] | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [jobType, setJobType] = useState("");
  const [region, setRegion] = useState("");

  const search = useCallback(async () => {
    setWorkers(null);
    const qs = new URLSearchParams();
    if (jobType) qs.set("jobType", jobType);
    if (region) qs.set("region", region);
    qs.set("limit", "60");
    try {
      const res = await fetch(`/api/workers?${qs.toString()}`, { cache: "no-store" });
      const data = (await res.json()) as Worker[];
      setWorkers(data);
      track("worker_search", { jobType: jobType || null, region: region || null, count: data.length });
    } catch {
      setWorkers([]);
    }
  }, [jobType, region]);

  const loadSaved = useCallback(async () => {
    try {
      const res = await fetch(`/api/companies/${companyId}/saved`, { cache: "no-store" });
      const data = (await res.json()) as Saved[];
      setSavedIds(new Set(data.map((s) => s.userId)));
    } catch {
      /* noop */
    }
  }, [companyId]);

  useEffect(() => {
    void search();
    void loadSaved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (userId: string) => {
    setSavedIds((p) => new Set(p).add(userId));
    try {
      const res = await fetch(`/api/companies/${companyId}/saved`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("save failed");
      track("candidate_saved", { userId });
      reloadCompany();
    } catch {
      // 실패 시 낙관적 추가 롤백(재시도 가능하게)
      setSavedIds((p) => {
        const n = new Set(p);
        n.delete(userId);
        return n;
      });
    }
  };

  return (
    <>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>검증 기술자 조회</div>
        <div className={styles.panelSub}>직군·지역으로 필터링해 조건에 맞는 기술자를 찾습니다.</div>
        <div className={styles.field}>
          <div className={styles.label}>직군</div>
          <div className={styles.chips}>
            <button type="button" className={`${styles.chip} ${jobType === "" ? styles.chipOn : ""}`} onClick={() => setJobType("")}>
              전체
            </button>
            {JOB_TYPES.map((j) => (
              <button key={j} type="button" className={`${styles.chip} ${jobType === j ? styles.chipOn : ""}`} onClick={() => setJobType(j)}>
                {j}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.label}>지역</div>
          <div className={styles.chips}>
            <button type="button" className={`${styles.chip} ${region === "" ? styles.chipOn : ""}`} onClick={() => setRegion("")}>
              전체
            </button>
            {REGIONS.map((r) => (
              <button key={r} type="button" className={`${styles.chip} ${region === r ? styles.chipOn : ""}`} onClick={() => setRegion(r)}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <button className={styles.btnPrimary} onClick={search} style={{ marginTop: 20 }}>
          기술자 검색
        </button>
      </div>

      <PaidFeatureBanner
        feature="CANDIDATE_VIEW_FEE"
        title="더 많은 후보 정보를 열람하고 싶으신가요?"
        sub="경력·자격·출근 이력까지 상세히 볼 수 있는 후보 열람 기능이 준비 중입니다. 관심 있으시면 먼저 안내해 드립니다."
        cta="유료 기능 안내 받기"
      />

      <div className={styles.sectionTitle}>{workers ? `검색 결과 ${workers.length}명` : "검색 중…"}</div>
      {workers === null ? (
        <div className={styles.empty}>불러오는 중…</div>
      ) : workers.length === 0 ? (
        <div className={styles.panel}>
          <div className={styles.empty}>조건에 맞는 기술자가 아직 없습니다. 기술자 가입이 늘면 이곳에 표시됩니다.</div>
        </div>
      ) : (
        <div className={styles.workerGrid}>
          {workers.map((w) => (
            <WorkerCard
              key={w.id}
              worker={w}
              saved={savedIds.has(w.id)}
              onSave={() => save(w.id)}
              onView={() => track("worker_profile_viewed_by_company", { userId: w.id })}
            />
          ))}
        </div>
      )}
    </>
  );
}

function TeamsTab({ companyId }: { companyId: string }) {
  const [teams, setTeams] = useState<TeamDir[] | null>(null);
  const [consultedIds, setConsultedIds] = useState<Set<string>>(new Set());
  const [industry, setIndustry] = useState("");
  const [region, setRegion] = useState("");

  const search = useCallback(async () => {
    setTeams(null);
    const qs = new URLSearchParams();
    if (industry) qs.set("industry", industry);
    if (region) qs.set("region", region);
    try {
      const res = await fetch(`/api/teams?${qs.toString()}`, { cache: "no-store" });
      const data = (await res.json()) as TeamDir[];
      setTeams(data);
    } catch {
      setTeams([]);
    }
  }, [industry, region]);

  const loadConsulted = useCallback(async () => {
    try {
      const res = await fetch(`/api/companies/${companyId}/consult-requests`, { cache: "no-store" });
      const data = (await res.json()) as { targetUserId: string }[];
      setConsultedIds(new Set(data.map((c) => c.targetUserId)));
    } catch {
      /* noop */
    }
  }, [companyId]);

  useEffect(() => {
    void search();
    void loadConsulted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestConsult = async (team: TeamDir) => {
    setConsultedIds((p) => new Set(p).add(team.leaderId));
    try {
      const res = await fetch(`/api/companies/${companyId}/consult-requests`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ targetUserId: team.leaderId, memo: `[팀매칭] ${team.name}` }),
      });
      if (!res.ok) throw new Error("consult request failed");
      track("team_matching_consult_requested", { teamId: team.id });
    } catch {
      setConsultedIds((p) => {
        const n = new Set(p);
        n.delete(team.leaderId);
        return n;
      });
    }
  };

  return (
    <>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>팀 조회</div>
        <div className={styles.panelSub}>산업분야·지역으로 필터링해 현장에 투입 가능한 팀을 찾습니다.</div>
        <div className={styles.field}>
          <div className={styles.label}>산업분야</div>
          <div className={styles.chips}>
            <button type="button" className={`${styles.chip} ${industry === "" ? styles.chipOn : ""}`} onClick={() => setIndustry("")}>
              전체
            </button>
            {INDUSTRIES.map((i) => (
              <button key={i.value} type="button" className={`${styles.chip} ${industry === i.value ? styles.chipOn : ""}`} onClick={() => setIndustry(i.value)}>
                {i.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.label}>지역</div>
          <div className={styles.chips}>
            <button type="button" className={`${styles.chip} ${region === "" ? styles.chipOn : ""}`} onClick={() => setRegion("")}>
              전체
            </button>
            {REGIONS.map((r) => (
              <button key={r} type="button" className={`${styles.chip} ${region === r ? styles.chipOn : ""}`} onClick={() => setRegion(r)}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <button className={styles.btnPrimary} onClick={search} style={{ marginTop: 20 }}>
          팀 검색
        </button>
      </div>

      <PaidFeatureBanner
        feature="TEAM_MATCHING"
        title="팀 단위로 바로 매칭받고 싶으신가요?"
        sub="여러 팀을 비교하고 조건에 맞는 팀과 성사되면 매칭 수수료로 정산하는 기능이 준비 중입니다. 관심 있으시면 먼저 안내해 드립니다."
        cta="유료 기능 안내 받기"
      />

      <div className={styles.sectionTitle}>{teams ? `검색 결과 ${teams.length}팀` : "검색 중…"}</div>
      {teams === null ? (
        <div className={styles.empty}>불러오는 중…</div>
      ) : teams.length === 0 ? (
        <div className={styles.panel}>
          <div className={styles.empty}>조건에 맞는 팀이 아직 없습니다. 현장 리더의 팀 등록이 늘면 이곳에 표시됩니다.</div>
        </div>
      ) : (
        <div className={styles.workerGrid}>
          {teams.map((t) => {
            const consulted = consultedIds.has(t.leaderId);
            return (
              <div
                className={styles.workerCard}
                key={t.id}
                onClick={() => track("team_profile_viewed_by_company", { teamId: t.id })}
              >
                <div className={styles.workerHead}>
                  <div className={styles.avatar}>{t.name?.charAt(0) ?? "·"}</div>
                  <div>
                    <div className={styles.workerName}>{t.name}</div>
                    <div className={styles.workerMeta}>
                      반장 {t.leader?.name ?? "미상"} · 팀원 {t._count.members}명
                      {t.regions.length ? ` · ${t.regions.join(", ")}` : ""}
                    </div>
                  </div>
                </div>
                <div className={styles.tagRow}>
                  {t.industries.map((i) => (
                    <span className={styles.tag} key={i}>
                      {INDUSTRIES.find((x) => x.value === i)?.label ?? i}
                    </span>
                  ))}
                  {t.workTypes.map((w) => (
                    <span className={styles.tag} key={w}>
                      {w}
                    </span>
                  ))}
                </div>
                <div className={styles.statRow}>
                  <div className={styles.stat}>
                    <b>{t._count.members}</b>팀원
                  </div>
                  <div className={styles.stat}>
                    <b>{t.safetyRate != null ? `${Math.round(t.safetyRate * 100)}%` : "-"}</b>안전이수율
                  </div>
                  <div className={styles.stat}>
                    <b>{t.equipOperators ?? 0}</b>장비운용
                  </div>
                </div>
                <div className={styles.cardActions} style={{ display: "flex", gap: 8 }}>
                  <button
                    className={`${styles.btnSm} ${consulted ? styles.btnSmSaved : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      requestConsult(t);
                    }}
                    disabled={consulted}
                    style={{ flex: 1 }}
                  >
                    {consulted ? "상담 요청됨 ✓" : "상담 요청"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function SavedTab({ companyId }: { companyId: string }) {
  const [saved, setSaved] = useState<Saved[] | null>(null);
  const [consultedIds, setConsultedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/companies/${companyId}/saved`, { cache: "no-store" });
        setSaved((await res.json()) as Saved[]);
      } catch {
        setSaved([]);
      }
      try {
        const res = await fetch(`/api/companies/${companyId}/consult-requests`, { cache: "no-store" });
        const data = (await res.json()) as { targetUserId: string }[];
        setConsultedIds(new Set(data.map((c) => c.targetUserId)));
      } catch {
        /* noop */
      }
    })();
  }, [companyId]);

  const requestConsult = async (userId: string) => {
    setConsultedIds((p) => new Set(p).add(userId));
    try {
      const res = await fetch(`/api/companies/${companyId}/consult-requests`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ targetUserId: userId }),
      });
      if (!res.ok) throw new Error("consult request failed");
      track("candidate_consult_requested", { userId });
    } catch {
      setConsultedIds((p) => {
        const n = new Set(p);
        n.delete(userId);
        return n;
      });
    }
  };

  return (
    <>
      <div className={styles.sectionTitle}>관심 기술자 {saved ? `(${saved.length})` : ""}</div>
      {saved === null ? (
        <div className={styles.empty}>불러오는 중…</div>
      ) : saved.length === 0 ? (
        <div className={styles.panel}>
          <div className={styles.empty}>아직 저장한 관심 기술자가 없습니다. ‘기술자 조회’에서 저장해 보세요.</div>
        </div>
      ) : (
        <div className={styles.workerGrid}>
          {saved.map((s) => (
            <div className={styles.workerCard} key={s.id}>
              <div className={styles.workerHead}>
                <div className={styles.avatar}>{s.user.name?.charAt(0) ?? "·"}</div>
                <div>
                  <div className={styles.workerName}>{s.user.name}</div>
                  <div className={styles.workerMeta}>
                    {s.user.careerYears ? CAREER_BAND_LABEL[s.user.careerYears] ?? s.user.careerYears : "경력 미입력"}
                    {s.user.region.length ? ` · ${s.user.region.join(", ")}` : ""}
                  </div>
                </div>
              </div>
              <div className={styles.tagRow}>
                {s.user.jobType.map((j) => (
                  <span className={styles.tag} key={j}>
                    {j}
                  </span>
                ))}
              </div>
              <div className={styles.statRow}>
                <div className={styles.stat}>
                  <b>{s.user._count.careerCards}</b>경력
                </div>
                <div className={styles.stat}>
                  <b>{s.user._count.certificates}</b>자격
                </div>
                <div className={styles.stat}>
                  <b>{s.user._count.educations}</b>교육
                </div>
              </div>
              <div className={styles.cardActions} style={{ display: "flex", gap: 8 }}>
                <button
                  className={`${styles.btnSm} ${consultedIds.has(s.userId) ? styles.btnSmSaved : ""}`}
                  onClick={() => requestConsult(s.userId)}
                  disabled={consultedIds.has(s.userId)}
                  style={{ flex: 1 }}
                >
                  {consultedIds.has(s.userId) ? "상담 요청됨 ✓" : "상담 요청"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function OverviewTab({ company, setTab }: { company: Company; setTab: (t: Tab) => void }) {
  const [appCount, setAppCount] = useState<number | null>(null);
  const [wrCount, setWrCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [apps, wrs] = await Promise.all([
          fetch(`/api/companies/${company.id}/applications`, { cache: "no-store" }).then((r) => r.json()).catch(() => []),
          fetch(`/api/companies/${company.id}/work-requests`, { cache: "no-store" }).then((r) => r.json()).catch(() => []),
        ]);
        setAppCount(Array.isArray(apps) ? apps.length : 0);
        setWrCount(Array.isArray(wrs) ? wrs.length : 0);
      } catch {
        setAppCount(0);
        setWrCount(0);
      }
    })();
  }, [company.id]);

  const profileComplete = !!(company.companyKind && (company.industries?.length ?? 0) > 0 && company.safetyRate != null);

  const kpis: { label: string; value: number | null; icon: string }[] = [
    { label: "등록 공고", value: company._count?.jobPosts ?? 0, icon: "📋" },
    { label: "후보자", value: appCount, icon: "🧑‍🔧" },
    { label: "관심 기술자", value: company._count?.savedWorkers ?? 0, icon: "⭐" },
    { label: "현장 작업 요청", value: wrCount, icon: "🏗️" },
  ];

  return (
    <>
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e2547)", borderRadius: 20, padding: "26px 26px 24px", color: "#fff", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 900, background: "rgba(255,255,255,0.14)", padding: "4px 10px", borderRadius: 999 }}>
            Partner Workspace
          </span>
          <span style={{ fontSize: 13, color: "#a5b4fc", fontWeight: 700 }}>
            {COMPANY_KIND_LABEL[company.companyKind ?? "PERFORMER"]}
          </span>
        </div>
        <div style={{ fontSize: 21, fontWeight: 900, marginTop: 12 }}>안녕하세요, {company.contactName}님</div>
        <div style={{ fontSize: 13, color: "#cbd5e1", fontWeight: 600, marginTop: 6, wordBreak: "keep-all" }}>
          {company.name} · {COMPANY_STATUS_LABEL[company.status] ?? company.status}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
        {kpis.map((k) => (
          <div key={k.label} className={styles.panel} style={{ padding: 18 }}>
            <div style={{ fontSize: 19 }}>{k.icon}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 25, fontWeight: 700, color: "#0f172a", marginTop: 8 }}>
              {k.value == null ? "···" : k.value}
            </div>
            <div style={{ fontSize: 12.5, color: "#5b6b82", fontWeight: 650, marginTop: 4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {!profileComplete && (
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 16, padding: "18px 20px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 850, color: "#9a3412" }}>신뢰 프로필을 완성해 보세요</div>
            <div style={{ fontSize: 12.5, color: "#c2410c", fontWeight: 600, marginTop: 4, wordBreak: "keep-all" }}>
              안전이수율·작업수행사례를 등록하면 원청·대기업 협력사 디렉터리에 우리 회사가 노출됩니다.
            </div>
          </div>
          <button className={styles.btnPrimary} onClick={() => setTab("profile")} style={{ height: 40, fontSize: 13, flexShrink: 0 }}>
            프로필 완성하기
          </button>
        </div>
      )}

      <div className={styles.sectionTitle}>바로가기</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {(
          [
            { t: "급구 공고 등록", d: "현장 수요를 지금 바로 등록합니다", tab: "post" as Tab, icon: "🔥" },
            { t: "기술자 검색", d: "경력·자격이 검증된 기술자를 찾습니다", tab: "workers" as Tab, icon: "🔎" },
            { t: "팀 조회", d: "현장에 투입 가능한 팀을 찾습니다", tab: "teams" as Tab, icon: "👷" },
            { t: "협력사 디렉터리", d: "신뢰할 수 있는 협력사를 찾습니다", tab: "directory" as Tab, icon: "🏢" },
          ] as { t: string; d: string; tab: Tab; icon: string }[]
        ).map((q) => (
          <button
            key={q.t}
            onClick={() => setTab(q.tab)}
            style={{ textAlign: "left", background: "#fff", border: "1px solid #e6e8ec", borderRadius: 16, padding: 18, cursor: "pointer" }}
          >
            <div style={{ fontSize: 19 }}>{q.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 850, color: "#0f172a", marginTop: 8 }}>{q.t}</div>
            <div style={{ fontSize: 12, color: "#5b6b82", fontWeight: 600, marginTop: 4, wordBreak: "keep-all" }}>{q.d}</div>
          </button>
        ))}
      </div>
    </>
  );
}

function ProfileTab({ company, reloadCompany }: { company: Company; reloadCompany: () => void }) {
  const [companyKind, setCompanyKind] = useState<"PERFORMER" | "OPERATOR">(company.companyKind ?? "PERFORMER");
  const [industries, setIndustries] = useState<string[]>(company.industries ?? []);
  const [safetyRate, setSafetyRate] = useState(company.safetyRate != null ? String(Math.round(company.safetyRate * 100)) : "");
  const [rehireRate, setRehireRate] = useState(company.rehireRate != null ? String(Math.round(company.rehireRate * 100)) : "");
  const [memo, setMemo] = useState(company.memo ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveProfile = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const body: Record<string, unknown> = { companyKind, industries };
      if (safetyRate.trim()) body.safetyRate = Math.min(1, Math.max(0, Number(safetyRate) / 100));
      if (rehireRate.trim()) body.rehireRate = Math.min(1, Math.max(0, Number(rehireRate) / 100));
      body.memo = memo.trim() || undefined;
      await fetch(`/api/companies/${company.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      track("company_profile_updated", { companyKind });
      reloadCompany();
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const [records, setRecords] = useState<WorkRecord[] | null>(null);
  const loadRecords = useCallback(async () => {
    try {
      const res = await fetch(`/api/companies/${company.id}/work-records`, { cache: "no-store" });
      setRecords((await res.json()) as WorkRecord[]);
    } catch {
      setRecords([]);
    }
  }, [company.id]);
  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  const [rIndustry, setRIndustry] = useState(INDUSTRIES[0].value as string);
  const [rTitle, setRTitle] = useState("");
  const [rSite, setRSite] = useState("");
  const [rPeriod, setRPeriod] = useState("");
  const [rScale, setRScale] = useState("");
  const [rDesc, setRDesc] = useState("");
  const [rBusy, setRBusy] = useState(false);

  const addRecord = async () => {
    if (!rTitle.trim() || rBusy) return;
    setRBusy(true);
    try {
      await fetch(`/api/companies/${company.id}/work-records`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          industry: rIndustry,
          title: rTitle.trim(),
          siteName: rSite.trim() || undefined,
          period: rPeriod.trim() || undefined,
          scaleMemo: rScale.trim() || undefined,
          description: rDesc.trim() || undefined,
        }),
      });
      track("work_record_added", { industry: rIndustry });
      setRTitle("");
      setRSite("");
      setRPeriod("");
      setRScale("");
      setRDesc("");
      await loadRecords();
    } finally {
      setRBusy(false);
    }
  };

  const delRecord = async (rid: string) => {
    if (!window.confirm("이 작업수행사례를 삭제할까요?")) return;
    try {
      await fetch(`/api/companies/${company.id}/work-records/${rid}`, { method: "DELETE" });
      await loadRecords();
    } catch {
      /* noop */
    }
  };

  return (
    <>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>협력사 신뢰 프로필</div>
        <div className={styles.panelSub}>
          안전이수율·재의뢰율·작업수행사례를 등록하면 원청·대기업이 협력사 디렉터리에서 우리 회사를 발견할 수 있습니다.
        </div>

        <div className={styles.field}>
          <div className={styles.label}>파트너 유형</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {(
              [
                { k: "PERFORMER" as const, t: "협력업체 · 전문시공" },
                { k: "OPERATOR" as const, t: "원청 · 발주처" },
              ]
            ).map((opt) => (
              <button
                key={opt.k}
                type="button"
                onClick={() => setCompanyKind(opt.k)}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: `1.5px solid ${companyKind === opt.k ? "var(--brand,#4f46e5)" : "#e6e8ec"}`,
                  background: companyKind === opt.k ? "var(--brand-tint,#ecedfb)" : "#fff",
                  fontSize: 13.5,
                  fontWeight: 800,
                  color: "#0f172a",
                  cursor: "pointer",
                }}
              >
                {opt.t}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.label}>산업분야 (복수 선택)</div>
          <div className={styles.chips}>
            {INDUSTRIES.map((i) => (
              <button
                key={i.value}
                type="button"
                className={`${styles.chip} ${industries.includes(i.value) ? styles.chipOn : ""}`}
                onClick={() => setIndustries((p) => (p.includes(i.value) ? p.filter((x) => x !== i.value) : [...p, i.value]))}
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid2}>
          <div className={styles.field}>
            <div className={styles.label}>안전이수율 (%)</div>
            <input className={styles.input} type="number" min={0} max={100} value={safetyRate} onChange={(e) => setSafetyRate(e.target.value)} placeholder="예: 95" />
          </div>
          <div className={styles.field}>
            <div className={styles.label}>재의뢰율 (%)</div>
            <input className={styles.input} type="number" min={0} max={100} value={rehireRate} onChange={(e) => setRehireRate(e.target.value)} placeholder="예: 88" />
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.label}>소개 메모</div>
          <input className={styles.input} value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="우리 회사의 강점을 한 줄로 소개해 주세요" />
        </div>

        <button className={styles.btnPrimary} onClick={saveProfile} disabled={saving} style={{ marginTop: 18, width: "100%" }}>
          {saving ? "저장 중…" : saved ? "저장됨 ✓" : "프로필 저장"}
        </button>
      </div>

      <div className={styles.sectionTitle}>작업수행사례 {records ? `(${records.length})` : ""}</div>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>작업수행사례 등록</div>
        <div className={styles.panelSub}>완료한 프로젝트를 등록하면 신뢰 프로필의 근거 자료가 됩니다.</div>
        <div className={styles.field}>
          <div className={styles.label}>산업분야</div>
          <select className={styles.input} value={rIndustry} onChange={(e) => setRIndustry(e.target.value)}>
            {INDUSTRIES.map((i) => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <div className={styles.label}>
            제목 <span className={styles.req}>*</span>
          </div>
          <input className={styles.input} value={rTitle} onChange={(e) => setRTitle(e.target.value)} placeholder="예: 힐스테이트 송도 골조 공사" />
        </div>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <div className={styles.label}>현장명</div>
            <input className={styles.input} value={rSite} onChange={(e) => setRSite(e.target.value)} placeholder="예: 힐스테이트 송도" />
          </div>
          <div className={styles.field}>
            <div className={styles.label}>수행 기간</div>
            <input className={styles.input} value={rPeriod} onChange={(e) => setRPeriod(e.target.value)} placeholder="예: 2025.03 ~ 2025.09" />
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.label}>규모</div>
          <input className={styles.input} value={rScale} onChange={(e) => setRScale(e.target.value)} placeholder="예: 지상 25층, 연면적 3.2만평" />
        </div>
        <div className={styles.field}>
          <div className={styles.label}>설명</div>
          <input className={styles.input} value={rDesc} onChange={(e) => setRDesc(e.target.value)} placeholder="수행 역할, 성과 등을 간단히 적어주세요" />
        </div>
        <button className={styles.btnPrimary} onClick={addRecord} disabled={!rTitle.trim() || rBusy} style={{ marginTop: 16, width: "100%" }}>
          {rBusy ? "등록 중…" : "작업수행사례 등록"}
        </button>
      </div>

      <div className={styles.panel}>
        {records === null ? (
          <div className={styles.empty}>불러오는 중…</div>
        ) : records.length === 0 ? (
          <div className={styles.empty}>아직 등록한 작업수행사례가 없습니다.</div>
        ) : (
          records.map((r) => (
            <div className={styles.listItem} key={r.id}>
              <div className={styles.itemBody}>
                <div className={styles.itemTitle}>{r.title}</div>
                <div className={styles.itemSub}>
                  {INDUSTRIES.find((i) => i.value === r.industry)?.label ?? r.industry}
                  {r.siteName ? ` · ${r.siteName}` : ""}
                  {r.period ? ` · ${r.period}` : ""}
                  {r.scaleMemo ? ` · ${r.scaleMemo}` : ""}
                </div>
              </div>
              <button className={styles.btnSm} onClick={() => delRecord(r.id)} style={{ marginLeft: 8, height: 32, padding: "0 12px" }}>
                삭제
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

function DirectoryTab() {
  const [companies, setCompanies] = useState<PerformerCompany[] | null>(null);
  const [industry, setIndustry] = useState("");
  const [region, setRegion] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [openRecords, setOpenRecords] = useState<WorkRecord[] | null>(null);

  const search = useCallback(async () => {
    setCompanies(null);
    const qs = new URLSearchParams();
    if (industry) qs.set("industry", industry);
    if (region) qs.set("region", region);
    try {
      const res = await fetch(`/api/performers?${qs.toString()}`, { cache: "no-store" });
      const data = (await res.json()) as PerformerCompany[];
      setCompanies(data);
      track("performer_search", { industry: industry || null, region: region || null, count: data.length });
    } catch {
      setCompanies([]);
    }
  }, [industry, region]);

  useEffect(() => {
    void search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const viewProfile = async (id: string) => {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    setOpenRecords(null);
    try {
      const res = await fetch(`/api/companies/${id}/profile`, { cache: "no-store" });
      const data = (await res.json()) as { workRecords: WorkRecord[] };
      setOpenRecords(data.workRecords ?? []);
      track("performer_profile_viewed", { companyId: id });
    } catch {
      setOpenRecords([]);
    }
  };

  return (
    <>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>협력사 디렉터리</div>
        <div className={styles.panelSub}>산업분야·지역으로 필터링해 검증된 협력사(수행기업)를 찾습니다.</div>
        <div className={styles.field}>
          <div className={styles.label}>산업분야</div>
          <div className={styles.chips}>
            <button type="button" className={`${styles.chip} ${industry === "" ? styles.chipOn : ""}`} onClick={() => setIndustry("")}>
              전체
            </button>
            {INDUSTRIES.map((i) => (
              <button key={i.value} type="button" className={`${styles.chip} ${industry === i.value ? styles.chipOn : ""}`} onClick={() => setIndustry(i.value)}>
                {i.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.label}>지역</div>
          <div className={styles.chips}>
            <button type="button" className={`${styles.chip} ${region === "" ? styles.chipOn : ""}`} onClick={() => setRegion("")}>
              전체
            </button>
            {REGIONS.map((r) => (
              <button key={r} type="button" className={`${styles.chip} ${region === r ? styles.chipOn : ""}`} onClick={() => setRegion(r)}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <button className={styles.btnPrimary} onClick={search} style={{ marginTop: 20 }}>
          협력사 검색
        </button>
      </div>

      <div className={styles.sectionTitle}>{companies ? `검색 결과 ${companies.length}곳` : "검색 중…"}</div>
      {companies === null ? (
        <div className={styles.empty}>불러오는 중…</div>
      ) : companies.length === 0 ? (
        <div className={styles.panel}>
          <div className={styles.empty}>조건에 맞는 협력사가 아직 없습니다. 협력사의 프로필 등록이 늘면 이곳에 표시됩니다.</div>
        </div>
      ) : (
        <div className={styles.workerGrid}>
          {companies.map((c) => (
            <div className={styles.workerCard} key={c.id}>
              <div className={styles.workerHead}>
                <div className={styles.avatar}>{c.name?.charAt(0) ?? "·"}</div>
                <div>
                  <div className={styles.workerName}>{c.name}</div>
                  <div className={styles.workerMeta}>{c.region.length ? c.region.join(", ") : "지역 미입력"}</div>
                </div>
              </div>
              <div className={styles.tagRow}>
                {c.industries.length ? (
                  c.industries.map((iv) => (
                    <span className={styles.tag} key={iv}>
                      {INDUSTRIES.find((i) => i.value === iv)?.label ?? iv}
                    </span>
                  ))
                ) : (
                  <span className={styles.tag}>산업분야 미입력</span>
                )}
              </div>
              <div className={styles.statRow}>
                <div className={styles.stat}>
                  <b>{pct(c.safetyRate)}</b>안전이수율
                </div>
                <div className={styles.stat}>
                  <b>{pct(c.rehireRate)}</b>재의뢰율
                </div>
                <div className={styles.stat}>
                  <b>{c._count.workRecords}</b>작업사례
                </div>
              </div>
              {openId === c.id && (
                <div className={styles.note} style={{ marginTop: 10 }}>
                  {openRecords === null ? (
                    "불러오는 중…"
                  ) : openRecords.length === 0 ? (
                    "등록된 작업수행사례가 없습니다."
                  ) : (
                    openRecords.map((r) => (
                      <div key={r.id} style={{ marginBottom: 6 }}>
                        · {r.title}
                        {r.siteName ? ` (${r.siteName})` : ""}
                      </div>
                    ))
                  )}
                </div>
              )}
              <div className={styles.cardActions} style={{ display: "flex", gap: 8 }}>
                <button className={styles.btnSm} onClick={() => viewProfile(c.id)} style={{ flex: 1 }}>
                  {openId === c.id ? "접기" : "작업수행사례 보기"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

interface Application {
  id: string;
  status: string;
  jobPost: { id: string; title: string };
  user: {
    id: string;
    name: string | null;
    jobType: string[];
    careerYears: string | null;
    region: string[];
    _count: { careerCards: number; certificates: number; educations: number };
  };
}

function appStatusBadge(status: string): { label: string; cls: string } {
  switch (status) {
    case "ACCEPTED":
      return { label: "수락(배정)", cls: styles.badgeOpen };
    case "REJECTED":
      return { label: "반려", cls: styles.badgeClosed };
    case "REVIEWING":
      return { label: "확인 중", cls: styles.badgePending };
    case "CONTACT_PENDING":
      return { label: "담당자 연락 예정", cls: styles.badgePending };
    default:
      return { label: "지원함", cls: styles.badgePending };
  }
}

function ApplicationsTab({ companyId }: { companyId: string }) {
  const [apps, setApps] = useState<Application[] | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/companies/${companyId}/applications`, { cache: "no-store" });
      setApps((await res.json()) as Application[]);
    } catch {
      setApps([]);
    }
  }, [companyId]);

  useEffect(() => {
    void load();
  }, [load]);

  const setStatus = async (id: string, status: "ACCEPTED" | "REJECTED" | "REVIEWING" | "CONTACT_PENDING") => {
    setApps((p) => (p ? p.map((a) => (a.id === id ? { ...a, status } : a)) : p));
    if (status === "ACCEPTED") track("application_accepted", { applicationId: id });
    try {
      await fetch(`/api/applications/${id}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch {
      /* noop */
    }
  };

  return (
    <>
      <div className={styles.sectionTitle}>후보자 {apps ? `(${apps.length})` : ""}</div>
      {apps === null ? (
        <div className={styles.empty}>불러오는 중…</div>
      ) : apps.length === 0 ? (
        <div className={styles.panel}>
          <div className={styles.empty}>아직 후보자가 없습니다. 채용 공고가 노출되면 후보자가 여기에 표시됩니다.</div>
        </div>
      ) : (
        <div className={styles.workerGrid}>
          {apps.map((a) => {
            const b = appStatusBadge(a.status);
            return (
              <div className={styles.workerCard} key={a.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                  <div className={styles.workerHead}>
                    <div className={styles.avatar}>{a.user.name?.charAt(0) ?? "·"}</div>
                    <div>
                      <div className={styles.workerName}>{a.user.name ?? "(이름 미입력)"}</div>
                      <div className={styles.workerMeta}>
                        {a.user.careerYears ? CAREER_BAND_LABEL[a.user.careerYears] ?? a.user.careerYears : "경력 미입력"}
                        {a.user.region.length ? ` · ${a.user.region.join(", ")}` : ""}
                      </div>
                    </div>
                  </div>
                  <span className={`${styles.badge} ${b.cls}`}>{b.label}</span>
                </div>
                <div className={styles.workerMeta} style={{ marginTop: "10px" }}>지원 공고: {a.jobPost.title}</div>
                <div className={styles.tagRow}>
                  {a.user.jobType.map((j) => (
                    <span className={styles.tag} key={j}>
                      {j}
                    </span>
                  ))}
                </div>
                <div className={styles.statRow}>
                  <div className={styles.stat}>
                    <b>{a.user._count.careerCards}</b>경력
                  </div>
                  <div className={styles.stat}>
                    <b>{a.user._count.certificates}</b>자격
                  </div>
                  <div className={styles.stat}>
                    <b>{a.user._count.educations}</b>교육
                  </div>
                </div>
                {(a.status === "APPLIED" || a.status === "REVIEWING" || a.status === "CONTACT_PENDING") && (
                  <>
                    {a.status === "APPLIED" && (
                      <div className={styles.cardActions} style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                        <button className={styles.btnSm} onClick={() => setStatus(a.id, "REVIEWING")} style={{ flex: 1, fontSize: "12px" }}>
                          확인 중으로 표시
                        </button>
                        <button className={styles.btnSm} onClick={() => setStatus(a.id, "CONTACT_PENDING")} style={{ flex: 1, fontSize: "12px" }}>
                          연락 예정으로 표시
                        </button>
                      </div>
                    )}
                    <div className={styles.cardActions} style={{ display: "flex", gap: "8px" }}>
                      <button className={styles.btnSm} onClick={() => setStatus(a.id, "REJECTED")}>
                        반려
                      </button>
                      <button className={styles.btnPrimary} style={{ flex: 1, height: "38px", fontSize: "13px" }} onClick={() => setStatus(a.id, "ACCEPTED")}>
                        수락(배정)
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function WorkRequestsTab({ companyId, reloadCompany }: { companyId: string; reloadCompany: () => void }) {
  const [requests, setRequests] = useState<any[] | null>(null);
  const [industry, setIndustry] = useState("CONSTRUCTION");
  const [workTypes, setWorkTypes] = useState("");
  const [region, setRegion] = useState<string[]>([]);
  const [headcount, setHeadcount] = useState("");
  const [budgetMemo, setBudgetMemo] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/companies/${companyId}/work-requests`, { cache: "no-store" });
      setRequests(await res.json());
    } catch {
      setRequests([]);
    }
  }, [companyId]);

  useEffect(() => {
    void load();
  }, [load]);

  const valid = region.length > 0;

  const submit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    try {
      const body: Record<string, unknown> = {
        companyId,
        industry,
        region,
      };
      if (workTypes.trim()) body.workTypes = workTypes.split(",").map(s => s.trim());
      if (headcount.trim()) body.headcount = Number(headcount.trim());
      if (budgetMemo.trim()) body.budgetMemo = budgetMemo.trim();

      await fetch(`/api/work-requests`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      track("work_request_submitted", { industry, region });
      setWorkTypes("");
      setRegion([]);
      setHeadcount("");
      setBudgetMemo("");
      await load();
      reloadCompany();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>현장현장 작업 요청 등록</div>
        <div className={styles.panelSub}>팀 단위, 공종 단위로 현장작업을 발주 요청합니다.</div>

        <div className={styles.field}>
          <div className={styles.label}>산업 유형 <span className={styles.req}>*</span></div>
          <select className={styles.input} value={industry} onChange={(e) => setIndustry(e.target.value)}>
            <option value="CONSTRUCTION">건설/건축</option>
            <option value="MANUFACTURING">제조/생산</option>
            <option value="LOGISTICS">물류/운송</option>
            <option value="SHIPBUILDING">조선/해양</option>
            <option value="MAINTENANCE">유지/보수</option>
          </select>
        </div>

        <div className={styles.field}>
          <div className={styles.label}>작업 유형 (콤마로 구분)</div>
          <input className={styles.input} value={workTypes} onChange={(e) => setWorkTypes(e.target.value)} placeholder="예: 거푸집설치, 철근배근" />
        </div>

        <div className={styles.field}>
          <div className={styles.label}>현장 지역 <span className={styles.req}>*</span></div>
          <Chips options={REGIONS} selected={region} onToggle={(v) => setRegion((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))} />
        </div>

        <div className={styles.grid2}>
          <div className={styles.field}>
            <div className={styles.label}>필요 인원</div>
            <input className={styles.input} type="number" min={1} value={headcount} onChange={(e) => setHeadcount(e.target.value)} placeholder="예: 5" />
          </div>
          <div className={styles.field}>
            <div className={styles.label}>예산 규모 메모</div>
            <input className={styles.input} value={budgetMemo} onChange={(e) => setBudgetMemo(e.target.value)} placeholder="예: 평당 10만원" />
          </div>
        </div>

        <button className={styles.btnPrimary} style={{ marginTop: "16px" }} onClick={submit} disabled={!valid || busy}>
          {busy ? "등록 중…" : "현장 작업 요청 등록하기"}
        </button>
      </div>

      <div className={styles.sectionTitle}>등록한 현장현장 작업 요청 {requests ? `(${requests.length})` : ""}</div>
      {requests === null ? (
        <div className={styles.empty}>불러오는 중…</div>
      ) : requests.length === 0 ? (
        <div className={styles.panel}>
          <div className={styles.empty}>아직 등록한 현장 작업 요청이 없습니다.</div>
        </div>
      ) : (
        <div className={styles.workerGrid}>
          {requests.map((r) => (
            <div className={styles.workerCard} key={r.id}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className={styles.workerName}>{r.industry} · {r.workTypes?.join(", ")}</div>
                <span className={`${styles.badge} ${jobPostBadge(r.status).cls}`}>{r.status}</span>
              </div>
              <div className={styles.workerMeta} style={{ marginTop: "8px" }}>
                지역: {r.region?.join(", ")}
                {r.headcount && ` · 인원: ${r.headcount}명`}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function PaidFeatureBanner({ feature, title, sub, cta }: { feature: "JOB_POSTING_FEE" | "CANDIDATE_VIEW_FEE" | "TEAM_MATCHING"; title: string; sub: string; cta: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className={styles.pocBanner}>
      <div className={styles.pocText}>
        <div className={styles.pocTitle}>{title}</div>
        <div className={styles.pocSub}>{sub}</div>
      </div>
      <button
        className={styles.btnGhost}
        onClick={() => {
          track("paid_feature_interest_submitted", { feature });
          setDone(true);
        }}
        disabled={done}
        style={done ? { opacity: 0.6 } : undefined}
      >
        {done ? "신청 완료 ✓" : cta}
      </button>
    </div>
  );
}

function PocBanner() {
  const [done, setDone] = useState(false);
  return (
    <div className={styles.pocBanner}>
      <div className={styles.pocText}>
        <div className={styles.pocTitle}>현장에 바로 투입할 기술자·팀이 필요하신가요?</div>
        <div className={styles.pocSub}>기술자·팀 요청·시범 운영(PoC)을 신청하면 담당 매니저가 조건에 맞는 기술자 매칭을 도와드립니다.</div>
      </div>
      <button
        className={styles.btnGhost}
        onClick={() => {
          track("poc_interest_submitted");
          track("workforce_request_submitted");
          setDone(true);
        }}
        disabled={done}
        style={done ? { opacity: 0.6 } : undefined}
      >
        {done ? "신청 완료 ✓" : "기술자·팀 요청 · PoC 신청"}
      </button>
    </div>
  );
}
