"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./admin.module.css";
import { EVENT_CATALOG, type AnalyticsEventName, type EventCategory } from "@/lib/analytics";
import { CAREER_BAND_LABEL, INTEREST_FEATURES } from "@/lib/constants";
import ForeignAdminView from "./ForeignAdminView";
import AdminOpsView from "./AdminOpsView";
import { LeadsView, InterviewsView, SurveyResponsesView, PocInterestView } from "./LeadCrmView";

interface Overview {
  counts: {
    users: number;
    verifiedProfiles: number;
    careerCards: number;
    certificates: number;
    educations: number;
    interests: number;
    events: number;
    companies: number;
    jobPosts: number;
    foremanRequests: number;
    workRequests: number;
    reviews: number;
    teams: number;
    fieldOpsInterests: number;
    performerCompanies: number;
    operators: number;
  };
  funnel: { key: string; label: string; count: number }[];
  interestByFeature: { feature: string; count: number }[];
  roleDistribution: { role: string; count: number }[];
  workRequestsByIndustry: { industry: string; count: number }[];
}
interface ForemanReq {
  id: string;
  name: string | null;
  phone: string | null;
  jobType: string[];
  careerYears: string | null;
  region: string[];
  createdAt: string;
  _count: { careerCards: number; certificates: number; educations: number };
}
interface AdminUser {
  id: string;
  name: string | null;
  role: "WORKER" | "FIELD_LEADER" | "CUSTOMER" | "PROJECT_OPERATOR" | "PERFORMER_COMPANY";
  phone: string | null;
  email: string | null;
  jobType: string[];
  careerYears: string | null;
  region: string[];
  createdAt: string;
  _count: { careerCards: number; certificates: number; educations: number; interests: number };
}
interface AdminEvent {
  id: string;
  name: string;
  userId: string | null;
  props: unknown;
  createdAt: string;
}

type Tab = "overview" | "foreman" | "users" | "events" | "jobposts" | "industry" | "workrequests" | "reviews" | "poc" | "foreign" | "ops" | "community" | "bm-leads" | "candidates" | "teams" | "leads" | "interviews" | "surveys" | "poc-interest";

interface AdminBMInquiry {
  id: string;
  companyName: string;
  contactName: string;
  contactMethod: string;
  interests: string[];
  message: string | null;
  status: string;
  createdAt: string;
}

interface PocReport {
  generatedAt: string;
  industries: { industry: string; workRequests: number; performers: number; teams: number; workRecords: number }[];
  totals: { reviews: number; fieldOpsInterests: number; candidates: number; trustScores: number; avgTrustScore: number | null };
}

interface AdminWorkRequest {
  id: string;
  industry: string;
  region: string[];
  status: string;
  headcount: number | null;
  createdAt: string;
  requester: { name: string | null; role: string } | null;
  _count: { candidates: number };
}
interface AdminReview {
  id: string;
  rateeType: string;
  rateeId: string;
  workQuality: number | null;
  safetyManagement: number | null;
  comment: string | null;
  createdAt: string;
  rater: { name: string | null; role: string } | null;
}
interface AdminSavedWorker {
  id: string;
  memo: string | null;
  createdAt: string;
  company: { id: string; name: string };
  user: { id: string; name: string | null; jobType: string[]; region: string[]; careerYears: string | null };
}
interface AdminConsultRequest {
  id: string;
  status: string;
  memo: string | null;
  createdAt: string;
  company: { id: string; name: string };
  targetUser: { id: string; name: string | null };
}
interface AdminCandidates {
  saved: AdminSavedWorker[];
  consults: AdminConsultRequest[];
}
interface AdminTeam {
  id: string;
  name: string;
  industries: string[];
  workTypes: string[];
  regions: string[];
  createdAt: string;
  leader: { id: string; name: string | null; phone: string | null };
  members: { user: { id: string; name: string | null } }[];
}

// 캐노니컬 라벨(운영 콘솔 표시용)
const ROLE_LABEL: Record<string, string> = {
  WORKER: "기술자",
  FIELD_LEADER: "현장리더",
  CUSTOMER: "작업요청자",
  PROJECT_OPERATOR: "운영자",
  PERFORMER_COMPANY: "수행기업",
};
const INDUSTRY_LABEL_KO: Record<string, string> = {
  INTERIOR_REMODELING: "인테리어·리모델링",
  CONSTRUCTION_FACILITY: "건설·설비",
  SHIPBUILDING: "조선",
  PLANT: "플랜트",
  MANUFACTURING_FACILITY: "제조설비",
  LOGISTICS_EQUIPMENT: "물류장비",
  ENERGY_FACILITY: "에너지설비",
  PORT_AIRPORT: "항만·공항",
  PUBLIC_INFRA: "공공인프라",
  DISASTER_RECOVERY: "재난복구",
  SPACE_ROBOTICS: "우주·로봇",
  ETC: "기타",
};
const WR_STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  DRAFT: { label: "작성 중", cls: "catOther" },
  OPEN: { label: "후보 모집", cls: "catReturn" },
  MATCHING: { label: "매칭 중", cls: "catProfile" },
  ASSIGNED: { label: "수행 확정", cls: "catSignup" },
  COMPLETED: { label: "완료", cls: "catInterest" },
  CLOSED: { label: "종료", cls: "catOther" },
  CANCELLED: { label: "취소", cls: "catOther" },
};

interface AdminJobPost {
  id: string;
  title: string;
  jobType: string[];
  headcount: number | null;
  region: string[];
  status: string;
  createdAt: string;
  company: { name: string } | null;
}

const JOBPOST_STATUS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "승인 대기", cls: "catProfile" },
  OPEN: { label: "노출 중", cls: "catReturn" },
  CLOSED: { label: "마감", cls: "catOther" },
  DRAFT: { label: "작성 중", cls: "catOther" },
};

const FEATURE_LABEL: Record<string, string> = Object.fromEntries(
  INTEREST_FEATURES.map((f) => [f.key, f.label]),
);

