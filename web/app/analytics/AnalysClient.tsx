"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./analys.module.css";
import { INTEREST_FEATURES, INDUSTRIES, FIELDOPS_FEATURES } from "@/lib/constants";

interface FunnelStep {
  label: string;
  count: number;
}
interface Summary {
  totalUsers: number;
  overview: {
    visitors: number;
    signups: number;
    profilesCompleted: number;
    interests: number;
    companies: number;
    jobPosts: number;
    workersSaved: number;
    pocInterest: number;
  };
  funnels: { signup: FunnelStep[]; profile: FunnelStep[]; company: FunnelStep[] };
  retention: { window: string; cohort: number; returned: number; rate: number }[];
  aha: { behavior: string; users: number; returnRate: number }[];
  interest: { feature: string; count: number }[];
  // §7.2~7.6 — 유형/산업/FieldOps/AI/유형별 리텐션
  commonFunnel: FunnelStep[];
  funnelsByRole: { worker: FunnelStep[]; fieldLeader: FunnelStep[]; customer: FunnelStep[] };
  byIndustry: { industry: string; signups: number; workRequests: number; teams: number }[];
  fieldOps: { viewed: number; byFeature: { feature: string; interests: number; clicks: number }[] };
  aiInterest: { total: number; clicks: number; byIndustry: { industry: string; count: number }[] };
  retentionByRole: {
    role: string;
    total: number;
    windows: { window: string; cohort: number; returned: number; rate: number }[];
  }[];
}

const FEATURE_LABEL: Record<string, string> = Object.fromEntries(
  INTEREST_FEATURES.map((f) => [f.key, f.label]),
);
const INDUSTRY_LABEL: Record<string, string> = Object.fromEntries(
  INDUSTRIES.map((i) => [i.value, i.label]),
);
const FIELDOPS_LABEL: Record<string, string> = Object.fromEntries(
  FIELDOPS_FEATURES.map((f) => [f.key, f.label]),
);
const ROLE_LABEL: Record<string, string> = {
  WORKER: "기술자",
  FIELD_LEADER: "현장리더",
  CUSTOMER: "작업요청자",
  PROJECT_OPERATOR: "운영자",
  PERFORMER_COMPANY: "수행기업",
};
// 칩(AI 산업 분포) — 전용 클래스 없어 인라인. ponytail: 기존 토큰 색 재사용.
const chipStyle: React.CSSProperties = {
  display: "inline-flex",
  gap: 6,
  alignItems: "center",
  padding: "5px 11px",
  borderRadius: 999,
  background: "#eef2f7",
  fontSize: 12.5,
  fontWeight: 600,
  color: "#374151",
};

