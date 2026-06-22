// @ts-nocheck
/* eslint-disable */
"use client";

// MoNo 근로자 앱 — 프로토타입 HTML 100% 재현 (테마 기본값: MONO Tech-Blue)
// 출처: Downloads/export/MoNo 근로자 앱.html 의 DC 템플릿 + 컨트롤러를 React로 포팅.
import React, { useState, useRef, useEffect } from "react";
import { useProfile } from "@/lib/ProfileContext";
import { JOB_TYPES, CAREER_YEARS, REGIONS, INTEREST_FEATURES } from "@/lib/constants";
import { track } from "@/lib/analytics";
import { getServerId } from "@/lib/apiClient";
import { QRCodeSVG } from "qrcode.react";

const THEMES = {
    green:{ label:'MoNo 그린', amb1:'#20312a',amb2:'#16241e',amb3:'#0d1814', c0:'#0a2519',c1:'#0d3b2e',c2:'#114a39',c3:'#1a6b51', t0:'#eaf3ee',t1:'#9fd3bd',t2:'#7fae9c', a1:'#e8c34a',a2:'#f0d98a',a3:'#caa12f', bg:'#f3f1ea',soft:'#e6efe9', ai:'#9a6b16',aSoft:'#f6edd4' },
    mono:{ label:'MONO Tech-Blue', amb1:'#1c3647',amb2:'#142836',amb3:'#0c1a24', c0:'#0f2e40',c1:'#163e57',c2:'#1f5878',c3:'#2f7da3', t0:'#eef4f8',t1:'#a9cfe0',t2:'#79a7bf', a1:'#cda04a',a2:'#e3c178',a3:'#a8822f', bg:'#ece7dd',soft:'#dde9f0', ai:'#9a6b16',aSoft:'#f1e7d2' },
    trive:{ label:'T-Rive Indigo', amb1:'#3b3da0',amb2:'#2c2d8f',amb3:'#1e1f6e', c0:'#2c2d8f',c1:'#4b4dd6',c2:'#5a5ce8',c3:'#6e70ea', t0:'#eef0ff',t1:'#c3c4f7',t2:'#9092e0', a1:'#8b8df8',a2:'#b9bbff',a3:'#6e70ea', bg:'#f5f6fb',soft:'#ecedfb', ai:'#4b4dd6',aSoft:'#eceefe' }
  };

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
        border: open ? "1px solid var(--c1,#163e57)" : "1px solid #e2ddcf",
        borderRadius: "12px", padding: "0 14px", fontSize: "15px", fontFamily: "inherit",
        color: value ? "#15211c" : "#9aa39d", fontWeight: "600", background: "#fff", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value || placeholder}</span>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flex: "none", transition: "transform .2s ease", transform: open ? "rotate(180deg)" : "none" }}>
        <path d="M4 6l4 4 4-4" stroke="#8a958d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    </button>
  );
}

// 커스텀 드롭다운 picker 시트용 메타(필드 키 = edit 상태 키와 동일)
const PICKER_TITLE = { jobType: "직종 선택 (여러 개 가능)", careerYears: "경력 연차 선택", region: "희망 지역 선택 (여러 개 가능)" };
const PICKER_OPTIONS = { jobType: JOB_TYPES, careerYears: CAREER_YEARS, region: REGIONS };

