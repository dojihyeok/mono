"use client";

// 현장 용어 번역 (dev-plan-foreign-workforce §4) — 외국인 기술자 현장 의사소통 보조.
// 언어/산업/카테고리 필터 + 검색, 음성 읽기(ko-KR), 오프라인 캐시(통신 약한 현장 대비).
import { CSSProperties, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { apiGetGlossary, apiGetGlossaryPack } from "@/lib/apiClient";
import { LANGUAGES, INDUSTRIES, GLOSSARY_CATEGORIES } from "@/lib/constants";
import type { GlossaryTerm } from "@/lib/types";

// ── 디자인 토큰(인라인) ──
const C1 = "var(--c1,#4f46e5)";
const SOFT = "var(--aSoft,#ecedfb)";
const TEXT = "var(--app-text,#4f46e5)";
const SUB = "#5b6b82";
const FAINT = "#8694a8";
const BORDER = "#eef0f6";

const wrap: CSSProperties = { maxWidth: 480, margin: "0 auto", padding: "4px 0" };
const card: CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: 16,
  border: `1px solid ${BORDER}`,
  marginBottom: 12,
};
const pillRow: CSSProperties = { display: "flex", flexWrap: "wrap", gap: 8 };
const label: CSSProperties = { fontSize: 12.5, fontWeight: 700, color: SUB, marginBottom: 8, display: "block" };

function pill(active: boolean): CSSProperties {
  return {
    padding: "9px 14px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    background: active ? C1 : SOFT,
    color: active ? "#fff" : TEXT,
    lineHeight: 1.2,
  };
}

const catLabel = (v: string) => GLOSSARY_CATEGORIES.find((c) => c.value === v)?.label ?? v;