function Funnel({ title, steps }: { title: string; steps: FunnelStep[] }) {
  const max = Math.max(1, ...steps.map((s) => s.count));
  const first = steps[0]?.count ?? 0;
  return (
    <div className={styles.panel}>
      <div className={styles.panelTitle}>{title}</div>
      {steps.map((s, i) => {
        const conv = first > 0 ? Math.round((s.count / first) * 100) : null;
        return (
          <div className={styles.funnelRow} key={i}>
            <span className={styles.funnelLabel}>{s.label}</span>
            <span className={styles.funnelTrack}>
              <span className={styles.funnelFill} style={{ width: `${(s.count / max) * 100}%` }} />
            </span>
            <span className={styles.funnelMeta}>
              <b>{s.count.toLocaleString()}</b>
              {conv !== null ? ` · ${conv}%` : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function AnalysClient() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics/summary", { cache: "no-store" });
      if (!res.ok) return;
      setData((await res.json()) as Summary);
    } catch {
      /* best-effort */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const interestMax = Math.max(1, ...(data?.interest ?? []).map((i) => i.count));

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.brandDot} />
          MONO 마케팅 분석
        </div>
        <span className={styles.brandSub}>퍼널 · 리텐션 · 행동 검증</span>
        <span className={styles.spacer} />
        <button className={styles.refresh} onClick={load} disabled={loading}>
          {loading ? "불러오는 중…" : "새로고침"}
        </button>
      </header>

      <main className={styles.container}>
        {!data ? (
          <div className={styles.loading}>{loading ? "집계를 불러오는 중…" : "데이터를 불러오지 못했습니다."}</div>
        ) : (
          <>
            <div className={styles.sectionTitle}>개요</div>
            <div className={styles.grid}>
              <div className={styles.card}>
                <div className={styles.cardLabel}>방문(page_view)</div>
                <div className={styles.cardValue}>{data.overview.visitors.toLocaleString()}</div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardLabel}>가입 완료</div>
                <div className={styles.cardValue}>{data.overview.signups.toLocaleString()}</div>
              </div>
              <div className={`${styles.card} ${styles.cardAccent}`}>
                <div className={styles.cardLabel}>프로필 완성</div>
                <div className={styles.cardValue}>{data.overview.profilesCompleted.toLocaleString()}</div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardLabel}>관심 신청</div>
                <div className={styles.cardValue}>{data.overview.interests.toLocaleString()}</div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardLabel}>기업 신청</div>
                <div className={styles.cardValue}>{data.overview.companies.toLocaleString()}</div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardLabel}>채용 공고</div>
                <div className={styles.cardValue}>{data.overview.jobPosts.toLocaleString()}</div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardLabel}>관심 기술자 저장</div>
                <div className={styles.cardValue}>{data.overview.workersSaved.toLocaleString()}</div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardLabel}>PoC 신청</div>
                <div className={styles.cardValue}>{data.overview.pocInterest.toLocaleString()}</div>
              </div>
            </div>

            <div className={styles.sectionTitle}>퍼널</div>
            <div className={styles.cols}>
              <Funnel title="가입 퍼널" steps={data.funnels.signup} />
              <Funnel title="프로필 퍼널" steps={data.funnels.profile} />
              <Funnel title="기업 퍼널" steps={data.funnels.company} />
            </div>

            <div className={styles.sectionTitle}>리텐션 · Aha Moment</div>
            <div className={styles.cols}>
              <div className={styles.panel}>
                <div className={styles.panelTitle}>리텐션 (가입 코호트 기준)</div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>경과</th>
                      <th>코호트</th>
                      <th>재방문</th>
                      <th>재방문율</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.retention.map((r) => (
                      <tr key={r.window}>
                        <td>{r.window}</td>
                        <td className={styles.num}>{r.cohort}</td>
                        <td className={styles.num}>{r.returned}</td>
                        <td className={styles.rate}>{r.rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.note}>가입 후 해당 기간이 지난 사용자(코호트) 중 그 시점 이후 재방문한 비율. 데이터가 쌓일수록 정확해집니다.</div>
              </div>

              <div className={styles.panel}>
                <div className={styles.panelTitle}>Aha Moment 후보 (행동별 재방문율)</div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>행동</th>
                      <th>실행 사용자</th>
                      <th>재방문율</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.aha.map((a) => (
                      <tr key={a.behavior}>
                        <td>{a.behavior}</td>
                        <td className={styles.num}>{a.users}</td>
                        <td className={styles.rate}>{a.returnRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.note}>각 행동을 한 사용자의 재방문율 — 높을수록 Aha Moment 후보.</div>
              </div>
            </div>

            <div className={styles.sectionTitle}>관심 기능 수요</div>
            <div className={styles.panel}>
              {data.interest.length === 0 ? (
                <div className={styles.empty}>아직 관심 신청 데이터가 없습니다.</div>
              ) : (
                data.interest.map((i) => (
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

            <div className={styles.sectionTitle}>공통 온보딩 퍼널</div>
            <div className={styles.cols}>
              <Funnel title="공통 온보딩" steps={data.commonFunnel ?? []} />
            </div>

            <div className={styles.sectionTitle}>유형별 퍼널</div>
            <div className={styles.cols}>
              <Funnel title="기술자(WORKER)" steps={data.funnelsByRole?.worker ?? []} />
              <Funnel title="현장리더" steps={data.funnelsByRole?.fieldLeader ?? []} />
              <Funnel title="작업요청자(CUSTOMER)" steps={data.funnelsByRole?.customer ?? []} />
            </div>

            <div className={styles.sectionTitle}>산업별 분해</div>
            <div className={styles.panel}>
              {(data.byIndustry ?? []).length === 0 ? (
                <div className={styles.empty}>아직 산업별 데이터가 없습니다.</div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>산업</th>
                      <th>가입</th>
                      <th>작업요청</th>
                      <th>팀</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.byIndustry.map((b) => (
                      <tr key={b.industry}>
                        <td>{INDUSTRY_LABEL[b.industry] ?? b.industry}</td>
                        <td className={styles.num}>{b.signups.toLocaleString()}</td>
                        <td className={styles.num}>{b.workRequests.toLocaleString()}</td>
                        <td className={styles.num}>{b.teams.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className={styles.sectionTitle}>FieldOps 7종 수요</div>
            <div className={styles.panel}>
              <div className={styles.panelTitle}>
                기능별 관심·클릭{" "}
                <span style={{ fontWeight: 600, color: "#8a94a6", fontSize: 12 }}>
                  · 진입 {(data.fieldOps?.viewed ?? 0).toLocaleString()}
                </span>
              </div>
              {(data.fieldOps?.byFeature ?? []).length === 0 ? (
                <div className={styles.empty}>아직 FieldOps 수요 데이터가 없습니다.</div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>기능</th>
                      <th>관심수</th>
                      <th>클릭수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.fieldOps.byFeature.map((f) => (
                      <tr key={f.feature}>
                        <td>{FIELDOPS_LABEL[f.feature] ?? f.feature}</td>
                        <td className={styles.num}>{f.interests.toLocaleString()}</td>
                        <td className={styles.num}>{f.clicks.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className={styles.sectionTitle}>AI 현장리더 관심</div>
            <div className={styles.grid}>
              <div className={`${styles.card} ${styles.cardAccent}`}>
                <div className={styles.cardLabel}>관심 등록</div>
                <div className={styles.cardValue}>{(data.aiInterest?.total ?? 0).toLocaleString()}</div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardLabel}>클릭</div>
                <div className={styles.cardValue}>{(data.aiInterest?.clicks ?? 0).toLocaleString()}</div>
              </div>
            </div>
            <div className={styles.panel} style={{ marginTop: 12 }}>
              <div className={styles.panelTitle}>산업별 분포</div>
              {(data.aiInterest?.byIndustry ?? []).length === 0 ? (
                <div className={styles.empty}>아직 산업별 관심 데이터가 없습니다.</div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {data.aiInterest.byIndustry.map((b) => (
                    <span key={b.industry} style={chipStyle}>
                      {INDUSTRY_LABEL[b.industry] ?? b.industry}
                      <b style={{ fontFamily: "var(--font-mono)", fontWeight: 500, color: "var(--brand,#4f46e5)" }}>
                        {b.count.toLocaleString()}
                      </b>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.sectionTitle}>유형별 리텐션</div>
            {(data.retentionByRole ?? []).length === 0 ? (
              <div className={styles.panel}>
                <div className={styles.empty}>아직 유형별 리텐션 데이터가 없습니다.</div>
              </div>
            ) : (
              <div className={styles.cols}>
                {data.retentionByRole.map((r) => (
                  <div className={styles.panel} key={r.role}>
                    <div className={styles.panelTitle}>
                      {ROLE_LABEL[r.role] ?? r.role}{" "}
                      <span style={{ fontWeight: 600, color: "#8a94a6", fontSize: 12 }}>
                        · n={r.total.toLocaleString()}
                      </span>
                    </div>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>경과</th>
                          <th>코호트</th>
                          <th>재방문</th>
                          <th>재방문율</th>
                        </tr>
                      </thead>
                      <tbody>
                        {r.windows.map((w) => (
                          <tr key={w.window}>
                            <td>{w.window}</td>
                            <td className={styles.num}>{w.cohort}</td>
                            <td className={styles.num}>{w.returned}</td>
                            <td className={styles.rate}>{w.rate}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