// 포커스 트랩 대상 셀렉터(components/Sheet.tsx 와 동일 규칙).
const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function MonoApp() {
  const [s, setS] = useState({ tab: 'card', variant: 0, flipped: false, checkedIn: false, settleOpen: false, modal: null, overlay: null, selJob: 0, applied: false, cardView: 'me', theme: 'mono' });
  const { user, updateUser, setBasicProfile, registerInterest, interests, completion,
    addCertificate, addEducation, certificates, educations,
    careerCards, addCareerCard, reset, simulateState } = useProfile(); // 온보딩 프로필 + 관심/서류 + 현장 경력

  const hasProfile = !!(user && user.jobType && user.jobType.length > 0 && user.careerYears && user.region && user.region.length > 0);

  // 온보딩(프로필 미작성 시) 오버레이 시트 상태
  const [openOnboardingSheet, setOpenOnboardingSheet] = useState(false);
  const [onbStep, setOnbStep] = useState(0);
  const [onbJobType, setOnbJobType] = useState<string[]>([]);
  const [onbCareerYear, setOnbCareerYear] = useState<string | null>(null);
  const [onbRegion, setOnbRegion] = useState<string[]>([]);

  const handleOnboardingNext = () => {
    if (onbStep < 2) {
      setOnbStep((p) => p + 1);
    } else {
      if (onbJobType.length > 0 && onbCareerYear && onbRegion.length > 0) {
        setBasicProfile({
          jobType: onbJobType,
          careerYears: onbCareerYear,
          region: onbRegion,
        });
      }
      setOpenOnboardingSheet(false);
      setOnbStep(0);
      setOnbJobType([]);
      setOnbCareerYear(null);
      setOnbRegion([]);
    }
  };

  const [openInterest, setOpenInterest] = useState(false); // 관심 기능 신청 시트
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
  const rootRef = useRef(null);
  const careerSheetRef = useRef(null); // #4 현장 경력 시트 패널(포커스 트랩·이동용)
  const set = (p) => setS((prev) => ({ ...prev, ...(typeof p === 'function' ? p(prev) : p) }));

  const setTheme = (id) => set({ theme: id });
  const setTab = (t) => set({ tab: t, flipped: false });
  const setV = (vv) => set({ variant: vv, flipped: false });
  const flip = () => set((st) => ({ flipped: !st.flipped }));
  const toggleCheck = () => set((st) => ({ checkedIn: !st.checkedIn }));
  const toggleSettle = () => set((st) => ({ settleOpen: !st.settleOpen }));
  const open = (m) => set({ modal: m });
  const close = () => set({ modal: null });
  const openJob = (i) => {
    if (!user) {
      open('need_login');
      return;
    }
    if (!hasProfile) {
      open('need_profile');
      return;
    }
    set({ overlay: 'job', selJob: i, applied: false });
  };
  const closeOverlay = () => set({ overlay: null });
  const applyJob = () => set({ applied: true });
  const setCardView = (vw) => set({ cardView: vw });

  useEffect(() => {
    const t = THEMES[s.theme] || THEMES.mono;
    const el = rootRef.current;
    if (el) { for (const k in t) { if (k !== 'label') el.style.setProperty('--' + k, t[k]); } }
  }, [s.theme]);

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

  const v = (() => {
    
    const gold='var(--a1,#e8c34a)', green='var(--c1,#0d3b2e)', mute='#9aa39d';

    // 온보딩 데이터 → 경력카드 표시값(없으면 데모 폴백)
    const pName = (user && user.name && user.name.trim()) ? user.name.trim() : '{v.name}';
    const pInit = pName.charAt(0) || '김';
    const pJobArr = (user && user.jobType) ? (Array.isArray(user.jobType) ? user.jobType : [user.jobType]) : [];
    const pJob = pJobArr.length ? pJobArr.join(', ') : '형틀목공';
    const pMasked = pName.length >= 3
      ? pName.charAt(0) + '*'.repeat(pName.length - 2) + pName.charAt(pName.length - 1)
      : (pName.length === 2 ? pName.charAt(0) + '*' : pName);
    const tab=t=>s.tab===t;
    const ci=s.checkedIn;
    const qr=makeQR('var(--c0,#0a2519)');

    // steps timeline
    const labels=['지원 완료','기업 확인 중','출역 확정','출근 대기','출근 완료','퇴근 완료','근무 확정','정산 예정','정산 완료'];
    const times=['06.15 14:20','06.16 09:00','06.16 18:30','06.18 06:40', ci?'06.18 07:02':'', '', '', '', ''];
    const cur = ci?4:3; // current active index
    const steps=labels.map((label,i)=>{
      const done=i<cur, active=i===cur;
      return {
        label,
        line: i<labels.length-1,
        lineBg: i<cur ? 'var(--c3,#1a6b51)' : '#e8e4d9',
        dotBg: done?'var(--c3,#1a6b51)':(active?'#fff':'#fff'),
        dotBd: done?'var(--c3,#1a6b51)':(active?gold:'#e0dccf'),
        dotInner: done
          ? React.createElement('svg',{width:11,height:11,viewBox:'0 0 12 12',fill:'none'},React.createElement('path',{d:'m2.5 6 2.3 2.3L9.5 3.5',stroke:'#fff',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'}))
          : (active?React.createElement('div',{style:{width:8,height:8,borderRadius:'50%',background:gold}}):''),
        weight: (done||active)?'700':'500',
        textColor: (done||active)?'#15211c':'#a7b0a9',
        timeShow: !!times[i],
        time: times[i]
      };
    });

    const mk=(trade,name,loc,dist,date,pay,stay,score,why,opt={})=>({trade,name,loc,dist,date,pay,stay,score,why,instant:!!opt.instant,verified:opt.verified!==false,safety:!!opt.safety,
      company:opt.company,people:opt.people,hours:opt.hours,settleWay:opt.settleWay,prepare:opt.prepare,risk:opt.risk,manager:opt.manager,grad:opt.grad,month:opt.month});

    const jobs=[
      mk('형틀목공','힐스테이트 송도 더스카이','인천 연수구','4.2km','6/19','230,000','숙식 제공','4.9','형틀목공 5년+ 경력과 갱폼·알폼 보유 기술이 현장 요구 조건과 정확히 일치합니다. 출역 신뢰도 98.5%로 우선 추천.',{instant:true,safety:true,company:'대주건설(주)',people:'12명',hours:'07:00–17:00',settleWay:'주급 · 에스크로 안전정산',prepare:'안전화·안전모(현장 지급), 신분증',risk:'보통 · 고소작업 일부 포함',manager:'현장소장 박정호',grad:'linear-gradient(135deg,var(--c3,#1a6b51),var(--c0,#0a2b21))',month:'6월'}),
      mk('철근공','래미안 원베일리','서울 서초구','11.8km','6/20','245,000','숙식 미제공','4.7','선호 근무지(서울)와 평점 4.8, 최근 12개월 무결근 이력이 반영되었습니다.',{company:'삼성물산 협력 · 동성건설',people:'8명',hours:'07:00–16:30',settleWay:'월급 · 계좌이체',prepare:'개인 공구, 안전화',risk:'낮음',manager:'노무담당 김선영',grad:'linear-gradient(135deg,#2a5f7a,#13344a)'}),
      mk('형틀목공','자이 평택고덕 4단지','경기 평택','38km','6/21','225,000','숙식 제공','4.6','보유 자격증(비계기능사)과 갱폼 시공 경험이 매칭되었습니다. 숙식 제공으로 원거리 출역 가능.',{instant:true,company:'GS건설 협력 · 한울ENG',people:'20명',hours:'06:30–16:30',settleWay:'주급 · 에스크로 안전정산',prepare:'안전장구 일체 지급',risk:'보통',manager:'반장 이강우',grad:'linear-gradient(135deg,#5a7a2a,#2e4413)'})
    ];
    jobs.forEach((j,i)=>{ j.onOpen=()=>openJob(i); });
    const homeJobs=[
      {trade:'형틀목공',dist:'4.2km',pay:'230,000',name:'힐스테이트 송도 더스카이',loc:'인천 연수구',date:'6/19',stay:'숙식 제공',onOpen:()=>openJob(0)},
      {trade:'철근공',dist:'11.8km',pay:'245,000',name:'래미안 원베일리',loc:'서울 서초구',date:'6/20',stay:'숙식 미제공',onOpen:()=>openJob(1)}
    ];
    const job=jobs[s.selJob]||jobs[0];

    const chipDefs=['전체','형틀목공','철근공','콘크리트','서울/경기','즉시 출역'];
    const chips=chipDefs.map((label,i)=>({ label, bg:i===0?green:'#fff', fg:i===0?'#fff':'#5d6b62', bd:i===0?green:'#e8e4d9' }));

    const history=[
      {name:'더샵 일산 센트럴',date:'2026.05',days:'21일',amount:'4,830,000'},
      {name:'푸르지오 김포한강',date:'2026.04',days:'19일',amount:'4,275,000'}
    ];

    // modals
    const M={
      career:{ title:'경력 자동 확인', status:'협의 중', body:'건설근로자공제회 퇴직공제 가입 이력과 연계하여 근무 경력을 자동 검증하는 기능입니다. 실제 서비스에서는 기관 인증 데이터 기반으로 경력이 자동 확인됩니다.', note:'건설근로자공제회 데이터 연동 협의·API 준비 중' },
      safety:{ title:'안전교육 자동 검증', status:'협의 중', body:'안전보건공단의 기초안전보건교육 이수 정보와 연동하여 현장별 필수 교육 이수 여부를 자동 확인합니다. 현재는 근로자 제출 자료 기반으로 운영됩니다.', note:'안전보건공단 데이터 연동 협의 중' },
      finance:{ title:'금융 자산화 연계', status:'준비 중', body:'축적된 근무 이력·정산 데이터와 기술 신뢰도 점수를 기반으로 신용평가사·카드사와 연계한 대안 신용평가 및 금융 상품을 준비하고 있습니다.', note:'신용평가사·카드사 제휴 및 모델 개발 준비 중' },
      escrow:{ title:'에스크로 안전정산', status:'운영 중', body:'기업이 예치한 정산금을 근무 확정 시 안전하게 지급하는 구조입니다. 지급 PG·오픈뱅킹 연동을 통해 정산 누락과 임금 체불 위험을 줄입니다.', note:'지급 PG·오픈뱅킹 연동 준비 중' },
      share:{ title:'경력카드 공유', status:'사용 가능', body:'공개용 경력카드 링크와 QR을 생성하여 기업에 제출할 수 있습니다. 주민번호·계좌·상세 정산액은 자동으로 마스킹되며, 열람 로그가 기록됩니다.', note:'외부 링크는 7일 후 자동 만료됩니다' },
      scope:{ title:'공개 범위 설정', status:'사용 가능', body:'기업 또는 외부인이 경력카드를 열람할 때 공개할 항목을 직접 선택합니다. 이름 마스킹, 정산액 비공개, 상세 평가 비공개 등을 항목별로 제어할 수 있습니다.', note:'기본값: 이름 일부 마스킹 · 상세 정산액 비공개' },
      detailReq:{ title:'상세보기 요청 흐름', status:'사용 가능', body:'기업이 상세보기를 요청하면 ① 근로자에게 알림이 발송되고 ② 근로자가 공개 범위를 선택한 뒤 ③ 기업에게 제한된 상세 정보가 공개됩니다. 모든 열람 내역은 로그로 저장됩니다.', note:'열람 로그 저장 · 공개 범위는 언제든 회수 가능' },
      office:{ title:'오프라인 인력사무소 연동', status:'준비 중', body:'기존 인력사무소의 출역부·배정표·전화 확인·정산 업무를 디지털화하는 기능입니다. 제휴 사무소 모집, 현장 배정 표준화, 수수료 정책, 개인정보 처리 동의 체계를 준비 중입니다.', note:'제휴 인력사무소 모집 및 배정 프로세스 표준화 진행 중' }
    };
    const m=s.modal?M[s.modal]:null;

    const themeList=Object.keys(THEMES).map(id=>{ const th=THEMES[id]; return {
      id, label:th.label, active:s.theme===id,
      ringBd: s.theme===id?th.a1:'#e8e4d9', ringBg: s.theme===id?'var(--soft,#e6efe9)':'#fff',
      checkShow:s.theme===id,
      sw1:th.c1, sw2:th.c3, sw3:th.a1, sw4:th.bg,
      onPick:()=>setTheme(id)
    };});

    const meRows=[
      {label:'프로필 · 기본 정보',tag:'완료',tagColor:'var(--c3,#1a6b51)',icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 20 20',fill:'none'},React.createElement('circle',{cx:10,cy:7,r:3,stroke:'var(--c1,#0d3b2e)',strokeWidth:1.7}),React.createElement('path',{d:'M4 17c0-3 2.7-4.5 6-4.5s6 1.5 6 4.5',stroke:'var(--c1,#0d3b2e)',strokeWidth:1.7,strokeLinecap:'round'})),onClick:()=>openEdit()},
      {label:'서류 · 자격증',tag:(certificates.length+educations.length)?(certificates.length+educations.length)+'건':'',tagColor:'#9aa39d',icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 20 20',fill:'none'},React.createElement('path',{d:'M5 2.5h7L16 6v11.5H5V2.5Z',stroke:'var(--c1,#0d3b2e)',strokeWidth:1.7,strokeLinejoin:'round'}),React.createElement('path',{d:'M12 2.5V6h4',stroke:'var(--c1,#0d3b2e)',strokeWidth:1.7,strokeLinejoin:'round'})),onClick:()=>setOpenDocs(true)},
      {label:'관심 기능 신청',tag: interests.length?String(interests.length):'',tagColor:'var(--ai,#9a6b16)',icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 20 20',fill:'none'},React.createElement('path',{d:'M10 16.5 3.8 10.3a3.6 3.6 0 0 1 5.1-5.1L10 6.4l1.1-1.2a3.6 3.6 0 0 1 5.1 5.1L10 16.5Z',stroke:'var(--c1,#0d3b2e)',strokeWidth:1.6,strokeLinejoin:'round'})),onClick:()=>setOpenInterest(true)},
      // {label:'계좌 · 정산 정보',tag:'인증',tagColor:'var(--c3,#1a6b51)',icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 20 20',fill:'none'},React.createElement('rect',{x:3,y:5,width:14,height:11,rx:2,stroke:'var(--c1,#0d3b2e)',strokeWidth:1.7}),React.createElement('path',{d:'M3 9h14',stroke:'var(--a1,#e8c34a)',strokeWidth:1.7})),onClick:()=>{}},
      // {label:'안전교육 · 인증',tag:'100%',tagColor:'var(--c3,#1a6b51)',icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 20 20',fill:'none'},React.createElement('path',{d:'M10 2 3 5v5c0 4 3 7 7 8.5 4-1.5 7-4.5 7-8.5V5l-7-3Z',stroke:'var(--c1,#0d3b2e)',strokeWidth:1.7,strokeLinejoin:'round'})),onClick:()=>{}},
      // {label:'외부 기관 연동 현황',tag:'협의 중',tagColor:'var(--ai,#9a6b16)',icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 20 20',fill:'none'},React.createElement('path',{d:'M8 12 5.5 14.5a2.5 2.5 0 0 1-3.5-3.5L5 8m7 0 2.5-2.5a2.5 2.5 0 0 1 3.5 3.5L15 12m-7 0 4-4',stroke:'var(--c1,#0d3b2e)',strokeWidth:1.7,strokeLinecap:'round',strokeLinejoin:'round'})),onClick:()=>open('career')},
      // {label:'오프라인 인력사무소 연동',tag:'준비 중',tagColor:'var(--ai,#9a6b16)',icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 20 20',fill:'none'},React.createElement('path',{d:'M3 17h14M5 17V8l5-3.5L15 8v9M8.5 17v-4h3v4',stroke:'var(--c1,#0d3b2e)',strokeWidth:1.7,strokeLinejoin:'round'})),onClick:()=>open('office')},
      {label:'테마 · 화면 색상',tag:THEMES[s.theme].label,tagColor:'var(--c3,#1a6b51)',icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 20 20',fill:'none'},React.createElement('circle',{cx:10,cy:10,r:7,stroke:'var(--c1,#0d3b2e)',strokeWidth:1.7}),React.createElement('path',{d:'M10 3a7 7 0 0 1 0 14z',fill:'var(--a1,#e8c34a)'})),onClick:()=>open('theme')},
      // {label:'알림 · 설정',tag:'',tagColor:'#9aa39d',icon:React.createElement('svg',{width:18,height:18,viewBox:'0 0 20 20',fill:'none'},React.createElement('path',{d:'M10 3a4 4 0 0 0-4 4v3l-1.5 2.5h11L14 10V7a4 4 0 0 0-4-4Z',stroke:'var(--c1,#0d3b2e)',strokeWidth:1.7,strokeLinejoin:'round'}),React.createElement('path',{d:'M8.5 15a1.5 1.5 0 0 0 3 0',stroke:'var(--c1,#0d3b2e)',strokeWidth:1.7,strokeLinecap:'round'})),onClick:()=>{}}
    ];

    return {
      isHome:tab('home'), isJobs:tab('jobs'), isCard:tab('card'), isWork:tab('work'), isMe:tab('me'),
      goHome:()=>setTab('home'), goJobs:()=>setTab('jobs'), goCard:()=>setTab('card'), goWork:()=>setTab('work'), goMe:()=>setTab('me'),
      cHome:tab('home')?green:mute, cJobs:tab('jobs')?green:mute, cCard:tab('card')?green:mute, cWork:tab('work')?green:mute, cMe:tab('me')?green:mute,
      fHome:tab('home')?'#d7e8de':'none', fJobs:tab('jobs')?'#d7e8de':'none', fCard:tab('card')?'#d7e8de':'none', fWork:tab('work')?'#d7e8de':'none', fMe:tab('me')?'#d7e8de':'none',
      wHome:tab('home')?'800':'600', wJobs:tab('jobs')?'800':'600', wCard:tab('card')?'800':'600', wWork:tab('work')?'800':'600', wMe:tab('me')?'800':'600',
      dotHome:tab('home')?gold:'transparent', dotJobs:tab('jobs')?gold:'transparent', dotCard:tab('card')?gold:'transparent', dotWork:tab('work')?gold:'transparent', dotMe:tab('me')?gold:'transparent',
      chipCard:tab('card')?gold:'currentColor', clipWork:tab('work')?gold:'none',

      statusBg: 'transparent', statusFg:'#15211c',

      qr,
      name: pName, initial: pInit, myJob: pJob, maskedName: pMasked,

      // attendance
      checkPhase: ci?'출근 완료 · 근무 중':'출근 예정 · 07:00',
      checkDot: ci?'#5fd1a0':'var(--a1,#e8c34a)',
      checkDotHalo: ci?'rgba(95,209,160,.25)':'rgba(232,195,74,.25)',
      inTime: ci?'07:02':'07:00',
      checkBtnLabel: ci?'퇴근 체크하기':'출근 체크하기',
      checkBtnBg: ci?'rgba(255,255,255,.14)':'linear-gradient(135deg,var(--a1,#e8c34a),var(--a3,#d4a82f))',
      checkBtnFg: ci?'var(--t0,#eaf3ee)':'var(--c1,#0d3b2e)',
      toggleCheck:()=>toggleCheck(),

      homeJobs, jobs, chips, history, steps, meRows,
      openCareer:() => {
        if (!user) {
          open('need_login');
        } else if (!hasProfile) {
          open('need_profile');
        } else {
          open('career');
        }
      },
      openFinance:()=>open('finance'),
      openShare:()=>open('share'),
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
      applyJob:()=>applyJob(),
      applyLabel: s.applied?'출역 신청 완료 · 기업 확인 중':'출역 신청',
      applyBg: s.applied?'var(--soft,#e6efe9)':'linear-gradient(135deg,var(--c1,#0d3b2e),var(--c2,#114a39))',
      applyFg: s.applied?'var(--c3,#1a6b51)':'#fff',

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
      setMyView:()=>setCardView('me'), setPublicView:()=>setCardView('public'),
      viewMeBg:s.cardView==='me'?'var(--c1,#0d3b2e)':'transparent', viewMeFg:s.cardView==='me'?'#fff':'#5d6b62',
      viewPubBg:s.cardView==='public'?'var(--c1,#0d3b2e)':'transparent', viewPubFg:s.cardView==='public'?'#fff':'#5d6b62',

      // onboarding overlay

      // card variants
      isV0:s.variant===0, isV1:s.variant===1, isV2:s.variant===2,
      setV0:()=>setV(0), setV1:()=>setV(1), setV2:()=>setV(2),
      ring0:s.variant===0?gold:'#e2ddd0', ring1:s.variant===1?gold:'#e2ddd0', ring2:s.variant===2?gold:'#e2ddd0',
      ringT0:s.variant===0?'var(--c1,#0d3b2e)':'#9aa39d', ringT1:s.variant===1?'var(--c1,#0d3b2e)':'#9aa39d', ringT2:s.variant===2?'var(--c1,#0d3b2e)':'#9aa39d',
      flip:()=>flip(),
      isFront:!s.flipped, isBack:s.flipped,
      flipHint: s.flipped?'앞면 보기 ↺':'뒷면 보기 ↺',

      // settlement
      toggleSettle:()=>toggleSettle(),
      settleOpen:s.settleOpen,
      settleLabel: s.settleOpen?'상세 계산 접기 ▲':'왜 이 금액인가요? 상세 계산 보기 ▼',

      // modal
      rootRef:rootRef,
      themeOpen:s.modal==='theme', closeTheme:()=>close(), themeList, stop:(e)=>e.stopPropagation(),
      modalOpen:!!m,
      modalTitle:m?m.title:'',
      modalStatus:m?m.status:'',
      modalBody:m?m.body:'',
      modalNote:m?m.note:'',
      closeModal:()=>close()
    };
  })();

  return (
    <div className="mono-stage">
<div ref={v.rootRef} className="mono-frame scr">

      
      <div style={{ height: "50px", flex: "none", display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 26px 8px", position: "relative", zIndex: "30", background: v.statusBg, color: v.statusFg }}>
        <span className="mono" style={{ fontSize: "14px", fontWeight: "500", letterSpacing: ".5px" }}>9:41</span>
        <div style={{ position: "absolute", left: "50%", top: "8px", transform: "translateX(-50%)", width: "118px", height: "30px", background: "#0a0a0b", borderRadius: "18px" }}></div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="7" width="3" height="5" rx="1" fill="currentColor"></rect><rect x="4.5" y="4.5" width="3" height="7.5" rx="1" fill="currentColor"></rect><rect x="9" y="2" width="3" height="10" rx="1" fill="currentColor"></rect><rect x="13.5" y="0" width="3" height="12" rx="1" fill="currentColor" opacity=".4"></rect></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 11.5C5.8 9 2.8 8.6 1 9.8 3 6 5.4 4 8 4s5 2 7 5.8c-1.8-1.2-4.8-.8-7 1.7Z" fill="currentColor" opacity=".5"></path><path d="M8 11.5c-1.3-1.5-2.6-1.7-3.6-1 1-1.7 2.3-2.6 3.6-2.6s2.6.9 3.6 2.6c-1-.7-2.3-.5-3.6 1Z" fill="currentColor"></path></svg>
          <svg width="26" height="13" viewBox="0 0 26 13" fill="none"><rect x="0.5" y="0.5" width="22" height="12" rx="3.2" stroke="currentColor" opacity=".4"></rect><rect x="2" y="2" width="16.5" height="9" rx="1.8" fill="currentColor"></rect><rect x="24" y="4" width="1.8" height="5" rx=".9" fill="currentColor" opacity=".4"></rect></svg>
        </div>
      </div>

      
      <div className="scr" style={{ flex: "1", overflowY: "auto", overflowX: "hidden", position: "relative" }}>

        
        {(v.isHome) && (<>
        <div style={{ padding: "6px 20px 30px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0 16px", gap: "12px" }}>
            <div style={{ minWidth: "0" }}>
              <div style={{ fontSize: "13px", color: "#7d8a82", fontWeight: "600" }}>2026년 6월 18일 목요일</div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "#15211c", marginTop: "2px", whiteSpace: "nowrap" }}>안녕하세요, <span style={{ color: "var(--c1,#0d3b2e)" }}>{v.name}</span>님</div>
            </div>
            <div onClick={v.goMe} style={{ position: "relative", width: "48px", height: "48px", flex: "none", cursor: "pointer" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "16px", background: "linear-gradient(140deg,var(--c3,#1a6b51),var(--c0,#0a2519))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "800", fontSize: "17px", boxShadow: "0 6px 16px -4px rgba(13,59,46,.5), inset 0 0 0 1.5px rgba(232,195,74,.45)" }}>{v.initial}</div>
              <div style={{ position: "absolute", bottom: "-3px", right: "-3px", width: "19px", height: "19px", borderRadius: "7px", background: "var(--a1,#e8c34a)", border: "2.5px solid var(--bg,#f3f1ea)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "900", color: "var(--c1,#0d3b2e)" }}>A</div>
            </div>
          </div>

          
          <div style={{ borderRadius: "24px", background: "linear-gradient(155deg,var(--c2,#114a39) 0%,var(--c0,#0c3528) 55%,var(--c0,#0a2b21) 100%)", padding: "22px", color: "var(--t0,#eaf3ee)", position: "relative", overflow: "hidden", boxShadow: "0 18px 40px -18px rgba(11,42,32,.85)" }}>
            <div style={{ position: "absolute", right: "-40px", top: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "radial-gradient(circle,rgba(232,195,74,.22),transparent 70%)" }}></div>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", position: "relative" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: v.checkDot, boxShadow: `0 0 0 4px ${v.checkDotHalo}` }}></span>
              <span style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--t1,#9fd3bd)", letterSpacing: ".3px", whiteSpace: "nowrap" }}>{v.checkPhase}</span>
            </div>
            <div style={{ fontSize: "19px", fontWeight: "800", marginTop: "11px", position: "relative" }}>힐스테이트 송도 더스카이</div>
            <div style={{ display: "flex", gap: "18px", marginTop: "14px", position: "relative" }}>
              <div><div style={{ fontSize: "11.5px", color: "var(--t2,#7fae9c)", fontWeight: "600" }}>출근</div><div className="mono" style={{ fontSize: "16px", fontWeight: "500", marginTop: "2px" }}>{v.inTime}</div></div>
              <div style={{ width: "1px", background: "rgba(255,255,255,.12)" }}></div>
              <div><div style={{ fontSize: "11.5px", color: "var(--t2,#7fae9c)", fontWeight: "600" }}>직종</div><div style={{ fontSize: "15px", fontWeight: "700", marginTop: "3px", whiteSpace: "nowrap" }}>{v.myJob}</div></div>
              <div style={{ width: "1px", background: "rgba(255,255,255,.12)" }}></div>
              <div><div style={{ fontSize: "11.5px", color: "var(--t2,#7fae9c)", fontWeight: "600" }}>일급</div><div style={{ fontSize: "15px", fontWeight: "700", marginTop: "3px", color: "var(--a2,#f0d98a)" }}>230,000</div></div>
            </div>
            <button onClick={v.toggleCheck} style={{ marginTop: "18px", width: "100%", height: "52px", border: "none", borderRadius: "15px", background: v.checkBtnBg, color: v.checkBtnFg, fontSize: "16px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", position: "relative", overflow: "hidden" }}>{v.checkBtnLabel}</button>
          </div>


          {/* 이번 달 누적 근무·예상 정산액 — 출역·정산 도메인 미구현이라 값은 비움('-'). 카드 UI는 유지(레이아웃 안정), 실데이터 연동 시 표시. (docs/disabled-features.md) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "14px" }}>
            <div style={{ background: "#fff", borderRadius: "18px", padding: "16px", border: "1px solid #ece8dd" }}>
              <div style={{ fontSize: "12px", color: "#8a958d", fontWeight: "600" }}>이번 달 누적 근무</div>
              <div style={{ marginTop: "7px", display: "flex", alignItems: "baseline", gap: "3px" }}><span className="mono" style={{ fontSize: "26px", fontWeight: "500", color: "#c2cac4" }}>-</span></div>
            </div>
            <div style={{ background: "#fff", borderRadius: "18px", padding: "16px", border: "1px solid #ece8dd" }}>
              <div style={{ fontSize: "12px", color: "#8a958d", fontWeight: "600" }}>예상 정산액</div>
              <div style={{ marginTop: "7px", display: "flex", alignItems: "baseline", gap: "2px" }}><span className="mono" style={{ fontSize: "21px", fontWeight: "500", color: "#c2cac4" }}>-</span></div>
            </div>
          </div>

          
          <div onClick={v.goCard} style={{ marginTop: "20px", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "15px", fontWeight: "800", color: "#15211c" }}>내 경력카드</span>
              <span style={{ fontSize: "12.5px", color: "var(--c3,#1a6b51)", fontWeight: "700" }}>전체 보기 →</span>
            </div>
            <div style={{ borderRadius: "20px", padding: "18px", background: "linear-gradient(120deg,var(--c1,#0d3b2e),var(--c0,#0a2b21) 70%)", position: "relative", overflow: "hidden", boxShadow: "0 14px 30px -14px rgba(11,42,32,.8)" }}>
              <div style={{ position: "absolute", inset: "0", background: "repeating-linear-gradient(115deg,transparent 0 14px,rgba(232,195,74,.05) 14px 15px)" }}></div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--t2,#7fae9c)", fontWeight: "700", letterSpacing: "1px" }}>기술 신뢰도</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginTop: "3px" }}><span className="mono" style={{ fontSize: "30px", fontWeight: "500", color: "var(--a1,#e8c34a)" }}>842</span><span style={{ fontSize: "13px", color: "var(--t2,#7fae9c)", fontWeight: "600" }}>/1000</span></div>
                  <div style={{ fontSize: "12px", color: "var(--t1,#cfe3da)", fontWeight: "600", marginTop: "4px" }}>{v.myJob} · A등급 숙련 기술자</div>
                </div>
                <div style={{ width: "54px", height: "54px", borderRadius: "13px", background: "#fff", padding: "5px" }}>{v.qr}</div>
              </div>
            </div>
          </div>

          
          {/* 오늘의 추천 현장 — 아직 노출하지 않음(주석 처리). 추후 복원 가능.
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "24px 0 10px" }}>
            <span style={{ fontSize: "15px", fontWeight: "800", color: "#15211c" }}>오늘의 추천 현장</span>
            <span onClick={v.goJobs} style={{ fontSize: "12.5px", color: "var(--c3,#1a6b51)", fontWeight: "700", cursor: "pointer" }}>더보기</span>
          </div>
          {(v.homeJobs || []).map((job, _i1) => (<React.Fragment key={_i1}>
            <div onClick={job.onOpen} style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "18px", padding: "15px 16px", marginBottom: "10px", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--c1,#0d3b2e)", background: "var(--soft,#e6efe9)", padding: "3px 8px", borderRadius: "7px" }}>{job.trade}</span>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--ai,#9a6b16)", background: "var(--aSoft,#f6edd4)", padding: "3px 8px", borderRadius: "7px" }}>{job.dist}</span>
                </div>
                <div style={{ textAlign: "right" }}><span style={{ fontSize: "11px", color: "#8a958d", fontWeight: "600" }}>일급 </span><span className="mono" style={{ fontSize: "16px", fontWeight: "500", color: "var(--c1,#0d3b2e)" }}>{job.pay}</span></div>
              </div>
              <div style={{ fontSize: "15.5px", fontWeight: "800", color: "#15211c", marginTop: "9px" }}>{job.name}</div>
              <div style={{ fontSize: "12.5px", color: "#7d8a82", fontWeight: "500", marginTop: "3px" }}>{job.loc} · 출역 {job.date} · {job.stay}</div>
            </div>
          </React.Fragment>))}
          */}
        </div>
        </>)}

        
        {(v.isJobs) && (<>
        <div style={{ padding: "6px 0 30px" }}>
          <div style={{ padding: "8px 20px 4px" }}><div style={{ fontSize: "22px", fontWeight: "800", color: "#15211c" }}>일자리</div></div>
          <div style={{ padding: "10px 20px", position: "sticky", top: "0", background: "var(--bg,#f3f1ea)", zIndex: "5" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff", border: "1px solid #ece8dd", borderRadius: "14px", padding: "11px 14px" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="6" stroke="#8a958d" strokeWidth="1.8"></circle><path d="m13 13 3 3" stroke="#8a958d" strokeWidth="1.8" strokeLinecap="round"></path></svg>
              <span style={{ fontSize: "14px", color: "#9aa39d", fontWeight: "500" }}>현장·지역·직종 검색</span>
            </div>
            <div className="scr" style={{ display: "flex", gap: "8px", marginTop: "11px", overflowX: "auto" }}>
              {(v.chips || []).map((chip, _i1) => (<React.Fragment key={_i1}>
                <span style={{ flex: "none", fontSize: "13px", fontWeight: "700", padding: "8px 14px", borderRadius: "11px", background: chip.bg, color: chip.fg, border: `1px solid ${chip.bd}` }}>{chip.label}</span>
              </React.Fragment>))}
            </div>
          </div>

          <div style={{ padding: "4px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", margin: "6px 0 12px" }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1.5 9.9 5.5 14 6 11 9l.8 4.5L8 11.4 4.2 13.5 5 9 2 6l4.1-.5L8 1.5Z" fill="var(--a1,#e8c34a)" stroke="var(--a3,#caa12f)" strokeWidth=".8" strokeLinejoin="round"></path></svg>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--ai,#9a6b16)" }}>{v.name}님 맞춤 추천 12건</span>
            </div>

            {(v.jobs || []).map((job, _i1) => (<React.Fragment key={_i1}>
              <div onClick={job.onOpen} style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "20px", padding: "17px", marginBottom: "13px", boxShadow: "0 4px 14px -8px rgba(13,59,46,.15)", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--c1,#0d3b2e)", background: "var(--soft,#e6efe9)", padding: "4px 9px", borderRadius: "8px" }}>{job.trade}</span>
                    {(job.instant) && (<><span style={{ fontSize: "11px", fontWeight: "700", color: "#b4451f", background: "#f7e3da", padding: "4px 9px", borderRadius: "8px" }}>즉시 출역</span></>)}
                  </div>
                  <div style={{ textAlign: "right" }}><div style={{ fontSize: "10.5px", color: "#8a958d", fontWeight: "600" }}>일급</div><span className="mono" style={{ fontSize: "19px", fontWeight: "500", color: "var(--c1,#0d3b2e)" }}>{job.pay}</span></div>
                </div>
                <div style={{ fontSize: "16.5px", fontWeight: "800", color: "#15211c", marginTop: "11px" }}>{job.name}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "x", gap: "7px 14px", marginTop: "9px" }}>
                  <span style={{ fontSize: "12.5px", color: "#6c7a72", fontWeight: "600" }}>📍 {job.loc} · {job.dist}</span>
                  <span style={{ fontSize: "12.5px", color: "#6c7a72", fontWeight: "600" }}>🗓 출역 {job.date}</span>
                  <span style={{ fontSize: "12.5px", color: "#6c7a72", fontWeight: "600" }}>🛏 {job.stay}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "7px", marginTop: "11px", flexWrap: "wrap" }}>
                  {(job.verified) && (<><span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: "700", color: "var(--c3,#1a6b51)" }}><svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 1 8.7 2.3l2.1-.2.6 2 1.6 1.4-1 1.8.3 2.1-2 .8L8.7 12 7 11l-1.7 1.4-1.8-1.4-2-.8.3-2.1-1-1.8L2.4 4l.6-2 2.1.2L7 1Z" fill="var(--t1,#cfe3da)"></path><path d="m5 7 1.4 1.4L9.4 5.2" stroke="var(--c3,#1a6b51)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"></path></svg>기업 인증</span></>)}
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--ai,#9a6b16)" }}>기업 신뢰도 {job.score}</span>
                  {(job.safety) && (<><span style={{ fontSize: "11px", fontWeight: "700", color: "#b4451f" }}>안전교육 필요</span></>)}
                </div>
                <div style={{ marginTop: "12px", background: "#f6f4ed", borderRadius: "13px", padding: "11px 13px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1.5 9.9 5.5 14 6 11 9l.8 4.5L8 11.4 4.2 13.5 5 9 2 6l4.1-.5L8 1.5Z" fill="var(--a1,#e8c34a)"></path></svg>
                    <span style={{ fontSize: "12px", fontWeight: "800", color: "#15211c" }}>왜 추천됐나요?</span>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#5d6b62", fontWeight: "500", marginTop: "6px", lineHeight: "1.5" }}>{job.why}</div>
                </div>
                <div style={{ display: "flex", gap: "9px", marginTop: "13px" }}>
                  <button onClick={v.openCareer} style={{ flex: "none", width: "48px", height: "46px", borderRadius: "13px", border: "1px solid #e0dccf", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><rect x="3" y="5" width="16" height="13" rx="2.5" stroke="var(--c1,#0d3b2e)" strokeWidth="1.6"></rect><path d="M8 5V4a3 3 0 0 1 6 0v1" stroke="var(--c1,#0d3b2e)" strokeWidth="1.6"></path><path d="M3 10h16" stroke="var(--a1,#e8c34a)" strokeWidth="1.6"></path></svg>
                  </button>
                  <button onClick={job.onOpen} style={{ flex: "1", height: "46px", borderRadius: "13px", border: "none", background: "linear-gradient(135deg,var(--c1,#0d3b2e),var(--c2,#114a39))", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>출역 신청</button>
                </div>
              </div>
            </React.Fragment>))}
          </div>
        </div>
        </>)}

        
        {(v.isCard) && (<>
        <div style={{ padding: "8px 20px 30px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#15211c" }}>경력카드</div>
            <span style={{ fontSize: "11.5px", fontWeight: "700", color: "var(--c3,#1a6b51)", background: "var(--soft,#e6efe9)", padding: "5px 10px", borderRadius: "9px", whiteSpace: "nowrap" }}>MoNo 인증</span>
          </div>

          {!user ? (
            <div style={{ position: "relative", marginTop: "13px" }}>
              <div style={{ filter: "blur(4px)", pointerEvents: "none" }}>
                <div style={{ display: "flex", gap: "4px", background: "#ece8dd", borderRadius: "13px", padding: "4px", marginTop: "13px", opacity: 0.5 }}>
                  <button style={{ flex: "1", height: "38px", border: "none", borderRadius: "10px", background: "#fff", color: "#5d6b62", fontSize: "13px", fontWeight: "800" }}>내 경력카드</button>
                  <button style={{ flex: "1", height: "38px", border: "none", borderRadius: "10px", background: "transparent", color: "#5d6b62", fontSize: "13px", fontWeight: "800" }}>기업이 보는 화면</button>
                </div>
                <div style={{ height: "228px", borderRadius: "22px", border: "1px solid #ece8dd", background: "#fbf7ec", marginTop: "14px" }}></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "11px", marginTop: "18px" }}>
                  <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "16px", height: "60px" }}></div>
                  <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "16px", height: "60px" }}></div>
                  <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "16px", height: "60px" }}></div>
                </div>
                <div style={{ marginTop: "20px", height: "100px", border: "1px dashed #ece8dd", borderRadius: "16px" }}></div>
              </div>
              <div style={{ position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "2" }}>
                <button onClick={() => simulateState("no_profile")} style={{ background: "var(--c1,#0d3b2e)", border: "none", borderRadius: "12px", padding: "12px 24px", color: "#fff", fontSize: "14px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", boxShadow: "0 6px 16px rgba(13,59,46,0.3)" }}>로그인하고 카드 발급받기</button>
              </div>
            </div>
          ) : !hasProfile ? (
            <>
              <div onClick={() => { setOnbStep(0); setOnbJobType([]); setOnbCareerYear(null); setOnbRegion([]); setOpenOnboardingSheet(true); }} style={{ cursor: "pointer", height: "228px", borderRadius: "22px", border: "2px dashed #cdbf9a", background: "#fbf7ec", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", textAlign: "center", marginTop: "14px" }}>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--ai,#9a6b16)" }}>💳 기술 경력카드 발급 대기</div>
                <div style={{ fontSize: "12.5px", color: "#9a8a66", marginTop: "8px", lineHeight: "1.4" }}>프로필을 입력하여 건설 현장의 신뢰 등급을<br/>확인하고 경력카드를 받아보세요.</div>
                <span style={{ display: "inline-block", marginTop: "16px", fontSize: "13px", color: "var(--c1,#0d3b2e)", fontWeight: "800" }}>프로필 작성하고 완성하기 →</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "11px", marginTop: "18px" }}>
                <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "16px", padding: "14px 15px" }}><div style={{ fontSize: "11.5px", color: "#8a958d", fontWeight: "600" }}>현장 경력</div><div style={{ marginTop: "5px" }}><span className="mono" style={{ fontSize: "22px", fontWeight: "500", color: "#15211c" }}>{(careerCards || []).length}</span><span style={{ fontSize: "13px", color: "#8a958d", fontWeight: "600" }}>건</span></div></div>
                <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "16px", padding: "14px 15px" }}><div style={{ fontSize: "11.5px", color: "#8a958d", fontWeight: "600" }}>자격증</div><div style={{ marginTop: "5px" }}><span className="mono" style={{ fontSize: "22px", fontWeight: "500", color: "#15211c" }}>{(certificates || []).length}</span><span style={{ fontSize: "13px", color: "#8a958d", fontWeight: "600" }}>개</span></div></div>
                <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "16px", padding: "14px 15px" }}><div style={{ fontSize: "11.5px", color: "#8a958d", fontWeight: "600" }}>교육</div><div style={{ marginTop: "5px" }}><span className="mono" style={{ fontSize: "22px", fontWeight: "500", color: "#15211c" }}>{(educations || []).length}</span><span style={{ fontSize: "13px", color: "#8a958d", fontWeight: "600" }}>개</span></div></div>
              </div>

              <div style={{ marginTop: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontSize: "15px", fontWeight: "800", color: "#15211c" }}>현장 경력</span>
                  <button type="button" onClick={() => setOpenCareerSheet(true)} style={{ border: "none", background: "none", fontSize: "12.5px", color: "var(--c3,#1a6b51)", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", padding: "4px 2px", WebkitTapHighlightColor: "transparent" }}>+ 경력 추가</button>
                </div>
                {(careerCards || []).length === 0 ? (
                  <button type="button" onClick={() => setOpenCareerSheet(true)} style={{ width: "100%", textAlign: "left", border: "1px dashed #cdbf9a", borderRadius: "16px", background: "#fbf7ec", padding: "16px", cursor: "pointer", fontFamily: "inherit", WebkitTapHighlightColor: "transparent" }}>
                    <div style={{ fontSize: "13.5px", fontWeight: "800", color: "var(--ai,#9a6b16)" }}>참여한 현장을 추가해 보세요</div>
                    <div style={{ fontSize: "12.5px", color: "#9a8a66", fontWeight: "500", marginTop: "4px", lineHeight: "1.5" }}>현장명·기간·역할을 입력하면 공유 프로필에 바로 반영됩니다.</div>
                  </button>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {(careerCards || []).map((c) => (
                      <div key={c.id} style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "16px", padding: "14px 15px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                          <span style={{ fontSize: "14.5px", fontWeight: "800", color: "#15211c", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.siteName}</span>
                          {c.field && (<span style={{ flex: "none", fontSize: "11px", fontWeight: "700", color: "var(--c1,#0d3b2e)", background: "var(--soft,#e6efe9)", padding: "3px 8px", borderRadius: "7px" }}>{c.field}</span>)}
                        </div>
                        {(c.startDate || c.endDate || c.role) && (
                          <div style={{ fontSize: "12.5px", color: "#6c7a72", fontWeight: "600", marginTop: "5px" }}>{[fmtRange(c.startDate, c.endDate), c.role].filter(Boolean).join(" · ")}</div>
                        )}
                        {c.equipment && (<div style={{ fontSize: "12px", color: "#8a958d", fontWeight: "600", marginTop: "4px" }}>사용 장비 · {c.equipment}</div>)}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "9px" }}>
                <button onClick={() => setOpenShareSheet(true)} style={{ height: "52px", border: "none", borderRadius: "15px", background: "linear-gradient(135deg,var(--c1,#0d3b2e),var(--c2,#114a39))", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M14 7a2.5 2.5 0 1 0-2.4-3.1L7.9 6A2.5 2.5 0 1 0 6 10c.6 0 1.2-.2 1.6-.6l3.9 2.3A2.5 2.5 0 1 0 14 13c-.7 0-1.3.3-1.7.7l-3.8-2.2c.1-.3.2-.6.2-.9l3.7-2.2c.4.4 1 .8 1.6.8Z" fill="var(--a1,#e8c34a)"></path></svg>
                  경력카드 공유
                </button>
              </div>
            </>
          ) : (
            <>
          
          <div style={{ display: "flex", gap: "4px", background: "#ece8dd", borderRadius: "13px", padding: "4px", marginTop: "13px" }}>
            <button onClick={v.setMyView} style={{ flex: "1", height: "38px", border: "none", borderRadius: "10px", background: v.viewMeBg, color: v.viewMeFg, fontSize: "13px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>내 경력카드</button>
            <button onClick={v.setPublicView} style={{ flex: "1", height: "38px", border: "none", borderRadius: "10px", background: v.viewPubBg, color: v.viewPubFg, fontSize: "13px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>기업이 보는 화면</button>
          </div>

          {(v.isMyView) && (<>
          <div style={{ fontSize: "12.5px", color: "#7d8a82", fontWeight: "500", margin: "12px 0 0" }}>카드를 탭하면 뒷면이 보입니다 · 3가지 디자인 시안 중 선택</div>

          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "9px", margin: "16px 0 6px" }}>

            <button onClick={v.setV0} style={{ border: "none", padding: "0", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "100%", height: "62px", borderRadius: "11px", padding: "3px", background: v.ring0 }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "9px", padding: "7px 8px", background: "linear-gradient(150deg,var(--c2,#114a39),var(--c0,#0a2519))", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ position: "absolute", inset: "0", background: "repeating-linear-gradient(118deg,transparent 0 6px,rgba(232,195,74,.05) 6px 7px)" }}></div>
                  <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "3px" }}><div style={{ width: "6px", height: "6px", borderRadius: "2px", background: "var(--a1,#e8c34a)" }}></div><span style={{ fontSize: "6.5px", fontWeight: "800", color: "var(--t0,#f0ede4)", letterSpacing: ".3px" }}>MoNo</span></div>
                    <div style={{ width: "13px", height: "9px", borderRadius: "2px", background: "linear-gradient(135deg,var(--a2,#f0d98a),var(--a3,#caa12f))" }}></div>
                  </div>
                  <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", gap: "3px", marginBottom: "3px" }}><div style={{ width: "14px", height: "2px", borderRadius: "1px", background: "rgba(234,243,238,.7)" }}></div><div style={{ width: "14px", height: "2px", borderRadius: "1px", background: "rgba(234,243,238,.7)" }}></div><div style={{ width: "14px", height: "2px", borderRadius: "1px", background: "rgba(234,243,238,.7)" }}></div></div>
                    <div style={{ fontSize: "6px", fontWeight: "700", color: "var(--t1,#9fd3bd)" }}>{v.name} · A등급</div>
                  </div>
                </div>
              </div>
              <span style={{ fontSize: "11px", fontWeight: "800", color: v.ringT0 }}>정통</span>
            </button>

            <button onClick={v.setV1} style={{ border: "none", padding: "0", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "100%", height: "62px", borderRadius: "11px", padding: "3px", background: v.ring1 }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "9px", padding: "7px 8px", background: "linear-gradient(160deg,#1a1a1a,#080808)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ position: "absolute", left: "0", top: "0", bottom: "0", width: "3px", background: "linear-gradient(180deg,var(--a2,#f0d98a),var(--a3,#caa12f))" }}></div>
                  <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "3px", paddingLeft: "3px" }}><div style={{ width: "6px", height: "6px", borderRadius: "2px", background: "var(--a1,#e8c34a)" }}></div><span style={{ fontSize: "6.5px", fontWeight: "800", color: "#fff" }}>MoNo</span></div>
                  <div style={{ position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingLeft: "3px" }}>
                    <span style={{ fontSize: "26px", lineHeight: ".8", fontWeight: "900", color: "var(--a1,#e8c34a)", fontFamily: "'DM Mono',monospace" }}>A</span>
                    <span style={{ fontSize: "6px", fontWeight: "700", color: "#bdbdbd" }}>{v.name}</span>
                  </div>
                </div>
              </div>
              <span style={{ fontSize: "11px", fontWeight: "800", color: v.ringT1 }}>대담</span>
            </button>

            <button onClick={v.setV2} style={{ border: "none", padding: "0", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "100%", height: "62px", borderRadius: "11px", padding: "3px", background: v.ring2 }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "9px", padding: "7px 8px", background: "linear-gradient(125deg,var(--c1,#0d3b2e),var(--c3,#1a6b51))", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ position: "absolute", right: "-7px", top: "-7px", width: "22px", height: "22px", borderRadius: "50%", background: "conic-gradient(from 200deg,rgba(232,195,74,.6),rgba(159,211,189,.5),rgba(232,195,74,.6))", filter: "blur(.5px)" }}></div>
                  <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "3px" }}><div style={{ width: "6px", height: "6px", borderRadius: "2px", background: "var(--a1,#e8c34a)" }}></div><span style={{ fontSize: "6.5px", fontWeight: "800", color: "#fff" }}>MoNo</span></div>
                    <span style={{ fontSize: "9px", fontWeight: "700", color: "var(--a1,#e8c34a)", fontFamily: "'DM Mono',monospace" }}>842</span>
                  </div>
                  <div style={{ position: "relative", display: "flex", alignItems: "flex-end", gap: "1.5px", height: "16px" }}>
                    <div style={{ flex: "1", height: "55%", background: "rgba(255,255,255,.3)", borderRadius: "1px" }}></div>
                    <div style={{ flex: "1", height: "80%", background: "rgba(232,195,74,.6)", borderRadius: "1px" }}></div>
                    <div style={{ flex: "1", height: "65%", background: "rgba(255,255,255,.3)", borderRadius: "1px" }}></div>
                    <div style={{ flex: "1", height: "95%", background: "var(--a1,#e8c34a)", borderRadius: "1px" }}></div>
                    <div style={{ flex: "1", height: "70%", background: "rgba(255,255,255,.3)", borderRadius: "1px" }}></div>
                    <div style={{ flex: "1", height: "85%", background: "rgba(232,195,74,.6)", borderRadius: "1px" }}></div>
                  </div>
                </div>
              </div>
              <span style={{ fontSize: "11px", fontWeight: "800", color: v.ringT2 }}>실험적</span>
            </button>

          </div>

          
          <div onClick={v.flip} style={{ marginTop: "14px", cursor: "pointer", height: "228px", position: "relative" }}>
              
              {(v.isFront) && (<>
              <div style={{ height: "100%" }}>
                {(v.isV0) && (<>
                  <div style={{ width: "100%", height: "100%", borderRadius: "22px", padding: "22px", background: "linear-gradient(150deg,var(--c2,#114a39) 0%,var(--c0,#0c3528) 55%,var(--c0,#0a2519) 100%)", position: "relative", overflow: "hidden", boxShadow: "0 22px 44px -18px rgba(10,37,25,.9)", border: "1px solid rgba(232,195,74,.22)" }}>
                    <div style={{ position: "absolute", inset: "0", background: "repeating-linear-gradient(118deg,transparent 0 12px,rgba(232,195,74,.04) 12px 13px), radial-gradient(120% 80% at 80% 0%,rgba(232,195,74,.14),transparent 55%)" }}></div>
                    <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}><div style={{ width: "17px", height: "17px", borderRadius: "5px", background: "linear-gradient(135deg,var(--a2,#f0d98a),var(--a3,#caa12f))", display: "flex", alignItems: "center", justifyContent: "center", padding: "3px" }}><svg width="100%" height="100%" viewBox="0 0 28 28" fill="none"><path d="M5 21V9l9 7 9-7v12" stroke="var(--c0,#0a2519)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"></path></svg></div><span style={{ color: "var(--t0,#f0ede4)", fontWeight: "800", fontSize: "15px", letterSpacing: ".5px" }}>MoNo</span></div>
                        <div style={{ fontSize: "10px", color: "var(--t2,#7fae9c)", fontWeight: "700", letterSpacing: "2px", marginTop: "7px" }}>기술 신용카드</div>
                      </div>
                      <div style={{ width: "42px", height: "31px", borderRadius: "7px", background: "linear-gradient(135deg,var(--a2,#f0d98a),var(--a3,#caa12f))", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", inset: "0", background: "repeating-linear-gradient(0deg,transparent 0 5px,rgba(13,59,46,.25) 5px 6px), repeating-linear-gradient(90deg,transparent 0 9px,rgba(13,59,46,.2) 9px 10px)" }}></div></div>
                    </div>
                    <div className="mono" style={{ position: "relative", color: "var(--t0,#eaf3ee)", fontSize: "17px", letterSpacing: "3px", marginTop: "20px" }}>5071 2240 8819 0412</div>
                    <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "16px" }}>
                      <div>
                        <div style={{ fontSize: "9.5px", color: "var(--t2,#7fae9c)", fontWeight: "700", letterSpacing: "1px" }}>기술자</div>
                        <div style={{ fontSize: "17px", color: "#fff", fontWeight: "800", marginTop: "2px" }}>{v.name} · {v.myJob}</div>
                        <div style={{ fontSize: "11px", color: "var(--t1,#9fd3bd)", fontWeight: "600", marginTop: "3px" }}>발급 2024.03 · 유효 A등급</div>
                      </div>
                      <div style={{ width: "50px", height: "50px", borderRadius: "10px", background: "#fff", padding: "4px" }}>{v.qr}</div>
                    </div>
                    <div style={{ position: "absolute", top: "0", bottom: "0", width: "60px", background: "linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)", animation: "shine 5s ease-in-out infinite" }}></div>
                  </div>
                </>)}

                {(v.isV1) && (<>
                  <div style={{ width: "100%", height: "100%", borderRadius: "22px", padding: "22px", background: "linear-gradient(160deg,#1a1a1a,#080808)", position: "relative", overflow: "hidden", boxShadow: "0 22px 44px -18px rgba(0,0,0,.85)", border: "1px solid #2a2a2a" }}>
                    <div style={{ position: "absolute", right: "-14px", bottom: "-44px", fontSize: "210px", fontWeight: "900", lineHeight: "1", color: "transparent", WebkitTextStroke: "1.5px rgba(232,195,74,.16)", fontFamily: "'DM Mono',monospace" }}>A</div>
                    <div style={{ position: "absolute", left: "0", top: "0", bottom: "0", width: "8px", background: "linear-gradient(180deg,var(--a2,#f0d98a),var(--a3,#caa12f))" }}></div>
                    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "7px" }}><div style={{ width: "16px", height: "16px", borderRadius: "5px", background: "linear-gradient(135deg,var(--a2,#f0d98a),var(--a3,#caa12f))", display: "flex", alignItems: "center", justifyContent: "center", padding: "3px" }}><svg width="100%" height="100%" viewBox="0 0 28 28" fill="none"><path d="M5 21V9l9 7 9-7v12" stroke="#0a140f" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"></path></svg></div><span style={{ color: "#fff", fontWeight: "800", fontSize: "14px" }}>MoNo</span><span style={{ fontSize: "10px", color: "#6b6b6b", fontWeight: "700", letterSpacing: "2px", marginLeft: "2px" }}>TECH CARD</span></div>
                    <div style={{ position: "relative", marginTop: "30px" }}>
                      <div style={{ fontSize: "11px", color: "#8a8a8a", fontWeight: "700", letterSpacing: "1px" }}>기술 등급</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "2px" }}><span style={{ fontSize: "54px", fontWeight: "900", color: "var(--a1,#e8c34a)", lineHeight: ".9", fontFamily: "'DM Mono',monospace" }}>A</span><span style={{ fontSize: "14px", color: "#e8e8e8", fontWeight: "700" }}>숙련 기술자</span></div>
                    </div>
                    <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "18px" }}>
                      <div>
                        <div style={{ fontSize: "18px", color: "#fff", fontWeight: "800" }}>{v.name}</div>
                        <div className="mono" style={{ fontSize: "12px", color: "#9a9a9a", letterSpacing: "2px", marginTop: "4px" }}>0412 · {v.myJob}</div>
                      </div>
                      <div style={{ width: "46px", height: "46px", borderRadius: "9px", background: "#fff", padding: "4px" }}>{v.qr}</div>
                    </div>
                  </div>
                </>)}

                {(v.isV2) && (<>
                  <div style={{ width: "100%", height: "100%", borderRadius: "22px", padding: "20px 22px", background: "linear-gradient(125deg,var(--c1,#0d3b2e) 0%,#13533f 60%,var(--c3,#1a6b51) 100%)", position: "relative", overflow: "hidden", boxShadow: "0 22px 44px -18px rgba(10,37,25,.9)" }}>
                    <div style={{ position: "absolute", right: "-30px", top: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: "conic-gradient(from 200deg,rgba(232,195,74,.55),rgba(159,211,189,.4),rgba(232,195,74,.55))", filter: "blur(2px)", opacity: ".55" }}></div>
                    <div style={{ position: "absolute", left: "-40px", top: "30px", right: "-40px", height: "74px", background: "linear-gradient(90deg,transparent,rgba(232,195,74,.18),transparent)", transform: "rotate(-8deg)" }}></div>
                    <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}><div style={{ width: "16px", height: "16px", borderRadius: "5px", background: "linear-gradient(135deg,var(--a2,#f0d98a),var(--a3,#caa12f))", display: "flex", alignItems: "center", justifyContent: "center", padding: "3px" }}><svg width="100%" height="100%" viewBox="0 0 28 28" fill="none"><path d="M5 21V9l9 7 9-7v12" stroke="#0a140f" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"></path></svg></div><span style={{ color: "#fff", fontWeight: "800", fontSize: "14px" }}>MoNo</span></div>
                      <div style={{ textAlign: "right" }}><div style={{ fontSize: "9px", color: "var(--t1,#9fd3bd)", fontWeight: "700", letterSpacing: "1px" }}>신뢰도</div><div className="mono" style={{ fontSize: "24px", fontWeight: "500", color: "var(--a1,#e8c34a)", lineHeight: "1" }}>842</div></div>
                    </div>
                    
                    <div style={{ position: "relative", display: "flex", alignItems: "flex-end", gap: "5px", height: "38px", marginTop: "14px" }}>
                      <div style={{ flex: "1", height: "55%", background: "rgba(255,255,255,.25)", borderRadius: "3px" }}></div>
                      <div style={{ flex: "1", height: "78%", background: "rgba(232,195,74,.5)", borderRadius: "3px" }}></div>
                      <div style={{ flex: "1", height: "65%", background: "rgba(255,255,255,.25)", borderRadius: "3px" }}></div>
                      <div style={{ flex: "1", height: "92%", background: "var(--a1,#e8c34a)", borderRadius: "3px" }}></div>
                      <div style={{ flex: "1", height: "70%", background: "rgba(255,255,255,.25)", borderRadius: "3px" }}></div>
                      <div style={{ flex: "1", height: "84%", background: "rgba(232,195,74,.5)", borderRadius: "3px" }}></div>
                      <div style={{ flex: "1", height: "60%", background: "rgba(255,255,255,.25)", borderRadius: "3px" }}></div>
                    </div>
                    <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "14px" }}>
                      <div>
                        <div style={{ fontSize: "17px", color: "#fff", fontWeight: "800" }}>{v.name} · {v.myJob}</div>
                        <div className="mono" style={{ fontSize: "11px", color: "#bfe0d3", letterSpacing: "1.5px", marginTop: "4px" }}>A · 412일 · 37현장</div>
                      </div>
                      <div style={{ width: "46px", height: "46px", borderRadius: "10px", background: "rgba(255,255,255,.95)", padding: "4px" }}>{v.qr}</div>
                    </div>
                  </div>
                </>)}
              </div>

              </>)}

              
              {(v.isBack) && (<>
              <div style={{ height: "100%" }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "22px", background: "linear-gradient(160deg,var(--c0,#0c3528),var(--c0,#0a2519))", padding: "18px 20px", color: "var(--t0,#eaf3ee)", position: "relative", overflow: "hidden", boxShadow: "0 22px 44px -18px rgba(10,37,25,.9)", border: "1px solid rgba(232,195,74,.18)" }}>
                  <div style={{ position: "absolute", left: "0", right: "0", top: "16px", height: "34px", background: "#06140f" }}></div>
                  <div style={{ position: "relative", marginTop: "62px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                    <div><div style={{ fontSize: "9.5px", color: "var(--t2,#7fae9c)", fontWeight: "700" }}>누적 근무일</div><div className="mono" style={{ fontSize: "18px", color: "#fff", fontWeight: "500" }}>412</div></div>
                    <div><div style={{ fontSize: "9.5px", color: "var(--t2,#7fae9c)", fontWeight: "700" }}>참여 현장</div><div className="mono" style={{ fontSize: "18px", color: "#fff", fontWeight: "500" }}>37</div></div>
                    <div><div style={{ fontSize: "9.5px", color: "var(--t2,#7fae9c)", fontWeight: "700" }}>안전교육</div><div className="mono" style={{ fontSize: "18px", color: "var(--a1,#e8c34a)", fontWeight: "500" }}>100%</div></div>
                  </div>
                  <div style={{ position: "relative", marginTop: "14px" }}><div style={{ fontSize: "9.5px", color: "var(--t2,#7fae9c)", fontWeight: "700", marginBottom: "6px" }}>주요 기술</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--t1,#cfe3da)", background: "rgba(255,255,255,.08)", padding: "4px 9px", borderRadius: "7px" }}>형틀</span>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--t1,#cfe3da)", background: "rgba(255,255,255,.08)", padding: "4px 9px", borderRadius: "7px" }}>갱폼</span>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--t1,#cfe3da)", background: "rgba(255,255,255,.08)", padding: "4px 9px", borderRadius: "7px" }}>알폼</span>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--t1,#cfe3da)", background: "rgba(255,255,255,.08)", padding: "4px 9px", borderRadius: "7px" }}>철근</span>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--t1,#cfe3da)", background: "rgba(255,255,255,.08)", padding: "4px 9px", borderRadius: "7px" }}>콘크리트</span>
                    </div>
                  </div>
                  <div style={{ position: "relative", marginTop: "14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: "11px" }}>
                    <div style={{ fontSize: "10.5px", color: "var(--t1,#9fd3bd)", fontWeight: "600" }}>인증기관 연동 · <span style={{ color: "var(--a1,#e8c34a)", fontWeight: "700" }}>협의 중</span></div>
                    <div className="mono" style={{ fontSize: "10px", color: "var(--t2,#7fae9c)", letterSpacing: "1px" }}>ID 5071-0412</div>
                  </div>
                </div>
              </div>
              </>)}
          </div>


          {/* 기술 통계 — 실데이터 집계(현장 경력·자격증·교육 보유 수). 공개 프로필(PublicProfileView)의 stat 3종과 동일 지표. */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "11px", marginTop: "18px" }}>
            <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "16px", padding: "14px 15px" }}><div style={{ fontSize: "11.5px", color: "#8a958d", fontWeight: "600" }}>현장 경력</div><div style={{ marginTop: "5px" }}><span className="mono" style={{ fontSize: "22px", fontWeight: "500", color: "#15211c" }}>{(careerCards || []).length}</span><span style={{ fontSize: "13px", color: "#8a958d", fontWeight: "600" }}>건</span></div></div>
            <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "16px", padding: "14px 15px" }}><div style={{ fontSize: "11.5px", color: "#8a958d", fontWeight: "600" }}>자격증</div><div style={{ marginTop: "5px" }}><span className="mono" style={{ fontSize: "22px", fontWeight: "500", color: "#15211c" }}>{(certificates || []).length}</span><span style={{ fontSize: "13px", color: "#8a958d", fontWeight: "600" }}>개</span></div></div>
            <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "16px", padding: "14px 15px" }}><div style={{ fontSize: "11.5px", color: "#8a958d", fontWeight: "600" }}>교육</div><div style={{ marginTop: "5px" }}><span className="mono" style={{ fontSize: "22px", fontWeight: "500", color: "#15211c" }}>{(educations || []).length}</span><span style={{ fontSize: "13px", color: "#8a958d", fontWeight: "600" }}>개</span></div></div>
          </div>
          {/* 총 근무일·누적 정산액·기술 신뢰도 — MVP에 데이터 소스 없음(근무일수/정산/신뢰도 점수 엔진 미구현)이라 비노출. 실데이터 연동 후 아래를 복원. (docs/disabled-features.md)
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "11px", marginTop: "18px" }}>
            <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "16px", padding: "14px 15px" }}><div style={{ fontSize: "11.5px", color: "#8a958d", fontWeight: "600" }}>총 근무일</div><div style={{ marginTop: "5px" }}><span className="mono" style={{ fontSize: "22px", fontWeight: "500", color: "#15211c" }}>412</span><span style={{ fontSize: "13px", color: "#8a958d", fontWeight: "600" }}>일</span></div></div>
            <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "16px", padding: "14px 15px" }}><div style={{ fontSize: "11.5px", color: "#8a958d", fontWeight: "600" }}>참여 현장</div><div style={{ marginTop: "5px" }}><span className="mono" style={{ fontSize: "22px", fontWeight: "500", color: "#15211c" }}>37</span><span style={{ fontSize: "13px", color: "#8a958d", fontWeight: "600" }}>곳</span></div></div>
            <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "16px", padding: "14px 15px" }}><div style={{ fontSize: "11.5px", color: "#8a958d", fontWeight: "600" }}>누적 정산액</div><div style={{ marginTop: "5px" }}><span style={{ fontSize: "13px", color: "var(--c1,#0d3b2e)", fontWeight: "700" }}>₩</span><span className="mono" style={{ fontSize: "18px", fontWeight: "500", color: "var(--c1,#0d3b2e)" }}>1.48억</span></div></div>
            <div style={{ background: "linear-gradient(135deg,var(--c1,#0d3b2e),var(--c2,#114a39))", borderRadius: "16px", padding: "14px 15px" }}><div style={{ fontSize: "11.5px", color: "var(--t1,#9fd3bd)", fontWeight: "600" }}>기술 신뢰도</div><div style={{ marginTop: "5px", display: "flex", alignItems: "baseline", gap: "3px" }}><span className="mono" style={{ fontSize: "22px", fontWeight: "500", color: "var(--a1,#e8c34a)" }}>842</span><span style={{ fontSize: "12px", color: "var(--t2,#7fae9c)", fontWeight: "600" }}>/1000</span></div></div>
          </div>
          */}


          {/* 현장 경력 — 사용자가 직접 입력·관리. 공유 프로필(/p/:id)의 "현장 경력"에 그대로 반영된다. */}
          <div style={{ marginTop: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "15px", fontWeight: "800", color: "#15211c" }}>현장 경력</span>
              <button type="button" onClick={() => setOpenCareerSheet(true)} style={{ border: "none", background: "none", fontSize: "12.5px", color: "var(--c3,#1a6b51)", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", padding: "4px 2px", WebkitTapHighlightColor: "transparent" }}>+ 경력 추가</button>
            </div>
            {(careerCards || []).length === 0 ? (
              <button type="button" onClick={() => setOpenCareerSheet(true)} style={{ width: "100%", textAlign: "left", border: "1px dashed #cdbf9a", borderRadius: "16px", background: "#fbf7ec", padding: "16px", cursor: "pointer", fontFamily: "inherit", WebkitTapHighlightColor: "transparent" }}>
                <div style={{ fontSize: "13.5px", fontWeight: "800", color: "var(--ai,#9a6b16)" }}>참여한 현장을 추가해 보세요</div>
                <div style={{ fontSize: "12.5px", color: "#9a8a66", fontWeight: "500", marginTop: "4px", lineHeight: "1.5" }}>현장명·기간·역할을 입력하면 공유 프로필에 바로 반영됩니다.</div>
              </button>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {(careerCards || []).map((c) => (
                  <div key={c.id} style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "16px", padding: "14px 15px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <span style={{ fontSize: "14.5px", fontWeight: "800", color: "#15211c", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.siteName}</span>
                      {c.field && (<span style={{ flex: "none", fontSize: "11px", fontWeight: "700", color: "var(--c1,#0d3b2e)", background: "var(--soft,#e6efe9)", padding: "3px 8px", borderRadius: "7px" }}>{c.field}</span>)}
                    </div>
                    {(c.startDate || c.endDate || c.role) && (
                      <div style={{ fontSize: "12.5px", color: "#6c7a72", fontWeight: "600", marginTop: "5px" }}>{[fmtRange(c.startDate, c.endDate), c.role].filter(Boolean).join(" · ")}</div>
                    )}
                    {c.equipment && (<div style={{ fontSize: "12px", color: "#8a958d", fontWeight: "600", marginTop: "4px" }}>사용 장비 · {c.equipment}</div>)}
                  </div>
                ))}
              </div>
            )}
          </div>


          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "9px" }}>
            <button onClick={() => setOpenShareSheet(true)} style={{ height: "52px", border: "none", borderRadius: "15px", background: "linear-gradient(135deg,var(--c1,#0d3b2e),var(--c2,#114a39))", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M14 7a2.5 2.5 0 1 0-2.4-3.1L7.9 6A2.5 2.5 0 1 0 6 10c.6 0 1.2-.2 1.6-.6l3.9 2.3A2.5 2.5 0 1 0 14 13c-.7 0-1.3.3-1.7.7l-3.8-2.2c.1-.3.2-.6.2-.9l3.7-2.2c.4.4 1 .8 1.6.8Z" fill="var(--a1,#e8c34a)"></path></svg>
              경력카드 공유
            </button>
            {/* 공개 범위 설정·금융 연계 — 아직 노출하지 않음(주석 처리). 추후 복원 가능.
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px" }}>
              <button onClick={v.openScope} style={{ height: "48px", border: "1px solid #e0dccf", borderRadius: "14px", background: "#fff", color: "#15211c", fontSize: "13.5px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer" }}>공개 범위 설정</button>
              <button onClick={v.openFinance} style={{ height: "48px", border: "1px solid #e0dccf", borderRadius: "14px", background: "#fff", color: "#15211c", fontSize: "13.5px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer" }}>금융 연계</button>
            </div>
            */}
          </div>
          </>)}

          
          {(v.isPublicView) && (<>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--ai,#9a6b16)", fontWeight: "700", background: "var(--aSoft,#f6edd4)", borderRadius: "11px", padding: "10px 13px", margin: "13px 0 0" }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 2 3 4v3.5c0 3 2.1 5.2 5 6 2.9-.8 5-3 5-6V4L8 2Z" stroke="var(--ai,#9a6b16)" strokeWidth="1.4" strokeLinejoin="round"></path></svg>
            기업·외부인에게 보이는 공개용 프로필 · 민감 정보는 자동 마스킹됩니다
          </div>

          <div style={{ marginTop: "13px", borderRadius: "22px", padding: "20px", background: "linear-gradient(150deg,var(--c2,#114a39),var(--c0,#0a2519))", color: "var(--t0,#eaf3ee)", position: "relative", overflow: "hidden", boxShadow: "0 18px 40px -20px rgba(10,37,25,.8)" }}>
            <div style={{ position: "absolute", right: "-30px", top: "-30px", width: "130px", height: "130px", borderRadius: "50%", background: "radial-gradient(circle,rgba(232,195,74,.18),transparent 70%)" }}></div>
            <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}><div style={{ width: "16px", height: "16px", borderRadius: "5px", background: "linear-gradient(135deg,var(--a2,#f0d98a),var(--a3,#caa12f))", display: "flex", alignItems: "center", justifyContent: "center", padding: "3px" }}><svg width="100%" height="100%" viewBox="0 0 28 28" fill="none"><path d="M5 21V9l9 7 9-7v12" stroke="#0a140f" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"></path></svg></div><span style={{ color: "#fff", fontWeight: "800", fontSize: "14px" }}>MoNo</span><span style={{ fontSize: "10px", fontWeight: "700", color: "var(--c0,#0a2519)", background: "var(--a1,#e8c34a)", padding: "2px 7px", borderRadius: "6px" }}>인증 기술자</span></div>
                <div style={{ fontSize: "21px", fontWeight: "800", marginTop: "13px" }}>{v.maskedName}</div>
                <div style={{ fontSize: "12.5px", color: "var(--t1,#9fd3bd)", fontWeight: "600", marginTop: "3px" }}>{v.myJob} · A등급 숙련 기술자</div>
              </div>
              <div style={{ width: "54px", height: "54px", borderRadius: "12px", background: "#fff", padding: "5px", flex: "none" }}>{v.qr}</div>
            </div>
            <div style={{ position: "relative", display: "flex", gap: "16px", marginTop: "18px" }}>
              <div><div style={{ fontSize: "10px", color: "var(--t2,#7fae9c)", fontWeight: "700" }}>총 근무일</div><div className="mono" style={{ fontSize: "17px", fontWeight: "500", marginTop: "2px" }}>412일</div></div>
              <div style={{ width: "1px", background: "rgba(255,255,255,.12)" }}></div>
              <div><div style={{ fontSize: "10px", color: "var(--t2,#7fae9c)", fontWeight: "700" }}>출역 신뢰도</div><div className="mono" style={{ fontSize: "17px", fontWeight: "500", marginTop: "2px", color: "var(--a1,#e8c34a)" }}>98.5%</div></div>
              <div style={{ width: "1px", background: "rgba(255,255,255,.12)" }}></div>
              <div><div style={{ fontSize: "10px", color: "var(--t2,#7fae9c)", fontWeight: "700" }}>기업 평가</div><div className="mono" style={{ fontSize: "17px", fontWeight: "500", marginTop: "2px" }}>4.8</div></div>
            </div>
          </div>

          <div style={{ marginTop: "14px", background: "#fff", border: "1px solid #ece8dd", borderRadius: "18px", padding: "6px 16px" }}>
            <div style={{ fontSize: "11px", fontWeight: "800", color: "#9aa39d", padding: "11px 0 3px", letterSpacing: ".3px" }}>공개 정보</div>
            {(v.publicRows || []).map((r, _i1) => (<React.Fragment key={_i1}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderTop: "1px solid #f1ede2" }}>
                <span style={{ fontSize: "13.5px", color: "#5d6b62", fontWeight: "600" }}>{r.k}</span>
                <span style={{ fontSize: "13.5px", color: "#15211c", fontWeight: "700" }}>{r.v}</span>
              </div>
            </React.Fragment>))}
          </div>

          <div style={{ marginTop: "12px", background: "#f6f4ed", border: "1px dashed #ddd6c6", borderRadius: "16px", padding: "6px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "800", color: "#9a8a66", padding: "11px 0 3px" }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="2.5" y="6" width="9" height="6.5" rx="1.4" stroke="#9a8a66" strokeWidth="1.3"></rect><path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="#9a8a66" strokeWidth="1.3"></path></svg>
              비공개 · 근로자 동의 시에만 공개
            </div>
            {(v.privateRows || []).map((r, _i1) => (<React.Fragment key={_i1}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #ece6d6" }}>
                <span style={{ fontSize: "13px", color: "#9a958a", fontWeight: "600" }}>{r}</span>
                <span style={{ fontSize: "12px", color: "#b0a894", fontWeight: "700" }}>🔒 비공개</span>
              </div>
            </React.Fragment>))}
          </div>

          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "9px" }}>
            <button onClick={v.openDetailReq} style={{ height: "52px", border: "none", borderRadius: "15px", background: "linear-gradient(135deg,var(--c1,#0d3b2e),var(--c2,#114a39))", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>상세보기 요청 (기업)</button>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px" }}>
              <button onClick={v.openDetailReq} style={{ height: "48px", border: "1px solid #e0dccf", borderRadius: "14px", background: "#fff", color: "#15211c", fontSize: "13.5px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer" }}>출역 요청</button>
              <button onClick={v.openDetailReq} style={{ height: "48px", border: "1px solid #e0dccf", borderRadius: "14px", background: "#fff", color: "#15211c", fontSize: "13.5px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer" }}>채용 제안</button>
            </div>
          </div>
          </>)}
          </>
          )}
        </div>
        </>)}

        
        {(v.isWork) && (<>
        <div style={{ padding: "8px 20px 30px" }}>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#15211c" }}>출역 · 정산</div>

          {!user ? (
            <div style={{ position: "relative", marginTop: "14px" }}>
              <div style={{ filter: "blur(4px)", pointerEvents: "none" }}>
                <div style={{ borderRadius: "20px", background: "linear-gradient(150deg,var(--c2,#114a39),var(--c0,#0a2b21))", padding: "18px", color: "var(--t0,#eaf3ee)", height: "120px" }}></div>
                <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "20px", padding: "18px", marginTop: "14px", height: "200px" }}></div>
              </div>
              <div style={{ position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "2" }}>
                <button onClick={() => simulateState("no_profile")} style={{ background: "var(--c1,#0d3b2e)", border: "none", borderRadius: "12px", padding: "12px 24px", color: "#fff", fontSize: "14px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", boxShadow: "0 6px 16px rgba(13,59,46,0.3)" }}>
                  로그인하고 출역 상태 확인하기
                </button>
              </div>
            </div>
          ) : !hasProfile ? (
            <div onClick={() => { setOnbStep(0); setOnbJobType([]); setOnbCareerYear(null); setOnbRegion([]); setOpenOnboardingSheet(true); }} style={{ cursor: "pointer", marginTop: "14px", borderRadius: "20px", border: "2px dashed #cdbf9a", background: "#fbf7ec", padding: "30px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>📅</div>
              <div style={{ fontSize: "15px", fontWeight: "800", color: "var(--ai,#9a6b16)" }}>예정된 출역이 없습니다</div>
              <div style={{ fontSize: "12.5px", color: "#9a8a66", marginTop: "6px", lineHeight: "1.4" }}>프로필 작성 후 건설 현장에 출역을 신청할 수 있습니다.</div>
              <span style={{ display: "inline-block", marginTop: "16px", fontSize: "13px", color: "var(--c1,#0d3b2e)", fontWeight: "800" }}>프로필 작성하고 신청하기 →</span>
            </div>
          ) : (
            <>

          <div style={{ marginTop: "14px", borderRadius: "20px", background: "linear-gradient(150deg,var(--c2,#114a39),var(--c0,#0a2b21))", padding: "18px", color: "var(--t0,#eaf3ee)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: "-30px", top: "-30px", width: "130px", height: "130px", borderRadius: "50%", background: "radial-gradient(circle,rgba(232,195,74,.2),transparent 70%)" }}></div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--t1,#9fd3bd)", position: "relative" }}>힐스테이트 송도 더스카이</div>
            <div style={{ fontSize: "11.5px", color: "var(--t2,#7fae9c)", position: "relative", marginTop: "2px" }}>2026.06.18 · {v.myJob}</div>
            <button onClick={v.toggleCheck} style={{ marginTop: "14px", width: "100%", height: "54px", border: "none", borderRadius: "14px", background: v.checkBtnBg, color: v.checkBtnFg, fontSize: "16px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", position: "relative" }}>{v.checkBtnLabel}</button>
            <div style={{ fontSize: "11px", color: "var(--t2,#7fae9c)", textAlign: "center", marginTop: "9px", position: "relative" }}>QR 또는 위치 기반 출근 체크 · GPS 인증됨</div>
          </div>

          
          <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "20px", padding: "18px", marginTop: "14px" }}>
            <div style={{ fontSize: "14px", fontWeight: "800", color: "#15211c", marginBottom: "14px" }}>출역 진행 상태</div>
            {(v.steps || []).map((st, _i1) => (<React.Fragment key={_i1}>
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: st.dotBg, border: `2px solid ${st.dotBd}`, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{st.dotInner}</div>
                  {(st.line) && (<><div style={{ width: "2px", flex: "1", minHeight: "14px", background: st.lineBg }}></div></>)}
                </div>
                <div style={{ paddingBottom: "14px", flex: "1" }}>
                  <div style={{ fontSize: "14px", fontWeight: st.weight, color: st.textColor }}>{st.label}</div>
                  {(st.timeShow) && (<><div className="mono" style={{ fontSize: "11.5px", color: "#8a958d", marginTop: "2px" }}>{st.time}</div></>)}
                </div>
              </div>
            </React.Fragment>))}
          </div>

          
          <div style={{ fontSize: "15px", fontWeight: "800", color: "#15211c", margin: "22px 0 11px" }}>정산 예정</div>
          <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "20px", padding: "18px", boxShadow: "0 6px 18px -10px rgba(13,59,46,.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#15211c" }}>힐스테이트 송도 · 6월</div>
                <div style={{ fontSize: "11.5px", color: "#8a958d", marginTop: "2px" }}>지급 예정 2026.07.05</div>
              </div>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--ai,#9a6b16)", background: "var(--aSoft,#f6edd4)", padding: "5px 10px", borderRadius: "9px" }}>에스크로 안전정산</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "3px", marginTop: "14px" }}>
              <span style={{ fontSize: "15px", color: "var(--c1,#0d3b2e)", fontWeight: "700" }}>₩</span><span className="mono" style={{ fontSize: "30px", fontWeight: "500", color: "var(--c1,#0d3b2e)" }}>4,267,700</span>
            </div>
            <button onClick={v.toggleSettle} style={{ marginTop: "12px", width: "100%", height: "44px", border: "1px solid #e0dccf", borderRadius: "13px", background: "#f6f4ed", color: "#15211c", fontSize: "13.5px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>{v.settleLabel}</button>
            {(v.settleOpen) && (<>
              <div style={{ marginTop: "12px", borderTop: "1px dashed #e0dccf", paddingTop: "13px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: "13px", color: "#5d6b62", fontWeight: "600" }}>기본 일급 230,000 × 18일</span><span className="mono" style={{ fontSize: "13.5px", color: "#15211c", fontWeight: "500" }}>4,140,000</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: "13px", color: "#5d6b62", fontWeight: "600" }}>야간·연장 수당</span><span className="mono" style={{ fontSize: "13.5px", color: "var(--c3,#1a6b51)", fontWeight: "500" }}>+180,000</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: "13px", color: "#5d6b62", fontWeight: "600" }}>4대보험·소득 공제</span><span className="mono" style={{ fontSize: "13.5px", color: "#b4451f", fontWeight: "500" }}>−52,300</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #ece8dd", paddingTop: "10px" }}><span style={{ fontSize: "14px", color: "#15211c", fontWeight: "800" }}>실 지급 예정액</span><span className="mono" style={{ fontSize: "15px", color: "var(--c1,#0d3b2e)", fontWeight: "500" }}>4,267,700</span></div>
                <button onClick={v.openEscrow} style={{ marginTop: "2px", height: "40px", border: "none", borderRadius: "11px", background: "var(--soft,#e6efe9)", color: "var(--c1,#0d3b2e)", fontSize: "12.5px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer" }}>에스크로 안전정산이란? · 기관 연동 안내</button>
              </div>
            </>)}
          </div>

          
          <div style={{ fontSize: "15px", fontWeight: "800", color: "#15211c", margin: "22px 0 11px" }}>정산 완료 이력</div>
          {(v.history || []).map((h, _i1) => (<React.Fragment key={_i1}>
            <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "16px", padding: "14px 16px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: "13.5px", fontWeight: "700", color: "#15211c" }}>{h.name}</div><div style={{ fontSize: "11.5px", color: "#8a958d", marginTop: "2px" }}>{h.date} · {h.days}</div></div>
              <div style={{ textAlign: "right" }}><div className="mono" style={{ fontSize: "15px", fontWeight: "500", color: "#15211c" }}>{h.amount}</div><div style={{ fontSize: "10.5px", color: "var(--c3,#1a6b51)", fontWeight: "700", marginTop: "1px" }}>지급 완료</div></div>
            </div>
          </React.Fragment>))}
            </>
          )}
        </div>
        </>)}

        
        {(v.isMe) && (<>
        <div style={{ padding: "8px 20px 30px" }}>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#15211c" }}>내 정보</div>
          {!user ? (
            <div style={{ marginTop: "14px", background: "linear-gradient(150deg,var(--c2,#114a39),var(--c0,#0a2b21))", borderRadius: "20px", padding: "20px", color: "var(--t0,#eaf3ee)", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ fontSize: "16px", fontWeight: "800" }}>로그인이 필요합니다</div>
              <button onClick={() => simulateState("no_profile")} style={{ height: "42px", border: "none", borderRadius: "12px", background: "linear-gradient(135deg,var(--a1,#e8c34a),var(--a3,#d4a82f))", color: "var(--c1,#0d3b2e)", fontSize: "14px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>로그인 / 회원가입하기</button>
            </div>
          ) : (
            <div style={{ marginTop: "14px", background: "linear-gradient(150deg,var(--c2,#114a39),var(--c0,#0a2b21))", borderRadius: "20px", padding: "20px", color: "var(--t0,#eaf3ee)", display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "58px", height: "58px", borderRadius: "18px", background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--a1,#e8c34a)", fontSize: "22px", fontWeight: "800" }}>{v.initial}</div>
              <div style={{ flex: "1" }}>
                <div style={{ fontSize: "18px", fontWeight: "800" }}>{v.name}</div>
                <div style={{ fontSize: "12.5px", color: "var(--t1,#9fd3bd)", fontWeight: "600", marginTop: "2px" }}>{v.myJob} · A등급 숙련 기술자</div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "6px" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5fd1a0" }}></span><span style={{ fontSize: "11.5px", color: "var(--t1,#cfe3da)", fontWeight: "600" }}>실명·계좌 인증 완료</span></div>
              </div>
            </div>
          )}

          <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "18px", padding: "14px 6px", marginTop: "14px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#9aa39d", padding: "4px 14px 8px" }}>
              {!user ? "프로필 완성도 0%" : `프로필 완성도 ${completion}% ${completion >= 90 ? '· 경력카드 신뢰도 우수' : ''}`}
            </div>
            <div style={{ height: "6px", background: "#eef0ea", borderRadius: "4px", margin: "0 14px 12px", overflow: "hidden" }}>
              <div style={{ width: !user ? "0%" : `${completion}%`, height: "100%", background: "linear-gradient(90deg,var(--c3,#1a6b51),var(--a1,#e8c34a))", borderRadius: "4px" }}></div>
            </div>
            {(v.meRows || []).map((row, _i1) => (<React.Fragment key={_i1}>
              <div onClick={row.onClick} style={{ display: "flex", alignItems: "center", gap: "13px", padding: "13px 14px", cursor: "pointer" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "11px", background: "#f1f4f0", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{row.icon}</div>
                <span style={{ flex: "1", fontSize: "14.5px", fontWeight: "600", color: "#15211c" }}>{row.label}</span>
                <span style={{ fontSize: "12px", fontWeight: "700", color: row.tagColor }}>{row.tag}</span>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="m1 1 6 6-6 6" stroke="#c2cac4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </div>
            </React.Fragment>))}
          </div>
          <div style={{ textAlign: "center", marginTop: "18px", fontSize: "11.5px", color: "#9aa39d", fontWeight: "500" }}>MoNo v1.0 · 건설 인력 데이터 인프라</div>
        </div>
        </>)}

      </div>

      
      <div style={{ height: "84px", flex: "none", background: "rgba(252,251,247,.94)", backdropFilter: "blur(14px)", borderTop: "1px solid #e8e4d9", display: "flex", padding: "9px 6px 0", position: "relative", zIndex: "30" }}>
        <button onClick={v.goHome} style={{ flex: "1", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", paddingTop: "5px", color: v.cHome, fontFamily: "inherit" }}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none"><path d="M4 11 12 4l8 7v8a1.2 1.2 0 0 1-1.2 1.2H15V14.5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1V20.2H5.2A1.2 1.2 0 0 1 4 19v-8Z" fill={v.fHome} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"></path></svg>
          <span style={{ fontSize: "10.5px", fontWeight: v.wHome, letterSpacing: "-.2px", whiteSpace: "nowrap" }}>홈</span>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: v.dotHome }}></div>
        </button>
        <button onClick={v.goJobs} style={{ flex: "1", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", paddingTop: "5px", color: v.cJobs, fontFamily: "inherit" }}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none"><path d="M6 15.5a6 6 0 0 1 12 0" fill={v.fJobs} stroke="currentColor" strokeWidth="1.9"></path><path d="M3.5 15.5h17" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"></path><path d="M10.4 9.8V7.4A1.6 1.6 0 0 1 12 5.8a1.6 1.6 0 0 1 1.6 1.6v2.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12 18.5v0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path></svg>
          <span style={{ fontSize: "10.5px", fontWeight: v.wJobs, letterSpacing: "-.2px", whiteSpace: "nowrap" }}>일자리</span>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: v.dotJobs }}></div>
        </button>
        <button onClick={v.goCard} style={{ flex: "1", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", paddingTop: "5px", color: v.cCard, fontFamily: "inherit" }}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="5.5" width="19" height="13" rx="3" fill={v.fCard} stroke="currentColor" strokeWidth="1.9"></rect><path d="M2.5 9.6h19" stroke="currentColor" strokeWidth="1.9"></path><rect x="5.8" y="12.3" width="5" height="3.6" rx="1" fill={v.chipCard}></rect><path d="M14 13.2h3.8M14 15.4h2.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"></path></svg>
          <span style={{ fontSize: "10.5px", fontWeight: v.wCard, letterSpacing: "-.3px", whiteSpace: "nowrap" }}>경력카드</span>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: v.dotCard }}></div>
        </button>
        <button onClick={v.goWork} style={{ flex: "1", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", paddingTop: "5px", color: v.cWork, fontFamily: "inherit" }}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none"><rect x="4.5" y="4.5" width="15" height="16.5" rx="2.8" fill={v.fWork} stroke="currentColor" strokeWidth="1.9"></rect><rect x="8.5" y="2.6" width="7" height="3.6" rx="1.3" fill={v.clipWork} stroke="currentColor" strokeWidth="1.7"></rect><path d="m8.4 12.4 1.8 1.8 3.6-3.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"></path><path d="M8.6 17h6.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"></path></svg>
          <span style={{ fontSize: "10.5px", fontWeight: v.wWork, letterSpacing: "-.3px", whiteSpace: "nowrap" }}>출역·정산</span>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: v.dotWork }}></div>
        </button>
        <button onClick={v.goMe} style={{ flex: "1", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", paddingTop: "5px", color: v.cMe, fontFamily: "inherit" }}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.2" r="3.7" fill={v.fMe} stroke="currentColor" strokeWidth="1.9"></circle><path d="M4.8 20c.4-3.6 3.4-5.6 7.2-5.6s6.8 2 7.2 5.6Z" fill={v.fMe} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"></path></svg>
          <span style={{ fontSize: "10.5px", fontWeight: v.wMe, letterSpacing: "-.2px", whiteSpace: "nowrap" }}>내 정보</span>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: v.dotMe }}></div>
        </button>
      </div>

      
      {(v.overlayJob) && (<>
        <div style={{ position: "absolute", inset: "0", zIndex: "55", background: "var(--bg,#f3f1ea)", display: "flex", flexDirection: "column", animation: "fadeIn .2s ease" }}>
          <div style={{ flex: "none", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px 0 6px", background: "#fff", borderBottom: "1px solid #ece8dd" }}>
            <button onClick={v.closeOverlay} style={{ width: "40px", height: "40px", border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#15211c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </button>
            <span style={{ fontSize: "15px", fontWeight: "800", color: "#15211c" }}>공고 상세</span>
            <button style={{ width: "40px", height: "40px", border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14 7a2.5 2.5 0 1 0-2.4-3.1L7.9 6A2.5 2.5 0 1 0 6 10c.6 0 1.2-.2 1.6-.6l3.9 2.3A2.5 2.5 0 1 0 14 13c-.7 0-1.3.3-1.7.7l-3.8-2.2c.1-.3.2-.6.2-.9l3.7-2.2c.4.4 1 .8 1.6.8Z" fill="#9aa39d"></path></svg>
            </button>
          </div>

          <div className="scr" style={{ flex: "1", overflowY: "auto" }}>
            <div style={{ height: "170px", background: v.job.grad, position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "18px" }}>
              <div style={{ position: "absolute", inset: "0", background: "repeating-linear-gradient(120deg,transparent 0 22px,rgba(255,255,255,.04) 22px 23px), linear-gradient(180deg,transparent 30%,rgba(8,20,15,.55))" }}></div>
              <div style={{ position: "relative", display: "flex", gap: "6px", marginBottom: "9px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--c1,#0d3b2e)", background: "var(--a1,#e8c34a)", padding: "4px 9px", borderRadius: "8px" }}>{v.job.trade}</span>
                {(v.job.instant) && (<><span style={{ fontSize: "11px", fontWeight: "700", color: "#fff", background: "rgba(180,69,31,.9)", padding: "4px 9px", borderRadius: "8px" }}>즉시 출역</span></>)}
              </div>
              <div style={{ position: "relative", fontSize: "21px", fontWeight: "800", color: "#fff" }}>{v.job.name}</div>
              <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "5px", marginTop: "5px" }}>
                <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,.85)", fontWeight: "600" }}>{v.job.company}</span>
                {(v.job.verified) && (<><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1 8.7 2.3l2.1-.2.6 2 1.6 1.4-1 1.8.3 2.1-2 .8L8.7 12 7 11l-1.7 1.4-1.8-1.4-2-.8.3-2.1-1-1.8L2.4 4l.6-2 2.1.2L7 1Z" fill="var(--a1,#e8c34a)"></path><path d="m5 7 1.4 1.4L9.4 5.2" stroke="var(--c1,#0d3b2e)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"></path></svg></>)}
              </div>
            </div>

            <div style={{ padding: "18px 20px 22px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div><div style={{ fontSize: "12px", color: "#8a958d", fontWeight: "600" }}>일급</div><div style={{ display: "flex", alignItems: "baseline", gap: "2px", marginTop: "2px" }}><span style={{ fontSize: "16px", color: "var(--c1,#0d3b2e)", fontWeight: "700" }}>₩</span><span className="mono" style={{ fontSize: "30px", fontWeight: "500", color: "var(--c1,#0d3b2e)" }}>{v.job.pay}</span></div></div>
                <span style={{ fontSize: "11.5px", fontWeight: "700", color: "var(--ai,#9a6b16)", background: "var(--aSoft,#f6edd4)", padding: "6px 11px", borderRadius: "10px" }}>{v.job.settleWay}</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "18px" }}>
                <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "14px", padding: "13px 14px" }}><div style={{ fontSize: "11px", color: "#8a958d", fontWeight: "600" }}>출역일</div><div style={{ fontSize: "14.5px", fontWeight: "700", color: "#15211c", marginTop: "3px" }}>{v.job.date}</div></div>
                <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "14px", padding: "13px 14px" }}><div style={{ fontSize: "11px", color: "#8a958d", fontWeight: "600" }}>근무 시간</div><div style={{ fontSize: "14.5px", fontWeight: "700", color: "#15211c", marginTop: "3px" }}>{v.job.hours}</div></div>
                <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "14px", padding: "13px 14px" }}><div style={{ fontSize: "11px", color: "#8a958d", fontWeight: "600" }}>필요 인원</div><div style={{ fontSize: "14.5px", fontWeight: "700", color: "#15211c", marginTop: "3px" }}>{v.job.people}</div></div>
                <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "14px", padding: "13px 14px" }}><div style={{ fontSize: "11px", color: "#8a958d", fontWeight: "600" }}>숙식</div><div style={{ fontSize: "14.5px", fontWeight: "700", color: "#15211c", marginTop: "3px" }}>{v.job.stay}</div></div>
              </div>

              <div style={{ background: "#fff", border: "1px solid #ece8dd", borderRadius: "16px", padding: "4px 16px", marginTop: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0" }}><span style={{ fontSize: "13px", color: "#8a958d", fontWeight: "600" }}>근무 위치</span><span style={{ fontSize: "13.5px", color: "#15211c", fontWeight: "700" }}>{v.job.loc} · {v.job.dist}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid #f1ede2" }}><span style={{ fontSize: "13px", color: "#8a958d", fontWeight: "600" }}>준비물</span><span style={{ fontSize: "13px", color: "#15211c", fontWeight: "700", textAlign: "right", maxWidth: "60%" }}>{v.job.prepare}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid #f1ede2" }}><span style={{ fontSize: "13px", color: "#8a958d", fontWeight: "600" }}>현장 위험도</span><span style={{ fontSize: "13.5px", color: "#b4451f", fontWeight: "700" }}>{v.job.risk}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid #f1ede2" }}><span style={{ fontSize: "13px", color: "#8a958d", fontWeight: "600" }}>담당자</span><span style={{ fontSize: "13.5px", color: "#15211c", fontWeight: "700" }}>{v.job.manager}</span></div>
              </div>

              {(v.job.safety) && (<>
                <div style={{ marginTop: "12px", background: "#f7e3da", borderRadius: "14px", padding: "14px 15px" }}>
                  <div style={{ fontSize: "13px", fontWeight: "800", color: "#b4451f" }}>⚠ 기초안전보건교육 이수 필요</div>
                  <div style={{ fontSize: "12px", color: "#9a5238", fontWeight: "500", marginTop: "4px", lineHeight: "1.5" }}>이 현장은 출역 전 안전교육 이수가 필요합니다. 앱에서 바로 이수하거나 기존 이수증을 등록하세요.</div>
                  <button onClick={v.openSafetyM} style={{ marginTop: "10px", height: "40px", padding: "0 16px", border: "none", borderRadius: "11px", background: "#b4451f", color: "#fff", fontSize: "13px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer" }}>안전교육 받기 / 등록</button>
                </div>
              </>)}

              <button onClick={v.openCareer} style={{ marginTop: "12px", width: "100%", height: "50px", border: "1px dashed #cdbf9a", borderRadius: "14px", background: "#fbf7ec", color: "var(--ai,#9a6b16)", fontSize: "13px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M7 11 5 13a2.2 2.2 0 0 1-3-3l2-2m6 0 2-2a2.2 2.2 0 0 1 3 3l-2 2m-6 0 4-4" stroke="var(--ai,#9a6b16)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                경력·자격 자동 확인 (기관 연동)
              </button>
            </div>
          </div>

          <div style={{ flex: "none", padding: "12px 18px 16px", background: "#fff", borderTop: "1px solid #ece8dd", display: "flex", gap: "10px" }}>
            <button style={{ flex: "none", width: "52px", height: "52px", border: "1px solid #e0dccf", borderRadius: "14px", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 20s-7-4.4-7-9.3A3.7 3.7 0 0 1 12 7a3.7 3.7 0 0 1 7 3.7C19 15.6 12 20 12 20Z" stroke="var(--c1,#0d3b2e)" strokeWidth="1.7" strokeLinejoin="round"></path></svg>
            </button>
            <button onClick={v.applyJob} style={{ flex: "1", height: "52px", border: "none", borderRadius: "14px", background: v.applyBg, color: v.applyFg, fontSize: "15.5px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>{v.applyLabel}</button>
          </div>
        </div>
      </>)}

      

      
      {(v.themeOpen) && (<>
        <div onClick={v.closeTheme} style={{ position: "absolute", inset: "0", zIndex: "60", background: "rgba(8,20,15,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div onClick={v.stop} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 46px 46px", padding: "24px 22px 30px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#e0dccf", margin: "0 auto 18px" }}></div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "#15211c" }}>테마 · 화면 색상</div>
            <div style={{ fontSize: "13px", color: "#8a958d", fontWeight: "500", marginTop: "4px" }}>앱 전체에 적용할 브랜드 색을 선택하세요</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "11px", marginTop: "18px" }}>
              {(v.themeList || []).map((th, _i1) => (<React.Fragment key={_i1}>
                <div onClick={th.onPick} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 15px", borderRadius: "16px", border: `2px solid ${th.ringBd}`, background: th.ringBg, cursor: "pointer" }}>
                  <div style={{ display: "flex", flex: "none" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "8px 0 0 8px", background: th.sw1 }}></div>
                    <div style={{ width: "18px", height: "26px", background: th.sw2 }}></div>
                    <div style={{ width: "18px", height: "26px", background: th.sw3 }}></div>
                    <div style={{ width: "18px", height: "26px", borderRadius: "0 8px 8px 0", background: th.sw4, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06)" }}></div>
                  </div>
                  <span style={{ flex: "1", fontSize: "14.5px", fontWeight: "800", color: "#15211c" }}>{th.label}</span>
                  {(th.checkShow) && (<>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--c1,#0d3b2e)", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="m2.5 6 2.3 2.3L9.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path></svg></div>
                  </>)}
                </div>
              </React.Fragment>))}
            </div>
            <button onClick={v.closeTheme} style={{ marginTop: "20px", width: "100%", height: "52px", border: "none", borderRadius: "15px", background: "linear-gradient(135deg,var(--c1,#0d3b2e),var(--c2,#114a39))", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>완료</button>
          </div>
        </div>
      </>)}

      
      {(v.modalOpen) && (<>
        <div onClick={v.closeModal} style={{ position: "absolute", inset: "0", zIndex: "60", background: "rgba(8,20,15,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 46px 46px", padding: "24px 22px 30px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#e0dccf", margin: "0 auto 18px" }}></div>
            <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "linear-gradient(135deg,var(--aSoft,#f6edd4),#ecdca6)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 2 3 6.5v6c0 5.5 4 9.6 10 11.5 6-1.9 10-6 10-11.5v-6L13 2Z" stroke="var(--ai,#9a6b16)" strokeWidth="1.8" strokeLinejoin="round"></path><path d="M13 9v4.5" stroke="var(--ai,#9a6b16)" strokeWidth="1.8" strokeLinecap="round"></path><circle cx="13" cy="17" r="1.1" fill="var(--ai,#9a6b16)"></circle></svg>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "18px", fontWeight: "800", color: "#15211c" }}>{v.modalTitle}</span>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "var(--ai,#9a6b16)", background: "var(--aSoft,#f6edd4)", padding: "4px 9px", borderRadius: "8px" }}>{v.modalStatus}</span>
            </div>
            <div style={{ fontSize: "13.5px", color: "#5d6b62", lineHeight: "1.65", fontWeight: "500" }}>{v.modalBody}</div>
            <div style={{ background: "#f6f4ed", borderRadius: "14px", padding: "13px 15px", marginTop: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--a1,#e8c34a)", boxShadow: "0 0 0 4px rgba(232,195,74,.2)", flex: "none" }}></div>
              <span style={{ fontSize: "12.5px", color: "#5d6b62", fontWeight: "600" }}>{v.modalNote}</span>
            </div>
            <button onClick={v.closeModal} style={{ marginTop: "18px", width: "100%", height: "52px", border: "none", borderRadius: "15px", background: "linear-gradient(135deg,var(--c1,#0d3b2e),var(--c2,#114a39))", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>확인</button>
          </div>
        </div>
      </>)}

      {edit && (
        <div onClick={closeEdit} style={{ position: "absolute", inset: "0", zIndex: "60", background: "rgba(8,20,15,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "24px 22px 30px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "90%", overflowY: "auto" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#e0dccf", margin: "0 auto 18px" }}></div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "#15211c" }}>기본 정보 수정</div>
            <div style={{ fontSize: "13px", color: "#8a958d", fontWeight: "500", marginTop: "4px" }}>이름·직종·경력 연차·희망 지역을 수정할 수 있어요</div>
            <div style={{ marginTop: "18px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#8a958d", marginBottom: "6px" }}>이름</div>
                <input value={edit.name} onChange={(e) => setEdit((p) => ({ ...p, name: e.target.value }))} placeholder="이름을 입력하세요" style={{ width: "100%", height: "48px", border: "1px solid #e2ddcf", borderRadius: "12px", padding: "0 14px", fontSize: "15px", fontFamily: "inherit", color: "#15211c", background: "#fff", boxSizing: "border-box" }} />
              </div>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#8a958d", marginBottom: "6px" }}>직종</div>
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
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#8a958d", marginBottom: "6px" }}>경력 연차</div>
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
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#8a958d", marginBottom: "6px" }}>희망 지역</div>
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
            <button onClick={saveEdit} style={{ marginTop: "22px", width: "100%", height: "52px", border: "none", borderRadius: "15px", background: "linear-gradient(135deg,var(--c1,#0d3b2e),var(--c2,#114a39))", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>저장</button>
            <button onClick={closeEdit} style={{ marginTop: "10px", width: "100%", height: "48px", border: "1px solid #e0dccf", borderRadius: "14px", background: "#fff", color: "#5d6b62", fontSize: "14px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer" }}>취소</button>
          </div>
        </div>
      )}

      {edit && openField && (
        <div onClick={() => setOpenField(null)} style={{ position: "absolute", inset: "0", zIndex: "70", background: "rgba(8,20,15,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "20px 16px 26px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "70%", display: "flex", flexDirection: "column" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#e0dccf", margin: "0 auto 16px" }}></div>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "#15211c", padding: "0 4px 12px" }}>{PICKER_TITLE[openField]}</div>
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
                      width: "100%", border: "none", background: sel ? "var(--soft,#dde9f0)" : "#fff",
                      color: sel ? "var(--c1,#163e57)" : "#15211c", fontWeight: sel ? "800" : "600",
                      fontSize: "15px", fontFamily: "inherit", textAlign: "left", height: "52px", padding: "0 14px",
                      borderRadius: "12px", marginBottom: "2px", cursor: "pointer", boxSizing: "border-box",
                      display: "flex", alignItems: "center", justifyContent: "space-between", WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    <span>{opt}</span>
                    {sel && (<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M5 10.5 8.5 14 15 6.5" stroke="var(--c1,#163e57)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>)}
                  </button>
                );
              })}
            </div>
            {(openField === "jobType" || openField === "region") && (
              <button type="button" onClick={() => setOpenField(null)} style={{ marginTop: "12px", flex: "none", width: "100%", height: "50px", border: "none", borderRadius: "14px", background: "linear-gradient(135deg,var(--c1,#0d3b2e),var(--c2,#114a39))", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>
                완료 {((edit[openField] || []).length) > 0 ? `(${(edit[openField] || []).length})` : ""}
              </button>
            )}
          </div>
        </div>
      )}

      {openInterest && (
        <div onClick={() => setOpenInterest(false)} style={{ position: "absolute", inset: "0", zIndex: "60", background: "rgba(8,20,15,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "22px 18px 26px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "82%", display: "flex", flexDirection: "column" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#e0dccf", margin: "0 auto 16px" }}></div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "#15211c" }}>관심 기능 신청</div>
            <div style={{ fontSize: "13px", color: "#8a958d", fontWeight: "500", marginTop: "4px", marginBottom: "14px" }}>관심 등록하면 먼저 안내드릴게요.</div>
            <div className="scr" style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
              {(INTEREST_FEATURES || []).map((f) => {
                const done = (interests || []).some((i) => i.feature === f.key);
                return (
                  <div key={f.key} style={{ border: "1px solid #ece8dd", borderRadius: "16px", padding: "14px 15px", background: done ? "var(--soft,#dde9f0)" : "#fff" }}>
                    <div style={{ fontSize: "15px", fontWeight: "800", color: "#15211c" }}>{f.label}</div>
                    <div style={{ fontSize: "12.5px", color: "#6c7a72", fontWeight: "500", marginTop: "3px" }}>{f.short}</div>
                    <button
                      type="button"
                      onClick={() => onPickInterest(f)}
                      disabled={done}
                      style={{
                        marginTop: "11px", width: "100%", height: "42px", border: "none", borderRadius: "12px",
                        background: done ? "transparent" : "linear-gradient(135deg,var(--c1,#0d3b2e),var(--c2,#114a39))",
                        color: done ? "var(--c1,#163e57)" : "#fff", fontSize: "13.5px", fontWeight: "800",
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

      {openDocs && (
        <div onClick={() => setOpenDocs(false)} style={{ position: "absolute", inset: "0", zIndex: "60", background: "rgba(8,20,15,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "22px 18px 26px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "88%", display: "flex", flexDirection: "column" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#e0dccf", margin: "0 auto 16px" }}></div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "#15211c" }}>서류 · 자격증</div>
            <div style={{ fontSize: "13px", color: "#8a958d", fontWeight: "500", marginTop: "4px", marginBottom: "16px" }}>자격증·교육 이력을 등록하면 신뢰도가 올라가요.</div>
            <div className="scr" style={{ overflowY: "auto" }}>
              {/* 자격증 */}
              <div style={{ fontSize: "13px", fontWeight: "800", color: "#15211c", marginBottom: "8px" }}>자격증</div>
              {(certificates || []).map((c) => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 13px", border: "1px solid #ece8dd", borderRadius: "12px", marginBottom: "8px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#15211c" }}>{c.name}</span>
                    <span style={{ fontSize: "11px", color: "#8a958d" }}>발급번호 {c.licenseNo}</span>
                  </div>
                  <span style={{ fontSize: "12px", color: "#8a958d" }}>{[c.issuer, c.issuedAt].filter(Boolean).join(" · ")}</span>
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                <input value={certForm.name} onChange={(e) => setCertForm((p) => ({ ...p, name: e.target.value }))} placeholder="자격증명 (필수)" style={{ height: "44px", border: "1px solid #e2ddcf", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                <input value={certForm.licenseNo} onChange={(e) => setCertForm((p) => ({ ...p, licenseNo: e.target.value }))} placeholder="발급번호 (필수)" style={{ height: "44px", border: "1px solid #e2ddcf", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                <div style={{ display: "flex", gap: "8px" }}>
                  <input value={certForm.issuer} onChange={(e) => setCertForm((p) => ({ ...p, issuer: e.target.value }))} placeholder="발급기관" style={{ flex: "1", height: "44px", border: "1px solid #e2ddcf", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box", minWidth: "0" }} />
                  <input value={certForm.issuedAt} onChange={(e) => setCertForm((p) => ({ ...p, issuedAt: e.target.value }))} placeholder="취득일" style={{ width: "120px", height: "44px", border: "1px solid #e2ddcf", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
                <button type="button" onClick={submitCert} style={{ height: "44px", border: "1px solid var(--c1,#0d3b2e)", borderRadius: "11px", background: "#fff", color: "var(--c1,#0d3b2e)", fontSize: "14px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>+ 자격증 추가</button>
              </div>
              {/* 교육 */}
              <div style={{ fontSize: "13px", fontWeight: "800", color: "#15211c", marginBottom: "8px" }}>교육 이력</div>
              {(educations || []).map((ed) => (
                <div key={ed.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 13px", border: "1px solid #ece8dd", borderRadius: "12px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#15211c" }}>{ed.title}</span>
                  <span style={{ fontSize: "12px", color: "#8a958d" }}>{[ed.institute, ed.completedAt].filter(Boolean).join(" · ")}</span>
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <input value={eduForm.title} onChange={(e) => setEduForm((p) => ({ ...p, title: e.target.value }))} placeholder="교육명 (필수)" style={{ height: "44px", border: "1px solid #e2ddcf", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                <div style={{ display: "flex", gap: "8px" }}>
                  <input value={eduForm.institute} onChange={(e) => setEduForm((p) => ({ ...p, institute: e.target.value }))} placeholder="기관" style={{ flex: "1", height: "44px", border: "1px solid #e2ddcf", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box", minWidth: "0" }} />
                  <input value={eduForm.completedAt} onChange={(e) => setEduForm((p) => ({ ...p, completedAt: e.target.value }))} placeholder="이수일" style={{ width: "120px", height: "44px", border: "1px solid #e2ddcf", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
                <button type="button" onClick={submitEdu} style={{ height: "44px", border: "1px solid var(--c1,#0d3b2e)", borderRadius: "11px", background: "#fff", color: "var(--c1,#0d3b2e)", fontSize: "14px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>+ 교육 추가</button>
              </div>
            </div>
            <button type="button" onClick={() => setOpenDocs(false)} style={{ marginTop: "16px", flex: "none", height: "50px", border: "none", borderRadius: "14px", background: "linear-gradient(135deg,var(--c1,#0d3b2e),var(--c2,#114a39))", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>완료</button>
          </div>
        </div>
      )}

      {openShareSheet && (
        <div onClick={() => setOpenShareSheet(false)} style={{ position: "absolute", inset: "0", zIndex: "60", background: "rgba(8,20,15,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "22px 18px 26px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "90%", overflowY: "auto" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#e0dccf", margin: "0 auto 16px" }}></div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "#15211c" }}>경력카드 공유</div>
            <div style={{ fontSize: "13px", color: "#8a958d", fontWeight: "500", marginTop: "4px", marginBottom: "16px" }}>링크와 QR로 내 경력 프로필을 공유하세요. 민감 정보는 자동으로 가려집니다.</div>
            {(() => {
              const url = shareUrl();
              if (!url) {
                return (
                  <div style={{ fontSize: "13.5px", color: "#6c7a72", fontWeight: "600", lineHeight: "1.6", background: "#f5f3ec", borderRadius: "14px", padding: "16px" }}>
                    프로필을 먼저 만들어 주세요. 가입·기본 정보를 입력하면 공유 링크가 생성됩니다.
                  </div>
                );
              }
              return (
                <>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                    <div style={{ padding: "14px", background: "#fff", border: "1px solid #ece8dd", borderRadius: "18px" }}>
                      <QRCodeSVG value={url} size={196} fgColor="#15211c" bgColor="#ffffff" level="M" />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f5f3ec", borderRadius: "12px", padding: "12px 13px", marginBottom: "10px" }}>
                    <span style={{ fontSize: "13px", color: "#15211c", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: "1", minWidth: "0" }}>{url}</span>
                  </div>
                  <button type="button" onClick={copyShare} style={{ width: "100%", height: "50px", border: "1px solid var(--c1,#0d3b2e)", borderRadius: "14px", background: "#fff", color: "var(--c1,#0d3b2e)", fontSize: "14px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", marginBottom: "10px", WebkitTapHighlightColor: "transparent" }}>{shareCopied ? "복사됨!" : "링크 복사"}</button>
                  <button type="button" onClick={nativeShare} style={{ width: "100%", height: "52px", border: "none", borderRadius: "15px", background: "linear-gradient(135deg,var(--c1,#0d3b2e),var(--c2,#114a39))", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>공유하기</button>
                </>
              );
            })()}
            <button type="button" onClick={() => setOpenShareSheet(false)} style={{ marginTop: "12px", width: "100%", height: "48px", border: "1px solid #e0dccf", borderRadius: "14px", background: "#fff", color: "#5d6b62", fontSize: "14px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer" }}>닫기</button>
          </div>
        </div>
      )}

      {openCareerSheet && (
        <div onClick={() => setOpenCareerSheet(false)} style={{ position: "absolute", inset: "0", zIndex: "60", background: "rgba(8,20,15,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div ref={careerSheetRef} onClick={(e) => e.stopPropagation()} onKeyDown={onCareerKeyDown} role="dialog" aria-modal="true" aria-label="현장 경력 추가" tabIndex={-1} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "22px 18px 26px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "90%", display: "flex", flexDirection: "column", outline: "none" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#e0dccf", margin: "0 auto 16px" }}></div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "#15211c" }}>현장 경력 추가</div>
            <div style={{ fontSize: "13px", color: "#8a958d", fontWeight: "500", marginTop: "4px", marginBottom: "16px" }}>참여한 현장을 등록하면 공유 프로필에 바로 반영돼요.</div>
            <div className="scr" style={{ overflowY: "auto", flex: "1", minHeight: "0" }}>
              {(careerCards || []).map((c) => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 13px", border: "1px solid #ece8dd", borderRadius: "12px", marginBottom: "8px", gap: "8px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#15211c", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.siteName}</span>
                    {(c.startDate || c.endDate || c.role) && (<span style={{ fontSize: "11px", color: "#8a958d" }}>{[fmtRange(c.startDate, c.endDate), c.role].filter(Boolean).join(" · ")}</span>)}
                  </div>
                  {c.field && (<span style={{ flex: "none", fontSize: "11px", fontWeight: "700", color: "var(--c1,#0d3b2e)", background: "var(--soft,#e6efe9)", padding: "3px 8px", borderRadius: "7px" }}>{c.field}</span>)}
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: (careerCards || []).length ? "4px" : "0" }}>
                <input value={careerForm.siteName} onChange={(e) => setCareerForm((p) => ({ ...p, siteName: e.target.value }))} placeholder="현장명 (필수)" style={{ height: "44px", border: "1px solid #e2ddcf", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                <input value={careerForm.field} onChange={(e) => setCareerForm((p) => ({ ...p, field: e.target.value }))} placeholder="작업 분야 (예: 형틀목공)" style={{ height: "44px", border: "1px solid #e2ddcf", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                <div style={{ display: "flex", gap: "8px" }}>
                  <input value={careerForm.startDate} onChange={(e) => setCareerForm((p) => ({ ...p, startDate: e.target.value }))} placeholder="시작 (예: 2024-03)" style={{ flex: "1", height: "44px", border: "1px solid #e2ddcf", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box", minWidth: "0" }} />
                  <input value={careerForm.endDate} onChange={(e) => setCareerForm((p) => ({ ...p, endDate: e.target.value }))} placeholder="종료 (예: 2024-09)" style={{ flex: "1", height: "44px", border: "1px solid #e2ddcf", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box", minWidth: "0" }} />
                </div>
                <input value={careerForm.role} onChange={(e) => setCareerForm((p) => ({ ...p, role: e.target.value }))} placeholder="역할 (예: 반장)" style={{ height: "44px", border: "1px solid #e2ddcf", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                <input value={careerForm.equipment} onChange={(e) => setCareerForm((p) => ({ ...p, equipment: e.target.value }))} placeholder="사용 장비 (예: 갱폼·알폼)" style={{ height: "44px", border: "1px solid #e2ddcf", borderRadius: "11px", padding: "0 13px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                <button type="button" onClick={submitCareer} disabled={!careerForm.siteName.trim()} style={{ height: "44px", border: "1px solid var(--c1,#0d3b2e)", borderRadius: "11px", background: "#fff", color: "var(--c1,#0d3b2e)", fontSize: "14px", fontWeight: "800", fontFamily: "inherit", cursor: careerForm.siteName.trim() ? "pointer" : "default", opacity: careerForm.siteName.trim() ? "1" : ".5", WebkitTapHighlightColor: "transparent" }}>+ 경력 추가</button>
              </div>
            </div>
            <button type="button" onClick={() => setOpenCareerSheet(false)} style={{ marginTop: "16px", flex: "none", height: "50px", border: "none", borderRadius: "14px", background: "linear-gradient(135deg,var(--c1,#0d3b2e),var(--c2,#114a39))", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer" }}>완료</button>
          </div>
        </div>
      )}

      {openOnboardingSheet && (
        <div onClick={() => setOpenOnboardingSheet(false)} style={{ position: "absolute", inset: "0", zIndex: "60", background: "rgba(8,20,15,.55)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-end", animation: "fadeIn .2s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "28px 28px 0 0", padding: "22px 18px 26px", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)", maxHeight: "90%", display: "flex", flexDirection: "column", outline: "none" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#e0dccf", margin: "0 auto 16px" }}></div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: "800", color: "#15211c" }}>
                {onbStep === 0 && "직종 선택"}
                {onbStep === 1 && "경력 연차 선택"}
                {onbStep === 2 && "희망 지역 선택"}
              </div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--c3,#1a6b51)", background: "var(--soft,#e6efe9)", padding: "4px 10px", borderRadius: "8px" }}>
                {onbStep + 1} / 3 단계
              </div>
            </div>
            
            <div style={{ fontSize: "13px", color: "#8a958d", fontWeight: "500", marginTop: "4px", marginBottom: "16px" }}>
              {onbStep === 0 && "주요 작업 분야를 선택해 주세요 (복수 선택 가능)"}
              {onbStep === 1 && "해당 직종의 총 경력 기간을 선택해 주세요"}
              {onbStep === 2 && "출역을 희망하는 근무 지역을 선택해 주세요 (복수 선택 가능)"}
            </div>

            <div className="scr" style={{ overflowY: "auto", flex: "1", minHeight: "0", display: "flex", flexDirection: "column", gap: "8px" }}>
              {onbStep === 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {JOB_TYPES.map((opt) => {
                    const sel = onbJobType.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setOnbJobType(p => p.includes(opt) ? p.filter(x => x !== opt) : [...p, opt]);
                        }}
                        style={{
                          height: "48px", border: "none", borderRadius: "12px",
                          background: sel ? "var(--soft,#dde9f0)" : "#f6f4ed",
                          color: sel ? "var(--c1,#163e57)" : "#15211c",
                          fontWeight: sel ? "800" : "600", fontSize: "14px", fontFamily: "inherit",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
                        }}
                      >
                        {opt}
                        {sel && (
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                            <path d="M5 10.5 8.5 14 15 6.5" stroke="var(--c1,#163e57)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {onbStep === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {CAREER_YEARS.map((opt) => {
                    const sel = onbCareerYear === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setOnbCareerYear(opt);
                        }}
                        style={{
                          height: "48px", border: "none", borderRadius: "12px",
                          background: sel ? "var(--soft,#dde9f0)" : "#f6f4ed",
                          color: sel ? "var(--c1,#163e57)" : "#15211c",
                          fontWeight: sel ? "800" : "600", fontSize: "14px", fontFamily: "inherit",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px"
                        }}
                      >
                        <span>{opt}</span>
                        {sel && (
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                            <path d="M5 10.5 8.5 14 15 6.5" stroke="var(--c1,#163e57)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {onbStep === 2 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {REGIONS.map((opt) => {
                    const sel = onbRegion.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setOnbRegion(p => p.includes(opt) ? p.filter(x => x !== opt) : [...p, opt]);
                        }}
                        style={{
                          height: "48px", border: "none", borderRadius: "12px",
                          background: sel ? "var(--soft,#dde9f0)" : "#f6f4ed",
                          color: sel ? "var(--c1,#163e57)" : "#15211c",
                          fontWeight: sel ? "800" : "600", fontSize: "14px", fontFamily: "inherit",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
                        }}
                      >
                        {opt}
                        {sel && (
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                            <path d="M5 10.5 8.5 14 15 6.5" stroke="var(--c1,#163e57)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              {onbStep > 0 && (
                <button
                  type="button"
                  onClick={() => setOnbStep(p => p - 1)}
                  style={{
                    flex: "1", height: "50px", border: "1px solid #e0dccf", borderRadius: "14px",
                    background: "#fff", color: "#5d6b62", fontSize: "15px", fontWeight: "700",
                    fontFamily: "inherit", cursor: "pointer"
                  }}
                >
                  이전 단계
                </button>
              )}
              <button
                type="button"
                onClick={handleOnboardingNext}
                disabled={
                  (onbStep === 0 && onbJobType.length === 0) ||
                  (onbStep === 1 && !onbCareerYear) ||
                  (onbStep === 2 && onbRegion.length === 0)
                }
                style={{
                  flex: "2", height: "50px", border: "none", borderRadius: "14px",
                  background: "linear-gradient(135deg,var(--c1,#0d3b2e),var(--c2,#114a39))",
                  color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit",
                  cursor: "pointer", opacity: (
                    (onbStep === 0 && onbJobType.length === 0) ||
                    (onbStep === 1 && !onbCareerYear) ||
                    (onbStep === 2 && onbRegion.length === 0)
                  ) ? 0.5 : 1
                }}
              >
                {onbStep === 2 ? "프로필 등록 완료" : "다음 단계"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
    </div>
  );
}
