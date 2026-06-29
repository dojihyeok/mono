"use client";

// 외국인 기술자 온보딩 콘텐츠 (dev-plan-foreign-workforce §8-2).
// 정적 안내 6개(아코디언) — 현장 실무 톤, 평이한 한국어. 실제 신고/상담은 별도 기능.
import { CSSProperties, useState } from "react";

const TEXT = "var(--app-text,#4f46e5)";
const SUB = "#5b6b82";
const FAINT = "#8694a8";
const BORDER = "#eef0f6";

const card: CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: 16,
  border: `1px solid ${BORDER}`,
  marginBottom: 12,
};

const GUIDES: { title: string; body: string }[] = [
  {
    title: "한국 현장 문화",
    body: "한국 현장은 출근 시간을 매우 중요하게 생각해요. 보통 작업 시작 10~15분 전에 도착해 준비합니다. 모르는 작업은 혼자 추측하지 말고 반장이나 동료에게 바로 물어보세요. 먼저 인사하고 안전 상태를 확인하면 신뢰를 빠르게 얻을 수 있어요.",
  },
  {
    title: "안전교육 핵심",
    body: "현장에 들어가기 전 기초안전보건교육 이수가 필요해요. 안전모·안전화·안전벨트 같은 보호구는 항상 착용합니다. 위험해 보이는 작업은 멈추고 반장에게 알리세요. 사고가 나면 숨기지 말고 즉시 보고하는 것이 가장 중요해요.",
  },
  {
    title: "임금·계약 기본",
    body: "일을 시작하기 전 근로계약서를 받아 시급·근무시간·지급일을 꼭 확인하세요. 한국은 최저임금이 법으로 정해져 있고, 연장·야간·휴일 근로에는 추가 수당이 붙어요. 급여명세서와 출근 기록은 직접 보관해 두면 나중에 큰 도움이 됩니다.",
  },
  {
    title: "숙소·식사·교통",
    body: "숙소·식사·교통이 제공되는지, 비용을 본인이 내는지 계약할 때 확인하세요. 숙소비나 식비를 임금에서 빼는 경우 금액과 기준을 미리 알아두는 게 좋아요. 현장까지 가는 방법과 걸리는 시간도 첫 출근 전에 확인해 두세요.",
  },
  {
    title: "신고·상담 안내",
    body: "임금을 제때 못 받거나(임금체불) 일하다 다쳤을 때(산업재해)는 신고하고 도움을 받을 수 있어요. 이는 외국인 기술자에게도 똑같이 보장되는 권리예요. 혼자 해결하기 어려우면 MONO의 행정·노무 파트너 연계나 외국인 상담 창구의 도움을 받으세요. 실제 신고 접수는 별도 기능에서 진행돼요.",
  },
  {
    title: "한국어 현장 용어 학습",
    body: "현장에서 자주 쓰는 공구·작업·안전 용어를 미리 익혀 두면 소통이 훨씬 쉬워져요. '용어' 탭에서 산업별 용어팩을 모국어 뜻과 함께 확인할 수 있어요. 자주 듣는 단어부터 외우고, 못 알아들으면 다시 한 번 천천히 말해 달라고 요청하세요.",
  },
];

export default function ForeignOnboardingGuide() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "4px 0" }}>
      <div style={card}>
        <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800, color: TEXT }}>
          한국 현장 적응 가이드
        </h2>
        <p style={{ margin: 0, fontSize: 12.5, color: FAINT, lineHeight: 1.5 }}>
          처음 한국 현장에서 일하는 기술자를 위한 기본 안내예요. 항목을 눌러 자세히 확인하세요.
        </p>
      </div>

      {GUIDES.map((g, i) => {
        const expanded = open === i;
        return (
          <div key={g.title} style={card}>
            <button
              type="button"
              aria-expanded={expanded}
              aria-label={g.title}
              onClick={() => setOpen(expanded ? null : i)}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 14.5, fontWeight: 800, color: TEXT }}>{g.title}</span>
              <span style={{ color: FAINT, fontSize: 12, flex: "0 0 auto" }} aria-hidden>
                {expanded ? "▲" : "▼"}
              </span>
            </button>
            {expanded && (
              <p style={{ margin: "12px 0 0", fontSize: 13, color: SUB, lineHeight: 1.7 }}>{g.body}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
