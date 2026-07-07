// @ts-nocheck
/* eslint-disable */
"use client";

// MONO 근로자 앱 — 프로토타입 HTML 100% 재현 (테마 기본값: MONO Tech-Blue)
// 출처: Downloads/export/MONO 근로자 앱.html 의 DC 템플릿 + 컨트롤러를 React로 포팅.
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useProfile } from "@/lib/ProfileContext";
import { JOB_TYPES, CAREER_YEARS, REGIONS, INTEREST_FEATURES, CAREER_BAND_LABEL, INDUSTRIES } from "@/lib/constants";
import { track } from "@/lib/analytics";
import { getServerId, ensureServerId, apiUpsertFieldLeaderProfile, apiGetFieldLeaderProfile, apiListEquipmentHistory, apiAddEquipmentHistory, apiDeleteEquipmentHistory, apiCreateAiLeaderInterest, apiGetTrustScore, apiGetWorkerProfile, apiGetUnreadCount, apiListNotifications, apiMarkAllRead, apiListJobPosts, apiListUserApplications, apiApplyJobPost, apiListUserAssignments, apiCheckIn, apiCheckOut, apiProposeReAttendance } from "@/lib/apiClient";
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

// 일자리 탭 — 기업이 등록한 실제 채용 공고(/api/job-posts)
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