function eventMeta(name: string): { label: string; cat?: EventCategory } {
  const def = EVENT_CATALOG[name as AnalyticsEventName];
  return def ? { label: def.label, cat: def.category } : { label: name };
}

function catClass(cat?: EventCategory): string {
  switch (cat) {
    case "signup":
      return styles.catSignup;
    case "profile":
      return styles.catProfile;
    case "interest":
      return styles.catInterest;
    case "return":
      return styles.catReturn;
    case "company":
      return styles.catCompany;
    default:
      return styles.catOther;
  }
}

function fmtTime(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function isVerified(u: AdminUser): boolean {
  return (
    !!u.name &&
    u.jobType.length > 0 &&
    !!u.careerYears &&
    u.region.length > 0 &&
    u._count.careerCards >= 1 &&
    (u._count.certificates >= 1 || u._count.educations >= 1)
  );
}

const EVENT_CATS: { key: EventCategory | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "signup", label: "가입" },
  { key: "profile", label: "프로필" },
  { key: "interest", label: "관심 기능" },
  { key: "company", label: "기업" },
  { key: "return", label: "재방문" },
];

export function AdminClient() {
  const [tab, setTab] = useState<Tab>("overview");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [events, setEvents] = useState<AdminEvent[] | null>(null);
  const [jobposts, setJobposts] = useState<AdminJobPost[] | null>(null);
  const [foremanReqs, setForemanReqs] = useState<ForemanReq[] | null>(null);
  const [workRequests, setWorkRequests] = useState<AdminWorkRequest[] | null>(null);
  const [reviews, setReviews] = useState<AdminReview[] | null>(null);
  const [pocReport, setPocReport] = useState<PocReport | null>(null);
  const [eventCat, setEventCat] = useState<EventCategory | "all">("all");
  const [bmLeads, setBmLeads] = useState<AdminBMInquiry[] | null>(null);
  const [candidates, setCandidates] = useState<AdminCandidates | null>(null);
  const [teams, setTeams] = useState<AdminTeam[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState({ companyName: '', contactName: '', contactMethod: '', interests: [] as string[], message: '' });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const LEAD_INTEREST_OPTIONS = ['정산·임금 자동화', '반장·리더 네트워크', '현장 인력 매칭', '안전·서류 관리', '외국인 인력', '현장 SaaS', 'IR·투자 문의', '기타'];

  const toggleLeadInterest = (feat: string) => {
    setLeadForm(prev => prev.interests.includes(feat)
      ? { ...prev, interests: prev.interests.filter(f => f !== feat) }
      : { ...prev, interests: [...prev.interests, feat] }
    );
  };

  const submitAdminLead = async () => {
    if (!leadForm.companyName || !leadForm.contactName || !leadForm.contactMethod) {
      alert('회사명, 담당자 이름, 연락처를 입력해 주세요.');
      return;
    }
    setIsSubmittingLead(true);
    try {
      const res = await fetch('/api/bm-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadForm),
      });
      if (res.ok) {
        setShowLeadForm(false);
        setLeadForm({ companyName: '', contactName: '', contactMethod: '', interests: [], message: '' });
        setBmLeads(null);
        void loadBmLeads();
      } else {
        alert('접수에 실패했습니다.');
      }
    } catch {
      alert('오류가 발생했습니다.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const loadBmLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bm-inquiries", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setBmLeads(data.inquiries);
      }
    } catch {
      /* best-effort */
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/overview", { cache: "no-store" });
      if (!res.ok) return;
      setOverview((await res.json()) as Overview);
    } catch {
      /* best-effort */
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users?limit=200", { cache: "no-store" });
      if (!res.ok) return;
      setUsers((await res.json()) as AdminUser[]);
    } catch {
      /* best-effort */
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events?limit=200", { cache: "no-store" });
      if (!res.ok) return;
      setEvents((await res.json()) as AdminEvent[]);
    } catch {
      /* best-effort */
    } finally {
      setLoading(false);
    }
  }, []);

  const loadJobPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/job-posts", { cache: "no-store" });
      if (!res.ok) return;
      setJobposts((await res.json()) as AdminJobPost[]);
    } catch {
      /* best-effort */
    } finally {
      setLoading(false);
    }
  }, []);

  const setJobPostStatus = useCallback(
    async (id: string, status: "OPEN" | "CLOSED" | "PENDING") => {
      setJobposts((p) => (p ? p.map((j) => (j.id === id ? { ...j, status } : j)) : p));
      try {
        await fetch(`/api/admin/job-posts/${id}/status`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ status }),
        });
      } catch {
        void loadJobPosts();
      }
    },
    [loadJobPosts],
  );

  const loadForemanReqs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/foreman-requests", { cache: "no-store" });
      if (!res.ok) return;
      setForemanReqs((await res.json()) as ForemanReq[]);
    } catch {
      /* best-effort */
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWorkRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/work-requests?limit=200", { cache: "no-store" });
      if (!res.ok) return;
      setWorkRequests((await res.json()) as AdminWorkRequest[]);
    } catch {
      /* best-effort */
    } finally {
      setLoading(false);
    }
  }, []);

  const setWrStatus = useCallback(async (id: string, status: string) => {
    setWorkRequests((p) => (p ? p.map((w) => (w.id === id ? { ...w, status } : w)) : p));
    try {
      await fetch(`/api/admin/work-requests/${id}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch {
      void loadWorkRequests();
    }
  }, [loadWorkRequests]);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews?limit=200", { cache: "no-store" });
      if (!res.ok) return;
      setReviews((await res.json()) as AdminReview[]);
    } catch {
      /* best-effort */
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/candidates?limit=200", { cache: "no-store" });
      if (!res.ok) return;
      setCandidates((await res.json()) as AdminCandidates);
    } catch {
      /* best-effort */
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTeams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/teams?limit=200", { cache: "no-store" });
      if (!res.ok) return;
      setTeams((await res.json()) as AdminTeam[]);
    } catch {
      /* best-effort */
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPoc = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/poc-report", { cache: "no-store" });
      if (!res.ok) return;
      setPocReport((await res.json()) as PocReport);
    } catch {
      /* best-effort */
    } finally {
      setLoading(false);
    }
  }, []);

  const decReqCount = useCallback(() => {
    setOverview((o) =>
      o ? { ...o, counts: { ...o.counts, foremanRequests: Math.max(0, o.counts.foremanRequests - 1) } } : o,
    );
  }, []);

  // 승인 = role FIELD_LEADER(대기 플래그도 서버에서 정리), 반려 = 대기 해제만
  const approveForeman = useCallback(
    async (id: string) => {
      setForemanReqs((p) => (p ? p.filter((u) => u.id !== id) : p));
      decReqCount();
      try {
        await fetch(`/api/admin/users/${id}/role`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ role: "FIELD_LEADER" }),
        });
      } catch {
        void loadForemanReqs();
      }
    },
    [loadForemanReqs, decReqCount],
  );
  const rejectForeman = useCallback(
    async (id: string) => {
      setForemanReqs((p) => (p ? p.filter((u) => u.id !== id) : p));
      decReqCount();
      try {
        await fetch(`/api/admin/users/${id}/foreman-reject`, { method: "POST" });
      } catch {
        void loadForemanReqs();
      }
    },
    [loadForemanReqs, decReqCount],
  );

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    if (tab === "users" && users === null) void loadUsers();
    if (tab === "events" && events === null) void loadEvents();
    if (tab === "jobposts" && jobposts === null) void loadJobPosts();
    if (tab === "foreman" && foremanReqs === null) void loadForemanReqs();
    if (tab === "workrequests" && workRequests === null) void loadWorkRequests();
    if (tab === "reviews" && reviews === null) void loadReviews();
    if (tab === "poc" && pocReport === null) void loadPoc();
    if (tab === "bm-leads" && bmLeads === null) void loadBmLeads();
    if (tab === "candidates" && candidates === null) void loadCandidates();
    if (tab === "teams" && teams === null) void loadTeams();
  }, [tab, users, events, jobposts, foremanReqs, workRequests, reviews, pocReport, bmLeads, candidates, teams, loadUsers, loadEvents, loadJobPosts, loadForemanReqs, loadWorkRequests, loadReviews, loadPoc, loadBmLeads, loadCandidates, loadTeams]);

  const refresh = () => {
    if (tab === "overview" || tab === "industry") void loadOverview();
    else if (tab === "users") void loadUsers();
    else if (tab === "jobposts") void loadJobPosts();
    else if (tab === "workrequests") void loadWorkRequests();
    else if (tab === "reviews") void loadReviews();
    else if (tab === "poc") void loadPoc();
    else if (tab === "bm-leads") void loadBmLeads();
    else if (tab === "candidates") void loadCandidates();
    else if (tab === "teams") void loadTeams();
    else if (tab === "leads" || tab === "interviews" || tab === "surveys" || tab === "poc-interest" || tab === "foreign" || tab === "community" || tab === "ops") {
      /* 자체 fetch 컴포넌트 — 탭 전환/컴포넌트 자체 새로고침으로 갱신 */
    } else if (tab === "foreman") {
      void loadForemanReqs();
      void loadOverview();
    } else void loadEvents();
  };

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    if (eventCat === "all") return events;
    return events.filter((e) => eventMeta(e.name).cat === eventCat);
  }, [events, eventCat]);

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.brandDot} />
          MONO 운영 콘솔
        </div>
        <span className={styles.brandSub}>현장 인력 데이터 인프라 · Operations</span>
        <span className={styles.spacer} />
        <button className={styles.refresh} onClick={refresh} disabled={loading}>
          {loading ? "불러오는 중…" : "새로고침"}
        </button>
      </header>

      <nav className={styles.tabs}>
        {(
          [
            { k: "overview", t: "Overview" },
            { k: "bm-leads", t: "B2B 리드" },
            { k: "industry", t: "산업·유형" },
            { k: "foreman", t: "반장 승인" },
            { k: "users", t: "기술자" },
            { k: "workrequests", t: "작업요청" },
            { k: "jobposts", t: "채용 공고" },
            { k: "leads", t: "리드 관리" },
            { k: "interviews", t: "인터뷰 관리" },
            { k: "surveys", t: "설문 응답 관리" },
            { k: "poc-interest", t: "PoC 관심 관리" },
            { k: "candidates", t: "후보 관리" },
            { k: "teams", t: "팀 관리" },
            { k: "reviews", t: "평가" },
            { k: "poc", t: "PoC 리포트" },
            { k: "foreign", t: "외국인 인력" },
            { k: "community", t: "커뮤니티 관리" },
            { k: "ops", t: "운영·관심" },
            { k: "events", t: "이벤트 로그" },
          ] as { k: Tab; t: string }[]
        ).map((x) => (
          <button
            key={x.k}
            className={`${styles.tab} ${tab === x.k ? styles.tabActive : ""}`}
            onClick={() => setTab(x.k)}
          >
            {x.t}
          </button>
        ))}
      </nav>

      <main className={styles.container}>
        {tab === "overview" && <OverviewView data={overview} loading={loading && !overview} />}
        {tab === "industry" && <IndustryView data={overview} loading={loading && !overview} />}
        {tab === "foreman" && <ForemanView rows={foremanReqs} loading={loading && !foremanReqs} onApprove={approveForeman} onReject={rejectForeman} />}
        {tab === "users" && <UsersView rows={users} loading={loading && !users} />}
        {tab === "workrequests" && <WorkRequestsView rows={workRequests} loading={loading && !workRequests} onStatus={setWrStatus} />}
        {tab === "jobposts" && <JobPostsView rows={jobposts} loading={loading && !jobposts} onStatus={setJobPostStatus} />}
        {tab === "leads" && <LeadsView />}
        {tab === "interviews" && <InterviewsView />}
        {tab === "surveys" && <SurveyResponsesView />}
        {tab === "poc-interest" && <PocInterestView />}
        {tab === "candidates" && <CandidatesView data={candidates} loading={loading && !candidates} />}
        {tab === "teams" && <TeamsView rows={teams} loading={loading && !teams} />}
        {tab === "reviews" && <ReviewsView rows={reviews} loading={loading && !reviews} />}
        {tab === "poc" && <PocView data={pocReport} loading={loading && !pocReport} />}
        {tab === "foreign" && <ForeignAdminView />}
        {tab === "community" && <CommunityAdminView />}
        {tab === "ops" && <AdminOpsView />}
        {tab === "events" && (
          <EventsView
            rows={filteredEvents}
            total={events?.length ?? 0}
            cat={eventCat}
            setCat={setEventCat}
            loading={loading && !events}
          />
        )}
        {tab === "bm-leads" && (
          <>
            {/* ── 리드 직접 추가 폼 ── */}
            <div className={styles.panel} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showLeadForm ? 20 : 0 }}>
                <div className={styles.sectionTitle} style={{ marginBottom: 0 }}>🚀 도입 문의 / 콜드메일 회신 직접 등록</div>
                <button
                  className={styles.filterChip}
                  style={{ padding: '6px 16px', fontWeight: 700, background: showLeadForm ? '#f1f5f9' : '#2563eb', color: showLeadForm ? '#64748b' : '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
                  onClick={() => setShowLeadForm(v => !v)}
                >
                  {showLeadForm ? '✕ 닫기' : '+ 리드 추가'}
                </button>
              </div>
              {showLeadForm && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>회사명 *</label>
                    <input
                      value={leadForm.companyName}
                      onChange={e => setLeadForm(p => ({ ...p, companyName: e.target.value }))}
                      placeholder="예: (주)현장건설"
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>담당자 이름 *</label>
                    <input
                      value={leadForm.contactName}
                      onChange={e => setLeadForm(p => ({ ...p, contactName: e.target.value }))}
                      placeholder="예: 김철수 부장"
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>연락처 (전화 / 이메일) *</label>
                    <input
                      value={leadForm.contactMethod}
                      onChange={e => setLeadForm(p => ({ ...p, contactMethod: e.target.value }))}
                      placeholder="예: 010-1234-5678 또는 kim@company.com"
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>추가 문의 내용</label>
                    <input
                      value={leadForm.message}
                      onChange={e => setLeadForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="콜드메일 내용 요약, 특이사항 등"
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 8 }}>관심 항목</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {LEAD_INTEREST_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleLeadInterest(opt)}
                          style={{
                            padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                            border: leadForm.interests.includes(opt) ? '1.5px solid #2563eb' : '1.5px solid #e2e8f0',
                            background: leadForm.interests.includes(opt) ? '#eff6ff' : '#f8fafc',
                            color: leadForm.interests.includes(opt) ? '#2563eb' : '#64748b',
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
                    <button
                      onClick={submitAdminLead}
                      disabled={isSubmittingLead}
                      style={{ padding: '10px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: isSubmittingLead ? 'not-allowed' : 'pointer', opacity: isSubmittingLead ? 0.7 : 1 }}
                    >
                      {isSubmittingLead ? '접수 중...' : '✅ 리드 접수'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── 리드 목록 ── */}
            <div className={styles.panel}>
              <div className={styles.sectionTitle}>B2B 리드 목록 ({bmLeads ? bmLeads.length : '…'}건)</div>
              {!bmLeads ? (
                <div className={styles.empty}>로딩 중...</div>
              ) : bmLeads.length === 0 ? (
                <div className={styles.empty}>접수된 리드가 없습니다.</div>
              ) : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>일시</th>
                        <th>회사명</th>
                        <th>담당자</th>
                        <th>연락처</th>
                        <th>관심 항목</th>
                        <th>추가 문의사항</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bmLeads.map(lead => (
                        <tr key={lead.id}>
                          <td>{new Date(lead.createdAt).toLocaleString('ko-KR')}</td>
                          <td style={{ fontWeight: 700 }}>{lead.companyName}</td>
                          <td>{lead.contactName}</td>
                          <td>{lead.contactMethod}</td>
                          <td>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {lead.interests.map(feat => (
                                <span key={feat} style={{ padding: '2px 6px', background: '#eff6ff', color: '#2563eb', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                                  {feat}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: 12, color: '#475569', maxWidth: 200, wordBreak: 'break-all' }}>
                              {lead.message || '-'}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  gold,
  dim,
}: {
  label: string;
  value: number;
  sub?: string;
  gold?: boolean;
  dim?: boolean;
}) {
  return (
    <div className={`${styles.card} ${gold ? styles.cardGold : ""} ${dim ? styles.cardDim : ""}`}>
      <div className={styles.cardLabel}>{label}</div>
      <div className={styles.cardValue}>{value.toLocaleString()}</div>
      {sub && <div className={styles.cardSub}>{sub}</div>}
    </div>
  );
}

function OverviewView({ data, loading }: { data: Overview | null; loading: boolean }) {
  if (loading) return <div className={styles.loading}>집계를 불러오는 중…</div>;
  if (!data) return <div className={styles.empty}>데이터를 불러오지 못했습니다.</div>;

  const c = data.counts;
  const funnelMax = Math.max(1, ...data.funnel.map((f) => f.count));
  const visits = data.funnel[0]?.count ?? 0;
  const interestMax = Math.max(1, ...data.interestByFeature.map((i) => i.count));

  return (
    <>
      <div className={styles.sectionTitle}>핵심 지표</div>
      <div className={styles.grid}>
        <StatCard label="가입자" value={c.users} sub="누적 회원" />
        <StatCard label="승인 요청" value={c.foremanRequests} sub="반장 승인 대기" gold />
        <StatCard label="검증 프로필" value={c.verifiedProfiles} sub="기본+경력+자격/교육" gold />
        <StatCard label="경력 카드" value={c.careerCards} sub="등록된 현장 경력" />
        <StatCard label="자격·교육" value={c.certificates + c.educations} sub={`자격 ${c.certificates} · 교육 ${c.educations}`} />
        <StatCard label="관심 신청" value={c.interests} sub="규제·미구현 수요" />
        <StatCard label="누적 이벤트" value={c.events} sub="행동 로그" />
        <StatCard label="기업 신청" value={c.companies} sub="협약 신청 누적" />
        <StatCard label="채용 공고" value={c.jobPosts} sub="등록·승인 공고" />
      </div>

      <div className={styles.sectionTitle}>캐노니컬 운영 지표</div>
      <div className={styles.grid}>
        <StatCard label="작업요청" value={c.workRequests} sub="현장작업요청 누적" gold />
        <StatCard label="평가" value={c.reviews} sub="다방향 평가 누적" gold />
        <StatCard label="수행기업" value={c.performerCompanies} sub="후보 풀 노출" />
        <StatCard label="운영자" value={c.operators} sub="PROJECT_OPERATOR" />
        <StatCard label="작업팀" value={c.teams} sub="등록된 팀" />
        <StatCard label="Field Ops 관심" value={c.fieldOpsInterests} sub="7종 수요" />
      </div>

      <div className={styles.sectionTitle}>가입 퍼널</div>
      <div className={styles.panel}>
        {data.funnel.map((f) => {
          const pct = visits > 0 ? Math.round((f.count / visits) * 100) : null;
          return (
            <div className={styles.funnelRow} key={f.key}>
              <span className={styles.funnelLabel}>{f.label}</span>
              <span className={styles.funnelTrack}>
                <span className={styles.funnelFill} style={{ width: `${(f.count / funnelMax) * 100}%` }} />
              </span>
              <span className={styles.funnelMeta}>
                <b>{f.count.toLocaleString()}</b>
                {pct !== null ? ` · ${pct}%` : ""}
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.sectionTitle}>관심 기능 분포</div>
      <div className={styles.panel}>
        {data.interestByFeature.length === 0 ? (
          <div className={styles.empty}>아직 관심 신청이 없습니다.</div>
        ) : (
          data.interestByFeature.map((i) => (
            <div className={styles.interestRow} key={i.feature}>
              <span className={styles.interestName}>{FEATURE_LABEL[i.feature] ?? i.feature}</span>
              <span className={styles.interestTrack}>
                <span className={styles.interestFill} style={{ width: `${(i.count / interestMax) * 100}%` }} />
              </span>
              <span className={styles.interestCount}>{i.count}</span>
            </div>
          ))
        )}
      </div>
    </>
  );
}

function ForemanView({ rows, loading, onApprove, onReject }: { rows: ForemanReq[] | null; loading: boolean; onApprove: (id: string) => void; onReject: (id: string) => void }) {
  if (loading) return <div className={styles.loading}>승인 요청을 불러오는 중…</div>;
  if (!rows) return <div className={styles.empty}>데이터를 불러오지 못했습니다.</div>;
  if (rows.length === 0) return <div className={styles.empty}>대기 중인 반장 승인 요청이 없습니다.</div>;

  return (
    <>
      <div className={styles.sectionTitle}>반장 승인 요청 {rows.length}건 · 경력·자격 확인 후 승인하세요</div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>신청자</th>
              <th>직군</th>
              <th>연차</th>
              <th>희망 지역</th>
              <th>경력/자격/교육</th>
              <th>신청일</th>
              <th>처리</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td>
                  <div style={{ fontWeight: 700 }}>{u.name ?? "(이름 미입력)"}</div>
                  <div className={styles.mono}>{u.phone ?? u.id}</div>
                </td>
                <td>
                  <div className={styles.chips}>
                    {u.jobType.length ? u.jobType.map((j) => <span className={styles.chip} key={j}>{j}</span>) : <span className={styles.mono}>—</span>}
                  </div>
                </td>
                <td>{u.careerYears ? (CAREER_BAND_LABEL[u.careerYears] ?? u.careerYears) : <span className={styles.mono}>—</span>}</td>
                <td>
                  <div className={styles.chips}>
                    {u.region.length ? u.region.map((r) => <span className={styles.chip} key={r}>{r}</span>) : <span className={styles.mono}>—</span>}
                  </div>
                </td>
                <td className={styles.countCell}>
                  {u._count.careerCards} / {u._count.certificates} / {u._count.educations}
                </td>
                <td className={styles.mono}>{fmtTime(u.createdAt)}</td>
                <td>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button className={styles.filterChip} onClick={() => onApprove(u.id)}>승인</button>
                    <button className={styles.filterChip} onClick={() => onReject(u.id)}>반려</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function UsersView({ rows, loading }: { rows: AdminUser[] | null; loading: boolean }) {
  if (loading) return <div className={styles.loading}>기술자 목록을 불러오는 중…</div>;
  if (!rows) return <div className={styles.empty}>데이터를 불러오지 못했습니다.</div>;
  if (rows.length === 0) return <div className={styles.empty}>아직 가입한 기술자가 없습니다.</div>;

  return (
    <>
      <div className={styles.sectionTitle}>기술자 {rows.length}명 (최신순)</div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>기술자</th>
              <th>반장</th>
              <th>직군</th>
              <th>연차</th>
              <th>희망 지역</th>
              <th>경력/자격/교육</th>
              <th>관심</th>
              <th>가입일</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td>
                  <div style={{ fontWeight: 700 }}>
                    {isVerified(u) && <span className={styles.verifiedDot} title="검증 프로필" />}
                    {u.name ?? "(이름 미입력)"}
                  </div>
                  <div className={styles.mono}>{u.id}</div>
                </td>
                <td>
                  {u.role === "FIELD_LEADER" ? (
                    <span className={`${styles.catBadge} ${styles.catReturn}`}>반장</span>
                  ) : (
                    <span className={styles.mono}>기능공</span>
                  )}
                </td>
                <td>
                  <div className={styles.chips}>
                    {u.jobType.length ? (
                      u.jobType.map((j) => (
                        <span className={styles.chip} key={j}>
                          {j}
                        </span>
                      ))
                    ) : (
                      <span className={styles.mono}>—</span>
                    )}
                  </div>
                </td>
                <td>{u.careerYears ? (CAREER_BAND_LABEL[u.careerYears] ?? u.careerYears) : <span className={styles.mono}>—</span>}</td>
                <td>
                  <div className={styles.chips}>
                    {u.region.length ? (
                      u.region.map((r) => (
                        <span className={styles.chip} key={r}>
                          {r}
                        </span>
                      ))
                    ) : (
                      <span className={styles.mono}>—</span>
                    )}
                  </div>
                </td>
                <td className={styles.countCell}>
                  {u._count.careerCards} / {u._count.certificates} / {u._count.educations}
                </td>
                <td className={styles.countCell}>{u._count.interests}</td>
                <td className={styles.mono}>{fmtTime(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function jobBadgeClass(status: string): string {
  if (status === "OPEN") return styles.catReturn;
  if (status === "PENDING") return styles.catProfile;
  return styles.catOther;
}

function JobPostsView({
  rows,
  loading,
  onStatus,
}: {
  rows: AdminJobPost[] | null;
  loading: boolean;
  onStatus: (id: string, status: "OPEN" | "CLOSED" | "PENDING") => void;
}) {
  if (loading) return <div className={styles.loading}>채용 공고를 불러오는 중…</div>;
  if (!rows) return <div className={styles.empty}>데이터를 불러오지 못했습니다.</div>;
  if (rows.length === 0) return <div className={styles.empty}>등록된 채용 공고가 없습니다.</div>;
  return (
    <>
      <div className={styles.sectionTitle}>채용 공고 {rows.length}건 · 승인 시 기술자에게 노출</div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>공고</th>
              <th>기업</th>
              <th>직군</th>
              <th>인원</th>
              <th>상태</th>
              <th>처리</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((j) => (
              <tr key={j.id}>
                <td style={{ fontWeight: 700 }}>{j.title}</td>
                <td>{j.company?.name ?? "—"}</td>
                <td className={styles.mono}>{j.jobType.join(", ")}</td>
                <td className={styles.countCell}>{j.headcount ?? "—"}</td>
                <td>
                  <span className={`${styles.catBadge} ${jobBadgeClass(j.status)}`}>
                    {JOBPOST_STATUS[j.status]?.label ?? j.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {j.status !== "OPEN" && (
                      <button className={styles.filterChip} onClick={() => onStatus(j.id, "OPEN")}>
                        승인
                      </button>
                    )}
                    {j.status !== "CLOSED" && (
                      <button className={styles.filterChip} onClick={() => onStatus(j.id, "CLOSED")}>
                        마감
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// 산업·유형 대시보드(§6.3·6.2) — 작업요청 산업 분포 + 사용자 유형 분포(overview 데이터 재사용).
function IndustryView({ data, loading }: { data: Overview | null; loading: boolean }) {
  if (loading) return <div className={styles.loading}>집계를 불러오는 중…</div>;
  if (!data) return <div className={styles.empty}>데이터를 불러오지 못했습니다.</div>;
  const wr = data.workRequestsByIndustry ?? [];
  const roles = data.roleDistribution ?? [];
  const wrMax = Math.max(1, ...wr.map((x) => x.count));
  const roleMax = Math.max(1, ...roles.map((x) => x.count));
  return (
    <>
      <div className={styles.sectionTitle}>작업요청 산업 분포</div>
      <div className={styles.panel}>
        {wr.length === 0 ? (
          <div className={styles.empty}>아직 등록된 작업요청이 없습니다.</div>
        ) : (
          wr.map((i) => (
            <div className={styles.interestRow} key={i.industry}>
              <span className={styles.interestName}>{INDUSTRY_LABEL_KO[i.industry] ?? i.industry}</span>
              <span className={styles.interestTrack}>
                <span className={styles.interestFill} style={{ width: `${(i.count / wrMax) * 100}%` }} />
              </span>
              <span className={styles.interestCount}>{i.count}</span>
            </div>
          ))
        )}
      </div>

      <div className={styles.sectionTitle}>사용자 유형 분포</div>
      <div className={styles.panel}>
        {roles.length === 0 ? (
          <div className={styles.empty}>데이터가 없습니다.</div>
        ) : (
          roles.map((r) => (
            <div className={styles.interestRow} key={r.role}>
              <span className={styles.interestName}>{ROLE_LABEL[r.role] ?? r.role}</span>
              <span className={styles.interestTrack}>
                <span className={styles.interestFill} style={{ width: `${(r.count / roleMax) * 100}%` }} />
              </span>
              <span className={styles.interestCount}>{r.count}</span>
            </div>
          ))
        )}
      </div>
    </>
  );
}

// 작업요청 관리(§6.4) — 목록 + 상태 전이.
function WorkRequestsView({ rows, loading, onStatus }: { rows: AdminWorkRequest[] | null; loading: boolean; onStatus: (id: string, status: string) => void }) {
  if (loading) return <div className={styles.loading}>작업요청을 불러오는 중…</div>;
  if (!rows) return <div className={styles.empty}>데이터를 불러오지 못했습니다.</div>;
  if (rows.length === 0) return <div className={styles.empty}>등록된 작업요청이 없습니다.</div>;
  const NEXT: { s: string; label: string }[] = [
    { s: "OPEN", label: "모집" },
    { s: "MATCHING", label: "매칭" },
    { s: "ASSIGNED", label: "확정" },
    { s: "COMPLETED", label: "완료" },
    { s: "CLOSED", label: "종료" },
  ];
  return (
    <>
      <div className={styles.sectionTitle}>작업요청 {rows.length}건 · 상태를 관리하세요</div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>요청자</th>
              <th>산업</th>
              <th>지역</th>
              <th>인원</th>
              <th>후보</th>
              <th>상태</th>
              <th>처리</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((w) => (
              <tr key={w.id}>
                <td style={{ fontWeight: 700 }}>{w.requester?.name ?? "—"}<span className={styles.mono} style={{ marginLeft: 6, opacity: 0.6 }}>{w.requester?.role ? ROLE_LABEL[w.requester.role] ?? "" : ""}</span></td>
                <td>{INDUSTRY_LABEL_KO[w.industry] ?? w.industry}</td>
                <td className={styles.mono}>{w.region.join(", ") || "—"}</td>
                <td className={styles.countCell}>{w.headcount ?? "—"}</td>
                <td className={styles.countCell}>{w._count?.candidates ?? 0}</td>
                <td><span className={`${styles.catBadge} ${styles[WR_STATUS_LABEL[w.status]?.cls ?? "catOther"]}`}>{WR_STATUS_LABEL[w.status]?.label ?? w.status}</span></td>
                <td>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {NEXT.filter((n) => n.s !== w.status).map((n) => (
                      <button key={n.s} className={styles.filterChip} onClick={() => onStatus(w.id, n.s)}>{n.label}</button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// 평가 모니터링(§6.6) — 최근 다방향 평가.
// 후보 관리(BM 검증 P0-2) — 관심 기술자 저장 + 상담 요청 현황
function CandidatesView({ data, loading }: { data: AdminCandidates | null; loading: boolean }) {
  if (loading) return <div className={styles.loading}>후보 데이터를 불러오는 중…</div>;
  if (!data) return <div className={styles.empty}>데이터를 불러오지 못했습니다.</div>;
  return (
    <>
      <div className={styles.sectionTitle}>관심 기술자 저장 {data.saved.length}건</div>
      {data.saved.length === 0 ? (
        <div className={styles.empty}>아직 저장된 관심 기술자가 없습니다.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>기업</th>
                <th>기술자</th>
                <th>직군</th>
                <th>지역</th>
                <th>메모</th>
                <th>저장일</th>
              </tr>
            </thead>
            <tbody>
              {data.saved.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 700 }}>{s.company.name}</td>
                  <td>{s.user.name ?? "—"}</td>
                  <td>
                    <div className={styles.chips}>
                      {s.user.jobType.map((j) => (
                        <span className={styles.chip} key={j}>{j}</span>
                      ))}
                    </div>
                  </td>
                  <td>{s.user.region.join(", ") || "—"}</td>
                  <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.memo ?? "—"}</td>
                  <td className={styles.mono}>{new Date(s.createdAt).toLocaleDateString("ko-KR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.sectionTitle} style={{ marginTop: 24 }}>상담 요청 {data.consults.length}건</div>
      {data.consults.length === 0 ? (
        <div className={styles.empty}>아직 접수된 상담 요청이 없습니다.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>기업</th>
                <th>대상 기술자</th>
                <th>상태</th>
                <th>메모</th>
                <th>요청일</th>
              </tr>
            </thead>
            <tbody>
              {data.consults.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700 }}>{c.company.name}</td>
                  <td>{c.targetUser.name ?? "—"}</td>
                  <td>{c.status}</td>
                  <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.memo ?? "—"}</td>
                  <td className={styles.mono}>{new Date(c.createdAt).toLocaleDateString("ko-KR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// 팀 관리(BM 검증 P0-3) — 팀 + 팀원 + 반장
function TeamsView({ rows, loading }: { rows: AdminTeam[] | null; loading: boolean }) {
  if (loading) return <div className={styles.loading}>팀 데이터를 불러오는 중…</div>;
  if (!rows) return <div className={styles.empty}>데이터를 불러오지 못했습니다.</div>;
  if (rows.length === 0) return <div className={styles.empty}>아직 등록된 팀이 없습니다.</div>;
  return (
    <>
      <div className={styles.sectionTitle}>등록 팀 {rows.length}건</div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>팀명</th>
              <th>반장</th>
              <th>팀원</th>
              <th>산업</th>
              <th>지역</th>
              <th>등록일</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id}>
                <td style={{ fontWeight: 700 }}>{t.name}</td>
                <td>{t.leader.name ?? "—"}<span className={styles.mono} style={{ marginLeft: 6, opacity: 0.6 }}>{t.leader.phone ?? ""}</span></td>
                <td className={styles.countCell}>{t.members.length}명</td>
                <td>
                  <div className={styles.chips}>
                    {t.industries.map((i) => (
                      <span className={styles.chip} key={i}>{INDUSTRY_LABEL_KO[i] ?? i}</span>
                    ))}
                  </div>
                </td>
                <td>{t.regions.join(", ") || "—"}</td>
                <td className={styles.mono}>{new Date(t.createdAt).toLocaleDateString("ko-KR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ReviewsView({ rows, loading }: { rows: AdminReview[] | null; loading: boolean }) {
  if (loading) return <div className={styles.loading}>평가를 불러오는 중…</div>;
  if (!rows) return <div className={styles.empty}>데이터를 불러오지 못했습니다.</div>;
  if (rows.length === 0) return <div className={styles.empty}>아직 제출된 평가가 없습니다.</div>;
  return (
    <>
      <div className={styles.sectionTitle}>평가 {rows.length}건 · 다방향 신뢰 데이터</div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>평가자</th>
              <th>대상</th>
              <th>작업품질</th>
              <th>안전관리</th>
              <th>코멘트</th>
              <th>일시</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 700 }}>{r.rater?.name ?? "—"}<span className={styles.mono} style={{ marginLeft: 6, opacity: 0.6 }}>{r.rater?.role ? ROLE_LABEL[r.rater.role] ?? "" : ""}</span></td>
                <td>{ROLE_LABEL[r.rateeType] ?? r.rateeType}</td>
                <td className={styles.countCell}>{r.workQuality ?? "—"}</td>
                <td className={styles.countCell}>{r.safetyManagement ?? "—"}</td>
                <td style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.comment ?? "—"}</td>
                <td className={styles.mono}>{new Date(r.createdAt).toLocaleDateString("ko-KR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// PoC 리포트(§7.3) — 산업별 수요·공급 집계 + 총계.
function PocView({ data, loading }: { data: PocReport | null; loading: boolean }) {
  if (loading) return <div className={styles.loading}>리포트를 집계하는 중…</div>;
  if (!data) return <div className={styles.empty}>데이터를 불러오지 못했습니다.</div>;
  const t = data.totals;
  return (
    <>
      <div className={styles.sectionTitle}>요약 · {new Date(data.generatedAt).toLocaleString("ko-KR")} 기준</div>
      <div className={styles.grid}>
        <StatCard label="후보지정" value={t.candidates} sub="누적 매칭 후보" gold />
        <StatCard label="평가" value={t.reviews} sub="다방향 평가" />
        <StatCard label="신뢰점수 산출" value={t.trustScores} sub={t.avgTrustScore != null ? `평균 ${t.avgTrustScore}점` : "—"} gold />
        <StatCard label="Field Ops 관심" value={t.fieldOpsInterests} sub="7종 수요" />
      </div>

      <div className={styles.sectionTitle}>산업별 수요·공급</div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>산업</th>
              <th>작업요청</th>
              <th>수행기업</th>
              <th>작업팀</th>
              <th>작업사례</th>
            </tr>
          </thead>
          <tbody>
            {data.industries.map((r) => (
              <tr key={r.industry}>
                <td style={{ fontWeight: 700 }}>{INDUSTRY_LABEL_KO[r.industry] ?? r.industry}</td>
                <td className={styles.countCell}>{r.workRequests}</td>
                <td className={styles.countCell}>{r.performers}</td>
                <td className={styles.countCell}>{r.teams}</td>
                <td className={styles.countCell}>{r.workRecords}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function EventsView({
  rows,
  total,
  cat,
  setCat,
  loading,
}: {
  rows: AdminEvent[];
  total: number;
  cat: EventCategory | "all";
  setCat: (c: EventCategory | "all") => void;
  loading: boolean;
}) {
  if (loading) return <div className={styles.loading}>이벤트 로그를 불러오는 중…</div>;

  return (
    <>
      <div className={styles.sectionTitle}>이벤트 로그 (최근 {total}건)</div>
      <div className={styles.filterBar}>
        {EVENT_CATS.map((x) => (
          <button
            key={x.key}
            className={`${styles.filterChip} ${cat === x.key ? styles.filterChipActive : ""}`}
            onClick={() => setCat(x.key)}
          >
            {x.label}
          </button>
        ))}
      </div>
      {rows.length === 0 ? (
        <div className={styles.empty}>해당 조건의 이벤트가 없습니다.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>시각</th>
                <th>이벤트</th>
                <th>이벤트명</th>
                <th>사용자</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => {
                const m = eventMeta(e.name);
                return (
                  <tr key={e.id}>
                    <td className={styles.mono}>{fmtTime(e.createdAt)}</td>
                    <td>
                      <span className={`${styles.catBadge} ${catClass(m.cat)}`}>{m.label}</span>
                    </td>
                    <td className={styles.mono}>{e.name}</td>
                    <td className={styles.mono}>{e.userId ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function CommunityAdminView() {
  const [reports, setReports] = useState<any[]>([]);
  const [blacklist, setBlacklist] = useState<any[]>([]);
  const [newWord, setNewWord] = useState("");

  const loadReports = async () => {
    try {
      const res = await fetch("/api/admin/community/reports");
      if (res.ok) setReports(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const loadBlacklist = async () => {
    try {
      const res = await fetch("/api/admin/community/blacklist");
      if (res.ok) setBlacklist(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    void loadReports();
    void loadBlacklist();
  }, []);

  const handleDeletePost = async (id: string) => {
    if (!confirm("해당 게시글을 삭제하시겠습니까? 관련 신고도 함께 삭제됩니다.")) return;
    try {
      const res = await fetch(`/api/admin/community/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("게시글이 삭제되었습니다.");
        void loadReports();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddBlacklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    try {
      const res = await fetch("/api/admin/community/blacklist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ word: newWord.trim() }),
      });
      if (res.ok) {
        setNewWord("");
        void loadBlacklist();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveBlacklist = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/community/blacklist/${id}`, { method: "DELETE" });
      if (res.ok) {
        void loadBlacklist();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className={styles.sectionTitle}>🚨 신고 내역 모니터링</div>
      <div className={styles.panel} style={{ marginBottom: "24px" }}>
        {reports.length === 0 ? (
          <div className={styles.empty}>신고된 게시글이 없습니다.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>신고 타입</th>
                  <th>신고 사유</th>
                  <th>신고 대상 텍스트</th>
                  <th>조치</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r: any) => (
                  <tr key={r.id}>
                    <td>
                      <span className={`${styles.catBadge} ${r.targetType === 'POST' ? styles.catReturn : styles.catProfile}`}>
                        {r.targetType === 'POST' ? '게시글' : '댓글'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{r.reason}</td>
                    <td>
                      {r.targetTitle && <div style={{ fontSize: '11px', color: '#8694a8' }}>제목: {r.targetTitle}</div>}
                      <div style={{ fontSize: '13px' }}>{r.targetContent}</div>
                    </td>
                    <td>
                      {r.targetType === 'POST' ? (
                        <button className={styles.filterChip} onClick={() => handleDeletePost(r.targetId)}>강제 삭제</button>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#8694a8' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={styles.sectionTitle}>금칙어 설정 및 필터 관리</div>
      <div className={styles.panel}>
        <form onSubmit={handleAddBlacklist} style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
          <input
            type="text"
            placeholder="추가할 금칙어 입력"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #e6e8ec",
              fontSize: "14px",
            }}
            required
          />
          <button type="submit" className={styles.filterChip} style={{ padding: "0 20px" }}>추가</button>
        </form>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {blacklist.length === 0 ? (
            <div className={styles.empty}>등록된 금칙어가 없습니다.</div>
          ) : (
            blacklist.map((item: any) => (
              <span
                key={item.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  border: "1px solid #fecaca",
                  background: "#fffdfd",
                  color: "#ef4444",
                  fontSize: "13px",
                  fontWeight: "700"
                }}
              >
                {item.word}
                <button
                  type="button"
                  onClick={() => handleRemoveBlacklist(item.id)}
                  style={{
                    border: "none",
                    background: "none",
                    color: "#ef4444",
                    fontSize: "14px",
                    fontWeight: "800",
                    cursor: "pointer",
                    padding: 0
                  }}
                >
                  &times;
                </button>
              </span>
            ))
          )}
        </div>
      </div>
    </>
  );

}
