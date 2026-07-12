// @ts-nocheck
/* eslint-disable */
"use client";

// MONO 근로자 앱 — 프로토타입 HTML 100% 재현 (테마 기본값: MONO Tech-Blue)
// 출처: Downloads/export/MONO 근로자 앱.html 의 DC 템플릿 + 컨트롤러를 React로 포팅.
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useProfile } from "@/lib/ProfileContext";
import { JOB_TYPES, CAREER_YEARS, REGIONS, INTEREST_FEATURES, CAREER_BAND_LABEL, INDUSTRIES } from "@/lib/constants";
import { track } from "@/lib/analytics";
import { getServerId, ensureServerId, apiUpsertFieldLeaderProfile, apiGetFieldLeaderProfile, apiListEquipmentHistory, apiAddEquipmentHistory, apiDeleteEquipmentHistory, apiCreateAiLeaderInterest, apiGetTrustScore, apiGetWorkerProfile, apiGetUnreadCount, apiListNotifications, apiMarkAllRead, apiListJobPosts, apiListUserApplications, apiApplyJobPost, apiListUserAssignments, apiCheckIn, apiCheckOut, apiProposeReAttendance, apiListSitePrep, apiSubmitSitePrep } from "@/lib/apiClient";
import type { JobPost, JobApplication, Assignment, AttendanceRec } from "@/lib/types";
import { ProfileTab as FgnProfile, VisaTab as FgnVisa, DocsTab as FgnDocs, TrainingTab as FgnTraining, SettlementTab as FgnSettlement } from "./ForeignWorkerHub";
import CommunityView from "./components/CommunityView";
import GlossaryView from "./GlossaryView";
import { enablePush } from "@/lib/push";
import { QRCodeSVG } from "qrcode.react";

// 테마색은 globals.css :root 의 --brand* 단일 출처에서만 정의한다.
// (과거 런타임 THEMES 오버라이드 + 테마 선택 모달은 globals 단일화로 제거)

function makeQR(fg) {
    const n=21, mods=[];
    const finder=(R,C)=>{ for(let r=0;r<7;r++) for(let c=0;c<7;c++){ const edge=r===0||r===6||c===0||c===6; const center=r>=2&&r<=4&&c>=2&&c<=4; if(edge||center) mods.push([R+r,C+c]); } };
    finder(0,0); finder(0,14); finder(14,0);
    for(let r=0;r<n;r++) for(let c=0;c<n;c++){
      const inF=(r<8&&c<8)||(r<8&&c>12)||(r>12&&c<8);
      if(inF) continue;
      if(((r*37+c*101+r*c*13+7)%100)<46) mods.push([r,c]);
    }
    const rects=mods.map(([r,c],i)=>React.createElement('rect',{key:i,x:c,y:r,width:1,height:1,rx:0.15,fill:fg}));
    return React.createElement('svg',{viewBox:'0 0 21 21',width:'100%',height:'100%',shapeRendering:'crispEdges',style:{display:'block'}},rects);
  }

// 테마 통일 커스텀 드롭다운 — 네이티브 <select> 대신 순수 DOM으로 구현해
// iOS·Android·데스크톱 어디서나 동일하게 보이고 동작한다.
function ThemedSelect({ value, placeholder, open, onToggle }) {
  // 트리거만 렌더 — 옵션 목록은 별도 picker 시트로 떠서 모달 높이를 바꾸지 않는다.
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        width: "100%", height: "48px", boxSizing: "border-box",
        border: open ? "1px solid var(--c1,#1F2226)" : "1px solid #e6e8ec",
        borderRadius: "12px", padding: "0 14px", fontSize: "15px", fontFamily: "inherit",
        color: value ? "var(--c1,#1F2226)" : "#8694a8", fontWeight: "600", background: "#fff", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value || placeholder}</span>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flex: "none", transition: "transform .2s ease", transform: open ? "rotate(180deg)" : "none" }}>
        <path d="M4 6l4 4 4-4" stroke="#8694a8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    </button>
  );
}

// 커스텀 드롭다운 picker 시트용 메타(필드 키 = edit 상태 키와 동일)
const PICKER_TITLE = { jobType: "직종 선택 (여러 개 가능)", careerYears: "경력 연차 선택", region: "희망 지역 선택 (여러 개 가능)" };
const PICKER_OPTIONS = { jobType: JOB_TYPES, careerYears: CAREER_YEARS, region: REGIONS };

// 포커스 트랩 대상 셀렉터(components/Sheet.tsx 와 동일 규칙).
const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// 현장리더 프로필 시트 칩 공통 스타일(선택 색상은 인라인으로 덮어씀).
const LEADER_CHIP = { height: "38px", padding: "0 14px", borderRadius: "11px", fontSize: "13px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer", WebkitTapHighlightColor: "transparent" };
// 스프린트3 시트(가동일정·장비) 공용 스타일.
const shLabel = { display: "block", fontSize: "13px", fontWeight: 800, color: "var(--app-text,#1F2226)", margin: "16px 0 9px" };
const shInput = { width: "100%", boxSizing: "border-box", height: "48px", padding: "0 14px", borderRadius: "13px", border: "1px solid #e6e8ec", background: "#fff", color: "#111111", fontSize: "15px", fontFamily: "inherit", outline: "none" };
const shPill = (on) => ({ padding: "9px 14px", borderRadius: "999px", border: `1.5px solid ${on ? "var(--c1,#1F2226)" : "#e6e8ec"}`, background: on ? "var(--c1,#1F2226)" : "#fff", color: on ? "#fff" : "var(--app-text-secondary,#5b6b82)", fontSize: "13.5px", fontWeight: on ? 800 : 600, fontFamily: "inherit", cursor: "pointer" });

// 현장 탭 — 기업이 등록한 실제 채용 공고(/api/job-posts)
// JobPost 타입은 @/lib/types 에서 가져옴

// 알림 — 매칭 공고 등(인앱 알림센터)
interface NotifItem {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  jobPost?: { id: string; title: string; status: string } | null;
}

// 함께 일한 동료(그래프) — 같은 현장 배정으로 형성된 엣지(/api/users/:id/coworkers)
interface CoworkerItem {
  coworkerId: string;
  name: string | null;
  jobType: string[];
  region: string[];
  siteName: string | null;
  count: number;
  lastWorkedAt: string;
}

// 내 팀(반장) — 반장이 일괄 등록한 팀(/api/users/:id/team)
interface TeamData {
  id: string;
  name: string;
  leaderId: string;
  memberCount: number;
  members: { userId: string; name: string | null; jobType: string[]; region: string[] }[];
}

