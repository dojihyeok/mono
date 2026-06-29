"use client";

// 기업용 외국인 기술자 후보 검색 (dev-plan-foreign-workforce §5-5).
// 정보 제공 화면 — 직업소개·파견 아님(하단 ForeignNotice match 고지).
import { CSSProperties, useEffect, useState } from "react";
import { apiBrowseForeignWorkers, apiSubmitReview } from "@/lib/apiClient";
import { track } from "@/lib/analytics";
import ForeignNotice from "./ForeignNotice";
import ReviewSheet from "./ReviewSheet";
import {
  KOREAN_LEVELS,
  VISA_TYPES,
  INDUSTRIES,
  REGIONS,
  LANGUAGES,
} from "@/lib/constants";
import type { ForeignWorker } from "@/lib/types";

type Filters = {
  koreanLevel?: string;
  residency?: string;
  visaType?: string;
  industry?: string;
  region?: string;
};

// 거주 구분은 별도 상수가 없어 화면 전용으로 정의(서버 enum DOMESTIC/OVERSEAS).
const RESIDENCY = [
  { value: "DOMESTIC", label: "국내 체류" },
  { value: "OVERSEAS", label: "해외 거주" },
] as const;

// value→label (없으면 원본 반환).
const labelOf = (
  list: readonly { value: string; label: string }[],
  value?: string | null,
): string => (value ? list.find((o) => o.value === value)?.label ?? value : "");

const c = {
  indigo: "var(--c1,#4f46e5)",
  soft: "var(--aSoft,#ecedfb)",
  body: "var(--app-text,#4f46e5)",
  sub: "#5b6b82",
  dim: "#8694a8",
  line: "#eef0f6",
};

const card: CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: 16,
  border: `1px solid ${c.line}`,
  marginBottom: 12,
};

const pillBase: CSSProperties = {
  border: "none",
  borderRadius: 999,
  padding: "7px 13px",
  fontSize: 12.5,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={{
        ...pillBase,
        background: active ? c.indigo : c.soft,
        color: active ? "#fff" : c.body,
        fontWeight: active ? 700 : 500,
      }}
    >
      {label}
    </button>
  );
}

function FilterRow({
  title,
  options,
  selected,
  onPick,
}: {
  title: string;
  options: readonly { value: string; label: string }[];
  selected?: string;
  onPick: (value: string) => void;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: c.sub, marginBottom: 7 }}>
        {title}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {options.map((o) => (
          <Pill
            key={o.value}
            label={o.label}
            active={selected === o.value}
            onClick={() => onPick(o.value)}
          />
        ))}
      </div>
    </div>
  );
}

function Chip({ text }: { text: string }) {
  return (
    <span
      style={{
        background: c.soft,
        color: c.body,
        borderRadius: 8,
        padding: "3px 9px",
        fontSize: 11.5,
        fontWeight: 600,
      }}
    >
      {text}
    </span>
  );
}