export default function GlossaryView() {
  const [lang, setLang] = useState<string>("EN");
  const [industry, setIndustry] = useState<string>(""); // "" = 전체
  const [category, setCategory] = useState<string>(""); // "" = 전체
  const [query, setQuery] = useState<string>("");
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [savedMsg, setSavedMsg] = useState<string>("");
  const firstLoad = useRef(true);

  // 진입 시(마운트) 산업별 용어팩 열람 이벤트.
  useEffect(() => {
    track("glossary_pack_opened", { surface: "glossary_view", industry: industry || "all" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cacheKey = `mono.glossary.${industry || "all"}.${lang}`;

  // 언어/산업/카테고리 변경 시 재로드. 결과가 비고 캐시 있으면 캐시 사용.
  useEffect(() => {
    let alive = true;
    setLoading(true);
    const loader = industry
      ? apiGetGlossaryPack(industry, lang)
      : apiGetGlossary({ lang, category: category || undefined });
    void loader.then((list) => {
      if (!alive) return;
      let result = list ?? [];
      if (result.length === 0) {
        try {
          const cached = window.localStorage.getItem(cacheKey);
          if (cached) result = JSON.parse(cached) as GlossaryTerm[];
        } catch {
          // 캐시 파싱 실패 무시
        }
      }
      setTerms(result);
      setLoading(false);
      if (firstLoad.current) {
        firstLoad.current = false;
        track("glossary_term_viewed", { surface: "glossary_view", count: result.length });
      }
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, industry, category]);

  const pickIndustry = (v: string) => {
    setIndustry(v);
    if (v) track("glossary_pack_opened", { surface: "glossary_view", industry: v });
  };

  const toggle = (t: GlossaryTerm) => {
    setExpanded((m) => ({ ...m, [t.id]: !m[t.id] }));
    track("field_term_translated", { termId: t.id, lang, koTerm: t.koTerm });
  };

  const speak = (koTerm: string) => {
    try {
      const u = new SpeechSynthesisUtterance(koTerm);
      u.lang = "ko-KR";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {
      // 음성 미지원 무시
    }
    track("voice_term_translated", { koTerm });
  };

  const saveOffline = () => {
    try {
      window.localStorage.setItem(cacheKey, JSON.stringify(terms));
      setSavedMsg("오프라인에 저장했어요");
      setTimeout(() => setSavedMsg(""), 2000);
    } catch {
      setSavedMsg("저장에 실패했어요");
      setTimeout(() => setSavedMsg(""), 2000);
    }
    track("glossary_offline_cached", { industry: industry || "all", lang, count: terms.length });
  };

  const trans = (t: GlossaryTerm) => t.translations.find((x) => x.lang === lang)?.text;

  // 검색(koTerm 부분일치) + 카테고리(팩 결과 보정) 클라이언트 필터.
  const q = query.trim();
  const filtered = terms.filter(
    (t) =>
      (!q || t.koTerm.includes(q)) &&
      (!category || t.category === category),
  );

  return (
    <div style={wrap}>
      {/* 필터 카드 */}
      <div style={card}>
        <label htmlFor="glossary-lang" style={label}>
          번역 언어
        </label>
        <div id="glossary-lang" style={pillRow} role="group" aria-label="번역 언어 선택">
          {LANGUAGES.map((l) => (
            <button
              key={l.value}
              type="button"
              aria-pressed={lang === l.value}
              aria-label={`언어 ${l.label}`}
              style={pill(lang === l.value)}
              onClick={() => setLang(l.value)}
            >
              {l.native}
            </button>
          ))}
        </div>

        <label style={{ ...label, marginTop: 14 }}>산업 (선택)</label>
        <div style={pillRow} role="group" aria-label="산업 선택">
          <button
            type="button"
            aria-pressed={industry === ""}
            aria-label="전체 산업"
            style={pill(industry === "")}
            onClick={() => pickIndustry("")}
          >
            전체
          </button>
          {INDUSTRIES.map((i) => (
            <button
              key={i.value}
              type="button"
              aria-pressed={industry === i.value}
              aria-label={`산업 ${i.label}`}
              style={pill(industry === i.value)}
              onClick={() => pickIndustry(i.value)}
            >
              {i.label}
            </button>
          ))}
        </div>

        <label style={{ ...label, marginTop: 14 }}>카테고리 (선택)</label>
        <div style={pillRow} role="group" aria-label="카테고리 선택">
          <button
            type="button"
            aria-pressed={category === ""}
            aria-label="전체 카테고리"
            style={pill(category === "")}
            onClick={() => setCategory("")}
          >
            전체
          </button>
          {GLOSSARY_CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              aria-pressed={category === c.value}
              aria-label={`카테고리 ${c.label}`}
              style={pill(category === c.value)}
              onClick={() => setCategory(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <label htmlFor="glossary-search" style={{ ...label, marginTop: 14 }}>
          용어 검색
        </label>
        <input
          id="glossary-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="한국어 용어로 검색"
          aria-label="용어 검색"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "12px 14px",
            borderRadius: 999,
            border: `1px solid ${BORDER}`,
            background: SOFT,
            fontSize: 14,
            color: TEXT,
            outline: "none",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
          <button
            type="button"
            onClick={saveOffline}
            aria-label="현재 용어 목록 오프라인 저장"
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              border: `1px solid ${C1}`,
              background: "#fff",
              color: C1,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            📥 오프라인 저장
          </button>
          {savedMsg && <span style={{ fontSize: 12.5, color: SUB }}>{savedMsg}</span>}
        </div>
      </div>

      {/* 용어 목록 */}
      {loading ? (
        <div style={{ ...card, textAlign: "center", color: FAINT }}>불러오는 중…</div>
      ) : filtered.length === 0 ? (
        <div style={{ ...card, textAlign: "center", color: SUB }}>
          <div style={{ fontSize: 26, marginBottom: 6 }}>🔎</div>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>표시할 용어가 없어요</div>
          <div style={{ fontSize: 12.5, color: FAINT }}>
            언어·산업·카테고리를 바꾸거나 검색어를 지워보세요.
          </div>
        </div>
      ) : (
        filtered.map((t) => {
          const tx = trans(t);
          const open = !!expanded[t.id];
          return (
            <div
              key={t.id}
              style={{
                ...card,
                marginBottom: 10,
                border: t.isSafety ? "1px solid #f3c6c6" : `1px solid ${BORDER}`,
                background: t.isSafety ? "#fff7f7" : "#fff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {t.iconUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.iconUrl}
                    alt=""
                    aria-hidden
                    style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover", flex: "0 0 auto" }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => toggle(t)}
                  aria-expanded={open}
                  aria-label={`용어 ${t.koTerm} 번역 ${open ? "접기" : "펼치기"}`}
                  style={{
                    flex: 1,
                    textAlign: "left",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 800, color: t.isSafety ? "#c0392b" : TEXT }}>
                    {t.koTerm}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => speak(t.koTerm)}
                  aria-label={`${t.koTerm} 음성으로 듣기`}
                  style={{
                    flex: "0 0 auto",
                    background: SOFT,
                    border: "none",
                    borderRadius: 999,
                    width: 36,
                    height: 36,
                    cursor: "pointer",
                    fontSize: 15,
                  }}
                >
                  🔊
                </button>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: C1,
                    background: SOFT,
                    borderRadius: 999,
                    padding: "3px 9px",
                  }}
                >
                  {catLabel(t.category)}
                </span>
                {t.isSafety && (
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 800,
                      color: "#fff",
                      background: "#c0392b",
                      borderRadius: 999,
                      padding: "3px 9px",
                    }}
                  >
                    ⚠ 안전
                  </span>
                )}
              </div>

              {open && (
                <div
                  style={{
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: `1px dashed ${BORDER}`,
                    fontSize: 15,
                    fontWeight: 600,
                    color: tx ? TEXT : FAINT,
                  }}
                >
                  {tx ?? "번역 준비중"}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
