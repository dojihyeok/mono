"use client";

// 외국인 기술인력 기능 하단 안내 멘트 (법무 경계 — dev-plan-foreign-workforce §0).
// 각 기능 화면 하단에 배치. MONO는 비자 발급·직업소개·고용계약을 대행하지 않으며
// 정보 구조화·상태 관리·전문 파트너 연계만 한다는 점을 사용자에게 고지.
import { CSSProperties } from "react";

export type ForeignNoticeKind =
  | "visa"
  | "match"
  | "settlement"
  | "glossary"
  | "partner"
  | "profile"
  | "general";

const NOTES: Record<ForeignNoticeKind, string> = {
  visa: "MONO는 비자 발급을 보장하지 않습니다. 체류·비자 관련 공식 행정 절차는 전문 파트너(행정사·노무사) 연계를 통해 진행되며, 이 화면은 필요한 정보를 누락 없이 준비·관리하기 위한 기능입니다.",
  match:
    "MONO는 정보 제공 플랫폼이며 직업소개·근로자파견 서비스가 아닙니다. 실제 채용·고용계약은 기업과 기술자 간 직접 진행되며, 법률·노무 검토가 필요한 부분은 전문 파트너를 연계합니다.",
  settlement:
    "표시되는 받을 금액 내역은 확인을 돕기 위한 참고용입니다. 실제 임금 지급·세무·노무 처리는 당사자와 세무·노무 전문 파트너의 책임 하에 진행됩니다.",
  glossary:
    "번역은 현장 의사소통을 돕기 위한 보조 기능입니다. 안전·계약 등 법적 효력이 필요한 사항은 반드시 공식 준비 서류와 정식 통역을 따르세요.",
  partner:
    "전문 파트너(행정사·노무사·세무사 등) 연계 신청 기능입니다. MONO는 절차를 직접 대행하지 않고, 신청 내용을 검토해 적합한 파트너를 안내합니다.",
  profile:
    "입력하신 정보는 기업 검토와 현장 적응 지원을 위해 사용됩니다. 여권·외국인등록증 등 민감 정보는 안전하게 관리되며 외부에 공개되지 않습니다.",
  general:
    "MONO 외국인 기술인력 관리는 모집·정보 구조화·상태 관리·전문 파트너 연계를 지원하는 플랫폼이며, 고용허가제 등 공식 행정 절차를 대체하지 않습니다.",
};

const wrap: CSSProperties = {
  marginTop: 14,
  padding: "10px 12px",
  borderRadius: 10,
  background: "var(--aSoft, #ecedfb)",
  border: "1px solid color-mix(in srgb, var(--brand,#4f46e5) 14%, transparent)",
  display: "flex",
  gap: 8,
  alignItems: "flex-start",
};
const icon: CSSProperties = { flex: "0 0 auto", marginTop: 1, fontSize: 13 };
const text: CSSProperties = {
  fontSize: 11.5,
  lineHeight: 1.55,
  color: "var(--app-text, #4f46e5)",
  opacity: 0.85,
  margin: 0,
};

export default function ForeignNotice({
  kind = "general",
  style,
}: {
  kind?: ForeignNoticeKind;
  style?: CSSProperties;
}) {
  return (
    <div style={{ ...wrap, ...style }} role="note" aria-label="안내">
      <span style={icon} aria-hidden>
        ⓘ
      </span>
      <p style={text}>{NOTES[kind]}</p>
    </div>
  );
}