export default function ForeignCandidateSearch() {
  const [filters, setFilters] = useState<Filters>({});
  const [results, setResults] = useState<ForeignWorker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [reviewFor, setReviewFor] = useState<ForeignWorker | null>(null);
  const [toast, setToast] = useState("");

  const toggle = (key: keyof Filters, value: string) =>
    setFilters((f) => ({ ...f, [key]: f[key] === value ? undefined : value }));

  const run = async (f: Filters) => {
    setLoading(true);
    track("foreign_candidate_searched", { ...f });
    try {
      setResults(await apiBrowseForeignWorkers(f));
    } finally {
      setLoading(false);
    }
  };

  // 마운트 시 1회 전체 로드.
  useEffect(() => {
    void run({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCardClick = (w: ForeignWorker) => {
    const next = openId === w.id ? null : w.id;
    setOpenId(next);
    if (next) track("foreign_candidate_viewed", { id: w.id });
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 14px 28px" }}>
      <h1 style={{ fontSize: 19, fontWeight: 800, color: c.body, margin: "0 0 4px" }}>
        외국인 기술자 후보 검색
      </h1>
      <p style={{ fontSize: 12.5, color: c.dim, margin: "0 0 16px" }}>
        조건을 선택해 현장에 맞는 기술자를 찾아보세요.
      </p>

      <div style={{ ...card }}>
        <button
          type="button"
          aria-expanded={showFilters}
          aria-label={showFilters ? "필터 접기" : "필터 펼치기"}
          onClick={() => setShowFilters((s) => !s)}
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: showFilters ? 14 : 0,
          }}
        >
          <span style={{ fontSize: 13.5, fontWeight: 800, color: c.body }}>
            검색 필터{activeCount ? ` · ${activeCount}개 선택` : ""}
          </span>
          <span style={{ color: c.dim, fontSize: 12 }}>
            {showFilters ? "▲" : "▼"}
          </span>
        </button>

        {showFilters && (
          <>
            <FilterRow
              title="한국어 수준"
              options={KOREAN_LEVELS}
              selected={filters.koreanLevel}
              onPick={(v) => toggle("koreanLevel", v)}
            />
            <FilterRow
              title="거주 구분"
              options={RESIDENCY}
              selected={filters.residency}
              onPick={(v) => toggle("residency", v)}
            />
            <FilterRow
              title="체류 자격"
              options={VISA_TYPES}
              selected={filters.visaType}
              onPick={(v) => toggle("visaType", v)}
            />
            <FilterRow
              title="산업"
              options={INDUSTRIES}
              selected={filters.industry}
              onPick={(v) => toggle("industry", v)}
            />
            <FilterRow
              title="지역"
              options={REGIONS.map((r) => ({ value: r, label: r }))}
              selected={filters.region}
              onPick={(v) => toggle("region", v)}
            />

            <button
              type="button"
              aria-label="후보 검색"
              disabled={loading}
              onClick={() => void run(filters)}
              style={{
                width: "100%",
                marginTop: 4,
                border: "none",
                borderRadius: 12,
                padding: "13px 0",
                background: c.indigo,
                color: "#fff",
                fontSize: 14.5,
                fontWeight: 800,
                cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "검색 중…" : "검색"}
            </button>
          </>
        )}
      </div>

      {!loading && results.length === 0 && (
        <div style={{ ...card, textAlign: "center", padding: "32px 16px" }}>
          <div style={{ fontSize: 26, marginBottom: 8 }} aria-hidden>
            🔎
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: c.body }}>
            조건에 맞는 후보가 아직 없습니다.
          </div>
          <div style={{ fontSize: 12, color: c.dim, marginTop: 6 }}>
            필터를 줄이면 더 많은 후보를 볼 수 있어요.
          </div>
        </div>
      )}

      {results.map((w) => {
        const p = w.workerProfile;
        const visa = w.visaStatuses[0];
        const open = openId === w.id;
        return (
          <div key={w.id} style={card}>
          <button
            type="button"
            aria-expanded={open}
            aria-label={`${w.name} 후보 상세`}
            onClick={() => onCardClick(w)}
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              display: "block",
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 15.5, fontWeight: 800, color: c.body }}>
                {w.name}
              </span>
              {p?.nationality && (
                <span style={{ fontSize: 12, color: c.sub }}>{p.nationality}</span>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                alignItems: "center",
                marginTop: 9,
              }}
            >
              {p?.residency && <Chip text={labelOf(RESIDENCY, p.residency)} />}
              {p?.koreanLevel && (
                <Chip text={`한국어 ${labelOf(KOREAN_LEVELS, p.koreanLevel)}`} />
              )}
              {visa && (
                <Chip text={`${labelOf(VISA_TYPES, visa.visaType)} · ${visa.status}`} />
              )}
              {p?.interpreterNeeded && (
                <span
                  style={{
                    background: "#fff4e5",
                    color: "#b25e00",
                    borderRadius: 8,
                    padding: "3px 9px",
                    fontSize: 11.5,
                    fontWeight: 700,
                  }}
                >
                  통역 필요
                </span>
              )}
            </div>

          </button>

            {open && (
              <div style={{ marginTop: 13, borderTop: `1px solid ${c.line}`, paddingTop: 13 }}>
                {p && p.languages.length > 0 && (
                  <div style={{ marginBottom: 11 }}>
                    <div style={{ fontSize: 11.5, color: c.dim, marginBottom: 6 }}>
                      구사 언어
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {p.languages.map((lg) => (
                        <Chip key={lg} text={labelOf(LANGUAGES, lg)} />
                      ))}
                    </div>
                  </div>
                )}

                {p && p.industries.length > 0 && (
                  <div style={{ marginBottom: 11 }}>
                    <div style={{ fontSize: 11.5, color: c.dim, marginBottom: 6 }}>
                      산업
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {p.industries.map((ind) => (
                        <Chip key={ind} text={labelOf(INDUSTRIES, ind)} />
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: 18 }}>
                  {(
                    [
                      ["경력", w._count?.careerCards],
                      ["자격", w._count?.certificates],
                      ["교육", w._count?.trainingRecords],
                    ] as const
                  ).map(([lab, n]) => (
                    <div key={lab}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: c.indigo }}>
                        {n ?? 0}
                      </div>
                      <div style={{ fontSize: 11, color: c.dim }}>{lab}</div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  aria-label={`${w.name} 평가하기`}
                  onClick={() => setReviewFor(w)}
                  style={{
                    width: "100%",
                    marginTop: 14,
                    border: `1.5px solid ${c.indigo}`,
                    borderRadius: 12,
                    padding: "12px 0",
                    background: c.soft,
                    color: c.indigo,
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  평가하기
                </button>
              </div>
            )}
          </div>
        );
      })}

      {toast && (
        <div
          role="status"
          style={{
            position: "fixed",
            left: "50%",
            bottom: 28,
            transform: "translateX(-50%)",
            background: c.indigo,
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 700,
            zIndex: 80,
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          }}
        >
          {toast}
        </div>
      )}

      {reviewFor && (
        <ReviewSheet
          title="현장 협업 평가"
          subtitle={`${reviewFor.name} · 1~5점`}
          metrics={REVIEW_METRICS}
          onClose={() => setReviewFor(null)}
          onSubmit={async (scores, comment) => {
            const res = await apiSubmitReview({
              rateeType: "WORKER",
              rateeId: reviewFor.id,
              ...scores,
              comment: comment || undefined,
            });
            if (res) {
              track("project_review_submitted", { rateeType: "WORKER", rateeId: reviewFor.id });
              setReviewFor(null);
              setToast("평가 등록됨");
              setTimeout(() => setToast(""), 2000);
            }
          }}
        />
      )}

      <ForeignNotice kind="match" />
    </div>
  );
}

// 후보 평가 8지표(0~5) — 서버 Review/DTO 와 동일 키. 신뢰도 평가 수집(§5).
const REVIEW_METRICS: { key: string; label: string }[] = [
  { key: "communication", label: "의사소통" },
  { key: "workQuality", label: "작업품질" },
  { key: "scheduleAdherence", label: "일정준수" },
  { key: "safetyManagement", label: "안전관리" },
  { key: "collaboration", label: "협업" },
  { key: "rehireIntent", label: "재의뢰" },
  { key: "costTrust", label: "비용신뢰" },
  { key: "siteEnvironment", label: "현장환경" },
];
