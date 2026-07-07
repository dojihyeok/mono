"use client";

// 관리자 — 외국인 인력 운영 (dev-plan-foreign-workforce §6·§8-4).
// 서브탭: 체류 만료 큐 · 서류 검토 큐 · 리스크 신고 · 투입 리포트.
import { useEffect, useState } from "react";
import styles from "./admin.module.css";
import { apiListRiskReports, apiSetRiskStatus, getJson, apiListAdminReferrals, apiSetReferralStatus } from "@/lib/apiClient";
import {
  VISA_TYPES,
  DOCUMENT_KINDS,
  VISA_DOC_STATUS_LABEL,
  RISK_REPORT_KINDS,
} from "@/lib/constants";
import ForeignNotice from "../mono/ForeignNotice";

type Sub = "visas" | "documents" | "risk" | "report" | "referrals";

interface AdminReferral {
  id: string;
  userId: string;
  kind: string;
  status: string;
  createdAt: string;
  user?: { id: string; name?: string | null; phone?: string | null } | null;
}

const REFERRAL_KIND_LABEL: Record<string, string> = {
  VISA: "비자 연장·행정 대행",
  LABOR: "임금 체불·노무 상담",
  SETTLEMENT: "정산 분쟁 해결",
  EDUCATION: "현장 안전·교육 지원",
  INSURANCE: "보증·재해 보험 연계",
};

const REFERRAL_STATUS_LABEL: Record<string, string> = {
  PENDING: "접수",
  MATCHING: "연계중",
  COMPLETED: "연계완료",
};

const REFERRAL_STATUSES = ["PENDING", "MATCHING", "COMPLETED"] as const;

const visaLabel = (v: string) => VISA_TYPES.find((x) => x.value === v)?.label ?? v;
const docLabel = (v: string) => DOCUMENT_KINDS.find((x) => x.value === v)?.label ?? v;
const riskLabel = (v: string) => RISK_REPORT_KINDS.find((x) => x.value === v)?.label ?? v;

const RISK_STATUSES = ["OPEN", "IN_REVIEW", "RESOLVED", "DISMISSED"] as const;
const RISK_STATUS_LABEL: Record<string, string> = {
  OPEN: "접수",
  IN_REVIEW: "검토중",
  RESOLVED: "처리완료",
  DISMISSED: "기각",
};

// 만료까지 남은 일수
function dday(date?: string | null): number | null {
  if (!date) return null;
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
}

interface ExpiringVisa {
  id: string;
  visaType: string;
  expiryDate?: string | null;
  status: string;
  user?: { id: string; name?: string | null; phone?: string | null } | null;
}
interface PendingDoc {
  id: string;
  kind: string;
  status: string;
  fileUrl: string;
  createdAt: string;
  user?: { id: string; name?: string | null } | null;
}
interface RiskRow {
  id: string;
  kind: string;
  status: string;
  detail?: string | null;
  subjectId?: string | null;
  createdAt: string;
}
interface ForeignReport {
  generatedAt: string;
  foreignWorkers: number;
  byVisaType: { visaType: string; count: number }[];
  byKoreanLevel: { koreanLevel: string | null; count: number }[];
  byIndustry: { industry: string; workers: number }[];
  totals: { settlements: number; referrals: number; riskReports: number; trainings: number };
}