// 출근·받을 금액 탭 — 배정(ACCEPTED) 현장 + 출근 기록(/api/users/:id/assignments)
function fmtClock(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}`;
}

function applLabel(status: string): { t: string; bg: string; fg: string } {
  if (status === "ACCEPTED") return { t: "배정 완료", bg: "#e4f7ec", fg: "#128a4e" };
  if (status === "REJECTED") return { t: "반려", bg: "#eef0f3", fg: "#6b7787" };
  if (status === "REVIEWING") return { t: "기업 확인 중", bg: "#fef3c7", fg: "#92400e" };
  if (status === "CONTACT_PENDING") return { t: "담당자 연락 예정", bg: "#dbeafe", fg: "#1d4ed8" };
  return { t: "지원 완료", bg: "var(--soft,#E5E7EB)", fg: "var(--c1,#1F2226)" };
}

// AI 인사이트 / 맞춤형 공지사항
interface AiInsight {
  id: string;
  type: string;
  title: string;
  content: string;
  linkText: string | null;
  linkTarget: string | null;
}

export default function MonoApp() {
  const [s, setS] = useState({ tab: 'home', variant: 0, flipped: false, checkedIn: false, settleOpen: false, modal: null, overlay: null, selJob: 0, applied: false, cardView: 'me' });
  const [activeGuide, setActiveGuide] = useState<'first' | 'large' | null>(null);
  const [workSubTab, setWorkSubTab] = useState<'attendance' | 'history'>('attendance');
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const guideRef = useRef<HTMLDivElement>(null);
  const [homeTab, setHomeTab] = useState<'today' | 'large'>('today');
  const [jobsViewMode, setJobsViewMode] = useState<'list' | 'map'>('list');
  const [jobSubTab, setJobSubTab] = useState<'fit' | 'urgent' | 'today' | 'large'>('fit');
  const [fastFilters, setFastFilters] = useState<string[]>([]);
  const [jobSort, setJobSort] = useState<string>('closest');
  // 현장 준비 서류(Field Pass P0) — 자가신고 제출 → 관리자 승인/반려. 실 API 연동(SitePrepItem).
  const [prepItems, setPrepItems] = useState([]);
  const PREP_KIND_MAP = {
    idCard: "ID_CARD",
    safetyEdu: "SAFETY_EDU",
    elecCard: "ELEC_CARD",
    bankAcc: "BANK_ACC",
    medCheck: "MED_CHECK",
    gateCard: "GATE_CARD",
    safetyGear: "SAFETY_GEAR",
  };
  const prepStatusOf = (key) => prepItems.find((p) => p.kind === PREP_KIND_MAP[key])?.status ?? "NONE";
  const prepMemoOf = (key) => prepItems.find((p) => p.kind === PREP_KIND_MAP[key])?.memo ?? "";
  const prepChecklist = Object.fromEntries(
    Object.keys(PREP_KIND_MAP).map((key) => [key, prepStatusOf(key) === "VERIFIED"])
  );
  const submitPrepItem = async (key) => {
    const uid = await ensureServerId();
    if (!uid) return;
    const updated = await apiSubmitSitePrep(uid, PREP_KIND_MAP[key]);
    if (updated) setPrepItems((prev) => [...prev.filter((p) => p.kind !== PREP_KIND_MAP[key]), updated]);
    track("site_prep_submitted", { kind: PREP_KIND_MAP[key] });
  };
  const { user, updateUser, setBasicProfile, registerInterest, interests,
    addCertificate, addEducation, certificates, educations,
    careerCards, addCareerCard, completion } = useProfile(); // 온보딩 프로필 + 관심/서류 + 현장 경력 + 완성도
  const [openInterest, setOpenInterest] = useState(false); // 관심 기능 신청 시트

  // 신규 추가: 계약서 서명, 받을 금액 영수증, 퀴즈, 은어 검색 상태
  const [openContractModal, setOpenContractModal] = useState(false);
  const [contractSigned, setContractSigned] = useState(false);
  const [openSettlementInvoice, setOpenSettlementInvoice] = useState<any>(null);
  const [openQuizModal, setOpenQuizModal] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [aiGlossarySearch, setAiGlossarySearch] = useState<string>("");

  // localStorage 연동 복원
  useEffect(() => {
    if (typeof window !== "undefined") {
      setContractSigned(localStorage.getItem("mono_contract_signed") === "true");
      setQuizAnswered(localStorage.getItem("mono_quiz_answered") === "true");
    }
  }, []);

  // #5 신뢰 점수 (TrustScore)
  const [trustScore, setTrustScore] = useState<TrustScore | null>(null);
  const [workerProfile, setWorkerProfile] = useState<any>(null);
  
  useEffect(() => {
    const sid = getServerId();
    if (sid) {
      apiGetTrustScore("WORKER", sid).then(t => setTrustScore(t));
      apiGetWorkerProfile(sid).then(p => setWorkerProfile(p));
      apiListSitePrep(sid).then(items => setPrepItems(items || []));
    }
  }, []);

  // ChunkLoadError 자동 복구 — 새 배포 후 브라우저가 구버전 청크를 요청하면 자동 새로고침
  useEffect(() => {
    const handler = (e: ErrorEvent) => {
      if (e.message && e.message.includes("Loading chunk")) {
        const KEY = "mono_chunk_reloaded";
        if (!sessionStorage.getItem(KEY)) {
          sessionStorage.setItem(KEY, "1");
          window.location.reload();
        }
      }
    };
    window.addEventListener("error", handler);
    return () => window.removeEventListener("error", handler);
  }, []);

  const isForeigner = user?.residency === "OVERSEAS" || (workerProfile?.nationality && workerProfile?.nationality !== "대한민국");
  const onPickInterest = (f) => {
    // 클릭 이벤트(개별 + 공통) → /api/events, 신규면 등록(InterestRegistration) + interest_submitted
    track(f.event, { feature: f.key });
    track("interest_feature_clicked", { feature: f.key });
    const isNew = registerInterest(f.key); // 로컬 상태 + (신규면) 서버 저장
    if (isNew) track("interest_submitted", { feature: f.key });
  };

  // #2 서류·자격증
  const [openDocs, setOpenDocs] = useState(false);
  const [eduInfoOpen, setEduInfoOpen] = useState(false); // 조공 필수 교육(기초안전보건교육) 소개 시트
  const [openShareSheet, setOpenShareSheet] = useState(false); // #3 프로필 공유(링크+QR) 시트
  const [openCareerSheet, setOpenCareerSheet] = useState(false); // #4 현장 경력 입력 시트
  const [certForm, setCertForm] = useState({ name: "", licenseNo: "", issuer: "", issuedAt: "" });
  const [eduForm, setEduForm] = useState({ title: "", institute: "", completedAt: "" });
  const [careerForm, setCareerForm] = useState({ siteName: "", field: "", startDate: "", endDate: "", role: "", equipment: "" });
  const submitCert = () => {
    if (!certForm.name.trim() || !certForm.licenseNo.trim()) return;
    addCertificate({ name: certForm.name.trim(), licenseNo: certForm.licenseNo.trim(), issuer: certForm.issuer.trim() || undefined, issuedAt: certForm.issuedAt.trim() || undefined });
    setCertForm({ name: "", licenseNo: "", issuer: "", issuedAt: "" });
  };
  const submitEdu = () => {
    if (!eduForm.title.trim()) return;
    addEducation({ title: eduForm.title.trim(), institute: eduForm.institute.trim() || undefined, completedAt: eduForm.completedAt.trim() || undefined });
    setEduForm({ title: "", institute: "", completedAt: "" });
  };
  // #4 현장 경력 — 현장명만 필수. 나머지는 선택(빈 값은 제외). addCareerCard가 로컬+서버 저장과 이벤트 로깅을 처리.
  const submitCareer = () => {
    if (!careerForm.siteName.trim()) return;
    addCareerCard({
      siteName: careerForm.siteName.trim(),
      field: careerForm.field.trim() || undefined,
      startDate: careerForm.startDate.trim() || undefined,
      endDate: careerForm.endDate.trim() || undefined,
      role: careerForm.role.trim() || undefined,
      equipment: careerForm.equipment.trim() || undefined,
    });
    setCareerForm({ siteName: "", field: "", startDate: "", endDate: "", role: "", equipment: "" });
  };
  // #5 장비 이력 (EquipmentHistory)
  const [equipmentHistory, setEquipmentHistory] = useState<any[]>([]);
  const [openEquipSheet, setOpenEquipSheet] = useState(false);
  const [equipForm, setEquipForm] = useState({ equipmentName: "", spec: "", experienceMonths: "", description: "" });
  const loadEquip = () => {
    const sid = getServerId();
    if (sid) apiListEquipmentHistory(sid).then(setEquipmentHistory);
  };
  useEffect(() => { loadEquip(); }, []);
  const submitEquip = async () => {
    const sid = getServerId();
    if (!sid || !equipForm.equipmentName.trim()) return;
    const res = await apiAddEquipmentHistory(sid, {
      equipmentName: equipForm.equipmentName.trim(),
      spec: equipForm.spec.trim() || undefined,
      experienceMonths: equipForm.experienceMonths ? parseInt(equipForm.experienceMonths, 10) : undefined,
      description: equipForm.description.trim() || undefined,
    });
    if (res) {
      setEquipmentHistory(prev => [...prev, res]);
      setEquipForm({ equipmentName: "", spec: "", experienceMonths: "", description: "" });
    }
  };
  const deleteEquip = async (eid: string) => {
    const sid = getServerId();
    if (!sid) return;
    const ok = await apiDeleteEquipmentHistory(sid, eid);
    if (ok) setEquipmentHistory(prev => prev.filter(e => e.id !== eid));
  };

  // 근무 기간 표시("2024-03" → "2024.03 – 현재"). 공개 프로필(PublicProfileView)과 동일 규칙.
  const fmtRange = (start, end) => {
    if (!start && !end) return "";
    const a = start ? start.replace("-", ".") : "";
    const b = end ? end.replace("-", ".") : "현재";
    return a ? `${a} – ${b}` : b;
  };
  // 현장 경력 시트 포커스 트랩 — Tab 순환을 시트 내부로 가둔다(CLAUDE.md 6).
  const onCareerKeyDown = (e) => {
    if (e.key !== "Tab") return;
    const panel = careerSheetRef.current;
    if (!panel) return;
    const nodes = Array.from(panel.querySelectorAll(FOCUSABLE)).filter((n) => !n.hasAttribute("disabled"));
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === panel)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  };
  // #3 프로필 공유(링크+QR)
  const [shareCopied, setShareCopied] = useState(false);
  const shareUrl = () => {
    const sid = getServerId();
    if (!sid || typeof window === "undefined") return "";
    return `${window.location.origin}/p/${sid}`;
  };
  const copyShare = () => {
    const url = shareUrl();
    if (!url) return;
    try { navigator.clipboard?.writeText(url); } catch {}
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 1600);
    track("profile_shared", { method: "copy" });
  };
  const nativeShare = () => {
    const url = shareUrl();
    if (!url) return;
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "MONO 경력 프로필", url }).catch(() => {});
      track("profile_shared", { method: "native" });
    } else {
      copyShare();
    }
  };
  const [edit, setEdit] = useState(null); // 기본 정보 수정 모달 폼 상태(null=닫힘)
  const [openField, setOpenField] = useState(null); // 커스텀 드롭다운 열림 필드(jobType|careerYears|region|null)
  const openEdit = () => {
    setOpenField(null);
    const asArr = (x) => Array.isArray(x) ? [...x] : (x ? [x] : []);
    setEdit({
      name: (user && user.name) || "",
      jobType: asArr(user && user.jobType),
      careerYears: (user && user.careerYears) || "",
      region: asArr(user && user.region),
    });
  };
  const closeEdit = () => { setEdit(null); setOpenField(null); };
  const saveEdit = () => {
    if (!edit) return;
    // 직종·희망지역은 1개 이상 필수
    if (!(edit.jobType || []).length || !(edit.region || []).length) return;
    setBasicProfile({ jobType: edit.jobType, careerYears: edit.careerYears, region: edit.region });
    updateUser({ name: edit.name });
    setEdit(null);
    setOpenField(null);
  };
  const careerSheetRef = useRef(null); // #4 현장 경력 시트 패널(포커스 트랩·이동용)
  const set = (p) => setS((prev) => ({ ...prev, ...(typeof p === 'function' ? p(prev) : p) }));

  // 탭 이동 시 열린 오버레이(시트/패널/드롭다운/모달) 모두 닫음 — 모든 네비가 여기를 거침.
  const setTab = (t) => {
    setOpenCareerSheet(false);
    setOpenShareSheet(false);
    setOpenInterest(false);
    setOpenDocs(false);
    setJobDetail(null);
    setNotifOpen(false);
    setOpenField(null);
    setTeamOpen(false);
    setLeaderProfileOpen(false);
    setConfirmState(null);
    setOpenEquipSheet(false);
    set({ tab: t, flipped: false, settleOpen: false, modal: null, overlay: null });
  };
  const setV = (vv) => set({ variant: vv, flipped: false });
  const flip = () => set((st) => ({ flipped: !st.flipped }));
  const toggleCheck = () => set((st) => ({ checkedIn: !st.checkedIn }));
  const toggleSettle = () => set((st) => ({ settleOpen: !st.settleOpen }));
  const open = (m) => set({ modal: m });
  const close = () => set({ modal: null });
  // 공고 상세는 실사용 시트(jobDetail)로 통일 — 데모 오버레이(하드코딩 jobs 배열) 제거.
  const openJob = (i) => {
    const jp = (realJobs || [])[i] ?? (realJobs && realJobs[0]) ?? null;
    if (jp) setJobDetail(jp);
  };
  const setCardView = (vw) => set({ cardView: vw });

  // 현장 경력 시트 접근성 — ESC 닫기 · body 스크롤 잠금 · 오픈 시 패널로 포커스 이동(CLAUDE.md 6).
  useEffect(() => {
    if (!openCareerSheet) return;
    document.body.classList.add("scroll-lock");
    const onKey = (e) => { if (e.key === "Escape") { e.stopPropagation(); setOpenCareerSheet(false); } };
    document.addEventListener("keydown", onKey);
    // 첫 입력(현장명)으로 모바일 키보드가 튀지 않도록 패널 자체로 포커스(컨테이너=tabIndex -1).
    const ft = window.setTimeout(() => { careerSheetRef.current?.focus?.(); }, 20);
    return () => {
      window.clearTimeout(ft);
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("scroll-lock");
    };
  }, [openCareerSheet]);

  // 프로필 완성도 조회 이벤트 — '내 정보' 탭에 진입할 때 1회 발화(§7-1 profile_completion_viewed).
  const prevTabRef = useRef(s.tab);
  useEffect(() => {
    if (s.tab === "me" && prevTabRef.current !== "me") {
      track("profile_completion_viewed", { value: completion });
    }
    prevTabRef.current = s.tab;
  }, [s.tab, completion]);

  // 현장 탭 — 공고 + 내 지원 현황.
  const [realJobs, setRealJobs] = useState<JobPost[] | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [myApps, setMyApps] = useState<JobApplication[]>([]);
  const [jobDetail, setJobDetail] = useState<JobPost | null>(null); // 공고 상세 시트(카드 클릭 시 오픈)
  const [jobSearch, setJobSearch] = useState(""); // 현장 검색 키워드
  const [jobFilterType, setJobFilterType] = useState<"all" | "today" | "large">("all"); // 오늘현장/대형현장 필터
  const [jobFilterRegion, setJobFilterRegion] = useState(""); // 지역 필터
  const [jobFilterJobType, setJobFilterJobType] = useState(""); // 직종 필터
  const jobDetailRef = useRef<HTMLDivElement>(null);
  // 공고 상세 시트 접근성 — ESC 닫기 · body 스크롤 잠금 · 오픈 시 패널로 포커스(CLAUDE.md 6).
  useEffect(() => {
    if (!jobDetail) return;
    document.body.classList.add("scroll-lock");
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); setJobDetail(null); } };
    document.addEventListener("keydown", onKey);
    const ft = window.setTimeout(() => { jobDetailRef.current?.focus?.(); }, 20);
    return () => {
      window.clearTimeout(ft);
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("scroll-lock");
    };
  }, [jobDetail]);

  // 알림센터(종+패널) — 미읽음 수 폴링, 패널 열기 시 목록 로드 + 모두 읽음, 항목 클릭 → 현장 탭.
  const [notifs, setNotifs] = useState<NotifItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [pushMsg, setPushMsg] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);
  const loadUnread = () => {
    // 백그라운드 탭에선 폴링 스킵(배터리·서버 부하 절감)
    if (typeof document !== "undefined" && document.hidden) return;
    const uid = getServerId();
    if (!uid) return;
    apiGetUnreadCount(uid)
      .then((count) => setUnread(count))
      .catch(() => undefined);
  };
  useEffect(() => {
    loadUnread();
    const iv = window.setInterval(loadUnread, 30000); // 30초마다 미읽음 갱신
    return () => window.clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // 알림 패널 접근성 — ESC 닫기 · body 스크롤 잠금 · 오픈 시 패널로 포커스(CLAUDE.md 6).
  useEffect(() => {
    if (!notifOpen) return;
    document.body.classList.add("scroll-lock");
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); setNotifOpen(false); } };
    document.addEventListener("keydown", onKey);
    const ft = window.setTimeout(() => { notifRef.current?.focus?.(); }, 20);
    return () => {
      window.clearTimeout(ft);
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("scroll-lock");
    };
  }, [notifOpen]);
  const openNotifs = () => {
    setNotifOpen(true);
    const uid = getServerId();
    if (!uid) return;
    apiListNotifications(uid)
      .then((d) => setNotifs(d))
      .catch(() => undefined);
    if (unread > 0) {
      apiMarkAllRead(uid)
        .then(() => setUnread(0))
        .catch(() => undefined);
    }
  };
  const onNotifClick = (n: NotifItem) => {
    track("notification_clicked", { type: n.type });
    setNotifOpen(false);
    if (n.jobPost?.id) setTab("jobs");
  };
  const onEnablePush = async () => {
    const uid = getServerId();
    if (!uid) return;
    setPushMsg("설정하는 중…");
    const r = await enablePush(uid);
    setPushMsg(
      r === "ok" ? "푸시 알림이 켜졌어요 ✓"
      : r === "denied" ? "브라우저에서 알림 권한을 허용해 주세요"
      : r === "unsupported" ? "이 브라우저는 푸시 알림을 지원하지 않아요"
      : r === "no-key" ? "앱 안에서 알림을 보내드리고 있어요"
      : "잠시 후 다시 시도해 주세요",
    );
  };

  // 함께 일한 동료(그래프) — 같은 현장 배정으로 형성된 동료 목록 + 다시 호출.
  const [coworkers, setCoworkers] = useState<CoworkerItem[]>([]);
  const [recalled, setRecalled] = useState<Record<string, string>>({}); // coworkerId → 상태문구
  const loadCoworkers = () => {
    const uid = getServerId();
    if (!uid) return;
    fetch(`/api/users/${uid}/coworkers`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setCoworkers(Array.isArray(d) ? (d as CoworkerItem[]) : []))
      .catch(() => undefined);
  };

  // AI 인사이트 가져오기
  const [insights, setInsights] = useState<AiInsight[]>([]);
  useEffect(() => {
    fetch("/api/insights", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && Array.isArray(d.insights)) setInsights(d.insights);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    loadCoworkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const recallCoworker = (c: CoworkerItem) => {
    const uid = getServerId();
    if (!uid || recalled[c.coworkerId]) return;
    setRecalled((p) => ({ ...p, [c.coworkerId]: "호출 중…" }));
    track("coworker_recalled");
    fetch(`/api/users/${uid}/recall`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ coworkerId: c.coworkerId }),
    })
      .then((r) => r.json())
      .then((d) => setRecalled((p) => ({ ...p, [c.coworkerId]: d?.ok ? "호출 완료 ✓" : "잠시 후 다시" })))
      .catch(() => setRecalled((p) => ({ ...p, [c.coworkerId]: "잠시 후 다시" })));
  };

  // 내 팀(반장) — 팀을 통째로 등록(DB 직결). 멤버 행 동적 추가.
  const [team, setTeam] = useState<TeamData | null>(null);
  const [teamOpen, setTeamOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamRows, setTeamRows] = useState<{ name: string; phone: string }[]>([{ name: "", phone: "" }]);
  const [teamMsg, setTeamMsg] = useState("");
  const teamRef = useRef<HTMLDivElement>(null);
  const loadTeam = () => {
    const uid = getServerId();
    if (!uid) return;
    fetch(`/api/users/${uid}/team`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setTeam(d && d.id ? (d as TeamData) : null))
      .catch(() => undefined);
  };
  useEffect(() => {
    loadTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // 본인 역할(반장 여부) — 팀 생성 게이트용. 관리자 승인으로만 FIELD_LEADER 부여됨.
  const [myRole, setMyRole] = useState<string | null>(null);
  const [myRequested, setMyRequested] = useState(false);
  useEffect(() => {
    const uid = getServerId();
    if (!uid) return;
    fetch(`/api/users/${uid}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { setMyRole(d?.role ?? null); setMyRequested(!!d?.foremanRequested); })
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isForeman = myRole === "FIELD_LEADER";
  // 반장 승인 요청(기능공 → 대기). 관리자가 /amono 에서 승인/반려.
  const requestForeman = () => {
    const uid = getServerId();
    if (!uid || myRequested) return;
    setMyRequested(true);
    track("field_leader_requested");
    fetch(`/api/users/${uid}/foreman-request`, { method: "POST" }).catch(() => setMyRequested(false));
  };

  // 현장리더 프로필(FieldLeaderProfile) — 관리 가능 직군·팀규모·작업분야·산업·지역·연락시간.
  // 서버는 userId @unique upsert. 모든 항목 선택, 최소 1개 입력 시 저장.
  const [leaderProfileOpen, setLeaderProfileOpen] = useState(false);
  const [leaderForm, setLeaderForm] = useState({ primaryJobTypes: [], manageableTeamSize: "", mainWorkFields: [], industries: [], regions: [], contactHours: "" });
  const [leaderWorkInput, setLeaderWorkInput] = useState(""); // 주요작업분야 칩 입력 버퍼
  const [leaderMsg, setLeaderMsg] = useState("");
  const leaderRef = useRef<HTMLDivElement>(null);
  // 칩 배열 토글(선택/해제) — primaryJobTypes·industries·regions·mainWorkFields 공통.
  const toggleLeaderArr = (key, val) => setLeaderForm((p) => {
    const arr = p[key] || [];
    return { ...p, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
  });
  // 주요작업분야 — 텍스트 입력 → 칩 추가(중복·공백 제외).
  const addLeaderWorkField = () => {
    const t = leaderWorkInput.trim();
    if (!t) return;
    setLeaderForm((p) => (p.mainWorkFields.includes(t) ? p : { ...p, mainWorkFields: [...p.mainWorkFields, t] }));
    setLeaderWorkInput("");
  };
  // 시트 오픈 — 폼 초기화 후 기존값 prefill. 오픈 즉시 시작 이벤트 발화.
  const openLeaderProfile = () => {
    setLeaderMsg("");
    setLeaderWorkInput("");
    setLeaderForm({ primaryJobTypes: [], manageableTeamSize: "", mainWorkFields: [], industries: [], regions: [], contactHours: "" });
    setLeaderProfileOpen(true);
    track("field_leader_profile_started");
    apiGetFieldLeaderProfile()
      .then((p) => {
        if (!p) return;
        setLeaderForm({
          primaryJobTypes: Array.isArray(p.primaryJobTypes) ? p.primaryJobTypes : [],
          manageableTeamSize: p.manageableTeamSize != null ? String(p.manageableTeamSize) : "",
          mainWorkFields: Array.isArray(p.mainWorkFields) ? p.mainWorkFields : [],
          industries: Array.isArray(p.industries) ? p.industries : [],
          regions: Array.isArray(p.regions) ? p.regions : [],
          contactHours: p.contactHours || "",
        });
      })
      .catch(() => undefined);
  };
  const submitLeaderProfile = () => {
    const f = leaderForm;
    const sizeNum = f.manageableTeamSize === "" ? null : Number(f.manageableTeamSize);
    const contact = (f.contactHours || "").trim();
    const data = {
      primaryJobTypes: f.primaryJobTypes,
      manageableTeamSize: sizeNum != null && !Number.isNaN(sizeNum) ? sizeNum : null,
      mainWorkFields: f.mainWorkFields,
      industries: f.industries,
      regions: f.regions,
      contactHours: contact || null,
    };
    // 최소 1개 입력 시 저장 가능
    const hasAny = data.primaryJobTypes.length || data.mainWorkFields.length || data.industries.length
      || data.regions.length || data.manageableTeamSize != null || !!data.contactHours;
    if (!hasAny) { setLeaderMsg("한 가지 이상 입력해 주세요"); return; }
    setLeaderMsg("저장 중…");
    apiUpsertFieldLeaderProfile(data)
      .then(() => { track("field_leader_profile_completed"); setLeaderProfileOpen(false); })
      .catch(() => setLeaderMsg("잠시 후 다시 시도해 주세요"));
  };
  // 시트 포커스 트랩 — Tab 순환을 시트 내부로 가둔다(CLAUDE.md 6).
  const onLeaderKeyDown = (e) => {
    if (e.key !== "Tab") return;
    const panel = leaderRef.current;
    if (!panel) return;
    const nodes = Array.from(panel.querySelectorAll(FOCUSABLE)).filter((n) => !n.hasAttribute("disabled"));
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === panel)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  };
  // 현장리더 프로필 시트 접근성 — ESC 닫기 · body 스크롤 잠금 · 오픈 시 패널 포커스(CLAUDE.md 6).
  useEffect(() => {
    if (!leaderProfileOpen) return;
    document.body.classList.add("scroll-lock");
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); setLeaderProfileOpen(false); } };
    document.addEventListener("keydown", onKey);
    const ft = window.setTimeout(() => { leaderRef.current?.focus?.(); }, 20);
    return () => {
      window.clearTimeout(ft);
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("scroll-lock");
    };
  }, [leaderProfileOpen]);

  // ── 스프린트3: 팀 가동일정 · AI현장리더 관심 · 장비 이력 ──
  // 공용 포커스 트랩(시트 내부로 Tab 순환 — CLAUDE.md 6).
  const trapTab = (ref) => (e) => {
    if (e.key !== "Tab") return;
    const panel = ref.current; if (!panel) return;
    const nodes = Array.from(panel.querySelectorAll(FOCUSABLE)).filter((n) => !n.hasAttribute("disabled"));
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1], active = document.activeElement;
    if (e.shiftKey && (active === first || active === panel)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  };

  // 팀 가동일정(TeamAvailability) — 반장 전용. 주간 status·지역·긴급투입 upsert.
  const [availOpen, setAvailOpen] = useState(false);
  const [availForm, setAvailForm] = useState({ weekStart: "", status: "AVAILABLE", regions: [], urgentOk: false });
  const [availMsg, setAvailMsg] = useState("");
  const availRef = useRef(null);
  const openAvail = () => {
    setAvailMsg("");
    setAvailForm({ weekStart: "", status: "AVAILABLE", regions: [], urgentOk: false });
    const uid = getServerId();
    if (uid) fetch(`/api/users/${uid}/team/availability`, { cache: "no-store" })
      .then((r) => r.json())
      .then((list) => {
        if (Array.isArray(list) && list.length) {
          const last = list[list.length - 1];
          setAvailForm({ weekStart: last.weekStart || "", status: last.status || "AVAILABLE", regions: Array.isArray(last.regions) ? last.regions : [], urgentOk: !!last.urgentOk });
        }
      }).catch(() => undefined);
    setAvailOpen(true);
  };
  const toggleAvailRegion = (v) => setAvailForm((p) => ({ ...p, regions: p.regions.includes(v) ? p.regions.filter((x) => x !== v) : [...p.regions, v] }));
  const submitAvail = () => {
    if (!availForm.weekStart) { setAvailMsg("주 시작일을 입력해 주세요"); return; }
    const uid = getServerId();
    if (!uid) return;
    setAvailMsg("저장 중…");
    fetch(`/api/users/${uid}/team/availability`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(availForm) })
      .then((r) => { if (!r.ok) throw new Error(); track("team_availability_updated"); setAvailOpen(false); })
      .catch(() => setAvailMsg("팀을 먼저 등록해 주세요"));
  };
  useEffect(() => {
    if (!availOpen) return;
    document.body.classList.add("scroll-lock");
    const onKey = (e) => { if (e.key === "Escape") { e.stopPropagation(); setAvailOpen(false); } };
    document.addEventListener("keydown", onKey);
    const ft = window.setTimeout(() => { availRef.current?.focus?.(); }, 20);
    return () => { window.clearTimeout(ft); document.removeEventListener("keydown", onKey); document.body.classList.remove("scroll-lock"); };
  }, [availOpen]);

  // AI현장리더 관심(AiLeaderInterest) — 1클릭 등록.
  const [aiDone, setAiDone] = useState(false);
  const registerAiLeader = () => {
    if (aiDone) return;
    setAiDone(true);
    track("ai_field_leader_interest_clicked");
    const uid = getServerId();
    apiCreateAiLeaderInterest({
      userId: uid || undefined,
      name: user?.name || undefined,
      phone: user?.phone || undefined,
      jobType: user?.jobType?.[0] || undefined,
      region: user?.region?.[0] || undefined
    });
  };

  useEffect(() => {
    if (!openEquipSheet) return;
    document.body.classList.add("scroll-lock");
    const onKey = (e) => { if (e.key === "Escape") { e.stopPropagation(); setOpenEquipSheet(false); } };
    document.addEventListener("keydown", onKey);
    const ft = window.setTimeout(() => { equipRef.current?.focus?.(); }, 20);
    return () => { window.clearTimeout(ft); document.removeEventListener("keydown", onKey); document.body.classList.remove("scroll-lock"); };
  }, [openEquipSheet]);

  useEffect(() => {
    if (!teamOpen) return;
    document.body.classList.add("scroll-lock");
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); setTeamOpen(false); } };
    document.addEventListener("keydown", onKey);
    const ft = window.setTimeout(() => { teamRef.current?.focus?.(); }, 20);
    return () => {
      window.clearTimeout(ft);
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("scroll-lock");
    };
  }, [teamOpen]);

  useEffect(() => {
    if (!activeGuide) return;
    document.body.classList.add("scroll-lock");
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); setActiveGuide(null); } };
    document.addEventListener("keydown", onKey);
    const ft = window.setTimeout(() => { guideRef.current?.focus?.(); }, 20);
    return () => {
      window.clearTimeout(ft);
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("scroll-lock");
    };
  }, [activeGuide]);
  const openTeamSheet = () => {
    setTeamMsg("");
    setTeamName(team?.name || "");
    setTeamRows([{ name: "", phone: "" }]);
    setTeamOpen(true);
  };
  const submitTeam = () => {
    const uid = getServerId();
    if (!uid) { setTeamMsg("먼저 로그인이 필요해요"); return; }
    if (!teamName.trim()) { setTeamMsg("팀 이름을 입력하세요"); return; }
    const members = teamRows
      .map((r) => ({ name: r.name.trim(), phone: r.phone.trim() }))
      .filter((r) => r.name && r.phone);
    if (members.length === 0) { setTeamMsg("팀원을 1명 이상 입력하세요 (이름·연락처)"); return; }
    setTeamMsg("등록 중…");
    track("team_created", { count: members.length });
    fetch(`/api/users/${uid}/team`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: teamName.trim(), members }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d && d.id) { setTeam(d as TeamData); setTeamOpen(false); }
        else setTeamMsg(d?.message || "잠시 후 다시 시도해 주세요");
      })
      .catch(() => setTeamMsg("잠시 후 다시 시도해 주세요"));
  };
  // 앱 테마 확인 모달 — native confirm 대체(파괴적 동작에 사용).
  const [confirmState, setConfirmState] = useState<null | { title: string; body: string; confirmLabel: string; onConfirm: () => void }>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!confirmState) return;
    document.body.classList.add("scroll-lock");
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); setConfirmState(null); } };
    document.addEventListener("keydown", onKey);
    const ft = window.setTimeout(() => { confirmRef.current?.focus?.(); }, 20);
    return () => {
      window.clearTimeout(ft);
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("scroll-lock");
    };
  }, [confirmState]);

  // 팀 삭제 — 반장이 자기 팀 제거(팀원 연결 해제)
  const deleteTeam = () => {
    const uid = getServerId();
    if (!uid || !team) return;
    setConfirmState({
      title: "팀 삭제",
      body: `'${team.name}' 팀을 삭제할까요? 팀원 연결이 모두 해제됩니다.`,
      confirmLabel: "삭제",
      onConfirm: () => {
        track("team_deleted");
        fetch(`/api/users/${uid}/team`, { method: "DELETE" })
          .then(() => setTeam(null))
          .catch(() => undefined);
      },
    });
  };
  // 회원 탈퇴 — User 삭제(프로필·경력·팀·동료 등 cascade) + 로컬 초기화 → 로그인 화면
  const deleteAccount = () => {
    setConfirmState({
      title: "회원 탈퇴",
      body: "프로필·경력·팀 등 모든 데이터가 삭제되며 되돌릴 수 없어요. 정말 탈퇴할까요?",
      confirmLabel: "탈퇴하기",
      onConfirm: () => {
        track("account_deleted");
        const finish = () => {
          try {
            window.localStorage.removeItem("mono.loggedIn");
            window.localStorage.removeItem("mono.serverId");
            window.localStorage.removeItem("mono.profile");
          } catch {
            /* noop */
          }
          window.location.href = "/mono";
        };
        const uid = getServerId();
        if (!uid) { finish(); return; }
        fetch(`/api/users/${uid}`, { method: "DELETE" }).then(finish).catch(finish);
      },
    });
  };

  // '내 위치 주변' / '채용공고' 두 화면 — 모바일 스와이프 + PC 토글. 기본은 내 위치 주변(지도).
  const [jobsPane, setJobsPane] = useState("nearby");
  const [locFound, setLocFound] = useState(false); // '내 위치 찾기'를 눌렀는지 — 누른 뒤에만 지도 아래 공고 노출
  const jobsTouchX = useRef(0);
  const onJobsTouchStart = (e) => { jobsTouchX.current = e.touches[0].clientX; };
  const onJobsTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - jobsTouchX.current;
    if (dx < -45 && jobsPane === "nearby") setJobsPane("posts");
    else if (dx > 45 && jobsPane === "posts") setJobsPane("nearby");
  };
  const [geoNote, setGeoNote] = useState("");
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  // 지역(REGIONS 버킷 라벨) → 근사 좌표(JobPost에 정밀 좌표 없음). 같은 지역 마커는 인덱스로 소폭 분산.
  // ※ 공고 region 은 항상 REGIONS 버킷 라벨이라 키를 버킷 라벨로 맞춤(이전엔 시단위 키라 서울 외 전부 서울로 찍힘).
  const REGION_COORDS = { "서울":[37.5665,126.978],"경기·인천":[37.4138,126.95],"충청":[36.5,127.25],"전라":[35.2,127.0],"경상":[35.9,128.5],"강원":[37.8228,128.1555],"제주":[33.4996,126.5312] };
  const jobCoord = (jp, i) => {
    const r = (jp.region && jp.region[0]) || "";
    const key = Object.keys(REGION_COORDS).find((k) => r.indexOf(k) === 0) || "서울";
    const base = REGION_COORDS[key];
    const sp = (n) => ((((i + 1) * 9301 + n * 49297) % 233280) / 233280) - 0.5;
    return [base[0] + sp(1) * 0.05, base[1] + sp(2) * 0.07];
  };
  const loadLeaflet = () => new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(null);
    if (window.L) return resolve(window.L);
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css"; link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    const ex = document.getElementById("leaflet-js");
    if (ex) { ex.addEventListener("load", () => resolve(window.L)); ex.addEventListener("error", () => { ex.remove(); resolve(null); }); return; }
    const sc = document.createElement("script");
    sc.id = "leaflet-js"; sc.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    sc.onload = () => resolve(window.L);
    sc.onerror = () => { sc.remove(); resolve(null); }; // CDN 차단/오프라인 → 무한 pending 방지
    document.body.appendChild(sc);
  });
  useEffect(() => {
    if (s.tab !== "jobs" || jobsPane !== "nearby" || realJobs === null) return;
    let cancelled = false;
    setGeoNote(""); setLocFound(false);
    loadLeaflet().then((L) => {
      if (cancelled || !L || !mapNodeRef.current) return;
      const map = L.map(mapNodeRef.current).setView([37.5665, 126.978], 11);
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "&copy; OpenStreetMap" }).addTo(map);
      (realJobs || []).forEach((jp, i) => {
        // popup: 기업 입력값(제목·지역)을 DOM 노드(textContent)로 — raw HTML 삽입 XSS 방지.
        const el = document.createElement("div");
        const b = document.createElement("b");
        b.textContent = jp.title || "공고";
        el.appendChild(b); el.appendChild(document.createElement("br"));
        el.append((jp.region || []).join(", "));
        L.circleMarker(jobCoord(jp, i), { radius: 8, color: "var(--c1,#1F2226)", weight: 2, fillColor: "var(--c1,#1F2226)", fillOpacity: 0.85 })
          .addTo(map).bindPopup(el);
      });
      window.setTimeout(() => { if (mapRef.current) mapRef.current.invalidateSize(); }, 80);
    });
    return () => { cancelled = true; userMarkerRef.current = null; if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, [s.tab, jobsPane, realJobs]);
  // '내 위치 찾기' — 버튼 클릭 시 위치 조회 → 지도를 내 주변으로 이동(빨간 마커).
  const findMyLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) { setGeoNote("이 브라우저는 위치 조회를 지원하지 않아요."); return; }
    setLocFound(true);
    setGeoNote("내 위치를 확인하는 중…");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const L = window.L; const map = mapRef.current;
        if (!L || !map) return;
        const c = [p.coords.latitude, p.coords.longitude];
        map.setView(c, 13);
        if (userMarkerRef.current) userMarkerRef.current.setLatLng(c);
        else userMarkerRef.current = L.circleMarker(c, { radius: 9, color: "#fff", weight: 3, fillColor: "#d9534f", fillOpacity: 1 }).addTo(map).bindPopup("내 위치");
        userMarkerRef.current.openPopup();
        setGeoNote("");
      },
      (err: GeolocationPositionError) => {
        if (err && err.code === err.TIMEOUT) setGeoNote("위치 확인이 지연되고 있어요. 다시 시도해 주세요.");
        else setGeoNote("위치 권한이 없어요. 브라우저에서 위치 권한을 허용하면 내 주변으로 이동합니다.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };
  // 공고 리스트 — '채용공고' 페인 + '내 위치 주변'(위치 찾은 뒤)에서 공유.
  const renderJobList = () => {
    let filtered = (Array.isArray(realJobs) ? realJobs : []).filter((jp) => {
      // 1. 검색 키워드 필터
      if (jobSearch.trim()) {
        const q = jobSearch.trim().toLowerCase();
        const haystack = [jp.title, jp.company?.name, ...(jp.region || []), ...(jp.jobType || [])].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      // 2. 4대 서브탭 필터 (jobSubTab)
      const isUrgent = (jp.title || "").includes("급구") || (jp.conditions || "").includes("급구");
      const isLarge = [jp.title, jp.conditions, jp.company?.name].join(" ").match(/반도체|조선|플랜트|대형|중공업|정유|SK|삼성|현대/);
      const isToday = (jp.period || "").match(/일당|당일|단기|오늘/);

      if (jobSubTab === 'fit') {
        // 내게 맞는 현장: 내 희망직종(user?.jobType)과 매칭되거나 추천 점수가 높은 것
        const myTrade = user?.jobType || [];
        const hasTradeMatch = (jp.jobType || []).some(t => myTrade.includes(t));
        if (myTrade.length > 0 && !hasTradeMatch) return false;
      } else if (jobSubTab === 'urgent') {
        if (!isUrgent) return false;
      } else if (jobSubTab === 'today') {
        if (!isToday) return false;
      } else if (jobSubTab === 'large') {
        if (!isLarge) return false;
      }

      // 3. 빠른 필터 (fastFilters)
      for (const filter of fastFilters) {
        if (filter === 'urgent' && !isToday) return false;
        if (filter === 'stay' && !([jp.title, jp.conditions, jp.stay || ""].join(" ").match(/숙소|숙식|제공|가능/))) return false;
        if (filter === 'meal' && !([jp.title, jp.conditions, jp.prepare || ""].join(" ").match(/식사|점심|밥|제공/))) return false;
        if (filter === 'rookie' && jp.careerBand && jp.careerBand !== 'NEWBIE' && jp.careerBand !== 'ANY') return false;
        if (filter === 'high_pay') {
          const rawWage = jp.conditions || "";
          const num = parseInt(rawWage.replace(/[^0-9]/g, "")) || 0;
          if (num < 220000 && !rawWage.match(/고단가|야간|연장|특근/)) return false;
        }
        if (filter === 'long_term' && !([jp.title, jp.description || "", jp.period || ""].join(" ").match(/장기|상주|오래|개월|년/))) return false;
        if (filter === 'large' && !isLarge) return false;
        if (filter === 'safety' && !([jp.title, jp.description || "", jp.prepare || ""].join(" ").match(/안전|교육|이수|지급|보호구/))) return false;
      }

      return true;
    });

    // 4. 정렬 로직 (jobSort)
    filtered = [...filtered].sort((a, b) => {
      if (jobSort === 'highest_wage') {
        // 일당 높은 순 정렬
        const extractWage = (cond: string) => {
          const num = cond.replace(/[^0-9]/g, "");
          return num ? parseInt(num, 10) : 0;
        };
        return extractWage(b.conditions || "") - extractWage(a.conditions || "");
      }
      if (jobSort === 'today_entry') {
        // 오늘 출근 가능 우선
        const isTodayA = (a.period || "").match(/일당|당일|단기|오늘/) ? 1 : 0;
        const isTodayB = (b.period || "").match(/일당|당일|단기|오늘/) ? 1 : 0;
        return isTodayB - isTodayA;
      }
      if (jobSort === 'ready_fit') {
        // 내 준비 상태에 맞는 순 (부족한 서류가 적은 항목 우선)
        const getMissingCount = (jp: any) => {
          let missing = 0;
          if (jp.title.match(/반도체|조선|대형/) || [jp.title, jp.company?.name].join(" ").match(/삼성|SK|현대/)) {
            if (!prepChecklist.elecCard) missing++;
            if (!prepChecklist.medCheck) missing++;
            if (!prepChecklist.gateCard) missing++;
          }
          if (!prepChecklist.idCard) missing++;
          if (!prepChecklist.safetyEdu) missing++;
          return missing;
        };
        return getMissingCount(a) - getMissingCount(b);
      }
      // closest 등 기본 정렬 (그대로 유지)
      return 0;
    });

    return (
      <div style={{ padding: "10px 20px 0" }}>
        {(realJobs === null) && (
          <div style={{ padding: "34px 0", textAlign: "center", color: "#8694a8", fontSize: "13px", fontWeight: "600" }}>공고를 불러오는 중…</div>
        )}
        {(realJobs !== null && filtered.length === 0) && (
          <div style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "20px", padding: "34px 22px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>🔍</div>
            <div style={{ fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>
              조건에 맞는 현장이 없어요
            </div>
            <div style={{ fontSize: "12.5px", color: "#8694a8", fontWeight: "500", marginTop: "8px", lineHeight: "1.65", wordBreak: "keep-all" }}>
              필터 조건을 바꾸거나 다른 검색어로 찾아보세요.
            </div>
            <button
              onClick={() => { setJobSearch(""); setFastFilters([]); setJobSort("closest"); setJobSubTab("fit"); }}
              style={{ marginTop: "14px", height: "40px", padding: "0 18px", border: "1px solid var(--c1,#1F2226)", borderRadius: "10px", background: "#fff", color: "var(--c1,#1F2226)", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}
            >
              필터 초기화
            </button>
          </div>
        )}
        {filtered.map((jp) => {
          const isUrgent = (jp.title || "").includes("급구") || (jp.conditions || "").includes("급구");
          const isLarge = [jp.title, jp.conditions, jp.company?.name].join(" ").match(/반도체|조선|플랜트|대형|중공업|정유/);
          const isToday = (jp.period || "").match(/일당|당일|단기|오늘/);
          const alreadyApplied = appliedJobs.has(jp.id);
          
          // 지원 가능 상태 체크
          let readinessStatus = "즉시 지원 가능";
          let readinessColor = "#10b981";
          let readinessBg = "#ecfdf5";
          
          if (isLarge) {
            if (!prepChecklist.elecCard) {
              readinessStatus = "전자카드 등록 필요";
              readinessColor = "#ef4444";
              readinessBg = "#fef2f2";
            } else if (!prepChecklist.medCheck) {
              readinessStatus = "신체검사서 등록 필요";
              readinessColor = "#f59e0b";
              readinessBg = "#fffbeb";
            }
          }

          return (
            <div
              key={jp.id}
              onClick={() => { track("job_detail_viewed", { jobId: jp.id, source: "jobs_list" }); setJobDetail(jp); }}
              style={{
                background: "#fff",
                border: "2px solid #e6e8ec",
                borderRadius: "22px",
                padding: "20px 22px",
                marginBottom: "16px",
                boxShadow: "0 6px 18px -8px rgba(0,0,0,0.1)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* 상단 유형 배지 */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                {isUrgent && (
                  <span style={{ fontSize: "12px", fontWeight: "900", color: "#fff", background: "#ef4444", padding: "4px 10px", borderRadius: "8px" }}>🔥 당일지급 급구</span>
                )}
                {isLarge && (
                  <span style={{ fontSize: "12px", fontWeight: "900", color: "#0d9488", background: "#ccfbf1", padding: "4px 10px", borderRadius: "8px" }}>🏗️ 대형 반도체 현장</span>
                )}
                {isToday && (
                  <span style={{ fontSize: "12px", fontWeight: "900", color: "#7c3aed", background: "#ede9fe", padding: "4px 10px", borderRadius: "8px" }}>⚡ 즉시 출근 가능</span>
                )}
                <span style={{ fontSize: "12px", fontWeight: "800", color: "#2563eb", background: "#eff6ff", padding: "4px 10px", borderRadius: "8px" }}>
                  {jp.jobType?.[0] || "기술 조공"}
                </span>
                {(jp.source === "CRAWLED_CAFE" || jp.source === "CRAWLED_BAND") && (
                  <span style={{ fontSize: "12px", fontWeight: "800", color: "#92400e", background: "#fffbeb", padding: "4px 10px", borderRadius: "8px" }}>
                    {jp.source === "CRAWLED_CAFE" ? "📋 카페 공고" : "📋 밴드 공고"}
                  </span>
                )}

                {/* 신뢰 배지 — MONO가 직접 확인한 파트너 공고에만 표시 */}
                {jp.source !== "CRAWLED_CAFE" && jp.source !== "CRAWLED_BAND" && (
                  <span style={{ marginLeft: "auto", fontSize: "12.5px", fontWeight: "800", color: "#10b981", display: "flex", alignItems: "center", gap: "3px" }}>
                    ✓ {isLarge ? "기업 준비 상태 완료" : "현장 확인 완료"}
                  </span>
                )}
              </div>

              {/* 현장 정보 */}
              <h3 style={{ margin: "0 0 6px", fontSize: "19px", fontWeight: "900", color: "var(--c1,#1F2226)", lineHeight: "1.4" }}>{jp.title}</h3>
              <div style={{ fontSize: "14.5px", color: "#5b6b82", fontWeight: "700", marginBottom: "14px" }}>
                {jp.company ? jp.company.name : "협약 기업"} · {jp.region?.join(", ") || "전국"}
              </div>

              {/* 시니어 최적화 9대 핵심 가치 및 근무환경 정보 표시 */}
              <div style={{ borderTop: "1.5px solid #f1f5f9", paddingTop: "14px", marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {/* 1. 일당 및 공수 (가장 중요하므로 크게 노출) */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "14.5px", color: "#8694a8", fontWeight: "750" }}>하루 일당 (하루 단가)</span>
                  <div style={{ textAlign: "right" }}>
                    {jp.conditions ? (
                      <>
                        <span style={{ fontSize: "22px", color: "#10b981", fontWeight: "950" }}>{jp.conditions}</span>
                        <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "700", marginTop: "2px" }}>기본 1공수 / 연장 시 가산금 지급</div>
                      </>
                    ) : jp.source === "CRAWLED_CAFE" || jp.source === "CRAWLED_BAND" ? (
                      <span style={{ fontSize: "16px", color: "#8694a8", fontWeight: "800" }}>전화 문의</span>
                    ) : (
                      <span style={{ fontSize: "22px", color: "#10b981", fontWeight: "950" }}>230,000원</span>
                    )}
                  </div>
                </div>

                {(jp.source === "CRAWLED_CAFE" || jp.source === "CRAWLED_BAND") ? (
                  /* 크롤링 공고는 MONO가 확인한 복리후생 정보가 없으므로 추측 뱃지를 붙이지 않는다 */
                  jp.period && (
                    <div style={{ fontSize: "13px", color: "#5b6b82", fontWeight: "700", background: "#f8fafc", padding: "10px 12px", borderRadius: "12px", marginTop: "4px" }}>
                      {jp.period}
                    </div>
                  )
                ) : (
                  <>
                    {/* 2. 복리후생 및 현장 환경 그리드 뱃지 */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                      {/* 식사 */}
                      <span style={{ fontSize: "12px", fontWeight: "800", color: "#2563eb", background: "#eff6ff", padding: "4px 10px", borderRadius: "8px" }}>
                        🍱 {[jp.title, jp.prepare || ""].join(" ").match(/식사|점심|밥/) ? "점심 식사 제공" : "식사 지급"}
                      </span>
                      {/* 숙소 */}
                      <span style={{ fontSize: "12px", fontWeight: "800", color: "#0d9488", background: "#f0fdfa", padding: "4px 10px", borderRadius: "8px" }}>
                        🏠 {([jp.title, jp.conditions, jp.stay || ""].join(" ").match(/숙소|숙식/)) ? "무료 숙소 지원" : "출퇴근 현장"}
                      </span>
                      {/* 이동 */}
                      <span style={{ fontSize: "12px", fontWeight: "800", color: "#4f46e5", background: "#f5f3ff", padding: "4px 10px", borderRadius: "8px" }}>
                        🚌 {isLarge ? "통근버스 운행" : "집결지 차량 지원"}
                      </span>
                      {/* 안전 */}
                      <span style={{ fontSize: "12px", fontWeight: "800", color: "#ea580c", background: "#fff7ed", padding: "4px 10px", borderRadius: "8px" }}>
                        🛡️ {isLarge ? "안전교육 필수 · 보호구 전원 지급" : "보호구 개인 지참 (안전화)"}
                      </span>
                      {/* 초보 가능 */}
                      <span style={{ fontSize: "12px", fontWeight: "800", color: "#059669", background: "#ecfdf5", padding: "4px 10px", borderRadius: "8px" }}>
                        🔰 {jp.careerBand === "NEWBIE" || jp.careerBand === "ANY" ? "초보·입문 가능" : "경력자 우대"}
                      </span>
                      {/* 받을 금액 */}
                      <span style={{ fontSize: "12px", fontWeight: "800", color: "#475569", background: "#f1f5f9", padding: "4px 10px", borderRadius: "8px" }}>
                        💳 {isToday ? "당일 즉시 받을 금액" : "익월 15일 주급/월급 받을 금액"}
                      </span>
                    </div>

                    {/* 3. 현장 평판 및 성장성 정보 */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "10px 12px", borderRadius: "12px", fontSize: "13px", marginTop: "4px" }}>
                      <span style={{ color: "#475569", fontWeight: "750" }}>
                        🌟 현장 후기 <strong>4.6</strong> <span style={{ color: "#94a3b8", fontWeight: "600" }}>(재요청 많은 현장)</span>
                      </span>
                      <span style={{ color: "#312e81", fontWeight: "850" }}>
                        🏗️ {isLarge ? "대형 반도체 경력 축적" : "기술 전수 가능 현장"}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* 하단 지원 정보 행 */}
              <div style={{ display: "flex", gap: "10px", marginTop: "16px", alignItems: "center", justifyContent: "space-between" }}>
                {/* 준비 서류 필요 여부 표시 */}
                <span style={{ fontSize: "13px", fontWeight: "900", color: readinessColor, background: readinessBg, padding: "6px 12px", borderRadius: "10px" }}>
                  {readinessStatus}
                </span>

                {(jp.source === "CRAWLED_CAFE" || jp.source === "CRAWLED_BAND") ? (
                  jp.company?.contactPhone ? (
                    <a
                      href={`tel:${jp.company.contactPhone}`}
                      onClick={(e) => { e.stopPropagation(); track("job_applied", { jobId: jp.id, subTab: jobSubTab, source: "call" }); }}
                      style={{
                        height: "46px", padding: "0 22px", border: "none", borderRadius: "12px",
                        background: "var(--c1,#1F2226)", color: "#fff",
                        fontSize: "14.5px", fontWeight: "900", fontFamily: "inherit",
                        display: "flex", alignItems: "center", textDecoration: "none",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                      }}
                    >
                      📞 전화하기
                    </a>
                  ) : (
                    <span style={{ fontSize: "13px", fontWeight: "800", color: "#8694a8" }}>연락처 없음</span>
                  )
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); track("job_applied", { jobId: jp.id, subTab: jobSubTab }); applyToJob(jp.id); }}
                    disabled={alreadyApplied}
                    style={{
                      height: "46px",
                      padding: "0 22px",
                      border: "none",
                      borderRadius: "12px",
                      background: alreadyApplied ? "var(--soft,#E5E7EB)" : "var(--c1,#1F2226)",
                      color: alreadyApplied ? "var(--c1,#1F2226)" : "#fff",
                      fontSize: "14.5px",
                      fontWeight: "900",
                      fontFamily: "inherit",
                      cursor: alreadyApplied ? "default" : "pointer",
                      boxShadow: alreadyApplied ? "none" : "0 4px 10px rgba(0,0,0,0.1)"
                    }}
                  >
                    {alreadyApplied ? "지원 완료 ✓" : "일할래요! 바로 지원"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };;
  const loadMyApplications = async () => {
    const uid = getServerId();
    if (!uid) return;
    const apps = await apiListUserApplications(uid);
    if (apps) {
      setMyApps(apps);
      setAppliedJobs(new Set(apps.map((a) => a?.jobPost?.id).filter(Boolean) as string[]));
    }
  };
  const jobsLoadedRef = useRef(false);
  useEffect(() => {
    // 홈 탭의 공고 카드도 openJob(realJobs 기준)을 쓰므로 jobs 탭 진입을 기다리지 않고 마운트 시 즉시 로드.
    if (jobsLoadedRef.current) return;
    jobsLoadedRef.current = true;
    apiListJobPosts({ limit: 60 }).then((d) => setRealJobs(d || []));
    loadMyApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 공고 지원 — 서버 계정(serverId) 보장 후 지원. 멱등(서버 upsert) + 내 지원 현황 갱신.
  const applyToJob = async (jobPostId: string) => {
    if (appliedJobs.has(jobPostId)) return;
    const uid = await ensureServerId();
    if (!uid) return;
    setAppliedJobs((p) => new Set(p).add(jobPostId));
    track("job_application_submitted", { jobPostId });
    await apiApplyJobPost(jobPostId, uid);
    await loadMyApplications();
  };

  // 출근·받을 금액 탭 — 배정(ACCEPTED) 현장 + 출근/퇴근 체크.
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const workLoadedRef = useRef(false);
  const loadAssignments = () => {
    const uid = getServerId();
    if (!uid) {
      setAssignments([]);
      return;
    }
    apiListUserAssignments(uid).then((d) => setAssignments(Array.isArray(d) ? d : []));
  };
  useEffect(() => {
    if (s.tab !== "work" || workLoadedRef.current) return;
    workLoadedRef.current = true;
    loadAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.tab]);
  const doCheckIn = (appId: string) => {
    track("check_in", { applicationId: appId });
    apiCheckIn(appId).then(() => loadAssignments()).catch(() => undefined);
  };
  // ── 출근 역류 루프 (재출근 제안) UI 상태 ──
  const [checkoutSheetApp, setCheckoutSheetApp] = useState<Assignment | null>(null);
  const [reattendSelected, setReattendSelected] = useState<string[]>([]);
  const [reattendBusy, setReattendBusy] = useState(false);

  const doCheckOut = (app: Assignment) => {
    track("check_out", { applicationId: app.id });
    if (isForeman) {
      setCheckoutSheetApp(app);
      setReattendSelected([]);
    } else {
      apiCheckOut(app.id).then(() => loadAssignments()).catch(() => undefined);
    }
  };

  const v = useMemo(() => {

    const gold='var(--a1,#1F2226)', green='var(--c1,#1F2226)', mute='#8694a8';

    // 온보딩 데이터 → 현장 경력 표시값(없으면 데모 폴백)
    const pName = (user && user.name && user.name.trim()) ? user.name.trim() : '김현장';
    const pInit = pName.charAt(0) || '김';
    const pJobArr = (user && user.jobType) ? (Array.isArray(user.jobType) ? user.jobType : [user.jobType]) : [];
    const pJob = pJobArr.length ? pJobArr.join(', ') : '형틀목공';
    const pMasked = pName.length >= 3
      ? pName.charAt(0) + '*'.repeat(pName.length - 2) + pName.charAt(pName.length - 1)
      : (pName.length === 2 ? pName.charAt(0) + '*' : pName);
    const tab=t=>s.tab===t;
    const ci=s.checkedIn;
    const qr=makeQR('var(--c0,#1F2226)');

    // steps timeline
    const labels=['지원 완료','기업 확인 중','출근 확정','출근 대기','출근 완료','퇴근 완료','근무 확정','받을 금액 예정','받을 금액 완료'];
    const times=['06.15 14:20','06.16 09:00','06.16 18:30','06.18 06:40', ci?'06.18 07:02':'', '', '', '', ''];
    const cur = ci?4:3; // current active index
    const steps=labels.map((label,i)=>{
      const done=i<cur, active=i===cur;
      return {
        label,
        line: i<labels.length-1,
        lineBg: i<cur ? 'var(--c3,#1F2226)' : '#e6e8ec',
        dotBg: done?'var(--c3,#1F2226)':(active?'#fff':'#fff'),
        dotBd: done?'var(--c3,#1F2226)':(active?gold:'#d4dae3'),
        dotInner: done
          ? React.createElement('svg',{width:11,height:11,viewBox:'0 0 12 12',fill:'none'},React.createElement('path',{d:'m2.5 6 2.3 2.3L9.5 3.5',stroke:'#fff',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'}))
          : (active?React.createElement('div',{style:{width:8,height:8,borderRadius:'50%',background:gold}}):''),
        weight: (done||active)?'700':'500',
        textColor: (done||active)?'var(--c1,#1F2226)':'#8694a8',
        timeShow: !!times[i],
        time: times[i]
      };
    });

    const mk=(trade,name,loc,dist,date,pay,stay,score,why,opt={})=>({trade,name,loc,dist,date,pay,stay,score,why,instant:!!opt.instant,verified:opt.verified!==false,safety:!!opt.safety,
      company:opt.company,people:opt.people,hours:opt.hours,settleWay:opt.settleWay,prepare:opt.prepare,risk:opt.risk,manager:opt.manager,grad:opt.grad,month:opt.month});

    const jobs=[
      mk('형틀목공','힐스테이트 송도 더스카이','인천 연수구','4.2km','6/19','230,000','숙식 제공','4.9','형틀목공 5년+ 경력과 갱폼·알폼 보유 기술이 현장 요구 조건과 정확히 일치합니다. 출근 신뢰도 98.5%로 우선 추천.',{instant:true,safety:true,company:'대주건설(주)',people:'12명',hours:'07:00–17:00',settleWay:'주급 · 에스크로 안전받을 금액',prepare:'안전화·안전모(현장 지급), 신분증',risk:'보통 · 고소작업 일부 포함',manager:'현장소장 박정호',grad:'var(--c3,#1F2226)',month:'6월'}),
      mk('철근공','래미안 원베일리','서울 서초구','11.8km','6/20','245,000','숙식 미제공','4.7','선호 현장 위치(서울)와 평점 4.8, 최근 12개월 무결근 이력이 반영되었습니다.',{company:'삼성물산 협력 · 동성건설',people:'8명',hours:'07:00–16:30',settleWay:'월급 · 계좌이체',prepare:'개인 공구, 안전화',risk:'낮음',manager:'노무담당 김선영',grad:'var(--c1,#1F2226)'}),
      mk('형틀목공','자이 평택고덕 4단지','경기 평택','38km','6/21','225,000','숙식 제공','4.6','보유 자격증(비계기능사)과 갱폼 시공 경험이 매칭되었습니다. 숙식 제공으로 원거리 출근 가능.',{instant:true,company:'GS건설 협력 · 한울ENG',people:'20명',hours:'06:30–16:30',settleWay:'주급 · 에스크로 안전받을 금액',prepare:'안전장구 일체 지급',risk:'보통',manager:'반장 이강우',grad:'var(--c1,#1F2226)'})
    ];
    jobs.forEach((j,i)=>{ j.onOpen=()=>openJob(i); });
    const homeJobs=[
      {trade:'형틀목공',dist:'4.2km',pay:'230,000',name:'힐스테이트 송도 더스카이',loc:'인천 연수구',date:'6/19',stay:'숙식 제공',onOpen:()=>openJob(0)},
      {trade:'철근공',dist:'11.8km',pay:'245,000',name:'래미안 원베일리',loc:'서울 서초구',date:'6/20',stay:'숙식 미제공',onOpen:()=>openJob(1)}
    ];
    const job=jobs[s.selJob]||jobs[0];

    const chipDefs=['전체','형틀목공','철근공','콘크리트','서울/경기','즉시 출근'];
    const chips=chipDefs.map((label,i)=>({ label, bg:i===0?green:'#fff', fg:i===0?'#fff':'#5b6b82', bd:i===0?green:'#e6e8ec' }));

    const history=[
      {name:'더샵 일산 센트럴',date:'2026.05',days:'21일',amount:'4,830,000'},
      {name:'푸르지오 김포한강',date:'2026.04',days:'19일',amount:'4,275,000'}
    ];

    // modals
    const M={
      career:{ title:'경력 자동 확인', status:'구현 예정', body:'건설근로자공제회 퇴직공제 가입 이력과 연계하여 근무 경력을 자동 검증하는 기능입니다. 실제 서비스에서는 기관 준비 상태 데이터 기반으로 경력이 자동 확인됩니다.', note:'건설근로자공제회 데이터 연동 협의·API 준비 중' },
      safety:{ title:'안전교육 자동 검증', status:'구현 예정', body:'안전보건공단의 기초안전보건교육 이수 정보와 연동하여 현장별 필수 교육 이수 여부를 자동 확인합니다. 현재는 근로자 제출 자료 기반으로 운영됩니다.', note:'안전보건공단 데이터 연동 협의 중' },
      finance:{ title:'금융 자산화 연계', status:'구현 예정', body:'축적된 근무 이력·받을 금액 데이터와 기술 신뢰도 점수를 기반으로 신용평가사·카드사와 연계한 대안 신용평가 및 금융 상품을 준비하고 있습니다.', note:'신용평가사·카드사 제휴 및 모델 개발 준비 중' },
      escrow:{ title:'에스크로 안전받을 금액', status:'구현 예정', body:'기업이 예치한 받을 금액금을 근무 확정 시 안전하게 지급하는 구조입니다. 지급 PG·오픈뱅킹 연동을 통해 받을 금액 누락과 임금 체불 위험을 줄입니다.', note:'지급 PG·오픈뱅킹 연동 준비 중' },
      share:{ title:'현장 경력 공유', status:'사용 가능', body:'공개용 현장 경력 링크와 QR을 생성하여 기업에 제출할 수 있습니다. 주민번호·계좌·상세 받을 금액액은 자동으로 마스킹되며, 열람 로그가 기록됩니다.', note:'외부 링크는 7일 후 자동 만료됩니다' },
      scope:{ title:'공개 범위 설정', status:'사용 가능', body:'기업 또는 외부인이 현장 경력를 열람할 때 공개할 항목을 직접 선택합니다. 이름 마스킹, 받을 금액액 비공개, 상세 평가 비공개 등을 항목별로 제어할 수 있습니다.', note:'기본값: 이름 일부 마스킹 · 상세 받을 금액액 비공개' },
      detailReq:{ title:'상세보기 요청 흐름', status:'사용 가능', body:'기업이 상세보기를 요청하면 ① 근로자에게 알림이 발송되고 ② 근로자가 공개 범위를 선택한 뒤 ③ 기업에게 제한된 상세 정보가 공개됩니다. 모든 열람 내역은 로그로 저장됩니다.', note:'열람 로그 저장 · 공개 범위는 언제든 회수 가능' },
      office:{ title:'오프라인 인력사무소 연동', status:'구현 예정', body:'기존 인력사무소의 출근부·배정표·전화 확인·받을 금액 업무를 디지털화하는 기능입니다. 제휴 사무소 모집, 현장 배정 표준화, 수수료 정책, 개인정보 처리 동의 체계를 준비 중입니다.', note:'제휴 인력사무소 모집 및 배정 프로세스 표준화 진행 중' },
      attend:{ title:'출근·퇴근 체크', status:'구현 예정', body:'현장 도착·퇴근 시 GPS·QR로 출퇴근을 기록하고 출근 내역을 자동 정리하는 기능입니다. 기업 배정·받을 금액과 연동됩니다.', note:'현장 출입 연동 및 위치 준비 상태 방식 설계 중' },
      apply:{ title:'출근 신청', status:'구현 예정', body:'공고에 출근을 신청하면 기업이 확인 후 배정하는 기능입니다. 배정 결과는 알림으로 안내됩니다.', note:'기업 배정·승인 흐름 연동 준비 중' }
    };
    const m=s.modal?M[s.modal]:null;

    const meRows=[
      {label:'내 현장 프로필 (내 현장 프로필)',tag:'완료',tagColor:'var(--c3,#1F2226)',icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 20 20',fill:'none'},React.createElement('circle',{cx:10,cy:7,r:3,stroke:'var(--c1,#1F2226)',strokeWidth:1.7}),React.createElement('path',{d:'M4 17c0-3 2.7-4.5 6-4.5s6 1.5 6 4.5',stroke:'var(--c1,#1F2226)',strokeWidth:1.7,strokeLinecap:'round'})),onClick:()=>openEdit()},
      {label:'준비 서류 (준비 서류)',tag:(certificates.length+educations.length)?(certificates.length+educations.length)+'건':'',tagColor:'#8694a8',icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 20 20',fill:'none'},React.createElement('path',{d:'M5 2.5h7L16 6v11.5H5V2.5Z',stroke:'var(--c1,#1F2226)',strokeWidth:1.7,strokeLinejoin:'round'}),React.createElement('path',{d:'M12 2.5V6h4',stroke:'var(--c1,#1F2226)',strokeWidth:1.7,strokeLinejoin:'round'})),onClick:()=>setOpenDocs(true)},
      {label:'일한 기록 (일한 기록)',tag:history.length?history.length+'건':'',tagColor:'#8694a8',icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 20 20',fill:'none'},React.createElement('path',{d:'M3 17h14M5 17V8l5-3.5L15 8v9M8.5 17v-4h3v4',stroke:'var(--c1,#1F2226)',strokeWidth:1.7,strokeLinejoin:'round'})),onClick:()=>setTab('work')},
      {label:'받을 금액 (받을 금액)',tag:'조회',tagColor:'#8694a8',icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 20 20',fill:'none'},React.createElement('rect',{x:3,y:5,width:14,height:11,rx:2,stroke:'var(--c1,#1F2226)',strokeWidth:1.7},React.createElement('path',{d:'M3 9h14',stroke:'var(--a1,#1F2226)',strokeWidth:1.7}))),onClick:()=>setTab('work')}
    ];

    return {
      isHome:tab('home'), isJobs:tab('jobs'), isCommunity:tab('community'), isWork:tab('work'), isMe:tab('me'),
      goHome:()=>setTab('home'), goJobs:()=>setTab('jobs'), goCommunity:()=>setTab('community'), goWork:()=>setTab('work'), goMe:()=>setTab('me'),
      cHome:tab('home')?green:mute, cJobs:tab('jobs')?green:mute, cCommunity:tab('community')?green:mute, cWork:tab('work')?green:mute, cMe:tab('me')?green:mute,
      fHome:tab('home')?'var(--soft,#E5E7EB)':'none', fJobs:tab('jobs')?'var(--soft,#E5E7EB)':'none', fCommunity:tab('community')?'var(--soft,#E5E7EB)':'none', fWork:tab('work')?'var(--soft,#E5E7EB)':'none', fMe:tab('me')?'var(--soft,#E5E7EB)':'none',
      wHome:tab('home')?'800':'600', wJobs:tab('jobs')?'800':'600', wCommunity:tab('community')?'800':'600', wWork:tab('work')?'800':'600', wMe:tab('me')?'800':'600',
      dotHome:tab('home')?gold:'transparent', dotJobs:tab('jobs')?gold:'transparent', dotCommunity:tab('community')?gold:'transparent', dotWork:tab('work')?gold:'transparent', dotMe:tab('me')?gold:'transparent',
      clipCommunity:tab('community')?gold:'none', clipWork:tab('work')?gold:'none',

      qr,
      name: pName, initial: pInit, myJob: pJob, maskedName: pMasked,

      // 프로필 완성도 + 다음 행동 CTA (완성도 미터 아래, 부족한 항목 시트로 연결)
      completion,
      meCta: (() => {
        if (!user?.jobType?.length) return { label: '기본 프로필 완성하기', act: () => openEdit() };
        if (careerCards.length === 0) return { label: '경력 카드 추가하기', act: () => setOpenCareerSheet(true) };
        if (certificates.length === 0 && educations.length === 0) return { label: '자격증·교육 등록하기', act: () => setOpenDocs(true) };
        if (careerCards.length < 3) return { label: '경력 1건 더 추가하기', act: () => setOpenCareerSheet(true) };
        return null;
      })(),

      // attendance
      checkPhase: ci?'출근 완료 · 근무 중':'출근 예정 · 07:00',
      checkDot: ci?'#5fd1a0':'var(--a1,#1F2226)',
      checkDotHalo: ci?'rgba(95,209,160,.25)':'color-mix(in srgb, var(--brand,#1F2226) 25%, transparent)',
      inTime: ci?'07:02':'07:00',
      checkBtnLabel: ci?'퇴근 체크하기':'출근 체크하기',
      // 미출근 CTA: 인디고 카드 위 흰색 버튼+인디고 글자(토스식). 과거 var(--a1) 골드가 카드와 동색(인디고)으로 묻혀 안 보였음.
      checkBtnBg: ci?'rgba(255,255,255,.14)':'#fff',
      checkBtnFg: ci?'var(--t0,#E5E7EB)':'var(--c1,#1F2226)',
      toggleCheck:()=>open('attend'),

      homeJobs, jobs, chips, history, steps, meRows,
      openCareer:()=>open('career'),
      openFinance:()=>open('finance'),
      openShare:()=>setOpenShareSheet(true),
      openScope:()=>open('scope'),
      openEscrow:()=>open('escrow'),
      openOffice:()=>open('office'),
      openDetailReq:()=>open('detailReq'),
      openSafetyM:()=>open('safety'),

      // permission-based card view
      publicRows:[
        {k:'안전교육 이수', v:'이수 완료 (100%)'},
        {k:'자격증 보유', v:'비계기능사 외 2'},
        {k:'최근 현장 유형', v:'아파트 · 주상복합'},
        {k:'참여 현장', v:'37곳'},
        {k:'무결근 기간', v:'최근 12개월'}
      ],
      privateRows:['주민등록번호','계좌 정보','상세 받을 금액액','연락처','상세 평가 코멘트'],
      isMyView:s.cardView==='me', isPublicView:s.cardView==='public',
      setMyView:()=>setCardView('me'), setPublicView:()=>{ if(s.cardView!=='public') track('profile_previewed'); setCardView('public'); },
      viewMeBg:s.cardView==='me'?'var(--c1,#1F2226)':'transparent', viewMeFg:s.cardView==='me'?'#fff':'#5b6b82',
      viewPubBg:s.cardView==='public'?'var(--c1,#1F2226)':'transparent', viewPubFg:s.cardView==='public'?'#fff':'#5b6b82',

      // onboarding overlay

      // card variants
      isV0:s.variant===0, isV1:s.variant===1, isV2:s.variant===2,
      setV0:()=>setV(0), setV1:()=>setV(1), setV2:()=>setV(2),
      ring0:s.variant===0?gold:'#e6e8ec', ring1:s.variant===1?gold:'#e6e8ec', ring2:s.variant===2?gold:'#e6e8ec',
      ringT0:s.variant===0?'var(--c1,#1F2226)':'#8694a8', ringT1:s.variant===1?'var(--c1,#1F2226)':'#8694a8', ringT2:s.variant===2?'var(--c1,#1F2226)':'#8694a8',
      flip:()=>flip(),
      isFront:!s.flipped, isBack:s.flipped,
      flipHint: s.flipped?'앞면 보기 ↺':'뒷면 보기 ↺',

      // settlement
      toggleSettle:()=>toggleSettle(),
      settleOpen:s.settleOpen,
      settleLabel: s.settleOpen?'상세 계산 접기 ▲':'왜 이 금액인가요? 상세 계산 보기 ▼',

      // modal
      modalOpen:!!m,
      modalTitle:m?m.title:'',
      modalStatus:m?m.status:'',
      modalBody:m?m.body:'',
      modalNote:m?m.note:'',
      closeModal:()=>close()
    };
    // v 는 user/s/completion/careerCards/certificates/educations 만 읽음(핸들러는 함수형 setState).
  }, [user, s, completion, careerCards, certificates, educations]);


  return (
    <div className="mono-stage">
      <aside className="mono-sidebar">
        <div className="mono-sidebar-brand"><span className="mono-sidebar-logo">M</span>MONO</div>
        <nav className="mono-sidebar-nav">
          <button type="button" onClick={v.goHome} className={`mono-sidebar-item${v.isHome ? " active" : ""}`}>홈</button>
          <button type="button" onClick={v.goJobs} className={`mono-sidebar-item${v.isJobs ? " active" : ""}`}>현장 찾기</button>
          <button type="button" onClick={v.goCommunity} className={`mono-sidebar-item${v.isCommunity ? " active" : ""}`}>커뮤니티</button>
          <button type="button" onClick={v.goWork} className={`mono-sidebar-item${v.isWork ? " active" : ""}`}>지원·출근</button>
          <button type="button" onClick={v.goMe} className={`mono-sidebar-item${v.isMe ? " active" : ""}`}>내 프로필</button>
        </nav>
        <div className="mono-sidebar-foot">현장 인력 데이터 인프라 · v0.1.0</div>
      </aside>
<div className="mono-frame scr">

      
      {/* 실기기 노치/상태바 영역(safe-area)만큼만 비워두는 상단 스페이서. 데스크톱 폰 프레임에선 env()=0이라 최소 여백만 남음. */}
      <div style={{ height: "calc(max(env(safe-area-inset-top, 0px), 24px) + 14px)", flex: "none" }}></div>

      
      <div key={s.tab} className="scr" style={{ flex: "1", overflowY: "auto", overflowX: "hidden", position: "relative", paddingBottom: "110px", animation: "tabIn .26s ease both" }}>

        
        {(v.isHome) && (<>
        <div style={{ padding: "6px 20px 30px" }}>
          {/* Welcome Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0 16px", gap: "12px" }}>
            <div style={{ minWidth: "0" }}>
              <div style={{ fontSize: "20px", color: "var(--c1,#1F2226)", fontWeight: "950", wordBreak: "keep-all" }}>반가워요! 오늘의 추천 현장입니다.</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "none" }}>
              <button type="button" onClick={openNotifs} aria-label="알림" style={{ position: "relative", width: "44px", height: "44px", border: "1px solid #e6e8ec", borderRadius: "14px", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "0" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3a4 4 0 0 0-4 4v3l-1.5 2.5h11L14 10V7a4 4 0 0 0-4-4Z" stroke="var(--c1,#1F2226)" strokeWidth="1.6" strokeLinejoin="round"></path><path d="M8.5 15a1.5 1.5 0 0 0 3 0" stroke="var(--c1,#1F2226)" strokeWidth="1.6" strokeLinecap="round"></path></svg>
                {unread > 0 && (<span style={{ position: "absolute", top: "-5px", right: "-5px", minWidth: "18px", height: "18px", padding: "0 5px", borderRadius: "9px", background: "#d9534f", color: "#fff", fontSize: "12px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--bg,#f5f6fb)", boxSizing: "border-box" }}>{unread > 99 ? "99+" : unread}</span>)}
              </button>
              <div onClick={v.goMe} style={{ position: "relative", width: "48px", height: "48px", flex: "none", cursor: "pointer" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "16px", background: "var(--c3,#1F2226)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "800", fontSize: "18.5px", boxShadow: "0 6px 16px -4px color-mix(in srgb, var(--brand,#1F2226) 50%, transparent), inset 0 0 0 1.5px color-mix(in srgb, var(--brand,#1F2226) 45%, transparent)" }}>{v.initial}</div>
              </div>
            </div>
          </div>



          <>
              {/* 오늘의 1분 안전 퀴즈 위젯 */}
              <div style={{ background: "#ffffff", border: "2px solid #e6e8ec", borderRadius: "22px", padding: "18px 20px", marginBottom: "16px", boxShadow: "0 4px 14px -10px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "16.5px", fontWeight: "900", color: "#4f46e5" }}>🚨 오늘의 1분 안전 퀴즈 (신뢰 +10점)</span>
              {quizAnswered && <span style={{ fontSize: "13.5px", color: "#10b981", fontWeight: "800" }}>완료됨 ✓</span>}
            </div>
            {!quizAnswered ? (
              <div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--c1,#1F2226)", lineHeight: "1.5" }}>
                  Q. 높은 곳(고소) 작업 시, 추락 방지를 위해 신체와 현장 구조물을 단단히 결속시키는 장비는 무엇일까요?
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                  <button
                    type="button"
                    onClick={() => alert("❌ 오답입니다! 다른 정답을 골라보세요.")}
                    style={{ height: "48px", borderRadius: "10px", border: "1.5px solid #e6e8ec", background: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer", textAlign: "left", paddingLeft: "14px" }}
                  >
                    1. 🥾 일반 가죽 장갑
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      alert("🎉 정답입니다! 신뢰도 점수 +10점이 가산되었습니다.");
                      setQuizAnswered(true);
                      localStorage.setItem("mono_quiz_answered", "true");
                      setTrustScore(prev => {
                        if (prev) {
                          const nextScore = prev.score + 10;
                          let nextGrade = prev.grade;
                          if (nextScore >= 95) nextGrade = "A등급";
                          return { ...prev, score: nextScore, grade: nextGrade };
                        }
                        return { score: 10, grade: "C등급" };
                      });
                      track("quiz_completed", { score_gain: 10 });
                    }}
                    style={{ height: "48px", borderRadius: "10px", border: "1.5px solid #4f46e5", background: "#eff6ff", color: "#2563eb", fontSize: "15px", fontWeight: "800", cursor: "pointer", textAlign: "left", paddingLeft: "14px" }}
                  >
                    2. ⛓️ 안전고리가 달린 추락방지용 안전대
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("❌ 오답입니다! 다른 정답을 골라보세요.")}
                    style={{ height: "48px", borderRadius: "10px", border: "1.5px solid #e6e8ec", background: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer", textAlign: "left", paddingLeft: "14px" }}
                  >
                    3. 🧢 햇빛 가림용 작업 모자
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f0fdf4", padding: "12px", borderRadius: "12px" }}>
                <span style={{ fontSize: "20px" }}>🏆</span>
                <span style={{ fontSize: "15.5px", fontWeight: "800", color: "#166534" }}>
                  오늘의 안전 수칙을 마스터했습니다! (+10점 반영 완료)
                </span>
              </div>
            )}
          </div>

          {/* Active Attendance Badge/Card (if checked-in) */}
          {s.checkedIn && (
            <div style={{ borderRadius: "20px", background: "var(--c1,#1F2226)", padding: "16px", color: "var(--t0,#E5E7EB)", position: "relative", overflow: "hidden", marginBottom: "16px", boxShadow: "0 10px 24px -10px color-mix(in srgb, var(--brand,#1F2226) 80%, transparent)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#5fd1a0", boxShadow: "0 0 0 4px rgba(95,209,160,.25)" }}></span>
                <span style={{ fontSize: "13.5px", fontWeight: "700", color: "var(--t1,#A5AEB8)", letterSpacing: ".3px" }}>현재 출근 중 · 힐스테이트 송도 더스카이</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                <span style={{ fontSize: "15.5px", fontWeight: "700" }}>오늘 근무: {v.myJob}</span>
                <button onClick={v.toggleCheck} style={{ height: "44px", padding: "0 14px", border: "none", borderRadius: "10px", background: "rgba(255,255,255,.14)", color: "#fff", fontSize: "14.5px", fontWeight: "800", cursor: "pointer" }}>퇴근하기</button>
              </div>
            </div>
          )}

          {/* 오늘 할 일 — 실 데이터 기반 동적 생성 */}
          {(() => {
            const todayItems: { icon: string; tag: string; tagColor: string; text: string; onClick?: () => void }[] = [];
            if (completion < 80) {
              todayItems.push({ icon: "👤", tag: "[프로필]", tagColor: "#8b5cf6", text: `프로필 완성도 ${completion}% — 더 높이면 매칭 확률이 올라가요`, onClick: v.goMe });
            }
            if (!prepChecklist.elecCard) {
              todayItems.push({ icon: "⚙️", tag: "[준비]", tagColor: "#4f46e5", text: "전자카드 등록이 필요해요", onClick: v.goMe });
            }
            if (!prepChecklist.safetyEdu) {
              todayItems.push({ icon: "🎓", tag: "[교육]", tagColor: "#f59e0b", text: "기초 안전 교육 수료증이 없어요" });
            }
            const pendingApps = myApps.filter((a) => a.status === "PENDING" || a.status === "REVIEWING" || a.status === "CONTACT_PENDING");
            if (pendingApps.length > 0) {
              todayItems.push({ icon: "📬", tag: "[지원]", tagColor: "#10b981", text: `${pendingApps.length}개 공고 답변 대기 중이에요`, onClick: v.goWork });
            }
            const todayJobCount = (Array.isArray(realJobs) ? realJobs : []).filter((jp) =>
              (jp.period || "").match(/일당|당일|단기|오늘/)
            ).length;
            if (todayJobCount > 0) {
              todayItems.push({ icon: "🔍", tag: "[지원]", tagColor: "#10b981", text: `오늘 지원 가능한 단기 현장이 ${todayJobCount}개 있어요`, onClick: v.goJobs });
            }
            const hasAssignment = Array.isArray(assignments) && assignments.length > 0;
            if (hasAssignment) {
              const nextSite = assignments![0];
              todayItems.push({ icon: "⏰", tag: "[출근]", tagColor: "#ef4444", text: `확정 현장: ${nextSite.jobPost?.title || "현장"} — 출근 체크를 잊지 마세요`, onClick: v.goWork });
            }
            const now = new Date();
            const monthAtts = (Array.isArray(assignments) ? assignments : []).flatMap((a) => (a.attendances || []))
              .filter((at) => { const d = new Date(at.checkInAt || at.workDate); return at.checkOutAt && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
            const manDays = Math.round(monthAtts.reduce((s, at) => s + (new Date(at.checkOutAt).getTime() - new Date(at.checkInAt).getTime()) / 3600000, 0) / 8 * 10) / 10;
            if (monthAtts.length > 0) {
              todayItems.push({ icon: "📊", tag: "[기록]", tagColor: "#f59e0b", text: `이번 달 ${manDays}공수 기록되었어요` });
            }
            if (!isForeman && !myRequested) {
              todayItems.push({ icon: "👷", tag: "[성장]", tagColor: "#4f46e5", text: "팀을 등록하고 반장으로 활동해보세요", onClick: v.goMe });
            }
            if (todayItems.length === 0) {
              todayItems.push({ icon: "✅", tag: "[완료]", tagColor: "#10b981", text: "오늘 할 일이 없어요. 편안한 하루 되세요! 🎉" });
            }
            return (
              <div style={{ background: "#ffffff", border: "1px solid #e6e8ec", borderRadius: "20px", padding: "18px", marginBottom: "16px", boxShadow: "0 4px 14px -10px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: "16.5px", fontWeight: "800", color: "var(--c1,#1F2226)", marginBottom: "12px" }}>🗓️ 오늘 할 일</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {todayItems.map((item, i) => (
                    <div
                      key={i}
                      onClick={item.onClick}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "10px 12px", background: "#f8fafc", borderRadius: "12px",
                        cursor: item.onClick ? "pointer" : "default",
                      }}
                    >
                      <span style={{ fontSize: "16px", flexShrink: 0 }}>{item.icon}</span>
                      <div style={{ fontSize: "14.5px", fontWeight: "600", color: "#374151" }}>
                        <span style={{ color: item.tagColor, fontWeight: "800" }}>{item.tag} </span>
                        {item.text}
                      </div>
                      {item.onClick && <span style={{ marginLeft: "auto", fontSize: "12.5px", color: "#a0aec0" }}>›</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* 준비 상태 카드 */}
          <div style={{ background: "#ffffff", border: "2px solid #e6e8ec", borderRadius: "22px", padding: "20px 22px", marginBottom: "16px", boxShadow: "0 6px 16px -10px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "18.5px", fontWeight: "900", color: "var(--c1,#1F2226)" }}>🚦 일하기 전 필수 서류 준비</span>
              <span onClick={() => setTab('me')} style={{ fontSize: "15.5px", color: "#4f46e5", fontWeight: "800", cursor: "pointer" }}>서류 등록하기 →</span>
            </div>
            
            {(() => {
              const checkedCount = Object.values(prepChecklist).filter(Boolean).length;
              const totalCount = Object.keys(prepChecklist).length;
              const percent = Math.round((checkedCount / totalCount) * 100);
              return (
                <>
                  <div style={{ fontSize: "16.5px", color: "#5b6b82", fontWeight: "800", marginBottom: "4px" }}>
                    총 {totalCount}개 서류 중 <strong style={{ color: "#10b981", fontSize: "18.5px" }}>{checkedCount}개</strong> 준비 완료되었습니다. ({percent}%)
                  </div>
                  <div style={{ fontSize: "14.5px", color: "#4f46e5", fontWeight: "700", marginBottom: "12px", lineHeight: "1.4" }}>
                    {percent === 100 
                      ? "🎉 모든 필수 서류가 등록되었습니다! 즉시 현장 출근이 가능합니다."
                      : "💡 부족한 서류를 마저 등록하시면 대형 건설 현장 매칭이 더욱 빨라집니다."}
                  </div>
                  <div style={{ height: "10px", background: "#eef0f3", borderRadius: "5px", overflow: "hidden", marginBottom: "18px" }}>
                    <div style={{ width: `${percent}%`, height: "100%", background: "#10b981", borderRadius: "5px", transition: "width 0.3s ease" }}></div>
                  </div>
                </>
              );
            })()}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {[
                { key: 'idCard', label: '신분증' },
                { key: 'safetyEdu', label: '기초교육' },
                { key: 'elecCard', label: '전자카드' },
                { key: 'bankAcc', label: '계좌등록' },
                { key: 'medCheck', label: '신체검사' },
                { key: 'gateCard', label: '출입카드' },
                { key: 'safetyGear', label: '안전화' },
              ].map((item) => {
                const isReady = prepChecklist[item.key as keyof typeof prepChecklist];
                return (
                  <div
                    key={item.key}
                    style={{
                      padding: "12px 2px", borderRadius: "12px", textAlign: "center",
                      background: isReady ? "#f0fdf4" : "#fef2f2",
                      border: `2px solid ${isReady ? "#22c55e" : "#ef4444"}`,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                    }}
                  >
                    <div style={{ fontSize: "15px", fontWeight: "950", color: isReady ? "#166534" : "#991b1b" }}>{item.label}</div>
                    <div style={{ fontSize: "13px", marginTop: "6px", fontWeight: "900", color: isReady ? "#15803d" : "#b91c1c", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
                      <span>{isReady ? "✅" : "❌"}</span>
                      <span>{isReady ? "준비완료" : "미등록"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button
              onClick={() => {
                track("job_search_opened", { source: "home_readiness_cta" });
                v.goJobs();
              }}
              style={{
                marginTop: "16px", width: "100%", height: "48px",
                border: "none", borderRadius: "12px",
                background: "#4f46e5", color: "#fff",
                fontSize: "16px", fontWeight: "900", cursor: "pointer",
                boxShadow: "0 4px 12px rgba(79,70,229,0.2)",
                transition: "all 0.2s"
              }}
            >
              지원 가능한 현장 현장 찾기
            </button>
          </div>
          </>

          {/* 바로 지원 가능한 현장 */}
          <div style={{ marginTop: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "16.5px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>✨ 바로 지원 가능한 현장</span>
              <span onClick={() => { track("job_search_opened", { source: "home_fit_jobs_more" }); v.goJobs(); }} style={{ fontSize: "14px", color: "var(--c1,#1F2226)", fontWeight: "700", cursor: "pointer" }}>더 보기</span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div
                onClick={() => { track("job_detail_viewed", { jobId: "0", source: "home_fit" }); openJob(0); }}
                style={{
                  background: "#fff", border: "1px solid #e6e8ec", borderRadius: "18px",
                  padding: "16px", cursor: "pointer", boxShadow: "0 4px 14px -10px rgba(0,0,0,0.05)",
                  transition: "all 0.15s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "13px", fontWeight: "850", color: "#4f46e5", background: "#eeebff", padding: "3.5px 9px", borderRadius: "6px" }}>
                    98.5% 매칭 (내 경력과 거의 일치해요)
                  </span>
                  <span className="mono" style={{ fontSize: "16px", fontWeight: "700", color: "var(--c1,#1F2226)" }}>₩230,000</span>
                </div>
                <h4 style={{ margin: "6px 0 4px", fontSize: "16.5px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>힐스테이트 송도 더스카이</h4>
                <p style={{ margin: 0, fontSize: "14px", color: "#8694a8", fontWeight: "500" }}>인천 연수구 · 형틀목공 조공 · 숙식 제공</p>
                <div style={{ fontSize: "13.5px", color: "#4f46e5", fontWeight: "700", marginTop: "8px", background: "#f5f3ff", padding: "6px 10px", borderRadius: "8px" }}>
                  💡 회원님의 형틀목공 경력과 자격요건이 일치하여 강력 추천합니다.
                </div>
              </div>

              <div
                onClick={() => { track("job_detail_viewed", { jobId: "2", source: "home_fit" }); openJob(2); }}
                style={{
                  background: "#fff", border: "1px solid #e6e8ec", borderRadius: "18px",
                  padding: "16px", cursor: "pointer", boxShadow: "0 4px 14px -10px rgba(0,0,0,0.05)",
                  transition: "all 0.15s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "12.5px", fontWeight: "800", color: "#0d9488", background: "#f0fdfa", padding: "3px 8px", borderRadius: "6px" }}>95% 매칭</span>
                  <span className="mono" style={{ fontSize: "16px", fontWeight: "700", color: "var(--c1,#1F2226)" }}>₩225,000</span>
                </div>
                <h4 style={{ margin: "6px 0 4px", fontSize: "16.5px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>자이 평택고덕 4단지</h4>
                <p style={{ margin: 0, fontSize: "14px", color: "#8694a8", fontWeight: "500" }}>경기 평택 · 형틀목공 조공 · 숙식 제공</p>
                <div style={{ fontSize: "13.5px", color: "#0d9488", fontWeight: "700", marginTop: "8px", background: "#f0fdfa", padding: "6px 10px", borderRadius: "8px" }}>
                  💡 비계기능사 자격증과 갱폼 시공 경험이 일치합니다.
                </div>
              </div>
            </div>
          </div>

          {/* 급구 현장 */}
          <div style={{ marginTop: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "16.5px", fontWeight: "800", color: "#dc2626", display: "flex", alignItems: "center", gap: "4px" }}>🚨 급구 현장</span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {(() => {
                const urgentJobs = (realJobs || []).filter(j => 
                  [j.title, j.description, j.period].join(" ").match(/급구|긴급|당일|오늘/)
                ).slice(0, 2);
                
                if (urgentJobs.length === 0) {
                  // Fallback mock urgent card
                  return (
                    <div
                      onClick={() => { track("urgent_job_viewed", { jobId: "0", source: "home_urgent" }); openJob(0); }}
                      style={{
                        background: "#fffbfa",
                        border: "3px solid #dc2626",
                        borderRadius: "18px",
                        padding: "20px",
                        cursor: "pointer",
                        boxShadow: "0 4px 14px -10px rgba(220,38,38,0.05)"
                      }}
                    >
                      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <div style={{ width: "76px", height: "76px", borderRadius: "16px", background: "#fff5f5", border: "2px solid #feb2b2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", flexShrink: 0 }}>🚨</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
                            <span style={{ fontSize: "13.5px", fontWeight: "900", color: "#dc2626", background: "#fee2e2", padding: "2px 8px", borderRadius: "6px" }}>🔥 긴급급구</span>
                            <strong style={{ fontSize: "21px", fontWeight: "950", color: "#dc2626" }}>일당 23만원</strong>
                          </div>
                          <h4 style={{ margin: "4px 0 6px", fontSize: "19px", fontWeight: "950", color: "#0f172a" }}>힐스테이트 송도 더스카이</h4>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 10px", fontSize: "16px", color: "#dc2626", fontWeight: "800" }}>
                            <span>📍 인천 연수구 (당일지급)</span>
                            <span>👷 형틀목공 조공 (초보조공)</span>
                            <span>🏠 점심제공 (장비 대여)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                return urgentJobs.map((jp) => (
                  <div
                    key={jp.id}
                    onClick={() => { track("urgent_job_viewed", { jobId: jp.id, source: "home_urgent" }); openJob(realJobs.indexOf(jp)); }}
                    style={{
                      background: "#fffdfd", border: "1px solid #fecaca", borderRadius: "18px",
                      padding: "16px", cursor: "pointer", boxShadow: "0 4px 14px -10px rgba(220,38,38,0.05)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{ fontSize: "12.5px", fontWeight: "800", color: "#dc2626", background: "#fef2f2", padding: "3px 8px", borderRadius: "6px" }}>🔥 긴급급구</span>
                      <span className="mono" style={{ fontSize: "16px", fontWeight: "700", color: "#dc2626" }}>{jp.conditions || "협의"}</span>
                    </div>
                    <h4 style={{ margin: "6px 0 4px", fontSize: "16.5px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>{jp.title}</h4>
                    <p style={{ margin: 0, fontSize: "14px", color: "#8694a8", fontWeight: "500" }}>{jp.region?.join(", ") || "전국"} · {jp.jobType?.join(", ") || "기술조공"} · 식사/숙소 가능</p>
                  </div>
                ));
              })()}
              
              <button
                onClick={() => {
                  track("job_search_opened", { source: "home_urgent_cta" });
                  v.goJobs();
                }}
                style={{
                  width: "100%", height: "48px", border: "none", borderRadius: "12px",
                  background: "var(--c1,#1F2226)", color: "#fff",
                  fontSize: "15px", fontWeight: "800", cursor: "pointer",
                  marginTop: "4px"
                }}
              >
                오늘 현장 보기
              </button>
            </div>
          </div>

          {/* AI 현장 가이드 */}
          <div style={{ background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: "20px", padding: "18px", marginTop: "24px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "24px" }}>🤖</span>
              <div>
                <h4 style={{ margin: 0, fontSize: "16.5px", fontWeight: "800", color: "#312e81" }}>처음 보는 현장 용어가 있나요?</h4>
                <p style={{ margin: "2px 0 0", fontSize: "14px", color: "#4f46e5", fontWeight: "600", lineHeight: "1.4" }}>
                  야리끼리, 데마찌, 단도리, 공구리, 덴조, 하바키 등 뜻을 알고 싶은 단어를 아래에 입력해 보세요.
                </p>
              </div>
            </div>
            
            {/* 용어 즉석 입력 검색창 */}
            <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
              <input
                type="text"
                id="jargon_search_input"
                placeholder="예: 데마찌, 공구리, 야리끼리"
                style={{
                  flex: 1, minWidth: 0, height: "46px", border: "2px solid #c7d2fe", borderRadius: "12px",
                  padding: "0 12px", fontSize: "15.5px", fontWeight: "800", fontFamily: "inherit",
                  outline: "none"
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.currentTarget as HTMLInputElement).value;
                    if (val.trim()) {
                      setAiGlossarySearch(val.trim());
                      track("jargon_searched", { word: val.trim() });
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const inputEl = document.getElementById("jargon_search_input") as HTMLInputElement;
                  if (inputEl && inputEl.value.trim()) {
                    setAiGlossarySearch(inputEl.value.trim());
                    track("jargon_searched", { word: inputEl.value.trim() });
                  } else {
                    alert("검색할 단어를 입력해주세요. (예: 데마찌)");
                  }
                }}
                style={{
                  flex: "none", width: "70px", height: "46px", border: "none", borderRadius: "12px",
                  background: "#4f46e5", color: "#fff", fontSize: "15px", fontWeight: "900", cursor: "pointer"
                }}
              >
                검색
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
              <button
                type="button"
                onClick={() => {
                  track("large_site_guide_viewed", { source: "home_ai_btn" });
                  setActiveGuide('large');
                }}
                style={{
                  width: "100%", height: "48px", border: "1px solid #ccfbf1", borderRadius: "12px",
                  background: "#f0fdfa", color: "#0d9488",
                  fontSize: "14.5px", fontWeight: "800", cursor: "pointer"
                }}
              >
                🏗️ 대형 현장 준비하기
              </button>
            </div>
          </div>

          {/* 커뮤니티 인기 글 */}
          <div style={{ marginTop: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "16.5px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>💬 커뮤니티 인기 글</span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div
                onClick={() => { track("community_room_viewed", { room: "PRIME", subRoom: "삼성 평택" }); v.goCommunity(); }}
                style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "16px", padding: "14px", cursor: "pointer" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", color: "#8694a8", marginBottom: "4px" }}>
                  <span style={{ fontWeight: "700", color: "#4f46e5" }}>삼성 평택 현장방</span>
                  <span>10분 전</span>
                </div>
                <div style={{ fontSize: "15px", fontWeight: "800", color: "#1f2937" }}>오늘 평택 2기 TBM 집결 시간이 변경되었습니다.</div>
                <div style={{ fontSize: "13.5px", color: "#8694a8", marginTop: "6px" }}>👍 도움돼요 14 · 💬 댓글 9</div>
              </div>

              <div
                onClick={() => { track("community_room_viewed", { room: "ROLE", subRoom: "형틀목공" }); v.goCommunity(); }}
                style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "16px", padding: "14px", cursor: "pointer" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", color: "#8694a8", marginBottom: "4px" }}>
                  <span style={{ fontWeight: "700", color: "#0d9488" }}>형틀목공 직무방</span>
                  <span>40분 전</span>
                </div>
                <div style={{ fontSize: "15px", fontWeight: "800", color: "#1f2937" }}>초보 조공 단가 요즘 송도 쪽은 보통 얼마 선인가요?</div>
                <div style={{ fontSize: "13.5px", color: "#8694a8", marginTop: "6px" }}>👍 도움돼요 8 · 💬 댓글 15</div>
              </div>
              
              <button
                onClick={() => {
                  track("community_opened", { source: "home_cta" });
                  v.goCommunity();
                }}
                style={{
                  width: "100%", height: "46px", border: "1.5px solid #e6e8ec", borderRadius: "12px",
                  background: "#ffffff", color: "#5b6b82",
                  fontSize: "14.5px", fontWeight: "800", cursor: "pointer",
                  marginTop: "4px"
                }}
              >
                우리 지역 현장 이야기 보기
              </button>
            </div>
          </div>

          {/* 내 경력 성장 카드 (경력 카드 미리보기) */}
          <div style={{ marginTop: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "16.5px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>💳 나의 MONO 경력 성장 카드</span>
              <span onClick={v.goMe} style={{ fontSize: "14px", color: "#4f46e5", fontWeight: "700", cursor: "pointer" }}>열기 →</span>
            </div>
            
            <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", borderRadius: "20px", padding: "20px", color: "#fff", position: "relative", overflow: "hidden", boxShadow: "0 10px 20px rgba(49,46,129,0.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "900", letterSpacing: "0.5px" }}>MONO certified technician</div>
                  <div style={{ fontSize: "13.5px", color: "#c7d2fe", marginTop: "2px" }}>출근 및 경력 신뢰도 준비 상태서</div>
                </div>
                <span style={{ fontSize: "20px" }}>👑</span>
              </div>
              
              <div style={{ marginTop: "24px" }}>
                <div style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "1px" }}>{v.maskedName}</div>
                <div style={{ fontSize: "14.5px", color: "#a5b4fc", marginTop: "2px" }}>{v.myJob || "일반 조공"}</div>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "24px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "14px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#a5b4fc" }}>등록 경력 카드</div>
                  <div style={{ fontSize: "16.5px", fontWeight: "700", marginTop: "2px" }}>{careerCards.length}건</div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "#a5b4fc" }}>신뢰 점수 등급</div>
                  <div style={{ fontSize: "16.5px", fontWeight: "700", marginTop: "2px" }}>
                    {trustScore ? `${trustScore.grade} (${trustScore.score}점)` : "준비 상태 대기"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "12px", color: "#a5b4fc" }}>상태</div>
                  <div style={{ fontSize: "14.5px", fontWeight: "800", marginTop: "2px", color: "#34d399" }}>
                    {(() => {
                      if (careerCards.length === 0) return "입문 준비 중";
                      if (careerCards.length <= 3) return "현장 경험 축적 중";
                      return "숙련도 상승 중";
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        </>)}

        {(v.isJobs) && (<>
        <div style={{ padding: "6px 0 30px" }}>
          <div style={{ padding: "8px 20px 2px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>현장 찾기</div>
            
            {/* 보기 방식 토글 */}
            <div style={{ display: "flex", background: "#f1f3f7", padding: "3px", borderRadius: "10px", gap: "2px" }}>
              <button
                type="button"
                onClick={() => { track("job_filter_selected", { mode: "list" }); setJobsViewMode('list'); }}
                style={{
                  padding: "6px 12px", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "700",
                  background: jobsViewMode === 'list' ? "#fff" : "transparent",
                  color: jobsViewMode === 'list' ? "var(--c1,#1F2226)" : "#5b6b82",
                  cursor: "pointer", boxShadow: jobsViewMode === 'list' ? "0 2px 5px rgba(0,0,0,0.06)" : "none"
                }}
              >
                목록 보기
              </button>
              <button
                type="button"
                onClick={() => { track("job_filter_selected", { mode: "map" }); setJobsViewMode('map'); }}
                style={{
                  padding: "6px 12px", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "700",
                  background: jobsViewMode === 'map' ? "#fff" : "transparent",
                  color: jobsViewMode === 'map' ? "var(--c1,#1F2226)" : "#5b6b82",
                  cursor: "pointer", boxShadow: jobsViewMode === 'map' ? "0 2px 5px rgba(0,0,0,0.06)" : "none"
                }}
              >
                지도 보기
              </button>
            </div>
          </div>

          {/* 검색바 */}
          <div style={{ padding: "10px 20px 0" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "19px", pointerEvents: "none" }}>🔍</span>
              <input
                type="text"
                placeholder="어디로 갈까요? 현장명 또는 직종 검색"
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                style={{
                  width: "100%",
                  height: "52px",
                  paddingLeft: "46px",
                  paddingRight: "16px",
                  border: "2px solid #e6e8ec",
                  borderRadius: "16px",
                  background: "#fff",
                  fontSize: "15.5px",
                  fontFamily: "inherit",
                  fontWeight: "700",
                  color: "var(--c1,#1F2226)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* 빠른 필터 & 정렬 */}
          <div style={{ padding: "12px 20px 0", display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", flex: 1, paddingBottom: "4px" }}>
              {([
                { key: "urgent", label: "📅 오늘 바로 일할 수 있어요" },
                { key: "stay", label: "🏠 숙소가 필요해요" },
                { key: "meal", label: "🍱 식사가 중요해요" },
                { key: "rookie", label: "🔰 초보도 갈 수 있어요" },
                { key: "high_pay", label: "💰 더 많이 벌고 싶어요" },
                { key: "long_term", label: "🗓️ 오래 일하고 싶어요" },
                { key: "large", label: "🏗️ 대형 현장 경험을 쌓고 싶어요" },
                { key: "safety", label: "🛡️ 안전한 현장을 찾고 싶어요" }
              ]).map((f) => {
                const isActive = fastFilters.includes(f.key);
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => {
                      const next = isActive ? fastFilters.filter(k => k !== f.key) : [...fastFilters, f.key];
                      setFastFilters(next);
                      track("job_filter_selected", { filter: f.key, active: !isActive });
                    }}
                    style={{
                      flex: "none", height: "40px", padding: "0 16px",
                      borderRadius: "12px", fontSize: "13.5px", fontWeight: "800",
                      background: isActive ? "var(--c1,#1F2226)" : "#f1f3f7",
                      color: isActive ? "#fff" : "#5b6b82",
                      border: "none", cursor: "pointer", whiteSpace: "nowrap"
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
            
            {/* 정렬 드롭다운 */}
            <select
              value={jobSort}
              onChange={(e) => {
                setJobSort(e.target.value);
                track("job_filter_selected", { sort: e.target.value });
              }}
              style={{
                height: "40px", padding: "0 10px", borderRadius: "10px", border: "2px solid #e6e8ec",
                fontSize: "13.5px", fontWeight: "800", color: "#5b6b82", background: "#fff", outline: "none", cursor: "pointer"
              }}
            >
              <option value="closest">가까운 현장순</option>
              <option value="highest_wage">일당 높은 순</option>
              <option value="today_entry">즉시 출근 가능 순</option>
              <option value="ready_fit">준비 서류 통과 순</option>
            </select>
          </div>

          {/* 4대 서브탭 분류 */}
          <div style={{ display: "flex", padding: "12px 20px 0", borderBottom: "1px solid var(--soft,#E5E7EB)", gap: "16px" }}>
            {([
              { key: 'fit', label: '내게 맞는 현장' },
              { key: 'urgent', label: '급구 현장' },
              { key: 'today', label: '오늘 현장' },
              { key: 'large', label: '대형 현장' }
            ] as const).map((tabItem) => (
              <button
                key={tabItem.key}
                type="button"
                onClick={() => {
                  setJobSubTab(tabItem.key);
                  track("job_filter_selected", { subTab: tabItem.key });
                }}
                style={{
                  border: "none", background: "none", padding: "8px 0", marginBottom: "-1px",
                  fontSize: "14.5px", fontFamily: "inherit", cursor: "pointer",
                  fontWeight: jobSubTab === tabItem.key ? "800" : "600",
                  color: jobSubTab === tabItem.key ? "var(--c1,#1F2226)" : "#8694a8",
                  borderBottom: jobSubTab === tabItem.key ? "2.5px solid var(--c1,#1F2226)" : "2.5px solid transparent",
                  WebkitTapHighlightColor: "transparent"
                }}
              >
                {tabItem.label}
              </button>
            ))}
          </div>

          <div style={{ overflowX: "hidden", marginTop: "10px" }}>
            {jobsViewMode === 'map' ? (
              <div key="mapView" style={{ padding: "10px 20px 0", animation: "fadeIn 0.2s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>🗺️ 지도 기준 근처 현장</span>
                  <button type="button" onClick={findMyLocation} style={{ border: "none", background: "none", color: "#4f46e5", fontSize: "12.5px", fontWeight: "700", cursor: "pointer" }}>내 위치 갱신 ↺</button>
                </div>
                
                {/* 지도 목업 영역 */}
                <div style={{ width: "100%", height: "360px", borderRadius: "20px", overflow: "hidden", border: "1px solid #e6e8ec", background: "radial-gradient(#e0e7ff 1.5px, transparent 1.5px) 0 0 / 16px 16px, #f1f5f9", position: "relative" }}>
                  
                  {/* 중심 핀 (내 위치) */}
                  <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ background: "#4f46e5", color: "#fff", padding: "4px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: "800", whiteSpace: "nowrap", boxShadow: "0 4px 10px rgba(79,70,229,0.3)" }}>내 위치</div>
                    <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#4f46e5", border: "3px solid #fff", marginTop: "2px", boxShadow: "0 0 0 6px rgba(79,70,229,0.2)" }}></div>
                  </div>

                  {/* 현장 핀 1 (송도) */}
                  <div
                    onClick={() => { track("job_detail_viewed", { jobId: "0", source: "map_pin" }); openJob(0); }}
                    style={{ position: "absolute", left: "20%", top: "35%", zIndex: 5, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}
                  >
                    <div style={{ background: "#dc2626", color: "#fff", padding: "4px 8px", borderRadius: "8px", fontSize: "9.5px", fontWeight: "800", whiteSpace: "nowrap", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "2px" }}>
                      🔥 급구 · 형틀 조공
                    </div>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#dc2626", border: "2px solid #fff", marginTop: "2px" }}></div>
                  </div>

                  {/* 현장 핀 2 (평택) */}
                  <div
                    onClick={() => { track("job_detail_viewed", { jobId: "2", source: "map_pin" }); openJob(2); }}
                    style={{ position: "absolute", left: "70%", top: "60%", zIndex: 5, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}
                  >
                    <div style={{ background: "#0d9488", color: "#fff", padding: "4px 8px", borderRadius: "8px", fontSize: "9.5px", fontWeight: "800", whiteSpace: "nowrap", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
                      🏗️ 평택고덕 · 형틀
                    </div>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#0d9488", border: "2px solid #fff", marginTop: "2px" }}></div>
                  </div>

                  {/* 현장 핀 3 (서초) */}
                  <div
                    onClick={() => { track("job_detail_viewed", { jobId: "1", source: "map_pin" }); openJob(1); }}
                    style={{ position: "absolute", left: "65%", top: "25%", zIndex: 5, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}
                  >
                    <div style={{ background: "#1f2937", color: "#fff", padding: "4px 8px", borderRadius: "8px", fontSize: "9.5px", fontWeight: "800", whiteSpace: "nowrap", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
                      ₩24.5만 · 철근공
                    </div>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#1f2937", border: "2px solid #fff", marginTop: "2px" }}></div>
                  </div>
                </div>

                <div style={{ fontSize: "11.5px", color: "#8694a8", fontWeight: "500", marginTop: "8px", lineHeight: "1.5" }}>
                  💡 지도의 핀을 터치하면 상세 현장 정보를 확인하고 바로 지원할 수 있어요.
                </div>
                
                <div style={{ marginTop: "16px" }}>
                  <div style={{ fontSize: "13px", fontWeight: "800", color: "var(--c1,#1F2226)", marginBottom: "10px" }}>지도의 급구 및 추천 현장 목록</div>
                  {renderJobList()}
                </div>
              </div>
            ) : (
              <div key="listView" style={{ animation: "fadeIn 0.2s ease" }}>
                
                {/* 내 지원 현황 (있을 경우 홈과 별도로 표시) */}
                {myApps.length > 0 && (
                  <div style={{ padding: "8px 20px 0" }}>
                    <div style={{ fontSize: "13px", fontWeight: "800", color: "var(--c1,#1F2226)", margin: "6px 0 8px" }}>내 지원 현황 {myApps.length}건</div>
                    {(Array.isArray(myApps) ? myApps : []).map((a) => {
                      const st = applLabel(a.status);
                      return (
                        <div key={a.id} style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "13px", padding: "12px 14px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                          <div style={{ minWidth: "0" }}>
                            <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--c1,#1F2226)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.jobPost ? a.jobPost.title : "공고"}</div>
                            <div style={{ fontSize: "12px", color: "#8694a8", fontWeight: "500", marginTop: "2px" }}>{a.jobPost?.company ? a.jobPost.company.name : ""}</div>
                          </div>
                          <span style={{ flex: "none", fontSize: "11.5px", fontWeight: "800", padding: "4px 10px", borderRadius: "9px", background: st.bg, color: st.fg }}>{st.t}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {renderJobList()}
              </div>
            )}
          </div>
        </div>
        </>)}


        {(v.isCommunity) && (
          <CommunityView userId={getServerId() || ""} />
        )}

        {(v.isWork) && (<>
        <div style={{ padding: "8px 20px 30px" }}>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>지원·출근</div>
          <div style={{ fontSize: "13px", color: "#8694a8", fontWeight: "600", marginTop: "3px" }}>지원 완료된 공고와 확정 현장 출퇴근, 받을 금액 내역을 확인할 수 있습니다.</div>

          {/* Sub-tab Switcher */}
          <div style={{ display: "flex", gap: "8px", margin: "16px 0 20px", background: "#f1f3f7", padding: "4px", borderRadius: "12px" }}>
            <button
              onClick={() => setWorkSubTab('attendance')}
              style={{
                flex: 1,
                padding: "10px 0",
                border: "none",
                borderRadius: "8px",
                fontSize: "13.5px",
                fontWeight: "700",
                background: workSubTab === 'attendance' ? "#fff" : "transparent",
                color: workSubTab === 'attendance' ? "var(--c1,#1F2226)" : "#5b6b82",
                boxShadow: workSubTab === 'attendance' ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer",
              }}
            >
              출근 & 지원 관리
            </button>
            <button
              onClick={() => setWorkSubTab('history')}
              style={{
                flex: 1,
                padding: "10px 0",
                border: "none",
                borderRadius: "8px",
                fontSize: "13.5px",
                fontWeight: "700",
                background: workSubTab === 'history' ? "#fff" : "transparent",
                color: workSubTab === 'history' ? "var(--c1,#1F2226)" : "#5b6b82",
                boxShadow: workSubTab === 'history' ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer",
              }}
            >
              일한 기록 & 받을 금액
            </button>
          </div>

          {workSubTab === 'attendance' ? (
            <>
              {/* 50대 시니어 맞춤 4단계 안심 입금 스태퍼 & 오늘의 안내 */}
              <div style={{ background: "#fff", border: "2px solid #e6e8ec", borderRadius: "22px", padding: "20px 22px", marginBottom: "20px" }}>
                
                {/* 오늘의 안내 큰 한마디 */}
                <div style={{ background: "#f8fafc", borderLeft: "4px solid #4f46e5", padding: "12px 16px", borderRadius: "8px", marginBottom: "18px" }}>
                  <div style={{ fontSize: "12.5px", fontWeight: "800", color: "#4f46e5" }}>오늘의 출근 및 받을 금액 안내</div>
                  <div style={{ fontSize: "16px", fontWeight: "900", color: "var(--c1,#1F2226)", marginTop: "4px", lineHeight: "1.5", wordBreak: "keep-all" }}>
                    {(() => {
                      const hasApp = myApps.length > 0;
                      const hasAssign = assignments && assignments.length > 0;
                      const hasCheckIn = assignments && assignments.some(a => a.attendances.some(at => !at.checkOutAt));
                      
                      if (hasCheckIn) return "👷 현장에서 열심히 근무 중입니다. 퇴근 시 퇴근 버튼을 꼭 눌러주세요!";
                      if (hasAssign) return "⏰ 출근이 확정되었습니다. 오전 06:40분까지 현장 집결지로 늦지 않게 와주세요!";
                      if (hasApp) return "📝 현장 지원이 접수되었습니다. 담당 반장님이 서류를 확인하는 중입니다.";
                      return "🔍 아직 지원한 현장이 없습니다. 아래 '공고 보러가기'를 눌러 현장를 구해보세요!";
                    })()}
                  </div>
                </div>

                <div style={{ fontSize: "14.5px", fontWeight: "900", color: "var(--c1,#1F2226)", marginBottom: "14px" }}>
                  🚦 일당 입금 진행 상황
                </div>

                {/* 4단계 단순화 가로 스태퍼 */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", padding: "10px 0" }}>
                  {/* 뒷 배경 연결 선 */}
                  <div style={{ position: "absolute", top: "27px", left: "10%", right: "10%", height: "3px", background: "#e2e8f0", zIndex: 1 }} />
                  
                  {([
                    { step: 1, label: "지원 접수" },
                    { step: 2, label: "출근 확정" },
                    { step: 3, label: "근무 완료" },
                    { step: 4, label: "입금 완료" }
                  ]).map((item) => {
                    const currentActive = (() => {
                      const hasApp = myApps.length > 0;
                      const hasAssign = assignments && assignments.length > 0;
                      const hasCheckIn = assignments && assignments.some(a => a.attendances.some(at => !at.checkOutAt));
                      const isCompleted = assignments && assignments.some(a => a.attendances.some(at => at.checkOutAt));
                      
                      if (isCompleted) return 4;
                      if (hasCheckIn) return 3;
                      if (hasAssign) return 2;
                      if (hasApp) return 1;
                      return 0;
                    })();

                    const isDone = item.step < currentActive;
                    const isActive = item.step === currentActive;

                    let dotBg = "#fff";
                    let dotBorder = "2.5px solid #cbd5e1";
                    let textColor = "#8694a8";
                    let icon = item.step;

                    if (isDone) {
                      dotBg = "#10b981";
                      dotBorder = "none";
                      textColor = "#10b981";
                      icon = "✓";
                    } else if (isActive) {
                      dotBg = "#4f46e5";
                      dotBorder = "none";
                      textColor = "#4f46e5";
                    }

                    return (
                      <div key={item.step} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, width: "70px" }}>
                        <div style={{
                          width: "36px", height: "36px", borderRadius: "50%",
                          background: dotBg, border: dotBorder,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "14px", fontWeight: "900", color: (isActive || isDone) ? "#fff" : "#8694a8",
                          boxShadow: isActive ? "0 0 0 5px rgba(79,70,229,0.15)" : "none"
                        }}>
                          {icon}
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: "900", color: textColor, marginTop: "8px", whiteSpace: "nowrap" }}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 안심 노무비 지급 보장 (에스크로) 3단계 흐름도 */}
              <div style={{ background: "#fff", border: "2px solid #e6e8ec", borderRadius: "22px", padding: "20px 22px", marginBottom: "20px" }}>
                <div style={{ fontSize: "14.5px", fontWeight: "900", color: "var(--c1,#1F2226)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>🛡️ 안심 노무비 지급 보장 (에스크로)</span>
                  <span style={{ fontSize: "11px", background: "#eff6ff", color: "#2563eb", padding: "2px 6px", borderRadius: "4px", fontWeight: "800" }}>안전 보장</span>
                </div>
                <div style={{ fontSize: "13px", color: "#5b6b82", fontWeight: "700", lineHeight: "1.5", marginBottom: "16px", wordBreak: "keep-all" }}>
                  원청사가 노무비를 MONO 안심 에스크로 금고에 미리 예치해 두므로, 일이 끝나면 체불 걱정 없이 받을 금액 당일 안전하게 즉시 입금됩니다.
                </div>

                {/* 3단계 도식화 흐름도 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: "14px", padding: "12px 14px" }}>
                    <span style={{ fontSize: "20px" }}>🏢</span>
                    <div>
                      <div style={{ fontSize: "13.5px", fontWeight: "900", color: "#1e3a8a" }}>1단계: 원청사 노무비 예치 완료</div>
                      <div style={{ fontSize: "11.5px", fontWeight: "700", color: "#2563eb", marginTop: "2px" }}>공사 대금이 안전하게 선입금 되었습니다</div>
                    </div>
                    <span style={{ marginLeft: "auto", fontSize: "14px", color: "#2563eb" }}>✅</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#ede9fe", border: "1.5px solid #ddd6fe", borderRadius: "14px", padding: "12px 14px" }}>
                    <span style={{ fontSize: "20px" }}>🔒</span>
                    <div>
                      <div style={{ fontSize: "13.5px", fontWeight: "900", color: "#4c1d95" }}>2단계: MONO 안심 금고 안전 보관</div>
                      <div style={{ fontSize: "11.5px", fontWeight: "700", color: "#6d28d9", marginTop: "2px" }}>근무하시는 동안 일당을 플랫폼이 안전하게 락인 보관합니다</div>
                    </div>
                    <span style={{ marginLeft: "auto", fontSize: "14px", color: "#6d28d9" }}>🔒</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#ecfdf5", border: "1.5px solid #a7f3d0", borderRadius: "14px", padding: "12px 14px" }}>
                    <span style={{ fontSize: "20px" }}>💰</span>
                    <div>
                      <div style={{ fontSize: "13.5px", fontWeight: "900", color: "#065f46" }}>3단계: 내 등록 계좌로 즉시 송금</div>
                      <div style={{ fontSize: "11.5px", fontWeight: "700", color: "#059669", marginTop: "2px" }}>근무 종료 퇴근 체크 확인 즉시 입금됩니다</div>
                    </div>
                    <span style={{ marginLeft: "auto", fontSize: "14px", color: "#059669" }}>💸</span>
                  </div>
                </div>
              </div>

              {/* 1. 나의 지원 현황 — 실제 API 데이터 */}
              <div style={{ marginTop: "20px" }}>
                <div style={{ fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)", marginBottom: "10px" }}>📋 나의 지원 현황 {myApps.length > 0 && <span style={{ fontSize: "12px", fontWeight: "600", color: "#8694a8" }}>({myApps.length}건)</span>}</div>
                {myApps.length === 0 ? (
                  <div style={{ background: "#f8fafc", border: "1px dashed #e2e8f0", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>📭</div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--c1,#1F2226)" }}>아직 지원한 공고가 없어요</div>
                    <div style={{ fontSize: "12px", color: "#8694a8", marginTop: "4px", wordBreak: "keep-all" }}>현장 찾기 탭에서 공고를 확인하고 지원해보세요</div>
                    <button onClick={v.goJobs} style={{ marginTop: "12px", height: "38px", padding: "0 16px", border: "none", borderRadius: "10px", background: "var(--c1,#1F2226)", color: "#fff", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>공고 보러가기</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {(Array.isArray(myApps) ? myApps : []).map((a) => {
                      const st = applLabel(a.status);
                      const appliedAt = a.createdAt ? new Date(a.createdAt).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" }).replace(".", "/").replace(".", "").trim() : "";
                      return (
                        <div key={a.id} style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "18px", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: "14px", fontWeight: "800", color: "var(--c1,#1F2226)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.jobPost ? a.jobPost.title : "공고"}</div>
                            <span style={{ fontSize: "12px", color: "#8694a8" }}>
                              {a.jobPost?.jobType?.[0] || ""}{a.jobPost?.jobType?.[0] && appliedAt ? " · " : ""}{appliedAt ? `지원일 ${appliedAt}` : ""}
                            </span>
                          </div>
                          <span style={{ flex: "none", fontSize: "12px", fontWeight: "800", color: st.fg, background: st.bg, padding: "4px 10px", borderRadius: "8px" }}>{st.t}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. 확정 현장 & 출퇴근 */}
              <div style={{ marginTop: "24px" }}>
                <div style={{ fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)", marginBottom: "10px" }}>👷 확정 현장 & 출퇴근</div>

                {(assignments === null) && (<div style={{ padding: "34px 0", textAlign: "center", color: "#8694a8", fontSize: "13px", fontWeight: "600" }}>불러오는 중…</div>)}
                {(assignments !== null && assignments.length === 0) && (
                  <div style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "20px", padding: "34px 22px", textAlign: "center" }}>
                    <div style={{ fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>아직 확정된 현장이 없어요</div>
                    <div style={{ fontSize: "12.5px", color: "#8694a8", fontWeight: "500", marginTop: "8px", lineHeight: "1.65" }}>현장 찾기 탭에서 공고를 선택해 지원해 주세요.</div>
                    <button onClick={v.goJobs} style={{ marginTop: "16px", height: "44px", padding: "0 20px", border: "none", borderRadius: "13px", background: "var(--c1,#1F2226)", color: "#fff", fontSize: "14px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>현장 보러가기</button>
                  </div>
                )}
                {(Array.isArray(assignments) ? assignments : []).map((a) => {
                  const openAtt = a.attendances.find((at) => !at.checkOutAt);
                  return (
                    <div key={a.id} style={{ borderRadius: "20px", background: "var(--c1,#1F2226)", padding: "18px", color: "var(--t0,#E5E7EB)", position: "relative", overflow: "hidden", marginBottom: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: "11.5px", fontWeight: "700", color: "var(--t1,#A5AEB8)" }}>{a.jobPost.company ? a.jobPost.company.name : "협약 기업"}{a.jobPost.region.length ? " · " + a.jobPost.region.join(", ") : ""}</div>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: contractSigned ? "#10b981" : "#f59e0b", background: contractSigned ? "#f0fdf4" : "#fffbeb", padding: "2px 8px", borderRadius: "6px" }}>
                          {contractSigned ? "계약 서명 완료 ✓" : "📝 계약 서명 대기"}
                        </span>
                      </div>
                      <div style={{ fontSize: "17px", fontWeight: "800", marginTop: "5px" }}>{a.jobPost.title}</div>
                      
                      {/* 계약서 체결 유도 배너 */}
                      {!contractSigned && (
                        <div style={{ marginTop: "12px", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "12px", padding: "12px", fontSize: "13px", color: "#fef3c7" }}>
                          <div style={{ fontWeight: "800", color: "#fbbf24" }}>⚠️ 미서명 안내</div>
                          <div style={{ marginTop: "2px", fontWeight: "600", lineHeight: "1.4" }}>아직 안심 근로계약 서명이 완료되지 않았습니다. 출근 체크 전에 계약 체결을 완료해 주세요.</div>
                          <button
                            type="button"
                            onClick={() => setOpenContractModal(true)}
                            style={{
                              marginTop: "8px", width: "100%", height: "36px", border: "none", borderRadius: "8px",
                              background: "#fbbf24", color: "#78350f", fontSize: "12.5px", fontWeight: "800", cursor: "pointer"
                            }}
                          >
                            🖋️ 근로계약서 확인 및 서명하기
                          </button>
                        </div>
                      )}

                      {/* 집결지 정보 노출 */}
                      <div style={{ marginTop: "12px", background: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "12px 14px", fontSize: "12.5px" }}>
                        <div style={{ color: "rgba(255,255,255,0.6)", fontWeight: "600" }}>📍 집결지 주소</div>
                        <div style={{ color: "#fff", fontWeight: "700", marginTop: "2px" }}>경기 평택시 고덕동 삼성반도체 P4 현장 게이트 3앞</div>
                        <div style={{ color: "rgba(255,255,255,0.6)", fontWeight: "600", marginTop: "8px" }}>⏰ 집결 시간</div>
                        <div style={{ color: "#fff", fontWeight: "700", marginTop: "2px" }}>오전 06:40 (지각 시 출입 통제)</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!openAtt && !contractSigned) {
                            setOpenContractModal(true);
                          } else {
                            openAtt ? doCheckOut(a) : doCheckIn(a.id);
                          }
                        }}
                        style={{
                          marginTop: "14px", width: "100%", height: "52px", border: "none", borderRadius: "14px",
                          background: openAtt ? "var(--a1,#1F2226)" : "#fff",
                          color: openAtt ? "var(--c0,#1F2226)" : "var(--c1,#1F2226)",
                          fontSize: "16px", fontWeight: "900", fontFamily: "inherit", cursor: "pointer"
                        }}
                      >
                        {openAtt ? "퇴근 체크" : (contractSigned ? "출근 체크" : "출근 체크 (계약 서명 필요)")}
                      </button>
                      
                      <div style={{ fontSize: "11px", color: "var(--t2,#A5AEB8)", textAlign: "center", marginTop: "9px" }}>QR 및 실시간 위치 기반 안전 체크인</div>
                      {(a.attendances.length > 0) && (
                        <div style={{ marginTop: "13px", borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                          {a.attendances.slice(0, 6).map((at) => (
                            <div key={at.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                              <span style={{ color: "var(--t2,#A5AEB8)", fontWeight: "600" }}>{at.workDate}</span>
                              <span className="mono" style={{ color: "var(--t0,#E5E7EB)" }}>{fmtClock(at.checkInAt)} → {at.checkOutAt ? fmtClock(at.checkOutAt) : "근무 중"}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* 이번 달 근무 요약 — 실제 출근 데이터 기반 계산 */}
              {(() => {
                const now = new Date();
                const thisMonth = now.getMonth();
                const thisYear = now.getFullYear();
                const allAtts = (Array.isArray(assignments) ? assignments : []).flatMap((a) => (a.attendances || []).map((at) => ({ ...at, jobTitle: a.jobPost?.title, jobType: a.jobPost?.jobType?.[0] })));
                const monthAtts = allAtts.filter((at) => { const d = new Date(at.checkInAt || at.workDate); return d.getMonth() === thisMonth && d.getFullYear() === thisYear; });
                const workDays = monthAtts.filter((at) => at.checkOutAt).length;
                const totalHours = monthAtts.filter((at) => at.checkOutAt).reduce((s, at) => { const diff = (new Date(at.checkOutAt).getTime() - new Date(at.checkInAt).getTime()) / 3600000; return s + diff; }, 0);
                const manDays = Math.round(totalHours / 8 * 10) / 10;
                const monthLabel = `${thisYear}년 ${thisMonth + 1}월`;
                return (
                  <div style={{ background: "var(--c1,#1F2226)", borderRadius: "20px", padding: "20px", color: "#fff", boxShadow: "0 10px 24px -10px rgba(0,0,0,0.15)" }}>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", fontWeight: "700" }}>{monthLabel} 근무 요약</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "12px" }}>
                      <div>
                        <span className="mono" style={{ fontSize: "36px", fontWeight: "500" }}>{workDays}</span>
                        <span style={{ fontSize: "14px", marginLeft: "2px", fontWeight: "700" }}>일</span>
                        <span style={{ margin: "0 8px", color: "rgba(255,255,255,0.3)" }}>|</span>
                        <span className="mono" style={{ fontSize: "36px", fontWeight: "500" }}>{manDays || 0}</span>
                        <span style={{ fontSize: "14px", marginLeft: "2px", fontWeight: "700" }}>공수</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", fontWeight: "600" }}>받을 금액 내역</div>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: "rgba(255,255,255,0.5)" }}>{workDays === 0 ? "출근 기록 없음" : "받을 금액 정보 확인 중"}</div>
                      </div>
                    </div>
                    {workDays === 0 && (
                      <div style={{ marginTop: "12px", fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: "600" }}>이번 달 출근 체크인 기록이 없어요. 확정 현장에서 출근 체크를 눌러주세요.</div>
                    )}
                  </div>
                );
              })()}

              {/* 에스크로 안심받을 금액 배너 */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "16px", padding: "14px 16px", marginTop: "14px", display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ fontSize: "20px" }}>🛡️</span>
                <div style={{ fontSize: "12px", color: "#166534", fontWeight: "600", lineHeight: "1.45", wordBreak: "keep-all" }}>
                  MONO는 근로자 보호를 위해 <strong>에스크로 안심 급여 받을 계좌</strong>를 사용하며, 노무비 받을 금액 증빙을 자동으로 관리합니다.
                </div>
              </div>

              {/* 상세 출근 기록 — assignments.attendances 실 데이터 */}
              <div style={{ marginTop: "24px" }}>
                <div style={{ fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)", marginBottom: "12px" }}>상세 출근 기록</div>
                {(() => {
                  const allAtts = (Array.isArray(assignments) ? assignments : []).flatMap((a) =>
                    (a.attendances || []).map((at) => ({ ...at, jobTitle: a.jobPost?.title, jobType: a.jobPost?.jobType?.[0], company: a.jobPost?.company?.name, conditions: a.jobPost?.conditions }))
                  ).filter((at) => at.checkOutAt).sort((a, b) => new Date(b.checkInAt).getTime() - new Date(a.checkInAt).getTime());
                  if (allAtts.length === 0) {
                    return (
                      <div style={{ background: "#f8fafc", border: "1px dashed #e2e8f0", borderRadius: "16px", padding: "28px", textAlign: "center" }}>
                        <div style={{ fontSize: "24px", marginBottom: "8px" }}>📂</div>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--c1,#1F2226)" }}>아직 출근 기록이 없어요</div>
                        <div style={{ fontSize: "12px", color: "#8694a8", marginTop: "4px", wordBreak: "keep-all" }}>확정된 현장에서 출근 체크를 하면 기록이 남아요</div>
                      </div>
                    );
                  }
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {allAtts.slice(0, 20).map((at) => {
                        const inDate = new Date(at.checkInAt);
                        const dateLabel = inDate.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });
                        const inTime = inDate.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
                        const outTime = at.checkOutAt ? new Date(at.checkOutAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }) : "근무 중";
                        const hours = at.checkOutAt ? (new Date(at.checkOutAt).getTime() - inDate.getTime()) / 3600000 : 0;
                        const manDay = Math.round(hours / 8 * 10) / 10;
                        return (
                          <div
                            key={at.id}
                            onClick={() => setOpenSettlementInvoice({ conditions: at.conditions, title: at.jobTitle })}
                            style={{ background: "#fff", border: "1.5px solid #e6e8ec", borderRadius: "18px", padding: "16px", boxShadow: "0 4px 12px -10px rgba(0,0,0,0.05)", cursor: "pointer" }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: "12px", fontWeight: "800", color: "#166534", background: "#dcfce7", padding: "3px 8px", borderRadius: "6px" }}>출근 완료</span>
                              <span style={{ fontSize: "12.5px", color: "#8694a8", fontWeight: "600" }}>{dateLabel}</span>
                            </div>
                            <div style={{ margin: "10px 0 4px", fontSize: "15.5px", fontWeight: "900", color: "var(--c1,#1F2226)" }}>{at.jobTitle || "현장"}</div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", borderTop: "1px solid #f1f5f9", paddingTop: "8px" }}>
                              <span style={{ fontSize: "13px", color: "#5b6b82", fontWeight: "600" }}>{at.jobType || ""}{at.jobType ? " · " : ""}{manDay}공수 · {inTime}~{outTime}</span>
                              <span style={{ fontSize: "11.5px", color: "#4f46e5", background: "#f5f3ff", padding: "2px 8px", borderRadius: "6px", fontWeight: "800" }}>명세서 보기 📑</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* 받을 금액 내역(실제 Settlement 원장) — 내국인/외국인 공통 노출 */}
              <div style={{ marginTop: "24px" }}>
                <FgnSettlement id={getServerId() || ""} />
              </div>
            </>
          )}
        </div>
        </>)}

        {(v.isMe) && (<>
        <div style={{ padding: "8px 20px 30px" }}>
          <div style={{ fontSize: "22px", fontWeight: "955", color: "#0f172a", letterSpacing: "-0.5px" }}>내 프로필</div>
          
          <div style={{ marginTop: "14px", background: "var(--c1,#1F2226)", borderRadius: "20px", padding: "20px", color: "var(--t0,#E5E7EB)", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "58px", height: "58px", borderRadius: "18px", background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-glow,#454A51)", fontSize: "22px", fontWeight: "800" }}>{v.initial}</div>
            <div style={{ flex: "1" }}>
              <div style={{ fontSize: "18px", fontWeight: "800" }}>{v.name}</div>
              <div style={{ fontSize: "12.5px", color: "var(--t1,#A5AEB8)", fontWeight: "600", marginTop: "2px" }}>
                {v.myJob} · {careerCards.length === 0 ? "입문 준비 중" : careerCards.length <= 3 ? "현장 경험 축적 중" : "숙련도 상승 중"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "6px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5fd1a0" }}></span>
                <span style={{ fontSize: "11.5px", color: "var(--t1,#A5AEB8)", fontWeight: "600" }}>실명·계좌 준비 상태 완료</span>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "18px", padding: "14px", marginTop: "14px" }}>
            <div style={{ fontSize: "12.5px", fontWeight: "900", color: "#64748b", marginBottom: "6px" }}>
              준비 상태 완성도 {v.completion}% {v.completion >= 100 ? "· 모든 준비 완료" : "· 채울수록 지원 합격률 상승"}
            </div>
            <div style={{ height: "6px", background: "#eef0f3", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${v.completion}%`, height: "100%", background: "#4f46e5", borderRadius: "4px", transition: "width .5s ease" }}></div>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "20px", padding: "18px", marginTop: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "14.5px", fontWeight: "900", color: "#1e293b" }}>📋 내 현장 프로필</span>
              <button onClick={() => alert("정보 수정")} style={{ background: "none", border: "none", color: "#4f46e5", fontSize: "13.5px", fontWeight: "850", cursor: "pointer" }}>수정</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "10px" }}>
                <div style={{ fontSize: "11.5px", color: "#64748b", fontWeight: "700" }}>희망 직무</div>
                <div style={{ fontSize: "13.5px", fontWeight: "900", color: "#1e293b", marginTop: "2px" }}>{v.myJob || "배관 조공"}</div>
              </div>
              <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "10px" }}>
                <div style={{ fontSize: "11.5px", color: "#64748b", fontWeight: "700" }}>활동 지역</div>
                <div style={{ fontSize: "13.5px", fontWeight: "900", color: "#1e293b", marginTop: "2px" }}>{v.myRegion || "인천 연수구"}</div>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "20px", padding: "18px", marginTop: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <span style={{ fontSize: "14.5px", fontWeight: "900", color: "#1e293b" }}>🚦 현장 준비 서류</span>
              <button onClick={() => setOpenDocs(true)} style={{ background: "none", border: "none", color: "#4f46e5", fontSize: "13px", fontWeight: "850", cursor: "pointer" }}>서류 등록하기 →</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { key: "idCard", label: "신분증" },
                { key: "safetyEdu", label: "안전교육" },
                { key: "elecCard", label: "전자카드" },
                { key: "bankAcc", label: "계좌" }
              ].map((item) => {
                const status = prepStatusOf(item.key);
                const badge = status === "VERIFIED"
                  ? { text: "✅ 승인완료", color: "#166534", bg: "#f0fdf4", border: "#cbd5e1" }
                  : status === "SUBMITTED"
                  ? { text: "⏳ 검토중", color: "#92400e", bg: "#fffbeb", border: "#fde68a" }
                  : status === "REJECTED"
                  ? { text: "⚠️ 반려", color: "#991b1b", bg: "#fef2f2", border: "#fecaca" }
                  : { text: "미제출", color: "#475569", bg: "#fff", border: "#cbd5e1" };
                return (
                  <div
                    key={item.key}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px",
                      borderRadius: "12px", border: `1px solid ${badge.border}`, background: badge.bg,
                    }}
                  >
                    <div style={{ flex: 1, fontSize: "14.5px", fontWeight: "900", color: status === "VERIFIED" ? "#166534" : "#475569" }}>{item.label}</div>
                    <div style={{ fontSize: "13px", fontWeight: "800", color: badge.color, flexShrink: 0 }}>{badge.text}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "20px", padding: "18px", marginTop: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "14.5px", fontWeight: "900", color: "#1e293b" }}>💳 일한 기록 (현장 경력)</span>
              <button onClick={() => alert("공유")} style={{ background: "none", border: "none", color: "#4f46e5", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>공유</button>
            </div>
            
            <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", borderRadius: "16px", padding: "16px", color: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "900" }}>MONO Certified Profile</div>
                </div>
                <span style={{ fontSize: "11px", fontWeight: "900", color: "#fff", background: "rgba(255,255,255,0.15)", padding: "3px 8px", borderRadius: "6px" }}>A등급</span>
              </div>
              <div style={{ marginTop: "18px" }}>
                <div style={{ fontSize: "18px", color: "#fff", fontWeight: "900" }}>{v.maskedName} · {v.myJob || "일반 조공"}</div>
                <div style={{ fontSize: "11.5px", color: "#a5b4fc", fontWeight: "600", marginTop: "2px" }}>
                  총 일한 현장: <strong>{careerCards.length}건</strong>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "20px", padding: "18px", marginTop: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "14.5px", fontWeight: "900", color: "#1e293b" }}>🎖️ 자격 및 교육 이수</span>
              <span onClick={() => alert("추가")} style={{ fontSize: "13.5px", color: "#4f46e5", fontWeight: "850", cursor: "pointer" }}>+ 추가</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ padding: "10px 12px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #cbd5e1" }}>
                <div style={{ fontSize: "13px", fontWeight: "900", color: "#1e293b" }}>건설업 기초안전보건교육</div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>한국산업안전공단 연동완료</div>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "20px", padding: "18px", marginTop: "14px" }}>
            <div style={{ fontSize: "14.5px", fontWeight: "900", color: "#1e293b", marginBottom: "10px" }}>🛠️ 사용 가능한 장비</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {["안전모", "전기 드릴", "용접 토치"].map((gear, i) => (
                <span key={i} style={{ fontSize: "12px", background: "#f1f5f9", color: "#334155", padding: "4px 10px", borderRadius: "8px", fontWeight: "800" }}>{gear}</span>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "20px", padding: "18px", marginTop: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "14.5px", fontWeight: "900", color: "#1e293b" }}>🏦 급여 받을 계좌</span>
              <button onClick={() => alert("변경")} style={{ background: "none", border: "none", color: "#4f46e5", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>변경</button>
            </div>
            <div style={{ padding: "12px 14px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "13.5px", fontWeight: "900", color: "#1e293b" }}>신한은행 110-***-123456</div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>예금주: {v.name}</div>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "20px", padding: "18px", marginTop: "14px" }}>
            <div style={{ fontSize: "14.5px", fontWeight: "900", color: "#1e293b", marginBottom: "8px" }}>👷 반장·현장리더로 활동하기</div>
            {!isForeman && !myRequested && (
              <>
                <p style={{ fontSize: "12.5px", color: "#475569", fontWeight: "700", margin: "0 0 12px 0", lineHeight: "1.4" }}>
                  팀을 등록하면 팀 단위로 현장에 매칭되고, 성사 시 수수료 혜택이 있어요.
                </p>
                <button
                  type="button"
                  onClick={requestForeman}
                  style={{ width: "100%", height: "40px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "900", cursor: "pointer" }}
                >
                  반장 신청하기
                </button>
              </>
            )}
            {!isForeman && myRequested && (
              <div style={{ padding: "12px 14px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "12.5px", color: "#64748b", fontWeight: "800" }}>
                ⏳ 반장 승인 대기중 — 관리자 승인 후 팀 등록과 현장리더 프로필을 이용할 수 있어요.
              </div>
            )}
            {isForeman && (
              <>
                {team ? (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "10px" }}>
                    <div>
                      <div style={{ fontSize: "13.5px", fontWeight: "900", color: "#1e293b" }}>{team.name}</div>
                      <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>팀원 {team.memberCount}명</div>
                    </div>
                    <button type="button" onClick={openTeamSheet} style={{ background: "none", border: "none", color: "#4f46e5", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>팀 정보 수정</button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={openTeamSheet}
                    style={{ width: "100%", height: "40px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "900", cursor: "pointer", marginBottom: "10px" }}
                  >
                    + 팀 등록하기
                  </button>
                )}
                <button type="button" onClick={openLeaderProfile} style={{ background: "none", border: "none", color: "#4f46e5", fontSize: "12.5px", fontWeight: "800", cursor: "pointer", padding: 0 }}>현장리더 프로필 관리</button>
              </>
            )}
            <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px dashed #e2e8f0" }}>
              {aiDone ? (
                <span style={{ fontSize: "11.5px", color: "#94a3b8", fontWeight: "800" }}>관심 등록 완료 ✓</span>
              ) : (
                <button type="button" onClick={registerAiLeader} style={{ background: "none", border: "none", color: "#64748b", fontSize: "11.5px", fontWeight: "800", cursor: "pointer", padding: 0 }}>
                  🤖 AI 현장리더 서비스에도 관심 있어요
                </button>
              )}
            </div>
          </div>

          <div style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1.5px solid #bbf7d0", borderRadius: "20px", padding: "18px", marginTop: "14px" }}>
            <div style={{ fontSize: "14.5px", fontWeight: "955", color: "#166534", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>🚀</span> AI 기술 성장 가이드
            </div>
            <p style={{ fontSize: "12.5px", color: "#166534", fontWeight: "700", margin: "0 0 12px 0", lineHeight: "1.4" }}>
              비계/배관 준기공 레벨업을 위해 “도면 해독 기술 교육”을 이수하면 일당 상승에 유리합니다.
            </p>
            <button
              onClick={() => alert("직무 추천받기")}
              style={{ width: "100%", height: "38px", background: "#166534", color: "#fff", border: "none", borderRadius: "10px", fontSize: "12.5px", fontWeight: "900", cursor: "pointer" }}>
              처음 시작할 직무 추천받기
            </button>
          </div>

        </div>
        </>)}

      </div>


    <div className="mono-bottomnav" style={{ minHeight: "calc(92px + max(env(safe-area-inset-bottom, 0px), 16px))", flex: "none", background: "rgba(249,250,253,.96)", backdropFilter: "blur(16px)", borderTop: "1px solid #e6e8ec", display: "flex", padding: "10px 6px calc(max(env(safe-area-inset-bottom, 0px), 16px) + 6px)", position: "sticky", bottom: 0, left: 0, right: 0, zIndex: "30" }}>
        {/* 모바일 버전 표시 */}
        <div style={{ position: "absolute", left: "12px", bottom: "4px", fontSize: "9.5px", color: "#94a3b8", fontWeight: "800", pointerEvents: "none" }}>v0.1.0</div>
        <button onClick={v.goHome} style={{ flex: "1", minHeight: "56px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", paddingTop: "4px", color: v.cHome, fontFamily: "inherit", WebkitTapHighlightColor: "transparent" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M4 11 12 4l8 7v8a1.2 1.2 0 0 1-1.2 1.2H15V14.5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1V20.2H5.2A1.2 1.2 0 0 1 4 19v-8Z" fill={v.fHome} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"></path></svg>
          <span style={{ fontSize: "13.5px", fontWeight: v.wHome, letterSpacing: "-.2px", whiteSpace: "nowrap" }}>홈</span>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: v.dotHome }}></div>
        </button>
        <button onClick={v.goJobs} style={{ flex: "1", minHeight: "56px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", paddingTop: "4px", color: v.cJobs, fontFamily: "inherit", WebkitTapHighlightColor: "transparent" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 15.5a6 6 0 0 1 12 0" fill={v.fJobs} stroke="currentColor" strokeWidth="1.9"></path><path d="M3.5 15.5h17" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"></path><path d="M10.4 9.8V7.4A1.6 1.6 0 0 1 12 5.8a1.6 1.6 0 0 1 1.6 1.6v2.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12 18.5v0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path></svg>
          <span style={{ fontSize: "13.5px", fontWeight: v.wJobs, letterSpacing: "-.2px", whiteSpace: "nowrap" }}>현장 찾기</span>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: v.dotJobs }}></div>
        </button>
        <button onClick={v.goCommunity} style={{ flex: "1", minHeight: "56px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", paddingTop: "4px", color: v.cCommunity, fontFamily: "inherit", WebkitTapHighlightColor: "transparent" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"></path><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" fill={v.fCommunity}></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"></path><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"></path></svg>
          <span style={{ fontSize: "13.5px", fontWeight: v.wCommunity, letterSpacing: "-.2px", whiteSpace: "nowrap" }}>커뮤니티</span>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: v.dotCommunity }}></div>
        </button>
        <button onClick={v.goWork} style={{ flex: "1", minHeight: "56px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", paddingTop: "4px", color: v.cWork, fontFamily: "inherit", WebkitTapHighlightColor: "transparent" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="4.5" y="4.5" width="15" height="16.5" rx="2.8" fill={v.fWork} stroke="currentColor" strokeWidth="1.9"></rect><rect x="8.5" y="2.6" width="7" height="3.6" rx="1.3" fill={v.clipWork} stroke="currentColor" strokeWidth="1.7"></rect><path d="m8.4 12.4 1.8 1.8 3.6-3.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"></path><path d="M8.6 17h6.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"></path></svg>
          <span style={{ fontSize: "13.5px", fontWeight: v.wWork, letterSpacing: "-.3px", whiteSpace: "nowrap" }}>지원·출근</span>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: v.dotWork }}></div>
        </button>
        <button onClick={v.goMe} style={{ flex: "1", minHeight: "56px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", paddingTop: "4px", color: v.cMe, fontFamily: "inherit", WebkitTapHighlightColor: "transparent" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.2" r="3.7" fill={v.fMe} stroke="currentColor" strokeWidth="1.9"></circle><path d="M4.8 20c.4-3.6 3.4-5.6 7.2-5.6s6.8 2 7.2 5.6Z" fill={v.fMe} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"></path></svg>
          <span style={{ fontSize: "13.5px", fontWeight: v.wMe, letterSpacing: "-.2px", whiteSpace: "nowrap" }}>내 프로필</span>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: v.dotMe }}></div>
        </button>
      </div>

      
      {/* AI Glossary Overlay */}
      {glossaryOpen && (
        <div style={{ position: "absolute", inset: "0", zIndex: "55", background: "var(--bg,#f5f6fb)", display: "flex", flexDirection: "column", animation: "fadeIn .2s ease" }}>
          <div style={{ flex: "none", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px 0 6px", background: "#fff", borderBottom: "1px solid #e6e8ec" }}>
            <button onClick={() => setGlossaryOpen(false)} style={{ width: "40px", height: "40px", border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="var(--c1,#1F2226)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </button>
            <span style={{ fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>AI 현장 가이드 (용어 사전)</span>
            <div style={{ width: "40px" }} />
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
            <div style={{ background: "var(--c1,#1F2226)", borderRadius: "20px", padding: "16px", color: "#fff", marginBottom: "16px" }}>
              <div style={{ fontSize: "15px", fontWeight: "800" }}>💡 현장 용어 번역 & 설명</div>
              <div style={{ fontSize: "12.5px", color: "var(--t1,#A5AEB8)", marginTop: "4px", lineHeight: "1.45" }}>
                초보자가 이해하기 어려운 현장 전문 용어를 쉬운 표현으로 해설하고 해외 기술자를 위한 번역을 제공합니다.
              </div>
            </div>
            <GlossaryView />
          </div>
        </div>
      )}


      

      
      {(v.modalOpen) && (<>
        <div onClick={v.closeModal} style={{ position: "absolute", inset: "0", zIndex: "60", background: "rgba(20,22,48,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 46px 46px", padding: "24px 22px 30px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#d4dae3", margin: "0 auto 18px" }}></div>
            <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "var(--aSoft,#E5E7EB)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 2 3 6.5v6c0 5.5 4 9.6 10 11.5 6-1.9 10-6 10-11.5v-6L13 2Z" stroke="var(--ai,#1F2226)" strokeWidth="1.8" strokeLinejoin="round"></path><path d="M13 9v4.5" stroke="var(--ai,#1F2226)" strokeWidth="1.8" strokeLinecap="round"></path><circle cx="13" cy="17" r="1.1" fill="var(--ai,#1F2226)"></circle></svg>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>{v.modalTitle}</span>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "var(--ai,#1F2226)", background: "var(--aSoft,#E5E7EB)", padding: "4px 9px", borderRadius: "8px" }}>{v.modalStatus}</span>
            </div>
            <div style={{ fontSize: "13.5px", color: "#5b6b82", lineHeight: "1.65", fontWeight: "500" }}>{v.modalBody}</div>
            <div style={{ background: "#eef0f3", borderRadius: "14px", padding: "13px 15px", marginTop: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--a1,#1F2226)", boxShadow: "0 0 0 4px color-mix(in srgb, var(--brand,#1F2226) 20%, transparent)", flex: "none" }}></div>
              <span style={{ fontSize: "12.5px", color: "#5b6b82", fontWeight: "600" }}>{v.modalNote}</span>
            </div>
            <button onClick={v.closeModal} style={{ marginTop: "18px", width: "100%", height: "52px", border: "none", borderRadius: "15px", background: "var(--c1,#1F2226)", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>확인</button>
          </div>
        </div>
      </>)}

      {edit && (
        <div onClick={closeEdit} style={{ position: "absolute", inset: "0", zIndex: "60", background: "rgba(20,22,48,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "24px 22px 30px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "90%", overflowY: "auto" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#d4dae3", margin: "0 auto 18px" }}></div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>기본 정보 수정</div>
            <div style={{ fontSize: "13px", color: "#8694a8", fontWeight: "500", marginTop: "4px" }}>이름·직종·경력 연차·희망 지역을 수정할 수 있어요</div>
            <div style={{ marginTop: "18px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#8694a8", marginBottom: "6px" }}>이름</div>
                <input value={edit.name} onChange={(e) => setEdit((p) => ({ ...p, name: e.target.value }))} placeholder="이름을 입력하세요" style={{ width: "100%", height: "48px", border: "1px solid #e6e8ec", borderRadius: "12px", padding: "0 14px", fontSize: "15px", fontFamily: "inherit", color: "#111111", background: "#fff", boxSizing: "border-box" }} />
              </div>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#8694a8", marginBottom: "6px" }}>직종</div>
                <ThemedSelect
                  value={(edit.jobType || []).join(", ")}
                  placeholder="선택 (여러 개 가능)"
                  options={JOB_TYPES}
                  open={openField === "jobType"}
                  onToggle={() => setOpenField((f) => (f === "jobType" ? null : "jobType"))}
                  onPick={(val) => { setEdit((p) => ({ ...p, jobType: val })); setOpenField(null); }}
                />
              </div>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#8694a8", marginBottom: "6px" }}>경력 연차</div>
                <ThemedSelect
                  value={edit.careerYears}
                  placeholder="선택"
                  options={CAREER_YEARS}
                  open={openField === "careerYears"}
                  onToggle={() => setOpenField((f) => (f === "careerYears" ? null : "careerYears"))}
                  onPick={(val) => { setEdit((p) => ({ ...p, careerYears: val })); setOpenField(null); }}
                />
              </div>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#8694a8", marginBottom: "6px" }}>희망 지역</div>
                <ThemedSelect
                  value={(edit.region || []).join(", ")}
                  placeholder="선택 (여러 개 가능)"
                  options={REGIONS}
                  open={openField === "region"}
                  onToggle={() => setOpenField((f) => (f === "region" ? null : "region"))}
                  onPick={(val) => { setEdit((p) => ({ ...p, region: val })); setOpenField(null); }}
                />
              </div>
            </div>
            {/* 외국인 기술자 프로필(국적·언어·한국어 등) — 기본 정보와 같은 시트에 포함 */}
            {isForeigner && (
              <div style={{ marginTop: "22px", borderTop: "1px solid #eef0f6", paddingTop: "8px" }}>
                <FgnProfile id={getServerId() || ""} />
              </div>
            )}
            <button onClick={saveEdit} style={{ marginTop: "22px", width: "100%", height: "52px", border: "none", borderRadius: "15px", background: "var(--c1,#1F2226)", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>저장</button>
            <button onClick={closeEdit} style={{ marginTop: "10px", width: "100%", height: "48px", border: "1px solid #d4dae3", borderRadius: "14px", background: "#fff", color: "#5b6b82", fontSize: "14px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer" }}>취소</button>
          </div>
        </div>
      )}

      {edit && openField && (
        <div onClick={() => setOpenField(null)} style={{ position: "absolute", inset: "0", zIndex: "70", background: "rgba(20,22,48,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "20px 16px 26px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "70%", display: "flex", flexDirection: "column" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#d4dae3", margin: "0 auto 16px" }}></div>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--c1,#1F2226)", padding: "0 4px 12px" }}>{PICKER_TITLE[openField]}</div>
            <div className="scr" style={{ overflowY: "auto", flex: "1", minHeight: "0" }}>
              {PICKER_OPTIONS[openField].map((opt) => {
                const isMulti = openField === "jobType" || openField === "region";
                const sel = isMulti ? (edit[openField] || []).includes(opt) : opt === edit[openField];
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      if (isMulti) {
                        setEdit((p) => {
                          const arr = p[openField] || [];
                          return { ...p, [openField]: arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt] };
                        });
                      } else {
                        setEdit((p) => ({ ...p, [openField]: opt }));
                        setOpenField(null);
                      }
                    }}
                    style={{
                      width: "100%", border: "none", background: sel ? "var(--soft,#E5E7EB)" : "#fff",
                      color: sel ? "var(--c1,#1F2226)" : "var(--c1,#1F2226)", fontWeight: sel ? "800" : "600",
                      fontSize: "15px", fontFamily: "inherit", textAlign: "left", height: "52px", padding: "0 14px",
                      borderRadius: "12px", marginBottom: "2px", cursor: "pointer", boxSizing: "border-box",
                      display: "flex", alignItems: "center", justifyContent: "space-between", WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    <span>{opt}</span>
                    {sel && (<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M5 10.5 8.5 14 15 6.5" stroke="var(--c1,#1F2226)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>)}
                  </button>
                );
              })}
            </div>
            {(openField === "jobType" || openField === "region") && (
              <button type="button" onClick={() => setOpenField(null)} style={{ marginTop: "12px", flex: "none", width: "100%", height: "50px", border: "none", borderRadius: "14px", background: "var(--c1,#1F2226)", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>
                완료 {((edit[openField] || []).length) > 0 ? `(${(edit[openField] || []).length})` : ""}
              </button>
            )}
          </div>
        </div>
      )}

      {notifOpen && (
        <div onClick={() => setNotifOpen(false)} style={{ position: "absolute", inset: "0", zIndex: "60", background: "rgba(20,22,48,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-start", animation: "fadeIn .2s ease" }}>
          <div ref={notifRef} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="알림" tabIndex={-1} style={{ width: "100%", background: "#fff", borderRadius: "0 0 28px 28px", padding: "18px 18px 22px", animation: "sheetDown .32s cubic-bezier(.22,1,.36,1)", maxHeight: "82%", display: "flex", flexDirection: "column", outline: "none" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>알림</div>
              <button type="button" onClick={() => setNotifOpen(false)} aria-label="닫기" style={{ width: "32px", height: "32px", borderRadius: "10px", border: "none", background: "#eef0f3", color: "#5b6b82", fontSize: "16px", cursor: "pointer", fontFamily: "inherit" }}>✕</button>
            </div>
            <div className="scr" style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
              {notifs.length === 0 && (
                <div style={{ padding: "40px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: "14px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>아직 알림이 없어요</div>
                  <div style={{ fontSize: "12.5px", color: "#8694a8", fontWeight: "500", marginTop: "7px", lineHeight: "1.6" }}>내 직군·지역·경력에 맞는 새 공고가 올라오면<br />여기로 알려드릴게요.</div>
                </div>
              )}
              {notifs.map((n) => (
                <div key={n.id} onClick={() => onNotifClick(n)} style={{ border: "1px solid #e6e8ec", borderRadius: "14px", padding: "13px 14px", cursor: n.jobPost?.id ? "pointer" : "default", background: n.read ? "#fff" : "var(--soft,#E5E7EB)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    {!n.read && (<span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#d9534f", flex: "none" }}></span>)}
                    <div style={{ fontSize: "14px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>{n.title}</div>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#5b6b82", fontWeight: "600", marginTop: "5px", lineHeight: "1.5" }}>{n.body}</div>
                  {n.jobPost?.id && (<div style={{ fontSize: "12px", color: "var(--c1,#1F2226)", fontWeight: "700", marginTop: "7px" }}>공고 보러가기 →</div>)}
                </div>
              ))}
            </div>
            <button type="button" onClick={onEnablePush} style={{ marginTop: "14px", flex: "none", width: "100%", height: "46px", border: "1px solid var(--c1,#1F2226)", borderRadius: "13px", background: "#fff", color: "var(--c1,#1F2226)", fontSize: "13.5px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>📱 푸시 알림 받기</button>
            {pushMsg && (<div style={{ marginTop: "8px", fontSize: "12px", color: "#8694a8", fontWeight: "600", textAlign: "center" }}>{pushMsg}</div>)}
          </div>
        </div>
      )}

      {jobDetail && (
        <div onClick={() => setJobDetail(null)} style={{ position: "absolute", inset: "0", zIndex: "60", background: "rgba(20,22,48,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div ref={jobDetailRef} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="채용 공고 상세" tabIndex={-1} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "20px 18px 24px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "90%", display: "flex", flexDirection: "column", outline: "none" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#d4dae3", margin: "0 auto 14px" }}></div>
            
            {/* 1. 제목 및 기본 배지 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
              <div style={{ minWidth: "0" }}>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "6px" }}>
                  {((jobDetail.title || "").includes("급구") || (jobDetail.conditions || "").includes("급구")) && (
                    <span style={{ fontSize: "11px", fontWeight: "800", color: "#fff", background: "#ef4444", padding: "2px 8px", borderRadius: "6px" }}>🔥 급구</span>
                  )}
                  {[jobDetail.title, jobDetail.conditions, jobDetail.company?.name].join(" ").match(/반도체|조선|플랜트|대형|중공업|정유/) && (
                    <span style={{ fontSize: "11px", fontWeight: "800", color: "#0d9488", background: "#ccfbf1", padding: "2px 8px", borderRadius: "6px" }}>🏗️ 대형 현장</span>
                  )}
                  {(jobDetail.period || "").match(/일당|당일|단기|오늘/) && (
                    <span style={{ fontSize: "11px", fontWeight: "800", color: "#7c3aed", background: "#ede9fe", padding: "2px 8px", borderRadius: "6px" }}>⚡ 오늘 출근</span>
                  )}
                  {(jobDetail.source === "CRAWLED_CAFE" || jobDetail.source === "CRAWLED_BAND") && (
                    <span style={{ fontSize: "11px", fontWeight: "800", color: "#92400e", background: "#fffbeb", padding: "2px 8px", borderRadius: "6px" }}>
                      {jobDetail.source === "CRAWLED_CAFE" ? "📋 카페 공고" : "📋 밴드 공고"}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "19px", fontWeight: "800", color: "var(--c1,#1F2226)", lineHeight: "1.35" }}>{jobDetail.title}</div>
                <div style={{ fontSize: "13px", color: "#8694a8", fontWeight: "600", marginTop: "5px" }}>{jobDetail.company ? jobDetail.company.name : "협약 기업"}{jobDetail.region.length ? " · " + jobDetail.region.join(", ") : ""}</div>
              </div>
              <button type="button" onClick={() => setJobDetail(null)} aria-label="닫기" style={{ flex: "none", width: "34px", height: "34px", borderRadius: "10px", border: "none", background: "#eef0f3", color: "#5b6b82", fontSize: "17px", cursor: "pointer", fontFamily: "inherit" }}>✕</button>
            </div>

            <div className="scr" style={{ overflowY: "auto", marginTop: "14px", display: "flex", flexDirection: "column", gap: "14px", paddingBottom: "20px" }}>
              
              {/* 2. 단가 정보 & 9. 받을 금액 예정일 — "받을 금액 예정일"은 MONO 자체 정산 흐름 안내라 외부 출처 공고엔 표시하지 않음 */}
              <div style={{ background: "#f8fafc", borderRadius: "16px", padding: "14px 16px", display: "grid", gridTemplateColumns: jobDetail.source === "CRAWLED_CAFE" || jobDetail.source === "CRAWLED_BAND" ? "1fr" : "1fr 1fr", gap: "10px" }}>
                <div>
                  <div style={{ fontSize: "11.5px", color: "#8694a8", fontWeight: "700" }}>일당 단가</div>
                  {jobDetail.conditions ? (
                    <div style={{ fontSize: "16px", fontWeight: "800", color: "#10b981", marginTop: "2px" }}>{jobDetail.conditions}</div>
                  ) : jobDetail.source === "CRAWLED_CAFE" || jobDetail.source === "CRAWLED_BAND" ? (
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#8694a8", marginTop: "3.5px" }}>전화 문의</div>
                  ) : (
                    <div style={{ fontSize: "16px", fontWeight: "800", color: "#10b981", marginTop: "2px" }}>일당 230,000원</div>
                  )}
                </div>
                {jobDetail.source !== "CRAWLED_CAFE" && jobDetail.source !== "CRAWLED_BAND" && (
                  <div>
                    <div style={{ fontSize: "11.5px", color: "#8694a8", fontWeight: "700" }}>받을 금액 예정일</div>
                    <div style={{ fontSize: "13.5px", fontWeight: "700", color: "var(--c1,#1F2226)", marginTop: "3.5px" }}>근무 당일 17:00 입금</div>
                  </div>
                )}
              </div>

              {/* 4. 내 준비 상태 매칭율 및 부족한 사항 */}
              <div style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>🚦 내 현장 준비도 매칭</span>
                  <span style={{ fontSize: "13px", fontWeight: "800", color: "#4f46e5" }}>
                    {(() => {
                      const isLarge = [jobDetail.title, jobDetail.company?.name].join(" ").match(/삼성|SK|현대|대형|반도체/);
                      if (isLarge) {
                        const required = [prepChecklist.idCard, prepChecklist.safetyEdu, prepChecklist.elecCard, prepChecklist.medCheck];
                        const ok = required.filter(Boolean).length;
                        return `${Math.round((ok / required.length) * 100)}% 준비 완료`;
                      } else {
                        const required = [prepChecklist.idCard, prepChecklist.safetyEdu];
                        const ok = required.filter(Boolean).length;
                        return `${Math.round((ok / required.length) * 100)}% 준비 완료`;
                      }
                    })()}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {/* 서류 현황 일람 */}
                  <div style={{ display: "flex", gap: "10px", fontSize: "12px", color: "#5b6b82" }}>
                    <span style={{ color: prepChecklist.idCard ? "#10b981" : "#ef4444" }}>{prepChecklist.idCard ? "✓" : "✗"} 신분증</span>
                    <span style={{ color: prepChecklist.safetyEdu ? "#10b981" : "#ef4444" }}>{prepChecklist.safetyEdu ? "✓" : "✗"} 안전교육</span>
                    {[jobDetail.title, jobDetail.company?.name].join(" ").match(/삼성|SK|현대|대형|반도체/) && (
                      <>
                        <span style={{ color: prepChecklist.elecCard ? "#10b981" : "#ef4444" }}>{prepChecklist.elecCard ? "✓" : "✗"} 전자카드</span>
                        <span style={{ color: prepChecklist.medCheck ? "#10b981" : "#ef4444" }}>{prepChecklist.medCheck ? "✓" : "✗"} 신체검사</span>
                      </>
                    )}
                  </div>
                  {/* 서류 미비 시 관리 링크 */}
                  {(!prepChecklist.idCard || !prepChecklist.safetyEdu || ([jobDetail.title, jobDetail.company?.name].join(" ").match(/삼성|SK|현대|대형|반도체/) && (!prepChecklist.elecCard || !prepChecklist.medCheck))) && (
                    <div
                      onClick={() => { setJobDetail(null); setS(p => ({ ...p, tab: 'home' })); }}
                      style={{ fontSize: "11.5px", color: "#4f46e5", fontWeight: "700", textDecoration: "underline", cursor: "pointer", marginTop: "4px" }}
                    >
                      부족한 준비 서류 등록하러 가기 →
                    </div>
                  )}
                </div>
              </div>

              {/* 5~8. 담당업무·준비물·복리후생·출근절차는 MONO 자체 파트너 공고용 안내라, 외부
                  카페/밴드 출처 공고에는 대신 원문 그대로를 보여준다(사실과 다른 내용 노출 방지). */}
              {jobDetail.source === "CRAWLED_CAFE" || jobDetail.source === "CRAWLED_BAND" ? (
                jobDetail.sourceRawText && (
                  <div>
                    <div style={{ fontSize: "13.5px", color: "#8694a8", fontWeight: "700", marginBottom: "4px" }}>📋 원문 전체</div>
                    <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "12px", fontSize: "13.5px", color: "var(--c1,#1F2226)", fontWeight: "500", lineHeight: "1.6", whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>
                      {jobDetail.sourceRawText}
                    </div>
                  </div>
                )
              ) : (
                <>
                  {/* 5. 하는 일 (상세 직무 내용) */}
                  <div>
                    <div style={{ fontSize: "13.5px", color: "#8694a8", fontWeight: "700", marginBottom: "4px" }}>🔧 담당 업무</div>
                    <div style={{ fontSize: "14px", color: "var(--c1,#1F2226)", fontWeight: "500", lineHeight: "1.5", wordBreak: "keep-all" }}>
                      {jobDetail.jobType.includes("형틀목공") ? "형틀목공 반장 및 숙련 기술인의 지시에 따라 거푸집 자재 운반, 정리 및 슬라브/벽체 거푸집 조립 보조 작업을 진행합니다." :
                       jobDetail.jobType.includes("철근") ? "현장 도면 기준 철근 야적 및 조립 구역 운반 보조, 결속선 바인딩 및 철근 가공 보조 작업을 담당합니다." :
                       "현장 내 자재 운반 및 정리정돈, 보행 통로 확보, 신호수 역할 보조 등 기초적인 건설 현장 안전 정비 업무를 수행합니다."}
                    </div>
                  </div>

                  {/* 6. 준비할 것 */}
                  <div>
                    <div style={{ fontSize: "13.5px", color: "#8694a8", fontWeight: "700", marginBottom: "4px" }}>🎒 필수 준비할 것</div>
                    <div style={{ fontSize: "14px", color: "var(--c1,#1F2226)", fontWeight: "600" }}>
                      {jobDetail.prepare || "안전화, 작업복, 신분증 실물 (미지참 시 현장 출입 및 근무 불가)"}
                    </div>
                  </div>

                  {/* 7. 제공되는 것 */}
                  <div>
                    <div style={{ fontSize: "13.5px", color: "#8694a8", fontWeight: "700", marginBottom: "4px" }}>🏠 복리후생 & 제공되는 것</div>
                    <div style={{ fontSize: "14px", color: "var(--c1,#1F2226)", fontWeight: "600", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontSize: "12px" }}>🍱 중식 제공</span>
                      <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontSize: "12px" }}>🛡️ 4대 보험 가입</span>
                      {[jobDetail.title, jobDetail.company?.name].join(" ").match(/삼성|SK|현대|대형|반도체/) && (
                        <>
                          <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontSize: "12px" }}>🏠 숙소 지원 가능</span>
                          <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontSize: "12px" }}>🚌 통근 셔틀버스</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 8. 출근 절차 및 위치 */}
                  <div>
                    <div style={{ fontSize: "13.5px", color: "#8694a8", fontWeight: "700", marginBottom: "4px" }}>📍 출근 및 집결 정보</div>
                    <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "12px", fontSize: "13px", color: "#5b6b82", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div><strong>집결지:</strong> {jobDetail.region?.join(" ") || "인천 연수구"} 송도동 아파트 신축공사 게이트 2앞</div>
                      <div><strong>집결 시간:</strong> 오전 06:40 (당일 안전 교육 및 혈압 체크 필수, 지각 시 현장 출입 통제)</div>
                      <div><strong>절차:</strong> 게이트 안전대 도착 → 출근 체크 → 혈압 측정 → 안전 체조 → 당일 TBM 진행 후 작업 투입</div>
                    </div>
                  </div>
                </>
              )}

              {/* 10. 후기 및 커뮤니티 연계 & AI 물어보기 */}
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => {
                    track("community_opened", { source: "job_detail_room" });
                    setJobDetail(null);
                    v.goCommunity();
                  }}
                  style={{
                    flex: 1, height: "42px", border: "1px solid #4f46e5", borderRadius: "12px",
                    background: "#fff", color: "#4f46e5", fontSize: "13px", fontWeight: "700", cursor: "pointer"
                  }}
                >
                  💬 이 현장 이야기방 가기
                </button>

                <button
                  type="button"
                  onClick={() => {
                    track("ai_term_explained", { source: "job_detail_glossary" });
                    setGlossaryOpen(true);
                  }}
                  style={{
                    flex: 1, height: "42px", border: "none", borderRadius: "12px",
                    background: "#eff6ff", color: "#2563eb", fontSize: "13px", fontWeight: "700", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "4px"
                  }}
                >
                  🤖 현장 용어 AI 가이드
                </button>
              </div>

            </div>

            {/* 3. 즉시 지원 버튼 및 내 지원 상태 — 카페·밴드 외부 공고는 MONO 지원 파이프라인이 없어 바로 전화 연결 */}
            {(jobDetail.source === "CRAWLED_CAFE" || jobDetail.source === "CRAWLED_BAND") ? (
              jobDetail.company?.contactPhone ? (
                <a
                  href={`tel:${jobDetail.company.contactPhone}`}
                  onClick={() => track("job_applied", { jobId: jobDetail.id, source: "job_detail_overlay_call" })}
                  style={{
                    marginTop: "10px", flex: "none", width: "100%", height: "50px", border: "none", borderRadius: "14px",
                    background: "var(--c1,#1F2226)", color: "#fff",
                    fontSize: "15px", fontWeight: "800", fontFamily: "inherit",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    textDecoration: "none", WebkitTapHighlightColor: "transparent"
                  }}
                >
                  📞 {jobDetail.company.contactPhone}로 전화하기
                </a>
              ) : (
                <div style={{ marginTop: "10px", width: "100%", height: "50px", borderRadius: "14px", background: "#f1f5f9", color: "#8694a8", fontSize: "13.5px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  연락처 정보 없음
                </div>
              )
            ) : (
              <button
                onClick={() => {
                  track("job_applied", { jobId: jobDetail.id, source: "job_detail_overlay" });
                  applyToJob(jobDetail.id);
                }}
                disabled={appliedJobs.has(jobDetail.id)}
                style={{
                  marginTop: "10px", flex: "none", width: "100%", height: "50px", border: "none", borderRadius: "14px",
                  background: appliedJobs.has(jobDetail.id) ? "var(--soft,#E5E7EB)" : "var(--c1,#1F2226)",
                  color: appliedJobs.has(jobDetail.id) ? "var(--c1,#1F2226)" : "#fff",
                  fontSize: "15px", fontWeight: "800", fontFamily: "inherit",
                  cursor: appliedJobs.has(jobDetail.id) ? "default" : "pointer",
                  WebkitTapHighlightColor: "transparent"
                }}
              >
                {appliedJobs.has(jobDetail.id) ? "지원 완료 ✓" : "현장 바로 지원하기"}
              </button>
            )}
          </div>
        </div>
      )}

      {eduInfoOpen && (
        <div onClick={() => setEduInfoOpen(false)} style={{ position: "absolute", inset: "0", zIndex: "70", background: "rgba(20,22,48,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "24px 20px 28px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "88%", display: "flex", flexDirection: "column" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#d4dae3", margin: "0 auto 16px" }}></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
              <div style={{ fontSize: "20px", fontWeight: "900", color: "var(--c1,#1F2226)" }}>🎓 조공이 되기 위한 필수 교육</div>
              <button type="button" onClick={() => setEduInfoOpen(false)} aria-label="닫기" style={{ flex: "none", width: "34px", height: "34px", borderRadius: "10px", border: "none", background: "#eef0f3", color: "#5b6b82", fontSize: "17px", cursor: "pointer", fontFamily: "inherit" }}>✕</button>
            </div>

            <div className="scr" style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "16px", marginTop: "10px" }}>
              <div style={{ fontSize: "14px", color: "var(--c1,#1F2226)", fontWeight: "600", lineHeight: "1.6", wordBreak: "keep-all" }}>
                산업안전보건법에 따라 건설 현장에 처음 투입되는 모든 근로자는 작업 시작 전 <strong>건설업 기초안전보건교육</strong>을 반드시 이수해야 해요. 이수하지 않으면 현장 출입 자체가 불가능합니다.
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {[
                  { label: "교육 시간", value: "약 4시간" },
                  { label: "유효 기간", value: "평생 1회" },
                  { label: "비용", value: "대부분 무료·소액" },
                  { label: "이수 방법", value: "온라인 또는 오프라인" },
                ].map((x) => (
                  <div key={x.label} style={{ background: "#f8fafc", borderRadius: "12px", padding: "10px 12px" }}>
                    <div style={{ fontSize: "11.5px", color: "#8694a8", fontWeight: "700" }}>{x.label}</div>
                    <div style={{ fontSize: "14px", fontWeight: "900", color: "var(--c1,#1F2226)", marginTop: "2px" }}>{x.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "12px", color: "#8694a8", fontWeight: "600", marginTop: "-8px" }}>
                한 번 이수하면 현장·회사가 바뀌어도 다시 받을 필요 없어요.
              </div>

              <div style={{ border: "1.5px solid #c7d2fe", background: "#eef2ff", borderRadius: "16px", padding: "16px" }}>
                <div style={{ fontSize: "14px", fontWeight: "900", color: "#312e81" }}>💻 온라인으로 이수하기</div>
                <div style={{ fontSize: "13px", color: "#4f46e5", fontWeight: "600", lineHeight: "1.55", marginTop: "6px", wordBreak: "keep-all" }}>
                  &quot;기초안전보건교육 온라인&quot;으로 검색하면 고용노동부 인가 교육기관의 온라인 강의를 찾을 수 있어요. 스마트폰으로 4시간 안에 완료할 수 있습니다.
                </div>
              </div>

              <div style={{ border: "1.5px dashed #cbd5e1", borderRadius: "16px", padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "900", color: "#64748b" }}>📍 주변 교육기관 찾기</span>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#92400e", background: "#fffbeb", padding: "2px 8px", borderRadius: "6px" }}>준비 중</span>
                </div>
                <div style={{ fontSize: "12.5px", color: "#8694a8", fontWeight: "600", lineHeight: "1.55", marginTop: "6px", wordBreak: "keep-all" }}>
                  공공데이터 연동을 준비하고 있어요. 곧 내 주변 오프라인 교육기관을 지도에서 바로 찾을 수 있도록 업데이트할게요.
                </div>
              </div>

              <button
                type="button"
                onClick={() => { track("safety_edu_doc_cta_clicked", { source: "edu_info_sheet" }); setEduInfoOpen(false); setOpenDocs(true); }}
                style={{ height: "50px", border: "none", borderRadius: "14px", background: "var(--c1,#1F2226)", color: "#fff", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}
              >
                이수증 등록하러 가기
              </button>
            </div>
          </div>
        </div>
      )}

      {openInterest && (
        <div onClick={() => setOpenInterest(false)} style={{ position: "absolute", inset: "0", zIndex: "60", background: "rgba(20,22,48,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "22px 18px 26px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "82%", display: "flex", flexDirection: "column" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#d4dae3", margin: "0 auto 16px" }}></div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>관심 기능 신청</div>
            <div style={{ fontSize: "13px", color: "#8694a8", fontWeight: "500", marginTop: "4px", marginBottom: "14px" }}>관심 등록하면 먼저 안내드릴게요.</div>
            <div className="scr" style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
              {(INTEREST_FEATURES || []).map((f) => {
                const done = (interests || []).some((i) => i.feature === f.key);
                return (
                  <div key={f.key} style={{ border: "1px solid #e6e8ec", borderRadius: "16px", padding: "14px 15px", background: done ? "var(--soft,#E5E7EB)" : "#fff" }}>
                    <div style={{ fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>{f.label}</div>
                    <div style={{ fontSize: "12.5px", color: "#5b6b82", fontWeight: "500", marginTop: "3px" }}>{f.short}</div>
                    {(f.body || []).map((line, _bi) => (<div key={_bi} style={{ fontSize: "11.5px", color: "#8694a8", fontWeight: "500", marginTop: "6px", lineHeight: "1.55" }}>{line}</div>))}
                    <button
                      type="button"
                      onClick={() => onPickInterest(f)}
                      disabled={done}
                      style={{
                        marginTop: "11px", width: "100%", height: "42px", border: "none", borderRadius: "12px",
                        background: done ? "transparent" : "var(--c1,#1F2226)",
                        color: done ? "var(--c1,#1F2226)" : "#fff", fontSize: "13.5px", fontWeight: "800",
                        fontFamily: "inherit", cursor: done ? "default" : "pointer", WebkitTapHighlightColor: "transparent",
                      }}
                    >
                      {done ? "신청 완료 ✓" : f.cta}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {openEquipSheet && (
        <div onClick={() => setOpenEquipSheet(false)} style={{ position: "absolute", inset: "0", zIndex: "60", background: "rgba(20,22,48,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "22px 18px 26px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "88%", display: "flex", flexDirection: "column" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#d4dae3", margin: "0 auto 16px" }}></div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>장비 보유 이력</div>
            <div style={{ fontSize: "13px", color: "#8694a8", fontWeight: "500", marginTop: "4px", marginBottom: "16px" }}>보유하고 있는 장비와 조작 능력을 등록하세요.</div>
            <div className="scr" style={{ overflowY: "auto" }}>
              {(equipmentHistory || []).map((e) => (
                <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 13px", border: "1px solid #e6e8ec", borderRadius: "12px", marginBottom: "8px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--c1,#1F2226)" }}>{e.equipmentName}</span>
                    <span style={{ fontSize: "11px", color: "#8694a8" }}>{[e.spec, e.experienceMonths ? `${e.experienceMonths}개월` : null, e.description].filter(Boolean).join(" · ")}</span>
                  </div>
                  <button onClick={() => deleteEquip(e.id)} style={{ border: "none", background: "none", fontSize: "12px", color: "#e11d48", fontWeight: "700", cursor: "pointer" }}>삭제</button>
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                <input value={equipForm.equipmentName} onChange={(e) => setEquipForm((p) => ({ ...p, equipmentName: e.target.value }))} placeholder="장비명 (예: 굴삭기)" style={{ height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                <input value={equipForm.spec} onChange={(e) => setEquipForm((p) => ({ ...p, spec: e.target.value }))} placeholder="상세 규격 (예: 02, 06)" style={{ height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                <div style={{ display: "flex", gap: "8px" }}>
                  <input type="number" value={equipForm.experienceMonths} onChange={(e) => setEquipForm((p) => ({ ...p, experienceMonths: e.target.value }))} placeholder="조작 경력 (개월)" style={{ width: "130px", height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                  <input value={equipForm.description} onChange={(e) => setEquipForm((p) => ({ ...p, description: e.target.value }))} placeholder="추가 설명" style={{ flex: "1", height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box", minWidth: "0" }} />
                </div>
                <button type="button" onClick={submitEquip} style={{ height: "44px", border: "1px solid var(--c1,#1F2226)", borderRadius: "11px", background: "#fff", color: "var(--c1,#1F2226)", fontSize: "14px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>+ 장비 이력 추가</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {openDocs && (
        <div onClick={() => setOpenDocs(false)} style={{ position: "absolute", inset: "0", zIndex: "60", background: "rgba(20,22,48,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "24px 20px 28px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "90%", display: "flex", flexDirection: "column" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#d4dae3", margin: "0 auto 16px" }}></div>
            <div style={{ fontSize: "20px", fontWeight: "900", color: "var(--c1,#1F2226)", marginBottom: "20px" }}>🚧 필수 서류 등록</div>

            <div className="scr" style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "14px" }}>

              {/* 현장 준비 서류 7종 제출 섹션 */}
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { key: "idCard", label: "🪪 신분증" },
                    { key: "safetyEdu", label: "🔰 안전교육" },
                    { key: "elecCard", label: "💳 전자카드" },
                    { key: "bankAcc", label: "🏦 계좌" },
                    { key: "medCheck", label: "🩺 건강검진" },
                    { key: "gateCard", label: "🔑 출입카드" },
                    { key: "safetyGear", label: "🥾 안전화" }
                  ].map((doc) => {
                    const status = prepStatusOf(doc.key);
                    const statusText = status === "VERIFIED" ? "✅ 승인완료"
                      : status === "SUBMITTED" ? "⏳ 검토중"
                      : status === "REJECTED" ? `⚠️ 반려${prepMemoOf(doc.key) ? `: ${prepMemoOf(doc.key)}` : ""}`
                      : "미제출";
                    const statusColor = status === "VERIFIED" ? "#166534" : status === "SUBMITTED" ? "#92400e" : status === "REJECTED" ? "#991b1b" : "#8694a8";
                    const bg = status === "VERIFIED" ? "#f0fdf4" : status === "SUBMITTED" ? "#fffbeb" : status === "REJECTED" ? "#fef2f2" : "#fff";
                    const border = status === "VERIFIED" ? "#a7f3d0" : status === "SUBMITTED" ? "#fde68a" : status === "REJECTED" ? "#fecaca" : "#e6e8ec";
                    const canSubmit = status === "NONE" || status === "REJECTED";
                    return (
                      <div key={doc.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", border: "2px solid #e6e8ec", borderRadius: "16px", background: bg, borderColor: border }}>
                        <div style={{ minWidth: 0, flex: 1, paddingRight: "10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ fontSize: "15px", fontWeight: "900", color: "var(--c1,#1F2226)" }}>{doc.label}</span>
                            {doc.key === "safetyEdu" && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); track("safety_edu_info_viewed", { source: "doc_modal" }); setEduInfoOpen(true); }}
                                aria-label="안전교육 안내 보기"
                                style={{ width: "20px", height: "20px", flex: "none", border: "1px solid #c7d2fe", borderRadius: "50%", background: "#eef2ff", color: "#4f46e5", fontSize: "11.5px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "0" }}
                              >
                                ?
                              </button>
                            )}
                          </div>
                          <div style={{ fontSize: "12.5px", color: statusColor, marginTop: "4px", fontWeight: "800" }}>
                            {statusText}
                          </div>
                        </div>

                        {canSubmit && (
                          <button
                            type="button"
                            onClick={() => submitPrepItem(doc.key)}
                            style={{
                              height: "46px", padding: "0 18px", border: "none", borderRadius: "10px",
                              fontSize: "13.5px", fontWeight: "900", cursor: "pointer",
                              background: "var(--c1,#1F2226)",
                              color: "#fff",
                              whiteSpace: "nowrap",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.05)"
                            }}
                          >
                            {status === "REJECTED" ? "다시 제출" : "제출하기"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ borderTop: "1px solid #f1f5f9", margin: "4px 0" }}></div>

              {/* 기존 자격증 */}
              <div>
                <div style={{ fontSize: "14px", fontWeight: "800", color: "var(--c1,#1F2226)", marginBottom: "8px" }}>📜 국가 기술 자격증 추가</div>
                {(certificates || []).map((c) => (
                  <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 13px", border: "1px solid #e6e8ec", borderRadius: "12px", marginBottom: "8px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                      <span style={{ fontSize: "13.5px", fontWeight: "700", color: "var(--c1,#1F2226)" }}>{c.name}</span>
                      <span style={{ fontSize: "11px", color: "#8694a8" }}>발급번호 {c.licenseNo}</span>
                    </div>
                    <span style={{ fontSize: "11.5px", color: "#8694a8" }}>{[c.issuer, c.issuedAt].filter(Boolean).join(" · ")}</span>
                  </div>
                ))}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                  <input value={certForm.name} onChange={(e) => setCertForm((p) => ({ ...p, name: e.target.value }))} placeholder="자격증명 (예: 용접기능사)" style={{ height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                  <input value={certForm.licenseNo} onChange={(e) => setCertForm((p) => ({ ...p, licenseNo: e.target.value }))} placeholder="발급번호 (예: 12-34567-89)" style={{ height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input value={certForm.issuer} onChange={(e) => setCertForm((p) => ({ ...p, issuer: e.target.value }))} placeholder="발급기관" style={{ flex: "1", height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box", minWidth: "0" }} />
                    <input value={certForm.issuedAt} onChange={(e) => setCertForm((p) => ({ ...p, issuedAt: e.target.value }))} placeholder="취득일" style={{ width: "120px", height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                  </div>
                  <button type="button" onClick={submitCert} style={{ height: "44px", border: "1px solid var(--c1,#1F2226)", borderRadius: "11px", background: "#fff", color: "var(--c1,#1F2226)", fontSize: "14px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>+ 자격증 추가</button>
                </div>
              </div>

            </div>
            <button type="button" onClick={() => setOpenDocs(false)} style={{ marginTop: "16px", flex: "none", height: "50px", border: "none", borderRadius: "14px", background: "var(--c1,#1F2226)", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>완료</button>
          </div>
        </div>
      )}

      {openShareSheet && (
        <div onClick={() => setOpenShareSheet(false)} style={{ position: "absolute", inset: "0", zIndex: "60", background: "rgba(20,22,48,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "22px 18px 26px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "90%", overflowY: "auto" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#d4dae3", margin: "0 auto 16px" }}></div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>현장 경력 공유</div>
            <div style={{ fontSize: "13px", color: "#8694a8", fontWeight: "500", marginTop: "4px", marginBottom: "16px" }}>링크와 QR로 내 경력 프로필을 공유하세요. 민감 정보는 자동으로 가려집니다.</div>
            {(() => {
              const url = shareUrl();
              if (!url) {
                return (
                  <div style={{ fontSize: "13.5px", color: "#5b6b82", fontWeight: "600", lineHeight: "1.6", background: "#eef0f3", borderRadius: "14px", padding: "16px" }}>
                    프로필을 먼저 만들어 주세요. 가입·기본 정보를 입력하면 공유 링크가 생성됩니다.
                  </div>
                );
              }
              return (
                <>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                    <div style={{ padding: "14px", background: "#fff", border: "1px solid #e6e8ec", borderRadius: "18px" }}>
                      <QRCodeSVG value={url} size={196} fgColor="var(--c1,#1F2226)" bgColor="#ffffff" level="M" />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#eef0f3", borderRadius: "12px", padding: "12px 13px", marginBottom: "10px" }}>
                    <span style={{ fontSize: "13px", color: "var(--c1,#1F2226)", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: "1", minWidth: "0" }}>{url}</span>
                  </div>
                  <button type="button" onClick={copyShare} style={{ width: "100%", height: "50px", border: "1px solid var(--c1,#1F2226)", borderRadius: "14px", background: "#fff", color: "var(--c1,#1F2226)", fontSize: "14px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", marginBottom: "10px", WebkitTapHighlightColor: "transparent" }}>{shareCopied ? "복사됨!" : "링크 복사"}</button>
                  <button type="button" onClick={nativeShare} style={{ width: "100%", height: "52px", border: "none", borderRadius: "15px", background: "var(--c1,#1F2226)", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>공유하기</button>
                </>
              );
            })()}
            <button type="button" onClick={() => setOpenShareSheet(false)} style={{ marginTop: "12px", width: "100%", height: "48px", border: "1px solid #d4dae3", borderRadius: "14px", background: "#fff", color: "#5b6b82", fontSize: "14px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer" }}>닫기</button>
          </div>
        </div>
      )}

      {confirmState && (
        <div onClick={() => setConfirmState(null)} style={{ position: "absolute", inset: "0", zIndex: "70", background: "rgba(20,22,48,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", animation: "fadeIn .2s ease" }}>
          <div ref={confirmRef} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={confirmState.title} tabIndex={-1} style={{ width: "100%", maxWidth: "350px", background: "#fff", borderRadius: "22px", padding: "24px 22px 18px", animation: "riseUp .25s ease both", outline: "none" }}>
            <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: "#fdecec", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 8.5v4.5m0 3h.01M10.3 3.9 2.5 17.6a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="#d9534f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div style={{ marginTop: "14px", textAlign: "center", fontSize: "17px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>{confirmState.title}</div>
            <div style={{ marginTop: "8px", textAlign: "center", fontSize: "13.5px", color: "var(--app-text-secondary,#5b6b82)", fontWeight: "500", lineHeight: "1.6" }}>{confirmState.body}</div>
            <div style={{ marginTop: "20px", display: "flex", gap: "9px" }}>
              <button type="button" onClick={() => setConfirmState(null)} style={{ flex: "1", height: "50px", border: "1px solid #e6e8ec", borderRadius: "14px", background: "#fff", color: "#5b6b82", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>취소</button>
              <button type="button" onClick={() => { const fn = confirmState.onConfirm; setConfirmState(null); fn(); }} style={{ flex: "1", height: "50px", border: "none", borderRadius: "14px", background: "#d9534f", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>{confirmState.confirmLabel}</button>
            </div>
          </div>
        </div>
      )}

      {teamOpen && (
        <div onClick={() => setTeamOpen(false)} style={{ position: "absolute", inset: "0", zIndex: "60", background: "rgba(20,22,48,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div ref={teamRef} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="팀 등록" tabIndex={-1} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "22px 18px 26px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "90%", display: "flex", flexDirection: "column", outline: "none" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#d4dae3", margin: "0 auto 16px" }}></div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>팀 등록</div>
            <div style={{ fontSize: "12.5px", color: "#8694a8", fontWeight: "500", marginTop: "5px", marginBottom: "16px", lineHeight: "1.5" }}>팀 이름과 팀원(이름·연락처)을 입력하면 한 번에 등록돼요.</div>
            <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
              <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="팀 이름 (예: 김반장 형틀팀)" style={{ height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#8694a8", marginTop: "4px" }}>팀원</div>
              {teamRows.map((row, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input value={row.name} onChange={(e) => setTeamRows((p) => p.map((r, _i) => (_i === i ? { ...r, name: e.target.value } : r)))} placeholder="이름" style={{ flex: "1", minWidth: "0", height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 12px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                  <input value={row.phone} onChange={(e) => setTeamRows((p) => p.map((r, _i) => (_i === i ? { ...r, phone: e.target.value } : r)))} placeholder="연락처" inputMode="tel" style={{ flex: "1", minWidth: "0", height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 12px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                  {teamRows.length > 1 && (<button type="button" onClick={() => setTeamRows((p) => p.filter((_, _i) => _i !== i))} aria-label="팀원 삭제" style={{ flex: "none", width: "38px", height: "44px", border: "none", background: "none", color: "#d9534f", fontSize: "20px", cursor: "pointer", fontFamily: "inherit" }}>−</button>)}
                </div>
              ))}
              <button type="button" onClick={() => setTeamRows((p) => [...p, { name: "", phone: "" }])} style={{ height: "44px", border: "1px dashed var(--brand-tint-2,#A5AEB8)", borderRadius: "11px", background: "#f5f6fb", color: "var(--c1,#1F2226)", fontSize: "13.5px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>+ 팀원 추가</button>
            </div>
            {teamMsg && (<div style={{ fontSize: "12.5px", color: teamMsg.endsWith("중…") ? "#8694a8" : "#d9534f", fontWeight: "700", marginTop: "10px", textAlign: "center" }}>{teamMsg}</div>)}
            <button type="button" onClick={submitTeam} style={{ marginTop: "14px", flex: "none", height: "52px", border: "none", borderRadius: "14px", background: "var(--c1,#1F2226)", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>팀 등록</button>
            <button type="button" onClick={() => setTeamOpen(false)} style={{ marginTop: "10px", flex: "none", height: "46px", border: "none", borderRadius: "13px", background: "#eef0f3", color: "#5b6b82", fontSize: "14px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer" }}>닫기</button>
          </div>
        </div>
      )}

      {leaderProfileOpen && (
        <div onClick={() => setLeaderProfileOpen(false)} style={{ position: "absolute", inset: "0", zIndex: "60", background: "rgba(20,22,48,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div ref={leaderRef} onClick={(e) => e.stopPropagation()} onKeyDown={onLeaderKeyDown} role="dialog" aria-modal="true" aria-label="현장리더 프로필" tabIndex={-1} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "22px 18px 26px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "90%", display: "flex", flexDirection: "column", outline: "none" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#d4dae3", margin: "0 auto 16px" }}></div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--app-text,#1F2226)" }}>현장리더 프로필</div>
            <div style={{ fontSize: "12.5px", color: "#8694a8", fontWeight: "500", marginTop: "5px", marginBottom: "16px", lineHeight: "1.5" }}>관리 가능한 직군·팀 규모와 투입 지역을 등록하면 더 잘 맞는 현장과 연결돼요. 모두 선택 항목이에요.</div>
            <div className="scr" style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* 주요 직군 */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: "800", color: "var(--app-text,#1F2226)", marginBottom: "9px" }}>주요 직군</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {JOB_TYPES.map((j) => { const on = leaderForm.primaryJobTypes.includes(j); return (
                    <button key={j} type="button" onClick={() => toggleLeaderArr("primaryJobTypes", j)} style={{ ...LEADER_CHIP, background: on ? "var(--c1,#1F2226)" : "#fff", color: on ? "#fff" : "#5b6b82", border: on ? "1px solid var(--c1,#1F2226)" : "1px solid #e6e8ec" }}>{j}</button>
                  ); })}
                </div>
              </div>
              {/* 관리 가능 팀 규모 */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: "800", color: "var(--app-text,#1F2226)", marginBottom: "9px" }}>관리 가능 팀 규모</div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input value={leaderForm.manageableTeamSize} onChange={(e) => setLeaderForm((p) => ({ ...p, manageableTeamSize: e.target.value.replace(/[^0-9]/g, "") }))} inputMode="numeric" placeholder="예: 12" style={{ width: "120px", height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                  <span style={{ fontSize: "13px", color: "#8694a8", fontWeight: "600" }}>명</span>
                </div>
              </div>
              {/* 주요 작업 분야 */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: "800", color: "var(--app-text,#1F2226)", marginBottom: "9px" }}>주요 작업 분야</div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input value={leaderWorkInput} onChange={(e) => setLeaderWorkInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLeaderWorkField(); } }} placeholder="예: 갱폼·알폼 시공" style={{ flex: "1", minWidth: "0", height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                  <button type="button" onClick={addLeaderWorkField} style={{ flex: "none", height: "44px", padding: "0 16px", border: "1px solid var(--c1,#1F2226)", borderRadius: "11px", background: "#fff", color: "var(--c1,#1F2226)", fontSize: "13.5px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>추가</button>
                </div>
                {leaderForm.mainWorkFields.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "9px" }}>
                    {leaderForm.mainWorkFields.map((w) => (
                      <button key={w} type="button" onClick={() => toggleLeaderArr("mainWorkFields", w)} aria-label={`${w} 삭제`} style={{ ...LEADER_CHIP, background: "var(--c1,#1F2226)", color: "#fff", border: "1px solid var(--c1,#1F2226)" }}>{w} ✕</button>
                    ))}
                  </div>
                )}
              </div>
              {/* 산업 분야 */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: "800", color: "var(--app-text,#1F2226)", marginBottom: "9px" }}>산업 분야</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {INDUSTRIES.map((ind) => { const on = leaderForm.industries.includes(ind.value); return (
                    <button key={ind.value} type="button" onClick={() => toggleLeaderArr("industries", ind.value)} style={{ ...LEADER_CHIP, background: on ? "var(--c1,#1F2226)" : "#fff", color: on ? "#fff" : "#5b6b82", border: on ? "1px solid var(--c1,#1F2226)" : "1px solid #e6e8ec" }}>{ind.label}</button>
                  ); })}
                </div>
              </div>
              {/* 투입 지역 */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: "800", color: "var(--app-text,#1F2226)", marginBottom: "9px" }}>투입 지역</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {REGIONS.map((r) => { const on = leaderForm.regions.includes(r); return (
                    <button key={r} type="button" onClick={() => toggleLeaderArr("regions", r)} style={{ ...LEADER_CHIP, background: on ? "var(--c1,#1F2226)" : "#fff", color: on ? "#fff" : "#5b6b82", border: on ? "1px solid var(--c1,#1F2226)" : "1px solid #e6e8ec" }}>{r}</button>
                  ); })}
                </div>
              </div>
              {/* 연락 가능 시간 */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: "800", color: "var(--app-text,#1F2226)", marginBottom: "9px" }}>연락 가능 시간</div>
                <input value={leaderForm.contactHours} onChange={(e) => setLeaderForm((p) => ({ ...p, contactHours: e.target.value }))} placeholder="예: 평일 08:00~18:00" style={{ width: "100%", height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            </div>
            {leaderMsg && (<div style={{ fontSize: "12.5px", color: leaderMsg.endsWith("중…") ? "#8694a8" : "#d9534f", fontWeight: "700", marginTop: "12px", textAlign: "center" }}>{leaderMsg}</div>)}
            <button type="button" onClick={submitLeaderProfile} style={{ marginTop: "14px", flex: "none", height: "52px", border: "none", borderRadius: "14px", background: "var(--c1,#1F2226)", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>저장</button>
            <button type="button" onClick={() => setLeaderProfileOpen(false)} style={{ marginTop: "10px", flex: "none", height: "46px", border: "none", borderRadius: "13px", background: "#eef0f3", color: "#5b6b82", fontSize: "14px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer" }}>닫기</button>
          </div>
        </div>
      )}

      {openCareerSheet && (
        <div onClick={() => setOpenCareerSheet(false)} style={{ position: "absolute", inset: "0", zIndex: "60", background: "rgba(20,22,48,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div ref={careerSheetRef} onClick={(e) => e.stopPropagation()} onKeyDown={onCareerKeyDown} role="dialog" aria-modal="true" aria-label="현장 경력 추가" tabIndex={-1} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "22px 18px 26px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "90%", display: "flex", flexDirection: "column", outline: "none" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#d4dae3", margin: "0 auto 16px" }}></div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>현장 경력 추가</div>
            <div style={{ fontSize: "13px", color: "#8694a8", fontWeight: "500", marginTop: "4px", marginBottom: "16px" }}>참여한 현장을 등록하면 공유 프로필에 바로 반영돼요.</div>
            <div className="scr" style={{ overflowY: "auto", flex: "1", minHeight: "0" }}>
              {(Array.isArray(careerCards) ? careerCards : []).map((c) => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 13px", border: "1px solid #e6e8ec", borderRadius: "12px", marginBottom: "8px", gap: "8px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--c1,#1F2226)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.siteName}</span>
                    {(c.startDate || c.endDate || c.role) && (<span style={{ fontSize: "11px", color: "#8694a8" }}>{[fmtRange(c.startDate, c.endDate), c.role].filter(Boolean).join(" · ")}</span>)}
                  </div>
                  {c.field && (<span style={{ flex: "none", fontSize: "11px", fontWeight: "700", color: "var(--c1,#1F2226)", background: "var(--soft,#E5E7EB)", padding: "3px 8px", borderRadius: "7px" }}>{c.field}</span>)}
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: (careerCards || []).length ? "4px" : "0" }}>
                <input value={careerForm.siteName} onChange={(e) => setCareerForm((p) => ({ ...p, siteName: e.target.value }))} placeholder="현장명 (필수)" style={{ height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                <input value={careerForm.field} onChange={(e) => setCareerForm((p) => ({ ...p, field: e.target.value }))} placeholder="작업 분야 (예: 형틀목공)" style={{ height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                <div style={{ display: "flex", gap: "8px" }}>
                  <input value={careerForm.startDate} onChange={(e) => setCareerForm((p) => ({ ...p, startDate: e.target.value }))} placeholder="시작 (예: 2024-03)" style={{ flex: "1", height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box", minWidth: "0" }} />
                  <input value={careerForm.endDate} onChange={(e) => setCareerForm((p) => ({ ...p, endDate: e.target.value }))} placeholder="종료 (예: 2024-09)" style={{ flex: "1", height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box", minWidth: "0" }} />
                </div>
                <input value={careerForm.role} onChange={(e) => setCareerForm((p) => ({ ...p, role: e.target.value }))} placeholder="역할 (예: 반장)" style={{ height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                <input value={careerForm.equipment} onChange={(e) => setCareerForm((p) => ({ ...p, equipment: e.target.value }))} placeholder="사용 장비 (예: 갱폼·알폼)" style={{ height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                <button type="button" onClick={submitCareer} disabled={!careerForm.siteName.trim()} style={{ height: "44px", border: "1px solid var(--c1,#1F2226)", borderRadius: "11px", background: "#fff", color: "var(--c1,#1F2226)", fontSize: "14px", fontWeight: "800", fontFamily: "inherit", cursor: careerForm.siteName.trim() ? "pointer" : "default", opacity: careerForm.siteName.trim() ? "1" : ".5", WebkitTapHighlightColor: "transparent" }}>+ 경력 추가</button>
              </div>
            </div>
            <button type="button" onClick={() => setOpenCareerSheet(false)} style={{ marginTop: "16px", flex: "none", height: "50px", border: "none", borderRadius: "14px", background: "var(--c1,#1F2226)", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>완료</button>
          </div>
        </div>
      )}

      {/* 퇴근 및 재출근 제안 (반장용 Checkout Sheet) */}
      {checkoutSheetApp && (
        <div onClick={() => setCheckoutSheetApp(null)} style={{ position: "absolute", inset: "0", zIndex: "70", background: "rgba(20,22,48,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "22px 18px 26px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "90%", display: "flex", flexDirection: "column" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#d4dae3", margin: "0 auto 16px" }}></div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>퇴근 체크 및 재출근 제안</div>
            <div style={{ fontSize: "13px", color: "#8694a8", fontWeight: "500", marginTop: "4px", marginBottom: "16px" }}>내일도 이 현장에 부를 팀원을 선택해주세요.</div>
            
            <div className="scr" style={{ overflowY: "auto", flex: "1", minHeight: "0", display: "flex", flexDirection: "column", gap: "10px" }}>
              {coworkers.length === 0 ? (
                <div style={{ fontSize: "14px", color: "#8694a8", textAlign: "center", padding: "20px 0" }}>함께 일한 동료가 없습니다.</div>
              ) : (
                (Array.isArray(coworkers) ? coworkers : []).map((c) => (
                  <div key={c.coworkerId} onClick={() => setReattendSelected(p => p.includes(c.coworkerId) ? p.filter(id => id !== c.coworkerId) : [...p, c.coworkerId])} style={{ background: reattendSelected.includes(c.coworkerId) ? "var(--soft,#E5E7EB)" : "#fff", border: "1px solid " + (reattendSelected.includes(c.coworkerId) ? "var(--c1,#1F2226)" : "#e6e8ec"), borderRadius: "16px", padding: "13px 14px", display: "flex", alignItems: "center", gap: "11px", cursor: "pointer" }}>
                    <div style={{ flex: "none", width: "38px", height: "38px", borderRadius: "50%", background: reattendSelected.includes(c.coworkerId) ? "var(--c1,#1F2226)" : "var(--soft,#E5E7EB)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "800", color: reattendSelected.includes(c.coworkerId) ? "#fff" : "var(--c1,#1F2226)" }}>{(c.name || "동").slice(0, 1)}</div>
                    <div style={{ flex: "1", minWidth: "0" }}>
                      <div style={{ fontSize: "14px", fontWeight: "800", color: "var(--c1,#1F2226)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name || "이름 미등록"}</div>
                      <div style={{ fontSize: "11.5px", color: "#8694a8", fontWeight: "600", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.siteName}</div>
                    </div>
                    {reattendSelected.includes(c.coworkerId) && (
                      <div style={{ color: "var(--c1,#1F2226)" }}>✓</div>
                    )}
                  </div>
                ))
              )}
            </div>

            <button type="button" disabled={reattendBusy} onClick={async () => {
              if (reattendBusy) return;
              setReattendBusy(true);
              try {
                if (reattendSelected.length > 0) {
                  const tmr = new Date();
                  tmr.setDate(tmr.getDate() + 1);
                  const dtStr = tmr.toISOString().slice(0, 10);
                  await apiProposeReAttendance(checkoutSheetApp.jobPost.id, reattendSelected, dtStr);
                  track("reattend_proposed", { count: reattendSelected.length });
                }
                await apiCheckOut(checkoutSheetApp.id);
                loadAssignments();
                setCheckoutSheetApp(null);
              } finally {
                setReattendBusy(false);
              }
            }} style={{ marginTop: "16px", flex: "none", height: "50px", border: "none", borderRadius: "14px", background: "var(--c1,#1F2226)", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", opacity: reattendBusy ? ".7" : "1" }}>
              {reattendBusy ? "처리 중..." : (reattendSelected.length > 0 ? `${reattendSelected.length}명 재출근 제안 및 퇴근` : "퇴근 체크만 하기")}
            </button>
          </div>
        </div>
      )}

      {/* 1. 모바일 근로계약서 서명 모달 */}
      {openContractModal && (
        <div onClick={() => setOpenContractModal(false)} style={{ position: "absolute", inset: "0", zIndex: "70", background: "rgba(20,22,48,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "24px 20px 28px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "90%", display: "flex", flexDirection: "column" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#d4dae3", margin: "0 auto 16px" }}></div>
            <div style={{ fontSize: "20px", fontWeight: "900", color: "var(--c1,#1F2226)" }}>📝 모바일 근로계약서 간편 서명</div>
            <div style={{ fontSize: "13.5px", color: "#5b6b82", fontWeight: "700", marginTop: "4px", marginBottom: "16px", lineHeight: "1.5", wordBreak: "keep-all" }}>
              안전한 근로 제공과 체불 예방을 위해 계약 내용을 확인하신 후, 하단 서명란에 이름을 기입해 서명해주세요.
            </div>

            <div className="scr" style={{ overflowY: "auto", flex: "1", padding: "12px", background: "#f8fafc", borderRadius: "14px", border: "1.5px solid #e6e8ec", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "14px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>[안심 근로 계약 요약]</div>
              <div style={{ fontSize: "13.5px", color: "#374151", lineHeight: "1.6", fontWeight: "700" }}>
                • <strong>계약 주체:</strong> MONO 협약 기업 및 현장 근로자 {v.maskedName}<br/>
                • <strong>근무 단가 (일당):</strong> 해당 공고에 확정된 하루 임금 (안심 에스크로 예치 보장)<br/>
                • <strong>소득세 원천징수:</strong> 세법에 의거하여 일당 총액의 3.3% 공제 후 계좌 즉시 입금<br/>
                • <strong>의무 사항:</strong> 현장 안전 규정 준수 및 필수 보호구(안전화 등) 상시 착용
              </div>
            </div>

            {/* 가상 서명란 입력 박스 */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "14px", fontWeight: "900", color: "#5b6b82", marginBottom: "8px" }}>🖋️ 서명란 (이름을 정자로 입력해주세요)</div>
              <input
                type="text"
                placeholder="예: 김민수"
                id="sign_name_input"
                style={{
                  width: "100%", height: "48px", border: "2px solid #4f46e5", borderRadius: "12px",
                  padding: "0 14px", fontSize: "16px", fontFamily: "inherit", fontWeight: "800",
                  outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" onClick={() => setOpenContractModal(false)} style={{ flex: 1, height: "50px", border: "1.5px solid #e6e8ec", borderRadius: "14px", background: "#fff", color: "#5b6b82", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>닫기</button>
              <button
                type="button"
                onClick={() => {
                  const inputVal = (document.getElementById("sign_name_input") as HTMLInputElement)?.value || "";
                  if (!inputVal.trim()) {
                    alert("서명을 위해 이름을 입력해주세요.");
                    return;
                  }
                  alert("🎉 근로계약 서명이 완료되었습니다! 이제 안전하게 출근을 진행하실 수 있습니다.");
                  setContractSigned(true);
                  localStorage.setItem("mono_contract_signed", "true");
                  setOpenContractModal(false);
                  track("contract_signed", { name_length: inputVal.length });
                }}
                style={{ flex: 1.5, height: "50px", border: "none", borderRadius: "14px", background: "#4f46e5", color: "#fff", fontSize: "15px", fontWeight: "900", cursor: "pointer", boxShadow: "0 4px 12px rgba(79,70,229,0.2)" }}
              >
                동의하고 계약 서명 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 상세 노무비 받을 금액서 및 에스크로 확인서 모달 */}
      {openSettlementInvoice && (
        <div onClick={() => setOpenSettlementInvoice(null)} style={{ position: "absolute", inset: "0", zIndex: "70", background: "rgba(20,22,48,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "24px 20px 28px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "90%", display: "flex", flexDirection: "column" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#d4dae3", margin: "0 auto 16px" }}></div>
            <div style={{ fontSize: "20px", fontWeight: "900", color: "var(--c1,#1F2226)" }}>🛡️ 상세 노무비 안심 받을 금액서</div>
            <div style={{ fontSize: "13.5px", color: "#8694a8", fontWeight: "700", marginTop: "4px", marginBottom: "16px" }}>근무에 따른 노무비 선입금 보증 상태 및 세금 공제 영수증입니다.</div>

            {/* 에스크로 예치증 확인 카드 */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: "14px", padding: "12px 14px", marginBottom: "16px" }}>
              <span style={{ fontSize: "22px" }}>🔒</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14.5px", fontWeight: "900", color: "#1e3a8a" }}>MONO 에스크로 예치증 Verified</div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#2563eb", marginTop: "2px", lineHeight: "1.4" }}>원청사가 예치한 노무비가 안전하게 플랫폼 안심금고에 잠금되어 있습니다.</div>
              </div>
            </div>

            {/* 세금 원천세 3.3% 계산 명세서 */}
            {(() => {
              // conditions 등에서 wage 액수 추출
              const rawWage = openSettlementInvoice.conditions || "일당 230,000원";
              const wageNum = parseInt(rawWage.replace(/[^0-9]/g, "")) || 230000;
              const tax = Math.floor(wageNum * 0.03);
              const localTax = Math.floor(wageNum * 0.003);
              const totalDeduction = tax + localTax;
              const netPay = wageNum - totalDeduction;

              return (
                <div style={{ border: "2px solid #e6e8ec", borderRadius: "16px", padding: "16px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "15px", fontWeight: "800", color: "#8694a8" }}>
                    <span>기본 일당 (하루 단가)</span>
                    <span style={{ color: "var(--c1,#1F2226)", fontWeight: "900" }}>{wageNum.toLocaleString()} 원</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#8694a8" }}>
                    <span>소득세 공제 (3.0%)</span>
                    <span style={{ color: "#ef4444", fontWeight: "800" }}>- {tax.toLocaleString()} 원</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px", fontWeight: "700", color: "#8694a8", borderBottom: "1.5px dashed #e2e8f0", paddingBottom: "12px" }}>
                    <span>지방소득세 (0.3%)</span>
                    <span style={{ color: "#ef4444", fontWeight: "800" }}>- {localTax.toLocaleString()} 원</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "900", color: "#10b981", paddingTop: "4px" }}>
                    <span>최종 내 계좌 입금액</span>
                    <span>{netPay.toLocaleString()} 원</span>
                  </div>
                </div>
              );
            })()}

            <button type="button" onClick={() => setOpenSettlementInvoice(null)} style={{ height: "50px", border: "none", borderRadius: "14px", background: "var(--c1,#1F2226)", color: "#fff", fontSize: "15px", fontWeight: "900", cursor: "pointer" }}>받을 금액 영수증 닫기</button>
          </div>
        </div>
      )}

      {/* 3. AI 현장 은어 번역기 모달 */}
      {aiGlossarySearch && (
        <div onClick={() => setAiGlossarySearch("")} style={{ position: "absolute", inset: "0", zIndex: "70", background: "rgba(20,22,48,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "24px 20px 28px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "90%", display: "flex", flexDirection: "column" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#d4dae3", margin: "0 auto 16px" }}></div>
            <div style={{ fontSize: "20px", fontWeight: "900", color: "var(--c1,#1F2226)" }}>🤖 MONO AI 현장 용어 번역기</div>
            <div style={{ fontSize: "13.5px", color: "#8694a8", fontWeight: "700", marginTop: "4px", marginBottom: "16px" }}>현장에서 널리 쓰이는 은어의 정확한 표준어 뜻과 안전 가이드를 제공합니다.</div>

            {(() => {
              const query = aiGlossarySearch.trim();
              let standard = "검색된 단어가 없습니다.";
              let desc = "준비 중이거나 현장에서 사용되지 않는 단어일 수 있습니다.";
              let safetyRule = "기본 안전수칙(안전모 장착, 안전화 착용)을 철저히 지키시기 바랍니다.";

              if (query.match(/데마찌|데마찌선언/)) {
                standard = "대기 / 휴업 (현장 사정으로 취소)";
                desc = "비가 오거나 현장 자재 미비 등의 이유로 오늘 일거리가 취소되어 작업을 대기하거나 집으로 철수함을 뜻합니다. 에스크로 약관에 따라 대기 수당 보장 조항을 확인하세요.";
                safetyRule = "현장에서 철수할 때에도 집결지 및 차량 탑승 시의 안전 보건 요령을 필히 준수하세요.";
              } else if (query.match(/공구리/)) {
                standard = "콘크리트 타설 작업";
                desc = "시멘트, 모래, 자갈을 섞은 콘크리트를 철근 거푸집에 붓고 메우는 작업을 일컫는 현장 외래어입니다.";
                safetyRule = "타설 시에는 튀는 시멘트 용액이 눈이나 피부에 닿지 않도록 방진 안경과 장갑, 안전화를 필수 착용하세요.";
              } else if (query.match(/덴조/)) {
                standard = "천장 마감 작업";
                desc = "천장에 석고보드나 텍스를 대고 깔끔하게 마감하는 내부 목공·인테리어 공정을 의미합니다.";
                safetyRule = "높은 곳에서 일하므로 반드시 흔들리지 않는 튼튼한 비계 발판(아시바)을 확인하고, 고소 작업용 추락방지 벨트를 결속하세요.";
              } else if (query.match(/하바키/)) {
                standard = "걸레받이 작업";
                desc = "벽면 하단 바닥과 닿는 경계부에 얇은 판이나 몰딩을 덧대어 깔끔하게 마감하는 작업입니다.";
                safetyRule = "절단기나 타카 등 뾰족하고 날카로운 도구를 사용하므로 손끼임 및 보안경 착용에 특별히 유의하세요.";
              } else if (query.match(/야리끼리/)) {
                standard = "도급/할당제 (일당 완수 퇴근)";
                desc = "오늘 해야 할 작업 분량을 지정해 두고, 이를 모두 마치면 정해진 시간 이전이라도 일찍 조기 퇴근하는 도급식 노동 형태입니다.";
                safetyRule = "빨리 끝내기 위해 급하게 서두르다 보면 심각한 안전사고(발 디딤 불량, 낙하 등)가 유발되므로, 단독 가속 작업을 절대 금합니다.";
              } else if (query.match(/단도리/)) {
                standard = "채비 / 작업 준비 상태 조율";
                desc = "작업을 원활하게 시작하기 위해 필요한 자재, 연장, 동선, 안전 조치를 미리 마련하고 정리해두는 것을 의미합니다.";
                safetyRule = "현장 출근 즉시 TBM(툴박스 미팅)에 참여하고, 오늘 해야 할 작업의 단도리가 잘 되었는지 팀장 및 반장과 소통하세요.";
              }

              return (
                <div style={{ border: "2px solid #e6e8ec", borderRadius: "16px", padding: "16px", marginBottom: "20px", background: "#f8fafc" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div>
                      <span style={{ fontSize: "12px", background: "#eef2ff", color: "#4f46e5", padding: "2px 6px", borderRadius: "4px", fontWeight: "800" }}>현장 은어</span>
                      <div style={{ fontSize: "18px", fontWeight: "900", color: "#dc2626", marginTop: "4px" }}>{query}</div>
                    </div>
                    <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "8px" }}>
                      <span style={{ fontSize: "12px", background: "#eff6ff", color: "#2563eb", padding: "2px 6px", borderRadius: "4px", fontWeight: "800" }}>표준 한글 용어</span>
                      <div style={{ fontSize: "16px", fontWeight: "900", color: "#1e3a8a", marginTop: "4px" }}>{standard}</div>
                    </div>
                    <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "8px" }}>
                      <span style={{ fontSize: "12px", background: "#ede9fe", color: "#6d28d9", padding: "2px 6px", borderRadius: "4px", fontWeight: "800" }}>세부 설명</span>
                      <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#374151", marginTop: "4px", lineHeight: "1.5" }}>{desc}</div>
                    </div>
                    <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "8px" }}>
                      <span style={{ fontSize: "12px", background: "#fef2f2", color: "#ef4444", padding: "2px 6px", borderRadius: "4px", fontWeight: "800" }}>🚨 AI 추천 안전 수칙</span>
                      <div style={{ fontSize: "13.5px", fontWeight: "800", color: "#b91c1c", marginTop: "4px", lineHeight: "1.5" }}>{safetyRule}</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <button type="button" onClick={() => setAiGlossarySearch("")} style={{ height: "50px", border: "none", borderRadius: "14px", background: "var(--c1,#1F2226)", color: "#fff", fontSize: "15px", fontWeight: "900", cursor: "pointer" }}>번역 닫기</button>
          </div>
        </div>
      )}

    </div>
    </div>
  );
}
