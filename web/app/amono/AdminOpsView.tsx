"use client";

// 관리자 — 운영·관심 (dev-plan §6.5 운영자 관리 · §6.6 FieldOps·AI 관심 관리).
// 서브탭: 운영자 · 수행기업 · FieldOps 관심 · AI 관심. (자체 fetch, ForeignAdminView 패턴 복제)
import { useEffect, useState } from "react";
import styles from "./admin.module.css";
import { FIELDOPS_FEATURES, INDUSTRIES } from "@/lib/constants";
import { getJson } from "@/lib/apiClient";

type Sub = "operators" | "performers" | "fieldops" | "ai";

const featureLabel = (k: string) => FIELDOPS_FEATURES.find((f) => f.key === k)?.label ?? k;
const industryLabel = (v: string) => INDUSTRIES.find((i) => i.value === v)?.label ?? v;
// safetyRate/rehireRate 는 0~1 실수 → %.
const pct = (x?: number | null) => (x == null ? "—" : `${Math.round(x * 100)}%`);

interface Operator {
  id: string;
  industries: string[];
  regions: string[];
  budgetRangeMemo?: string | null;
  user?: { name?: string | null } | null;
  company?: { name?: string | null } | null;
}
interface Performer {
  id: string;
  name: string;
  industries: string[];
  region: string[];
  safetyRate?: number | null;
  rehireRate?: number | null;
  _count?: { workRecords: number } | null;
}
interface FieldOpsData {
  byFeature: { feature: string; count: number }[];
  recent: { id: string; feature: string; createdAt: string; user?: { name?: string | null } | null }[];
}
interface AiData {
  items: { id: string; industry: string; createdAt: string; user?: { name?: string | null } | null }[];
  byIndustry: { industry: string; count: number }[];
}

const SUBS: { k: Sub; t: string }[] = [
  { k: "operators", t: "운영자" },
  { k: "performers", t: "수행기업" },
  { k: "fieldops", t: "FieldOps 관심" },
  { k: "ai", t: "AI 관심" },
];

