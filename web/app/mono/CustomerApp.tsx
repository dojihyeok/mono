"use client";

// 작업요청자(CUSTOMER) 앱 — 발주측 단방향 수요 흐름(dev-plan §5.7).
// WORKER/FIELD_LEADER 의 MonoApp 과 분리(거대 파일 무수술). 홈 = 내 작업요청 현황 + 새 요청 + Field Ops.
import { useEffect, useState } from "react";
import { useProfile } from "@/lib/ProfileContext";
import { track } from "@/lib/analytics";
import { INDUSTRIES, REGIONS, FIELDOPS_FEATURES } from "@/lib/constants";
import {
  apiCreateWorkRequest,
  apiListMyWorkRequests,
  apiRegisterFieldOpsInterest,
  apiListCandidates,
  apiAddCandidate,
  apiUpdateCandidate,
  apiListPerformers,
  apiListTeams,
  apiSubmitReview,
  apiGetRecommendations,
  apiGetTrustScore,
} from "@/lib/apiClient";
import ForeignCandidateSearch from "./ForeignCandidateSearch";
import SettlementManager from "./SettlementManager";
import ReviewSheet from "./ReviewSheet";
import type {
  WorkRequest,
  WorkRequestCandidate,
  Performer,
  TeamDir,
  Recommendation,
  TrustScore,
} from "@/lib/types";

const CONTRACT_TYPES = [
  { value: "DAILY", label: "일급(상용)" },
  { value: "UNIT", label: "단가/물량" },
  { value: "LUMP_SUM", label: "도급(일괄)" },
  { value: "MONTHLY", label: "월급/상주" },
] as const;

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "작성 중",
  OPEN: "후보 모집",
  MATCHING: "매칭 중",
  ASSIGNED: "수행 확정",
  COMPLETED: "완료",
  CLOSED: "종료",
  CANCELLED: "취소",
};

const indLabel = (v: string) =>
  INDUSTRIES.find((i) => i.value === v)?.label ?? v;

// 후보 상태(WorkRequestCandidate.status) 표시 + 전이 액션
const CAND_STATUS_LABEL: Record<string, string> = {
  RECOMMENDED: "추천",
  SHORTLISTED: "지정",
  CONTACTED: "접촉",
  SELECTED: "선정",
  REJECTED: "제외",
};
const CAND_ACTIONS: { status: string; label: string }[] = [
  { status: "SHORTLISTED", label: "지정" },
  { status: "CONTACTED", label: "접촉" },
  { status: "SELECTED", label: "선정" },
  { status: "REJECTED", label: "제외" },
];
const CAND_TYPE_LABEL: Record<string, string> = {
  PERFORMER_COMPANY: "수행기업",
  FIELD_LEADER: "현장리더",
  TEAM: "작업팀",
};