export default function ForeignAdminView() {
  const [sub, setSub] = useState<Sub>("visas");
  const [visas, setVisas] = useState<ExpiringVisa[] | null>(null);
  const [docs, setDocs] = useState<PendingDoc[] | null>(null);
  const [risks, setRisks] = useState<RiskRow[] | null>(null);
  const [report, setReport] = useState<ForeignReport | null>(null);
  const [referrals, setReferrals] = useState<AdminReferral[] | null>(null);

  useEffect(() => {
    if (sub === "visas" && visas === null)
      void getJson<ExpiringVisa[]>("/api/admin/expiring-visas?days=30", []).then(setVisas);
    if (sub === "documents" && docs === null)
      void getJson<PendingDoc[]>("/api/admin/pending-documents", []).then(setDocs);
    if (sub === "risk" && risks === null)
      void apiListRiskReports().then((r) => setRisks(r as RiskRow[]));
    if (sub === "report" && report === null)
      void getJson<ForeignReport | null>("/api/admin/foreign-report", null).then(setReport);
    if (sub === "referrals" && referrals === null)
      void apiListAdminReferrals().then((r) => setReferrals(r as AdminReferral[]));
  }, [sub, visas, docs, risks, report, referrals]);

  async function changeRisk(id: string, status: string) {
    await apiSetRiskStatus(id, status);
    setRisks((prev) => prev?.map((r) => (r.id === id ? { ...r, status } : r)) ?? prev);
  }

  async function changeReferralStatus(id: string, status: string) {
    await apiSetReferralStatus(id, status);
    setReferrals((prev) => prev?.map((r) => (r.id === id ? { ...r, status } : r)) ?? prev);
  }

  return (
    <div>
      <div className={styles.sectionTitle}>외국인 인력 운영</div>
      <div className={styles.chips} style={{ marginBottom: 16 }}>
        {(
          [
            { k: "visas", t: "체류 만료" },
            { k: "documents", t: "서류 검토" },
            { k: "risk", t: "리스크 신고" },
            { k: "referrals", t: "파트너 연계" },
            { k: "report", t: "투입 리포트" },
          ] as { k: Sub; t: string }[]
        ).map((x) => (
          <button
            key={x.k}
            className={sub === x.k ? styles.filterChipActive : styles.filterChip}
            onClick={() => setSub(x.k)}
            aria-pressed={sub === x.k}
          >
            {x.t}
          </button>
        ))}
      </div>

      {/* 체류 만료 큐 */}
      {sub === "visas" &&
        (visas === null ? (
          <div className={styles.loading}>불러오는 중…</div>
        ) : visas.length === 0 ? (
          <div className={styles.empty}>30일 이내 만료 예정 비자가 없습니다.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>기술자</th>
                  <th>체류자격</th>
                  <th>만료일</th>
                  <th>D-day</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {visas.map((v) => {
                  const d = dday(v.expiryDate);
                  return (
                    <tr key={v.id}>
                      <td>{v.user?.name ?? "—"}</td>
                      <td>{visaLabel(v.visaType)}</td>
                      <td>{v.expiryDate ? v.expiryDate.slice(0, 10) : "—"}</td>
                      <td style={{ color: d != null && d <= 7 ? "#dc2626" : undefined, fontWeight: 600 }}>
                        {d == null ? "—" : d < 0 ? `만료 ${-d}일 경과` : `D-${d}`}
                      </td>
                      <td>{VISA_DOC_STATUS_LABEL[v.status] ?? v.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}

      {/* 서류 검토 큐 */}
      {sub === "documents" &&
        (docs === null ? (
          <div className={styles.loading}>불러오는 중…</div>
        ) : docs.length === 0 ? (
          <div className={styles.empty}>검토 대기 중인 서류가 없습니다.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>기술자</th>
                  <th>서류</th>
                  <th>상태</th>
                  <th>제출일</th>
                  <th>파일</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id}>
                    <td>{d.user?.name ?? "—"}</td>
                    <td>{docLabel(d.kind)}</td>
                    <td>{VISA_DOC_STATUS_LABEL[d.status] ?? d.status}</td>
                    <td>{d.createdAt.slice(0, 10)}</td>
                    <td>
                      <a href={d.fileUrl} target="_blank" rel="noreferrer" style={{ color: "var(--c1,#504968)" }}>
                        열기
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {/* 리스크 신고 */}
      {sub === "risk" &&
        (risks === null ? (
          <div className={styles.loading}>불러오는 중…</div>
        ) : risks.length === 0 ? (
          <div className={styles.empty}>접수된 신고가 없습니다.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>유형</th>
                  <th>내용</th>
                  <th>접수일</th>
                  <th>처리</th>
                </tr>
              </thead>
              <tbody>
                {risks.map((r) => (
                  <tr key={r.id}>
                    <td>{riskLabel(r.kind)}</td>
                    <td>{r.detail ?? "—"}</td>
                    <td>{r.createdAt.slice(0, 10)}</td>
                    <td>
                      <select
                        value={r.status}
                        onChange={(e) => void changeRisk(r.id, e.target.value)}
                        aria-label="신고 처리 상태"
                      >
                        {RISK_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {RISK_STATUS_LABEL[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {/* 투입 리포트 */}
      {sub === "report" &&
        (report === null ? (
          <div className={styles.loading}>집계를 불러오는 중…</div>
        ) : (
          <div>
            <div className={styles.grid}>
              <Stat label="외국인 기술자" value={report.foreignWorkers} />
              <Stat label="정산 건" value={report.totals.settlements} />
              <Stat label="파트너 연계" value={report.totals.referrals} />
              <Stat label="리스크 신고" value={report.totals.riskReports} />
              <Stat label="교육 이수" value={report.totals.trainings} />
            </div>

            <div className={styles.sectionTitle} style={{ marginTop: 20 }}>
              산업별 외국인 투입
            </div>
            {report.byIndustry.length === 0 ? (
              <div className={styles.empty}>아직 데이터가 없습니다.</div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>산업</th>
                      <th>외국인 기술자 수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.byIndustry.map((r) => (
                      <tr key={r.industry}>
                        <td>{r.industry}</td>
                        <td>{r.workers}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className={styles.sectionTitle} style={{ marginTop: 20 }}>
              체류자격 분포
            </div>
            <div className={styles.chips}>
              {report.byVisaType.length === 0 ? (
                <span className={styles.empty}>없음</span>
              ) : (
                report.byVisaType.map((v) => (
                  <span key={v.visaType} className={styles.chip}>
                    {visaLabel(v.visaType)} · {v.count}
                  </span>
                ))
              )}
            </div>

            <div className={styles.sectionTitle} style={{ marginTop: 20 }}>
              한국어 수준 분포
            </div>
            <div className={styles.chips}>
              {report.byKoreanLevel.length === 0 ? (
                <span className={styles.empty}>없음</span>
              ) : (
                report.byKoreanLevel.map((k) => (
                  <span key={k.koreanLevel ?? "none"} className={styles.chip}>
                    {k.koreanLevel ?? "미등록"} · {k.count}
                  </span>
                ))
              )}
            </div>
          </div>
        ))}

      {/* 파트너 연계 신청 관리 큐 */}
      {sub === "referrals" &&
        (referrals === null ? (
          <div className={styles.loading}>불러오는 중…</div>
        ) : referrals.length === 0 ? (
          <div className={styles.empty}>접수된 파트너 연계 신청이 없습니다.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>기술자</th>
                  <th>연락처</th>
                  <th>신청 분야</th>
                  <th>신청일</th>
                  <th>연계 상태</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((ref) => (
                  <tr key={ref.id}>
                    <td>{ref.user?.name ?? "—"}</td>
                    <td style={{ fontFamily: "monospace" }}>{ref.user?.phone ?? "—"}</td>
                    <td style={{ fontWeight: 700 }}>{REFERRAL_KIND_LABEL[ref.kind] ?? ref.kind}</td>
                    <td>{ref.createdAt.slice(0, 10)}</td>
                    <td>
                      <select
                        value={ref.status}
                        onChange={(e) => void changeReferralStatus(ref.id, e.target.value)}
                        aria-label="파트너 연계 상태"
                      >
                        {REFERRAL_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {REFERRAL_STATUS_LABEL[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      <ForeignNotice kind="general" />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardLabel}>{label}</div>
      <div className={styles.cardValue}>{value.toLocaleString()}</div>
    </div>
  );
}