export default function AdminOpsView() {
  const [sub, setSub] = useState<Sub>("operators");
  const [operators, setOperators] = useState<Operator[] | null>(null);
  const [performers, setPerformers] = useState<Performer[] | null>(null);
  const [fieldops, setFieldops] = useState<FieldOpsData | null>(null);
  const [ai, setAi] = useState<AiData | null>(null);

  useEffect(() => {
    if (sub === "operators" && operators === null)
      void getJson<Operator[]>("/api/admin/operators", []).then(setOperators);
    if (sub === "performers" && performers === null)
      void getJson<Performer[]>("/api/performers", []).then(setPerformers);
    if (sub === "fieldops" && fieldops === null)
      void getJson<FieldOpsData>("/api/admin/fieldops-interests", { byFeature: [], recent: [] }).then(setFieldops);
    if (sub === "ai" && ai === null)
      void getJson<AiData>("/api/admin/ai-interests", { items: [], byIndustry: [] }).then(setAi);
  }, [sub, operators, performers, fieldops, ai]);

  return (
    <div>
      <div className={styles.sectionTitle}>운영·관심 관리</div>
      <div className={styles.chips} style={{ marginBottom: 16 }}>
        {SUBS.map((x) => (
          <button
            key={x.k}
            className={sub === x.k ? styles.filterChipActive : styles.filterChip}
            onClick={() => setSub(x.k)}
            aria-pressed={sub === x.k}
            aria-label={x.t}
          >
            {x.t}
          </button>
        ))}
      </div>

      {/* 운영자(ProjectOperator) */}
      {sub === "operators" &&
        (operators === null ? (
          <div className={styles.loading}>불러오는 중…</div>
        ) : operators.length === 0 ? (
          <div className={styles.empty}>등록된 운영자가 없습니다.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>운영자</th>
                  <th>소속기업</th>
                  <th>산업</th>
                  <th>지역</th>
                  <th>예산 메모</th>
                </tr>
              </thead>
              <tbody>
                {operators.map((o) => (
                  <tr key={o.id}>
                    <td>{o.user?.name ?? "—"}</td>
                    <td>{o.company?.name ?? "—"}</td>
                    <td>
                      <div className={styles.chips}>
                        {o.industries.length
                          ? o.industries.map((i) => (
                              <span key={i} className={styles.chip}>
                                {industryLabel(i)}
                              </span>
                            ))
                          : "—"}
                      </div>
                    </td>
                    <td>
                      <div className={styles.chips}>
                        {o.regions.length
                          ? o.regions.map((r) => (
                              <span key={r} className={styles.chip}>
                                {r}
                              </span>
                            ))
                          : "—"}
                      </div>
                    </td>
                    <td>{o.budgetRangeMemo ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {/* 수행기업(Company.PERFORMER) */}
      {sub === "performers" &&
        (performers === null ? (
          <div className={styles.loading}>불러오는 중…</div>
        ) : performers.length === 0 ? (
          <div className={styles.empty}>등록된 수행기업이 없습니다.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>수행기업</th>
                  <th>산업</th>
                  <th>지역</th>
                  <th>안전율</th>
                  <th>재고용율</th>
                  <th>작업사례</th>
                </tr>
              </thead>
              <tbody>
                {performers.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700 }}>{p.name}</td>
                    <td>
                      <div className={styles.chips}>
                        {p.industries.length
                          ? p.industries.map((i) => (
                              <span key={i} className={styles.chip}>
                                {industryLabel(i)}
                              </span>
                            ))
                          : "—"}
                      </div>
                    </td>
                    <td>
                      <div className={styles.chips}>
                        {p.region.length
                          ? p.region.map((r) => (
                              <span key={r} className={styles.chip}>
                                {r}
                              </span>
                            ))
                          : "—"}
                      </div>
                    </td>
                    <td>{pct(p.safetyRate)}</td>
                    <td>{pct(p.rehireRate)}</td>
                    <td>{p._count?.workRecords ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {/* FieldOps 관심 — 기능별 분포 + 최근 리드 */}
      {sub === "fieldops" &&
        (fieldops === null ? (
          <div className={styles.loading}>불러오는 중…</div>
        ) : (
          <div>
            <div className={styles.sectionTitle}>기능별 관심</div>
            {fieldops.byFeature.length === 0 ? (
              <div className={styles.empty}>아직 데이터가 없습니다.</div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>기능</th>
                      <th>관심 수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fieldops.byFeature.map((f) => (
                      <tr key={f.feature}>
                        <td>{featureLabel(f.feature)}</td>
                        <td>{f.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className={styles.sectionTitle} style={{ marginTop: 20 }}>
              최근 관심 리드
            </div>
            {fieldops.recent.length === 0 ? (
              <div className={styles.empty}>최근 리드가 없습니다.</div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>요청자</th>
                      <th>기능</th>
                      <th>일자</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fieldops.recent.map((r) => (
                      <tr key={r.id}>
                        <td>{r.user?.name ?? "—"}</td>
                        <td>{featureLabel(r.feature)}</td>
                        <td>{r.createdAt.slice(0, 10)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

      {/* AI 현장리더 관심 — 산업별 분포 + 리드 */}
      {sub === "ai" &&
        (ai === null ? (
          <div className={styles.loading}>불러오는 중…</div>
        ) : (
          <div>
            <div className={styles.sectionTitle}>산업별 분포</div>
            <div className={styles.chips}>
              {ai.byIndustry.length === 0 ? (
                <span className={styles.empty}>없음</span>
              ) : (
                ai.byIndustry.map((b) => (
                  <span key={b.industry} className={styles.chip}>
                    {industryLabel(b.industry)} · {b.count}
                  </span>
                ))
              )}
            </div>

            <div className={styles.sectionTitle} style={{ marginTop: 20 }}>
              관심 등록
            </div>
            {ai.items.length === 0 ? (
              <div className={styles.empty}>아직 관심 등록이 없습니다.</div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>요청자</th>
                      <th>산업</th>
                      <th>일자</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ai.items.map((it) => (
                      <tr key={it.id}>
                        <td>{it.user?.name ?? "—"}</td>
                        <td>{industryLabel(it.industry)}</td>
                        <td>{it.createdAt.slice(0, 10)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