export default function CustomerApp({ role = "CUSTOMER" }: { role?: "CUSTOMER" | "PROJECT_OPERATOR" }) {
  const { user } = useProfile();
  const isOperator = role === "PROJECT_OPERATOR";
  const [list, setList] = useState<WorkRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [opsDone, setOpsDone] = useState<string[]>([]);
  const [panelWr, setPanelWr] = useState<WorkRequest | null>(null); // 후보 패널 대상
  const [foreignOpen, setForeignOpen] = useState(false); // 외국인 후보 검색 시트

  const load = () => {
    void apiListMyWorkRequests().then((r) => {
      setList(r || []);
      setLoading(false);
    });
  };
  useEffect(() => {
    load();
    track("field_operations_viewed", { surface: "customer_home" });
  }, []);

  const onPickFieldOps = (key: string, event: Parameters<typeof track>[0]) => {
    if (opsDone.includes(key)) return;
    track(event);
    void apiRegisterFieldOpsInterest(key, { industry: user?.industries?.[0] });
    setOpsDone((p) => [...p, key]);
  };

  const switchType = () => {
    try {
      window.localStorage.removeItem("mono.userType");
    } catch {
      /* noop */
    }
    window.location.reload();
  };

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg,#f5f6fb)", color: "var(--app-text,#4f46e5)" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "calc(28px + env(safe-area-inset-top)) 20px 48px" }}>
        {/* 헤더 */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "var(--c1,#4f46e5)", background: "var(--aSoft,#ecedfb)", padding: "5px 11px", borderRadius: "999px" }}>{isOperator ? "운영자" : "작업요청자"}</span>
            <h1 style={{ margin: "14px 0 0", fontSize: "24px", fontWeight: 800, letterSpacing: "-.6px", color: "var(--app-text,#4f46e5)" }}>
              {user?.name ?? (isOperator ? "운영자" : "발주자")}님,<br />{isOperator ? "어떤 현장을 운영하시겠어요?" : "어떤 현장을 맡기시겠어요?"}
            </h1>
          </div>
          <button onClick={switchType} style={{ flex: "none", marginTop: "2px", padding: "7px 11px", borderRadius: "10px", border: "1px solid #e6e8ec", background: "#fff", color: "var(--app-text-secondary,#5b6b82)", fontSize: "12px", fontWeight: 700, fontFamily: "inherit", cursor: "pointer" }}>
            유형 전환
          </button>
        </div>

        {/* 새 작업요청 CTA */}
        <button
          onClick={() => {
            track("work_request_started");
            setFormOpen(true);
          }}
          style={{ marginTop: "22px", width: "100%", height: "54px", borderRadius: "16px", border: "none", background: "var(--c1,#4f46e5)", color: "#fff", fontSize: "16px", fontWeight: 800, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 12px 26px -10px color-mix(in srgb, var(--brand,#4f46e5) 55%, transparent)" }}
        >
          {isOperator ? "+ 새 프로젝트 현장 등록" : "+ 새 작업요청 등록"}
        </button>

        {/* 내 정산 관리 (Sprint 6) */}
        <h2 style={sectionTitle}>근로자 정산 및 결제 관리</h2>
        <SettlementManager companyId={user?.id || "temp-company-id"} />
        <button
          onClick={() => {
            void import("@/lib/apiClient").then(({ apiCreateReferral }) => {
              apiCreateReferral({ kind: "SETTLEMENT", note: "안심 정산 및 에스크로 도입 상담" })
                .then(() => alert("안심 정산 도입 상담이 접수되었습니다. 담당자가 곧 연락드리겠습니다."))
                .catch(() => alert("접수에 실패했습니다. 다시 시도해주세요."));
            });
            track("referral_requested", { kind: "SETTLEMENT" });
          }}
          style={{ ...cardBase, display: "block", width: "100%", textAlign: "center", cursor: "pointer", fontFamily: "inherit", marginTop: "12px", background: "var(--c1,#4f46e5)", color: "#fff", fontWeight: 800 }}
        >
          안심 정산 및 에스크로 도입 상담 (무료)
        </button>

        {/* 내 작업요청 현황 */}
        <h2 style={sectionTitle}>{isOperator ? "운영 중인 현장 프로젝트" : "내 작업요청"}</h2>
        {loading ? (
          <div style={{ ...cardBase, color: "var(--app-text-tertiary,#8694a8)", textAlign: "center" }}>불러오는 중…</div>
        ) : list.length === 0 ? (
          <div style={{ ...cardBase, textAlign: "center", color: "var(--app-text-secondary,#5b6b82)" }}>
            <div style={{ fontSize: "14px", fontWeight: 700 }}>아직 등록한 작업요청이 없어요.</div>
            <div style={{ fontSize: "12.5px", marginTop: "5px" }}>위 버튼으로 첫 요청을 등록해 보세요.</div>
          </div>
        ) : (
          list.map((wr) => (
            <button
              key={wr.id}
              onClick={() => {
                track("operator_recommendation_clicked", { workRequestId: wr.id, surface: "wr_card" });
                setPanelWr(wr);
              }}
              style={{ ...cardBase, display: "block", width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "15px", fontWeight: 800, color: "var(--app-text,#4f46e5)" }}>{indLabel(wr.industry)}</span>
                <span style={{ flex: "none", fontSize: "11.5px", fontWeight: 800, color: "var(--c1,#4f46e5)", background: "var(--aSoft,#ecedfb)", padding: "4px 9px", borderRadius: "999px" }}>
                  {STATUS_LABEL[wr.status] ?? wr.status}
                </span>
              </div>
              <div style={{ marginTop: "7px", fontSize: "12.5px", color: "var(--app-text-secondary,#5b6b82)", lineHeight: 1.6 }}>
                {[
                  wr.workTypes?.length ? wr.workTypes.join("·") : null,
                  wr.region?.length ? wr.region.join("·") : null,
                  wr.headcount ? `${wr.headcount}명` : null,
                ].filter(Boolean).join(" · ") || "상세 미입력"}
              </div>
              <div style={{ marginTop: "9px", fontSize: "12px", fontWeight: 800, color: "var(--c1,#4f46e5)" }}>후보 찾기·관리 ›</div>
            </button>
          ))
        )}

        {/* Field Ops 7종 */}
        <h2 style={sectionTitle}>현장 운영 서비스</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {FIELDOPS_FEATURES.map((f) => {
            const done = opsDone.includes(f.key);
            return (
              <button
                key={f.key}
                onClick={() => onPickFieldOps(f.key, f.event)}
                style={{ textAlign: "left", padding: "14px", borderRadius: "14px", border: `1.5px solid ${done ? "var(--c1,#4f46e5)" : "#e6e8ec"}`, background: done ? "var(--aSoft,#ecedfb)" : "#fff", cursor: done ? "default" : "pointer", fontFamily: "inherit" }}
              >
                <div style={{ fontSize: "13.5px", fontWeight: 800, color: "var(--app-text,#4f46e5)" }}>{f.label}</div>
                <div style={{ marginTop: "4px", fontSize: "11.5px", color: "var(--app-text-secondary,#5b6b82)", lineHeight: 1.5 }}>{f.short}</div>
                <div style={{ marginTop: "8px", fontSize: "11.5px", fontWeight: 800, color: "var(--c1,#4f46e5)" }}>{done ? "신청됨 ✓" : "관심 신청"}</div>
              </button>
            );
          })}
        </div>

        {/* 외국인 기술자 후보 검색 (dev-plan-foreign-workforce §5-5) */}
        <h2 style={sectionTitle}>외국인 기술자</h2>
        <button
          onClick={() => setForeignOpen(true)}
          style={{ ...cardBase, display: "block", width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}
          aria-label="외국인 기술자 후보 검색"
        >
          <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--app-text,#4f46e5)" }}>🌏 외국인 기술자 후보 찾기</div>
          <div style={{ marginTop: "6px", fontSize: "12.5px", color: "var(--app-text-secondary,#5b6b82)", lineHeight: 1.6 }}>
            체류자격·한국어 수준·산업·지역으로 후보를 검색해요.
          </div>
          <div style={{ marginTop: "9px", fontSize: "12px", fontWeight: 800, color: "var(--c1,#4f46e5)" }}>후보 검색 ›</div>
        </button>
      </div>

      {formOpen && (
        <WorkRequestForm
          defaultIndustry={user?.industries?.[0]}
          defaultRegion={user?.region ?? []}
          onClose={() => setFormOpen(false)}
          onSubmitted={() => {
            setFormOpen(false);
            load();
          }}
        />
      )}

      {panelWr && (
        <CandidatePanel wr={panelWr} onClose={() => setPanelWr(null)} />
      )}

      {foreignOpen && (
        <div
          onClick={() => setForeignOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(15,18,30,.45)", display: "flex", alignItems: "flex-end", zIndex: 60 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "480px", margin: "0 auto", maxHeight: "92dvh", overflowY: "auto", background: "var(--bg,#f5f6fb)", borderRadius: "28px 28px 0 0", padding: "10px 0 calc(20px + env(safe-area-inset-bottom))", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)" }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end", padding: "4px 16px" }}>
              <button onClick={() => setForeignOpen(false)} aria-label="닫기" style={{ border: "none", background: "transparent", fontSize: "22px", color: "var(--app-text-secondary,#5b6b82)", cursor: "pointer", fontFamily: "inherit" }}>×</button>
            </div>
            <ForeignCandidateSearch />
          </div>
        </div>
      )}
    </div>
  );
}

// 후보 패널(§5.7 4단계) — 작업요청별 후보 조회·지정·상태관리. 수행기업/작업팀 디렉터리에서 지정.
function CandidatePanel({ wr, onClose }: { wr: WorkRequest; onClose: () => void }) {
  const [candidates, setCandidates] = useState<WorkRequestCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [browse, setBrowse] = useState<"PERFORMER_COMPANY" | "TEAM" | "RECO" | null>(null);
  const [reviewFor, setReviewFor] = useState<WorkRequestCandidate | null>(null);
  const [recos, setRecos] = useState<Recommendation[] | null>(null);
  const openRecos = () => {
    track("operator_recommendation_clicked", { workRequestId: wr.id, surface: "auto_reco" });
    setBrowse("RECO");
    setRecos(null);
    void apiGetRecommendations(wr.id).then(setRecos);
  };

  const region = wr.region?.[0];
  const reload = () => {
    void apiListCandidates(wr.id).then((c) => {
      setCandidates(c || []);
      setLoading(false);
    });
  };
  useEffect(reload, [wr.id]);

  const setStatus = async (cid: string, status: string) => {
    const prev = candidates;
    setCandidates((cs) => cs.map((c) => (c.id === cid ? { ...c, status: status as WorkRequestCandidate["status"] } : c)));
    const res = await apiUpdateCandidate(wr.id, cid, { status });
    if (!res) setCandidates(prev); // 실패 롤백
  };

  const addCandidate = async (type: string, id: string, name: string) => {
    track("candidate_shortlisted", { workRequestId: wr.id, candidateType: type });
    const res = await apiAddCandidate(wr.id, { candidateType: type, candidateId: id, memo: name });
    if (res) {
      setBrowse(null);
      reload();
    }
  };

  const addedIds = new Set(candidates.map((c) => c.candidateId));

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(17,17,17,.34)", backdropFilter: "blur(3px)", zIndex: 60, display: "flex", alignItems: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "480px", margin: "0 auto", maxHeight: "90dvh", overflowY: "auto", background: "#fff", borderRadius: "28px 28px 0 0", padding: "10px 20px calc(20px + env(safe-area-inset-bottom))", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)" }}>
        <div style={{ width: "38px", height: "4px", borderRadius: "999px", background: "#e6e8ec", margin: "0 auto 14px" }} />
        <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 800, letterSpacing: "-.5px", color: "var(--app-text,#4f46e5)" }}>
          {indLabel(wr.industry)} 후보
        </h2>
        <p style={{ margin: 0, fontSize: "12.5px", color: "var(--app-text-secondary,#5b6b82)" }}>
          {[wr.region?.join("·"), wr.headcount ? `${wr.headcount}명` : null].filter(Boolean).join(" · ") || "후보를 찾아 지정하세요"}
        </p>

        {browse === null ? (
          <>
            {/* 지정된 후보 */}
            {loading ? (
              <div style={{ ...cardBase, marginTop: "16px", color: "var(--app-text-tertiary,#8694a8)", textAlign: "center" }}>불러오는 중…</div>
            ) : candidates.length === 0 ? (
              <div style={{ ...cardBase, marginTop: "16px", textAlign: "center", color: "var(--app-text-secondary,#5b6b82)" }}>
                <div style={{ fontSize: "13.5px", fontWeight: 700 }}>아직 지정한 후보가 없어요.</div>
                <div style={{ fontSize: "12px", marginTop: "4px" }}>아래에서 수행기업·작업팀을 찾아보세요.</div>
              </div>
            ) : (
              <div style={{ marginTop: "14px" }}>
                {candidates.map((c) => (
                  <div key={c.id} style={cardBase}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--app-text,#4f46e5)" }}>{c.memo || CAND_TYPE_LABEL[c.candidateType]}</span>
                      <span style={{ flex: "none", fontSize: "11px", fontWeight: 800, color: c.status === "REJECTED" ? "#8694a8" : "var(--c1,#4f46e5)", background: c.status === "REJECTED" ? "#eef0f3" : "var(--aSoft,#ecedfb)", padding: "4px 9px", borderRadius: "999px" }}>
                        {CAND_STATUS_LABEL[c.status] ?? c.status}
                      </span>
                    </div>
                    <div style={{ marginTop: "4px", fontSize: "11.5px", color: "var(--app-text-tertiary,#8694a8)", fontWeight: 700 }}>{CAND_TYPE_LABEL[c.candidateType]}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                      {CAND_ACTIONS.map((a) => {
                        const on = c.status === a.status;
                        return (
                          <button key={a.status} onClick={() => setStatus(c.id, a.status)} style={{ padding: "7px 12px", borderRadius: "999px", border: `1.5px solid ${on ? "var(--c1,#4f46e5)" : "#e6e8ec"}`, background: on ? "var(--c1,#4f46e5)" : "#fff", color: on ? "#fff" : "var(--app-text-secondary,#5b6b82)", fontSize: "12px", fontWeight: 700, fontFamily: "inherit", cursor: "pointer" }}>{a.label}</button>
                        );
                      })}
                    </div>
                    {c.status === "SELECTED" && (
                      <button onClick={() => setReviewFor(c)} style={{ marginTop: "10px", width: "100%", height: "42px", borderRadius: "12px", border: "1.5px solid var(--c1,#4f46e5)", background: "var(--aSoft,#ecedfb)", color: "var(--c1,#4f46e5)", fontSize: "13px", fontWeight: 800, fontFamily: "inherit", cursor: "pointer" }}>완료 평가하기</button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* AI 추천 */}
            <button onClick={openRecos} style={{ marginTop: "16px", width: "100%", height: "50px", borderRadius: "14px", border: "none", background: "var(--c1,#4f46e5)", color: "#fff", fontSize: "14px", fontWeight: 800, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 10px 22px -12px color-mix(in srgb, var(--brand,#4f46e5) 60%, transparent)" }}>✨ AI 추천 후보 받기</button>

            {/* 후보 찾기 진입 */}
            <h3 style={{ ...sectionTitle, fontSize: "14px" }}>직접 찾기</h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setBrowse("PERFORMER_COMPANY")} style={browseBtn}>수행기업 찾기</button>
              <button onClick={() => setBrowse("TEAM")} style={browseBtn}>작업팀 찾기</button>
            </div>
          </>
        ) : browse === "RECO" ? (
          <RecoView
            recos={recos}
            addedIds={addedIds}
            onBack={() => setBrowse(null)}
            onPick={addCandidate}
          />
        ) : (
          <CandidateBrowse
            kind={browse}
            industry={wr.industry}
            region={region}
            addedIds={addedIds}
            onBack={() => setBrowse(null)}
            onPick={addCandidate}
          />
        )}

        {reviewFor && (
          <ReviewSheet
            title="완료 평가"
            subtitle={`${reviewFor.memo || CAND_TYPE_LABEL[reviewFor.candidateType]} · 0~5점`}
            metrics={REVIEW_METRICS}
            onClose={() => setReviewFor(null)}
            onSubmit={async (scores, comment) => {
              const res = await apiSubmitReview({
                rateeType: reviewFor.candidateType,
                rateeId: reviewFor.candidateId,
                workRequestId: wr.id,
                ...scores,
                comment: comment || undefined,
              });
              if (res) {
                track("project_review_submitted", { rateeType: reviewFor.candidateType });
                setReviewFor(null);
                reload();
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

// 완료 평가(§5.9) — 7항목 0~5 점수 + 코멘트. 선정 후보 대상.
const REVIEW_METRICS: { key: string; label: string }[] = [
  { key: "scheduleAdherence", label: "일정준수" },
  { key: "workQuality", label: "작업품질" },
  { key: "communication", label: "커뮤니케이션" },
  { key: "safetyManagement", label: "안전관리" },
  { key: "costTrust", label: "비용신뢰" },
  { key: "rehireIntent", label: "재의뢰의향" },
  { key: "siteEnvironment", label: "현장환경" },
];

// 수행기업/작업팀 디렉터리 — 산업·지역 필터로 조회, 탭해서 후보 지정.
function CandidateBrowse({
  kind,
  industry,
  region,
  addedIds,
  onBack,
  onPick,
}: {
  kind: "PERFORMER_COMPANY" | "TEAM";
  industry: string;
  region?: string;
  addedIds: Set<string>;
  onBack: () => void;
  onPick: (type: string, id: string, name: string) => void;
}) {
  const [performers, setPerformers] = useState<(Performer & { ts?: number })[]>([]);
  const [teams, setTeams] = useState<(TeamDir & { ts?: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (kind === "PERFORMER_COMPANY") {
      track("performer_profile_viewed", { industry, surface: "candidate_browse" });
      void apiListPerformers({ industry, region }).then(async (p) => {
        const withTs = await Promise.all(p.map(async (x) => {
          const t = await apiGetTrustScore("PERFORMER_COMPANY", x.id);
          return { ...x, ts: t?.score };
        }));
        setPerformers(withTs);
        setLoading(false);
      });
    } else {
      track("field_leader_profile_viewed", { industry, surface: "candidate_browse" });
      void apiListTeams({ industry, region }).then(async (t) => {
        const withTs = await Promise.all(t.map(async (x) => {
          const s = await apiGetTrustScore("TEAM", x.id);
          return { ...x, ts: s?.score };
        }));
        setTeams(withTs);
        setLoading(false);
      });
    }
  }, [kind, industry, region]);

  const rate = (r?: number | null) => (r != null ? `안전 ${Math.round(r * 100)}%` : null);

  return (
    <div style={{ marginTop: "14px" }}>
      <button onClick={onBack} style={{ padding: "6px 0", border: "none", background: "none", color: "var(--app-text-secondary,#5b6b82)", fontSize: "13px", fontWeight: 700, fontFamily: "inherit", cursor: "pointer" }}>
        ← 후보 목록
      </button>
      <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--app-text,#4f46e5)", margin: "6px 0 12px" }}>
        {kind === "PERFORMER_COMPANY" ? "수행기업" : "작업팀"} · {indLabel(industry)}{region ? ` · ${region}` : ""}
      </div>

      {loading ? (
        <div style={{ ...cardBase, color: "var(--app-text-tertiary,#8694a8)", textAlign: "center" }}>불러오는 중…</div>
      ) : kind === "PERFORMER_COMPANY" ? (
        performers.length === 0 ? (
          <EmptyDir />
        ) : (
          performers.map((p) => (
            <DirRow
              key={p.id}
              name={p.name}
              meta={[
                p.ts && p.ts > 0 ? `⭐ 신뢰 ${p.ts}점` : null,
                rate(p.safetyRate),
                p._count ? `사례 ${p._count.workRecords}건` : null,
                p.region?.join("·")
              ].filter(Boolean).join(" · ")}
              added={addedIds.has(p.id)}
              onPick={() => onPick("PERFORMER_COMPANY", p.id, p.name)}
            />
          ))
        )
      ) : teams.length === 0 ? (
        <EmptyDir />
      ) : (
        teams.map((t) => (
          <DirRow
            key={t.id}
            name={t.name}
            meta={[
              t.ts && t.ts > 0 ? `⭐ 신뢰 ${t.ts}점` : null,
              t.leader?.name ? `리더 ${t.leader.name}` : null,
              t._count ? `${t._count.members}명` : null,
              rate(t.safetyRate),
              t.regions?.join("·")
            ].filter(Boolean).join(" · ")}
            added={addedIds.has(t.id)}
            onPick={() => onPick("TEAM", t.id, t.name)}
          />
        ))
      )}
    </div>
  );
}

// AI 추천 후보 — 매칭 점수순. 산업·지역·직군·안전·신뢰 가중.
function RecoView({ recos, addedIds, onBack, onPick }: { recos: Recommendation[] | null; addedIds: Set<string>; onBack: () => void; onPick: (type: string, id: string, name: string) => void }) {
  return (
    <div style={{ marginTop: "14px" }}>
      <button onClick={onBack} style={{ padding: "6px 0", border: "none", background: "none", color: "var(--app-text-secondary,#5b6b82)", fontSize: "13px", fontWeight: 700, fontFamily: "inherit", cursor: "pointer" }}>← 후보 목록</button>
      <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--app-text,#4f46e5)", margin: "6px 0 12px" }}>✨ AI 추천 후보 · 매칭 점수순</div>
      {recos === null ? (
        <div style={{ ...cardBase, color: "var(--app-text-tertiary,#8694a8)", textAlign: "center" }}>추천 계산 중…</div>
      ) : recos.length === 0 ? (
        <EmptyDir />
      ) : (
        recos.map((r) => (
          <div key={`${r.candidateType}:${r.candidateId}`} style={{ ...cardBase, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--app-text,#4f46e5)" }}>{r.name}</span>
                <span style={{ flex: "none", fontSize: "11px", fontWeight: 800, color: "var(--c1,#4f46e5)", background: "var(--aSoft,#ecedfb)", padding: "3px 8px", borderRadius: "999px" }}>{Math.round(r.score)}점</span>
              </div>
              <div style={{ marginTop: "4px", fontSize: "11.5px", color: "var(--app-text-secondary,#5b6b82)", lineHeight: 1.5 }}>{CAND_TYPE_LABEL[r.candidateType]} · {r.reasons.join(" · ")}</div>
            </div>
            <button onClick={() => onPick(r.candidateType, r.candidateId, r.name)} disabled={addedIds.has(r.candidateId)} style={{ flex: "none", padding: "9px 14px", borderRadius: "12px", border: "none", background: addedIds.has(r.candidateId) ? "#eef0f3" : "var(--c1,#4f46e5)", color: addedIds.has(r.candidateId) ? "#8694a8" : "#fff", fontSize: "12.5px", fontWeight: 800, fontFamily: "inherit", cursor: addedIds.has(r.candidateId) ? "default" : "pointer" }}>{addedIds.has(r.candidateId) ? "지정됨 ✓" : "후보 지정"}</button>
          </div>
        ))
      )}
    </div>
  );
}

function DirRow({ name, meta, added, onPick }: { name: string; meta: string; added: boolean; onPick: () => void }) {
  return (
    <div style={{ ...cardBase, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--app-text,#4f46e5)" }}>{name}</div>
        <div style={{ marginTop: "3px", fontSize: "11.5px", color: "var(--app-text-secondary,#5b6b82)", lineHeight: 1.5 }}>{meta || "정보 미입력"}</div>
      </div>
      <button
        onClick={onPick}
        disabled={added}
        style={{ flex: "none", padding: "9px 14px", borderRadius: "12px", border: "none", background: added ? "#eef0f3" : "var(--c1,#4f46e5)", color: added ? "#8694a8" : "#fff", fontSize: "12.5px", fontWeight: 800, fontFamily: "inherit", cursor: added ? "default" : "pointer" }}
      >
        {added ? "지정됨 ✓" : "후보 지정"}
      </button>
    </div>
  );
}

function EmptyDir() {
  return (
    <div style={{ ...cardBase, textAlign: "center", color: "var(--app-text-secondary,#5b6b82)" }}>
      <div style={{ fontSize: "13.5px", fontWeight: 700 }}>해당 조건의 후보가 아직 없어요.</div>
      <div style={{ fontSize: "12px", marginTop: "4px" }}>산업·지역이 등록된 수행기업·작업팀이 늘면 표시돼요.</div>
    </div>
  );
}

const browseBtn: React.CSSProperties = { flex: 1, height: "48px", borderRadius: "14px", border: "1.5px solid var(--c1,#4f46e5)", background: "var(--aSoft,#ecedfb)", color: "var(--c1,#4f46e5)", fontSize: "13.5px", fontWeight: 800, fontFamily: "inherit", cursor: "pointer" };

function WorkRequestForm({
  defaultIndustry,
  defaultRegion,
  onClose,
  onSubmitted,
}: {
  defaultIndustry?: string;
  defaultRegion?: string[];
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [industry, setIndustry] = useState<string>(defaultIndustry ?? "");
  const [region, setRegion] = useState<string[]>(defaultRegion ?? []);
  const [workTypes, setWorkTypes] = useState("");
  const [headcount, setHeadcount] = useState("");
  const [schedule, setSchedule] = useState("");
  const [budgetMemo, setBudgetMemo] = useState("");
  const [contractType, setContractType] = useState("");
  const [safetyConds, setSafetyConds] = useState("");
  const [foreignAllowed, setForeignAllowed] = useState(false);
  const [requiredVisaTypes, setRequiredVisaTypes] = useState<string[]>([]);
  const [interpreterProvided, setInterpreterProvided] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const valid = !!industry && region.length > 0;
  const toggleRegion = (v: string) =>
    setRegion((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  const submit = async () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    const res = await apiCreateWorkRequest({
      industry,
      region,
      workTypes: workTypes.trim() ? workTypes.split(/[,\s]+/).filter(Boolean) : undefined,
      headcount: headcount ? Number(headcount) : undefined,
      schedule: schedule.trim() || undefined,
      budgetMemo: budgetMemo.trim() || undefined,
      contractType: contractType || undefined,
      safetyConds: safetyConds.trim() || undefined,
      foreignAllowed,
      requiredVisaTypes: requiredVisaTypes.length > 0 ? requiredVisaTypes : undefined,
      interpreterProvided,
    });
    setSubmitting(false);
    if (res) {
      track("work_request_submitted", { industry });
      onSubmitted();
    }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(17,17,17,.34)", backdropFilter: "blur(3px)", zIndex: 60, display: "flex", alignItems: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "480px", margin: "0 auto", maxHeight: "90dvh", overflowY: "auto", background: "#fff", borderRadius: "28px 28px 0 0", padding: "10px 20px calc(20px + env(safe-area-inset-bottom))", animation: "sheetUp .32s cubic-bezier(.22,1,.36,1)" }}>
        <div style={{ width: "38px", height: "4px", borderRadius: "999px", background: "#e6e8ec", margin: "0 auto 14px" }} />
        <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 800, letterSpacing: "-.5px", color: "var(--app-text,#4f46e5)" }}>현장작업요청</h2>
        <p style={{ margin: 0, fontSize: "12.5px", color: "var(--app-text-secondary,#5b6b82)" }}>산업·지역만 정하면 등록돼요. 나머지는 선택.</p>

        <FieldLabel>산업 분야</FieldLabel>
        <Pills options={INDUSTRIES.map((i) => i.value)} labels={INDUSTRIES.map((i) => i.label)} selected={industry ? [industry] : []} onToggle={(v) => setIndustry((p) => (p === v ? "" : v))} />

        <FieldLabel>지역 <em style={hintEm}>복수</em></FieldLabel>
        <Pills options={[...REGIONS]} selected={region} onToggle={toggleRegion} />

        <FieldLabel>작업유형 <em style={hintEm}>쉼표로 구분</em></FieldLabel>
        <input value={workTypes} onChange={(e) => setWorkTypes(e.target.value)} placeholder="예: 철거, 도배" style={inputStyle} />

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <FieldLabel>필요 인원</FieldLabel>
            <input value={headcount} onChange={(e) => setHeadcount(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" placeholder="명" style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <FieldLabel>일정</FieldLabel>
            <input value={schedule} onChange={(e) => setSchedule(e.target.value)} placeholder="예: 7월 첫째주" style={inputStyle} />
          </div>
        </div>

        <FieldLabel>계약방식</FieldLabel>
        <Pills options={CONTRACT_TYPES.map((c) => c.value)} labels={CONTRACT_TYPES.map((c) => c.label)} selected={contractType ? [contractType] : []} onToggle={(v) => setContractType((p) => (p === v ? "" : v))} />

        <FieldLabel>예산</FieldLabel>
        <input value={budgetMemo} onChange={(e) => setBudgetMemo(e.target.value)} placeholder="예: 일 30만원 / 총 1500만원" style={inputStyle} />

        <FieldLabel>안전 조건</FieldLabel>
        <input value={safetyConds} onChange={(e) => setSafetyConds(e.target.value)} placeholder="예: 안전교육 이수 필수" style={inputStyle} />

        <div style={{ marginTop: "24px", borderTop: "1px solid #eef0f6", paddingTop: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <FieldLabel style={{ margin: 0 }}>외국인 채용 가능 여부</FieldLabel>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setForeignAllowed(true)} style={{ ...pill(foreignAllowed), padding: "6px 12px", fontSize: "12px" }}>가능</button>
              <button onClick={() => setForeignAllowed(false)} style={{ ...pill(!foreignAllowed), padding: "6px 12px", fontSize: "12px" }}>불가</button>
            </div>
          </div>
          {foreignAllowed && (
            <div style={{ marginTop: "12px", padding: "12px", background: "var(--bg,#f5f6fb)", borderRadius: "12px" }}>
              <FieldLabel style={{ margin: "0 0 8px" }}>요구 체류자격 (비자) <em style={hintEm}>선택</em></FieldLabel>
              <Pills options={["E9", "E7", "F4", "F5", "F6"]} labels={["E-9 (비전문)", "E-7 (특정활동)", "F-4 (재외동포)", "F-5 (영주)", "F-6 (결혼이민)"]} selected={requiredVisaTypes} onToggle={(v) => setRequiredVisaTypes(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])} />
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px" }}>
                <span style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--app-text-secondary,#5b6b82)" }}>현장 통역 제공</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setInterpreterProvided(true)} style={{ ...pill(interpreterProvided), padding: "6px 12px", fontSize: "12px" }}>제공</button>
                  <button onClick={() => setInterpreterProvided(false)} style={{ ...pill(!interpreterProvided), padding: "6px 12px", fontSize: "12px" }}>미제공</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <button onClick={submit} disabled={!valid || submitting} style={{ marginTop: "20px", width: "100%", height: "54px", borderRadius: "16px", border: "none", background: valid && !submitting ? "var(--c1,#4f46e5)" : "#e6e8ec", color: valid && !submitting ? "#fff" : "#8694a8", fontSize: "16px", fontWeight: 800, fontFamily: "inherit", cursor: valid && !submitting ? "pointer" : "default" }}>
          {submitting ? "등록 중…" : valid ? "작업요청 등록" : "산업·지역을 선택하세요"}
        </button>
      </div>
    </div>
  );
}

// ── 소형 공용 UI ──
function FieldLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <label style={{ display: "block", fontSize: "13px", fontWeight: 800, color: "var(--app-text,#4f46e5)", margin: "18px 0 9px", ...style }}>{children}</label>;
}

function Pills({ options, labels, selected, onToggle }: { options: string[]; labels?: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {options.map((o, i) => {
        const on = selected.includes(o);
        return (
          <button key={o} type="button" onClick={() => onToggle(o)} style={{ padding: "9px 14px", borderRadius: "999px", border: `1.5px solid ${on ? "var(--c1,#4f46e5)" : "#e6e8ec"}`, background: on ? "var(--c1,#4f46e5)" : "#fff", color: on ? "#fff" : "var(--app-text-secondary,#5b6b82)", fontSize: "13.5px", fontWeight: on ? 800 : 600, fontFamily: "inherit", cursor: "pointer" }}>{labels?.[i] ?? o}</button>
        );
      })}
    </div>
  );
}

const sectionTitle: React.CSSProperties = { margin: "30px 0 12px", fontSize: "15px", fontWeight: 800, letterSpacing: "-.3px", color: "var(--app-text,#4f46e5)" };
const cardBase: React.CSSProperties = { padding: "16px", borderRadius: "16px", border: "1px solid #e6e8ec", background: "#fff", marginBottom: "10px" };
const hintEm: React.CSSProperties = { fontStyle: "normal", fontSize: "11.5px", color: "var(--app-text-tertiary,#8694a8)", fontWeight: 600 };
const inputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", height: "48px", padding: "0 14px", borderRadius: "13px", border: "1px solid #e6e8ec", background: "#fff", color: "#111111", fontSize: "15px", fontFamily: "inherit", outline: "none" };
const pill = (on: boolean): React.CSSProperties => ({ borderRadius: "999px", border: `1.5px solid ${on ? "var(--c1,#4f46e5)" : "#e6e8ec"}`, background: on ? "var(--c1,#4f46e5)" : "#fff", color: on ? "#fff" : "var(--app-text-secondary,#5b6b82)", fontWeight: on ? 800 : 600, fontFamily: "inherit", cursor: "pointer" });