// 출역·정산 탭 — 배정(ACCEPTED) 현장 + 출역 기록(/api/users/:id/assignments)
function fmtClock(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}`;
}

function applLabel(status: string): { t: string; bg: string; fg: string } {
  if (status === "ACCEPTED") return { t: "배정 완료", bg: "#e4f7ec", fg: "#128a4e" };
  if (status === "REJECTED") return { t: "반려", bg: "#eef0f3", fg: "#6b7787" };
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
  const [prepChecklist, setPrepChecklist] = useState({
    idCard: true,
    safetyEdu: true,
    elecCard: false,
    bankAcc: true,
    medCheck: false,
    gateCard: false,
    safetyGear: true,
  });
  const { user, updateUser, setBasicProfile, registerInterest, interests,
    addCertificate, addEducation, certificates, educations,
    careerCards, addCareerCard, completion } = useProfile(); // 온보딩 프로필 + 관심/서류 + 현장 경력 + 완성도
  const [openInterest, setOpenInterest] = useState(false); // 관심 기능 신청 시트

  // #5 신뢰 점수 (TrustScore)
  const [trustScore, setTrustScore] = useState<TrustScore | null>(null);
  const [workerProfile, setWorkerProfile] = useState<any>(null);
  
  useEffect(() => {
    const sid = getServerId();
    if (sid) {
      apiGetTrustScore("WORKER", sid).then(t => setTrustScore(t));
      apiGetWorkerProfile(sid).then(p => setWorkerProfile(p));
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
  const openJob = (i) => set({ overlay: 'job', selJob: i, applied: false });
  const closeOverlay = () => set({ overlay: null });
  const applyJob = () => set({ applied: true });
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

  // 일자리 탭 — 공고 + 내 지원 현황.
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

  // 알림센터(종+패널) — 미읽음 수 폴링, 패널 열기 시 목록 로드 + 모두 읽음, 항목 클릭 → 일자리 탭.
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
        else setTeamMsg("잠시 후 다시 시도해 주세요");
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
    const filtered = (Array.isArray(realJobs) ? realJobs : []).filter((jp) => {
      // 검색 키워드
      if (jobSearch.trim()) {
        const q = jobSearch.trim().toLowerCase();
        const haystack = [jp.title, jp.company?.name, ...(jp.region || []), ...(jp.jobType || [])].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      // 유형 필터 (오늘 현장 = period에 "일", "당일", "단기" 포함 / 대형 = "반도체","조선","플랜트","대형" 포함)
      if (jobFilterType === "today") {
        const isToday = (jp.period || "").match(/일당|당일|단기|오늘/) || (jp.conditions || "").match(/일당|당일/);
        if (!isToday) return false;
      }
      if (jobFilterType === "large") {
        const text = [jp.title, jp.conditions, jp.company?.name].join(" ");
        if (!text.match(/반도체|조선|플랜트|대형|중공업|정유|SK|삼성|현대/)) return false;
      }
      // 지역 필터
      if (jobFilterRegion && !(jp.region || []).some((r) => r.includes(jobFilterRegion))) return false;
      // 직종 필터
      if (jobFilterJobType && !(jp.jobType || []).some((t) => t.includes(jobFilterJobType))) return false;
      return true;
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
              {realJobs.length === 0 ? "아직 등록된 공고가 없어요" : "조건에 맞는 현장이 없어요"}
            </div>
            <div style={{ fontSize: "12.5px", color: "#8694a8", fontWeight: "500", marginTop: "8px", lineHeight: "1.65", wordBreak: "keep-all" }}>
              {realJobs.length === 0
                ? "협약 기업이 채용 공고를 등록하면 조건에 맞는 일자리를 여기에서 보여드려요."
                : "필터 조건을 바꾸거나 검색어를 수정해보세요."}
            </div>
            {realJobs.length > 0 && (
              <button
                onClick={() => { setJobSearch(""); setJobFilterType("all"); setJobFilterRegion(""); setJobFilterJobType(""); }}
                style={{ marginTop: "14px", height: "40px", padding: "0 18px", border: "1px solid var(--c1,#1F2226)", borderRadius: "10px", background: "#fff", color: "var(--c1,#1F2226)", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}
              >
                필터 초기화
              </button>
            )}
          </div>
        )}
        {filtered.map((jp) => {
          const isUrgent = (jp.title || "").includes("급구") || (jp.conditions || "").includes("급구");
          const isLarge = [jp.title, jp.conditions, jp.company?.name].join(" ").match(/반도체|조선|플랜트|대형|중공업|정유/);
          const isToday = (jp.period || "").match(/일당|당일|단기|오늘/);
          const alreadyApplied = appliedJobs.has(jp.id);
          return (
            <div
              key={jp.id}
              onClick={() => setJobDetail(jp)}
              style={{
                background: "#fff",
                border: "1px solid #e6e8ec",
                borderRadius: "20px",
                padding: "17px",
                marginBottom: "13px",
                boxShadow: "0 4px 14px -8px rgba(0,0,0,0.08)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* 상단 배지 행 */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                {isUrgent && (
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#fff", background: "#ef4444", padding: "3px 9px", borderRadius: "8px" }}>🔥 급구</span>
                )}
                {isLarge && !isUrgent && (
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#0d9488", background: "#ccfbf1", padding: "3px 9px", borderRadius: "8px" }}>🏗 대형 현장</span>
                )}
                {isToday && !isUrgent && (
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#7c3aed", background: "#ede9fe", padding: "3px 9px", borderRadius: "8px" }}>⚡ 오늘 현장</span>
                )}
                {(jp.jobType || []).map((t) => (
                  <span key={t} style={{ fontSize: "11px", fontWeight: "700", color: "var(--c1,#1F2226)", background: "var(--soft,#E5E7EB)", padding: "3px 9px", borderRadius: "8px" }}>{t}</span>
                ))}
                {jp.headcount && (
                  <span style={{ marginLeft: "auto", fontSize: "11px", fontWeight: "700", color: "#5b6b82" }}>모집 {jp.headcount}명</span>
                )}
              </div>

              {/* 공고 제목 */}
              <div style={{ fontSize: "16.5px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>{jp.title}</div>
              <div style={{ fontSize: "12.5px", color: "#8694a8", fontWeight: "600", marginTop: "4px" }}>
                {jp.company ? jp.company.name : "협약 기업"}
                {jp.region?.length ? " · " + jp.region.join(", ") : ""}
              </div>

              {/* 세부 정보 행 */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: "10px", padding: "10px 0", borderTop: "1px solid #f1f5f9" }}>
                {jp.period && (
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontSize: "11px", color: "#a0aec0" }}>⏱</span>
                    <span style={{ fontSize: "12.5px", color: "#374151", fontWeight: "600" }}>{jp.period}</span>
                  </div>
                )}
                {jp.careerBand && (
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontSize: "11px", color: "#a0aec0" }}>🏅</span>
                    <span style={{ fontSize: "12.5px", color: "#374151", fontWeight: "600" }}>경력 {CAREER_BAND_LABEL[jp.careerBand] || jp.careerBand} 이상</span>
                  </div>
                )}
                {jp.conditions && (
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontSize: "11px", color: "#a0aec0" }}>💰</span>
                    <span style={{ fontSize: "12.5px", color: "#10b981", fontWeight: "700" }}>{jp.conditions}</span>
                  </div>
                )}
              </div>

              {/* 자격증 우대 */}
              {(jp.certs && jp.certs.length > 0) && (
                <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {jp.certs.map((c) => (
                    <span key={c} style={{ fontSize: "11px", fontWeight: "600", color: "#7c3aed", background: "#ede9fe", padding: "3px 8px", borderRadius: "7px" }}>{c} 우대</span>
                  ))}
                </div>
              )}

              {/* 하단 CTA 행 */}
              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                <div style={{ flex: 1, fontSize: "12px", color: "#4f46e5", fontWeight: "700", display: "flex", alignItems: "center" }}>상세 보기 →</div>
                <button
                  onClick={(e) => { e.stopPropagation(); applyToJob(jp.id); }}
                  disabled={alreadyApplied}
                  style={{
                    height: "40px",
                    padding: "0 20px",
                    border: "none",
                    borderRadius: "12px",
                    background: alreadyApplied ? "var(--soft,#E5E7EB)" : "var(--c1,#1F2226)",
                    color: alreadyApplied ? "var(--c1,#1F2226)" : "#fff",
                    fontSize: "13.5px",
                    fontWeight: "800",
                    fontFamily: "inherit",
                    cursor: alreadyApplied ? "default" : "pointer",
                  }}
                >
                  {alreadyApplied ? "지원함 ✓" : "바로 지원"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
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
    if (s.tab !== "jobs" || jobsLoadedRef.current) return;
    jobsLoadedRef.current = true;
    apiListJobPosts({ limit: 60 }).then((d) => setRealJobs(d || []));
    loadMyApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.tab]);

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

  // 출역·정산 탭 — 배정(ACCEPTED) 현장 + 출근/퇴근 체크.
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
  // ── 출역 역류 루프 (재출역 제안) UI 상태 ──
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

    // 온보딩 데이터 → 경력카드 표시값(없으면 데모 폴백)
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
    const labels=['지원 완료','기업 확인 중','출역 확정','출근 대기','출근 완료','퇴근 완료','근무 확정','정산 예정','정산 완료'];
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
      mk('형틀목공','힐스테이트 송도 더스카이','인천 연수구','4.2km','6/19','230,000','숙식 제공','4.9','형틀목공 5년+ 경력과 갱폼·알폼 보유 기술이 현장 요구 조건과 정확히 일치합니다. 출역 신뢰도 98.5%로 우선 추천.',{instant:true,safety:true,company:'대주건설(주)',people:'12명',hours:'07:00–17:00',settleWay:'주급 · 에스크로 안전정산',prepare:'안전화·안전모(현장 지급), 신분증',risk:'보통 · 고소작업 일부 포함',manager:'현장소장 박정호',grad:'var(--c3,#1F2226)',month:'6월'}),
      mk('철근공','래미안 원베일리','서울 서초구','11.8km','6/20','245,000','숙식 미제공','4.7','선호 근무지(서울)와 평점 4.8, 최근 12개월 무결근 이력이 반영되었습니다.',{company:'삼성물산 협력 · 동성건설',people:'8명',hours:'07:00–16:30',settleWay:'월급 · 계좌이체',prepare:'개인 공구, 안전화',risk:'낮음',manager:'노무담당 김선영',grad:'var(--c1,#1F2226)'}),
      mk('형틀목공','자이 평택고덕 4단지','경기 평택','38km','6/21','225,000','숙식 제공','4.6','보유 자격증(비계기능사)과 갱폼 시공 경험이 매칭되었습니다. 숙식 제공으로 원거리 출역 가능.',{instant:true,company:'GS건설 협력 · 한울ENG',people:'20명',hours:'06:30–16:30',settleWay:'주급 · 에스크로 안전정산',prepare:'안전장구 일체 지급',risk:'보통',manager:'반장 이강우',grad:'var(--c1,#1F2226)'})
    ];
    jobs.forEach((j,i)=>{ j.onOpen=()=>openJob(i); });
    const homeJobs=[
      {trade:'형틀목공',dist:'4.2km',pay:'230,000',name:'힐스테이트 송도 더스카이',loc:'인천 연수구',date:'6/19',stay:'숙식 제공',onOpen:()=>openJob(0)},
      {trade:'철근공',dist:'11.8km',pay:'245,000',name:'래미안 원베일리',loc:'서울 서초구',date:'6/20',stay:'숙식 미제공',onOpen:()=>openJob(1)}
    ];
    const job=jobs[s.selJob]||jobs[0];

    const chipDefs=['전체','형틀목공','철근공','콘크리트','서울/경기','즉시 출역'];
    const chips=chipDefs.map((label,i)=>({ label, bg:i===0?green:'#fff', fg:i===0?'#fff':'#5b6b82', bd:i===0?green:'#e6e8ec' }));

    const history=[
      {name:'더샵 일산 센트럴',date:'2026.05',days:'21일',amount:'4,830,000'},
      {name:'푸르지오 김포한강',date:'2026.04',days:'19일',amount:'4,275,000'}
    ];

    // modals
    const M={
      career:{ title:'경력 자동 확인', status:'구현 예정', body:'건설근로자공제회 퇴직공제 가입 이력과 연계하여 근무 경력을 자동 검증하는 기능입니다. 실제 서비스에서는 기관 인증 데이터 기반으로 경력이 자동 확인됩니다.', note:'건설근로자공제회 데이터 연동 협의·API 준비 중' },
      safety:{ title:'안전교육 자동 검증', status:'구현 예정', body:'안전보건공단의 기초안전보건교육 이수 정보와 연동하여 현장별 필수 교육 이수 여부를 자동 확인합니다. 현재는 근로자 제출 자료 기반으로 운영됩니다.', note:'안전보건공단 데이터 연동 협의 중' },
      finance:{ title:'금융 자산화 연계', status:'구현 예정', body:'축적된 근무 이력·정산 데이터와 기술 신뢰도 점수를 기반으로 신용평가사·카드사와 연계한 대안 신용평가 및 금융 상품을 준비하고 있습니다.', note:'신용평가사·카드사 제휴 및 모델 개발 준비 중' },
      escrow:{ title:'에스크로 안전정산', status:'구현 예정', body:'기업이 예치한 정산금을 근무 확정 시 안전하게 지급하는 구조입니다. 지급 PG·오픈뱅킹 연동을 통해 정산 누락과 임금 체불 위험을 줄입니다.', note:'지급 PG·오픈뱅킹 연동 준비 중' },
      share:{ title:'경력카드 공유', status:'사용 가능', body:'공개용 경력카드 링크와 QR을 생성하여 기업에 제출할 수 있습니다. 주민번호·계좌·상세 정산액은 자동으로 마스킹되며, 열람 로그가 기록됩니다.', note:'외부 링크는 7일 후 자동 만료됩니다' },
      scope:{ title:'공개 범위 설정', status:'사용 가능', body:'기업 또는 외부인이 경력카드를 열람할 때 공개할 항목을 직접 선택합니다. 이름 마스킹, 정산액 비공개, 상세 평가 비공개 등을 항목별로 제어할 수 있습니다.', note:'기본값: 이름 일부 마스킹 · 상세 정산액 비공개' },
      detailReq:{ title:'상세보기 요청 흐름', status:'사용 가능', body:'기업이 상세보기를 요청하면 ① 근로자에게 알림이 발송되고 ② 근로자가 공개 범위를 선택한 뒤 ③ 기업에게 제한된 상세 정보가 공개됩니다. 모든 열람 내역은 로그로 저장됩니다.', note:'열람 로그 저장 · 공개 범위는 언제든 회수 가능' },
      office:{ title:'오프라인 인력사무소 연동', status:'구현 예정', body:'기존 인력사무소의 출역부·배정표·전화 확인·정산 업무를 디지털화하는 기능입니다. 제휴 사무소 모집, 현장 배정 표준화, 수수료 정책, 개인정보 처리 동의 체계를 준비 중입니다.', note:'제휴 인력사무소 모집 및 배정 프로세스 표준화 진행 중' },
      attend:{ title:'출근·퇴근 체크', status:'구현 예정', body:'현장 도착·퇴근 시 GPS·QR로 출퇴근을 기록하고 출역 내역을 자동 정리하는 기능입니다. 기업 배정·정산과 연동됩니다.', note:'현장 출입 연동 및 위치 인증 방식 설계 중' },
      apply:{ title:'출역 신청', status:'구현 예정', body:'공고에 출역을 신청하면 기업이 확인 후 배정하는 기능입니다. 배정 결과는 알림으로 안내됩니다.', note:'기업 배정·승인 흐름 연동 준비 중' }
    };
    const m=s.modal?M[s.modal]:null;

    const meRows=[
      {label:'내 현장 프로필 (이력서)',tag:'완료',tagColor:'var(--c3,#1F2226)',icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 20 20',fill:'none'},React.createElement('circle',{cx:10,cy:7,r:3,stroke:'var(--c1,#1F2226)',strokeWidth:1.7}),React.createElement('path',{d:'M4 17c0-3 2.7-4.5 6-4.5s6 1.5 6 4.5',stroke:'var(--c1,#1F2226)',strokeWidth:1.7,strokeLinecap:'round'})),onClick:()=>openEdit()},
      {label:'준비 서류 (문서)',tag:(certificates.length+educations.length)?(certificates.length+educations.length)+'건':'',tagColor:'#8694a8',icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 20 20',fill:'none'},React.createElement('path',{d:'M5 2.5h7L16 6v11.5H5V2.5Z',stroke:'var(--c1,#1F2226)',strokeWidth:1.7,strokeLinejoin:'round'}),React.createElement('path',{d:'M12 2.5V6h4',stroke:'var(--c1,#1F2226)',strokeWidth:1.7,strokeLinejoin:'round'})),onClick:()=>setOpenDocs(true)},
      {label:'일한 기록 (출역내역)',tag:history.length?history.length+'건':'',tagColor:'#8694a8',icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 20 20',fill:'none'},React.createElement('path',{d:'M3 17h14M5 17V8l5-3.5L15 8v9M8.5 17v-4h3v4',stroke:'var(--c1,#1F2226)',strokeWidth:1.7,strokeLinejoin:'round'})),onClick:()=>setTab('work')},
      {label:'받을 금액 (정산)',tag:'조회',tagColor:'#8694a8',icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 20 20',fill:'none'},React.createElement('rect',{x:3,y:5,width:14,height:11,rx:2,stroke:'var(--c1,#1F2226)',strokeWidth:1.7},React.createElement('path',{d:'M3 9h14',stroke:'var(--a1,#1F2226)',strokeWidth:1.7}))),onClick:()=>setTab('work')}
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

      // job detail overlay
      overlayJob:s.overlay==='job',
      closeOverlay:()=>closeOverlay(),
      job,
      applied:s.applied,
      applyJob:()=>open('apply'),
      applyLabel: s.applied?'출역 신청 완료 · 기업 확인 중':'출역 신청',
      applyBg: s.applied?'var(--soft,#E5E7EB)':'var(--c1,#1F2226)',
      applyFg: s.applied?'var(--c3,#1F2226)':'#fff',

      // permission-based card view
      publicRows:[
        {k:'안전교육 이수', v:'이수 완료 (100%)'},
        {k:'자격증 보유', v:'비계기능사 외 2'},
        {k:'최근 현장 유형', v:'아파트 · 주상복합'},
        {k:'참여 현장', v:'37곳'},
        {k:'무결근 기간', v:'최근 12개월'}
      ],
      privateRows:['주민등록번호','계좌 정보','상세 정산액','연락처','상세 평가 코멘트'],
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
        <div className="mono-sidebar-foot">현장 인력 데이터 인프라</div>
      </aside>
<div className="mono-frame scr">

      
      {/* 실기기 노치/상태바 영역(safe-area)만큼만 비워두는 상단 스페이서. 데스크톱 폰 프레임에선 env()=0이라 최소 여백만 남음. */}
      <div style={{ height: "calc(env(safe-area-inset-top, 0px) + 14px)", flex: "none" }}></div>

      
      <div key={s.tab} className="scr" style={{ flex: "1", overflowY: "auto", overflowX: "hidden", position: "relative", animation: "tabIn .26s ease both" }}>

        
        {(v.isHome) && (<>
        <div style={{ padding: "6px 20px 30px" }}>
          {/* Welcome Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0 16px", gap: "12px" }}>
            <div style={{ minWidth: "0" }}>
              <div style={{ fontSize: "14px", color: "#8694a8", fontWeight: "600" }}>내게 맞는 현장을 쉽게 찾고,</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--c1,#1F2226)", marginTop: "3px", lineHeight: "1.45" }}>
                필요한 준비는 <span style={{ color: "var(--c1,#1F2226)", borderBottom: "2.5px solid var(--c1,#1F2226)" }}>MONO</span>가 함께 정리해드릴게요.
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "none" }}>
              <button type="button" onClick={openNotifs} aria-label="알림" style={{ position: "relative", width: "44px", height: "44px", border: "1px solid #e6e8ec", borderRadius: "14px", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "0" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3a4 4 0 0 0-4 4v3l-1.5 2.5h11L14 10V7a4 4 0 0 0-4-4Z" stroke="var(--c1,#1F2226)" strokeWidth="1.6" strokeLinejoin="round"></path><path d="M8.5 15a1.5 1.5 0 0 0 3 0" stroke="var(--c1,#1F2226)" strokeWidth="1.6" strokeLinecap="round"></path></svg>
                {unread > 0 && (<span style={{ position: "absolute", top: "-5px", right: "-5px", minWidth: "18px", height: "18px", padding: "0 5px", borderRadius: "9px", background: "#d9534f", color: "#fff", fontSize: "10.5px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--bg,#f5f6fb)", boxSizing: "border-box" }}>{unread > 99 ? "99+" : unread}</span>)}
              </button>
              <div onClick={v.goMe} style={{ position: "relative", width: "48px", height: "48px", flex: "none", cursor: "pointer" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "16px", background: "var(--c3,#1F2226)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "800", fontSize: "17px", boxShadow: "0 6px 16px -4px color-mix(in srgb, var(--brand,#1F2226) 50%, transparent), inset 0 0 0 1.5px color-mix(in srgb, var(--brand,#1F2226) 45%, transparent)" }}>{v.initial}</div>
              </div>
            </div>
          </div>

          {/* Active Attendance Badge/Card (if checked-in) */}
          {s.checkedIn && (
            <div style={{ borderRadius: "20px", background: "var(--c1,#1F2226)", padding: "16px", color: "var(--t0,#E5E7EB)", position: "relative", overflow: "hidden", marginBottom: "16px", boxShadow: "0 10px 24px -10px color-mix(in srgb, var(--brand,#1F2226) 80%, transparent)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#5fd1a0", boxShadow: "0 0 0 4px rgba(95,209,160,.25)" }}></span>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--t1,#A5AEB8)", letterSpacing: ".3px" }}>현재 출근 중 · 힐스테이트 송도 더스카이</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                <span style={{ fontSize: "14px", fontWeight: "700" }}>오늘 근무: {v.myJob}</span>
                <button onClick={v.toggleCheck} style={{ height: "36px", padding: "0 14px", border: "none", borderRadius: "10px", background: "rgba(255,255,255,.14)", color: "#fff", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>퇴근하기</button>
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
            const pendingApps = myApps.filter((a) => a.status === "PENDING" || a.status === "REVIEWING");
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
            if (todayItems.length === 0) {
              todayItems.push({ icon: "✅", tag: "[완료]", tagColor: "#10b981", text: "오늘 할 일이 없어요. 편안한 하루 되세요! 🎉" });
            }
            return (
              <div style={{ background: "#ffffff", border: "1px solid #e6e8ec", borderRadius: "20px", padding: "18px", marginBottom: "16px", boxShadow: "0 4px 14px -10px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)", marginBottom: "12px" }}>🗓️ 오늘 할 일</div>
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
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>
                        <span style={{ color: item.tagColor, fontWeight: "800" }}>{item.tag} </span>
                        {item.text}
                      </div>
                      {item.onClick && <span style={{ marginLeft: "auto", fontSize: "11px", color: "#a0aec0" }}>›</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* 가이드 카드 섹션 - 홈 상단 배치 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "4px", marginBottom: "16px" }}>
            <div
              onClick={() => setActiveGuide('first')}
              style={{
                background: "#f8fafc", border: "1px solid #e6e8ec", borderRadius: "16px",
                padding: "14px 12px", cursor: "pointer", transition: "transform 0.15s"
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#4f46e5", marginBottom: "4px" }}>처음 현장 가이드</div>
              <div style={{ fontSize: "11.5px", color: "#64748b", lineHeight: "1.4", fontWeight: "500", wordBreak: "keep-all" }}>
                현장 일이 처음이라면 준비물부터 확인해보세요.
              </div>
            </div>
            <div
              onClick={() => setActiveGuide('large')}
              style={{
                background: "#f0fdfa", border: "1px solid #ccfbf1", borderRadius: "16px",
                padding: "14px 12px", cursor: "pointer", transition: "transform 0.15s"
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#0d9488", marginBottom: "4px" }}>대형 현장 가이드</div>
              <div style={{ fontSize: "11.5px", color: "#0f766e", lineHeight: "1.4", fontWeight: "500", wordBreak: "keep-all" }}>
                전자카드, 교육, 신체검사, 출입카드까지 순서대로 준비해요.
              </div>
            </div>
          </div>

          {/* 준비 상태 요약 */}
          <div style={{ background: "#ffffff", border: "1px solid #e6e8ec", borderRadius: "20px", padding: "18px", marginBottom: "16px", boxShadow: "0 4px 14px -10px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>🚦 내 현장 준비 상태 요약</span>
              <span onClick={() => setTab('me')} style={{ fontSize: "12.5px", color: "#4f46e5", fontWeight: "700", cursor: "pointer" }}>상세보기 →</span>
            </div>
            
            {(() => {
              const checkedCount = Object.values(prepChecklist).filter(Boolean).length;
              const totalCount = Object.keys(prepChecklist).length;
              const percent = Math.round((checkedCount / totalCount) * 100);
              return (
                <>
                  <div style={{ fontSize: "12.5px", color: "#5b6b82", fontWeight: "600", marginBottom: "6px" }}>
                    총 {totalCount}개 중 <strong>{checkedCount}개</strong> 준비 완료 ({percent}%)
                  </div>
                  <div style={{ height: "6px", background: "#eef0f3", borderRadius: "3px", overflow: "hidden", marginBottom: "14px" }}>
                    <div style={{ width: `${percent}%`, height: "100%", background: "#10b981", borderRadius: "3px", transition: "width 0.3s ease" }}></div>
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
                { key: 'safetyGear', label: '안전장구' },
              ].map((item) => {
                const isReady = prepChecklist[item.key];
                return (
                  <div
                    key={item.key}
                    style={{
                      padding: "8px 4px", borderRadius: "10px", textAlign: "center",
                      background: isReady ? "#f0fdf4" : "#fef2f2",
                      border: `1px solid ${isReady ? "#bbf7d0" : "#fecaca"}`
                    }}
                  >
                    <div style={{ fontSize: "10.5px", fontWeight: "800", color: isReady ? "#15803d" : "#b91c1c" }}>{item.label}</div>
                    <div style={{ fontSize: "12px", marginTop: "2px", color: isReady ? "#16a34a" : "#dc2626" }}>{isReady ? "✓" : "⚠"}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 오늘 현장 / 대형 현장 탭 스위처 */}
          <div style={{ display: "flex", gap: "10px", marginTop: "8px", marginBottom: "16px" }}>
            <button
              type="button"
              onClick={() => setHomeTab('today')}
              style={{
                flex: 1, height: "46px", borderRadius: "13px", fontSize: "15px", fontWeight: "800",
                cursor: "pointer", transition: "all 0.15s",
                background: homeTab === 'today' ? "var(--c1,#1F2226)" : "#ffffff",
                color: homeTab === 'today' ? "#ffffff" : "#64748b",
                border: `1.5px solid ${homeTab === 'today' ? "transparent" : "#e6e8ec"}`
              }}
            >
              오늘 현장
            </button>
            <button
              type="button"
              onClick={() => setHomeTab('large')}
              style={{
                flex: 1, height: "46px", borderRadius: "13px", fontSize: "15px", fontWeight: "800",
                cursor: "pointer", transition: "all 0.15s",
                background: homeTab === 'large' ? "var(--c1,#1F2226)" : "#ffffff",
                color: homeTab === 'large' ? "#ffffff" : "#64748b",
                border: `1.5px solid ${homeTab === 'large' ? "transparent" : "#e6e8ec"}`
              }}
            >
              대형 현장
            </button>
          </div>

          {/* 탭 본문 내용 — 실 API 데이터 기반 */}
          {homeTab === 'today' ? (
            <div style={{ animation: "fadeIn 0.2s ease" }}>
              <div style={{ fontSize: "13.5px", color: "#5b6b82", lineHeight: "1.6", marginBottom: "16px", fontWeight: "600", wordBreak: "keep-all" }}>
                오늘 또는 이번 주에 바로 일할 수 있는 단기 현장을 찾아보세요.
              </div>

              {/* 오늘 현장 카드 목록 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {(() => {
                  if (realJobs === null) return <div style={{ padding: "34px 0", textAlign: "center", color: "#8694a8", fontSize: "13px", fontWeight: "600" }}>공고를 불러오는 중…</div>;
                  const todayJobs = realJobs.filter((jp) =>
                    (jp.period || "").match(/일당|당일|단기|오늘/)
                  ).slice(0, 3);
                  if (todayJobs.length === 0) return (
                    <div style={{ background: "#f8fafc", border: "1px dashed #e2e8f0", borderRadius: "20px", padding: "34px", textAlign: "center" }}>
                      <div style={{ fontSize: "28px", marginBottom: "8px" }}>⚡</div>
                      <div style={{ fontSize: "14px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>오늘 현장 공고가 없습니다</div>
                      <div style={{ fontSize: "12px", color: "#8694a8", marginTop: "6px" }}>현장 찾기 탭에서 더 많은 공고를 찾아보세요.</div>
                    </div>
                  );
                  return todayJobs.map((jp) => (
                    <div
                      key={jp.id}
                      onClick={() => openJob(realJobs.indexOf(jp))}
                      style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "20px", padding: "18px", boxShadow: "0 4px 14px -10px rgba(0,0,0,0.05)", cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: "#4f46e5", background: "#eeebff", padding: "3px 8px", borderRadius: "6px" }}>⚡ 오늘 현장</span>
                        <span style={{ fontSize: "16px", fontWeight: "900", color: "#4f46e5" }}>{jp.conditions || "조건협의"}</span>
                      </div>
                      <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>{jp.title}</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "13px", color: "#5b6b82", borderTop: "1px solid #f1f5f9", paddingTop: "10px", marginTop: "10px" }}>
                        <div>📍 <strong>위치:</strong> {jp.region?.join(", ") || "전국"}</div>
                        <div>👷 <strong>직무:</strong> {jp.jobType?.join(", ") || "일반노무"}</div>
                        <div>⏰ <strong>출근:</strong> 오전 07:00</div>
                        <div>🎒 <strong>준비물:</strong> 신분증, 안전화</div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); openJob(realJobs.indexOf(jp)); }} style={{ marginTop: "14px", width: "100%", height: "42px", border: "none", borderRadius: "10px", background: "var(--c1,#1F2226)", color: "#fff", fontSize: "13.5px", fontWeight: "800", cursor: "pointer" }}>상세 정보 & 지원</button>
                    </div>
                  ));
                })()}
              </div>
            </div>
          ) : (
            <div style={{ animation: "fadeIn 0.2s ease" }}>
              <div style={{ fontSize: "13.5px", color: "#5b6b82", lineHeight: "1.6", marginBottom: "16px", fontWeight: "600", wordBreak: "keep-all" }}>
                반도체, 조선, 플랜트처럼 안정적인 대형 현장을 모아왔어요.
              </div>

              {/* 대형 현장 카드 목록 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {(() => {
                  if (realJobs === null) return <div style={{ padding: "34px 0", textAlign: "center", color: "#8694a8", fontSize: "13px", fontWeight: "600" }}>공고를 불러오는 중…</div>;
                  const largeJobs = realJobs.filter((jp) =>
                    [jp.title, jp.conditions, jp.company?.name].join(" ").match(/반도체|조선|플랜트|대형|중공업|정유|SK|삼성|현대/)
                  ).slice(0, 3);
                  if (largeJobs.length === 0) return (
                    <div style={{ background: "#f0fdfa", border: "1px dashed #99f6e4", borderRadius: "20px", padding: "34px", textAlign: "center" }}>
                      <div style={{ fontSize: "28px", marginBottom: "8px" }}>🏗️</div>
                      <div style={{ fontSize: "14px", fontWeight: "800", color: "#0d9488" }}>대형 현장 공고가 없습니다</div>
                    </div>
                  );
                  return largeJobs.map((jp) => (
                    <div
                      key={jp.id}
                      onClick={() => openJob(realJobs.indexOf(jp))}
                      style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "20px", padding: "18px", boxShadow: "0 4px 14px -10px rgba(0,0,0,0.05)", cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: "#0d9488", background: "#f0fdfa", padding: "3px 8px", borderRadius: "6px" }}>🏗️ 대형 현장</span>
                        <span style={{ fontSize: "14px", fontWeight: "800", color: "#0d9488" }}>{jp.conditions || "조건협의"}</span>
                      </div>
                      <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>{jp.title}</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "13px", color: "#5b6b82", borderTop: "1px solid #f1f5f9", paddingTop: "10px", marginTop: "10px" }}>
                        <div>📍 <strong>위치:</strong> {jp.region?.join(", ") || "전국"}</div>
                        <div>👷 <strong>직무:</strong> {jp.jobType?.join(", ") || "일반노무"}</div>
                        <div>📄 <strong>필요서류:</strong> 기초교육이수증 등</div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); openJob(realJobs.indexOf(jp)); }} style={{ marginTop: "14px", width: "100%", height: "42px", border: "none", borderRadius: "10px", background: "var(--c1,#1F2226)", color: "#fff", fontSize: "13.5px", fontWeight: "800", cursor: "pointer" }}>상세 정보 & 지원</button>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* 이번 주 추천 현장 */}
          <div style={{ marginTop: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>✨ 이번 주 추천 현장</span>
              <span onClick={() => setTab('jobs')} style={{ fontSize: "12.5px", color: "var(--c1,#1F2226)", fontWeight: "700", cursor: "pointer" }}>더 보기</span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div
                onClick={() => { openJob(0); }}
                style={{
                  background: "#fff", border: "1px solid #e6e8ec", borderRadius: "18px",
                  padding: "16px", cursor: "pointer", boxShadow: "0 4px 14px -10px rgba(0,0,0,0.05)",
                  transition: "all 0.15s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#4f46e5", background: "#eeebff", padding: "3px 8px", borderRadius: "6px" }}>98.5% 매칭</span>
                  <span className="mono" style={{ fontSize: "16px", fontWeight: "700", color: "var(--c1,#1F2226)" }}>₩230,000</span>
                </div>
                <h4 style={{ margin: "6px 0 4px", fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>힐스테이트 송도 더스카이</h4>
                <p style={{ margin: 0, fontSize: "12.5px", color: "#8694a8", fontWeight: "500" }}>인천 연수구 · 형틀목공 · 숙식제공</p>
                <div style={{ fontSize: "12px", color: "#4f46e5", fontWeight: "700", marginTop: "8px", background: "#f5f3ff", padding: "6px 10px", borderRadius: "8px" }}>
                  💡 회원님의 형틀목공 경력과 정확히 일치하여 추천해요.
                </div>
              </div>

              <div
                onClick={() => { openJob(2); }}
                style={{
                  background: "#fff", border: "1px solid #e6e8ec", borderRadius: "18px",
                  padding: "16px", cursor: "pointer", boxShadow: "0 4px 14px -10px rgba(0,0,0,0.05)",
                  transition: "all 0.15s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#0d9488", background: "#f0fdfa", padding: "3px 8px", borderRadius: "6px" }}>95% 매칭</span>
                  <span className="mono" style={{ fontSize: "16px", fontWeight: "700", color: "var(--c1,#1F2226)" }}>₩225,000</span>
                </div>
                <h4 style={{ margin: "6px 0 4px", fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>자이 평택고덕 4단지</h4>
                <p style={{ margin: 0, fontSize: "12.5px", color: "#8694a8", fontWeight: "500" }}>경기 평택 · 형틀목공 · 숙식제공</p>
                <div style={{ fontSize: "12px", color: "#0d9488", fontWeight: "700", marginTop: "8px", background: "#f0fdfa", padding: "6px 10px", borderRadius: "8px" }}>
                  💡 비계기능사 자격증과 갱폼 시공 경험이 매칭되었습니다.
                </div>
              </div>
            </div>
          </div>

          {/* AI 맞춤형 안내 */}
          {insights.length > 0 && (
            <div style={{ marginTop: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>AI 맞춤형 안내</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {insights.map((insight, idx) => (
                  <div key={idx} style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "20px", padding: "18px", cursor: "pointer", boxShadow: "0 4px 14px -10px color-mix(in srgb, var(--brand-deep,#0B0C10) 15%, transparent)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "800", color: "var(--c1,#1F2226)", background: "var(--soft,#E5E7EB)", padding: "3px 9px", borderRadius: "8px" }}>{insight.type === "URGENT_JOB" ? "긴급 일자리" : insight.type === "WEATHER_INFO" ? "날씨 안내" : "현장 소식"}</span>
                      <span style={{ fontSize: "14.5px", fontWeight: "800", color: "#111" }}>{insight.title}</span>
                    </div>
                    <div style={{ fontSize: "13px", color: "#5b6b82", lineHeight: "1.5", marginBottom: "14px", fontWeight: "500", wordBreak: "keep-all" }}>
                      {insight.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* AI 현장 가이드 카드 */}
          <div style={{ background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: "20px", padding: "18px", marginTop: "16px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "24px" }}>🤖</span>
              <div>
                <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#312e81" }}>처음 보는 현장 용어가 있나요?</h4>
                <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "#4f46e5", fontWeight: "600", lineHeight: "1.4" }}>
                  야리끼리, 데마찌, 단도리... 현장 은어나 용어의 뜻을 AI 가이드가 알기 쉽게 설명해드려요.
                </p>
              </div>
            </div>
            <button
              onClick={() => setGlossaryOpen(true)}
              style={{
                marginTop: "12px",
                width: "100%",
                height: "44px",
                border: "none",
                borderRadius: "12px",
                background: "#4f46e5",
                color: "#fff",
                fontSize: "13.5px",
                fontWeight: "800",
                cursor: "pointer"
              }}
            >
              현장 용어 물어보기
            </button>
          </div>

        </div>
        </>)}

        {(v.isJobs) && (<>
        <div style={{ padding: "6px 0 30px" }}>
          <div style={{ padding: "8px 20px 2px" }}>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>현장 찾기</div>
          </div>

          {/* 검색바 */}
          <div style={{ padding: "10px 20px 0" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none" }}>🔍</span>
              <input
                type="text"
                placeholder="현장명, 직종, 지역 검색"
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                style={{
                  width: "100%",
                  height: "46px",
                  paddingLeft: "42px",
                  paddingRight: "14px",
                  border: "1.5px solid #e6e8ec",
                  borderRadius: "14px",
                  background: "#fff",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  fontWeight: "500",
                  color: "var(--c1,#1F2226)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* 유형 필터 칩 */}
          <div style={{ padding: "10px 20px 0", display: "flex", gap: "8px", overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
            {([
              { key: "all", label: "전체" },
              { key: "today", label: "⚡ 오늘 현장" },
              { key: "large", label: "🏗 대형 현장" },
            ] as const).map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setJobFilterType(f.key)}
                style={{
                  flex: "none",
                  height: "34px",
                  padding: "0 14px",
                  border: "none",
                  borderRadius: "999px",
                  fontSize: "12.5px",
                  fontWeight: "700",
                  cursor: "pointer",
                  background: jobFilterType === f.key ? "var(--c1,#1F2226)" : "#f1f3f7",
                  color: jobFilterType === f.key ? "#fff" : "#5b6b82",
                  whiteSpace: "nowrap",
                }}
              >
                {f.label}
              </button>
            ))}
            <div style={{ width: "1px", background: "#e6e8ec", margin: "0 2px" }} />
            {["서울", "경기", "인천", "평택", "울산", "거제"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setJobFilterRegion(jobFilterRegion === r ? "" : r)}
                style={{
                  flex: "none",
                  height: "34px",
                  padding: "0 12px",
                  border: "none",
                  borderRadius: "999px",
                  fontSize: "12.5px",
                  fontWeight: "700",
                  cursor: "pointer",
                  background: jobFilterRegion === r ? "#4f46e5" : "#f1f3f7",
                  color: jobFilterRegion === r ? "#fff" : "#5b6b82",
                  whiteSpace: "nowrap",
                }}
              >
                {r}
              </button>
            ))}
          </div>

          {/* 직종 필터 칩 */}
          <div style={{ padding: "6px 20px 0", display: "flex", gap: "6px", overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
            {["형틀목공", "철근", "배관", "전기", "용접", "비계", "도장", "화재감시"].map((jt) => (
              <button
                key={jt}
                type="button"
                onClick={() => setJobFilterJobType(jobFilterJobType === jt ? "" : jt)}
                style={{
                  flex: "none",
                  height: "30px",
                  padding: "0 11px",
                  border: `1.5px solid ${jobFilterJobType === jt ? "#10b981" : "#e6e8ec"}`,
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  background: jobFilterJobType === jt ? "#ecfdf5" : "#fff",
                  color: jobFilterJobType === jt ? "#10b981" : "#5b6b82",
                  whiteSpace: "nowrap",
                }}
              >
                {jt}
              </button>
            ))}
          </div>

          {/* 결과 수 + 페인 탭 */}
          <div style={{ padding: "8px 20px 0", display: "flex", alignItems: "center", gap: "20px", borderBottom: "1px solid var(--soft,#E5E7EB)", marginTop: "6px" }}>
            <button type="button" onClick={() => setJobsPane("nearby")} style={{ border: "none", background: "none", padding: "8px 0", marginBottom: "-1px", fontSize: "16px", fontFamily: "inherit", cursor: "pointer", fontWeight: jobsPane === "nearby" ? "800" : "700", color: jobsPane === "nearby" ? "var(--c1,#1F2226)" : "#8694a8", borderBottom: jobsPane === "nearby" ? "2.5px solid var(--c1,#1F2226)" : "2.5px solid transparent", WebkitTapHighlightColor: "transparent" }}>내 위치 주변</button>
            <button type="button" onClick={() => setJobsPane("posts")} style={{ border: "none", background: "none", padding: "8px 0", marginBottom: "-1px", fontSize: "16px", fontFamily: "inherit", cursor: "pointer", fontWeight: jobsPane === "posts" ? "800" : "700", color: jobsPane === "posts" ? "var(--c1,#1F2226)" : "#8694a8", borderBottom: jobsPane === "posts" ? "2.5px solid var(--c1,#1F2226)" : "2.5px solid transparent", WebkitTapHighlightColor: "transparent" }}>채용공고</button>
            {realJobs !== null && (
              <span style={{ marginLeft: "auto", fontSize: "12px", color: "#8694a8", fontWeight: "600" }}>
                {(Array.isArray(realJobs) ? realJobs : []).filter((jp) => {
                  if (jobSearch.trim()) {
                    const q = jobSearch.trim().toLowerCase();
                    const h = [jp.title, jp.company?.name, ...(jp.region || []), ...(jp.jobType || [])].join(" ").toLowerCase();
                    if (!h.includes(q)) return false;
                  }
                  if (jobFilterType === "today" && !(jp.period || "").match(/일당|당일|단기|오늘/)) return false;
                  if (jobFilterType === "large" && ![jp.title, jp.conditions, jp.company?.name].join(" ").match(/반도체|조선|플랜트|대형|중공업|정유|SK|삼성|현대/)) return false;
                  if (jobFilterRegion && !(jp.region || []).some((r) => r.includes(jobFilterRegion))) return false;
                  if (jobFilterJobType && !(jp.jobType || []).some((t) => t.includes(jobFilterJobType))) return false;
                  return true;
                }).length}개 현장
              </span>
            )}
          </div>

          <div onTouchStart={onJobsTouchStart} onTouchEnd={onJobsTouchEnd} style={{ overflowX: "hidden" }}>
            {jobsPane === "nearby" && (
              <div key="nearby" style={{ animation: "fadeIn .22s ease" }}>
                <div style={{ padding: "12px 20px 0" }}>
                  <button type="button" onClick={findMyLocation} style={{ width: "100%", height: "48px", border: "1px solid var(--c1,#1F2226)", borderRadius: "14px", background: "#fff", color: "var(--c1,#1F2226)", fontSize: "14px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "10px", WebkitTapHighlightColor: "transparent" }}>
                    <svg width="17" height="17" viewBox="0 0 20 20" fill="none"><path d="M10 18s6-5.3 6-10A6 6 0 1 0 4 8c0 4.7 6 10 6 10Z" stroke="var(--c1,#1F2226)" strokeWidth="1.7" strokeLinejoin="round"></path><circle cx="10" cy="8" r="2.2" stroke="var(--c1,#1F2226)" strokeWidth="1.7"></circle></svg>
                    내 위치 찾기
                  </button>
                  <div ref={mapNodeRef} style={{ width: "100%", height: "340px", borderRadius: "16px", overflow: "hidden", border: "1px solid #e6e8ec", background: "#eef0f3" }}></div>
                  {geoNote && (<div style={{ fontSize: "12px", color: "#8694a8", fontWeight: "600", marginTop: "8px", lineHeight: "1.5" }}>{geoNote}</div>)}
                  <div style={{ fontSize: "11.5px", color: "#8694a8", fontWeight: "500", marginTop: "6px", lineHeight: "1.55" }}>※ 미리보기 · 일자리 위치는 지역 기준 근사 표시입니다. 왼쪽으로 쓸어넘기면 전체 채용공고를 볼 수 있어요.</div>
                </div>
                {locFound && (
                  <div style={{ animation: "fadeIn .25s ease" }}>
                    <div style={{ padding: "16px 20px 0", fontSize: "13px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>내 주변 일자리</div>
                    {renderJobList()}
                  </div>
                )}
              </div>
            )}
            {jobsPane === "posts" && (
              <div key="posts" style={{ animation: "fadeIn .22s ease" }}>

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
          <div style={{ fontSize: "13px", color: "#8694a8", fontWeight: "600", marginTop: "3px" }}>지원 완료된 공고와 확정 현장 출퇴근, 정산 내역을 확인할 수 있습니다.</div>

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
              일한 기록 & 정산
            </button>
          </div>

          {workSubTab === 'attendance' ? (
            <>
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
                    <button onClick={v.goJobs} style={{ marginTop: "16px", height: "44px", padding: "0 20px", border: "none", borderRadius: "13px", background: "var(--c1,#1F2226)", color: "#fff", fontSize: "14px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>일자리 보러가기</button>
                  </div>
                )}
                {(Array.isArray(assignments) ? assignments : []).map((a) => {
                  const openAtt = a.attendances.find((at) => !at.checkOutAt);
                  return (
                    <div key={a.id} style={{ borderRadius: "20px", background: "var(--c1,#1F2226)", padding: "18px", color: "var(--t0,#E5E7EB)", position: "relative", overflow: "hidden", marginBottom: "16px" }}>
                      <div style={{ fontSize: "11.5px", fontWeight: "700", color: "var(--t1,#A5AEB8)" }}>{a.jobPost.company ? a.jobPost.company.name : "협약 기업"}{a.jobPost.region.length ? " · " + a.jobPost.region.join(", ") : ""}</div>
                      <div style={{ fontSize: "17px", fontWeight: "800", marginTop: "3px" }}>{a.jobPost.title}</div>
                      
                      {/* 집결지 정보 노출 */}
                      <div style={{ marginTop: "12px", background: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "12px 14px", fontSize: "12.5px" }}>
                        <div style={{ color: "rgba(255,255,255,0.6)", fontWeight: "600" }}>📍 집결지 주소</div>
                        <div style={{ color: "#fff", fontWeight: "700", marginTop: "2px" }}>경기 평택시 고덕동 삼성반도체 P4 현장 게이트 3앞</div>
                        <div style={{ color: "rgba(255,255,255,0.6)", fontWeight: "600", marginTop: "8px" }}>⏰ 집결 시간</div>
                        <div style={{ color: "#fff", fontWeight: "700", marginTop: "2px" }}>오전 06:40 (지각 시 출입 통제)</div>
                      </div>

                      <button onClick={() => (openAtt ? doCheckOut(a) : doCheckIn(a.id))} style={{ marginTop: "14px", width: "100%", height: "52px", border: "none", borderRadius: "14px", background: openAtt ? "var(--a1,#1F2226)" : "#fff", color: openAtt ? "var(--c0,#1F2226)" : "var(--c1,#1F2226)", fontSize: "16px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>{openAtt ? "퇴근 체크" : "출근 체크"}</button>
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

              {/* 외국인 기술자 정산 내역 */}
              {isForeigner && (
                <div style={{ marginTop: "24px" }}>
                  <FgnSettlement id={getServerId() || ""} />
                </div>
              )}
            </>
          ) : (
            <>
              {/* 이번 달 근무 요약 — 실제 출역 데이터 기반 계산 */}
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
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", fontWeight: "600" }}>정산 내역</div>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: "rgba(255,255,255,0.5)" }}>{workDays === 0 ? "출역 기록 없음" : "정산 정보 확인 중"}</div>
                      </div>
                    </div>
                    {workDays === 0 && (
                      <div style={{ marginTop: "12px", fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: "600" }}>이번 달 출근 체크인 기록이 없어요. 확정 현장에서 출근 체크를 눌러주세요.</div>
                    )}
                  </div>
                );
              })()}

              {/* 에스크로 안심정산 배너 */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "16px", padding: "14px 16px", marginTop: "14px", display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ fontSize: "20px" }}>🛡️</span>
                <div style={{ fontSize: "12px", color: "#166534", fontWeight: "600", lineHeight: "1.45", wordBreak: "keep-all" }}>
                  MONO는 근로자 보호를 위해 <strong>에스크로 안심 정산 계좌</strong>를 사용하며, 노무비 정산 증빙을 자동으로 관리합니다.
                </div>
              </div>

              {/* 상세 출역 기록 — assignments.attendances 실 데이터 */}
              <div style={{ marginTop: "24px" }}>
                <div style={{ fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)", marginBottom: "12px" }}>상세 출역 기록</div>
                {(() => {
                  const allAtts = (Array.isArray(assignments) ? assignments : []).flatMap((a) =>
                    (a.attendances || []).map((at) => ({ ...at, jobTitle: a.jobPost?.title, jobType: a.jobPost?.jobType?.[0], company: a.jobPost?.company?.name }))
                  ).filter((at) => at.checkOutAt).sort((a, b) => new Date(b.checkInAt).getTime() - new Date(a.checkInAt).getTime());
                  if (allAtts.length === 0) {
                    return (
                      <div style={{ background: "#f8fafc", border: "1px dashed #e2e8f0", borderRadius: "16px", padding: "28px", textAlign: "center" }}>
                        <div style={{ fontSize: "24px", marginBottom: "8px" }}>📂</div>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--c1,#1F2226)" }}>아직 출역 기록이 없어요</div>
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
                          <div key={at.id} style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "18px", padding: "16px", boxShadow: "0 4px 12px -10px rgba(0,0,0,0.05)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: "12px", fontWeight: "800", color: "#166534", background: "#dcfce7", padding: "3px 8px", borderRadius: "6px" }}>출역 완료</span>
                              <span style={{ fontSize: "12.5px", color: "#8694a8", fontWeight: "600" }}>{dateLabel}</span>
                            </div>
                            <div style={{ margin: "10px 0 4px", fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>{at.jobTitle || "현장"}</div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "8px", borderTop: "1px solid #f1f5f9", paddingTop: "8px" }}>
                              <span style={{ fontSize: "13px", color: "#5b6b82", fontWeight: "500" }}>{at.jobType || ""}{at.jobType ? " · " : ""}{manDay}공수 · {inTime}~{outTime}</span>
                              <span style={{ fontSize: "12px", color: "#8694a8", fontWeight: "600" }}>{manDay}일</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </>
          )}
        </div>
        </>)}

        {(v.isMe) && (<>
        <div style={{ padding: "8px 20px 30px" }}>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>내 프로필</div>
          
          {/* 사용자 정보 카드 */}
          <div style={{ marginTop: "14px", background: "var(--c1,#1F2226)", borderRadius: "20px", padding: "20px", color: "var(--t0,#E5E7EB)", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "58px", height: "58px", borderRadius: "18px", background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-glow,#454A51)", fontSize: "22px", fontWeight: "800" }}>{v.initial}</div>
            <div style={{ flex: "1" }}>
              <div style={{ fontSize: "18px", fontWeight: "800" }}>{v.name}</div>
              <div style={{ fontSize: "12.5px", color: "var(--t1,#A5AEB8)", fontWeight: "600", marginTop: "2px" }}>{v.myJob} · A등급 숙련 기술자</div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "6px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5fd1a0" }}></span>
                <span style={{ fontSize: "11.5px", color: "var(--t1,#A5AEB8)", fontWeight: "600" }}>실명·계좌 인증 완료</span>
                {trustScore && trustScore.score > 0 && (
                  <span style={{ marginLeft: "4px", padding: "2px 6px", background: "rgba(255,255,255,0.2)", borderRadius: "6px", fontSize: "11px", fontWeight: "700" }}>
                    ⭐ 신뢰 {trustScore.score}점
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 프로필 완성도 */}
          <div style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "18px", padding: "14px", marginTop: "14px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#8694a8", marginBottom: "6px" }}>프로필 완성도 {v.completion}%{v.completion >= 100 ? " · 모든 항목 완료" : v.completion >= 80 ? " · 검증 프로필 완성" : " · 채울수록 신뢰도가 올라가요"}</div>
            <div style={{ height: "6px", background: "#eef0f3", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${v.completion}%`, height: "100%", background: "var(--c3,#1F2226)", borderRadius: "4px", transition: "width .5s cubic-bezier(.22,1,.36,1)" }}></div>
            </div>
          </div>

          {/* 현장 준비 상태 (인증) */}
          <div style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "20px", padding: "18px", marginTop: "14px" }}>
            <div style={{ fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>🚦 현장 준비 상태</div>
            <div style={{ fontSize: "12.5px", color: "#8694a8", fontWeight: "500", marginTop: "4px", marginBottom: "16px", lineHeight: "1.45", wordBreak: "keep-all" }}>
              대형 현장 지원에 필요한 준비를 확인해보세요. 각 항목을 탭하여 완료 상태를 시뮬레이션할 수 있습니다.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { key: "idCard", label: "신분증 제출 (이름·주민번호)", desc: "본인 확인 및 노무비 지급 증빙용" },
                { key: "safetyEdu", label: "기초안전보건교육 이수증", desc: "건설 현장 출입 필수 법정 교육" },
                { key: "elecCard", label: "건설근로자 전자카드", desc: "퇴직공제 신고 및 출퇴근용 태그 카드" },
                { key: "bankAcc", label: "노무비 정산 계좌 등록", desc: "본인 명의 예금주 검증 완료 계좌" },
                { key: "medCheck", label: "배치전/특수 신체검사서", desc: "대형 현장 및 유해공정 필수 검진" },
                { key: "gateCard", label: "현장 출입카드 발급", desc: "평택 삼성반도체/조선소 등 현장 등록" },
                { key: "safetyGear", label: "안전화 · 작업복 구비", desc: "현장 작업용 개인 보호구 준비" },
              ].map((item) => {
                const checked = prepChecklist[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => {
                      setPrepChecklist(prev => ({
                        ...prev,
                        [item.key]: !prev[item.key]
                      }));
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px",
                      borderRadius: "14px", border: "1px solid #e6e8ec", background: checked ? "#f8fafc" : "#fff",
                      cursor: "pointer", transition: "all 0.15s"
                    }}
                  >
                    <div style={{
                      width: "20px", height: "20px", borderRadius: "6px",
                      border: `2px solid ${checked ? "#10b981" : "#cbd5e1"}`,
                      background: checked ? "#10b981" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: "12px", fontWeight: "900", flex: "none"
                    }}>
                      {checked ? "✓" : ""}
                    </div>
                    <div style={{ flex: "1" }}>
                      <div style={{ fontSize: "13.5px", fontWeight: "800", color: checked ? "var(--c1,#1F2226)" : "#64748b" }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: "11px", color: "#8694a8", marginTop: "2px", fontWeight: "500" }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 나의 MONO 경력카드 (Consolidated Card View) */}
          <div style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "20px", padding: "18px", marginTop: "14px" }}>
            <div style={{ fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)", marginBottom: "12px" }}>💳 나의 MONO 경력카드</div>
            
            <div style={{ borderRadius: "18px", padding: "18px", background: "var(--c1,#1F2226)", position: "relative", overflow: "hidden", border: "1px solid color-mix(in srgb, var(--brand,#1F2226) 22%, transparent)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <span style={{ color: "var(--t0,#E5E7EB)", fontWeight: "800", fontSize: "15px" }}>MONO</span>
                  </div>
                  <div style={{ fontSize: "9px", color: "var(--t2,#A5AEB8)", fontWeight: "700", marginTop: "4px" }}>인증 경력카드</div>
                </div>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#fff", background: "rgba(255,255,255,0.15)", padding: "4px 8px", borderRadius: "8px" }}>A등급</span>
              </div>
              <div style={{ marginTop: "22px" }}>
                <div style={{ fontSize: "16px", color: "#fff", fontWeight: "800" }}>{v.name} · {v.myJob}</div>
                <div style={{ fontSize: "11.5px", color: "var(--t1,#A5AEB8)", fontWeight: "600", marginTop: "4px" }}>
                  경력 {(careerCards || []).length}건 · 자격증 {(certificates || []).length}개
                </div>
              </div>
            </div>

            <button
              onClick={v.openShare}
              style={{
                marginTop: "12px", width: "100%", height: "42px", border: "none", borderRadius: "10px",
                background: "var(--c1,#1F2226)", color: "#fff", fontSize: "13px", fontWeight: "800", cursor: "pointer"
              }}
            >
              경력카드 QR / 링크 공유하기
            </button>
          </div>

          {/* 경력 / 자격 리스트 관리 */}
          <div style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "20px", padding: "18px", marginTop: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>🛠️ 현장 경력 ({careerCards.length}건)</span>
              <span onClick={() => setOpenCareerSheet(true)} style={{ fontSize: "12.5px", color: "#4f46e5", fontWeight: "700", cursor: "pointer" }}>+ 추가</span>
            </div>
            {careerCards.length === 0 ? (
              <div style={{ fontSize: "12.5px", color: "#8694a8", padding: "8px 0" }}>등록된 현장 경력이 없습니다.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {careerCards.map((card) => (
                  <div key={card.id} style={{ padding: "10px 12px", background: "#f8fafc", border: "1px solid #e6e8ec", borderRadius: "12px", fontSize: "13px" }}>
                    <div style={{ fontWeight: "800", color: "var(--c1,#1F2226)" }}>{card.projectName}</div>
                    <div style={{ color: "#8694a8", fontSize: "11.5px", marginTop: "2px" }}>{card.company} · {card.trade} · {card.days}공수</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ borderTop: "1px solid #f1f5f9", margin: "14px 0" }}></div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>📜 자격증 및 교육 ({certificates.length + educations.length}건)</span>
              <span onClick={() => setOpenDocs(true)} style={{ fontSize: "12.5px", color: "#4f46e5", fontWeight: "700", cursor: "pointer" }}>+ 관리</span>
            </div>
            {certificates.length === 0 && educations.length === 0 ? (
              <div style={{ fontSize: "12.5px", color: "#8694a8", padding: "8px 0" }}>등록된 서류가 없습니다.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {certificates.map((c) => (
                  <div key={c.id} style={{ padding: "10px 12px", background: "#f0fdfa", border: "1px solid #ccfbf1", borderRadius: "12px", fontSize: "13px", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: "800", color: "#0f766e" }}>{c.name}</span>
                    <span style={{ fontSize: "11px", color: "#0d9488" }}>자격증</span>
                  </div>
                ))}
                {educations.map((e) => (
                  <div key={e.id} style={{ padding: "10px 12px", background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: "12px", fontSize: "13px", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: "800", color: "#5b21b6" }}>{e.title}</span>
                    <span style={{ fontSize: "11px", color: "#7c3aed" }}>교육이수</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 프로필 서브 링크 메뉴 */}
          <div style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "18px", padding: "14px 6px", marginTop: "14px" }}>
            {(v.meRows || []).map((row, _i1) => (<React.Fragment key={_i1}>
              <div onClick={row.onClick} style={{ display: "flex", alignItems: "center", gap: "13px", padding: "13px 14px", cursor: "pointer" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "11px", background: "#eef0f3", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{row.icon}</div>
                <span style={{ flex: "1", fontSize: "14.5px", fontWeight: "600", color: "var(--c1,#1F2226)" }}>{row.label}</span>
                <span style={{ fontSize: "12px", fontWeight: "700", color: row.tagColor }}>{row.tag}</span>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="m1 1 6 6-6 6" stroke="#8694a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </div>
            </React.Fragment>))}
          </div>

          {/* 내 팀(반장) */}
          <div style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "18px", padding: "16px", marginTop: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>내 팀{team && isForeman ? ` · ${team.memberCount}명` : ""}</span>
              {isForeman && (<button type="button" onClick={openTeamSheet} style={{ border: "none", background: "none", fontSize: "12.5px", color: "var(--c1,#1F2226)", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", padding: "4px 2px", WebkitTapHighlightColor: "transparent" }}>{team ? "+ 팀원 추가" : "+ 팀 만들기"}</button>)}
            </div>
            <div style={{ fontSize: "12px", color: "#8694a8", fontWeight: "500", marginTop: "4px", lineHeight: "1.5" }}>{isForeman ? "함께 일하는 팀을 한 번에 등록하세요." : "반장은 관리자 승인 후 팀을 만들 수 있어요."}</div>
            {!isForeman && (
              myRequested ? (
                <div style={{ marginTop: "12px", padding: "11px 14px", borderRadius: "12px", background: "var(--soft,#E5E7EB)", fontSize: "12.5px", fontWeight: "800", color: "var(--c1,#1F2226)", textAlign: "center" }}>반장 승인 대기 중…</div>
              ) : (
                <button type="button" onClick={requestForeman} style={{ marginTop: "12px", width: "100%", height: "44px", border: "1px solid var(--c1,#1F2226)", borderRadius: "12px", background: "#fff", color: "var(--c1,#1F2226)", fontSize: "13.5px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>반장 신청하기</button>
              )
            )}
            {isForeman && team && team.members.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                {(team?.members && Array.isArray(team.members) ? team.members : []).map((m) => (
                  <div key={m.userId} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ flex: "none", width: "32px", height: "32px", borderRadius: "50%", background: "var(--soft,#E5E7EB)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>{(m.name || "팀").slice(0, 1)}</div>
                    <span style={{ flex: "1", fontSize: "14px", fontWeight: "700", color: "var(--c1,#1F2226)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name || "이름 미등록"}</span>
                    {m.jobType.length > 0 && (<span style={{ flex: "none", fontSize: "11px", fontWeight: "700", color: "var(--c1,#1F2226)", background: "var(--soft,#E5E7EB)", padding: "3px 8px", borderRadius: "7px" }}>{m.jobType[0]}</span>)}
                  </div>
                ))}
              </div>
            )}
            {isForeman && team && (
              <button type="button" onClick={deleteTeam} style={{ marginTop: "12px", border: "none", background: "none", color: "#d9534f", fontSize: "12.5px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer", padding: "2px 0", WebkitTapHighlightColor: "transparent" }}>팀 삭제</button>
            )}
          </div>
          
          <button
            onClick={() => {
              try {
                window.localStorage.removeItem("mono.profile");
              } catch {
                /* noop */
              }
              window.location.href = "/mono";
            }}
            style={{ marginTop: "16px", width: "100%", height: "46px", border: "1px solid #d4dae3", borderRadius: "13px", background: "#fff", color: "#5b6b82", fontSize: "14px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
          >
            로그아웃
          </button>
          <button type="button" onClick={deleteAccount} style={{ marginTop: "10px", width: "100%", height: "44px", border: "none", borderRadius: "13px", background: "none", color: "#d9534f", fontSize: "13px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>회원 탈퇴</button>
          <div style={{ textAlign: "center", marginTop: "18px", fontSize: "11.5px", color: "#8694a8", fontWeight: "500" }}>MONO v1.0 · 현장 인력 데이터 인프라</div>
        </div>
        </>)}

      </div>


    <div className="mono-bottomnav" style={{ height: "84px", flex: "none", background: "rgba(249,250,253,.94)", backdropFilter: "blur(14px)", borderTop: "1px solid #e6e8ec", display: "flex", padding: "9px 6px 0", position: "relative", zIndex: "30" }}>
        <button onClick={v.goHome} style={{ flex: "1", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", paddingTop: "5px", color: v.cHome, fontFamily: "inherit" }}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none"><path d="M4 11 12 4l8 7v8a1.2 1.2 0 0 1-1.2 1.2H15V14.5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1V20.2H5.2A1.2 1.2 0 0 1 4 19v-8Z" fill={v.fHome} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"></path></svg>
          <span style={{ fontSize: "10.5px", fontWeight: v.wHome, letterSpacing: "-.2px", whiteSpace: "nowrap" }}>홈</span>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: v.dotHome }}></div>
        </button>
        <button onClick={v.goJobs} style={{ flex: "1", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", paddingTop: "5px", color: v.cJobs, fontFamily: "inherit" }}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none"><path d="M6 15.5a6 6 0 0 1 12 0" fill={v.fJobs} stroke="currentColor" strokeWidth="1.9"></path><path d="M3.5 15.5h17" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"></path><path d="M10.4 9.8V7.4A1.6 1.6 0 0 1 12 5.8a1.6 1.6 0 0 1 1.6 1.6v2.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12 18.5v0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path></svg>
          <span style={{ fontSize: "10.5px", fontWeight: v.wJobs, letterSpacing: "-.2px", whiteSpace: "nowrap" }}>현장 찾기</span>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: v.dotJobs }}></div>
        </button>
        <button onClick={v.goCommunity} style={{ flex: "1", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", paddingTop: "5px", color: v.cCommunity, fontFamily: "inherit" }}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"></path><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" fill={v.fCommunity}></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"></path><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"></path></svg>
          <span style={{ fontSize: "10.5px", fontWeight: v.wCommunity, letterSpacing: "-.2px", whiteSpace: "nowrap" }}>커뮤니티</span>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: v.dotCommunity }}></div>
        </button>
        <button onClick={v.goWork} style={{ flex: "1", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", paddingTop: "5px", color: v.cWork, fontFamily: "inherit" }}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none"><rect x="4.5" y="4.5" width="15" height="16.5" rx="2.8" fill={v.fWork} stroke="currentColor" strokeWidth="1.9"></rect><rect x="8.5" y="2.6" width="7" height="3.6" rx="1.3" fill={v.clipWork} stroke="currentColor" strokeWidth="1.7"></rect><path d="m8.4 12.4 1.8 1.8 3.6-3.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"></path><path d="M8.6 17h6.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"></path></svg>
          <span style={{ fontSize: "10.5px", fontWeight: v.wWork, letterSpacing: "-.3px", whiteSpace: "nowrap" }}>지원·출근</span>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: v.dotWork }}></div>
        </button>
        <button onClick={v.goMe} style={{ flex: "1", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", paddingTop: "5px", color: v.cMe, fontFamily: "inherit" }}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.2" r="3.7" fill={v.fMe} stroke="currentColor" strokeWidth="1.9"></circle><path d="M4.8 20c.4-3.6 3.4-5.6 7.2-5.6s6.8 2 7.2 5.6Z" fill={v.fMe} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"></path></svg>
          <span style={{ fontSize: "10.5px", fontWeight: v.wMe, letterSpacing: "-.2px", whiteSpace: "nowrap" }}>내 프로필</span>
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

      {(v.overlayJob) && (<>
        <div style={{ position: "absolute", inset: "0", zIndex: "55", background: "var(--bg,#f5f6fb)", display: "flex", flexDirection: "column", animation: "fadeIn .2s ease" }}>
          <div style={{ flex: "none", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px 0 6px", background: "#fff", borderBottom: "1px solid #e6e8ec" }}>
            <button onClick={v.closeOverlay} style={{ width: "40px", height: "40px", border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="var(--c1,#1F2226)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </button>
            <span style={{ fontSize: "15px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>공고 상세</span>
            <button style={{ width: "40px", height: "40px", border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14 7a2.5 2.5 0 1 0-2.4-3.1L7.9 6A2.5 2.5 0 1 0 6 10c.6 0 1.2-.2 1.6-.6l3.9 2.3A2.5 2.5 0 1 0 14 13c-.7 0-1.3.3-1.7.7l-3.8-2.2c.1-.3.2-.6.2-.9l3.7-2.2c.4.4 1 .8 1.6.8Z" fill="#8694a8"></path></svg>
            </button>
          </div>

          <div className="scr" style={{ flex: "1", overflowY: "auto" }}>
            <div style={{ height: "170px", background: v.job.grad, position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "18px" }}>
              <div style={{ position: "absolute", inset: "0", background: "transparent" }}></div>
              <div style={{ position: "relative", display: "flex", gap: "6px", marginBottom: "9px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--c1,#1F2226)", background: "var(--a1,#1F2226)", padding: "4px 9px", borderRadius: "8px" }}>{v.job.trade}</span>
                {(v.job.instant) && (<><span style={{ fontSize: "11px", fontWeight: "700", color: "#fff", background: "rgba(180,105,14,.9)", padding: "4px 9px", borderRadius: "8px" }}>즉시 출역</span></>)}
              </div>
              <div style={{ position: "relative", fontSize: "21px", fontWeight: "800", color: "#fff" }}>{v.job.name}</div>
              <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "5px", marginTop: "5px" }}>
                <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,.85)", fontWeight: "600" }}>{v.job.company}</span>
                {(v.job.verified) && (<><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1 8.7 2.3l2.1-.2.6 2 1.6 1.4-1 1.8.3 2.1-2 .8L8.7 12 7 11l-1.7 1.4-1.8-1.4-2-.8.3-2.1-1-1.8L2.4 4l.6-2 2.1.2L7 1Z" fill="var(--a1,#1F2226)"></path><path d="m5 7 1.4 1.4L9.4 5.2" stroke="var(--c1,#1F2226)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"></path></svg></>)}
              </div>
            </div>

            <div style={{ padding: "18px 20px 22px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div><div style={{ fontSize: "12px", color: "#8694a8", fontWeight: "600" }}>일급</div><div style={{ display: "flex", alignItems: "baseline", gap: "2px", marginTop: "2px" }}><span style={{ fontSize: "16px", color: "var(--c1,#1F2226)", fontWeight: "700" }}>₩</span><span className="mono" style={{ fontSize: "30px", fontWeight: "500", color: "var(--c1,#1F2226)" }}>{v.job.pay}</span></div></div>
                <span style={{ fontSize: "11.5px", fontWeight: "700", color: "var(--ai,#1F2226)", background: "var(--aSoft,#E5E7EB)", padding: "6px 11px", borderRadius: "10px" }}>{v.job.settleWay}</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "18px" }}>
                <div style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "14px", padding: "13px 14px" }}><div style={{ fontSize: "11px", color: "#8694a8", fontWeight: "600" }}>출역일</div><div style={{ fontSize: "14.5px", fontWeight: "700", color: "var(--c1,#1F2226)", marginTop: "3px" }}>{v.job.date}</div></div>
                <div style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "14px", padding: "13px 14px" }}><div style={{ fontSize: "11px", color: "#8694a8", fontWeight: "600" }}>근무 시간</div><div style={{ fontSize: "14.5px", fontWeight: "700", color: "var(--c1,#1F2226)", marginTop: "3px" }}>{v.job.hours}</div></div>
                <div style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "14px", padding: "13px 14px" }}><div style={{ fontSize: "11px", color: "#8694a8", fontWeight: "600" }}>필요 인원</div><div style={{ fontSize: "14.5px", fontWeight: "700", color: "var(--c1,#1F2226)", marginTop: "3px" }}>{v.job.people}</div></div>
                <div style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "14px", padding: "13px 14px" }}><div style={{ fontSize: "11px", color: "#8694a8", fontWeight: "600" }}>숙식</div><div style={{ fontSize: "14.5px", fontWeight: "700", color: "var(--c1,#1F2226)", marginTop: "3px" }}>{v.job.stay}</div></div>
              </div>

              <div style={{ background: "#fff", border: "1px solid #e6e8ec", borderRadius: "16px", padding: "4px 16px", marginTop: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0" }}><span style={{ fontSize: "13px", color: "#8694a8", fontWeight: "600" }}>근무 위치</span><span style={{ fontSize: "13.5px", color: "var(--c1,#1F2226)", fontWeight: "700" }}>{v.job.loc} · {v.job.dist}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--soft,#E5E7EB)" }}><span style={{ fontSize: "13px", color: "#8694a8", fontWeight: "600" }}>준비물</span><span style={{ fontSize: "13px", color: "var(--c1,#1F2226)", fontWeight: "700", textAlign: "right", maxWidth: "60%" }}>{v.job.prepare}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--soft,#E5E7EB)" }}><span style={{ fontSize: "13px", color: "#8694a8", fontWeight: "600" }}>현장 위험도</span><span style={{ fontSize: "13.5px", color: "#b4690e", fontWeight: "700" }}>{v.job.risk}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--soft,#E5E7EB)" }}><span style={{ fontSize: "13px", color: "#8694a8", fontWeight: "600" }}>담당자</span><span style={{ fontSize: "13.5px", color: "var(--c1,#1F2226)", fontWeight: "700" }}>{v.job.manager}</span></div>
              </div>

              <div style={{ marginTop: "12px", background: "#eef0f3", borderRadius: "16px", padding: "16px 18px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "14px", fontWeight: "800", color: "#b4690e", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>📋 이 현장에 지원하려면 준비가 필요해요</span>
                </div>
                <div style={{ fontSize: "13px", color: "#5b6b82", fontWeight: "500", marginTop: "6px", lineHeight: "1.5", wordBreak: "keep-all" }}>
                  전자카드, 기초안전교육, 신체검사, 출입카드를 확인해보세요.
                </div>
                <button
                  onClick={() => { setJobDetail(null); setTab('me'); }}
                  style={{
                    marginTop: "12px", width: "100%", height: "40px", border: "none", borderRadius: "10px",
                    background: "#b4690e", color: "#fff", fontSize: "13.5px", fontWeight: "800", cursor: "pointer"
                  }}
                >
                  준비 상태 확인하기
                </button>
              </div>

              <button onClick={v.openCareer} style={{ marginTop: "12px", width: "100%", height: "50px", border: "1px dashed var(--brand-tint-2,#A5AEB8)", borderRadius: "14px", background: "#eef0f3", color: "var(--ai,#1F2226)", fontSize: "13px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M7 11 5 13a2.2 2.2 0 0 1-3-3l2-2m6 0 2-2a2.2 2.2 0 0 1 3 3l-2 2m-6 0 4-4" stroke="var(--ai,#1F2226)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                경력·자격 자동 확인 (기관 연동)
              </button>
            </div>
          </div>

          <div style={{ flex: "none", padding: "12px 18px 16px", background: "#fff", borderTop: "1px solid #e6e8ec", display: "flex", gap: "10px" }}>
            <button style={{ flex: "none", width: "52px", height: "52px", border: "1px solid #d4dae3", borderRadius: "14px", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 20s-7-4.4-7-9.3A3.7 3.7 0 0 1 12 7a3.7 3.7 0 0 1 7 3.7C19 15.6 12 20 12 20Z" stroke="var(--c1,#1F2226)" strokeWidth="1.7" strokeLinejoin="round"></path></svg>
            </button>
            <button onClick={v.applyJob} style={{ flex: "1", height: "52px", border: "none", borderRadius: "14px", background: v.applyBg, color: v.applyFg, fontSize: "15.5px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>{v.applyLabel}</button>
          </div>
        </div>
      </>)}

      

      
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
              <div style={{ minWidth: "0" }}>
                <div style={{ fontSize: "19px", fontWeight: "800", color: "var(--c1,#1F2226)", lineHeight: "1.35" }}>{jobDetail.title}</div>
                <div style={{ fontSize: "13px", color: "#8694a8", fontWeight: "600", marginTop: "5px" }}>{jobDetail.company ? jobDetail.company.name : "협약 기업"}{jobDetail.region.length ? " · " + jobDetail.region.join(", ") : ""}</div>
              </div>
              <button type="button" onClick={() => setJobDetail(null)} aria-label="닫기" style={{ flex: "none", width: "34px", height: "34px", borderRadius: "10px", border: "none", background: "#eef0f3", color: "#5b6b82", fontSize: "17px", cursor: "pointer", fontFamily: "inherit" }}>✕</button>
            </div>
            {jobDetail.jobType.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
                {(Array.isArray(jobDetail.jobType) ? jobDetail.jobType : []).map((t) => (<span key={t} style={{ fontSize: "12px", fontWeight: "700", color: "var(--c1,#1F2226)", background: "var(--soft,#E5E7EB)", padding: "5px 10px", borderRadius: "9px" }}>{t}</span>))}
              </div>
            )}
            <div className="scr" style={{ overflowY: "auto", marginTop: "14px", display: "flex", flexDirection: "column" }}>
              {[
                ["모집 인원", jobDetail.headcount ? jobDetail.headcount + "명" : "협의"] as [string, string],
                ["경력 요건", jobDetail.careerBand ? (CAREER_BAND_LABEL[jobDetail.careerBand] || jobDetail.careerBand) + " 이상" : "무관"],
                ["근무 기간", jobDetail.period || "협의"],
                ["근무 조건", jobDetail.conditions || "—"],
              ].map(([k, val]) => (
                <div key={k} style={{ display: "flex", gap: "12px", padding: "12px 2px", borderBottom: "1px solid #eef0f3" }}>
                  <div style={{ flex: "none", width: "78px", fontSize: "13px", color: "#8694a8", fontWeight: "700" }}>{k}</div>
                  <div style={{ fontSize: "13.5px", color: "var(--c1,#1F2226)", fontWeight: "600", lineHeight: "1.5", wordBreak: "break-word" }}>{val}</div>
                </div>
              ))}
              {jobDetail.certs.length > 0 && (
                <div style={{ display: "flex", gap: "12px", padding: "12px 2px", borderBottom: "1px solid #eef0f3" }}>
                  <div style={{ flex: "none", width: "78px", fontSize: "13px", color: "#8694a8", fontWeight: "700" }}>우대 자격</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {(Array.isArray(jobDetail.certs) ? jobDetail.certs : []).map((c) => (<span key={c} style={{ fontSize: "11.5px", fontWeight: "600", color: "var(--ai,#1F2226)", background: "var(--aSoft,#E5E7EB)", padding: "4px 9px", borderRadius: "8px" }}>{c} 우대</span>))}
                  </div>
                </div>
              )}
              <div style={{ display: "flex", gap: "12px", padding: "12px 2px" }}>
                <div style={{ flex: "none", width: "78px", fontSize: "13px", color: "#8694a8", fontWeight: "700" }}>등록일</div>
                <div style={{ fontSize: "13.5px", color: "var(--c1,#1F2226)", fontWeight: "600" }}>{(() => { const d = new Date(jobDetail.createdAt); return Number.isNaN(d.getTime()) ? "—" : `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`; })()}</div>
              </div>
            </div>
            <button onClick={() => applyToJob(jobDetail.id)} disabled={appliedJobs.has(jobDetail.id)} style={{ marginTop: "16px", flex: "none", width: "100%", height: "50px", border: "none", borderRadius: "14px", background: appliedJobs.has(jobDetail.id) ? "var(--soft,#E5E7EB)" : "var(--c1,#1F2226)", color: appliedJobs.has(jobDetail.id) ? "var(--c1,#1F2226)" : "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: appliedJobs.has(jobDetail.id) ? "default" : "pointer", WebkitTapHighlightColor: "transparent" }}>{appliedJobs.has(jobDetail.id) ? "지원함 ✓" : "지원하기"}</button>
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
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "22px 18px 26px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "88%", display: "flex", flexDirection: "column" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#d4dae3", margin: "0 auto 16px" }}></div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>서류 · 자격증</div>
            <div style={{ fontSize: "13px", color: "#8694a8", fontWeight: "500", marginTop: "4px", marginBottom: "16px" }}>자격증·교육 이력을 등록하면 신뢰도가 올라가요.</div>
            <div className="scr" style={{ overflowY: "auto" }}>
              {/* 자격증 */}
              <div style={{ fontSize: "13px", fontWeight: "800", color: "var(--c1,#1F2226)", marginBottom: "8px" }}>자격증</div>
              {(certificates || []).map((c) => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 13px", border: "1px solid #e6e8ec", borderRadius: "12px", marginBottom: "8px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--c1,#1F2226)" }}>{c.name}</span>
                    <span style={{ fontSize: "11px", color: "#8694a8" }}>발급번호 {c.licenseNo}</span>
                  </div>
                  <span style={{ fontSize: "12px", color: "#8694a8" }}>{[c.issuer, c.issuedAt].filter(Boolean).join(" · ")}</span>
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                <input value={certForm.name} onChange={(e) => setCertForm((p) => ({ ...p, name: e.target.value }))} placeholder="자격증명 (필수)" style={{ height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                <input value={certForm.licenseNo} onChange={(e) => setCertForm((p) => ({ ...p, licenseNo: e.target.value }))} placeholder="발급번호 (필수)" style={{ height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                <div style={{ display: "flex", gap: "8px" }}>
                  <input value={certForm.issuer} onChange={(e) => setCertForm((p) => ({ ...p, issuer: e.target.value }))} placeholder="발급기관" style={{ flex: "1", height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box", minWidth: "0" }} />
                  <input value={certForm.issuedAt} onChange={(e) => setCertForm((p) => ({ ...p, issuedAt: e.target.value }))} placeholder="취득일" style={{ width: "120px", height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
                <button type="button" onClick={submitCert} style={{ height: "44px", border: "1px solid var(--c1,#1F2226)", borderRadius: "11px", background: "#fff", color: "var(--c1,#1F2226)", fontSize: "14px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>+ 자격증 추가</button>
              </div>
              {/* 교육 */}
              <div style={{ fontSize: "13px", fontWeight: "800", color: "var(--c1,#1F2226)", marginBottom: "8px" }}>교육 이력</div>
              {(educations || []).map((ed) => (
                <div key={ed.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 13px", border: "1px solid #e6e8ec", borderRadius: "12px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--c1,#1F2226)" }}>{ed.title}</span>
                  <span style={{ fontSize: "12px", color: "#8694a8" }}>{[ed.institute, ed.completedAt].filter(Boolean).join(" · ")}</span>
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <input value={eduForm.title} onChange={(e) => setEduForm((p) => ({ ...p, title: e.target.value }))} placeholder="교육명 (필수)" style={{ height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                <div style={{ display: "flex", gap: "8px" }}>
                  <input value={eduForm.institute} onChange={(e) => setEduForm((p) => ({ ...p, institute: e.target.value }))} placeholder="기관" style={{ flex: "1", height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box", minWidth: "0" }} />
                  <input value={eduForm.completedAt} onChange={(e) => setEduForm((p) => ({ ...p, completedAt: e.target.value }))} placeholder="이수일" style={{ width: "120px", height: "44px", border: "1px solid #e6e8ec", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
                <button type="button" onClick={submitEdu} style={{ height: "44px", border: "1px solid var(--c1,#1F2226)", borderRadius: "11px", background: "#fff", color: "var(--c1,#1F2226)", fontSize: "14px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>+ 교육 추가</button>
              </div>
              {/* 외국인 기술자 — 체류·비자/서류/교육 이수, 서류·자격증과 같은 시트에 포함 */}
              {isForeigner && (
                <div style={{ marginTop: "20px", borderTop: "1px solid #eef0f6", paddingTop: "8px" }}>
                  <FgnVisa id={getServerId() || ""} />
                  <FgnDocs id={getServerId() || ""} />
                  <FgnTraining id={getServerId() || ""} />
                </div>
              )}
            </div>
            <button type="button" onClick={() => setOpenDocs(false)} style={{ marginTop: "16px", flex: "none", height: "50px", border: "none", borderRadius: "14px", background: "var(--c1,#1F2226)", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>완료</button>
          </div>
        </div>
      )}

      {openShareSheet && (
        <div onClick={() => setOpenShareSheet(false)} style={{ position: "absolute", inset: "0", zIndex: "60", background: "rgba(20,22,48,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "22px 18px 26px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "90%", overflowY: "auto" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#d4dae3", margin: "0 auto 16px" }}></div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>경력카드 공유</div>
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

      {/* 퇴근 및 재출역 제안 (반장용 Checkout Sheet) */}
      {checkoutSheetApp && (
        <div onClick={() => setCheckoutSheetApp(null)} style={{ position: "absolute", inset: "0", zIndex: "70", background: "rgba(20,22,48,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "22px 18px 26px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "90%", display: "flex", flexDirection: "column" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#d4dae3", margin: "0 auto 16px" }}></div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--c1,#1F2226)" }}>퇴근 체크 및 재출역 제안</div>
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
              {reattendBusy ? "처리 중..." : (reattendSelected.length > 0 ? `${reattendSelected.length}명 재출역 제안 및 퇴근` : "퇴근 체크만 하기")}
            </button>
          </div>
        </div>
      )}

    </div>
    </div>
  );
}
